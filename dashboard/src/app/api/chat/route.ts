import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getNeighbors, pool } from '@/lib/graph';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    const lastMessage = messages[messages.length - 1].content;
    
    // -------------------------------------------------------------
    // 단계 1: Gemini를 이용해 사용자 질의에서 "검색 핵심 키워드" 추출 (벡터DB 회피)
    // -------------------------------------------------------------
    const keywordPrompt = `아래 사용자의 건설 안전 관련 질문에서 가장 중요한 핵심 명사(사고 유형이나 원인 등)를 딱 1개만 추출해줘. (예: 추락, 비계, 붕괴 등)\n질문: ${lastMessage}`;
    const kwResult = await model.generateContent(keywordPrompt);
    const primaryKeyword = kwResult.response.text().replace(/[^가-힣a-zA-Z0-9]/g, '').trim() || "사고";
    
    // -------------------------------------------------------------
    // 단계 2: MySQL DB에서 키워드를 기반으로 사고 노드(Node ID) 직접 검색
    // -------------------------------------------------------------
    const [rows] = await pool.query(
        'SELECT id FROM nodes WHERE (label="Accident" OR label="RiskFactor") AND (name LIKE ? OR id LIKE ?) LIMIT 3', 
        [`%${primaryKeyword}%`, `%${primaryKeyword}%`]
    );
    
    const uniqueIds = Array.from(new Set((rows as any[]).map(r => r.id)));
    
    // -------------------------------------------------------------
    // 단계 3: 추출된 N개의 핵심 사고 ID에 대해 MySQL 지식그래프망 통신
    // -------------------------------------------------------------
    let relationContext = "";
    
    for (const id of uniqueIds) {
        // 비동기로 MySQL 질의 처리
        const neighbors = (await getNeighbors(id.toString())) as any[];
        relationContext += `\n- 관련 사고 (${id})의 지식그래프 연관 노드들:\n`;
        neighbors.forEach((nbr: any) => {
            relationContext += `  * [${nbr.label}] ${nbr.name} (관계망: ${nbr.relation_type})\n`;
            if (nbr.metadata) {
                try {
                    const meta = typeof nbr.metadata === 'string' ? JSON.parse(nbr.metadata) : nbr.metadata;
                    if (meta.cause) relationContext += `    (원인 상세: ${meta.cause})\n`;
                } catch(e) {}
            }
        });
    }

    // -------------------------------------------------------------
    // 단계 4: 제미나이 2.5 로 스트리밍 컨텍스트 병합 추론 지시
    // -------------------------------------------------------------
    const prompt = `
당신은 "Safetron AI", 건설 안전 분야를 심층 분석하는 최고의 AI 위험 분석가입니다.
사용자의 질문에 대해 아래 하이브리드 RAG(Semantic Vector + Graph) 기술로 수집된 맥락(Context)을 기반으로 정확하고 전문적으로 답변하십시오.

--- 수집된 지식그래프 맥락 ---
${relationContext}
------------------------------

사용자 질문: ${lastMessage}

[답변 규칙]
1. 반드시 한국어로 답변하되, 8~10문장 내외로 매우 핵심적이고 간결하게 작성할 것.
2. 마크다운 기호(#, ##, **, * 등)를 절대 사용하지 말 것. 단순 텍스트와 줄바꿈만 사용할 것.
3. 구구절절 인사나 서론 없이, 즉시 분석 결과와 시사점(또는 예방책)을 나열할 것.
4. 리스트 나열 시 글머리기호(-) 대신 "1)", "2)", "3)" 형태의 번호 표기를 사용할 것.
`;

    const result = await model.generateContentStream(prompt);

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          if (chunkText) {
            controller.enqueue(new TextEncoder().encode(chunkText));
          }
        }
        controller.close();
      }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        }
    });
    
  } catch (error: any) {
    console.error("Chat Error:", error);
    return NextResponse.json({ error: "AI Hybrid RAG Analysis failed. Check Vector/Graph DB setup." }, { status: 500 });
  }
}

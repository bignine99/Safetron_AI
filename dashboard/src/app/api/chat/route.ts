import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getNeighbors, searchEntities } from '@/lib/graph';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    const lastMessage = messages[messages.length - 1].content;
    
    // 1. Simple Entity Extraction (Keyword matching for now)
    // We can use Gemini to extract entities more accurately, but let's start simple.
    const keywords = lastMessage.split(" ").filter((w: string) => w.length > 1);
    
    let contextNodes: any[] = [];
    for (const kw of keywords.slice(0, 3)) {
      const found = searchEntities(kw, 2);
      contextNodes = [...contextNodes, ...found];
    }
    
    // 2. Fetch Graph Relationships
    let relationContext = "";
    const uniqueIds = Array.from(new Set(contextNodes.map(n => n.id)));
    
    for (const id of uniqueIds.slice(0, 5)) {
        const neighbors = getNeighbors(id);
        const node = contextNodes.find(n => n.id === id);
        relationContext += `\n- ${node?.name} (${node?.label}) is related to: \n`;
        neighbors.forEach((nbr: any) => {
            relationContext += `  * ${nbr.name} (${nbr.label}) via ${nbr.relation_type}\n`;
            if (nbr.metadata) {
                const meta = JSON.parse(nbr.metadata);
                if (meta.cause) relationContext += `    (Cause: ${meta.cause})\n`;
            }
        });
    }

    // 3. Construct Prompt
    const prompt = `
You are "Safetron AI", a construction safety intelligence analyst.
Base your answer on the following Knowledge Graph context:
---
${relationContext}
---
User Query: ${lastMessage}

RULES:
1. Answer in Korean, keep it CONCISE (max 8-10 sentences).
2. DO NOT use any markdown symbols: no #, ##, ###, no **, no *, no ---, no bullet lists with -.
3. Use plain text only. Use line breaks for separation.
4. Focus on KEY findings and actionable insights only.
5. If listing items, use "1)", "2)", "3)" numbering, not bullets.
6. Start directly with the answer, no greetings.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ 
        content: text,
        debug: {
            extracted_keywords: keywords,
            found_entities: uniqueIds
        }
    });
    
  } catch (error: any) {
    console.error("Chat Error:", error);
    return NextResponse.json({ error: "AI Analysis failed. Check if GEMINI_API_KEY is configured." }, { status: 500 });
  }
}

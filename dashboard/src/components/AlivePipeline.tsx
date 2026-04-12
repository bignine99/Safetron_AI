'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Database, Cpu, FileText, RefreshCw, Binary, HardDrive, Zap, ClipboardEdit, Search, Brain, Users, BarChart3, ChevronRight, X } from 'lucide-react';

const ICONS: Record<string, React.ElementType> = {
  database: Database,
  cpu: Cpu,
  fileText: FileText,
  refreshCw: RefreshCw,
  binary: Binary,
  hardDrive: HardDrive,
  zap: Zap,
  clipboardEdit: ClipboardEdit,
  search: Search,
  brain: Brain,
  users: Users,
  barChart3: BarChart3,
};

const STEPS = [
  { id:1,  title:'DATA SOURCE',              type:'EXCLUSIVE', glow:'yellow', icon:'database',     titleKo:null,  shortDesc:'CUBE 온톨로지 기반 6차원 데이터 구조', overview:'건설 프로젝트의 모든 데이터를 5W1H CUBE 온톨로지 체계로 구조화합니다. 비정형 데이터를 AI가 이해 가능한 형태로 변환하는 첫 단계입니다.', features:['5W1H 6차원 CUBE 데이터 구조','공문서 / 보고서 / 도면 등 다차원 소스 통합','JSONL 기반 구조화 데이터 파이프라인','프로젝트별 맞춤 데이터 스키마'], tech:['JSONL','Python','Pandas'] },
  { id:2,  title:'DATA CUSTOMIZATION',       type:'EXCLUSIVE', glow:'yellow', icon:'cpu',           titleKo:null,  shortDesc:'프로젝트별 맞춤 데이터 가공 엔진', overview:'원시 데이터를 프로젝트에 맞게 커스터마이징합니다. 건설 도메인 특화 전처리와 품질 검증을 자동으로 수행합니다.', features:['도메인별 커스텀 전처리 파이프라인','자동 품질 검증 및 이상치 탐지','메타데이터 자동 태깅 시스템','프로젝트 맥락 기반 데이터 보강'], tech:['Python','OpenAI','Custom NLP'] },
  { id:3,  title:'DOCUMENT LOADERS',         type:'PIPELINE',  glow:'none',   icon:'fileText',     titleKo:null,  shortDesc:'PDF, DOCX, HWP 등 다양한 문서 포맷 로딩', overview:'다양한 형식의 문서를 자동으로 로드하고 파싱합니다. PDF, DOCX, HWP, Excel 등 건설 산업에서 사용하는 모든 포맷을 지원합니다.', features:['PDF / DOCX / HWP / Excel 등 20+ 포맷 지원','테이블 / 이미지 / 차트 자동 추출','OCR 기반 스캔 문서 인식','대용량 문서 병렬 처리'], tech:['LangChain','pdf-parse','Mammoth'] },
  { id:4,  title:'DOCUMENT TRANSFORMATION',  type:'PIPELINE',  glow:'none',   icon:'refreshCw',    titleKo:null,  shortDesc:'문서 분할, 정제, 구조화 트랜스포메이션', overview:'로드된 문서를 AI 최적화된 청크로 분할하고 구조화합니다. 의미 기반 분할로 문맥 보존성을 극대화합니다.', features:['의미 기반 Semantic Chunking','문맥 보존 스마트 분할','건설 용어 사전 기반 정규화','메타데이터 자동 연결'], tech:['LangChain','Tiktoken','Custom Splitter'] },
  { id:5,  title:'EMBEDDING MODELS',         type:'PIPELINE',  glow:'none',   icon:'binary',       titleKo:null,  shortDesc:'고성능 멀티링구얼 임베딩 벡터 생성', overview:'텍스트를 고차원 벡터로 변환하여 의미적 유사도 검색을 가능하게 합니다. 한국어 특화 임베딩 모델을 활용합니다.', features:['Google Gemini Embedding 모델 활용','한국어 / 영어 멀티링구얼 지원','1536차원 고밀도 벡터 생성','배치 임베딩으로 고속 처리'], tech:['Gemini API','ChromaDB','Sentence-Transformers'] },
  { id:6,  title:'VECTOR DATABASE',          type:'PIPELINE',  glow:'none',   icon:'hardDrive',    titleKo:null,  shortDesc:'ChromaDB 기반 벡터 저장 및 검색 엔진', overview:'임베딩 벡터를 효율적으로 저장하고 유사도 기반 검색을 수행합니다. ChromaDB를 활용한 고성능 벡터 데이터베이스 시스템입니다.', features:['ChromaDB 벡터 스토어','ANN (Approximate Nearest Neighbor) 검색','메타데이터 필터링 + 벡터 검색 하이브리드','컬렉션 기반 멀티테넌트 구조'], tech:['ChromaDB','HNSW','SQLite'] },
  { id:7,  title:'RAG',                      type:'PIPELINE',  glow:'none',   icon:'zap',          titleKo:null,  shortDesc:'Retrieval-Augmented Generation 엔진', overview:'벡터 검색 결과를 LLM에 제공하여 정확하고 근거 있는 답변을 생성합니다. 환각(Hallucination)을 최소화하는 핵심 기술입니다.', features:['컨텍스트 기반 정밀 검색(Top-K)','Re-ranking 기반 관련성 최적화','출처 명시 + 근거 기반 답변 생성','환각 방지 체인 오브 쏘트'], tech:['LangChain','Gemini / GPT-4o','Custom RAG Pipeline'] },
  { id:8,  title:'STATEMENT OF WORK',        type:'EXCLUSIVE', glow:'yellow', icon:'clipboardEdit', titleKo:null,  shortDesc:'과업지시서 해석 및 자동 매핑 엔진', overview:'발주기관의 과업지시서를 AI가 분석하여 핵심 요구사항을 추출하고 제안서 목차에 자동 매핑합니다.', features:['과업지시서 자동 파싱 및 분석','핵심 요구사항 추출 엔진','제안서 목차 자동 매핑','평가항목 가중치 분석'], tech:['GPT-4o-mini','Custom NER','Prompt Engineering'] },
  { id:9,  title:'FUNCTIONAL DATA SEARCH',   type:'EXCLUSIVE', glow:'yellow', icon:'search',       titleKo:null,  shortDesc:'의미 기반 기능적 데이터 검색 엔진', overview:'단순 키워드가 아닌 의미 기반 검색으로 건설 데이터에서 필요한 정보를 정확하게 찾아냅니다.', features:['Semantic Search + 키워드 하이브리드','건설 도메인 특화 유사도 측정','컨텍스트 인식 검색','검색 결과 자동 요약'], tech:['ChromaDB','BM25','Cross-Encoder'] },
  { id:10, title:'TACIT KNOWLEDGE',          type:'EXCLUSIVE', glow:'red',    icon:'brain',        titleKo:'학습', shortDesc:'암묵지를 형식지로 변환하는 AI 학습 엔진', overview:'수십 년간 축적된 건설 전문가의 암묵적 지식(Tacit Knowledge)을 AI가 학습 가능한 형식지로 변환합니다. Ninetynine만의 핵심 차별화 기술입니다.', features:['전문가 암묵지 → 형식지 변환 엔진','Few-shot 사례 기반 학습','프로젝트 경험 DB 자동 구축','도메인 지식 그래프 생성'], tech:['Fine-tuning','Knowledge Graph','RAG + CoT'] },
  { id:11, title:'INTERACTION AI WITH USER',  type:'PIPELINE',  glow:'none',   icon:'users',        titleKo:null,  shortDesc:'사용자와 AI의 지능형 대화 인터페이스', overview:'사용자가 자연어로 질문하면 AI가 건설 데이터를 기반으로 정확한 답변을 제공하는 대화형 인터페이스입니다.', features:['자연어 대화 기반 질의응답','멀티턴 대화 문맥 유지','실시간 스트리밍 응답','결과 시각화 자동 생성'], tech:['SSE Streaming','React','FastAPI'] },
  { id:12, title:'DATA ANALYSIS & VISUALIZATION', type:'PIPELINE', glow:'none', icon:'barChart3', titleKo:null, shortDesc:'데이터 분석 결과 고급 시각화 대시보드', overview:'AI가 생성한 분석 결과를 인터랙티브 차트와 대시보드로 시각화합니다. 의사결정을 지원하는 인사이트를 제공합니다.', features:['인터랙티브 차트 자동 생성','PDF / Excel 리포트 내보내기','대시보드 커스터마이징','비교 분석 시각화'], tech:['Chart.js','Plotly.js','React'] },
];

export default function AlivePipeline() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const desktopGridRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedStep, setSelectedStep] = useState<any>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    if (wrapperRef.current) {
      observer.observe(wrapperRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || !canvasRef.current || !desktopGridRef.current) return;

    const canvas = canvasRef.current;
    const container = desktopGridRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resize() {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }
    resize();

    const COL = 6;
    function buildWaypoints() {
      if (!container) return [];
      const rect = container.getBoundingClientRect();
      const cardW = rect.width / COL;
      const row1Y = rect.height * 0.25;
      const row2Y = rect.height * 0.75;
      const rightX = cardW * 5 + cardW * 0.5;
      const wp = [];
      for (let i = 0; i < COL; i++) wp.push({ x: cardW * i + cardW * 0.5, y: row1Y });
      wp.push({ x: rightX, y: row1Y + (row2Y - row1Y) * 0.3 });
      wp.push({ x: rightX, y: row2Y });
      for (let i = COL - 1; i >= 0; i--) wp.push({ x: cardW * i + cardW * 0.5, y: row2Y });
      return wp;
    }

    let waypoints = buildWaypoints();
    if (waypoints.length === 0) return;
    const totalLen = waypoints.length;

    const particles = Array.from({ length: 25 }, () => ({
      progress: Math.random() * totalLen,
      speed: 0.003 + Math.random() * 0.005,
      size: 1.5 + Math.random() * 2.5,
      alpha: 0.4 + Math.random() * 0.6,
    }));

    function getPos(progress: number) {
      const idx = Math.floor(progress);
      const frac = progress - idx;
      const a = waypoints[idx % totalLen];
      const b = waypoints[(idx + 1) % totalLen];
      return { x: a.x + (b.x - a.x) * frac, y: a.y + (b.y - a.y) * frac };
    }

    let frameId: number;
    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.progress += p.speed;
        if (p.progress >= totalLen) p.progress -= totalLen;
        const pos = getPos(p.progress);
        
        const grad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, p.size * 4);
        grad.addColorStop(0, `rgba(6,182,212,${p.alpha * 0.6})`);
        grad.addColorStop(0.5, `rgba(139,92,246,${p.alpha * 0.3})`);
        grad.addColorStop(1, `rgba(6,182,212,0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(pos.x - p.size * 4, pos.y - p.size * 4, p.size * 8, p.size * 8);
        
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
        ctx.fill();
      });
      frameId = requestAnimationFrame(draw);
    }

    draw();
    
    const handleResize = () => {
      resize();
      waypoints = buildWaypoints();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isVisible]);

  return (
    <div className="pipeline-scoped" style={{ position: 'relative', contain: 'paint' }}>
      <style>{`
        .pipeline-scoped {
          font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
          background: #050C1C;
          color: #f0f4ff;
          position: relative;
          background-image:
            radial-gradient(circle at 20% 10%, rgba(99,102,241,0.15), transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(14,165,233,0.1), transparent 50%),
            radial-gradient(circle at 50% 80%, rgba(16,185,129,0.08), transparent 50%);
        }

        .pipeline-section-outer {
          position: relative;
          z-index: 10;
          padding: 64px 24px;
          max-width: 1280px;
          margin: 0 auto;
        }

        .pipeline-header { text-align: center; margin-bottom: 40px; }

        .pipeline-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-radius: 9999px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          padding: 8px 16px;
          font-size: 14px;
          color: rgba(255,255,255,0.6);
          backdrop-filter: blur(20px);
          margin-bottom: 16px;
        }

        .pipeline-badge .dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: linear-gradient(to right, #3b82f6, #8b5cf6, #3b82f6);
          animation: pl-pulse 2s ease-in-out infinite;
        }

        .pipeline-title {
          font-size: clamp(28px, 5vw, 48px);
          font-weight: 800;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 12px;
          line-height: 1.2;
          margin-bottom: 0px;
        }

        .pipeline-title-gradient {
          background-image: linear-gradient(90deg, #03C75A, #0EA5E9, #7B2CBF, #8B5CF6, #03C75A, #0EA5E9, #7B2CBF);
          background-size: 400% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: naverGradientShift 8s ease-in-out infinite;
          padding-bottom: 0.1em;
        }

        .pipeline-subtitle {
          font-size: clamp(14px, 2vw, 18px);
          color: rgba(255,255,255,0.5);
          margin-top: 12px;
        }

        .pipeline-grid-wrapper {
          position: relative;
          transition: all 1s ease;
        }

        .pipeline-grid-wrapper.pl-visible { opacity: 1; transform: translateY(0); }
        .pipeline-grid-wrapper.pl-hidden  { opacity: 0; transform: translateY(32px); }

        .pipeline-desktop { display: block; position: relative; }
        .pipeline-mobile  { display: none; }

        .pipeline-row {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 16px;
          position: relative;
          z-index: 2;
        }

        .vertical-connector {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 12px calc(100% / 12 - 8px) 12px 0;
        }

        .vertical-track {
          position: relative;
          height: 40px;
          width: 3px;
          overflow: hidden;
        }

        .vertical-track-bg {
          position: absolute;
          inset: 0;
          background: rgba(100,116,139,0.3);
          border-radius: 9999px;
        }

        .vertical-track-flow {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          overflow: hidden;
        }

        .vertical-track-flow > div {
          width: 100%;
          height: 200%;
          background: linear-gradient(to bottom, transparent, rgba(6,182,212,0.8), transparent);
          animation: pipeline-flow-vertical 3.5s linear infinite;
        }

        .vertical-arrow {
          position: absolute;
          bottom: 4px;
          right: calc(100% / 12 - 13px);
        }

        .h-flow-track {
          position: absolute;
          z-index: 3;
          height: 3px;
          overflow: hidden;
        }

        .h-flow-track .track-bg {
          position: absolute;
          inset: 0;
          background: rgba(100,116,139,0.3);
          border-radius: 9999px;
        }

        .h-flow-track .track-flow {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          overflow: hidden;
        }

        .h-flow-track .track-flow > div {
          height: 100%;
          width: 200%;
        }

        .h-flow-track .track-flow .flow-right {
          background: linear-gradient(to right, transparent, rgba(6,182,212,0.8), transparent);
          animation: pipeline-flow-horizontal 3.5s linear infinite;
        }

        .h-flow-track .track-flow .flow-left {
          background: linear-gradient(to left, transparent, rgba(6,182,212,0.8), transparent);
          animation: pipeline-flow-horizontal-reverse 3.5s linear infinite;
        }

        .h-flow-track .arrow-svg {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
        }

        .h-flow-track .arrow-right { right: 0; }
        .h-flow-track .arrow-left  { left: 0; }

        .step-card {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          width: 100%;
          padding: 16px 8px;
          border-radius: 12px;
          cursor: pointer;
          border: 2px solid;
          backdrop-filter: blur(4px);
          transition: all 0.4s ease;
          background: none;
          color: inherit;
          font-family: inherit;
        }

        .step-card:hover {
          transform: translateY(-3px) scale(1.03);
        }

        .step-card.card-yellow {
          background: linear-gradient(to bottom, rgba(234,179,8,0.1), rgba(120,80,0,0.05));
          border-color: rgba(234,179,8,0.6);
          animation: pipelineCardIn 0.6s ease-out both, pipeline-glow-yellow-pulse 2.5s ease-in-out infinite;
        }
        .step-card.card-yellow:hover { border-color: #facc15; }

        .step-card.card-red {
          background: linear-gradient(to bottom, rgba(239,68,68,0.1), rgba(120,30,30,0.05));
          border-color: rgba(239,68,68,0.6);
          animation: pipelineCardIn 0.6s ease-out both, pipeline-glow-red-pulse 2.5s ease-in-out infinite;
        }
        .step-card.card-red:hover { border-color: #f87171; }

        .step-card.card-default {
          background: rgba(30,41,59,0.5);
          border-color: rgba(100,116,139,0.4);
          animation: pipelineCardIn 0.6s ease-out both;
        }
        .step-card.card-default:hover {
          border-color: rgba(6,182,212,0.5);
          background: rgba(51,65,85,0.5);
        }

        .step-badge {
          position: absolute;
          top: -10px;
          right: -8px;
          z-index: 10;
          width: 24px; height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 900;
          box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        }

        .step-badge.badge-yellow { background: #eab308; color: #000; }
        .step-badge.badge-red    { background: #ef4444; color: #fff; }
        .step-badge.badge-default { background: #64748b; color: #fff; }

        .step-icon-wrap {
          width: 44px; height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
          transition: all 0.3s ease;
        }

        .step-card:hover .step-icon-wrap { transform: scale(1.1); }

        .step-icon-wrap.icon-yellow { background: rgba(234,179,8,0.15); color: #facc15; }
        .step-icon-wrap.icon-red    { background: rgba(239,68,68,0.15); color: #f87171; }
        .step-icon-wrap.icon-default { background: rgba(51,65,85,0.6); color: #94a3b8; }
        .step-card.card-default:hover .step-icon-wrap.icon-default { background: rgba(6,182,212,0.1); color: #22d3ee; }

        .step-type {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 2px;
        }
        .step-type.type-yellow  { color: #facc15; }
        .step-type.type-red     { color: #f87171; }
        .step-type.type-default { color: rgba(6,182,212,0.6); }

        .step-title {
          font-size: 10px;
          font-weight: 700;
          color: rgba(255,255,255,0.9);
          line-height: 1.3;
          text-transform: uppercase;
          padding: 0 4px;
          margin-bottom: 0px;
        }
        .title-ko {
          display: block;
          color: rgba(255,255,255,0.5);
          text-transform: none;
          font-size: 9px;
        }

        .step-desc {
          margin-top: 6px;
          font-size: 9px;
          color: rgba(255,255,255,0.4);
          line-height: 1.4;
          padding: 0 4px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          transition: color 0.3s;
        }
        .step-card:hover .step-desc { color: rgba(255,255,255,0.6); }

        .particle-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .pipeline-cta {
          text-align: center;
          padding-top: 16px;
          margin-top: 40px;
        }

        .pl-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.7);
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .pl-cta-btn:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.2);
          color: #fff;
        }
        .pl-cta-btn:hover .cta-arrow { transform: translateX(4px); }
        .cta-arrow { transition: transform 0.3s; }

        @keyframes pl-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        @keyframes naverGradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes pipeline-glow-yellow-pulse {
          0%, 100% {
            box-shadow: 0 0 10px rgba(234,179,8,0.35), 0 0 30px rgba(234,179,8,0.15), inset 0 0 8px rgba(234,179,8,0.06);
          }
          50% {
            box-shadow: 0 0 25px rgba(234,179,8,0.55), 0 0 50px rgba(234,179,8,0.25), inset 0 0 15px rgba(234,179,8,0.1);
          }
        }

        @keyframes pipeline-glow-red-pulse {
          0%, 100% {
            box-shadow: 0 0 10px rgba(239,68,68,0.35), 0 0 30px rgba(239,68,68,0.15), inset 0 0 8px rgba(239,68,68,0.06);
          }
          50% {
            box-shadow: 0 0 25px rgba(239,68,68,0.55), 0 0 50px rgba(239,68,68,0.25), inset 0 0 15px rgba(239,68,68,0.1);
          }
        }

        @keyframes pipeline-flow-horizontal {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }

        @keyframes pipeline-flow-horizontal-reverse {
          0%   { transform: translateX(200%); }
          100% { transform: translateX(-100%); }
        }

        @keyframes pipeline-flow-vertical {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }

        @keyframes pipelineCardIn {
          from { opacity: 0; transform: translateY(24px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        @media (max-width: 768px) {
          .pipeline-desktop { display: none !important; }
          .pipeline-mobile  {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          .pipeline-section-outer { padding: 40px 16px; }
        }

        @media (min-width: 1024px) {
          .pipeline-row { gap: 20px; }
        }

        /* Modal Styles */
        .pl-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .pl-modal-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(4px);
        }

        .pl-modal-content {
          position: relative;
          width: 100%;
          max-width: 640px;
          max-height: 85vh;
          overflow-y: auto;
          border-radius: 16px;
          border: 2px solid;
          background: linear-gradient(135deg, #0f172a, #1e293b, #0f172a);
          z-index: 10000;
        }

        .pl-modal-yellow { border-color: rgba(250,204,21,0.6); box-shadow: 0 0 40px rgba(255,255,0,0.25); }
        .pl-modal-red    { border-color: rgba(239,68,68,0.6); box-shadow: 0 0 40px rgba(255,0,0,0.25); }
        .pl-modal-default{ border-color: rgba(59,130,246,0.3); }

        .pl-modal-close {
          position: absolute;
          top: 16px; right: 16px;
          padding: 8px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
          border: none;
          cursor: pointer;
          color: rgba(255,255,255,0.7);
          transition: background 0.2s;
        }
        .pl-modal-close:hover { background: rgba(255,255,255,0.1); }

        .pl-modal-body { padding: 32px; }
        .pl-modal-body > * + * { margin-top: 24px; }
      `}</style>

      <section className="pipeline-section-outer" ref={wrapperRef}>
        <div className="pipeline-header">
          <div className="pipeline-badge">
            <div className="dot"></div>
            <span style={{ fontWeight: 500 }}>Core Technology</span>
          </div>
          <h2 className="pipeline-title">
            <span>Alive 12-Step AI Pipeline:</span>
            <span className="pipeline-title-gradient">빠르고 정확한 데이터 분석</span>
          </h2>
          <p className="pipeline-subtitle">각 단계를 클릭하여 상세 기술 내용을 확인하세요</p>
        </div>

        <div className={`pipeline-grid-wrapper ${isVisible ? 'pl-visible' : 'pl-hidden'}`}>
          <div className="pipeline-desktop" ref={desktopGridRef}>
            <canvas className="particle-canvas" ref={canvasRef}></canvas>
            
            <div className="pipeline-row">
              {STEPS.slice(0, 6).map((step, idx) => {
                const Icon = ICONS[step.icon];
                return (
                  <button key={step.id} className={`step-card card-${step.glow}`} style={{ animationDelay: `${idx * 0.08}s` }} onClick={() => setSelectedStep(step)}>
                    <div className={`step-badge badge-${step.glow}`}>{String(step.id).padStart(2, '0')}</div>
                    <div className={`step-icon-wrap icon-${step.glow}`}><Icon size={20} /></div>
                    <span className={`step-type type-${step.glow}`}>{step.type}</span>
                    <h4 className="step-title">{step.title}{step.titleKo && <span className="title-ko">{step.titleKo}</span>}</h4>
                    <p className="step-desc">{step.shortDesc}</p>
                  </button>
                );
              })}
            </div>

            <div className="vertical-connector">
              <div className="vertical-track">
                <div className="vertical-track-bg"></div>
                <div className="vertical-track-flow"><div></div></div>
              </div>
              <svg className="vertical-arrow" width="13" height="8" viewBox="0 0 13 8" fill="none">
                <path d="M6.5 8L0 0h13L6.5 8z" fill="rgba(6,182,212,0.8)"/>
              </svg>
            </div>

            <div className="pipeline-row">
              {[...STEPS.slice(6, 12)].reverse().map((step, idx) => {
                const Icon = ICONS[step.icon];
                return (
                  <button key={step.id} className={`step-card card-${step.glow}`} style={{ animationDelay: `${(idx + 6) * 0.08}s` }} onClick={() => setSelectedStep(step)}>
                    <div className={`step-badge badge-${step.glow}`}>{String(step.id).padStart(2, '0')}</div>
                    <div className={`step-icon-wrap icon-${step.glow}`}><Icon size={20} /></div>
                    <span className={`step-type type-${step.glow}`}>{step.type}</span>
                    <h4 className="step-title">{step.title}{step.titleKo && <span className="title-ko">{step.titleKo}</span>}</h4>
                    <p className="step-desc">{step.shortDesc}</p>
                  </button>
                );
              })}
            </div>

            {/* Horizontal flow tracks injected here */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={`track-1-${i}`} className="h-flow-track" style={{ top: 'calc(25% - 1.5px)', left: `calc(${((i + 1) / 6) * 100}% - 8px)`, width: 'calc(16.666% * 0.25)' }}>
                <div className="track-bg"></div>
                <div className="track-flow"><div className="flow-right" style={{ animationDelay: `${i * 0.3}s` }}></div></div>
                <svg className="arrow-svg arrow-right" width="7" height="11" viewBox="0 0 7 11" fill="none"><path d="M7 5.5L0 0v11l7-5.5z" fill="rgba(6,182,212,0.8)"/></svg>
              </div>
            ))}

            {Array.from({ length: 5 }).map((_, i) => (
              <div key={`track-2-${i}`} className="h-flow-track" style={{ bottom: 'calc(25% - 1.5px)', left: `calc(${((i + 1) / 6) * 100}% - 8px)`, width: 'calc(16.666% * 0.25)' }}>
                <div className="track-bg"></div>
                <div className="track-flow"><div className="flow-left" style={{ animationDelay: `${(4 - i) * 0.3}s` }}></div></div>
                <svg className="arrow-svg arrow-left" width="7" height="11" viewBox="0 0 7 11" fill="none"><path d="M0 5.5L7 0v11L0 5.5z" fill="rgba(6,182,212,0.8)"/></svg>
              </div>
            ))}
          </div>

          <div className="pipeline-mobile">
            {STEPS.map((step, idx) => {
              const Icon = ICONS[step.icon];
              return (
                <button key={step.id} className={`step-card card-${step.glow}`} style={{ animationDelay: `${idx * 0.08}s` }} onClick={() => setSelectedStep(step)}>
                  <div className={`step-badge badge-${step.glow}`}>{String(step.id).padStart(2, '0')}</div>
                  <div className={`step-icon-wrap icon-${step.glow}`}><Icon size={20} /></div>
                  <span className={`step-type type-${step.glow}`}>{step.type}</span>
                  <h4 className="step-title">{step.title}{step.titleKo && <span className="title-ko">{step.titleKo}</span>}</h4>
                  <p className="step-desc">{step.shortDesc}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedStep && (() => {
        const step = selectedStep;
        const Icon = ICONS[step.icon];
        return (
          <div className="pl-modal-overlay">
            <div className="pl-modal-backdrop" onClick={() => setSelectedStep(null)}></div>
            <div className={`pl-modal-content pl-modal-${step.glow}`}>
              <button className="pl-modal-close" onClick={() => setSelectedStep(null)}><X size={20} /></button>
              <div className="pl-modal-body" style={{ textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ flexShrink: 0, width: 64, height: 64, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', background: step.glow === 'yellow' ? 'rgba(234,179,8,0.1)' : step.glow==='red' ? 'rgba(239,68,68,0.1)' : 'rgba(59,130,246,0.1)', border: `1px solid ${step.glow === 'yellow' ? 'rgba(234,179,8,0.3)' : step.glow==='red' ? 'rgba(239,68,68,0.3)' : 'rgba(59,130,246,0.3)'}`, color: step.glow === 'yellow' ? '#facc15' : step.glow==='red' ? '#f87171' : '#60a5fa' }}>
                    <Icon size={32} />
                  </div>
                  <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: 9999, color: 'rgba(255,255,255,0.5)' }}>STEP {String(step.id).padStart(2, '0')}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', color: step.glow === 'yellow' ? '#facc15' : step.glow==='red' ? '#f87171' : '#60a5fa' }}>{step.type}</span>
                    </div>
                    <h2 style={{ fontSize: 24, fontWeight: 700, color: '#fff', margin: 0 }}>
                      {step.title}{step.titleKo && <span style={{ marginLeft: 8, fontSize: 18, color: 'rgba(255,255,255,0.6)' }}>{step.titleKo}</span>}
                    </h2>
                  </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 20 }}>
                  <h3 style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Overview</h3>
                  <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, fontSize: 14, margin: 0 }}>{step.overview}</p>
                </div>

                <div>
                  <h3 style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Key Features</h3>
                  {step.features.map((f: string, i: number) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: 12, marginBottom: 8 }}>
                      <ChevronRight size={16} color={step.glow === 'yellow' ? '#facc15' : step.glow==='red' ? '#f87171' : '#60a5fa'} style={{ marginTop: 2, flexShrink: 0 }} />
                      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{f}</span>
                    </div>
                  ))}
                </div>

                {step.tech && (
                  <div>
                    <h3 style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Tech Stack</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {step.tech.map((t: string, i: number) => (
                        <span key={i} style={{ padding: '4px 12px', borderRadius: 9999, fontSize: 12, fontWeight: 500, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>{t}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

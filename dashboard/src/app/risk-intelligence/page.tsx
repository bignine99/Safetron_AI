'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Brain, Database, Cloud, Cpu, FileText, Settings, Network, ArrowRight, Layers,
  BarChart3, Shield, X, CheckCircle, Zap, Activity, Eye, GitBranch, Search,
  Lock, Calculator, ChevronDown, ChevronRight, Sparkles, TrendingUp, Users,
  Globe, Box, Link2, FileSearch, MessageSquare, BookOpen, Server, HardDrive,
  Workflow, Target, Award, ArrowDownRight, ExternalLink
} from 'lucide-react';
import AlivePipeline from '@/components/AlivePipeline';

/* ═══════════════════════════════════════════════
   Counter Animation Hook
   ═══════════════════════════════════════════════ */
function useCountUp(target: number, duration: number = 2000, trigger: boolean = true) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, trigger]);
  return count;
}

/* ═══════════════════════════════════════════════
   Intersection Observer Hook
   ═══════════════════════════════════════════════ */
function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ═══════════════════════════════════════════════
   Pre-computed particle positions (avoids SSR hydration mismatch from Math.random)
   ═══════════════════════════════════════════════ */
const particles = [
  { w: 3.0, h: 4.2, o: 0.25, l: 6.7, t: 84.7, d: 6.7, dl: 0.3 },
  { w: 2.1, h: 3.9, o: 0.19, l: 28.1, t: 26.2, d: 9.6, dl: 1.1 },
  { w: 4.8, h: 4.2, o: 0.35, l: 72.5, t: 48.2, d: 6.7, dl: 2.7 },
  { w: 5.0, h: 2.6, o: 0.17, l: 95.1, t: 16.1, d: 6.8, dl: 1.7 },
  { w: 4.9, h: 4.0, o: 0.31, l: 76.9, t: 78.4, d: 4.4, dl: 1.2 },
  { w: 4.5, h: 3.7, o: 0.34, l: 73.9, t: 21.0, d: 9.8, dl: 4.6 },
  { w: 3.2, h: 3.5, o: 0.22, l: 81.4, t: 46.0, d: 5.6, dl: 0.8 },
  { w: 2.7, h: 4.9, o: 0.24, l: 86.9, t: 19.2, d: 6.0, dl: 4.4 },
  { w: 2.3, h: 2.0, o: 0.24, l: 57.2, t: 53.7, d: 9.5, dl: 3.9 },
  { w: 3.7, h: 2.1, o: 0.38, l: 91.8, t: 72.6, d: 6.2, dl: 3.8 },
  { w: 3.7, h: 3.7, o: 0.22, l: 28.4, t: 98.7, d: 7.6, dl: 3.2 },
  { w: 4.2, h: 4.1, o: 0.32, l: 89.0, t: 28.0, d: 8.5, dl: 3.7 },
  { w: 4.3, h: 4.1, o: 0.22, l: 79.4, t: 43.7, d: 7.2, dl: 4.0 },
  { w: 2.9, h: 2.3, o: 0.17, l: 42.7, t: 48.7, d: 4.9, dl: 3.6 },
  { w: 4.1, h: 4.2, o: 0.16, l: 83.2, t: 56.5, d: 6.3, dl: 1.2 },
  { w: 3.7, h: 3.0, o: 0.16, l: 51.7, t: 69.6, d: 5.2, dl: 0.1 },
  { w: 2.9, h: 2.4, o: 0.37, l: 26.2, t: 61.5, d: 7.3, dl: 3.6 },
  { w: 3.4, h: 2.8, o: 0.26, l: 10.0, t: 8.2, d: 6.3, dl: 1.3 },
  { w: 4.4, h: 4.4, o: 0.21, l: 88.1, t: 25.4, d: 8.9, dl: 4.1 },
  { w: 4.0, h: 4.2, o: 0.28, l: 46.0, t: 94.6, d: 9.9, dl: 1.6 },
];

/* ═══════════════════════════════════════════════
   12-Step Pipeline Data
   ═══════════════════════════════════════════════ */
const pipelineSteps = [
  { num: '01', tag: 'EXCLUSIVE', title: 'DATA SOURCE', desc: 'CUBE 공종코지 기반 6차원 데이터 구조', icon: Database, color: '#fbbf24' },
  { num: '02', tag: 'EXCLUSIVE', title: 'DATA CUSTOMIZATION', desc: '프로젝트별 맞춤 데이터 가공 엔진', icon: Settings, color: '#fbbf24' },
  { num: '03', tag: 'PIPELINE', title: 'DOCUMENT LOADERS', desc: 'PDF, DOCX, HWP 등 다양한 문서 포맷 로딩', icon: FileText, color: '#60a5fa' },
  { num: '04', tag: 'PIPELINE', title: 'DOCUMENT TRANSFORMATION', desc: '문서 분할, 정제, 구조화 트랜스폼레이어', icon: Workflow, color: '#60a5fa' },
  { num: '05', tag: 'PIPELINE', title: 'EMBEDDING MODELS', desc: '고성능 멀티링구얼 임베딩 벡터 생성', icon: Box, color: '#60a5fa' },
  { num: '06', tag: 'PIPELINE', title: 'VECTOR DATABASE', desc: 'ChromaDB 기반 벡터 저장 및 검색 엔진', icon: HardDrive, color: '#60a5fa' },
  { num: '07', tag: 'PIPELINE', title: 'RAG', desc: 'Retrieval-Augmented Generation 엔진', icon: GitBranch, color: '#60a5fa' },
  { num: '08', tag: 'EXCLUSIVE', title: 'STATEMENT OF WORK', desc: '과업지시서 해석 및 자동 매핑', icon: FileSearch, color: '#fbbf24' },
  { num: '09', tag: 'EXCLUSIVE', title: 'FUNCTIONAL DATA SEARCH', desc: '쿼리 기반 기능적 데이터 검색 엔진', icon: Search, color: '#a78bfa' },
  { num: '10', tag: 'EXCLUSIVE', title: 'TACIT KNOWLEDGE 학습', desc: '업무지를 암묵지로 변환하는 AI 학습 엔진', icon: Brain, color: '#f97316' },
  { num: '11', tag: 'PIPELINE', title: 'INTERACTION AI WITH USER', desc: '사용자와 AI의 지능형 대화 인터페이스', icon: MessageSquare, color: '#60a5fa' },
  { num: '12', tag: 'PIPELINE', title: 'DATA ANALYSIS & VISUALIZATION', desc: '데이터 분석 결과 고급 시각화 대시보드', icon: BarChart3, color: '#60a5fa' },
];

/* ═══════════════════════════════════════════════
   Hybrid RAG Advantages
   ═══════════════════════════════════════════════ */
const hybridRagItems = [
  { icon: Shield, title: '환각 현상 근본 통제', desc: '벡터 데이터베이스의 사실 검색 기능과 그래프 데이터베이스의 관계 지식을 결합하여 언어 모델이 수치 연산 및 추론 과정에서 범하는 오류를 방지합니다.', color: '#ef4444' },
  { icon: GitBranch, title: '다단계 복합 추론', desc: '단순 문맥 검색을 넘어 데이터 간의 연결 고리를 논리적으로 추적하므로 복잡한 조건이 얽힌 질문에도 정확한 답변을 제공합니다.', color: '#8b5cf6' },
  { icon: Calculator, title: '정밀 수치 집계·비교 분석', desc: '기존 LLM의 치명적 약점인 숫자 계산의 한계를 그래프 데이터베이스의 자체 연산 기능으로 보완하여 높은 데이터 정합성을 확보합니다.', color: '#0ea5e9' },
  { icon: Search, title: '고유 식별자·특수 용어 검색', desc: '키워드 매칭 기술을 결합한 듀얼 검색 구조를 채택하여 법령 조항이나 사내 규정의 고유 코드 검색 시 발생하는 정보 혼선 문제를 해결합니다.', color: '#22c55e' },
];

/* ═══════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════ */
export default function RiskIntelligencePage() {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [activePipeline, setActivePipeline] = useState<number | null>(null);
  const [pipelineAnimating, setPipelineAnimating] = useState(false);
  const [pipelineHighlight, setPipelineHighlight] = useState(-1);
  const [activeRag, setActiveRag] = useState<number | null>(null);

  const statsSection = useInView(0.3);
  const pipelineSection = useInView(0.15);
  const ragSection = useInView(0.2);

  // Counter animations
  const nodeCount = useCountUp(38412, 2500, statsSection.inView);
  const edgeCount = useCountUp(171789, 2500, statsSection.inView);
  const accidentCount = useCountUp(29709, 2000, statsSection.inView); // Updated to actual length of refined data
  const companyCount = useCountUp(1148, 1500, statsSection.inView);

  // Pipeline flow animation
  const startPipelineAnimation = () => {
    if (pipelineAnimating) return;
    setPipelineAnimating(true);
    setPipelineHighlight(-1);
    let step = 0;
    const timer = setInterval(() => {
      setPipelineHighlight(step);
      step++;
      if (step > 12) { clearInterval(timer); setTimeout(() => setPipelineAnimating(false), 1000); }
    }, 350);
  };

  const stepDetails = [
    { title: '1. 도메인 특화 학습', subtitle: 'Domain-Specific Learning', desc: '회사마다 상이한 용어, 문서 양식, 현장 은어 등을 별도의 레이블링 작업 없이도 AI가 빠르게 학습', icon: Brain,
      demo: { title: '도메인 학습 현황', items: [{ label: '건설 현장 용어 매핑', value: '2,847개', status: 'done' }, { label: '문서 양식 패턴 인식', value: '156개 양식', status: 'done' }, { label: '현장 은어 사전 구축', value: '891개', status: 'done' }, { label: '신규 용어 자동 감지', value: 'Real-time', status: 'active' }] }
    },
    { title: '2. 전사적 지식 그래프 구축', subtitle: '', desc: '고객사 내부 데이터(과거 프로젝트 결과, 자체 위험관리 수칙 등)를 이용한 특화된 \'Customized Risk Knowledge Graph\' 구축', icon: Network,
      demo: { title: 'Knowledge Graph 현황', items: [{ label: '전체 노드 (Entity)', value: '38,412개', status: 'done' }, { label: '전체 관계 (Edge)', value: '171,789개', status: 'done' }, { label: '온톨로지 카테고리', value: '24개 분류', status: 'done' }, { label: '그래프 동기화', value: '최종 2분 전', status: 'active' }] }
    },
    { title: '3. 제어 알고리즘 최적화', subtitle: '', desc: '고객사 자체 특정 장비나 시스템 환경에 맞도록 튜닝하여 맞춤형 제어 프로그램 및 시스템 구축', icon: Settings,
      demo: { title: '최적화 파라미터', items: [{ label: '모델 정확도 (Accuracy)', value: '94.7%', status: 'done' }, { label: '위험 예측 재현율', value: '91.2%', status: 'done' }, { label: '실시간 처리 지연', value: '< 200ms', status: 'done' }, { label: '모델 최적화', value: 'Auto-tuning', status: 'active' }] }
    },
  ];

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100vh',
      fontFamily: "'Pretendard', 'Inter', sans-serif",
      color: '#334155', background: '#fff',
      overflowY: 'auto', overflowX: 'hidden'
    }}>
      {/* ══════════ Section 1: Header ══════════ */}
      <div style={{
        background: '#002A7A', height: 80, boxSizing: 'border-box',
        padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0
      }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>전사적 Risk Intelligence Agent</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield style={{ width: 22, height: 22, color: '#60a5fa' }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>AI Solution</span>
        </div>
      </div>

      {/* ══════════ Section 2: Hero — 전사적 Risk Intelligence Agent ══════════ */}
      <div style={{ padding: '20px 48px 24px' }}>
        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>각 단계를 클릭하면 상세 데모를 확인할 수 있습니다.</p>

        {/* Two Column Layout */}
        <div style={{ display: 'flex', gap: 44, alignItems: 'flex-start' }}>
          {/* Left: 3-Step Process */}
          <div style={{ flex: '0 0 400px', position: 'relative' }}>
            <div style={{ position: 'absolute', left: 28, top: 28, bottom: 28, width: 2, background: 'linear-gradient(to bottom, #bfdbfe, #93c5fd, #bfdbfe)', zIndex: 0 }}></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', zIndex: 1 }}>
              {stepDetails.map((step, idx) => {
                const Icon = step.icon;
                const isActive = activeStep === idx;
                return (
                  <div key={idx}>
                    <div onClick={() => setActiveStep(isActive ? null : idx)} style={{ display: 'flex', alignItems: 'flex-start', gap: 18, cursor: 'pointer' }}>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0, background: isActive ? 'linear-gradient(135deg, #f97316, #fb923c)' : 'linear-gradient(135deg, #1e40af, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isActive ? '0 6px 20px rgba(249,115,22,0.4)' : '0 6px 20px rgba(30,64,175,0.3)', transition: 'all 0.3s ease' }}>
                        <Icon style={{ width: 24, height: 24, color: '#fff' }} />
                      </div>
                      <div style={{ background: isActive ? '#fff7ed' : '#f0f7ff', border: isActive ? '1.5px solid #fed7aa' : '1px solid #dbeafe', padding: '12px 16px', borderRadius: 12, flex: 1, transition: 'all 0.3s ease' }}>
                        <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', marginBottom: 2 }}>{step.title}</h3>
                        {step.subtitle && <span style={{ fontSize: 10, fontWeight: 600, color: '#3b82f6', display: 'block', marginBottom: 4 }}>{step.subtitle}</span>}
                        <p style={{ fontSize: 11.5, color: '#475569', lineHeight: 1.6, wordBreak: 'keep-all', margin: 0 }}>{step.desc}</p>
                        <div style={{ marginTop: 6, fontSize: 10, color: isActive ? '#ea580c' : '#3b82f6', fontWeight: 600 }}>{isActive ? '▲ 닫기' : '▼ 클릭하여 상세보기'}</div>
                      </div>
                    </div>
                    {isActive && (
                      <div style={{ marginLeft: 74, marginTop: 10, padding: '14px 18px', background: '#1e293b', borderRadius: 12, color: '#e2e8f0', animation: 'fadeSlideIn 0.3s ease' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                          <Cpu style={{ width: 14, height: 14, color: '#60a5fa' }} />
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#93c5fd' }}>{step.demo.title}</span>
                        </div>
                        {step.demo.items.map((item, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 0', borderBottom: i < step.demo.items.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                            <span style={{ fontSize: 11, color: '#94a3b8' }}>{item.label}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ fontSize: 11, fontWeight: 700, color: item.status === 'active' ? '#34d399' : '#e2e8f0' }}>{item.value}</span>
                              {item.status === 'active' && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.6)', animation: 'pulse 2s infinite' }}></div>}
                              {item.status === 'done' && <CheckCircle style={{ width: 11, height: 11, color: '#60a5fa' }} />}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Architecture Diagram */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ background: '#fafbfc', border: '1px solid #e2e8f0', borderRadius: 20, padding: '32px 28px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Top: DB → KG ← DB */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 72, height: 72, borderRadius: 16, background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)', border: '2px solid #bae6fd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Database style={{ width: 32, height: 32, color: '#0284c7' }} /></div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#334155' }}>내부 DB</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div style={{ width: 32, height: 2, background: '#93c5fd' }}></div><ArrowRight style={{ width: 14, height: 14, color: '#3b82f6' }} /></div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 110, height: 110, borderRadius: 20, background: 'linear-gradient(135deg, #f97316, #fb923c)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 40px rgba(249,115,22,0.3)', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: -15, right: -15, width: 50, height: 50, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', filter: 'blur(8px)' }}></div>
                      <Layers style={{ width: 32, height: 32, color: '#fff', marginBottom: 4 }} />
                      <span style={{ fontSize: 8.5, fontWeight: 700, color: 'rgba(255,255,255,0.9)', textAlign: 'center', lineHeight: 1.3 }}>Customized Risk<br/>Knowledge Graph</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><ArrowRight style={{ width: 14, height: 14, color: '#3b82f6', transform: 'rotate(180deg)' }} /><div style={{ width: 32, height: 2, background: '#93c5fd' }}></div></div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 72, height: 72, borderRadius: 16, background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)', border: '2px solid #bae6fd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Cloud style={{ width: 32, height: 32, color: '#0284c7' }} /></div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#334155' }}>외부 공공 DB</span>
                  </div>
                </div>
                {/* Pipeline Badge */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#1e293b', padding: '8px 20px', borderRadius: 30, boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
                    <Cpu style={{ width: 16, height: 16, color: '#60a5fa' }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0' }}>Real-Time Fusion AI Pipeline</span>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.6)', animation: 'pulse 2s infinite' }}></div>
                  </div>
                </div>
                {/* Bottom */}
                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 60, height: 60, borderRadius: 14, background: '#f8fafc', border: '1.5px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FileText style={{ width: 26, height: 26, color: '#64748b' }} /></div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#334155' }}>Local Client Data</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, paddingTop: 16 }}>
                    <div style={{ width: 2, height: 20, background: '#cbd5e1' }}></div>
                    <ArrowRight style={{ width: 12, height: 12, color: '#94a3b8', transform: 'rotate(-90deg)' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 60, height: 60, borderRadius: 14, background: 'linear-gradient(135deg, #fef3c7, #fde68a)', border: '1.5px solid #fcd34d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BarChart3 style={{ width: 26, height: 26, color: '#b45309' }} /></div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#334155' }}>분석 리포트</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 6 }}>
                    {['사고분석', '위험률', '지표 관리', '보험료 산출'].map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#f1f5f9', padding: '4px 10px', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                        <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#3b82f6' }}></div>
                        <span style={{ fontSize: 10, fontWeight: 600, color: '#475569' }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ Section 3: 12-Step AI Pipeline (Dark, Animated) ══════════ */}
      <AlivePipeline />

      {/* ══════════ Section 4: Data Stats — Knowledge Graph ══════════ */}
      <div ref={statsSection.ref} style={{ padding: '56px 48px', background: '#f8fafc' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
          <div style={{ width: 4, height: 28, background: '#002A7A', borderRadius: 2 }}></div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>데이터 특장점</h2>
        </div>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 36 }}>
          {[
            { icon: Database, label: '사건사고 데이터', value: accidentCount.toLocaleString(), unit: '건', sub: '최근 10년간 수집·가공', color: '#3b82f6', bg: '#eff6ff' },
            { icon: Users, label: '분석 대상 기업', value: companyCount.toLocaleString(), unit: '개사', sub: '시공사 데이터베이스', color: '#8b5cf6', bg: '#f5f3ff' },
            { icon: GitBranch, label: 'Knowledge Graph 노드', value: nodeCount.toLocaleString(), unit: '개', sub: '온톨로지 기반 엔티티', color: '#f97316', bg: '#fff7ed' },
            { icon: Link2, label: 'Knowledge Graph 엣지', value: edgeCount.toLocaleString(), unit: '개', sub: '관계(Relation) 연결', color: '#0ea5e9', bg: '#f0f9ff' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} style={{
                background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '24px 20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                ...(statsSection.inView ? { animation: `fadeSlideIn 0.5s ease ${i * 0.1}s both` } : { opacity: 0 })
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  <Icon style={{ width: 22, height: 22, color: stat.color }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#64748b', display: 'block', marginBottom: 4 }}>{stat.label}</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>{stat.value}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8' }}>{stat.unit}</span>
                </div>
                <span style={{ fontSize: 11, color: '#94a3b8', marginTop: 6, display: 'block' }}>{stat.sub}</span>
              </div>
            );
          })}
        </div>

        {/* KG Detail Table */}
        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ flex: 1, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '24px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Network style={{ width: 18, height: 18, color: '#f97316' }} />
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>Knowledge Graph 데이터 규모</h3>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ textAlign: 'left', padding: '8px 0', fontSize: 12, fontWeight: 600, color: '#3b82f6' }}>항목</th>
                  <th style={{ textAlign: 'right', padding: '8px 0', fontSize: 12, fontWeight: 600, color: '#3b82f6' }}>수량</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['전체 노드', '38,412개'], ['전체 관계(엣지)', '171,789개'], ['사고 유형', '12종'],
                  ['시공사', '1,148개사'], ['장소 유형', '20종류'], ['기인물(장비/설비)', '20종류'], ['관계자 직종', '16종류']
                ].map(([k, v], i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 0', fontSize: 13, color: '#475569' }}>{k}</td>
                    <td style={{ padding: '10px 0', fontSize: 13, fontWeight: 700, color: '#0f172a', textAlign: 'right' }}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Data Processing Features */}
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '20px 24px' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 14 }}>데이터 가공 방식</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { icon: BarChart3, title: '통계형 데이터 (수치형/범주형)', desc: '29,709건의 정제된 사건사고 데이터를 정량화하여 DB 구축', color: '#3b82f6' },
                  { icon: BookOpen, title: '텍스트 데이터 (비정형)', desc: '사고 경위서, 안전점검 보고서 등 자연어 데이터 구조화', color: '#8b5cf6' },
                  { icon: Globe, title: '외부 API 기업정보 연동', desc: '금융감독원·DART 등 외부 공공 데이터베이스 연계', color: '#0ea5e9' },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 14px', background: '#f8fafc', borderRadius: 10, border: '1px solid #f1f5f9' }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: `${item.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon style={{ width: 16, height: 16, color: item.color }} />
                      </div>
                      <div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: 2 }}>{item.title}</span>
                        <span style={{ fontSize: 11, color: '#64748b', lineHeight: 1.5 }}>{item.desc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ Section 5: Hybrid RAG 특장점 ══════════ */}
      <div ref={ragSection.ref} style={{ padding: '56px 48px', background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{ width: 4, height: 28, background: '#002A7A', borderRadius: 2 }}></div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>Hybrid RAG 핵심 특장점</h2>
        </div>
        <p style={{ fontSize: 13, color: '#64748b', marginLeft: 12, marginBottom: 32 }}>벡터 DB + 그래프 DB + 키워드 매칭의 3중 검색 아키텍처로 기존 LLM의 한계를 극복합니다.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {hybridRagItems.map((item, i) => {
            const Icon = item.icon;
            const isActive = activeRag === i;
            return (
              <div key={i}
                onClick={() => setActiveRag(isActive ? null : i)}
                style={{
                  background: isActive ? '#0f172a' : '#fff',
                  border: `1.5px solid ${isActive ? item.color : '#e2e8f0'}`,
                  borderRadius: 16, padding: '24px 20px', cursor: 'pointer',
                  transition: 'all 0.4s ease',
                  transform: isActive ? 'translateY(-6px)' : 'none',
                  boxShadow: isActive ? `0 12px 32px ${item.color}30` : '0 2px 8px rgba(0,0,0,0.04)',
                  ...(ragSection.inView ? { animation: `fadeSlideIn 0.5s ease ${i * 0.12}s both` } : { opacity: 0 })
                }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: isActive ? `${item.color}25` : `${item.color}10`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
                  transition: 'all 0.3s ease'
                }}>
                  <Icon style={{ width: 24, height: 24, color: item.color }} />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: isActive ? '#fff' : '#0f172a', marginBottom: 10, transition: 'color 0.3s ease' }}>{item.title}</h3>
                <p style={{ fontSize: 12, color: isActive ? '#94a3b8' : '#64748b', lineHeight: 1.7, margin: 0, wordBreak: 'keep-all' }}>{item.desc}</p>
                <div style={{ marginTop: 14, fontSize: 10, fontWeight: 600, color: isActive ? item.color : '#94a3b8' }}>
                  {isActive ? '✓ 적용 완료' : '클릭하여 상세보기'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══════════ Section 6: 보험료 산정 비교표 ══════════ */}
      <div style={{ padding: '56px 48px', background: 'linear-gradient(135deg, #0f172a, #1e293b)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
          <div style={{ width: 4, height: 28, background: '#60a5fa', borderRadius: 2 }}></div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>보험료 산정 시스템 비교</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr 1fr', gap: 0, borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
          {/* Header */}
          <div style={{ background: 'transparent', padding: '20px 16px' }}></div>
          {[
            { name: 'Safetron', sub: '우리 솔루션', color: '#0ea5e9', highlight: true },
            { name: '기존 보험사', sub: '시스템', color: '#64748b', highlight: false },
            { name: 'Gradient', sub: '경쟁사', color: '#94a3b8', highlight: false },
          ].map((h, i) => (
            <div key={i} style={{ background: h.highlight ? 'rgba(14,165,233,0.1)' : 'rgba(255,255,255,0.02)', padding: '20px 16px', textAlign: 'center', borderBottom: `3px solid ${h.color}`, borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: 18, fontWeight: 900, color: h.highlight ? '#0ea5e9' : '#e2e8f0' }}>{h.name}</span>
              <span style={{ display: 'block', fontSize: 11, color: '#64748b', marginTop: 2 }}>{h.sub}</span>
            </div>
          ))}

          {/* Rows */}
          {[
            { cat: '문제인식', vals: ['산재/보험 특화 OCR+NLP', '수작업 + 단순 OCR', '보험 이후(Claim) 대상'] },
            { cat: '사고분석', vals: ['AI 패턴분석 엔진', '담당자 경험 의존', '보험 클레임 데이터 중심'] },
            { cat: '요율산출', vals: ['AI기반 정밀 요율산정 모델', '과거 통계 기반 수동', '통계/ML 기반 패턴 분석'] },
            { cat: '산업 데이터', vals: ['건설 46만+ 사고 데이터 보유', '보험 데이터만 보유', '산업 비특화'] },
            { cat: '확장성', vals: ['보험사 맞춤형 API 제공', '내부 시스템 한정', '보험사 내부 시스템 중심'] },
          ].map((row, i) => (
            <React.Fragment key={i}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px 16px', display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8' }}>{row.cat}</span>
              </div>
              {row.vals.map((val, j) => (
                <div key={j} style={{
                  background: j === 0 ? 'rgba(14,165,233,0.05)' : 'rgba(255,255,255,0.01)',
                  padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)',
                  borderLeft: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <span style={{ fontSize: 12, fontWeight: j === 0 ? 700 : 500, color: j === 0 ? '#38bdf8' : '#94a3b8', textAlign: 'center', lineHeight: 1.5 }}>{val}</span>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ══════════ Section 7: 비즈니스 모델 ══════════ */}
      <div style={{ padding: '56px 48px', background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
          <div style={{ width: 4, height: 28, background: '#002A7A', borderRadius: 2 }}></div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>비즈니스 모델</h2>
        </div>

        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
          {/* Left: Business Items */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { title: 'UBI 언더라이팅 수수료', sub: '(DaaS Model)', desc: '자동차 보험의 T-map 할인처럼 건설/산업 현장의 데이터를 요율에 동적(dynamic)으로 반영하는 엔진을 제공', tags: ['Safetron AI Safe-Agent 실시간 데이터 분석→\'안전지수\' 산출', 'API 송신 삼성화재 언더라이팅 시스템으로 연동'], color: '#3b82f6' },
              { title: 'B2B2B 번들링 및 채널 파트너십', sub: '(Bundling Strategy)', desc: '삼성화재가 법인 보험 영업 시, \'Safetron 안전 패키지\'를 보험 상품의 부가 서비스(Value-added Service)로 포함', tags: [], color: '#8b5cf6' },
              { title: '리스크 관리 컨설팅 및 리포트 자동화', sub: '(Claims Automation)', desc: 'Safetron이 축적한 비정형 데이터를 기반으로 \'AI 사고 분석 리포트\'를 자동 생성하여 삼성화재 보상팀에 제공', tags: [], color: '#f97316' },
            ].map((bm, i) => (
              <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 14, padding: '22px 24px', borderLeft: `4px solid ${bm.color}` }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: bm.color }}>{bm.title}</h3>
                  <span style={{ fontSize: 11, color: '#64748b' }}>{bm.sub}</span>
                </div>
                <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.7, margin: 0, wordBreak: 'keep-all' }}>{bm.desc}</p>
                {bm.tags.length > 0 && (
                  <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {bm.tags.map((t, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: bm.color }}>
                        <ArrowRight style={{ width: 10, height: 10 }} />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right: Business Matrix */}
          <div style={{ flex: 1 }}>
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 16, padding: '24px', overflow: 'hidden' }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', textAlign: 'center', marginBottom: 20 }}>핵심 비즈니스 매트릭스</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 1fr', gap: 0 }}>
                {/* Header */}
                <div style={{ padding: 12 }}></div>
                <div style={{ padding: '10px 12px', textAlign: 'center', background: '#e0f2fe', borderRadius: '8px 0 0 0' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#0369a1' }}>보험 가입 전<br/>(Underwriting/Sales)</span>
                </div>
                <div style={{ padding: '10px 12px', textAlign: 'center', background: '#e0f2fe', borderRadius: '0 8px 0 0' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#0369a1' }}>계약 체결 후<br/>(Post-Contract)</span>
                </div>

                {/* Top-line row */}
                <div style={{ padding: '16px 12px', background: '#f0f9ff', display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#0f172a' }}>Top-line<br/><span style={{ fontSize: 10, color: '#64748b' }}>(수익확대)</span></span>
                </div>
                <div style={{ padding: '14px 12px', background: '#fff', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#3b82f6' }}>UBI 언더라이팅<br/>수수료</span>
                  <span style={{ display: 'block', fontSize: 10, color: '#64748b', marginTop: 4 }}>(DaaS Model)</span>
                </div>
                <div style={{ padding: '14px 12px', background: '#fff', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#8b5cf6' }}>B2B2 채널 파트너십</span>
                  <span style={{ display: 'block', fontSize: 10, color: '#64748b', marginTop: 4 }}>(Bundling Strategy)</span>
                </div>

                {/* Bottom-line row */}
                <div style={{ padding: '16px 12px', background: '#f0f9ff', display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#0f172a' }}>Bottom-line<br/><span style={{ fontSize: 10, color: '#64748b' }}>(비용/리스크 절감)</span></span>
                </div>
                <div style={{ padding: '14px 12px', background: '#fff', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#0ea5e9' }}>B2B2 번들링</span>
                  <span style={{ display: 'block', fontSize: 10, color: '#64748b', marginTop: 4 }}>(Bundling Strategy & Partnership)</span>
                </div>
                <div style={{ padding: '14px 12px', background: 'linear-gradient(135deg, #fef2f2, #fff1f2)', border: '2px solid #fca5a5', borderRadius: '0 0 8px 0', textAlign: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#dc2626' }}>리스크 관리 컨설팅 및<br/>리포트 자동화</span>
                  <span style={{ display: 'block', fontSize: 10, color: '#64748b', marginTop: 4 }}>(Claims Automation)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ Bottom Quote ══════════ */}
      <div style={{ padding: '40px 48px 56px', background: 'linear-gradient(135deg, #f8fafc, #f0f9ff)' }}>
        <div style={{ padding: '32px 40px', background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', textAlign: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 14, left: 30, fontSize: 48, fontWeight: 900, color: '#e2e8f0', lineHeight: 1, fontFamily: 'Georgia, serif' }}>❝</div>
          <p style={{ fontSize: 20, fontWeight: 600, color: '#334155', lineHeight: 1.6 }}>
            외부 공공 DB 및 고객사 내부데이터를 연계한{' '}
            <span style={{ fontWeight: 800, fontSize: 24, color: '#1e40af', borderBottom: '3px solid #3b82f6', paddingBottom: 2 }}>
              고객맞춤형 AI에이전트 구축
            </span>
          </p>
        </div>
      </div>

      {/* ══════════ Animations ══════════ */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.5); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-15px) translateX(5px); }
          50% { transform: translateY(-5px) translateX(-5px); }
          75% { transform: translateY(-20px) translateX(3px); }
        }
      `}</style>
    </div>
  );
}

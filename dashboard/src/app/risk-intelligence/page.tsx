'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Brain, Database, Cloud, Cpu, FileText, Settings, Network, ArrowRight, Layers,
  BarChart3, Shield, X, CheckCircle, Zap, Activity, Eye, GitBranch, Search,
  Lock, Calculator, ChevronDown, ChevronRight, Sparkles, TrendingUp, Users,
  Globe, Box, Link2, FileSearch, MessageSquare, BookOpen, Server, HardDrive,
  Workflow, Target, Award, ArrowDownRight, ExternalLink, RefreshCw, ZapOff, PlayCircle
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
    const step = Math.max(Math.ceil(target / (duration / 16)), 1);
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
   Main Component
   ═══════════════════════════════════════════════ */
export default function RiskIntelligencePage() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const statsSection = useInView(0.1);
  const ontologySection = useInView(0.2);
  const dbStrengthsSection = useInView(0.2);

  // Updated Counter animations (Final DB Stats)
  const rowsCount = useCountUp(37196, 2500, statsSection.inView);
  const cellsCount = useCountUp(2566524, 3000, statsSection.inView);
  const nodeCount = useCountUp(89466, 2500, statsSection.inView);
  const edgeCount = useCountUp(389523, 3000, statsSection.inView);

  // Extracted Hybrid RAG Steps based on characteristics_safetron_ai.md
  const pipelineStepsData = [
    { num: '01', title: '정량 데이터(SQL) 벡터 임베딩', desc: '관계형 DB 수치 데이터를 요율 공식과 즉각 연동하는 1차 분석', icon: Database },
    { num: '02', title: '건설 안전 특화 온톨로지 설계', desc: '비정형 텍스트를 12개의 핵심 노드가 구조화하는 딥다이브 과정', icon: GitBranch },
    { num: '03', title: '그래프 메타데이터 빌드', desc: '다차원 상관관계를 지식그래프 네트워크로 시각적/논리적 직조', icon: Network },
    { num: '04', title: '지식그래프 2차 벡터 임베딩', desc: '검색된 네트워크 구조를 RAG 텍스트로 변환하여 문맥 추론 향상', icon: Layers },
    { num: '05', title: '하이브리드 RAG 최종 완성', desc: '지식 그래프와 정량 팩터를 조인하여 오차 없는 심사 자동화 달성', icon: Brain },
  ];

  const dbStrengths = [
    { icon: Shield, title: 'Hallucination 원천 차단', desc: '엄격하게 규정된 지식 그래프 노드 내에서만 답변을 생성하여 AI의 허위 답변을 근본적으로 제거합니다.', color: '#ef4444' },
    { icon: Zap, title: 'Token 사용량 최소화', desc: '불필요한 방대한 원문 대신 압축된 Sub-graph 매핑 정보만 LLM에 전달하여 비용과 지연시간을 획기적으로 낮췄습니다.', color: '#f59e0b' },
    { icon: Target, title: '데이터 정합성 극대화', desc: '정량(SQL) 데이터와 정성(텍스트) 데이터를 상호 교차 검증하여 결점 없는 정밀한 요율 산정 팩터(Factor)를 도출합니다.', color: '#10b981' }
  ];

  const programStrengths = [
    { icon: Users, title: '심사역의 최적화된 Copilot', desc: '전문적인 토목/건축 기술지식이 없어도, AI가 맞춤형 현장 정보를 역추적해 Risk Index를 즉시 요약·산출합니다.', color: '#3b82f6' },
    { icon: ZapOff, title: '초고속 요율 심사 자동화', desc: '수일이 소요되던 서베이 및 요율 평가 과정을 "그래프 쿼리 연산 → 리스크 평가 → 요금 할증/할인" 파이프라인으로 단축 지원.', color: '#6366f1' },
    { icon: Eye, title: '감각적 Risk Intelligence', desc: '단순한 스프레드시트가 아닌 다차원 분석 차트와 시각적 네트워크망(Graph Explorer)으로 잠재 위험까지 즉각 캐치합니다.', color: '#8b5cf6' }
  ];

  return (
    <div style={{
      position: 'absolute', inset: 0,
      fontFamily: "'Pretendard', 'Inter', sans-serif",
      color: '#334155', background: '#f8fafc',
      overflowX: 'hidden', overflowY: 'auto'
    }}>
      {/* ══════════ Header ══════════ */}
      <div style={{
        background: '#0f172a', height: 80, boxSizing: 'border-box',
        padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Sparkles style={{ width: 22, height: 22, color: '#38bdf8' }} />
          Safetron Intelligent AI Agent
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(56, 189, 248, 0.1)', padding: '6px 14px', borderRadius: 20, border: '1px solid rgba(56, 189, 248, 0.2)' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 10px #38bdf8', animation: 'pulse 2s infinite' }}></div>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#38bdf8' }}>AI Pipeline Live</span>
        </div>
      </div>

      {/* ══════════ Section 1: Dynamic Data Stats (Aurora & Glassmorphism 2.0) ══════════ */}
      <div ref={statsSection.ref} style={{ padding: '48px 48px', background: '#090e17', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
        {/* Cinematic Aurora Effect */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
           <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: '60%', height: '60%', background: 'radial-gradient(ellipse at center, rgba(14,165,233,0.12) 0%, transparent 60%)', filter: 'blur(80px)', animation: 'blob1 18s infinite alternate ease-in-out' }}></div>
           <div style={{ position: 'absolute', top: '20%', right: '-5%', width: '50%', height: '70%', background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.15) 0%, transparent 60%)', filter: 'blur(80px)', animation: 'blob2 22s infinite alternate ease-in-out' }}></div>
           <div style={{ position: 'absolute', bottom: '-20%', left: '10%', width: '70%', height: '50%', background: 'radial-gradient(ellipse at center, rgba(16,185,129,0.08) 0%, transparent 60%)', filter: 'blur(80px)', animation: 'blob3 20s infinite alternate ease-in-out' }}></div>
        </div>
        {/* Grain Overlay */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', opacity: 0.25, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

        <div style={{ marginBottom: 32, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 2 }}>
          <span style={{ color: '#94a3b8', fontSize: 13, fontWeight: 700, letterSpacing: '0.15em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{width: 24, height: 1, backgroundColor: '#38bdf8'}}></div> DATA ORCHESTRATION
          </span>
          <h2 style={{ 
            fontSize: 32, fontWeight: 900, 
            background: 'linear-gradient(to right, #ffffff, #e2e8f0, #94a3b8)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            letterSpacing: '-0.01em',
            animation: 'gradientShift2 6s linear infinite'
          }}>
            압도적인 데이터베이스 축적과 분류
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: 14.5, marginTop: 12, maxWidth: 640, lineHeight: 1.6 }}>
            대한민국 건설산업 전반에 걸친 방대한 데이터. AI 모델의 정확한 인지 능력을 위해 <strong style={{color:'#fff', fontWeight: 800}}>SQL 정량 데이터</strong>와 <strong style={{color:'#fff', fontWeight: 800}}>온톨로지 텍스트 데이터</strong>로 완벽하게 이원화되었습니다.
          </p>
        </div>

        {/* Dynamic Bento Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, position: 'relative', zIndex: 2 }}>
          {[
            { label: '정량 분석 데이터 (Rows)', target: 37196, val: rowsCount, unit: '건', icon: Database, color: '#38bdf8', bg: 'rgba(56,189,248,0.1)' },
            { label: '분석 데이터 포인트 (Cells)', target: 2566524, val: cellsCount, unit: '개', icon: Box, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
            { label: '지식 그래프 노드 (Nodes)', target: 89466, val: nodeCount, unit: '개', icon: GitBranch, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
            { label: '네트워크 연결 관계 (Edges)', target: 389523, val: edgeCount, unit: '개', icon: Link2, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            const isCompleted = stat.val >= stat.target;
            return (
              <div key={idx} style={{
                background: 'rgba(15, 23, 42, 0.4)', 
                backdropFilter: 'blur(24px) saturate(130%)', WebkitBackdropFilter: 'blur(24px) saturate(130%)',
                border: `1px solid rgba(255,255,255,0.06)`, borderRadius: 6, padding: '24px 28px',
                boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.05), 0 8px 32px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                ...(statsSection.inView ? { animation: `fadeSlideIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.15}s both` } : { opacity: 0 })
              }}
              onMouseEnter={(e) => { 
                e.currentTarget.style.transform = 'scale(1.03) translateY(-4px)'; 
                e.currentTarget.style.borderColor = stat.color; 
                e.currentTarget.style.background = 'rgba(30, 41, 59, 0.6)';
                e.currentTarget.style.boxShadow = `inset 0 1px 1px rgba(255,255,255,0.1), 0 16px 40px ${stat.color}15`;
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.transform = 'scale(1) translateY(0)'; 
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; 
                e.currentTarget.style.background = 'rgba(15, 23, 42, 0.4)';
                e.currentTarget.style.boxShadow = 'inset 0 1px 1px rgba(255, 255, 255, 0.05), 0 8px 32px rgba(0, 0, 0, 0.2)';
              }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 6, background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon style={{ width: 22, height: 22, color: stat.color }} />
                  </div>
                  {isCompleted && <div style={{ background: stat.color, padding: '4px 10px', borderRadius: 20, fontSize: 10, fontWeight: 800, color: '#fff', boxShadow: `0 0 12px ${stat.color}40` }}>100% Indexed</div>}
                </div>
                <span style={{ fontSize: 12.5, color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: 8 }}>{stat.label}</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: 36, fontWeight: 900, color: '#fff', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
                    {stat.val.toLocaleString()}
                  </span>
                  <span style={{ fontSize: 13, color: stat.color, fontWeight: 700 }}>{stat.unit}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══════════ Section 2: Hybrid RAG Pipeline & Ontology ══════════ */}
      <div ref={ontologySection.ref} style={{ padding: '64px 48px', background: '#fff' }}>
        <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }}>
          
          {/* Left: Pipeline Interactive list */}
          <div style={{ flex: '1 1 42%' }}>
            <div style={{ marginBottom: 32 }}>
              <span style={{ color: '#3b82f6', fontSize: 13, fontWeight: 700, letterSpacing: '0.05em' }}>DATA ARCHITECTURE</span>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginTop: 10, lineHeight: 1.3 }}>혁신적 데이터 가공과<br/>하이브리드 RAG 설계</h2>
              <p style={{ color: '#64748b', fontSize: 14, marginTop: 12, lineHeight: 1.6 }}>단순 텍스트 검색을 넘어 보험 심사역의 전문적 사고회로를 완벽하게 모사하기 위해 설계된 독자적 5-Step 파이프라인입니다.</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}>
              <div style={{ position: 'absolute', left: 24, top: 20, bottom: 20, width: 2, background: 'linear-gradient(to bottom, #dbeafe, #60a5fa, #dbeafe)', zIndex: 0 }}></div>
              {pipelineStepsData.map((step, idx) => {
                const Icon = step.icon;
                const isHovered = activeStep === idx;
                return (
                  <div key={idx} 
                    onMouseEnter={() => setActiveStep(idx)}
                    onMouseLeave={() => setActiveStep(null)}
                    style={{ display: 'flex', gap: 16, alignItems: 'center', position: 'relative', zIndex: 1, cursor: 'pointer', opacity: ontologySection.inView ? 1 : 0, transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.1}s` }}>
                    <div style={{ width: 50, height: 50, borderRadius: '50%', background: isHovered ? '#3b82f6' : '#fff', border: `2px solid ${isHovered ? '#3b82f6' : '#bfdbfe'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', boxShadow: isHovered ? '0 8px 24px rgba(59,130,246,0.3)' : 'none' }}>
                      <Icon style={{ width: 20, height: 20, color: isHovered ? '#fff' : '#3b82f6' }} />
                    </div>
                    <div style={{ background: isHovered ? '#eff6ff' : '#f8fafc', border: `1px solid ${isHovered ? '#bfdbfe' : '#e2e8f0'}`, borderRadius: 6, padding: '18px 20px', flex: 1, transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', transform: isHovered ? 'translateX(4px)' : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: 10, fontWeight: 900, color: isHovered ? '#3b82f6' : '#94a3b8', background: isHovered ? 'rgba(59,130,246,0.1)' : '#f1f5f9', padding: '3px 8px', borderRadius: 4 }}>STEP {step.num}</span>
                        <h4 style={{ fontSize: 14.5, fontWeight: 800, color: '#0f172a' }}>{step.title}</h4>
                      </div>
                      <p style={{ fontSize: 13, color: '#64748b', margin: 0, lineHeight: 1.5 }}>{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: 12 Nodes Diagram */}
          <div style={{ flex: '1 1 58%' }}>
            <div style={{ background: 'linear-gradient(145deg, #0f172a, #1e293b)', borderRadius: 6, padding: '40px 36px', border: '1px solid #334155', boxShadow: '0 24px 48px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Network style={{ color: '#38bdf8', width: 26, height: 26 }} />
                  <h3 style={{ fontSize: 19, fontWeight: 800, color: '#fff' }}>세부 12대 핵심 노드 구성</h3>
                </div>
                <div style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)', padding: '6px 14px', borderRadius: 20 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#38bdf8' }}>건설 안전 특화 온톨로지</span>
                </div>
              </div>
              <p style={{ fontSize: 13.5, color: '#cbd5e1', marginBottom: 32, lineHeight: 1.6 }}>길고 비정형적인 텍스트 데이터 문맥을 AI가 정확히 인지하도록 12개의 노드로 해체하여 시공사-취약공종-기인물 간의 보이지 않는 인과를 직조해냅니다.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                {[
                  '1. 시공사 (Company)', '2. 현장 (Location)', '3. 투입인력 (Agent)',
                  '4. 공종 (Process)', '5. 기인물 (Component)', '6. 사고유형 (AccidentType)',
                  '7. 직간접원인 (Cause)', '8. 발생형태 (Mechanism)', '9. 피해규모 (Damage)',
                  '10. 기상환경 (Environment)', '11. 예방대책 (Prevention)', '12. 리스크맥락 (Insurance)'
                ].map((node, i) => (
                  <div key={i} style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6,
                    padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10,
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(56,189,248,0.1)'; e.currentTarget.style.borderColor = 'rgba(56,189,248,0.4)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'none'; }}
                  >
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 6px #38bdf8' }}></div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0', letterSpacing: '-0.02em' }}>{node}</span>
                  </div>
                ))}
              </div>

              {/* Data Flow arrow */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 32, gap: 16 }}>
                <div style={{ height: 1, flex: 1, background: 'linear-gradient(to right, transparent, rgba(56,189,248,0.4))' }}></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #1d4ed8, #2563eb)', padding: '12px 24px', borderRadius: 6, boxShadow: '0 8px 24px rgba(37,99,235,0.4)' }}>
                  <Brain style={{ width: 18, height: 18, color: '#fff' }} />
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#fff', letterSpacing: '0.02em' }}>인과 관계(Edges) 입체적 연결</span>
                </div>
                <div style={{ height: 1, flex: 1, background: 'linear-gradient(to left, transparent, rgba(56,189,248,0.4))' }}></div>
              </div>
            </div>
            
            {/* Old Architecture preserved as minimal component */}
            <div style={{ padding: '24px 28px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 6, background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Cloud style={{ color: '#0ea5e9' }} /></div>
                <div><span style={{ fontSize: 11, color: '#64748b', display: 'block', fontWeight: 600 }}>외부 데이터</span><strong style={{ fontSize: 14, color: '#0f172a' }}>공공 DB 연동</strong></div>
              </div>
              <ArrowRight style={{ color: '#94a3b8' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div><span style={{ fontSize: 11, color: '#64748b', display: 'block', textAlign: 'right', fontWeight: 600 }}>가공된 지능</span><strong style={{ fontSize: 14, color: '#0f172a', display: 'block' }}>분석 리포트 산출</strong></div>
                <div style={{ width: 44, height: 44, borderRadius: 6, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BarChart3 style={{ color: '#d97706' }} /></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ Section 3: Alive Pipeline ══════════ */}
      <AlivePipeline />

      {/* ══════════ Section 4: 특장점 카드 (DB & UI) - Light Gray Bg ══════════ */}
      <div ref={dbStrengthsSection.ref} style={{ padding: '64px 48px', background: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
        
        {/* DB Strengths */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: '#dcfce7', padding: '8px', borderRadius: 6 }}><Database style={{ color: '#10b981', width: 22, height: 22 }}/></div>
            데이터베이스의 압도적 특장점
          </h2>
          <p style={{ fontSize: 14, color: '#64748b', marginBottom: 28, paddingLeft: 46 }}>AI가 직접 구축하고 교차 검증한 무결성 데이터는 보험료 율(Rate) 산정에 즉각적인 가치를 제공합니다.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, paddingLeft: 46 }}>
            {dbStrengths.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} style={{ background: '#fff', padding: '32px', borderRadius: 6, boxShadow: '0 10px 30px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', ...(dbStrengthsSection.inView ? { animation: `fadeSlideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i*0.15}s both` } : { opacity: 0 }) }} onMouseEnter={e=>e.currentTarget.style.transform='translateY(-6px)'} onMouseLeave={e=>e.currentTarget.style.transform='none'}>
                  <div style={{ width: 52, height: 52, borderRadius: 6, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}><Icon style={{ color: s.color, width: 24, height: 24 }} /></div>
                  <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Program Strengths - Glassmorphism variant */}
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: '#e0e7ff', padding: '8px', borderRadius: 6 }}><Workflow style={{ color: '#6366f1', width: 22, height: 22 }}/></div>
            심사 자동화 파이프라인의 진가
          </h2>
          <p style={{ fontSize: 14, color: '#64748b', marginBottom: 28, paddingLeft: 46 }}>전사적 관점에서 매우 복잡한 산업 재해 데이터를 정확하고 신속하게 의사결정 합니다.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, paddingLeft: 46 }}>
            {programStrengths.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} style={{ 
                  background: 'linear-gradient(135deg, #1e293b, #0f172a)', padding: '32px', borderRadius: 6, 
                  border: '1px solid rgba(51, 65, 85, 0.5)', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  ...(dbStrengthsSection.inView ? { animation: `fadeSlideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i*0.15 + 0.3}s both` } : { opacity: 0 }) 
                }} 
                onMouseEnter={e=>e.currentTarget.style.transform='translateY(-6px)'} onMouseLeave={e=>e.currentTarget.style.transform='none'}>
                  <div style={{ width: 52, height: 52, borderRadius: 6, background: `rgba(255,255,255,0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}><Icon style={{ color: s.color, width: 24, height: 24 }} /></div>
                  <h3 style={{ fontSize: 17, fontWeight: 800, color: '#fff', marginBottom: 10 }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══════════ Section 5: 보험료 산정 파이프라인 비교 ══════════ */}
      <div style={{ padding: '64px 48px', background: 'linear-gradient(135deg, #090e17, #1e293b)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
          <div style={{ width: 4, height: 28, background: '#38bdf8', borderRadius: 2 }}></div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: '#fff' }}>보험료 산정 시스템 비교</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr 1fr', gap: 0, borderRadius: 6, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
          {/* Header */}
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px 16px' }}></div>
          {[
            { name: 'Safetron AI', sub: '우리 솔루션', color: '#0ea5e9', highlight: true },
            { name: '기존 보험사', sub: '시스템', color: '#64748b', highlight: false },
            { name: '일반 테크사', sub: '경쟁사', color: '#94a3b8', highlight: false },
          ].map((h, i) => (
            <div key={i} style={{ background: h.highlight ? 'linear-gradient(to bottom, rgba(14,165,233,0.15), rgba(14,165,233,0.05))' : 'rgba(255,255,255,0.02)', padding: '24px 16px', textAlign: 'center', borderBottom: `3px solid ${h.color}`, borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: 19, fontWeight: 900, color: h.highlight ? '#38bdf8' : '#e2e8f0', letterSpacing: '-0.02em' }}>{h.name}</span>
              <span style={{ display: 'block', fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{h.sub}</span>
            </div>
          ))}

          {/* Rows */}
          {[
            { cat: '문제인식', vals: ['이원화 DB (정량+온톨로지)', '수작업 + 단순 OCR', '단순 텍스트 매칭 위주'] },
            { cat: '사고분석', vals: ['하이브리드 RAG (12대 노드)', '담당자 경험 의존', '과거 클레임 위주 ML'] },
            { cat: '요율산출', vals: ['초고속 실시간 평가 모델', '수일에 걸친 서베이 수동평가', '배치 기반 사후 분석'] },
            { cat: '산업 데이터', vals: ['건설 특화 3.7만+ 사고/원인', '일반 보험 데이터만 보유', '산업 비특화/일반 데이터'] },
          ].map((row, i) => (
            <React.Fragment key={i}>
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8' }}>{row.cat}</span>
              </div>
              {row.vals.map((val, j) => (
                <div key={j} style={{
                  background: j === 0 ? 'rgba(14,165,233,0.05)' : 'rgba(255,255,255,0.01)',
                  padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)',
                  borderLeft: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <span style={{ fontSize: 13, fontWeight: j === 0 ? 800 : 500, color: j === 0 ? '#38bdf8' : '#cbd5e1', textAlign: 'center', lineHeight: 1.5 }}>
                    {val}
                  </span>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ══════════ Section 6: 비즈니스 모델 ══════════ */}
      <div style={{ padding: '64px 48px', background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36 }}>
          <div style={{ width: 4, height: 28, background: '#0f172a', borderRadius: 2 }}></div>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a' }}>초고속 성장을 위한 비즈니스 연계 파급력</h2>
        </div>

        <div style={{ display: 'flex', gap: 36, alignItems: 'flex-start' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { title: 'UBI 실시간 언더라이팅 수수료 확대', sub: '(DaaS Model)', desc: '자동차 T-map 보험처럼, AI 분석 요율을 시스템간 API로 즉각 송신하는 Value-Chain 제공', color: '#0284c7' },
              { title: '엔터프라이즈 B2B 번들링 및 채널 패키징', sub: '(Value Integration)', desc: '법인 영업 시 Safetron AI 플러그인을 맞춤 특약 분석의 부가 가치로 제공', color: '#7c3aed' },
              { title: '사고 예측 보상 리포트 (Consulting)', sub: '(Claims Automation)', desc: '압도적 하이브리드 RAG 기술을 통한 보상/재발방지 원스톱 리포트 제공', color: '#e11d48' },
            ].map((bm, i) => (
              <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, padding: '24px 28px', borderLeft: `6px solid ${bm.color}`, transition: 'all 0.3s', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }} onMouseEnter={e=>e.currentTarget.style.transform='translateX(6px)'} onMouseLeave={e=>e.currentTarget.style.transform='none'}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: bm.color }}>{bm.title}</h3>
                  <span style={{ fontSize: 12, color: '#64748b', fontWeight: 700 }}>{bm.sub}</span>
                </div>
                <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, margin: 0, wordBreak: 'keep-all' }}>{bm.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)', border: '1px solid #e2e8f0', borderRadius: 6, padding: '48px', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.03)' }}>
               <p style={{ fontSize: 22, fontWeight: 600, color: '#334155', lineHeight: 1.7, textAlign: 'center' }}>
                단순 통계를 넘어선 <span style={{ fontWeight: 900, color: '#0369a1', borderBottom: '3px solid #38bdf8' }}>하이브리드 Risk Intelligence</span><br/>
                보험회사의 심사 요율 평가의 근간을 바꿉니다.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 36 }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#0f172a', padding: '16px 32px', borderRadius: 6, color: '#fff', cursor: 'pointer', boxShadow: '0 10px 25px rgba(15,23,42,0.3)', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }} onMouseEnter={e=>e.currentTarget.style.transform='translateY(-3px)'} onMouseLeave={e=>e.currentTarget.style.transform='none'}>
                   <PlayCircle style={{ width: 22, height: 22, color: '#38bdf8' }} />
                   <span style={{ fontSize: 16, fontWeight: 800 }}>심사 자동화 파이프라인 체험하기</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.4); } }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes blob1 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(5%, 10%) scale(1.1); } }
        @keyframes blob2 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-5%, 15%) scale(1.05); } }
        @keyframes blob3 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(10%, -5%) scale(1.08); } }
        @keyframes gradientShift2 { 0% { background-position: 0% center; } 50% { background-position: 100% center; } 100% { background-position: 0% center; } }
      `}</style>
    </div>
  );
}

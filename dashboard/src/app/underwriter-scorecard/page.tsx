'use client';

import React, { useState } from 'react';
import { 
  Building2, Search, ShieldAlert, FileCheck, Play, Loader2, 
  FileText, CheckCircle2, Cpu, Info, X, BadgeDollarSign, HeartHandshake, Network, BookOpen, BarChart3, TrendingUp
} from 'lucide-react';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, LinearScale, CategoryScale, ScatterController, RadarController, BarElement } from 'chart.js';
import { Radar, Scatter, Bar, Line } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, LinearScale, CategoryScale, ScatterController, RadarController, BarElement);

const MOCK_COMPANIES = [
  { 
    id: 1, name: '태영건설', score: 85, rank: 'A등급(우량)', type: '건축공사', invest: 3.5, incident: 0.12, penalty: '-12%', credit: 'AA-', kosha: '유효', graphRisk: '중/하',
    details: {
      creditDesc: '최근 5년간 신용등급이 A+에서 AA-로 지속 상향 조정되었습니다. 이는 강력한 자본 유동성과 우수한 공공/민간 수주 실적에 기인합니다. 거대 손실(다중 인명피해) 발생 시에도 자체 지급 여력이 충분하여 보험사의 대지급 리스크가 매우 낮습니다.',
      koshaDesc: '2023년 5월 최초 획득 (취득등급: 최우수). 2026년 4월 현재 갱신 유효 상태이며, 이 인증을 바탕으로 주요 관급공사 입찰시 가점을 확보하고 있습니다. 본 인증 유지는 당사 인수 지침상 최우선 요율 할인 적용 사유에 완벽히 부합합니다.',
      graphDesc: '과거 39건의 전체 사고를 지식그래프로 매핑한 결과, "건축마감공사 + 시스템비계 + 작업발판" 조합에서 구조적 부주의(추락) 발생 확률이 동종 평균 대비 높게 검출되었습니다. 그러나 중대재해(사망)로 이어지는 엣지(Edge) 연결망은 0건으로 리스크가 절단되어 있습니다.',
      scoreDesc: '인증/재무/과거손실 6개 체인을 종합한 AI 계리 모델 결과 85점이 산출되었습니다. 이는 상위 12%에 해당하는 우량 수준으로, 영업적으로 적극적인 인수 승인 및 10% 이상의 요율 할인이 강력히 권장됩니다.',
      peerDesc: '동종 건축공사 업체 대비 안전관리비에 1.3%p 초과 투자를 집행하고 있으며, 그 결과 실제 중대재해 클레임 발생률은 평균보다 무려 60% 낮게 통제되고 있습니다. AI는 훌륭한 시스템 경영의 성과로 평가합니다.'
    }
  },
  { 
    id: 2, name: '삼성종합건설', score: 92, rank: 'S등급(최우량)', type: '건축공사', invest: 4.8, incident: 0.05, penalty: '-20%', credit: 'AAA', kosha: '유효', graphRisk: '초저위험',
    details: {
      creditDesc: '만점(AAA)을 연속 10년간 유지하고 있는 초우량 법인입니다. 어떠한 규모의 경제적 타격 및 클레임 상황에서도 흔들림 없는 완벽한 채무 이행/보상 구조를 보장합니다.',
      koshaDesc: '국내 최고 수준의 안전보건관리 시스템을 자사 내부 그룹망과 연동. 인증서 자체를 뛰어넘는 글로벌 규격(ISO 45001 통합)을 독자적으로 운영 중입니다.',
      graphDesc: '지식그래프상 나타나는 사고의 95%가 찰과상, 단순 타박상 등 경미한(Minor) 엣지에서 소멸합니다. 고소작업/밀폐공간 등 치명적 사고 노드와 연결되는 위험 기인물 경로 자체가 시스템적으로 차단되어 있습니다.',
      scoreDesc: '계리 모델에서 도출할 수 있는 상위 1% 급 극상 점수(92점)입니다. 해당 시공사 대상으로는 업계 최대 수준(-20%)의 요율 인하를 적용하여 타사에 뺏기지 않도록 계약을 록인(Lock-in)하는 것이 필수적입니다.',
      peerDesc: '경쟁 상위 5대 건설사군과 비교해서도 재해 통제율이 압도적 1위입니다. 안전관리비 지출이 다소 과할 정도로 엄격하게 관리되고 있습니다.'
    }
  },
  { 
    id: 3, name: '동부엔지니어링', score: 62, rank: 'C등급(주의)', type: '토목공사', invest: 1.8, incident: 0.38, penalty: '+15%', credit: 'BB+', kosha: '심사요망', graphRisk: '상',
    details: {
      creditDesc: '최근 3년 내 BBB-에서 BB+로 하향 조정된 리스크가 있습니다. 주요 토목 수주 감소로 현금 확보가 지연되고 있으며, 인명사고 배상 시 당사(보험사) 측 구상권 청구가 난항을 겪을 가능성을 배제할 수 없습니다.',
      koshaDesc: '과거 취득 이력이 존재하나 갱신 심사 지연으로 현재 만료 대기 상태입니다. 실제 현장에 적용하기에는 안전조직의 이행력이 부족한 형식적 서류 구비 수준일 수 있어 세부 현장 실사가 매우 강하게 요구됩니다.',
      graphDesc: '지식그래프 분석 결과 가장 치명적인 "토목/지하굴착 + 건설기계(굴착기/크레인) + 장비 협착/붕괴" 체인이 강렬한 빨간색(다발 빈도)으로 점등됩니다. 인적 통제 기능이 전혀 작동하지 않고 있습니다.',
      scoreDesc: '계산 점수 62점으로 하위 30% 주의 등급에 턱걸이했습니다. 공동인수 제한, 보상 한도액 축소 설정 및 기존 요율의 최소 15% 기계적 할증 적용이 방어적 차원에서 불가피합니다.',
      peerDesc: '동일 규모 토목회사들이 최소 2.5%대 안전예산을 편제하는 반면, 1.8%라는 극단적으로 낮은 비용만 투자하고 있습니다. 이로 인한 재해 클레임 급증 현상이 가시적으로 확인됩니다.'
    }
  }
];

// Mock Chart Data Sets
const getClaimTrendData = (companyName: string) => ({
  labels: ['2022', '2023', '2024', '2025', '2026'],
  datasets: [
    { label: companyName, data: companyName === '동부엔지니어링' ? [1.2, 1.5, 3.8, 5.2, 5.5] : [0.5, 0.4, 0.3, 0.2, 0.1], backgroundColor: '#3b82f6' },
    { label: '동종업계 평균', data: [1.0, 1.1, 1.2, 1.0, 0.9], backgroundColor: '#cbd5e1' }
  ]
});

const getRiskIndexTrendData = (companyName: string) => ({
  labels: ['Q1 25', 'Q2 25', 'Q3 25', 'Q4 25', 'Q1 26', 'Q2 26'],
  datasets: [
    { label: '종합 위험지수 트렌드', data: companyName === '동부엔지니어링' ? [65, 70, 75, 82, 85, 88] : [45, 42, 38, 35, 30, 25], borderColor: '#10b981', fill: true, backgroundColor: 'rgba(16,185,129,0.1)', tension: 0.4 }
  ]
});

const scatterOptions = {
  maintainAspectRatio: false,
  scales: {
    x: { title: { display: true, text: '안전관리비 투자비율 (%)', color: '#64748b', font: { weight: 'bold' } }, min: 0, max: 6 },
    y: { title: { display: true, text: '실제 중대재해율 (Claims)', color: '#64748b', font: { weight: 'bold' } }, min: 0, max: 100 }
  },
  plugins: { legend: { display: true, position: 'top' as const } }
};

export default function UnderwriterScorecard() {
  const [selectedCompany, setSelectedCompany] = useState(MOCK_COMPANIES[0]);
  const [stage, setStage] = useState<'IDLE' | 'PROCESSING' | 'COMPLETE'>('IDLE');
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [showGuide, setShowGuide] = useState(false);
  
  const processingSteps = [
    { title: "기업 기초정보 수집 및 OCR", desc: "사업자등록증, 재무제표, 도급계약서 텍스트 추출 중..." },
    { title: "재무/신용평가 자료 동기화", desc: "나이스평가정보(NICE) 기업 신용등급 실시간 API 연동..." },
    { title: "과거 산재 이력 및 벌점 조회", desc: "안전보건공단 중대재해 발생 이력 클렌징 연동 검증..." },
    { title: "안전보건경영인증(MS) 교차검증", desc: "KOSHA-MS / ISO45001 진위 여부 및 만료일 파싱..." },
    { title: "AI 지식그래프 사고망 탐색", desc: "공구/기계/결과 9대 클래스 엣지 분석 및 심도 모델링..." },
    { title: "최종 계리(Actuarial) 모델 생성", desc: "최적 특약 및 요율(Premium) 할인율 산정 및 시뮬레이션..." }
  ];

  const handleStartSimulation = () => {
    setStage('PROCESSING'); setProgress(0); setActiveStep(0);
    setTerminalLogs(["> [INIT] 보안 터널 접속 / AI 파이프라인 엔진 가동 시작"]);

    let currentProg = 0;
    const interval = setInterval(() => {
      // Average 0.5 per tick, hitting 100 in ~200 ticks. At 30ms interval, takes ~6 seconds.
      currentProg += Math.random() * 1.0; 
      if (currentProg >= 100) {
        currentProg = 100; clearInterval(interval);
        setTimeout(() => setStage('COMPLETE'), 500);
      }
      setProgress(currentProg);
      if (currentProg < 16) { setActiveStep(0); } else if (currentProg < 32) { setActiveStep(1); } else if (currentProg < 48) { setActiveStep(2); } else if (currentProg < 64) { setActiveStep(3); } else if (currentProg < 80) { setActiveStep(4); } else { setActiveStep(5); }
      
      const logs = [
        `> [API-NICE] 5개년 신용/현금흐름 지표 정상 수신 (${selectedCompany.credit})`,
        `> [CROSS-CHECK] 최근 3년 누적 사고 건수/사망 0건 판명. 패스.`,
        `> [CERT] 인증 체계 유효성 AI 파악: ${selectedCompany.kosha} 확인됨.`,
        `> [GRAPH] 3.7만건 노드 스캔 완료. 특정 공종 기인물 패턴 탐지(${selectedCompany.graphRisk}).`,
        `> [MATH] 보험 요율 계리(Actuarial) 신경망 통과. 할증율 시뮬레이션 완료.`,
        `> [DB] 시스템 적재 대기. 최종 스코어 결합 중...`,
        `> [SYS] Allocated 8GB VRAM for heterogeneous graph attention networks.`,
        `> [NET] DeepWalk embeddings generating... Step ${Math.floor(Math.random()*5000+1000)}...`,
        `> [NLP] Parsing unstructured safety logs... confidence: ${(Math.random()*10+90).toFixed(2)}%`,
        `> [CACHE] HDFS chunk memory hit. Skip cold read...`,
        `> [MODEL] Forward pass iteration ${(Math.floor(currentProg*25))}... Loss: ${(Math.random()*0.1).toFixed(4)}`,
        `> [INFERENCE] Edge prediction latency: ${(Math.random()*15 + 5).toFixed(2)}ms. Stable.`
      ];
      
      // Generate multiple logs rapidly to simulate intense AI processing
      const newLogsCount = Math.floor(Math.random() * 3) + 1;
      const newLogs = Array.from({length: newLogsCount}, () => logs[Math.floor(Math.random() * logs.length)]);
      
      setTerminalLogs(prev => {
        const nextLogs = [...prev, ...newLogs];
        return nextLogs.slice(-40); 
      });
    }, 30);
  };

  const radarData = {
    labels: ['안전투자비율', '신용평가안정성', '기인물 치명방어율', '페널티 누적관리', '내부 규정 신뢰성', '과거 10년 손실방어'],
    datasets: [
      {
        label: selectedCompany.name,
        data: [selectedCompany.score * 0.9, selectedCompany.credit.includes('A') ? 95 : 60, 100 - (selectedCompany.score * 0.3), selectedCompany.score * 0.7, selectedCompany.kosha === '유효' ? 100 : 40, 100 - (selectedCompany.incident * 100)],
        backgroundColor: 'rgba(6, 182, 212, 0.2)', borderColor: '#06b6d4', borderWidth: 2, pointBackgroundColor: '#06b6d4',
      },
      {
        label: '동종평균', data: [65, 70, 60, 65, 75, 60], backgroundColor: 'transparent', borderColor: '#94a3b8', borderWidth: 2, borderDash: [5, 5], pointRadius: 0,
      },
    ],
  };

  const scatterData = {
    datasets: [{
      label: '시공사 군집 점도표', data: MOCK_COMPANIES.map(c => ({ x: c.invest, y: c.incident * 100, company: c.name })),
      backgroundColor: (context: any) => context.raw?.company === selectedCompany.name ? '#06b6d4' : '#cbd5e1',
      pointRadius: (context: any) => context.raw?.company === selectedCompany.name ? 12 : 6,
      borderColor: '#ffffff', borderWidth: 2,
    }],
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: "'Pretendard', sans-serif", background: '#f8fafc', color: '#0f172a' }}>
      <style>{`.terminal-scroll { scroll-behavior: smooth; }`}</style>
      
      {/* ══════════ Header ══════════ */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 80, padding: '0 40px', background: '#002A7A', flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#ffffff', display: 'flex', gap: 12, alignItems: 'center' }}>
            <BadgeDollarSign size={24} color="#93c5fd" /> 실무 보험 인수/요율 심사 (Automated Underwriting)
          </h1>
        </div>
        <button onClick={() => setShowGuide(true)} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '8px 16px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
          <Info size={16} /> 대시보드 해석 가이드
        </button>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* ══════════ Left Sidebar ══════════ */}
        <div style={{ width: 340, borderRight: '1px solid #e2e8f0', background: '#ffffff', display: 'flex', flexDirection: 'column', zIndex: 10 }}>
          <div style={{ padding: 20, borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: 12, top: 10, width: 16, color: '#94a3b8' }} />
              <input type="text" placeholder="시공업체 검색..." style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', fontWeight: 500, boxSizing: 'border-box' }}/>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {MOCK_COMPANIES.map(company => (
              <div 
                key={company.id} onClick={() => { setSelectedCompany(company); setStage('IDLE'); }}
                style={{
                  padding: '20px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', background: selectedCompany.id === company.id ? '#f0f9ff' : '#ffffff',
                  borderLeft: selectedCompany.id === company.id ? '4px solid #002A7A' : '4px solid transparent', transition: 'background 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontWeight: 800, fontSize: 15, color: selectedCompany.id === company.id ? '#002A7A' : '#334155' }}>{company.name}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: company.score > 80 ? '#dcfce7' : company.score > 60 ? '#fef08a' : '#fee2e2', color: company.score > 80 ? '#166534' : company.score > 60 ? '#854d0e' : '#991b1b' }}>{company.rank}</span>
                </div>
                <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#64748b', fontWeight: 500 }}>
                  <span>{company.type}</span><span>체인 위험가중 {company.incident.toFixed(2)}x</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════ Right Content ══════════ */}
        <div style={{ flex: 1, overflowY: 'auto', background: '#f8fafc', paddingBottom: 60 }}>
          <div style={{ maxWidth: 1300, margin: '0 auto', padding: '40px 32px' }}>
          
            {stage === 'IDLE' && (
              <div style={{ height: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 120, height: 120, borderRadius: '50%', background: '#fff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                  <Cpu size={56} color="#002A7A" />
                </div>
                <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>{selectedCompany.name} 심사 대기</h2>
                <p style={{ color: '#475569', textAlign: 'center', maxWidth: 500, lineHeight: 1.6, marginBottom: 32, fontSize: 15 }}>
                  현재 AI 엔진이 대기 중입니다. 클릭 한 번으로 광학 스캔부터, 3.7만건 노드와 대조하는 지식그래프 검증, 그리고 최종 특약/할인율을 계산하는 전체 계리 시뮬레이션을 원스톱으로 관전하십시오.
                </p>
                <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                  <button onClick={handleStartSimulation} style={{ background: '#002A7A', color: '#ffffff', padding: '16px 40px', borderRadius: 8, fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', border: 'none', boxShadow: '0 6px 12px rgba(0, 42, 122, 0.25)' }}>
                    <Play fill="#ffffff"/> AI 파이프라인 심사 개시
                  </button>
                </div>
              </div>
            )}

            {stage === 'PROCESSING' && (
              <div style={{ maxWidth: 860, margin: '0 auto', animation: 'fadeIn 0.3s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Loader2 color="#002A7A" className="animate-spin" /> 지능형 보험 인수/계리 알고리즘 연산
                  </h2>
                  <div style={{ fontSize: 36, fontWeight: 800, fontFamily: 'monospace', color: '#06b6d4' }}>{progress.toFixed(1)}%</div>
                </div>

                <div style={{ width: '100%', height: 12, background: '#e2e8f0', borderRadius: 6, overflow: 'hidden', marginBottom: 40, boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)' }}>
                  <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #3b82f6, #06b6d4)', transition: 'width 0.15s linear' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
                  {processingSteps.map((step, idx) => (
                    <div key={idx} style={{ 
                      display: 'flex', alignItems: 'center', gap: 16, padding: '20px 24px', borderRadius: 8, 
                      background: activeStep === idx ? '#eff6ff' : '#ffffff', border: activeStep === idx ? '2px solid #3b82f6' : '1px solid #cbd5e1',
                      opacity: activeStep >= idx ? 1 : 0.4, transition: 'all 0.3s', boxShadow: activeStep === idx ? '0 4px 12px rgba(59, 130, 246, 0.15)' : 'none'
                    }}>
                      {activeStep > idx ? <CheckCircle2 color="#10b981" size={28} /> : activeStep === idx ? <Loader2 className="animate-spin" color="#3b82f6" size={28} /> : <div style={{ width: 24, height: 24, borderRadius: '50%', border: '3px solid #cbd5e1', marginLeft: 2 }} />}
                      <div>
                        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Step {idx + 1}. {step.title}</h3>
                        <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.4 }}>{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ background: '#0f172a', borderRadius: 8, padding: 16, height: 320, overflowY: 'hidden', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8, borderBottom: '1px solid #334155', paddingBottom: 8, fontWeight: 700, flexShrink: 0 }}>[ SYSTEM KERNEL MESSAGE IO ]</div>
                  <div className="terminal-scroll" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 6, fontSize: 13, fontFamily: 'monospace', color: '#10b981', flex: 1, overflow: 'hidden' }}>
                    {terminalLogs.slice(-25).map((log, i) => <div key={i}>{log}</div>)}<div className="animate-pulse" style={{ marginTop: 4 }}>_</div>
                  </div>
                </div>
              </div>
            )}

            {stage === 'COMPLETE' && (
              <div style={{ animation: 'fadeIn 0.6s ease' }}>
                {/* Final Score Report Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 32, background: '#fff', padding: 32, borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', marginBottom: 32 }}>
                  <div style={{ flex: 1, minWidth: 400 }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                      <span style={{ fontSize: 13, background: '#eff6ff', color: '#2563eb', padding: '6px 14px', border: '1px solid #bfdbfe', borderRadius: 6, fontWeight: 700 }}>AI 완전승인</span>
                      <span style={{ fontSize: 13, background: '#f8fafc', color: '#475569', padding: '6px 14px', border: '1px solid #cbd5e1', borderRadius: 6, fontWeight: 600 }}>업종: {selectedCompany.type}</span>
                    </div>
                    <h2 style={{ fontSize: 40, fontWeight: 900, color: '#0f172a' }}>{selectedCompany.name}</h2>
                    <p style={{ marginTop: 24, fontSize: 15, lineHeight: 1.6, color: '#334155', maxWidth: '100%', background: '#f8fafc', padding: 16, borderRadius: 8, borderLeft: '4px solid #002A7A' }}>
                      <strong style={{ color: '#002A7A' }}>[ AI 동종업계 비교 총평 ]</strong><br/>
                      {selectedCompany.details.peerDesc}
                    </p>
                  </div>
                  
                  <div style={{ textAlign: 'right', display: 'flex', gap: 24, flexShrink: 0 }}>
                    <div style={{ background: '#f8fafc', padding: '24px 32px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: 13, color: '#64748b', fontWeight: 700, marginBottom: 8, whiteSpace: 'nowrap' }}>지능형 종합 위험 스코어</div>
                      <div style={{ fontSize: 48, fontWeight: 900, color: '#002A7A' }}>{selectedCompany.score}<span style={{fontSize: 20, color:'#94a3b8', fontWeight: 600}}>/100</span></div>
                    </div>
                    <div style={{ background: selectedCompany.penalty.startsWith('-') ? '#f0fdf4' : '#fef2f2', padding: '24px 32px', borderRadius: 8, border: selectedCompany.penalty.startsWith('-') ? '1px solid #bbf7d0' : '1px solid #fecaca' }}>
                      <div style={{ fontSize: 13, color: selectedCompany.penalty.startsWith('-') ? '#15803d' : '#b91c1c', fontWeight: 700, marginBottom: 8, whiteSpace: 'nowrap' }}>AI 권장 페널티/할인 상계율</div>
                      <div style={{ fontSize: 48, fontWeight: 900, color: selectedCompany.penalty.startsWith('-') ? '#059669' : '#dc2626' }}>{selectedCompany.penalty}</div>
                    </div>
                  </div>
                </div>

                {/* 4 Deep Dive Cards */}
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}><BookOpen size={20} color="#002A7A"/> 파이프라인 구간 상세 분석 브리핑</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
                  
                  {/* Card 1 */}
                  <div style={{ background: '#fff', padding: 24, borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid #f1f5f9', paddingBottom: 16 }}>
                      <span style={{ fontSize: 14, color: '#0f172a', fontWeight: 800 }}>📌 신용/재무 리스크 (5년 연속성)</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontSize: 22, fontWeight: 900, color: '#3b82f6' }}>{selectedCompany.credit}</span></div>
                    </div>
                    <p style={{ fontSize: 14, lineHeight: 1.6, color: '#475569' }}>{selectedCompany.details.creditDesc}</p>
                  </div>

                  {/* Card 2 */}
                  <div style={{ background: '#fff', padding: 24, borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid #f1f5f9', paddingBottom: 16 }}>
                      <span style={{ fontSize: 14, color: '#0f172a', fontWeight: 800 }}>📌 KOSHA/ISO 인증 실효성 검증</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontSize: 20, fontWeight: 900, color: selectedCompany.kosha === '유효' ? '#10b981' : '#f59e0b' }}>[ {selectedCompany.kosha} ]</span></div>
                    </div>
                    <p style={{ fontSize: 14, lineHeight: 1.6, color: '#475569' }}>{selectedCompany.details.koshaDesc}</p>
                  </div>

                  {/* Card 3 */}
                  <div style={{ background: '#fff', padding: 24, borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid #f1f5f9', paddingBottom: 16 }}>
                      <span style={{ fontSize: 14, color: '#0f172a', fontWeight: 800 }}>📌 사고 지식그래프 딥러닝 망(Network)</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontSize: 18, fontWeight: 900, color: '#f59e0b' }}>위험도: {selectedCompany.graphRisk}</span></div>
                    </div>
                    <p style={{ fontSize: 14, lineHeight: 1.6, color: '#475569' }}>{selectedCompany.details.graphDesc}</p>
                  </div>

                  {/* Card 4 */}
                  <div style={{ background: '#fff', padding: 24, borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', borderLeft: '4px solid #002A7A' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid #f1f5f9', paddingBottom: 16 }}>
                      <span style={{ fontSize: 14, color: '#002A7A', fontWeight: 800 }}>📌 종합 계리(Actuarial) 점수 산정 로직</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontSize: 24, fontWeight: 900, color: '#002A7A' }}>{selectedCompany.score} / 100</span></div>
                    </div>
                    <p style={{ fontSize: 14, lineHeight: 1.6, color: '#475569' }}>{selectedCompany.details.scoreDesc}</p>
                  </div>
                </div>

                {/* Charts Area 1: Radar & Scatter */}
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10, marginTop: 40 }}><BarChart3 size={20} color="#002A7A"/> 업계 다차원 비교 분석 차트 (Industry Charts)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) minmax(400px, 1.3fr)', gap: 24, marginBottom: 24 }}>
                  <div style={{ background: '#fff', borderRadius: 8, padding: 32, border: '1px solid #e2e8f0', position: 'relative' }}>
                    <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', textAlign: 'center', marginBottom: 8 }}>다면 역량 평가 (Benchmarking Radar)</h3>
                    <div style={{ height: 340 }}><Radar data={radarData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#334155' } } }, scales: { r: { min: 0, max: 100, ticks: { display: false } } } }} /></div>
                  </div>
                  <div style={{ background: '#fff', borderRadius: 8, padding: 32, border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginBottom: 24, textAlign: 'center' }}>안전 투자 대비 클레임 방어 산점도 (Scatter Ratio)</h3>
                    <div style={{ height: 320 }}><Scatter data={scatterData} options={scatterOptions as any} /></div>
                  </div>
                </div>

                {/* Charts Area 2: Bar & Line Trends */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 40 }}>
                  <div style={{ background: '#fff', borderRadius: 8, padding: 32, border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginBottom: 24, textAlign: 'center' }}>최근 5년 배상 청구(Claim) 건수 추이</h3>
                    <div style={{ height: 260 }}><Bar data={getClaimTrendData(selectedCompany.name)} options={{ maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }} /></div>
                  </div>
                  <div style={{ background: '#fff', borderRadius: 8, padding: 32, border: '1px solid #e2e8f0' }}>
                    <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginBottom: 24, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><TrendingUp size={18} color="#10b981"/> 종합 리스크 누적 스코어 개선 트렌드 (18개월)</h3>
                    <div style={{ height: 260 }}><Line data={getRiskIndexTrendData(selectedCompany.name)} options={{ maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 100 } } }} /></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══════════ Guide Modal ══════════ */}
      {showGuide && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#ffffff', width: 680, borderRadius: 8, overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 24, borderBottom: '1px solid #e2e8f0', background: '#002A7A', color: 'white' }}>
               <h2 style={{ fontSize: 18, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10 }}><Info size={20} />대시보드 해석 및 활용 가이드</h2>
               <button onClick={() => setShowGuide(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={22}/></button>
            </div>
            <div style={{ padding: 32, maxHeight: '65vh', overflowY: 'auto' }}>
              <div style={{ background: '#f8fafc', padding: 20, borderRadius: 8, borderLeft: '4px solid #3b82f6', marginBottom: 32 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>1. 시스템 작동 원리 (AI 파이프라인)</h3>
                <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.7 }}>
                  이 대시보드는 기존에 직원이 일일이 서류를 스캔하고 재해 이력을 찾아 결재를 올렸던 작업을 <strong>'6단계 지능형 자동화 모듈'</strong>로 혁신했습니다. 광학 판독, NICE평가정보 API 동기화, KOSHA 만료 판단을 거쳐, <strong>국내 유일의 3.7만건 사고망 지식그래프(Knowledge Graph)</strong>에 업체 데이터를 대조하여 잠재적인 극단적 위험 확률(Tail Risk)을 계산합니다.
                </p>
              </div>

              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>2. 섹션별 해석 및 활용 방안</h3>
              <ul style={{ fontSize: 14, color: '#475569', lineHeight: 1.8, paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <li>
                  <strong style={{ color: '#0f172a' }}>[상단 패널] 페널티/할인 상계율:</strong> 6가지 알고리즘 채점이 끝난 후 AI가 제시하는 최종 영업 무기입니다. 마이너스(-12%) 지표는 그만큼 이 회사가 안전하다는 뜻이며, 보험사가 선제적으로 요율 할인을 제안하여 계약을 독점할 수 있는 근거를 제공합니다.
                </li>
                <li>
                  <strong style={{ color: '#0f172a' }}>[상세 분석 4개 카드]:</strong> 각 6단계 심사에서 "왜 이런 결론을 내렸는지" AI의 사고 논리 체계를 자연어로 풀어서 설명합니다. 단순히 "신용등급 A"라고 보여주는 것을 넘어, "이 신용도가 보험 대위권 행사에 어떤 영향을 미치는지"까지 실무적 관점으로 분석합니다.
                </li>
                <li>
                  <strong style={{ color: '#0f172a' }}>[초록색 레이더 차트]:</strong> 파란색 점선은 '동종 업계의 평균 방어선'입니다. 대상 기업이 이 파란 점선 바깥으로 넓게 펼쳐져 있다면 모든 역량에서 타 경쟁사를 압도하고 있음을 시각적으로 입증합니다.
                </li>
                <li>
                  <strong style={{ color: '#0f172a' }}>[하단 누적 그래프 동향]:</strong> 과거 5년의 청구 건수와 위험 지수를 교차 검사하여, 회사가 "일시적 관리형"인지 "지속 개선 가능형"인지 꿰뚫어 볼 수 있습니다.
                </li>
              </ul>
            </div>
            <div style={{ padding: '20px 32px', borderTop: '1px solid #e2e8f0', background: '#f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
               <button onClick={() => setShowGuide(false)} style={{ background: '#002A7A', color: 'white', padding: '10px 32px', borderRadius: 8, cursor: 'pointer', border: 'none', fontWeight: 700, fontSize: 15, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>숙지 완료 (Close)</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

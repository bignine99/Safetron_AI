'use client';

import React, { useState } from 'react';
import { 
  CloudLightning, AlertTriangle, Layers, Percent, Thermometer, ShieldOff,
  GitMerge, Database, Search, ShieldAlert, FileText, Cpu, Info, X, DollarSign, Activity, Maximize2
} from 'lucide-react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ChartOptions
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend
);

const MOCK_MATRIX_ROWS = ['해체/철거', '굴착/토공', '철근/콘크리트', '건축마감', '설비/전기'];
const MOCK_MATRIX_COLS = ['시스템비계', '타워크레인', '토류벽/흙막이', '고소작업대'];
const MATRIX_DATA = [
  // 해체/철거
  [95, 45, 60, 88],
  // 굴착/토공
  [20, 50, 92, 15],
  // 철근/콘크리트
  [76, 85, 30, 42],
  // 건축마감
  [82, 10, 15, 78],
  // 설비/전기
  [45, 20, 10, 65]
];

const WEATHER_CORRELATION = {
  labels: ['정상 기온', '폭염(33℃+)', '한파(-10℃-)', '집중호우', '강풍(10m/s+)'],
  datasets: [
    {
      type: 'line' as const,
      label: '치명적 노드 발생률(%)',
      data: [15, 48, 42, 65, 82],
      borderColor: '#ef4444',
      backgroundColor: '#ef4444',
      borderWidth: 2,
      tension: 0.4,
      yAxisID: 'y1',
    },
    {
      type: 'bar' as const,
      label: '예상 최대 손실액 (단위: 억 원)',
      data: [2.5, 5.2, 4.8, 8.5, 12.0],
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      borderRadius: 4,
      yAxisID: 'y',
    }
  ],
};

const weatherChartOptions: ChartOptions = {
  maintainAspectRatio: false,
  scales: {
    y: { type: 'linear', position: 'left', title: { display: true, text: '최대 손실액 (억 원)' } },
    y1: { type: 'linear', position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: '확률 지수 (%)' }, min: 0, max: 100 }
  },
  plugins: { legend: { position: 'top' as const } }
};

export default function CoverageHeatmap() {
  const [showGuide, setShowGuide] = useState(false);

  // Helper to calculate color intensity for heatmap cell
  const getCellColor = (value: number) => {
    if (value >= 85) return { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' };
    if (value >= 70) return { bg: '#ffedd5', text: '#9a3412', border: '#fdba74' };
    if (value >= 50) return { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' };
    if (value >= 30) return { bg: '#f0fdf4', text: '#166534', border: '#86efac' };
    return { bg: '#f8fafc', text: '#475569', border: '#e2e8f0' };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: "'Pretendard', sans-serif", background: '#f8fafc', overflowY: 'auto' }}>
      
      {/* ══════════ Header ══════════ */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 80, padding: '0 40px', background: '#002A7A', flexShrink: 0,
      }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Layers size={24} color="#93c5fd" /> 고도화 특약 리스크 맵 (Coverage Heatmap & Exclusion Models)
          </h1>
        </div>
        <button onClick={() => setShowGuide(true)} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '8px 16px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
          <Info size={16} /> 파라미터 해석 가이드
        </button>
      </div>

      <div style={{ padding: '40px 32px', maxWidth: 1400, margin: '0 auto', width: '100%' }}>
        
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a' }}>지능형 사고 노드 교차 검증 (AI Node Intersection)</h2>
          <p style={{ marginTop: 8, fontSize: 15, color: '#475569', maxWidth: 900, lineHeight: 1.6 }}>
            과거 3.7만건의 중대재해 레코드에서 추출된 9대 클래스를 2차원 매트릭스로 투영하여 극단적 손실(Tail Risk) 구간을 식별합니다. 
            위험 지수(VaR Index)가 85를 초과하는 하드-레드 엣지(Hard-Red Edge) 구간은 인수 제한(Exclusion) 또는 징벌적 할증이 반드시 필요합니다.
          </p>
        </div>

        {/* ══════════ KPI Ticker Cards ══════════ */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 40 }}>
          
          <div style={{ background: '#fff', padding: 24, borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ padding: 10, borderRadius: 8, background: '#fee2e2' }}><ShieldOff size={20} color="#b91c1c" /></div>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>최대 노출 리스크 노드 (Max VaR Node)</h3>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#b91c1c', marginBottom: 8, display: 'flex', alignItems: 'baseline', gap: 8 }}>
              해체/철거 <span style={{ color: '#cbd5e1' }}>+</span> 시스템비계
            </div>
            <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.5, background: '#f8fafc', padding: 12, borderRadius: 6, border: '1px solid #e2e8f0' }}>
               손실 통제 임계점 돌파 구역입니다. 붕괴 및 다중 추락 사고의 95%가 해당 기인물 속성에서 파생되며, 예상 최대 손실액(PML)은 14.5억에 달합니다. 
            </div>
          </div>
          
          <div style={{ background: '#fff', padding: 24, borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ padding: 10, borderRadius: 8, background: '#e0e7ff' }}><Activity size={20} color="#4338ca" /></div>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>복합공종 상호작용 위험 (Interaction Risk)</h3>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#4338ca', marginBottom: 8 }}>
              상관계수 <span style={{ fontFamily: 'monospace' }}>ρ = +0.87</span>
            </div>
            <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.5, background: '#f8fafc', padding: 12, borderRadius: 6, border: '1px solid #e2e8f0' }}>
               굴착 공종의 '토류벽/흙막이' 붕괴는 인접 구조물 손상 담보(Third-Party Liability) 청구와 매우 강력한 양의 상관관계를 갖습니다. 엄격한 특약 통제가 요구됩니다.
            </div>
          </div>

          <div style={{ background: '#fff', padding: 24, borderRadius: 8, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ padding: 10, borderRadius: 8, background: '#fef3c7' }}><Database size={20} color="#d97706" /></div>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>시스템 계리 요율 방어 가이드 </h3>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#d97706', marginBottom: 8 }}>
              기초율 대비 <span style={{ color: '#b91c1c' }}>+125%</span> 할증
            </div>
            <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.5, background: '#f8fafc', padding: 12, borderRadius: 6, border: '1px solid #e2e8f0' }}>
               하이-리스크 노드가 3개 이상 점등된 현장입니다. 표준 영업 요율을 적용할 경우 인수 거절 대외 명분이 발생하며, 서브-리밋(Sub-Limit) 제약을 걸어야 합니다.
            </div>
          </div>
        </div>

        {/* ══════════ Matrix ══════════ */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 40 }}>
          
          <div style={{ gridColumn: 'span 2', background: '#fff', padding: 32, borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
              <GitMerge size={18} color="#002A7A"/> 공종(Activity) - 기인물(Cause Object) 교차 히트맵
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Header Row */}
              <div style={{ display: 'flex', borderBottom: '2px solid #cbd5e1', paddingBottom: 12, marginBottom: 12 }}>
                <div style={{ width: 140, fontWeight: 800, fontSize: 13, color: '#64748b' }}>작업 공종 분류</div>
                {MOCK_MATRIX_COLS.map((col, cIdx) => (
                  <div key={cIdx} style={{ flex: 1, textAlign: 'center', fontWeight: 800, fontSize: 13, color: '#64748b' }}>{col}</div>
                ))}
              </div>
              
              {/* Data Rows */}
              {MOCK_MATRIX_ROWS.map((row, rIdx) => (
                <div key={rIdx} style={{ display: 'flex', alignItems: 'center', minHeight: 64, borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ width: 140, fontWeight: 700, fontSize: 14, color: '#334155' }}>{row}</div>
                  {MATRIX_DATA[rIdx].map((val, cIdx) => {
                    const style = getCellColor(val);
                    return (
                      <div key={cIdx} style={{ flex: 1, padding: '4px 8px' }}>
                        <div style={{ 
                          background: style.bg, border: `1px solid ${style.border}`, color: style.text,
                          height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          borderRadius: 6, fontWeight: 800, fontSize: 16, fontFamily: 'monospace',
                          transition: 'transform 0.2s', cursor: 'pointer'
                        }} 
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                          {val}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12, fontSize: 12, color: '#64748b', fontWeight: 600 }}>
              <span>Low Risk (0-30)</span>
              <div style={{ width: 16, height: 16, background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 4 }}/>
              <span style={{ marginLeft: 16 }}>Critical Risk (85+)</span>
              <div style={{ width: 16, height: 16, background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 4 }}/>
            </div>
          </div>

          <div style={{ gridColumn: 'span 1', background: '#fff', padding: 32, borderRadius: 8, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 24, borderBottom: '1px solid #e2e8f0', paddingBottom: 16 }}>엔지니어링 특약 가이드라인</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, flex: 1 }}>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 800, color: '#b91c1c', marginBottom: 8 }}>[Red Zone] 인수 거절 및 조건부 승인</h4>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: '#475569', background: '#fef2f2', padding: 12, borderRadius: 6, border: '1px solid #fecaca' }}>
                  해체/철거 공정에 <strong>시스템비계</strong>가 투입되는 현장은 지식그래프망 분석 결과 추락/붕괴 노드 집중도가 상위 5% 내에 진입합니다. 
                  해당 작업 구간 명시적 보상 제외 특약(Exclusion Clause) 설정을 강력히 권고합니다.
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 800, color: '#d97706', marginBottom: 8 }}>[Yellow Zone] 요율 할증 타겟팅</h4>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: '#475569', background: '#fffbeb', padding: 12, borderRadius: 6, border: '1px solid #fde68a' }}>
                  타워크레인이 투입되는 철근/콘크리트 현장은 물적 담보 한도액을 초과하는 잠재적 책임(Liability) 노출이 존재합니다. 
                  대인/대물 한도 상쇄(Offset) 기법을 사용하여 계리 포트폴리오를 조정해야 합니다.
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 800, color: '#15803d', marginBottom: 8 }}>[Green Zone] 안전 마진 획득 가능 영역</h4>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: '#475569', background: '#f0fdf4', padding: 12, borderRadius: 6, border: '1px solid #bbf7d0' }}>
                  건축마감+고소작업대 조합은 데이터베이스 상 과거 5년간 중대 손상 발생 빈도가 통계적으로 무의미합니다. 해당 구획에 대해서는 공격적인 요율 인하를 통한 시장 지배력 확보가 가능합니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════ Weather / Metadata Correlator ══════════ */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 40 }}>
          <div style={{ gridColumn: 'span 2', background: '#fff', padding: 32, borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
              <CloudLightning size={18} color="#002A7A"/> 메타-기상 데이터와 잔여 손상도(Residual Damage)의 상관관계 함수
            </h3>
            <div style={{ height: 320 }}>
              <Bar data={WEATHER_CORRELATION} options={weatherChartOptions} />
            </div>
          </div>

          <div style={{ gridColumn: 'span 1', background: '#fff', padding: 32, borderRadius: 8, color: '#0f172a', border: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: -20, top: -20, opacity: 0.05, color: '#0f172a' }}><Thermometer size={140} /></div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 24, borderBottom: '1px solid #e2e8f0', paddingBottom: 16 }}>기상/환경 민감도 분석 결론</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: '#475569' }}>
                 기상 데이터 메타분석 결과, 강풍(10m/s 이상) 발생 시 타워크레인 및 비계류 기인물의 구조 파괴 엣지가 평시 대비 <strong style={{color: '#b91c1c'}}>4.2배 폭증</strong>합니다. 이는 손해액 분포의 롱테일(Long-tail)을 형성합니다.
              </p>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: '#475569' }}>
                 집중호우 시 토목 기반 흙막이 지보공 붕괴 확률 인덱스가 65%에 육박합니다. 지하 굴착 공정이 진행되는 중소형 현장의 경우 국지성 호우 특보 발효 시 <strong style={{color: '#b91c1c'}}>명시적 작업 분리 및 면책 조항</strong>을 발동시켜야 합니다.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* ══════════ Guide Modal ══════════ */}
      {showGuide && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#ffffff', width: 700, borderRadius: 8, overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 24, borderBottom: '1px solid #e2e8f0', background: '#002A7A', color: 'white' }}>
               <h2 style={{ fontSize: 18, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10 }}><Maximize2 size={20} />모델링 변수 통제 가이드 (Engineering Guideline)</h2>
               <button onClick={() => setShowGuide(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={22}/></button>
            </div>
            <div style={{ padding: 32, maxHeight: '65vh', overflowY: 'auto' }}>
              <div style={{ background: '#f8fafc', padding: 20, borderRadius: 6, borderLeft: '4px solid #3b82f6', marginBottom: 32 }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>교차 히트맵 (Matrix) 판독 원칙</h3>
                <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.7 }}>
                  수만 건의 재해 텍스트에서 분리해 낸 '공종'과 '기인물' 간의 벡터 거리(Vector Distance)를 측정하여 재해 밀도를 계산합니다. 진한 빨간색(점수 85 초과) 구역은 단일 사고로 회사에 치명적 배상금 청구를 발생시킬 수 있는 '손실 통제 불능 블록'을 의미합니다.
                </p>
              </div>

              <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>리스크 방어(Hedging)를 위한 활용</h3>
              <ul style={{ fontSize: 14, color: '#475569', lineHeight: 1.8, paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                <li>
                  <strong style={{ color: '#0f172a' }}>초과손해액 집중구간(VaR):</strong> 점수가 높은 블록이 다수 포진한 공사 도급 건의 경우 공동인수(Co-insurance) 기법을 통해 보상 책임을 필멸적으로 분산해야 합니다.
                </li>
                <li>
                  <strong style={{ color: '#0f172a' }}>기상 이변 계수 결합:</strong> 여름철 폭우 및 겨울철 강풍 등 기상 위험이 극도로 높아지는 분기에는 대시보드의 '강풍 지표'를 차용하여 약관상 태풍 및 기상이변 부담금을 상향 조정하십시오.
                </li>
              </ul>
            </div>
            <div style={{ padding: '20px 32px', borderTop: '1px solid #e2e8f0', background: '#f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
               <button onClick={() => setShowGuide(false)} style={{ background: '#002A7A', color: 'white', padding: '10px 32px', borderRadius: 8, cursor: 'pointer', border: 'none', fontWeight: 700, fontSize: 15, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>엔지니어링 매뉴얼 확인 (Close)</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

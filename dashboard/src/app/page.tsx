'use client';

import React, { useState, useEffect } from 'react';
import { 
  Database, Activity, Crosshair, BarChart2, Maximize, Target,
  PlayCircle, RefreshCcw, Binary
} from 'lucide-react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, 
  BarElement, Title, Tooltip, Legend, ArcElement, RadialLinearScale, RadarController, ScatterController, BubbleController
} from 'chart.js';
import { Bar, Radar, Doughnut, Bubble, Scatter, PolarArea } from 'react-chartjs-2';
import CardHeader from '@/components/CardHeader';
import {
  getSimValue, getCategoryData, getBubbleData, getRadarData, getGaugeData, heatmapBaseValues, sampleDB
} from '@/data/mockOverviewData';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, 
  RadialLinearScale, RadarController, ScatterController, BubbleController, Title, Tooltip, Legend
);

export default function DashboardOverviewLayout() {
  const [stats, setStats] = useState<any>(null);
  const [simulationMode, setSimulationMode] = useState<boolean>(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    fetch('/safetron/data/statistical_report.json')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(console.error);
  }, []);

  const categoryData = getCategoryData(simulationMode);
  const bubbleData = getBubbleData(simulationMode);
  const radarData = getRadarData(simulationMode);
  const gaugeData = getGaugeData(simulationMode);

  // Node styles configuration
  const nodeStyle = {
    padding: '24px', background: '#ffffff', borderWidth: '1px', borderStyle: 'solid', borderColor: '#cbd5e1', 
    borderRadius: '6px', transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
  };
  const nodeHoverStyle = {
    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)', transform: 'translateY(-2px)',
    borderColor: '#94a3b8'
  };



  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: "'Pretendard', sans-serif", background: '#f1f5f9', color: '#0f172a', overflowY: 'auto' }}>
      
      {/* ================= HEADER BANNERS ================= */}
      <div style={{ background: '#0f172a', padding: '16px 40px', color: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, borderBottom: '1px solid #334155' }}>
        <Database size={16} color="#94a3b8" />
        <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.05em' }}>국토안전원 사건사고 2025년 6월까지의 최근 10년간의 데이터 32,000 건을 활용하였습니다.</span>
      </div>

      <div style={{ padding: '32px 40px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            AI 기반 건설 안전 심사 종합 요약 (Overview)
          </h1>
          <p style={{ fontSize: 14, color: '#475569', fontWeight: 500 }}>
            9대 계층적 지식그래프망(Knowledge Graph)과 정밀 시뮬레이션을 통해 리스크를 입체적으로 조망합니다.
          </p>
        </div>
        <button 
          onClick={() => setSimulationMode(!simulationMode)}
          style={{
            background: simulationMode ? '#1e40af' : '#ffffff', color: simulationMode ? '#ffffff' : '#0f172a',
            border: simulationMode ? '1px solid #1e40af' : '1px solid #cbd5e1', 
            borderRadius: '6px', padding: '10px 20px', fontSize: 13, fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', transition: 'all 0.3s ease',
            boxShadow: simulationMode ? '0 4px 12px rgba(30, 64, 175, 0.3)' : '0 2px 4px rgba(0,0,0,0.02)'
          }}
        >
          {simulationMode ? <RefreshCcw size={16} className="animate-spin" /> : <PlayCircle size={16} />}
          {simulationMode ? 'AI 예측 시뮬레이션 가동 중' : '시나리오 데이터 시뮬레이션 켜기'}
        </button>
      </div>

      <div style={{ padding: '32px 40px', maxWidth: 1600, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        
        {/* ================= 3 KEY METRICS CARDS ================= */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 40 }}>
          {[
            { title: '데이터 분석 목적', icon: Target, desc: '과거 10년간의 32,000건 방대한 산재 데이터를 기반으로 기인물과 사고 유형 간의 딥러닝 패턴을 도출하여 미래 중대재해 발생률을 AI로 사전 차단합니다.' },
            { title: '핵심 내용 및 9대 노드', icon: Binary, desc: '시공사, 대공종, 기인물, 작업상황 등 9개의 핵심 객체를 연결망(Edges)으로 재구성하여, 단순 통계가 아닌 인과 기반의 연쇄 분석 결과를 제공합니다.' },
            { title: '실무 보험 심사 활용', icon: Activity, desc: '산출된 각 현장별/공사별 Risk Index(위험지수)를 바탕으로 합리적인 인수(Underwriting) 판단과 할인/할증 요율 시뮬레이션을 즉각적으로 수행할 수 있습니다.' },
          ].map((card, i) => (
            <div key={i} style={{ background: '#ffffff', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '24px', transition: 'transform 0.3s', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }} onMouseEnter={(e) => e.currentTarget.style.transform='translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform='none'}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ background: '#f1f5f9', padding: '10px', borderRadius: '6px' }}><card.icon size={20} color="#334155"/></div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>{card.title}</h3>
              </div>
              <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, fontWeight: 500 }}>{card.desc}</p>
            </div>
          ))}
        </div>

        {/* ================= 9 NODES GRAPHICS MATRIX ================= */}
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Crosshair size={20} color="#1e40af" /> 지식그래프 9대 노드 인덱스 분석 
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 60 }}>
          
          {/* Node 1: 공사종류 (Stacked Column) */}
          <div style={{...nodeStyle, ...hoveredNode==='n1'?nodeHoverStyle:{}}} onMouseEnter={()=>setHoveredNode('n1')} onMouseLeave={()=>setHoveredNode(null)}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 16, letterSpacing: '0.05em' }}>[NODE 01] 공사종류 (CATEGORY) - 누적 막대 차트</div>
            <div style={{ height: 220 }}>
              <Bar data={categoryData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: {size: 11} } } }, scales: { x: { stacked: true, grid: {display: false} }, y: { stacked: true } } }} />
            </div>
          </div>

          {/* Node 2: 사고유형 vs 피해 (Bubble) */}
          <div style={{...nodeStyle, ...hoveredNode==='n2'?nodeHoverStyle:{}}} onMouseEnter={()=>setHoveredNode('n2')} onMouseLeave={()=>setHoveredNode(null)}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 16, letterSpacing: '0.05em' }}>[NODE 02 & 09] 사고유형 및 피해 (TYPE & FATALITY) - 버블 차트</div>
            <div style={{ height: 220 }}>
              <Bubble data={bubbleData} options={{ responsive: true, maintainAspectRatio: false, plugins: {legend:{display:false}}, scales: {x:{title:{display:true, text:'빈도'}}, y:{title:{display:true, text:'심도'}}} }} />
            </div>
          </div>

          {/* Node 3: 기인물 (Radar) */}
          <div style={{...nodeStyle, ...hoveredNode==='n3'?nodeHoverStyle:{}}} onMouseEnter={()=>setHoveredNode('n3')} onMouseLeave={()=>setHoveredNode(null)}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 10, letterSpacing: '0.05em' }}>[NODE 04] 기인물 (OBJECT) - 방사형 차트</div>
            <div style={{ height: 230 }}>
              <Radar data={radarData} options={{ responsive: true, maintainAspectRatio: false, plugins: {legend:{display:false}}, scales: { r: { ticks: {display: false} } } }} />
            </div>
          </div>

          {/* Node 4: 대공종 (Treemap Proxy via Deep Flex) */}
          <div style={{...nodeStyle, ...hoveredNode==='n4'?nodeHoverStyle:{}}} onMouseEnter={()=>setHoveredNode('n4')} onMouseLeave={()=>setHoveredNode(null)}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 16, letterSpacing: '0.05em' }}>[NODE 03] 대공종 (PROCESS) - 수형도 (Treemap)</div>
            <div style={{ height: 220, display: 'flex', gap: 4 }}>
              <div style={{ flex: getSimValue(5, 0.4, simulationMode), background: '#0f172a', borderRadius: '6px', padding: 8, color: '#fff', fontSize: 11, fontWeight: 600, display: 'flex', flexDirection:'column' }}>
                <span>철근콘크리트공사</span><span style={{ fontSize: 18, marginTop: 'auto' }}>{getSimValue(38, 0.2, simulationMode)}%</span>
              </div>
              <div style={{ flex: 3, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ flex: getSimValue(2, 0.2, simulationMode), background: '#334155', borderRadius: '6px', padding: 8, color: '#fff', fontSize: 11, fontWeight: 600 }}>가설공사<br/>{getSimValue(21, 0.1, simulationMode)}%</div>
                <div style={{ flex: 1, display: 'flex', gap: 4 }}>
                  <div style={{ flex: 2, background: '#475569', borderRadius: '6px', padding: 8, color: '#fff', fontSize: 10, fontWeight: 600 }}>토공<br/>{getSimValue(12, 0.1, simulationMode)}%</div>
                  <div style={{ flex: 1, background: '#94a3b8', borderRadius: '6px', padding: 8, color: '#fff', fontSize: 10, fontWeight: 600 }}>기타<br/>{getSimValue(8, 0.1, simulationMode)}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Node 5: 사고원인 (Heatmap Proxy) */}
          <div style={{...nodeStyle, ...hoveredNode==='n5'?nodeHoverStyle:{}}} onMouseEnter={()=>setHoveredNode('n5')} onMouseLeave={()=>setHoveredNode(null)}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 16, letterSpacing: '0.05em' }}>[NODE 05] 사고원인 (CAUSE) - 열지도 (Heat Map)</div>
            <div style={{ height: 220, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(3, 1fr)', gap: 4 }}>
              {heatmapBaseValues.map((baseHeat, i) => {
                const heat = getSimValue(baseHeat, 0.5, simulationMode);
                const isHot = heat > 70;
                return (
                  <div key={i} style={{ 
                    background: `rgba(15, 23, 42, ${heat/100 * 0.8 + 0.1})`, 
                    borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: isHot ? '#fff' : '#475569', fontSize: 11, fontWeight: 700, transition: 'all 0.3s'
                  }}>
                    {heat}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Node 6: 위험지수 게이지 */}
          <div style={{...nodeStyle, ...hoveredNode==='n6'?nodeHoverStyle:{}}} onMouseEnter={()=>setHoveredNode('n6')} onMouseLeave={()=>setHoveredNode(null)}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 16, letterSpacing: '0.05em' }}>[NODE 06] 시공사 (COMPANY) - 위험도 게이지 (Gauge)</div>
            <div style={{ height: 160, position: 'relative', display: 'flex', justifyContent: 'center', marginTop: 30 }}>
              <div style={{ width: 220 }}>
                <Doughnut data={gaugeData} options={{ responsive: true, maintainAspectRatio: false, plugins: { tooltip: {enabled: false} }, cutout: '75%' }} />
              </div>
              <div style={{ position: 'absolute', top: 100, textAlign: 'center' }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: '#0f172a' }}>{getSimValue(76, 0.4, simulationMode)}</div>
                <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Risk Score</div>
              </div>
            </div>
          </div>

        </div>

        {/* ================= DATA TABLE (Sample 50 rows) ================= */}
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Database size={20} color="#1e40af" /> 핵심 9대 노드 분석 Raw Data (샘플 50건)
        </h2>
        
        <div style={{ background: '#ffffff', borderRadius: '6px', border: '1px solid #cbd5e1', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', marginBottom: 100 }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
                  {['사고ID', '시공사(N1)', '공사종류(N2)', '대공종(N3)', '기인물(N4)', '사고원인(N5)', '작업상황(N6)', '장소(N7)', '사고유형(N8)', '피해(N9)'].map(header => (
                    <th key={header} style={{ padding: '14px 16px', fontSize: 12, fontWeight: 700, color: '#475569', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sampleDB.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#ffffff' : '#f8fafc', transition: 'background 0.2s', cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f0f9ff'}
                      onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? '#ffffff' : '#f8fafc'}
                  >
                    <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#1e40af' }}>{row.id}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#334155', fontWeight: 500 }}>{row.company}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#334155' }}>{row.category}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#334155' }}>{row.process}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#334155' }}>{row.object}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#334155' }}>{row.cause}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#334155' }}>{row.status}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#334155' }}>{row.location}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, fontWeight: 600, color: '#b91c1c' }}>{row.type}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#334155' }}>{row.fatality}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

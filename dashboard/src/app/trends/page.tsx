'use client';

import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, ComposedChart, BarChart, Bar, ScatterChart, Scatter, ZAxis, Cell,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import CardHeader from '@/components/CardHeader';

// Data will be fetched via JSON

export default function AccidentTrendsDashboard() {
  const [stats, setStats] = React.useState<any>(null);

  React.useEffect(() => {
    fetch('/safetron/data/statistical_report.json')
      .then(res => res.json())
      .then(json => setStats(json))
      .catch(console.error);
  }, []);

  if (!stats) return <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading Trends Database...</div>;

  const numeric = stats.descriptive.numeric;
  const areaHist = numeric.find((n: any) => n.feature === '연면적')?.histogram || [];
  const costHist = numeric.find((n: any) => n.feature === '피해금액_정규화(만원)')?.histogram || [];
  
  const tempHist = numeric.find((n: any) => n.feature === '온도')?.histogram || [];
  const humHist = numeric.find((n: any) => n.feature === '습도')?.histogram || [];
  const processHist = numeric.find((n: any) => n.feature === '공정율')?.histogram || [];
  const workersHist = numeric.find((n: any) => n.feature === '작업자수_정규화(명)')?.histogram || [];

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100vh',
      fontFamily: "'Pretendard', 'Inter', sans-serif",
      color: 'var(--text-secondary)', background: 'var(--bg-root)',
    }}>
      {/* ══════════ Header ══════════ */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 80, boxSizing: 'border-box', padding: '0 40px', borderBottom: 'none',
        background: '#002A7A', flexShrink: 0,
      }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', fontFamily: "'Inter', 'Pretendard', sans-serif" }}>
            사고 추이 분석
          </h1>
          <p style={{ fontSize: 11, color: '#93c5fd', letterSpacing: '0.08em', marginTop: 3, fontFamily: "'Inter', monospace" }}>
            TIME-SERIES ACCIDENT TRENDS
          </p>
        </div>
      </div>

      {/* ══════════ Body ══════════ */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }} className="custom-scrollbar">
        <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, padding: 24, marginBottom: 24 }}>
          <CardHeader title="연면적별 사고 빈도 추이" subtitle="Accidents Volume by Gross Area" />
          <div style={{ width: '100%', minHeight: 320, height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={areaHist}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorAccidents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="bin" stroke="#94a3b8" tick={{fontSize: 10}} />
                <YAxis stroke="#94a3b8" tick={{fontSize: 10}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Legend />
                <Area type="monotone" name="빈도수" dataKey="count" stroke="#06b6d4" fillOpacity={1} fill="url(#colorAccidents)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, padding: 24 }}>
          <CardHeader title="공정률 분율 선행지표" subtitle="Accidents Density over Workflow Completion %" />
          <div style={{ width: '100%', minHeight: 320, height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={processHist}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="bin" stroke="#94a3b8" tick={{fontSize: 10}} />
                <YAxis stroke="#94a3b8" tick={{fontSize: 10}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Line type="stepAfter" dataKey="count" name="위험수위 밀도" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 5, fill: '#8b5cf6' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginTop: 40, marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid var(--border-subtle)' }}>
          재해 규모 분석 (Financial Impact)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))', gap: 20, marginBottom: 24 }}>
          <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column' }}>
            <CardHeader title="재해 손실액 히스토그램" subtitle="Cost Density Analysis (만원)" />
            <div style={{ flex: 1, width: '100%', minHeight: 320, height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={costHist}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="bin" stroke="#94a3b8" tick={{fontSize: 10}} />
                  <YAxis stroke="#94a3b8" tick={{fontSize: 10}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Legend />
                  <Bar dataKey="count" name="발생건수" barSize={32} fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column' }}>
            <CardHeader title="현장 투입 작업자별 밀도" subtitle="Accidents Density Matrix per Normalized Workers" />
            <div style={{ flex: 1, width: '100%', minHeight: 320, height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={workersHist} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                  <XAxis dataKey="bin" name="작업자" stroke="#94a3b8" tick={{fontSize: 10}} />
                  <YAxis stroke="#94a3b8" tick={{fontSize: 10}} />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }} 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Legend />
                  <Line type="monotone" name="빈도 분포" dataKey="count" stroke="#8b5cf6" strokeWidth={3} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginTop: 40, marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid var(--border-subtle)' }}>
          환경 요인 분석 (Weather & Environmental Factors)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))', gap: 20 }}>
          <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column' }}>
            <CardHeader title="기상(온도) 상태별 빈도분포" subtitle="Risk Exposure by Temperature" />
            <div style={{ flex: 1, width: '100%', minHeight: 320, height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={tempHist} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="bin" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                  <Area type="monotone" dataKey="count" name="온도 대역 빈도" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column' }}>
            <CardHeader title="환경(습도) 상태별 빈도분포" subtitle="Frequent Accidents by Humidity" />
            <div style={{ flex: 1, width: '100%', minHeight: 320, height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={humHist} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="bin" stroke="#94a3b8" tick={{fontSize: 10}} />
                  <YAxis stroke="#94a3b8" tick={{fontSize: 10}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    cursor={{fill: 'rgba(226, 232, 240, 0.4)'}} 
                  />
                  <Legend />
                  <Bar dataKey="count" name="다발 빈도" fill="#06b6d4" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

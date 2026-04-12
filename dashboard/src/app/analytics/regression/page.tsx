'use client';

import React, { useEffect, useState } from 'react';
import { 
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, ReferenceLine
} from 'recharts';
import CardHeader from '@/components/CardHeader';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function RegressionPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/statistical_report.json')
      .then(res => res.json())
      .then(json => {
        setData(json.regression);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-slate-500 font-medium">데이터 로딩 중...</div>;
  if (!data) return <div className="p-8 text-red-500 font-medium">통계 데이터를 불러오지 못했습니다.</div>;

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
            심층 회귀 분석 모델
          </h1>
          <p style={{ fontSize: 11, color: '#93c5fd', letterSpacing: '0.08em', marginTop: 3, fontFamily: "'Inter', monospace" }}>
            LINEAR & MULTIPLE REGRESSION ANALYSIS
          </p>
        </div>
      </div>

      {/* ══════════ Body ══════════ */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }} className="custom-scrollbar">
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid var(--border-subtle)' }}>
            단일 선형 회귀 분석 (Simple Linear Regression)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
            {data.simple.map((mod: any, idx: number) => {
              return (
                <div key={idx} style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column' }}>
                   <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.4 }}>
                     Y: {mod.y} <br/>
                     <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>X: {mod.x}</span>
                   </div>
                   
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-elevated)', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border-subtle)', marginBottom: 16 }}>
                     <div style={{ fontSize: 12 }}><span style={{ color: 'var(--text-muted)' }}>R²:</span> <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{mod.r2.toFixed(4)}</span></div>
                     <div style={{ fontSize: 12 }}><span style={{ color: 'var(--text-muted)' }}>Coef:</span> <span style={{ fontWeight: 600, color: '#2563eb' }}>{mod.coef.toFixed(4)}</span></div>
                     <div style={{ fontSize: 12 }}><span style={{ color: 'var(--text-muted)' }}>P:</span> <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{mod.p_value < 0.001 ? '<0.001' : mod.p_value.toFixed(4)}</span></div>
                   </div>

                   <div style={{ flex: 1, width: '100%', minHeight: 220, height: 220 }}>
                     <ResponsiveContainer width="100%" height="100%">
                       <ScatterChart margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
                         <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                         <XAxis type="number" dataKey="x" name={mod.x} tick={{fontSize:10}} stroke="#94a3b8" />
                         <YAxis type="number" dataKey="y" name={mod.y} tick={{fontSize:10}} stroke="#94a3b8" />
                         <RechartsTooltip cursor={{strokeDasharray: '3 3'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontSize: '12px' }} />
                         <Scatter name="Data" data={mod.chart_data} fill={COLORS[(idx + 2) % COLORS.length]} opacity={0.6} />
                       </ScatterChart>
                     </ResponsiveContainer>
                   </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid var(--border-subtle)' }}>
            다중 회귀 분석 (Multiple Regression)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))', gap: 20 }}>
            {data.multiple.map((mod: any, idx: number) => {
              const chartData = mod.chart_data.map((d: any) => ({ ...d, error: Math.abs(d.actual - d.predicted) }));
              return (
                <div key={idx} style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column' }}>
                   <CardHeader title={`종속변수: ${mod.y}`} subtitle={`R² Score: ${mod.r2.toFixed(4)}`} />
                   
                   <div style={{ background: 'var(--bg-elevated)', borderRadius: 8, border: '1px solid var(--border-subtle)', padding: 12, marginBottom: 16 }}>
                     <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8, fontFamily: "'Inter', monospace" }}>
                       독립 변수 기여도 (Coefficients)
                     </div>
                     {Object.keys(mod.coefs).map((feat) => (
                       <div key={feat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                         <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{feat}</span>
                         <div style={{ display: 'flex', gap: 16 }}>
                           <span style={{ fontSize: 12, color: 'var(--text-muted)', width: 60, textAlign: 'right' }}>
                             P: {mod.p_values[feat] < 0.001 ? '<0.001' : mod.p_values[feat]}
                           </span>
                           <span style={{ fontSize: 13, fontWeight: 600, width: 60, textAlign: 'right', color: mod.coefs[feat] > 0 ? '#2563eb' : '#ef4444' }}>
                             {mod.coefs[feat].toFixed(4)}
                           </span>
                         </div>
                       </div>
                     ))}
                   </div>

                   <div style={{ width: '100%', height: 280, marginTop: 'auto' }}>
                     <p style={{ fontSize: 11, fontWeight: 600, textAlign: 'center', color: 'var(--text-muted)', marginBottom: 8 }}>
                       실제값 (Actual) vs 예측값 (Predicted)
                     </p>
                     <ResponsiveContainer width="100%" height="100%">
                       <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                         <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                         <XAxis type="number" dataKey="actual" name="Actual" tick={{fontSize:10}} stroke="#94a3b8" />
                         <YAxis type="number" dataKey="predicted" name="Predicted" tick={{fontSize:10}} stroke="#94a3b8" />
                         <RechartsTooltip cursor={{strokeDasharray: '3 3'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                         <Scatter name="Actual vs Predicted" data={chartData} fill={COLORS[idx % COLORS.length]} opacity={0.6} />
                       </ScatterChart>
                     </ResponsiveContainer>
                   </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

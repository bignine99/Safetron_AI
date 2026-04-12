'use client';

import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, ReferenceLine
} from 'recharts';
import CardHeader from '@/components/CardHeader';

export default function CorrelationPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/statistical_report.json')
      .then(res => res.json())
      .then(json => {
        setData(json.correlation);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-slate-500 font-medium">데이터 로딩 중...</div>;
  if (!data) return <div className="p-8 text-red-500 font-medium">통계 데이터를 불러오지 못했습니다.</div>;

  // Filter top 30 strongest correlations
  const sortedData = [...data].sort((a, b) => Math.abs(b.r) - Math.abs(a.r)).slice(0, 30);
  const chartData = sortedData.map(d => ({
    name: `${d.var1} ↔ ${d.var2}`,
    r: d.r,
    absR: Math.abs(d.r),
    p: d.p
  }));

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
            다변량 상관관계 분석
          </h1>
          <p style={{ fontSize: 11, color: '#93c5fd', letterSpacing: '0.08em', marginTop: 3, fontFamily: "'Inter', monospace" }}>
            PEARSON CORRELATION MATRIX ANALYSIS
          </p>
        </div>
      </div>

      {/* ══════════ Body ══════════ */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }} className="custom-scrollbar">
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid var(--border-subtle)' }}>
            상관관계가 높은 주요 변수 쌍 (Top 30)
          </div>
          <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, padding: 24 }}>
            <CardHeader title="Pearson Correlation Coefficient (r)" subtitle="피어슨 상관계수: 절대값이 1에 가까울수록 상관성이 높음" />
            <div style={{ width: '100%', marginTop: 24, height: 700 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 160, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={true} vertical={false} />
                  <XAxis type="number" domain={[-1, 1]} tick={{fontSize: 10}} stroke="#94a3b8" />
                  <YAxis dataKey="name" type="category" tick={{fontSize: 10}} stroke="#64748b" width={220} />
                  <ReferenceLine x={0} stroke="#94a3b8" />
                  <RechartsTooltip 
                    cursor={{fill: 'rgba(226, 232, 240, 0.4)'}} 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} 
                    formatter={(value: number) => [value.toFixed(4), '상관계수 (r)']}
                  />
                  <Bar dataKey="r" barSize={12} radius={2}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.r > 0 ? '#3b82f6' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {sortedData.slice(0, 15).map((item: any, idx: number) => (
              <div key={idx} style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, padding: 20 }}>
                 <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8, fontFamily: "'Inter', monospace" }}>
                   Rank #{idx+1}
                 </div>
                 <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>
                   {item.var1} <span style={{ color: 'var(--text-muted)', margin: '0 4px', fontWeight: 400 }}>vs</span> {item.var2}
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-elevated)', padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
                   <div style={{ display: 'flex', flexDirection: 'column' }}>
                     <span style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>r-value</span>
                     <span style={{ fontSize: 18, fontWeight: 700, color: item.r > 0 ? '#2563eb' : '#ef4444' }}>
                       {item.r > 0 ? '+' : ''}{item.r.toFixed(4)}
                     </span>
                   </div>
                   <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
                     <span style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>p-value</span>
                     <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
                       {item.p < 0.001 ? '< 0.001' : item.p.toFixed(4)}
                     </span>
                   </div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

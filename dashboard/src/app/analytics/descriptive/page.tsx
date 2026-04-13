'use client';

import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend
} from 'recharts';
import CardHeader from '@/components/CardHeader';

const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#facc15', '#10b981', '#f59e0b', '#6366f1'];
const PIE_COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#facc15'];

const accidentTypeData = [
  { name: '추락 (Fall)', value: 12500 },
  { name: '전도 (Slip/Trip)', value: 8300 },
  { name: '협착 (Caught In)', value: 6200 },
  { name: '맞음 (Struck By)', value: 5100 },
  { name: '충돌 (Collision)', value: 4800 },
];

const causeData = [
  { name: '작업자 부주의', value: 45 },
  { name: '안전수칙 미준수', value: 25 },
  { name: '시설물 결함', value: 15 },
  { name: '관리감독 소홀', value: 10 },
  { name: '기타', value: 5 },
];

const processData = [
  { process: '가설공사', accidents: 8500 },
  { process: '철근콘크리트', accidents: 7200 },
  { process: '토공사', accidents: 5400 },
  { process: '해체/철거', accidents: 4100 },
  { process: '마감/수장', accidents: 3800 },
  { process: '설비작업', accidents: 2600 }
];

function DynamicChart({ data, xKey, yKey, color }: { data: any[], xKey: string, yKey: string, color: string }) {
  if (!data) return null;
  const bins = data.length;

  if (bins <= 4) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%" cy="50%"
            innerRadius={60} outerRadius={90}
            paddingAngle={5}
            dataKey={yKey}
            nameKey={xKey}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
            ))}
          </Pie>
          <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
          <Legend wrapperStyle={{ fontSize: '11px' }} />
        </PieChart>
      </ResponsiveContainer>
    );
  } else if (bins >= 5 && bins <= 7) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart layout="vertical" data={data} margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={true} vertical={false} />
          <XAxis type="number" tick={{fontSize: 10}} stroke="#94a3b8" />
          <YAxis dataKey={xKey} type="category" tick={{fontSize: 10}} stroke="#64748b" width={80} />
          <RechartsTooltip cursor={{fill: 'rgba(226, 232, 240, 0.4)'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
          <Bar dataKey={yKey} fill={color} radius={[0, 4, 4, 0]} barSize={16}>
             {data.map((entry, index) => <Cell key={`cell-${index}`} fill={color} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  } else {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 25 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey={xKey} tick={{fontSize: 10}} stroke="#94a3b8" angle={-45} textAnchor="end" />
          <YAxis tick={{fontSize: 10}} stroke="#94a3b8" />
          <RechartsTooltip cursor={{fill: 'rgba(226, 232, 240, 0.4)'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
          <Bar dataKey={yKey} fill={color} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}

export default function DescriptiveStatsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/statistical_report.json')
      .then(res => res.json())
      .then(json => {
        setData(json.descriptive);
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
            사고 통계 현황
          </h1>
          <p style={{ fontSize: 11, color: '#93c5fd', letterSpacing: '0.08em', marginTop: 3, fontFamily: "'Inter', monospace" }}>
            ACCIDENT STATISTICS ANALYSIS
          </p>
        </div>
      </div>

      {/* ══════════ Body ══════════ */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }} className="custom-scrollbar">
        
        {/* === 사고 통계 현황 (기존 stats/page.tsx 부분) === */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid var(--border-subtle)' }}>
            주요 사고 유형 및 원인 분석
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))', gap: 20, marginBottom: 20 }}>
            <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column' }}>
              <CardHeader title="사고 유형별 분포" subtitle="Distribution by Accident Type" />
              <div style={{ flex: 1, width: '100%', minHeight: 320, height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={accidentTypeData}
                      cx="50%" cy="50%"
                      innerRadius={70} outerRadius={100} paddingAngle={5}
                      dataKey="value"
                    >
                      {accidentTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column' }}>
              <CardHeader title="주요 사고 원인 (비율 %)" subtitle="Primary Root Causes" />
              <div style={{ flex: 1, width: '100%', minHeight: 320, height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={causeData} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={true} vertical={false} />
                    <XAxis type="number" stroke="#94a3b8" tick={{fontSize: 10}} />
                    <YAxis dataKey="name" type="category" stroke="#64748b" width={90} tick={{fontSize: 10}} />
                    <RechartsTooltip cursor={{fill: 'rgba(226, 232, 240, 0.4)'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                    <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24}>
                      {causeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column' }}>
            <CardHeader title="작업 공종별 재해 발생 건수" subtitle="Accidents by Construction Process" />
            <div style={{ width: '100%', minHeight: 320, height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={processData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="process" stroke="#94a3b8" tick={{fontSize: 10}} />
                  <YAxis stroke="#94a3b8" tick={{fontSize: 10}} />
                  <RechartsTooltip cursor={{fill: 'rgba(226, 232, 240, 0.4)'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                  <Bar dataKey="accidents" fill="#06b6d4" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* === 기존 변수별 기술통계 === */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid var(--border-subtle)' }}>
            수치형 독립변수 및 종속변수 분포 (Numeric Variables)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
            {data.numeric.map((numData: any, idx: number) => (
              <div key={idx} style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column' }}>
                <CardHeader title={numData.feature} subtitle={`N=${numData.count} | Mean: ${numData.mean} | SD: ${numData.std}`} />
                <div style={{ flex: 1, width: '100%', marginTop: 8, minHeight: 250, height: 250 }}>
                  <DynamicChart 
                    data={numData.histogram} 
                    xKey="bin" 
                    yKey="count" 
                    color={COLORS[idx % COLORS.length]} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid var(--border-subtle)' }}>
            범주형 독립변수 기초통계 (Categorical Variables)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))', gap: 20 }}>
            {data.categorical.map((catData: any, idx: number) => (
              <div key={idx} style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column' }}>
                <CardHeader title={catData.feature} subtitle="빈도수 기반 상위 속성 (Top Categories)" />
                <div style={{ flex: 1, width: '100%', marginTop: 8, minHeight: 260, height: 260 }}>
                  <DynamicChart 
                    data={catData.counts} 
                    xKey="label" 
                    yKey="count" 
                    color={COLORS[(idx+3) % COLORS.length]} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

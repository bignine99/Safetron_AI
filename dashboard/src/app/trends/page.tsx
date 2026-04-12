'use client';

import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, ComposedChart, BarChart, Bar, ScatterChart, Scatter, ZAxis, Cell,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import CardHeader from '@/components/CardHeader';

const monthlyTrendData = [
  { month: '1월', accidents: 210, fatalities: 2 },
  { month: '2월', accidents: 180, fatalities: 1 },
  { month: '3월', accidents: 320, fatalities: 4 },
  { month: '4월', accidents: 450, fatalities: 3 },
  { month: '5월', accidents: 580, fatalities: 6 },
  { month: '6월', accidents: 610, fatalities: 5 },
  { month: '7월', accidents: 730, fatalities: 8 },
  { month: '8월', accidents: 690, fatalities: 7 },
  { month: '9월', accidents: 520, fatalities: 4 },
  { month: '10월', accidents: 480, fatalities: 3 },
  { month: '11월', accidents: 380, fatalities: 2 },
  { month: '12월', accidents: 290, fatalities: 1 },
];

const timeOfDayData = [
  { time: '06-08시', accidents: 120 },
  { time: '08-10시', accidents: 450 },
  { time: '10-12시', accidents: 890 },
  { time: '12-14시', accidents: 210 },
  { time: '14-16시', accidents: 1150 },
  { time: '16-18시', accidents: 580 },
  { time: '18-20시', accidents: 150 },
  { time: '20시 이후', accidents: 40 },
];

const financialImpactData = [
  { bracket: '1천만원 미만', count: 18500, averageCost: 50 },
  { bracket: '1-5천만원', count: 7200, averageCost: 250 },
  { bracket: '5-1억원', count: 3100, averageCost: 750 },
  { bracket: '1-5억원', count: 1200, averageCost: 2500 },
  { bracket: '5억원 이상', count: 350, averageCost: 8000 },
];

const constructionSizeVsCostData = [
  { size: '50억 미만', cost: 120, severity: 50 },
  { size: '100-300억', cost: 350, severity: 120 },
  { size: '300-500억', cost: 580, severity: 210 },
  { size: '500-1000억', cost: 890, severity: 340 },
  { size: '1000억 이상', cost: 1600, severity: 500 },
];

const COLORS = ['#0ea5e9', '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e'];

const weatherData = [
  { subject: '맑음 (Clear)', A: 120, B: 110, fullMark: 150 },
  { subject: '흐림 (Cloudy)', A: 98, B: 130, fullMark: 150 },
  { subject: '강우 (Rain)', A: 86, B: 130, fullMark: 150 },
  { subject: '강설 (Snow)', A: 99, B: 100, fullMark: 150 },
  { subject: '강풍 (Wind)', A: 85, B: 90, fullMark: 150 },
  { subject: '안개 (Fog)', A: 65, B: 85, fullMark: 150 },
];

const seasonData = [
  { name: '봄 (Spring)', '추락': 4000, '전도': 2400, '협착': 2400 },
  { name: '여름 (Summer)', '추락': 3000, '전도': 1398, '협착': 2210 },
  { name: '가을 (Autumn)', '추락': 2000, '전도': 9800, '협착': 2290 },
  { name: '겨울 (Winter)', '추락': 2780, '전도': 3908, '협착': 2000 },
];

export default function AccidentTrendsDashboard() {
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
          <CardHeader title="월별 재해/사망 사고 추이" subtitle="Monthly Accident & Fatality Trends" />
          <div style={{ width: '100%', minHeight: 320, height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyTrendData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorAccidents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorFatalities" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" tick={{fontSize: 10}} />
                <YAxis yAxisId="left" stroke="#94a3b8" tick={{fontSize: 10}} />
                <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" tick={{fontSize: 10}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Legend />
                <Area yAxisId="left" type="monotone" name="총 사고 건수" dataKey="accidents" stroke="#06b6d4" fillOpacity={1} fill="url(#colorAccidents)" />
                <Area yAxisId="right" type="monotone" name="사망자 수" dataKey="fatalities" stroke="#f43f5e" fillOpacity={1} fill="url(#colorFatalities)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, padding: 24 }}>
          <CardHeader title="시간대별 집중 사고 건수" subtitle="Accidents by Time of Day" />
          <div style={{ width: '100%', minHeight: 320, height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={timeOfDayData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" tick={{fontSize: 10}} />
                <YAxis stroke="#94a3b8" tick={{fontSize: 10}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Line type="stepAfter" dataKey="accidents" name="발생 위험구간" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 5, fill: '#8b5cf6' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginTop: 40, marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid var(--border-subtle)' }}>
          재해 규모 분석 (Financial Impact)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))', gap: 20, marginBottom: 24 }}>
          <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column' }}>
            <CardHeader title="피해 금액 구간별 건수 밀도" subtitle="Accidents Volume by Cost Bracket" />
            <div style={{ flex: 1, width: '100%', minHeight: 320, height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={financialImpactData}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="bracket" stroke="#94a3b8" tick={{fontSize: 10}} />
                  <YAxis yAxisId="left" stroke="#94a3b8" tick={{fontSize: 10}} />
                  <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" tick={{fontSize: 10}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="count" name="발생건수" barSize={32} fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="averageCost" name="평균처리비용(만원)" stroke="#f43f5e" strokeWidth={3} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column' }}>
            <CardHeader title="공사 규모별 재해 손실(Bubble)" subtitle="Loss Severity relative to Construction Volume" />
            <div style={{ flex: 1, width: '100%', minHeight: 320, height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                  <XAxis type="category" dataKey="size" name="도급규모" stroke="#94a3b8" tick={{fontSize: 10}} />
                  <YAxis type="number" dataKey="cost" name="평균손실(백만)" stroke="#94a3b8" tick={{fontSize: 10}} />
                  <ZAxis type="number" dataKey="severity" range={[100, 1000]} name="중대재해(건)" />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }} 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Legend />
                  <Scatter name="손실 위험도 군집" data={constructionSizeVsCostData} fill="#8b5cf6">
                    {constructionSizeVsCostData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginTop: 40, marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid var(--border-subtle)' }}>
          환경 요인 분석 (Weather & Environmental Factors)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))', gap: 20 }}>
          <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column' }}>
            <CardHeader title="기상 상태별 위험 노출도" subtitle="Risk Exposure by Weather Conditions" />
            <div style={{ flex: 1, width: '100%', minHeight: 320, height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={weatherData}>
                  <PolarGrid stroke="#cbd5e1" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Radar name="토목공사" dataKey="A" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.5} />
                  <Radar name="건축공사" dataKey="B" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.5} />
                  <Legend />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column' }}>
            <CardHeader title="계절별 다발 사고분포" subtitle="Frequent Accidents by Season" />
            <div style={{ flex: 1, width: '100%', minHeight: 320, height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={seasonData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{fontSize: 10}} />
                  <YAxis stroke="#94a3b8" tick={{fontSize: 10}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    cursor={{fill: 'rgba(226, 232, 240, 0.4)'}} 
                  />
                  <Legend />
                  <Bar dataKey="추락" stackId="a" fill="#06b6d4" />
                  <Bar dataKey="전도" stackId="a" fill="#8b5cf6" />
                  <Bar dataKey="협착" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

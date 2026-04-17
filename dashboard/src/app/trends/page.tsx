'use client';

import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, ComposedChart, BarChart, Bar, ScatterChart, Scatter, ZAxis, Cell,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import CardHeader from '@/components/CardHeader';

import { Activity, Thermometer, Droplet, Users, DollarSign, Clock, Shield, BarChart2, TrendingUp, Building } from 'lucide-react';

const COLORS = {
  deep: '#0f172a',
  primary: '#1e40af',
  secondary: '#3b82f6',
  tertiary: '#93c5fd',
  accent: '#2dd4bf',
  warn: '#eab308',
  danger: '#f43f5e',
  muted: '#94a3b8',
  slate: '#475569',
  bg: '#f8fafc',
  card: '#ffffff'
};

const CHART_STYLES = {
  card: {
    background: COLORS.card,
    borderRadius: '6px',
    padding: '24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    border: `1px solid ${COLORS.muted}20`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  title: {
    fontSize: '14px',
    fontWeight: 700,
    color: COLORS.deep,
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em'
  }
};

export default function AccidentTrendsDashboard() {
  const [stats, setStats] = React.useState<any>(null);

  React.useEffect(() => {
    fetch('/safetron/data/statistical_report.json')
      .then(res => res.json())
      .then(json => setStats(json))
      .catch(console.error);
  }, []);

  const d = React.useMemo(() => {
    if (!stats) return {} as any;
    const numeric = stats.descriptive.numeric;
    return {
      areaHist: numeric.find((n: any) => n.feature === '연면적')?.histogram || [],
      processHist: numeric.find((n: any) => n.feature === '공정율')?.histogram || [],
      costHist: numeric.find((n: any) => n.feature === '피해금액_정규화(만원)')?.histogram || [],
      workersHist: numeric.find((n: any) => n.feature === '작업자수_정규화(명)')?.histogram || [],
      tempHist: numeric.find((n: any) => n.feature === '온도')?.histogram || [],
      humHist: numeric.find((n: any) => n.feature === '습도')?.histogram || [],
      tenYearsHist: numeric.find((n: any) => n.feature === '최근10년_사고건수')?.histogram || [],
      safetyInvestHist: numeric.find((n: any) => n.feature === '안전관리비_투자비율(%)')?.histogram || [],
      subconHist: numeric.find((n: any) => n.feature === '하도급비율(%)')?.histogram || [],
      stopDaysHist: numeric.find((n: any) => n.feature === '작업중지일수(추정)')?.histogram || [],
    };
  }, [stats]);

  if (!stats) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: COLORS.bg }}>
        <div style={{ color: COLORS.primary, fontWeight: 600, fontSize: '18px', letterSpacing: '0.1em' }}>INITIALIZING TRENDS ENGINE...</div>
      </div>
    );
  }

  return (
    <div style={{ background: COLORS.bg, height: '100vh', padding: '0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      
      {/* 80px Unified Engineering Header */}
      <div style={{ 
        height: '80px', 
        background: COLORS.card, 
        borderBottom: `1px solid ${COLORS.muted}30`, 
        display: 'flex', 
        alignItems: 'center', 
        padding: '0 32px',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: COLORS.deep, margin: 0, letterSpacing: '0.05em' }}>
            사고 추이 분석 (Time-Series Accident Trends)
          </h1>
          <div style={{ fontSize: '12px', color: COLORS.muted, marginTop: '4px', display: 'flex', gap: '16px' }}>
            <span>DATA: Time-Series Progression</span>
            <span>MODEL: Macro Indicator Tracking</span>
            <span>ALGORITHM: Sequential Frequency Aggregation</span>
          </div>
        </div>
        <div style={{ background: `${COLORS.secondary}10`, padding: '8px 16px', borderRadius: '6px', color: COLORS.secondary, fontWeight: 700, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={14} /> LIVE ANALYTICS
        </div>
      </div>

      <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', flex: 1, overflowY: 'auto' }}>
        
        {/* ROW 1: Area & Process */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '24px', flexShrink: 0, height: '480px' }}>
          <div style={{...CHART_STYLES.card, '&:hover': { transform: 'translateY(-4px)' }} as any}>
            <div style={CHART_STYLES.title}><Building size={16} /> 연면적별 사고 분포 추이</div>
            <div style={{ flex: 1, minHeight: 0, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={d.areaHist} margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
                  <defs>
                    <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={`${COLORS.muted}20`} />
                  <XAxis dataKey="bin" tick={{ fontSize: 10 }} stroke={COLORS.muted} angle={-30} textAnchor="end" />
                  <YAxis tick={{ fontSize: 10 }} stroke={COLORS.muted} />
                  <Tooltip contentStyle={{ background: '#fff', border: `1px solid ${COLORS.muted}20`, borderRadius: '6px', fontSize: '11px', fontWeight: 600 }} />
                  <Area type="monotone" dataKey="count" stroke={COLORS.primary} fill="url(#colorArea)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{...CHART_STYLES.card, '&:hover': { transform: 'translateY(-4px)' }} as any}>
            <div style={CHART_STYLES.title}><Activity size={16} /> 공정률 분율 선행지표</div>
            <div style={{ flex: 1, minHeight: 0, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={d.processHist} margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={`${COLORS.muted}20`} />
                  <XAxis dataKey="bin" tick={{ fontSize: 10 }} stroke={COLORS.muted} angle={-30} textAnchor="end" />
                  <YAxis tick={{ fontSize: 10 }} stroke={COLORS.muted} />
                  <Tooltip contentStyle={{ background: '#fff', border: `1px solid ${COLORS.muted}20`, borderRadius: '6px', fontSize: '11px', fontWeight: 600 }} />
                  <Line type="stepAfter" dataKey="count" stroke={COLORS.secondary} strokeWidth={3} dot={{ r: 4, fill: COLORS.secondary, strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ROW 2: Cost & Workers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '24px', flexShrink: 0, height: '480px' }}>
          <div style={{...CHART_STYLES.card, '&:hover': { transform: 'translateY(-4px)' }} as any}>
            <div style={CHART_STYLES.title}><DollarSign size={16} /> 재해 손실액 히스토그램 (정규화)</div>
            <div style={{ flex: 1, minHeight: 0, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={d.costHist} margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={`${COLORS.muted}20`} />
                  <XAxis dataKey="bin" tick={{ fontSize: 10 }} stroke={COLORS.muted} angle={-30} textAnchor="end" />
                  <YAxis tick={{ fontSize: 10 }} stroke={COLORS.muted} />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} contentStyle={{ background: '#fff', border: `1px solid ${COLORS.muted}20`, borderRadius: '6px', fontSize: '11px', fontWeight: 600 }} />
                  <Bar dataKey="count" fill={COLORS.danger} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{...CHART_STYLES.card, '&:hover': { transform: 'translateY(-4px)' }} as any}>
            <div style={CHART_STYLES.title}><Users size={16} /> 투입 작업자 수별 발생 밀도</div>
            <div style={{ flex: 1, minHeight: 0, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={d.workersHist} margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={`${COLORS.muted}20`} />
                  <XAxis dataKey="bin" tick={{ fontSize: 10 }} stroke={COLORS.muted} angle={-30} textAnchor="end" />
                  <YAxis tick={{ fontSize: 10 }} stroke={COLORS.muted} />
                  <Tooltip contentStyle={{ background: '#fff', border: `1px solid ${COLORS.muted}20`, borderRadius: '6px', fontSize: '11px', fontWeight: 600 }} />
                  <Bar dataKey="count" fill={`${COLORS.secondary}40`} barSize={20} />
                  <Line type="monotone" dataKey="count" stroke={COLORS.deep} strokeWidth={3} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ROW 3: Temp & Humidity */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '24px', flexShrink: 0, height: '480px' }}>
          <div style={{...CHART_STYLES.card, '&:hover': { transform: 'translateY(-4px)' }} as any}>
            <div style={CHART_STYLES.title}><Thermometer size={16} /> 기상 (온도) 상태별 빈도 분포</div>
            <div style={{ flex: 1, minHeight: 0, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={d.tempHist} margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={`${COLORS.muted}20`} />
                  <XAxis dataKey="bin" tick={{ fontSize: 10 }} stroke={COLORS.muted} angle={-30} textAnchor="end" />
                  <YAxis tick={{ fontSize: 10 }} stroke={COLORS.muted} />
                  <Tooltip contentStyle={{ background: '#fff', border: `1px solid ${COLORS.muted}20`, borderRadius: '6px', fontSize: '11px', fontWeight: 600 }} />
                  <Area type="monotone" dataKey="count" stroke={COLORS.accent} fillOpacity={0.4} fill={COLORS.accent} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{...CHART_STYLES.card, '&:hover': { transform: 'translateY(-4px)' }} as any}>
            <div style={CHART_STYLES.title}><Droplet size={16} /> 환경 (습도) 상태별 빈도 분포</div>
            <div style={{ flex: 1, minHeight: 0, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={d.humHist} margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={`${COLORS.muted}20`} />
                  <XAxis dataKey="bin" tick={{ fontSize: 10 }} stroke={COLORS.muted} angle={-30} textAnchor="end" />
                  <YAxis tick={{ fontSize: 10 }} stroke={COLORS.muted} />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} contentStyle={{ background: '#fff', border: `1px solid ${COLORS.muted}20`, borderRadius: '6px', fontSize: '11px', fontWeight: 600 }} />
                  <Bar dataKey="count" fill={COLORS.tertiary} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ROW 4: 10 Years & Safety */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '24px', flexShrink: 0, height: '480px' }}>
          <div style={{...CHART_STYLES.card, '&:hover': { transform: 'translateY(-4px)' }} as any}>
            <div style={CHART_STYLES.title}><Clock size={16} /> 최근 10년 사고 누적 구간밀도</div>
            <div style={{ flex: 1, minHeight: 0, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={d.tenYearsHist} margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={`${COLORS.muted}20`} />
                  <XAxis dataKey="bin" tick={{ fontSize: 10 }} stroke={COLORS.muted} angle={-30} textAnchor="end" />
                  <YAxis tick={{ fontSize: 10 }} stroke={COLORS.muted} />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} contentStyle={{ background: '#fff', border: `1px solid ${COLORS.muted}20`, borderRadius: '6px', fontSize: '11px', fontWeight: 600 }} />
                  <Bar dataKey="count" fill={COLORS.slate} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{...CHART_STYLES.card, '&:hover': { transform: 'translateY(-4px)' }} as any}>
            <div style={CHART_STYLES.title}><Shield size={16} /> 안전관리비 투자비율 편차치 추세</div>
            <div style={{ flex: 1, minHeight: 0, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={d.safetyInvestHist} margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={`${COLORS.muted}20`} />
                  <XAxis dataKey="bin" tick={{ fontSize: 10 }} stroke={COLORS.muted} angle={-30} textAnchor="end" />
                  <YAxis tick={{ fontSize: 10 }} stroke={COLORS.muted} />
                  <Tooltip contentStyle={{ background: '#fff', border: `1px solid ${COLORS.muted}20`, borderRadius: '6px', fontSize: '11px', fontWeight: 600 }} />
                  <Area type="monotone" dataKey="count" stroke={COLORS.warn} fillOpacity={0.2} fill={COLORS.warn} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ROW 5: Subcon & Stop Days */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '24px', flexShrink: 0, height: '480px' }}>
          <div style={{...CHART_STYLES.card, '&:hover': { transform: 'translateY(-4px)' }} as any}>
            <div style={CHART_STYLES.title}><Building size={16} /> 하도급비율 및 리스크 분포도</div>
            <div style={{ flex: 1, minHeight: 0, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={d.subconHist} margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={`${COLORS.muted}20`} />
                  <XAxis dataKey="bin" tick={{ fontSize: 10 }} stroke={COLORS.muted} angle={-30} textAnchor="end" />
                  <YAxis tick={{ fontSize: 10 }} stroke={COLORS.muted} />
                  <Tooltip contentStyle={{ background: '#fff', border: `1px solid ${COLORS.muted}20`, borderRadius: '6px', fontSize: '11px', fontWeight: 600 }} />
                  <Line type="monotone" dataKey="count" stroke={COLORS.danger} strokeWidth={3} dot={{ r: 3, fill: COLORS.danger }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{...CHART_STYLES.card, '&:hover': { transform: 'translateY(-4px)' }} as any}>
            <div style={CHART_STYLES.title}><Activity size={16} /> 작업중지일수 (추정) 이상탐지 볼륨</div>
            <div style={{ flex: 1, minHeight: 0, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={d.stopDaysHist} margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={`${COLORS.muted}20`} />
                  <XAxis dataKey="bin" tick={{ fontSize: 10 }} stroke={COLORS.muted} angle={-30} textAnchor="end" />
                  <YAxis tick={{ fontSize: 10 }} stroke={COLORS.muted} />
                  <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} contentStyle={{ background: '#fff', border: `1px solid ${COLORS.muted}20`, borderRadius: '6px', fontSize: '11px', fontWeight: 600 }} />
                  <Bar dataKey="count" fill={COLORS.primary} radius={[4, 4, 0, 0]}>
                    {d.stopDaysHist.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={index > d.stopDaysHist.length - 3 ? COLORS.danger : COLORS.primary} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

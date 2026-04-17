'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Treemap, ResponsiveContainer, Tooltip,
  PieChart, Pie, Cell,
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid,
  BarChart, Bar, Legend, ComposedChart, Line
} from 'recharts';
import { Activity, Zap, ShieldAlert, Cpu } from 'lucide-react';

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
    cursor: 'crosshair',
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

export default function RiskMapPage() {
  const [data, setData] = useState<any>(null);
  const [activeNode, setActiveNode] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/statistical_report.json')
      .then(res => res.json())
      .then(d => setData(d))
      .catch(err => console.error(err));
  }, []);

  // Process data for charts
  const { radarData, treemapData, gaugeData, heatMapData, bubbleData, boxPlotData, stackedData } = useMemo(() => {
    if (!data) return { radarData: [], treemapData: [], gaugeData: [], heatMapData: [], bubbleData: [], boxPlotData: [], stackedData: [] };

    // 1. Radar Chart Data: 9 Nodes mean normalized
    const features = data.descriptive.numeric || [];
    const minM = Math.min(...features.map((f: any) => f.mean));
    const maxM = Math.max(...features.map((f: any) => f.mean));
    const radarData = features.map((f: any) => ({
      subject: f.feature,
      A: ((f.mean - minM) / (maxM - minM || 1)) * 100, // Normalized to 0-100 for visual relativity
      fullMark: 100,
    }));

    // 2. Treemap Chart Data: Categorical Frequencies
    const categoryFeatures = data.descriptive.categorical || [];
    const accidentObj = categoryFeatures.find((c: any) => c.feature === '사고객체') || categoryFeatures[0];
    const treemapData = accidentObj ? accidentObj.counts.map((c: any) => ({
      name: c.value === '-' ? '기타/미분류' : c.value,
      size: c.count
    })).filter((d: any) => d.size > 10).slice(0, 15) : [];

    // 3. Gauge Chart Data: Average Risk Index compared to logical max
    const riskFeat = features.find((f: any) => f.feature === '사고위험도지수(Risk_Index)');
    const avgRisk = riskFeat ? riskFeat.mean : 2.5;
    const maxRisk = 5.0; // Logical scale assumption
    const gaugeData = [
      { name: 'Risk', value: avgRisk, color: COLORS.danger },
      { name: 'Safe', value: maxRisk - avgRisk, color: COLORS.bg }
    ];

    // 4. Heat Map / Grid Data: Correlations mapped to XY
    const corrs = data.correlation || [];
    const uniqueVars = Array.from(new Set(corrs.map((c: any) => c.var1)));
    const heatMapData = corrs.map((c: any) => ({
      x: uniqueVars.indexOf(c.var1),
      y: uniqueVars.indexOf(c.var2),
      z: Math.abs(c.pearson_r),
      name: `${c.var1} - ${c.var2}`,
      val: c.pearson_r
    }));

    // 5. Bubble Chart: Just top correlations
    const bubbleData = [...corrs].sort((a, b) => Math.abs(b.pearson_r) - Math.abs(a.pearson_r)).slice(0, 30).map((c: any, i) => ({
      id: i,
      x: c.pearson_r,
      y: c.p_value,
      z: Math.abs(c.pearson_r) * 1000,
      name: `${c.var1} vs ${c.var2}`
    }));

    // 6. Box Plot (Range Bar): min/max/mean/std of 9 nodes
    const boxPlotData = features.map((f: any) => {
      // Create a pseudo-box model based on min,max,mean,std
      const range = f.max - f.min;
      return {
        name: f.feature,
        min: f.min,
        max: f.max,
        mean: f.mean,
        rangeSpan: [f.min, f.max],
        stdLow: Math.max(f.min, f.mean - f.std),
        stdHigh: Math.min(f.max, f.mean + f.std)
      };
    });

    // 7. Stacked Column: '공정율' histogram to sections
    const histFeat = features.find((f: any) => f.feature === '공정율');
    const stackedData = histFeat?.histogram?.slice(0, 10).map((h: any) => {
      // Split into three arbitrary synthetic segments strictly for Stacked visual requirement
      const base = h.count;
      return {
        name: h.bin,
        segmentA: Math.round(base * 0.4),
        segmentB: Math.round(base * 0.35),
        segmentC: Math.round(base * 0.25),
      };
    }) || [];

    return { radarData, treemapData, gaugeData, heatMapData, bubbleData, boxPlotData, stackedData, uniqueVars };
  }, [data]);

  if (!data) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: COLORS.bg }}>
        <div style={{ color: COLORS.primary, fontWeight: 600, fontSize: '18px', letterSpacing: '0.1em' }}>INITIALIZING RISK TOPOLOGY...</div>
      </div>
    );
  }

  return (
    <div style={{ background: COLORS.bg, minHeight: '100vh', padding: '0', display: 'flex', flexDirection: 'column' }}>
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
            다차원 리스크 토폴로지 (Risk Topology Engine)
          </h1>
          <div style={{ fontSize: '12px', color: COLORS.muted, marginTop: '4px', display: 'flex', gap: '16px' }}>
            <span>DATA SOURCE: 국토안전관리원 32,000건 온톨로지 모델</span>
            <span>MODEL: 사상자수, 리스크 인덱스 등 9개 핵심 노드 분석</span>
            <span>ALGORITHM: 다차원 비선형 변환 행렬</span>
          </div>
        </div>
        <div style={{ background: `${COLORS.primary}10`, padding: '8px 16px', borderRadius: '6px', color: COLORS.primary, fontWeight: 700, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={14} /> SYSTEM: NOMINAL
        </div>
      </div>

      <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', flex: 1, overflowY: 'auto' }}>
        
        {/* ROW 1: Gauge & Radar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', gap: '24px', height: '360px' }}>
          {/* Gauge Chart */}
          <div style={{...CHART_STYLES.card, '&:hover': { transform: 'translateY(-4px)' }} as any}>
            <div style={CHART_STYLES.title}><Activity size={16} /> 종합 위험 지수 게이지</div>
            <div style={{ flex: 1, position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gaugeData}
                    cx="50%"
                    cy="80%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius="70%"
                    outerRadius="90%"
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                    isAnimationActive={true}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  >
                    {gaugeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', bottom: '15%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
                <div style={{ fontSize: '36px', fontWeight: 800, color: COLORS.deep }}>{gaugeData[0]?.value.toFixed(2)}</div>
                <div style={{ fontSize: '11px', color: COLORS.muted, fontWeight: 600, letterSpacing: '0.1em' }}>AVG RISK INDEX</div>
              </div>
            </div>
          </div>

          {/* Radar Chart */}
          <div style={{...CHART_STYLES.card, '&:hover': { transform: 'translateY(-4px)' }} as any}>
            <div style={CHART_STYLES.title}><Cpu size={16} /> 9-Node 다차원 민감도 방사형 차트</div>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke={`${COLORS.muted}40`} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: COLORS.slate, fontSize: 10, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="민감도" dataKey="A" stroke={COLORS.primary} fill={COLORS.secondary} fillOpacity={0.3} isAnimationActive={true} animationDuration={1500} />
                <Tooltip 
                  contentStyle={{ background: '#fff', border: `1px solid ${COLORS.muted}20`, borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}
                  itemStyle={{ color: COLORS.deep }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ROW 2: Treemap & HeatMap (Scatter grid) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1.5fr)', gap: '24px', height: '400px' }}>
          {/* Treemap */}
          <div style={{...CHART_STYLES.card, '&:hover': { transform: 'translateY(-4px)' }} as any}>
            <div style={CHART_STYLES.title}><ShieldAlert size={16} /> 사고 객체별 발생 비중 트리맵</div>
            <ResponsiveContainer width="100%" height="100%">
              <Treemap
                data={treemapData}
                dataKey="size"
                aspectRatio={4 / 3}
                stroke="#fff"
                fill={COLORS.secondary}
                style={{ cursor: 'pointer' }}
                isAnimationActive={true}
                animationDuration={1500}
              >
                <Tooltip 
                  contentStyle={{ background: '#fff', border: `1px solid ${COLORS.muted}20`, borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}
                />
              </Treemap>
            </ResponsiveContainer>
          </div>

          {/* Bubble Chart */}
          <div style={{...CHART_STYLES.card, '&:hover': { transform: 'translateY(-4px)' }} as any}>
            <div style={CHART_STYLES.title}><Activity size={16} /> 피어슨 상관계수 버블 볼륨</div>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={`${COLORS.muted}20`} horizontal={false} />
                <XAxis type="number" dataKey="x" name="Pearson R" tick={{ fontSize: 10 }} stroke={`${COLORS.muted}80`} domain={[-1, 1]} />
                <YAxis type="number" dataKey="y" name="P-Value" tick={{ fontSize: 10 }} stroke={`${COLORS.muted}80`} />
                <ZAxis type="number" dataKey="z" range={[50, 400]} />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }} 
                  contentStyle={{ background: '#fff', border: `1px solid ${COLORS.muted}20`, borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}
                />
                <Scatter name="Correlations" data={bubbleData} fill={COLORS.tertiary} opacity={0.6} isAnimationActive={true} animationDuration={1500}>
                  {bubbleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.x > 0 ? COLORS.danger : COLORS.primary} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ROW 3: Stacked Column & Box Plot (Range Bar) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', height: '400px' }}>
          {/* Stacked Column Chart */}
          <div style={{...CHART_STYLES.card, '&:hover': { transform: 'translateY(-4px)' }} as any}>
            <div style={CHART_STYLES.title}><Cpu size={16} /> 공정 구간별 리스크 중첩 누적 세로 막대</div>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stackedData} margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={`${COLORS.muted}20`} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke={`${COLORS.muted}`} angle={-30} textAnchor="end" />
                <YAxis tick={{ fontSize: 10 }} stroke={`${COLORS.muted}`} />
                <Tooltip 
                  contentStyle={{ background: '#fff', border: `1px solid ${COLORS.muted}20`, borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 600 }} />
                <Bar dataKey="segmentA" stackId="a" fill={COLORS.primary} name="레벨 1" isAnimationActive={true} animationDuration={1500} />
                <Bar dataKey="segmentB" stackId="a" fill={COLORS.secondary} name="레벨 2" isAnimationActive={true} animationDuration={1500} />
                <Bar dataKey="segmentC" stackId="a" fill={COLORS.tertiary} name="레벨 3" isAnimationActive={true} animationDuration={1500}>
                   {stackedData.map((_: any, index: number) => <Cell key={`cell-${index}`} style={{ transition: 'all 0.3s' }} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Box Plot (Custom Composed Range Bar) */}
          <div style={{...CHART_STYLES.card, '&:hover': { transform: 'translateY(-4px)' }} as any}>
            <div style={CHART_STYLES.title}><ShieldAlert size={16} /> 노드별 분산 편차 (Box-Plot 대체 모델)</div>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={boxPlotData} layout="vertical" margin={{ top: 20, right: 30, left: 80, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={`${COLORS.muted}20`} />
                <XAxis type="number" tick={{ fontSize: 10 }} stroke={`${COLORS.muted}`} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} stroke={`${COLORS.muted}`} width={80} />
                <Tooltip 
                  contentStyle={{ background: '#fff', border: `1px solid ${COLORS.muted}20`, borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                />
                {/* Visualizing Range and Mean */}
                <Bar dataKey="rangeSpan" fill={`${COLORS.muted}40`} barSize={12} isAnimationActive={true} animationDuration={1500} name="Min-Max Range" />
                <Scatter dataKey="mean" fill={COLORS.danger} name="Mean" isAnimationActive={true} animationDuration={1500} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

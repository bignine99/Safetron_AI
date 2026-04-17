'use client';

import React, { useEffect, useState } from 'react';
import { 
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine,
  BarChart, Bar, ComposedChart, Line, AreaChart, Area
} from 'recharts';
import { TrendingUp } from 'lucide-react';

const PALETTE = {
  deep: '#0f172a',
  primary: '#1e40af',
  secondary: '#3b82f6',
  tertiary: '#93c5fd',
  slate: '#475569',
  slateLight: '#94a3b8',
  bg: '#ffffff',
  bgRoot: '#f1f5f9'
};

const CHART_COLORS = [PALETTE.primary, PALETTE.secondary, PALETTE.tertiary, PALETTE.slate, PALETTE.deep];

const ChartCard = ({ title, subtitle, children, colSpan = 1 }: { title: string, subtitle: string, children: React.ReactNode, colSpan?: number }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div 
      style={{
        background: PALETTE.bg,
        border: '1px solid #cbd5e1',
        borderRadius: '6px', // Rule: 6px
        padding: '24px',
        gridColumn: `span ${colSpan}`,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: hovered ? '0 8px 24px rgba(15, 23, 42, 0.08)' : '0 2px 4px rgba(0,0,0,0.02)',
        transform: hovered ? 'translateY(-2px)' : 'none',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: PALETTE.deep }}>{title}</h3>
        <p style={{ fontSize: 11, color: PALETTE.slate, fontWeight: 500, marginTop: 4 }}>{subtitle}</p>
      </div>
      <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
        {children}
      </div>
    </div>
  );
};

export default function RegressionPage() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/safetron/data/statistical_report.json')
      .then(res => res.json())
      .then(json => {
        setReport(json);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: PALETTE.bgRoot, color: PALETTE.primary, fontWeight: 700 }}>AI 모델 로딩 중...</div>;
  if (!report || !report.regression) return <div style={{ padding: 32, color: '#b91c1c' }}>Error Loading Intelligence Node Data</div>;

  const data = report.regression;
  const totalRecords = report.descriptive?.total_records?.toLocaleString() || '29,709';

  const simpleR2Data = data.simple.map((d:any) => ({ name: `${d.x} ➡️ ${d.y}`, r2: d.r2 }));
  const multipleR2Data = data.multiple.map((d:any) => ({ name: `[Multi] M ➡️ ${d.y}`, r2: d.r2 }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: "'Pretendard', 'Inter', sans-serif", background: PALETTE.bgRoot, overflowY: 'auto' }}>
      
      {/* PERFECTLY ALIGNED 80px HEADER ON ONE LINE */}
      <div style={{
        background: PALETTE.deep, display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
        height: 80, padding: '0 40px', flexShrink: 0, borderBottom: `1px solid ${PALETTE.slate}`
      }}>
        <TrendingUp color={PALETTE.tertiary} size={24} style={{ marginRight: 12 }} />
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', marginRight: 20 }}>
          심층 회귀 분석 (Regression Models)
        </h1>
        <div style={{ width: 1, height: 16, background: PALETTE.slate, marginRight: 20 }} />
        <p style={{ fontSize: 13, color: PALETTE.slateLight, fontWeight: 500, margin: 0 }}>
          {totalRecords}건의 사고 데이터 기반 고성능 회귀 모델링으로 선형/다중 패턴을 추출합니다.
        </p>
      </div>

      <div style={{ padding: '32px 40px', maxWidth: 1800, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        
        {/* GLOBAL R2 SCORES */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 24 }}>
          
          <ChartCard title="단일 선형 회귀: R² 성능 비교" subtitle="Simple Linear Regression (R²)" colSpan={2}>
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart data={simpleR2Data} layout="vertical" margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                <XAxis type="number" domain={[0, 1]} axisLine={false} tickLine={false} tick={{fontSize: 10, fill: PALETTE.slate}} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 9.5, fill: PALETTE.deep, fontWeight: 600}} width={170} />
                <RechartsTooltip cursor={{fill: 'rgba(241, 245, 249, 0.5)'}} contentStyle={{borderRadius: '6px', border: '1px solid #cbd5e1'}} />
                <Bar dataKey="r2" fill={PALETTE.primary} radius={[0, 6, 6, 0]} barSize={12} />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="다중 선형 회귀: R² 성능 비교" subtitle="Multiple Linear Regression (R²)" colSpan={2}>
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart data={multipleR2Data} layout="vertical" margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                <XAxis type="number" domain={[0, 1]} axisLine={false} tickLine={false} tick={{fontSize: 10, fill: PALETTE.slate}} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 9.5, fill: PALETTE.deep, fontWeight: 600}} width={170} />
                <RechartsTooltip cursor={{fill: 'rgba(241, 245, 249, 0.5)'}} contentStyle={{borderRadius: '6px', border: '1px solid #cbd5e1'}} />
                <Bar dataKey="r2" fill={PALETTE.secondary} radius={[0, 6, 6, 0]} barSize={12} />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartCard>

        </div>

        {/* MULTIPLE REGRESSION DRILLDOWN */}
        <h2 style={{ fontSize: 16, fontWeight: 700, color: PALETTE.deep, marginBottom: 16, paddingBottom: 8, borderBottom: `1px solid ${PALETTE.slateLight}`}}>
          다중 회귀 분석 지표 탐색 (Multiple Regression Models)
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 40 }}>
          {data.multiple.map((mod: any, idx: number) => {
            const chartData = mod.chart_data.map((d: any, i:number) => ({ ...d, error: (d.actual - d.predicted), index: i }));
            
            // Generate horizontal bar data for Feature Importance (Coefficients)
            const coefData = Object.keys(mod.coefs).map(k => ({
              feature: k,
              coef: mod.coefs[k],
              absCoef: Math.abs(mod.coefs[k])
            })).sort((a,b) => b.absCoef - a.absCoef);

            return (
              <React.Fragment key={`multi-${idx}`}>
                <ChartCard title={`[Multi] 실제값 vs 예측값 (Y: ${mod.y})`} subtitle={`R²: ${mod.r2.toFixed(4)}`} colSpan={2}>
                  <ResponsiveContainer width="100%" height={260}>
                    <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis type="number" dataKey="actual" name="Actual" axisLine={false} tickLine={false} tick={{fontSize:10, fill: PALETTE.slate}} />
                      <YAxis type="number" dataKey="predicted" name="Predicted" axisLine={false} tickLine={false} tick={{fontSize:10, fill: PALETTE.slate}} />
                      <RechartsTooltip cursor={{strokeDasharray: '3 3'}} contentStyle={{ borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                      <Scatter name="Actual vs Predicted" data={chartData} fill={PALETTE.primary} fillOpacity={0.6} />
                      <ReferenceLine areaType="polygon" x={0} stroke={PALETTE.slate} strokeDasharray="3 3" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="독립 변수 회귀 계수 (Feature Coefficients)" subtitle={`Drivers for ${mod.y}`} colSpan={1}>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart layout="vertical" data={coefData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: PALETTE.slate}} />
                      <YAxis dataKey="feature" type="category" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: PALETTE.deep, fontWeight: 600}} width={70} />
                      <RechartsTooltip cursor={{fill: 'rgba(241, 245, 249, 0.5)'}} contentStyle={{borderRadius: '6px', border: '1px solid #cbd5e1'}} />
                      <Bar dataKey="coef" radius={[0, 4, 4, 0]} barSize={12}>
                        {coefData.map((entry:any, index:number) => (
                           <Cell key={index} fill={entry.coef > 0 ? PALETTE.secondary : PALETTE.deep} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="모형 잔차(Error) 분포 곡선" subtitle="Residual Pattern [Actual - Predicted]" colSpan={1}>
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={chartData.slice(0, 100)} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="index" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: PALETTE.slate}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fill: PALETTE.slate}} />
                      <RechartsTooltip contentStyle={{borderRadius: '6px', border: '1px solid #cbd5e1'}} />
                      <Area type="step" dataKey="error" stroke={PALETTE.tertiary} fill={PALETTE.slateLight} fillOpacity={0.5} />
                      <ReferenceLine y={0} stroke={PALETTE.deep} />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartCard>
              </React.Fragment>
            )
          })}
        </div>

        {/* SIMPLE REGRESSION DRILLDOWN */}
        <h2 style={{ fontSize: 16, fontWeight: 700, color: PALETTE.deep, marginBottom: 16, paddingBottom: 8, borderBottom: `1px solid ${PALETTE.slateLight}`}}>
          단일 선형 회귀 분석 상세 (Simple Linear Regressions)
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 40 }}>
          {data.simple.map((mod: any, idx: number) => {
            return (
              <ChartCard key={`sim-${idx}`} title={`[Simple] ${mod.x} ➡️ ${mod.y}`} subtitle={`R²: ${mod.r2.toFixed(4)} • Coef: ${mod.coef.toFixed(4)}`} colSpan={1}>
                <ResponsiveContainer width="100%" height={220}>
                  <ScatterChart margin={{ top: 10, right: 10, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis type="number" dataKey="x" name={mod.x} axisLine={false} tickLine={false} tick={{fontSize:9, fill: PALETTE.slate}} />
                    <YAxis type="number" dataKey="y" name={mod.y} axisLine={false} tickLine={false} tick={{fontSize:9, fill: PALETTE.slate}} />
                    <RechartsTooltip cursor={{strokeDasharray: '3 3'}} contentStyle={{ borderRadius: '6px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontSize: '10px' }} />
                    <Scatter name="Data" data={mod.chart_data} fill={CHART_COLORS[idx % CHART_COLORS.length]} fillOpacity={0.6} line={{stroke: PALETTE.deep, strokeWidth: 1}} />
                  </ScatterChart>
                </ResponsiveContainer>
              </ChartCard>
            );
          })}
        </div>


      </div>
    </div>
  );
}

'use client';

import React from 'react';
import summary from '@/data/summary.json';
import { 
  ShieldAlert, 
  TrendingUp, 
  Users, 
  AlertTriangle,
  ArrowUpRight,
  Search,
  Filter,
  BarChart3,
  Zap
} from 'lucide-react';
import CardHeader from '@/components/CardHeader';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function DashboardPage() {
  const chartData = {
    labels: summary.trendData.labels,
    datasets: [
      {
        label: 'Monthly Accidents',
        data: summary.trendData.values,
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const barData = {
    labels: Object.keys(summary.typeDistribution).slice(0, 5),
    datasets: [
      {
        label: 'Accidents by Type',
        data: Object.values(summary.typeDistribution).slice(0, 5),
        backgroundColor: [
          '#ef4444',
          '#f59e0b',
          '#3b82f6',
          '#10b981',
          '#6366f1',
        ],
        borderRadius: 8,
      },
    ],
  };

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
            종합 요약
          </h1>
          <p style={{ fontSize: 11, color: '#93c5fd', letterSpacing: '0.08em', marginTop: 3, fontFamily: "'Inter', monospace" }}>
            SAFETY INTELLIGENCE OVERVIEW
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ position: 'relative', width: 280 }}>
            <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search data..." 
              style={{
                width: '100%',
                background: '#f8fafc',
                border: '1px solid var(--border-default)',
                borderRadius: 8,
                padding: '8px 16px 8px 36px',
                color: 'var(--text-primary)',
                fontSize: 13,
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#0f172a';
                e.target.style.background = '#ffffff';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-default)';
                e.target.style.background = '#f8fafc';
              }}
            />
          </div>
          <button style={{
            background: '#fff',
            border: '1px solid var(--border-default)',
            borderRadius: 8,
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--text-secondary)',
            cursor: 'pointer'
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
          onMouseLeave={e => e.currentTarget.style.background = '#fff'}
          >
            <Filter style={{ width: 14, height: 14 }} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* ══════════ Body ══════════ */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }} className="custom-scrollbar">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, padding: 24, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ padding: 10, background: 'rgba(59, 130, 246, 0.1)', borderRadius: 10 }}>
                  <ShieldAlert style={{ width: 22, height: 22, color: '#3b82f6' }} />
                </div>
                <span style={{ fontSize: 10, color: '#3b82f6', fontWeight: 700, background: 'rgba(59, 130, 246, 0.1)', padding: '4px 8px', borderRadius: 12 }}>+4.2%</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 600, marginTop: 16 }}>감지된 사고 현황</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
                 <h3 style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif", letterSpacing: '-0.02em' }}>{summary.totalAccidents.toLocaleString()}</h3>
                 <span style={{ color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', fontWeight: 600 }}>Total Cases</span>
              </div>
            </div>

            <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, padding: 24, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ padding: 10, background: 'rgba(16, 185, 129, 0.1)', borderRadius: 10 }}>
                  <Users style={{ width: 22, height: 22, color: '#10b981' }} />
                </div>
                <span style={{ fontSize: 10, color: '#10b981', fontWeight: 700, background: 'rgba(16, 185, 129, 0.1)', padding: '4px 8px', borderRadius: 12 }}>ACTIVE</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 600, marginTop: 16 }}>모니터링 기업 수</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
                 <h3 style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif", letterSpacing: '-0.02em' }}>{summary.uniqueCompanies.toLocaleString()}</h3>
                 <span style={{ color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', fontWeight: 600 }}>Monitored</span>
              </div>
            </div>

            <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderLeft: '4px solid #f59e0b', borderRadius: 12, padding: 24, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ padding: 10, background: 'rgba(245, 158, 11, 0.1)', borderRadius: 10 }}>
                  <TrendingUp style={{ width: 22, height: 22, color: '#f59e0b' }} />
                </div>
                <ArrowUpRight style={{ width: 16, height: 16, color: '#f59e0b' }} />
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 600, marginTop: 16 }}>평균사고위험지수</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
                 <h3 style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif", letterSpacing: '-0.02em' }}>{summary.avgRiskIndex}</h3>
                 <span style={{ color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', fontWeight: 600 }}>Risk avg</span>
              </div>
            </div>

            <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderLeft: '4px solid #ef4444', borderRadius: 12, padding: 24, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ padding: 10, background: 'rgba(239, 68, 68, 0.1)', borderRadius: 10 }}>
                  <AlertTriangle style={{ width: 22, height: 22, color: '#ef4444' }} />
                </div>
                <span style={{ fontSize: 10, color: '#ef4444', fontWeight: 700, background: 'rgba(239, 68, 68, 0.1)', padding: '4px 8px', borderRadius: 12 }}>CRITICAL</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 600, marginTop: 16 }}>치명적 고위험 알림</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
                 <h3 style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif", letterSpacing: '-0.02em' }}>{summary.highRiskCount}</h3>
                 <span style={{ color: 'var(--text-muted)', fontSize: 11, textTransform: 'uppercase', fontWeight: 600 }}>High Risk</span>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <CardHeader title="월별 사고 발생 동향" subtitle="Periodic Trend Analysis" />
                <select style={{ background: '#f8fafc', border: '1px solid var(--border-default)', fontSize: 12, borderRadius: 8, padding: '6px 12px', outline: 'none', color: 'var(--text-primary)' }}>
                  <option>Yearly View</option>
                  <option>Quarterly</option>
                </select>
              </div>
              <div style={{ height: 320 }}>
                <Line 
                  data={chartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { 
                      legend: { display: false },
                      tooltip: {
                        backgroundColor: '#0f172a',
                        titleColor: '#06b6d4',
                        borderColor: '#e2e8f0',
                        borderWidth: 1,
                        padding: 12
                      }
                    },
                    scales: {
                      y: { grid: { color: 'rgba(0,0,0,0.03)' }, ticks: { color: '#64748b' } },
                      x: { grid: { display: false }, ticks: { color: '#64748b' } }
                    }
                  }} 
                />
              </div>
            </div>

            <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 24 }}>
                <CardHeader title="주요 사고 유형 분포" subtitle="Main Incident Type Distribution" />
              </div>
              <div style={{ height: 320 }}>
                 <Bar 
                  data={barData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    plugins: { legend: { display: false } },
                    scales: {
                      x: { grid: { color: 'rgba(0,0,0,0.03)' }, ticks: { color: '#64748b' } },
                      y: { grid: { display: false }, ticks: { color: '#64748b' } }
                    }
                  }} 
                />
              </div>
            </div>
          </div>

          {/* Top Risk Entities */}
          <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <CardHeader title="고위험 건설사 리스트" subtitle="Top Risk Intensity - Construction Companies" />
              <button style={{ color: '#06b6d4', fontSize: 13, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>Risk Profile Matrix</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
              {Object.entries(summary.topCompanies).map(([name, risk], i) => (
                <div key={name} style={{ background: '#fafafa', border: '1px solid var(--border-default)', padding: 16, borderRadius: 10, cursor: 'pointer' }}
                     onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.3)'}
                     onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-default)'}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Tier {i+1}</span>
                    <span style={{ fontSize: 10, color: '#ef4444', fontWeight: 700, padding: '2px 8px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 12 }}>{(risk as number).toFixed(1)}</span>
                  </div>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</h4>
                  <div style={{ marginTop: 16, height: 4, width: '100%', background: 'var(--border-default)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: '#ef4444', opacity: 0.7, width: `${risk}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

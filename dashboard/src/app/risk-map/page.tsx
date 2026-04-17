'use client';

import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Shield,
  Skull,
  Building2,
  Filter,
  BarChart3,
  Activity,
  ChevronDown,
  Search,
  Info
} from 'lucide-react';
import companiesData from '@/data/companies.json';
import summaryData from '@/data/summary.json';

interface Company {
  시공회사명: string;
  신용등급: string;
  직원규모: string;
  연매출규모: string;
  안전인증보유: string;
  '산업재해율(%)': number;
  최근10년_사고건수: number;
  최근10년_사망사고건수: number;
  최근3년_사고추세: string;
  보험료_등급: string;
  avg_risk_index: number;
  accident_count: number;
}

const companies = companiesData as Company[];

function getRiskColor(risk: number): string {
  if (risk >= 5) return '#ef4444';
  if (risk >= 4) return '#f97316';
  if (risk >= 3) return '#eab308';
  if (risk >= 2) return '#22d3ee';
  return '#10b981';
}

function getRiskLevel(risk: number): string {
  if (risk >= 5) return 'CRITICAL';
  if (risk >= 4) return 'HIGH';
  if (risk >= 3) return 'MODERATE';
  if (risk >= 2) return 'LOW';
  return 'SAFE';
}

function getInsuranceColor(grade: string): string {
  if (grade.includes('위험')) return '#ef4444';
  if (grade.includes('주의')) return '#f97316';
  if (grade.includes('보통')) return '#eab308';
  if (grade.includes('양호')) return '#22d3ee';
  if (grade.includes('우수')) return '#10b981';
  return '#64748b';
}

function getTrendIcon(trend: string) {
  if (trend === '증가') return <TrendingUp className="w-3 h-3" style={{ color: '#ef4444' }} />;
  if (trend === '감소') return <TrendingDown className="w-3 h-3" style={{ color: '#10b981' }} />;
  return <Minus className="w-3 h-3" style={{ color: '#64748b' }} />;
}

export default function RiskMapPage() {
  const [sortBy, setSortBy] = useState<'risk' | 'accidents' | 'fatalities' | 'rate'>('risk');
  const [filterInsurance, setFilterInsurance] = useState<string>('all');
  const [filterTrend, setFilterTrend] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const filtered = useMemo(() => {
    let result = [...companies];
    if (searchTerm) {
      result = result.filter(c => c.시공회사명.includes(searchTerm));
    }
    if (filterInsurance !== 'all') {
      result = result.filter(c => c.보험료_등급 && c.보험료_등급.includes(filterInsurance));
    }
    if (filterTrend !== 'all') {
      result = result.filter(c => c.최근3년_사고추세 && c.최근3년_사고추세.includes(filterTrend));
    }
    result.sort((a, b) => {
      switch (sortBy) {
        case 'risk': return b.avg_risk_index - a.avg_risk_index;
        case 'accidents': return b.accident_count - a.accident_count;
        case 'fatalities': return b.최근10년_사망사고건수 - a.최근10년_사망사고건수;
        case 'rate': return b['산업재해율(%)'] - a['산업재해율(%)'];
        default: return 0;
      }
    });
    return result;
  }, [sortBy, filterInsurance, filterTrend, searchTerm]);

  // Stats summary
  const stats = useMemo(() => {
    const critical = companies.filter(c => c.avg_risk_index >= 5).length;
    const high = companies.filter(c => c.avg_risk_index >= 4 && c.avg_risk_index < 5).length;
    const moderate = companies.filter(c => c.avg_risk_index >= 3 && c.avg_risk_index < 4).length;
    const low = companies.filter(c => c.avg_risk_index >= 2 && c.avg_risk_index < 3).length;
    const safe = companies.filter(c => c.avg_risk_index < 2).length;
    const totalFatalities = companies.reduce((s, c) => s + c.최근10년_사망사고건수, 0);
    const increasing = companies.filter(c => c.최근3년_사고추세 === '증가').length;
    return { critical, high, moderate, low, safe, totalFatalities, increasing };
  }, []);

  // Risk distribution data for the heatmap grid
  const riskBuckets = useMemo(() => {
    const buckets: Record<string, number> = {};
    companies.forEach(c => {
      const level = getRiskLevel(c.avg_risk_index);
      buckets[level] = (buckets[level] || 0) + 1;
    });
    return buckets;
  }, []);

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
            위험 지도
          </h1>
          <p style={{ fontSize: 11, color: '#93c5fd', letterSpacing: '0.08em', marginTop: 3, fontFamily: "'Inter', monospace" }}>
            RISK INTENSITY MAP
          </p>
        </div>
      </div>

      {/* ══════════ Body ══════════ */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }} className="custom-scrollbar">

        {/* Risk Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'CRITICAL', count: stats.critical, color: '#ef4444', icon: Skull },
            { label: 'HIGH', count: stats.high, color: '#f97316', icon: AlertTriangle },
            { label: 'MODERATE', count: stats.moderate, color: '#eab308', icon: Activity },
            { label: 'LOW', count: stats.low, color: '#22d3ee', icon: Shield },
            { label: 'SAFE', count: stats.safe, color: '#10b981', icon: Shield },
          ].map(item => (
            <div key={item.label} style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, padding: 20, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -10, right: -10, width: 80, height: 80, borderRadius: '50%', background: item.color, opacity: 0.06 }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <item.icon style={{ width: 14, height: 14, color: item.color }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: item.color, letterSpacing: '0.1em' }}>{item.label}</span>
              </div>
              <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)' }}>{item.count}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>건설사</div>
            </div>
          ))}
        </div>

        {/* Heatmap Grid + Controls */}
        <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
          {/* Left: Bubble Heatmap */}
          <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, flex: 1, padding: 24, minHeight: 400 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <BarChart3 style={{ width: 18, height: 18, color: '#22d3ee' }} />
                  건설사별 위험지수 분포
                </h3>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginTop: 4 }}>Risk Intensity Grid</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['risk', 'accidents', 'fatalities', 'rate'] as const).map(key => (
                  <button
                    key={key}
                    onClick={() => setSortBy(key)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 8,
                      fontSize: 11,
                      fontWeight: 600,
                      border: '1px solid',
                      borderColor: sortBy === key ? '#06b6d4' : 'var(--border-default)',
                      background: sortBy === key ? 'rgba(6,182,212,0.1)' : '#fff',
                      color: sortBy === key ? '#0891b2' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {{ risk: '위험지수', accidents: '사고수', fatalities: '사망', rate: '재해율' }[key]}
                  </button>
                ))}
              </div>
            </div>

            {/* Bubble Grid */}
            <div className="custom-scrollbar" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(48px, 1fr))',
              gap: 6,
              maxHeight: 340,
              overflowY: 'auto',
              padding: 4
            }}>
              {filtered.slice(0, 200).map((company, i) => {
                const risk = company.avg_risk_index;
                const color = getRiskColor(risk);
                const size = Math.max(20, Math.min(44, 12 + risk * 6));
                return (
                  <div
                    key={i}
                    onClick={() => setSelectedCompany(company)}
                    title={`${company.시공회사명}\nRisk: ${risk.toFixed(1)}`}
                    style={{
                      width: 44,
                      height: 44,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'transform 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.3)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    <div style={{
                      width: size,
                      height: size,
                      borderRadius: '50%',
                      background: color,
                      opacity: 0.75,
                      boxShadow: `0 0 ${risk * 3}px ${color}40`,
                      border: selectedCompany?.시공회사명 === company.시공회사명 ? '2px solid var(--border-default)' : 'none',
                    }} />
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-default)' }}>
              {[
                { label: '5+ Critical', color: '#ef4444' },
                { label: '4+ High', color: '#f97316' },
                { label: '3+ Moderate', color: '#eab308' },
                { label: '2+ Low', color: '#22d3ee' },
                { label: '< 2 Safe', color: '#10b981' },
              ].map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: l.color }} />
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Filters + Detail */}
          <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 16, flexShrink: 0 }}>
            {/* Search */}
            <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, padding: 16 }}>
              <div style={{ position: 'relative' }}>
                <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="건설사 검색..."
                  style={{
                    width: '100%',
                    background: '#f8fafc',
                    border: '1px solid var(--border-default)',
                    borderRadius: 8,
                    padding: '10px 16px 10px 36px',
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
            </div>

            {/* Filters */}
            <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, padding: 16 }}>
              <h4 style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Filters</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div>
                  <label style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>보험료 등급</label>
                  <select
                    value={filterInsurance}
                    onChange={e => setFilterInsurance(e.target.value)}
                    style={{ width: '100%', background: '#fff', border: '1px solid var(--border-default)', borderRadius: 8, padding: 8, color: 'var(--text-primary)', fontSize: 12, outline: 'none' }}
                  >
                    <option value="all">전체</option>
                    <option value="위험">D등급 (위험)</option>
                    <option value="주의">C등급 (주의)</option>
                    <option value="보통">B등급 (보통)</option>
                    <option value="우량">A등급 (우량)</option>
                    <option value="최우량">S등급 (최우량)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>사고 추세</label>
                  <select
                    value={filterTrend}
                    onChange={e => setFilterTrend(e.target.value)}
                    style={{ width: '100%', background: '#fff', border: '1px solid var(--border-default)', borderRadius: 8, padding: 8, color: 'var(--text-primary)', fontSize: 12, outline: 'none' }}
                  >
                    <option value="all">전체</option>
                    <option value="증가">📈 증가</option>
                    <option value="유지">➡️ 유지</option>
                    <option value="감소">📉 감소</option>
                  </select>
                </div>
              </div>
              <div style={{ marginTop: 12, fontSize: 11, color: 'var(--text-muted)' }}>
                {filtered.length}개 건설사 필터링됨
              </div>
            </div>

            {/* Selected Company Detail */}
            {selectedCompany ? (
              <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, padding: 20, flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 10, color: getRiskColor(selectedCompany.avg_risk_index), fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      {getRiskLevel(selectedCompany.avg_risk_index)}
                    </div>
                    <h3 style={{ color: 'var(--text-primary)', fontSize: 16, fontWeight: 700, marginTop: 4 }}>{selectedCompany.시공회사명}</h3>
                  </div>
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, fontWeight: 700, color: '#fff',
                    background: getRiskColor(selectedCompany.avg_risk_index),
                  }}>
                    {selectedCompany.avg_risk_index.toFixed(1)}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[
                    { label: '사고건수', value: selectedCompany.accident_count, unit: '건' },
                    { label: '사망사고', value: selectedCompany.최근10년_사망사고건수, unit: '건', color: selectedCompany.최근10년_사망사고건수 > 0 ? '#ef4444' : '#10b981' },
                    { label: '산업재해율', value: `${selectedCompany['산업재해율(%)']}%`, unit: '' },
                    { label: '10년 사고', value: selectedCompany.최근10년_사고건수, unit: '건' },
                  ].map(item => (
                    <div key={item.label} style={{ background: '#f8fafc', border: '1px solid var(--border-default)', borderRadius: 8, padding: 12 }}>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>{item.label}</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: (item as any).color || 'var(--text-primary)' }}>
                        {item.value}<span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 2 }}>{item.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { label: '신용등급', value: selectedCompany.신용등급 },
                    { label: '직원규모', value: selectedCompany.직원규모 },
                    { label: '매출규모', value: selectedCompany.연매출규모 },
                    { label: '안전인증', value: selectedCompany.안전인증보유 },
                    { label: '보험등급', value: selectedCompany.보험료_등급 },
                    { label: '사고추세', value: selectedCompany.최근3년_사고추세 },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--border-default)' }}>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.label}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, padding: 32, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <Info style={{ width: 32, height: 32, color: 'var(--text-muted)', margin: '0 auto 16px' }} />
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>버블을 클릭하면<br />건설사 상세정보를 확인합니다.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Top Risk Table */}
        <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, padding: 24, marginBottom: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle style={{ width: 18, height: 18, color: '#f97316' }} />
              고위험 건설사 Top 20
            </h3>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginTop: 4 }}>Top 20 High-Risk Companies</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
                  {['#', '건설사명', 'Risk Index', '사고건수', '사망', '재해율(%)', '보험등급', '추세', '신용', '인증'].map(h => (
                    <th key={h} style={{ padding: '12px 8px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 20).map((c, i) => (
                  <tr
                    key={i}
                    onClick={() => setSelectedCompany(c)}
                    style={{ borderBottom: '1px solid var(--border-default)', cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '10px 8px', fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{i + 1}</td>
                    <td style={{ padding: '10px 8px', fontSize: 13, color: 'var(--text-primary)', fontWeight: 600, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.시공회사명}</td>
                    <td style={{ padding: '10px 8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 60, height: 6, borderRadius: 3, background: 'var(--border-default)', overflow: 'hidden' }}>
                          <div style={{ width: `${Math.min(100, c.avg_risk_index * 15)}%`, height: '100%', borderRadius: 3, background: getRiskColor(c.avg_risk_index) }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: getRiskColor(c.avg_risk_index) }}>{c.avg_risk_index.toFixed(1)}</span>
                      </div>
                    </td>
                    <td style={{ padding: '10px 8px', fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>{c.accident_count}</td>
                    <td style={{ padding: '10px 8px', fontSize: 12, color: c.최근10년_사망사고건수 > 0 ? '#ef4444' : 'var(--text-muted)', fontWeight: 700 }}>{c.최근10년_사망사고건수}</td>
                    <td style={{ padding: '10px 8px', fontSize: 12, color: 'var(--text-secondary)' }}>{c['산업재해율(%)']}</td>
                    <td style={{ padding: '10px 8px' }}>
                      <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: `${getInsuranceColor(c.보험료_등급)}20`, color: getInsuranceColor(c.보험료_등급), fontWeight: 700 }}>
                        {c.보험료_등급.split('(')[0]}
                      </span>
                    </td>
                    <td style={{ padding: '10px 8px' }}>{getTrendIcon(c.최근3년_사고추세)}</td>
                    <td style={{ padding: '10px 8px', fontSize: 11, color: 'var(--text-muted)' }}>{c.신용등급}</td>
                    <td style={{ padding: '10px 8px', fontSize: 10, color: 'var(--text-muted)' }}>{c.안전인증보유}</td>
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

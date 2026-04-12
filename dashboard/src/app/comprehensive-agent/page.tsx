'use client';

import React, { useState } from 'react';
import { Database, Calculator, Search, Activity, ShieldCheck, CheckCircle, AlertOctagon, User, Building, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// In Next.js, importing huge static JSON is possible but to avoid slowing down dev server, we can fetch or just take top results.
// For demonstration, we'll try to import or if error, we'll fallback to a mock fetch.
import companiesDataset from '../../data/companies.json';

const GaugeChart = ({ value, label, color }: { value: number, label: string, color: string }) => {
  const data = [
    { name: 'value', value: value },
    { name: 'rest', value: 100 - value }
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: 120, height: 70, position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius={45}
              outerRadius={60}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              <Cell fill={color} />
              <Cell fill="#e2e8f0" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, textAlign: 'center', fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
          {value}
        </div>
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginTop: 8, textAlign: 'center' }}>{label}</div>
    </div>
  );
};

export default function ComprehensiveAgentPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);

  const datasetArr = Array.isArray(companiesDataset) ? companiesDataset : (companiesDataset as any)?.default || [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    
    if (val.trim().length > 0) {
      const filtered = datasetArr.filter((c: any) => c['시공회사명'] && c['시공회사명'].includes(val)).slice(0, 10);
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  // ── Industry averages (computed from full dataset) ──
  const industryAvg = React.useMemo(() => {
    const n = datasetArr.length || 1;
    const creditRank: Record<string, number> = { 'AAA': 100, 'AA+': 95, 'AA': 90, 'AA-': 85, 'A+': 80, 'A': 75, 'A-': 70, 'BBB+': 65, 'BBB': 60, 'BBB-': 55, 'BB+': 50, 'BB': 45, 'BB-': 40, 'B+': 35, 'B': 30, 'CCC': 20 };
    const avgCreditNum = datasetArr.reduce((s: number, c: any) => s + (creditRank[c['신용등급']] || 50), 0) / n;
    const avgAccCount = datasetArr.reduce((s: number, c: any) => s + (c['accident_count'] || 0), 0) / n;
    const avg10y = datasetArr.reduce((s: number, c: any) => s + (c['최근10년_사고건수'] || 0), 0) / n;
    const avgRate = datasetArr.reduce((s: number, c: any) => s + (c['산업재해율(%)'] || 0), 0) / n;
    const avgRisk = datasetArr.reduce((s: number, c: any) => s + (c['avg_risk_index'] || 0), 0) / n;
    return { creditNum: avgCreditNum, accCount: avgAccCount, acc10y: avg10y, rate: avgRate, risk: avgRisk, creditRank };
  }, [datasetArr]);

  // ── Score a single metric: 70 = average, linear scale ──
  const scoreMetric = (value: number, avg: number, higherIsBetter: boolean) => {
    if (avg === 0) return 70;
    const ratio = value / avg;
    // ratio=1 → 70pt. Better than avg → higher score, worse → lower.
    let score: number;
    if (higherIsBetter) {
      score = 70 + (ratio - 1) * 50; // e.g., 1.5x avg → 95pt
    } else {
      score = 70 - (ratio - 1) * 50; // e.g., 1.5x avg (worse) → 45pt
    }
    return Math.max(0, Math.min(100, Math.round(score)));
  };

  const gradeFromAvgScore = (avgScore: number) => {
    if (avgScore >= 85) return { l: 'A', name: '최우량 (보험료 최대 할인)', color: '#059669', bg: '#f0fdf4', border: '#bbf7d0' };
    if (avgScore >= 75) return { l: 'B', name: '우량 (보험료 할인)', color: '#84cc16', bg: '#ecfccb', border: '#d9f99d' };
    if (avgScore >= 65) return { l: 'C', name: '보통 (표준요율)', color: '#8b5cf6', bg: '#f3e8ff', border: '#e9d5ff' };
    if (avgScore >= 50) return { l: 'D', name: '주의 (보험료 할증)', color: '#f97316', bg: '#fff7ed', border: '#ffedd5' };
    return { l: 'E', name: '위험 (가입제한)', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' };
  };

  const handleSelectCompany = (company: any) => {
    setIsSearching(true);
    setSearchResults([]);
    setSearchTerm(company['시공회사명']);
    
    setTimeout(() => {
      const cr = industryAvg.creditRank;
      const compCreditNum = cr[company['신용등급']] || 50;

      const financeScore = scoreMetric(compCreditNum, industryAvg.creditNum, true); // higher credit = better
      const creditScore = financeScore; // same basis
      const historyScore = scoreMetric(company['최근10년_사고건수'] || 0, industryAvg.acc10y, false); // lower = better
      const accidentRateScore = scoreMetric(company['산업재해율(%)'] || 0, industryAvg.rate, false); // lower = better
      const averageRiskScore = scoreMetric(company['avg_risk_index'] || 0, industryAvg.risk, false); // lower = better

      const avgOfScores = Math.round((financeScore + creditScore + historyScore + accidentRateScore + averageRiskScore) / 5);
      const finalGrade = gradeFromAvgScore(avgOfScores);

      // dynamic eval texts comparing to industry avg
      const comp = (val: number, avg: number, unit: string, lowerBetter: boolean) => {
        const diff = val - avg;
        const pct = avg !== 0 ? Math.abs(diff / avg * 100).toFixed(0) : '0';
        if (Math.abs(diff) < avg * 0.05) return `업계 평균(${avg.toFixed(2)}${unit})과 유사한 수준입니다.`;
        if (lowerBetter) {
          return diff > 0
            ? `업계 평균 ${avg.toFixed(2)}${unit} 대비 ${pct}% 높아 주의가 필요합니다.`
            : `업계 평균 ${avg.toFixed(2)}${unit} 대비 ${pct}% 낮아 양호합니다.`;
        } else {
          return diff > 0
            ? `업계 평균 ${avg.toFixed(2)}${unit} 대비 ${pct}% 높아 양호합니다.`
            : `업계 평균 ${avg.toFixed(2)}${unit} 대비 ${pct}% 낮아 주의가 필요합니다.`;
        }
      };

      const creditDesc = (() => {
        const avg = industryAvg.creditNum;
        if (compCreditNum >= avg + 10) return `업계 평균 신용수준 대비 우수한 등급입니다.`;
        if (compCreditNum >= avg - 5)  return `업계 평균 신용수준과 유사한 등급입니다.`;
        return `업계 평균 신용수준 대비 낮은 등급으로 주의가 필요합니다.`;
      })();

      setSelectedCompany({
        data: company,
        gradeInfo: finalGrade,
        avgScore: avgOfScores,
        scores: {
          finance: financeScore,
          credit: creditScore,
          history: historyScore,
          accidentRate: accidentRateScore,
          averageRisk: averageRiskScore
        },
        evals: {
          finance: creditDesc,
          credit: creditDesc,
          history: comp(company['최근10년_사고건수'] || 0, industryAvg.acc10y, '건', true),
          accidentRate: comp(company['산업재해율(%)'] || 0, industryAvg.rate, '%', true),
          averageRisk: comp(company['avg_risk_index'] || 0, industryAvg.risk, '', true),
        }
      });
      setIsSearching(false);
    }, 800);
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    const dataset = Array.isArray(companiesDataset) ? companiesDataset : (companiesDataset as any)?.default || [];
    const matchedCompany = dataset.find((c: any) => c['시공회사명'] && c['시공회사명'].includes(searchTerm));
    
    if (matchedCompany) {
      handleSelectCompany(matchedCompany);
    } else {
      alert("검색 결과가 없습니다.");
    }
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100vh',
      fontFamily: "'Pretendard', 'Inter', sans-serif",
      color: 'var(--text-secondary)', background: 'var(--bg-root)',
      overflowY: 'auto'
    }}>
      {/* ══════════ Header ══════════ */}
      <div style={{
        background: '#002A7A',
        height: 80, boxSizing: 'border-box',
        padding: '0 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em' }}>
          리스크 종합평가 Agent
        </h1>
      </div>

      <div style={{ padding: '32px 40px', flex: 1, display: 'flex', flexDirection: 'column' }}>

        <div style={{ display: 'flex', gap: 40, flex: 1 }}>
          
          {/* Left Column: Narrow Layout */}
          <div style={{ flex: '0 0 350px', display: 'flex', flexDirection: 'column', gap: 24, position: 'relative' }}>
            <div style={{ position: 'absolute', left: 24, top: 20, bottom: 20, width: 2, background: 'linear-gradient(to bottom, #dbeafe, #bae6fd, #e0f2fe)', zIndex: 0 }}></div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#0072BC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(0, 114, 188, 0.2)' }}>
                  <Activity style={{ width: 22, height: 22, color: '#fff' }} />
                </div>
                <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: 12, flex: 1 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>1. 위험도 예측 Agent</h3>
                  <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.5, wordBreak: 'keep-all' }}>
                    사고확률 × 사고손실비용 = 위험비용 산출 결과를 바탕으로 진행합니다.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#0072BC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(0, 114, 188, 0.2)' }}>
                  <Database style={{ width: 22, height: 22, color: '#fff' }} />
                </div>
                <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: 12, flex: 1 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>2. 금융/신용 데이터</h3>
                  <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.5, wordBreak: 'keep-all', marginBottom: 8 }}>
                    금융데이터 : 신용평가사, 건설공제조합, 보험사 내부 DB<br/>
                    신용데이터 : 고용노동부 DB, KOSHA
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#0072BC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(0, 114, 188, 0.2)' }}>
                  <ShieldCheck style={{ width: 22, height: 22, color: '#fff' }} />
                </div>
                <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: 12, flex: 1 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>3. 종합 리스크 등급 체계</h3>
                  <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.5, wordBreak: 'keep-all' }}>
                    다중요소 종합평가 결과를 기반으로, 5단계 리스크 등급 산출을 진행합니다.
                  </p>
                </div>
              </div>

              {/* Grading Guidelines Matrix Moved Here out of the card */}
              <div style={{ display: 'grid', gap: 4, marginTop: 12, paddingLeft: 66 }}>
                {[
                  { grade: 'A', name: '최우량', desc: '안전관리 체계 우수, 재무건전', action: '보험료 최대 할인', bg: '#059669', tc: '#ffffff' },
                  { grade: 'B', name: '우량', desc: '평균이상 안전관리, 재무안전', action: '보험료 할인', bg: '#84cc16', tc: '#ffffff' },
                  { grade: 'C', name: '보통', desc: '평균수준 안전관리, 평균 사고율', action: '표준요율', bg: '#8b5cf6', tc: '#ffffff' },
                  { grade: 'D', name: '주의', desc: '안전관리 미흡, 사고 빈도 높음', action: '보험료 할증', bg: '#f97316', tc: '#ffffff' },
                  { grade: 'E', name: '위험', desc: '중대재해 이력, 재무 위기', action: '가입제한', bg: '#dc2626', tc: '#ffffff' },
                ].map(g => (
                  <div key={g.grade} style={{ display: 'flex', alignItems: 'stretch', borderRadius: 4, overflow: 'hidden', border: '1px solid #e2e8f0', background: '#fff' }}>
                    <div style={{ width: 60, background: g.bg, color: g.tc, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 11 }}>
                      {g.grade}. {g.name}
                    </div>
                    <div style={{ flex: 1, padding: '4px 8px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2, fontSize: 10 }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{g.action}</span>
                      <span style={{ color: '#64748b', fontSize: 9 }}>{g.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Dashboard Panel */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff', border: '1px solid var(--border-default)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '20px 24px', borderBottom: '1px solid var(--border-default)', background: '#f8fafc' }}>
              <div style={{ background: '#e0f2fe', padding: '4px 8px', borderRadius: 4, color: '#0369a1', fontSize: 12, fontWeight: 700 }}>Agent 패널</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>종합적 리스크 등급 산출</h3>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 24, flex: 1, overflowY: 'auto' }}>
              
              {/* Search Bar */}
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Search style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#94a3b8' }} />
                    <input 
                      type="text" 
                      placeholder="조회할 시공사명을 입력하세요 (예: 현대건설)"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      onKeyDown={e => e.key === 'Enter' && handleSearch()}
                      style={{ 
                        width: '100%', padding: '12px 16px 12px 42px', 
                        border: '1px solid var(--border-default)', borderRadius: 8,
                        fontSize: 14, outline: 'none', background: '#f8fafc',
                        boxSizing: 'border-box'
                      }}
                      onFocus={e => { e.target.style.background = '#fff'; e.target.style.borderColor = '#002A7A'; }}
                      onBlur={e => { e.target.style.background = '#f8fafc'; e.target.style.borderColor = 'var(--border-default)'; }}
                    />
                  </div>
                  <button 
                    onClick={handleSearch}
                    style={{ 
                      padding: '12px 32px', background: '#002A7A', color: '#fff', 
                      borderRadius: 8, fontSize: 14, fontWeight: 700, border: 'none', 
                      cursor: 'pointer', whiteSpace: 'nowrap',
                      boxShadow: '0 4px 12px rgba(0, 42, 122, 0.2)'
                    }}
                  >
                    데이터 분석
                  </button>
                </div>

                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                  <div style={{ position: 'absolute', top: 50, left: 0, right: 0, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 50, maxHeight: 200, overflowY: 'auto' }}>
                    {searchResults.map((company, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => handleSelectCompany(company)}
                        style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                      >
                        <Building style={{ width: 16, height: 16, color: '#64748b' }}/>
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>{company['시공회사명']}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {isSearching ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 16 }}>
                  <Activity className="animate-spin text-cyan-600" style={{ width: 40, height: 40, animation: 'spin 2s linear infinite' }} />
                  <span style={{ fontSize: 15, fontWeight: 600, color: '#475569' }}>선택된 기업의 종합평가 진행 중...</span>
                </div>
              ) : selectedCompany ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                  
                  {/* Company Profile Card */}
                  <div style={{ 
                    border: '1px solid #e2e8f0', borderRadius: 16, padding: '24px', background: '#fff',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.02)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, background: '#f0f9ff', border: '1px solid #bae6fd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Building style={{ width: 24, height: 24, color: '#0369a1' }} />
                        </div>
                        <div>
                          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a' }}>{selectedCompany.data['시공회사명']}</h2>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 16, fontWeight: 800, color: selectedCompany.gradeInfo.color }}>{selectedCompany.data['보험료_등급']}</div>
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>최근 3년: {selectedCompany.data['최근3년_사고추세']}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
                      <div style={{ flex: 1, background: '#f8fafc', borderRadius: 12, padding: '16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 4 }}><AlertOctagon style={{ width: 12, height: 12 }}/> CREDIT</span>
                          <span style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>{selectedCompany.data['신용등급']}</span>
                        </div>
                      </div>
                      <div style={{ flex: 1, background: '#f8fafc', borderRadius: 12, padding: '16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#3b82f6', display: 'flex', alignItems: 'center', gap: 4 }}><User style={{ width: 12, height: 12 }}/> SIZE</span>
                          <span style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>{selectedCompany.data['직원규모']}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: 24 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: 6 }}><TrendingUp style={{ width: 14, height: 14 }}/> Avg Risk index</span>
                        <span style={{ fontSize: 18, fontWeight: 800, color: '#059669' }}>{selectedCompany.data['avg_risk_index']}</span>
                      </div>
                      <div style={{ height: 6, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: '#059669', width: `${Math.min(100, Math.max(0, (selectedCompany.data['avg_risk_index']/5)*100))}%` }}></div>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid #f1f5f9', marginTop: 24, paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, fontWeight: 600, color: '#64748b' }}>
                      <span>{selectedCompany.data['accident_count']} Total Cases</span>
                      <span style={{ color: '#0ea5e9', cursor: 'pointer' }}>Details &gt;</span>
                    </div>
                  </div>

                  {/* Final Risk Grade Banner */}
                  <div style={{ padding: '16px 24px', background: selectedCompany.gradeInfo.bg, border: `1px solid ${selectedCompany.gradeInfo.border}`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <CheckCircle style={{ width: 24, height: 24, color: selectedCompany.gradeInfo.color }} />
                      <div>
                        <p style={{ fontSize: 13, color: selectedCompany.gradeInfo.color, fontWeight: 600, marginBottom: 4 }}>Risk Grading 분석 완료</p>
                        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a' }}>
                          {selectedCompany.data['시공회사명']} 종합 리스크 등급: <span style={{ fontSize: 26, color: selectedCompany.gradeInfo.color }}>{selectedCompany.gradeInfo.l} 등급</span>
                        </h2>
                      </div>
                    </div>
                    <div style={{ padding: '8px 16px', background: selectedCompany.gradeInfo.color, color: '#fff', borderRadius: 8, fontWeight: 700, fontSize: 14 }}>
                      {selectedCompany.gradeInfo.name}
                    </div>
                  </div>

                  {/* Detailed Analysis Breakdown */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                      <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>세부 지표 평가 내역</h4>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#64748b', background: '#f1f5f9', padding: '2px 10px', borderRadius: 12 }}>평균 {selectedCompany.avgScore}점</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {[
                        { title: '금융데이터', score: selectedCompany.scores.finance, actualValue: `매출규모 ${selectedCompany.data['연매출규모']}`, evalText: selectedCompany.evals.finance },
                        { title: '신용데이터', score: selectedCompany.scores.credit, actualValue: `신용등급 ${selectedCompany.data['신용등급']}`, evalText: selectedCompany.evals.credit },
                        { title: '사건사고이력', score: selectedCompany.scores.history, actualValue: `최근 10년 ${selectedCompany.data['최근10년_사고건수']}건 (사망 ${selectedCompany.data['최근10년_사망사고건수']}건)`, evalText: selectedCompany.evals.history },
                        { title: '산업재해율', score: selectedCompany.scores.accidentRate, actualValue: `산업재해율 ${selectedCompany.data['산업재해율(%)']}%`, evalText: selectedCompany.evals.accidentRate },
                        { title: '평균사고위험도', score: selectedCompany.scores.averageRisk, actualValue: `Risk Index ${selectedCompany.data['avg_risk_index']}`, evalText: selectedCompany.evals.averageRisk }
                      ].map((item, idx) => {
                        const barColor = item.score >= 75 ? '#22c55e' : item.score >= 60 ? '#0ea5e9' : item.score >= 45 ? '#f59e0b' : '#ef4444';
                        return (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '12px 16px', gap: 16 }}>
                          <span style={{ width: 100, fontSize: 13, fontWeight: 700, color: '#334155', flexShrink: 0 }}>{item.title}</span>
                          <span style={{ width: 50, fontSize: 14, fontWeight: 800, color: barColor, flexShrink: 0 }}>{item.score}점</span>
                          <div style={{ height: 12, flex: '0 0 80px', background: '#e2e8f0', borderRadius: 6, overflow: 'hidden' }}>
                            <div style={{ height: '100%', background: barColor, width: `${item.score}%` }}></div>
                          </div>
                          <span style={{ width: 160, fontSize: 12, fontWeight: 700, color: '#0369a1', flexShrink: 0 }}>{item.actualValue}</span>
                          <span style={{ flex: 1, fontSize: 11, color: '#475569', lineHeight: 1.4 }}>{item.evalText}</span>
                        </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 5 Gauge Charts */}
                  <div>
                    <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>상세 지표 요약 (100점 환산 게이지)</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'space-between', padding: '24px 32px', background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                      <GaugeChart value={selectedCompany.scores.finance} label="금융데이터" color="#3b82f6" />
                      <GaugeChart value={selectedCompany.scores.credit} label="신용데이터" color="#8b5cf6" />
                      <GaugeChart value={selectedCompany.scores.history} label="사건사고이력" color="#06b6d4" />
                      <GaugeChart value={selectedCompany.scores.accidentRate} label="산업재해율" color="#f59e0b" />
                      <GaugeChart value={selectedCompany.scores.averageRisk} label="평균사고위험도" color="#ec4899" />
                    </div>
                  </div>

                </div>
              ) : (
                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: '#94a3b8', gap: 12 }}>
                   <Search style={{ width: 48, height: 48, opacity: 0.5 }} />
                   <p style={{ fontSize: 14 }}>시공사명(예: 지평건설산업)을 검색하여 종합 리스크 등급을 확인해보세요.</p>
                 </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

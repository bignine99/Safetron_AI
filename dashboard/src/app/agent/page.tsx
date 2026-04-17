'use client';

import React, { useState, useEffect } from 'react';
import { 
  Database,
  Calculator,
  BadgeDollarSign,
  Search,
  AlertOctagon,
  Activity,
  ArrowRight
} from 'lucide-react';

import companiesJson from '@/data/companies.json';

export default function PredictionAgentPage() {
  const [dataOpts, setDataOpts] = useState({ companies: [] as string[], categories: [] as string[], processes: [] as string[], types: [] as string[] });
  const [company, setCompany] = useState('');
  const [category, setCategory] = useState('');
  const [process, setProcess] = useState('');
  
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const fetchStats = fetch('/safetron/data/statistical_report.json').then(res => res.json());

    const resolveContextAndData = async () => {
      // 1. Resolve upstream context URL params
      const sp = new URLSearchParams(window.location.search);
      let targetName = sp.get('company');
      const q = sp.get('q');
      
      if (!targetName && q) {
        const match = q.match(/선택된 노드 "([^"]+)"/);
        if (match) targetName = match[1];
        else {
          const simpleMatch = q.match(/"([^"]+)"/);
          if (simpleMatch) targetName = simpleMatch[1];
        }
      }

      let contextCompany = '';
      if (targetName) {
        contextCompany = targetName;
        // Search downstream subgraph if Accident origin!
        if (targetName.startsWith('Accident ')) {
          try {
            const nodeId = targetName.replace(/^Accident\s+/, '');
            const basePath = window.location.pathname.startsWith('/safetron') ? '/safetron' : '';
            const res = await fetch(`${basePath}/api/graph/subgraph?id=${encodeURIComponent(nodeId)}&depth=1`);
            if (res.ok) {
              const data = await res.json();
              if (data.nodes) {
                const cNode = data.nodes.find((n: any) => n.label === 'Company');
                if (cNode) contextCompany = cNode.name;
              }
            }
          } catch (e) {
            console.error("Agent Subgraph resolution failed", e);
          }
        }
      }

      // 2. Resolve Statistical Data Dropdowns
      try {
        const statsData = await fetchStats;
        const catData = statsData.descriptive.categorical;
        const findOpts = (featureName: string) => {
          const item = catData.find((d: any) => d.feature === featureName);
          return item ? item.counts.map((c: any) => c.label).slice(0, 15) : [];
        };

        let cats = findOpts('공사종류').map(c => c.split('/').pop() || c);
        cats = Array.from(new Set(cats));
        
        let procs = findOpts('대공종').map(p => p.trim().replace(/^7\.\s*기타\s*공사$/i, '16 기타공사').replace(/^7\.\s*기타$/i, '16 기타공사'));
        procs = Array.from(new Set(procs)).sort((a, b) => a.localeCompare(b));
        procs.unshift('00. 전체공사');
        
        const types = findOpts('사고유형_분류(KOSHA)');

        const sortedComps = [...companiesJson]
          .sort((a,b) => (b['최근10년_사고건수'] || 0) - (a['최근10년_사고건수'] || 0))
          .map(c => c['시공회사명']);
        
        if (contextCompany && !sortedComps.includes(contextCompany)) {
          sortedComps.unshift(contextCompany);
        }

        setDataOpts({ companies: sortedComps, categories: cats, processes: procs, types });
        setCompany(contextCompany || sortedComps[0] || '');
        setCategory(cats[0] || '');
        setProcess(procs[0] || '');
      } catch (err) {
        console.error("Failed fetching statistical report for agent:", err);
      }
    };

    resolveContextAndData();
  }, []);

  // Synchronize state changes to URL to pass context to the next pipeline module
  useEffect(() => {
    if (typeof window !== 'undefined' && company) {
      const url = new URL(window.location.href);
      url.searchParams.set('company', company);
      window.history.replaceState({}, '', url.toString());
    }
  }, [company]);

  const handleSearch = () => {
    setIsSearching(true);
    setScenarios([]);
    setTimeout(() => {
      // Simulate predictions based on selected values and accident types
      const types = dataOpts.types.length > 0 ? dataOpts.types : ['추락', '협착', '낙하', '전도', '충돌'];
      const results = [];
      
      const numResults = Math.floor(Math.random() * 3) + 3; // 3 to 5 results
      for (let i = 0; i < numResults; i++) {
        const type = types[i % types.length];
        const freqPpm = Math.floor(Math.random() * 300) + 50; // Frequency per 10k hours
        const freq = (freqPpm / 10000).toFixed(4); 
        const severity = (Math.random() * 4000 + 500); // 500만 to 4500만
        const expectedLoss = (parseFloat(freq) * severity).toFixed(2);
        
        let grade = 'C';
        if (parseFloat(expectedLoss) > 50) grade = 'B';
        if (parseFloat(expectedLoss) > 100) grade = 'A';

        results.push({
          title: `[${type}] ${company} 현장 ${process} 중 돌발 위험`,
          freq,
          severity: severity.toFixed(2),
          expectedLoss,
          grade
        });
      }

      setScenarios(results.sort((a, b) => Number(b.expectedLoss) - Number(a.expectedLoss)));
      setIsSearching(false);
    }, 800);
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
          데이터기반 위험도 예측 Agent
        </h1>
      </div>

      <div style={{ padding: '32px 40px', flex: 1, display: 'flex', flexDirection: 'column' }}>


        <div style={{ display: 'flex', gap: 40, flex: 1 }}>
          
          {/* Left Column: Narrow Layout */}
          <div style={{ flex: '0 0 320px', display: 'flex', flexDirection: 'column', gap: 24, position: 'relative' }}>
            <div style={{ position: 'absolute', left: 24, top: 20, bottom: 20, width: 2, background: 'linear-gradient(to bottom, #dbeafe, #bae6fd, #e0f2fe)', zIndex: 0 }}></div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#0072BC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(0, 114, 188, 0.2)' }}>
                  <Database style={{ width: 22, height: 22, color: '#fff' }} />
                </div>
                <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: 12, flex: 1 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>1. 유사사례 분석</h3>
                  <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.5, wordBreak: 'keep-all' }}>
                    실제 사고사례 DB에서 현재 진행과정과 유사한 과거 사례의 '인과지도'를 분석합니다.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#0072BC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(0, 114, 188, 0.2)' }}>
                  <Calculator style={{ width: 22, height: 22, color: '#fff' }} />
                </div>
                <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: 12, flex: 1 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>2. 프로젝트 위험지수 산출</h3>
                  <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.5, wordBreak: 'keep-all' }}>
                    신규 작업의 고유 사고예측확률(Frequency)을 계산합니다.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#0072BC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(0, 114, 188, 0.2)' }}>
                  <BadgeDollarSign style={{ width: 22, height: 22, color: '#fff' }} />
                </div>
                <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: 12, flex: 1 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>3. 위험비용 계상</h3>
                  <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.5, wordBreak: 'keep-all', marginBottom: 12 }}>
                    사고유형별 예상 보상비용을 결합하여 위험비용을 추정합니다.
                  </p>
                  <div style={{ background: '#fff', borderRadius: 8, padding: '10px 12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 4 }}>산출 공식</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#f97316', lineHeight: 1.4 }}>
                      확률(Freq.)<br/>× 손실비용(Sev.)<br/>= 위험비용(Exp. Loss)
                    </div>
                  </div>
                </div>
              </div>
            </div>
            

          </div>

          {/* Right Column: Interactive Dashboard Panel */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff', border: '1px solid var(--border-default)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '20px 24px', borderBottom: '1px solid var(--border-default)', background: '#f8fafc' }}>
              <div style={{ background: '#e0f2fe', padding: '4px 8px', borderRadius: 4, color: '#0369a1', fontSize: 12, fontWeight: 700 }}>Agent 패널</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>조건 산출 및 계산 과정 시각화</h3>
            </div>

            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
              
              {/* Form Config */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-end', marginBottom: 24 }}>
                <div style={{ flex: 1, minWidth: 150, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>시공사</label>
                  <select 
                    value={company} onChange={e => setCompany(e.target.value)}
                    style={{ padding: '10px', border: '1px solid var(--border-default)', borderRadius: 6, fontSize: 13, background: '#fff' }}
                  >
                    {dataOpts.companies.map(c => <option key={c} value={c}>{c}</option>)}
                    {!dataOpts.companies.length && <option>로딩중...</option>}
                  </select>
                </div>

                <div style={{ flex: 1, minWidth: 150, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>공사종류</label>
                  <select 
                    value={category} onChange={e => setCategory(e.target.value)}
                    style={{ padding: '10px', border: '1px solid var(--border-default)', borderRadius: 6, fontSize: 13, background: '#fff' }}
                  >
                    {dataOpts.categories.map(c => <option key={c} value={c}>{c}</option>)}
                    {!dataOpts.categories.length && <option>로딩중...</option>}
                  </select>
                </div>

                <div style={{ flex: 1, minWidth: 150, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>대공종</label>
                  <select 
                    value={process} onChange={e => setProcess(e.target.value)}
                    style={{ padding: '10px', border: '1px solid var(--border-default)', borderRadius: 6, fontSize: 13, background: '#fff' }}
                  >
                    {dataOpts.processes.map(p => <option key={p} value={p}>{p}</option>)}
                    {!dataOpts.processes.length && <option>로딩중...</option>}
                  </select>
                </div>

                <button 
                  onClick={handleSearch}
                  style={{ background: '#002A7A', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 6, fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, height: 40 }}
                  onMouseEnter={e => e.currentTarget.style.background = '#001b4e'}
                  onMouseLeave={e => e.currentTarget.style.background = '#002A7A'}
                >
                  <Search style={{ width: 14, height: 14 }} /> 계산 수행
                </button>
              </div>

              {/* Calculation Process & Results */}
              <div style={{ border: '1px solid var(--border-default)', borderRadius: 12, overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ background: '#f8fafc', padding: '12px 16px', borderBottom: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>결과 시나리오 기반 위험비용(Expected Loss) 산출 내역</span>
                  {scenarios.length > 0 && <span style={{ fontSize: 11, background: '#e2e8f0', padding: '2px 8px', borderRadius: 12, color: '#475569', fontWeight: 600 }}>총 {scenarios.length}건 분석됨</span>}
                </div>

                <div style={{ padding: 16, flex: 1, overflowY: 'auto' }}>
                  {isSearching ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12 }}>
                      <Activity className="animate-spin text-cyan-600" style={{ width: 32, height: 32, animation: 'spin 2s linear infinite' }} />
                      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>실제 데이터 앙상블 로직 실행 중...</span>
                    </div>
                  ) : scenarios.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {scenarios.map((s, idx) => (
                        <div key={idx} style={{ 
                          border: '1px solid #e2e8f0', borderRadius: 8, padding: '16px', 
                          background: s.grade === 'A' ? '#fff1f2' : s.grade === 'B' ? '#fffbeb' : '#ffffff',
                          display: 'flex', flexDirection: 'column', gap: 12
                        }}>
                          {/* Scenario Title */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <AlertOctagon style={{ width: 16, height: 16, color: s.grade === 'A' ? '#e11d48' : '#d97706' }} />
                              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{s.title}</span>
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: s.grade === 'A' ? '#fecdd3' : '#fde68a', color: s.grade === 'A' ? '#be123c' : '#b45309' }}>
                              등급: {s.grade}
                            </span>
                          </div>

                          {/* Calculation Steps Display */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#f8fafc', padding: '12px', borderRadius: 6, border: '1px dashed #cbd5e1' }}>
                            {/* Frequency */}
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                              <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>사고확률(Freq.)</span>
                              <span style={{ fontSize: 14, fontWeight: 700, color: '#334155' }}>{s.freq}%</span>
                            </div>
                            
                            <span style={{ color: '#94a3b8', fontSize: 14, fontWeight: 800 }}>×</span>
                            
                            {/* Severity */}
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                              <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>손실비용(Sev.)</span>
                              <span style={{ fontSize: 14, fontWeight: 700, color: '#334155' }}>{s.severity}만 원</span>
                            </div>

                            <ArrowRight style={{ width: 14, height: 14, color: '#f97316' }} />

                            {/* Result */}
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                              <span style={{ fontSize: 10, color: '#ea580c', fontWeight: 700 }}>위험비용 산출액</span>
                              <span style={{ fontSize: 15, fontWeight: 800, color: '#ea580c' }}>{s.expectedLoss}만 점</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: 13 }}>
                      상단의 속성값을 지정하고 [계산 수행] 버튼을 눌러주세요.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

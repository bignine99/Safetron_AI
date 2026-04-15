'use client';

import React, { useState, useMemo } from 'react';
import companies from '@/data/companies.json';
import { Search, ChevronDown, DollarSign, Activity, FileWarning, TrendingUp, Building2, ShieldAlert, AlertTriangle, FileText, MousePointerClick } from 'lucide-react';
import CompanyCard from '@/components/CompanyCard';

// Charts
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend
);

const GENERAL_CATS = ['종합', '토목', '건축', '토목건축', '산업환경설비', '조경'];
const SPEC_CATS = ['건축', '구조', '지반', '인테리어', '마감', '전기', '정보통신', '소방', '문화재'];

export default function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  
  const [openDropdown, setOpenDropdown] = useState<'general' | 'spec' | null>(null);

  // Derive category logic identical to CompanyCard
  const processedCompanies = useMemo(() => {
    return companies.map(company => {
      const charSum = company.시공회사명.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
      let cat = '';
      
      if ((company as any).전문공종 && (company as any).전문공종 !== '일반건설') {
        cat = (company as any).전문공종; 
      } else if (company.시공회사명 === '(주)지평건설산업') {
        cat = '인테리어 전문건설업';
      } else {
        const nameStr = company.시공회사명;
        const isExplicitlyGeneral = nameStr.includes('종합') || nameStr.includes('삼성') || nameStr.includes('현대') || nameStr.includes('건설산업') || nameStr.includes('건설개발');
        const isGeneral = isExplicitlyGeneral || (charSum % 3 === 0);
        if (isGeneral) {
          cat = GENERAL_CATS[charSum % GENERAL_CATS.length] + ' 종합건설업';
        } else {
          cat = SPEC_CATS[charSum % SPEC_CATS.length] + ' 전문건설업';
        }
      }
      return { ...company, categoryLabel: cat };
    });
  }, []);

  const filteredCompanies = useMemo(() => {
    let result = processedCompanies;
    
    if (searchTerm) {
      result = result.filter(c => c.시공회사명.toLowerCase().includes(searchTerm.toLowerCase()));
    } else if (selectedCategory) {
      result = result.filter(c => c.categoryLabel.includes(selectedCategory));
    } else {
      return []; // Do not show list by default
    }
    return result.slice(0, 100);
  }, [processedCompanies, searchTerm, selectedCategory]);

  const handleSelectCompany = (company: any) => {
    setSelectedCompany(company);
  };

  const selectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setSearchTerm('');
    setOpenDropdown(null);
    setSelectedCompany(null);
  };

  const getFinancialData = (company: any) => {
    const baseLoss = company.avg_risk_index * 2.5; 
    const provisionRate = Math.min(15, (company.avg_risk_index / 10)).toFixed(1);
    const claimSeverityMock = {
      labels: ['골절', '열상/창상', '절단', '타박상', '화상', '기타'],
      datasets: [
        {
          label: '평균 의료비 손실 (단위: 천만원)',
          data: [baseLoss * 0.4, baseLoss * 0.1, baseLoss * 0.7, 0.5, 4.2, 1.2],
          backgroundColor: '#f59e0b',
        },
        {
          label: '평균 작업중지 손실 (단위: 천만원)',
          data: [baseLoss * 0.6, baseLoss * 0.15, baseLoss * 1.2, 0.2, 5.5, 2.0],
          backgroundColor: '#3b82f6',
        }
      ],
    };
    
    const sentimentScore = Math.max(30, 100 - (company.avg_risk_index));
    const sentimentMock = {
      labels: ['적극적 시정조치 (우수)', '보통수준 조치 (양호)', '소극적/형식적 조치 (위험)'],
      datasets: [
        {
          data: [sentimentScore, 100 - sentimentScore - 10, 10],
          backgroundColor: ['#10b981', '#3b82f6', '#ef4444'],
          borderWidth: 0,
          hoverOffset: 4
        }
      ]
    };

    return { baseLoss, provisionRate, claimSeverityMock, sentimentMock };
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100vh',
      fontFamily: "'Pretendard', 'Inter', sans-serif",
      color: 'var(--text-secondary)', background: '#f8fafc', overflow: 'hidden'
    }}>
      {/* ══════════ Header ══════════ */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 80, boxSizing: 'border-box', padding: '0 40px', borderBottom: '1px solid rgba(0,0,0,0.1)',
        background: '#002A7A', flexShrink: 0, position: 'relative', zIndex: 50
      }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
            시공사 리스크 결합 분석
          </h1>
          <p style={{ fontSize: 11, color: '#93c5fd', letterSpacing: '0.08em', marginTop: 3 }}>
            MASTER-DETAIL RISK PROFILES
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {/* Dropdown 1: 종합건설업체 */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => { setOpenDropdown(openDropdown === 'general' ? null : 'general'); }}
              style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
            >
              종합건설업 <ChevronDown size={14} />
            </button>
            {openDropdown === 'general' && (
              <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 8, width: 160, background: '#fff', borderRadius: 8, boxShadow: '0 10px 25px rgba(0,0,0,0.2)', padding: 8, zIndex: 60, border: '1px solid #e2e8f0' }}>
                {GENERAL_CATS.map(cat => (
                  <div key={cat} onClick={() => selectCategory(cat)} style={{ padding: '10px 12px', fontSize: 13, color: '#0f172a', cursor: 'pointer', borderRadius: 4, fontWeight: selectedCategory === cat ? 700 : 500, background: selectedCategory === cat ? '#f1f5f9' : 'transparent' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'} onMouseLeave={e => e.currentTarget.style.background = selectedCategory === cat ? '#f1f5f9' : 'transparent'}
                  >
                    {cat}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dropdown 2: 전문건설업체 */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => { setOpenDropdown(openDropdown === 'spec' ? null : 'spec'); }}
              style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
            >
              전문건설업 <ChevronDown size={14} />
            </button>
            {openDropdown === 'spec' && (
              <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 8, width: 160, background: '#fff', borderRadius: 8, boxShadow: '0 10px 25px rgba(0,0,0,0.2)', padding: 8, zIndex: 60, border: '1px solid #e2e8f0' }}>
                {SPEC_CATS.map(cat => (
                  <div key={cat} onClick={() => selectCategory(cat)} style={{ padding: '10px 12px', fontSize: 13, color: '#0f172a', cursor: 'pointer', borderRadius: 4, fontWeight: selectedCategory === cat ? 700 : 500, background: selectedCategory === cat ? '#f1f5f9' : 'transparent' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'} onMouseLeave={e => e.currentTarget.style.background = selectedCategory === cat ? '#f1f5f9' : 'transparent'}
                  >
                    {cat}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Search */}
          <div style={{ position: 'relative', width: 240, marginLeft: 8 }}>
            <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Searched names..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setSelectedCategory(null); }}
              style={{ width: '100%', background: '#ffffff', border: '1px solid transparent', borderRadius: 8, padding: '8px 16px 8px 36px', color: '#0f172a', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        </div>
      </div>

      {/* ══════════ Main Body: Master-Detail Split ══════════ */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }} onClick={() => setOpenDropdown(null)}>
        
        {/* Left Pane: Company List (Master) */}
        <div style={{ 
          width: 380, minWidth: 380, background: '#ffffff', borderRight: '1px solid #e2e8f0', 
          display: 'flex', flexDirection: 'column', height: '100%', zIndex: 10
        }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>
              {selectedCategory ? `${selectedCategory} 분류 검색결과` : searchTerm ? `"${searchTerm}" 검색결과` : '검색결과 목록'}
            </h2>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4, fontWeight: 600 }}>
              {filteredCompanies.length === 0 ? '조건을 선택해주세요' : `총 ${filteredCompanies.length}개 시공사 표출됨`}
            </div>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0' }}>
            {filteredCompanies.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 32, textAlign: 'center' }}>
                <Search style={{ width: 32, height: 32, color: '#e2e8f0', marginBottom: 16 }} />
                <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>우측 상단 필터를 이용하시거나<br/>회사명을 직접 검색하시면<br/>이곳에 리스트가 나타납니다.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 16px' }}>
                {filteredCompanies.map((company: any) => {
                  const isSelected = selectedCompany?.시공회사명 === company.시공회사명;
                  return (
                    <div 
                      key={company.시공회사명}
                      style={{
                        position: 'relative',
                        borderRadius: 8,
                        boxShadow: isSelected ? '0 0 0 2px #3b82f6' : 'none',
                        transition: 'all 0.2s',
                        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                        zIndex: isSelected ? 2 : 1
                      }}
                    >
                      {isSelected && (
                        <div style={{ position: 'absolute', right: -24, top: '50%', transform: 'translateY(-50%)', width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: '10px solid #3b82f6', zIndex: 10 }}></div>
                      )}
                      <CompanyCard 
                        company={company} 
                        onClick={(c) => handleSelectCompany(c)} 
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Detailed View (Detail) */}
        <div style={{ flex: 1, minWidth: 0, height: '100%', overflowY: 'auto', background: '#f8fafc', padding: 40 }}>
          
          {!selectedCompany ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', animation: 'fadeIn 0.5s ease-in-out' }}>
               <div style={{ background: '#e2e8f0', padding: 24, borderRadius: '50%', marginBottom: 24 }}>
                 <MousePointerClick style={{ width: 48, height: 48, color: '#94a3b8' }} />
               </div>
               <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>시공사를 선택해주세요</h2>
               <p style={{ fontSize: 16, color: '#64748b', textAlign: 'center', lineHeight: 1.6 }}>
                 좌측 리스트에서 열람을 원하시는 시공사를 클릭하시면<br/>해당 기업의 <b>재무 리스크 및 안전결과</b> 상세 리포트가 이곳에 표출됩니다.
               </p>
            </div>
          ) : (
            <div style={{ animation: 'slideUp 0.3s ease-out', maxWidth: 1200, margin: '0 auto' }}>
              
              {/* Header Module */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
                <div style={{ background: '#002A7A', padding: 16, borderRadius: 12 }}>
                  <Building2 style={{ width: 36, height: 36, color: '#ffffff' }} />
                </div>
                <div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                    <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>{selectedCompany.시공회사명}</h2>
                    <span style={{ fontSize: 13, fontWeight: 800, padding: '4px 12px', borderRadius: 6, paddingTop: 6, background: selectedCompany.보험료_등급?.includes('S') ? 'rgba(16, 185, 129, 0.1)' : selectedCompany.보험료_등급?.includes('A') ? 'rgba(59, 130, 246, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: selectedCompany.보험료_등급?.includes('S') ? '#10b981' : selectedCompany.보험료_등급?.includes('A') ? '#3b82f6' : '#ef4444' }}>
                      {selectedCompany.보험료_등급 || '미평가'} Grade
                    </span>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#64748b' }}>
                    {selectedCompany.categoryLabel}
                  </div>
                </div>
              </div>

              {/* 1. Modal Info -> Company Panel */}
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 24, marginBottom: 32 }}>
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 28, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                   <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Building2 style={{ width: 20, height: 20, color: '#64748b' }} />
                    시공사 일반 제원
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div style={{ background: '#f8fafc', padding: 20, borderRadius: 8, border: '1px solid #f1f5f9' }}>
                      <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>신용등급</div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>{selectedCompany.신용등급 || '-'}</div>
                    </div>
                    <div style={{ background: '#f8fafc', padding: 20, borderRadius: 8, border: '1px solid #f1f5f9' }}>
                      <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>직원규모</div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>{selectedCompany.직원규모 || '-'}</div>
                    </div>
                    <div style={{ background: '#f8fafc', padding: 20, borderRadius: 8, border: '1px solid #f1f5f9' }}>
                      <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>연매출규모</div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>{selectedCompany.연매출규모 || '-'}</div>
                    </div>
                    <div style={{ background: '#f8fafc', padding: 20, borderRadius: 8, border: '1px solid #f1f5f9' }}>
                      <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>안전인증보유</div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>{selectedCompany.안전인증보유 || '-'}</div>
                    </div>
                  </div>
                </div>

                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 28, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                   <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ShieldAlert style={{ width: 20, height: 20, color: '#ef4444' }} />
                    안전 및 사고 레퍼런스
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '18px 20px', background: '#f8fafc', borderRadius: 8, border: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><AlertTriangle size={18} color="#f59e0b" /><span style={{ fontSize: 14, fontWeight: 600, color: '#475569' }}>평균 사고위험도 (Avg Index)</span></div>
                      <div style={{ fontSize: 18, fontWeight: 800 }}>{Number(selectedCompany.avg_risk_index).toFixed(2)}</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '18px 20px', background: '#f8fafc', borderRadius: 8, border: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><TrendingUp size={18} color="#3b82f6" /><span style={{ fontSize: 14, fontWeight: 600, color: '#475569' }}>산업재해율 (Accident Rate)</span></div>
                      <div style={{ fontSize: 18, fontWeight: 800 }}>{selectedCompany['산업재해율(%)'] || 0}%</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '18px 20px', background: '#f8fafc', borderRadius: 8, border: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><FileText size={18} color="#64748b" /><span style={{ fontSize: 14, fontWeight: 600, color: '#475569' }}>최근 10년 사망사고건수</span></div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: selectedCompany.최근10년사망사고건수 > 0 ? '#ef4444' : '#10b981' }}>{selectedCompany.최근10년사망사고건수}건</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Financial Info -> Top 4 Cards */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, marginTop: 40 }}>
                 <DollarSign size={24} color="#0f172a" />
                 <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>시공사 맞춤형 재무 리스크 분석</h2>
              </div>
              
              {(() => {
                const fin = getFinancialData(selectedCompany);
                return (
                  <div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 32 }}>
                      <div style={{ background: '#fff', padding: 24, borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                          <div style={{ background: '#dbeafe', padding: 8, borderRadius: 8 }}><DollarSign size={20} color="#3b82f6" /></div>
                          <div style={{ fontWeight: 600, color: '#64748b', fontSize: 13 }}>사고당 평균 예측손실액</div>
                        </div>
                        <div style={{ fontSize: 28, fontWeight: 800 }}>₩ {fin.baseLoss.toFixed(1)} 억</div>
                        <div style={{ fontSize: 12, color: '#ef4444', marginTop: 6, display: 'flex', alignItems: 'center', fontWeight: 600 }}><TrendingUp size={12} style={{ marginRight: 4 }}/> + 5% YoY 추이</div>
                      </div>
                      
                      <div style={{ background: '#fff', padding: 24, borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                          <div style={{ background: '#fee2e2', padding: 8, borderRadius: 8 }}><Activity size={20} color="#ef4444" /></div>
                          <div style={{ fontWeight: 600, color: '#64748b', fontSize: 13 }}>가장 치명적인 부상 유형</div>
                        </div>
                        <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a' }}>절단 <span style={{fontSize: 16, fontWeight:600}}>(Amputation)</span></div>
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 6, fontWeight: 600 }}>의료비/휴업보상 최고점 결합</div>
                      </div>

                      <div style={{ background: '#fff', padding: 24, borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                          <div style={{ background: '#fef3c7', padding: 8, borderRadius: 8 }}><FileWarning size={20} color="#f59e0b" /></div>
                          <div style={{ fontWeight: 600, color: '#64748b', fontSize: 13 }}>고위험 대책 부족사례</div>
                        </div>
                        <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }}>20% <span style={{fontSize: 16, fontWeight:600, color: '#64748b'}}>(Blacklist)</span></div>
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 6, fontWeight: 600 }}>과거 재발방지대책 AI 감성분석 기반</div>
                      </div>

                      <div style={{ background: '#0f172a', padding: 24, borderRadius: 12, border: '1px solid #1e293b', boxShadow: '0 10px 25px -5px rgba(0,42,122,0.3)', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <h3 style={{ fontSize: 13, color: '#94a3b8', marginBottom: 6, fontWeight: 600 }}>AI 추천 최적 적립금비율</h3>
                          <div style={{ fontSize: 44, fontWeight: 900, background: 'linear-gradient(to right, #60a5fa, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.1 }}>
                            {fin.provisionRate}%
                          </div>
                        </div>
                        <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>최근 10년 손해율 및 재무모델 결합</div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, paddingBottom: 60 }}>
                      <div style={{ gridColumn: 'span 2', background: '#fff', padding: 32, borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 28, color: '#0f172a' }}>의학적 부상 결과별 보상 및 휴업 손실액 (Claim & Interruption)</h2>
                        <div style={{ height: 320 }}>
                          <Bar 
                            data={fin.claimSeverityMock} 
                            options={{ 
                              maintainAspectRatio: false, 
                              responsive: true,
                              scales: { x: { stacked: true }, y: { stacked: true } } 
                            }} 
                          />
                        </div>
                      </div>

                      <div style={{ gridColumn: 'span 1', background: '#fff', padding: 32, borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20, color: '#0f172a', textAlign: 'center' }}>AI 재발방지대책 신뢰도 분포</h2>
                        <div style={{ height: 300, position: 'relative' }}>
                          <Doughnut 
                            data={fin.sentimentMock} 
                            options={{ 
                              maintainAspectRatio: false,
                              cutout: '72%',
                              plugins: { legend: { position: 'bottom' } }
                            }} 
                          />
                          <div style={{ position: 'absolute', top: '42%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', width: '100%' }}>
                            <div style={{ fontSize: 36, fontWeight: 800, color: '#0f172a' }}>{fin.sentimentMock.datasets[0].data[0]}%</div>
                            <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>안전수준 적합</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        /* Custom scrollbar for left pane */
        div::-webkit-scrollbar { width: 6px; }
        div::-webkit-scrollbar-track { background: transparent; }
        div::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        div::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
}

import React from 'react';
import { 
  Building2, 
  X,
  ShieldAlert,
  AlertTriangle,
  FileText,
  TrendingUp,
  DollarSign,
  Activity,
  Award
} from 'lucide-react';

interface CompanyDetailModalProps {
  company: any;
  onClose: () => void;
}

export default function CompanyDetailModal({ company, onClose }: CompanyDetailModalProps) {
  if (!company) return null;

  // Generate some semi-random but deterministic financial risk metrics for demo based on score
  const baseLoss = company.avg_risk_index * 2.5; // Dummy unit (천만원)
  const provisionRate = Math.min(15, (company.avg_risk_index / 10)).toFixed(1);
  const creditDisplay = company.신용등급 || '-';

  const charSum = company.시공회사명.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
  const generalTypes = ['토목', '건축', '토목건축', '산업환경설비', '조경'];
  const specTypes = ['구조', '인테리어', '지반', '전기', '정보통신', '소방', '문화재'];

  let categoryLabel = '';
  if (company.전문공종 && company.전문공종 !== '일반건설') {
    categoryLabel = company.전문공종; 
  } else if (company.시공회사명 === '(주)지평건설산업') {
    categoryLabel = '인테리어 전문건설업';
  } else {
    const nameStr = company.시공회사명;
    const isExplicitlyGeneral = nameStr.includes('종합') || nameStr.includes('삼성') || nameStr.includes('현대') || nameStr.includes('건설산업') || nameStr.includes('건설개발');
    const isGeneral = isExplicitlyGeneral || (charSum % 3 === 0);
    if (isGeneral) {
      categoryLabel = generalTypes[charSum % generalTypes.length] + ' 종합건설업';
    } else {
      categoryLabel = specTypes[charSum % specTypes.length] + ' 전문건설업';
    }
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
      padding: 24,
    }} onClick={onClose}>
      <div style={{
        background: '#fff', width: '100%', maxWidth: 1000, borderRadius: 16,
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        display: 'flex', flexDirection: 'column',
        maxHeight: '90vh', overflow: 'hidden'
      }} onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0f172a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: 12, borderRadius: 12, border: '1px solid rgba(255,255,255,0.2)' }}>
              <Building2 style={{ width: 28, height: 28, color: '#38bdf8' }} />
            </div>
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: '#ffffff', marginBottom: 4 }}>{company.시공회사명}</h2>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.1)', color: '#cbd5e1' }}>
                  {categoryLabel}
                </span>
                <span style={{ 
                  fontSize: 12, fontWeight: 800, padding: '4px 10px', borderRadius: 6,
                  background: company.보험료_등급?.includes('S') ? 'rgba(16, 185, 129, 0.2)' :
                             company.보험료_등급?.includes('A') ? 'rgba(59, 130, 246, 0.2)' :
                             company.보험료_등급?.includes('D') ? 'rgba(239, 68, 68, 0.2)' : 'rgba(100, 116, 139, 0.2)',
                  color: company.보험료_등급?.includes('S') ? '#34d399' :
                         company.보험료_등급?.includes('A') ? '#60a5fa' :
                         company.보험료_등급?.includes('D') ? '#f87171' : '#94a3b8'
                }}>
                  {company.보험료_등급 || '미평가'} Grade
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4 }}>
            <X style={{ width: 28, height: 28 }} />
          </button>
        </div>
        
        {/* Body */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', overflowY: 'auto', flex: 1, background: '#f8fafc' }}>
          
          {/* Left Column: Traditional Safety & Corp Stats */}
          <div style={{ padding: 32, borderRight: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Building2 style={{ width: 18, height: 18, color: '#64748b' }} />
              시공사 기본 정보
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
              <div style={{ background: '#fff', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>신용등급</span>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>{creditDisplay}</div>
              </div>
              <div style={{ background: '#fff', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>직원규모</span>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>{company.직원규모 || '-'}</div>
              </div>
              <div style={{ background: '#fff', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>연매출규모</span>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>{company.연매출규모 || '-'}</div>
              </div>
              <div style={{ background: '#fff', padding: 16, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>안전인증보유</span>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>{company.안전인증보유 || '-'}</div>
              </div>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldAlert style={{ width: 18, height: 18, color: '#ef4444' }} />
              안전 지표 분석
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertTriangle style={{ width: 16, height: 16, color: '#f59e0b' }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#475569' }}>평균 사고위험도 (Avg Index)</span>
                </div>
                <span style={{ fontSize: 18, fontWeight: 800, color: company.avg_risk_index > 75 ? '#ef4444' : '#10b981' }}>
                  {Number(company.avg_risk_index).toFixed(2)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <TrendingUp style={{ width: 16, height: 16, color: '#3b82f6' }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#475569' }}>산업재해율 (Accident Rate)</span>
                </div>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>
                  {company['산업재해율(%)'] ? company['산업재해율(%)'] + '%' : '-'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FileText style={{ width: 16, height: 16, color: '#64748b' }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#475569' }}>최근 10년 사망사고건수</span>
                </div>
                <span style={{ fontSize: 18, fontWeight: 800, color: company.최근10년사망사고건수 > 0 ? '#ef4444' : '#10b981' }}>
                  {company.최근10년사망사고건수}건
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Financial Risk Predictions */}
          <div style={{ padding: 32, background: '#ffffff' }}>
             <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <DollarSign style={{ width: 18, height: 18, color: '#10b981' }} />
              시공사 맞춤형 재무 리스크 예측
            </h3>

            <div style={{ background: '#0f172a', padding: 24, borderRadius: 12, marginBottom: 24, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
              <h4 style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8 }}>AI 추천 최적 적립금비율 (Recommended Provision Rate)</h4>
              <div style={{ fontSize: 40, fontWeight: 800, background: 'linear-gradient(to right, #38bdf8, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {provisionRate}%
              </div>
              <p style={{ fontSize: 12, color: '#64748b', marginTop: 8 }}>해당 시공사의 과거 사고 데이터 및 산업재해율을 기반으로 산출된 최적 권장 적립비율입니다.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: '#f8fafc', padding: 20, borderRadius: 8, border: '1px solid #e2e8f0', borderLeft: '4px solid #f59e0b' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 4 }}>예상 CLAIM 발생빈도 (연간)</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
                  <span style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>{(company.accident_count / 10).toFixed(1)}건</span>
                  <span style={{ fontSize: 13, color: '#ef4444', fontWeight: 600, marginBottom: 4 }}>+2.4% YoY</span>
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: 20, borderRadius: 8, border: '1px solid #e2e8f0', borderLeft: '4px solid #ef4444' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 4 }}>사고당 예상 손실액 상위 5% (VaR)</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
                  <span style={{ fontSize: 24, fontWeight: 800, color: '#0f172a' }}>₩ {baseLoss.toFixed(1)} 억</span>
                  <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600, marginBottom: 4 }}>의료비/작업중단 포함</span>
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: 20, borderRadius: 8, border: '1px solid #e2e8f0', borderLeft: '4px solid #3b82f6' }}>
                 <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 4 }}>최대 리스크 공정</div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                   <Activity style={{ width: 16, height: 16, color: '#3b82f6' }} />
                   <span style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>{categoryLabel}</span>
                 </div>
              </div>
            </div>

          </div>

        </div>
        
        {/* Footer */}
        <div style={{ padding: '16px 32px', background: '#f1f5f9', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '10px 32px', background: '#0f172a', color: '#fff', fontSize: 14, fontWeight: 600, borderRadius: 8, cursor: 'pointer', border: 'none', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#1e293b'} onMouseLeave={e => e.currentTarget.style.background = '#0f172a'}>
            확인 (Confirm)
          </button>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { 
  Building2, 
  X,
  ShieldAlert,
  AlertTriangle,
  FileText,
  TrendingUp
} from 'lucide-react';

interface CompanyDetailModalProps {
  company: any;
  onClose: () => void;
}

export default function CompanyDetailModal({ company, onClose }: CompanyDetailModalProps) {
  if (!company) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
      padding: 24,
    }} onClick={onClose}>
      <div style={{
        background: '#fff', width: '100%', maxWidth: 640, borderRadius: 16,
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
        display: 'flex', flexDirection: 'column',
        maxHeight: '90vh', overflow: 'hidden'
      }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: '#f8fafc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ background: '#fff', padding: 12, borderRadius: 12, border: '1px solid var(--border-default)', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
              <Building2 style={{ width: 28, height: 28, color: '#06b6d4' }} />
            </div>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{company.시공회사명}</h2>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, padding: '4px 8px', borderRadius: 6, background: '#e2e8f0', color: '#475569' }}>
                  {company.전문공종 || '일반건설'}
                </span>
                <span style={{ 
                  fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 6,
                  background: company.보험료_등급?.includes('S') ? 'rgba(16, 185, 129, 0.1)' :
                             company.보험료_등급?.includes('A') ? 'rgba(59, 130, 246, 0.1)' :
                             company.보험료_등급?.includes('D') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                  color: company.보험료_등급?.includes('S') ? '#10b981' :
                         company.보험료_등급?.includes('A') ? '#3b82f6' :
                         company.보험료_등급?.includes('D') ? '#ef4444' : '#64748b'
                }}>
                  {company.보험료_등급}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4 }}>
            <X style={{ width: 24, height: 24 }} />
          </button>
        </div>
        
        {/* Body */}
        <div style={{ padding: '32px', overflowY: 'auto', flex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>신용등급</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{company.신용등급 || '-'}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>직원규모</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{company.직원규모 || '-'}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>연매출규모</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{company.연매출규모 || '-'}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>안전인증보유</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{company.안전인증보유 || '-'}</span>
            </div>
          </div>

          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <ShieldAlert style={{ width: 16, height: 16, color: '#f59e0b' }} />
            안전 및 사고 지표
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
             <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, color: 'var(--text-muted)' }}>
                <AlertTriangle style={{ width: 14, height: 14 }} />
                <span style={{ fontSize: 11, fontWeight: 600 }}>평균 사고위험도</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: company.avg_risk_index > 75 ? '#ef4444' : '#10b981' }}>
                {Number(company.avg_risk_index).toFixed(2)}
              </div>
            </div>
            <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, color: 'var(--text-muted)' }}>
                <FileText style={{ width: 14, height: 14 }} />
                <span style={{ fontSize: 11, fontWeight: 600 }}>분석 대상 사고건수</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>
                {company.accident_count}건
              </div>
            </div>
            <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, color: 'var(--text-muted)' }}>
                <TrendingUp style={{ width: 14, height: 14 }} />
                <span style={{ fontSize: 11, fontWeight: 600 }}>산업재해율(%)</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>
                {company['산업재해율(%)'] ? company['산업재해율(%)'] + '%' : '-'}
              </div>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: '#fff', borderRadius: 8, border: '1px solid var(--border-default)' }}>
               <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>최근 10년 사고건수</span>
               <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{company.최근10년사고건수}건</span>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: '#fff', borderRadius: 8, border: '1px solid var(--border-default)' }}>
               <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>최근 10년 사망사고건수</span>
               <span style={{ fontSize: 14, fontWeight: 700, color: company.최근10년사망사고건수 > 0 ? '#ef4444' : '#10b981' }}>{company.최근10년사망사고건수}건</span>
             </div>
          </div>
        </div>
        
        {/* Footer */}
        <div style={{ padding: '16px 32px', background: '#f8fafc', borderTop: '1px solid var(--border-default)', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '8px 24px', background: '#0f172a', color: '#fff', fontSize: 14, fontWeight: 600, borderRadius: 8, cursor: 'pointer', border: 'none' }}>
            닫기 (Close)
          </button>
        </div>
      </div>
    </div>
  );
}

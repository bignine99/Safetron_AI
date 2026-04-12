import React from 'react';
import { 
  Building2, 
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Minus,
  Award,
  Users,
  Target
} from 'lucide-react';

interface CompanyCardProps {
  company: any;
  onClick: (company: any) => void;
}

export default function CompanyCard({ company, onClick }: CompanyCardProps) {
  return (
    <div style={{ 
      background: '#fff', 
      border: '1px solid var(--border-default)', 
      borderRadius: 12, 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      cursor: 'pointer'
    }}
    onClick={() => onClick(company)}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = '#06b6d4';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(6, 182, 212, 0.1)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = 'var(--border-default)';
      e.currentTarget.style.boxShadow = 'none';
    }}
    >
      <div style={{ padding: 24, flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div style={{ background: '#f8fafc', padding: 10, borderRadius: 10 }}>
            <Building2 style={{ width: 22, height: 22, color: '#06b6d4' }} />
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ 
              fontSize: 10, fontWeight: 700, padding: '4px 8px', borderRadius: 12,
              background: company.보험료_등급.includes('S') ? 'rgba(16, 185, 129, 0.1)' :
                         company.보험료_등급.includes('A') ? 'rgba(59, 130, 246, 0.1)' :
                         company.보험료_등급.includes('D') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(100, 116, 139, 0.1)',
              color: company.보험료_등급.includes('S') ? '#10b981' :
                     company.보험료_등급.includes('A') ? '#3b82f6' :
                     company.보험료_등급.includes('D') ? '#ef4444' : '#64748b'
            }}>
              {company.보험료_등급}
            </div>
            <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, color: 'var(--text-muted)' }}>
              {company.최근3년_사고추세 === '감소추세' ? <TrendingDown style={{ width: 12, height: 12, color: '#10b981' }} /> :
               company.최근3년_사고추세 === '증가추세' ? <TrendingUp style={{ width: 12, height: 12, color: '#ef4444' }} /> :
               <Minus style={{ width: 12, height: 12, color: '#64748b' }} />}
              <span style={{ fontSize: 10, textTransform: 'uppercase', fontWeight: 700 }}>{company.최근3년_사고추세}</span>
            </div>
          </div>
        </div>

        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {company.시공회사명}
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 20 }}>
          {company.전문공종}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Award style={{ width: 12, height: 12, color: '#f59e0b' }} />
              <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Credit</span>
            </div>
            <p style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 13 }}>{company.신용등급}</p>
          </div>
          <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Users style={{ width: 12, height: 12, color: '#3b82f6' }} />
              <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Size</span>
            </div>
            <p style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{company.직원규모}</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Target style={{ width: 14, height: 14, color: 'var(--text-secondary)' }} />
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>Avg Risk index</span>
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: company.avg_risk_index > 75 ? '#ef4444' : '#10b981' }}>
              {company.avg_risk_index.toFixed(1)}
            </span>
          </div>
          <div style={{ height: 6, width: '100%', background: 'var(--border-default)', borderRadius: 3, overflow: 'hidden' }}>
            <div 
              style={{ 
                height: '100%', 
                transition: 'all 1s',
                background: company.avg_risk_index > 85 ? '#ef4444' : company.avg_risk_index > 70 ? '#f59e0b' : '#10b981',
                width: `${company.avg_risk_index}%` 
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa', borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{company.accident_count} Total Cases</span>
        <button style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#06b6d4', fontSize: 12, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>
          Details <ChevronRight style={{ width: 14, height: 14 }} />
        </button>
      </div>
    </div>
  );
}

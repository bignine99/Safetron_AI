import React from 'react';
import { Building2 } from 'lucide-react';

interface CompanyCardProps {
  company: any;
  onClick: (company: any) => void;
}

export default function CompanyCard({ company, onClick }: CompanyCardProps) {
  // 1. Determine Grade color
  let gradeBg = 'rgba(100, 116, 139, 0.1)';
  let gradeColor = '#64748b';
  
  if (company.보험료_등급) {
    if (company.보험료_등급.includes('S')) { gradeBg = 'rgba(16, 185, 129, 0.1)'; gradeColor = '#10b981'; }
    else if (company.보험료_등급.includes('A')) { gradeBg = 'rgba(59, 130, 246, 0.1)'; gradeColor = '#3b82f6'; }
    else if (company.보험료_등급.includes('D') || company.보험료_등급.includes('C')) { gradeBg = 'rgba(239, 68, 68, 0.1)'; gradeColor = '#ef4444'; }
  }

  const categoryLabel = company.categoryLabel || '일반건설';

  return (
    <div style={{ 
      background: 'var(--bg-elevated)', 
      border: '1px solid var(--border-default)', 
      borderRadius: 4, 
      display: 'flex', 
      flexDirection: 'column',
      padding: '12px 14px',
      gap: 8,
      cursor: 'pointer',
    }}
    onClick={() => onClick(company)}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = '#002A7A';
      e.currentTarget.style.background = '#f8fafc';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = 'var(--border-default)';
      e.currentTarget.style.background = 'var(--bg-elevated)';
    }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginRight: 8 }}>
          {company.시공회사명}
        </h3>
        <div style={{ 
          flexShrink: 0,
          fontSize: 11, fontWeight: 700, padding: '2px 6px', borderRadius: 2,
          background: gradeBg, color: gradeColor, border: `1px solid ${gradeColor}30`
        }}>
          {company.보험료_등급 || '미평가'}
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>
          {categoryLabel}
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          Risk Idx: {Number(company.avg_risk_index).toFixed(2)}
        </span>
      </div>
    </div>
  );
}

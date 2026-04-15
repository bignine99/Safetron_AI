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
      background: '#fff', 
      border: '1px solid #e2e8f0', 
      borderRadius: 8, 
      display: 'flex', 
      alignItems: 'center',
      padding: '16px 20px',
      gap: 16,
      transition: 'all 0.2s',
      cursor: 'pointer',
      boxShadow: '0 1px 2px rgba(0,0,0,0.01)'
    }}
    onClick={() => onClick(company)}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = '#002A7A';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 42, 122, 0.08)';
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = '#e2e8f0';
      e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.01)';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
    >
      <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #f1f5f9' }}>
        <Building2 style={{ width: 22, height: 22, color: '#002A7A' }} />
      </div>
      
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginRight: 12, marginTop: 2 }}>
            {company.시공회사명}
          </h3>
          <div style={{ 
            flexShrink: 0,
            fontSize: 12, fontWeight: 800, padding: '4px 10px', borderRadius: 6,
            background: gradeBg, color: gradeColor
          }}>
            {company.보험료_등급 || '미평가'}
          </div>
        </div>
        
        <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>
          {categoryLabel}
        </span>
      </div>
    </div>
  );
}

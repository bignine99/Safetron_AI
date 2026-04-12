'use client';

import React from 'react';
import companies from '@/data/companies.json';
import { Search } from 'lucide-react';
import CompanyCard from '@/components/CompanyCard';
import CompanyDetailModal from '@/components/CompanyDetailModal';

export default function CompaniesPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCompany, setSelectedCompany] = React.useState<any>(null);
  
  const filteredCompanies = companies.filter(c => 
    c.시공회사명.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 50); // Show only top 50 for performance

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
            시공사 통계 분석
          </h1>
          <p style={{ fontSize: 11, color: '#93c5fd', letterSpacing: '0.08em', marginTop: 3, fontFamily: "'Inter', monospace" }}>
            COMPANY RISK PROFILES
          </p>
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ position: 'relative', width: 280 }}>
            <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search companies..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
        </div>
      </div>

      {/* ══════════ Body ══════════ */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }} className="custom-scrollbar">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {filteredCompanies.map((company: any) => (
            <CompanyCard 
              key={company.시공회사명} 
              company={company} 
              onClick={(c) => setSelectedCompany(c)} 
            />
          ))}
        </div>
      </div>

      {/* ══════════ Detail Modal ══════════ */}
      <CompanyDetailModal 
        company={selectedCompany} 
        onClose={() => setSelectedCompany(null)} 
      />
    </div>
  );
}

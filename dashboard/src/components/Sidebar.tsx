'use client';

import React from 'react';
import {
  LayoutDashboard, Map, Building2, Zap, MessageSquare,
  ChevronLeft, Menu, BarChart3, TrendingUp,
  BadgeDollarSign, CloudRain, Network, DatabaseZap, PieChart, Cpu, ShieldCheck, Brain
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavItem = 
  | { type: 'header'; title: string }
  | { type: 'link'; icon: React.ElementType; title: string; subtitle: string; href: string };

const navItems: NavItem[] = [
  { type: 'header', title: '데이터 분석 대시보드' },
  { type: 'link', icon: LayoutDashboard, title: '종합 요약', subtitle: 'Overview', href: '/' },
  { type: 'link', icon: BarChart3, title: '사고 통계 현황', subtitle: 'Accident Stats', href: '/analytics/descriptive' },
  { type: 'link', icon: Network, title: '다변량 상관분석', subtitle: 'Correlation Models', href: '/analytics/correlation' },
  { type: 'link', icon: DatabaseZap, title: '심층 회귀분석', subtitle: 'Regression Models', href: '/analytics/regression' },
  { type: 'link', icon: Map, title: '위험 지도', subtitle: 'Risk Map', href: '/risk-map' },
  { type: 'link', icon: TrendingUp, title: '사고 추이 분석', subtitle: 'Accident Trends', href: '/trends' },
  
  { type: 'header', title: '심사 자동화 파이프라인' },
  { type: 'link', icon: Zap, title: '사고 지식 그래프', subtitle: 'Knowledge Graph', href: '/accidents' },
  { type: 'link', icon: MessageSquare, title: 'AI 리스크 전문가', subtitle: 'AI Analyst', href: '/ai-analyst' },
  { type: 'link', icon: Building2, title: '시공사 리스크 분석', subtitle: 'Company Risk Profiles', href: '/companies' },
  { type: 'link', icon: Cpu, title: '위험도 예측 Agent', subtitle: 'Predictive Agent', href: '/agent' },
  { type: 'link', icon: CloudRain, title: '고위험 특약 맵', subtitle: 'Coverage Heatmap', href: '/coverage-heatmap' },
  { type: 'link', icon: BadgeDollarSign, title: '보험 요율 심사', subtitle: 'Underwriting', href: '/underwriter-scorecard' },
  { type: 'link', icon: ShieldCheck, title: '리스크 종합평가 Agent', subtitle: 'Comprehensive Agent', href: '/comprehensive-agent' },
  { type: 'link', icon: Brain, title: 'Safetron AI 특장점', subtitle: 'Key Features', href: '/risk-intelligence' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <aside style={{
      width: collapsed ? 68 : 240,
      minWidth: collapsed ? 68 : 240,
      height: '100vh',
      position: 'sticky',
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      background: '#ffffff',
      borderRight: '1px solid var(--border-default)',
      transition: 'width 0.2s ease, min-width 0.2s ease',
      zIndex: 50,
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <Link href="/" style={{
        padding: collapsed ? '20px 0' : '20px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        justifyContent: collapsed ? 'center' : 'flex-start',
        borderBottom: '1px solid var(--border-default)',
        height: 80,
        boxSizing: 'border-box',
        textDecoration: 'none'
      }}>
        <img 
          src="/safetron/logo.jfif" 
          alt="Logo" 
          style={{ 
            height: collapsed ? 32 : 36, 
            width: 'auto', 
            objectFit: 'contain' 
          }} 
        />
        {!collapsed && (
          <>
            <span style={{
              fontSize: 20, fontWeight: 800,
              letterSpacing: '-0.02em',
              fontFamily: "'Inter', sans-serif",
              background: 'linear-gradient(90deg, #10b981, #3b82f6, #06b6d4, #10b981, #3b82f6, #06b6d4)',
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradientShift 3s linear infinite',
            }}>
              Safetron AI
            </span>
            <style>{`
              @keyframes gradientShift {
                0% { background-position: 0% 50%; }
                100% { background-position: -200% 50%; }
              }
            `}</style>
          </>
        )}
      </Link>

      {/* Nav */}
      <nav className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: collapsed ? '2px 4px' : '2px 8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {navItems.map((item, idx) => {
            if (item.type === 'header') {
              if (collapsed) return <div key={idx} style={{ height: 16 }} />;
              return (
                <div key={idx} style={{ 
                  padding: '12px 12px 4px 12px', 
                  fontSize: 12, 
                  fontWeight: 900, 
                  color: '#0f172a', 
                  letterSpacing: '0.02em' 
                }}>
                  {item.title}
                </div>
              );
            }

            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: collapsed ? '6px 0' : '6px 10px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  borderRadius: 8, textDecoration: 'none', transition: 'all 0.12s ease',
                  background: isActive ? 'var(--accent-muted)' : 'transparent',
                  borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                  color: isActive ? 'var(--accent)' : 'var(--text-tertiary)',
                }}
                onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}}
                onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)'; }}}
              >
                <Icon style={{ width: 16, height: 16, flexShrink: 0 }} />
                {!collapsed && (
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, justifyContent: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 500, lineHeight: 1.1, color: isActive ? 'var(--text-primary)' : 'inherit' }}>{item.title}</span>
                    <span style={{ fontSize: 9.5, color: 'var(--text-muted)', letterSpacing: '0.02em', marginTop: 1 }}>{item.subtitle}</span>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Collapse */}
      <div style={{ padding: collapsed ? '10px 6px' : '10px 8px', borderTop: '1px solid var(--border-default)' }}>
        <button onClick={() => setCollapsed(!collapsed)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 8,
            padding: collapsed ? '8px 0' : '8px 10px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            borderRadius: 8, border: '1px solid var(--border-default)', background: 'var(--bg-elevated)',
            color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.12s ease',
            fontSize: 12.5, fontFamily: 'inherit',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
        >
          {collapsed ? <Menu style={{ width: 15, height: 15 }} /> : <ChevronLeft style={{ width: 15, height: 15 }} />}
          {!collapsed && <span style={{ fontWeight: 500 }}>접기</span>}
        </button>
      </div>
    </aside>
  );
}

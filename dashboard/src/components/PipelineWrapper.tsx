'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronRight, PlayCircle, CheckCircle2, Circle } from 'lucide-react';

const PIPELINE_STEPS = [
  { id: 'ai-analyst', path: '/ai-analyst', label: 'AI 리스크 전문가' },
  { id: 'companies', path: '/companies', label: '시공사 리스크 분석' },
  { id: 'agent', path: '/agent', label: '위험도 예측 Agent' },
  { id: 'coverage-heatmap', path: '/coverage-heatmap', label: '고위험 특약 맵' },
  { id: 'underwriter-scorecard', path: '/underwriter-scorecard', label: '보험 요율 심사' },
  { id: 'comprehensive-agent', path: '/comprehensive-agent', label: '리스크 종합평가' },
];

export default function PipelineWrapper() {
  const pathname = usePathname();
  const router = useRouter();

  const currentIndex = PIPELINE_STEPS.findIndex(s => s.path === pathname);
  const isPipelinePage = currentIndex >= 0;

  if (!isPipelinePage) return null;

  return (
    <div style={{
      width: '100%',
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-default)',
      padding: '16px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      zIndex: 40,
      position: 'relative'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 28, height: 28, borderRadius: 6, background: 'var(--accent-muted)', color: 'var(--accent)'
          }}>
            <PlayCircle style={{ width: 16, height: 16 }} />
          </div>
          <div>
            <h2 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '0.02em' }}>
              심사 자동화 파이프라인 (Automated Underwriting Pipeline)
            </h2>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0, marginTop: 2 }}>
              시나리오에 따라 모듈 간 데이터가 이관되며 최종 종합 평가가 수행됩니다.
            </p>
          </div>
        </div>

        {currentIndex < PIPELINE_STEPS.length - 1 && (
          <button 
            onClick={() => router.push(PIPELINE_STEPS[currentIndex + 1].path)}
            style={{
              padding: '6px 14px', borderRadius: 6, background: '#111827', color: '#fff',
              fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.15s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            다음 모듈로 평가 이관
            <ChevronRight style={{ width: 14, height: 14 }} />
          </button>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 8 }}>
        {PIPELINE_STEPS.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isActive = idx === currentIndex;
          const isPending = idx > currentIndex;

          return (
            <React.Fragment key={step.id}>
              <div 
                style={{ 
                  display: 'flex', alignItems: 'center', gap: 6,
                  opacity: isActive || isCompleted ? 1 : 0.4,
                  cursor: 'pointer', transition: 'all 0.2s',
                  background: isActive ? 'var(--accent-muted)' : 'transparent',
                  padding: '4px 10px', borderRadius: 20,
                  border: isActive ? '1px solid var(--accent)' : '1px solid transparent'
                }}
                onClick={() => router.push(step.path)}
              >
                {isCompleted ? (
                  <CheckCircle2 style={{ width: 14, height: 14, color: '#10b981' }} />
                ) : isActive ? (
                  <Circle style={{ width: 14, height: 14, color: 'var(--accent)', fill: 'var(--accent)' }} />
                ) : (
                  <Circle style={{ width: 14, height: 14, color: 'var(--text-muted)' }} />
                )}
                <span style={{ 
                  fontSize: 12, fontWeight: isActive ? 700 : 500, 
                  color: isActive ? 'var(--accent)' : (isCompleted ? 'var(--text-primary)' : 'var(--text-muted)'),
                  whiteSpace: 'nowrap'
                }}>
                  {step.label}
                </span>
              </div>
              
              {idx < PIPELINE_STEPS.length - 1 && (
                <div style={{ 
                  flex: 1, height: 1, 
                  background: isCompleted ? '#10b981' : 'var(--border-default)',
                  transition: 'background 0.3s ease'
                }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

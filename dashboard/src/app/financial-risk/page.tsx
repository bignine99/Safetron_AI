'use client';

import React from 'react';
import { PieChart, DollarSign, Activity, FileWarning, TrendingUp } from 'lucide-react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend
);

const CLAIM_SEVERITY_MOCK = {
  labels: ['골절', '열상/창상', '절단', '타박상', '화상', '기타'],
  datasets: [
    {
      label: '평균 의료비 손실 (단위: 천만원)',
      data: [8.5, 2.1, 15.4, 0.5, 4.2, 1.2],
      backgroundColor: '#f59e0b',
    },
    {
      label: '평균 작업중지 손실 (단위: 천만원)',
      data: [12.0, 3.5, 25.0, 0.2, 5.5, 2.0],
      backgroundColor: '#3b82f6',
    }
  ],
};

const SENTIMENT_MOCK = {
  labels: ['적극적 시정조치 (우수)', '보통수준 조치 (양호)', '소극적/형식적 조치 (위험)'],
  datasets: [
    {
      data: [35, 45, 20],
      backgroundColor: ['#10b981', '#3b82f6', '#ef4444'],
      borderWidth: 0,
      hoverOffset: 4
    }
  ]
};

export default function FinancialRiskForecaster() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: "'Pretendard', sans-serif", background: '#f8fafc', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 80, padding: '0 40px', background: '#002A7A', flexShrink: 0,
      }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#ffffff' }}>재무 리스크 예측 (Financial Risk Forecaster)</h1>
          <p style={{ fontSize: 11, color: '#93c5fd', marginTop: 3 }}>CLAIM SEVERITY & BUSINESS INTERRUPTION LOSS PREDICTION</p>
        </div>
      </div>

      <div style={{ padding: 40, maxWidth: 1400, margin: '0 auto', width: '100%' }}>
        
        {/* Top Summaries */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 32 }}>
          <div style={{ background: '#fff', padding: 24, borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
              <div style={{ background: '#dbeafe', padding: 8, borderRadius: 8 }}><DollarSign size={20} color="#3b82f6" /></div>
              <div style={{ fontWeight: 600, color: '#64748b', fontSize: 13 }}>사고당 평균 손실액</div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>₩ 1.8 억</div>
            <div style={{ fontSize: 12, color: '#ef4444', marginTop: 4, display: 'flex', alignItems: 'center' }}>
              <TrendingUp size={12} style={{ marginRight: 4 }}/> + 5% YoY
            </div>
          </div>
          
          <div style={{ background: '#fff', padding: 24, borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
              <div style={{ background: '#fee2e2', padding: 8, borderRadius: 8 }}><Activity size={20} color="#ef4444" /></div>
              <div style={{ fontWeight: 600, color: '#64748b', fontSize: 13 }}>가장 치명적인 부상</div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>절단 (Amputation)</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>의료비+휴업보상 최고점</div>
          </div>

          <div style={{ background: '#fff', padding: 24, borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
              <div style={{ background: '#fef3c7', padding: 8, borderRadius: 8 }}><FileWarning size={20} color="#f59e0b" /></div>
              <div style={{ fontWeight: 600, color: '#64748b', fontSize: 13 }}>고위험 대책 부족사례</div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>20% (Blacklist)</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>재발방지대책 AI 감성분석 기반</div>
          </div>

          <div style={{ background: '#0f172a', padding: 24, borderRadius: 16, border: '1px solid #1e293b', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', color: 'white' }}>
            <h3 style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8 }}>AI 추천 최적 적립금비율</h3>
            <div style={{ fontSize: 36, fontWeight: 800, background: 'linear-gradient(to right, #60a5fa, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              8.5%
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>현재 손해율 및 예측모델 기반</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          {/* Bar Chart representing Claim Costs by Severity */}
          <div style={{ background: '#fff', padding: 32, borderRadius: 16, border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24 }}>의학적 부상 결과별 보상 및 휴업 손실액 (Claim & Interruption)</h2>
            <div style={{ height: 350 }}>
              <Bar 
                data={CLAIM_SEVERITY_MOCK} 
                options={{ 
                  maintainAspectRatio: false, 
                  responsive: true,
                  scales: { 
                    x: { stacked: true },
                    y: { stacked: true }
                  } 
                }} 
              />
            </div>
          </div>

          {/* Doughnut Chart for AI Sentiment on Prevention Plans */}
          <div style={{ background: '#fff', padding: 32, borderRadius: 16, border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24 }}>AI 재발방지대책 신뢰도 분석</h2>
            <div style={{ height: 300, position: 'relative' }}>
              <Doughnut 
                data={SENTIMENT_MOCK} 
                options={{ 
                  maintainAspectRatio: false,
                  cutout: '75%',
                  plugins: {
                    legend: { position: 'bottom' }
                  }
                }} 
              />
              <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: '#0f172a' }}>80%</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>안전수준 적합</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

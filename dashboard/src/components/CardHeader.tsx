import React from 'react';

interface CardHeaderProps {
  title: string;
  subtitle: string;
}

export default function CardHeader({ title, subtitle }: CardHeaderProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 16 }}>
      <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', fontFamily: "'Pretendard', 'Inter', sans-serif" }}>
        {title}
      </h3>
      <span style={{ fontSize: 9.5, color: 'var(--text-muted)', letterSpacing: '0.04em', marginTop: 2, fontFamily: "'Inter', sans-serif" }}>
        {subtitle}
      </span>
    </div>
  );
}

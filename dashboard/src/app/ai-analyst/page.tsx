'use client';

import React from 'react';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/safetron';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Database, 
  Loader2
} from 'lucide-react';

/* ── Strip markdown symbols from AI response ── */
function stripMarkdown(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, '')        // Remove # headings
    .replace(/\*\*([^*]+)\*\*/g, '$1')   // Remove **bold**
    .replace(/\*([^*]+)\*/g, '$1')       // Remove *italic*
    .replace(/^[-*]\s+/gm, '• ')        // Replace - or * bullets with •
    .replace(/^---+$/gm, '')            // Remove horizontal rules
    .replace(/`([^`]+)`/g, '$1')        // Remove inline code
    .replace(/\n{3,}/g, '\n\n')         // Collapse excessive newlines
    .trim();
}

export default function AIAnalystPage() {
  const [messages, setMessages] = React.useState<any[]>([]);
  const [input, setInput] = React.useState('');
  
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q');
      if (q) setInput(q);
    }
  }, []);
  const [loading, setLoading] = React.useState(false);
  const [loadingText, setLoadingText] = React.useState('Knowledge Graph 검색 중');
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  /* Loading text animation */
  React.useEffect(() => {
    if (!loading) return;
    const texts = [
      'Knowledge Graph 검색 중',
      '관련 데이터 수집 중',
      '사고 패턴 분석 중',
      '위험 요인 추출 중',
      'AI 인사이트 생성 중',
    ];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % texts.length;
      setLoadingText(texts[idx]);
    }, 1800);
    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${basePath}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] })
      });
      
      if (!res.ok) {
        const text = await res.text();
        let errorMsg = `HTTP error! status: ${res.status}`;
        try {
          const errData = JSON.parse(text);
          errorMsg = errData.error || errorMsg;
        } catch (e) {
          console.error("Non-JSON error response from server:", text.substring(0, 300));
          if (text.trim().startsWith('<')) {
            errorMsg = "서버 에러(HTML). Nginx 설정이나 서버 실행 상태를 확인하세요.";
          }
        }
        throw new Error(errorMsg);
      }
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      
      setMessages(prev => [...prev, { role: 'assistant', content: '', debug: null }]);
      setLoading(false);

      let fullText = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        fullText += decoder.decode(value, { stream: true });
        setMessages(prev => {
          const newMsg = [...prev];
          newMsg[newMsg.length - 1].content = stripMarkdown(fullText);
          return newMsg;
        });
      }
    } catch (err: any) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `오류가 발생했습니다: ${err.message}` 
      }]);
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      fontFamily: "'Pretendard', 'Inter', sans-serif",
      color: 'var(--text-secondary)', background: 'var(--bg-root)',
    }}>
      {/* CSS Animations */}
      <style>{`
        @keyframes dotPulse {
          0%, 80%, 100% { transform: scale(0.4); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* ══════════ Header ══════════ */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 80, boxSizing: 'border-box', padding: '0 40px', borderBottom: 'none',
        background: '#002A7A', flexShrink: 0,
      }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', fontFamily: "'Inter', 'Pretendard', sans-serif" }}>
            AI 리스크 분석가
          </h1>
          <p style={{ fontSize: 11, color: '#93c5fd', letterSpacing: '0.08em', marginTop: 3, fontFamily: "'Inter', monospace" }}>
            AI RISK ANALYST
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ background: 'rgba(6, 182, 212, 0.1)', padding: '6px 12px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, color: '#06b6d4' }}>
                <Database style={{ width: 12, height: 12 }} />
                SQLite Graph
            </div>
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '6px 12px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, color: '#f59e0b' }}>
                <Sparkles style={{ width: 12, height: 12 }} />
                Gemini 2.5
            </div>
        </div>
      </div>

      {/* ══════════ Body ══════════ */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', background: '#fff' }}>
        {/* Abstract Background Decoration */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', opacity: 0.05 }}>
            <div style={{ position: 'absolute', top: -100, left: -100, width: 400, height: 400, background: '#06b6d4', borderRadius: '50%', filter: 'blur(100px)' }}></div>
            <div style={{ position: 'absolute', bottom: -100, right: -100, width: 400, height: 400, background: '#a855f7', borderRadius: '50%', filter: 'blur(100px)' }}></div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 24, position: 'relative' }} className="custom-scrollbar" ref={scrollRef}>
          {messages.length === 0 && (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 24 }}>
              <div style={{ padding: 24, background: '#fff', borderRadius: '50%', border: '1px solid var(--border-default)', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
                <Bot style={{ width: 48, height: 48, color: '#06b6d4' }} />
              </div>
              <div>
                <h3 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>어떤 리스크를 분석해드릴까요?</h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: 400, margin: '0 auto', fontSize: 14 }}>건설사별 위험 지수, 특정 공종의 사고 원인, 혹은 재발 방지 대책에 대해 질문해 보세요.</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, width: '100%', maxWidth: 640 }}>
                {[
                    "떨어짐(추락) 사고의 주요 원인이 뭐야?",
                    "고위험 건설사들의 공통점이 있을까?",
                    "거푸집 작업 시 가장 빈번한 사고 유형은?",
                    "최근 3년간 안전 사고 추세를 분석해줘"
                ].map(q => (
                    <button 
                        key={q} 
                        onClick={() => setInput(q)}
                        style={{
                          background: '#fff',
                          border: '1px solid var(--border-default)',
                          padding: 16,
                          borderRadius: 8,
                          textAlign: 'left',
                          fontSize: 13,
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = '#06b6d4';
                          e.currentTarget.style.background = '#f8fafc';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = 'var(--border-default)';
                          e.currentTarget.style.background = '#fff';
                        }}
                    >
                        {q}
                    </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', animation: 'fadeUp 0.3s ease' }}>
              {m.role === 'assistant' && (
                <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bot style={{ width: 24, height: 24, color: '#06b6d4' }} />
                </div>
              )}
              <div style={{
                maxWidth: '80%',
                borderRadius: 12,
                padding: '16px 20px',
                background: m.role === 'user' ? '#0f172a' : '#fff',
                border: m.role === 'user' ? 'none' : '1px solid var(--border-default)',
                color: m.role === 'user' ? '#fff' : 'var(--text-primary)',
                boxShadow: m.role === 'user' ? '0 10px 25px rgba(15, 23, 42, 0.15)' : 'none'
              }}>
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, fontSize: 14 }}>{m.content}</div>
              </div>
              {m.role === 'user' && (
                <div style={{ width: 40, height: 40, borderRadius: 8, background: '#f8fafc', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <User style={{ width: 24, height: 24, color: 'var(--text-muted)' }} />
                </div>
              )}
            </div>
          ))}

          {/* ══════════ Loading Animation ══════════ */}
          {loading && (
            <div style={{ display: 'flex', gap: 16, animation: 'fadeUp 0.3s ease' }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Loader2 style={{ width: 24, height: 24, color: '#06b6d4', animation: 'spin 1s linear infinite' }} />
              </div>
              <div style={{ 
                background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, 
                padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 12, minWidth: 260
              }}>
                {/* Animated dots */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {[0, 1, 2, 3, 4].map(i => (
                    <div key={i} style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: '#06b6d4',
                      animation: `dotPulse 1.4s ease-in-out infinite`,
                      animationDelay: `${i * 0.16}s`
                    }}></div>
                  ))}
                </div>
                {/* Shimmer progress bar */}
                <div style={{ width: '100%', height: 3, borderRadius: 2, background: '#f1f5f9', overflow: 'hidden' }}>
                  <div style={{
                    width: '100%', height: '100%',
                    background: 'linear-gradient(90deg, transparent, #06b6d4, transparent)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s linear infinite'
                  }}></div>
                </div>
                {/* Status text */}
                <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>
                  {loadingText}...
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: 24, borderTop: '1px solid var(--border-default)', background: '#fff' }}>
          <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="위험 지능 분석을 시작하세요..."
              style={{
                width: '100%',
                background: '#f8fafc',
                border: '1px solid var(--border-default)',
                borderRadius: 12,
                padding: '16px 24px 16px 24px',
                color: 'var(--text-primary)',
                fontSize: 14,
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.background = '#fff';
                e.target.style.borderColor = '#0f172a';
              }}
              onBlur={(e) => {
                e.target.style.background = '#f8fafc';
                e.target.style.borderColor = 'var(--border-default)';
              }}
            />
            <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: 8 }}>
                <button 
                  type="submit" 
                  disabled={loading}
                  style={{
                    background: '#0f172a',
                    color: '#fff',
                    padding: '8px 24px',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontWeight: 700,
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1
                  }}
                  onMouseEnter={e => {
                    if (!loading) e.currentTarget.style.background = '#1e293b';
                  }}
                  onMouseLeave={e => {
                    if (!loading) e.currentTarget.style.background = '#0f172a';
                  }}
                >
                  {loading ? 'Analyzing...' : <Send style={{ width: 16, height: 16 }} />}
                </button>
            </div>
          </form>
          <p style={{ textAlign: 'center', fontSize: 10, color: 'var(--text-muted)', marginTop: 16, textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 700 }}>
            Powered by SafetyAI Hybrid GraphRAG Engine
          </p>
        </div>
      </div>
    </div>
  );
}

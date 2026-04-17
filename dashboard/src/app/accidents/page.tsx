'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import * as d3 from 'd3';
import {
  Search, Network, ChevronRight, ChevronLeft, ArrowRight,
  Loader2, X, Minus, Plus, BookOpen, Play,
  AlertTriangle, Building2, MapPin, Wrench,
  GraduationCap,
} from 'lucide-react';
import dynamic from 'next/dynamic';

const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), { ssr: false });

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/safetron';

/* ─── Types ─── */
interface GraphNode extends d3.SimulationNodeDatum {
  id: string; name: string; label: string; metadata: string;
}
interface GraphEdge {
  source: string | GraphNode; target: string | GraphNode; type: string;
}

/* ─── Colors ─── */
const NODE_COLORS: Record<string, string> = {
  Accident: '#ef4444', Company: '#2563eb', Agent: '#f59e0b',
  Location: '#10b981', Component: '#8b5cf6', AccidentType: '#ec4899',
  Tool: '#64748b', Equipment: '#0ea5e9', Task: '#14b8a6',
  Cause: '#f43f5e', BodyPart: '#eab308', Result: '#d946ef'
};
const NODE_KR: Record<string, string> = {
  Accident: '사고', Company: '회사', Agent: '관계자',
  Location: '장소', Component: '기인물', AccidentType: '사고유형',
  Tool: '도구', Equipment: '장비', Task: '작업',
  Cause: '사고원인', BodyPart: '신체부위', Result: '의학적유형'
};
const NODE_RADIUS: Record<string, number> = {
  AccidentType: 14, Company: 10, Agent: 8, Location: 10, Component: 10,
  Tool: 8, Equipment: 10, Task: 8, Cause: 10, BodyPart: 8, Result: 8, Accident: 5,
};

const QUICK_ITEMS = [
  { id: 'TYPE_떨어짐(추락)', label: '추락', sub: 'Fall from height' },
  { id: 'TYPE_끼임(협착)', label: '협착', sub: 'Caught in machinery' },
  { id: 'TYPE_넘어짐(전도)', label: '전도', sub: 'Toppling / trip' },
  { id: 'TYPE_감전', label: '감전', sub: 'Electric shock' },
  { id: 'TYPE_맞음(낙하/비래)', label: '맞음', sub: 'Struck-by object' },
  { id: 'TYPE_부딪힘(충돌)', label: '충돌', sub: 'Collision' },
  { id: 'TYPE_무너짐(붕괴)', label: '붕괴', sub: 'Structural collapse' },
  { id: 'TYPE_화재/폭발', label: '화재/폭발', sub: 'Fire / explosion' },
  { id: 'TYPE_깔림/전복', label: '깔림/전복', sub: 'Crushed / overturned' },
  { id: 'TYPE_질식/중독', label: '질식/중독', sub: 'Suffocation' },
  { id: 'TYPE_베임/찔림/찰과상', label: '베임/찔림', sub: 'Cut / laceration' },
  { id: 'TYPE_기타', label: '기타', sub: 'Other types' },
];

/* ─── Guide action scenarios ─── */
const GUIDE_ACTIONS = [
  {
    num: 1,
    icon: AlertTriangle,
    color: '#ef4444',
    title: '사고 패턴 분석',
    subtitle: 'TBM 미팅 활용',
    desc: '추락 사고 유형을 2-hop으로 탐색하여 관련 장소(비계, 지붕, 사다리)와 기인물(안전대, 작업발판)의 패턴을 분석합니다. TBM(Tool Box Meeting) 시 데이터 기반의 안전 교육이 가능합니다.',
    action: { nodeId: 'TYPE_떨어짐(추락)', depth: 2, max: 30 },
  },
  {
    num: 2,
    icon: Building2,
    color: '#2563eb',
    title: '시공사 프로파일링',
    subtitle: '입찰 평가 활용',
    desc: '특정 시공사를 중심으로 과거 사고 이력과 사고 유형 분포를 조회합니다. 입찰 평가 시 협력업체의 안전 이력을 객관적으로 분석하여 리스크를 사전에 파악합니다.',
    action: { nodeId: 'CO_주식회사 반도건설산업', depth: 2, max: 20 },
  },
  {
    num: 3,
    icon: MapPin,
    color: '#10b981',
    title: '사고 원인 교차 분석',
    subtitle: '안전관리계획서 활용',
    desc: '비계에서 발생한 사고의 공통 패턴을 분석합니다. 비계 사고와 연결된 시공사, 관계자(직종), 기인물을 한눈에 파악하여 안전관리계획서 작성 시 데이터로 뒷받침합니다.',
    action: { nodeId: 'LOC_비계', depth: 2, max: 25 },
  },
  {
    num: 4,
    icon: GraduationCap,
    color: '#8b5cf6',
    title: '안전 교육 콘텐츠',
    subtitle: '교육 자료 제작',
    desc: '협착 사고의 핵심 사례 10건을 중심으로 관련 시공사, 장소, 기인물을 시각화합니다. 사고 노드를 클릭하면 상세 원인과 재발방지 대책을 확인할 수 있어 교육 자료로 활용 가능합니다.',
    action: { nodeId: 'TYPE_끼임(협착)', depth: 2, max: 10 },
  },
];

/* ─── Component ─── */
export default function AccidentExplorerPage() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [graphData, setGraphData] = useState<{ nodes: GraphNode[]; edges: GraphEdge[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [depth, setDepth] = useState(2);
  const [maxAccidents, setMaxAccidents] = useState(25);
  const [graphStats, setGraphStats] = useState<any>(null);
  const [activeGuide, setActiveGuide] = useState<any>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [showAnalysisPanel, setShowAnalysisPanel] = useState(false);
  const [showNodeAnalysisFor, setShowNodeAnalysisFor] = useState<GraphNode | null>(null);
  const fgRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [SpriteTextClass, setSpriteTextClass] = useState<any>(null);
  
  useEffect(() => { import('three-spritetext').then(m => setSpriteTextClass(() => m.default)); }, []);
  
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(entries => {
      if (entries[0]) {
        setDimensions({
          width: entries[0].contentRect.width,
          height: entries[0].contentRect.height
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [graphData]);
  
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphEdge> | null>(null);

  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`${basePath}/api/graph/search?q=${encodeURIComponent(searchTerm)}`);
      const data = await res.json();
      setSearchResults(data.nodes || []);
    } catch (err) { console.error(err); }
    finally { setSearching(false); }
  }, [searchTerm]);

  const loadSubGraph = useCallback(async (nodeId: string, d?: number, max?: number) => {
    setLoading(true);
    setSearchResults([]);
    setSelectedNode(null);
    const useDepth = d ?? depth;
    const useMax = max ?? maxAccidents;
    try {
      const res = await fetch(
        `${basePath}/api/graph/subgraph?id=${encodeURIComponent(nodeId)}&depth=${useDepth}&max=${useMax}`
      );
      
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse JSON. Server returned:", text.substring(0, 200));
        throw e;
      }
      if (data.error) {
        console.error("API Error:", data.error);
        throw new Error(data.error);
      }
      setGraphData({ nodes: data.nodes || [], edges: data.edges || [] });
      setGraphStats(data.stats || null);
    } catch (err: any) {
      console.error("Subgraph Load Error:", err);
      let msg = "그래프 데이터를 가져오는데 실패했습니다.";
      if (err instanceof Error) msg += ` (${err.message})`;
      else msg += " 서버가 응답하지 않거나 HTML 오류를 반환했습니다.";
      
      alert(msg);
    } finally { setLoading(false); }
  }, [depth, maxAccidents]);

  /* Handle guide action click */
  const handleGuideAction = useCallback((ga: any) => {
    setShowGuide(false);
    setActiveGuide(ga);
    setShowAnalysisPanel(true);
    loadSubGraph(ga.action.nodeId, ga.action.depth, ga.action.max);
  }, [loadSubGraph]);

  /* D3 force graph */
  useEffect(() => {
    if (graphData && fgRef.current) {
      setTimeout(() => {
        // Move the target (lookAt) towards bottom-right, pushing the graph visualization to the top-left
        fgRef.current.cameraPosition({ x: 0, y: 0, z: 450 }, { x: 120, y: -100, z: 0 }, 1500);
      }, 300);
    }
  }, [graphData]);

  // Pass active selection upstream into the URL to ensure full pipeline continuity
  useEffect(() => {
    if (typeof window !== 'undefined' && selectedNode) {
      const url = new URL(window.location.href);
      if (selectedNode.label === 'Company') {
        url.searchParams.set('company', selectedNode.name);
        url.searchParams.delete('q'); // clean up previous query
      } else if (selectedNode.label === 'Accident') {
        url.searchParams.set('q', `[지식그래프 의뢰] 선택된 노드 "${selectedNode.name}"(유형: ${selectedNode.label})`);
      } else {
        url.searchParams.set('q', `선택된 노드 "${selectedNode.name}"(유형: ${selectedNode.label})`);
      }
      window.history.replaceState({}, '', url.toString());
    }
  }, [selectedNode]);

  const dot = (color: string, size = 7) => ({
    width: size, height: size, borderRadius: '50%', background: color, flexShrink: 0 as const,
  });

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%', flex: 1,
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
            사고 지식 그래프
          </h1>
          <p style={{ fontSize: 11, color: '#93c5fd', letterSpacing: '0.08em', marginTop: 3, fontFamily: "'Inter', monospace" }}>
            SAFETY KNOWLEDGE GRAPH — 38K NODES · 170K+ RELATIONSHIPS
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {GUIDE_ACTIONS.map((ga) => {
            const Icon = ga.icon;
            return (
              <button
                key={ga.num}
                onClick={() => handleGuideAction(ga)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '5px 12px', borderRadius: 16,
                  border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.08)',
                  color: '#fff', fontSize: 12, fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.15s ease',
                  fontFamily: 'inherit'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = ga.color;
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.borderColor = ga.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                }}
              >
                <Icon style={{ width: 13, height: 13 }} />
                {ga.title}
              </button>
            );
          })}
          <div style={{ width: 1, height: 16, background: 'var(--border-default)', margin: '0 4px' }} />

          {/* ── Guide Button ── */}
          <button
            onClick={() => setShowGuide(true)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '5px 14px', borderRadius: 16,
              border: '1px solid rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.08)',
              color: '#fff', fontSize: 11.5, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.15s ease', marginLeft: 4,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--accent)';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.borderColor = 'var(--accent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
            }}
          >
            <BookOpen style={{ width: 13, height: 13 }} />
            지식그래프 활용가이드
          </button>
        </div>
      </div>

      {/* ══════════ Body ══════════ */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ── Left Panel ── */}
        <div style={{
          width: 300, minWidth: 300, flexShrink: 0,
          borderRight: '1px solid var(--border-default)',
          background: '#fff', display: 'flex', flexDirection: 'column',
          overflowY: 'auto',
        }} className="custom-scrollbar">

          {/* Search */}
          <div style={{ padding: '14px 16px 12px' }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8, fontFamily: "'Inter', monospace" }}>
              Entity Search
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
              <div style={{ position: 'relative' }}>
                <Search style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input type="text" value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="사고, 회사, 장소 검색..."
                  style={{
                    width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-default)',
                    borderRadius: 8, padding: '9px 10px 9px 32px', fontSize: 13,
                    color: 'var(--text-primary)', outline: 'none', fontFamily: "'Pretendard', sans-serif",
                    transition: 'border-color 0.12s, box-shadow 0.12s',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-muted)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.boxShadow = 'none'; }}
                />
                <button type="submit" style={{ position: 'absolute', right: 5, top: '50%', transform: 'translateY(-50%)', background: 'var(--accent)', border: 'none', color: 'white', padding: '4px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                  {searching ? <Loader2 style={{ width: 12, height: 12, animation: 'spin 1s linear infinite' }} /> : '검색'}
                </button>
              </div>
            </form>
          </div>

          {/* Depth / Max Control */}
          <div style={{ padding: '0 16px 12px', display: 'flex', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: 4, fontFamily: "'Inter', sans-serif" }}>탐색 깊이</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1px solid var(--border-default)', borderRadius: 6, overflow: 'hidden' }}>
                <button onClick={() => setDepth(Math.max(1, depth - 1))} style={{ padding: '5px 8px', background: 'var(--bg-input)', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', fontFamily: 'inherit' }}>
                  <Minus style={{ width: 12, height: 12 }} />
                </button>
                <span style={{ flex: 1, textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', padding: '5px 0' }}>{depth}-hop</span>
                <button onClick={() => setDepth(Math.min(3, depth + 1))} style={{ padding: '5px 8px', background: 'var(--bg-input)', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', fontFamily: 'inherit' }}>
                  <Plus style={{ width: 12, height: 12 }} />
                </button>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: 4, fontFamily: "'Inter', sans-serif" }}>사고 수</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1px solid var(--border-default)', borderRadius: 6, overflow: 'hidden' }}>
                <button onClick={() => setMaxAccidents(Math.max(5, maxAccidents - 5))} style={{ padding: '5px 8px', background: 'var(--bg-input)', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', fontFamily: 'inherit' }}>
                  <Minus style={{ width: 12, height: 12 }} />
                </button>
                <span style={{ flex: 1, textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', padding: '5px 0' }}>{maxAccidents}건</span>
                <button onClick={() => setMaxAccidents(Math.min(100, maxAccidents + 5))} style={{ padding: '5px 8px', background: 'var(--bg-input)', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', fontFamily: 'inherit' }}>
                  <Plus style={{ width: 12, height: 12 }} />
                </button>
              </div>
            </div>
          </div>

          {/* Search results */}
          {searchResults.length > 0 && (
            <div style={{ borderTop: '1px solid var(--border-default)', maxHeight: 220, overflowY: 'auto' }} className="custom-scrollbar">
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', padding: '10px 16px 6px', fontFamily: "'Inter', monospace" }}>
                Results — {searchResults.length}
              </div>
              {searchResults.map((n: any) => (
                <button key={n.id} onClick={() => loadSubGraph(n.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', width: '100%', textAlign: 'left',
                    background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-subtle)',
                    cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.1s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={dot(NODE_COLORS[n.label] || '#9ca3af', 7)} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.name}</div>
                    <div style={{ fontSize: 9.5, color: 'var(--text-muted)', marginTop: 1 }}>{n.label}</div>
                  </div>
                  <ChevronRight style={{ width: 14, height: 14, color: 'var(--text-dim)', flexShrink: 0 }} />
                </button>
              ))}
            </div>
          )}

          {/* Quick Explore */}
          <div style={{ borderTop: '1px solid var(--border-default)', flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', padding: '12px 16px 6px', fontFamily: "'Inter', monospace" }}>
              Quick Explore
            </div>
            {QUICK_ITEMS.map((item, i) => (
              <button key={item.id} onClick={() => loadSubGraph(item.id)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                  padding: '8px 16px', width: '100%', textAlign: 'left',
                  background: 'transparent', border: 'none',
                  borderBottom: i < QUICK_ITEMS.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.1s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={dot('#ec4899', 6)} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{item.label}</div>
                    <div style={{ fontSize: 9.5, color: 'var(--text-muted)', marginTop: 1 }}>{item.sub}</div>
                  </div>
                </div>
                <ArrowRight style={{ width: 12, height: 12, color: 'var(--text-dim)', flexShrink: 0 }} />
              </button>
            ))}
          </div>
        </div>

        {/* ══════════ Graph Area ══════════ */}
        <div ref={containerRef} style={{ flex: 1, position: 'relative', overflow: 'hidden', background: 'var(--bg-root)' }}>
          {loading && (
            <div style={{
              position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.85)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20,
              backdropFilter: 'blur(4px)',
            }}>
              <div style={{ textAlign: 'center' }}>
                <Loader2 style={{ width: 24, height: 24, color: 'var(--accent)', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
                <p style={{ marginTop: 10, fontSize: 13, color: 'var(--text-tertiary)', fontWeight: 500 }}>그래프 로딩중...</p>
              </div>
            </div>
          )}

          {!graphData && !loading && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}>
              <div className="dot-pattern" style={{ position: 'absolute', inset: 0, opacity: 0.4 }} />
              <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 360 }}>
                <Network style={{ width: 36, height: 36, color: 'var(--text-dim)', margin: '0 auto 16px', strokeWidth: 1.2 }} />
                <h3 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Safety Knowledge Graph</h3>
                <p style={{ fontSize: 13, color: 'var(--text-tertiary)', lineHeight: 1.7 }}>
                  좌측 패널에서 키워드를 검색하거나,<br />Quick Explore에서 사고 유형을 선택하세요.
                </p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>노드를 더블클릭하면 관계망을 확장할 수 있습니다.</p>
                <button
                  onClick={() => setShowGuide(true)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    marginTop: 20, padding: '8px 20px', borderRadius: 8,
                    border: '1px solid var(--accent-border)',
                    background: 'var(--accent-muted)',
                    color: 'var(--accent)', fontSize: 13, fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--accent-muted)'; e.currentTarget.style.color = 'var(--accent)'; }}
                >
                  <BookOpen style={{ width: 14, height: 14 }} />
                  활용가이드 보기
                </button>
              </div>
            </div>
          )}

          {graphData && (
            <div ref={containerRef} style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                <ForceGraph3D
                  width={dimensions.width}
                  height={dimensions.height}
                  ref={fgRef}
                  graphData={{ nodes: graphData.nodes, links: graphData.edges } as any}
                  nodeId="id"
                  nodeLabel={(n: any) => `${n.name} [${n.label}]`}
                  nodeColor={(n: any) => NODE_COLORS[n.label] || '#9ca3af'}
                  nodeRelSize={5}
                  nodeResolution={16}
                  linkColor={() => 'rgba(0,0,0,0.15)'}
                  linkWidth={0.6}
                  linkDirectionalParticles={(link: any) => link.type === 'RESULTED_IN' ? 4 : 2}
                  linkDirectionalParticleWidth={1.5}
                  linkDirectionalParticleColor={() => '#000000'}
                  linkDirectionalParticleSpeed={0.005}
                  backgroundColor="#ffffff" 
                  onNodeClick={(n: any) => setSelectedNode(n as GraphNode)}
                  onNodeRightClick={(n: any) => loadSubGraph(n.id)}
                />
                {/* Legend was removed here because there is a 12-item legend globally at the bottom left */}
            </div>
          )}

          {/* ── Right Sidebar (Analysis OR Node Detail) ── */}
          {(showAnalysisPanel || selectedNode) && (
            <div style={{
              position: 'absolute', top: 0, bottom: 0, right: 0,
              width: 340, background: '#ffffff', borderLeft: '1px solid var(--border-default)',
              display: 'flex', flexDirection: 'column', zIndex: 12,
              boxShadow: '-4px 0 24px rgba(0,0,0,0.03)'
            }}>
              {selectedNode ? (
                /* ── Node Detail Content ── */
                <>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={dot(NODE_COLORS[selectedNode.label] || '#9ca3af', 9)} />
                      <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.02em', color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif" }}>
                        {NODE_KR[selectedNode.label] || selectedNode.label} 상세 속성
                      </span>
                    </div>
                    <button onClick={() => { setSelectedNode(null); if (!showAnalysisPanel) setShowAnalysisPanel(false); }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                    >
                      <X style={{ width: 18, height: 18 }} />
                    </button>
                  </div>
                  
                  <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }} className="custom-scrollbar">
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: 4 }}>{selectedNode.name}</h3>
                    <p style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", wordBreak: 'break-all', marginBottom: 20 }}>{selectedNode.id}</p>

                    {/* Metadata rendering */}
                    {selectedNode.metadata && (() => {
                      try {
                        const meta = typeof selectedNode.metadata === 'string' ? JSON.parse(selectedNode.metadata) : selectedNode.metadata;
                        return (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                            {Object.entries(meta).map(([key, value]) => {
                              const isArr = Array.isArray(value);
                              if (!value || (typeof value === 'object' && !isArr)) return null;
                              const displayValue = isArr ? (value as unknown[]).join(', ') : String(value);
                              let displayKey = key, labelColor = 'var(--text-muted)';
                              if (key === 'cause') { displayKey = '사고 원인'; labelColor = '#ef4444'; }
                              if (key === 'prevention') { displayKey = '재발 방지'; labelColor = '#10b981'; }
                              return (
                                <div key={key}>
                                  <div style={{ fontSize: 12, fontWeight: 600, color: labelColor, marginBottom: 6 }}>{displayKey}</div>
                                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '12px 14px' }}>{displayValue}</div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      } catch { return null; }
                    })()}

                    {/* Derived info for non-accident hubs */}
                    {(!selectedNode.metadata || (typeof selectedNode.metadata === 'string' && selectedNode.metadata.trim() === '') || (typeof selectedNode.metadata === 'object' && Object.keys(selectedNode.metadata).length === 0)) && graphData && (() => {
                      const linkedAccidents = graphData.edges
                        .filter((e: any) => e.source?.id === selectedNode.id || e.target?.id === selectedNode.id)
                        .map((e: any) => (e.source?.id === selectedNode.id) ? e.target : e.source)
                        .filter((n: any) => n?.label === 'Accident');
                      
                      let aggregatedCauses: string[] = [];
                      let aggregatedPreventions: string[] = [];

                      linkedAccidents.forEach((ac: any) => {
                        if (ac.metadata) {
                          try {
                            const meta = typeof ac.metadata === 'string' ? JSON.parse(ac.metadata) : ac.metadata;
                            if (meta.cause) aggregatedCauses.push(meta.cause);
                            if (meta.prevention) aggregatedPreventions.push(meta.prevention);
                          } catch {}
                        }
                      });

                      const displayCause = aggregatedCauses.length > 0
                        ? aggregatedCauses[0] + (aggregatedCauses.length > 1 ? ` (외 ${aggregatedCauses.length - 1}건의 복합 요인 관측)` : '')
                        : `${selectedNode.name}에 대한 직접적인 관련 사고 원인을 데이터망에서 추출 중입니다. 확장 버튼을 클릭하세요.`;
                      
                      const displayPrev = aggregatedPreventions.length > 0
                        ? aggregatedPreventions[0] + (aggregatedPreventions.length > 1 ? ` 등 포괄적인 현장 예방 통제 필요` : '')
                        : `망을 확장하여 관련 사고 사례를 바탕으로 예방 대책을 도출해야 합니다.`;

                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: '#ef4444', marginBottom: 6 }}>연관 주요 사고 원인</div>
                            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '12px 14px' }}>
                              {displayCause}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: '#10b981', marginBottom: 6 }}>연관 재발 방지 대책</div>
                            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, background: 'var(--bg-input)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '12px 14px' }}>
                              {displayPrev}
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Expand Network Button */}
                    <button onClick={() => {
                        const newMax = maxAccidents + 15;
                        setMaxAccidents(newMax);
                        loadSubGraph(selectedNode.id, depth, newMax);
                      }}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        width: '100%', padding: '12px 0', borderRadius: 8,
                        border: '1px solid var(--accent-border)', background: 'var(--accent-muted)',
                        color: 'var(--accent)', fontSize: 13, fontWeight: 600,
                        cursor: 'pointer', transition: 'all 0.12s', marginBottom: 24
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--accent-muted)'; e.currentTarget.style.color = 'var(--accent)'; }}
                    >
                      <Network style={{ width: 16, height: 16 }} /> 더 넓은 범위로 관계망 확장 (+15건 추가)
                    </button>

                    {/* Connected Nodes List */}
                    {graphData && (() => {
                      const connected = graphData.edges.filter((e: any) => e.source?.id === selectedNode.id || e.target?.id === selectedNode.id);
                      if (connected.length === 0) return null;
                      return (
                        <div style={{ marginBottom: 32 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>연관 객체 ({connected.length})</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 180, overflowY: 'auto' }} className="custom-scrollbar">
                            {connected.map((e: any, idx: number) => {
                              const linked = (e.source?.id === selectedNode.id) ? e.target : e.source;
                              return (
                                <button key={idx} onClick={() => setSelectedNode(linked)}
                                  style={{
                                    display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 6,
                                    width: '100%', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer',
                                  }}
                                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-input)'; }}
                                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                                >
                                  <div style={dot(NODE_COLORS[linked?.label] || '#9ca3af', 8)} />
                                  <span style={{ flex: 1, fontSize: 12, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{linked?.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}

                    {showAnalysisPanel && (
                      <button style={{
                        width: '100%', padding: '12px', background: 'var(--accent-muted)', color: 'var(--accent)',
                        border: '1px solid var(--accent-border)', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                        marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      }} onClick={() => setSelectedNode(null)}
                         onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--border-default)'; }}
                         onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--accent-muted)'; }}
                      >
                        <ChevronLeft style={{ width: 16, height: 16 }} /> {activeGuide ? `${activeGuide.title} 결과로` : '분석 결과로'} 뒤로가기
                      </button>
                    )}



                    <button style={{
                      width: '100%', padding: '12px', background: activeGuide?.color || '#002A7A', color: '#fff',
                      border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      boxShadow: `0 4px 12px ${(activeGuide?.color || '#002A7A')}40`
                    }} onClick={() => { 
                      const query = `[지식그래프 패턴 분석 의뢰] 선택된 노드 "${selectedNode.name}"(유형: ${selectedNode.label})와 관련된 사고 발생 패턴과 근본 원인을 심층 분석하고, 리스크 저감 대책을 제안해주세요.`;
                      const sp = new URLSearchParams(window.location.search);
                      sp.set('q', query);
                      window.location.href = `${basePath}/ai-analyst?${sp.toString()}`; 
                    }}>
                      AI 리스크 심층 분석 <ChevronRight style={{ width: 16, height: 16 }} />
                    </button>

                  </div>
                </>
              ) : (
                /* ── Pattern Analysis Content ── */
                <>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa' }}>
                    <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      {activeGuide?.icon ? (() => { const Icon = activeGuide.icon; return <Icon style={{ width: 16, height: 16, color: activeGuide.color || 'var(--accent)' }} /> })() : <AlertTriangle style={{ width: 16, height: 16, color: '#ef4444' }} />}
                      {activeGuide ? `${activeGuide.title} 결과` : '분석 결과 해석'}
                    </h2>
                    <button onClick={() => setShowAnalysisPanel(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                      <X style={{ width: 18, height: 18 }} />
                    </button>
                  </div>
                  <div style={{ padding: '20px', flex: 1, overflowY: 'auto' }} className="custom-scrollbar">
                    
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={dot(NODE_COLORS['AccidentType'] || '#000', 8)} />
                        {activeGuide?.num === 2 ? '시공사 리스크 분산도' : activeGuide?.num === 3 ? '주요 교차 사고원인' : activeGuide?.num === 4 ? '교육용 시각화 요약' : '군집화된 위험 발견'}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, background: 'var(--bg-input)', padding: '12px', borderRadius: 8, border: '1px solid var(--border-default)' }}>
                        {activeGuide?.num === 2 ? (
                          <>현재 <strong style={{ color: NODE_COLORS['Company'] }}>특정 시공사</strong>를 중심으로 연관된 사고 이력과 발생한 주위 환경의 분포도를 다면적으로 평가 중입니다. 리스크 확산 반경을 주의하세요.</>
                        ) : activeGuide?.num === 3 ? (
                          <>선택된 <strong style={{ color: NODE_COLORS['Location'] }}>장소/기인물</strong>에서 파생된 복합적인 사고 궤적입니다. 구조적인 교차 원인을 차단하는 접근이 요구됩니다.</>
                        ) : activeGuide?.num === 4 ? (
                          <>근로자 <strong style={{ color: NODE_COLORS['Agent'] }}>TBM (안전교육)</strong> 활용 목적에 최적화된 직관적인 망입니다. 과거 사고들이 하나의 원인에서 시작되었음을 시각적으로 설명하세요.</>
                        ) : (
                          <>현재 시각화된 데이터망에서 <strong>{graphData?.nodes.find(n => n.label === 'AccidentType')?.name || '선택된 핵심'}</strong> 사고군이 특정 요소들과 강력한 허브성 군집을 형성하고 있음이 확인되었습니다.</>
                        )}
                      </div>
                    </div>

                    <div style={{ marginBottom: 24 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Network style={{ width: 14, height: 14, color: 'var(--text-muted)' }} />
                        가장 취약한 핵심 노드 (Hubs)
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {Object.entries(graphStats?.labelCounts || {}).sort((a, b) => (b[1] as number) - (a[1] as number)).filter(([k]) => k !== 'Accident' && k !== 'AccidentType' && k !== 'Company').slice(0, 3).map(([label, count]) => (
                          <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', padding: '10px 14px', borderRadius: 8, border: `1px solid ${NODE_COLORS[label] || '#999'}40`, borderLeft: `3px solid ${NODE_COLORS[label] || '#999'}` }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>관여된 {NODE_KR[label] || label} 수:</span>
                            <span style={{ fontSize: 14, fontWeight: 700, color: NODE_COLORS[label] || '#999' }}>{count as number}건</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Search style={{ width: 14, height: 14, color: 'var(--text-muted)' }} />
                        리스크 관리 제언
                      </div>
                      <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, gap: 4, display: 'flex', flexDirection: 'column' }}>
                        {activeGuide?.num === 2 ? (
                          <><li>해당 시공사의 과거 이력에 특정한 기인물이 반복되는지 확인하세요.</li><li>망의 우측 상단이나 하단으로 치우친 특이 군집이 있다면 집중 관리 대상입니다.</li></>
                        ) : activeGuide?.num === 3 ? (
                          <><li>동일 장소에서 상이한 종류의 사고들이 복합적으로 터지는 패턴입니다.</li><li>단순 교육보다 물리적인 통제(장비 철거 및 보강)가 최우선됩니다.</li></>
                        ) : activeGuide?.num === 4 ? (
                          <><li>교육 대상 근로자들에게 중심 노드의 위험성을 강조하세요.</li><li>시각적으로 가장 선이 많은 굵은 요소를 지목하여 경각심을 고취시키기 좋습니다.</li></>
                        ) : (
                          <><li>과거 사고가 <strong>공통된 장소/기인물</strong>을 매개로 빈번히 발생 중입니다.</li><li>망의 중심으로 위치할수록 우선 관리 대상입니다. 노드를 우클릭하여 관계망을 확장하세요.</li></>
                        )}
                      </ul>
                    </div>

                    <button style={{
                      width: '100%', padding: '12px', background: activeGuide?.color || '#002A7A', color: '#fff',
                      border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer',
                      marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      boxShadow: `0 4px 12px ${(activeGuide?.color || '#002A7A')}40`
                    }} onClick={() => { 
                      const query = activeGuide 
                        ? `[지식그래프 ${activeGuide.title} 의뢰] 현재 지식그래프에 나타난 패턴의 상세 원인과, 이를 최우선으로 해결하기 위한 현장 리스크 관리 방안을 제안해주세요.`
                        : `[지식그래프 심층 의뢰] 렌더링된 사고 지식그래프 구성 요소들을 통해 유추할 수 있는 복합적인 현장 위험 패턴과, 안전보건관리체계 개선 방안을 분석해주세요.`;
                      const sp = new URLSearchParams(window.location.search);
                      sp.set('q', query);
                      window.location.href = `${basePath}/ai-analyst?${sp.toString()}`; 
                    }}>
                      AI 리스크 심층 분석 <ChevronRight style={{ width: 16, height: 16 }} />
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── Legend (Moved from Header) ── */}
          <div style={{
            position: 'absolute', bottom: 14, left: 14, display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap',
            zIndex: 50, maxWidth: '60%'
          }}>
            {Object.entries(NODE_COLORS).map(([label, color]) => (
              <div key={label} style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '4px 10px', borderRadius: 16,
                border: `1px solid ${color}30`, background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(4px)',
                fontSize: 11, fontWeight: 600, color: color,
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
              }}>
                <div style={dot(color, 6)} />
                <span>{NODE_KR[label] || label}</span>
              </div>
            ))}
          </div>

          {/* Stats badge */}
          {graphData && (
            <div style={{
              position: 'absolute', bottom: 14, right: 14, display: 'flex', alignItems: 'center', gap: 8,
              background: '#fff', border: '1px solid var(--border-default)', borderRadius: 8,
              padding: '5px 12px', fontSize: 11, fontWeight: 500, color: 'var(--text-tertiary)',
              fontFamily: "'Inter', monospace", zIndex: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}>
              <span>{graphData.nodes.length} nodes</span>
              <span style={{ color: 'var(--text-dim)' }}>·</span>
              <span>{graphData.edges.length} edges</span>
              {graphStats?.labelCounts && (
                <>
                  <span style={{ color: 'var(--text-dim)' }}>|</span>
                  {Object.entries(graphStats.labelCounts as Record<string, number>)
                    .filter(([label]) => label !== 'Accident')
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 4)
                    .map(([label, cnt]) => (
                      <span key={label} style={{ color: NODE_COLORS[label] || '#9ca3af' }}>
                        {NODE_KR[label] || label}: {cnt as number}
                      </span>
                    ))
                  }
                  {Object.keys(graphStats.labelCounts).length > 5 && (
                    <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>등 {Object.keys(graphStats.labelCounts).length - 1}종</span>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════
          GUIDE MODAL — 지식그래프 활용가이드
          ══════════════════════════════════════ */}
      {showGuide && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(6px)',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowGuide(false); }}
        >
          <div style={{
            background: '#fff', borderRadius: 16,
            width: '90%', maxWidth: 780, maxHeight: '85vh',
            overflow: 'hidden', display: 'flex', flexDirection: 'column',
            boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
            border: '1px solid var(--border-default)',
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px 16px',
              borderBottom: '1px solid var(--border-default)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
              background: 'var(--bg-elevated)',
              flexShrink: 0,
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <BookOpen style={{ width: 18, height: 18, color: 'var(--accent)' }} />
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                    건설 안전 지식그래프 — 실무 활용 가이드
                  </h2>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>
                  38,412개 노드 · 171,789개 관계 · 12종 사고유형의 데이터를 실무에 활용하는 방법
                </p>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                style={{
                  background: 'var(--bg-input)', border: '1px solid var(--border-default)',
                  borderRadius: 8, padding: 6, cursor: 'pointer', color: 'var(--text-muted)',
                  transition: 'all 0.12s', flexShrink: 0,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-default)'; }}
              >
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 24px' }} className="custom-scrollbar">

              {/* Section Title */}
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
                📋 빠른 실행 (실무 활용 시나리오)
              </h3>
              <p style={{ fontSize: 12.5, color: 'var(--text-tertiary)', marginBottom: 16, lineHeight: 1.6 }}>
                아래 액션 버튼을 클릭하면 모달이 닫히고 해당 시나리오의 2-hop 심층 분석 결과가 중앙 캔버스에 즉시 렌더링됩니다.
              </p>

              {/* Action Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
                {GUIDE_ACTIONS.map((ga) => {
                  const Icon = ga.icon;
                  return (
                    <div key={ga.num} style={{
                      border: '1px solid var(--border-default)',
                      borderRadius: 12, overflow: 'hidden',
                      transition: 'all 0.15s ease',
                      background: '#fff',
                    }}>
                      {/* Card header */}
                      <div style={{
                        padding: '14px 16px 10px',
                        borderBottom: '1px solid var(--border-subtle)',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <div style={{
                            width: 28, height: 28, borderRadius: 7,
                            background: `${ga.color}12`, border: `1px solid ${ga.color}25`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <Icon style={{ width: 14, height: 14, color: ga.color }} />
                          </div>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                              활용 {ga.num}. {ga.title}
                            </div>
                            <div style={{ fontSize: 10, color: ga.color, fontWeight: 600, letterSpacing: '0.04em', marginTop: 1 }}>
                              {ga.subtitle}
                            </div>
                          </div>
                        </div>
                        <p style={{ fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.65, marginTop: 4 }}>
                          {ga.desc}
                        </p>
                      </div>

                      {/* Action button */}
                      <div style={{ padding: '10px 16px' }}>
                        <button
                          onClick={() => handleGuideAction(ga.action)}
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                            width: '100%', padding: '9px 0', borderRadius: 8,
                            border: `1px solid ${ga.color}30`,
                            background: `${ga.color}08`,
                            color: ga.color, fontSize: 12.5, fontWeight: 600,
                            cursor: 'pointer', fontFamily: 'inherit',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = ga.color;
                            e.currentTarget.style.color = '#fff';
                            e.currentTarget.style.borderColor = ga.color;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = `${ga.color}08`;
                            e.currentTarget.style.color = ga.color;
                            e.currentTarget.style.borderColor = `${ga.color}30`;
                          }}
                        >
                          <Play style={{ width: 13, height: 13 }} />
                          활용 {ga.num} 버튼 (그래프 렌더링)
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Graph Structure */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Network style={{ width: 14, height: 14, color: 'var(--accent)' }} />
                  그래프 구조
                </h3>
                <div style={{
                  background: 'var(--bg-input)', border: '1px solid var(--border-default)',
                  borderRadius: 10, padding: 16,
                  fontFamily: "'JetBrains Mono', 'Consolas', monospace",
                  fontSize: 12, lineHeight: 2,
                  color: 'var(--text-secondary)',
                }}>
                  <div>사고 ──<span style={{ color: '#2563eb' }}>[MANAGED_BY]</span>──→ <span style={{ color: '#2563eb', fontWeight: 600 }}>시공사</span> <span style={{ color: 'var(--text-muted)' }}>(어느 회사에서?)</span></div>
                  <div>사고 ──<span style={{ color: '#f59e0b' }}>[INVOLVED_AGENT]</span>──→ <span style={{ color: '#f59e0b', fontWeight: 600 }}>관계자</span> <span style={{ color: 'var(--text-muted)' }}>(누가 연루?)</span></div>
                  <div>사고 ──<span style={{ color: '#10b981' }}>[OCCURRED_AT]</span>──→ <span style={{ color: '#10b981', fontWeight: 600 }}>장소</span> <span style={{ color: 'var(--text-muted)' }}>(어디서?)</span></div>
                  <div>사고 ──<span style={{ color: '#8b5cf6' }}>[INVOLVES_OBJECT]</span>──→ <span style={{ color: '#8b5cf6', fontWeight: 600 }}>기인물</span> <span style={{ color: 'var(--text-muted)' }}>(무엇 때문?)</span></div>
                  <div>사고 ──<span style={{ color: '#ec4899' }}>[RESULTED_IN]</span>──→ <span style={{ color: '#ec4899', fontWeight: 600 }}>사고유형</span> <span style={{ color: 'var(--text-muted)' }}>(어떤 종류?)</span></div>
                </div>
              </div>

              {/* Usage Tips */}
              <div style={{
                background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10,
                padding: '12px 16px', marginBottom: 24,
                display: 'flex', alignItems: 'flex-start', gap: 10,
              }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>i</span>
                </div>
                <div style={{ fontSize: 12.5, color: '#1e40af', lineHeight: 1.7 }}>
                  <strong>사용 팁:</strong> 노드를 <strong>클릭</strong>하면 상세정보를 확인할 수 있고, <strong>더블클릭</strong>하면 해당 노드 중심으로 관계망이 확장됩니다. 좌측 패널의 "탐색 깊이"와 "사고 수" 컨트롤로 그래프 크기를 조절할 수 있습니다.
                </div>
              </div>

              {/* Bottom note */}
              <div style={{
                background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10,
                padding: '12px 16px',
                display: 'flex', alignItems: 'flex-start', gap: 10,
              }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>✓</span>
                </div>
                <div style={{ fontSize: 12.5, color: '#166534', lineHeight: 1.7 }}>
                  <strong>향후 발전:</strong> AI 리스크 분석가와 연동하면 그래프에서 선택한 노드를 기반으로 자연어 위험 분석 리포트를 자동 생성하고, 안전관리계획서를 맞춤형으로 작성할 수 있습니다.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

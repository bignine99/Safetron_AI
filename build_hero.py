import os
from pathlib import Path

def create_hero_page():
    # 1. HTML
    html_content = """<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Safetron | Intelligent AI Agent</title>
  <!-- Fonts -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css">
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;900&display=swap" rel="stylesheet">
  <!-- Styles -->
  <link rel="stylesheet" href="../static/css/landing.css">
  <!-- Three.js -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
</head>
<body>

  <!-- Top Navigation -->
  <a href="https://www.ninetynine99.co.kr/" class="home-link font-outfit" target="_blank">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
    NINETYNINE
  </a>

  <!-- SECTION 1: HERO -->
  <section class="hero-section">
    <!-- Background Layers -->
    <div class="aurora-layer">
      <div class="aurora-blob blob-1"></div>
      <div class="aurora-blob blob-2"></div>
      <div class="aurora-blob blob-3"></div>
    </div>
    <div class="hero-canvas-container">
      <canvas id="heroParticles"></canvas>
    </div>
    <div class="floating-keywords">
      <span class="fw" style="--delay:0s;--x:12%;--y:20%">COMPANY</span>
      <span class="fw" style="--delay:3s;--x:80%;--y:25%">LOCATION</span>
      <span class="fw" style="--delay:6s;--x:15%;--y:75%">AGENT</span>
      <span class="fw" style="--delay:9s;--x:75%;--y:65%">PROCESS</span>
      <span class="fw" style="--delay:12s;--x:45%;--y:15%">COMPONENT</span>
      <span class="fw" style="--delay:15s;--x:50%;--y:80%">ACCIDENT</span>
    </div>
    <div class="grid-lines">
      <div class="line" style="left: 20%"></div>
      <div class="line" style="left: 40%"></div>
      <div class="line" style="left: 60%"></div>
      <div class="line" style="left: 80%"></div>
    </div>

    <!-- Content -->
    <div class="hero-content reveal">
      <div class="hero-badge font-outfit">
        <div class="pulse-dot"></div>
        ENTERPRISE RISK INTELLIGENCE
      </div>
      <h1 class="gradient-title font-outfit">Safetron Intelligent<br/>AI Agent</h1>
      <p class="hero-desc">
        대한민국 건설산업 전반에 걸친 방대한 데이터. AI 모델의 정확한 인지 능력을 위해<br/>SQL 정량 데이터와 온톨로지 텍스트 데이터로 완벽하게 이원화되었습니다.
      </p>
      <a href="#pipeline" class="cta-button font-outfit">
        EXPLORE PIPELINE
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14"></path>
          <path d="m12 5 7 7-7 7"></path>
        </svg>
      </a>

      <!-- Stats -->
      <div class="hero-stats">
        <div class="stat-item">
          <div class="stat-num font-outfit"><span class="count-up" data-target="37196" data-suffix="">0</span></div>
          <div class="stat-label font-outfit">SQL ROWS</div>
        </div>
        <div class="stat-item">
          <div class="stat-num font-outfit"><span class="count-up" data-target="2566524" data-suffix="">0</span></div>
          <div class="stat-label font-outfit">DATA CELLS</div>
        </div>
        <div class="stat-item">
          <div class="stat-num font-outfit"><span class="count-up" data-target="89466" data-suffix="">0</span></div>
          <div class="stat-label font-outfit">KG NODES</div>
        </div>
        <div class="stat-item">
          <div class="stat-num font-outfit"><span class="count-up" data-target="389523" data-suffix="">0</span></div>
          <div class="stat-label font-outfit">KG EDGES</div>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 2: PLATFORM CONTENTS -->
  <section class="feature-section">
    <div class="container reveal">
      <div class="section-header">
        <span class="section-label font-outfit">CORE ADVANTAGES</span>
        <h2 class="section-title">데이터베이스 및 파이프라인의 압도적 특장점</h2>
        <p class="section-desc">AI가 직접 구축하고 교차 검증한 무결성 데이터와 전사적 관점의 초고속 의사결정 파이프라인</p>
      </div>

      <div class="feature-grid">
        <div class="feature-card reveal">
          <div class="feature-icon text-red">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          </div>
          <h3>Hallucination 원천 차단</h3>
          <p>엄격하게 규정된 지식 그래프 노드 내에서만 답변을 생성하여 AI의 허위 답변을 근본적으로 제거합니다.</p>
        </div>
        <div class="feature-card reveal">
          <div class="feature-icon text-orange">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
          </div>
          <h3>Token 사용량 최소화</h3>
          <p>불필요한 방대한 원문 대신 압축된 Sub-graph 매핑 정보만 LLM에 전달하여 비용과 지연시간을 획기적으로 낮췄습니다.</p>
        </div>
        <div class="feature-card reveal">
          <div class="feature-icon text-emerald">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
          </div>
          <h3>데이터 정합성 극대화</h3>
          <p>정량(SQL) 데이터와 정성(텍스트) 데이터를 상호 교차 검증하여 결점 없는 정밀한 요율 산정 팩터를 도출합니다.</p>
        </div>
        <div class="feature-card reveal">
          <div class="feature-icon text-accent">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <h3>심사역의 최적화된 Copilot</h3>
          <p>전문적인 지식이 없어도, AI가 맞춤형 현장 정보를 역추적해 Risk Index를 즉시 요약·산출합니다.</p>
        </div>
        <div class="feature-card reveal">
          <div class="feature-icon text-indigo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>
          </div>
          <h3>초고속 요율 심사 자동화</h3>
          <p>수일이 소요되던 과정을 "그래프 쿼리 연산 → 리스크 평가 → 요금 할증/할인" 파이프라인으로 단축 지원.</p>
        </div>
        <div class="feature-card reveal">
          <div class="feature-icon text-purple">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          </div>
          <h3>감각적 Risk Intelligence</h3>
          <p>단순한 스프레드시트가 아닌 다차원 분석 차트와 시각적 네트워크망(Graph Explorer)으로 위험을 캐치합니다.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 3: DATABASE ARCHITECTURE -->
  <section class="navy-section">
    <div class="deco-circle circle-1"></div>
    <div class="deco-circle circle-2"></div>
    <div class="container reveal">
      <div class="section-header text-center">
        <span class="section-label font-outfit">SYSTEM ARCHITECTURE</span>
        <h2 class="section-title text-white">보험료 산정 시스템 차별성</h2>
      </div>
      
      <div class="navy-grid">
        <div class="navy-card reveal">
          <div class="navy-card-num font-outfit">01 / DUAL DB</div>
          <h3>이원화 DB 아키텍처</h3>
          <p>정량(SQL) 데이터와 온톨로지 지식 그래프의 완벽한 융합으로 한계를 극복합니다.</p>
        </div>
        <div class="navy-card reveal">
          <div class="navy-card-num font-outfit">02 / HYBRID RAG</div>
          <h3>12대 핵심 노드 해체</h3>
          <p>비정형 텍스트를 시공사, 공종, 기인물 등 12개 노드로 해체하여 인과관계를 직조합니다.</p>
        </div>
        <div class="navy-card reveal">
          <div class="navy-card-num font-outfit">03 / REAL-TIME</div>
          <h3>초고속 실시간 평가 모델</h3>
          <p>수일에 걸친 서베이 수동평가를 대체하는 실시간 AI 분석 요율 산출 파이프라인.</p>
        </div>
        <div class="navy-card reveal">
          <div class="navy-card-num font-outfit">04 / SPECIFIC DATA</div>
          <h3>건설 특화 데이터셋</h3>
          <p>일반 데이터가 아닌 건설 현장에 특화된 3.7만 개 이상의 사고/원인 데이터 구축.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 4: DATA PIPELINE -->
  <section id="pipeline" class="pipeline-section">
    <div class="container reveal">
      <div class="section-header text-center">
        <span class="section-label font-outfit">AI WORKFLOW</span>
        <h2 class="section-title">심사 자동화 데이터 파이프라인</h2>
        <p class="section-desc">전문적 사고회로를 완벽하게 모사하기 위해 설계된 독자적 6-Step 파이프라인</p>
      </div>

      <div class="pipeline-flow">
        <div class="pipeline-step">
          <div class="step-num font-outfit">STEP 01</div>
          <h4>정량 데이터 임베딩</h4>
          <p>SQL 수치 데이터 벡터화 및 요율 공식 연동</p>
        </div>
        <div class="pipeline-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></div>
        
        <div class="pipeline-step">
          <div class="step-num font-outfit">STEP 02</div>
          <h4>안전 특화 온톨로지</h4>
          <p>비정형 텍스트를 12개의 핵심 노드로 구조화</p>
        </div>
        <div class="pipeline-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></div>
        
        <div class="pipeline-step">
          <div class="step-num font-outfit">STEP 03</div>
          <h4>메타데이터 빌드</h4>
          <p>다차원 상관관계를 지식그래프 네트워크로 직조</p>
        </div>
        <div class="pipeline-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></div>
        
        <div class="pipeline-step">
          <div class="step-num font-outfit">STEP 04</div>
          <h4>2차 벡터 임베딩</h4>
          <p>검색된 네트워크 구조를 RAG 텍스트로 변환</p>
        </div>
        <div class="pipeline-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></div>
        
        <div class="pipeline-step">
          <div class="step-num font-outfit">STEP 05</div>
          <h4>하이브리드 RAG</h4>
          <p>지식 그래프와 정량 팩터를 조인하여 오차 제거</p>
        </div>
        <div class="pipeline-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></div>
        
        <div class="pipeline-step">
          <div class="step-num font-outfit">STEP 06</div>
          <h4>요율 산출 완료</h4>
          <p>결점 없는 정밀 심사 및 요금 할증/할인 리포트</p>
        </div>
      </div>
    </div>
  </section>

  <!-- SECTION 5: KG + RAG -->
  <section class="image-text-section">
    <div class="container">
      <div class="section-header text-center reveal">
        <span class="section-label font-outfit">BUSINESS IMPACT</span>
        <h2 class="section-title">초고속 성장을 위한 비즈니스 파급력</h2>
      </div>

      <!-- Row 1 -->
      <div class="img-row reveal">
        <div class="img-box">
          <div class="placeholder-img" style="background: linear-gradient(135deg, #e0f2fe, #bae6fd); display: flex; align-items: center; justify-content: center; height: 100%;">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
          </div>
        </div>
        <div class="text-box">
          <span class="tag font-outfit">DAAS MODEL</span>
          <h4>UBI 실시간 언더라이팅 수수료 확대</h4>
          <p>자동차 T-map 보험처럼, AI 분석 요율을 시스템간 API로 즉각 송신하는 Value-Chain을 제공합니다.</p>
          <ul>
            <li>초고속 API 연동</li>
            <li>실시간 데이터 송수신</li>
            <li>새로운 수수료 수익 모델 창출</li>
          </ul>
        </div>
      </div>

      <!-- Row 2 -->
      <div class="img-row img-row-reverse reveal">
        <div class="img-box">
          <div class="placeholder-img" style="background: linear-gradient(135deg, #ede9fe, #ddd6fe); display: flex; align-items: center; justify-content: center; height: 100%;">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
          </div>
        </div>
        <div class="text-box">
          <span class="tag font-outfit">VALUE INTEGRATION</span>
          <h4>엔터프라이즈 B2B 번들링 및 채널 패키징</h4>
          <p>법인 영업 시 Safetron AI 플러그인을 맞춤 특약 분석의 부가 가치로 제공하여 경쟁력을 극대화합니다.</p>
          <ul>
            <li>강력한 B2B 영업 무기</li>
            <li>맞춤형 특약 분석 플러그인</li>
            <li>고객사 락인(Lock-in) 효과</li>
          </ul>
        </div>
      </div>

      <!-- Row 3 -->
      <div class="img-row reveal">
        <div class="img-box">
          <div class="placeholder-img" style="background: linear-gradient(135deg, #ffe4e6, #fecdd3); display: flex; align-items: center; justify-content: center; height: 100%;">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          </div>
        </div>
        <div class="text-box">
          <span class="tag font-outfit">CLAIMS AUTOMATION</span>
          <h4>사고 예측 보상 리포트 컨설팅</h4>
          <p>압도적 하이브리드 RAG 기술을 통한 보상 및 재발방지 원스톱 리포트를 자동 생성하여 제공합니다.</p>
          <ul>
            <li>원스톱 사고 보상 리포트</li>
            <li>AI 기반 재발 방지 대책</li>
            <li>업무 효율 획기적 증가</li>
          </ul>
        </div>
      </div>

    </div>
  </section>

  <!-- SECTION 6: ML METRICS -->
  <section class="navy-section">
    <div class="deco-circle circle-1"></div>
    <div class="deco-circle circle-2"></div>
    <div class="container reveal">
      <div class="section-header text-center">
        <span class="section-label font-outfit">PERFORMANCE METRICS</span>
        <h2 class="section-title text-white">데이터 처리 성능 지표</h2>
      </div>
      
      <div class="navy-grid">
        <div class="navy-card reveal">
          <div class="navy-card-num font-outfit">LATENCY</div>
          <h3><span class="count-up" data-target="150" data-suffix="ms">0</span></h3>
          <p>지식 그래프 순회 연산 레이턴시</p>
        </div>
        <div class="navy-card reveal">
          <div class="navy-card-num font-outfit">ACCURACY</div>
          <h3><span class="count-up" data-target="99.8" data-suffix="%">0</span></h3>
          <p>하이브리드 RAG 인과관계 추론율</p>
        </div>
        <div class="navy-card reveal">
          <div class="navy-card-num font-outfit">SAVINGS</div>
          <h3><span class="count-up" data-target="85" data-suffix="%">0</span></h3>
          <p>기존 서베이 대비 심사 시간 단축률</p>
        </div>
        <div class="navy-card reveal">
          <div class="navy-card-num font-outfit">UPTIME</div>
          <h3><span class="count-up" data-target="99.9" data-suffix="%">0</span></h3>
          <p>안정적인 무중단 서비스 가동률</p>
        </div>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="site-footer font-outfit">
    <a href="https://www.ninetynine99.co.kr/" target="_blank">https://www.ninetynine99.co.kr/</a>
    <span>2026 © All Right Reserved by Ninetynine Inc.</span>
  </footer>

  <!-- Scripts -->
  <script src="../static/js/hero-particles.js"></script>
  <script src="../static/js/landing.js"></script>
</body>
</html>"""

    # 2. CSS
    css_content = """:root {
  --navy: #061E4A;
  --accent: #3B82F6;
  --emerald: #10B981;
  --orange: #F97316;
  --red: #EF4444;
  --bg: #FFFFFF;
  --bg-subtle: #F8FAFC;
  --bg-panel: #F1F5F9;
  --text-primary: #1E293B;
  --text-secondary: #475569;
  --text-muted: #94A3B8;
  --border: #F1F5F9;
  --border-mid: #E2E8F0;
  
  --indigo: #6366f1;
  --purple: #8b5cf6;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: 'Pretendard', sans-serif;
  color: var(--text-primary);
  background-color: var(--bg);
  line-height: 1.6;
  overflow-x: hidden;
}
.font-outfit { font-family: 'Outfit', sans-serif; }
a { text-decoration: none; }

/* Top Navigation */
.home-link {
  position: fixed; top: 20px; left: 24px; z-index: 1000;
  display: flex; align-items: center; gap: 8px;
  background: rgba(6, 30, 74, 0.85);
  backdrop-filter: blur(12px);
  color: #fff; padding: 10px 16px; border-radius: 2px;
  font-weight: 700; font-size: 14px; letter-spacing: 1px;
  transition: all 0.3s;
}
.home-link:hover { background: var(--accent); box-shadow: 0 4px 12px rgba(59,130,246,0.3); }

/* Common */
.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.text-center { text-align: center; }
.text-red { color: var(--red); }
.text-orange { color: var(--orange); }
.text-emerald { color: var(--emerald); }
.text-accent { color: var(--accent); }
.text-indigo { color: var(--indigo); }
.text-purple { color: var(--purple); }
.text-white { color: #fff; }

.section-header { margin-bottom: 48px; }
.section-label { font-size: 11px; color: var(--accent); font-weight: 700; letter-spacing: 0.2em; display: block; margin-bottom: 12px; }
.section-title { font-size: 28px; font-weight: 700; color: var(--navy); margin-bottom: 16px; }
.section-desc { font-size: 15px; color: var(--text-secondary); max-width: 640px; margin: 0 auto; }

/* Reveal Animation */
.reveal { opacity: 0; transform: translateY(30px); transition: opacity 0.7s ease, transform 0.7s ease; }
.reveal.visible { opacity: 1; transform: translateY(0); }

/* SECTION 1: HERO */
.hero-section {
  position: relative; min-height: 100vh;
  display: flex; flex-direction: column; justify-content: center; align-items: center;
  background-color: #FAFBFF; overflow: hidden;
}
.aurora-layer, .hero-canvas-container, .floating-keywords, .grid-lines {
  position: absolute; inset: 0; pointer-events: none;
}
.aurora-layer { z-index: 0; }
.hero-canvas-container { z-index: 1; }
.floating-keywords { z-index: 1; }
.grid-lines { z-index: 1; display: flex; }
.grid-lines .line { position: absolute; top: 0; bottom: 0; width: 1px; background: rgba(6,30,74,0.04); }

.aurora-blob { position: absolute; border-radius: 50%; animation: aurora-drift 20s ease-in-out infinite; filter: blur(80px); }
.blob-1 { width: 500px; height: 500px; background: rgba(59,130,246,0.15); top: -10%; left: 10%; }
.blob-2 { width: 600px; height: 600px; background: rgba(6,30,74,0.10); bottom: -10%; right: 10%; animation-delay: -5s; }
.blob-3 { width: 450px; height: 450px; background: rgba(16,185,129,0.08); top: 30%; left: 40%; animation-delay: -10s; }

@keyframes aurora-drift {
  0%   { transform: translate(0, 0) scale(1); }
  25%  { transform: translate(60px, -40px) scale(1.15); }
  50%  { transform: translate(-30px, 30px) scale(0.95); }
  75%  { transform: translate(40px, 50px) scale(1.1); }
  100% { transform: translate(0, 0) scale(1); }
}

.fw {
  position: absolute; left: var(--x); top: var(--y);
  font: 700 18px 'Outfit'; color: rgba(6,30,74,0.18);
  text-transform: uppercase; letter-spacing: 0.15em;
  animation: fw-float 20s ease-in-out infinite; animation-delay: var(--delay); opacity: 0;
}
@keyframes fw-float {
  0%   { opacity: 0; transform: translate(0,0) scale(0.8); }
  10%  { opacity: 1; }
  45%  { opacity: 1; transform: translate(20px,-30px) scale(1.1); }
  90%  { opacity: 1; }
  100% { opacity: 0; transform: translate(0,0) scale(0.8); }
}

.hero-content { position: relative; z-index: 2; text-align: center; max-width: 900px; padding: 0 24px; }
.hero-badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--navy); color: #fff; padding: 6px 14px; border-radius: 2px;
  font-size: 11px; font-weight: 700; letter-spacing: 1px; margin-bottom: 24px;
}
.pulse-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--emerald); animation: pulse 2s infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

.gradient-title {
  font-size: clamp(36px, 5vw, 64px); line-height: 1.1; letter-spacing: -0.02em; margin-bottom: 20px;
  background: linear-gradient(90deg, #061E4A 0%, #3B82F6 33%, #1D4ED8 66%, #061E4A 100%);
  background-size: 300% 100%;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  animation: gradient-x 3s ease-in-out infinite;
}
@keyframes gradient-x { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }

.hero-desc { font-size: 16px; color: var(--text-secondary); max-width: 600px; margin: 0 auto 40px; }

.cta-button {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--navy); color: #fff; padding: 14px 28px; border-radius: 2px;
  font-size: 14px; font-weight: 700; transition: all 0.3s; margin-bottom: 64px;
}
.cta-button:hover { background: var(--accent); transform: translateY(-2px); box-shadow: 0 10px 20px rgba(59,130,246,0.3); }

.hero-stats { display: flex; gap: 48px; justify-content: center; flex-wrap: wrap; }
.stat-item { text-align: center; }
.stat-num { font-size: 36px; font-weight: 700; color: var(--navy); line-height: 1; margin-bottom: 4px; }
.stat-label { font-size: 11px; color: var(--text-muted); font-weight: 700; letter-spacing: 1px; }

/* SECTION 2: PLATFORM CONTENTS */
.feature-section { padding: 100px 0; background: var(--bg); }
.feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
.feature-card {
  border: 1px solid var(--border); border-radius: 2px; padding: 32px 24px;
  border-bottom: 3px solid var(--border-mid); transition: all 0.3s; background: #fff;
}
.feature-card:hover { border-color: var(--accent); transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.05); border-bottom-color: var(--accent); }
.feature-icon { width: 40px; height: 40px; margin-bottom: 20px; }
.feature-card h3 { font-size: 17px; font-weight: 700; color: var(--navy); margin-bottom: 12px; }
.feature-card p { font-size: 13px; color: var(--text-secondary); }

/* SECTION 3 & 6: NAVY BLOCK */
.navy-section { padding: 100px 0; background: var(--navy); position: relative; overflow: hidden; }
.deco-circle { position: absolute; border-radius: 50%; background: rgba(59,130,246,0.06); pointer-events: none; }
.circle-1 { width: 400px; height: 400px; top: -100px; right: -100px; animation: float 18s infinite ease-in-out; }
.circle-2 { width: 300px; height: 300px; bottom: -50px; left: -100px; animation: float 14s infinite ease-in-out reverse; }
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-40px); } }

.navy-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; position: relative; z-index: 2; }
.navy-card {
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 2px;
  padding: 32px 24px; transition: all 0.3s;
}
.navy-card:hover { background: rgba(255,255,255,0.08); border-color: rgba(59,130,246,0.3); transform: translateY(-4px); }
.navy-card-num { font-size: 11px; color: var(--accent); font-weight: 700; margin-bottom: 16px; letter-spacing: 1px; }
.navy-card h3 { font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 12px; }
.navy-card p { font-size: 14px; color: rgba(255,255,255,0.7); }

/* SECTION 4: DATA PIPELINE */
.pipeline-section { padding: 100px 0; background: var(--bg); overflow: hidden; }
.pipeline-flow { display: flex; align-items: center; justify-content: space-between; max-width: 1200px; margin: 0 auto; padding: 0 24px; overflow-x: auto; padding-bottom: 24px; }
.pipeline-step {
  flex: 0 0 160px; background: #fff; border: 1px solid var(--border-mid); border-radius: 2px; padding: 20px 16px;
  text-align: center; transition: all 0.4s;
}
.pipeline-step.step-active { background: var(--navy); border-color: var(--accent); transform: translateY(-6px); box-shadow: 0 12px 24px rgba(6,30,74,0.15); }
.step-num { font-size: 11px; font-weight: 700; color: var(--accent); margin-bottom: 8px; letter-spacing: 1px; }
.pipeline-step h4 { font-size: 15px; font-weight: 700; color: var(--navy); margin-bottom: 8px; transition: color 0.4s; }
.pipeline-step p { font-size: 12px; color: var(--text-muted); transition: color 0.4s; }
.pipeline-step.step-active h4 { color: #fff; }
.pipeline-step.step-active p { color: rgba(255,255,255,0.7); }

.pipeline-arrow { color: var(--border-mid); display: flex; align-items: center; justify-content: center; width: 24px; animation: arrow-pulse 2s infinite; }
@keyframes arrow-pulse { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(5px); } }

/* SECTION 5: IMAGE-TEXT ROWS */
.image-text-section { padding: 100px 0; background: var(--bg); }
.img-row { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center; margin-bottom: 80px; }
.img-row:last-child { margin-bottom: 0; }
.img-row-reverse { direction: rtl; }
.img-row-reverse > * { direction: ltr; }

.img-box { border-radius: 2px; overflow: hidden; height: 320px; }
.placeholder-img { transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
.img-box:hover .placeholder-img { transform: scale(1.03); }

.text-box .tag { display: inline-block; font-size: 10px; font-weight: 700; color: var(--accent); border: 1px solid var(--accent); padding: 4px 8px; border-radius: 2px; margin-bottom: 16px; }
.text-box h4 { font-size: 20px; font-weight: 700; color: var(--navy); margin-bottom: 16px; }
.text-box p { font-size: 14px; color: var(--text-secondary); margin-bottom: 16px; }
.text-box ul { list-style: none; }
.text-box li { font-size: 13px; color: var(--text-secondary); margin-bottom: 8px; padding-left: 12px; position: relative; }
.text-box li::before { content: ''; position: absolute; left: 0; top: 6px; width: 4px; height: 4px; background: var(--accent); }

/* FOOTER */
.site-footer { max-width: 1200px; margin: 0 auto; border-top: 1px solid var(--border-mid); padding: 32px 24px; display: flex; justify-content: space-between; color: #BFBFBF; font-size: 13px; }
.site-footer a { color: #BFBFBF; transition: color 0.3s; }
.site-footer a:hover { color: var(--accent); }

@media (max-width: 768px) {
  .img-row { grid-template-columns: 1fr; }
  .img-row-reverse { direction: ltr; }
  .pipeline-flow { padding-bottom: 20px; }
}
"""

    # 3. hero-particles.js
    hero_particles_content = """// hero-particles.js - WebGL Chromatic Sine-Wave
const canvas = document.getElementById('heroParticles');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);

const scene = new THREE.Scene();
// Use orthographic camera to cover the plane completely
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

// Geometry covering the whole screen
const geometry = new THREE.PlaneBufferGeometry(2, 2);

const vertexShader = `
  attribute vec3 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  varying vec2 vUv;
  uniform float time;

  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    
    // Create organic sine waves
    float d = length(p);
    float wave1 = sin(d * 5.0 - time * 1.5) * 0.5 + 0.5;
    float wave2 = sin(p.x * 3.0 + p.y * 2.0 + time) * 0.5 + 0.5;
    float wave3 = sin(p.x * 5.0 - p.y * 5.0 - time * 0.8) * 0.5 + 0.5;
    
    // Mix waves to get RGB channels (raw colors)
    float r = wave1 * wave2;
    float g = wave2 * wave3;
    float b = wave3 * wave1;

    // Map to Navy-Blue-Teal Palette
    float finalR = r * 0.024 + g * 0.12 + b * 0.02;
    float finalG = r * 0.075 + g * 0.32 + b * 0.40;
    float finalB = r * 0.29  + g * 0.65 + b * 0.96;
    
    // Alpha falloff from center
    float alpha = max(0.0, 1.0 - d * 0.8) * 0.35; // max alpha 0.35

    gl_FragColor = vec4(finalR, finalG, finalB, alpha);
  }
`;

const material = new THREE.RawShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    time: { value: 0.0 }
  },
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

function resize() {
  const container = canvas.parentElement;
  renderer.setSize(container.clientWidth, container.clientHeight);
}
window.addEventListener('resize', resize);
resize();

function animate() {
  requestAnimationFrame(animate);
  material.uniforms.time.value += 0.01;
  renderer.render(scene, camera);
}
animate();
"""

    # 4. landing.js
    landing_js_content = """// landing.js

document.addEventListener('DOMContentLoaded', () => {
  // 1. Scroll Reveal
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // 2. Count-Up
  const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseFloat(entry.target.getAttribute('data-target'));
        const suffix = entry.target.getAttribute('data-suffix') || '';
        const duration = 2000;
        let start = 0;
        let startTime = null;

        function easeOutCubic(p) { return 1 - Math.pow(1 - p, 3); }

        function updateCount(timestamp) {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          const current = Math.floor(easeOutCubic(progress) * target);
          
          // formatting with commas if integer
          let displayVal = current;
          if (target % 1 !== 0) displayVal = (easeOutCubic(progress) * target).toFixed(1);
          else displayVal = current.toLocaleString();

          entry.target.innerText = displayVal + suffix;

          if (progress < 1) requestAnimationFrame(updateCount);
          else {
            if (target % 1 !== 0) entry.target.innerText = target.toFixed(1) + suffix;
            else entry.target.innerText = target.toLocaleString() + suffix;
          }
        }
        requestAnimationFrame(updateCount);
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.count-up').forEach(el => countObserver.observe(el));

  // 3. Pipeline Sequential Highlight
  const steps = document.querySelectorAll('.pipeline-step');
  if (steps.length > 0) {
    let currentIndex = 0;
    
    function highlightNext() {
      // Clear all
      steps.forEach(s => s.classList.remove('step-active'));
      
      // Highlight current
      if (currentIndex < steps.length) {
        steps[currentIndex].classList.add('step-active');
        currentIndex++;
        setTimeout(highlightNext, 1000);
      } else {
        // Reset and restart
        currentIndex = 0;
        setTimeout(highlightNext, 800); // 0.8초 대기 후 재시작
      }
    }
    
    // Start sequence when pipeline section is visible
    const pipeObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setTimeout(highlightNext, 500);
        pipeObserver.disconnect();
      }
    }, { threshold: 0.2 });
    
    pipeObserver.observe(document.getElementById('pipeline'));
  }
});
"""

    root = Path(__file__).resolve().parent / "hero_landing"
    
    with open(root / "templates" / "landing.html", "w", encoding="utf-8") as f:
        f.write(html_content)
    with open(root / "static" / "css" / "landing.css", "w", encoding="utf-8") as f:
        f.write(css_content)
    with open(root / "static" / "js" / "landing.js", "w", encoding="utf-8") as f:
        f.write(landing_js_content)
    with open(root / "static" / "js" / "hero-particles.js", "w", encoding="utf-8") as f:
        f.write(hero_particles_content)
        
    print("All files generated successfully.")

if __name__ == '__main__':
    create_hero_page()

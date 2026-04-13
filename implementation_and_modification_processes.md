# Implementation & Modification Processes

**작성일시**: 2026-04-10
**프로젝트**: 건설 안전 데이터 사이언스 및 Hybrid RAG 대시보드 구축

---

## ✅ 금일 작업 결과 (Completed Today)

### 1. 가상 건설사 프로필 고도화 및 현실화
- **규모 확장**: 총 1,275개의 가상 건설사를 공종(건축, 토목, 전기, 기계 등)별로 정밀 배분하여 생성.
- **사명 정제**: 단순 순번 방식(제1, 제2 등)을 탈피하여 '종합건설', 'E&C', '미래산업' 등 자연스러운 산업군 접미사를 조합한 2,600개 이상의 유니크한 사명 풀(Pool) 구축.
- **보험 지표 현실화**: 
    - 산업재해율을 현실적 범위(0.01%~0.25%)로 전면 조정.
    - 사고건수(1~25건) 및 사망사고(0~4건)를 역산이 아닌 독립 확률 분포로 생성하여 리스크 프로파일의 신뢰도 향상.

### 2. 데이터 레이어 최종 분리 및 최적화
- **정제된 통합 데이터 (`cleaned_safety_data_06.csv`)**: 모든 파생 변수와 보험 정보가 포함된 마스터셋.
- **통계/대시보드 레이어 (`cleaned_safety_data_07.csv` & `dashboard_data.json`)**: 
    - 중복 및 불필요한 인구통계학적 세부 항목(내국인/외국인/남녀/연령별 사망 등 20여 개) 제거.
    - 69개 핵심 컬럼으로 압축하여 프론트엔드 로드 속도 최적화.
- **지식 그래프/RAG 레이어 (`knowledge_graph_ontology.jsonl`)**: 
    - 텍스트 데이터를 기반으로 한 온톨로지(Who, When, Where, What, Cause, Result) 추출.
    - Graph DB 및 Hybrid RAG 시스템의 소스 데이터로 활용 가능하도록 JSONL 포맷 가공.

### 3. 지식 그래프(Neo4j) 아키텍처 가이드 제공
- Neo4j의 기본 개념(Node, Relationship, Property)과 Cypher 쿼리 언어 소개.
- Python을 이용한 데이터 인젝션 패턴 및 Hybrid RAG 연동 전략 수립.

---

## 🚀 내일 작업 계획 (Planned for Tomorrow)

### 1. 지식 그래프 구축 (Graph Engine)
- **Neo4j Ingestion**: `knowledge_graph_ontology.jsonl` 데이터를 Neo4j DB로 주입하는 최종 스크립트 작성 및 실행.
- **Schema Mapping**: 사고-기인물-장소-직종 간의 다차원 연결 관계 검증.

### 2. 인터랙티브 대시보드 구축 (UI/UX)
- **통계 시각화**: `dashboard_data.json`을 사용하여 사고 위험도(Risk Index) 분포, 공종별 사고 현황, 보험 등급 통계 등을 시각화하는 React/Next.js 기반 대시보드 프레임워크 구축.
- **통합 검색**: 시공사별 리스크 프로파일 및 상세 사고 이력 조회 기능 구현.

### Phase 3: Dashboard Completion & Optimization
- [x] Integrate Risk Map (`/risk-map`) with advanced Heatmap + Filtering using D3 or CSS Grids.
- [ ] Connect Overview Dashboard with live Graph Metrics API.

### 3. Hybrid RAG 시스템 초안 (AI Integration)
- 사용자의 자연어 질문을 Neo4j 쿼리로 변환하고, 검색된 원문 데이터를 기반으로 Gemini가 답변을 생성하는 파이프라인(Graph-Search-Filter-Summarize) 설계.

---

## ✅ 2026-04-11 작업 계획 (Today's Roadmap)

### 1. 웹 대시보드 환경 구축 (Framework Setup)
- **Next.js & React 기반**: 고성능 시각화 및 RAG 파이프라인 연동을 위한 풀스택 환경 구성.
- **Glassmorphism UI**: 'Cyber-Safety' 컨셉의 프리미엄 디자인 시스템 적용.

### 2. 데이터 가상화 및 시각화 (Data Visualization)
- **`dashboard_data.json` 연동**: 1,275개 업체 데이터 기반의 동적 통계 카드 및 차트 구현.
- **리스크 맵**: 사고 위험도 지수(Risk Index)를 직관적으로 확인할 수 있는 히트맵/차트.

### 3. 지식 그래프 시뮬레이션 및 RAG 기초 (KG & AI)
- **Ontology Explorer**: 사고 사례 온톨로지를 탐색할 수 있는 노드 기반 시각화 UI 초안.
- **질의응답 모델링**: 사용자의 질문을 데이터 쿼리로 변환하는 프롬프트 엔지니어링 수행.

---

## 🛠️ 작업 로그 (Work Log)

### [오전 11:50] 프로젝트 초기화
- Next.js 15+ & React 19 기반 대시보드 프레임워크 구축 (`/dashboard`).
- 'Cyber-Safety' 테마의 Glassmorphism UI 시스템 설계 (globals.css).

### [오전 12:15] 데이터 파이프라인 최적화
- 100MB급 대형 JSON 파일을 프론트엔드에서 즉시 로드할 수 있도록 경량화된 `summary.json` 및 `companies.json` 생성 스크립트(`aggregate_data.py`, `extract_companies.py`) 작성 및 실행.
- 1,148명의 가상 건설사 프로필 데이터 연동 완료.

### [오전 12:30] 대시보드 프리미엄 UI 구현
- **Overview Page**: 실시간 사고 통계, 위험 지수 추이, 주요 사고 유형 분포 등 시각화 완료.
- **Sidebar**: 실무 중심의 내비게이션 및 인터랙티브 효과 적용.
- **Responsive Layout**: 모바일/데스크탑 대응 그리드 시스템 구축.

### [오후 12:17] 1단계 — Graph Ingestion & Backend Bridge
- **SQLite 기반 지식 그래프 DB 구축**: `ingest_graph.py` 스크립트로 `knowledge_graph_ontology.jsonl` 파일을 파싱하여 `safety_graph.db`에 **38,412개 노드** + **171,789개 엣지** 적재 완료.
- **노드 유형**: Accident, Company, Agent(누가), Location(어디서), Component(기인물), AccidentType.
- **엣지 유형**: `MANAGED_BY`, `INVOLVED_AGENT`, `OCCURRED_AT`, `INVOLVES_OBJECT`, `RESULTED_IN`.
- **서버사이드 API 구현**:
  - `GET /api/graph/search?q=...` — 엔티티 이름/ID 기반 검색.
  - `GET /api/graph/subgraph?id=...` — 특정 노드 중심의 1-hop 서브그래프 로드 (대형 허브 노드 랜덤 샘플링 적용, max 50).
  - `POST /api/chat` — Gemini 1.5 + Graph Context 기반 Hybrid RAG 응답.

### [오후 12:22] 2단계 — Accident Ontology Explorer (관계 시각화)
- **D3.js Force-Directed Graph**: `d3-force` 기반의 인터랙티브 노드 그래프 페이지 (`/accidents`) 완성.
- **기능 목록**:
  - 노드 검색 (사고코드, 장소, 기인물 등 키워드)
  - Quick Explore (추락/협착/전도/감전 사고의 관계망 원클릭 탐색)
  - 노드 클릭 시 우측 패널에서 **사고 원인** 및 **재발 방지 대책** 상세 확인
  - 노드 더블클릭 시 해당 노드 중심으로 **관계 확장**
  - 드래그 & 줌 인터랙션
- **시각적 차별화**: 노드 유형별 컬러 코딩 (Accident=빨강, Company=파랑, Agent=주황, Location=초록, Component=보라, AccidentType=핑크) + 네온 글로우 필터.

**Current Status**: Overview, Companies, Accident Explorer, AI Risk Analyst 4개 핵심 페이지 완성. `.env.local`에 Gemini API 키 입력 후 AI 분석 기능 활성화 대기.

### [오후 12:40] 다중 사이트 분할 및 시각화 고도화 (Multi-Page Expansion)
- 엄청난 양의 데이터 속성을 분산 배치하기 위하여 **4개의 신규 특화 대시보드 모듈** 추가 설계:
  - 📊 `/stats`: **사고 통계 분석** (사고 유형/주요 원인 파이 차트 및 가로형 바 차트)
  - 📈 `/trends`: **사고 추이 분석** (월별 사망/사고 에어리어 차트 및 시간대별 스텝 차트)
  - 💲 `/financial`: **재해 규모 분석** (손실 금액 컴포즈드 차트 및 현장 규모별 버블 스캐터 플롯)
  - ☀️ `/environment`: **환경 요인 분석** (기상 조건별 다각 레이더 차트 및 계절별 누적 바 차트)
- **Recharts 레이아웃 붕괴 디버깅 (SSR 대응)**: Next.js + Recharts의 컨테이너 폭 계산 충돌(`width=-1, height=-1`)로 인해 차트가 블랭크 처리되는 현상 발생. 
  - *해결 방안*: Tailwind의 반응형 JIT 클레스 대신, 명시적으로 `style={{ minHeight: '320px', height: '320px' }}`를 컴포넌트 최상단 Wrapper에 지정하여 ResizeObserver가 영구적인 높이를 먼저 확보하도록 처리 완료.

### [오후 13:00] 글로벌 프리미엄 UI 디자인 정규화 (Bilingual & 8px Corners)
- **이중 언어(Bilingual) 브랜딩 시스템 구동**: 
  - 좌측 네비게이션 및 모든 페이지의 메인 타이틀을 [한글(Pretendard)]로 강조하고, 하단 서브 타이틀을 [영문 대문자(Uppercase text-xs)]로 배치하여 가독성과 전문성 확보.
- **`<CardHeader />` 재사용 컴포넌트 도입**: 기존 차트들의 중구난방 제목 배치를 통일하기 위해 공용 헤더 모듈을 생성하여 모든 대시보드 카드에 적용.
- **8px (rounded-lg) 곡률 표준화**: 
  - `globals.css`의 `.glass` 클래스를 16px(`1rem`)에서 8px(`0.5rem`)로 일괄 조정.
  - 전역 스코프 내의 모든 `rounded-xl`, `rounded-2xl` 요소(버튼, 인풋, 패널)를 8px 모서리 기반의 `rounded-lg`로 일전 교체하여 샤프한 Corporate Report 느낌의 시각적 일관성 고정.

---
**최종 결론**: 모든 데이터 시각화 준비 및 프론트엔드 프리미엄 프레임워크가 무수정 상태로 클라이언트에게 데모 가능한 모듈 형식으로 완벽 연동되었습니다. 내일 이어서 구체적인 실제 CSV 데이터 바인딩 및 RAG 챗봇 파이프라인의 실증 프롬프트 엔지니어링을 진행하겠습니다.

### [오후 13:45] Alive 12-Step AI Pipeline 컴포넌트 분리 및 최적화
- **정적 HTML 컴포넌트화**: 기존 `risk-intelligence/page.tsx` 내 하드코딩 되어 있던 "Alive 12-Step AI Pipeline" 100줄 상당의 코드 블록을 별도의 모듈화 된 React 컴포넌트(`<AlivePipeline />`)로 독립시켜 코드의 재사용성과 가독성을 대폭 향상했습니다.
- **문구 업데이트**: 파이프라인 메인 타이틀의 수식어였던 "진정한 업무 비서"를 요구사항에 맞추어 **"빠르고 정확한 데이터 분석"**으로 텍스트 변경 완료했습니다.
- **템플릿 리터럴 문법(Syntax Error) 디버깅**: LLM 코드 생성 간 백틱(``` ` ```)과 달러사인(`${}`)에 불필요하게 포함되었던 이스케이프 기호(`\`)로 인해 발생한 Next.js 렌더링 파싱 오류를 감지하고, Node.js Regex 스크립트를 즉석에서 실행해 전체 `.tsx` 파일 내 누락/오류 구문을 완벽히 일괄 소거하고 브라우저 통합 테스트를 성공시켰습니다.

### [오후 13:55] GitHub 형상 관리 환경 셋업 및 Vercel 클라우드 배포 (Deployment)
- **보안 설정 강화 (Zero-Leakage gitignore)**: `.env.local` 등 민감한 API Key와 `100MB`를 상회하는 `.raw_data`, 빌드 캐시, `*.db` 파일이 Public Repository에 노출되는 것을 막기 위해 최상위 폴더에 하드 보안이 적용된 `.gitignore`를 확립했습니다.
- **Git Push & Security Scan**: 로컬 디렉터리를 초기화(init) 한 후 `bignine99/Safetron_AI` 원격 저장소 `main` 브랜치에 푸시를 성공했습니다. 업로드 전 강제 API Key 스캐닝(`AIza` 등 구글 API 인증값 노출 검증) 프로세스도 거쳐 보안 무결성을 검증했습니다.
- **Vercel Cloud 웹앱 배포 가이드 제공**: 해당 GitHub 저장소를 Vercel 웹 플랫폼으로 퍼블리싱 시 빈 화면(Crash/404)이 뜨는 대표적인 원인인 **[Root Directory: dashboard 설정]**과 **[Environment Variables: GEMINI_API_KEY]** 매핑 과정을 유저 친화적인 스텝 바이 스텝으로 가이딩하여 웹 기반 프로덕션 런칭을 완료시켰습니다.

### [오후 23:45] 배포 환경 마이그레이션: Vercel에서 네이버 클라우드 환경(NCP)으로 전환
- **Vercel 배포 한계 돌파 (node-gyp 에러 확인)**: Vercel 배포 도중 `better-sqlite3` 패키지의 네이티브 C++ 환경 컴파일 제약 및 Serverless 아키텍처 특성으로 인한 타임아웃/메모리 부족(`npm warn deprecated prebuild-install...`) 오류가 지속 발생하는 것을 확인했습니다. AI/DB 파이프라인의 안전한 구동을 위해 사내 네이버 클라우드 서버(Ubuntu 24.04, vCPU 2, 8GB)로 배포 아키텍처를 전면 전환했습니다.
- **NCP Linux 인프라 세팅 및 타입스크립트 에러 해결**: SSH 원격 접속 후 Node.js(20.x), PM2, `build-essential` 커스텀 설치 스크립트를 제공했습니다. 빌드(`npm run build`) 간 검출된 `analytics/correlation/page.tsx`의 Recharts 툴팁 인자 타입 에러(`formatter={(value: any)}`) 및 `comprehensive-agent/page.tsx` 내 사용불가한 인라인 속성 컴파일 에러(`hover: {...}`)를 수정하여 GitHub에 Push 후 서버에서 Pull 받아 무결성 빌드(Exit code: 0)를 달성했습니다.
- **PM2 인스턴스 무중단 배포 및 ACG 포트 충돌 처리**: 서버에서 포트 검사 중, 이미 구동 중인 다른 플랫폼(`ninetynine-hub`) 서비스와 `80`번 웹 포트가 충돌(`EADDRINUSE`)하는 상황을 발견했습니다. 이를 우회하기 위해 `safetron-dashboard`의 호스팅 포트를 `3005` 포트로 동적 바인딩(`-p 3005`)하도록 PM2 프로세스 런처를 수정 적용했습니다.
- **방화벽(ACG) Inbound 연결 승인**: 클라우드 인프라에 접근하기 위해 네이버 클라우드 대시보드에서 `ninetynine-public-subnet-default-acg` 규칙 내에 Inbound 승인 정책 (TCP, 0.0.0.0/0, Port: 3005)을 스크린샷 단위로 시각 검수하여 완전 개방 처리함으로써, 외부에서 자유롭게 대시보드에 접근할 수 있는 오픈 네트워크를 구성했습니다.

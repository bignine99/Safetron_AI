# Implementation & Modification Processes

**작성일시**: 2026-04-10
**프로젝트**: 건설안전 데이터 사이언스 및 Hybrid RAG 대시보드 구축

---

## 작업 로그 (Work Log)

### [오전 11:50] 프로젝트 초기화
- Next.js 15+ & React 19 프레임워크 대시보드 구조 설정 (`/dashboard`).
- 'Cyber-Safety' 테마의 Glassmorphism UI 시스템 설계 (globals.css).

### [오후 12:15] 데이터 파이프라인 스크립트 작성
- 100MB급 원본 JSON 데이터를 프론트엔드에서 빠르게 로딩할 수 있도록 경량화된 `summary.json` 및 `companies.json` 생성 파이썬 스크립트(`aggregate_data.py`, `extract_companies.py`) 작성 및 실행.

### [오후 12:30] 대시보드 프론트엔드 UI 컴포넌트 개발
- **Overview Page**: 핵심 지표 추이, 통계 차트, 위험도, 요약 정보를 렌더링하는 컴포넌트 개발.
- **Sidebar**: GNB 네비게이션 및 메뉴 시스템 구현.
- **Responsive Layout**: 반응형 웹 디자인 적용.

### [오후 12:17] 1단계: Graph Ingestion & Backend Bridge
- **SQLite 기반 지식 그래프 DB 생성**: `ingest_graph.py` 파이썬 스크립트로 `knowledge_graph_ontology.jsonl` 파일 파싱.
- **Node 및 Edge 타입 분류**: Accident, Company, Agent, Location, Component, AccidentType 분류.
- **API 서버 구현**: Next.js API Routes (`/api/graph/search`, `/api/graph/subgraph`, `/api/chat`) 구현.

### [오후 12:22] 2단계: Accident Ontology Explorer (지식그래프 뷰어)
- **D3.js Force-Directed Graph**: `d3-force` 모듈을 이용하여 지식그래프 시각화 (`/accidents`) 구현.
- **기능 목록**:
  - 노드 필터링 (사고유형별, 시공사별, 요인별 등)
  - Quick Explore (빠른 탐색 액션 버튼)
  - 노드 클릭 시 연관 속성 및 관계 그래프 인터랙션
  - 노드 드래그 및 줌 인터랙션

### [오후 12:40] 다중 통계 분석 대시보드 페이지 구현 (Multi-Page Expansion)
- 4가지 주제별 통계 분석 대시보드 개발:
  - `/stats`: **통계 지표 차트** (발생 건수/사망 건수 누적 추이 및 요인별 비중)
  - `/trends`: **사고 트렌드 분석** (시계열 변화 추세 및 환경변수 상관관계)
  - `/financial`: **재해 규모 분석** (손실 금액 컴포지트 차트 및 스캐터 플롯)
  - `/environment`: **사고 요인 환경 분석** (기후 조건에 따른 발생 밀도 및 공정률 비중)
- **Recharts 라이브러리 연동 및 반응형 차트 렌더링 (SSR 대응)**.

### [오후 13:00] GNB 네비게이션 디자인 다듬기 (Bilingual & 8px Corners)
- **영문/국문(Bilingual) 타이포그래피 계층화**: 사이드바 메뉴 폰트를 국문과 영문을 병기하여 사이버 펑크 디자인 요소 가미.
- **CardHeader UI/UX 개선**: 시각적 가독성 증가를 위한 헤더 패널 통일화.
- **8px (rounded-lg) 곡률 표준화**: `globals.css`의 `.glass` 클래스와 각종 패널의 둥근 모서리를 `8px`로 통일.

### [오후 13:45] Alive 12-Step AI Pipeline 컴포넌트 디자인 및 구현
- **단계별 HTML 애니메이션**: `risk-intelligence/page.tsx` 내부 12-Step AI Pipeline UI 및 애니메이션 적용.
- **상태 업데이트 라벨링**: 진행 단계별 Status 라벨 구현 및 프로세싱 애니메이션 상태 변화 연출.
- **백틱 문자열(Syntax Error) 예외 처리**: Next.js 특유의 Template Literal 이스케이프 오류 수정.

### [오후 13:55] GitHub 원격 리포지토리 푸시 및 Vercel 클라우드 배포 (Deployment)
- **보안 설정 (Zero-Leakage gitignore)**: `.env.local` 및 대용량 원본 파일, DB 등 제외.
- **Git Push & Security Scan**: 리포지토리 푸시 및 API 키 보안 노출 점검.
- **Vercel Cloud 환경 변수 설정 및 배포**: `dashboard` 디렉토리를 루트로, `GEMINI_API_KEY` 환경 변수를 연동하여 Vercel 배포 완료.

### [오후 23:45] 백엔드 배포: Vercel에서 리눅스 운영 서버(NCP)로 전환
- **Vercel 배포 한계 직면 (node-gyp 빌드 오류)**: `better-sqlite3` 패키지의 C++ 의존성 문제로 인해 Serverless 환경 배포 실패. 자체 우분투 서버로 전환 결정.
- **NCP Linux 인스턴스 세팅 및 소스코드 클론**: Node.js, PM2 설치 및 운영 환경 셋업.
- **PM2 프로세스 관리자 배포 및 포트 설정**: `safetron-dashboard` PM2 3005번 포트로 구동.
- **방화벽(ACG) Inbound 포트 허용**: TCP 3005 포트 개방 및 외부 접속 테스트 완료.

### [오후 00:30] 운영 서버 배포 완결 및 홈페이지 인프라 크로스링크 및 Nginx 라우팅 문제 해결
- **UI 마이그레이션 포인트 및 변경사항**:
  - 탭별 구성 변경: 기존 타이틀 체계인 "대시보드"|"시각화"에서 개선된 구조로 변경.
  - 콘텐츠 업데이트: "시공사 프로파일", "리스크 분석" 마이그레이션 레이블 업데이트 적용.
  - 타이틀레벨 수정사항: "관리자용 컨트롤 패널(임시제목)"에서 "관리자용 패널(임시제목)"으로 간략화 수정.
- **Nginx Subpath (`/safetron`) 라우팅 설정**:
  - 운영 도메인 하위 경로 배포방식(`www.ninetynine99.co.kr/safetron/`)으로 서비스 요청이 정확하게 내부서비스로 라우팅되도록 설정 완료.
  - `Next.js`의 `trailingSlash` 설정과 Nginx의 `proxy_pass` 패턴 간의 사소한 308/301 리다이렉트 충돌 분석 및 근본 원인 해결 (Nginx의 Location 블록 패턴을 정밀하게 조정 완료 적용).
- **홈페이지 인프라 크로스 링크 설정**: 메인 `ninetynine-hub` 크로스링크 페이지 `solutions.ts` 파일에 "Safetron AI" 카드데이터를 [보험(SAFETY)] 카테고리에 등록 완료하고 신규서비스 PM2 프로세스 사이트맵 연동확인 완료.
- **API Fetch 경로 하드코딩/하드링크 교정 및 basePath 반영 (basePath 이슈)**:
  - 신규 서비스에서 프로세스 가동 시, `Next.js`의 `<Link>` 컴포넌트가 `basePath`를 자동 반영하므로, Client-Side `fetch()` 호출에서 해당 경로를 미반영한 것이 `HTTP 404 Not Found` 원인(특히 AI Analyst Chat / Graph Search API)으로 판명되어 해결함.
  - 해당 교정사항 기저 `<script>` 단에 공통적으로 적용된 `.env.local` 하드코딩 환경 변수 구조체 (`NEXT_PUBLIC_BASE_PATH=/safetron`)를 추가하고, 모든 `fetch` 함수호출시의 URL에 동적으로 경로를 접두 추가 (`${basePath}/api/...`)하여 라우팅 통해 서비스 프로세스 일괄 정상화 완료.

### [오전 00:30] 안전 대시보드 플로우 완결 및 RAG 프로세스 모니터링/재개
- **동적 특약 리스크 맵 렌더링 구현**: 보험 인수 심사 완료 후 시공사의 리스크 모델 데이터를 기반으로 `Coverage Heatmap`의 지표(상관계수, 노출 리스크, 요율 증감폭 등) 및 매트릭스가 동적으로 연결되어 렌더링되도록 구현. (기업별 맞춤 특약/리스크 맵 연동 성공) 
- **RAG 지식그래프 파이프라인 진행 상태 점검**: 백엔드에서 작동하던 `build_ontology_ai.py` 쿼터 초과 자체 중단(Graceful Halt) 현황(약 1.1만건 완료 지점)을 트래킹하고 원인을 파악.
- **데이터베이스 구축 스크립트 재실행**: 터미널 인코딩 오류 등을 해결하고 미처리분 2.6만 건에 대해 멀티 파싱 워커(Gemini Flash)를 백그라운드로 안전하게 재가동 완료.

### [2026-04-16 오전 12:13] RAG 지식그래프 구축 경과 보고 및 2일 차 파싱 가동
- **전일 작업 경과 확인**: 백그라운드로 실행된 파싱 워커가 '일일 안전 한도'인 정확히 9,500건을 추출한 뒤, 에러 없이 안정적으로(Graceful Halt) 중단된 것을 확인. (전일 누적 구축량: 20,443건 완료)
- **금일 후속 작업 시작 (2일 차)**: 할당량이 리셋됨에 따라 남아있는 16,753건에 대해 백그라운드 파싱 스크립트(`build_ontology_ai.py`)를 재가동 완료. 
- **무결성 검증**: 기존 추출된 20,443건은 중복 파싱 없이 정확하게 건너뛰며(Skip), 남은 데이터부터 AI 모델이 바로 추출을 이어가도록 시스템 연결성이 정상 작동 중임을 검증.

### [2026-04-16 오후 12:45] 운영 서버 배포 완결 및 RAG 파이프라인 무제한화, UI/UX 고도화
- **RAG 추출 파이프라인 일일 한도 해제 및 백그라운드 재가동**: 사용자의 지속 실행 요청에 따라 build_ontology_ai.py 스크립트 내부의 자체 안전 중단 제한(일일 9,500건)을 100,000건으로 상향. pythonw 백그라운드 프로세싱 및 UTF-8 인코딩 우회 커맨드를 통해, 콘솔 출력 에러 없이 무중단으로 안정적으로 데이터가 누적 생성 및 저장(rag_output_0416.log)되도록 조치함.
- **Red Box (인수 심사 렌더링 터미널) 시각화 비율 및 난이도 강화**: 대시보드의 underwriter-scorecard 화면 내 AI 파이프라인 터미널 고도화 진행. 화면 크기를 2배(640px)로 확장하고 심도 깊고 굵직한 UI 테마(시뻘건 Red 계열 경고 테마 및 난수 기반 AI 추론 텍스트)를 반영, 인공지능이 극한의 속도로 다중 변수를 계산하는 듯한 고도의 시스템 몰입감을 부여함. 또한 심사 시간을 기존 5초에서 약 20% 지연시킨 6초~7초 수준으로 연장하여, AI의 육중한 계산 모션 체감도를 높임.
- **연관 지식 그래프 (Graph Modal) 교차 망 시각화 기능 추가**: 다중 노드의 상관관계를 보여주는 커스텀 팝업 모달을 추가하여, 추출된 DB에 존재하는 발생 사고 노드와 시공 현장, 인명 피해 관계가 상호 네트워크로 점멸/교차되는 3D 느낌의 시각적 컴포넌트(svg를 활용한 노드 앤 엣지 라우팅 프로토타입) 및 분석 리포트 화면을 도입.
- **Accidents Search 기본 가이드 매핑 정상화**: 기존에 등록되어 있는 SQLite(v3) 내의 가이드(GUIDE_ACTIONS) 버튼에 매핑된 ID 값이 아직 DB에 생성되지 않은 텍스트형 노드값으로 지정되어 검색 시 빈화면(nodes: [], edges: [])이 출력되는 오류 픽스. 실제 존재하는 시공사 코드(예: CO_주식회사 포스코건설산업) 및 사고 사례 고유코드(예: 2019-00001)로 ID를 재할당하여, 그래프 파이프라인 렌더링이 즉각 연결되도록 정상화함.
- **Nginx & Next.js 프로덕션 무중단 배포**: NCP 원격 서버에 업데이트된 underwriter-scorecard와 accidents 페이지 모듈 코드 Commit, PM2 3005번 포트 충돌 이슈가 발생한 부분에 대해 fuser 강제 종료를 통해 프로세스를 릴리즈하고 성공적으로 프로덕션(110.165.17.170) 운영 반영 완료 (홈페이지 접속 정상 확인).

### [2026-04-16 오후 13:40] 사고 지식 그래프 UI/UX 롤백 및 속성 렌더링 정상화
- **Quick Explore 리스트 복구 (사용자 요구사항)**: 회사 중심으로 변경되었던 QUICK_ITEMS를 이전 방식인 '사고 유형 (추락, 협착, 전도 등)' 리스트로 완전히 롤백.
- **가이드 액션 사용자 중심 복구**: GUIDE_ACTIONS 항목 역시 복잡한 데이터베이스 ID 단위의 텍스트 코드를 제거하고, 과거와 동일하게 '사고 패턴 분석', '시공사 프로파일링' 등의 원래 시나리오 텍스트와 UI 구조로 원복.
- **메타데이터 (사고 상세 속성) Array 렌더링 버그 수정**: 이전부터 존재하던 배열(Array) 형태의 메타데이터(예: cause: ["부주의"])가 화면 좌측 상세 속성 탭에 출력되지 않고 렌더링에서 무시되는 버그를 발견하여 해결. typeof value === "object" 조건문을 수정하여 Array.isArray()인 경우 join(", ") 형태로 화면에 정상 표출되도록 고도화 및 운영 웹사이트 전개 확정.

### [2026-04-16 오후 13:58] 심사 자동화 파이프라인 (Automated Underwriting Pipeline) 구축
- **메뉴 아키텍처 개편**: 사이드바 네비게이션을 2개의 그룹('데이터 분석 대시보드'와 '심사 자동화 파이프라인')으로 분리하고 사용자의 요청 구상에 맞추어 메뉴 순서를 재배치함.
- **연속성 시나리오 시각화 컴포넌트(PipelineWrapper)**: 시공사 리스크 분석부터 리스크 종합평가까지 이어지는 6단계의 워크플로우를 상단 헤더 영역에 구현.
  - `AI 리스크 전문가` -> `시공사 리스크 분석` -> `위험도 예측 Agent` -> `고위험 특약 망` -> `보험 요율 심사` -> `리스크 종합평가 Agent` 순서로 데이터 단계가 흘러가도록 설계.
  - 접속한 페이지의 상태(현재/완료/대기)를 아이콘 및 선분으로 시각화하고 다음 모듈로 진행하는 네비게이션 액션 버튼을 생성하여 ReAct 방법론적 연속성을 부여함.
- **Glassmorphism UI 적용**: 파이프라인 컴포넌트 후면에 가우시안 블러(Gaussian Blur)와 반투명 백그라운드를 깔아 사이버 대시보드 미학을 구현.

## 2026-04-17 (화요일 시연 대비 최종 UI/UX 고도화 및 안정성 확보)

### 1. 시각화 대시보드 구조 전면 개편 (Accident Trends)
- **2-Column High-Density 구조 적용:** 기존 1단 배열에서 엔지니어링 표준 규격에 맞게 화면을 1:1로 분할한 2열 고밀도 그리드(2-Column Layout)로 재구성 (높이 약 480px 확보로 직관적인 가독성 향상).
- **데이터 활용도 강화 (총 10종의 시계열 및 분포 차트 구현):**
    - 연면적별 사고 분포 추이 (Area Chart)
    - 공정률 분율 선행지표 (Line Chart)
    - 재해 손실액 히스토그램 (Bar Chart)
    - 투입 작업자 수별 발생 밀도 (Composed Chart: Bar+Line)
    - 기상 (온도) 상태별 빈도 분포 (Area Chart)
    - 환경 (습도) 상태별 빈도 분포 (Bar Chart)
    - 최근 10년 사고 누적 구간밀도 (Bar Chart)
    - 안전관리비 투자비율 편차치 추세 (Area Chart)
    - 하도급비율 및 리스크 분포도 (Line Chart)
    - 작업중지일수 (추정) 이상탐지 볼륨 (Bar Chart with Conditional Color Mapping)
- **차트 컬러 및 테마 세팅:** Safetron 자체 브랜드 모노크로매틱 11개 컬러칩을 활용하여 전문적이고 미려한 UI 마감 적용.
- **레이아웃 디자인:** 각 카드 모서리 반경(border-radius)을 6px 사이즈로 날카롭게 디자인하여 전문 소프트웨어 형태 구현. 헤더 패널은 80px 높이로 통일.

### 2. Risk Map (위험 지도) 데이터 매핑 누락 해결
- 상관계수 데이터 구조의 JSON 키값(pearson_r -> r, p_value -> p) 변경을 차트 로직과 동기화. 빈 패널로 나오던 버블 차트 오류 완벽 복구.
- 카테고리 데이터(categorical)에서 기상상태 및 작업공종 항목을 지식그래프 온톨로지의 핵심 스키마인 사고유형_분류(KOSHA) 및 공사종류 데이터셋으로 교체하여 도넛 및 바 차트 데이터 누락을 해결함 (value가 아닌 label 필드 매핑으로 수정).
- 트리맵 차트(Treemap) 내부에 강제 텍스트 라벨링 오버레이(CustomizedTreemapContent) 코드를 삽입하여 직관적인 구간 식별 가능하도록 개선.
- 게이지 차트(Risk Index Gauge) 하단에 분석결과 텍스트 고정 노출하여 데이터 전달 및 해석력 확대.

### 3. 좌측 공통 GNB Sidebar (Navigation Tool) 공간 최적화
- 각 네비게이션 항목 마진 및 패딩값을 기존 대비 축소 조정 (Top/Bottom padding, element gap 축소). 이로 인해 브라우저상에서 세로축이 길어져 우측 스크롤바가 발생하던 UX 불편현상을 완벽 제거.
- **카테고리 헤더 타이틀 가시성 향상:** 데이터 분석 대시보드 및 심사 자동화 파이프라인 대분류 타이틀에 극강의 볼드 처리(fontWeight: 900)와 더불어 블랙에 가까운 Deep Slate (#0f172a) 색상을 부여하여 메인 네비게이션 시각적 구분을 명확히 분리 증대.

### 4. 서버 설정 및 배포 (PM2 Stabilization)
- 사내 접속 루트인 Nginx 리버스 프록시 연동 및 솔루션 백오피스 통합을 위해 next.config.ts 에 basePath: '/safetron' 설정 적용. 
- Python 기반 운영 배포 스크립트(ssh_deploy.py)를 통해 110.165.17.170:3005/safetron 실서버로 무중단 푸시 반영 성공. 운영용 PM2 cluster 안정적 유지 확인. 시연 대비 프로덕션 Lock 처리.

## 2026-04-18 (Risk Intelligence Agent 인터페이스 고도화 및 하이엔드 디자인 스택 적용)

### 1. Cyber-Engineering 레이아웃 붕괴 디버깅 및 정규화
- **Flexbox Layout Collapse (Squashing) 이슈 해결**: 전체 메인 래퍼(Wrapper) 뷰가 세로 `display: flex`, `height: 100vh`의 제한을 안고 있어, 통계 카드 영역 등 최상단 헤더 콘텐츠의 높이가 강제로 '0'으로 찌그러지며 텍스트가 잘리는 심각한 렌더링 버그(Overflow Bug)를 진단함.
- **해결 방안 및 스크롤 복구**: 최상위 태그의 불필요한 flex 종속을 해제하고, `position: 'absolute', inset: 0`과 `overflowY: 'auto'`를 사용하여 Next.js 부모 레이아웃의 절대 영역을 100% 흡수하면서 독자적인 스크롤바가 정상 생성되도록 구조를 완전 개편함.
- **설계 표준화 (6px Border Radius)**: 페이지 내에 존재하는 모든 시각적 카드 영역, 아이콘 배경, 특장점 패널, 하이브리드 RAG 파이프라인 컨테이너의 모서리 곡률을 전사적 엔지니어링 뷰 표준인 `6px`로 일괄 강제 조정하여 날렵하고 통일성 있는 디자인 랭귀지를 구축.

### 2. 하이엔드(Premium) 시네마틱 특수 효과 적용 (조화로운 튜닝)
- **과유불급 방지**: 복잡하고 무거운 애니메이션의 무분별한 사용을 배제하고 금융/엔지니어링 테마에 맞는 절제된 5종의 High-End 기법만을 선별.
- **Aurora Background & SVG Grain Noise**: 배경에 3가지 톤(블루, 인디고, 민트)의 `radial-gradient` 블랍(Blob)이 `blur(80px)` 상태로 18~25초 주기로 극히 느리게 유동(Keyframes Animation)하게 한 뒤, 그 위에 `feTurbulence` 속성의 투명도 25% 미세 필름 노이즈(Noise)를 덮어씌워 깊고 오묘한 시네마틱 공간감을 연출.
- **Glassmorphism 2.0**: 상단 Bento Grid 형태의 4개 정량/정성 데이터 통계 카드(37,196 Rows 등)에 `blur(24px) saturate(130%)` 백드롭 필터와 투명한 이너 섀도우를 부여하여, 극대화된 고급 유리 질감을 전면 적용.
- **Dynamic Bento Grid Interaction**: 4개의 데이터 카드를 마우스로 Hover 시 1.03배 스케일업과 고유의 아이콘 컬러를 뿜어내는 입체적 글로우 그림자 효과를 부드러운 Cubic-Bezier 곡선 궤적으로 연출. 
- **Gradient Shift**: "압도적인 데이터베이스 축적과 분류" 타이틀 텍스트 내부로 은백색 메탈 광택이 6초 주기로 지나가는 선형 그라데이션 클리핑 애니메이션 구현.

### 3. 네비게이션(Sidebar) 체계 및 UI 워딩 구조 변경
- 좌측 GNB 사이드바 메뉴 중 **Risk Intelligence**라는 항목명을 비즈니스적 가치를 투명하게 담을 수 있도록 **"Safetron AI 특장점"**으로 한글화 및 명칭 변경.
- 본문 페이지 상단 메인 헤더의 워딩인 "전사적 Risk Intelligence Agent"를 한층 더 진보된 도구임을 내포하는 **"Safetron Intelligent AI Agent"**로 격상.
- 정보 인지 흐름(Workflow) 최적화에 따라, 해당 메뉴의 위치를 "데이터 분석 대시보드" 그룹 하단에서 **"심사 자동화 파이프라인" 그룹 최하단(전체 탭의 가장 마지막 대미)**으로 완벽히 이전 배치함.

### 4. 사용자 편의성(UX)을 고려한 홈페이지 귀환 핫키(Link) 구축
- 좌측 상단 최상위 로고 및 텍스트 영역인 **Safetron AI 빨간색 박스 영역 전체**를 단순 구조체(`div`)에서 Next.js의 라우팅 구조체(`<Link>`)로 교체 환장.
- 굳이 마우스를 내려 특정 항목을 찾지 않아도, 사용자가 플랫폼의 어디에 있든 상단 로고만 클릭하면 가장 첫 페이지인 **'종합 요약(Overview)'(`/`) 화면으로 즉각 회귀**하는 글로벌 내비게이션 UX(Single Page Application Routing) 완성.
- 모든 업데이트 내역을 `git push`로 메인 브랜치에 올린 뒤 자동화된 `ssh_deploy.py`를 통해 NCP Ubuntu 프록시 서버(`110.165.17.170:3005`)로 무중단 무재해 반영(Exit code 0) 성공.

---

## 2026-05-07 (인프라 마이그레이션 후 Safetron 502 에러 복구 및 프로젝트 구조 정리)

### 1. Safetron 대시보드 502 Bad Gateway 긴급 복구

- **증상**: `https://www.ninetynine99.co.kr/safetron/` 접속 시 502 Bad Gateway 반환. 메인 도메인(`ninetynine99.co.kr`)은 정상.
- **진단 과정**:
  - SSH 접속 후 `pm2 status` 확인 → `safetron-dashboard` 프로세스는 **포트 3005**에서 정상 online 상태.
  - `curl http://localhost:3005/safetron` → **HTTP 200 OK** (로컬에서는 정상 작동).
  - Nginx 설정 확인 → `/safetron/` location 블록이 `proxy_pass http://127.0.0.1:5002` 로 설정되어 있었음.
- **근본 원인**: Naver Cloud → AWS Lightsail 마이그레이션 시 Nginx 설정에서 **Safetron 프록시 포트가 잘못 설정**됨.
  - 기존 NCP: `localhost:3005` (정상)
  - Lightsail Nginx: `localhost:5002` ← **포트 불일치 (502 원인)**
- **해결 (2건)**:
  1. **포트 수정**: `proxy_pass`를 `http://127.0.0.1:5002` → `http://127.0.0.1:3005`로 교정.
  2. **Location 패턴 수정**: `location /safetron/` → `location /safetron`으로 변경 (Next.js `basePath: '/safetron'`과 호환성 확보. trailing slash 제거).
  3. **프록시 헤더 보강**: `Upgrade`, `Connection`, `X-Forwarded-For`, `X-Forwarded-Proto`, `proxy_cache_bypass` 헤더 추가.
- **결과**: `nginx -t` 통과 → `systemctl reload nginx` → **HTTP 200 OK** 정상 복구 확인.
- **서버 정보 (마이그레이션 후)**: AWS Lightsail `43.203.182.190`, PM2 `safetron-dashboard` on port 3005.

### 2. 프로젝트 폴더 구조 정리 (미커밋 상태)

- **배경**: 루트 디렉토리에 34개의 유틸리티/디버그/배포 스크립트가 산재해 있어 프로젝트 가독성 저하.
- **정리 구조**:
  ```
  260410_safetron/
  ├── dashboard/              ← Next.js 핵심 소스 (변경 없음)
  ├── config/                 ← nginx_ninetynine, solutions_server.ts
  ├── scripts/
  │   ├── data_pipeline/      ← aggregate_data.py, ingest_graph.py 등 12개
  │   ├── debug/              ← check_pm2.py, test_db.js 등 16개  
  │   └── deploy/             ← deploy_build.py, ssh_deploy.py 등 4개
  ├── logs_and_temp/          ← cols.json, output.html, 각종 로그
  ├── .gitignore              ← 민감파일 보호 (*.pem, *.db, .env*)
  └── implementation_and_modification_processes.md
  ```
- **핵심 코드(`dashboard/`)**: Git 리포지토리와 100% 동일. 변경 없음.
- **상태**: `git add -A && git commit && git push` 대기 중.



## 2026-05-07 ~ 05-08 (Safetron ?덉뼱濡??쒕뵫 ?섏씠吏 媛쒕컻 諛???쒕낫???곕룞 理쒖쟻??

### 1. ?덉뼱濡??쒕뵫 ?섏씠吏(Hero Landing Page) ?붿옄??媛쒖꽑 諛?理쒖쟻??- **??NINETYNINE) 踰꾪듉 媛꾩냼??*: ?띿뒪?몃? ?쒓굅?섍퀬 44px ?ъ씠利덉쓽 源붾걫???먰삎 ?꾩씠肄?踰꾪듉?쇰줈 蹂寃쏀븯??遺덊븘?뷀븳 ?쒖꽑 遺꾩궛??諛⑹???
- **媛?낆꽦(Legibility) 洹밸???*: `hero-desc` ?쒕툕??댄????고듃 ?됱긽??吏꾪븳 ?ㅼ씠鍮?`#0f172a`)濡?蹂寃쏀븯怨??띿뒪?몄뿉 ?붿씠???ㅼ삩 湲濡쒖슦(`text-shadow`)瑜??곸슜?섏뿬 諛깃렇?쇱슫?쒖쓽 3D ?뚰떚?닿낵 寃뱀퀜???쒕졆?섍쾶 蹂댁씠?꾨줉 ?섏젙??
- **?곗씠??移댁슫???숈쟻 ?④낵**: ?섎떒???듦퀎 ?섏튂(?몃? 諛뺤뒪)媛 3珥?媛꾧꺽?쇰줈 遺?쒕읇寃??ㅼ??쇱씠 蹂?뷀븯???꾩뒪(Pulse) ?좊땲硫붿씠??`pulse-stat`)??CSS濡?援ы쁽?섏뿬 ?쒓컖??紐곗엯媛먯쓣 ?믪씠怨? ?섏쐞 ?ㅻ챸 ?띿뒪?몃룄 援듦린 諛?湲濡쒖슦 ?④낵瑜??곸슜???쒖씤?깆쓣 媛쒖꽑??
- **?뚮줈???ㅼ썙??Floating Keywords) ?ш뎄??*: 臾댁옉???⑥뼱 ????꾨줈?앺듃 ?곌? ?곷Ц ?ㅼ썙??8醫?`INSURANCE`, `ACCIDENT RATE`, `SAFETY`, `ENHANCEMENT`, `PERFORMANCE`, `SAFETRON`, `AI`, `INTELLIGENT`)?쇰줈 ?꾨㈃ 援먯껜.

### 2. ?덉뼱濡??섏씠吏 ??硫붿씤 ??쒕낫??Next.js) 媛??곌껐(Routing) ?꾨꼍 ?숆린??- **踰꾪듉 ?곌껐 諛??쇱슦???먮윭 ?섏젙**: ?덉뼱濡??섏씠吏 以묒븰 踰꾪듉 ?띿뒪?몃? "EXPLORE DASHBOARD"濡?蹂寃쏀븯怨??대┃ ??Safetron 硫붿씤 ??쒕낫?쒕줈 ?대룞?섎룄濡??ㅼ젙??
- 珥덇린 濡쒖뺄 ?섍꼍 援ъ꽦 ???ы듃 踰덊샇 ?ㅽ빐(5000?ы듃 VE ??쒕낫???곌껐 ?ㅻ쪟)瑜??닿껐?섍퀬, Safetron Next.js ?ы듃(3000)濡?URL??紐낆떆?곸쑝濡??곌껐??
- `next.config.ts`??`basePath: '/safetron'`???ㅼ젙?섏뼱 諛쒖깮?덈뜕 `/` ?묎렐 ?쒖쓽 **404 ?먮윭** 臾몄젣瑜??닿껐?섍린 ?꾪빐, `redirects` 洹쒖튃??異붽??섏뿬 ?ъ슜?먭? `http://localhost:3000/`濡??묒냽?대룄 `http://localhost:3000/safetron`?쇰줈 ?먮룞 ?꾪솚?섎룄濡?議곗튂.
- **??쒕낫???ъ씠?쒕컮(Sidebar) 濡쒓퀬 留곹겕 ?섏젙**: ??쒕낫????醫뚯륫 ?곷떒??濡쒓퀬瑜??대┃?섎㈃ ?낅┰ ?ㅽ뻾 以묒씤 ?덉뼱濡??섏씠吏(`http://localhost:8080/templates/landing.html`)濡??대룞?섎룄濡??섏젙??

### 3. Safetron ??쒕낫???대? UI/UX 諛??먮윭(Error) ?섏젙
- **?덉벐??硫붾돱 ??젣 諛?媛꾧꺽 ?쒕떇**: ??쒕낫??醫뚯륫 硫붾돱 以??덉뼱濡??섏씠吏濡?湲곕뒫???닿???"Safetron AI ?뱀옣?? ??ぉ ??젣. 媛?硫붾돱 ??ぉ 媛꾩쓽 媛꾧꺽(`gap: 6px`)???볧엳怨? CSS `scrollbar-width: none` 諛?`::-webkit-scrollbar` ?④? 泥섎━瑜??곸슜???곗륫 ?ㅽ겕濡ㅻ컮媛 ?쒖빞瑜??댁튂吏 ?딆쑝硫댁꽌???ㅽ겕濡?湲곕뒫? ?좎??섍쾶 議곗튂??
- **AI Analyst RAG 遺꾩꽍 ?ㅻ쪟(API Key 留뚮즺) ?닿껐**: AI ?꾨Ц媛 吏덈Ц ??`AI Hybrid RAG Analysis failed (API_KEY_INVALID)` ?먮윭媛 ?щ뜕 ?먯씤??異붿쟻. `.env.local`??湲곗〈 Gemini API ?ㅺ? 留뚮즺??寃껋쓣 ?뺤씤?섍퀬, ?좏슚??理쒖떊 API ?ㅻ줈 援먯껜 ??Next.js ?쒕쾭 ?ъ떆?묓븯???뺤긽 援щ룞 ?뺣낫.
- **React Hydration Error (SSR 遺덉씪移??ㅻ쪟) ?꾩쟾 ?닿껐**:
  - **利앹긽**: ?섏씠吏 濡쒕뱶 ??遺됱? ?붾㈃?쇰줈 `Hydration failed because the server rendered text didn't match the client.` 諛쒖깮.
  - **?먯씤**: ??쒕낫??`page.tsx` ?대? 李⑦듃???댁???Heat Map) 珥덇린媛믪쓣 `Math.floor(Math.random() * 100)` ?⑥닔濡?援ы븯?꾨줉 ?섎뱶肄붾뵫 ?섏뼱 ?덉뼱, ?쒕쾭 ?뚮뜑留?媛믨낵 ?대씪?댁뼵???뚮뜑留?媛믪씠 ?щ씪 異⑸룎.
  - **議곗튂**: 臾댁옉???쒖닔 ???怨좎젙???쒕뱶 諛곗뿴(`[43, 85, 21, ...]`)??`map`?쇰줈 肉뚮젮二쇰룄濡??뺤쟻 援ъ“濡?蹂?섑븯??Hydration 異⑸룎 ?먯쿇 李⑤떒.
- **React Console Warning (?ㅽ????쇱슜 寃쎄퀬) ?닿껐**:
  - **利앹긽**: `Removing a style property during rerender (borderColor) when a conflicting property is set (border) can lead to styling bugs.` 寃쎄퀬 諛쒖깮.
  - **?먯씤**: `nodeStyle`? CSS 異뺤빟?뺤씤 `border: '1px solid #cbd5e1'`???곌퀬, `nodeHoverStyle`? 媛쒕퀎 ?띿꽦??`borderColor: '#94a3b8'`???⑥꽌 ?곹깭 蹂????React媛 ?쇰????쇱쑝??
  - **議곗튂**: 異뺤빟???띿꽦????댁꽌 `borderWidth: '1px', borderStyle: 'solid', borderColor: '#cbd5e1'`濡??쇨????덇쾶 ?좎뼵?섏뿬 寃쎄퀬 ?꾩쟾 ?닿껐.


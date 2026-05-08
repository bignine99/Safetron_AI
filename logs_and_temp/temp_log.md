## 2026-05-07 ~ 05-08 (Safetron 히어로 랜딩 페이지 개발 및 대시보드 연동 최적화)

### 1. 히어로 랜딩 페이지(Hero Landing Page) 디자인 개선 및 최적화
- **홈(NINETYNINE) 버튼 간소화**: 텍스트를 제거하고 44px 사이즈의 깔끔한 원형 아이콘 버튼으로 변경하여 불필요한 시선 분산을 방지함.
- **가독성(Legibility) 극대화**: `hero-desc` 서브타이틀의 폰트 색상을 진한 네이비(`#0f172a`)로 변경하고 텍스트에 화이트 네온 글로우(`text-shadow`)를 적용하여 백그라운드의 3D 파티클과 겹쳐도 뚜렷하게 보이도록 수정함.
- **데이터 카운터 동적 효과**: 하단의 통계 수치(노란 박스)가 3초 간격으로 부드럽게 스케일이 변화하는 펄스(Pulse) 애니메이션(`pulse-stat`)을 CSS로 구현하여 시각적 몰입감을 높이고, 하위 설명 텍스트도 굵기 및 글로우 효과를 적용해 시인성을 개선함.
- **플로팅 키워드(Floating Keywords) 재구성**: 무작위 단어 대신 프로젝트 연관 영문 키워드 8종(`INSURANCE`, `ACCIDENT RATE`, `SAFETY`, `ENHANCEMENT`, `PERFORMANCE`, `SAFETRON`, `AI`, `INTELLIGENT`)으로 전면 교체.

### 2. 히어로 페이지 ↔ 메인 대시보드(Next.js) 간 연결(Routing) 완벽 동기화
- **버튼 연결 및 라우팅 에러 수정**: 히어로 페이지 중앙 버튼 텍스트를 "EXPLORE DASHBOARD"로 변경하고 클릭 시 Safetron 메인 대시보드로 이동하도록 설정함.
- 초기 로컬 환경 구성 시 포트 번호 오해(5000포트 VE 대시보드 연결 오류)를 해결하고, Safetron Next.js 포트(3000)로 URL을 명시적으로 연결함.
- `next.config.ts`에 `basePath: '/safetron'`이 설정되어 발생했던 `/` 접근 시의 **404 에러** 문제를 해결하기 위해, `redirects` 규칙을 추가하여 사용자가 `http://localhost:3000/`로 접속해도 `http://localhost:3000/safetron`으로 자동 전환되도록 조치.
- **대시보드 사이드바(Sidebar) 로고 링크 수정**: 대시보드 내 좌측 상단의 로고를 클릭하면 독립 실행 중인 히어로 페이지(`http://localhost:8080/templates/landing.html`)로 이동하도록 수정함.

### 3. Safetron 대시보드 내부 UI/UX 및 에러(Error) 수정
- **안쓰는 메뉴 삭제 및 간격 튜닝**: 대시보드 좌측 메뉴 중 히어로 페이지로 기능이 이관된 "Safetron AI 특장점" 항목 삭제. 각 메뉴 항목 간의 간격(`gap: 6px`)을 넓히고, CSS `scrollbar-width: none` 및 `::-webkit-scrollbar` 숨김 처리를 적용해 우측 스크롤바가 시야를 해치지 않으면서도 스크롤 기능은 유지되게 조치함.
- **AI Analyst RAG 분석 오류(API Key 만료) 해결**: AI 전문가 질문 시 `AI Hybrid RAG Analysis failed (API_KEY_INVALID)` 에러가 났던 원인을 추적. `.env.local`의 기존 Gemini API 키가 만료된 것을 확인하고, 유효한 최신 API 키로 교체 후 Next.js 서버 재시작하여 정상 구동 확보.
- **React Hydration Error (SSR 불일치 오류) 완전 해결**:
  - **증상**: 페이지 로드 시 붉은 화면으로 `Hydration failed because the server rendered text didn't match the client.` 발생.
  - **원인**: 대시보드 `page.tsx` 내부 차트용 열지도(Heat Map) 초기값을 `Math.floor(Math.random() * 100)` 함수로 구하도록 하드코딩 되어 있어, 서버 렌더링 값과 클라이언트 렌더링 값이 달라 충돌.
  - **조치**: 무작위 난수 대신 고정된 시드 배열(`[43, 85, 21, ...]`)을 `map`으로 뿌려주도록 정적 구조로 변환하여 Hydration 충돌 원천 차단.
- **React Console Warning (스타일 혼용 경고) 해결**:
  - **증상**: `Removing a style property during rerender (borderColor) when a conflicting property is set (border) can lead to styling bugs.` 경고 발생.
  - **원인**: `nodeStyle`은 CSS 축약형인 `border: '1px solid #cbd5e1'`을 쓰고, `nodeHoverStyle`은 개별 속성인 `borderColor: '#94a3b8'`을 써서 상태 변환 시 React가 혼란을 일으킴.
  - **조치**: 축약형 속성을 풀어서 `borderWidth: '1px', borderStyle: 'solid', borderColor: '#cbd5e1'`로 일관성 있게 선언하여 경고 완전 해결.

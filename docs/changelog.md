# Changelog

모든 주요 변경사항을 이 문서에 기록합니다.
형식: `[버전] YYYY-MM-DD — 변경 내용`

---

## [1.5.5] 2026-03-26 — card scale reduction + borderless logos + full light-mode text pass

### Changed
- 모델 카드가 100% 브라우저 배율에서 잘리지 않도록 VendorNode와 Stack Builder 선택 카드의 크기와 타이포를 약 15% 축소
  - 카드 패딩, 최소 높이, 로고 크기, 벤더명/가격 폰트를 함께 축소
- 회사 로고를 둘러싸던 배경/보더 래퍼를 제거하고 로고 이미지를 해당 영역만큼 확대
  - `LogoBadge`는 이제 무테두리 로고 렌더링을 기본으로 사용
- 라이트 모드 텍스트를 전체 재점검해 연한 보라색 텍스트가 남지 않도록 보정
  - `--a2`를 라이트 모드에서 검정 계열로 재정의
  - 보조 텍스트 `--dim`도 더 진한 톤으로 조정
  - 헤더, 카드, 툴팁, 스택 빌더 라벨 전반의 텍스트 대비 강화

## [1.5.4] 2026-03-26 — light mode text hardening

### Changed
- 라이트 모드에서 연하게 보이던 헤더 타이틀, 서브타이틀, 벤더 카드명, 스택 레이어 라벨을 검정 계열로 명시
  - 헤더 서브타이틀은 라이트 모드에서 그라디언트 텍스트 대신 단색 텍스트로 전환
  - Explore Map 및 Stack Builder 카드의 벤더명은 `var(--txt)`로 고정
  - Stack Builder의 레이어 라벨은 라이트 모드에서 레이어 컬러 대신 검정 텍스트로 표시

## [1.5.3] 2026-03-26 — light mode text contrast + annual total in cost panel

### Changed
- 라이트 모드에서 연한 보라색으로 보이던 강조 텍스트를 검정 계열로 전환
  - tooltip 라벨, 가격 라벨, Stack Analysis 등 `var(--a2)` 기반 텍스트 가독성 개선
- Stack Builder의 `예상 월 비용 구성` 패널 오른쪽에 `예상 연간 총비용` 카드 추가
  - 선택된 스택의 연간 추정 총비용을 큰 숫자로 즉시 확인 가능
  - 기존 무료 컴포넌트 집계는 보조 정보로 유지

## [1.5.2] 2026-03-26 — hover-first vendor cards + light mode toggle polish

### Changed
- Explore Map 벤더 카드 클릭 동작을 `선택 전용`으로 변경
  - 클릭 시 비교 선택만 토글되고 상세 모달은 더 이상 열리지 않음
  - 벤더 정보 확인은 기존 hover 툴팁으로 일원화
- `LogoBadge` 내부 로고 테두리를 제거하고 CI 이미지를 더 크게 확장
  - 기존 안쪽 보더 영역까지 로고가 차지하도록 조정
- 다크/라이트 모드 토글 버튼을 헤더 우측 상단에서 언어 버튼 왼쪽으로 이동
  - 아이콘 전용 버튼 대신 `Light Mode / Dark Mode` 텍스트가 보이는 pill 형태로 개선

## [1.5.1] 2026-03-26 — 5-column vendor grid + official CI logos + annual stack total

### Added
- `LogoBadge`를 공식 홈페이지 기반 CI 이미지 로고 렌더링으로 업그레이드
  - 26개 벤더 모두 공식 도메인 기준 로고 이미지를 사용
  - 로고 로드 실패 시 기존 텍스트 뱃지로 자동 폴백
- Stack Builder 결과 헤더에 `예상 연간 총비용` 표시 추가
  - 선택된 벤더들의 시작 기준 연간 추정치를 합산해 `A/B/C` 점수 옆에 노출

### Changed
- Explore Map 및 Stack Builder 벤더 카드 그리드를 데스크톱 기준 5열로 고정
  - 5개를 넘는 카드는 다음 줄로 자연스럽게 래핑
  - 화면 폭이 좁아지면 4/3/2/1열로 단계적으로 축소
- 라이트 모드 선택자를 보정해 배경 그라디언트와 도트 패턴 오버라이드가 정상 적용되도록 수정
- 새 로고 배지가 다크/라이트 테마 모두에서 읽히도록 로고 쉘 배경과 보더 토큰 추가

## [1.5.0] 2026-03-26 — Decision Flow + hover tooltip + UI design refresh

### Added
- F-08: `Decision Flow` 탭 추가
  - 3단계 wizard UX: Budget → Data sovereignty → Primary use case
  - 결과 화면에서 레이어별 추천 벤더 1개씩 표시 + 기존 `insight` 기반 선정 이유 노출
  - `Build This Stack` 버튼으로 Stack Builder 탭 이동 + 추천 조합 자동 프리필
- F-11: VendorNode 호버 툴팁 추가
  - 400ms delay 후 insight 1줄 + 핵심 강점 2개 + 가격 표시
  - 화면 경계에 따라 우측 또는 상단/하단으로 자동 위치 조정
  - 영문/한국어, 다크/라이트 테마 모두 지원

### Changed
- Stack Builder 선택 상태를 App 레벨로 이동
  - Decision Flow와 Stack Builder 간 추천 스택 handoff 가능
  - 추천 스택에서 Stack Builder 진입 시 결과 화면이 바로 열리도록 개선
- Decision Flow 전용 한국어/영문 UI 문자열 추가
- 디자인 시스템 전면 리프레시
  - 다크/라이트 CSS 변수 토큰을 신규 대시보드 톤으로 교체
  - 헤더 하단 1px 보더, 새 타이포 계층, 카드/탭/필 버튼 스타일 재정렬
  - VendorNode 카드에 표면형 배경, 호버 보더, 레이어 컬러 좌측 accent 추가
  - 레이어 섹션 간격과 카드 밀도를 조정해 대시보드형 레이아웃으로 정리
- 전체 페이지 가독성 확대
  - 주요 텍스트와 카드 내부 타이포를 약 1.5배 확대
  - Stack Builder의 `Estimated Monthly Cost Breakdown` 아이템을 카드형 그리드로 재배치해 간격 확보

### Planned
- F-09: 한국 시장 레이어 (Naver HyperCLOVA, KT AI, Samsung SDS 태그)
- F-10: 모바일 반응형 레이아웃
- F-12: 레이어 간 연결선 애니메이션 (선택된 벤더의 layer-to-layer flow 시각화)
- UI: 다크/라이트 모드 전환 애니메이션 개선
- UI: 비교 뷰 PDF 내보내기

---

## [3.0.0] 2026-03-26 — 브랜드 로고 + 가격 + 레이아웃 대개편

### Added
- `LogoBadge` 컴포넌트: 26개 벤더 브랜드 컬러 이니셜 뱃지 (이모지 대체)
  - GPT-4o(초록), Claude(주황/Anthropic), Gemini(파랑), Azure(MS파랑), SAP(하늘), Glean(주황) 등
- 가격 데이터: 모든 벤더에 `priceFree`, `priceLabel` 필드 추가
  - 카드 우측에 "Free" (초록) + 유료 가격 표시
- `CompareBar` 컴포넌트: 상단 inline 비교 바 (max 6선택, 개별 X 제거, Compare 버튼)
- Stack Builder 총비용 패널: 선택 시 Free 컴포넌트 수 + 가격 구성 실시간 표시
- 벤더 4개 추가 (총 26개): DeepSeek R1, NVIDIA NIM, M365 Copilot, Chroma
- 한국어 Mock 데이터: 신규 4개 벤더 포함

### Changed
- Compare 바: 하단 `position:fixed` → 레이어 상단 inline div
- Compare 최대 선택: 4개 → **6개**
- Clear All 버튼: 유즈케이스 필 맨 오른쪽 → **맨 왼쪽**
- Stack Builder 결과 레이아웃:
  - 상단 50/50: 스택 리스트(좌) + 육각형 Radar(우)
  - 하단 전체폭: Stack Analysis 그리드
- 레이더 차트: `gridType="polygon"` 육각형으로 복원
- 서브타이틀: 그라디언트 텍스트 + 보라 배경 박스로 강조
- 레이어 간 간격 축소 (빈공간 감소)
- 벤더 카드 내 폰트 크기 향상 (name 15px, org 12px)

### Fixed
- ESC 키로 상세 모달 닫기 (useEffect keydown listener)
- 상세 모달 위치: 우하단 슬라이드 → 화면 정중앙 모달 (backdrop blur)

### Decisions
- 로고: SVG 실제 브랜드 로고 대신 브랜드 컬러 이니셜 뱃지 선택 (속도 우선 MVP)
- 코덱스 인계: 이 버전부터 OpenAI Codex로 기능 개발 이관

---

## [2.0.0] 2026-03-26 — 시인성·라이트모드·한국어·전체화면

### Added
- 라이트 모드: CSS 변수 전체 분리, ☀️/🌙 토글 (우측 상단)
- 한국어 지원: 🇰🇷/🇺🇸 언어 토글, `KO_VENDORS` 22개 번역 (강점/한계/인사이트)
- `LangCtx` React Context: 언어 상태 컴포넌트 트리 전파
- 한국어 레이어명, 유즈케이스명, 메트릭명, UI 문자열

### Changed
- 레이아웃: `maxWidth` 제거 → 전체폭 (`padding: 0 40px`)
- 벤더 노드 그리드: `minmax(210px, 1fr)` 자동 멀티컬럼
- 상세 패널: 우측 슬라이드 → **화면 정중앙 모달** (780px, 2컬럼 강점/한계)
- 폰트 전반 향상

### Decisions
- 다크모드 기본값 유지, 라이트모드는 토글 옵션
- 한국어 Mock 데이터 퀄리티 > 코드 최적화 우선 (영업 현장 신뢰도)

---

## [1.0.0] 2026-03-26 — MVP 완성 (Vercel 배포)

### Added
- `src/App.jsx` — 전체 React 앱 (단일 파일, ~400 LOC)
  - 4-Layer 에코시스템 맵 (Foundation → Platform → Vertical → Tooling)
  - 유즈케이스 6종 필터 (pill 버튼, glow/fade/shrink 애니메이션)
  - 벤더 상세 패널 (우측 slide-in, Sales Director's Take, Radar Chart)
  - 벤더 비교 뷰 (최대 4선택, 멀티 Radar + Metric 테이블)
  - Stack Builder 탭 (레이어별 선택 + Preset 3종 + Grade A+~C)
  - 하단 Compare 플로팅 바 (fixed position)
  - FlowArrow 애니메이션 (레이어 간 맥동 화살표)
- `src/main.jsx` — React 진입점
- `index.html` — Vite HTML 템플릿
- `package.json` — React 18 + Recharts + Lucide + Vite
- `vite.config.js` — PORT 환경변수 지원
- `.claude/launch.json` — Claude Code Preview 패널 연동
- 22개 글로벌 벤더 Mock 데이터 (레이어별 4-6개)
- `docs/` 폴더: overview.md, requirements.md, changelog.md

### Decisions
- Decision Flow → v1.5로 연기 (영업 미팅 데모 우선)
- 포트폴리오 연결 없음, vercel.app 도메인으로 충분
- 모바일 반응형 → v2
- Bolt.new/Notion 대신 React+Vite 선택 (커스텀 인터랙션 필수)

---

## [0.1.0] 2026-03-26 — 프로젝트 초기화

### Added
- 프로젝트 디렉토리 구조 설정
- `docs/overview.md`, `docs/requirements.md`, `docs/changelog.md`
- `assets/reference/ai-ecosystem-navigator.jsx` — 참조용 레퍼런스 컴포넌트

### Decisions
- 기술 스택: React JSX + Recharts + Lucide + CSS Animations + Vercel
- 데이터: Mock hardcoded (API 연동 없음, MVP)
- 디자인: Anthropic 퍼플 (#8B5CF6) 다크 테마 기준
- 범위: 글로벌 벤더, 한국 시장 레이어 v1 제외

---

## 변경 기록 가이드

```
## [x.y.z] YYYY-MM-DD — 한 줄 요약

### Added       — 새로운 기능
### Changed     — 기존 기능 변경
### Fixed       — 버그 수정
### Removed     — 제거된 기능
### Decisions   — 주요 기술/설계 의사결정
```

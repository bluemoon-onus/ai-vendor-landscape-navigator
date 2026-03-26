# AI Vendor Ecosystem Navigator — Codex Handoff

> **작성일:** 2026-03-26
> **현재 버전:** v3.0.0 (배포 완료)
> **이관 대상:** OpenAI Codex
> **이관 목적:** 기능 추가 및 UI 개선 계속 진행

---

## 1. 프로젝트 한 줄 요약

Sales Director가 AI 생태계 전체를 레이어별로 구조화해 설명하고, 벤더를 객관적으로 비교하는 능력을 보여주는 **인터랙티브 데모 도구**. MVP, Mock 데이터, 데스크톱 최적화.

---

## 2. 라이브 URL & 레포지토리

| 항목 | URL |
|------|-----|
| **Vercel (Production)** | https://ai-vendor-navigator.vercel.app |
| **GitHub** | https://github.com/bluemoon-onus/ai-vendor-landscape-navigator |
| **Branch** | `main` (직접 배포) |

---

## 3. 기술 스택

| 항목 | 선택 | 버전 |
|------|------|------|
| UI Framework | React | 18.3.x |
| Build Tool | Vite | 5.4.x |
| Charts | Recharts (RadarChart) | 2.12.x |
| Icons | Lucide React | 0.441.x |
| 스타일링 | CSS-in-JS (inline `<style>` + CSS variables) | — |
| 애니메이션 | CSS Keyframes (no external lib) | — |
| 배포 | Vercel (자동 main 브랜치 연동) | — |
| 데이터 | Mock hardcoded (API 없음) | — |

**중요:** 모든 앱 코드는 **`src/App.jsx` 단일 파일**에 있음. `src/main.jsx`는 React 진입점만.

---

## 4. 로컬 개발 환경 설정

```bash
git clone https://github.com/bluemoon-onus/ai-vendor-landscape-navigator.git
cd ai-vendor-landscape-navigator
npm install
npm run dev          # http://localhost:3000

# 배포
vercel --prod
```

---

## 5. 파일 구조

```
ai-vendor-landscape-navigator/
├── src/
│   ├── App.jsx          ← 전체 앱 코드 (814 LOC, 여기만 편집)
│   └── main.jsx         ← React 진입점 (건드리지 말 것)
├── docs/
│   ├── CODEX_HANDOFF.md ← 이 파일
│   ├── changelog.md     ← 버전별 변경 이력 (업데이트 필수)
│   ├── overview.md      ← 프로젝트 개요
│   └── requirements.md  ← 기능 요구사항 PRD
├── assets/
│   └── reference/
│       └── ai-ecosystem-navigator.jsx  ← 초기 레퍼런스 (참고용)
├── index.html
├── package.json
├── vite.config.js
└── .claude/launch.json  ← Claude Code Preview 서버 설정
```

---

## 6. App.jsx 내부 구조 (컴포넌트 맵)

```
App.jsx
│
├── [DATA SECTION]
│   ├── LOGOS{}           — 26개 벤더 브랜드 컬러 + 이니셜 정의
│   ├── LAYERS[]          — 4개 레이어 (id, label, labelKo, color, gradient...)
│   ├── USE_CASES[]       — 6개 유즈케이스 (id, label, labelKo, emoji)
│   ├── ML / MLK          — 메트릭 라벨 (영문/한국어)
│   ├── RC[]              — 레이더 차트 색상 팔레트 (최대 6개)
│   ├── V[]               — 26개 벤더 데이터 배열 (메인 데이터)
│   ├── KO{}              — 한국어 번역 (벤더별 strengths/limitations/insight)
│   └── STACK_PRESETS[]   — 스택 프리셋 3종
│
├── [HELPERS]
│   └── vf(vendor, field, lang)  — 언어에 따라 KO[] 또는 영문 반환
│
├── [CSS]                 — 전체 CSS (CSS variables 다크/라이트, 애니메이션)
│
├── [COMPONENTS]
│   ├── LogoBadge         — 브랜드 컬러 이니셜 뱃지
│   ├── VendorNode        — 레이어 맵의 개별 벤더 카드
│   ├── FlowArrow         — 레이어 간 맥동 화살표
│   ├── LayerSection      — 레이어 1개 (헤더 + 벤더 그리드)
│   ├── DetailModal       — 벤더 클릭 시 중앙 모달 (ESC 닫기)
│   ├── CompareBar        — 선택된 벤더 inline 비교 바 (상단)
│   ├── ComparisonView    — 비교 뷰 (Radar + 메트릭 테이블)
│   └── StackBuilder      — 스택 빌더 탭 (레이어별 선택 + 결과)
│
└── [App]                 — 메인 상태 관리 + 라우팅 (tab/view)
    ├── State: theme, lang, tab, uc, selIds, detail, view
    └── Render: Header → Pills → CompareBar → LayerMap or Comparison
```

---

## 7. 핵심 데이터 모델

### 벤더 객체 (V 배열)

```js
{
  id: "gpt4o",                    // 고유 ID (KO 번역 키와 일치)
  name: "GPT-4o",                 // 표시 이름
  org: "OpenAI",                  // 조직명
  layer: "foundation",            // "foundation" | "platform" | "vertical" | "tooling"
  priceFree: false,               // 무료 티어 존재 여부
  priceLabel: "$5/1M tok",        // 카드에 표시할 가격 문자열
  useCases: ["customer-service", "doc-intel", ...],  // 연관 유즈케이스 ID
  pricing: "Pay-per-token",       // 상세 모달용 가격 모델
  bestFit: "Enterprise & Startup",// 최적 고객군
  strengths: ["...", "...", "..."],
  limitations: ["...", "...", "..."],
  insight: "...",                  // Sales Director's Take (1-2문장)
  metrics: {
    performance: 9,    // 1-10
    integration: 8,
    cost: 5,           // 높을수록 비용 효율적
    enterprise: 8,
    scalability: 9,
    community: 10
  }
}
```

### 레이어 객체 (LAYERS 배열)

```js
{
  id: "foundation",
  label: "Foundation Models",
  labelKo: "파운데이션 모델",
  icon: "Sparkles",           // IconMap 키 (Sparkles|Zap|Building2|Wrench)
  color: "#8B5CF6",           // 레이어 accent 색상
  gradient: "linear-gradient(135deg,#7C3AED,#6D28D9)",
  desc: "Core LLMs powering the AI ecosystem",
  descKo: "AI 생태계를 구동하는 핵심 LLM",
  step: "1"                   // Stack Builder 단계 번호
}
```

### LOGOS 객체

```js
"vendor-id": {
  abbr: "GPT-4o",    // 뱃지에 표시할 텍스트
  bg: "#10A37F",     // 배경색 (브랜드 컬러)
  color: "#fff",     // 텍스트 색상
  border: "#0D8A6A"  // 테두리/그라디언트 보조색
}
```

---

## 8. CSS 시스템 (CSS Variables)

```css
/* 다크 (기본) */
:root {
  --bg, --bg2          /* 배경 2단계 */
  --card, --cardh      /* 카드 배경 (호버) */
  --a, --a2, --a3      /* 보라 액센트 3단계 */
  --adim, --aglow      /* 투명 액센트 + glow 효과 */
  --txt, --dim         /* 텍스트 (기본/흐림) */
  --bdr                /* 테두리 */
  --g1, --g2           /* 그라디언트 퍼플 */
  --shadow, --overlay  /* 그림자 + 모달 오버레이 */
}

/* 라이트 */
[data-theme="light"] { ...동일 변수 재정의... }
```

**클래스 규칙:**
- `.vn` — VendorNode 기본 / `.vn.dim` / `.vn.glow` / `.vn.sel`
- `.sn` — StackNode 기본 / `.sn.pick`
- `.pill` / `.pill.on` — 필터 버튼
- `.tab` / `.tab.on` — 탭 버튼
- `.cbtn` — 보라 CTA 버튼
- `.ghost` — 아웃라인 서브 버튼
- `.au` — fade-up 진입 애니메이션
- `.asi` — scale-in 진입 애니메이션
- `.pls` — pulse 반복 애니메이션 (FlowArrow)

---

## 9. 상태 관리 (App 컴포넌트)

```js
const [theme,  setTheme]  = useState("dark");    // "dark" | "light"
const [lang,   setLang]   = useState("en");       // "en" | "ko"
const [tab,    setTab]    = useState("explore");  // "explore" | "stack"
const [uc,     setUc]     = useState(null);       // 선택된 유즈케이스 ID | null
const [selIds, setSelIds] = useState([]);         // 비교 선택 벤더 ID 배열 (max 6)
const [detail, setDetail] = useState(null);       // 상세 모달 벤더 객체 | null
const [view,   setView]   = useState("map");      // "map" | "compare"
```

**언어 전파:** `LangCtx` (React.createContext) → `LangCtx.Provider value={lang}` → `useLang()` 훅으로 하위 컴포넌트에서 사용.

---

## 10. 현재 기능 상태 (v3.0.0 기준)

| 기능 | 상태 | 설명 |
|------|------|------|
| 4-Layer 에코시스템 맵 | ✅ 완료 | Foundation→Platform→Vertical→Tooling |
| 유즈케이스 필터 6종 | ✅ 완료 | glow/dim 애니메이션, 다중 선택 X |
| 벤더 상세 모달 | ✅ 완료 | 중앙 모달, ESC 닫기, Radar 육각형 |
| 벤더 비교 (max 6) | ✅ 완료 | 상단 CompareBar + 비교뷰 |
| Stack Builder | ✅ 완료 | 레이어별 선택 + Preset + Grade + 비용 |
| 다크/라이트 모드 | ✅ 완료 | CSS variables 완전 분리 |
| 한국어 지원 | ✅ 완료 | 26개 벤더 한국어 데이터 |
| 브랜드 로고 뱃지 | ✅ 완료 | 26개 브랜드 컬러 이니셜 |
| 가격 표시 | ✅ 완료 | Free/유료 카드 우측 표시 |
| Decision Flow | ⏳ v1.5 | 3단계 의사결정 트리 |
| 한국 시장 레이어 | ⏳ v1.5 | Naver/KT/Samsung SDS |
| 모바일 반응형 | ⏳ v2 | 현재 데스크톱 전용 |
| 호버 툴팁 | ⏳ v1.5 | 클릭 없이 미리보기 |
| 레이어 연결선 | ⏳ v1.5 | flow 시각화 |

---

## 11. v1.5 우선순위 작업 (Codex 구현 대상)

### 🔴 Priority 1 — Decision Flow

**목적:** 고객이 질문에 답하면 최적 AI 스택을 추천해주는 가이드 플로우.

**UX 흐름:**
```
Q1. 예산 규모?       → Limited (<$50K/yr) | Moderate | Enterprise
Q2. 데이터 주권?     → Public Cloud OK | Private/On-prem Required
Q3. 주요 유즈케이스? → 기존 USE_CASES 6종 중 선택
→ [결과] 추천 스택 카드 + 이유 설명
```

**구현 힌트:**
- 새 탭 `"decision"` 또는 Stack Builder 내 "Decision Mode" 토글로 추가
- `LAYERS`/`V` 기존 데이터 재활용, 필터링 로직만 추가
- 결과는 Stack Builder 결과 카드 컴포넌트 재사용

### 🟡 Priority 2 — 호버 툴팁

**목적:** 클릭 없이 빠른 정보 확인 (트레이드쇼/미팅 현장 데모 속도 향상).

**스펙:**
- VendorNode 호버 시 작은 팝오버 표시 (200-250px 너비)
- 표시 내용: insight 1줄 + 주요 강점 2개 + 가격
- 위치: 카드 위 또는 우측 (화면 경계 감지)
- 딜레이: 400ms (즉각 반응 방지)

### 🟢 Priority 3 — 레이어 연결선 (선택 시)

**목적:** 특정 벤더 선택 시 레이어 간 관계를 시각적으로 표현.

**스펙:**
- 벤더 선택 시 해당 벤더와 연관된 상위/하위 레이어 벤더 강조
- SVG 선 또는 CSS border 기반 연결선 (점선, 보라색)

---

## 12. 개발 컨벤션 & 주의사항

### 스타일 규칙
- **CSS-in-JS만 사용**: `<style>` 태그 내 CSS + React inline style. Tailwind, CSS 모듈 없음.
- **CSS 변수 필수**: 색상 하드코딩 금지. 반드시 `var(--a)`, `var(--txt)` 등 사용.
- **다크/라이트 모두 테스트**: `[data-theme="light"]` 오버라이드 확인.
- **한국어 지원 유지**: 새 UI 문자열 추가 시 `L` 객체 또는 `lang==="ko"` 분기 추가.

### 데이터 규칙
- **벤더 추가 시**: `V[]` 배열 + `LOGOS{}` + `KO{}` 동시 추가 필수.
- **레이어 균형**: 각 레이어 5-7개 유지 권장.
- **metrics 범위**: 1-10 정수. cost는 높을수록 비용 효율적 (10=무료).

### 컴포넌트 규칙
- **lang 전달**: `useLang()` 훅 사용 또는 prop으로 전달.
- **애니메이션**: 새 컴포넌트 진입 시 `.au` (fade-up) 또는 `.asi` (scale-in) 클래스 사용.
- **모달/오버레이**: `zIndex: 45` (backdrop), `zIndex: 50` (모달) 유지.

### 파일 규칙
- **단일 파일 유지**: `src/App.jsx` 하나로 유지. 컴포넌트 분리 지양 (MVP 속도 우선).
- **changelog 업데이트**: 기능 추가/변경 시 `docs/changelog.md` 반드시 업데이트.

---

## 13. 디자인 토큰 레퍼런스

```
보라 기본:    #8B5CF6  (--a)
보라 밝음:    #A78BFA  (--a2)
보라 더 밝음: #C4B5FD  (--a3)
보라 진함:    #7C3AED  (--g1)
남색:         #6366F1  (--g2)

성공/무료:    #34D399 (초록)
경고:         #FBBF24 (노랑)
강점:         #34D399
한계:         #FBBF24
인사이트bg:   rgba(139,92,246,0.1)

다크 배경:    #09081A (--bg), #0E0D20 (--bg2)
라이트 배경:  #F0EEFF (--bg), #E6E1FB (--bg2)

레이더 색상 (비교, max 6):
  #8B5CF6, #F59E0B, #10B981, #F43F5E, #60A5FA, #FB923C
```

---

## 14. Git 히스토리 요약

```
c1d0af8  feat: UX v3 — brand logos, pricing, top compare bar, stack layout
86983f7  feat: UX v2 — readability, full-width, centered modal, dark/light, Korean
53bb1e7  feat: AI Vendor Ecosystem Navigator MVP v1.0
```

**버전별 핵심 변화:**

| 커밋 | 버전 | 핵심 변화 |
|------|------|-----------|
| `53bb1e7` | v1.0 | MVP: 4레이어 맵, 유즈케이스 필터, 비교, Stack Builder |
| `86983f7` | v2.0 | 전체화면, 다크/라이트, 한국어, 중앙 모달 |
| `c1d0af8` | v3.0 | 브랜드 로고, 가격, 상단 비교바, Stack 레이아웃, 26벤더 |

---

## 15. 참고 문서

| 문서 | 경로 | 내용 |
|------|------|------|
| 프로젝트 개요 | `docs/overview.md` | 목적, 에코시스템 구조, 기술 스택 |
| 요구사항 PRD | `docs/requirements.md` | 기능 목록, 우선순위, 비기능 요구사항 |
| 변경 이력 | `docs/changelog.md` | 버전별 상세 변경사항 |
| 레퍼런스 컴포넌트 | `assets/reference/ai-ecosystem-navigator.jsx` | 초기 설계 참고용 |

---

## 16. Codex에게 전달하는 컨텍스트

이 프로젝트는 **한국의 Sales Director(Scott)가 바이브 코딩으로 2일 만에 만든 AI 에코시스템 데모 도구**입니다.

- **용도:** 영업 미팅 현장에서 고객에게 직접 보여주거나, 포트폴리오로 활용
- **핵심 가치:** "나는 AI 생태계 전체를 레이어별로 구조화해서 설명할 수 있다"는 신뢰 구축
- **Mock 데이터 퀄리티가 코드보다 중요**: 벤더 선정, 카테고리 분류, 인사이트 코멘트의 정확성이 도구의 신뢰도를 결정
- **데스크톱 데모 최적화**: 모바일보다 데스크톱 미팅 환경 우선
- **빠른 이터레이션 선호**: 완벽한 코드보다 빠른 기능 추가 우선

> 새 기능 추가 시 `docs/changelog.md`에 기록하고, 배포는 `vercel --prod`로 진행하세요.

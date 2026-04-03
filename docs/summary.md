# AI Vendor Landscape Navigator — Project Summary

## 프로젝트 개요 및 의의

**AI Vendor Landscape Navigator**는 Sales Director가 비개발자 관점에서 AI 기술 생태계를 레이어별로 구조화하고, 고객 앞에서 벤더-중립적 컨설팅 능력을 시연하기 위해 직접 제작한 인터랙티브 데모 도구다.

### 핵심 메시지

1. AI 생태계 전체를 4개 레이어로 분해해 설명할 수 있다
2. 경쟁사 포함 26개 글로벌 벤더를 6개 메트릭 기준으로 객관 비교할 수 있다
3. 이 도구를 직접 설계·배포할 정도의 AI 도구 활용 능력을 보유하고 있다

### 주요 활용 시나리오

- 포트폴리오 방문자 (잠재 고용주, 파트너) 대상 셀프 데모
- 영업 미팅 현장에서 고객에게 직접 보여주는 라이브 데모

---

## 기술 스택

| 항목 | 선택 | 비고 |
|------|------|------|
| UI Framework | React 18 (JSX) | 단일 파일 기반, Claude 생성 최적화 |
| Charts | Recharts 2 (RadarChart) | 경량, React 친화적 |
| Icons | Lucide React | 일관된 디자인 시스템 |
| 애니메이션 | CSS Transitions + Keyframes | 외부 의존성 없이 구현 |
| 빌드 도구 | Vite 5 | 빠른 HMR, 경량 번들 |
| 배포 | Vercel | 즉시 배포, 커스텀 도메인 지원 |
| 분석 | Vercel Analytics (`@vercel/analytics`) | 페이지뷰 트래킹 |
| 데이터 | Mock (hardcoded) | API 불필요한 MVP |

---

## AI 기능 및 활용 컨셉

### 에코시스템 4-Layer 구조

```
Layer 1 — Foundation Models (파운데이션 모델)
         GPT-4o, Claude 3.5, Gemini, Llama, Mistral, Cohere, DeepSeek R1
                          ↓
Layer 2 — AI Platforms (AI 플랫폼)
         Azure OpenAI, AWS Bedrock, Vertex AI, Hugging Face, Databricks, NVIDIA NIM
                          ↓
Layer 3 — Enterprise AI Apps (엔터프라이즈 AI 앱, Vertical)
         Salesforce Einstein, ServiceNow Now Assist, SAP Joule, GitHub Copilot, Glean, M365 Copilot
                          ↓
Layer 4 — Tooling & Infrastructure (툴링 & 인프라)
         LangChain, Pinecone, W&B, LlamaIndex, Weaviate, MLflow, Chroma
```

### 핵심 UI 기능

| 기능 | 설명 |
|------|------|
| **Explore Map** | 4-Layer 벤더 생태계 지도. 유즈케이스 필터(6종), 벤더 호버 툴팁, 비교 선택 |
| **Ecosystem Assessment** | 전체 벤더 메트릭 평균 분석. 성능 리더/비용 효율/엔터프라이즈 적합도 인사이트 |
| **Decision Flow** | 3단계 Wizard (Budget → Data Sovereignty → Use Case) → 레이어별 추천 벤더 |
| **Stack Builder** | 레이어별 벤더 선택 + Preset 3종 + Grade A+~C 평가 + 월/연간 비용 산출 |
| **Compare View** | 최대 6개 벤더 다중 선택 → Radar 차트 오버레이 + 메트릭 비교 테이블 |
| **Top 3 Strengths** | 선택 스택의 생태계 평균 대비 강점 3개 자동 도출 |

### 벤더 평가 메트릭 (6개)

`Performance` · `Integration` · `Cost Efficiency` · `Enterprise Ready` · `Scalability` · `Community`

### 다국어 / 다크라이트 테마

- 영문/한국어 실시간 토글 (`LangCtx` React Context)
- 다크/라이트 모드 CSS 변수 토큰 분리, 기본값 라이트 모드

---

## 하이레벨 디렉토리 구조

```
AI Vendor Landscape Navigator/
├── src/
│   ├── App.jsx          # 전체 React 앱 (단일 파일, ~2,000+ LOC)
│   │                    # LOGOS, LAYERS, VENDORS, 컴포넌트 모두 포함
│   └── main.jsx         # React 진입점 + Vercel Analytics
├── docs/
│   ├── summary.md       # 프로젝트 종합 요약 (이 파일)
│   ├── overview.md      # 프로젝트 목적 및 기술 선택 배경
│   ├── requirements.md  # 기능 요구사항 명세
│   ├── changelog.md     # 버전별 변경 이력
│   └── CODEX_HANDOFF.md # Codex 인계 문서
├── assets/
│   └── reference/
│       └── ai-ecosystem-navigator.jsx  # 초기 참조용 레퍼런스 컴포넌트
├── index.html           # Vite HTML 템플릿
├── vite.config.js       # Vite 설정 (PORT 환경변수 지원)
├── package.json         # 의존성 정의
└── .vercel/             # Vercel 배포 설정
```

---

## 주요 변경 이력

| 버전 | 날짜 | 주요 내용 |
|------|------|-----------|
| **v0.1.0** | 2026-03-26 | 프로젝트 초기화. 디렉토리 구조, docs 폴더, 참조 컴포넌트 |
| **v1.0.0** | 2026-03-26 | MVP 완성 및 Vercel 배포. 4-Layer 맵, 유즈케이스 필터, 상세 패널, 비교 뷰, Stack Builder |
| **v2.0.0** | 2026-03-26 | 라이트 모드 + 한국어 지원. `LangCtx` React Context, 22개 벤더 번역, 전체화면 레이아웃 |
| **v3.0.0** | 2026-03-26 | 브랜드 로고 뱃지, 가격 데이터, CompareBar 인라인화, 벤더 26개로 확장, Stack Builder 레이아웃 개편 |
| **v1.5.0** | 2026-03-26 | Decision Flow 탭 추가 (3단계 Wizard), VendorNode 호버 툴팁, App 레벨 상태 공유, 디자인 시스템 리프레시 |
| **v1.5.1** | 2026-03-26 | 공식 CI 로고 이미지 적용 (Google Favicons API), 5열 그리드, 연간 총비용 표시 |
| **v1.5.2** | 2026-03-26 | 카드 클릭 → 비교 선택만, 호버 툴팁으로 상세 정보 일원화, 테마 토글 Pill 버튼 개선 |
| **v1.5.3~5** | 2026-03-26 | 라이트 모드 텍스트 대비 전면 강화, 카드 크기 최적화, 레거시 DetailModal 제거 |
| **v1.6.0** | 2026-03-26 | Ecosystem Assessment 섹션 추가. 전체 벤더 평균 메트릭 분석, 인사이트 카드 5개 |
| **Vercel Analytics** | 2026-03-31 | `@vercel/analytics` 패키지 추가, `<Analytics />` React 컴포넌트로 페이지뷰 트래킹 |
| **Radar + Top 3** | 2026-04-03 | 레이더 차트 크기 확대, 생태계 평균 대비 Top 3 강점 자동 도출 표시 |

---

*Last updated: 2026-04-03*

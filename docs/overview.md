# AI Vendor Landscape Navigator — Project Overview

## 목적

Sales Director가 "개발자가 아닌 사람"임에도 AI 기술 생태계를 구조적으로 이해하고, 고객 앞에서 벤더-중립적 컨설팅이 가능하다는 것을 보여주기 위한 인터랙티브 데모 도구.

**핵심 메시지:**
1. "나는 AI 생태계 전체 구조를 레이어별로 분해해서 설명할 수 있다"
2. "경쟁사 포함 모든 벤더를 객관적으로 비교할 수 있다"
3. "이걸 직접 만들 정도로 AI 도구 활용 능력이 있다"

## 대상 사용자

- 포트폴리오 방문자 (잠재 고용주, 파트너)
- 영업 미팅 현장에서의 데모 (고객에게 직접 보여주는 용도)

## 에코시스템 레이어 구조

```
Layer 1 — Foundation Models
         GPT-4o, Claude 3.5, Gemini, Llama, Mistral, Cohere
                          ↓
Layer 2 — AI Platforms
         Azure OpenAI, AWS Bedrock, Vertex AI, Hugging Face, Databricks
                          ↓
Layer 3 — Enterprise AI Apps (Vertical)
         Salesforce Einstein, ServiceNow Now Assist, SAP Joule, GitHub Copilot, Glean
                          ↓
Layer 4 — Tooling & Infrastructure
         LangChain, Pinecone, W&B, LlamaIndex, Weaviate, MLflow
```

## 기술 스택

| 항목 | 선택 | 이유 |
|------|------|------|
| UI Framework | React (JSX) | 단일 파일로 Claude 생성 가능, 빠른 배포 |
| Charts | Recharts (RadarChart) | 경량, React 친화적 |
| Icons | Lucide React | 일관된 디자인 |
| 애니메이션 | CSS Transitions + Keyframes | 외부 의존성 없이 충분 |
| 배포 | Vercel | 즉시 배포, 커스텀 도메인 지원 |
| 데이터 | Mock (hardcoded) | MVP 단계, API 불필요 |

## Mock 데이터 범위

- 벤더: 24개 (Layer당 4-6개)
- 유즈케이스: 6개 (Customer Service, Document Intelligence, Code Assistant, Sales Intelligence, Content Generation, Data & Analytics)
- 벤더당 메트릭: Performance, Integration, Cost Efficiency, Enterprise Ready, Scalability, Community

## 배포 목표

- URL: Vercel 배포 (포트폴리오 사이트와 연결)
- 타임라인: 2일 내 데모 가능 상태
- 형태: 데스크톱 최적화 (모바일 반응형은 v2)

---

*Last updated: 2026-03-26*

# AI Vendor Landscape Navigator — 요구사항 (PRD)

## MVP 범위 (v1.0)

### 필수 기능 (Must Have)

#### F-01. 에코시스템 레이어 맵 (메인 뷰)
- 4개 레이어를 수직으로 배치한 인터랙티브 다이어그램
- 레이어 간 연결을 나타내는 flow arrow 애니메이션 (pulsing)
- 각 레이어에 벤더 노드 표시 (emoji + 이름 + 조직명)
- 벤더 노드 hover: scale-up + glow 효과
- 벤더 노드 클릭: 상세 패널 열림 (→ F-03)

#### F-02. 유즈케이스 필터
- 6개 유즈케이스 pill 버튼 (Customer Service, Doc Intelligence 등)
- 선택 시: 관련 벤더 glow 하이라이트, 비관련 벤더 fade-out (opacity 0.12 + scale-down)
- 재클릭 시 필터 해제

#### F-03. 벤더 상세 패널
- 우측 slide-in 애니메이션
- 내용: 이름, 조직, 레이어, 가격 모델, 강점 3개, 약점 3개, Best Fit 고객군
- Radar Chart (6개 메트릭 시각화)
- **"Sales Director's Take"** — 한 단락 인사이트 코멘트 (핵심 차별화 포인트)
- 상단에 비교 선택 체크박스

#### F-04. 벤더 비교 뷰
- 2~4개 벤더 선택 후 "Compare" 버튼 활성화
- 레이어 맵 → 비교 테이블로 뷰 전환 (slide animation)
- 오버레이 Radar Chart (선택된 벤더들 한 차트에)
- 메트릭별 점수 바 테이블 (나란히 비교)
- 뒤로가기: 맵 뷰로 복귀

#### F-05. Stack Builder 탭
- "Explore Map" / "Stack Builder" 탭 전환
- 각 레이어별 벤더 선택 (라디오 방식)
- Quick Preset 3종: "Enterprise Safe", "Cost Optimized", "Data-First"
- 결과 카드: Stack Profile Radar + 종합 Grade(A+~C) + 레이어별 인사이트

---

### 선택 기능 (Nice to Have, v1.5)

#### F-06. Decision Flow (권장 추가)
- 3단계 예/아니오 의사결정 트리
  - Q1: "데이터가 클라우드에 나가면 안 되나요?" (On-premise / Sovereignty)
  - Q2: "기존 스택이 Microsoft 중심인가요?"
  - Q3: "예산이 초기 스타트업 수준인가요?"
- 결과: 추천 Foundation Model + Platform + 이유 출력
- 영업 현장에서 고객과 함께 탐색하는 시나리오에 최적

#### F-07. 한국 시장 레이어 (선택적 추가)
- 한국 고유 벤더 태그: Naver HyperCLOVA X, KT AI, Samsung SDS
- "Korea Market Fit" 점수 추가
- 한국 시장 타겟 포지션에서 차별화

---

### 제외 범위 (Out of Scope, MVP)

- 실시간 API 연동 (가격, 벤치마크 데이터)
- 로그인 / 저장 기능
- 모바일 반응형 (데스크톱 데모 전용)
- 벤더 데이터 편집 UI
- 다국어 지원

---

## 시각적 인터랙션 상세

| 트리거 | 효과 |
|--------|------|
| 벤더 노드 hover | translateY(-2px) + scale(1.02) + purple glow |
| 유즈케이스 pill 선택 | 관련 벤더 glow, 비관련 opacity 0.12 + grayscale |
| 벤더 클릭 (상세) | 우측 패널 slide-in (translateX 100%→0) |
| 비교 버튼 클릭 | 레이어 맵 fade-out → 비교 테이블 fade-in |
| Radar Chart | draw-in 애니메이션 (stagger per axis) |
| Stack Builder 선택 | dashed → solid border + glow |

---

## 디자인 시스템

```
배경: #09081A (딥 다크 퍼플)
Primary: #8B5CF6 (Anthropic 퍼플)
Secondary: #6366F1 (인디고)
Text: #ECE8F7
Dim: #7C7498
Border: rgba(139,92,246,0.18)
Font: Outfit (Google Fonts)
Border Radius: 8-16px
```

---

## 데이터 구조

```typescript
type Vendor = {
  id: string
  name: string
  org: string
  emoji: string
  layer: "foundation" | "platform" | "vertical" | "tooling"
  useCases: string[]
  pricing: string
  bestFit: string
  strengths: string[]        // 3개
  limitations: string[]      // 3개
  insight: string            // Sales Director's Take
  metrics: {
    performance: number      // 1-10
    integration: number
    cost: number
    enterprise: number
    scalability: number
    community: number
  }
}
```

---

## 성공 기준

- [ ] 유즈케이스 필터링이 0.3초 내 반응
- [ ] 24개 벤더 전체 표시 및 클릭 가능
- [ ] 비교 뷰에서 2개 이상 벤더 동시 Radar 표시
- [ ] Stack Builder에서 4개 레이어 모두 선택 후 Grade 출력
- [ ] Vercel 배포 URL 접근 가능
- [ ] 첫 방문자가 설명 없이 3분 내 주요 기능 탐색 가능

---

*Last updated: 2026-03-26*

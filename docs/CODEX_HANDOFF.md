# AI Vendor Ecosystem Navigator — Claude Code Handoff

> 작성일: 2026-03-26  
> 현재 버전: v1.6.0
> 이관 대상: Claude Code  
> 목적: 최종 polish, visual QA, 마무리 이터레이션

---

## 1. 프로젝트 한 줄 요약

Sales Director가 고객 미팅에서 AI 벤더 생태계를 레이어별로 설명하고, 벤더 비교와 추천 스택 제안을 시연하기 위한 인터랙티브 데모 앱.

핵심 포인트:
- 데스크톱 데모 우선
- Mock 데이터 품질이 코드 구조보다 중요
- 모든 앱 코드는 `src/App.jsx` 단일 파일에 유지

---

## 2. 라이브 / 레포지토리

| 항목 | 값 |
|------|-----|
| Production | https://ai-vendor-navigator.vercel.app |
| GitHub | https://github.com/bluemoon-onus/ai-vendor-landscape-navigator |
| Branch | `main` |

---

## 3. 기술 스택

| 항목 | 값 |
|------|-----|
| UI | React 18 |
| Build | Vite 5 |
| Charts | Recharts |
| Icons | lucide-react |
| Styling | inline styles + `<style>` CSS variables |
| Language | English / Korean |
| Theme | Dark / Light |

중요:
- 앱 로직은 `src/App.jsx` 1파일만 수정
- 현재 `src/App.jsx`는 약 1504 lines
- `src/main.jsx`는 건드릴 일 거의 없음

---

## 4. 작업 규칙

- `src/App.jsx`만 수정
- 새 파일 분리 금지
- 색상 하드코딩보다 CSS 변수 우선
- 영문/한국어 지원 유지
- 다크/라이트 모두 확인
- 변경 시 `docs/changelog.md` 업데이트

추가 메모:
- 로컬 `assets/` 폴더는 미추적 상태이며 배포/푸시에 포함하지 않음

---

## 5. 현재 앱 구조

`src/App.jsx` 내부 주요 블록:

1. `LOGOS`, `LAYERS`, `USE_CASES`, `V`, `KO`, `STACK_PRESETS`
2. helper 함수
   - `vf`
   - `getStackPriceText`
   - `getVendorAnnualEstimate`
   - `formatAnnualEstimate`
   - `buildDecisionRecommendation`
   - `ux`, `cx`
3. CSS string
4. 컴포넌트
   - `LogoBadge`
   - `VendorNode`
   - `FlowArrow`
   - `LayerSection`
   - ~~`DetailModal`~~ → **v1.5.6에서 완전 제거됨**
   - `CompareBar`
   - `ComparisonView`
   - `DecisionFlow`
   - `StackBuilder`
   - `EcosystemAssessment`
5. `App`

현재 App state:

```js
const [theme, setTheme] = useState("dark");
const [lang, setLang] = useState("en");
const [tab, setTab] = useState("explore");
const [uc, setUc] = useState(null);
const [selIds, setSelIds] = useState([]);
const [view, setView] = useState("map");
const [stackPicks, setStackPicks] = useState(makeEmptyStack);
const [stackAutoRevealKey, setStackAutoRevealKey] = useState(0);
```

현재 탭:
- `explore`
- `decision`
- `stack`

---

## 6. 현재 UX 상태

### Explore Map
- 4개 레이어 맵 표시
- 유즈케이스 pill 필터
- Compare bar는 레이어 위쪽 inline
- 벤더 카드는 한 줄 최대 5개 기준
- 카드 클릭은 상세 모달이 아니라 선택 토글만 수행
- 상세 정보는 400ms hover tooltip로 확인

### Decision Flow
- 3-step wizard
  - Budget
  - Data sovereignty
  - Primary use case
- 결과 화면에서 레이어별 추천 스택 표시
- `Build This Stack`으로 Stack Builder에 prefill

### Stack Builder
- 레이어별 벤더 1개씩 선택
- Quick preset 3종
- `Estimated Monthly Cost Breakdown`
- 우측에 `Estimated Annual Total`
- 결과 화면에서 grade + 연간 총비용 + radar + stack analysis

### Theme / Language
- 다크/라이트 토글은 헤더 우측, 언어 버튼 왼쪽
- 언어는 `en` / `ko`
- 라이트 모드는 최근 여러 차례 대비 보강됨

### Logos
- `LogoBadge`는 공식 홈페이지 도메인 기반 favicon/CI 이미지를 사용
- 이미지 로드 실패 시 텍스트 fallback
- 현재는 무테두리 로고 렌더링 방식

---

## 7. 최근 Codex 작업 히스토리

아래는 Codex가 이번 라운드에서 실제 반영하고 `main`에 푸시한 작업들이다.

| 커밋 | 내용 |
|------|------|
| `73c2d12` | Decision Flow 추가 + Vendor hover tooltip 추가 |
| `c65af70` | UI design system 리프레시 |
| `9a3d2ae` | 전체 가독성 확대 + 비용 구성 간격 확장 |
| `23ea895` | 공식 홈페이지 기반 CI 로고 + 연간 총비용 표시 |
| `b4ca0e1` | hover-first 카드 동작 + theme toggle 정리 |
| `1f52cb8` | light mode contrast + stack cost summary 개선 |
| `77312d5` | light mode 텍스트 대비 강화 |
| `fd1944d` | 카드/폰트 15% 축소 + 로고 프레임 제거 |

요약:
- Decision Flow 구현 완료
- hover tooltip 구현 완료
- Stack Builder와 Decision Flow 연결 완료
- UI design system 재정렬 완료
- 공식 도메인 기반 로고 시스템 반영
- 연간 총비용 계산/표시 반영
- 카드 클릭 시 상세 모달 제거, hover-first UX로 변경
- 라이트 모드 대비 보강 반복 진행
- 카드 잘림 완화를 위해 카드/폰트 일부 축소

자세한 버전 히스토리는 `docs/changelog.md` 참고.

---

## 8. 현재 완료 / 미완료 상태

| 항목 | 상태 | 메모 |
|------|------|------|
| Explore Map | 완료 | 현재 메인 데모 화면 |
| Compare bar + ComparisonView | 완료 | 상단 inline compare |
| Decision Flow | 완료 | 추천 스택 handoff 포함 |
| Stack Builder | 완료 | preset, annual total 포함 |
| Hover tooltip | 완료 | 400ms delay |
| 한국어 / 영어 | 완료 | LangCtx 기반 |
| 다크 / 라이트 모드 | 완료 | 다만 시각 QA 한 번 더 권장 |
| 공식 로고 렌더링 | 완료 | 외부 favicon 기반, fallback 있음 |
| 상세 모달 UX | 완료(제거) | `DetailModal` v1.5.6에서 완전 삭제. hover tooltip으로 대체됨 |
| 한국 시장 레이어 | 미완료 | Naver / KT / Samsung SDS 등 추가 가능 |
| 모바일 반응형 | 미완료 | 아직 데스크톱 중심 |
| 레이어 연결선 | 미완료 | 선택 시 flow 시각화 없음 |

---

## 9. 현재 알려진 리스크 / 주의사항

1. 라이트 모드
현재 여러 차례 보강했지만, 사람 눈으로 한 번 더 QA 하는 것이 안전하다.

2. 로고 소스
공식 홈페이지 도메인 기반 외부 favicon 방식이라, 일부 벤더는 로고 품질이나 모양이 균일하지 않을 수 있다.

3. 레거시 코드
`DetailModal`은 v1.5.6에서 완전히 제거되었다. hover tooltip이 대체 UX다.

4. 파일 크기
`src/App.jsx`가 1600 LOC를 넘어서 line-based 수정보다 `rg` 검색 기반으로 블록을 찾는 편이 빠르다.

---

## 10. Claude가 바로 이어서 볼 포인트

우선 확인 추천 순서:

1. `docs/CODEX_HANDOFF.md`
2. `docs/changelog.md`
3. `src/App.jsx`에서 아래 검색
   - `function LogoBadge`
   - `function VendorNode`
   - `function DecisionFlow`
   - `function StackBuilder`
   - `const CSS =`
   - `export default function App()`

---

## 11. Claude에게 권장하는 다음 작업

가장 자연스러운 마무리 작업은 아래 순서다.

### Priority 1
라이트 모드 visual QA 완주

해야 할 일:
- 100% 브라우저 배율 기준으로 전체 탭 순회
- 연한 보라색/회색 때문에 안 읽히는 텍스트가 남아있는지 최종 확인
- Explore / Decision / Stack / Compare 전부 확인

### Priority 2
unused legacy 정리 여부 판단

후보:
- ~~`DetailModal` 제거 또는 유지 판단~~ → **완료 (v1.5.6)**
- 유지한다면 handoff 문서에 legacy로 더 명확히 표기

### Priority 3
마무리 기능 추가

둘 중 하나 추천:
- 모바일/태블릿 반응형 1차 대응
- 한국 시장 레이어 / 벤더 추가

---

## 12. Claude Code에 붙여넣을 다음 프롬프트

```text
Read docs/CODEX_HANDOFF.md and docs/changelog.md first to understand the current project state.

Project summary:
- AI Vendor Ecosystem Navigator
- React 18 + Vite
- All app code lives in src/App.jsx only. Do not split files.
- Keep English/Korean and dark/light theme support.

Your task:
1. Perform a final visual QA pass for light mode at 100% browser zoom.
2. Search the entire src/App.jsx and remove any remaining low-contrast text in light mode.
3. Verify that Explore Map vendor cards and Stack Builder cards do not clip text at 100% zoom.
4. If safe, clean up any now-unused legacy code related to the old detail modal.

Constraints:
- Keep all code in src/App.jsx only.
- Do not break existing functionality:
  - Compare bar
  - Decision Flow
  - Stack Builder prefill from Decision Flow
  - Hover tooltip on VendorNode
  - Build This Stack flow
  - English/Korean support
  - Dark/light mode toggle
- Use existing CSS classes and CSS variables.

After completing:
- Update docs/changelog.md
- Update docs/CODEX_HANDOFF.md if the current status changes
- Run npm run build
- If successful, commit and push to origin/main
```

---

## 13. 마지막 메모

- 이 프로젝트는 빠른 데모 제작 성격이 강하므로, 아키텍처 완벽성보다 체감 UX와 영업 현장 가독성이 더 중요하다.
- 다음 작업자는 “코드 정리”보다 “보이는 문제 제거 + 데모 완성도 상승”에 더 무게를 두는 편이 맞다.

# Changelog

모든 주요 변경사항을 이 문서에 기록합니다.
형식: `[버전] YYYY-MM-DD — 변경 내용`

---

## [Unreleased — v1.5]

### Planned
- F-06: Decision Flow (3단계 의사결정 트리)
- F-07: 한국 시장 레이어 (선택적)
- 모바일 반응형 레이아웃
- Vercel 배포

---

## [1.0.0] 2026-03-26 — MVP 완성 (로컬 실행)

### Added
- `src/App.jsx` — 전체 React 앱 (단일 파일)
  - 4-Layer 에코시스템 맵 (Foundation → Platform → Vertical → Tooling)
  - 유즈케이스 6종 필터 (pill 버튼, glow/fade 애니메이션)
  - 벤더 상세 패널 (slide-in, Sales Director's Take, Radar Chart)
  - 벤더 비교 뷰 (멀티 Radar + Metric 테이블)
  - Stack Builder 탭 (Preset 3종 + Grade 산출)
  - 하단 Compare 플로팅 바
- `src/main.jsx` — React 진입점
- `index.html` — Vite HTML 템플릿
- `package.json` — React 18 + Recharts + Lucide + Vite
- `vite.config.js` — PORT 환경변수 지원
- `.claude/launch.json` — Preview 패널 연동
- 22개 글로벌 벤더 Mock 데이터 (레이어별 4-6개)

### Decisions
- Decision Flow → v1.5로 연기
- 포트폴리오 연결 없음, vercel.app 도메인으로 배포 예정
- 모바일 반응형 → v2

---

## [0.1.0] 2026-03-26 — 프로젝트 초기화

### Added
- 프로젝트 디렉토리 구조 설정
- `docs/overview.md` — 프로젝트 개요 문서
- `docs/requirements.md` — PRD / 요구사항 정리
- `docs/changelog.md` — 변경 트랙킹 문서
- `assets/reference/ai-ecosystem-navigator.jsx` — 레퍼런스 컴포넌트

### Decisions
- 기술 스택: React JSX + Recharts + Lucide + CSS Animations + Vercel
- 데이터: Mock hardcoded (API 연동 없음, MVP)
- 디자인: Anthropic 퍼플 (#8B5CF6) 다크 테마
- 범위: 글로벌 벤더 24개, 6개 유즈케이스, 한국 시장 레이어 v1 제외

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

# 하이플러스 홈페이지 디자인 통일성 개선

## 작업 개요
사이트 전체 디자인 통일감 개선. 두 톤 컨셉은 유지하면서 각 톤 내부의 디테일 일관성 정리.

## 사용 스킬
작업 전 반드시 아래 스킬 4개 모두 읽고 시작:
1. ui-design-system
2. ui-ux-pro-max
3. frontend-design
4. web-design-guidelines

---

## ⚠️ 중요 — 디자인 컨셉 유지

이 사이트는 의도적으로 두 톤으로 나뉘어 있음. **합치지 말 것.**

### 🌕 라이트 톤 (파란 + 흰 배경) — PART 1 (Ai실장)
포지셔닝: Ai실장 (월 25만원, 친근/솔루션/가벼움)

해당 섹션:
- hero
- ai-manager
- why-ai-manager
- ai-benefits
- ai-features
- growth-story
- testimonials
- contact

(+ 전역 공통: nav, footer, login/payment modal, deadline-banner — 모두 라이트 톤)

### 🌑 다크 톤 (검정 + 골드) — PART 2 (Agency)
포지셔닝: 풀매니지먼트 (월 90만원, 프리미엄/신뢰/묵직함)

해당 섹션:
- services
- pain-point
- trust
- compare
- faq
- scarcity

### 🌗 전환 다리
- `.hp-part-divider` — PART 1 → PART 2 라이트→다크 전환 그라데이션

---

## 작업 항목

### 1. 디자인 토큰 통일
- [x] 라이트 톤 / 다크 톤 각각 별도 CSS 변수 세트로 정리 (--hp-*, --premium-*)
- [x] spacing 시스템 통일 (8px 기반) — --hp-space-1 ~ --hp-space-7 정의
- [x] radius 통일 — --hp-radius-sm/md/card/pill 추가 (기존 변수 유지)
- [x] transition 곡선/시간 통일 — --hp-dur-fast/mid/slow + --hp-ease-out 추가
- [x] shadow 단계 통일 — --premium-shadow/lg/gold 추가 (다크 톤)
- [x] 골드 컬러 통일 — #FCD34D → #D4AF37 (5라인, 6 hex 변경)

### 2. 톤별 컬러 정리

**라이트 톤 섹션** (hero, ai-manager, why-ai-manager, ai-benefits, ai-features, growth-story, testimonials, contact)
- [x] 메인 컬러: --hp-brand (#3478F6) 유지
- [x] 파란 계열만 사용
- [x] 골드 잔재 없는지 점검 — 잔재 0건 확인

**다크 톤 섹션** (services, pain-point, trust, compare, faq, scarcity)
- [x] 메인 컬러: 골드 (#D4AF37) — 1단계 통일됨
- [x] 파란 잔재 모두 제거 — `#faq .faq-item:hover` 파랑 rgba → 골드 rgba 변환 (1567)
- [x] 모든 액센트/호버/글로우 효과 골드로 통일

### 3. 스크롤 진입 애니메이션 통일
모든 섹션 동일 규칙 (톤 무관):
- 방향: translateY(20px → 0)
- 페이드: opacity 0 → 1
- 지속시간: 0.6s
- 이징: cubic-bezier(0.16, 1, 0.3, 1)
- 트리거: IntersectionObserver, threshold 0.15
- 같은 섹션 내 요소는 0.1s씩 stagger
- once: true (한 번만 재생)

- [x] 전체 섹션에 적용 완료 — css/style.css:1846 reveal 정의, index.html:2702 stagger, js/main.js:15 observer
- 모바일(768px↓) reveal 비활성화 유지 (style.css:3354) — 빈 공간 방지
- prefers-reduced-motion 지원 유지 (style.css:1864)

### 4. 호버 효과 통일

공통:
- transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)
- 카드 호버: translateY(-4px) + shadow 강화
- 버튼 호버: scale(1.02) + 배경 밝기 변화
- 링크 호버: 색상 변화 하나로 통일

톤별:
- 라이트 톤 카드 = 파란 보더/그림자 강화
- 다크 톤 카드 = 골드 보더/그림자 강화

- [x] 모든 인터랙티브 요소 적용 완료 — B안(보수적 통일) 적용:
  - transition duration: `.25s/.2s/.3s` → `var(--hp-dur-mid)` (0.3s) 일괄 통일
  - 기존 `--dur-base`(0.25s), `--dur-fast`(0.2s) → `var(--hp-dur-mid)` 치환
  - 하드코딩 easing `.2s ease` (라인 2179) → `var(--hp-dur-mid) var(--hp-ease)` 변수화
  - 하드코딩 `cubic-bezier(0.4, 0, 0.2, 1)` 2건 → `var(--hp-ease)` 변수화
  - **보존**: 카드 lift 값(-4/-6 메모리 규칙 허용), 버튼 scale(1.02) 미적용

### 5. 톤 전환 구간 부드럽게
- [x] 라이트 → 다크 또는 다크 → 라이트 경계 점검 — 2개 전환 구간 확인 (PART 1→divider, PART 2→footer)
- [x] 갑작스러운 컬러 충돌 없도록 처리 — divider 상단 short fade (#F0F6FF → 다크 12% 진입)
- [x] 의도적 전환 느낌 부여 — 전환 1: 그라데이션 fade / 전환 2: 검정 1px border-top (컷 의도 보존)
- **보존**: PART 2 → footer 흰색 점프는 의도된 PART 종료 신호 (footer는 전역 공통 라이트 유지)

### 6. Compare 섹션 (최우선)
1·2단계에서 이미 골드로 통일됨. 6단계에서는 잔여 점검 + 4단계 부작용 수정.
- [x] 표 보더 글로우 → 골드 (rgba(212,175,55,0.10) + 네온카드 #D4AF37)
- [x] HighPlus 헤더 배경 → 골드 (linear-gradient #E8C770 → #D4AF37 → #B8860B)
- [x] 셀 호버 하이라이트 → 골드 (rgba(212,175,55,0.08))
- [x] 모든 강조 색상 → 골드 (#D4AF37 — 1단계 Q1 결정)
- [x] 4단계 부작용 수정 — `0var(--hp-dur-mid)` → `var(--hp-dur-mid)` 2건 정정 (라인 568, 3912)

### 7. FAQ 아코디언 부드럽게
A안(간단·효과적) 적용:
- [x] max-height + opacity transition 동시 적용 — `#faq .faq-a` opacity 0→1 추가
- [x] transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1) (= `--hp-ease-out`), opacity 0.3s ease
- [-] padding도 같이 transition — **생략** (A안 선택, max-height+opacity로 충분히 부드러움)
- [x] +/× 아이콘 0.3s rotate 애니메이션 — 이미 적용됨 + background/box-shadow/border-color transition 추가

### 8. 모바일 가독성 (375px 기준)
B안(본문 + 줄간격) 적용:
- [x] 본문 텍스트 최소 15px — 본문 6군데 0.72~0.82rem → **0.95rem (15.2px)** 으로 보정
  - `#trust .reveal p:last-child`, `#ai-manager p`, `#ai-manager ul li`, `#ai-manager .ai-feature-grid p`, `#trust .section-desc`, `#pain-point p`
- [x] 헤드라인 모바일 크기 균형 조정 — 기존 clamp() 유지 (이미 균형 OK)
- [x] 줄 간격: 본문 1.65 통일, 헤드라인 1.3 통일
  - 본문 6군데에 `line-height: 1.65` 명시
  - 헤드라인 2개 모바일 미디어쿼리에 `line-height: 1.3` 추가
- [-] 자간: 한글 본문 -0.02em 통일 — **B안 범위 밖, 생략**
- [-] 섹션 좌우 여백 최소 20px — **B안 범위 밖, 생략** (#scarcity, #compare는 이미 20px)
- [-] 카드 내부 패딩 24px 이상 — **B안 범위 밖, 생략** (대부분 이미 충족)

**보존**: 작은 라벨/배지/pill의 0.72~0.82rem (의도된 작음 — 위계 보존)

---

## 완료 후 최종 체크리스트

- [ ] 라이트/다크 톤 자체는 유지됐는가
- [ ] 각 톤 내부에서 컬러 일관된가 (파란/골드 잔재 없는가)
- [ ] 모든 섹션 진입 애니메이션 동일한가
- [ ] 모든 호버 효과 동일한 transition 쓰는가
- [ ] 모바일 폰트 크기 일관된가
- [ ] FAQ 아코디언 부드럽게 작동하는가
- [ ] Compare 섹션 골드로 통일됐는가
- [ ] 톤 전환 구간 자연스러운가

---

## 작업 진행 방식

1. 위 작업 항목 1번부터 8번까지 **순서대로** 진행
2. 각 단계 끝날 때마다 체크박스 업데이트
3. 단계별로 변경 요약 보여주고 확인 받고 다음 단계 진행
4. 한 번에 다 하지 말 것

---

# PART 02 다크 + 골드 럭셔리 전면 리디자인 (2026-05-XX)

레퍼런스: iPhone 17 Pro 광고 (다크 + 골든 림 라이트) · 중국 Hall of Fame (골드 프레임 + 그라데이션 텍스트) · iPhone 측면 백라이트 (네온 글로우).

## 작업 범위 (PART 02 ~ 페이지 끝까지)

| 영역 | 라인 범위 | 비고 |
|---|---|---|
| `.hp-part-divider` PART 02 진입 디바이더 | 4603–4615 | 골드 그라데이션 라인 + 골드 글로우 |
| `#services` (핵심 서비스 4종) | 4620–4690 | 4 카드 (`.service-card`) |
| `#pain-point` (대행사 페인포인트) | 4692–4747 | 6 카드 (`.pain-card`) |
| `#trust` (About HighPlus + philosophy 3종) | 4749–4844 | 3 카드 (`.phil-card`) + 1지역 1병원 배너 (`.neon-card`) |
| `#compare` (비교표) | 4846–4929 | `.vs-tbl` |
| `#faq` (FAQ 아코디언) | 4931–5010 | 8 FAQ |
| `#scarcity` (FULL MANAGEMENT + agency form) | 5012–5094 | `.hp-agency-card` + `.hp-agency-form-card` |
| `#limited` (LIMITED slot) | 5096–~5115 | `.hp-scarcity-card--full` |

CSS 영역: 기존 PART 02 관련 룰 라인 ~1600–3200, 신규 추가는 마지막 `</style>` 직전.

## 디자인 토큰 (STEP 1)

```css
:root {
  --neon-gold-core:  #FFC83D;
  --neon-gold-glow:  rgba(255, 200, 61, 0.55);
  --neon-gold-soft:  #B8901C;
  --card-bg-deep:    linear-gradient(180deg, rgba(20, 17, 12, 0.95) 0%, rgba(10, 10, 10, 0.98) 100%);
  --card-border-rim: rgba(255, 200, 61, 0.30);

  --glow-rim:       0 0 0 1px rgba(255, 200, 61, 0.22), 0 0 24px rgba(255, 200, 61, 0.18),
                    0 16px 40px -12px rgba(0, 0, 0, 0.60), inset 0 1px 0 rgba(255, 230, 128, 0.12);
  --glow-rim-hover: 0 0 0 1px rgba(255, 200, 61, 0.55), 0 0 36px rgba(255, 200, 61, 0.35),
                    0 24px 56px -12px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 230, 128, 0.22);
  --glow-inset:     inset 0 0 60px -20px rgba(255, 200, 61, 0.08);
}
```

## 공통 컴포넌트 클래스 (STEP 2)

- `.hp-premium-card` — 모든 PART 02 카드 통합 (다크 + 골드 림 + inset glow)
- `.hp-premium-label` — 뱃지/라벨 (uppercase + letter-spacing + 골드 글로우)
- `.hp-premium-emoji` — 이모지 아이콘 컨테이너 (골드 배경 글로우)
- `.hp-premium-divider` — 섹션 사이 골드 그라데이션 라인

## 체크리스트

- [x] backup 커밋 (`b53d663`)
- [x] 디자인 토큰 :root에 정의 (`--neon-gold-core/bright/glow/soft/grad`, `--card-bg-deep`, `--glow-rim/-hover/-inset`)
- [x] 공통 카드 클래스 `.hp-premium-card` 정의 + 모든 기존 카드 셀렉터에 cascade (`.service-card`, `.pain-card`, `.phil-card`, `.hp-agency-card`, `.hp-agency-form-card`, `.hp-scarcity-card`, `.neon-card`, FAQ item)
- [x] 공통 라벨 `.hp-premium-label` + 모든 `section-tag` / `hp-agency-tag`에 cascade
- [x] 공통 이모지 컨테이너 `.hp-premium-emoji` + 골드 라디얼 글로우 (모든 PART 02 아이콘 셀렉터)
- [x] 호버 인터랙션 통일 (`transform: translateY(-4px) + var(--glow-rim-hover)`, transition cubic-bezier 0.3s)
- [x] 헤드라인 골드 그라데이션 + `text-shadow` 글로우 + grad-highlight 골드 그라데이션
- [x] CTA 버튼 골드 알약 + 글로우 (`.hp-agency-submit`, `.btn-primary` in scarcity/limited)
- [x] 섹션 사이 디바이더 골드 그라데이션 라인 (`::before` linear-gradient)
- [x] compare 비교표 골드 림 + 헤더 골드 그라데이션
- [x] agency form 입력 필드 골드 포커스 글로우
- [x] 회색·블루 잔재 제거 (Attribute selector로 `#94A3B8` / `rgba(52,120,246)` 자동 변환)
- [x] 잔재 grep 검증 — PART 02 진입(라인 4924) 이후 블루/라이트 hex 0건

## 변경 요약

- 신규 CSS 라인: ~270 (index.html 3680 직전)
- 영향 셀렉터: 12개 카드 패밀리 + 8개 헤딩 패밀리 + 7개 라벨 패밀리
- HTML 변경 0 — 기존 클래스명 보존하며 CSS만 cascade로 새 시스템 적용
- 모바일: 호버 transform 비활성, 이모지 컨테이너 48px 축소
- 잔재 그레이/블루: attribute selector + !important로 자동 무력화

## 다음 단계 (필요 시)

- 페이지 라이브 확인 후 카드별 미세 보정 (텍스트 색 강도, 패딩 등)
- 페이지 전체 lighthouse / 접근성 점검
- 모션 reduced-motion 대응 확장 (현재 카드 호버는 GPU 가속 transform이라 부담 적음)


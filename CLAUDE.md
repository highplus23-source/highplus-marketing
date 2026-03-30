# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

HighPlus Marketing 랜딩 페이지 — 병원 전문 마케팅 서비스 홈페이지. 빌드 시스템 없는 정적 HTML 사이트, Netlify 배포.

## 개발 환경

```bash
python3 -m http.server 8080
```

브라우저에서 `http://localhost:8080` 접속. 빌드/패키지 매니저 없음. 파일 직접 수정 후 git push → Netlify 자동 배포.

---

## ⚠️ 작업 파일 규칙

> **`index.html`이 메인 작업 파일입니다.**

| 파일 | 용도 |
|------|------|
| `index.html` | ✅ **현재 라이브 + 개발 파일** — 모든 수정은 여기에! |

---

## 📞 대표님 통화 내용 (2027.03.27 기준)

### 타겟 고객
- 병의원 원장님. 보통 작은 병원엔 마케팅 직원 없음
- 실장(간호사/직원)이 블로그 포스팅 담당

### 핵심 전략 (PASONA 기법)
메타 광고에서 "블로그 자동화 30만원"으로 유입 → 홈페이지에서 전환

#### 사용자 심리 흐름:
```
메타 광고 "블로그 자동화 30만원" 클릭
    ↓
[히어로] 버튼: "Ai실장" | "블로그 대행 알아보기"
    ↓ Ai실장 클릭
[Ai실장 섹션] 공감 + 기능 + ₩300,000/월 가격
    ↓
[Growth] 블로그 복리 성장 (블루 밴드)
    ↓
[Testimonials] 파트너 원장님 후기
    ↓
[Contact] 서비스 요약 + 신청 폼
    ↓
[Services] 4가지 핵심 서비스
    ↓
[Pain Point] "대행사에 맡겼는데 이런 경험?" → 대행 불만 공감
    ↓
[Trust] "우리도 같은 경험" + 솔루션
    ↓
[Compare] 하이플러스 vs 일반 대행사 (블루 밴드)
    ↓
[FAQ] 자주 묻는 질문
    ↓
[Scarcity] 희소성 + CTA
```

### 네비게이션
- `우리의 차별점` | `핵심 서비스` | `Ai실장 시작하기`

### 비즈니스 목표
- **Ai실장 20군데 이상 확보 = 회사 생존 조건**
- 대행 내용은 현재 OK, Ai실장 내용을 명확하게 만드는 게 핵심
- Ai실장은 자동화 프로그램 → "이런 상황이면 우리 프로그램이 훨씬 이득"

---

## index.html 섹션 순서 (현재)

1. `#hero` — 히어로 (연블루 그라데이션 배경)
2. `#ai-manager` — Ai실장 (공감 + 기능 + ₩300,000 가격)
3. `#growth-story` — 블로그 복리 성장 (**블루 밴드** #3478F6)
4. `#testimonials` — 리뷰 슬라이더
5. `#contact` — 서비스 요약 + 신청 폼 (연블루)
6. `#services` — 핵심 서비스 4가지
7. `#pain-point` — 대행사 페인포인트
8. `#trust` — 신뢰 섹션 (About HighPlus)
9. `#compare` — 비교표 (**블루 밴드** #3478F6)
10. `#faq` — Q&A
11. `#scarcity` — 희소성 + CTA (연블루)

---

## 디자인 시스템 (라이트 테마)

### 색상 팔레트
| 변수 | 값 | 용도 |
|------|-----|------|
| `--bg-primary` | `#f5f8fc` | 기본 배경 (흰색 섹션) |
| `--bg-secondary` | `#e8f0fe` | 연블루 배경 섹션 |
| `--bg-card` | `#ffffff` | 연블루 배경 위의 카드 |
| `--grad-card` | `#edf3ff → #e4edfc` | 흰색 배경 위의 카드 |
| `--bg-blue-band` | `#3478F6` | 블루 밴드 섹션 배경 |
| `--accent1` | `#3478F6` | 메인 강조색 |
| `--accent3` | `#5B9BF7` | 보조 강조색 |
| `--text-primary` | `#1a1a2e` | 본문 텍스트 |
| `--text-secondary` | `#4a5568` | 보조 텍스트 |
| `--text-muted` | `#7a8a9e` | 흐린 텍스트 |

### 섹션 배경 교차 패턴
```
흰색(#f5f8fc) → 연블루(#e8f0fe) → 블루밴드(#3478F6) → 흰색 → 연블루 ...
```
- **흰색 배경** 섹션: 카드는 연한 하늘색 (`#edf3ff`)
- **연블루 배경** 섹션: 카드는 흰색 (`#ffffff`)
- **블루 밴드** 섹션: 반투명 흰색 카드 (`rgba(255,255,255,0.12)`)

### 카드 스타일
- border-radius: 20px
- hover: `translateY(-4~6px)` (scale 없음)
- section-tag: pill 형태 (`border-radius: 100px`)

---

## 파일 구조

```
highplus-marketing/
├── index.html           ← ✅ 메인 작업 파일
├── 404.html
├── css/style.css        ← 메인 스타일시트
├── js/main.js           ← 메인 JS
├── img/                 ← 이미지 에셋
│   ├── logo.png         ← 사용 중인 로고
│   ├── backgrounds/     ← 배경 이미지
│   ├── icons/           ← 아이콘
│   ├── portfolio/       ← 포트폴리오 이미지
│   └── stats/           ← 통계 이미지
├── 클라이언트 (병원)로고/ ← 마키 섹션용
├── backups/             ← 백업 파일
├── _archive/            ← 아카이브
├── docs/                ← 문서/가이드
├── robots.txt
├── sitemap.xml
└── _headers             ← Netlify 보안 헤더
```

## 주의사항

- 한글 파일명은 URL 인코딩 문제 발생 가능 → `img/` 디렉토리에 영문 파일명으로 복사하여 사용
- 반응형 브레이크포인트: 1024px, 768px, 480px
- 폼 제출: Web3Forms API (access_key가 HTML에 포함)
- `_headers`: Netlify 보안 헤더 설정 파일

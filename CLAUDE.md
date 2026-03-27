# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

HighPlus Marketing 랜딩 페이지 — 병원 전문 마케팅 서비스 홈페이지. 빌드 시스템 없는 정적 HTML 사이트, Netlify 배포.

## 개발 환경

```bash
python3 -m http.server 8080
```

브라우저에서 `http://localhost:8080` 접속. 빌드/패키지 매니저 없음. 파일 직접 수정 후 git push → Netlify 자동 배포.

## 파일 구조

- **`index.html`** (~5400줄): HTML + CSS(`<style>`) + JS(`<script>`) 모두 포함된 메인 파일
- **`css/style.css`**: 보조 스타일시트 (대부분의 활성 스타일은 index.html 내부)
- **`js/main.js`**: 보조 JS (헤더 스크롤, 카운터, 폼, 다크모드)
- **`img/`**: 정적 에셋 (logo.png, favicon.svg, 2.jpg 등)
- **`클라이언트 (병원)로고/`**: 마키 섹션용 병원 로고 이미지

## 주요 변경 이력

### 네비게이션 로고
- 텍스트 로고(`HighPlus.`) → 이미지 로고(`img/logo.png`)로 변경
- 한글 파일명(`하이플러스 로고.png`)은 URL 문제 발생 → 영문(`logo.png`)으로 복사하여 사용
- `.nav-logo-img` 클래스: height 50px, object-fit: contain

### 버튼 스타일 (btn-primary / btn-secondary)
- `border-radius: 100px` (pill 형태)
- btn-primary: `::before` 빛나는 오버레이 효과 (hover 시 opacity 1)
- btn-secondary: 투명 배경 + 얇은 테두리, hover 시 밝아짐
- MAGNETIC BUTTONS 효과 (커서 따라 움직이는 기능) 삭제됨

### Stats 섹션 (성장의 기록)
- 배경: `#eef1f6` (밝은 회색) — 다크 테마로 변경 시도 후 원래대로 복원
- stat-label / stat-sub: 흰색(#ffffff), 글씨 크기 20% 확대 (1.26rem / 1.02rem)
- stat-item: `overflow: hidden` 추가 (모서리 잘림 방지)
- 로고 마키: 흰색 배경 카드, `#eef1f6` fade 그라데이션

### Pain Point 섹션
- `#pain-point`: padding-top/bottom 60px (기본 100px에서 축소)
- `.pain-grid`: gap 2rem (1.25rem에서 확대)
- `.pain-highlight` 카드:
  - 배경: `url('img/2.jpg')` 직접 배경 + `::before` 오버레이 (`rgba(12,18,37,0.9)`)
  - `text-align: center` (가운데 정렬)
  - hover: translateY(-10px) scale(1.03) + 블루 글로우 효과

### Philosophy 섹션
- 숫자(01~04) → SVG 아이콘으로 변경:
  - 글의 힘과 퍼널 설계 → 펜(편집) 아이콘
  - 의료적 감수성 → 심박수(의료) 아이콘
  - 하이브리드 시스템 → CPU(기술) 아이콘
  - 동업자 정신 → 사람들(파트너) 아이콘

## CSS 변수 (index.html :root)

`--bg-primary`, `--bg-secondary` (#0f1120), `--bg-card`, `--text-primary`, `--text-muted`, `--border`, `--grad-btn`, `--grad-text`

## 페이지 섹션 순서

`nav` → `#hero` (Spline 3D) → `.stats-bar` (밝은 배경) → `#pain-point` (흰 배경) → `#philosophy` → `#services` (다크 배경) → `#process` → `#graph` → testimonials → `#faq` → `#contact` (Formspree) → `footer`

## 주의사항

- 한글 파일명은 URL 인코딩 문제 발생 가능 → `img/` 디렉토리에 영문 파일명으로 복사하여 사용
- 반응형 브레이크포인트: 1024px, 768px, 480px
- 폼 제출: Web3Forms API (access_key가 index.html에 포함)
- `_headers`: Netlify 보안 헤더 설정 파일

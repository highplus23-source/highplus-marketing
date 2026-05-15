# WORK_LOG

> 하이플러스 마케팅 사이트 작업 일지. 매일 append 방식으로 기록.

---

## 2026-05-14 (목)

### 완료한 작업

- **히어로 섹션 정리**: 떠다니던 플로팅 카드 3개(35개+/98%/저품질 ZERO) 제거
- **히어로 카운터 4번째 항목 추가**: `ZERO / 저품질 걱정` — 기존 35+/98%/9년 카드와 동일 디자인으로 통일
- **로그인 + 토스페이먼츠 결제 HOLD 처리** (삭제 아닌 주석 처리 — 활성화 시 주석만 해제)
  - [x] PC 네비 `로그인` 버튼 + 유저 드롭다운 (`index.html` L4487-4499)
  - [x] 모바일 메뉴 `로그인 / 회원가입` 링크 (`index.html` L4521)
  - [x] `js/firebase-auth.js`, `js/toss-payment.js` 스크립트 로드 (`index.html` L6424-6425)
  - [x] `#login-modal`, `#payment-modal` HTML은 `display:none` 상태로 보존 (트리거가 다 막혀 노출 X)
  - [x] `js/firebase-auth.js`, `js/toss-payment.js`, `payment-success.html`, `payment-fail.html` 파일 보존

### 복귀 방법

위 3곳의 `<!-- HOLD: ... -->` 주석만 풀면 원복.

---

## 2026-04-13 (월) - 탱

### 완료한 작업

- **카카오 로그인 Redirect URI 등록**: 카카오 개발자 콘솔 → REST API 키에 `https://fnjc-68c61.firebaseapp.com/__/auth/handler` 추가 → KOE006 에러 해결, 카카오 로그인 정상 동작 확인
- **구글 로그인 정상 동작 확인**: Firebase 기본 제공 Google 로그인 — 별도 설정 없이 작동
- **네이버 로그인 조사 및 비활성화**: 네이버는 표준 OIDC Discovery를 지원하지 않아 Firebase OIDC와 호환 불가 → 버튼을 "준비 중"으로 비활성화 처리 (추후 서버사이드 OAuth로 구현 예정)
- **Netlify 배포 완료**: `sparkling-bublanina-2554e4.netlify.app`으로 배포 (git push 자동 배포 설정)
- **Firebase 승인 도메인 추가**: Firebase Console → Authentication → 승인된 도메인에 `sparkling-bublanina-2554e4.netlify.app` 추가 → Netlify에서도 소셜 로그인 가능
- **카카오 콘솔 Netlify 도메인 확인**: Firebase OIDC 방식이므로 리다이렉트가 항상 Firebase 도메인으로 처리됨 → 카카오 쪽에 Netlify 도메인 별도 추가 불필요 확인

### 미완료 (수요일 이어서 진행)

- 카카오 개발자 콘솔 Redirect URI 설정
- 결제 플로우 테스트

### 다음 할 일

- Netlify Functions로 토스페이먼츠 결제 확인 API 연동 테스트
- 네이버 로그인 서버사이드 구현 (Netlify Functions → Naver OAuth → Firebase Custom Token)
- 홈페이지 하단 수정: 카운팅 50개, 대행 90만원, 이메일 연동
- 폼 → 카카오톡 연결 + 결제시스템 삽입
- `page-about.html` 회사소개 서브페이지 콘텐츠 개발

### 주요 결정사항

- **네이버 로그인은 서버사이드로 전환**: Firebase OIDC(클라이언트)로는 네이버 연동 불가 → Netlify Functions에서 Naver OAuth 처리 후 Firebase Custom Token 발급 방식으로 변경
- **카카오 로그인 Redirect URI**: Firebase OIDC를 사용하므로, 어떤 도메인에서 접속하든 리다이렉트는 `fnjc-68c61.firebaseapp.com`으로 통일됨 → 카카오 콘솔에는 Firebase 콜백 URL만 등록하면 충분
- **Netlify 사이트 2개 존재**: `sparkling-bublanina-2554e4` (클로드 코드 git 연동)과 `nimble-belekoy-1a1b4d` (수동 업로드) — git push 자동 배포용으로 전자 사용

---

## 2026-04-15 (수) - 탱

### 완료한 작업

- **로그인 모달 안 뜨는 이슈 디버깅**: 회사에서 `index.html`을 file://로 직접 열었을 때 로그인 버튼을 눌러도 모달이 안 뜨고, 모달이 떠도 카카오/구글 버튼이 무반응이던 문제 원인 파악
  - 원인 1: `js/firebase-auth.js`가 `type="module"`로 로드 → 모듈은 deferred 실행이라 `window.openLoginModal` 할당이 늦음
  - 원인 2: file:// 프로토콜에선 ES module의 import가 CORS로 차단 → 모듈 자체가 아예 실행되지 않음 → `window.loginWithKakao` 등이 영원히 undefined
- **폴백 스크립트 보강** (`index.html`):
  - `window.openLoginModal`/`closeLoginModal` 폴백을 `<head>` 최상단으로 이동 → 파싱 즉시 사용 가능
  - `loginWithKakao`/`loginWithGoogle`/`loginWithNaver`에 가드 함수 추가 → 모듈 미로드 시 조용히 실패하지 않고 file:// 여부에 따라 명확한 안내 alert
- **`firebase-auth.js` 수정**: 모듈 로드 성공 시 `_real_loginWithXxx`에 진짜 핸들러 등록하도록 변경 (가드 함수가 이를 호출)
- **커밋 완료** (푸시는 대기 중): `fix: 로그인 모달/소셜 로그인 버튼 동작 안정화`

### 미완료

- `git push origin main` (샌드박스 인증 안 돼서 탱이 직접 푸시 필요)
- Netlify 배포본에서 최종 동작 확인

### 다음 할 일 (월요일 WORK_LOG 이월 + 오늘 추가)

- Netlify Functions로 토스페이먼츠 결제 확인 API 연동 테스트
- 네이버 로그인 서버사이드 구현 (Netlify Functions → Naver OAuth → Firebase Custom Token)
- 홈페이지 하단 수정: 카운팅 50개, 대행 90만원, 이메일 연동
- 폼 → 카카오톡 연결 + 결제시스템 삽입
- `page-about.html` 회사소개 서브페이지 콘텐츠 개발

### 주요 결정사항 / 배운 점

- **file://로 index.html 직접 열지 말 것**: ES module + Firebase 소셜 로그인은 file://에서 구조적으로 불가능. 로컬 테스트는 반드시 `python3 -m http.server 8080` 띄우고 `http://localhost:8080`로 접속하거나 Netlify 배포본 사용
- 가드 함수를 남겨둬서 나중에 누가 실수로 file://로 열어도 원인을 바로 알 수 있게 함

---

## 2026-05-13 (수) - 클로드

### 완료한 작업

- **톤 비교 시안 2종 생성, 탱 검토 대기**: 하이플러스 홈페이지 디자인 톤 결정을 위한 컨셉 시안 2개 작성
  - `preview/apple-style.html` — 애플 톤 (흰색 + parchment 교대, 단일 블루 #0066cc, SF Pro Display, 그림자/그라데이션 0)
  - `preview/meta-style.html` — 메타 톤 (검정 마케팅 CTA + 코발트 구매 CTA, Pretendard, 뱃지 사용, 그림자/그라데이션 0)
- 공통 콘텐츠 3섹션 동일 구성 (Hero / BLOG AUTOMATION 가격 / START NOW 신청 폼) — 톤만 비교 가능하도록
- 두 파일 모두 단독 실행 가능 (인라인 CSS, Pretendard CDN만 의존)
- 기존 `index.html` 무관하게 신규 작업 — 블루→퍼플 그라데이션, 이모지 박스, 그림자 카드 스타일 모두 배제

### 다음 할 일

- 탱 검토 후 어느 톤으로 갈지 결정
- 결정된 톤 기반으로 `index.html` 또는 `page-about.html`에 디자인 시스템 반영

---

<!-- 다음 작업일에 아래 형식으로 추가:

## YYYY-MM-DD

### 완료한 작업
- 항목

### 현재 진행 중
- 항목

### 다음 할 일
- 항목

### 주요 결정사항
- 항목

-->

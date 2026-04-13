# WORK_LOG

> 하이플러스 마케팅 사이트 작업 일지. 매일 append 방식으로 기록.

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

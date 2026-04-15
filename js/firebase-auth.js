/**
 * HighPlus Firebase Auth 모듈
 * - 카카오, 네이버, 구글 소셜 로그인
 * - Firebase Auth 기반
 *
 * [설정 방법]
 * 1. Firebase Console (https://console.firebase.google.com) 에서 프로젝트 생성
 * 2. Authentication → Sign-in method 에서 Google 활성화
 * 3. 카카오/네이버는 OIDC(OpenID Connect) 커스텀 프로바이더로 등록
 *    - Firebase Console → Authentication → Sign-in method → "새 제공업체 추가" → OpenID Connect
 *    - 카카오: https://developers.kakao.com 에서 앱 생성 후 Client ID/Secret 발급
 *    - 네이버: https://developers.naver.com 에서 앱 생성 후 Client ID/Secret 발급
 * 4. 아래 firebaseConfig 에 본인 프로젝트 정보 입력
 */

// ─── Firebase 설정 (본인 프로젝트 값으로 교체) ───
const firebaseConfig = {
  apiKey: "AIzaSyBrPVEedMAmGWigzuMSoPh2g7XqDbRdRaE",
  authDomain: "fnjc-68c61.firebaseapp.com",
  projectId: "fnjc-68c61",
  storageBucket: "fnjc-68c61.firebasestorage.app",
  messagingSenderId: "246694302922",
  appId: "1:246694302922:web:524a2b64ceafe513f41033",
  measurementId: "G-4KBKP243L4"
};

// ─── Firebase SDK 동적 로드 ───
let auth = null;
let firebaseReady = false;

async function loadFirebase() {
  if (firebaseReady) return;

  const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js');
  const {
    getAuth,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    OAuthProvider
  } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');

  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);

  // 전역에 저장
  window._fbAuth = auth;
  window._fbProviders = { GoogleAuthProvider, OAuthProvider, signInWithPopup, signOut, onAuthStateChanged };

  firebaseReady = true;

  // 로그인 상태 감지
  onAuthStateChanged(auth, (user) => {
    if (user) {
      onLoginSuccess(user);
    } else {
      onLogout();
    }
  });
}

// ─── 소셜 로그인 함수 ───

// 구글 로그인
async function loginWithGoogle() {
  await loadFirebase();
  const { GoogleAuthProvider, signInWithPopup } = window._fbProviders;
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    handleAuthError(error);
  }
}

// 카카오 로그인 (Firebase OIDC 커스텀 프로바이더)
async function loginWithKakao() {
  await loadFirebase();
  const { OAuthProvider, signInWithPopup } = window._fbProviders;
  // Firebase Console에서 등록한 OIDC 프로바이더 ID
  const provider = new OAuthProvider('oidc.kakao');
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    handleAuthError(error);
  }
}

// 네이버 로그인 (Firebase OIDC 커스텀 프로바이더)
async function loginWithNaver() {
  await loadFirebase();
  const { OAuthProvider, signInWithPopup } = window._fbProviders;
  // Firebase Console에서 등록한 OIDC 프로바이더 ID
  const provider = new OAuthProvider('oidc.naver');
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    handleAuthError(error);
  }
}

// 로그아웃
async function logout() {
  await loadFirebase();
  const { signOut } = window._fbProviders;
  try {
    await signOut(auth);
  } catch (error) {
    console.error('로그아웃 실패:', error);
  }
}

// ─── UI 업데이트 ───

function onLoginSuccess(user) {
  const loginBtn = document.getElementById('nav-login-btn');
  const userMenu = document.getElementById('nav-user-menu');
  const userName = document.getElementById('nav-user-name');
  const userAvatar = document.getElementById('nav-user-avatar');
  const loginModal = document.getElementById('login-modal');

  if (loginBtn) loginBtn.style.display = 'none';
  if (userMenu) userMenu.style.display = 'flex';
  if (userName) userName.textContent = user.displayName || '회원';
  if (userAvatar) {
    userAvatar.src = user.photoURL || '';
    userAvatar.style.display = user.photoURL ? 'block' : 'none';
  }
  if (loginModal) loginModal.style.display = 'none';

  // 현재 유저 정보 전역 저장
  window.currentUser = {
    uid: user.uid,
    name: user.displayName,
    email: user.email,
    photo: user.photoURL,
    provider: user.providerData[0]?.providerId
  };

  // 결제 모듈에 유저 정보 전달
  if (typeof window.onUserReady === 'function') {
    window.onUserReady(window.currentUser);
  }
}

function onLogout() {
  const loginBtn = document.getElementById('nav-login-btn');
  const userMenu = document.getElementById('nav-user-menu');

  if (loginBtn) loginBtn.style.display = 'inline-flex';
  if (userMenu) userMenu.style.display = 'none';

  window.currentUser = null;
}

// ─── 로그인 모달 제어 ───

function openLoginModal() {
  const modal = document.getElementById('login-modal');
  if (modal) modal.style.display = 'flex';
}

function closeLoginModal() {
  const modal = document.getElementById('login-modal');
  if (modal) modal.style.display = 'none';
}

// ─── 에러 핸들링 ───

function handleAuthError(error) {
  console.error('Auth Error:', error.code, error.message);

  const messages = {
    'auth/popup-closed-by-user': '로그인 창이 닫혔습니다.',
    'auth/cancelled-popup-request': '로그인이 취소되었습니다.',
    'auth/popup-blocked': '팝업이 차단되었습니다. 팝업 허용 후 다시 시도해주세요.',
    'auth/network-request-failed': '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.',
    'auth/too-many-requests': '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.'
  };

  const msg = messages[error.code] || '로그인에 실패했습니다. 다시 시도해주세요.';
  alert(msg);
}

// ─── 전역 노출 (HTML onclick에서 접근 가능하도록) ───
// head의 가드 스크립트가 window.loginWithXxx를 선점해두었으므로,
// 진짜 함수는 _real_loginWithXxx 로 넣어두면 가드가 이를 호출해줌
window._real_loginWithGoogle = loginWithGoogle;
window._real_loginWithKakao  = loginWithKakao;
window._real_loginWithNaver  = loginWithNaver;
// 모달 토글과 로그아웃은 그냥 덮어써도 안전
window.openLoginModal = openLoginModal;
window.closeLoginModal = closeLoginModal;
window.logout = logout;
console.log('[auth] firebase-auth module loaded, real handlers registered');

// ─── 초기화 ───
document.addEventListener('DOMContentLoaded', () => {
  // Firebase 사전 로드 (성능 최적화)
  loadFirebase().catch(console.error);
});

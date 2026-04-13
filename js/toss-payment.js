/**
 * HighPlus 토스페이먼츠 결제 모듈
 * - Ai실장 월 구독 결제 (빌링키 방식)
 * - 대행 서비스 단건 결제
 *
 * [설정 방법]
 * 1. 토스페이먼츠 가입: https://developers.tosspayments.com
 * 2. 테스트 클라이언트 키 발급 → TOSS_CLIENT_KEY 에 입력
 * 3. 시크릿 키 → Netlify 환경변수 TOSS_SECRET_KEY 에 설정
 * 4. 프로덕션 전환 시 라이브 키로 교체
 *
 * [조코딩 방식 참고]
 * - 프론트: TossPayments SDK로 결제창 호출
 * - 백엔드: Netlify Functions에서 결제 승인 API 호출
 */

// ─── 설정 ───
const TOSS_CLIENT_KEY = 'test_ck_eqRGgYO1r5M06j6dzJXbrQnN2Eya'; // 하이플러스 토스 테스트 클라이언트 키
const PAYMENT_SUCCESS_URL = window.location.origin + '/payment-success.html';
const PAYMENT_FAIL_URL = window.location.origin + '/payment-fail.html';

// ─── 상품 정보 ───
const PRODUCTS = {
  ai_manager: {
    name: 'Ai실장 월 구독',
    amount: 250000,
    vat: 25000,
    totalAmount: 275000,  // VAT 포함
    type: 'subscription',  // 구독 결제
    description: 'Ai실장 블로그 자동화 프로그램 (월 24건)'
  },
  agency_basic: {
    name: '마케팅 대행 서비스',
    amount: 900000,
    vat: 90000,
    totalAmount: 990000,  // VAT 포함
    type: 'onetime',       // 단건 결제
    description: '하이플러스 마케팅 대행 (브랜딩 블로그 + 플레이스 최적화)'
  }
};

// ─── 토스 SDK 로드 ───
let tossPayments = null;
let tossReady = false;

async function loadTossSDK() {
  if (tossReady) return;

  return new Promise((resolve, reject) => {
    if (window.TossPayments) {
      tossPayments = window.TossPayments(TOSS_CLIENT_KEY);
      tossReady = true;
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.tosspayments.com/v1/payment';
    script.onload = () => {
      tossPayments = window.TossPayments(TOSS_CLIENT_KEY);
      tossReady = true;
      resolve();
    };
    script.onerror = () => reject(new Error('토스페이먼츠 SDK 로드 실패'));
    document.head.appendChild(script);
  });
}

// ─── 주문번호 생성 ───
function generateOrderId() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `HP${date}-${random}`;
}

// ─── Ai실장 구독 결제 (빌링키 발급) ───
async function requestSubscription() {
  // 로그인 확인
  if (!window.currentUser) {
    alert('로그인이 필요합니다.');
    openLoginModal();
    return;
  }

  await loadTossSDK();

  const orderId = generateOrderId();
  const product = PRODUCTS.ai_manager;
  const customerKey = window.currentUser.uid;  // Firebase UID를 고객 키로 사용

  try {
    // 빌링키 발급 요청 (카드 자동결제 등록)
    await tossPayments.requestBillingAuth('카드', {
      customerKey: customerKey,
      successUrl: `${window.location.origin}/.netlify/functions/billing-success?orderId=${orderId}&productId=ai_manager&uid=${customerKey}`,
      failUrl: PAYMENT_FAIL_URL,
      customerEmail: window.currentUser.email || '',
      customerName: window.currentUser.name || '회원'
    });
  } catch (error) {
    if (error.code === 'USER_CANCEL') {
      console.log('사용자가 결제를 취소했습니다.');
    } else {
      console.error('결제 요청 실패:', error);
      alert('결제 요청에 실패했습니다. 다시 시도해주세요.');
    }
  }
}

// ─── 대행 서비스 단건 결제 ───
async function requestOneTimePayment(productId) {
  if (!window.currentUser) {
    alert('로그인이 필요합니다.');
    openLoginModal();
    return;
  }

  await loadTossSDK();

  const product = PRODUCTS[productId];
  if (!product) {
    alert('상품 정보를 찾을 수 없습니다.');
    return;
  }

  const orderId = generateOrderId();

  try {
    await tossPayments.requestPayment('카드', {
      amount: product.totalAmount,
      orderId: orderId,
      orderName: product.name,
      successUrl: `${window.location.origin}/.netlify/functions/payment-confirm?orderId=${orderId}&productId=${productId}`,
      failUrl: PAYMENT_FAIL_URL,
      customerEmail: window.currentUser.email || '',
      customerName: window.currentUser.name || '회원'
    });
  } catch (error) {
    if (error.code === 'USER_CANCEL') {
      console.log('사용자가 결제를 취소했습니다.');
    } else {
      console.error('결제 요청 실패:', error);
      alert('결제 요청에 실패했습니다. 다시 시도해주세요.');
    }
  }
}

// ─── 결제 모달 제어 ───

function openPaymentModal() {
  if (!window.currentUser) {
    alert('로그인 후 이용해주세요.');
    openLoginModal();
    return;
  }
  const modal = document.getElementById('payment-modal');
  if (modal) modal.style.display = 'flex';
}

function closePaymentModal() {
  const modal = document.getElementById('payment-modal');
  if (modal) modal.style.display = 'none';
}

// ─── 유저 로그인 콜백 (firebase-auth.js에서 호출) ───
window.onUserReady = function (user) {
  console.log('결제 모듈: 유저 로그인 확인', user.name);
  // 결제 버튼 활성화 등 추가 로직
  const payBtns = document.querySelectorAll('.pay-btn');
  payBtns.forEach(btn => {
    btn.disabled = false;
    btn.style.opacity = '1';
  });
};

// ─── 초기화 ───
document.addEventListener('DOMContentLoaded', () => {
  // 토스 SDK 사전 로드
  loadTossSDK().catch(console.error);
});

/**
 * 토스페이먼츠 빌링키 발급 성공 → 첫 결제 실행
 * - Ai실장 구독: 빌링키 발급 후 즉시 첫 달 결제
 *
 * [Netlify 환경변수 설정 필요]
 *   TOSS_SECRET_KEY = test_sk_XXXXXX (토스 시크릿키)
 */
exports.handler = async (event) => {
  const { authKey, customerKey, orderId, productId, uid } = event.queryStringParameters || {};

  if (!authKey || !customerKey) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      body: '<html><body><h2>빌링 인증 정보가 올바르지 않습니다.</h2><a href="/">홈으로 돌아가기</a></body></html>'
    };
  }

  const secretKey = process.env.TOSS_SECRET_KEY;
  const encryptedKey = Buffer.from(secretKey + ':').toString('base64');

  try {
    // 1단계: 빌링키 발급
    const billingResponse = await fetch('https://api.tosspayments.com/v1/billing/authorizations/issue', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${encryptedKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ authKey, customerKey })
    });

    const billingResult = await billingResponse.json();

    if (!billingResponse.ok) {
      console.error('빌링키 발급 실패:', billingResult);
      return {
        statusCode: 302,
        headers: {
          'Location': `/payment-fail.html?code=${billingResult.code}&message=${encodeURIComponent(billingResult.message)}`
        }
      };
    }

    const billingKey = billingResult.billingKey;

    // 2단계: 빌링키로 첫 달 결제 실행
    const paymentOrderId = orderId || `HP-SUB-${Date.now()}`;
    const amount = 275000; // Ai실장 25만원 + VAT

    const payResponse = await fetch(`https://api.tosspayments.com/v1/billing/${billingKey}`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${encryptedKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        customerKey,
        amount,
        orderId: paymentOrderId,
        orderName: 'Ai실장 월 구독 (첫 달)',
        customerEmail: '',
        taxFreeAmount: 0
      })
    });

    const payResult = await payResponse.json();

    if (payResponse.ok) {
      // TODO: 여기서 DB(Firestore 등)에 구독 정보 저장
      // - uid, billingKey, 구독시작일, 다음결제일, 잔여건수(24건) 등
      console.log('구독 결제 성공:', {
        uid,
        billingKey,
        orderId: paymentOrderId,
        amount,
        subscribedAt: new Date().toISOString()
      });

      return {
        statusCode: 302,
        headers: {
          'Location': `/payment-success.html?orderId=${paymentOrderId}&amount=${amount}&type=subscription`
        }
      };
    } else {
      console.error('첫 달 결제 실패:', payResult);
      return {
        statusCode: 302,
        headers: {
          'Location': `/payment-fail.html?code=${payResult.code}&message=${encodeURIComponent(payResult.message)}`
        }
      };
    }
  } catch (error) {
    console.error('서버 오류:', error);
    return {
      statusCode: 302,
      headers: {
        'Location': `/payment-fail.html?code=SERVER_ERROR&message=${encodeURIComponent('서버 오류가 발생했습니다.')}`
      }
    };
  }
};

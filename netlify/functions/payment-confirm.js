/**
 * 토스페이먼츠 단건 결제 승인 API
 * - 프론트에서 결제 완료 후 이 함수로 리다이렉트
 * - paymentKey, orderId, amount를 받아서 토스 API로 승인 요청
 *
 * [Netlify 환경변수 설정 필요]
 *   TOSS_SECRET_KEY = test_sk_XXXXXX (토스 시크릿키)
 */
exports.handler = async (event) => {
  const { paymentKey, orderId, amount } = event.queryStringParameters || {};

  if (!paymentKey || !orderId || !amount) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      body: '<html><body><h2>결제 정보가 올바르지 않습니다.</h2><a href="/">홈으로 돌아가기</a></body></html>'
    };
  }

  const secretKey = process.env.TOSS_SECRET_KEY;
  const encryptedKey = Buffer.from(secretKey + ':').toString('base64');

  try {
    const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${encryptedKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ paymentKey, orderId, amount: Number(amount) })
    });

    const result = await response.json();

    if (response.ok) {
      // 결제 승인 성공 → 성공 페이지로 리다이렉트
      return {
        statusCode: 302,
        headers: {
          'Location': `/payment-success.html?orderId=${orderId}&amount=${amount}&method=${encodeURIComponent(result.method || '카드')}`
        }
      };
    } else {
      // 결제 승인 실패
      console.error('결제 승인 실패:', result);
      return {
        statusCode: 302,
        headers: {
          'Location': `/payment-fail.html?code=${result.code}&message=${encodeURIComponent(result.message)}`
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

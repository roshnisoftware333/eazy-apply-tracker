export async function handler(event) {
  const { code } = JSON.parse(event.body || '{}');
  if (!globalThis.latestOTP) {
    return { statusCode: 400, body: 'No OTP generated' };
  }

  const { code: savedCode, time } = globalThis.latestOTP;
  const expired = Date.now() - time > 5 * 60 * 1000;

  if (expired) return { statusCode: 400, body: 'OTP expired' };
  if (String(code) !== String(savedCode)) return { statusCode: 401, body: 'Invalid OTP' };

  return { statusCode: 200, body: JSON.stringify({ success: true }) };
}

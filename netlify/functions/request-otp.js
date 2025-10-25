import Mailjet from 'node-mailjet';

export async function handler(event) {
  const { email } = JSON.parse(event.body || '{}');
  const presetEmail = 'mohitnathwani55@gmail.com';

  if (!email || email.toLowerCase() !== presetEmail.toLowerCase()) {
    return { statusCode: 401, body: 'Unauthorized email' };
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);
  const timestamp = Date.now();

  // Store in memory (temporary) — in real use, Redis or Firestore would store this
  globalThis.latestOTP = { code: otp, time: timestamp };

  // Initialize Mailjet
  const mailjet = new Mailjet({
    apiKey: process.env.MJ_APIKEY_PUBLIC,
    apiSecret: process.env.MJ_APIKEY_PRIVATE,
  });

  // Send OTP email
  try {
    await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: { Email: 'no-reply@eazyapplytracker.com', Name: 'Eazy Apply Tracker' },
          To: [{ Email: presetEmail }],
          Subject: 'Your OTP for Eazy Apply Tracker Login',
          HTMLPart: `
            <div style="font-family:Arial,sans-serif;background:#f8fafc;padding:20px;border-radius:8px;">
              <h2 style="color:#2563EB;">Your OTP Code</h2>
              <p style="font-size:18px;">Use the code below to log in:</p>
              <p style="font-size:28px;font-weight:bold;color:#1E40AF;">${otp}</p>
              <p style="font-size:14px;color:#475569;">This code is valid for 5 minutes.</p>
            </div>`,
        },
      ],
    });

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    return { statusCode: 500, body: 'Mailjet error: ' + err.message };
  }
}

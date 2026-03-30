const RESEND_API_KEY = process.env.NEXT_PUBLIC_RESEND_API_KEY || '';

export async function sendEmailViaResend(
  to: string,
  subject: string,
  html: string
): Promise<boolean> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'MemorAI <noreply@memorai.app>',
      to: [to],
      subject,
      html,
    }),
  });

  return res.ok;
}

const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1';

export interface EmailMessage {
  id: string;
  threadId: string;
  from: string;
  to: string;
  subject: string;
  snippet: string;
  date: string;
  body: string;
  isRead: boolean;
  classification?: string;
}

export async function fetchEmails(
  accessToken: string,
  maxResults = 20
): Promise<EmailMessage[]> {
  const res = await fetch(
    `${GMAIL_API_BASE}/users/me/messages?maxResults=${maxResults}&labelIds=INBOX`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!res.ok) return [];

  const data = await res.json();
  const messages: EmailMessage[] = [];

  for (const msg of data.messages || []) {
    const detail = await fetch(
      `${GMAIL_API_BASE}/users/me/messages/${msg.id}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    if (!detail.ok) continue;
    const email = await detail.json();
    const headers = email.payload?.headers || [];
    const getHeader = (name: string) =>
      headers.find(
        (h: { name: string; value: string }) =>
          h.name.toLowerCase() === name.toLowerCase()
      )?.value || '';

    messages.push({
      id: email.id,
      threadId: email.threadId,
      from: getHeader('from'),
      to: getHeader('to'),
      subject: getHeader('subject'),
      snippet: email.snippet || '',
      date: getHeader('date'),
      body: extractBody(email.payload),
      isRead: !email.labelIds?.includes('UNREAD'),
    });
  }

  return messages;
}

function extractBody(payload: {
  mimeType?: string;
  body?: { data?: string };
  parts?: Array<{ mimeType?: string; body?: { data?: string } }>;
}): string {
  if (payload.body?.data) {
    return atob(
      payload.body.data.replace(/-/g, '+').replace(/_/g, '/')
    );
  }
  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === 'text/plain' && part.body?.data) {
        return atob(
          part.body.data.replace(/-/g, '+').replace(/_/g, '/')
        );
      }
    }
  }
  return '';
}

export async function sendEmail(
  accessToken: string,
  to: string,
  subject: string,
  body: string
): Promise<boolean> {
  const raw = btoa(
    `To: ${to}\r\nSubject: ${subject}\r\nContent-Type: text/plain; charset=utf-8\r\n\r\n${body}`
  )
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const res = await fetch(`${GMAIL_API_BASE}/users/me/messages/send`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw }),
  });

  return res.ok;
}

export async function draftEmail(
  accessToken: string,
  to: string,
  subject: string,
  body: string
): Promise<boolean> {
  const raw = btoa(
    `To: ${to}\r\nSubject: ${subject}\r\nContent-Type: text/plain; charset=utf-8\r\n\r\n${body}`
  )
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const res = await fetch(`${GMAIL_API_BASE}/users/me/drafts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: { raw } }),
  });

  return res.ok;
}

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export interface TurnstileResult {
  success: boolean;
  errorCodes?: string[];
}

interface SiteVerifyResponse {
  success: boolean;
  'error-codes'?: string[];
}


export async function verifyTurnstile(
  token: string | null,
  secret: string | undefined,
  remoteIP?: string
): Promise<TurnstileResult> {
  if (!secret) {
    console.error('TURNSTILE_SECRET is not set in environment variables');
    return { success: false, errorCodes: ['missing-secret'] };
  }

  if (!token) {
    return { success: false, errorCodes: ['missing-input-response'] };
  }

  const formData = new URLSearchParams();
  formData.append('secret', secret);
  formData.append('response', token);
  if (remoteIP) {
    formData.append('remoteip', remoteIP);
  }

  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
    });

    const data = (await response.json()) as SiteVerifyResponse;
    return { success: data.success === true, errorCodes: data['error-codes'] };
  } catch (error) {
    console.error('Turnstile siteverify error:', error);
    return { success: false, errorCodes: ['internal-error'] };
  }
}

import dns from 'dns';

/**
 * email-verifier.ts — Server-side mailbox deliverability verification.
 *
 * Verifies email deliverability using multi-stage checks:
 * 1. RFC-5322 Syntax validation
 * 2. Disposable email domain detection
 * 3. DNS MX record resolution
 * 4. Mailbox-level deliverability provider:
 *    - Abstract API (Email Reputation & Deliverability API / Email Validation API)
 *    - MailerSend Email Verification API
 *
 * Strict Classification Rules:
 * - Confirmed valid & deliverable -> DELIVERABLE
 * - Confirmed nonexistent / undeliverable / invalid mailbox -> UNDELIVERABLE
 * - Temporary / disposable address -> DISPOSABLE
 * - Catch-all / unknown / inconclusive -> INCONCLUSIVE
 * - Provider unreachable / timeout / rate-limit -> UNAVAILABLE
 */

export const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

const KNOWN_DISPOSABLE_DOMAINS = new Set([
  'mailinator.com',
  'tempmail.com',
  'temp-mail.org',
  '10minutemail.com',
  'guerrillamail.com',
  'guerrillamailblock.com',
  'throwawaymail.com',
  'yopmail.com',
  'sharklasers.com',
  'dispostable.com',
  'trashmail.com',
  'fakemailgenerator.com',
  'burnermail.io',
  'nada.ltd',
  'getairmail.com',
  'mohmal.com',
  'crazymailing.com',
  'generator.email',
  'tempmailaddress.com',
  'inboxkitten.com',
  'mytemp.email',
  'maildrop.cc',
]);

export type VerificationVerdict =
  | { status: 'DELIVERABLE'; provider: string }
  | { status: 'UNDELIVERABLE'; reason: string; message: string }
  | { status: 'DISPOSABLE'; message: string }
  | { status: 'INCONCLUSIVE'; reason: string; message: string }
  | { status: 'UNAVAILABLE'; error: string; message: string };

/**
 * Perform DNS MX record lookup on the domain.
 */
async function checkDnsMx(domain: string): Promise<'valid' | 'invalid_domain' | 'dns_error'> {
  try {
    const records = await dns.promises.resolveMx(domain);
    if (records && records.length > 0) {
      return 'valid';
    }
    return 'invalid_domain';
  } catch (err: unknown) {
    const code = (err as NodeJS.ErrnoException)?.code;
    if (code === 'ENOTFOUND' || code === 'ENODATA' || code === 'ESERVFAIL') {
      return 'invalid_domain';
    }
    return 'dns_error';
  }
}

/**
 * Verify via MailerSend Email Verification API
 * POST https://api.mailersend.com/v1/email-verification/verify
 */
async function verifyWithMailerSend(email: string, apiKey: string): Promise<VerificationVerdict> {
  try {
    const res = await fetch('https://api.mailersend.com/v1/email-verification/verify', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email }),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.error('[SAVEN verifyEmail] MailerSend HTTP status:', res.status, errText);
      return {
        status: 'UNAVAILABLE',
        error: `mailersend_http_${res.status}`,
        message: 'Unable to verify your email address right now. Please try again.',
      };
    }

    const data = await res.json();
    const resultStatus = (data?.data?.status || data?.status || data?.result || '').toLowerCase();

    if (resultStatus === 'disposable' || data?.data?.is_disposable === true) {
      return {
        status: 'DISPOSABLE',
        message: 'Temporary email addresses are not accepted. Please use your regular email address.',
      };
    }

    if (resultStatus === 'valid' || resultStatus === 'deliverable') {
      return { status: 'DELIVERABLE', provider: 'mailersend' };
    }

    if (resultStatus === 'invalid' || resultStatus === 'undeliverable') {
      return {
        status: 'UNDELIVERABLE',
        reason: 'mailersend_undeliverable',
        message: 'Invalid email address. Please enter a valid email address.',
      };
    }

    // catch_all, risky, unknown
    return {
      status: 'INCONCLUSIVE',
      reason: `mailersend_${resultStatus}`,
      message: 'Unable to verify your email address right now. Please try again.',
    };
  } catch (err: unknown) {
    console.error('[SAVEN verifyEmail] MailerSend error:', err instanceof Error ? err.message : err);
    return {
      status: 'UNAVAILABLE',
      error: 'mailersend_fetch_error',
      message: 'Unable to verify your email address right now. Please try again.',
    };
  }
}

/**
 * Verify via Abstract API.
 * Supports both:
 * 1. Email Reputation & Deliverability API (https://emailreputation.abstractapi.com/v1/)
 * 2. Legacy Email Validation API (https://emailvalidation.abstractapi.com/v1/)
 */
async function verifyWithAbstractApi(email: string, apiKey: string): Promise<VerificationVerdict> {
  const endpoints = [
    `https://emailreputation.abstractapi.com/v1/?api_key=${apiKey}&email=${encodeURIComponent(email)}`,
    `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${encodeURIComponent(email)}`,
  ];

  let lastError = '';

  for (const url of endpoints) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
      const data = await res.json();

      if (!res.ok) {
        lastError = `http_${res.status}_${data?.error?.code || 'error'}`;
        console.warn(`[SAVEN verifyEmail] Abstract API endpoint (${new URL(url).hostname}) returned:`, res.status, data?.error?.code);
        // If 401 or 404, try next endpoint in list
        if (res.status === 401 || res.status === 404) {
          continue;
        }
        return {
          status: 'UNAVAILABLE',
          error: lastError,
          message: 'Unable to verify your email address right now. Please try again.',
        };
      }

      // ── Parse Response (handles both Email Reputation and Email Validation schemas) ──

      // 1. Check disposable
      const isDisposable =
        data?.email_quality?.is_disposable === true ||
        data?.is_disposable_email?.value === true ||
        data?.is_disposable === true;

      if (isDisposable) {
        return {
          status: 'DISPOSABLE',
          message: 'Temporary email addresses are not accepted. Please use your regular email address.',
        };
      }

      // 2. Check MX validity from provider
      const isMxValid =
        data?.email_deliverability?.is_mx_valid !== false &&
        data?.is_mx_found?.value !== false;

      if (!isMxValid || data?.email_deliverability?.status_detail === 'dns_record_not_found') {
        return {
          status: 'UNDELIVERABLE',
          reason: 'abstract_no_mx',
          message: 'Invalid email address. Please enter a valid email address.',
        };
      }

      // 3. Check deliverability status
      const status = (
        data?.email_deliverability?.status ||
        data?.deliverability ||
        ''
      ).toLowerCase();

      const statusDetail = (
        data?.email_deliverability?.status_detail ||
        ''
      ).toLowerCase();

      const isSmtpValid =
        data?.email_deliverability?.is_smtp_valid ??
        data?.is_smtp_valid?.value;

      const isCatchAll =
        data?.email_quality?.is_catchall === true ||
        data?.is_catchall_email?.value === true;

      const qualityScore = parseFloat(data?.email_quality?.score ?? data?.quality_score ?? '1.0');

      // Confirmed Undeliverable
      if (
        status === 'undeliverable' ||
        statusDetail === 'invalid_mailbox' ||
        isSmtpValid === false ||
        (status === 'risky' && qualityScore < 0.5)
      ) {
        return {
          status: 'UNDELIVERABLE',
          reason: `abstract_undeliverable_${statusDetail || status}`,
          message: 'Invalid email address. Please enter a valid email address.',
        };
      }

      // Catch-all domain (cannot establish specific mailbox existence definitively)
      if (isCatchAll) {
        return {
          status: 'INCONCLUSIVE',
          reason: 'abstract_catch_all',
          message: 'Unable to verify your email address right now. Please try again.',
        };
      }

      // Confirmed Deliverable
      if (
        status === 'deliverable' &&
        (isSmtpValid === true || isSmtpValid === undefined)
      ) {
        return { status: 'DELIVERABLE', provider: 'abstractapi' };
      }

      // Inconclusive / Unknown / Risky with moderate score
      if (status === 'unknown' || status === 'risky') {
        return {
          status: 'INCONCLUSIVE',
          reason: `abstract_${status}`,
          message: 'Unable to verify your email address right now. Please try again.',
        };
      }

      // Unexpected status — treat conservatively as inconclusive
      return {
        status: 'INCONCLUSIVE',
        reason: 'abstract_unexpected_status',
        message: 'Unable to verify your email address right now. Please try again.',
      };
    } catch (err: unknown) {
      lastError = err instanceof Error ? err.message : 'network_error';
      console.warn(`[SAVEN verifyEmail] Abstract API request failed for ${new URL(url).hostname}:`, lastError);
    }
  }

  // All endpoints failed
  console.error('[SAVEN verifyEmail] All Abstract API endpoints failed:', lastError);
  return {
    status: 'UNAVAILABLE',
    error: `abstract_all_endpoints_failed_${lastError}`,
    message: 'Unable to verify your email address right now. Please try again.',
  };
}

/**
 * Main email verification entry point.
 */
export async function verifyEmailAddress(rawEmail: string): Promise<VerificationVerdict> {
  const email = (rawEmail ?? '').trim().toLowerCase();

  // 1. Syntax check (RFC-5322 compliant)
  if (!email || !EMAIL_REGEX.test(email)) {
    return {
      status: 'UNDELIVERABLE',
      reason: 'invalid_syntax',
      message: 'Invalid email address. Please enter a valid email address.',
    };
  }

  const [, domain] = email.split('@');
  if (!domain) {
    return {
      status: 'UNDELIVERABLE',
      reason: 'missing_domain',
      message: 'Invalid email address. Please enter a valid email address.',
    };
  }

  // 2. Known disposable domains check
  if (KNOWN_DISPOSABLE_DOMAINS.has(domain)) {
    return {
      status: 'DISPOSABLE',
      message: 'Temporary email addresses are not accepted. Please use your regular email address.',
    };
  }

  // 3. DNS MX check (fast filter before consuming API quota)
  const mxCheck = await checkDnsMx(domain);
  if (mxCheck === 'invalid_domain') {
    return {
      status: 'UNDELIVERABLE',
      reason: 'dns_no_mx',
      message: 'Invalid email address. Please enter a valid email address.',
    };
  }

  // 4. Verification Provider Dispatch
  const mailerSendKey = process.env.MAILERSEND_API_KEY?.trim();
  if (mailerSendKey && !mailerSendKey.startsWith('REPLACE_')) {
    return verifyWithMailerSend(email, mailerSendKey);
  }

  const abstractApiKey = process.env.ABSTRACT_API_KEY?.trim();
  if (abstractApiKey && !abstractApiKey.startsWith('REPLACE_')) {
    return verifyWithAbstractApi(email, abstractApiKey);
  }

  // 5. If no real-time verification provider API key is configured
  console.error('[SAVEN verifyEmail] No active email verification provider configured in environment variables.');
  return {
    status: 'UNAVAILABLE',
    error: 'no_provider_configured',
    message: 'Unable to verify your email address right now. Please try again.',
  };
}

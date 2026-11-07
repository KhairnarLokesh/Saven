/**
 * email-auth.ts — Server-side only.
 *
 * Issues and verifies a short-lived HMAC-SHA256 signed authorization token.
 * The token proves that /api/verify-email confirmed a specific email address.
 * /api/project-inquiry requires this token; without it the inquiry is rejected.
 *
 * Token format (base64url): "auth:<email>:<expiresAt>:<hmac>"
 * TTL: 15 minutes — enough to fill and submit the form after verification.
 */

import { createHmac, timingSafeEqual } from 'crypto';

const SECRET =
  process.env.EMAIL_AUTH_SECRET ??
  'dev-email-auth-secret-REPLACE-IN-PRODUCTION-with-32+-random-bytes';

const AUTH_TTL_MS = 15 * 60 * 1000; // 15 minutes

function sign(payload: string): string {
  return createHmac('sha256', SECRET).update(payload).digest('hex');
}

/** Call this inside /api/verify-email after a DELIVERABLE verdict. */
export function generateAuthToken(email: string): string {
  const expiresAt = Date.now() + AUTH_TTL_MS;
  const payload = `auth:${email.toLowerCase().trim()}:${expiresAt}`;
  const sig = sign(payload);
  return Buffer.from(`${payload}:${sig}`).toString('base64url');
}

export type AuthTokenResult =
  | { valid: true; email: string }
  | { valid: false; reason: 'expired' | 'tampered' | 'email_mismatch' | 'malformed' };

/** Call this inside /api/project-inquiry to enforce server-side verification. */
export function validateAuthToken(token: string, submittedEmail: string): AuthTokenResult {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8');
    // Format: "auth:<email>:<expiresAt>:<sig>"
    // Email can contain ':', so split from the right
    const lastColon = decoded.lastIndexOf(':');
    const secondLastColon = decoded.lastIndexOf(':', lastColon - 1);
    if (lastColon < 0 || secondLastColon < 0) return { valid: false, reason: 'malformed' };

    const sig = decoded.slice(lastColon + 1);
    const expiresAtStr = decoded.slice(secondLastColon + 1, lastColon);
    const payload = decoded.slice(0, lastColon); // "auth:<email>:<expiresAt>"

    // Constant-time HMAC comparison
    const expectedSig = sign(payload);
    const sBuf = Buffer.from(sig, 'hex');
    const eBuf = Buffer.from(expectedSig, 'hex');
    if (sBuf.length !== eBuf.length || !timingSafeEqual(sBuf, eBuf)) {
      return { valid: false, reason: 'tampered' };
    }

    if (Date.now() > parseInt(expiresAtStr, 10)) {
      return { valid: false, reason: 'expired' };
    }

    // Extract email from payload: "auth:<email>:<expiresAt>"
    const withoutPrefix = payload.slice('auth:'.length);
    const emailEndIdx = withoutPrefix.lastIndexOf(':');
    const tokenEmail = withoutPrefix.slice(0, emailEndIdx);

    if (tokenEmail !== submittedEmail.toLowerCase().trim()) {
      return { valid: false, reason: 'email_mismatch' };
    }

    return { valid: true, email: tokenEmail };
  } catch {
    return { valid: false, reason: 'malformed' };
  }
}


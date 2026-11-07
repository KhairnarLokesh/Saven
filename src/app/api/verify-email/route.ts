import { NextRequest, NextResponse } from 'next/server';
import { generateAuthToken } from '@/lib/email-auth';
import { verifyEmailAddress, EMAIL_REGEX } from '@/lib/email-verifier';

/**
 * POST /api/verify-email
 *
 * Verifies email deliverability before form submission.
 * - Confirmed valid & deliverable -> returns { ok: true, authToken }
 * - Confirmed invalid / nonexistent -> returns { ok: false, message: 'Invalid email address. Please enter a valid email address.' }
 * - Disposable address -> returns { ok: false, message: 'Temporary email addresses are not accepted. Please use your regular email address.' }
 * - Inconclusive or provider unavailable -> returns { ok: false, message: 'Unable to verify your email address right now. Please try again.' }
 */

// Per-IP rate limiting: 10 requests / 60 s
const rl = new Map<string, { count: number; reset: number }>();
function rateOk(ip: string): boolean {
  const now = Date.now();
  const rec = rl.get(ip);
  if (!rec || now > rec.reset) {
    rl.set(ip, { count: 1, reset: now + 60_000 });
    return true;
  }
  if (rec.count >= 10) return false;
  rec.count += 1;
  return true;
}

type OkResponse = { ok: true; authToken: string };
type ErrResponse = { ok: false; code: string; message: string };

export async function POST(request: NextRequest): Promise<NextResponse<OkResponse | ErrResponse>> {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'anon';

  if (!rateOk(ip)) {
    return NextResponse.json(
      { ok: false, code: 'rate_limited', message: 'Too many requests. Please wait a moment and try again.' },
      { status: 429 }
    );
  }

  let email: string;
  try {
    const body = await request.json();
    email = (body?.email ?? '').trim().toLowerCase();
  } catch {
    return NextResponse.json(
      { ok: false, code: 'bad_request', message: 'Invalid request.' },
      { status: 400 }
    );
  }

  // Basic syntax check
  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { ok: false, code: 'invalid_format', message: 'Invalid email address. Please enter a valid email address.' },
      { status: 400 }
    );
  }

  // Run full deliverability verification
  const verdict = await verifyEmailAddress(email);

  switch (verdict.status) {
    case 'DELIVERABLE': {
      const authToken = generateAuthToken(email);
      return NextResponse.json({ ok: true, authToken });
    }

    case 'UNDELIVERABLE':
      return NextResponse.json(
        { ok: false, code: verdict.reason, message: verdict.message },
        { status: 400 }
      );

    case 'DISPOSABLE':
      return NextResponse.json(
        { ok: false, code: 'disposable', message: verdict.message },
        { status: 400 }
      );

    case 'INCONCLUSIVE':
      return NextResponse.json(
        { ok: false, code: 'inconclusive', message: verdict.message },
        { status: 400 }
      );

    case 'UNAVAILABLE':
    default:
      return NextResponse.json(
        { ok: false, code: 'provider_unavailable', message: verdict.message },
        { status: 503 }
      );
  }
}

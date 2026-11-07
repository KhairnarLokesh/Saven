import { NextRequest, NextResponse } from 'next/server';
import dns from 'dns';
import { validateAuthToken } from '@/lib/email-auth';
import { Resend } from 'resend';
import {
  renderProjectInquiryHtml,
  renderProjectInquiryText,
  type ProjectInquiryData,
} from '@/lib/email-template';

const ALLOWED_SERVICES = [
  'Custom Software Development',
  'Software Enhancement & Modernization',
  'College & Academic Projects',
  'Mobile App Development',
  'Website Design & Development',
  'End-to-End Project Development',
  'Other Technical Consulting',
];

const MAX_LENGTHS = {
  fullName: 100,
  email: 254,
  phone: 30,
  company: 150,
  service: 100,
  description: 5000,
};

// Basic in-memory rate limiting (per-instance)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (rateLimitMap.size > 1000) {
    for (const [key, val] of rateLimitMap.entries()) {
      if (now - val.lastReset > RATE_LIMIT_WINDOW) {
        rateLimitMap.delete(key);
      }
    }
  }

  if (!record || now - record.lastReset > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return true;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  record.count += 1;
  return true;
}

// RFC-5322-safe regex (mirrors frontend)
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

type MxResult = 'valid' | 'invalid_domain' | 'unavailable';

async function checkDomainMx(email: string): Promise<MxResult> {
  try {
    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain) return 'invalid_domain';
    const records = await dns.promises.resolveMx(domain);
    if (records && records.length > 0) return 'valid';
    return 'invalid_domain';
  } catch (err: unknown) {
    // ENOTFOUND = domain doesn't exist; ENODATA/ESERVFAIL = no MX records / transient
    const code = (err as NodeJS.ErrnoException).code;
    if (code === 'ENOTFOUND') return 'invalid_domain';
    // ENODATA: domain exists but no MX — treat conservatively as invalid
    if (code === 'ENODATA') return 'invalid_domain';
    // Any other DNS failure (ESERVFAIL, ETIMEDOUT, etc.) → don't block
    return 'unavailable';
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      'anonymous';

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Too many requests. Please wait a minute before submitting again.',
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { fullName, email, phone, company, service, description, website, emailAuthToken } = body;

    // ── Honeypot Bot Detection ────────────────────────────────────────────────
    if (website && typeof website === 'string' && website.trim().length > 0) {
      return NextResponse.json(
        {
          success: true,
          message: 'Thank you! Your project inquiry has been received. Our team will contact you soon.',
          referenceId: 'SVN-BOT',
        },
        { status: 200 }
      );
    }

    // ── Email Auth Token Enforcement ─────────────────────────────────────────
    // Requires a signed token issued by /api/verify-email.
    // Without a valid token the inquiry cannot proceed, regardless of other fields.
    if (!emailAuthToken || typeof emailAuthToken !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Email address verification is required before submitting an inquiry.' },
        { status: 403 }
      );
    }
    const authResult = validateAuthToken(emailAuthToken, typeof email === 'string' ? email.trim() : '');
    if (!authResult.valid) {
      const reason = authResult.reason;
      const msg =
        reason === 'expired'
          ? 'Your email verification has expired. Please verify your email address again.'
          : reason === 'email_mismatch'
          ? 'Email address mismatch. Please re-verify your email address.'
          : 'Invalid email verification. Please verify your email address before submitting.';
      return NextResponse.json({ success: false, message: msg }, { status: 403 });
    }

    // ── Server-Side Validation ────────────────────────────────────────────────
    const errors: Record<string, string> = {};

    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      errors.fullName = 'Full Name is required (minimum 2 characters).';
    } else if (fullName.trim().length > MAX_LENGTHS.fullName) {
      errors.fullName = `Full Name must be under ${MAX_LENGTHS.fullName} characters.`;
    }

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      errors.email = 'Please enter a valid email address.';
    } else if (email.trim().length > MAX_LENGTHS.email) {
      errors.email = `Email must be under ${MAX_LENGTHS.email} characters.`;
    }

    if (!service || typeof service !== 'string' || !ALLOWED_SERVICES.includes(service.trim())) {
      errors.service = 'Please select a valid service category.';
    }

    if (!description || typeof description !== 'string' || description.trim().length < 10) {
      errors.description = 'Please describe your project (minimum 10 characters).';
    } else if (description.trim().length > MAX_LENGTHS.description) {
      errors.description = `Description must be under ${MAX_LENGTHS.description} characters.`;
    }

    if (phone && typeof phone === 'string' && phone.trim().length > MAX_LENGTHS.phone) {
      errors.phone = `Phone number must be under ${MAX_LENGTHS.phone} characters.`;
    }

    if (company && typeof company === 'string' && company.trim().length > MAX_LENGTHS.company) {
      errors.company = `Company name must be under ${MAX_LENGTHS.company} characters.`;
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    // ── MX Domain Validation (runs only after syntax passes) ─────────────────
    if (email && typeof email === 'string' && EMAIL_REGEX.test(email.trim())) {
      const mxResult = await checkDomainMx(email.trim());
      if (mxResult === 'invalid_domain') {
        return NextResponse.json(
          {
            success: false,
            errors: { email: 'This email domain does not appear to be valid. Please check your email address.' },
          },
          { status: 400 }
        );
      }
      // mxResult === 'unavailable' → DNS failed transiently, allow submission through
    }

    // ── Sanitize Data ─────────────────────────────────────────────────────────
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    const referenceId = `SVN-${new Date().getFullYear()}-${randomHex}`;

    const sanitized: ProjectInquiryData = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone && typeof phone === 'string' && phone.trim() ? phone.trim() : 'Not provided',
      company: company && typeof company === 'string' && company.trim() ? company.trim() : 'Not provided',
      service: service.trim(),
      description: description.trim(),
    };

    // ── Resend Email Dispatch ─────────────────────────────────────────────────
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'SAVEN Studios <inquiries@savenstudios.in>';
    const toEmail = process.env.CONTACT_EMAIL || 'saven.studios@outlook.com';
    const templateId = process.env.RESEND_TEMPLATE_ID?.trim();
    const subject = `New Project Inquiry | ${sanitized.fullName}`;

    if (!resendApiKey || resendApiKey.startsWith('re_your_')) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          '[SAVEN Resend Simulation] RESEND_API_KEY is not configured or using placeholder. Simulating successful delivery for:',
          sanitized.fullName,
          `(${referenceId})`
        );
        return NextResponse.json(
          {
            success: true,
            message: 'Thank you! Your project inquiry has been received. Our team will contact you soon.',
            referenceId,
          },
          { status: 200 }
        );
      }

      console.error('[SAVEN Resend Error] RESEND_API_KEY is missing in production.');
      return NextResponse.json(
        {
          success: false,
          message: 'Unable to send your inquiry. Please try again.',
        },
        { status: 500 }
      );
    }

    const resend = new Resend(resendApiKey);

    let resendResponse: { data: { id: string } | null; error: Error | { message: string } | null };

    if (templateId) {
      // Step 4: Use hosted Resend template without passing html or text
      resendResponse = await resend.emails.send({
        from: fromEmail,
        to: toEmail,
        replyTo: sanitized.email,
        subject,
        template: {
          id: templateId,
          variables: {
            fullName: sanitized.fullName,
            email: sanitized.email,
            company: sanitized.company,
            phone: sanitized.phone,
            service: sanitized.service,
            description: sanitized.description,
          },
        },
      });

      // If hosted template dispatch encounters an issue, fallback to inline HTML
      if (resendResponse.error) {
        console.warn('[SAVEN] Hosted template dispatch failed, falling back to direct HTML:', resendResponse.error);
        resendResponse = await resend.emails.send({
          from: fromEmail,
          to: toEmail,
          replyTo: sanitized.email,
          subject,
          html: renderProjectInquiryHtml(sanitized),
          text: renderProjectInquiryText(sanitized),
        });
      }
    } else {
      // Step 4: Use inline HTML and plain-text fallback
      resendResponse = await resend.emails.send({
        from: fromEmail,
        to: toEmail,
        replyTo: sanitized.email,
        subject,
        html: renderProjectInquiryHtml(sanitized),
        text: renderProjectInquiryText(sanitized),
      });
    }

    if (resendResponse.error) {
      console.error('[SAVEN Resend Error]:', resendResponse.error);
      return NextResponse.json(
        {
          success: false,
          message: 'Unable to send your inquiry. Please try again.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you! Your project inquiry has been received. Our team will contact you soon.',
        referenceId,
        resendId: resendResponse.data?.id,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error('[SAVEN Project Inquiry Error]:', err instanceof Error ? err.message : 'Unknown error');
    return NextResponse.json(
      {
        success: false,
        message: 'Unable to send your inquiry. Please try again.',
      },
      { status: 500 }
    );
  }
}

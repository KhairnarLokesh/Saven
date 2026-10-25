import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, phone, company, service, budget, timeline, description } = body;

    const errors: Record<string, string> = {};

    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      errors.fullName = 'Please enter your full name (at least 2 characters).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      errors.email = 'Please provide a valid email address.';
    }

    if (!service || typeof service !== 'string' || service.trim().length === 0) {
      errors.service = 'Please select a required service category.';
    }

    if (!description || typeof description !== 'string' || description.trim().length < 10) {
      errors.description = 'Please describe your project or inquiry (at least 10 characters).';
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed. Please correct the highlighted fields.',
          errors,
        },
        { status: 400 }
      );
    }

    // Generate unique reference ID
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    const year = new Date().getFullYear();
    const referenceId = `SAVEN-${year}-${randomHex}`;

    const timestamp = new Date().toISOString();
    const sanitizedRecord = {
      referenceId,
      timestamp,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? String(phone).trim() : null,
      company: company ? String(company).trim() : null,
      service: service.trim(),
      budget: budget ? String(budget).trim() : 'Not specified',
      timeline: timeline ? String(timeline).trim() : 'Not specified',
      description: description.trim(),
    };

    // Log structured inquiry (production could dispatch via Resend/Sendgrid or write to DB)
    console.log('[SAVEN Contact API] New project inquiry received:', sanitizedRecord);

    return NextResponse.json(
      {
        success: true,
        message: 'Your project inquiry has been received. Our engineering team will review it and reply within 24 business hours.',
        referenceId,
        receivedAt: timestamp,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error('[SAVEN Contact API Error]:', err);
    return NextResponse.json(
      {
        success: false,
        message: 'An unexpected server error occurred while processing your inquiry. Please try again.',
      },
      { status: 500 }
    );
  }
}

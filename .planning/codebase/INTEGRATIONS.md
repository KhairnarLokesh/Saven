# Integrations & External Services

This document details all external service dependencies, internal API contracts, cloud integrations, and missing integration points.

---

## 1. Internal API Endpoints

The application currently exposes a single Next.js App Router API endpoint:

### `POST /api/contact`
- **Location:** [src/app/api/contact/route.ts](file:///k:/Coding%20Projects/Saven/src/app/api/contact/route.ts)
- **Role:** Handles contact form submissions and project scope estimations sent from the frontend.
- **Request Payload:**
  ```typescript
  {
    fullName: string;      // Required, min length 2
    email: string;         // Required, email regex validated
    phone?: string;        // Optional contact number
    company?: string;      // Optional organization name
    service: string;       // Required service selection
    budget?: string;       // Optional budget tier
    timeline?: string;     // Optional timeline requirement
    description: string;   // Required, min length 10
  }
  ```
- **Validation:** Server-side sanitization and dictionary validation returning `400` status with `{ success: false, message, errors }` on invalid inputs.
- **Response:**
  - Success (`200`): `{ success: true, message: string, referenceId: string, receivedAt: string }`
  - Error (`400` / `500`): `{ success: false, message: string, errors?: Record<string, string> }`
- **Current Backend Persistence:** Logs sanitized inquiry to `console.log` and returns a generated unique reference (`SAVEN-YYYY-XXXXX`).

---

## 2. External Services & Cloud Providers

| Provider | Purpose | Status | Details |
| :--- | :--- | :--- | :--- |
| **Vercel** | Hosting & CDN | Configured target | Recommended deployment platform per [README.md](file:///k:/Coding%20Projects/Saven/README.md) and Next.js defaults |
| **Google Fonts** | Typography CDN | Active | Loaded via `next/font/google` (`Space_Grotesk`) in [layout.tsx](file:///k:/Coding%20Projects/Saven/src/app/layout.tsx) with preconnect and zero layout shift |
| **Schema.org** | SEO Structured Data | Active | `ProfessionalService` JSON-LD schema injected into `<head>` in [layout.tsx](file:///k:/Coding%20Projects/Saven/src/app/layout.tsx) |
| **ReactBits Registry** | Component Sources | Configured | `@reactbits-starter` and `@reactbits-pro` registries declared in [components.json](file:///k:/Coding%20Projects/Saven/components.json) for shadcn CLI distribution |

---

## 3. External Social & Messaging Links

Outbound communication touchpoints configured in [siteConfig.ts](file:///k:/Coding%20Projects/Saven/src/data/siteConfig.ts):

| Channel | Identifier / URL | Usage |
| :--- | :--- | :--- |
| **Direct Email** | `support.saven@gmail.com` | Primary support and inquiries email |
| **WhatsApp** | `https://wa.me/18005550199` | Instant messaging link in siteConfig |
| **LinkedIn** | `https://www.linkedin.com/company/saven.studios/` | Official corporate profile |
| **Instagram** | `https://www.instagram.com/saven.studios/` | Agency creative and branding showcase |
| **GitHub** | `https://github.com/saven-agency` | Public open-source and client repository space |

---

## 4. Pending / Planned Integrations

The codebase has explicit placeholders and preparation for the following future integrations:

1. **Transactional Email Transport:**
   - [route.ts](file:///k:/Coding%20Projects/Saven/src/app/api/contact/route.ts#L57) has a comment to wire Resend or SendGrid for sending automatic receipt emails and dispatching notifications to the agency team.
2. **Database Persistence:**
   - Inquiries are currently transient (in memory/logs). Integration target for Supabase, PostgreSQL (Prisma/Drizzle), or DynamoDB to record leads.
3. **Analytics & Performance Monitoring:**
   - No Google Analytics 4, PostHog, or Vercel Web Analytics currently installed.
4. **Error Tracking & Telemetry:**
   - No Sentry or Datadog integration for tracking client-side WebGL crashes or server API failures.

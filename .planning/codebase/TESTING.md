# Testing Infrastructure & Strategy

This document outlines the current testing state, linting tools, validation gaps, and the recommended test roadmap for the SAVEN repository.

---

## 1. Current Testing State

| Test Layer | Status | Runner / Library | Existing Test Files |
| :--- | :--- | :--- | :--- |
| **Unit Tests** | **Not Implemented** | None | 0 files |
| **Integration Tests**| **Not Implemented** | None | 0 files |
| **API Route Tests** | **Not Implemented** | None | 0 files |
| **End-to-End (E2E)** | **Not Implemented** | None | 0 files |
| **Visual Regression**| **Not Implemented** | None | 0 files |

### Analysis:
There is currently **zero automated test coverage** in the project. The `package.json` contains no test scripts or test dependencies:
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint"
}
```

---

## 2. Static Analysis & Linting

### ESLint Configuration
- **File:** [eslint.config.mjs](file:///k:/Coding%20Projects/Saven/eslint.config.mjs)
- **Presets:**
  - `eslint-config-next/core-web-vitals`
  - `eslint-config-next/typescript`
- **Default Ignores:** `.next/**`, `out/**`, `build/**`, `next-env.d.ts`
- **Execution Command:** `npm run lint`

### TypeScript Compilation
- **File:** [tsconfig.json](file:///k:/Coding%20Projects/Saven/tsconfig.json)
- **Configuration:** `strict: true`, `noEmit: true`, `isolatedModules: true`
- **Execution Command:** `npx tsc --noEmit`

---

## 3. High-Priority Testing Targets

When introducing automated tests, prioritize the following critical components:

### A. API Validation & Security ([src/app/api/contact/route.ts](file:///k:/Coding%20Projects/Saven/src/app/api/contact/route.ts))
- Rejection of malformed JSON payloads.
- Rejection of invalid email addresses (`emailRegex`).
- Rejection of descriptions shorter than 10 characters.
- Proper generation and format verification of `referenceId` (`SAVEN-YYYY-XXXXX`).

### B. Interactive Scope Estimator ([src/components/Estimator.tsx](file:///k:/Coding%20Projects/Saven/src/components/Estimator.tsx))
- Platform toggling logic (adding and removing selected platforms).
- Feature capability selections.
- Accuracy of the formatted markdown summary passed to `onApplyEstimate`.

### C. Contact Form State Flow ([src/components/Contact.tsx](file:///k:/Coding%20Projects/Saven/src/components/Contact.tsx))
- Client-side validation triggers on blur / empty submit.
- Propagation of initial props (`initialService`, `initialDescription`) into active form state.
- Clipboard copy interaction for reference ID.

### D. WebGL / Canvas Resilience
- Graceful fallback when WebGL2 context creation fails (e.g., in low-end browsers or mobile webviews without hardware acceleration).

---

## 4. Recommended Testing Roadmap

### Step 1: Vitest & React Testing Library Setup
Install lightweight unit test tools compatible with Next.js 16 and React 19:
```bash
npm install -D vitest @testing-library/react @testing-library/dom jsdom
```
Add to `package.json`:
```json
"scripts": {
  "test": "vitest run",
  "test:watch": "vitest"
}
```

### Step 2: Route Handler Integration Tests
Write tests against `/api/contact` using the standard `NextRequest` simulation in Vitest:
- Test 400 response with missing fields.
- Test 200 response with valid payload.

### Step 3: Playwright E2E Suite
Install Playwright for end-to-end browser journeys:
```bash
npm install -D @playwright/test
```
Target critical flows:
1. User loads landing page and completes or skips the Shatter intro.
2. User scrolls to the Estimator, customizes a stack, and clicks "Transfer Configuration to Inquiry".
3. Form receives the configuration, user submits, and receives confirmation.

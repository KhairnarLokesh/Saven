# Coding Standards & Conventions

This document outlines the architectural patterns, styling conventions, naming rules, and code style established across the SAVEN codebase.

---

## 1. File Organization & Naming Patterns

| File Type | Naming Convention | Examples |
| :--- | :--- | :--- |
| **Section & Domain Components** | `PascalCase.tsx` | `Hero.tsx`, `Services.tsx`, `Estimator.tsx`, `Contact.tsx` |
| **Primitive / Registry UI Components** | `kebab-case.tsx` | `bending-marquee.tsx`, `text-morph.tsx`, `shatter-type.tsx` |
| **Static Data Fixtures** | `camelCase.ts` | `siteConfig.ts`, `services.ts`, `about.ts`, `process.ts` |
| **Utilities & Helpers** | `camelCase.ts` | `utils.ts` |
| **Type Definitions** | `index.ts` or `camelCase.ts` | `src/types/index.ts` |
| **Next.js App Router Conventions** | Reserved App Router names | `layout.tsx`, `page.tsx`, `route.ts`, `robots.ts`, `sitemap.ts` |
| **Component Stylesheets** | `PascalCase.css` | `FlyingButton.css`, `LightRays.css` |

---

## 2. Component Design & TypeScript Patterns

### A. Client Component Declarations
Because the application features heavy DOM animations, Canvas, WebGL, and stateful forms, interactive components must explicitly declare the `'use client'` directive as the very first line of the file:
```typescript
'use client';

import React, { useState, useEffect } from 'react';
```

### B. Interface & Props Typing
All component properties must be typed with an explicit TypeScript interface named `<ComponentName>Props`:
```typescript
interface ServicesProps {
  onSelectService: (serviceTitle: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectService }) => {
  // ...
};
```

### C. Class Name Composition
Dynamic class names must always be joined using the `cn()` utility (`clsx` + `tailwind-merge`) from `@/lib/utils`:
```typescript
import { cn } from '@/lib/utils';

<div className={cn(
  "p-6 bg-neutral-950 border border-neutral-800 transition-colors",
  isSelected ? "border-white bg-neutral-900" : "hover:border-neutral-700",
  className
)} />
```

---

## 3. Visual & Aesthetic Design System

The visual language follows a strict, high-end technical editorial aesthetic:

### A. Color Palette
- **Deep Backgrounds:** `#000000` (pure black) and `#0a0a0a` / `neutral-950`
- **Surface / Card Backgrounds:** `#111111` / `neutral-900`
- **Borders & Dividers:** `#262626` / `neutral-800` (subtle grid/panel separation)
- **High Contrast Borders:** `neutral-500` or `#ffffff` for active/hover states
- **Primary Text:** `#ffffff` (`text-white`)
- **Secondary Text:** `#a3a3a3` (`text-neutral-400`) and `#666666` (`text-neutral-500`)
- **Selection Highlights:** Monochromatic inverted selection (`selection:bg-white selection:text-black`)

### B. Typography Hierarchy
1. **Primary Font:** `Space Grotesk` (via `--font-space-grotesk` CSS variable) for headlines and body text.
2. **Technical Subheads & Overlines:** Monospace uppercase with wide letter tracking:
   ```html
   <div className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-2 flex items-center">
     02 // INTERACTIVE SCOPE TOOL
   </div>
   ```
3. **Headlines:** Thin, elegant weights (`font-light` or `font-extralight`) at large viewports (`text-4xl sm:text-6xl md:text-7xl lg:text-8xl`), balanced with geometric clarity.

---

## 4. State Management & Side-Effect Guidelines

1. **Local State First:** State is kept local to section components (`useState`) unless needed by the page orchestrator (`inquiryService` in `page.tsx`).
2. **Listener & Timer Teardown:** All event listeners (`window.addEventListener('scroll', ...)`) and timers (`setTimeout`, `setInterval`) must provide cleanup functions in the `useEffect` return callback to prevent memory leaks during hot module replacement.
3. **Imperative Canvas / Three.js Handles:** Heavy Canvas and Three.js components use `forwardRef` and `useImperativeHandle` (e.g. `FlyingButtonHandle`, `ShatterTypeHandle`) so parents can trigger actions imperatively without forced re-renders.

---

## 5. API Route Conventions

Server handlers located in `src/app/api/` follow standard App Router conventions:
- Use named HTTP exports (`export async function POST(request: NextRequest)`).
- Validate all incoming JSON fields before processing.
- Return structured JSON payloads adhering to the `InquiryResponse` type contract:
  - Always include a boolean `success` flag.
  - Include human-readable `message` strings.
  - Return HTTP status codes accurately (`200` for OK, `400` for bad input, `500` for exceptions).

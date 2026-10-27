# Technology Stack

This document outlines the core runtime, framework, libraries, and tooling that power the SAVEN codebase.

---

## 1. Core Runtime & Language

| Component | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Language** | TypeScript | `^5.x` | Strictly typed JavaScript for full application code and configs |
| **Runtime Target** | Node.js (ES2017 / ESNext) | `>= 20.x` | Server runtime for Next.js App Router and server route handlers |
| **Module Resolution** | Bundler (`esnext`) | - | Modern bundler module resolution configured in `tsconfig.json` |
| **Path Aliases** | `@/*` -> `./src/*` | - | Root-relative import resolution across the codebase |

---

## 2. Framework & Server Architecture

| Framework | Version | Details & Configuration |
| :--- | :--- | :--- |
| **Next.js** | `16.4.2` | App Router paradigm with experimental flags in [next.config.ts](file:///k:/Coding%20Projects/Saven/next.config.ts):<br>• `cacheComponents: true`<br>• `partialPrefetching: true`<br>• Turbopack CSS loader integration |
| **React** | `19.3.0` | React 19 concurrent features, client components, and hooks |
| **React DOM** | `19.3.0` | DOM renderer matching React 19 |

---

## 3. UI Styling & Typography

| Library | Version | Usage & Architecture |
| :--- | :--- | :--- |
| **Tailwind CSS** | `^4.0` | Tailwind v4 configured via `@import "tailwindcss";` in [globals.css](file:///k:/Coding%20Projects/Saven/src/app/globals.css) using native `@theme` directives |
| **@tailwindcss/turbopack** | `^4.0` | Turbopack native CSS loader rule |
| **clsx** | `^2.1.1` | Conditional className composition |
| **tailwind-merge** | `^3.7.0` | Conflict-free utility class merging via `cn()` in [utils.ts](file:///k:/Coding%20Projects/Saven/src/lib/utils.ts) |
| **next/font** | Built-in | Optimized font delivery of `Space_Grotesk` with Latin subset in [layout.tsx](file:///k:/Coding%20Projects/Saven/src/app/layout.tsx) |

---

## 4. Graphics, 3D & Animation Engines

| Package | Version | Usage |
| :--- | :--- | :--- |
| **three** | `^0.186.1` | WebGL 3D rendering engine for the glass shatter effect in [ShatterType.tsx](file:///k:/Coding%20Projects/Saven/src/components/ShatterType.tsx) |
| **@types/three** | `^0.186.0` | Type declarations for Three.js geometry, scenes, cameras, and materials |
| **framer-motion** | `^14.3.0` | Spring physics, entrance animations, and SVG morph transitions in [text-morph.tsx](file:///k:/Coding%20Projects/Saven/src/components/ui/text-morph.tsx) |
| **WebGL2 (Raw Shaders)** | Browser Native | High-performance custom volumetric light beam raymarching in [LightRays.tsx](file:///k:/Coding%20Projects/Saven/src/components/LightRays.tsx) |
| **HTML5 Canvas 2D** | Browser Native | Custom physics simulation with Euler integration, particle thrusters, and smoke in [FlyingButton.tsx](file:///k:/Coding%20Projects/Saven/src/components/FlyingButton.tsx) |

---

## 5. Icons & Components Registry

| Tool | Version / Spec | Details |
| :--- | :--- | :--- |
| **lucide-react** | `^1.59.0` | Clean monochromatic SVG iconography across navbar, services, estimator, and contact |
| **shadcn/ui** | Spec 2.0 | [components.json](file:///k:/Coding%20Projects/Saven/components.json) configuration pointing to `@/components` and `@/components/ui` |
| **React Bits Registries** | `@reactbits-starter`, `@reactbits-pro` | Configured in `components.json` for interactive UI component imports |

---

## 6. Build & Linting Tooling

| Tool | Version | Configuration File |
| :--- | :--- | :--- |
| **ESLint** | `^9.x` | Flat config in [eslint.config.mjs](file:///k:/Coding%20Projects/Saven/eslint.config.mjs) extending `core-web-vitals` & `typescript` |
| **TypeScript Compiler** | `^5.x` | [tsconfig.json](file:///k:/Coding%20Projects/Saven/tsconfig.json) with `strict: true`, `noEmit: true`, `isolatedModules: true` |
| **Package Manager** | npm | Lockfile `package-lock.json` present at root |

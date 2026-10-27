# Codebase Structure & Directory Layout

This document provides a complete directory map, module breakdown, entry points, and component inventory of the SAVEN repository.

---

## 1. Directory Tree Overview

```
Saven/
├── .git/                               # Git repository metadata
├── .planning/                          # GSD planning & codebase intelligence
│   └── codebase/                       # Architectural maps and documentation
├── public/                             # Public static assets & brand graphics
│   ├── file.svg                        # Default template icon
│   ├── globe.svg                       # Default template icon
│   ├── next.svg                        # Next.js official mark
│   ├── saven-logo.png                  # High-resolution original brand logo
│   ├── saven-logo-cropped.png          # Cropped typography logo
│   ├── saven-logo-transparent.png      # Transparent typography logo
│   ├── vercel.svg                      # Vercel deployment mark
│   └── window.svg                      # Default template icon
├── src/                                # Main application source directory
│   ├── app/                            # Next.js App Router root
│   │   ├── api/                        # Server route handlers
│   │   │   └── contact/
│   │   │       └── route.ts            # POST /api/contact handler
│   │   ├── favicon.ico                 # Browser tab favicon
│   │   ├── globals.css                 # Global Tailwind v4 styles & theme tokens
│   │   ├── layout.tsx                  # Root HTML wrapper, metadata & fonts
│   │   ├── page.tsx                    # Primary landing page orchestrator
│   │   ├── robots.ts                   # Dynamic robots.txt generation
│   │   └── sitemap.ts                  # Dynamic sitemap.xml generation
│   ├── components/                     # Domain, section, and FX components
│   │   ├── ui/                         # Base primitive / registry components
│   │   │   ├── bending-marquee.tsx     # 3D bent marquee strip implementation
│   │   │   ├── shatter-type.tsx        # Re-export bridge for ShatterType
│   │   │   └── text-morph.tsx          # Framer Motion morphing text implementation
│   │   ├── About.tsx                   # Section 05: Principles & Capability Matrix
│   │   ├── BendingMarquee.tsx          # Re-export bridge to ui/bending-marquee
│   │   ├── Contact.tsx                 # Section 06: Inquiry form & submission state
│   │   ├── Estimator.tsx               # Section 02: Interactive project scope modeler
│   │   ├── FlyingButton.css            # Canvas container & tooltip styling
│   │   ├── FlyingButton.tsx            # Kinetic rocket thruster canvas button
│   │   ├── Footer.tsx                  # Footer links, social channels, copyright
│   │   ├── Hero.tsx                    # Section 01: Hero banner with LightRays
│   │   ├── LegalModal.tsx              # Overlay modal for Terms & Privacy Policy
│   │   ├── LightRays.css               # WebGL canvas layout styling
│   │   ├── LightRays.tsx               # WebGL2 volumetric shader component
│   │   ├── Logo.tsx                    # Brand wordmark rendering with dot accents
│   │   ├── Navbar.tsx                  # Sticky top navigation with scroll spy
│   │   ├── Process.tsx                 # Section 04: 6-stage development lifecycle
│   │   ├── SavenMeaningAnimation.tsx   # Interactive acronym explanation widget
│   │   ├── ServiceModal.tsx            # Deep-dive details modal for service cards
│   │   ├── Services.tsx                # Section 03: 6 core service offerings grid
│   │   ├── ShatterIntro.tsx            # Full-screen glass shatter intro sequence
│   │   ├── ShatterType.tsx             # Three.js 3D Voronoi shatter implementation
│   │   ├── TextMorph.tsx               # Re-export bridge to ui/text-morph
│   │   ├── TracingBeam.tsx             # Scroll-linked SVG gradient beam container
│   │   └── WhyChooseUs.tsx             # 8-card agency value proposition grid
│   ├── data/                           # Decoupled static data fixtures
│   │   ├── about.ts                    # Principles, capabilities & differentiators
│   │   ├── process.ts                  # 6-stage methodology roadmap data
│   │   ├── services.ts                 # 6 service definitions with deliverables
│   │   └── siteConfig.ts               # Brand contacts, social URLs, nav links
│   ├── lib/                            # Shared utilities
│   │   └── utils.ts                    # `cn()` clsx + tailwind-merge helper
│   └── types/                          # Shared TypeScript interface definitions
│       └── index.ts                    # Core domain types
├── .gitignore                          # Standard git ignore definitions
├── AGENTS.md                           # Next.js 16 breaking change warning notice
├── components.json                     # shadcn/ui and ReactBits CLI registry config
├── eslint.config.mjs                   # ESLint flat config with Next.js presets
├── next.config.ts                      # Next.js build and Turbopack compiler config
├── package.json                        # Node dependencies and npm scripts
├── package-lock.json                   # NPM dependency lockfile
├── prompt.md                           # Original design and agency brand specification
└── tsconfig.json                       # TypeScript compiler configuration
```

---

## 2. Component Inventory & Mounting Status

Below is the inventory of all components in `src/components/` and their current integration status in the application:

| Component | File Path | Status | Consumed By | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **ShatterIntro** | `src/components/ShatterIntro.tsx` | **Mounted** | `page.tsx` | Displays on initial landing, self-unmounts after explosion |
| **Navbar** | `src/components/Navbar.tsx` | **Mounted** | `page.tsx` | Fixed navigation with scroll position highlighting |
| **Logo** | `src/components/Logo.tsx` | **Mounted** | `Navbar.tsx`, `Footer.tsx` | SVG/text brand mark with geometric letter spacing |
| **Hero** | `src/components/Hero.tsx` | **Mounted** | `page.tsx` | Top banner containing LightRays and FlyingButton |
| **LightRays** | `src/components/LightRays.tsx` | **Mounted** | `Hero.tsx` | Full-viewport WebGL2 volumetric lighting background |
| **FlyingButton** | `src/components/FlyingButton.tsx` | **Mounted** | `Hero.tsx` | Interactive hovercraft rocket CTA button |
| **TextMorph** | `src/components/ui/text-morph.tsx` | **Mounted** | `Hero.tsx` | Rotating tagline typography |
| **Services** | `src/components/Services.tsx` | **Mounted** | `page.tsx` | 6-card interactive service catalog |
| **ServiceModal**| `src/components/ServiceModal.tsx` | **Mounted** | `Services.tsx` | Modal view for deep-dive deliverables |
| **Estimator** | `src/components/Estimator.tsx` | **Mounted** | `page.tsx` | Interactive scope modeler transferring to contact |
| **Process** | `src/components/Process.tsx` | **Mounted** | `page.tsx` | 6-stage engineering process timeline |
| **About** | `src/components/About.tsx` | **Mounted** | `page.tsx` | Core principles & full-stack matrix |
| **Contact** | `src/components/Contact.tsx` | **Mounted** | `page.tsx` | Contact form communicating with `/api/contact` |
| **Footer** | `src/components/Footer.tsx` | **Mounted** | `page.tsx` | Agency footer, social links, legal modals |
| **LegalModal** | `src/components/LegalModal.tsx` | **Mounted** | `Footer.tsx` | Terms of Service & Privacy Policy dialog |
| **ShatterType** | `src/components/ShatterType.tsx` | **Mounted** | `ShatterIntro.tsx` | Core Three.js Voronoi shard fracturing engine |
| **BendingMarquee** | `src/components/ui/bending-marquee.tsx` | *Orphaned* | None | Standalone 3D marquee strip, not rendered |
| **SavenMeaningAnimation** | `src/components/SavenMeaningAnimation.tsx` | *Orphaned* | None | 5-node acronym animation widget, not rendered |
| **TracingBeam** | `src/components/TracingBeam.tsx` | *Orphaned* | None | Scroll-linked SVG container, not rendered |
| **WhyChooseUs** | `src/components/WhyChooseUs.tsx` | *Orphaned* | None | 8-card differentiator grid, not rendered |

---

## 3. Key Application Entrypoints

1. **Root HTML Shell:** [src/app/layout.tsx](file:///k:/Coding%20Projects/Saven/src/app/layout.tsx)
   - Injects Google Font CSS variables into `<html>` and sets `dark` color scheme.
   - Embeds JSON-LD script for rich Google search cards.
2. **Main Application Surface:** [src/app/page.tsx](file:///k:/Coding%20Projects/Saven/src/app/page.tsx)
   - Sequentially stitches together sections into a cohesive single-page layout.
3. **HTTP API Handler:** [src/app/api/contact/route.ts](file:///k:/Coding%20Projects/Saven/src/app/api/contact/route.ts)
   - Processes contact form submissions with server-side validation.
4. **Search Indexing:** [src/app/robots.ts](file:///k:/Coding%20Projects/Saven/src/app/robots.ts) & [src/app/sitemap.ts](file:///k:/Coding%20Projects/Saven/src/app/sitemap.ts)
   - Configures automated web crawler routing rules.

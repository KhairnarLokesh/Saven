# UI-SPEC: Services Cards Redesign (User-Specified Titles & Expandable Paragraphs)

**Product:** SAVEN Website  
**Branch:** `feature/service-cards-redesign`  
**Target Component:** `src/components/Services.tsx`  
**Pattern:** Click-to-Expand Progressive Disclosure with Balanced Paragraphs  
**Status:** Approved & Ready for Execution  

---

## 1. Design & Content Specification

Each card in the clean 3-column grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start`) follows a two-state structure:

### A. Collapsed Resting State (Scanning Format)
1. **Header Row:** Monospace number (`01`, `02`, ...), status badge, and recessed icon.
2. **Title:** Exact user-specified concise title.
3. **Primary Highlight Line:** Exact user-specified bullet summary line:
   - `01. Custom Software`: High-throughput microservices, strictly typed codebases, and resilient schema modeling.
   - `02. Software Modernization`: Bottleneck diagnosis, query acceleration (up to 3.5x speedup), and zero-downtime migrations.
   - `03. Academic Engineering`: Rigorous capstone mentorship, machine learning prototypes, and IEEE-standard SRS documentation.
   - `04. Mobile App Dev`: 60fps native ergonomics, cross-platform parity, and offline-first database sync.
   - `05. Website Design & Dev`: 100/100 Core Web Vitals benchmarks, SSR speed, and brand authority design.
   - `06. End-to-End Delivery`: Complete product progression across a structured 6-stage sprint delivery methodology.
4. **Interaction Hint:** `+ Click to Expand Overview ↓` with subtle arrow motion.

### B. Expanded State (Balanced Paragraph Deep-Dive)
1. **Animation:** Spring-physics height expansion using Framer Motion (`ease: [0.16, 1, 0.3, 1]`).
2. **Details Paragraph:** Well-balanced (2–3 sentences, 40–55 words) explaining the architectural value proposition clearly without fluff.
3. **Core Deliverables Matrix:** 4 crisp deliverables with checkmarks.
4. **Target Tech Stack:** Monospace chips.
5. **Dual Action Buttons:**
   - `Model in Estimator` (scrolls to Section 02)
   - `Start Inquiry` (scrolls to Section 06)
6. **Collapse Button:** `- Collapse Details ↑`.

---

## 2. Product Editorial Copy

| ID | Title | Resting Highlight | Balanced Paragraph Details |
| :--- | :--- | :--- | :--- |
| **01** | **Custom Software** | High-throughput microservices, strictly typed codebases, and resilient schema modeling. | We engineer bespoke software systems and backend services tailored to your operational workflows. Every application is built with strictly typed architectures, automated CI/CD pipelines, and high-resilience database modeling that scales seamlessly with your business. |
| **02** | **Software Modernization** | Bottleneck diagnosis, query acceleration (up to 3.5x speedup), and zero-downtime migrations. | We diagnose and resolve architectural bottlenecks across legacy platforms. From eliminating technical debt and tuning sluggish database queries to modernizing user interfaces, our team revitalizes your software into a high-performance platform with zero downtime. |
| **03** | **Academic Engineering** | Rigorous capstone mentorship, machine learning prototypes, and IEEE-standard SRS documentation. | We provide rigorous technical guidance and end-to-end prototype development for academic and capstone software projects. We deliver clean, modular codebases alongside comprehensive IEEE-standard SRS documentation, architecture diagrams, and viva defense coaching. |
| **04** | **Mobile App Dev** | 60fps native ergonomics, cross-platform parity, and offline-first database sync. | We build intuitive, fluid mobile applications designed for real users. Utilizing React Native and native platform bridges, our mobile apps combine unified cross-platform codebases with native 60fps gesture responsiveness, secure authentication, and robust offline data sync. |
| **05** | **Website Design & Dev** | 100/100 Core Web Vitals benchmarks, SSR speed, and brand authority design. | We design and develop high-performance, editorial digital experiences that establish unmistakable brand authority. Powered by Next.js App Router and tailored modern design tokens, every site delivers sub-second page loads, flawless search indexing, and fluid responsiveness. |
| **06** | **End-to-End Delivery** | Complete product progression across a structured 6-stage sprint delivery methodology. | From initial whiteboard hypothesis to final production rollout, we manage your complete digital product lifecycle. Through structured two-week delivery sprints, continuous client walkthroughs, and automated testing, we deliver fully documented, production-ready solutions on schedule. |

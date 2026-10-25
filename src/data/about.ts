import { Principle } from '@/types';

export const principles: Principle[] = [
  {
    number: '01',
    title: 'Thoughtful Design',
    description: 'Interfaces engineered for clarity, effortless usability, and zero visual clutter.',
  },
  {
    number: '02',
    title: 'Practical Engineering',
    description: 'Reliable, proven architectures built around your exact requirements, not hype.',
  },
  {
    number: '03',
    title: 'Continuous Evolution',
    description: 'Modular, maintainable codebases structured for effortless future scaling.',
  },
  {
    number: '04',
    title: 'Transparent Delivery',
    description: 'Direct communication, frequent updates, and unambiguous project milestones.',
  },
];

export const differentiators = [
  {
    title: 'Tailored Solutions',
    description: 'Every project is engineered around your precise operational constraints and user needs, never forced into generic cookie-cutter templates.',
  },
  {
    title: 'Modern & Responsive',
    description: 'Flawlessly tested across mobile, tablet, and desktop viewports with fluid typographic scaling and zero horizontal overflow.',
  },
  {
    title: 'Maintainable Code',
    description: 'Written in strictly typed TypeScript, modular directory conventions, and documented APIs so your team can effortlessly maintain or extend it.',
  },
  {
    title: 'Transparent Communication',
    description: 'Structured progress reviews, clear milestone dates, and immediate communication on technical trade-offs.',
  },
  {
    title: 'Practical Problem-Solving',
    description: 'Focus on business viability, developer ergonomics, and user retention rather than superficial cosmetic bloat.',
  },
  {
    title: 'Structured Workflow',
    description: 'A proven 6-stage development lifecycle ensuring predictable delivery from discovery to final production deployment.',
  },
  {
    title: 'Obsessive Detail',
    description: 'Pixel-accurate alignments, micro-interactions, input edge-case handling, and WCAG accessibility standards.',
  },
  {
    title: 'Dedicated Handover',
    description: 'Clean source repository handover, environment configurations, architecture documentation, and agreed support scope.',
  },
];

export const techCapabilities = [
  { category: 'Frontend', items: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'WebSockets'] },
  { category: 'Backend & APIs', items: ['Node.js', 'Go', 'Python / FastAPI', 'RESTful APIs', 'GraphQL', 'gRPC'] },
  { category: 'Data & Storage', items: ['PostgreSQL', 'Redis', 'MongoDB', 'Supabase', 'SQLite', 'Prisma / Drizzle'] },
  { category: 'Mobile & Cloud', items: ['React Native', 'Expo', 'Docker', 'AWS / Vercel', 'CI/CD Pipelines', 'Linux'] },
];

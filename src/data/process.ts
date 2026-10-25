import { ProcessStep } from '@/types';

export const processSteps: ProcessStep[] = [
  {
    step: '01',
    title: 'DISCOVER',
    subhead: 'Requirements, Objectives & Scoping',
    description:
      'We dive into your vision, core workflows, operational constraints, and target outcomes to establish unambiguous project parameters.',
    duration: 'Week 1',
    deliverables: [
      'Detailed requirements analysis',
      'Technical feasibility assessment',
      'Architecture & data flow mapping',
      'Transparent milestone roadmap',
    ],
  },
  {
    step: '02',
    title: 'PLAN',
    subhead: 'Architecture, Stack & Milestones',
    description:
      'We define the exact system architecture, technology selection, database schemas, API contracts, and milestone deliverables.',
    duration: 'Week 1 – 2',
    deliverables: [
      'System architecture blueprint',
      'Data model & schema specifications',
      'API contract definitions',
      'Sprint roadmap & milestone deliverables',
    ],
  },
  {
    step: '03',
    title: 'DESIGN',
    subhead: 'Interface, Flow & User Experience',
    description:
      'We craft clean, intuitive user journeys and responsive interface layouts focusing on clarity, ergonomics, and aesthetic precision.',
    duration: 'Week 2 – 3',
    deliverables: [
      'Interactive wireframes & user flows',
      'High-fidelity component designs',
      'Responsive design across viewports',
      'Interactive functional prototype',
    ],
  },
  {
    step: '04',
    title: 'DEVELOP',
    subhead: 'Modular Engineering & Integration',
    description:
      'We write clean, strictly typed, maintainable code following modern software engineering practices, automated tests, and git workflows.',
    duration: 'Weeks 3 – 6',
    deliverables: [
      'Production-grade application code',
      'API endpoints & third-party integrations',
      'Secure authentication & role handling',
      'Staging environment previews',
    ],
  },
  {
    step: '05',
    title: 'TEST',
    subhead: 'Quality, Security & Performance',
    description:
      'Every module undergoes rigorous functional validation, multi-device viewport testing, performance audits, and security checks.',
    duration: 'Week 6 – 7',
    deliverables: [
      'Cross-device responsiveness audit',
      'Lighthouse vitals & load testing',
      'Security review & input sanitization',
      'Bug triage & zero-defect signoff',
    ],
  },
  {
    step: '06',
    title: 'DELIVER',
    subhead: 'Deployment, Handover & Documentation',
    description:
      'We deploy the verified solution to your production environment and provide comprehensive technical documentation and walkthroughs.',
    duration: 'Week 8',
    deliverables: [
      'Production deployment & DNS setup',
      'Complete source code repository',
      'Technical documentation & runbooks',
      'Agreed post-launch support period',
    ],
  },
];

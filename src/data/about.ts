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


export const techCapabilities = [
  { category: 'Frontend', items: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'WebSockets'] },
  { category: 'Backend & APIs', items: ['Node.js', 'Go', 'Python / FastAPI', 'RESTful APIs', 'GraphQL', 'gRPC'] },
  { category: 'Data & Storage', items: ['PostgreSQL', 'Redis', 'MongoDB', 'Supabase', 'SQLite', 'Prisma / Drizzle'] },
  { category: 'Mobile & Cloud', items: ['React Native', 'Expo', 'Docker', 'AWS / Vercel', 'CI/CD Pipelines', 'Linux'] },
];

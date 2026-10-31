import { Principle } from '@/types';

export interface ExactCapsuleFounder {
  id: string;
  name: string;
  role: string;
  capsuleBg: string; // Pastel background hex/class matching template
  textColor: string;
  brandTag: string;
  brandColor: string;
  image: string;
  offsetClass: string; // Staggered wave offset like template
  socials: {
    github?: string;
    linkedin?: string;
  };
}

export const exactFounders: ExactCapsuleFounder[] = [
  {
    id: 'lokesh-khairnar',
    name: 'Lokesh Khairnar',
    role: 'Founder & Development Lead',
    capsuleBg: 'bg-[#86b6cc]', // Soft Powder Blue from template
    textColor: 'text-neutral-950',
    brandTag: 'SAVEN ARCHITECTURE',
    brandColor: 'text-[#0f3448]',
    image: '/founders/lokesh-v2.png',
    offsetClass: 'md:translate-y-0',
    socials: {
      github: 'https://github.com/KhairnarLokesh',
      linkedin: 'https://www.linkedin.com/in/lokesh-khairnar-b0a2832b3/',
    },
  },
  {
    id: 'kanhaiya-bagul',
    name: 'Kanhaiya Bagul',
    role: 'Co-Founder & Engineering Lead',
    capsuleBg: 'bg-[#9ac5a8]', // Soft Sage Green from template
    textColor: 'text-neutral-950',
    brandTag: 'SAVEN ENGINEERING',
    brandColor: 'text-[#163f27]',
    image: '/founders/kanhaiya-v2.png',
    offsetClass: 'md:translate-y-12', // Staggered down like Rohit in template
    socials: {
      github: 'https://github.com/KanhaiyaBagul',
      linkedin: 'https://www.linkedin.com/in/kanhaiyabagul/',
    },
  },
  {
    id: 'sagar-datkhile',
    name: 'Sagar Datkhile',
    role: 'Co-Founder & Design Lead',
    capsuleBg: 'bg-[#ded1b4]', // Soft Warm Sand from template
    textColor: 'text-neutral-950',
    brandTag: 'SAVEN SYSTEMS',
    brandColor: 'text-[#483a1f]',
    image: '/founders/plaid-v2.png',
    offsetClass: 'md:translate-y-0',
    socials: {
      github: 'https://github.com/Sagar-Datkhile',
      linkedin: 'https://www.linkedin.com/in/sagardatkhile/',
    },
  },
];

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

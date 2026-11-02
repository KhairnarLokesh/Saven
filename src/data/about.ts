import { Principle } from '@/types';

export interface ExactCapsuleFounder {
  id: string;
  name: string;
  role: string;
  capsuleBg: string;
  textColor: string;
  brandTag: string;
  brandColor: string;
  image: string;
  offsetClass: string;
  objectPosition: string;
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
    capsuleBg: 'bg-[#35152D]',
    textColor: 'text-white',
    brandTag: 'SAVEN ARCHITECTURE',
    brandColor: 'text-[#E879B0]',
    image: '/founders/lokesh.png',
    offsetClass: 'md:translate-y-0',
    objectPosition: 'center 8%',
    socials: {
      github: 'https://github.com/KhairnarLokesh',
      linkedin: 'https://www.linkedin.com/in/lokesh-khairnar-b0a2832b3/',
    },
  },
  {
    id: 'kanhaiya-bagul',
    name: 'Kanhaiya Bagul',
    role: 'Co-Founder & Engineering Lead',
    capsuleBg: 'bg-[#35152D]',
    textColor: 'text-white',
    brandTag: 'SAVEN ENGINEERING',
    brandColor: 'text-[#E879B0]',
    image: '/founders/kanhaiya.png',
    offsetClass: 'md:translate-y-[30px]',
    objectPosition: 'center 5%',
    socials: {
      github: 'https://github.com/KanhaiyaBagul',
      linkedin: 'https://www.linkedin.com/in/kanhaiyabagul/',
    },
  },
  {
    id: 'sagar-datkhile',
    name: 'Sagar Datkhile',
    role: 'Co-Founder & Design Lead',
    capsuleBg: 'bg-[#35152D]',
    textColor: 'text-white',
    brandTag: 'SAVEN SYSTEMS',
    brandColor: 'text-[#E879B0]',
    image: '/founders/sagar-cropped.png',
    offsetClass: 'md:translate-y-0',
    objectPosition: 'center top',
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

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
  /** CSS object-position for the portrait (cover mode) */
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
    role: 'Lead Developer',
    capsuleBg: 'bg-[#B7DFE8]',
    textColor: 'text-neutral-950',
    brandTag: 'SAVEN ARCHITECTURE',
    brandColor: 'text-[#0f3448]',
    image: '/founders/lokesh.png',
    // Card height 470px, portrait zone 300px. Image 1520x1200, aspect 1.267:1.
    // At 250px wide → rendered height = 250/1.267 ≈ 197px (too short).
    // With cover at 250px wide, height fills 300px → top of face appears near upper third.
    offsetClass: 'md:translate-y-0',
    objectPosition: 'center 20%',
    socials: {
      github: 'https://github.com/KhairnarLokesh',
      linkedin: 'https://www.linkedin.com/in/lokesh-khairnar-b0a2832b3/',
    },
  },
  {
    id: 'kanhaiya-bagul',
    name: 'Kanhaiya Bagul',
    role: 'Lead Developer',
    capsuleBg: 'bg-[#C5E2C2]',
    textColor: 'text-neutral-950',
    brandTag: 'SAVEN ENGINEERING',
    brandColor: 'text-[#163f27]',
    image: '/founders/kanhaiya.png',
    // 400x440 aspect 0.909:1, portrait zone 300px → at 250px wide → height = 275px
    // cover: fills height → face in top third
    offsetClass: 'md:translate-y-[75px]',
    objectPosition: 'center 35%',
    socials: {
      github: 'https://github.com/KanhaiyaBagul',
      linkedin: 'https://www.linkedin.com/in/kanhaiyabagul/',
    },
  },
  {
    id: 'sagar-datkhile',
    name: 'Sagar Datkhile',
    role: 'Lead Developer',
    capsuleBg: 'bg-[#F4D8A9]',
    textColor: 'text-neutral-950',
    brandTag: 'SAVEN SYSTEMS',
    brandColor: 'text-[#483a1f]',
    image: '/founders/sagar-cropped.png',
    // 460x650 aspect 0.708:1, portrait zone 300px → cover at 250px wide → height = 353px
    // face top at ~14% → objectPosition center 14% pushes head to top of visible area
    offsetClass: 'md:translate-y-0',
    objectPosition: 'center 14%',
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

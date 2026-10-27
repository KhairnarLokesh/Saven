'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Minus,
  Check,
  Calculator,
  Send,
  ArrowRight,
} from 'lucide-react';

interface ServicesProps {
  onSelectService: (serviceTitle: string) => void;
}

interface ServiceItemConfig {
  number: string;
  title: string;
  systemTag: string;
  detailedParagraph: string;
  deliverables: string[];
  techStack: string[];
}

const servicesList: ServiceItemConfig[] = [
  {
    number: '01',
    title: 'Custom Software',
    systemTag: 'CORE ARCHITECTURE',
    detailedParagraph:
      'We engineer bespoke software systems and backend services tailored to your operational workflows. Every application is built with strictly typed architectures, automated CI/CD pipelines, and high-resilience database modeling that scales seamlessly with your business.',
    deliverables: [
      'Proprietary business software & custom web platforms',
      'High-throughput REST & GraphQL API engines',
      'Relational & document database schema modeling',
      'Automated CI/CD pipelines & cloud infrastructure deployment',
    ],
    techStack: ['Node.js', 'Go', 'Python', 'PostgreSQL', 'Docker', 'AWS'],
  },
  {
    number: '02',
    title: 'Software Modernization',
    systemTag: 'MODERNIZATION',
    detailedParagraph:
      'We diagnose and resolve architectural bottlenecks across legacy platforms. From eliminating technical debt and tuning sluggish database queries to modernizing user interfaces, our team revitalizes your software into a high-performance platform with zero downtime.',
    deliverables: [
      'Legacy codebase refactoring & technical debt reduction',
      'Database index tuning & query acceleration (up to 3.5x speedup)',
      'Modern UI/UX interface overhaul with design systems',
      'Zero-downtime database and infrastructure migrations',
    ],
    techStack: ['React', 'Next.js', 'TypeScript', 'Redis', 'PostgreSQL', 'Docker'],
  },
  {
    number: '03',
    title: 'Academic Engineering',
    systemTag: 'ACADEMIC ENGINEERING',
    detailedParagraph:
      'We provide rigorous technical guidance and end-to-end prototype development for academic and capstone software projects. We deliver clean, modular codebases alongside comprehensive IEEE-standard SRS documentation, architecture diagrams, and viva defense coaching.',
    deliverables: [
      'Capstone & final-year software development assistance',
      'Production-quality full-stack web & machine learning prototypes',
      'Comprehensive IEEE-standard SRS documentation & diagrams',
      'Live demonstration setup & technical viva defense coaching',
    ],
    techStack: ['React', 'Node.js', 'Python / ML', 'MySQL', 'MongoDB', 'Tailwind CSS'],
  },
  {
    number: '04',
    title: 'Mobile App Dev',
    systemTag: 'MOBILE ECOSYSTEM',
    detailedParagraph:
      'We build intuitive, fluid mobile applications designed for real users. Utilizing React Native and native platform bridges, our mobile apps combine unified cross-platform codebases with native 60fps gesture responsiveness, secure authentication, and robust offline data sync.',
    deliverables: [
      'Cross-platform iOS & Android mobile applications',
      'Fluid 60fps gesture ergonomics & tactile micro-animations',
      'Offline-first local database caching & cloud sync',
      'Push notification pipelines & automated app store deployment',
    ],
    techStack: ['React Native', 'Expo', 'TypeScript', 'Tailwind', 'Firebase', 'Supabase'],
  },
  {
    number: '05',
    title: 'Website Design & Dev',
    systemTag: 'PERFORMANCE WEB',
    detailedParagraph:
      'We design and develop high-performance, editorial digital experiences that establish unmistakable brand authority. Powered by Next.js App Router and tailored modern design tokens, every site delivers sub-second page loads, flawless search indexing, and fluid responsiveness.',
    deliverables: [
      '100/100 Core Web Vitals & Lighthouse benchmarks',
      'Bespoke editorial agency design & brand aesthetics',
      'Server-side rendering & dynamic SEO schema structure',
      'Fluid multi-breakpoint responsiveness with zero layout shift',
    ],
    techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vercel'],
  },
  {
    number: '06',
    title: 'End-to-End Delivery',
    systemTag: 'LIFECYCLE SHIP 0→1',
    detailedParagraph:
      'From initial whiteboard hypothesis to final production rollout, we manage your complete digital product lifecycle. Through structured two-week delivery sprints, continuous client walkthroughs, and automated testing, we deliver fully documented, production-ready solutions on schedule.',
    deliverables: [
      'Product scoping & system architecture blueprint',
      'Sprint roadmap with staging preview deployments',
      'Automated cloud infrastructure, security audits & monitoring',
      'Complete source repository handover, documentation & training',
    ],
    techStack: ['Full-Stack Modern Stack', 'Docker', 'AWS / Vercel', 'CI/CD Pipelines'],
  },
];

export const Services: React.FC<ServicesProps> = ({ onSelectService }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  const handleScrollToSection = (serviceTitle: string, targetId: string) => {
    onSelectService(serviceTitle);
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="relative py-28 bg-black text-white border-b border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-neutral-900">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-3 flex items-center">
              <span className="w-2 h-2 bg-white mr-2" />
              01 // CORE PRACTICE AREAS
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-white">
              Engineering Digital Reality
            </h2>
          </div>
          <p className="mt-4 md:mt-0 text-neutral-400 max-w-sm text-sm sm:text-base leading-relaxed font-light">
            Select any practice area below to expand its architectural overview, complete deliverables, and technical execution.
          </p>
        </div>

        {/* ============================================================== */}
        {/* CARDLESS VERTICAL SERIES (ONE AFTER ANOTHER IN A SINGLE LINE)   */}
        {/* ============================================================== */}
        <div className="border-t border-b border-neutral-900 divide-y divide-neutral-900">
          {servicesList.map((item, index) => {
            const isExpanded = expandedIndex === index;

            return (
              <div
                key={item.number}
                className={`transition-colors duration-200 ${
                  isExpanded ? 'bg-neutral-950/80' : 'hover:bg-neutral-950/40'
                }`}
              >
                {/* Single-Line Row Header (Clickable) */}
                <div
                  onClick={() => toggleExpand(index)}
                  className="group py-6 sm:py-8 flex items-center justify-between cursor-pointer transition-all select-none"
                >
                  {/* Left: Number + Title */}
                  <div className="flex items-center space-x-5 sm:space-x-10">
                    <span className="font-mono text-sm sm:text-base text-neutral-500 group-hover:text-white transition-colors duration-200">
                      {item.number}
                    </span>
                    <h3 className="text-2xl sm:text-4xl md:text-5xl font-light tracking-tight text-neutral-300 group-hover:text-white group-hover:translate-x-2 transition-all duration-300">
                      {item.title}
                    </h3>
                  </div>

                  {/* Right: Status Tag + Minimal Toggle Indicator */}
                  <div className="flex items-center space-x-3 sm:space-x-6">
                    <span className="hidden md:inline-block font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
                      {item.systemTag}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
                        isExpanded
                          ? 'bg-white text-black border-white'
                          : 'border-neutral-800 text-neutral-400 group-hover:border-white group-hover:text-white'
                      }`}
                    >
                      {isExpanded ? (
                        <Minus className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>

                {/* ========================================================== */}
                {/* IN-PLACE EXPANSION: OVERVIEW PARAGRAPH, DELIVERABLES, STACK */}
                {/* ========================================================== */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-10 pt-2 pl-9 sm:pl-16 pr-4 max-w-4xl space-y-6">
                        {/* Service Description Paragraph */}
                        <div>
                          <span className="block font-mono text-[10px] uppercase tracking-wider text-neutral-400 mb-2 font-medium">
                            SERVICE OVERVIEW:
                          </span>
                          <p className="text-sm sm:text-base text-neutral-200 font-light leading-relaxed">
                            {item.detailedParagraph}
                          </p>
                        </div>

                        {/* Deliverables Checklist */}
                        <div className="pt-2">
                          <span className="block font-mono text-[10px] uppercase tracking-wider text-neutral-400 mb-3 font-medium">
                            CORE DELIVERABLES:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {item.deliverables.map((del, idx) => (
                              <div
                                key={idx}
                                className="flex items-center text-xs sm:text-sm text-neutral-300 font-light"
                              >
                                <Check className="w-3.5 h-3.5 text-white mr-2.5 shrink-0" />
                                <span>{del}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Tech Stack Ecosystem */}
                        <div className="pt-2">
                          <span className="block font-mono text-[10px] uppercase tracking-wider text-neutral-400 mb-2 font-medium">
                            TECH ECOSYSTEM:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {item.techStack.map((tech) => (
                              <span
                                key={tech}
                                className="font-mono text-xs px-3 py-1 bg-neutral-900 border border-neutral-800 text-neutral-300 rounded"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Direct Action Triggers */}
                        <div className="flex flex-wrap items-center gap-3 pt-3">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleScrollToSection(item.title, 'estimator');
                            }}
                            className="px-5 py-2.5 bg-neutral-900 border border-neutral-700 hover:border-white text-white font-mono text-xs uppercase tracking-wider flex items-center transition-colors cursor-pointer"
                          >
                            <Calculator className="w-3.5 h-3.5 mr-2 text-neutral-400" />
                            <span>Model in Scope Estimator</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleScrollToSection(item.title, 'contact');
                            }}
                            className="px-5 py-2.5 bg-white text-black hover:bg-neutral-200 font-mono text-xs uppercase tracking-wider font-semibold flex items-center transition-colors cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5 mr-2 text-black" />
                            <span>Start Project Inquiry</span>
                            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner Note */}
        <div className="mt-12 p-6 sm:p-8 border border-neutral-800 bg-neutral-950 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="w-2 h-2 bg-white" />
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-300">
              Need a hybrid or custom architectural scope?
            </span>
          </div>
          <button
            onClick={() => onSelectService('End-to-End Delivery')}
            className="text-xs uppercase tracking-widest font-semibold text-white hover:underline flex items-center cursor-pointer"
          >
            <span>Discuss Custom Architecture</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>
      </div>
    </section>
  );
};

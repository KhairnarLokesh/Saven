'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  RefreshCw,
  GraduationCap,
  Smartphone,
  Globe,
  Rocket,
  ArrowRight,
  Plus,
  Minus,
  Check,
  Calculator,
  Send,
  FileText,
} from 'lucide-react';

interface ServicesProps {
  onSelectService: (serviceTitle: string) => void;
}

interface ServiceDataConfig {
  id: string;
  number: string;
  title: string;
  systemTag: string;
  icon: React.ReactNode;
  restingHighlight: string;
  detailedParagraph: string;
  deliverables: string[];
  techStack: string[];
}

// User-specified titles, resting highlights, and balanced product-grade paragraphs
const servicesConfig: ServiceDataConfig[] = [
  {
    id: 'custom-software',
    number: '01',
    title: 'Custom Software',
    systemTag: 'CORE ARCHITECTURE',
    icon: <Code2 className="w-4 h-4" />,
    restingHighlight:
      'High-throughput microservices, strictly typed codebases, and resilient schema modeling.',
    detailedParagraph:
      'We engineer bespoke software systems and backend services tailored to your operational workflows. Every application is built with strictly typed architectures, automated CI/CD pipelines, and high-resilience database modeling that scales seamlessly with your business.',
    deliverables: [
      'Proprietary business logic & custom applications',
      'High-throughput REST & GraphQL API engines',
      'Relational & document database schema modeling',
      'Automated CI/CD pipelines & cloud deployment',
    ],
    techStack: ['Node.js', 'Go', 'Python', 'PostgreSQL', 'Docker', 'AWS'],
  },
  {
    id: 'software-modernization',
    number: '02',
    title: 'Software Modernization',
    systemTag: 'MODERNIZATION',
    icon: <RefreshCw className="w-4 h-4" />,
    restingHighlight:
      'Bottleneck diagnosis, query acceleration (up to 3.5x speedup), and zero-downtime migrations.',
    detailedParagraph:
      'We diagnose and resolve architectural bottlenecks across legacy platforms. From eliminating technical debt and tuning sluggish database queries to modernizing user interfaces, our team revitalizes your software into a high-performance platform with zero downtime.',
    deliverables: [
      'Legacy codebase refactoring & debt reduction',
      'Database index tuning & query acceleration',
      'Modern UI/UX interface overhaul with design systems',
      'Zero-downtime database & server migrations',
    ],
    techStack: ['React', 'Next.js', 'TypeScript', 'Redis', 'PostgreSQL', 'Docker'],
  },
  {
    id: 'academic-engineering',
    number: '03',
    title: 'Academic Engineering',
    systemTag: 'ACADEMIC ENGINEERING',
    icon: <GraduationCap className="w-4 h-4" />,
    restingHighlight:
      'Rigorous capstone mentorship, machine learning prototypes, and IEEE-standard SRS documentation.',
    detailedParagraph:
      'We provide rigorous technical guidance and end-to-end prototype development for academic and capstone software projects. We deliver clean, modular codebases alongside comprehensive IEEE-standard SRS documentation, architecture diagrams, and viva defense coaching.',
    deliverables: [
      'Capstone & final-year project development assistance',
      'Production-quality full-stack & ML prototypes',
      'Comprehensive IEEE-standard SRS documentation',
      'Live demonstration setup & technical viva preparation',
    ],
    techStack: ['React', 'Node.js', 'Python / ML', 'MySQL', 'MongoDB', 'Tailwind'],
  },
  {
    id: 'mobile-app-dev',
    number: '04',
    title: 'Mobile App Dev',
    systemTag: 'MOBILE ECOSYSTEM',
    icon: <Smartphone className="w-4 h-4" />,
    restingHighlight:
      '60fps native ergonomics, cross-platform parity, and offline-first database sync.',
    detailedParagraph:
      'We build intuitive, fluid mobile applications designed for real users. Utilizing React Native and native platform bridges, our mobile apps combine unified cross-platform codebases with native 60fps gesture responsiveness, secure authentication, and robust offline data sync.',
    deliverables: [
      'Cross-platform iOS & Android mobile applications',
      'Fluid 60fps gesture ergonomics & micro-animations',
      'Offline-first local database caching & cloud sync',
      'Push notification pipelines & app store deployment',
    ],
    techStack: ['React Native', 'Expo', 'TypeScript', 'Tailwind', 'Firebase', 'Supabase'],
  },
  {
    id: 'website-design-dev',
    number: '05',
    title: 'Website Design & Dev',
    systemTag: 'PERFORMANCE WEB',
    icon: <Globe className="w-4 h-4" />,
    restingHighlight:
      '100/100 Core Web Vitals benchmarks, SSR speed, and brand authority design.',
    detailedParagraph:
      'We design and develop high-performance, editorial digital experiences that establish unmistakable brand authority. Powered by Next.js App Router and tailored modern design tokens, every site delivers sub-second page loads, flawless search indexing, and fluid responsiveness.',
    deliverables: [
      '100/100 Core Web Vitals & Lighthouse benchmarks',
      'Bespoke editorial agency design & brand aesthetics',
      'Server-side rendering & dynamic SEO schema structure',
      'Responsive layouts across viewports with zero layout shift',
    ],
    techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vercel'],
  },
  {
    id: 'end-to-end-delivery',
    number: '06',
    title: 'End-to-End Delivery',
    systemTag: 'LIFECYCLE SHIP 0→1',
    icon: <Rocket className="w-4 h-4" />,
    restingHighlight:
      'Complete product progression across a structured 6-stage sprint delivery methodology.',
    detailedParagraph:
      'From initial whiteboard hypothesis to final production rollout, we manage your complete digital product lifecycle. Through structured two-week delivery sprints, continuous client walkthroughs, and automated testing, we deliver fully documented, production-ready solutions on schedule.',
    deliverables: [
      'Product scoping & system architecture blueprint',
      'Sprint roadmap with staging preview deployments',
      'Automated cloud infrastructure, security & monitoring',
      'Complete source repository handover & documentation',
    ],
    techStack: ['Full-Stack Modern Stack', 'Docker', 'AWS / Vercel', 'CI/CD Pipelines'],
  },
];

interface ServiceCardProps {
  item: ServiceDataConfig;
  isExpanded: boolean;
  onToggle: () => void;
  onSelectService: (serviceTitle: string) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  item,
  isExpanded,
  onToggle,
  onSelectService,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleScrollToSection = (targetId: string) => {
    onSelectService(item.title);
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: -1000, y: -1000 });
      }}
      onMouseMove={handleMouseMove}
      className={`group relative flex flex-col justify-between p-6 sm:p-7 bg-neutral-950 border transition-all duration-300 overflow-hidden shadow-2xl ${
        isExpanded
          ? 'border-white/50 bg-neutral-950/95 ring-1 ring-white/10'
          : 'border-neutral-800/90 hover:border-neutral-600 hover:-translate-y-1'
      }`}
    >
      {/* Precision Corner Crosshairs (+) */}
      <span className="pointer-events-none absolute top-1.5 left-1.5 font-mono text-[10px] text-neutral-700 group-hover:text-white transition-colors duration-200 select-none">
        +
      </span>
      <span className="pointer-events-none absolute top-1.5 right-1.5 font-mono text-[10px] text-neutral-700 group-hover:text-white transition-colors duration-200 select-none">
        +
      </span>
      <span className="pointer-events-none absolute bottom-1.5 left-1.5 font-mono text-[10px] text-neutral-700 group-hover:text-white transition-colors duration-200 select-none">
        +
      </span>
      <span className="pointer-events-none absolute bottom-1.5 right-1.5 font-mono text-[10px] text-neutral-700 group-hover:text-white transition-colors duration-200 select-none">
        +
      </span>

      {/* Dynamic Radial Spotlight Glow Layer */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        style={{
          background: isHovered
            ? `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.05), transparent 75%)`
            : undefined,
        }}
      />

      {/* Spotlight Border Illumination */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        style={{
          background: isHovered
            ? `radial-gradient(280px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.4), transparent 70%)`
            : undefined,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '1px',
        }}
      />

      {/* Card Content Interior */}
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          {/* Header Bar: Number + System Tag + Recessed Icon */}
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-neutral-900">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs tracking-widest text-neutral-300 px-2 py-0.5 bg-neutral-900 border border-neutral-800">
                {item.number}
              </span>
              <span className="font-mono text-[10px] tracking-wider text-neutral-400 uppercase font-medium">
                {item.systemTag}
              </span>
            </div>
            <div className="p-2 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-300">
              {item.icon}
            </div>
          </div>

          {/* Title */}
          <div className="mb-3">
            <h3 className="text-xl sm:text-2xl font-light text-white group-hover:text-white transition-colors">
              {item.title}
            </h3>
          </div>

          {/* User-Specified Resting Highlight Line */}
          <div className="p-3 mb-5 bg-neutral-900/60 border border-neutral-800/80 rounded">
            <p className="text-xs text-neutral-300 font-light leading-relaxed">
              {item.restingHighlight}
            </p>
          </div>

          {/* Tech Stack Chips Preview */}
          <div className="pt-3 border-t border-neutral-900/80 mb-4">
            <div className="flex flex-wrap gap-1.5">
              {item.techStack.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-[9px] px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400"
                >
                  {tech}
                </span>
              ))}
              {item.techStack.length > 3 && (
                <span className="font-mono text-[9px] px-1.5 py-0.5 text-neutral-400 self-center">
                  +{item.techStack.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* ========================================================== */}
          {/* EXPANDED CONTENT: BALANCED PARAGRAPH & DELIVERABLES MATRIX  */}
          {/* ========================================================== */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0, scale: 0.98 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="pt-4 pb-2 border-t border-neutral-900 space-y-4">
                  {/* Balanced Paragraph Format (Not too big, not too short) */}
                  <div className="p-3.5 bg-black/80 border border-neutral-800/90 rounded text-neutral-300">
                    <span className="block font-mono text-[9px] uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center">
                      <FileText className="w-2.5 h-2.5 mr-1 text-white" />
                      SERVICE OVERVIEW & ARCHITECTURE
                    </span>
                    <p className="text-xs font-light leading-relaxed text-neutral-300">
                      {item.detailedParagraph}
                    </p>
                  </div>

                  {/* Complete Deliverables Matrix */}
                  <div>
                    <span className="block font-mono text-[9px] uppercase tracking-wider text-neutral-400 mb-2">
                      CORE DELIVERABLES:
                    </span>
                    <div className="space-y-1.5">
                      {item.deliverables.map((del, idx) => (
                        <div
                          key={idx}
                          className="flex items-center text-xs text-neutral-300 font-light"
                        >
                          <Check className="w-3 h-3 text-neutral-400 mr-2 shrink-0" />
                          <span className="truncate">{del}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Complete Tech Stack */}
                  <div>
                    <span className="block font-mono text-[9px] uppercase tracking-wider text-neutral-400 mb-1.5">
                      ECOSYSTEM & TOOLS:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="font-mono text-[9px] px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleScrollToSection('estimator');
                      }}
                      className="p-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-500 hover:bg-neutral-850 text-white font-mono text-[10px] uppercase tracking-wider flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Calculator className="w-3 h-3 mr-1.5 text-neutral-400" />
                      <span>Model Scope</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleScrollToSection('contact');
                      }}
                      className="p-2 bg-white text-black hover:bg-neutral-200 font-mono text-[10px] uppercase tracking-wider font-semibold flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Send className="w-3 h-3 mr-1.5 text-black" />
                      <span>Start Inquiry</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Card Footer Expand/Collapse Trigger */}
        <div
          onClick={onToggle}
          className="pt-3.5 border-t border-neutral-900 flex items-center justify-between text-xs font-mono uppercase tracking-wider text-neutral-400 group-hover:text-white transition-colors cursor-pointer"
        >
          <span className="inline-flex items-center">
            {isExpanded ? (
              <>
                <Minus className="w-3.5 h-3.5 mr-1.5 text-white" />
                <span>Collapse Details</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 mr-1.5 text-neutral-400 group-hover:text-white transition-colors" />
                <span>Expand Service Details</span>
              </>
            )}
          </span>
          <ArrowRight
            className={`w-3.5 h-3.5 transition-transform duration-300 ${
              isExpanded
                ? '-rotate-90 text-white'
                : 'group-hover:translate-x-1.5 text-neutral-400 group-hover:text-white'
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export const Services: React.FC<ServicesProps> = ({ onSelectService }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
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
            <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-white">
              Engineering Digital Reality
            </h2>
          </div>
          <p className="mt-4 md:mt-0 text-neutral-400 max-w-sm text-sm sm:text-base leading-relaxed font-light">
            Click any practice area to expand its architectural overview, complete deliverables matrix, and execution specifications.
          </p>
        </div>

        {/* Clean, Symmetrical 3-Column Grid Alignment */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {servicesConfig.map((item) => (
            <ServiceCard
              key={item.id}
              item={item}
              isExpanded={expandedId === item.id}
              onToggle={() => toggleExpand(item.id)}
              onSelectService={onSelectService}
            />
          ))}
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

'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { servicesData } from '@/data/services';
import { ServiceItem } from '@/types';
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

// Product-grade narrative descriptions and executive bullets for all 6 services
const serviceProductDetails: Record<
  string,
  {
    systemTag: string;
    icon: React.ReactNode;
    executiveBullets: string[];
    detailedParagraph: string;
  }
> = {
  'software-dev': {
    systemTag: 'CORE ARCHITECTURE',
    icon: <Code2 className="w-4 h-4" />,
    executiveBullets: [
      'Proprietary business software & bespoke web applications',
      'High-throughput backend API engines & automation workflows',
      'Resilient relational & document database schema modeling',
      'Cloud containerization with automated CI/CD pipelines',
    ],
    detailedParagraph:
      'We architect production-grade software solutions engineered around your exact operational workflows and business logic. Moving beyond off-the-shelf templates, every system is crafted with strictly typed codebases, high-throughput microservices, and battle-tested databases capable of scaling seamlessly as your user volume expands.',
  },
  'software-enhancement': {
    systemTag: 'MODERNIZATION',
    icon: <RefreshCw className="w-4 h-4" />,
    executiveBullets: [
      'Legacy codebase refactoring & technical debt reduction',
      'Query optimization delivering up to 3.5x throughput gain',
      'Zero-downtime database index tuning & schema migration',
      'Modern UI/UX interface overhaul with design systems',
    ],
    detailedParagraph:
      'We diagnose and eliminate architectural bottlenecks in existing applications. Whether tackling accumulated technical debt, optimizing sluggish database queries, or overhauling aging user interfaces, our team revitalizes your software into a high-performance modern platform with zero operational downtime.',
  },
  'academic-projects': {
    systemTag: 'ACADEMIC ENGINEERING',
    icon: <GraduationCap className="w-4 h-4" />,
    executiveBullets: [
      'Capstone & final-year software development assistance',
      'Production-quality full-stack web & machine learning prototypes',
      'Comprehensive IEEE-standard SRS documentation & diagrams',
      'Live system demonstration & technical viva defense coaching',
    ],
    detailedParagraph:
      'We provide rigorous engineering mentorship and technical execution for students and researchers tackling complex academic software prototypes. From machine learning pipelines to modern full-stack architectures, we deliver clean source code alongside structured IEEE documentation to ensure complete mastery during project defense.',
  },
  'mobile-dev': {
    systemTag: 'MOBILE ECOSYSTEM',
    icon: <Smartphone className="w-4 h-4" />,
    executiveBullets: [
      'Cross-platform iOS & Android native mobile applications',
      'Fluid 60fps micro-animations & platform-specific ergonomics',
      'Offline-first local database caching & cloud synchronization',
      'Push notification pipelines & automated app store deployment',
    ],
    detailedParagraph:
      'We create high-performance mobile applications that combine native fluid responsiveness with robust offline capabilities. Built with React Native and modern native bridges, our apps deliver unified cross-platform parity while maintaining platform-specific design fidelity across iOS and Android.',
  },
  'web-dev': {
    systemTag: 'PERFORMANCE WEB',
    icon: <Globe className="w-4 h-4" />,
    executiveBullets: [
      '100/100 Core Web Vitals & Lighthouse performance standards',
      'Bespoke editorial agency aesthetics & brand identity design',
      'Ultra-fast server-side rendering & dynamic SEO schema structure',
      'Fluid multi-breakpoint responsiveness with zero layout shift',
    ],
    detailedParagraph:
      'We engineer distinctive, high-conversion web platforms that command brand authority. Utilizing Next.js App Router, Tailwind CSS, and custom WebGL micro-interactions, we guarantee instant page loads, flawless search engine indexability, and an unforgettable visual impression on every device.',
  },
  'end-to-end': {
    systemTag: 'LIFECYCLE SHIP 0→1',
    icon: <Rocket className="w-4 h-4" />,
    executiveBullets: [
      'Full product scoping & technical architecture blueprints',
      'Sprint-based milestone roadmap with staging preview deployments',
      'Automated cloud infrastructure, security audits & monitoring',
      'Complete source repository handover, documentation & training',
    ],
    detailedParagraph:
      'From initial whiteboard concept to production launch, we act as your dedicated engineering arm. We manage the complete product lifecycle through structured 6-stage delivery sprints, combining rapid prototyping, stringent automated testing, and comprehensive technical handover for uninterrupted operations.',
  },
};

// Expandable Service Card with Progressive Disclosure
interface ExpandableCardProps {
  service: ServiceItem;
  isExpanded: boolean;
  onToggle: () => void;
  onSelectService: (serviceTitle: string) => void;
}

const ExpandableServiceCard: React.FC<ExpandableCardProps> = ({
  service,
  isExpanded,
  onToggle,
  onSelectService,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);

  const details = serviceProductDetails[service.id] || {
    systemTag: 'PRACTICE AREA',
    icon: <Code2 className="w-4 h-4" />,
    executiveBullets: service.deliverables.slice(0, 4),
    detailedParagraph: service.description,
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleScrollToSection = (targetId: string) => {
    onSelectService(service.title);
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
          ? 'border-neutral-500 bg-neutral-950/95 ring-1 ring-white/20'
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

      {/* Card Body */}
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          {/* Header Row: Number + System Tag + Recessed Icon */}
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-neutral-900">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs tracking-widest text-neutral-300 px-2 py-0.5 bg-neutral-900 border border-neutral-800">
                {service.number}
              </span>
              <span className="font-mono text-[10px] tracking-wider text-neutral-400 uppercase font-medium">
                {details.systemTag}
              </span>
            </div>
            <div className="p-2 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-300">
              {details.icon}
            </div>
          </div>

          {/* Title & Monospace Tagline */}
          <div className="mb-4">
            <h3 className="text-xl font-medium text-white group-hover:text-white transition-colors">
              {service.title}
            </h3>
            {service.tagline && (
              <p className="font-mono text-[11px] text-neutral-400 mt-1 tracking-tight">
                {"// "}{service.tagline}
              </p>
            )}
          </div>

          {/* ========================================================== */}
          {/* 1. INITIAL DISPLAY: SCANNABLE BULLET POINTS               */}
          {/* ========================================================== */}
          <div className="mb-5">
            <span className="block font-mono text-[9px] uppercase tracking-wider text-neutral-400 mb-2.5">
              CAPABILITY HIGHLIGHTS:
            </span>
            <ul className="space-y-2">
              {details.executiveBullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start text-xs text-neutral-300 font-light leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-600 mt-1.5 mr-2.5 shrink-0 group-hover:bg-white transition-colors" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack Chips Preview */}
          <div className="pt-3 border-t border-neutral-900/80 mb-4">
            <div className="flex flex-wrap gap-1.5">
              {service.techStack.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-[9px] px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400"
                >
                  {tech}
                </span>
              ))}
              {service.techStack.length > 3 && (
                <span className="font-mono text-[9px] px-1.5 py-0.5 text-neutral-400 self-center">
                  +{service.techStack.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* ========================================================== */}
          {/* 2. EXPANDED DISPLAY: DEEP-DIVE PRODUCT DETAILS            */}
          {/* ========================================================== */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="pt-4 pb-2 border-t border-neutral-900 space-y-4">
                  {/* Detailed Narrative Paragraph */}
                  <div className="p-3.5 bg-black/80 border border-neutral-800/90 rounded text-neutral-300">
                    <span className="block font-mono text-[9px] uppercase tracking-wider text-neutral-400 mb-1.5 flex items-center">
                      <FileText className="w-2.5 h-2.5 mr-1 text-white" />
                      PRODUCT ARCHITECTURE & SCOPE
                    </span>
                    <p className="text-xs font-light leading-relaxed text-neutral-300">
                      {details.detailedParagraph}
                    </p>
                  </div>

                  {/* Complete Deliverables Matrix */}
                  <div>
                    <span className="block font-mono text-[9px] uppercase tracking-wider text-neutral-400 mb-2">
                      ALL DELIVERABLES & ARTIFACTS:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {service.deliverables.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center text-[11px] text-neutral-300 font-light"
                        >
                          <Check className="w-3 h-3 text-neutral-400 mr-1.5 shrink-0" />
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Full Target Tech Stack */}
                  <div>
                    <span className="block font-mono text-[9px] uppercase tracking-wider text-neutral-400 mb-1.5">
                      TARGET TECH ECOSYSTEM:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {service.techStack.map((tech) => (
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
                <span>Collapse Overview</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 mr-1.5 text-neutral-400 group-hover:text-white transition-colors" />
                <span>Expand Full Details</span>
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

        {/* Clean, Symmetrical 3-Column Grid Alignment (Original First Alignment) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {servicesData.map((service) => (
            <ExpandableServiceCard
              key={service.id}
              service={service}
              isExpanded={expandedId === service.id}
              onToggle={() => toggleExpand(service.id)}
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
            onClick={() => onSelectService('End-to-End Project Development')}
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

'use client';

import React, { useState, useRef } from 'react';
import { servicesData } from '@/data/services';
import { ServiceItem } from '@/types';
import { ServiceModal } from './ServiceModal';
import {
  Code2,
  RefreshCw,
  GraduationCap,
  Smartphone,
  Globe,
  Rocket,
  ArrowRight,
  Plus,
  Zap,
  Activity,
} from 'lucide-react';

interface ServicesProps {
  onSelectService: (serviceTitle: string) => void;
}

// Sub-component for individual Bento card with localized mouse spotlight
interface BentoCardProps {
  service: ServiceItem;
  className?: string;
  badgeLabel: string;
  icon: React.ReactNode;
  onOpen: () => void;
  children?: React.ReactNode;
}

const BentoCard: React.FC<BentoCardProps> = ({
  service,
  className = '',
  badgeLabel,
  icon,
  onOpen,
  children,
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

  return (
    <div
      ref={cardRef}
      onClick={onOpen}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: -1000, y: -1000 });
      }}
      onMouseMove={handleMouseMove}
      className={`group relative flex flex-col justify-between p-7 sm:p-8 bg-neutral-950 border border-neutral-800/90 hover:border-neutral-700 transition-all duration-300 cursor-pointer overflow-hidden ${className}`}
    >
      {/* 4 Architectural Corner Crosshairs (+) */}
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
            ? `radial-gradient(450px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.05), transparent 70%)`
            : undefined,
        }}
      />

      {/* Spotlight Border Illumination */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        style={{
          background: isHovered
            ? `radial-gradient(320px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.35), transparent 70%)`
            : undefined,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '1px',
        }}
      />

      {/* Card Content Wrapper */}
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          {/* Top Row: System Tag & Icon */}
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-neutral-900">
            <div className="flex items-center space-x-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-600 group-hover:bg-white transition-colors duration-300" />
              <span className="font-mono text-[11px] tracking-widest text-neutral-400 uppercase font-medium">
                {badgeLabel}
              </span>
            </div>
            <div className="p-2 rounded bg-neutral-900/90 border border-neutral-800 text-neutral-300 group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-300">
              {icon}
            </div>
          </div>

          {/* Title & Tagline */}
          <div className="mb-4">
            <h3 className="text-xl sm:text-2xl font-light text-white group-hover:text-white transition-colors">
              {service.title}
            </h3>
            {service.tagline && (
              <p className="font-mono text-xs text-neutral-500 mt-1 tracking-tight">
                {"// "}{service.tagline}
              </p>
            )}
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed mb-5">
            {service.description}
          </p>

          {/* Bespoke Interactive Children (Architecture Teasers, Badges, Metrics) */}
          {children}

          {/* Deliverables Preview List */}
          <div className="space-y-2 mb-6">
            <span className="block font-mono text-[10px] uppercase tracking-wider text-neutral-500 mb-1">
              CORE DELIVERABLES:
            </span>
            {service.deliverables.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex items-center text-xs text-neutral-300 font-light">
                <span className="w-1 h-1 bg-neutral-600 rounded-full mr-2 group-hover:bg-white transition-colors shrink-0" />
                <span className="truncate">{item}</span>
              </div>
            ))}
          </div>

          {/* Tech Stack Chips */}
          <div className="pt-4 border-t border-neutral-900/80 mb-6">
            <span className="block font-mono text-[10px] uppercase tracking-wider text-neutral-500 mb-2">
              ECOSYSTEM:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {service.techStack.map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-[10px] px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 group-hover:border-neutral-700 transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Card Footer Link */}
        <div className="pt-4 border-t border-neutral-900 flex items-center justify-between text-xs font-mono uppercase tracking-wider text-neutral-400 group-hover:text-white transition-colors">
          <span className="inline-flex items-center">
            <Plus className="w-3.5 h-3.5 mr-1.5 text-neutral-500 group-hover:text-white transition-colors" />
            View Full Specifications
          </span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1.5 text-neutral-500 group-hover:text-white" />
        </div>
      </div>
    </div>
  );
};

export const Services: React.FC<ServicesProps> = ({ onSelectService }) => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  // Map service IDs to items
  const serviceMap = servicesData.reduce<Record<string, ServiceItem>>((acc, s) => {
    acc[s.id] = s;
    return acc;
  }, {});

  const customDev = serviceMap['software-dev'];
  const modernization = serviceMap['software-enhancement'];
  const academic = serviceMap['academic-projects'];
  const mobile = serviceMap['mobile-dev'];
  const web = serviceMap['web-dev'];
  const endToEnd = serviceMap['end-to-end'];

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
            Bespoke software architecture, modern web platforms, mobile engineering, and structured product delivery.
          </p>
        </div>

        {/* ============================================================== */}
        {/* ASYMMETRICAL EDITORIAL BENTO GRID                             */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">
          {/* ------------------------------------------------------------ */}
          {/* 01. CUSTOM SOFTWARE DEVELOPMENT (Featured Hero - 8 Cols)     */}
          {/* ------------------------------------------------------------ */}
          {customDev && (
            <BentoCard
              service={customDev}
              badgeLabel="SYS.01 // CORE ARCHITECTURE"
              icon={<Code2 className="w-5 h-5" />}
              onOpen={() => setSelectedService(customDev)}
              className="lg:col-span-8 bg-gradient-to-br from-neutral-950 via-neutral-950 to-neutral-900/40"
            >
              {/* Architecture Flow Schematic Preview */}
              <div className="p-4 mb-5 bg-black/60 border border-neutral-800/80 rounded">
                <span className="block font-mono text-[9px] uppercase tracking-wider text-neutral-500 mb-3 flex items-center">
                  <Activity className="w-3 h-3 mr-1.5 text-neutral-400" />
                  ARCHITECTURAL TOPOLOGY SCHEMATIC
                </span>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-2 border border-neutral-800 bg-neutral-950 rounded">
                    <span className="block font-mono text-[10px] text-white font-medium">UI / Client</span>
                    <span className="block font-mono text-[8px] text-neutral-500">React · Native</span>
                  </div>
                  <div className="p-2 border border-neutral-800 bg-neutral-950 rounded relative">
                    <span className="block font-mono text-[10px] text-white font-medium">API Layer</span>
                    <span className="block font-mono text-[8px] text-neutral-500">REST · GraphQL</span>
                  </div>
                  <div className="p-2 border border-neutral-800 bg-neutral-950 rounded">
                    <span className="block font-mono text-[10px] text-white font-medium">Core Logic</span>
                    <span className="block font-mono text-[8px] text-neutral-500">Node · Go · Py</span>
                  </div>
                  <div className="p-2 border border-neutral-800 bg-neutral-950 rounded">
                    <span className="block font-mono text-[10px] text-white font-medium">Storage</span>
                    <span className="block font-mono text-[8px] text-neutral-500">Postgres · Redis</span>
                  </div>
                </div>
              </div>
            </BentoCard>
          )}

          {/* ------------------------------------------------------------ */}
          {/* 02. SOFTWARE ENHANCEMENT & MODERNIZATION (4 Cols)           */}
          {/* ------------------------------------------------------------ */}
          {modernization && (
            <BentoCard
              service={modernization}
              badgeLabel="SYS.02 // MODERNIZATION"
              icon={<RefreshCw className="w-5 h-5" />}
              onOpen={() => setSelectedService(modernization)}
              className="lg:col-span-4"
            >
              {/* Performance & Refactoring Micro-Badge */}
              <div className="p-3.5 mb-5 bg-neutral-900/60 border border-neutral-800/80 rounded flex items-center justify-between">
                <div>
                  <span className="block font-mono text-[10px] text-neutral-400 uppercase">THROUGHPUT GAIN</span>
                  <span className="font-mono text-sm text-white font-semibold">⚡ Up to 3.5x Speedup</span>
                </div>
                <div className="text-right">
                  <span className="block font-mono text-[10px] text-neutral-400 uppercase">MIGRATION</span>
                  <span className="font-mono text-xs text-neutral-300">Zero Downtime</span>
                </div>
              </div>
            </BentoCard>
          )}

          {/* ------------------------------------------------------------ */}
          {/* 04. MOBILE APP DEVELOPMENT (4 Cols)                         */}
          {/* ------------------------------------------------------------ */}
          {mobile && (
            <BentoCard
              service={mobile}
              badgeLabel="SYS.04 // MOBILE ECOSYSTEM"
              icon={<Smartphone className="w-5 h-5" />}
              onOpen={() => setSelectedService(mobile)}
              className="lg:col-span-4"
            >
              {/* Platform Target Indicators */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                <div className="p-2.5 bg-neutral-900/60 border border-neutral-800 rounded text-center">
                  <span className="block font-mono text-xs text-white font-medium">iOS & Android</span>
                  <span className="block font-mono text-[9px] text-neutral-400">Native Performance</span>
                </div>
                <div className="p-2.5 bg-neutral-900/60 border border-neutral-800 rounded text-center">
                  <span className="block font-mono text-xs text-white font-medium">Offline-First</span>
                  <span className="block font-mono text-[9px] text-neutral-400">Local DB Sync</span>
                </div>
              </div>
            </BentoCard>
          )}

          {/* ------------------------------------------------------------ */}
          {/* 05. WEBSITE DESIGN & DEVELOPMENT (Featured Panoramic - 8)    */}
          {/* ------------------------------------------------------------ */}
          {web && (
            <BentoCard
              service={web}
              badgeLabel="SYS.05 // PERFORMANCE WEB"
              icon={<Globe className="w-5 h-5" />}
              onOpen={() => setSelectedService(web)}
              className="lg:col-span-8 bg-gradient-to-bl from-neutral-950 via-neutral-950 to-neutral-900/40"
            >
              {/* Performance Radar Bar */}
              <div className="p-4 mb-5 bg-black/60 border border-neutral-800/80 rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-400 flex items-center">
                    <Zap className="w-3 h-3 mr-1 text-white" />
                    CORE WEB VITALS BENCHMARK
                  </span>
                  <span className="font-mono text-[9px] text-neutral-400">LIGHTHOUSE AUDIT</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="p-2 bg-neutral-950 border border-neutral-800/90 text-center rounded">
                    <span className="block font-mono text-xs text-white font-semibold">100</span>
                    <span className="block font-mono text-[8px] text-neutral-500 uppercase">Performance</span>
                  </div>
                  <div className="p-2 bg-neutral-950 border border-neutral-800/90 text-center rounded">
                    <span className="block font-mono text-xs text-white font-semibold">100</span>
                    <span className="block font-mono text-[8px] text-neutral-500 uppercase">Accessibility</span>
                  </div>
                  <div className="p-2 bg-neutral-950 border border-neutral-800/90 text-center rounded">
                    <span className="block font-mono text-xs text-white font-semibold">100</span>
                    <span className="block font-mono text-[8px] text-neutral-500 uppercase">Best Practices</span>
                  </div>
                  <div className="p-2 bg-neutral-950 border border-neutral-800/90 text-center rounded">
                    <span className="block font-mono text-xs text-white font-semibold">100</span>
                    <span className="block font-mono text-[8px] text-neutral-500 uppercase">SEO Rank</span>
                  </div>
                </div>
              </div>
            </BentoCard>
          )}

          {/* ------------------------------------------------------------ */}
          {/* 03. COLLEGE & ACADEMIC PROJECTS (6 Cols)                    */}
          {/* ------------------------------------------------------------ */}
          {academic && (
            <BentoCard
              service={academic}
              badgeLabel="SYS.03 // ACADEMIC ENGINEERING"
              icon={<GraduationCap className="w-5 h-5" />}
              onOpen={() => setSelectedService(academic)}
              className="lg:col-span-6"
            >
              {/* Academic Guidance Pillars */}
              <div className="p-3.5 mb-5 bg-neutral-900/60 border border-neutral-800/80 rounded flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-300">✓ SRS Architecture</span>
                <span className="text-neutral-600">|</span>
                <span className="text-neutral-300">✓ Full Source Repo</span>
                <span className="text-neutral-600">|</span>
                <span className="text-neutral-300">✓ Viva Demonstration</span>
              </div>
            </BentoCard>
          )}

          {/* ------------------------------------------------------------ */}
          {/* 06. END-TO-END PROJECT DEVELOPMENT (6 Cols)                 */}
          {/* ------------------------------------------------------------ */}
          {endToEnd && (
            <BentoCard
              service={endToEnd}
              badgeLabel="SYS.06 // LIFECYCLE SHIP 0→1"
              icon={<Rocket className="w-5 h-5" />}
              onOpen={() => setSelectedService(endToEnd)}
              className="lg:col-span-6"
            >
              {/* 6-Stage Sprint Pipeline Dots */}
              <div className="p-3.5 mb-5 bg-neutral-900/60 border border-neutral-800/80 rounded">
                <span className="block font-mono text-[9px] uppercase tracking-wider text-neutral-500 mb-2">
                  DISCOVERY TO PRODUCTION PIPELINE:
                </span>
                <div className="flex items-center justify-between font-mono text-[9px] text-neutral-400">
                  <span className="text-white font-medium">01 DISCOVER</span>
                  <span>→</span>
                  <span>02 PLAN</span>
                  <span>→</span>
                  <span>03 DESIGN</span>
                  <span>→</span>
                  <span>04 BUILD</span>
                  <span>→</span>
                  <span className="text-white font-medium">06 SHIP</span>
                </div>
              </div>
            </BentoCard>
          )}
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

      {/* Service Deep-Dive Modal */}
      <ServiceModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onInquire={(title) => {
          setSelectedService(null);
          onSelectService(title);
        }}
      />
    </section>
  );
};

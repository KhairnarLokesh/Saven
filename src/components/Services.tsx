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
  Check,
} from 'lucide-react';

interface ServicesProps {
  onSelectService: (serviceTitle: string) => void;
}

// Individual Linear/Vercel-inspired Architectural Spec Card
interface ServiceCardProps {
  service: ServiceItem;
  systemTag: string;
  icon: React.ReactNode;
  onOpen: () => void;
  microStage: React.ReactNode;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  systemTag,
  icon,
  onOpen,
  microStage,
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
      className="group relative flex flex-col justify-between p-7 bg-neutral-950 border border-neutral-800/90 hover:border-neutral-600 transition-all duration-300 cursor-pointer overflow-hidden rounded-none shadow-2xl hover:-translate-y-1"
    >
      {/* Precision Corner Crosshairs (+) - Linear/Vercel Architectural aesthetic */}
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
          {/* Header Bar: Monospace System ID & Recessed Icon */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-900">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs tracking-widest text-neutral-300 px-2 py-0.5 bg-neutral-900 border border-neutral-800">
                {service.number}
              </span>
              <span className="font-mono text-[10px] tracking-wider text-neutral-400 uppercase">
                {systemTag}
              </span>
            </div>
            <div className="p-2 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-300">
              {icon}
            </div>
          </div>

          {/* Title & Monospace Tagline */}
          <div className="mb-3">
            <h3 className="text-lg sm:text-xl font-medium text-white group-hover:text-white transition-colors">
              {service.title}
            </h3>
            {service.tagline && (
              <p className="font-mono text-[11px] text-neutral-400 mt-1 tracking-tight">
                {"// "}{service.tagline}
              </p>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-neutral-400 font-light leading-relaxed mb-4">
            {service.description}
          </p>

          {/* Visual Micro-Stage (Bespoke per service) */}
          <div className="mb-5">{microStage}</div>

          {/* Key Deliverables with Micro-Checks */}
          <div className="space-y-1.5 mb-5">
            <span className="block font-mono text-[9px] uppercase tracking-wider text-neutral-400 mb-1">
              KEY DELIVERABLES:
            </span>
            {service.deliverables.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex items-center text-xs text-neutral-300 font-light">
                <Check className="w-3 h-3 text-neutral-400 mr-2 shrink-0 group-hover:text-white transition-colors" />
                <span className="truncate">{item}</span>
              </div>
            ))}
          </div>

          {/* Tech Stack Ecosystem Chips */}
          <div className="pt-3.5 border-t border-neutral-900/80 mb-5">
            <span className="block font-mono text-[9px] uppercase tracking-wider text-neutral-400 mb-1.5">
              TECH STACK:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {service.techStack.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-[10px] px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 group-hover:border-neutral-700 transition-colors"
                >
                  {tech}
                </span>
              ))}
              {service.techStack.length > 4 && (
                <span className="font-mono text-[9px] px-1.5 py-0.5 text-neutral-400 self-center">
                  +{service.techStack.length - 4} more
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Link Footer */}
        <div className="pt-3.5 border-t border-neutral-900 flex items-center justify-between text-xs font-mono uppercase tracking-wider text-neutral-300 group-hover:text-white transition-colors">
          <span className="inline-flex items-center">
            <Plus className="w-3.5 h-3.5 mr-1.5 text-neutral-400 group-hover:text-white transition-colors" />
            View Specifications
          </span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1.5 text-neutral-400 group-hover:text-white" />
        </div>
      </div>
    </div>
  );
};

export const Services: React.FC<ServicesProps> = ({ onSelectService }) => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const getServiceConfig = (id: string) => {
    switch (id) {
      case 'software-dev':
        return {
          systemTag: 'CORE ARCHITECTURE',
          icon: <Code2 className="w-4 h-4" />,
          microStage: (
            <div className="p-3 bg-neutral-900/60 border border-neutral-800/80 rounded">
              <span className="block font-mono text-[9px] uppercase tracking-wider text-neutral-400 mb-2 flex items-center">
                <Activity className="w-2.5 h-2.5 mr-1 text-white" />
                SYSTEM DATA PIPELINE
              </span>
              <div className="grid grid-cols-4 gap-1 text-center font-mono text-[9px]">
                <div className="p-1.5 bg-neutral-950 border border-neutral-800 rounded text-neutral-200">
                  Client
                </div>
                <div className="p-1.5 bg-neutral-950 border border-neutral-800 rounded text-neutral-200">
                  Gateway
                </div>
                <div className="p-1.5 bg-neutral-950 border border-neutral-800 rounded text-neutral-200">
                  Logic
                </div>
                <div className="p-1.5 bg-neutral-950 border border-neutral-800 rounded text-neutral-200">
                  DB
                </div>
              </div>
            </div>
          ),
        };
      case 'software-enhancement':
        return {
          systemTag: 'MODERNIZATION',
          icon: <RefreshCw className="w-4 h-4" />,
          microStage: (
            <div className="p-3 bg-neutral-900/60 border border-neutral-800/80 rounded flex items-center justify-between">
              <div>
                <span className="block font-mono text-[9px] text-neutral-400 uppercase">SPEED GAIN</span>
                <span className="font-mono text-xs text-white font-semibold">⚡ Up to 3.5x Faster</span>
              </div>
              <div className="text-right">
                <span className="block font-mono text-[9px] text-neutral-400 uppercase">MIGRATION</span>
                <span className="font-mono text-[10px] text-neutral-300">Zero Downtime</span>
              </div>
            </div>
          ),
        };
      case 'academic-projects':
        return {
          systemTag: 'ACADEMIC ENGINEERING',
          icon: <GraduationCap className="w-4 h-4" />,
          microStage: (
            <div className="p-2.5 bg-neutral-900/60 border border-neutral-800/80 rounded flex items-center justify-between font-mono text-[10px]">
              <span className="text-neutral-300">✓ SRS Spec</span>
              <span className="text-neutral-600">|</span>
              <span className="text-neutral-300">✓ Source Repo</span>
              <span className="text-neutral-600">|</span>
              <span className="text-neutral-300">✓ Viva Prep</span>
            </div>
          ),
        };
      case 'mobile-dev':
        return {
          systemTag: 'MOBILE ECOSYSTEM',
          icon: <Smartphone className="w-4 h-4" />,
          microStage: (
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-neutral-900/60 border border-neutral-800 rounded text-center">
                <span className="block font-mono text-[10px] text-white">iOS & Android</span>
                <span className="block font-mono text-[8px] text-neutral-400">Native Feel</span>
              </div>
              <div className="p-2 bg-neutral-900/60 border border-neutral-800 rounded text-center">
                <span className="block font-mono text-[10px] text-white">Offline-First</span>
                <span className="block font-mono text-[8px] text-neutral-400">Local DB Sync</span>
              </div>
            </div>
          ),
        };
      case 'web-dev':
        return {
          systemTag: 'PERFORMANCE WEB',
          icon: <Globe className="w-4 h-4" />,
          microStage: (
            <div className="p-2.5 bg-neutral-900/60 border border-neutral-800/80 rounded">
              <div className="flex items-center justify-between mb-1.5 font-mono text-[8px] text-neutral-400">
                <span className="flex items-center text-white">
                  <Zap className="w-2.5 h-2.5 mr-1 text-white" />
                  CORE WEB VITALS
                </span>
                <span>AUDIT 100/100</span>
              </div>
              <div className="grid grid-cols-4 gap-1 text-center font-mono">
                <div className="p-1 bg-neutral-950 border border-neutral-800 rounded text-[9px] text-white">
                  100 <span className="block text-[7px] text-neutral-400">PERF</span>
                </div>
                <div className="p-1 bg-neutral-950 border border-neutral-800 rounded text-[9px] text-white">
                  100 <span className="block text-[7px] text-neutral-400">A11Y</span>
                </div>
                <div className="p-1 bg-neutral-950 border border-neutral-800 rounded text-[9px] text-white">
                  100 <span className="block text-[7px] text-neutral-400">BEST</span>
                </div>
                <div className="p-1 bg-neutral-950 border border-neutral-800 rounded text-[9px] text-white">
                  100 <span className="block text-[7px] text-neutral-400">SEO</span>
                </div>
              </div>
            </div>
          ),
        };
      case 'end-to-end':
        return {
          systemTag: 'LIFECYCLE SHIP 0→1',
          icon: <Rocket className="w-4 h-4" />,
          microStage: (
            <div className="p-2.5 bg-neutral-900/60 border border-neutral-800/80 rounded font-mono text-[8px]">
              <span className="block uppercase text-neutral-400 mb-1.5">
                DELIVERY PIPELINE:
              </span>
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-white font-medium">DISCOVER</span>
                <span>→</span>
                <span>PLAN</span>
                <span>→</span>
                <span>BUILD</span>
                <span>→</span>
                <span className="text-white font-medium">SHIP</span>
              </div>
            </div>
          ),
        };
      default:
        return {
          systemTag: 'PRACTICE AREA',
          icon: <Code2 className="w-4 h-4" />,
          microStage: null,
        };
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
              01 // WHAT WE DO
            </div>
            <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-white">
              Engineering Digital Reality
            </h2>
          </div>
          <p className="mt-4 md:mt-0 text-neutral-400 max-w-sm text-sm sm:text-base leading-relaxed font-light">
            End-to-end technical engineering from initial scoping to production delivery.
          </p>
        </div>

        {/* Clean, Symmetrical 3-Column Grid Alignment (Original First Alignment) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesData.map((service) => {
            const config = getServiceConfig(service.id);
            return (
              <ServiceCard
                key={service.id}
                service={service}
                systemTag={config.systemTag}
                icon={config.icon}
                microStage={config.microStage}
                onOpen={() => setSelectedService(service)}
              />
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

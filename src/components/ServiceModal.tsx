'use client';

import React from 'react';
import { ServiceItem } from '@/types';
import { X, Check, ArrowRight, Layers, Cpu, Compass } from 'lucide-react';

interface ServiceModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onInquire: (serviceTitle: string) => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({ service, onClose, onInquire }) => {
  if (!service) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md transition-opacity duration-200"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-neutral-950 border border-neutral-700 p-6 sm:p-8 max-h-[90vh] overflow-y-auto text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-white border border-neutral-800 hover:border-white transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="border-b border-neutral-800 pb-6 mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <span className="font-mono text-xs tracking-widest text-neutral-400 border border-neutral-800 px-2.5 py-1">
              SERVICE {service.number}
            </span>
            <span className="text-xs uppercase tracking-widest text-neutral-500 font-mono">
              SAVEN SPECIFICATION
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-light text-white mb-2">{service.title}</h2>
          <p className="text-sm font-mono text-neutral-400">{service.tagline}</p>
        </div>

        {/* Modal Body */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-2 flex items-center">
              <Compass className="w-3.5 h-3.5 mr-1.5 text-white" />
              Overview & Objectives
            </h3>
            <p className="text-sm text-neutral-300 leading-relaxed">{service.description}</p>
          </div>

          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-2 flex items-center">
              <Layers className="w-3.5 h-3.5 mr-1.5 text-white" />
              Scope of Deliverables
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {service.deliverables.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start space-x-2 text-xs text-neutral-300 p-2.5 bg-neutral-900/60 border border-neutral-800"
                >
                  <Check className="w-3.5 h-3.5 text-white shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-2 flex items-center">
              <Cpu className="w-3.5 h-3.5 mr-1.5 text-white" />
              Representative Tech Stack
            </h3>
            <div className="flex flex-wrap gap-2 pt-1">
              {service.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="text-xs font-mono px-3 py-1 bg-black border border-neutral-700 text-neutral-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 bg-black border border-neutral-800">
            <span className="text-xs font-mono uppercase text-neutral-400 block mb-1">
              Ideal Scenarios:
            </span>
            <p className="text-xs text-neutral-300 leading-relaxed">{service.idealFor}</p>
          </div>
        </div>

        {/* Modal Footer / Direct Inquiry CTA */}
        <div className="mt-8 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-neutral-500 font-mono">
            REF: SVC-{service.number} {'//'} INQUIRY READY
          </span>
          <button
            onClick={() => {
              onClose();
              onInquire(service.title);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-white text-black text-xs uppercase tracking-widest font-semibold border border-white hover:bg-black hover:text-white transition-all cursor-pointer group"
          >
            <span>Inquire About This Service</span>
            <ArrowRight className="w-3.5 h-3.5 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

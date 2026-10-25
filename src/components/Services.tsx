'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';

interface ServicesProps {
  onSelectService: (serviceTitle: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectService }) => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  // Helper for monochromatic service icons
  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'software-dev':
        return <Code2 className="w-5 h-5 text-white" />;
      case 'software-enhancement':
        return <RefreshCw className="w-5 h-5 text-white" />;
      case 'academic-projects':
        return <GraduationCap className="w-5 h-5 text-white" />;
      case 'mobile-dev':
        return <Smartphone className="w-5 h-5 text-white" />;
      case 'web-dev':
        return <Globe className="w-5 h-5 text-white" />;
      case 'end-to-end':
        return <Rocket className="w-5 h-5 text-white" />;
      default:
        return <Code2 className="w-5 h-5 text-white" />;
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

        {/* Services Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesData.map((service) => (
            <div
              key={service.id}
              onClick={() => setSelectedService(service)}
              className="group relative flex flex-col justify-between p-7 bg-neutral-950 border border-neutral-800/90 hover:border-white transition-all duration-300 cursor-pointer shadow-lg hover:-translate-y-1"
            >
              <div>
                {/* Top Row: Service Number & Icon */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-xs tracking-widest text-neutral-400 px-2 py-1 bg-neutral-900 border border-neutral-800">
                    {service.number}
                  </span>
                  <div className="p-2 rounded bg-neutral-900 border border-neutral-800 group-hover:bg-white group-hover:text-black transition-colors duration-200">
                    <div className="group-hover:[&_svg]:text-black">
                      {getServiceIcon(service.id)}
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-medium text-white mb-3 group-hover:text-neutral-100 transition-colors">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-neutral-400 leading-relaxed font-light mb-6">
                  {service.description}
                </p>

                {/* Key Deliverables Snapshot */}
                <div className="space-y-2 mb-6">
                  {service.deliverables.slice(0, 3).map((del, idx) => (
                    <div key={idx} className="flex items-center text-xs text-neutral-300">
                      <span className="w-1 h-1 bg-neutral-600 rounded-full mr-2 group-hover:bg-white transition-colors" />
                      <span className="truncate">{del}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Action Link */}
              <div className="pt-4 border-t border-neutral-900 flex items-center justify-between text-xs uppercase tracking-wider font-semibold text-neutral-300 group-hover:text-white transition-colors">
                <span className="inline-flex items-center">
                  <Plus className="w-3.5 h-3.5 mr-1.5" />
                  View Full Specifications
                </span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner Note */}
        <div className="mt-12 p-6 border border-neutral-800 bg-neutral-950 flex flex-col sm:flex-row items-center justify-between gap-4">
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

'use client';

import React, { useState } from 'react';
import { Check, ArrowRight, RefreshCcw, Layers } from 'lucide-react';

interface EstimatorProps {
  onApplyEstimate: (data: {
    service: string;
    summary: string;
  }) => void;
}

export const Estimator: React.FC<EstimatorProps> = ({ onApplyEstimate }) => {
  const [projectType, setProjectType] = useState<'software' | 'modernization' | 'academic' | 'mobile' | 'web' | 'end-to-end'>('web');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['Web (Responsive)']);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(['Modern UI/UX Design System', 'Cloud CI/CD & Production Setup']);

  const projectTypes = [
    { id: 'software', name: 'Custom Software', subtitle: 'Tailored System Architecture', serviceTitle: 'Custom Software Development' },
    { id: 'modernization', name: 'Software Enhancement', subtitle: 'Refactoring & Modernization', serviceTitle: 'Software Enhancement & Modernization' },
    { id: 'academic', name: 'Academic Project', subtitle: 'Prototype & SRS Documentation', serviceTitle: 'College & Academic Projects' },
    { id: 'mobile', name: 'Mobile App', subtitle: 'iOS, Android & Cross-Platform', serviceTitle: 'Mobile App Development' },
    { id: 'web', name: 'Website Design & Dev', subtitle: 'Modern Web Stack & SEO', serviceTitle: 'Website Design & Development' },
    { id: 'end-to-end', name: 'End-to-End Product', subtitle: 'Full Lifecycle Engineering', serviceTitle: 'End-to-End Project Development' },
  ];

  const platforms = [
    'Web (Responsive)',
    'Mobile (iOS & Android)',
    'Backend & API Engine',
    'Database Architecture',
  ];

  const featureOptions = [
    'Auth & Role Permissions',
    'Modern UI/UX Design System',
    'Payment & Billing Gateways',
    'Real-time WebSockets / Push',
    'Database Optimization / Tuning',
    'SRS Technical Documentation',
    'Offline Data Sync',
    'Cloud CI/CD & Production Setup',
  ];

  const togglePlatform = (plat: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(plat) ? prev.filter((p) => p !== plat) : [...prev, plat]
    );
  };

  const toggleFeature = (feat: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feat) ? prev.filter((f) => f !== feat) : [...prev, feat]
    );
  };

  const currentType = projectTypes.find((p) => p.id === projectType)!;

  const handleTransferToContact = () => {
    const summary = `Configured via SAVEN Scope Modeler:
- Service: ${currentType.serviceTitle}
- Target Platforms: ${selectedPlatforms.join(', ') || 'Standard'}
- Core Capabilities: ${selectedFeatures.join(', ') || 'Baseline'}`;

    onApplyEstimate({
      service: currentType.serviceTitle,
      summary,
    });
  };

  return (
    <section id="estimator" className="py-24 bg-black text-white border-b border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <h2 className="text-3xl sm:text-4xl font-light text-white mb-3">
            Project Scope & Architecture Estimator
          </h2>
          <p className="text-sm text-neutral-400 leading-relaxed font-light">
            Model your project parameters to configure your platform matrix, modular architecture, and technical scope. No commitments required.
          </p>
        </div>

        {/* Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column (8 cols) */}
          <div className="lg:col-span-8 space-y-8 bg-neutral-950 p-6 sm:p-8 border border-neutral-800">
            {/* 1. Project Type */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 block mb-3">
                1. Select Digital Solution Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {projectTypes.map((type) => {
                  const isSelected = projectType === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setProjectType(type.id as typeof projectType)}
                      className={`p-3 text-left border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white text-black border-white'
                          : 'bg-black text-neutral-300 border-neutral-800 hover:border-neutral-500'
                      }`}
                    >
                      <div className="text-xs font-semibold leading-tight">{type.name}</div>
                      <div className={`text-[10px] font-mono mt-1 ${isSelected ? 'text-neutral-700' : 'text-neutral-500'}`}>
                        {type.subtitle}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Platforms */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 block mb-3">
                2. Target Ecosystems & Platforms
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {platforms.map((plat) => {
                  const isChecked = selectedPlatforms.includes(plat);
                  return (
                    <button
                      key={plat}
                      type="button"
                      onClick={() => togglePlatform(plat)}
                      className={`flex items-center justify-between p-3 border text-xs cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-neutral-900 border-white text-white'
                          : 'bg-black border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <span>{plat}</span>
                      <div
                        className={`w-4 h-4 rounded-sm border flex items-center justify-center ${
                          isChecked ? 'bg-white border-white text-black' : 'border-neutral-700'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Core Capabilities */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 block mb-3">
                3. Technical Modules & Features
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {featureOptions.map((feat) => {
                  const isChecked = selectedFeatures.includes(feat);
                  return (
                    <button
                      key={feat}
                      type="button"
                      onClick={() => toggleFeature(feat)}
                      className={`flex items-center justify-between p-3 border text-xs cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-neutral-900 border-white text-white'
                          : 'bg-black border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <span className="truncate pr-2">{feat}</span>
                      <div
                        className={`w-4 h-4 rounded-sm border shrink-0 flex items-center justify-center ${
                          isChecked ? 'bg-white border-white text-black' : 'border-neutral-700'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Scope Telemetry Preview Card (4 cols) */}
          <div className="lg:col-span-4 bg-neutral-950 p-6 sm:p-7 border border-neutral-700 sticky top-24 shadow-2xl">
            <div className="pb-4 border-b border-neutral-800 mb-6">
              <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
                PROJECTION SUMMARY
              </span>
            </div>

            <div className="space-y-5">
              <div>
                <span className="text-[11px] font-mono uppercase text-neutral-500 block">
                  Selected Service:
                </span>
                <span className="text-sm font-medium text-white">{currentType.serviceTitle}</span>
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase text-neutral-500 block">
                  Architecture Tier:
                </span>
                <span className="text-sm font-medium text-white">
                  {currentType.subtitle}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase text-neutral-500 block">
                  Delivery Model:
                </span>
                <span className="text-sm font-medium text-white">
                  Sprint-Based Agile Milestone Delivery
                </span>
                <span className="text-[10px] text-neutral-500 block mt-0.5">
                  Complete source code & architecture ownership.
                </span>
              </div>

              <div className="pt-3 border-t border-neutral-800">
                <span className="text-[11px] font-mono uppercase text-neutral-400 block mb-2 flex items-center">
                  <Layers className="w-3 h-3 mr-1.5 text-white" />
                  Configured Scope:
                </span>
                <div className="text-xs text-neutral-400 space-y-1">
                  <div>• {selectedPlatforms.length} Ecosystem target(s)</div>
                  <div>• {selectedFeatures.length} Modular capability module(s)</div>
                </div>
              </div>
            </div>

            {/* Inquire with this scope CTA */}
            <div className="mt-8 pt-5 border-t border-neutral-800">
              <button
                type="button"
                onClick={handleTransferToContact}
                className="w-full inline-flex items-center justify-center px-4 py-3 bg-white text-black text-xs uppercase tracking-widest font-semibold border border-white hover:bg-black hover:text-white transition-all cursor-pointer group"
              >
                <span>Transfer To Inquiry Form</span>
                <ArrowRight className="w-3.5 h-3.5 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
              <div className="text-center mt-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPlatforms(['Web (Responsive)']);
                    setSelectedFeatures(['Modern UI/UX Design System']);
                  }}
                  className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 hover:text-white inline-flex items-center cursor-pointer"
                >
                  <RefreshCcw className="w-2.5 h-2.5 mr-1" />
                  Reset Estimator
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

'use client';

import React, { useState } from 'react';
import { processSteps } from '@/data/process';
import { CheckCircle2, Clock, ArrowRight } from 'lucide-react';

interface ProcessProps {
  onStartProject: () => void;
}

export const Process: React.FC<ProcessProps> = ({ onStartProject }) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStep = processSteps[activeStepIndex];

  return (
    <section id="process" className="py-28 bg-black text-white border-b border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-neutral-900">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-3 flex items-center">
              <span className="w-2 h-2 bg-white mr-2" />
              04 // METHODOLOGY
            </div>
            <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-white">
              From Idea to Implementation.
            </h2>
          </div>
          <p className="mt-4 md:mt-0 text-neutral-400 max-w-md text-sm sm:text-base leading-relaxed font-light">
            A structured, transparent development lifecycle engineered to eliminate ambiguity and deliver production-ready software on schedule.
          </p>
        </div>

        {/* Desktop Step Flow Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-10">
          {processSteps.map((step, idx) => {
            const isActive = activeStepIndex === idx;
            return (
              <button
                key={step.step}
                onClick={() => setActiveStepIndex(idx)}
                className={`p-4 text-left border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-black border-white shadow-lg'
                    : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-neutral-600 hover:text-white'
                }`}
              >
                <div className="font-mono text-xs font-semibold tracking-widest mb-1">
                  STEP {step.step}
                </div>
                <div className="text-sm font-medium tracking-tight truncate">{step.title}</div>
              </button>
            );
          })}
        </div>

        {/* Active Step Deep-Dive Card */}
        <div className="bg-neutral-950 border border-neutral-800 p-8 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Step Overview */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center space-x-3">
                <span className="font-mono text-xs tracking-widest px-3 py-1 bg-black border border-neutral-800 text-neutral-300">
                  PHASE {activeStep.step} OF 06
                </span>
                <span className="inline-flex items-center text-xs font-mono text-neutral-400">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-white" />
                  Agile Milestone Cadence
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-light text-white">
                {activeStep.title}: {activeStep.subhead}
              </h3>

              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-light">
                {activeStep.description}
              </p>

              {/* Navigation between steps */}
              <div className="pt-4 flex items-center space-x-4">
                <button
                  type="button"
                  disabled={activeStepIndex === 0}
                  onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 text-xs uppercase font-mono tracking-wider border border-neutral-800 hover:border-white disabled:opacity-30 disabled:hover:border-neutral-800 transition-colors cursor-pointer"
                >
                  Previous Phase
                </button>
                <button
                  type="button"
                  disabled={activeStepIndex === processSteps.length - 1}
                  onClick={() =>
                    setActiveStepIndex((prev) => Math.min(processSteps.length - 1, prev + 1))
                  }
                  className="px-4 py-2 text-xs uppercase font-mono tracking-wider border border-white bg-white text-black hover:bg-black hover:text-white disabled:opacity-30 transition-all cursor-pointer"
                >
                  Next Phase
                </button>
              </div>
            </div>

            {/* Deliverables Checklist */}
            <div className="lg:col-span-5 bg-black p-6 border border-neutral-800">
              <div className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-4 pb-2 border-b border-neutral-900 flex items-center justify-between">
                <span>Phase Deliverables</span>
                <span className="text-white">{activeStep.deliverables.length} Items</span>
              </div>

              <div className="space-y-3">
                {activeStep.deliverables.map((deliv, idx) => (
                  <div key={idx} className="flex items-start space-x-3 text-xs text-neutral-300">
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0 mt-0.5" />
                    <span>{deliv}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-900">
                <button
                  onClick={onStartProject}
                  className="w-full inline-flex items-center justify-center py-2.5 text-xs uppercase tracking-wider font-semibold bg-neutral-900 border border-neutral-700 text-white hover:bg-white hover:text-black hover:border-white transition-all cursor-pointer group"
                >
                  <span>Initiate Phase 01 Scoping</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

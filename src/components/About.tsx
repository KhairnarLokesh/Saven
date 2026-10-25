'use client';

import React from 'react';
import { principles, techCapabilities } from '@/data/about';
import { Compass, Check } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-28 bg-black text-white border-b border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-3 flex items-center">
            <Compass className="w-3.5 h-3.5 mr-2 text-white" />
            05 // ABOUT SAVEN
          </div>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-white mb-6">
            Technology With Purpose.
          </h2>
          <p className="text-base sm:text-xl text-neutral-300 font-light leading-relaxed max-w-2xl">
            We partner with founders, businesses, and creators to build reliable, high-performance software. Focused on clean implementation, thoughtful architecture, and zero fluff.
          </p>
        </div>

        {/* Four Core Principles Grid */}
        <div className="mb-20">
          <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-6">
            FOUNDATIONAL ENGINEERING PRINCIPLES
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {principles.map((p) => (
              <div
                key={p.number}
                className="p-6 bg-neutral-950 border border-neutral-800 hover:border-neutral-500 transition-colors"
              >
                <span className="font-mono text-xs tracking-widest text-neutral-400 px-2 py-0.5 bg-neutral-900 border border-neutral-800 inline-block mb-4">
                  {p.number}
                </span>
                <h4 className="text-lg font-medium text-white mb-2">{p.title}</h4>
                <p className="text-xs text-neutral-400 leading-relaxed font-light">{p.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack Capabilities Matrix */}
        <div className="p-8 bg-neutral-950 border border-neutral-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-neutral-900">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 block mb-1">
                CAPABILITY MATRIX
              </span>
              <h3 className="text-xl font-light text-white">Full-Stack Ecosystems We Command</h3>
            </div>
            <span className="text-xs font-mono text-neutral-500 mt-2 sm:mt-0">
              MODERN · TESTED · MAINTAINABLE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {techCapabilities.map((cat, idx) => (
              <div key={idx} className="space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 pb-1 border-b border-neutral-900">
                  {cat.category}
                </div>
                <div className="space-y-1.5">
                  {cat.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex items-center text-xs text-neutral-300">
                      <Check className="w-3.5 h-3.5 text-white mr-2 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

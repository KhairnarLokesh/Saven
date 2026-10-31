'use client';

import React from 'react';
import { differentiators } from '@/data/about';
import { Check } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-24 bg-black text-white border-b border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-neutral-900">
          <div>
            <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-white">
              Built Around Your Needs.
            </h2>
          </div>
          <p className="mt-4 md:mt-0 text-neutral-400 max-w-md text-sm sm:text-base leading-relaxed font-light">
            We focus on practical engineering, clean delivery, and honest accountability. No fabricated claims, only demonstrable quality.
          </p>
        </div>

        {/* 8 Differentiators Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {differentiators.map((diff, idx) => (
            <div
              key={idx}
              className="p-6 bg-neutral-950 border border-neutral-800/80 hover:border-white transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="w-5 h-5 rounded-full border border-neutral-800 flex items-center justify-center group-hover:border-white group-hover:bg-white group-hover:text-black transition-colors">
                    <Check className="w-3 h-3 text-neutral-400 group-hover:text-black" />
                  </div>
                </div>

                <h3 className="text-base font-medium text-white mb-2">{diff.title}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-light">
                  {diff.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface HeroProps {
  onStartProject?: () => void;
  onExploreServices: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartProject, onExploreServices }) => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-36 pb-24 sm:pt-44 sm:pb-28 md:pt-48 md:pb-32 overflow-hidden bg-[#090a0e] text-white border-b border-neutral-900"
    >
      {/* Background Cinematic Desk Scene (Laptop, lamp, desk, window shadows) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        {/* Desk scene image on the right */}
        <div
          className="absolute inset-0 bg-cover bg-right md:bg-right-center bg-no-repeat opacity-80 md:opacity-95"
          style={{ backgroundImage: `url('/api/hero-image')` }}
        />

        {/* Gradient Mask: Solid dark on left 50% to hide baked mockup text, smoothly fading to transparent on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#090a0e] via-[#090a0e] via-45% md:via-50% lg:via-[52%] to-transparent" />

        {/* Vertical fades for seamless navbar and section transitions */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/85 via-black/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl lg:max-w-3xl pt-6 sm:pt-10 md:pt-14">
          {/* Eyebrow Label */}
          

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.1rem] font-normal tracking-tight text-white leading-[1.08] mb-6">
            We make digital <br className="hidden sm:inline" />
            experiences{' '}
            <span className="relative inline-block text-white font-serif italic">
              matter.
              {/* Hand-Drawn Sketch Underline */}
              <svg
                viewBox="0 0 240 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute -bottom-2 sm:-bottom-3 left-0 w-full h-[12px] sm:h-[16px] pointer-events-none overflow-visible text-white"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                {/* Primary expressive hand-drawn stroke */}
                <path
                  d="M4 13C48 4.5 138 3.2 236 10.5C172 15 90 16.5 14 18.5"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-95"
                />
                {/* Secondary gentle sketch pass for organic hand-drawn authenticity */}
                <path
                  d="M24 16C80 11.5 165 9.5 228 14"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  className="opacity-60"
                />
              </svg>
            </span>
          </h1>

          {/* Supporting Description */}
          <p className="text-base sm:text-lg text-neutral-300 font-light leading-relaxed max-w-xl mb-10">
            We partner with ambitious businesses to design and build websites, software, and digital products that move ideas forward.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onStartProject}
              className="inline-flex items-center justify-center px-6 py-3.5 bg-white text-black font-semibold text-xs sm:text-sm tracking-wide rounded-md hover:bg-neutral-200 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-white/10 group"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            <button
              type="button"
              onClick={onExploreServices}
              className="inline-flex items-center justify-center px-6 py-3.5 bg-black/40 text-white font-medium text-xs sm:text-sm tracking-wide border border-neutral-700/90 rounded-md hover:bg-neutral-900 hover:border-neutral-500 transition-all duration-200 cursor-pointer backdrop-blur-sm"
            >
              <span>Explore Our Work</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

interface HeroProps {
  onStartProject?: () => void;
  onExploreServices: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartProject, onExploreServices }) => {
  return (
    <section
      id="home"
      className="relative min-h-[100dvh] sm:min-h-screen flex items-center pt-28 pb-16 sm:pt-36 sm:pb-24 md:pt-44 md:pb-28 overflow-hidden bg-[#090a0e] text-white border-b border-neutral-900"
    >
      {/* Background Cinematic Desk Scene (SAVEN laptop, desk lamp, books, cascading plant) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none bg-[#090a0e]">
        {/* Next.js optimized high-fidelity responsive hero background */}
        <div className="relative w-full h-full">
          <Image
            src="/hero-bg-4k.png"
            alt="SAVEN Creative Workspace"
            fill
            priority
            quality={95}
            sizes="100vw"
            className="object-cover object-[75%_center] md:object-right opacity-85 md:opacity-95 transition-opacity duration-700"
          />
        </div>

        {/* Mobile Scrim: Top-to-bottom dark gradient ensuring text is 100% legible while the warm desk scene shines through below */}
        <div className="absolute inset-0 md:hidden bg-gradient-to-b from-[#090a0e]/95 via-[#090a0e]/75 to-[#090a0e]/40 pointer-events-none" />

        {/* Desktop Scrim: Left-to-right fade so typography sits on pure dark studio backing and seamlessly blends into the desk scene */}
        <div
          className="hidden md:block absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, #090a0e 0%, #090a0e 38%, rgba(9, 10, 14, 0.88) 48%, rgba(9, 10, 14, 0.45) 58%, transparent 72%)',
          }}
        />

        {/* Seamless edge fades for top navbar and bottom section transitions */}
        <div className="absolute inset-x-0 top-0 h-24 sm:h-32 bg-gradient-to-b from-[#090a0e] via-[#090a0e]/60 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-24 sm:h-32 bg-gradient-to-t from-[#090a0e] via-[#090a0e]/80 to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl lg:max-w-3xl pt-2 sm:pt-6 md:pt-10">
          {/* Eyebrow Label */}
         

          {/* Main Headline */}
          <h1 className="text-[2.2rem] xs:text-4xl sm:text-6xl md:text-7xl lg:text-[5.1rem] font-normal tracking-tight text-white leading-[1.12] sm:leading-[1.08] mb-5 sm:mb-6">
            We make digital <br className="hidden sm:inline" />
            experiences{' '}
            <span className="relative inline-block text-white font-serif italic">
              matter.
              {/* Hand-Drawn Sketch Underline */}
              <svg
                viewBox="0 0 240 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute -bottom-1.5 sm:-bottom-3 left-0 w-full h-[10px] sm:h-[16px] pointer-events-none overflow-visible text-white"
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
          <p className="text-sm sm:text-base md:text-lg text-neutral-300 font-light leading-relaxed max-w-xl mb-7 sm:mb-10">
            Your next big idea starts here. We help businesses build, modernize and scale through strategic design, custom software and intelligent digital solutions.
          </p>

          {/* Action Buttons: Stacked on mobile for easy thumb tapping, inline on tablet & desktop */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto max-w-xs sm:max-w-none">
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

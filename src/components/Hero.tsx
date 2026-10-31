'use client';

import React from 'react';
import { siteConfig } from '@/data/siteConfig';
import LightRays from './LightRays';
import { TextMorph } from '@/components/ui/text-morph';
import { ArrowDown } from 'lucide-react';

interface HeroProps {
  onStartProject?: () => void;
  onExploreServices: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreServices }) => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center pt-28 pb-20 overflow-hidden bg-black text-white border-b border-neutral-900"
    >
      {/* Volumetric Light Rays (React Bits) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
          raysSpeed={1}
          lightSpread={0.5}
          rayLength={3}
          glow={0.6}
          haze={0.25}
          followMouse
          mouseInfluence={0.1}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-white max-w-5xl mx-auto leading-[1.08] mb-6">
          Your Ambition, <br className="hidden sm:inline" />
          <span className="font-semibold text-white underline decoration-neutral-600 decoration-1 underline-offset-8 inline-block">
            <TextMorph />
          </span>
        </h1>

        {/* Supporting Description */}
        <p className="text-base sm:text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed mb-10">
          {siteConfig.heroDescription}
        </p>

        {/* Simple & Clean Explore Services CTA Button */}
        <div>
          <button
            type="button"
            onClick={onExploreServices}
            className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-black font-mono text-xs uppercase tracking-[0.18em] font-medium border border-white hover:bg-black hover:text-white transition-all duration-300 cursor-pointer group shadow-2xl"
          >
            <span>Explore Our Services</span>
            <ArrowDown className="w-3.5 h-3.5 ml-2.5 transition-transform duration-300 group-hover:translate-y-1" />
          </button>
        </div>
      </div>
    </section>
  );
};

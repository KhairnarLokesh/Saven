'use client';

import React, { useRef, useEffect } from 'react';
import { siteConfig } from '@/data/siteConfig';
import LightRays from './LightRays';
import FlyingButton, { FlyingButtonHandle } from './FlyingButton';
import { TextMorph } from '@/components/ui/text-morph';

interface HeroProps {
  onStartProject?: () => void;
  onExploreServices: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreServices }) => {
  const isLaunchingRef = useRef(false);
  const flyingButtonRef = useRef<FlyingButtonHandle>(null);

  const handleExploreServices = () => {
    if (isLaunchingRef.current) return;
    isLaunchingRef.current = true;

    // Rocket ascends directly upwards with increasing speed, taking ~1.8s for proper display
    setTimeout(() => {
      onExploreServices();
    }, 1800);
  };

  // When user scrolls back to the very top (Hero section), cleanly re-dock the rocket
  useEffect(() => {
    let resetTimer: NodeJS.Timeout | null = null;
    const handleScroll = () => {
      if (window.scrollY < 40 && isLaunchingRef.current) {
        if (!resetTimer) {
          resetTimer = setTimeout(() => {
            if (window.scrollY < 60 && flyingButtonRef.current) {
              flyingButtonRef.current.reset();
              isLaunchingRef.current = false;
            }
            resetTimer = null;
          }, 1500);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, []);

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
        {/* Supporting Label / Badge */}
        <div className="inline-flex items-center px-3 py-1.5 mb-6 border border-neutral-800 bg-neutral-950/80 rounded-full text-xs font-mono tracking-widest text-neutral-300 uppercase shadow-inner">
          <span>{siteConfig.badge}</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-white max-w-5xl mx-auto leading-[1.08] mb-6">
          Your Ambition, <br className="hidden sm:inline" />
          <span className="font-semibold text-white underline decoration-neutral-600 decoration-1 underline-offset-8 inline-block">
            <TextMorph />
          </span>
        </h1>

        {/* Supporting Description */}
        <p className="text-base sm:text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed mb-2">
          {siteConfig.heroDescription}
        </p>

        {/* Interactive Rocket Flying Button (React Bits) */}
        <div className="relative w-full max-w-xl h-[340px] -mt-24 sm:-mt-28 mx-auto flex items-center justify-center">
          <FlyingButton
            ref={flyingButtonRef}
            theme="dark"
            size="medium"
            altitude={1100}
            jets={2}
            thrusters
            trigger="click"
            carryCursor={false}
            noDescend
            smoke={1.8}
            turbulence={1.3}
            wobble={0.5}
            thrustColor="#8ec5ff"
            smokeColor="#eef1f6"
            buttonColor="#0e0e12"
            textColor="#ffffff"
            radius={6}
            onClick={handleExploreServices}
          >
            <span className="tracking-[0.14em]">Explore Our Services</span>
          </FlyingButton>
        </div>
      </div>
    </section>
  );
};

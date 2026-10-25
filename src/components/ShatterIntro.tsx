'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ShatterType, ShatterTypeHandle } from './ShatterType';

interface ShatterIntroProps {
  onComplete: () => void;
  /** Auto-transition time before shattering. Default: 2200ms (1s SAVEN only + 1.2s STUDIOS & sparkle) */
  autoExitDelay?: number;
}

type IntroStage = 'name-only' | 'studios-sparkle' | 'shatter';

export const ShatterIntro: React.FC<ShatterIntroProps> = ({
  onComplete,
  autoExitDelay = 2200,
}) => {
  const [stage, setStage] = useState<IntroStage>('name-only');
  const [isExiting, setIsExiting] = useState(false);
  const shatterRef = useRef<ShatterTypeHandle>(null);
  const hasTriggeredExitRef = useRef(false);

  useEffect(() => {
    // Lock body scroll while intro is visible
    document.body.style.overflow = 'hidden';

    // Phase 1: Keep intro name ONLY ('SAVEN') for exactly 1 second (1000ms)
    const studiosTimer = setTimeout(() => {
      if (!hasTriggeredExitRef.current) {
        setStage('studios-sparkle');
      }
    }, 1000);

    // Phase 2: After the sparkle display (~2200ms total), trigger full 3D shatter explosion
    const exitTimer = setTimeout(() => {
      triggerExit();
    }, autoExitDelay);

    return () => {
      clearTimeout(studiosTimer);
      clearTimeout(exitTimer);
      document.body.style.overflow = '';
    };
  }, [autoExitDelay]);

  const triggerExit = () => {
    if (hasTriggeredExitRef.current) return;
    hasTriggeredExitRef.current = true;

    setStage('shatter');

    // Trigger full 3D glass shatter explosion
    shatterRef.current?.shatterAll();

    // Fade out overlay as shards scatter away
    setTimeout(() => {
      setIsExiting(true);
    }, 700);

    // Call onComplete after transition finishes
    setTimeout(() => {
      document.body.style.overflow = '';
      onComplete();
    }, 1300);
  };

  const handleContainerClick = () => {
    // Click anywhere on screen to trigger shatter immediately
    triggerExit();
  };

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black select-none transition-all duration-700 ease-out cursor-pointer ${
        isExiting
          ? 'opacity-0 scale-105 pointer-events-none'
          : 'opacity-100 scale-100 pointer-events-auto'
      }`}
      onClick={handleContainerClick}
      aria-label="SAVEN STUDIOS Entrance"
    >
      <style jsx>{`
        @keyframes sparkleSpin {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
          }
          20% {
            transform: scale(1.35) rotate(45deg);
            opacity: 1;
            filter: drop-shadow(0 0 16px rgba(255, 255, 255, 1))
              drop-shadow(0 0 28px rgba(142, 197, 255, 0.95));
          }
          45% {
            transform: scale(0.95) rotate(90deg);
            opacity: 0.95;
          }
          70% {
            transform: scale(1.2) rotate(135deg);
            opacity: 1;
          }
          100% {
            transform: scale(1.0) rotate(180deg);
            opacity: 0.9;
          }
        }

        @keyframes shimmerSweep {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        @keyframes sparklePop {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
          }
          40% {
            transform: scale(1.35) rotate(90deg);
            opacity: 1;
            filter: drop-shadow(0 0 8px rgba(255, 255, 255, 1));
          }
          85% {
            transform: scale(0.8) rotate(150deg);
            opacity: 0.8;
          }
          100% {
            transform: scale(0) rotate(180deg);
            opacity: 0;
          }
        }

        .animate-sparkle-spin {
          animation: sparkleSpin 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-shimmer-sweep {
          animation: shimmerSweep 1.1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.1s forwards;
        }

        .animate-sparkle-pop-1 {
          animation: sparklePop 1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s infinite;
        }

        .animate-sparkle-pop-2 {
          animation: sparklePop 1.1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.45s infinite;
        }

        .animate-sparkle-pop-3 {
          animation: sparklePop 1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.7s infinite;
        }
      `}</style>

      {/* Background ambient radial glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[450px] bg-gradient-to-b from-blue-900/15 via-purple-900/10 to-transparent blur-[140px] rounded-full" />
      </div>

      {/* Main Display Stage */}
      <div className="relative z-10 w-full max-w-7xl h-[65vh] sm:h-[75vh] flex items-center justify-center">
        {/* Layer 1: Three.js 3D Shatter Type (WebGL canvas) - ready for instant 3D shatter explosion */}
        <div
          className={`absolute inset-0 w-full h-full transition-opacity duration-200 ${
            stage === 'shatter' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <ShatterType
            ref={shatterRef}
            imageSrc="/saven-logo-transparent.png"
            subText="STUDIOS"
            text="SAVEN STUDIOS"
            fontFamily="'Space Grotesk', var(--font-space-grotesk), sans-serif"
            fontWeight={900}
            letterSpacing={0.03}
            colors={['#FFFFFF', '#E4E4E7']}
            accentColor="#8EC5FF"
            shardSize={0.065}
            irregularity={0.45}
            crack={0}
            crackRadius={0}
            heal={0.9}
            shatter={true}
            shatterRadius={0.7}
            force={1.4}
            spin={1.5}
            depth={1.6}
            glint={1.4}
            intro="none"
            autoplay={false}
            interactive={false}
            className="w-full h-full min-h-0"
          />
        </div>

        {/* Layer 2: Pristine Crisp SVG/Image & Sparkle Display (Active before shatter) */}
        <div
          className={`relative z-20 flex flex-col items-center justify-center transition-opacity duration-150 ${
            stage === 'shatter' ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          {/* Logo Container */}
          <div className="relative inline-block">
            {/* Exact Brand Wordmark: SAVEN with dots Ś À V̇ Ė Ṅ */}
            <Image
              src="/saven-logo-transparent.png"
              alt="SAVEN"
              width={760}
              height={126}
              priority
              className="w-[310px] sm:w-[480px] md:w-[640px] lg:w-[760px] h-auto object-contain select-none transition-transform duration-700 ease-out"
            />

            {/* Sparkle Glint Flare on the letter 'N' and its dot */}
            {stage === 'studios-sparkle' && (
              <div
                className="absolute pointer-events-none z-30"
                style={{
                  top: '12%',
                  right: '6.8%',
                  transform: 'translate(50%, -50%)',
                }}
              >
                {/* Radiant Ambient Bloom */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-blue-400/25 blur-xl animate-pulse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/40 blur-md" />

                {/* Primary 4-point Diamond Star Flare */}
                <div className="relative flex items-center justify-center animate-sparkle-spin">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-14 h-14 sm:w-20 sm:h-20 text-white drop-shadow-[0_0_14px_rgba(255,255,255,1)] drop-shadow-[0_0_28px_rgba(142,197,255,0.95)]"
                    fill="currentColor"
                  >
                    <path d="M50 0 C50 34 34 50 0 50 C34 50 50 66 50 100 C50 66 66 50 100 50 C66 50 50 34 50 0 Z" />
                  </svg>

                  {/* Secondary 45° Diagonal Ray Flare */}
                  <svg
                    viewBox="0 0 100 100"
                    className="absolute w-9 h-9 sm:w-12 sm:h-12 text-blue-200 rotate-45 opacity-90"
                    fill="currentColor"
                  >
                    <path d="M50 8 C50 36 36 50 8 50 C36 50 50 64 50 92 C50 64 64 50 92 50 C64 50 50 36 50 8 Z" />
                  </svg>

                  {/* Super-bright pinpoint center */}
                  <div className="absolute w-2 h-2 rounded-full bg-white shadow-[0_0_12px_#ffffff]" />
                </div>

                {/* Orbiting Stardust Sparkles */}
                <span className="absolute -top-3.5 -right-3 text-cyan-200 text-sm animate-ping opacity-80">
                  ✦
                </span>
                <span className="absolute -bottom-3 -left-3 text-white text-xs animate-pulse opacity-90">
                  ✧
                </span>
              </div>
            )}
          </div>

          {/* STUDIOS Subtitle with Sparkle Shimmer Sweep */}
          <div
            className={`relative flex items-center justify-center transition-all duration-700 ease-out mt-4 sm:mt-6 md:mt-7 ${
              stage === 'studios-sparkle'
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-2'
            }`}
          >
            <div className="relative inline-block overflow-hidden px-8 py-2">
              {/* Crisp STUDIOS Typography */}
              <span
                className="block font-light text-white tracking-[0.45em] sm:tracking-[0.55em] text-xs sm:text-base md:text-lg uppercase select-none relative z-10"
                style={{
                  fontFamily: "'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif",
                }}
              >
                STUDIOS
              </span>

              {/* Shimmer sweep beam gliding left-to-right across STUDIOS */}
              {stage === 'studios-sparkle' && (
                <div
                  className="absolute inset-0 pointer-events-none z-20 animate-shimmer-sweep"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 20%, rgba(255,255,255,0.95) 50%, rgba(142,197,255,0.9) 65%, transparent 100%)',
                    mixBlendMode: 'screen',
                  }}
                />
              )}

              {/* Sparkling Micro-Stars on STUDIOS letters */}
              {stage === 'studios-sparkle' && (
                <>
                  {/* Glint on 'S' */}
                  <span className="absolute top-1 left-9 text-xs text-blue-200 animate-sparkle-pop-1 pointer-events-none">
                    ✦
                  </span>
                  {/* Glint on 'D' */}
                  <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-xs text-white animate-sparkle-pop-2 pointer-events-none">
                    ✧
                  </span>
                  {/* Glint on final 'S' (aligned right under the N) */}
                  <span className="absolute top-1 right-9 text-xs text-cyan-200 animate-sparkle-pop-3 pointer-events-none">
                    ✦
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShatterIntro;

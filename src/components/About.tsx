'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { exactFounders, type ExactCapsuleFounder } from '@/data/about';

/* ─────────────────────────────────────────────────────────────────────────────
  Card geometry constants
───────────────────────────────────────────────────────────────────────────── */
const W = 270;   // card width in px
const H = 500;   // card height in px
const R = W / 2; // capsule radius = 135 px

/* Exact capsule perimeter: 2 semicircles + 2 straight segments
   P = 2 * (π * R) + 2 * (H - 2 * R) = π * W + 2 * (H - W) ≈ 1308.23 px */
const P = Math.PI * W + 2 * (H - W);

/* Luminous ring segment length: 18% of perimeter (~235 px) */
const SEG_LEN = Math.round(P * 0.18);
const DASH_ARRAY = `${SEG_LEN} ${Math.round(P - SEG_LEN)}`;

/* SVG capsule path starting at top apex (R, 0) and tracing clockwise */
const SVG_PATH = `M ${R} 0 A ${R} ${R} 0 0 1 ${W} ${R} L ${W} ${H - R} A ${R} ${R} 0 0 1 0 ${H - R} L 0 ${R} A ${R} ${R} 0 0 1 ${R} 0 Z`;

/**
 * Calculates the exact distance along the capsule perimeter corresponding
 * to any pointer position (px, py) within the card bounds.
 */
function getPerimeterDistance(px: number, py: number): number {
  const cy1 = R;                 // 135 (top semicircle center)
  const cy2 = H - R;             // 365 (bottom semicircle center)
  const arcQuarter = (Math.PI / 2) * R; // ~212.06 px
  const straightLen = H - 2 * R; // 230 px

  if (py < cy1) {
    // Top semicircle
    const dx = px - R;
    const dy = py - cy1;
    const theta = Math.atan2(dy, dx); // [-π, 0]
    if (theta >= -Math.PI / 2) {
      return (theta + Math.PI / 2) * R;
    } else {
      return P - Math.abs(theta + Math.PI / 2) * R;
    }
  } else if (py > cy2) {
    // Bottom semicircle
    const dx = px - R;
    const dy = py - cy2;
    const theta = Math.atan2(dy, dx); // [0, π]
    return arcQuarter + straightLen + theta * R;
  } else {
    // Middle straight sections
    if (px >= R) {
      // Right side
      return arcQuarter + (py - cy1);
    } else {
      // Left side
      return arcQuarter + straightLen + Math.PI * R + (cy2 - py);
    }
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
  FounderCard — isolated hover tracking with cursor-directed perimeter ring
───────────────────────────────────────────────────────────────────────────── */
interface FounderCardProps {
  founder: ExactCapsuleFounder;
  reducedMotion: boolean;
}

const FounderCard: React.FC<FounderCardProps> = ({ founder, reducedMotion }) => {
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const ringPathRef = useRef<SVGPathElement>(null);
  const glowPathRef = useRef<SVGPathElement>(null);

  const rafRef = useRef<number>(0);
  const isHoveredRef = useRef<boolean>(false);
  const currentDistRef = useRef<number>(0);
  const targetDistRef = useRef<number>(0);

  const [isHovered, setIsHovered] = useState(false);

  // Animation loop: smoothly interpolates current segment position toward target
  const startAnimationLoop = useCallback(() => {
    if (reducedMotion) return;

    const step = () => {
      if (!isHoveredRef.current) return;

      const target = targetDistRef.current;
      let current = currentDistRef.current;

      // Shortest path around the circular perimeter P
      let diff = (target - current) % P;
      if (diff > P / 2) diff -= P;
      if (diff < -P / 2) diff += P;

      // Smooth interpolation without jitter (lerp factor 0.12)
      current += diff * 0.12;
      current = (current + P) % P;
      currentDistRef.current = current;

      // Center the segment on current perimeter distance
      const offset = SEG_LEN / 2 - current;

      if (ringPathRef.current) {
        ringPathRef.current.style.strokeDashoffset = `${offset}px`;
      }
      if (glowPathRef.current) {
        glowPathRef.current.style.strokeDashoffset = `${offset}px`;
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
  }, [reducedMotion]);

  const handlePointerEnter = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardContainerRef.current) return;
    const rect = cardContainerRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * W;
    const ny = ((e.clientY - rect.top) / rect.height) * H;
    const initialDist = getPerimeterDistance(nx, ny);

    targetDistRef.current = initialDist;
    currentDistRef.current = initialDist;

    const offset = SEG_LEN / 2 - initialDist;
    if (ringPathRef.current) ringPathRef.current.style.strokeDashoffset = `${offset}px`;
    if (glowPathRef.current) glowPathRef.current.style.strokeDashoffset = `${offset}px`;

    isHoveredRef.current = true;
    setIsHovered(true);

    cancelAnimationFrame(rafRef.current);
    startAnimationLoop();
  }, [startAnimationLoop]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardContainerRef.current || !isHoveredRef.current) return;
    const rect = cardContainerRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * W;
    const ny = ((e.clientY - rect.top) / rect.height) * H;
    targetDistRef.current = getPerimeterDistance(nx, ny);
  }, []);

  const handlePointerLeave = useCallback(() => {
    isHoveredRef.current = false;
    setIsHovered(false);
    cancelAnimationFrame(rafRef.current);
  }, []);

  const handleFocus = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleBlur = useCallback(() => {
    isHoveredRef.current = false;
    setIsHovered(false);
    cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div
      className={`relative flex-shrink-0 ${founder.offsetClass}`}
      style={{ width: W, height: H }}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {/* ── Scaled & translated hover container (300ms ease) ── */}
      <div
        ref={cardContainerRef}
        className="relative w-full h-full"
        style={{
          transform: isHovered ? 'translateY(-5px) scale(1.01)' : 'translateY(0) scale(1)',
          transition: 'transform 300ms ease',
          willChange: 'transform',
        }}
      >
        {/* ── Animated SVG perimeter ring (mouse-tracked glowing segment) ── */}
        <svg
          aria-hidden="true"
          className="absolute pointer-events-none transition-opacity duration-300 ease-out"
          style={{
            top: -4,
            left: -4,
            width: W + 8,
            height: H + 8,
            opacity: isHovered ? 1 : 0,
            zIndex: 35,
            overflow: 'visible',
          }}
          viewBox="-4 -4 278 508"
        >
          <defs>
            <linearGradient id={`ringGrad-${founder.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D9B8FF" />
              <stop offset="50%" stopColor="#A970FF" />
              <stop offset="100%" stopColor="#D9B8FF" />
            </linearGradient>
          </defs>

          {/* Faint static guide track along capsule perimeter */}
          <path
            d={SVG_PATH}
            fill="none"
            stroke="rgba(169, 112, 255, 0.16)"
            strokeWidth="1"
          />

          {/* Subtle purple outer glow behind the ring segment */}
          <path
            ref={glowPathRef}
            d={SVG_PATH}
            fill="none"
            stroke="#A970FF"
            strokeWidth="4"
            strokeOpacity="0.45"
            strokeLinecap="round"
            strokeDasharray={DASH_ARRAY}
            style={{
              strokeDashoffset: `${SEG_LEN / 2}px`,
              filter: 'blur(3px)',
              willChange: 'stroke-dashoffset',
            }}
          />

          {/* Sharp luminous 1.5px segment following the mouse */}
          <path
            ref={ringPathRef}
            d={SVG_PATH}
            fill="none"
            stroke={`url(#ringGrad-${founder.id})`}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray={DASH_ARRAY}
            style={{
              strokeDashoffset: `${SEG_LEN / 2}px`,
              filter: 'drop-shadow(0 0 3px rgba(169, 112, 255, 0.8))',
              willChange: 'stroke-dashoffset',
            }}
          />
        </svg>

        {/* ── Inner card: clipping container for portraits & text ── */}
        <div
          className={`absolute inset-0 overflow-hidden ${founder.capsuleBg} focus-visible:ring-2 focus-visible:ring-[#A970FF]/70 focus-visible:outline-none`}
          style={{
            borderRadius: R,
          }}
          tabIndex={0}
          role="article"
          aria-label={`${founder.name}, ${founder.role}`}
        >
          {/* 1. Name & designation — top pastel zone */}
          <div className="absolute top-0 left-0 right-0 z-20 pt-9 px-6 pointer-events-none">
            <h3
              className="text-[18px] font-semibold leading-[1.2] tracking-[-0.3px] text-[#101010]"
              style={{ marginBottom: 5 }}
            >
              {founder.name}
            </h3>
            <p className="text-[13px] font-normal leading-[1.45] text-[#252525]">
              {founder.role}
            </p>
          </div>

          {/* 2. Portrait zone — bottom 300 px, anchored */}
          <div className="absolute inset-x-0 bottom-0 z-10 overflow-hidden" style={{ height: 300 }}>
            <div className="relative w-full h-full">
              <Image
                src={founder.image}
                alt={founder.name}
                fill
                sizes={`${W}px`}
                priority
                className="object-cover select-none"
                style={{ objectPosition: founder.objectPosition }}
              />
            </div>

            {/* Bottom gradient fade */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 pointer-events-none z-10"
              style={{
                height: 170,
                background:
                  'linear-gradient(to top,' +
                    'rgba(0,0,0,0.97) 0%,' +
                    'rgba(0,0,0,0.80) 20%,' +
                    'rgba(0,0,0,0.48) 45%,' +
                    'rgba(0,0,0,0.15) 70%,' +
                    'transparent 100%)',
              }}
            />
          </div>

          {/* 3. Social links — above gradient */}
          <div className="absolute bottom-5 inset-x-0 flex justify-center gap-[10px] z-30">
            {founder.socials.github && (
              <a
                href={founder.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${founder.name} GitHub`}
                className="w-9 h-9 rounded-full bg-black/55 hover:bg-black/80 border border-white/10
                           flex items-center justify-center text-white/80 hover:text-white
                           transition-all duration-200 hover:scale-110 active:scale-95
                           hover:shadow-[0_0_10px_rgba(155,92,255,0.6)]"
              >
                <svg className="w-[17px] h-[17px] fill-current" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
              </a>
            )}
            {founder.socials.linkedin && (
              <a
                href={founder.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${founder.name} LinkedIn`}
                className="w-9 h-9 rounded-full bg-black/55 hover:bg-black/80 border border-white/10
                           flex items-center justify-center text-white/80 hover:text-white
                           transition-all duration-200 hover:scale-110 active:scale-95
                           hover:shadow-[0_0_10px_rgba(155,92,255,0.6)]"
              >
                <svg className="w-[17px] h-[17px] fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
  About section wrapper
───────────────────────────────────────────────────────────────────────────── */
export const About: React.FC = () => {
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <section
      id="about"
      className="relative py-24 bg-[#090A0C] text-white border-b border-neutral-900 overflow-hidden"
    >
      {/* Subtle charcoal grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right,rgba(255,255,255,0.03) 1px,transparent 1px),' +
            'linear-gradient(to bottom,rgba(255,255,255,0.03) 1px,transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage:
            'radial-gradient(ellipse 90% 70% at 50% 20%, #000 55%, transparent 100%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Heading ── */}
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
            The people behind SAVEN
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-[56px] font-light tracking-tight text-[#F0F0F0] leading-[1.1]">
            Meet the{' '}
            <span className="font-semibold text-[#A8CBB1] underline decoration-[#A8CBB1]/30 underline-offset-[10px]">
              Minds
            </span>{' '}
            Behind SAVEN.
          </h2>
          <p className="text-[15px] text-neutral-500 font-light">
            Three builders.&nbsp;&nbsp;One shared ambition.
          </p>
        </div>

        {/* ── Cards row ── */}
        <div
          className="
            flex flex-col items-center gap-10
            md:flex-row md:justify-center md:items-start md:gap-6
            md:pb-[65px]
            max-w-[920px] mx-auto mb-16
          "
        >
          {exactFounders.map((founder) => (
            <FounderCard
              key={founder.id}
              founder={founder}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

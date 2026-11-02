'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { exactFounders, type ExactCapsuleFounder } from '@/data/about';

/* ─────────────────────────────────────────────────────────────────────────────
  Crimson Rose Card Geometry Constants
───────────────────────────────────────────────────────────────────────────── */
const W = 245;   // card width in px
const H = 340;   // card height in px
const R = W / 2; // capsule radius = 122.5 px

/* Exact capsule perimeter: 2 semicircles + 2 straight segments
   P = π * W + 2 * (H - W) ≈ 959.69 px */
const P = Math.PI * W + 2 * (H - W);

/* Luminous ring segment length: ~18% of perimeter (~173 px) */
const SEG_LEN = Math.round(P * 0.18);
const DASH_ARRAY = `${SEG_LEN} ${Math.round(P - SEG_LEN)}`;

/* SVG capsule path starting at top apex (R, 0) and tracing clockwise */
const SVG_PATH = `M ${R} 0 A ${R} ${R} 0 0 1 ${W} ${R} L ${W} ${H - R} A ${R} ${R} 0 0 1 0 ${H - R} L 0 ${R} A ${R} ${R} 0 0 1 ${R} 0 Z`;

/**
 * Calculates the exact distance along the capsule perimeter corresponding
 * to any pointer coordinate (px, py) within the card bounds.
 */
function getPerimeterDistance(px: number, py: number): number {
  const cy1 = R;                        // 122.5 px (top semicircle center)
  const cy2 = H - R;                    // 217.5 px (bottom semicircle center)
  const arcQuarter = (Math.PI / 2) * R; // ~192.42 px
  const straightLen = H - 2 * R;        // 95 px

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
  FounderCard — Crimson Rose burgundy capsule with shoulder-to-shoulder portraits
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

  // Animation loop: smoothly tracks current segment toward mouse target
  const startAnimationLoop = useCallback(() => {
    if (reducedMotion) return;

    const step = () => {
      if (!isHoveredRef.current) return;

      const target = targetDistRef.current;
      let current = currentDistRef.current;

      // Shortest path around circular perimeter P
      let diff = (target - current) % P;
      if (diff > P / 2) diff -= P;
      if (diff < -P / 2) diff += P;

      // Smooth lerp (0.13 factor provides snappy and organic tracking)
      current += diff * 0.13;
      current = (current + P) % P;
      currentDistRef.current = current;

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
      {/* ── Hover-lift container with 350ms cubic-bezier ── */}
      <div
        ref={cardContainerRef}
        className="relative w-full h-full"
        style={{
          transform: isHovered ? 'translateY(-6px) scale(1.015)' : 'translateY(0) scale(1)',
          transition: 'transform 350ms cubic-bezier(0.22, 1, 0.36, 1)',
          willChange: 'transform',
        }}
      >
        {/* ── Layer 6: Animated SVG perimeter ring (mouse-tracked glowing magenta segment) ── */}
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
          viewBox="-4 -4 253 348"
        >
          <defs>
            <linearGradient id={`crimsonRingGrad-${founder.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFA6E0" />
              <stop offset="50%" stopColor="#E879C2" />
              <stop offset="100%" stopColor="#FFA6E0" />
            </linearGradient>
          </defs>

          {/* Faint static guide track along capsule perimeter */}
          <path
            d={SVG_PATH}
            fill="none"
            stroke="rgba(235, 105, 180, 0.22)"
            strokeWidth="1"
          />

          {/* Soft magenta outer glow behind moving segment */}
          <path
            ref={glowPathRef}
            d={SVG_PATH}
            fill="none"
            stroke="#E879C2"
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

          {/* Core sharp 1.5px luminous segment following pointer */}
          <path
            ref={ringPathRef}
            d={SVG_PATH}
            fill="none"
            stroke={`url(#crimsonRingGrad-${founder.id})`}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray={DASH_ARRAY}
            style={{
              strokeDashoffset: `${SEG_LEN / 2}px`,
              filter: 'drop-shadow(0 0 3px rgba(232, 121, 194, 0.85))',
              willChange: 'stroke-dashoffset',
            }}
          />
        </svg>

        {/* ── Layer 1: Inner card with dark burgundy & plum gradient capsule background ── */}
        <div
          className="absolute inset-0 overflow-hidden focus-visible:ring-2 focus-visible:ring-[#E879C2]/80 focus-visible:outline-none"
          style={{
            borderRadius: '999px',
            background: 'linear-gradient(160deg, #3B1B35 0%, #281329 55%, #160D19 100%)',
            border: isHovered
              ? '1px solid rgba(232, 121, 194, 0.75)'
              : '1px solid rgba(235, 105, 180, 0.35)',
            boxShadow: isHovered
              ? '0 0 16px 2px rgba(232, 121, 194, 0.38), 0 16px 36px -8px rgba(45, 12, 38, 0.75)'
              : '0 16px 36px -8px rgba(45, 12, 38, 0.65)',
            transition: 'border-color 350ms ease, box-shadow 350ms ease',
          }}
          tabIndex={0}
          role="article"
          aria-label={`${founder.name}, ${founder.role}`}
        >
          {/* ── Layer 4: Dedicated Text Container (Top of Capsule) ── */}
          <div
            className="absolute text-left pointer-events-none"
            style={{
              top: '58px',
              left: '22px',
              right: '18px',
              zIndex: 10,
              paddingLeft: '6px',
              paddingRight: '6px',
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                fontWeight: 700,
                fontSize: '15px',
                color: '#FFFFFF',
                lineHeight: 1.3,
                marginBottom: '6px',
                whiteSpace: 'normal',
                overflow: 'visible',
              }}
            >
              {founder.name}
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-inter), sans-serif',
                fontWeight: 400,
                fontSize: '11px',
                color: '#E0D2DF',
                lineHeight: 1.5,
                maxWidth: '100%',
              }}
            >
              {founder.role}
            </p>
          </div>

          {/* ── Layer 2: Portrait Zone (76% of card height, shoulder-to-shoulder) ── */}
          <div
            className="absolute inset-x-0 bottom-0 overflow-hidden flex items-end justify-center pointer-events-none"
            style={{ height: '76%', zIndex: 5 }}
          >
            <div className="relative w-full h-full flex items-end justify-center">
              <Image
                src={founder.image}
                alt={founder.name}
                fill
                sizes={`${W}px`}
                priority
                className="select-none pointer-events-none"
                style={{
                  objectFit: 'cover',
                  objectPosition: founder.objectPosition,
                }}
              />
            </div>

            {/* ── Layer 3: Smooth transparent-to-near-black gradient overlay (bottom 20%) ── */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 pointer-events-none"
              style={{
                height: '52px',
                zIndex: 6,
                background:
                  'linear-gradient(to top,' +
                    'rgba(22, 13, 25, 0.95) 0%,' +
                    'rgba(22, 13, 25, 0.55) 50%,' +
                    'transparent 100%)',
              }}
            />
          </div>

          {/* ── Layer 5: Social Icons (Bottom-Center, z-index 20) ── */}
          <div
            className="absolute bottom-[12px] inset-x-0 flex justify-center items-center gap-[10px]"
            style={{ zIndex: 20 }}
          >
            {founder.socials.github && (
              <a
                href={founder.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${founder.name} GitHub`}
                className="w-[25px] h-[25px] rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-115 active:scale-95 cursor-pointer hover:border-[#E879B0]/60 hover:shadow-[0_0_8px_rgba(232,121,176,0.5)]"
                style={{
                  background: 'rgba(8, 6, 12, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}
              >
                <svg className="w-[12px] h-[12px] fill-current" viewBox="0 0 24 24">
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
                className="w-[25px] h-[25px] rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-115 active:scale-95 cursor-pointer hover:border-[#E879B0]/60 hover:shadow-[0_0_8px_rgba(232,121,176,0.5)]"
                style={{
                  background: 'rgba(8, 6, 12, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}
              >
                <svg className="w-[12px] h-[12px] fill-current" viewBox="0 0 24 24">
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
  About Section — Crimson Rose Editorial Showcase
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
    <>
      <style>{`
        @keyframes purpleOrb1 {
          0%   { transform: translate(0px, 0px) scale(1); opacity: 0.22; }
          33%  { transform: translate(40px, -30px) scale(1.12); opacity: 0.32; }
          66%  { transform: translate(-25px, 20px) scale(0.92); opacity: 0.18; }
          100% { transform: translate(0px, 0px) scale(1); opacity: 0.22; }
        }
        @keyframes purpleOrb2 {
          0%   { transform: translate(0px, 0px) scale(1); opacity: 0.20; }
          40%  { transform: translate(-50px, 30px) scale(1.08); opacity: 0.30; }
          75%  { transform: translate(30px, -20px) scale(0.95); opacity: 0.16; }
          100% { transform: translate(0px, 0px) scale(1); opacity: 0.20; }
        }
        @keyframes purpleOrb3 {
          0%   { transform: translate(0px, 0px) scale(1); }
          50%  { transform: translate(20px, 15px) scale(1.05); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
      `}</style>
      <section
        id="about"
        className="relative py-24 bg-[#080609] text-white border-b border-neutral-900/80 overflow-hidden"
      >
        {/* ── Subtle dark grid texture ── */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(235, 105, 180, 0.035) 1px, transparent 1px),' +
              'linear-gradient(to bottom, rgba(235, 105, 180, 0.035) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
            maskImage:
              'radial-gradient(ellipse 85% 75% at 50% 35%, #000 50%, transparent 100%)',
          }}
        />

        {/* ── Animated dark burgundy ambient glow behind cards ── */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 720px 360px at 50% 50%, rgba(95, 23, 72, 0.30) 0%, transparent 70%)',
            animation: 'purpleOrb1 9s ease-in-out infinite',
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 480px 240px at 45% 55%, rgba(140, 30, 100, 0.22) 0%, transparent 65%)',
            animation: 'purpleOrb2 13s ease-in-out infinite',
          }}
        />

        {/* ── Bottom-left soft glowing magenta ambient wave decoration ── */}
        <div
          aria-hidden="true"
          className="absolute -bottom-12 -left-12 w-[380px] h-[220px] pointer-events-none"
          style={{
            opacity: 0.3,
            filter: 'blur(45px)',
            background:
              'radial-gradient(ellipse at 30% 70%, #D63D9B 0%, #A81769 45%, #6D174D 70%, transparent 100%)',
            animation: 'purpleOrb3 11s ease-in-out infinite',
          }}
        />

        {/* ── Bottom-right soft glowing magenta ambient wave decoration ── */}
        <div
          aria-hidden="true"
          className="absolute -bottom-12 -right-12 w-[380px] h-[220px] pointer-events-none"
          style={{
            opacity: 0.3,
            filter: 'blur(45px)',
            background:
              'radial-gradient(ellipse at 70% 70%, #A81769 0%, #D63D9B 45%, #6D174D 70%, transparent 100%)',
            animation: 'purpleOrb3 14s ease-in-out infinite reverse',
          }}
        />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Section Heading: Compact Crimson Rose Typography ── */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2.5">
          <div>
            <span
              className="inline-block uppercase font-semibold text-[#E07DB7]"
              style={{
                background: '#17101B',
                border: '1px solid rgba(224, 125, 183, 0.25)',
                borderRadius: '999px',
                letterSpacing: '1.2px',
                fontSize: '10px',
                padding: '7px 15px',
              }}
            >
              THE PEOPLE BEHIND SAVEN
            </span>
          </div>

          <h2
            className="tracking-tight text-[#F5F2F7] leading-[1.15]"
            style={{
              fontFamily: 'var(--font-space-grotesk), sans-serif',
              fontSize: '38px',
              fontWeight: 600,
            }}
          >
            Meet the{' '}
            <span style={{ color: '#E879B0' }}>
              Minds
            </span>{' '}
            Behind SAVEN.
          </h2>

          <p
            className="font-light"
            style={{
              fontSize: '13px',
              color: '#B8AEBB',
            }}
          >
            Three builders.&nbsp;&nbsp;One shared ambition.
          </p>
        </div>

        {/* ── Three Founder Profile Capsules ── */}
        <div
          className="
            flex flex-col items-center gap-7
            md:flex-row md:justify-center md:items-start md:gap-[12px]
            md:pb-[30px]
            max-w-[800px] mx-auto mb-12
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
    </>
  );
};

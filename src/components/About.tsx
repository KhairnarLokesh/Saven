'use client';

import React from 'react';
import Image from 'next/image';
import { exactFounders } from '@/data/about';

/* ─────────────────────────────────────────────────────────────────────────────
   SAVEN About — Founders Section
   Reference: AI Recruitment Heads editorial capsule layout.

   Card anatomy (470 px tall):
     0 – 130 px  → pastel header zone  (name + designation)
     130 – 470 px → portrait zone (340 px tall) with bottom black fade
     Bottom 60 px → social icons overlay (z-30)

   Portrait strategy:
     - Each image is cropped (head + shoulders) at the image-file level.
     - Inside the card we use a 340 px portrait container anchored to the bottom.
     - object-cover + per-founder objectPosition keeps faces prominent.
     - A multi-stop radial-like gradient masks the portrait bottom into black.
───────────────────────────────────────────────────────────────────────────── */

export const About: React.FC = () => {
  return (
    <section
      id="about"
      className="relative py-24 bg-[#0B0B0D] text-white border-b border-neutral-900 overflow-hidden"
    >
      {/* ── Very subtle dark charcoal grid ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right,rgba(255,255,255,0.035) 1px,transparent 1px),' +
            'linear-gradient(to bottom,rgba(255,255,255,0.035) 1px,transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage:
            'radial-gradient(ellipse 80% 70% at 50% 30%, #000 60%, transparent 100%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section heading ── */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
            The people behind the work
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#F5F5F5] leading-[1.1]">
            Meet the{' '}
            <span className="font-semibold text-[#A8CBB3] underline decoration-[#A8CBB3]/35 underline-offset-8">
              Founders
            </span>{' '}
            Behind SAVEN Studios.
          </h2>
          <p className="text-base text-neutral-400 font-light mt-2">
            Three minds.&nbsp; One shared ambition.
          </p>
        </div>

        {/* ── Cards row ──
            Container is tall enough to absorb the 75 px downward shift of the
            center card without clipping anything.                              */}
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-center md:items-start md:gap-5 max-w-[860px] mx-auto md:pt-0 md:pb-[75px] mb-20">
          {exactFounders.map((founder) => (
            <div
              key={founder.id}
              className={`
                relative flex-shrink-0 w-[250px] h-[470px]
                rounded-[125px] overflow-hidden
                ${founder.capsuleBg}
                ${founder.offsetClass}
              `}
            >
              {/* ── 1. Name & designation — top pastel zone, z above portrait ── */}
              <div className="absolute top-0 left-0 right-0 z-20 pt-[36px] px-[24px] pointer-events-none">
                <h3
                  className="text-[15px] font-bold leading-[1.2] tracking-[-0.2px] text-[#101010]"
                  style={{ marginBottom: '5px' }}
                >
                  {founder.name}
                </h3>
                <p className="text-[12px] font-normal leading-[1.45] text-[#202020]">
                  {founder.role}
                </p>
              </div>

              {/* ── 2. Portrait zone — bottom 340 px of capsule ── */}
              <div className="absolute inset-x-0 bottom-0 h-[340px] overflow-hidden z-10">

                {/* Portrait image fills the container via cover */}
                <div className="relative w-full h-full">
                  <Image
                    src={founder.image}
                    alt={founder.name}
                    fill
                    sizes="250px"
                    priority
                    className="object-cover select-none"
                    style={{ objectPosition: founder.objectPosition }}
                  />
                </div>

                {/* Multi-stop bottom fade: transparent → black over bottom ~45% */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
                  style={{
                    height: '160px',
                    background:
                      'linear-gradient(' +
                        'to top,' +
                        'rgba(0,0,0,0.97) 0%,' +
                        'rgba(0,0,0,0.80) 22%,' +
                        'rgba(0,0,0,0.50) 45%,' +
                        'rgba(0,0,0,0.18) 68%,' +
                        'transparent 100%' +
                      ')',
                  }}
                />
              </div>

              {/* ── 3. Social links — over the black gradient, bottom of capsule ── */}
              <div className="absolute bottom-[22px] inset-x-0 flex items-center justify-center gap-[10px] z-30">
                {founder.socials.github && (
                  <a
                    href={founder.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${founder.name} GitHub`}
                    className="
                      w-[36px] h-[36px] rounded-full
                      bg-black/55 hover:bg-black/80
                      border border-white/12
                      flex items-center justify-center
                      text-white/80 hover:text-white
                      transition-all duration-200 hover:scale-110 active:scale-95
                    "
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
                    className="
                      w-[36px] h-[36px] rounded-full
                      bg-black/55 hover:bg-black/80
                      border border-white/12
                      flex items-center justify-center
                      text-white/80 hover:text-white
                      transition-all duration-200 hover:scale-110 active:scale-95
                    "
                  >
                    <svg className="w-[17px] h-[17px] fill-current" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

'use client';

import React from 'react';
import Image from 'next/image';
import { principles, exactFounders } from '@/data/about';

export const About: React.FC = () => {
  return (
    <section id="about" className="relative py-28 bg-[#0B0B0D] text-white border-b border-neutral-900 overflow-hidden">
      {/* Subtle dark grid texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_20%,#000_80%,transparent_100%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-light tracking-tight text-[#F5F5F5]">
            <span className="font-normal text-[#A5CBB1] underline decoration-[#A5CBB1]/40 underline-offset-8">
              Founders
            </span>{' '}
            of SAVEN.
          </h2>
        </div>

        {/* ── Arch-shaped founder cards ── */}
        <div className="mb-24">
          {/* Desktop: three cards side by side with stagger. Mobile: vertical stack. */}
          <div
            className="
              flex flex-col items-center gap-8
              md:flex-row md:items-center md:justify-center md:gap-7
              max-w-[1000px] mx-auto
              md:h-[520px]
            "
          >
            {exactFounders.map((founder) => (
              <div
                key={founder.id}
                className={`
                  relative flex-shrink-0
                  w-[250px] h-[470px]
                  rounded-[125px_125px_125px_125px]
                  overflow-hidden
                  ${founder.capsuleBg}
                  ${founder.offsetClass}
                  transition-transform duration-500
                `}
              >
                {/* ── Name & designation – top-left ── */}
                <div className="absolute top-7 left-5 right-5 z-20 pointer-events-none">
                  <p className="text-[15px] font-bold text-[#111111] leading-tight">
                    {founder.name}
                  </p>
                  <p className="text-[12px] text-[#222222] leading-tight mt-[2px]">
                    {founder.role}
                  </p>
                </div>

                {/* ── Portrait image ── */}
                <div className="absolute inset-x-0 bottom-[60px] top-[60px] z-10">
                  <Image
                    src={founder.image}
                    alt={founder.name}
                    fill
                    sizes="250px"
                    priority
                    className="object-contain object-center select-none"
                  />
                  {/* Bottom gradient fade over portrait */}
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                </div>

                {/* ── Social links – bottom-center ── */}
                <div className="absolute bottom-5 inset-x-0 flex items-center justify-center gap-2.5 z-20">
                  {founder.socials.github && (
                    <a
                      href={founder.socials.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${founder.name} GitHub`}
                      className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/65 border border-black/20 flex items-center justify-center text-white transition-all duration-200 hover:scale-110 active:scale-95"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
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
                      className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/65 border border-black/20 flex items-center justify-center text-white transition-all duration-200 hover:scale-110 active:scale-95"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

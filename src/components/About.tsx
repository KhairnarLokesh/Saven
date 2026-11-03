'use client';

import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { aboutConfig } from '@/data/about';

/* ─────────────────────────────────────────────────────────────────────────────
   Component Props & Constants
───────────────────────────────────────────────────────────────────────────── */
const WA_NUMBER = '918668404041';
const WA_MESSAGE =
  "Hello SAVEN Studios!\nI'm interested in your digital services and would like to discuss a project. Can we talk?";

export interface AboutProps {
  onStartProject?: () => void;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Main About Page Component (Continuous Monochrome Background & Balanced Spacing)
───────────────────────────────────────────────────────────────────────────── */
export const About: React.FC<AboutProps> = () => {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const reducedMotion = mounted && Boolean(shouldReduceMotion);

  const handleLetsTalkWhatsApp = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>
  ) => {
    e.preventDefault();
    const whatsappUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      id="about"
      className="relative bg-black text-white border-b border-neutral-900 overflow-hidden selection:bg-white selection:text-black"
      style={{
        fontFamily: 'var(--font-inter), "Inter", sans-serif',
        scrollMarginTop: '80px',
      }}
    >
      {/* ═══════════════════════════════════════════════════════════════════════
          HERO SECTION (Two-column editorial layout: Heading + Description)
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-[65px] pb-[45px]">
        <div className="grid grid-cols-1 md:grid-cols-[55fr_45fr] gap-10 md:gap-12 lg:gap-[75px] items-center w-full">
          {/* Left Column (55%): Eyebrow + Main Heading */}
          <motion.div
            className="flex flex-col justify-center"
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <span className="text-xs font-mono uppercase tracking-[0.2em] font-medium text-neutral-400 mb-5 block">
              {aboutConfig.hero.eyebrow}
            </span>

            <h2
              className="font-medium text-white leading-[1.2] tracking-tight max-w-[620px] text-3xl sm:text-4xl lg:text-[48px]"
              style={{
                fontFamily: 'var(--font-space-grotesk), "Space Grotesk", sans-serif',
                fontWeight: 500,
              }}
            >
              {aboutConfig.hero.heading}
            </h2>
          </motion.div>

          {/* Right Column (45%): Introductory Description with Left Border */}
          <motion.div
            className="flex items-center pl-0 md:pl-[25px] border-l-0 md:border-l md:border-[rgba(255,255,255,0.3)]"
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <p
              className="text-neutral-300 leading-[1.8] text-[17px] sm:text-[18px] lg:text-[19px] font-normal max-w-[460px]"
              style={{
                fontFamily: 'var(--font-inter), "Inter", sans-serif',
              }}
            >
              {aboutConfig.hero.paragraph}
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Section Divider: Thin Horizontal Line ── */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 mt-[25px] mb-[25px]">
        <div
          className="w-full h-px"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.35)' }}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          CLOSING CTA SECTION (Centered on continuous black background)
      ═══════════════════════════════════════════════════════════════════════ */}
      <div className="relative min-h-[300px] flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-[65px] pb-[75px] mt-0">
        <motion.div
          className="max-w-2xl mx-auto flex flex-col items-center"
          initial={reducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <h2
            className="text-white leading-[1.2] tracking-tight mb-8 text-3xl sm:text-4xl lg:text-[42px]"
            style={{
              fontFamily: 'var(--font-space-grotesk), "Space Grotesk", sans-serif',
              fontWeight: 500,
            }}
          >
            {aboutConfig.cta.heading}
          </h2>

          <a
            href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLetsTalkWhatsApp}
            className="
              inline-flex items-center justify-center
              px-[28px] py-[14px]
              text-white text-[15px] font-medium
              bg-transparent border border-white rounded-[5px]
              hover:bg-white hover:text-black
              transition-colors duration-300 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-white/50
              cursor-pointer
            "
            style={{
              fontFamily: 'var(--font-space-grotesk), "Space Grotesk", sans-serif',
            }}
          >
            {aboutConfig.cta.buttonText}
          </a>
        </motion.div>
      </div>
    </section>
  );
};

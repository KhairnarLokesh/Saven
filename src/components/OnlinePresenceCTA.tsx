'use client';

import React from 'react';

const WA_NUMBER = '918668404041';
const WA_MESSAGE =
  "Hello SAVEN Studios!\nI'm interested in your digital services and would like to discuss a project. Can we talk?";

export const OnlinePresenceCTA: React.FC = () => {
  const handleLetsTalk = () => {
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="bg-black text-white border-b border-neutral-900 py-20 sm:py-28 flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-10">
        Need an online presence?
      </h2>

      <button
        type="button"
        onClick={handleLetsTalk}
        className="
          inline-flex items-center justify-center
          px-8 py-3.5
          text-white text-sm font-semibold tracking-wide
          bg-transparent border border-white rounded-lg
          hover:bg-white hover:text-black
          transition-colors duration-200 ease-in-out
          cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50
        "
      >
        Let&apos;s Talk
      </button>
    </section>
  );
};


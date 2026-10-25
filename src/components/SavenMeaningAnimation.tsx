'use client';

import React, { useState, useEffect } from 'react';

interface MeaningNode {
  letter: string;
  word: string;
  detail: string;
}

const NODES: MeaningNode[] = [
  { letter: 'S', word: 'Software', detail: 'Bespoke applications & platforms' },
  { letter: 'A', word: 'Architecture', detail: 'Scalable data models & systems' },
  { letter: 'V', word: 'Vision', detail: 'Transforming ideas into reality' },
  { letter: 'E', word: 'Engineering', detail: 'Clean, tested & resilient code' },
  { letter: 'N', word: 'Network', detail: 'Distributed APIs & ecosystems' },
];

export const SavenMeaningAnimation: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-cycle through the 5 nodes unless user is hovering
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % NODES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <div
      className={`w-full max-w-3xl mx-auto py-8 select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="SAVEN Acronym Meaning: Software, Architecture, Vision, Engineering, Network"
    >
      {/* Container with Armory-style thin technical framing */}
      <div className="relative px-4 sm:px-8 py-6 bg-neutral-950/80 border border-neutral-900 rounded-lg backdrop-blur-sm shadow-2xl">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-900/80 text-xs tracking-wider text-neutral-400">
          <span className="text-neutral-300 uppercase font-medium text-[11px]">
            What SAVEN Stands For
          </span>
          <span className="text-neutral-500 font-mono text-[11px]">
            0{activeIndex + 1} / 05
          </span>
        </div>

        {/* The Animated Line and Nodes */}
        <div className="relative pt-4 pb-2">
          {/* Base Horizontal Connecting Line */}
          <div className="absolute top-[23px] left-[10%] right-[10%] h-[1px] bg-neutral-800" />

          {/* Animated Scanning Light Beam on Line */}
          <div
            className="absolute top-[22px] h-[3px] bg-gradient-to-r from-transparent via-white to-transparent transition-all duration-700 ease-out pointer-events-none opacity-80"
            style={{
              left: `${(activeIndex / (NODES.length - 1)) * 75 + 7}%`,
              width: '18%',
              transform: 'translateX(-50%)',
            }}
          />

          {/* Nodes Grid */}
          <div className="relative z-10 flex items-start justify-between">
            {NODES.map((node, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={node.letter}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className="flex flex-col items-center group cursor-pointer focus:outline-none transition-all duration-300 w-1/5"
                >
                  {/* The Dot on the Line */}
                  <div className="relative flex items-center justify-center w-7 h-7 mb-4">
                    {/* Active ping radar ring */}
                    {isActive && (
                      <span className="absolute w-6 h-6 rounded-full border border-white animate-ping opacity-60 pointer-events-none" />
                    )}
                    {/* Outer glow ring */}
                    <span
                      className={`absolute rounded-full transition-all duration-300 ${
                        isActive
                          ? 'w-4 h-4 bg-white/20 border border-white/60'
                          : 'w-2 h-2 bg-transparent group-hover:bg-white/10'
                      }`}
                    />
                    {/* Core Solid Dot */}
                    <span
                      className={`relative rounded-full transition-all duration-300 ${
                        isActive
                          ? 'w-2.5 h-2.5 bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)] scale-110'
                          : 'w-2 h-2 bg-neutral-500 group-hover:bg-white group-hover:scale-110'
                      }`}
                    />
                  </div>

                  {/* Letter (S, A, V, E, N) */}
                  <span
                    className={`font-sans font-bold text-xl sm:text-2xl md:text-3xl tracking-wider transition-all duration-300 leading-none mb-1.5 ${
                      isActive
                        ? 'text-white scale-110'
                        : 'text-neutral-400 group-hover:text-neutral-200'
                    }`}
                  >
                    {node.letter}
                  </span>

                  {/* Meaning Word */}
                  <span
                    className={`text-xs sm:text-sm font-light tracking-wide transition-colors duration-300 ${
                      isActive
                        ? 'text-neutral-200 font-medium'
                        : 'text-neutral-500 group-hover:text-neutral-400'
                    }`}
                  >
                    {node.word}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Active Meaning Info */}
        <div className="mt-6 pt-4 border-t border-neutral-900/80 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-white font-semibold">
              {NODES[activeIndex].letter} – {NODES[activeIndex].word}
            </span>
            <span className="text-neutral-600">·</span>
            <span className="text-neutral-300 font-sans font-light text-[11px] sm:text-xs">
              {NODES[activeIndex].detail}
            </span>
          </div>

          <div className="text-[11px] text-neutral-500">
            Click or hover to explore
          </div>
        </div>
      </div>
    </div>
  );
};

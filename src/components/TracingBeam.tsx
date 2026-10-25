'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

interface TracingBeamProps {
  children: React.ReactNode;
  className?: string;
}

export const TracingBeam: React.FC<TracingBeamProps> = ({ children, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgHeight, setSvgHeight] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 45,
    restDelta: 0.001,
  });

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setSvgHeight(containerRef.current.offsetHeight);
      }
    };
    updateHeight();
    const ro = new ResizeObserver(updateHeight);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener('resize', updateHeight);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  // Generates a smooth, continuous curved path that sweeps out at the top
  // and flows down the left side alongside content as the user scrolls
  const generatePath = (height: number) => {
    if (height <= 0) return '';
    let d = 'M 8 0 C 8 100, 48 160, 48 280';
    let currentY = 280;
    let side = 1;
    const step = 850;

    while (currentY < height - 200) {
      const currentX = side === 1 ? 48 : 14;
      const targetX = side === 1 ? 14 : 48;
      d += ` V ${currentY + 320}`;
      d += ` C ${currentX} ${currentY + 440}, ${targetX} ${currentY + 500}, ${targetX} ${currentY + 640}`;
      currentY += 640;
      side = side === 1 ? 0 : 1;
    }
    d += ` V ${height}`;
    return d;
  };

  const pathD = generatePath(svgHeight);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Scroll-following curved beam on the left gutter */}
      <div
        className="absolute top-0 left-2 sm:left-4 md:left-6 lg:left-8 xl:left-[max(1rem,calc((100vw-80rem)/2-3.5rem))] pointer-events-none z-30 hidden md:block"
        aria-hidden="true"
      >
        <svg
          width="60"
          height={svgHeight}
          viewBox={`0 0 60 ${svgHeight}`}
          className="w-[60px] pointer-events-none drop-shadow-[0_0_12px_rgba(88,152,115,0.45)]"
          fill="none"
        >
          {/* Faint guide track */}
          <path
            d={pathD}
            stroke="#1a1a1a"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Active glowing green beam that follows scroll */}
          <motion.path
            d={pathD}
            stroke="url(#saven-beam-gradient)"
            strokeWidth="10"
            strokeLinecap="round"
            style={{ pathLength }}
          />

          <defs>
            <linearGradient id="saven-beam-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3d7253" />
              <stop offset="60%" stopColor="#589873" />
              <stop offset="100%" stopColor="#75c898" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Main Page Content */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
};

'use client';

import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'white' | 'black';
  asLink?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  variant = 'white',
}) => {
  // Dimension mappings keeping the 584:97 aspect ratio (approx 6:1)
  const sizeMap = {
    sm: { height: 22, width: 132, className: 'h-[22px] w-auto' },
    md: { height: 28, width: 168, className: 'h-[26px] md:h-[30px] w-auto' },
    lg: { height: 42, width: 252, className: 'h-[38px] md:h-[44px] w-auto' },
    xl: { height: 64, width: 384, className: 'h-[56px] md:h-[72px] w-auto' },
  }[size];

  const invertFilter = variant === 'black' ? 'invert' : '';

  return (
    <div
      className={`inline-flex items-center select-none transition-transform duration-200 group ${className}`}
      aria-label="SAVEN Digital Solutions"
    >
      <div className="relative flex items-center">
        {/* Exact SAVEN Brand Wordmark Asset */}
        <Image
          src="/saven-logo-transparent.png"
          alt="SAVEN"
          width={sizeMap.width}
          height={sizeMap.height}
          priority
          className={`object-contain transition-all duration-300 group-hover:brightness-110 ${sizeMap.className} ${invertFilter}`}
        />
      </div>
    </div>
  );
};

'use client';

import React, {
  useState,
  useEffect,
  useRef,
  useId,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { motion, AnimatePresence, type Transition, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface TextMorphProps {
  /** The words or short phrases to morph between, in order. */
  words?: string[];
  /** Optional single child string to morph to */
  children?: string;
  /** How letters change: 'liquid' thins old letters away and grows new ones in, 'blur' pulls them out of and into focus. Default: 'liquid' */
  morph?: 'liquid' | 'blur';
  /** Colour of the text. currentColor follows the surrounding text. Default: 'currentColor' */
  color?: string;
  /** Colour letters pass through while they change. Default: '#8EC5FF' */
  morphColor?: string;
  /** Strength of that colour, from 0 to 1. Default: 0.3 */
  tint?: number;
  /** Where shorter words sit inside the space of the longest one. Default: 'center' */
  align?: 'left' | 'center' | 'right';
  /** Font of the words. Leave unset to inherit from surrounding text. */
  fontFamily?: string;
  /** Font size in pixels. Leave unset to inherit. */
  fontSize?: number | string;
  /** Font weight. Leave unset to inherit. */
  fontWeight?: number | string;
  /** Letter spacing in em. Leave unset to inherit. */
  letterSpacing?: number | string;
  /** Seconds from one morph to the next in auto mode. Default: 3.2 */
  interval?: number;
  /** Seconds a morph takes, from the first letter to the last. Default: 0.95 */
  duration?: number;
  /** How much the change ripples across the word, from 0 to 0.9. Default: 0.2 */
  stagger?: number;
  /** Where the ripple begins. Default: 'start' */
  staggerFrom?: 'start' | 'end' | 'center' | 'edges' | 'random';
  /** How far changing letters drift toward their place in the next word, from 0 to 1. Default: 0.35 */
  travel?: number;
  /** How far letters reach to fuse as they pass each other, in em. Default: 0.08 */
  goo?: number;
  /** Extra weight letters gain mid-morph, in em. Default: 0.02 */
  swell?: number;
  /** How rounded/blurred letters become while they change. Default: 0.7 */
  softness?: number;
  /** Scale bounce during transition. Default: 0.05 */
  scale?: number;
  /** Trigger mode: 'auto' | 'hover' | 'click'. Default: 'auto' */
  trigger?: 'auto' | 'hover' | 'click';
  /** Return to the first word after the last. Default: true */
  loop?: boolean;
  /** Grow the first word in from nothing when it appears. Default: false */
  intro?: boolean;
  /** Wait until the text scrolls into view before starting. Default: true */
  startOnView?: boolean;
  /** Hold the current word while the mouse is over it. Default: true */
  pauseOnHover?: boolean;
  /** Stop morphing on the timer. Default: false */
  paused?: boolean;
  /** Called after each morph with the new word. */
  onChange?: (word: string, index: number) => void;
  className?: string;
  style?: React.CSSProperties;
  as?: React.ElementType;
}

export interface TextMorphHandle {
  next: () => void;
  goTo: (index: number) => void;
  currentWord: string;
}

const DEFAULT_WORDS = [
  'Our Architecture.',
  'Our Engineering.',
  'Our Precision.',
  'Our Innovation.',
];

export const TextMorph = forwardRef<TextMorphHandle, TextMorphProps>(
  (
    {
      words,
      children,
      morph = 'liquid',
      color = 'currentColor',
      morphColor = '#8EC5FF',
      tint = 0.35,
      align = 'center',
      fontFamily,
      fontSize,
      fontWeight,
      letterSpacing,
      interval = 3.2,
      duration = 0.95,
      stagger = 0.2,
      staggerFrom = 'start',
      travel = 0.35,
      goo = 0.08,
      swell = 0.02,
      softness = 0.7,
      scale = 0.05,
      trigger = 'auto',
      loop = true,
      intro = false,
      startOnView = true,
      pauseOnHover = true,
      paused = false,
      onChange,
      className,
      style,
      as: Component = 'span',
    },
    ref
  ) => {
    const list = useMemo(() => {
      if (children) return [children];
      if (words && words.length > 0) return words;
      return DEFAULT_WORDS;
    }, [words, children]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isInView, setIsInView] = useState(!startOnView);
    const containerRef = useRef<HTMLSpanElement | null>(null);
    const uniqueBaseId = useId();
    const filterId = useMemo(
      () => `text-morph-goo-${uniqueBaseId.replace(/[^a-zA-Z0-9_-]/g, '')}`,
      [uniqueBaseId]
    );

    const currentWord = list[currentIndex] ?? list[0] ?? '';

    // Imperative API
    useImperativeHandle(
      ref,
      () => ({
        next: () => {
          setCurrentIndex((prev) => (prev + 1) % list.length);
        },
        goTo: (idx: number) => {
          if (idx >= 0 && idx < list.length) {
            setCurrentIndex(idx);
          }
        },
        currentWord,
      }),
      [list, currentWord]
    );

    // Intersection observer for startOnView
    useEffect(() => {
      if (!startOnView || typeof window === 'undefined') {
        setIsInView(true);
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setIsInView(true);
            }
          }
        },
        { threshold: 0.1 }
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => observer.disconnect();
    }, [startOnView]);

    // Auto-advance timer
    useEffect(() => {
      if (trigger !== 'auto' || paused || list.length <= 1) return;
      if (!isInView) return;
      if (pauseOnHover && isHovered) return;

      const timer = setInterval(() => {
        setCurrentIndex((prev) => {
          const nextIdx = prev + 1;
          if (nextIdx >= list.length) {
            return loop ? 0 : prev;
          }
          return nextIdx;
        });
      }, Math.max(1000, interval * 1000));

      return () => clearInterval(timer);
    }, [trigger, paused, list, interval, loop, isInView, pauseOnHover, isHovered]);

    // Callback on word change
    useEffect(() => {
      onChange?.(currentWord, currentIndex);
    }, [currentIndex, currentWord, onChange]);

    // Parse characters with occurrence tracking for shared layoutId morphing
    const characters = useMemo(() => {
      const counts: Record<string, number> = {};
      const total = currentWord.length;

      return currentWord.split('').map((char, index) => {
        const lower = char.toLowerCase();
        counts[lower] = (counts[lower] || 0) + 1;
        const occ = counts[lower];

        // Shared layout ID tracks character identity so identical characters glide into place
        const layoutId = `${uniqueBaseId}-${lower}-${occ}`;

        // Compute stagger delay based on staggerFrom
        let delayFactor = index / Math.max(1, total - 1);
        if (staggerFrom === 'end') {
          delayFactor = 1 - delayFactor;
        } else if (staggerFrom === 'center') {
          const mid = (total - 1) / 2;
          delayFactor = Math.abs(index - mid) / Math.max(1, mid);
        } else if (staggerFrom === 'edges') {
          const mid = (total - 1) / 2;
          delayFactor = 1 - Math.abs(index - mid) / Math.max(1, mid);
        } else if (staggerFrom === 'random') {
          delayFactor = ((index * 9301 + 49297) % 233280) / 233280;
        }

        return {
          id: layoutId,
          char: char === ' ' ? '\u00A0' : char,
          delay: delayFactor * stagger * duration,
        };
      });
    }, [currentWord, uniqueBaseId, stagger, duration, staggerFrom]);

    const springTransition: Transition = {
      type: 'spring',
      stiffness: 340,
      damping: 24,
      mass: 0.35,
    };

    const variants: Variants = {
      initial: {
        opacity: 0,
        scale: 1 - scale,
        y: travel * 18,
        filter: morph === 'blur' ? `blur(${softness * 12}px)` : `blur(${softness * 6}px)`,
      },
      animate: {
        opacity: 1,
        scale: 1,
        y: 0,
        filter: 'blur(0px)',
      },
      exit: {
        opacity: 0,
        scale: 1 + scale,
        y: -travel * 18,
        filter: morph === 'blur' ? `blur(${softness * 12}px)` : `blur(${softness * 6}px)`,
      },
    };

    const handleClick = () => {
      if (trigger === 'click' && list.length > 1) {
        setCurrentIndex((prev) => (prev + 1) % list.length);
      }
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
      if (trigger === 'hover' && list.length > 1) {
        setCurrentIndex((prev) => (prev + 1) % list.length);
      }
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    return (
      <Component
        ref={containerRef}
        className={cn(
          'relative inline-flex items-center justify-center select-none cursor-default overflow-visible',
          align === 'left' && 'justify-start text-left',
          align === 'right' && 'justify-end text-right',
          className
        )}
        style={{
          color,
          fontFamily,
          fontSize,
          fontWeight,
          letterSpacing,
          filter: morph === 'liquid' ? `url(#${filterId})` : undefined,
          ...style,
        }}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label={currentWord}
      >
        {/* SVG Gooey Liquid Filter Definition */}
        {morph === 'liquid' && (
          <svg className="absolute w-0 h-0 pointer-events-none -z-10" aria-hidden="true">
            <defs>
              <filter id={filterId}>
                <feGaussianBlur in="SourceGraphic" stdDeviation={softness * 2.5} result="blur" />
                <feColorMatrix
                  in="blur"
                  mode="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                  result="goo"
                />
                <feComposite in="SourceGraphic" in2="goo" operator="atop" />
              </filter>
            </defs>
          </svg>
        )}

        {/* Morphing character glyphs */}
        <AnimatePresence mode="popLayout" initial={intro}>
          <motion.span
            key={currentWord}
            className="inline-flex items-center flex-wrap"
            layout
            transition={springTransition}
          >
            {characters.map((item) => (
              <motion.span
                key={item.id}
                layoutId={item.id}
                className="inline-block relative"
                aria-hidden="true"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{
                  ...springTransition,
                  delay: item.delay,
                  duration: duration * 0.75,
                }}
                style={{
                  textShadow:
                    tint > 0
                      ? `0 0 20px ${morphColor}${Math.round(tint * 255)
                          .toString(16)
                          .padStart(2, '0')}`
                      : undefined,
                }}
              >
                {item.char}
              </motion.span>
            ))}
          </motion.span>
        </AnimatePresence>
      </Component>
    );
  }
);

TextMorph.displayName = 'TextMorph';

export default TextMorph;

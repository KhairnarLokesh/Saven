'use client';

import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
  useId,
} from 'react';
import { cn } from '@/lib/utils';

export interface BendingMarqueeProps {
  /** Phrases repeated along the strip. */
  items?: (string | React.ReactNode)[];
  /** Optional custom items per row when rows > 1 */
  rowItems?: (string | React.ReactNode)[][];
  /** Glyph printed between phrases. Default: '✳︎' */
  separator?: React.ReactNode;
  /** Width of the flat center panel in pixels. Default: 420 */
  panelWidth?: number;
  /** Height of every panel in pixels. Default: 520 */
  panelHeight?: number;
  /** Angle the outer wings fold back by, in degrees. Default: 50 */
  bend?: number;
  /** How far the whole triptych sits behind the screen in z-space. Default: -200 */
  depth?: number;
  /** Perspective depth of the scene in pixels. Default: 800 */
  perspective?: number;
  /** Seconds the strip takes to travel one full repeat. Default: 16 */
  speed?: number;
  /** Travel direction of the strip. Default: 'left' */
  direction?: 'left' | 'right';
  /** Number of stacked bands per panel. Extra bands alternate direction. Default: 1 */
  rows?: number;
  /** Vertical space between bands in pixels. Default: 22 */
  rowGap?: number;
  /** Horizontal space between phrases in pixels. Default: 26 */
  itemGap?: number;
  /** Vertical padding inside a band in pixels. Default: 18 */
  bandPadding?: number;
  /** Font size of the phrases in pixels. Default: 34 */
  fontSize?: number;
  /** Font weight of the phrases. Default: 600 */
  fontWeight?: number;
  /** Letter spacing of the phrases in pixels. Default: 1 */
  letterSpacing?: number;
  /** Text color. Default: '#fafafa' */
  color?: string;
  /** Solid fill behind each band. Default: '#111111' */
  bandColor?: string;
  /** Degrees the separator rocks back and forth. Default: 14 */
  markSway?: number;
  /** Ease the strip to a halt while the pointer is over the scene. Default: true */
  pauseOnHover?: boolean;
  /** Seconds the strip takes to settle when hover starts or ends. Default: 0.7 */
  pauseDamping?: number;
  /** Scale the triptych so the panels fill the container height. Default: true */
  fit?: boolean;
  /** Upper bound applied to the fit scale. Default: 1 */
  maxScale?: number;
  className?: string;
  style?: React.CSSProperties;
}

const DEFAULT_ITEMS = [
  'designed in the open',
  'shipped every week',
  'built for the web',
];

const DEG_TO_RAD = Math.PI / 180;

interface MarqueeRowProps {
  items: (string | React.ReactNode)[];
  separator: React.ReactNode;
  gap: number;
  sway: number;
  spin: string;
}

const MarqueeRow: React.FC<MarqueeRowProps> = ({
  items,
  separator,
  gap,
  sway,
  spin,
}) => (
  <div className="flex shrink-0 items-center" style={{ gap }}>
    {items.map((item, index) => {
      const key = typeof item === 'string' ? `${item}-${index}` : `node-${index}`;
      return (
        <span
          key={key}
          className="flex shrink-0 items-center whitespace-nowrap"
          style={{ gap }}
        >
          <span
            className="inline-block select-none"
            style={
              sway > 0
                ? {
                    animation: `${spin} 1.6s ease-in-out infinite alternate`,
                    animationDelay: `${-0.4 * index}s`,
                  }
                : undefined
            }
          >
            {separator}
          </span>
          <span className="inline-flex items-center">{item}</span>
        </span>
      );
    })}
  </div>
);

export const BendingMarquee: React.FC<BendingMarqueeProps> = ({
  items = DEFAULT_ITEMS,
  rowItems,
  separator = '✳︎',
  panelWidth = 420,
  panelHeight = 520,
  bend = 50,
  depth = -200,
  perspective = 800,
  speed = 16,
  direction = 'left',
  rows = 1,
  rowGap = 22,
  itemGap = 26,
  bandPadding = 18,
  fontSize = 34,
  fontWeight = 600,
  letterSpacing = 1,
  color = '#fafafa',
  bandColor = '#111111',
  markSway = 14,
  pauseOnHover = true,
  pauseDamping = 0.7,
  fit = true,
  maxScale = 1,
  className,
  style,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const bandTrackRef = useRef<HTMLDivElement>(null);
  const currentPlaybackRate = useRef(1);
  const animFrameId = useRef(0);
  const [unitWidth, setUnitWidth] = useState(0);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const uniqueId = useId().replace(/[^a-zA-Z0-9]/g, '');
  const runAnimName = `bmRun${uniqueId}`;
  const swayAnimName = `bmSway${uniqueId}`;

  const resolvedItems = items.length > 0 ? items : DEFAULT_ITEMS;
  const numRows = Math.max(Math.round(rows), 1);

  // Measure content loop width
  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (cr && cr.width !== 0) {
        setUnitWidth(cr.width + itemGap);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [itemGap, resolvedItems]);

  // Track parent container dimensions
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (cr) {
        setContainerSize({ width: cr.width, height: cr.height });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Compute dynamic scale to fit container height
  const fitScale = useMemo(() => {
    if (!fit || containerSize.height === 0) return maxScale;
    const computed = Math.min(maxScale, containerSize.height / panelHeight);
    return Number.isFinite(computed) && computed > 0 ? computed : maxScale;
  }, [fit, maxScale, containerSize.height, panelHeight]);

  // Compute wing panel width based on 3D bend angle, perspective, depth, and viewport width
  const wingWidth = useMemo(() => {
    const halfWidth = containerSize.width > 0 ? containerSize.width / 2 : panelWidth;
    const rad = bend * DEG_TO_RAD;
    const cosVal = Math.cos(rad);
    const sinVal = Math.sin(rad);
    const s = perspective - depth;
    const o = (panelWidth / 2) * fitScale;
    let d = panelWidth;
    const p = fitScale * perspective * cosVal + halfWidth * sinVal;
    if (p > 0) {
      d = (halfWidth * s - fitScale * perspective * o) / p;
    }
    if (sinVal > 0) {
      d = Math.min(d, (0.82 * s) / sinVal);
    }
    return Math.min(Math.max(1.12 * d, 0.5 * panelWidth, 120), 6000);
  }, [containerSize.width, panelWidth, bend, perspective, depth, fitScale]);

  // 3D triptych panels: West (folded left), Core (flat center), East (folded right)
  const panels = useMemo(
    () => [
      {
        id: 'west',
        width: wingWidth + 1,
        tilt: bend,
        origin: 'right center',
        nudge: { marginRight: -1 },
        offset: -wingWidth,
      },
      {
        id: 'core',
        width: panelWidth,
        tilt: 0,
        origin: 'center',
        nudge: {},
        offset: 0,
      },
      {
        id: 'east',
        width: wingWidth + 1,
        tilt: -bend,
        origin: 'left center',
        nudge: { marginLeft: -1 },
        offset: panelWidth - 1,
      },
    ],
    [panelWidth, wingWidth, bend]
  );

  // Smooth playback rate damping on hover
  const setPlaybackRate = useCallback(
    (targetRate: number) => {
      const track = bandTrackRef.current;
      if (!track) return;
      cancelAnimationFrame(animFrameId.current);
      const anims = track.getAnimations({ subtree: true });
      if (anims.length === 0) return;
      const startRate = currentPlaybackRate.current;
      const dur = 1000 * Math.max(pauseDamping, 0);
      if (dur === 0) {
        currentPlaybackRate.current = targetRate;
        anims.forEach((a) => (a.playbackRate = targetRate));
        return;
      }
      const startTime = performance.now();
      const step = (now: number) => {
        const progress = Math.min((now - startTime) / dur, 1);
        const eased = progress * progress * (3 - 2 * progress);
        currentPlaybackRate.current = startRate + eased * (targetRate - startRate);
        anims.forEach((a) => (a.playbackRate = currentPlaybackRate.current));
        if (progress < 1) {
          animFrameId.current = requestAnimationFrame(step);
        }
      };
      animFrameId.current = requestAnimationFrame(step);
    },
    [pauseDamping]
  );

  useEffect(() => () => cancelAnimationFrame(animFrameId.current), []);

  const keyframeStyles = `@keyframes ${runAnimName}{to{transform:translate3d(calc(var(--bm-unit) * -1),0,0)}}@keyframes ${swayAnimName}{from{transform:rotate(${-markSway}deg)}to{transform:rotate(${markSway}deg)}}`;

  return (
    <div
      ref={rootRef}
      className={cn(
        'relative flex h-full w-full items-center justify-center overflow-hidden',
        className
      )}
      style={{ perspective: `${perspective}px`, ...style }}
      onPointerEnter={() => pauseOnHover && setPlaybackRate(0)}
      onPointerLeave={() => pauseOnHover && setPlaybackRate(1)}
    >
      <style>{keyframeStyles}</style>

      {/* Hidden container for accurate width measurement */}
      <div
        ref={measureRef}
        className="pointer-events-none absolute flex items-center opacity-0"
        style={{
          left: -99999,
          top: 0,
          gap: itemGap,
          fontSize,
          fontWeight,
          letterSpacing,
        }}
        aria-hidden="true"
      >
        <MarqueeRow
          items={resolvedItems}
          separator={separator}
          gap={itemGap}
          sway={0}
          spin={swayAnimName}
        />
      </div>

      {/* 3D Curved Track */}
      <div
        ref={bandTrackRef}
        className="flex"
        style={{
          transformStyle: 'preserve-3d',
          transform: `scale(${fitScale})`,
        }}
      >
        {panels.map((panel) => (
          <div
            key={panel.id}
            className="relative shrink-0 overflow-hidden"
            style={{
              width: panel.width,
              height: panelHeight,
              transformOrigin: panel.origin,
              transform: `translateZ(${depth}px) rotateY(${panel.tilt}deg)`,
              ...panel.nudge,
            }}
          >
            <div
              className="flex h-full w-full flex-col justify-center"
              style={{ gap: rowGap }}
            >
              {Array.from({ length: numRows }).map((_, rowIndex) => {
                const rowSpecificItems =
                  rowItems && rowItems[rowIndex] && rowItems[rowIndex].length > 0
                    ? rowItems[rowIndex]
                    : resolvedItems;
                const isOdd = rowIndex % 2 === 1;
                const rowDir =
                  direction === 'left'
                    ? isOdd
                      ? 'right'
                      : 'left'
                    : isOdd
                    ? 'left'
                    : 'right';
                const rowSpeed = speed * (1 + 0.14 * rowIndex);
                const offsetProgress =
                  unitWidth > 0
                    ? (((panel.offset % unitWidth) + unitWidth) % unitWidth) / unitWidth
                    : 0;
                const repeats = unitWidth > 0 ? Math.ceil(panel.width / unitWidth) + 2 : 3;

                return (
                  <div
                    key={rowIndex}
                    className="relative w-full overflow-hidden"
                    style={{
                      paddingTop: bandPadding,
                      paddingBottom: bandPadding,
                      background: bandColor,
                      color,
                      fontSize,
                      fontWeight,
                      letterSpacing,
                    }}
                  >
                    <div
                      className="flex w-max items-center"
                      style={
                        {
                          gap: itemGap,
                          paddingLeft: itemGap,
                          '--bm-unit': `${unitWidth}px`,
                          animationName: unitWidth > 0 ? runAnimName : 'none',
                          animationDuration: `${rowSpeed}s`,
                          animationTimingFunction: 'linear',
                          animationIterationCount: 'infinite',
                          animationDirection: rowDir === 'left' ? 'normal' : 'reverse',
                          animationDelay: `${
                            -rowSpeed * (rowDir === 'left' ? offsetProgress : 1 - offsetProgress)
                          }s`,
                          willChange: 'transform',
                        } as React.CSSProperties
                      }
                    >
                      {Array.from({ length: repeats }).map((_, repIdx) => (
                        <MarqueeRow
                          key={repIdx}
                          items={rowSpecificItems}
                          separator={separator}
                          gap={itemGap}
                          sway={markSway}
                          spin={swayAnimName}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BendingMarquee;

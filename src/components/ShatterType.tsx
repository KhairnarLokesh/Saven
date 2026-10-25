'use client';

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useSyncExternalStore,
} from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

export interface ShatterTypeProps {
  /** The headline text. Use \n for line breaks. Hidden text is also rendered for accessibility. */
  text?: string;
  /** Optional image URL (such as brand logo asset) to render into glass shards */
  imageSrc?: string;
  /** Optional subtitle text (such as 'STUDIOS') rendered below the logo */
  subText?: string;
  /** Font family of the headline. Empty uses inherited font. */
  fontFamily?: string;
  /** Weight of the headline, 100 to 900. Default: 700 */
  fontWeight?: number;
  /** Size in pixels. 0 fits the headline dynamically to the container. Default: 0 */
  fontSize?: number;
  /** Letter spacing tracking in em. Default: -0.02 */
  letterSpacing?: number;
  /** Line height for multi-line headlines. Default: 1.05 */
  lineHeight?: number;
  /** Horizontal alignment: 'left' | 'center' | 'right'. Default: 'center' */
  align?: 'left' | 'center' | 'right';
  /** Front faces gradient colors [start, end]. Default: ['currentColor', 'currentColor'] */
  colors?: [string, string];
  /** Back faces accent color seen while tumbling. Default: '#7B5CFF' */
  accentColor?: string;
  /** Average shard size relative to font size. Default: 0.09 */
  shardSize?: number;
  /** Unevenness of fracture, 0 to 1. Default: 0.6 */
  irregularity?: number;
  /** Strength of hairline cracks under cursor, 0 to 1. Default: 0.6 */
  crack?: number;
  /** Reach of cracks around cursor in em. Default: 0.5 */
  crackRadius?: number;
  /** Seconds for cracks to close again. Default: 0.9 */
  heal?: number;
  /** Enable click or tap to shatter. Default: true */
  shatter?: boolean;
  /** Radius of shattered area in em. Default: 0.55 */
  shatterRadius?: number;
  /** Shard burst distance outward. Default: 1 */
  force?: number;
  /** Shard tumble speed. Default: 1 */
  spin?: number;
  /** Shard fly distance toward viewer. Default: 1 */
  depth?: number;
  /** Gravity pull on flying shards. Default: 0 */
  gravity?: number;
  /** Seconds shards hang in air before flying back. Default: 1.1 */
  reassemble?: number;
  /** How hard shards snap back into place, 0 to 1. Default: 0.55 */
  stiffness?: number;
  /** Light glint caught by tilted shards and snap flash, 0 to 2. Default: 0.8 */
  glint?: number;
  /** Entrance animation: 'assemble' | 'drop' | 'fade' | 'none'. Default: 'assemble' */
  intro?: 'assemble' | 'drop' | 'fade' | 'none';
  /** Length of entrance in seconds. Default: 1.6 */
  introDuration?: number;
  /** Shatter random spot periodically while pointer is away. Default: false */
  autoplay?: boolean;
  /** Seconds between autoplay shatters. Default: 4 */
  autoplayInterval?: number;
  /** Respond to pointer events. Default: true */
  interactive?: boolean;
  /** Freeze all motion. Default: false */
  paused?: boolean;
  /** Render resolution multiplier, 0.5 to 1. Default: 1 */
  quality?: number;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export interface ShatterTypeHandle {
  shatter: (x?: number, y?: number) => void;
  shatterAll: (forceMult?: number) => void;
  assemble: () => void;
}

const vertexShader = `
uniform sampler2D uState;
uniform vec2 uStateSize;
attribute vec3 center;
attribute vec3 bary;
attribute float shard;
varying vec2 vUv;
varying vec3 vBary;
varying vec3 vNormal;
varying float vCrack;
varying float vFlash;
varying float vAlpha;
varying float vOrigin;

vec4 fetchState(float k) {
  float column = mod(shard, 256.0) * 3.0 + k;
  float row = floor(shard / 256.0);
  return texture2D(uState, (vec2(column, row) + 0.5) / uStateSize);
}

vec3 rotateQ(vec4 q, vec3 v) {
  vec3 t = 2.0 * cross(q.xyz, v);
  return v + q.w * t + cross(q.xyz, t);
}

void main() {
  vec4 motion = fetchState(0.0);
  vec4 turn = fetchState(1.0);
  vec4 extra = fetchState(2.0);
  vec3 world = center + motion.xyz + rotateQ(turn, position * motion.w);
  vNormal = rotateQ(turn, vec3(0.0, 0.0, 1.0));
  vUv = uv;
  vBary = bary;
  vCrack = extra.x;
  vFlash = extra.y;
  vAlpha = extra.z;
  vOrigin = center.x + position.x;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(world, 1.0);
}
`;

const fragmentShader = `
uniform sampler2D uMask;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uAccent;
uniform vec2 uBounds;
uniform float uGlint;
varying vec2 vUv;
varying vec3 vBary;
varying vec3 vNormal;
varying float vCrack;
varying float vFlash;
varying float vAlpha;
varying float vOrigin;

void main() {
  float mask = texture2D(uMask, vUv).a;
  float alpha = mask * vAlpha;
  if (alpha < 0.004) discard;
  vec3 n = normalize(vNormal);
  bool front = gl_FrontFacing;
  vec3 facing = front ? n : -n;
  float t = clamp((vOrigin - uBounds.x) / max(1.0, uBounds.y - uBounds.x), 0.0, 1.0);
  vec3 base = front ? mix(uColorA, uColorB, t) : uAccent;
  vec3 light = normalize(vec3(-0.45, 0.62, 0.64));
  float shade = 1.0 + 0.6 * (dot(facing, light) - light.z);
  vec3 bounce = reflect(-light, facing);
  float tilt = smoothstep(0.0, 0.3, 1.0 - facing.z);
  float spark = pow(max(bounce.z, 0.0), 26.0) * tilt * uGlint;
  float edge = min(min(vBary.x, vBary.y), vBary.z);
  float seam = 1.0 - smoothstep(0.0, fwidth(edge) * 1.5, edge);
  vec3 colour = base * clamp(shade, 0.35, 1.4);
  colour = mix(colour, vec3(1.0), clamp(spark + seam * vCrack * 0.3 + vFlash * 0.5, 0.0, 1.0));
  gl_FragColor = vec4(colour, alpha);
}
`;

const FIXED_DT = 1 / 120;
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const finite = (v: unknown, fallback: number) => (Number.isFinite(v) ? (v as number) : fallback);
const smoothstep = (min: number, max: number, v: number) => {
  const t = clamp((v - min) / (max - min), 0, 1);
  return t * t * (3 - 2 * t);
};

const createPrng = (seed: number) => {
  let t = seed >>> 0;
  return () => {
    let e = (t = (t + 0x6d2b79f5) >>> 0);
    e = Math.imul(e ^ (e >>> 15), 1 | e);
    return (((e ^= e + Math.imul(e ^ (e >>> 7), 61 | e)) ^ (e >>> 14)) >>> 0) / 0x100000000;
  };
};

let sharedColorCanvas: HTMLCanvasElement | null = null;
let sharedColorCtx: CanvasRenderingContext2D | null = null;

const subscribeReducedMotion = (cb: () => void) => {
  if (typeof window === 'undefined') return () => {};
  const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
  mql.addEventListener('change', cb);
  return () => mql.removeEventListener('change', cb);
};

const getReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

if (typeof window !== 'undefined') {
  const preImg = new Image();
  preImg.crossOrigin = 'anonymous';
  preImg.src = '/saven-logo-transparent.png';
}

export const ShatterType = forwardRef<ShatterTypeHandle, ShatterTypeProps>(function ShatterType(
  {
    text = 'Shatter',
    imageSrc,
    subText,
    fontFamily = '',
    fontWeight = 700,
    fontSize = 0,
    letterSpacing = -0.02,
    lineHeight = 1.05,
    align = 'center',
    colors = ['currentColor', 'currentColor'],
    accentColor = '#7B5CFF',
    shardSize = 0.09,
    irregularity = 0.6,
    crack = 0.6,
    crackRadius = 0.5,
    heal = 0.9,
    shatter = true,
    shatterRadius = 0.55,
    force = 1,
    spin = 1,
    depth = 1,
    gravity = 0,
    reassemble = 1.1,
    stiffness = 0.55,
    glint = 0.8,
    intro = 'assemble',
    introDuration = 1.6,
    autoplay = false,
    autoplayInterval = 4,
    interactive = true,
    paused = false,
    quality = 1,
    className,
    style,
    children,
  },
  ref
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageObjRef = useRef<HTMLImageElement | null>(null);
  const instanceRef = useRef<{
    sync: () => void;
    shatter: (x?: number, y?: number) => void;
    shatterAll: (forceMult?: number) => void;
    assemble: () => void;
    destroy: () => void;
  } | null>(null);

  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false);

  const config = {
    text,
    imageSrc,
    subText,
    fontFamily,
    fontWeight,
    fontSize,
    letterSpacing,
    lineHeight,
    align,
    colors,
    accentColor,
    shardSize,
    irregularity,
    crack,
    crackRadius,
    heal,
    shatter,
    shatterRadius,
    force,
    spin,
    depth,
    gravity,
    reassemble,
    stiffness,
    glint,
    intro,
    introDuration,
    autoplay,
    autoplayInterval,
    interactive,
    paused,
    quality,
    reduced: reducedMotion,
  };

  const configRef = useRef(config);

  useEffect(() => {
    configRef.current = config;
    instanceRef.current?.sync();
  });

  useEffect(() => {
    if (imageSrc) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageSrc;
      img.onload = () => {
        imageObjRef.current = img;
        instanceRef.current?.sync();
        instanceRef.current?.assemble();
      };
      if (img.complete && img.naturalWidth > 0) {
        imageObjRef.current = img;
      }
    } else {
      imageObjRef.current = null;
    }
  }, [imageSrc]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const doc = container.ownerDocument;
    const canvas = doc.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText =
      'position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none';
    container.insertBefore(canvas, container.firstChild);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        premultipliedAlpha: true,
        antialias: true,
      });
    } catch {
      canvas.remove();
      return;
    }

    renderer.setClearColor(0x000000, 0);

    const win = doc.defaultView ?? window;
    const finePointer = win.matchMedia('(pointer: fine)');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(24, 1, 1, 10000);

    const textCanvas = doc.createElement('canvas');
    const maskTexture = new THREE.CanvasTexture(textCanvas);
    maskTexture.minFilter = THREE.LinearFilter;
    maskTexture.magFilter = THREE.LinearFilter;
    maskTexture.generateMipmaps = false;

    let stateArray = new Float32Array(4);
    let stateTexture = new THREE.DataTexture(
      stateArray,
      1,
      1,
      THREE.RGBAFormat,
      THREE.FloatType
    );

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      depthTest: true,
      depthWrite: true,
      uniforms: {
        uState: { value: stateTexture },
        uStateSize: { value: new THREE.Vector2(1, 1) },
        uMask: { value: maskTexture },
        uColorA: { value: new THREE.Color(1, 1, 1) },
        uColorB: { value: new THREE.Color(1, 1, 1) },
        uAccent: { value: new THREE.Color(0.48, 0.36, 1) },
        uBounds: { value: new THREE.Vector2(0, 1) },
        uGlint: { value: 0.8 },
      },
    });

    let geometry = new THREE.BufferGeometry();
    const mesh = new THREE.Mesh(geometry, material);
    mesh.frustumCulled = false;
    scene.add(mesh);

    let animFrameId = 0;
    let autoplayTimer = 0;
    let lastFrameTime = 0;
    let isDestroyed = false;
    let isIntersecting = true;
    let hasStartedIntro = false;
    let canvasWidth = 0;
    let canvasHeight = 0;
    let headlineFontSize = 64;
    let shardCount = 0;
    let layoutKey = '';
    let colorsKey = '';
    let nextAutoplayTime = Infinity;
    let introEndTime = 0;
    let prng = createPrng(5369127);

    // Physics state arrays
    let shardCenterX = new Float32Array(0);
    let shardCenterY = new Float32Array(0);
    let posX = new Float32Array(0);
    let posY = new Float32Array(0);
    let posZ = new Float32Array(0);
    let velX = new Float32Array(0);
    let velY = new Float32Array(0);
    let velZ = new Float32Array(0);
    let rotX = new Float32Array(0);
    let rotY = new Float32Array(0);
    let rotZ = new Float32Array(0);
    let angVelX = new Float32Array(0);
    let angVelY = new Float32Array(0);
    let angVelZ = new Float32Array(0);
    let shardScale = new Float32Array(0);
    let scaleVel = new Float32Array(0);
    let crackAmount = new Float32Array(0);
    let glintFlash = new Float32Array(0);
    let shardAlpha = new Float32Array(0);
    let randCos = new Float32Array(0);
    let randSin = new Float32Array(0);
    let introStartTime = new Float64Array(0);
    let shatterDelay = new Float64Array(0);
    let shardState = new Uint8Array(0);
    let animMode = new Uint8Array(0);

    const pointerState = {
      x: 0,
      y: 0,
      inside: false,
      at: 0,
      speed: 0,
    };

    const touchState = {
      x: 0,
      y: 0,
      at: 0,
      live: false,
    };

    const updateColors = () => {
      const cfg = configRef.current;
      let cachedTextColor = '';
      const resolveColor = (raw: string | undefined) => {
        const trimmed = (raw ?? '').trim();
        if (trimmed && trimmed.toLowerCase() !== 'currentcolor') return trimmed;
        if (!cachedTextColor) {
          cachedTextColor = win.getComputedStyle(container).color;
        }
        return cachedTextColor;
      };

      const colorList = Array.isArray(cfg.colors) ? cfg.colors : [];
      const colA = resolveColor(colorList[0]);
      const colB = resolveColor(colorList[1] ?? colorList[0]);
      const accent = resolveColor(cfg.accentColor);
      const signature = `${colA}|${colB}|${accent}`;

      if (signature === colorsKey) return;
      colorsKey = signature;

      const applyColor = (uniformName: 'uColorA' | 'uColorB' | 'uAccent', val: string, fallback: { r: number; g: number; b: number }) => {
        const rgb = (() => {
          if (typeof document === 'undefined' || !val) return fallback;
          if (typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && !CSS.supports('color', val)) {
            return fallback;
          }
          if (!sharedColorCtx) {
            sharedColorCanvas = document.createElement('canvas');
            sharedColorCanvas.width = 1;
            sharedColorCanvas.height = 1;
            sharedColorCtx = sharedColorCanvas.getContext('2d', { willReadFrequently: true });
          }
          if (!sharedColorCtx) return fallback;
          sharedColorCtx.clearRect(0, 0, 1, 1);
          sharedColorCtx.fillStyle = '#000';
          sharedColorCtx.fillStyle = val;
          sharedColorCtx.fillRect(0, 0, 1, 1);
          const data = sharedColorCtx.getImageData(0, 0, 1, 1).data;
          return { r: data[0], g: data[1], b: data[2] };
        })();

        material.uniforms[uniformName].value.setRGB(rgb.r / 255, rgb.g / 255, rgb.b / 255);
      };

      applyColor('uColorA', colA, { r: 245, g: 245, b: 245 });
      applyColor('uColorB', colB, { r: 245, g: 245, b: 245 });
      applyColor('uAccent', accent, { r: 123, g: 92, b: 255 });
    };

    const setupEntranceShard = (
      shardIdx: number,
      mode: string,
      now: number,
      durationMultiplier: number
    ) => {
      const introDuration = clamp(finite(configRef.current.introDuration, 1.4), 0.2, 6);
      const xRatio = canvasWidth > 0 ? (shardCenterX[shardIdx] + canvasWidth / 2) / canvasWidth : 0.5;

      shardState[shardIdx] = 2; // waiting
      // Cohesive wave stagger so all letters (especially N) assemble simultaneously without missing pieces
      introStartTime[shardIdx] =
        now + (0.06 * xRatio + 0.03 * prng()) * introDuration * durationMultiplier;
      velX[shardIdx] = 0;
      velY[shardIdx] = 0;
      velZ[shardIdx] = 0;
      angVelX[shardIdx] = 0;
      angVelY[shardIdx] = 0;
      angVelZ[shardIdx] = 0;
      animMode[shardIdx] = mode === 'drop' ? 3 : 2;

      if (mode === 'drop') {
        posX[shardIdx] = (prng() - 0.5) * headlineFontSize * 0.3;
        posY[shardIdx] = canvasHeight * (0.45 + 0.35 * prng()) + headlineFontSize;
        posZ[shardIdx] = prng() * headlineFontSize * 0.5;
        rotX[shardIdx] = (prng() - 0.5) * 1.0;
        rotY[shardIdx] = (prng() - 0.5) * 1.0;
        rotZ[shardIdx] = (prng() - 0.5) * 1.2;
        shardAlpha[shardIdx] = 1;
        return;
      }

      if (mode === 'fade') {
        posX[shardIdx] = 0;
        posY[shardIdx] = 0;
        posZ[shardIdx] = headlineFontSize * (0.3 + 0.5 * prng());
        rotX[shardIdx] = (prng() - 0.5) * 0.3;
        rotY[shardIdx] = (prng() - 0.5) * 0.3;
        rotZ[shardIdx] = (prng() - 0.5) * 0.2;
        shardAlpha[shardIdx] = 0.3;
        return;
      }

      // 'assemble' mode: condensation of shards from nearby space
      const angle = prng() * Math.PI * 2;
      const dist = (0.08 + 0.35 * prng()) * headlineFontSize * 0.5;
      posX[shardIdx] = Math.cos(angle) * dist;
      posY[shardIdx] = Math.sin(angle) * dist * 0.5;
      posZ[shardIdx] = headlineFontSize * (0.2 + 0.6 * prng());
      rotX[shardIdx] = (prng() - 0.5) * 0.8;
      rotY[shardIdx] = (prng() - 0.5) * 0.8;
      rotZ[shardIdx] = (prng() - 0.5) * 0.6;
      shardAlpha[shardIdx] = 0.35; // Visible outline from start so no letter appears hollow or disintegrating
    };

    const triggerIntro = (now: number) => {
      const cfg = configRef.current;
      const introMode = cfg.reduced ? 'none' : cfg.intro;

      for (let i = 0; i < shardCount; i++) {
        if (introMode === 'none') {
          shardState[i] = 0;
          posX[i] = 0;
          posY[i] = 0;
          posZ[i] = 0;
          rotX[i] = 0;
          rotY[i] = 0;
          rotZ[i] = 0;
          shardAlpha[i] = 1;
          animMode[i] = 0;
        } else {
          setupEntranceShard(i, introMode, now, 1);
        }
      }

      const duration = clamp(finite(cfg.introDuration, 1.6), 0.2, 6);
      introEndTime = introMode === 'none' ? now : now + 1.1 * duration;
      nextAutoplayTime = now + (introMode === 'none' ? 1.2 : duration + 1.4);
    };

    const rebuildLayout = () => {
      const cfg = configRef.current;
      const rect = container.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width));
      const h = Math.max(1, Math.round(rect.height));
      const dpr =
        Math.min(win.devicePixelRatio || 1, 2) *
        clamp(finite(cfg.quality, 1), 0.5, 1);
      let font =
        (cfg.fontFamily ?? '').trim() ||
        win.getComputedStyle(container).fontFamily ||
        'sans-serif';

      if (font.includes('var(')) {
        font = font.replace(/var\((--[^,\s)]+)[^)]*\)/g, (_, varName) => {
          const val = win.getComputedStyle(container).getPropertyValue(varName).trim();
          return val ? val.replace(/["\\]/g, '') : 'sans-serif';
        });
      }
      font = font.replace(/["\\]/g, '').trim();

      const key = [
        w,
        h,
        dpr,
        cfg.text,
        cfg.imageSrc,
        cfg.subText,
        Boolean(imageObjRef.current),
        font,
        cfg.fontWeight,
        cfg.fontSize,
        cfg.letterSpacing,
        cfg.lineHeight,
        cfg.align,
        cfg.shardSize,
        cfg.irregularity,
      ].join('|');

      if (key === layoutKey) return false;
      layoutKey = key;
      canvasWidth = w;
      canvasHeight = h;

      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.position.set(0, 0, h / 2 / Math.tan((24 * Math.PI) / 360));
      camera.near = 1;
      camera.far = 4 * camera.position.z;
      camera.updateProjectionMatrix();

      const lines = String(cfg.text ?? '').split('\n');
      const weight = clamp(Math.round(finite(Number(cfg.fontWeight), 700)), 100, 900);
      const tracking = finite(cfg.letterSpacing, -0.02);
      const leading = clamp(finite(cfg.lineHeight, 1.05), 0.6, 3);

      textCanvas.width = Math.max(1, Math.ceil(w * dpr));
      textCanvas.height = Math.max(1, Math.ceil(h * dpr));

      const ctx = textCanvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return false;

      const hasLetterSpacing = 'letterSpacing' in ctx;
      const fontSpec = (sizePx: number) => `${weight} ${sizePx}px ${font}`;

      const measureMaxLineWidth = (sizePx: number) => {
        ctx.font = fontSpec(sizePx);
        if (hasLetterSpacing) {
          (ctx as unknown as { letterSpacing: string }).letterSpacing = `${tracking * sizePx}px`;
        }
        let maxWidth = 0;
        for (const line of lines) {
          maxWidth = Math.max(maxWidth, ctx.measureText(line).width);
        }
        return maxWidth;
      };

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, textCanvas.width, textCanvas.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      let minTextX = Infinity;
      let maxTextX = -Infinity;

      if (imageObjRef.current) {
        const img = imageObjRef.current;
        const imgAspect = (img.naturalWidth || 584) / (img.naturalHeight || 97);
        const sub = (cfg.subText ?? '').trim();

        // Large prominent logo sizing: up to 88% width or 920px max
        const maxLogoW = Math.min(w * 0.88, 920);
        let drawLogoW = maxLogoW;
        let drawLogoH = drawLogoW / imgAspect;

        const maxAllowedH = sub ? h * 0.44 : h * 0.6;
        if (drawLogoH > maxAllowedH) {
          drawLogoH = maxAllowedH;
          drawLogoW = drawLogoH * imgAspect;
        }

        const subFontSize = Math.max(14, Math.round(drawLogoH * 0.28));
        const gap = Math.round(drawLogoH * 0.32);
        const totalBlockH = sub ? drawLogoH + gap + subFontSize : drawLogoH;

        const startY = (h - totalBlockH) / 2;
        const logoX = (w - drawLogoW) / 2;
        const logoY = startY;

        ctx.drawImage(img, logoX, logoY, drawLogoW, drawLogoH);
        minTextX = logoX;
        maxTextX = logoX + drawLogoW;

        if (sub) {
          ctx.font = `300 ${subFontSize}px 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif`;
          const subTracking = 0.55;
          if (hasLetterSpacing) {
            (ctx as unknown as { letterSpacing: string }).letterSpacing = `${subTracking * subFontSize}px`;
          }
          ctx.fillStyle = '#ffffff';
          ctx.textBaseline = 'middle';
          const subMetrics = ctx.measureText(sub);
          const subWidth = subMetrics.width;
          const subX = (w - subWidth) / 2;
          const subY = logoY + drawLogoH + gap + subFontSize / 2;
          ctx.fillText(sub, subX, subY);

          minTextX = Math.min(minTextX, subX);
          maxTextX = Math.max(maxTextX, subX + subWidth);
        }

        headlineFontSize = drawLogoH;
      } else {
        let computedFontSize = finite(cfg.fontSize, 0);
        if (!(computedFontSize > 0)) {
          const heightMultiplier = lines.length === 1 ? 0.72 : 0.46;
          computedFontSize = Math.min(heightMultiplier * h, 420);
          for (
            let iter = 0;
            iter < 60 &&
            (measureMaxLineWidth(computedFontSize) > 0.88 * w ||
              lines.length * computedFontSize * leading > 0.84 * h);
            iter++
          ) {
            computedFontSize *= 0.95;
          }
        }

        headlineFontSize = computedFontSize = Math.max(6, computedFontSize);

        ctx.font = fontSpec(computedFontSize);
        if (hasLetterSpacing) {
          (ctx as unknown as { letterSpacing: string }).letterSpacing = `${tracking * computedFontSize}px`;
        }
        ctx.fillStyle = '#ffffff';
        ctx.textBaseline = 'alphabetic';

        const sampleMetrics = ctx.measureText(lines.find((l) => l.trim()) ?? 'M');
        const ascent = sampleMetrics.actualBoundingBoxAscent || 0.72 * computedFontSize;
        const descent = sampleMetrics.actualBoundingBoxDescent || 0.2 * computedFontSize;
        let textCursorY =
          (h - ((lines.length - 1) * computedFontSize * leading + ascent + descent)) / 2 + ascent;

        for (const line of lines) {
          const lineWidth = ctx.measureText(line).width;
          const lineX =
            cfg.align === 'left'
              ? 0.07 * w
              : cfg.align === 'right'
              ? 0.93 * w - lineWidth
              : (w - lineWidth) / 2;

          ctx.fillText(line, lineX, textCursorY);
          if (line.trim()) {
            minTextX = Math.min(minTextX, lineX);
            maxTextX = Math.max(maxTextX, lineX + lineWidth);
          }
          textCursorY += computedFontSize * leading;
        }
      }

      if (!Number.isFinite(minTextX)) {
        minTextX = 0;
        maxTextX = w;
      }

      maskTexture.dispose();
      maskTexture.needsUpdate = true;
      material.uniforms.uBounds.value.set(minTextX - w / 2, maxTextX - w / 2);

      const imgData = ctx.getImageData(0, 0, textCanvas.width, textCanvas.height).data;
      const textCanvasW = textCanvas.width;

      const triangleIntersectsText = (
        ax: number,
        ay: number,
        bx: number,
        by: number,
        cx: number,
        cy: number
      ) => {
        const minX = Math.floor(Math.min(ax, bx, cx) * dpr);
        const maxX = Math.ceil(Math.max(ax, bx, cx) * dpr);
        const minY = Math.floor(Math.min(ay, by, cy) * dpr);
        const maxY = Math.ceil(Math.max(ay, by, cy) * dpr);
        const cross = (bx - ax) * (cy - ay) - (cx - ax) * (by - ay);
        if (Math.abs(cross) < 1e-6) return false;

        const sign = cross > 0 ? 1 : -1;
        const pad = 2.2 / dpr;

        for (let py = Math.max(0, minY); py <= Math.min(textCanvas.height - 1, maxY); py++) {
          const sy = (py + 0.5) / dpr;
          for (let px = Math.max(0, minX); px <= Math.min(textCanvasW - 1, maxX); px++) {
            if (imgData[(py * textCanvasW + px) * 4 + 3] <= 2) continue;
            const sx = (px + 0.5) / dpr;
            const w0 = ((bx - ax) * (sy - ay) - (by - ay) * (sx - ax)) * sign;
            const w1 = ((cx - bx) * (sy - by) - (cy - by) * (sx - bx)) * sign;
            const w2 = ((ax - cx) * (sy - cy) - (ay - cy) * (sx - cx)) * sign;
            const d0 = Math.hypot(bx - ax, by - ay);
            const d1 = Math.hypot(cx - bx, cy - by);
            const d2 = Math.hypot(ax - cx, ay - cy);
            if (w0 >= -pad * d0 && w1 >= -pad * d1 && w2 >= -pad * d2) return true;
          }
        }
        return false;
      };

      prng = createPrng(5369127);
      const baseShardPx = Math.max(
        5,
        clamp(finite(cfg.shardSize, 0.09), 0.03, 0.4) * headlineFontSize
      );
      const irregularityVal = clamp(finite(cfg.irregularity, 0.6), 0, 1);
      const halfShard = baseShardPx / 2;
      const gridCols = Math.ceil(w / halfShard) + 1;
      const gridRows = Math.ceil(h / halfShard) + 1;
      const gridOccupancy = new Uint8Array(gridCols * gridRows);

      const activeMinPx = Math.max(0, Math.floor((minTextX - 0.25 * headlineFontSize) * dpr));
      const activeMaxPx = Math.min(
        textCanvasW - 1,
        Math.ceil((maxTextX + 0.25 * headlineFontSize) * dpr)
      );

      for (let py = 0; py < textCanvas.height; py++) {
        const rowOffset = py * textCanvasW;
        const gridRowOffset = Math.floor(py / dpr / halfShard) * gridCols;
        for (let px = activeMinPx; px <= activeMaxPx; px++) {
          if (imgData[(rowOffset + px) * 4 + 3] > 2) {
            gridOccupancy[gridRowOffset + Math.floor(px / dpr / halfShard)] = 1;
          }
        }
      }

      const isNearText = (px: number, py: number) => {
        const col = Math.floor(px / halfShard);
        const row = Math.floor(py / halfShard);
        for (let dy = -4; dy <= 4; dy++) {
          const r = row + dy;
          if (r < 0 || r >= gridRows) continue;
          for (let dx = -4; dx <= 4; dx++) {
            const c = col + dx;
            if (c >= 0 && c < gridCols && gridOccupancy[r * gridCols + c]) return true;
          }
        }
        return false;
      };

      const pointCoordsX = new Float64Array(3800);
      const pointCoordsY = new Float64Array(3800);
      let pointCount = 0;
      const rowStep = 0.866 * baseShardPx;
      let rowIdx = 0;

      for (
        let py = -baseShardPx;
        py <= h + baseShardPx && pointCount < 3800;
        py += rowStep, rowIdx++
      ) {
        for (
          let px = -baseShardPx + (rowIdx % 2 ? baseShardPx / 2 : 0);
          px <= w + baseShardPx && pointCount < 3800;
          px += baseShardPx
        ) {
          const jitterX = px + (prng() - 0.5) * baseShardPx * 0.75 * irregularityVal;
          const jitterY = py + (prng() - 0.5) * baseShardPx * 0.75 * irregularityVal;
          if (!isNearText(jitterX, jitterY)) continue;

          const gCol = Math.floor(jitterX / halfShard);
          const gRow = Math.floor(jitterY / halfShard);
          const isDirectlyOnText =
            gCol >= 0 && gCol < gridCols && gRow >= 0 && gRow < gridRows && gridOccupancy[gRow * gridCols + gCol];
          if (!isDirectlyOnText && prng() < 0.2 * irregularityVal) continue;

          pointCoordsX[pointCount] = jitterX;
          pointCoordsY[pointCount] = jitterY;
          pointCount += 1;
        }
      }

      // Delaunay triangulation (Bowyer-Watson in pure JS)
      const triangulate = (coordsX: Float64Array, coordsY: Float64Array, nPts: number) => {
        const sortedIndices = Array.from({ length: nPts }, (_, i) => i).sort(
          (a, b) => coordsX[a] - coordsX[b]
        );
        let minX = Infinity,
          minY = Infinity,
          maxX = -Infinity,
          maxY = -Infinity;
        for (let i = 0; i < nPts; i++) {
          minX = Math.min(minX, coordsX[i]);
          minY = Math.min(minY, coordsY[i]);
          maxX = Math.max(maxX, coordsX[i]);
          maxY = Math.max(maxY, coordsY[i]);
        }
        const span = 20 * Math.max(maxX - minX, maxY - minY, 1);
        const midX = (minX + maxX) / 2;
        const midY = (minY + maxY) / 2;

        const superX = new Float64Array(nPts + 3);
        const superY = new Float64Array(nPts + 3);
        superX.set(coordsX.subarray(0, nPts));
        superY.set(coordsY.subarray(0, nPts));
        superX[nPts] = midX - span;
        superY[nPts] = midY - span;
        superX[nPts + 1] = midX;
        superY[nPts + 1] = midY + span;
        superX[nPts + 2] = midX + span;
        superY[nPts + 2] = midY - span;

        const circumcircle = (a: number, b: number, c: number) => {
          const ax = superX[a],
            ay = superY[a];
          const bx = superX[b],
            by = superY[b];
          const cx = superX[c],
            cy = superY[c];
          const D = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by));
          if (Math.abs(D) < 1e-12) {
            return { a, b, c, x: (ax + bx + cx) / 3, y: (ay + by + cy) / 3, r: Infinity };
          }
          const aa = ax * ax + ay * ay;
          const bb = bx * bx + by * by;
          const cc = cx * cx + cy * cy;
          const ox = (aa * (by - cy) + bb * (cy - ay) + cc * (ay - by)) / D;
          const oy = (aa * (cx - bx) + bb * (ax - cx) + cc * (bx - ax)) / D;
          return { a, b, c, x: ox, y: oy, r: (ax - ox) * (ax - ox) + (ay - oy) * (ay - oy) };
        };

        let openList = [circumcircle(nPts, nPts + 1, nPts + 2)];
        const closedList: ReturnType<typeof circumcircle>[] = [];
        const edges: number[] = [];

        for (const ptIdx of sortedIndices) {
          const px = superX[ptIdx];
          const py = superY[ptIdx];
          edges.length = 0;
          const nextOpen: ReturnType<typeof circumcircle>[] = [];

          for (const tri of openList) {
            const dx = px - tri.x;
            if (dx > 0 && dx * dx > tri.r) {
              closedList.push(tri);
              continue;
            }
            const dy = py - tri.y;
            if (dx * dx + dy * dy <= tri.r) {
              edges.push(tri.a, tri.b, tri.b, tri.c, tri.c, tri.a);
            } else {
              nextOpen.push(tri);
            }
          }

          for (let eIdx = 0; eIdx < edges.length; eIdx += 2) {
            const ea = edges[eIdx];
            const eb = edges[eIdx + 1];
            if (ea < 0) continue;
            let dup = false;
            for (let jIdx = eIdx + 2; jIdx < edges.length; jIdx += 2) {
              if (
                (edges[jIdx] === ea && edges[jIdx + 1] === eb) ||
                (edges[jIdx] === eb && edges[jIdx + 1] === ea)
              ) {
                edges[jIdx] = -1;
                edges[jIdx + 1] = -1;
                dup = true;
              }
            }
            if (!dup) nextOpen.push(circumcircle(ea, eb, ptIdx));
          }
          openList = nextOpen;
        }

        const resultTriangles: number[] = [];
        for (const tri of closedList.concat(openList)) {
          if (tri.a < nPts && tri.b < nPts && tri.c < nPts) {
            resultTriangles.push(tri.a, tri.b, tri.c);
          }
        }
        return resultTriangles;
      };

      const rawTriangles = pointCount >= 3 ? triangulate(pointCoordsX, pointCoordsY, pointCount) : [];
      const validTriangles: number[] = [];

      for (let i = 0; i < rawTriangles.length; i += 3) {
        const ia = rawTriangles[i];
        const ib = rawTriangles[i + 1];
        const ic = rawTriangles[i + 2];
        if (
          triangleIntersectsText(
            pointCoordsX[ia],
            pointCoordsY[ia],
            pointCoordsX[ib],
            pointCoordsY[ib],
            pointCoordsX[ic],
            pointCoordsY[ic]
          )
        ) {
          validTriangles.push(ia, ib, ic);
        }
      }

      shardCount = validTriangles.length / 3;
      const count = shardCount;

      shardCenterX = new Float32Array(count);
      shardCenterY = new Float32Array(count);
      posX = new Float32Array(count);
      posY = new Float32Array(count);
      posZ = new Float32Array(count);
      velX = new Float32Array(count);
      velY = new Float32Array(count);
      velZ = new Float32Array(count);
      rotX = new Float32Array(count);
      rotY = new Float32Array(count);
      rotZ = new Float32Array(count);
      angVelX = new Float32Array(count);
      angVelY = new Float32Array(count);
      angVelZ = new Float32Array(count);
      shardScale = new Float32Array(count).fill(1);
      scaleVel = new Float32Array(count);
      crackAmount = new Float32Array(count);
      glintFlash = new Float32Array(count);
      shardAlpha = new Float32Array(count).fill(1);
      randCos = new Float32Array(count);
      randSin = new Float32Array(count);
      introStartTime = new Float64Array(count);
      shatterDelay = new Float64Array(count);
      shardState = new Uint8Array(count);
      animMode = new Uint8Array(count);

      const stateRows = Math.max(1, Math.ceil(count / 256));
      stateArray = new Float32Array(768 * stateRows * 4);
      stateTexture.dispose();
      stateTexture = new THREE.DataTexture(
        stateArray,
        768,
        stateRows,
        THREE.RGBAFormat,
        THREE.FloatType
      );
      stateTexture.minFilter = THREE.NearestFilter;
      stateTexture.magFilter = THREE.NearestFilter;
      stateTexture.needsUpdate = true;
      material.uniforms.uState.value = stateTexture;
      material.uniforms.uStateSize.value.set(768, stateRows);

      const geomPositions = new Float32Array(9 * count);
      const geomCenters = new Float32Array(9 * count);
      const geomUvs = new Float32Array(6 * count);
      const geomBary = new Float32Array(9 * count);
      const geomShards = new Float32Array(3 * count);

      for (let sIdx = 0; sIdx < count; sIdx++) {
        let t0 = validTriangles[3 * sIdx];
        let t1 = validTriangles[3 * sIdx + 1];
        let t2 = validTriangles[3 * sIdx + 2];

        // Ensure CCW vertex winding
        if (
          (pointCoordsX[t1] - pointCoordsX[t0]) * (pointCoordsY[t0] - pointCoordsY[t2]) -
            (pointCoordsX[t2] - pointCoordsX[t0]) * (pointCoordsY[t0] - pointCoordsY[t1]) <
          0
        ) {
          const swap = t0;
          t0 = t1;
          t1 = swap;
        }

        const midX = (pointCoordsX[t0] + pointCoordsX[t1] + pointCoordsX[t2]) / 3;
        const midY = (pointCoordsY[t0] + pointCoordsY[t1] + pointCoordsY[t2]) / 3;

        shardCenterX[sIdx] = midX - w / 2;
        shardCenterY[sIdx] = h / 2 - midY;

        const randAngle = prng() * Math.PI * 2;
        randCos[sIdx] = Math.cos(randAngle);
        randSin[sIdx] = Math.sin(randAngle);

        [t0, t1, t2].forEach((vertIdx, vSub) => {
          const pBase = 9 * sIdx + 3 * vSub;
          geomPositions[pBase] = pointCoordsX[vertIdx] - midX;
          geomPositions[pBase + 1] = midY - pointCoordsY[vertIdx];
          geomPositions[pBase + 2] = 0;

          geomCenters[pBase] = shardCenterX[sIdx];
          geomCenters[pBase + 1] = shardCenterY[sIdx];
          geomCenters[pBase + 2] = 0;

          geomBary[pBase + vSub] = 1;

          geomUvs[6 * sIdx + 2 * vSub] = pointCoordsX[vertIdx] / w;
          geomUvs[6 * sIdx + 2 * vSub + 1] = 1 - pointCoordsY[vertIdx] / h;

          geomShards[3 * sIdx + vSub] = sIdx;
        });
      }

      const nextGeom = new THREE.BufferGeometry();
      nextGeom.setAttribute('position', new THREE.BufferAttribute(geomPositions, 3));
      nextGeom.setAttribute('center', new THREE.BufferAttribute(geomCenters, 3));
      nextGeom.setAttribute('uv', new THREE.BufferAttribute(geomUvs, 2));
      nextGeom.setAttribute('bary', new THREE.BufferAttribute(geomBary, 3));
      nextGeom.setAttribute('shard', new THREE.BufferAttribute(geomShards, 1));

      geometry.dispose();
      mesh.geometry = geometry = nextGeom;

      if (hasStartedIntro) {
        if (performance.now() / 1000 < introEndTime) {
          triggerIntro(performance.now() / 1000);
        } else {
          for (let i = 0; i < count; i++) {
            shardState[i] = 0;
            animMode[i] = 0;
            shardAlpha[i] = 1;
          }
        }
      } else {
        for (let i = 0; i < count; i++) {
          shardAlpha[i] = 0;
          shardState[i] = 2;
          introStartTime[i] = Infinity;
        }
      }

      return true;
    };

    const triggerShatter = (clickX: number, clickY: number, now: number, forceMult = 1) => {
      const cfg = configRef.current;
      if (!shardCount || cfg.reduced) return;

      const targetX = clickX - canvasWidth / 2;
      const targetY = canvasHeight / 2 - clickY;
      const radiusPx = clamp(finite(cfg.shatterRadius, 0.55), 0.1, 6) * headlineFontSize;
      const userForce = clamp(finite(cfg.force, 1), 0, 4) * forceMult;
      const userSpin = clamp(finite(cfg.spin, 1), 0, 4);
      const userDepth = clamp(finite(cfg.depth, 1), 0, 4);
      const userReassemble = clamp(finite(cfg.reassemble, 1.1), 0.1, 10);
      let hitAny = false;

      for (let i = 0; i < shardCount; i++) {
        const dx = shardCenterX[i] - targetX;
        const dy = shardCenterY[i] - targetY;
        const dist = Math.hypot(dx, dy);

        if (dist > 1.6 * radiusPx) continue;

        const intensity = 1 - smoothstep(0.6 * radiusPx, 1.3 * radiusPx, dist);
        if (intensity < 0.3 || shardState[i] === 2 || shardState[i] === 1) {
          crackAmount[i] = Math.max(
            crackAmount[i],
            0.7 * (1 - smoothstep(radiusPx, 1.6 * radiusPx, dist))
          );
          continue;
        }

        hitAny = true;
        const normX = dist > 0.001 ? dx / dist : prng() - 0.5;
        const normY = dist > 0.001 ? dy / dist : prng() - 0.5;
        const scaleFactor = Math.sqrt(headlineFontSize / 160);
        const impulse = userForce * (170 + 380 * prng()) * intensity * scaleFactor;

        shardState[i] = 1; // shattered
        animMode[i] = 1;
        shatterDelay[i] = now + 0.04 + (dist / radiusPx) * 0.09;
        introStartTime[i] =
          shatterDelay[i] + userReassemble * (0.85 + 0.3 * prng()) + (dist / radiusPx) * 0.16;

        velX[i] = normX * impulse + (prng() - 0.5) * 70 * userForce * scaleFactor;
        velY[i] = normY * impulse + (prng() - 0.5) * 70 * userForce * scaleFactor;
        velZ[i] = userDepth * (320 + 760 * prng()) * intensity * scaleFactor;
        angVelX[i] = (prng() - 0.5) * 2 * userSpin * (3 + 6 * prng()) * intensity;
        angVelY[i] = (prng() - 0.5) * 2 * userSpin * (3 + 6 * prng()) * intensity;
        angVelZ[i] = (prng() - 0.5) * 2 * userSpin * (1.5 + 3.5 * prng()) * intensity;
        crackAmount[i] = 0.55;
      }

      if (hitAny) requestRender();
    };

    const triggerShatterAll = (now: number, forceMult = 1.4) => {
      const cfg = configRef.current;
      if (!shardCount || cfg.reduced) return;

      const userForce = clamp(finite(cfg.force, 1), 0, 4) * forceMult;
      const userSpin = clamp(finite(cfg.spin, 1), 0, 4);
      const userDepth = clamp(finite(cfg.depth, 1), 0, 4);
      const scaleFactor = Math.sqrt(headlineFontSize / 160);

      for (let i = 0; i < shardCount; i++) {
        const dx = shardCenterX[i];
        const dy = shardCenterY[i];
        const dist = Math.hypot(dx, dy) || 1;
        const normX = dx / dist;
        const normY = dy / dist;
        const impulse = userForce * (220 + 440 * prng()) * scaleFactor;

        shardState[i] = 1; // shattered
        animMode[i] = 1;
        shatterDelay[i] = now + (dist / (canvasWidth * 0.45)) * 0.05 + prng() * 0.04;
        introStartTime[i] = Infinity; // Fly away freely on exit without snapping back

        velX[i] = normX * impulse + (prng() - 0.5) * 120 * userForce * scaleFactor;
        velY[i] = normY * impulse + (prng() - 0.5) * 120 * userForce * scaleFactor;
        velZ[i] = userDepth * (420 + 850 * prng()) * scaleFactor;
        angVelX[i] = (prng() - 0.5) * 2 * userSpin * (3.5 + 7 * prng());
        angVelY[i] = (prng() - 0.5) * 2 * userSpin * (3.5 + 7 * prng());
        angVelZ[i] = (prng() - 0.5) * 2 * userSpin * (1.8 + 4.5 * prng());
        crackAmount[i] = 0.8;
      }

      requestRender();
    };

    const wrapAngle = (a: number) => a - 2 * Math.PI * Math.round(a / (2 * Math.PI));

    const stepPhysics = (stepDt: number, simTime: number) => {
      const cfg = configRef.current;
      const springStiffness = 5 + 9 * clamp(finite(cfg.stiffness, 0.55), 0, 1);
      const entranceStiffness =
        7.5 / Math.max(0.15, 0.55 * clamp(finite(cfg.introDuration, 1.6), 0.2, 6));
      const gravityAcc = 1500 * clamp(finite(cfg.gravity, 0), 0, 4);
      const velDrag = Math.exp(-2.6 * stepDt);
      const angDrag = Math.exp(-0.7 * stepDt);
      const healRate = 1 / Math.max(0.05, finite(cfg.heal, 0.9));
      const crackLevel = clamp(finite(cfg.crack, 0.6), 0, 1);
      const crackRadPx = clamp(finite(cfg.crackRadius, 0.5), 0.05, 4) * headlineFontSize;

      const cursorActivity =
        Math.exp(-Math.max(0, simTime - pointerState.at) / 0.08) *
        smoothstep(40, 900, pointerState.speed);
      const isCursorCracking =
        pointerState.inside &&
        cfg.interactive &&
        !cfg.reduced &&
        crackLevel > 0 &&
        cursorActivity > 0.01;

      const curX = pointerState.x - canvasWidth / 2;
      const curY = canvasHeight / 2 - pointerState.y;
      let activeMotion = 0;

      for (let i = 0; i < shardCount; i++) {
        if (shardState[i] === 2) {
          if (simTime < introStartTime[i]) continue;
          shardState[i] = 0;
        }

        if (shardState[i] === 1) {
          if (simTime >= introStartTime[i]) {
            shardState[i] = 0;
            rotX[i] = wrapAngle(rotX[i]);
            rotY[i] = wrapAngle(rotY[i]);
            rotZ[i] = wrapAngle(rotZ[i]);
            velX[i] *= 0.25;
            velY[i] *= 0.25;
            velZ[i] *= 0.25;
          } else if (simTime >= shatterDelay[i]) {
            velY[i] -= gravityAcc * stepDt;
            velX[i] *= velDrag;
            velY[i] *= velDrag;
            velZ[i] *= velDrag;
            angVelX[i] *= angDrag;
            angVelY[i] *= angDrag;
            angVelZ[i] *= angDrag;
            posX[i] += velX[i] * stepDt;
            posY[i] += velY[i] * stepDt;
            posZ[i] += velZ[i] * stepDt;
            rotX[i] += angVelX[i] * stepDt;
            rotY[i] += angVelY[i] * stepDt;
            rotZ[i] += angVelZ[i] * stepDt;
            activeMotion += 1;
            continue;
          } else {
            activeMotion += 1;
            continue;
          }
        }

        if (isCursorCracking) {
          const dist = Math.hypot(shardCenterX[i] - curX, shardCenterY[i] - curY);
          if (dist < crackRadPx) {
            const crackVal = crackLevel * cursorActivity * Math.pow(1 - dist / crackRadPx, 1.5);
            if (crackVal > crackAmount[i]) crackAmount[i] = crackVal;
          }
        }

        const stiff =
          animMode[i] === 2
            ? entranceStiffness
            : animMode[i] === 3
            ? 1.25 * entranceStiffness
            : animMode[i]
            ? springStiffness
            : 18;
        const damp =
          animMode[i] === 2 ? 1 : animMode[i] === 3 ? 0.5 : animMode[i] ? 0.68 : 0.9;
        const omegaSq = stiff * stiff;
        const twoZetaOmega = 2 * damp * stiff;
        const targetRotX = randSin[i] * crackAmount[i] * 0.14;
        const targetRotY = -randCos[i] * crackAmount[i] * 0.14;

        velX[i] += (-omegaSq * posX[i] - twoZetaOmega * velX[i]) * stepDt;
        velY[i] += (-omegaSq * posY[i] - twoZetaOmega * velY[i]) * stepDt;
        velZ[i] += (-omegaSq * posZ[i] - twoZetaOmega * velZ[i]) * stepDt;
        posX[i] += velX[i] * stepDt;
        posY[i] += velY[i] * stepDt;
        posZ[i] += velZ[i] * stepDt;

        angVelX[i] += (-omegaSq * (rotX[i] - targetRotX) - twoZetaOmega * angVelX[i]) * stepDt;
        angVelY[i] += (-omegaSq * (rotY[i] - targetRotY) - twoZetaOmega * angVelY[i]) * stepDt;
        angVelZ[i] += (-omegaSq * rotZ[i] - twoZetaOmega * angVelZ[i]) * stepDt;
        rotX[i] += angVelX[i] * stepDt;
        rotY[i] += angVelY[i] * stepDt;
        rotZ[i] += angVelZ[i] * stepDt;

        const targetScale = 1 - 0.025 * crackAmount[i];
        scaleVel[i] += (-324 * (shardScale[i] - targetScale) - 30 * scaleVel[i]) * stepDt;
        shardScale[i] += scaleVel[i] * stepDt;

        if (shardAlpha[i] < 1) {
          const alphaRate = Math.max(0.9, 2.2 / Math.max(0.5, finite(cfg.introDuration, 1.6)));
          shardAlpha[i] = Math.min(1, shardAlpha[i] + alphaRate * stepDt);
        }

        if (
          animMode[i] &&
          Math.abs(posX[i]) + Math.abs(posY[i]) + Math.abs(posZ[i]) < 1.5 &&
          Math.abs(rotX[i]) + Math.abs(rotY[i]) + Math.abs(rotZ[i]) < 0.06
        ) {
          animMode[i] = 0;
          glintFlash[i] = Math.max(glintFlash[i], 0.9);
        }

        crackAmount[i] *= Math.exp(-stepDt * healRate);
        if (crackAmount[i] < 0.015) crackAmount[i] = 0;
        glintFlash[i] *= Math.exp(-stepDt / 0.16);
        if (glintFlash[i] < 0.01) glintFlash[i] = 0;

        const settled =
          Math.abs(posX[i]) + Math.abs(posY[i]) + Math.abs(posZ[i]) < 0.3 &&
          Math.abs(velX[i]) + Math.abs(velY[i]) + Math.abs(velZ[i]) < 3 &&
          Math.abs(rotX[i] - targetRotX) + Math.abs(rotY[i] - targetRotY) + Math.abs(rotZ[i]) <
            0.004 &&
          Math.abs(angVelX[i]) + Math.abs(angVelY[i]) + Math.abs(angVelZ[i]) < 0.06 &&
          Math.abs(shardScale[i] - targetScale) < 0.0008 &&
          Math.abs(scaleVel[i]) < 0.02;

        if (settled) {
          posX[i] = 0;
          posY[i] = 0;
          posZ[i] = 0;
          velX[i] = 0;
          velY[i] = 0;
          velZ[i] = 0;
          rotX[i] = targetRotX;
          rotY[i] = targetRotY;
          rotZ[i] = 0;
          angVelX[i] = 0;
          angVelY[i] = 0;
          angVelZ[i] = 0;
          shardScale[i] = targetScale;
          scaleVel[i] = 0;
          if (animMode[i]) {
            animMode[i] = 0;
            glintFlash[i] = Math.max(glintFlash[i], 0.9);
          }
        }

        const metric = +!settled + crackAmount[i] + glintFlash[i] + (1 - shardAlpha[i]);
        if (metric > 0.004) activeMotion += metric;
      }

      return activeMotion;
    };

    const requestRender = () => {
      if (isDestroyed || !isIntersecting || animFrameId) return;
      animFrameId = win.requestAnimationFrame(renderFrame);
    };

    function renderFrame(timestamp: number) {
      animFrameId = 0;
      if (isDestroyed) return;

      const cfg = configRef.current;
      const frameDelta = lastFrameTime
        ? clamp((timestamp - lastFrameTime) / 1000, 0, 0.05)
        : 1 / 60;
      lastFrameTime = timestamp;
      const now = performance.now() / 1000;

      if (cfg.paused) {
        lastFrameTime = 0;
        return;
      }

      if (
        cfg.autoplay &&
        !cfg.reduced &&
        hasStartedIntro &&
        shardCount &&
        !pointerState.inside &&
        now >= nextAutoplayTime
      ) {
        nextAutoplayTime =
          now + clamp(finite(cfg.autoplayInterval, 4), 0.8, 30) * (0.85 + 0.3 * prng());
        const randomIdx = Math.floor(prng() * shardCount);
        triggerShatter(
          shardCenterX[randomIdx] + canvasWidth / 2,
          canvasHeight / 2 - shardCenterY[randomIdx],
          now,
          0.9
        );
      }

      let motionScore = 0;
      let remainingDt = frameDelta;
      let simTime = now - frameDelta;

      while (remainingDt > 1e-6) {
        const stepDt = Math.min(FIXED_DT, remainingDt);
        remainingDt -= stepDt;
        simTime += stepDt;
        motionScore = stepPhysics(stepDt, simTime);
      }

      material.uniforms.uGlint.value = clamp(finite(cfg.glint, 0.8), 0, 2);

      // Pack state buffer
      const crackMult = clamp(finite(cfg.crack, 0.6), 0, 1);
      const glintMult = clamp(finite(cfg.glint, 0.8), 0, 2);

      for (let i = 0; i < shardCount; i++) {
        const texelBase = (256 * Math.floor(i / 256) * 3 + (i % 256) * 3) * 4;

        stateArray[texelBase] = posX[i];
        stateArray[texelBase + 1] = posY[i];
        stateArray[texelBase + 2] = posZ[i];
        stateArray[texelBase + 3] = shardScale[i];

        // Quaternion from Euler (XYZ)
        const cx = Math.cos(rotX[i] / 2);
        const sx = Math.sin(rotX[i] / 2);
        const cy = Math.cos(rotY[i] / 2);
        const sy = Math.sin(rotY[i] / 2);
        const cz = Math.cos(rotZ[i] / 2);
        const sz = Math.sin(rotZ[i] / 2);

        stateArray[texelBase + 4] = sx * cy * cz + cx * sy * sz;
        stateArray[texelBase + 5] = cx * sy * cz - sx * cy * sz;
        stateArray[texelBase + 6] = cx * cy * sz + sx * sy * cz;
        stateArray[texelBase + 7] = cx * cy * cz - sx * sy * sz;

        stateArray[texelBase + 8] = crackAmount[i] * crackMult;
        stateArray[texelBase + 9] = glintFlash[i] * glintMult;
        stateArray[texelBase + 10] = shardAlpha[i];
        stateArray[texelBase + 11] = 0;
      }

      stateTexture.needsUpdate = true;
      renderer.render(scene, camera);

      let pendingEntrance = false;
      for (let i = 0; i < shardCount && !pendingEntrance; i++) {
        if (shardState[i] === 2 && introStartTime[i] !== Infinity) {
          pendingEntrance = true;
        }
      }

      if (
        motionScore > 0.004 ||
        pendingEntrance ||
        (pointerState.inside && now - pointerState.at < 0.2)
      ) {
        requestRender();
      } else {
        if (autoplayTimer) {
          win.clearTimeout(autoplayTimer);
          autoplayTimer = 0;
        }
        if (
          cfg.autoplay &&
          !cfg.reduced &&
          hasStartedIntro &&
          Number.isFinite(nextAutoplayTime)
        ) {
          autoplayTimer = win.setTimeout(() => {
            autoplayTimer = 0;
            requestRender();
          }, Math.max(16, (nextAutoplayTime - now) * 1000));
        }
      }
    }

    const updatePointerPos = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      pointerState.x = clientX - rect.left;
      pointerState.y = clientY - rect.top;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch' || !configRef.current.interactive || !finePointer.matches)
        return;
      const prevX = pointerState.x;
      const prevY = pointerState.y;
      const now = performance.now() / 1000;
      const dt = Math.max(0.008, now - pointerState.at);
      updatePointerPos(e.clientX, e.clientY);

      const speed = pointerState.inside ? Math.hypot(pointerState.x - prevX, pointerState.y - prevY) / dt : 0;
      pointerState.speed += (Math.min(speed, 4000) - pointerState.speed) * Math.min(1, dt / 0.05);
      pointerState.inside = true;
      pointerState.at = now;
      requestRender();
    };

    const onPointerLeave = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') {
        pointerState.inside = false;
        nextAutoplayTime = Math.max(nextAutoplayTime, performance.now() / 1000 + 1.5);
        requestRender();
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      const cfg = configRef.current;
      if (cfg.interactive && cfg.shatter) {
        if (e.pointerType === 'touch') {
          touchState.x = e.clientX;
          touchState.y = e.clientY;
          touchState.at = performance.now() / 1000;
          touchState.live = true;
          return;
        }
        if (e.button === 0) {
          updatePointerPos(e.clientX, e.clientY);
          triggerShatter(pointerState.x, pointerState.y, performance.now() / 1000);
        }
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (
        e.pointerType !== 'touch' ||
        !touchState.live ||
        Math.hypot(e.clientX - touchState.x, e.clientY - touchState.y) > 10 ||
        performance.now() / 1000 - touchState.at > 0.35
      ) {
        touchState.live = false;
        return;
      }
      touchState.live = false;
      const rect = container.getBoundingClientRect();
      triggerShatter(e.clientX - rect.left, e.clientY - rect.top, performance.now() / 1000);
    };

    const syncAll = () => {
      updateColors();
      rebuildLayout();
      requestRender();
    };

    const resizeObserver = new ResizeObserver(() => syncAll());
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        if (isIntersecting) {
          lastFrameTime = 0;
          syncAll();
          if (!hasStartedIntro) {
            hasStartedIntro = true;
            triggerIntro(performance.now() / 1000);
            requestRender();
          }
          requestRender();
        } else if (animFrameId) {
          win.cancelAnimationFrame(animFrameId);
          animFrameId = 0;
        }
      },
      { threshold: 0.15 }
    );
    intersectionObserver.observe(container);

    const onFontsLoaded = () => {
      layoutKey = '';
      syncAll();
    };

    (doc as unknown as { fonts?: { addEventListener?: (t: string, cb: () => void) => void; removeEventListener?: (t: string, cb: () => void) => void; ready?: Promise<void> } }).fonts?.addEventListener?.('loadingdone', onFontsLoaded);
    (doc as unknown as { fonts?: { ready?: Promise<void> } }).fonts?.ready?.then(() => {
      if (!isDestroyed) onFontsLoaded();
    });

    container.addEventListener('pointermove', onPointerMove, { passive: true });
    container.addEventListener('pointerleave', onPointerLeave);
    container.addEventListener('pointerdown', onPointerDown, { passive: true });
    win.addEventListener('pointerup', onPointerUp, { passive: true });

    updateColors();
    rebuildLayout();

    instanceRef.current = {
      sync: syncAll,
      shatter: (xCoord?: number, yCoord?: number) => {
        if (!shardCount) return;
        if (
          typeof xCoord === 'number' &&
          typeof yCoord === 'number' &&
          Number.isFinite(xCoord) &&
          Number.isFinite(yCoord)
        ) {
          triggerShatter(xCoord, yCoord, performance.now() / 1000);
          return;
        }
        const randIdx = Math.floor(prng() * shardCount);
        triggerShatter(
          shardCenterX[randIdx] + canvasWidth / 2,
          canvasHeight / 2 - shardCenterY[randIdx],
          performance.now() / 1000
        );
      },
      shatterAll: (forceMult?: number) => {
        triggerShatterAll(performance.now() / 1000, forceMult);
      },
      assemble: () => {
        hasStartedIntro = true;
        triggerIntro(performance.now() / 1000);
        requestRender();
      },
      destroy: () => {
        isDestroyed = true;
        if (animFrameId) win.cancelAnimationFrame(animFrameId);
        if (autoplayTimer) win.clearTimeout(autoplayTimer);
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        (doc as unknown as { fonts?: { removeEventListener?: (t: string, cb: () => void) => void } }).fonts?.removeEventListener?.('loadingdone', onFontsLoaded);
        container.removeEventListener('pointermove', onPointerMove);
        container.removeEventListener('pointerleave', onPointerLeave);
        container.removeEventListener('pointerdown', onPointerDown);
        win.removeEventListener('pointerup', onPointerUp);
        geometry.dispose();
        material.dispose();
        maskTexture.dispose();
        stateTexture.dispose();
        renderer.dispose();
        renderer.forceContextLoss();
        canvas.remove();
      },
    };

    return () => {
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      shatter: (x?: number, y?: number) => instanceRef.current?.shatter(x, y),
      shatterAll: (forceMult?: number) => instanceRef.current?.shatterAll(forceMult),
      assemble: () => instanceRef.current?.assemble(),
    }),
    []
  );

  return (
    <div
      ref={containerRef}
      className={cn('relative isolate h-full min-h-[240px] w-full overflow-hidden', className)}
      style={style}
    >
      <span
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          margin: -1,
          padding: 0,
          overflow: 'hidden',
          clip: 'rect(0 0 0 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        {text}
      </span>
      {children && <div className="relative z-10 h-full w-full">{children}</div>}
    </div>
  );
});

ShatterType.displayName = 'ShatterType';
export default ShatterType;

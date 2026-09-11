/**
 * constants.ts
 *
 * Every tuning value for the scroll system, in one place.
 *
 * Lambda values are for THREE.MathUtils.damp(x, y, lambda, dt), which is
 * frame-rate independent:  damp = lerp(x, y, 1 - e^(-lambda * dt))
 *
 * Conversion from the old frame-locked style:
 *     lambda = -Math.log(1 - lerpFactor) * 60
 *   so the familiar "lerp 0.1 at 60fps" is lambda 6.32 -> rounded to 6.5.
 *
 * INVARIANT: every  *_FACTOR * VELOCITY_CLAMP  must equal its paired MAX_*.
 * If you change one, change the other, or the clamp stops being reachable
 * (feels dead) or gets exceeded (feels broken).
 */

export const SCROLL = {
  /** Smoothing of scrollTop. 6.5 ~= the classic lerp 0.1 @ 60fps. */
  SCROLL_LAMBDA: 6.5,
  /** Smoothing of the velocity signal. Higher = more responsive, noisier. */
  VELOCITY_LAMBDA: 8.0,
  /** Velocity ceiling, in viewports per second, signed. */
  VELOCITY_CLAMP: 2.5,
  /** Extra height per section so the last frames have room to resolve. */
  SECTION_PADDING: 1.05,
  /** Relative innerHeight change that counts as a real resize, not a URL bar. */
  RESIZE_HEIGHT_THRESHOLD: 0.2,
  RESIZE_DEBOUNCE_MS: 200,
} as const;

export const CAMERA = {
  /** Camera position + lookAt damping. Softer than scroll on purpose. */
  CAMERA_LAMBDA: 4.0,
  /** Pointer damping. */
  POINTER_LAMBDA: 3.0,
  /** Max camera offset from pointer, world units. 0 on touch + reduced motion. */
  POINTER_AMPLITUDE: 0.35,
  /** Camera bank into the scroll direction, radians. */
  ROLL_FACTOR: 0.02,
  MAX_ROLL: 0.05,
} as const;

export const SPIRAL = {
  /** Revolutions the CAMERA makes across the whole projects section. */
  TURNS: 2.5,
  /** Camera orbit radius. Must exceed HELIX_RADIUS by a clear margin. */
  CAM_RADIUS: 9.0,
  /** Breathing modulation on the orbit radius. */
  RADIUS_MOD: 1.2,
  /** Total vertical travel of the camera, world units. */
  VERTICAL_TRAVEL: 46,
  /**
   * Vertical wobble amplitude.
   * MONOTONICITY CONSTRAINT:  WOBBLE * 0.5 * TURNS * 2PI  <  VERTICAL_TRAVEL
   *   1.0 * 0.5 * 2.5 * 6.283 = 7.85  <  46   -> safe.
   * Exceed it and the camera moves BACKWARDS on fast scroll.
   */
  VERTICAL_WOBBLE: 1.0,
  /** How far ahead on the curve the camera looks. */
  LOOK_AHEAD: 0.06,
  /** How far the lookAt target is pulled toward the central axis. 0 = on the
   *  curve (dizzying), 1 = dead centre (static). 0.75 keeps the helix framed. */
  LOOK_AXIS_BIAS: 0.75,
} as const;

export const HELIX = {
  /** Revolutions of the RICE STRANDS. Independent of camera TURNS. */
  HELIX_TURNS: 7,
  HELIX_RADIUS: 2.4,
  /** Taller than VERTICAL_TRAVEL so the spine runs past both ends of travel. */
  HELIX_SPAN: 52,
  /** Organic wobble on the strand radius. */
  RADIUS_NOISE: 0.28,

  /** Base grain flow along the strand, in normalised strand units per second. */
  GRAIN_FLOW_BASE: 0.12,
  /** Additional flow per unit of |velocity|. */
  GRAIN_FLOW_VELOCITY: 0.35,

  /** Base turbulence. */
  NOISE_BASE: 0.15,
  /** Additional turbulence per unit of |velocity|. */
  NOISE_VELOCITY: 0.45,

  /** Instance counts by tier. */
  COUNT_DESKTOP: 24000,
  COUNT_TABLET: 12000,
  COUNT_MOBILE: 6000,

  /** Grain size, world units. width x length before per-instance variance. */
  GRAIN_SIZE: [0.012, 0.042] as [number, number],
  GRAIN_SIZE_VARIANCE: 0.45,

  /** Fraction of grains bound to the strands vs. free-orbiting vs. drifting. */
  MIX_STRAND: 0.72,
  MIX_ORBIT: 0.2,
  MIX_DRIFT: 0.08,
} as const;

export const VELOCITY_FX = {
  /** Project plane lean.  TILT_FACTOR * VELOCITY_CLAMP === MAX_TILT_DEG */
  TILT_FACTOR: 1.6,
  MAX_TILT_DEG: 4.0,

  /** Shader UV displacement.  DISTORTION_FACTOR * VELOCITY_CLAMP === MAX_DISTORTION */
  DISTORTION_FACTOR: 0.024,
  MAX_DISTORTION: 0.06,

  /** Typography displacement, px.  TYPE_FACTOR * VELOCITY_CLAMP === MAX_TYPE_SHIFT */
  TYPE_FACTOR: 5.6,
  MAX_TYPE_SHIFT: 14,

  /** Camera lag behind the ideal path, world units. */
  LAG_FACTOR: 0.24,
  MAX_LAG: 0.6,
} as const;

export const COMPOSITOR = {
  /** Below this, skip the composite pass and render the active scene direct. */
  SKIP_THRESHOLD: 0.001,
  /** Scissor headroom for seam displacement. Do not lower. */
  SCISSOR_PAD: 1.3,
  /** Wipe diagonal. 0 = horizontal, 1 = steep. */
  ANGLE: 0.55,
  /** Enable 30fps alternating scene render during transitions. Measured need only. */
  ALTERNATE_RENDER: false,
  MAX_DPR: 2,
} as const;

/** Sections, in order. units = viewport heights of scroll travel. */
export const INGREDIENTS_READING_UNITS = 1;
export const SECTIONS = [
  { id: 'founder', units: 3.4 },
  { id: 'identity', units: 3.4 + INGREDIENTS_READING_UNITS },
  { id: 'projects', units: 10.0 },
  { id: 'reviews', units: 2.0 },
  { id: 'brand', units: 1.0 },
  { id: 'contact', units: 1.4 },
] as const;

export type SectionId = (typeof SECTIONS)[number]['id'];

/** Founder beats, on innerProgress = stage(progress, 0.12, 0.90). */
export const FOUNDER_BEATS = {
  ACTIVE_RANGE: [0.12, 0.9] as [number, number],
  GROUP: [0.0, 0.15] as [number, number],
  JUNES: [0.15, 0.34] as [number, number],
  DEEPAN: [0.34, 0.53] as [number, number],
  SHIKHAR: [0.53, 0.72] as [number, number],
  REUNION: [0.72, 0.9] as [number, number],
  TAKEOVER: [0.9, 1.0] as [number, number],
  /** Shoulder widths that make focus overlap instead of crossfade. */
  SHOULDER_IN: 0.06,
  SHOULDER_OUT: 0.05,
  /** Layer depths, world units, camera at z = 0 looking down -z. */
  Z_PARTICLES: -1.2,
  Z_FOUNDER_BASE: -4.0,
  Z_FOUNDER_FOCUS: -2.6,
  Z_FOUNDER_RECEDED: -6.5,
  Z_HAZE: -7.0,
  Z_BACKDROP: -11.0,
} as const;

/** Project focal windows across the projects section's own progress. */
export const PROJECT_WINDOWS: ReadonlyArray<{ start: number; peak: number; end: number }> = [
  { start: 0.055, peak: 0.135, end: 0.215 },
  { start: 0.2425, peak: 0.3225, end: 0.4025 },
  { start: 0.43, peak: 0.51, end: 0.59 },
  { start: 0.6175, peak: 0.6975, end: 0.7775 },
  { start: 0.805, peak: 0.885, end: 0.965 },
];

/** Half-width of the readable focal zone. */
export const FOCAL_WIDTH = 0.08;

/** Values overridden when prefers-reduced-motion is set. */
export const REDUCED_MOTION_OVERRIDES = {
  SCROLL_LAMBDA: 1e6,
  CAMERA_LAMBDA: 1e6,
  VELOCITY_CLAMP: 0,
  POINTER_AMPLITUDE: 0,
  MAX_DISTORTION: 0,
  MAX_TILT_DEG: 0,
  MAX_ROLL: 0,
  GRAIN_FLOW_VELOCITY: 0,
  NOISE_VELOCITY: 0,
  PARTICLE_SCALE: 0.5,
} as const;

/** Shorter touch story; Work retains room for all five existing focal windows. */
export const MOBILE_SECTION_UNITS = [2.1, 2.4 + INGREDIENTS_READING_UNITS, 7.5, 1.35, 1, 1.15] as const;

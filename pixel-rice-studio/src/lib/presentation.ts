/** Shared presentation vocabulary; scroll damping and camera path remain in constants.ts. */
export const PRESENTATION = {
  micro: 180,
  hover: 320,
  reveal: 650,
  chapter: 1000,
  ease: 'cubic-bezier(.22,.68,.18,1)',
  mobileDpr: 1.15,
  desktopDpr: 1.6,
} as const;

/** Each project receives a small, recognizable material/motion accent. */
export const PROJECT_MOTION = [
  { axis: 0, crop: .08, bend: 0, tilt: 0, material: 'metal' },
  { axis: 1, crop: .11, bend: .06, tilt: -.025, material: 'glass' },
  { axis: 0, crop: .07, bend: .025, tilt: .02, material: 'paper' },
  { axis: 1, crop: .05, bend: .018, tilt: 0, material: 'stone' },
  { axis: 0, crop: .12, bend: .04, tilt: -.04, material: 'paper' },
] as const;

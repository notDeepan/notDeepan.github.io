import { clamp } from './scrollMath';
import { COMPOSITOR, SCROLL } from './constants';

/** Bounds include the diagonal, maximum UV displacement and antialiasing.
 * A proportional height pad alone fails near either end of a diagonal wipe. */
export function transitionBands(progress: number, width: number, height: number, velocity = 0, angle = COMPOSITOR.ANGLE) {
  const p = clamp(progress);
  const slant = -angle * (width / Math.max(1, height)) * .18;
  const minAxis = Math.min(0, slant);
  const maxAxis = 1 + Math.max(0, slant);
  const edge = minAxis + (maxAxis - minAxis) * p;
  const pad = (.018 + Math.min(SCROLL.VELOCITY_CLAMP, Math.abs(velocity)) * .01) * Math.sin(p * Math.PI) + 3 / Math.max(1, height);
  const minA = clamp(edge - Math.max(0, slant) - pad);
  const maxB = clamp(edge - Math.min(0, slant) + pad);
  const outgoingY = Math.max(0, Math.floor(minA * height));
  return {
    outgoingY,
    outgoingHeight: Math.max(1, height - outgoingY),
    incomingHeight: Math.max(1, Math.ceil(maxB * height)),
  };
}

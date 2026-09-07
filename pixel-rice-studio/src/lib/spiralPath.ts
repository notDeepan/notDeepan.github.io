import { Vector3 } from 'three';
import { CAMERA, SPIRAL } from './constants';
import { clamp } from './scrollMath';

const TAU = Math.PI * 2;
const aheadPoint = new Vector3();

export function cameraPoint(progress: number, out: Vector3): Vector3 {
  const p = clamp(progress);
  const theta = p * SPIRAL.TURNS * TAU;
  const radius = SPIRAL.CAM_RADIUS + Math.sin(theta * .5) * SPIRAL.RADIUS_MOD;
  return out.set(Math.cos(theta) * radius,
    -(p * SPIRAL.VERTICAL_TRAVEL + Math.sin(theta * .5) * SPIRAL.VERTICAL_WOBBLE),
    Math.sin(theta) * radius);
}

export function cameraTarget(progress: number, out: Vector3): Vector3 {
  cameraPoint(clamp(progress + SPIRAL.LOOK_AHEAD), aheadPoint);
  const radial = 1 - SPIRAL.LOOK_AXIS_BIAS;
  return out.set(aheadPoint.x * radial, aheadPoint.y, aheadPoint.z * radial);
}

export interface SpiralFrameInput {
  progress: number;
  velocity: number;
  pointerX: number;
  pointerY: number;
  dt: number;
  reducedMotion: boolean;
}
export interface SpiralFrameOutput { position: Vector3; target: Vector3; roll: number }
const frame: SpiralFrameOutput = { position: new Vector3(), target: new Vector3(), roll: 0 };

/** Progress has already been damped by ScrollEngine. Never filter it again. */
export function spiralFrame(input: SpiralFrameInput, current?: Vector3): SpiralFrameOutput {
  cameraPoint(input.progress, frame.position);
  cameraTarget(input.progress, frame.target);
  if (!input.reducedMotion) {
    const x = clamp(input.pointerX, -1, 1) * CAMERA.POINTER_AMPLITUDE;
    const y = clamp(input.pointerY, -1, 1) * CAMERA.POINTER_AMPLITUDE;
    frame.position.x += x;
    frame.position.y += y;
    frame.target.x += x * .5;
    frame.target.y += y * .5;
  }
  // Velocity may bank the lens, but never changes its position on the path.
  frame.roll = input.reducedMotion ? 0 : clamp(-input.velocity * CAMERA.ROLL_FACTOR, -CAMERA.MAX_ROLL, CAMERA.MAX_ROLL);
  current?.copy(frame.position);
  return frame;
}

export function projectTransform(peak: number, index: number, out: { position: Vector3; rotationY: number }) {
  const p = clamp(peak);
  const theta = p * SPIRAL.TURNS * TAU;
  const radius = SPIRAL.CAM_RADIUS + 4.2 + (index % 2 === 0 ? .8 : -.8);
  const angle = theta + .14;
  out.position.set(Math.cos(angle) * radius,
    -(p * SPIRAL.VERTICAL_TRAVEL + Math.sin(theta * .5) * SPIRAL.VERTICAL_WOBBLE),
    Math.sin(angle) * radius);
  // PlaneGeometry's front normal is +Z. This rotation points it at the axis.
  out.rotationY = -angle - Math.PI / 2;
  return out;
}

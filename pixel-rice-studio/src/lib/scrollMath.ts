import { SCROLL, SECTIONS, MOBILE_SECTION_UNITS, type SectionId } from './constants';

export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
export const damp = (value: number, target: number, lambda: number, dt: number) =>
  value + (target - value) * (1 - Math.exp(-lambda * Math.max(0, dt)));
export const stage = (progress: number, start: number, end: number) =>
  end > start ? clamp((progress - start) / (end - start)) : Number(progress >= end);
export const smoothstep = (value: number, start: number, end: number) => {
  const t = stage(value, start, end);
  return t * t * (3 - 2 * t);
};
export const focal = (progress: number, peak: number, width: number) =>
  1 - smoothstep(Math.abs(progress - peak), 0, width);
export const beatWindow = (p: number, start: number, end: number, shoulderIn = .06, shoulderOut = .05) =>
  smoothstep(p, start - shoulderIn, start + shoulderOut) *
  (1 - smoothstep(p, end - shoulderOut, end + shoulderIn));

export interface SectionLayout {
  id: SectionId;
  index: number;
  units: number;
  startPx: number;
  heightPx: number;
}

export function createSectionLayout(viewport: number, mobile = false): SectionLayout[] {
  let cursor = 0;
  return SECTIONS.map((section, index) => {
    const units = mobile ? MOBILE_SECTION_UNITS[index] : section.units;
    const heightPx = Math.round(units * Math.max(1, viewport) * SCROLL.SECTION_PADDING);
    const result = { ...section, units, index, startPx: cursor, heightPx };
    cursor += heightPx;
    return result;
  });
}

export interface TimelineSample {
  index1: number;
  index2: number;
  transition: number;
  overall: number;
}

/** Caller may reuse `out` to keep the animation loop allocation-free. */
export function sampleTimeline(
  offset: number,
  viewport: number,
  sections: readonly SectionLayout[],
  reducedMotion = false,
  out: TimelineSample = { index1: 0, index2: 0, transition: 0, overall: 0 },
): TimelineSample {
  if (!sections.length) return Object.assign(out, { index1: 0, index2: 0, transition: 0, overall: 0 });
  const vh = Math.max(1, viewport);
  const last = sections[sections.length - 1];
  const maxScroll = Math.max(0, last.startPx + last.heightPx - vh);
  const position = clamp(offset, 0, maxScroll);
  let i1 = sections.length - 1;
  for (let i = 0; i < sections.length; i++) {
    if (position < sections[i].startPx + sections[i].heightPx) { i1 = i; break; }
  }
  const i2 = Math.min(i1 + 1, sections.length - 1);
  const transition = i1 === i2 ? 0 : clamp((position + vh - sections[i2].startPx) / vh);
  out.index1 = i1;
  out.index2 = i2;
  out.transition = reducedMotion ? Number(transition > .5) : transition;
  // A conventional 0..1 travel indicator, including both document endpoints.
  out.overall = maxScroll > 0 ? position / maxScroll : 0;
  return out;
}

/** Entry/exit progress from the supplied scroll specification. */
export function sectionProgress(offset: number, viewport: number, section: SectionLayout): number {
  return clamp((offset + viewport - section.startPx) / (section.heightPx + viewport));
}

/** 0..1 while the section fills the viewport; the last section reaches 1. */
export function sectionLocalProgress(offset: number, viewport: number, section: SectionLayout): number {
  return stage(offset, section.startPx, section.startPx + Math.max(1, section.heightPx - viewport));
}

export function progressToOffset(progress: number, viewport: number, section: SectionLayout): number {
  return clamp(progress) * (section.heightPx + viewport) + section.startPx - viewport;
}

/** A bounded phase; never accumulate group rotation or velocity into camera position. */
export function advanceFlow(flow: number, velocity: number, dt: number, reducedMotion = false): number {
  if (reducedMotion) return flow;
  const increment = (.12 + Math.min(SCROLL.VELOCITY_CLAMP, Math.abs(velocity)) * .35) * Math.max(0, dt);
  return ((flow + increment) % 1 + 1) % 1;
}

import { CAMERA, SCROLL, type SectionId } from './constants';
import {
  beatWindow, clamp, createSectionLayout, damp, focal, progressToOffset,
  sampleTimeline, sectionLocalProgress, sectionProgress, stage,
  type SectionLayout, type TimelineSample,
} from './scrollMath';

export interface SectionState extends SectionLayout {
  el: HTMLElement | null;
  progress: number;
  localProgress: number;
  live: boolean;
}
export interface PointerState { x: number; y: number }

/** Native scrolling, one damping stage, and one caller-owned render loop. */
export class ScrollEngine {
  root: HTMLElement | null = null;
  raw = 0;
  smooth = 0;
  velocity = 0;
  direction: -1 | 0 | 1 = 0;
  index1 = 0;
  index2 = 1;
  transition = 0;
  overall = 0;
  totalHeight = 0;
  viewportH = 1;
  reducedMotion = false;
  pointer: PointerState = { x: 0, y: 0 };
  sections: SectionState[] = createSectionLayout(1).map(s => ({ ...s, el: null, progress: 0, localProgress: 0, live: false }));

  private layoutViewportH = 1;
  private layoutViewportW = 1;
  private pointerTarget: PointerState = { x: 0, y: 0 };
  private isTouch = false;
  private resizeTimer: ReturnType<typeof setTimeout> | null = null;
  private detachFns: Array<() => void> = [];
  private locked = false;
  private lockedPosition = 0;
  private savedOverflow = '';
  private systemReducedMotion = false;
  private motionOverride = false;
  private sample: TimelineSample = { index1: 0, index2: 1, transition: 0, overall: 0 };

  get narrativeViewportH() { return this.layoutViewportH; }
  get maxScroll() { return Math.max(0, this.totalHeight - this.layoutViewportH); }
  get isLocked() { return this.locked; }

  attach(root: HTMLElement) {
    this.detach();
    this.root = root;
    this.isTouch = window.matchMedia('(hover: none)').matches;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.systemReducedMotion = motion.matches;
    this.applyMotionPreference();
    const onMotion = (event: MediaQueryListEvent) => {
      this.systemReducedMotion = event.matches;
      this.applyMotionPreference();
    };
    motion.addEventListener('change', onMotion);
    this.detachFns.push(() => motion.removeEventListener('change', onMotion));

    const onResize = () => {
      this.viewportH = Math.max(1, window.innerHeight);
      if (this.resizeTimer !== null) clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => { this.resizeTimer = null; this.layout(); }, SCROLL.RESIZE_DEBOUNCE_MS);
    };
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('orientationchange', onResize, { passive: true });
    this.detachFns.push(() => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    });
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || this.isTouch) return;
      this.pointerTarget.x = clamp(event.clientX / window.innerWidth * 2 - 1, -1, 1);
      this.pointerTarget.y = clamp(1 - event.clientY / window.innerHeight * 2, -1, 1);
    };
    const onLeave = () => { this.pointerTarget.x = 0; this.pointerTarget.y = 0; };
    root.addEventListener('pointermove', onPointer, { passive: true });
    root.addEventListener('pointerleave', onLeave, { passive: true });
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    this.detachFns.push(() => {
      root.removeEventListener('pointermove', onPointer);
      root.removeEventListener('pointerleave', onLeave);
      root.style.scrollBehavior = previousBehavior;
    });
    this.layout(true);
    this.syncPosition(root.scrollTop);
  }

  detach() {
    this.unlock();
    this.detachFns.forEach(fn => fn());
    this.detachFns = [];
    if (this.resizeTimer !== null) clearTimeout(this.resizeTimer);
    this.resizeTimer = null;
    this.root = null;
  }

  /** Simple view adds a motion override without replacing the OS preference. */
  setMotionOverride(reduce: boolean) {
    this.motionOverride = reduce;
    this.applyMotionPreference();
  }

  private applyMotionPreference() {
    this.reducedMotion = this.systemReducedMotion || this.motionOverride;
    if (this.reducedMotion) {
      this.pointer.x = this.pointer.y = 0;
      if (this.root) this.syncPosition(this.locked ? this.lockedPosition : this.root.scrollTop);
    }
  }

  layout(force = false) {
    if (!this.root) return;
    const w = window.innerWidth;
    const h = Math.max(1, window.innerHeight);
    this.viewportH = h;
    const heightDelta = Math.abs(h - this.layoutViewportH) / this.layoutViewportH;
    if (!force && w === this.layoutViewportW && heightDelta <= SCROLL.RESIZE_HEIGHT_THRESHOLD) return;
    const previousProgress = this.maxScroll ? clamp(this.root.scrollTop / this.maxScroll) : 0;
    this.layoutViewportW = w;
    this.layoutViewportH = h;
    const layouts = createSectionLayout(h);
    for (const section of this.sections) {
      Object.assign(section, layouts[section.index]);
      section.el = this.root.querySelector<HTMLElement>(`[data-section="${section.id}"]`);
      if (section.el) section.el.style.height = `${section.heightPx}px`;
    }
    const last = this.sections[this.sections.length - 1];
    this.totalHeight = last.startPx + last.heightPx;
    if (!force) {
      this.root.scrollTop = previousProgress * this.maxScroll;
      this.syncPosition(this.root.scrollTop);
      if (this.locked) this.lockedPosition = this.smooth;
    }
    this.compute();
  }

  update(dt: number) {
    if (!this.root) return;
    const d = Number.isFinite(dt) ? clamp(dt, 0, .1) : 0;
    if (this.locked) {
      this.root.scrollTop = this.lockedPosition;
      this.syncPosition(this.lockedPosition);
      return;
    }
    const previous = this.smooth;
    this.raw = clamp(this.root.scrollTop, 0, this.maxScroll);
    this.smooth = this.reducedMotion ? this.raw : damp(this.smooth, this.raw, SCROLL.SCROLL_LAMBDA, d);
    if (Math.abs(this.raw - this.smooth) < .01) this.smooth = this.raw;
    const instant = d > 0 ? (this.smooth - previous) / d / this.viewportH : 0;
    const target = clamp(instant, -SCROLL.VELOCITY_CLAMP, SCROLL.VELOCITY_CLAMP);
    this.velocity = this.reducedMotion ? 0 : damp(this.velocity, target, SCROLL.VELOCITY_LAMBDA, d);
    if (Math.abs(this.velocity) < 1e-4) this.velocity = 0;
    this.direction = this.velocity === 0 ? 0 : this.velocity > 0 ? 1 : -1;
    const pointerEnabled = !this.isTouch && !this.reducedMotion;
    this.pointer.x = pointerEnabled ? damp(this.pointer.x, this.pointerTarget.x, CAMERA.POINTER_LAMBDA, d) : 0;
    this.pointer.y = pointerEnabled ? damp(this.pointer.y, this.pointerTarget.y, CAMERA.POINTER_LAMBDA, d) : 0;
    this.compute();
  }

  private compute() {
    // Narrative math always uses the captured viewport. Browser toolbar changes
    // may change velocity normalization, but must not shift the camera path.
    sampleTimeline(this.smooth, this.layoutViewportH, this.sections, this.reducedMotion, this.sample);
    Object.assign(this, this.sample);
    for (const section of this.sections) {
      section.progress = sectionProgress(this.smooth, this.layoutViewportH, section);
      section.localProgress = sectionLocalProgress(this.smooth, this.layoutViewportH, section);
      section.live = (section.index === this.index1 && this.transition < 1) ||
        (section.index === this.index2 && this.transition > 0);
    }
  }

  private syncPosition(position: number) {
    this.raw = this.smooth = clamp(position, 0, this.maxScroll);
    this.velocity = 0;
    this.direction = 0;
    this.compute();
  }

  section(id: SectionId) {
    const section = this.sections.find(item => item.id === id);
    if (!section) throw new Error(`Unknown section: ${id}`);
    return section;
  }
  progressOf(id: SectionId) { return this.section(id).progress; }
  localProgressOf(id: SectionId) { return this.section(id).localProgress; }
  offsetForProgress(id: SectionId, progress: number) {
    return clamp(progressToOffset(progress, this.layoutViewportH, this.section(id)), 0, this.maxScroll);
  }
  scrollToProgress(id: SectionId, progress: number, instant = false) {
    this.scrollToOffset(this.offsetForProgress(id, progress), instant);
  }
  scrollToSection(id: SectionId, instant = false) {
    this.scrollToOffset(this.section(id).startPx, instant);
  }
  scrollToOffset(offset: number, instant = false) {
    if (!this.root || this.locked) return;
    // Browser smooth scrolling would add a second filter before the engine.
    this.root.scrollTop = clamp(offset, 0, this.maxScroll);
    if (instant || this.reducedMotion) this.syncPosition(this.root.scrollTop);
  }
  lock() {
    if (!this.root || this.locked) return;
    this.locked = true;
    this.lockedPosition = this.smooth;
    this.root.scrollTop = this.lockedPosition;
    this.savedOverflow = this.root.style.overflowY;
    this.root.style.overflowY = 'hidden';
    this.syncPosition(this.lockedPosition);
  }
  unlock() {
    if (!this.root || !this.locked) return;
    this.root.style.overflowY = this.savedOverflow;
    this.root.scrollTop = this.lockedPosition;
    this.locked = false;
    this.syncPosition(this.lockedPosition);
  }
  static stage = stage;
  static focal = focal;
  static window = beatWindow;
}

export const scrollEngine = new ScrollEngine();

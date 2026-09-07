import assert from 'node:assert/strict';
import test from 'node:test';
import { Vector3 } from 'three';
import { HELIX, SPIRAL } from '../src/lib/constants';
import { advanceFlow, createSectionLayout, damp, progressToOffset, sampleTimeline, sectionLocalProgress, sectionProgress } from '../src/lib/scrollMath';
import { cameraPoint, spiralFrame } from '../src/lib/spiralPath';
import { transitionBands } from '../src/lib/transitionMath';

test('one damping stage resolves identically at 60 Hz and 120 Hz', () => {
  const run = (hz: number) => {
    let position = 0;
    for (let i = 0; i < hz; i++) position = damp(position, 3000, 6.5, 1 / hz);
    return position;
  };
  assert.ok(Math.abs(run(60) - run(120)) < 1e-9);
});

test('native document endpoints and last chapter remain reachable', () => {
  const sections = createSectionLayout(800);
  const last = sections.at(-1)!;
  const end = last.startPx + last.heightPx - 800;
  assert.equal(sampleTimeline(0, 800, sections).overall, 0);
  assert.equal(sampleTimeline(end, 800, sections).overall, 1);
  assert.equal(sampleTimeline(end + 999, 800, sections).index1, sections.length - 1);
  assert.equal(sectionLocalProgress(end, 800, last), 1);
  assert.equal(sampleTimeline(-200, 800, sections).overall, 0);
});

test('section pair swaps only after an incoming wipe reaches its end', () => {
  const sections = createSectionLayout(1000);
  for (let i = 1; i < sections.length; i++) {
    const boundary = sections[i].startPx;
    const before = sampleTimeline(boundary - .01, 1000, sections);
    const after = sampleTimeline(boundary, 1000, sections);
    assert.equal(before.index2, after.index1);
    assert.ok(before.transition > .999);
    assert.equal(after.transition, 0);
    assert.equal(sampleTimeline(boundary - 1000, 1000, sections).transition, 0);
  }
});

test('reduced motion produces only complete scenes, no blended transition', () => {
  const sections = createSectionLayout(1000);
  const boundary = sections[1].startPx;
  assert.equal(sampleTimeline(boundary - 750, 1000, sections, true).transition, 0);
  assert.equal(sampleTimeline(boundary - 250, 1000, sections, true).transition, 1);
});

test('project navigation inverts its progress without drifting to another project', () => {
  const sections = createSectionLayout(900);
  const project = sections[2];
  for (const progress of [.135, .285, .435, .585, .735, .885]) {
    const offset = progressToOffset(progress, 900, project);
    assert.ok(Math.abs(sectionProgress(offset, 900, project) - progress) < 1e-12);
  }
});

test('scrolling down descends through projects without vertical reversals or velocity drift', () => {
  const point = new Vector3();
  let y = Infinity;
  for (let step = 0; step <= 1000; step++) {
    cameraPoint(step / 1000, point);
    assert.ok(point.y <= y);
    assert.ok(Math.hypot(point.x, point.z) > HELIX.HELIX_RADIUS + 3);
    y = point.y;
  }
  assert.ok(SPIRAL.VERTICAL_WOBBLE * .5 * SPIRAL.TURNS * 2 * Math.PI < SPIRAL.VERTICAL_TRAVEL);
  const input = { progress: .42, pointerX: 0, pointerY: 0, dt: 1 / 60, reducedMotion: false };
  const still = spiralFrame({ ...input, velocity: 0 }).position.clone();
  const moving = spiralFrame({ ...input, velocity: 2.5 }).position;
  assert.deepEqual(moving, still);
});

test('rice flow wraps and is independent of display refresh rate', () => {
  const run = (hz: number) => {
    let flow = .9;
    for (let i = 0; i < hz * 10; i++) {
      flow = advanceFlow(flow, 2.5, 1 / hz);
      assert.ok(flow >= 0 && flow < 1);
    }
    return flow;
  };
  assert.ok(Math.abs(run(60) - run(120)) < 1e-10);
  assert.equal(advanceFlow(.4, 2.5, 1, true), .4);
});

test('diagonal scissor covers every visible sample on wide and portrait screens', () => {
  for (const [width, height] of [[2560, 1080], [390, 844], [1920, 1080]]) {
    const slant = -.55 * width / height * .18;
    for (let step = 1; step < 100; step++) {
      const progress = step / 100;
      const edge = slant + (1 - slant) * progress;
      const bands = transitionBands(progress, width, height, 2.5);
      const displacement = .043 * Math.sin(progress * Math.PI);
      for (let x = 0; x <= 1; x += .025) {
        const seamY = edge - x * slant;
        const lowestSampleA = Math.min(1, Math.max(0, seamY - displacement));
        const highestSampleB = Math.min(1, Math.max(0, seamY + displacement));
        assert.ok(bands.outgoingY / height <= lowestSampleA + 1 / height);
        assert.ok(bands.incomingHeight / height >= highestSampleB - 1 / height);
      }
    }
  }
});

import {
  Camera, Mesh, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial,
  Texture, UnsignedByteType, Vector2, Vector4, WebGLRenderer, WebGLRenderTarget,
} from 'three';
import { sectionTransitionFragment, sectionTransitionVertex } from '../shaders/sectionTransition';
import { COMPOSITOR } from './constants';
import { createNoiseTexture } from './noiseTexture';
import type { ScrollEngine } from './scrollEngine';
import { transitionBands } from './transitionMath';

export interface SectionRenderable {
  scene: Scene;
  camera: Camera;
  update?: (dt: number) => void;
  onSleep?: () => void;
  onWake?: () => void;
}

/** Two reusable targets, at most two active scenes, one render loop. */
export class SectionCompositor {
  private rtA: WebGLRenderTarget;
  private rtB: WebGLRenderTarget;
  private quadScene = new Scene();
  private quadCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private geometry = new PlaneGeometry(2, 2);
  private material: ShaderMaterial;
  private wasLive = new Set<number>();
  private size = new Vector2();
  private savedViewport = new Vector4();
  private savedScissor = new Vector4();
  private ownedNoise: Texture | null;

  constructor(private renderer: WebGLRenderer, private sections: SectionRenderable[], noiseTexture?: Texture, isMobile = false) {
    renderer.getDrawingBufferSize(this.size);
    const opts = {
      type: UnsignedByteType,
      samples: isMobile ? 0 : Math.min(4, renderer.capabilities.maxSamples),
      depthBuffer: true,
      stencilBuffer: false,
    };
    this.rtA = new WebGLRenderTarget(this.size.x, this.size.y, opts);
    this.rtB = new WebGLRenderTarget(this.size.x, this.size.y, opts);
    this.ownedNoise = noiseTexture ? null : createNoiseTexture();
    this.material = new ShaderMaterial({
      uniforms: {
        uTexA: { value: this.rtA.texture }, uTexB: { value: this.rtB.texture },
        uNoise: { value: noiseTexture ?? this.ownedNoise }, uProgress: { value: 0 },
        uAngle: { value: COMPOSITOR.ANGLE }, uVelocity: { value: 0 },
        uGrain: { value: isMobile ? .01 : .018 }, uTime: { value: 0 },
        uResolution: { value: this.size },
      },
      vertexShader: sectionTransitionVertex, fragmentShader: sectionTransitionFragment,
      depthTest: false, depthWrite: false,
    });
    this.quadScene.add(new Mesh(this.geometry, this.material));
  }

  resize() {
    this.renderer.getDrawingBufferSize(this.size);
    this.rtA.setSize(this.size.x, this.size.y);
    this.rtB.setSize(this.size.x, this.size.y);
  }

  render(engine: ScrollEngine, dt: number, elapsed: number) {
    const { index1, index2, transition } = engine;
    const directA = transition < COMPOSITOR.SKIP_THRESHOLD || index1 === index2;
    const directB = !directA && transition > 1 - COMPOSITOR.SKIP_THRESHOLD;
    const indices = directA ? [index1] : directB ? [index2] : [index1, index2];
    this.syncLifecycle(indices);
    for (const index of indices) this.sections[index]?.update?.(dt);

    const renderer = this.renderer;
    const oldTarget = renderer.getRenderTarget();
    const oldAutoClear = renderer.autoClear;
    const oldScissorTest = renderer.getScissorTest();
    renderer.getViewport(this.savedViewport);
    renderer.getScissor(this.savedScissor);
    renderer.autoClear = false;
    try {
      if (directA || directB) {
        renderer.setRenderTarget(null);
        renderer.setScissorTest(false);
        renderer.clear();
        const active = this.sections[directB ? index2 : index1];
        if (active) renderer.render(active.scene, active.camera);
        return;
      }
      const bands = transitionBands(transition, this.size.x, this.size.y, engine.velocity);
      this.drawTarget(this.rtA, this.sections[index1], bands.outgoingY, bands.outgoingHeight);
      this.drawTarget(this.rtB, this.sections[index2], 0, bands.incomingHeight);
      this.material.uniforms.uProgress.value = transition;
      this.material.uniforms.uVelocity.value = engine.reducedMotion ? 0 : engine.velocity;
      this.material.uniforms.uTime.value = elapsed;
      renderer.setRenderTarget(null);
      renderer.setScissorTest(false);
      renderer.clear();
      renderer.render(this.quadScene, this.quadCamera);
    } finally {
      renderer.setRenderTarget(oldTarget);
      renderer.setViewport(this.savedViewport);
      renderer.setScissor(this.savedScissor);
      renderer.setScissorTest(oldScissorTest);
      renderer.autoClear = oldAutoClear;
    }
  }

  private drawTarget(target: WebGLRenderTarget, section: SectionRenderable | undefined, y: number, height: number) {
    // Render-target scissor coordinates are physical pixels. setScissor() uses
    // renderer DPR, and setting it before setRenderTarget() is overwritten.
    target.scissor.set(0, y, this.size.x, height);
    target.scissorTest = true;
    this.renderer.setRenderTarget(target);
    this.renderer.clear();
    if (section) this.renderer.render(section.scene, section.camera);
  }

  private syncLifecycle(indices: number[]) {
    const live = new Set(indices);
    for (const i of live) if (!this.wasLive.has(i)) this.sections[i]?.onWake?.();
    for (const i of this.wasLive) if (!live.has(i)) this.sections[i]?.onSleep?.();
    this.wasLive = live;
  }

  dispose() {
    for (const index of this.wasLive) this.sections[index]?.onSleep?.();
    this.wasLive.clear();
    this.rtA.dispose(); this.rtB.dispose();
    this.geometry.dispose(); this.material.dispose(); this.ownedNoise?.dispose();
  }
}

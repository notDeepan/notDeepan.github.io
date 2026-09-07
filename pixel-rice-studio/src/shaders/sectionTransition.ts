export const sectionTransitionVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const sectionTransitionFragment = /* glsl */ `
precision highp float;
uniform sampler2D uTexA;
uniform sampler2D uTexB;
uniform sampler2D uNoise;
uniform float uProgress;
uniform float uAngle;
uniform float uVelocity;
uniform float uGrain;
uniform float uTime;
uniform vec2 uResolution;
varying vec2 vUv;

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / max(1.0, uResolution.y);
  float velocity = min(abs(uVelocity), 2.5);
  float envelope = sin(clamp(uProgress, 0.0, 1.0) * 3.14159265);
  vec2 noiseUv = vec2(uv.x * aspect, uv.y) * .65;
  noiseUv.y -= uProgress * .9;
  vec2 noise = texture2D(uNoise, noiseUv).rg * 2.0 - 1.0;
  float slant = -uAngle * aspect * .18;
  float axis = uv.y + uv.x * slant;
  float edge = mix(min(0.0, slant), 1.0 + max(0.0, slant), uProgress);
  // Reversed smoothstep edges are undefined in GLSL: explicitly invert it.
  float band = (1.0 - smoothstep(0.0, .28, abs(axis - edge))) * envelope;
  float push = (.018 + velocity * .010) * band;
  vec2 halfPixel = .5 / uResolution;
  vec2 displaced = clamp(uv + noise * push, halfPixel, 1.0 - halfPixel);
  vec2 split = vec2(band * (.002 + velocity * .0015), 0.0);
  vec2 plusUv = clamp(displaced + split, halfPixel, 1.0 - halfPixel);
  vec2 minusUv = clamp(displaced - split, halfPixel, 1.0 - halfPixel);
  vec3 a = vec3(texture2D(uTexA, plusUv).r, texture2D(uTexA, displaced).g, texture2D(uTexA, minusUv).b);
  vec3 b = vec3(texture2D(uTexB, plusUv).r, texture2D(uTexB, displaced).g, texture2D(uTexB, minusUv).b);
  float pixelWidth = max(fwidth(axis), .00001) * .5;
  float cut = smoothstep(-pixelWidth, pixelWidth, axis - edge);
  vec3 color = mix(b, a, cut);
  color += band * band * .035;
  color += (hash12(gl_FragCoord.xy + fract(uTime) * 431.7) - .5) * uGrain * envelope;
  gl_FragColor = vec4(color, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

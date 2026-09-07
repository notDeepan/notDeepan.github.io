import { DataTexture, LinearFilter, NoColorSpace, RepeatWrapping, RGBAFormat } from 'three';

/** Original periodic data texture. Integer-frequency waves tile without a seam. */
export function createNoiseTexture(size = 128, seed = 19) {
  const data = new Uint8Array(size * size * 4);
  const tau = Math.PI * 2;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size * tau;
      const v = y / size * tau;
      const i = (y * size + x) * 4;
      for (let c = 0; c < 3; c++) {
        const phase = seed * .17 + c * 2.1;
        const n = Math.sin(u * 3 + v * 2 + phase) * .46 + Math.sin(u * 7 - v * 5 + phase * 2) * .3 + Math.cos(u * 13 + v * 11 - phase) * .24;
        data[i + c] = Math.round((n * .5 + .5) * 255);
      }
      data[i + 3] = 255;
    }
  }
  const texture = new DataTexture(data, size, size, RGBAFormat);
  texture.wrapS = texture.wrapT = RepeatWrapping;
  texture.minFilter = texture.magFilter = LinearFilter;
  texture.colorSpace = NoColorSpace;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

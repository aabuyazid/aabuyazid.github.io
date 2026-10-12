import * as THREE from 'three';

/**
 * Procedural wood grain for the desk top. Generated rather than downloaded so
 * the site ships no texture files and the tone stays locked to the palette.
 */
export function createWoodTexture({ repeatX = 8, repeatY = 1 } = {}) {
  const W = 1024;
  const H = 256;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Base tone.
  ctx.fillStyle = '#7a5436';
  ctx.fillRect(0, 0, W, H);

  // Long grain lines running along the plank. Frequencies are whole numbers of
  // cycles across the canvas so the left and right edges match and the texture
  // tiles without a visible seam.
  const rand = mulberry32(20240611);
  for (let i = 0; i < 220; i++) {
    const y = rand() * H;
    const amp = 2 + rand() * 7;
    const cycles = 1 + Math.floor(rand() * 3);
    const freq = (Math.PI * 2 * cycles) / W;
    const phase = rand() * Math.PI * 2;
    const dark = rand() > 0.45;
    ctx.strokeStyle = dark
      ? `rgba(60, 38, 22, ${0.05 + rand() * 0.16})`
      : `rgba(168, 122, 78, ${0.04 + rand() * 0.12})`;
    ctx.lineWidth = 0.6 + rand() * 2.2;
    ctx.beginPath();
    for (let x = 0; x <= W; x += 6) {
      const yy = y + Math.sin(x * freq + phase) * amp;
      if (x === 0) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }
    ctx.stroke();
  }

  // A few knots, which is what sells it as wood rather than stripes. Kept away
  // from the vertical edges so they are not clipped by the tile boundary.
  for (let i = 0; i < 3; i++) {
    const cx = W * (0.18 + rand() * 0.64);
    const cy = rand() * H;
    const rings = 5 + Math.floor(rand() * 5);
    for (let r = rings; r > 0; r--) {
      ctx.strokeStyle = `rgba(52, 32, 18, ${0.05 + (rings - r) * 0.015})`;
      ctx.lineWidth = 1 + rand() * 1.4;
      ctx.beginPath();
      ctx.ellipse(cx, cy, r * 4.5, r * 2.1, rand() * 0.4, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // Fine speckle so the surface is never perfectly smooth under the key light.
  const img = ctx.getImageData(0, 0, W, H);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (rand() - 0.5) * 12;
    d[i] += n;
    d[i + 1] += n;
    d[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  texture.anisotropy = 8;
  return texture;
}

/** Tiny deterministic PRNG so the grain is identical on every load. */
function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

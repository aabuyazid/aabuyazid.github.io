import * as THREE from 'three';
import { COLORS } from './palette.js';

const hex = (c) => `#${c.toString(16).padStart(6, '0')}`;

function makeCanvas(w, h) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return { canvas, ctx: canvas.getContext('2d'), texture };
}

/**
 * The compression-study monitor. Draws a scene that is progressively
 * block-quantised from left to right, with a slider showing the quality
 * setting — the same tradeoff the MTurk workers were judging.
 */
export function createCompressionScreen() {
  const W = 512;
  const H = 320;
  const { ctx, texture } = makeCanvas(W, H);

  // The "photograph" being compressed: a simple warm landscape, drawn once
  // into an offscreen canvas and then re-quantised each frame.
  const src = document.createElement('canvas');
  src.width = W;
  src.height = H;
  const sctx = src.getContext('2d');

  // Scratch buffer for the downscale step, so we never draw a canvas onto itself.
  const scratch = document.createElement('canvas');
  scratch.width = W;
  scratch.height = H;
  const xctx = scratch.getContext('2d');
  const sky = sctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#2b4a63');
  sky.addColorStop(0.55, '#c8794a');
  sky.addColorStop(1, '#e8b273');
  sctx.fillStyle = sky;
  sctx.fillRect(0, 0, W, H);
  sctx.fillStyle = '#f6d9a0';
  sctx.beginPath();
  sctx.arc(W * 0.68, H * 0.44, 34, 0, Math.PI * 2);
  sctx.fill();
  // Hills.
  sctx.fillStyle = '#3c3a2c';
  sctx.beginPath();
  sctx.moveTo(0, H);
  sctx.lineTo(0, H * 0.72);
  sctx.lineTo(W * 0.26, H * 0.56);
  sctx.lineTo(W * 0.52, H * 0.74);
  sctx.lineTo(W * 0.78, H * 0.58);
  sctx.lineTo(W, H * 0.73);
  sctx.lineTo(W, H);
  sctx.closePath();
  sctx.fill();
  sctx.fillStyle = '#23241c';
  sctx.beginPath();
  sctx.moveTo(0, H);
  sctx.lineTo(0, H * 0.86);
  sctx.lineTo(W * 0.4, H * 0.78);
  sctx.lineTo(W * 0.72, H * 0.9);
  sctx.lineTo(W, H * 0.82);
  sctx.lineTo(W, H);
  sctx.closePath();
  sctx.fill();

  function draw(t) {
    // Quality oscillates, as if someone were dragging the slider.
    const quality = 0.5 + 0.5 * Math.sin(t * 0.6); // 0..1
    const blockMax = 26;
    const block = Math.max(1, Math.round(blockMax * (1 - quality)));

    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, W, H);

    if (block <= 1) {
      ctx.drawImage(src, 0, 0);
    } else {
      // Downscale then upscale: a cheap stand-in for coarse quantisation.
      const sw = Math.max(1, Math.round(W / block));
      const sh = Math.max(1, Math.round(H / block));
      xctx.imageSmoothingEnabled = true;
      xctx.clearRect(0, 0, W, H);
      xctx.drawImage(src, 0, 0, W, H, 0, 0, sw, sh);
      ctx.drawImage(scratch, 0, 0, sw, sh, 0, 0, W, H);
    }

    // UI chrome: slider track and handle.
    ctx.imageSmoothingEnabled = true;
    const pad = 28;
    const trackY = H - 34;
    ctx.fillStyle = 'rgba(12,10,8,0.62)';
    ctx.fillRect(0, H - 62, W, 62);
    ctx.fillStyle = 'rgba(242,232,216,0.28)';
    ctx.fillRect(pad, trackY, W - pad * 2, 3);
    ctx.fillStyle = hex(COLORS.amber);
    ctx.fillRect(pad, trackY, (W - pad * 2) * quality, 3);
    ctx.beginPath();
    ctx.arc(pad + (W - pad * 2) * quality, trackY + 1.5, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(242,232,216,0.85)';
    ctx.font = '500 15px Inter, system-ui, sans-serif';
    ctx.fillText('JPEG quality', pad, H - 46);
    ctx.textAlign = 'right';
    ctx.fillText(`Q ${Math.round(quality * 100)}`, W - pad, H - 46);
    ctx.textAlign = 'left';

    texture.needsUpdate = true;
  }

  draw(0);
  return { texture, draw };
}

/**
 * The CV laptop screen: a quiet animated timeline of the career entries.
 */
export function createTimelineScreen(entries) {
  const W = 512;
  const H = 340;
  const { ctx, texture } = makeCanvas(W, H);

  function draw(t) {
    ctx.fillStyle = '#12100e';
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = hex(COLORS.amber);
    ctx.font = '600 17px Inter, system-ui, sans-serif';
    ctx.fillText('Curriculum Vitae', 30, 42);

    // Spine.
    const x0 = 42;
    const top = 76;
    const bottom = H - 34;
    ctx.strokeStyle = 'rgba(242,232,216,0.22)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x0, top);
    ctx.lineTo(x0, bottom);
    ctx.stroke();

    const n = entries.length;
    const step = (bottom - top) / Math.max(1, n - 1);

    entries.forEach((e, i) => {
      const y = top + step * i;
      // The active entry cycles slowly.
      const active = Math.floor(t * 0.4) % n === i;

      ctx.beginPath();
      ctx.arc(x0, y, active ? 7 : 4.5, 0, Math.PI * 2);
      ctx.fillStyle = active ? hex(COLORS.amber) : 'rgba(242,232,216,0.45)';
      ctx.fill();

      ctx.fillStyle = active ? '#f2e8d8' : 'rgba(242,232,216,0.6)';
      ctx.font = `${active ? '600' : '400'} 14px Inter, system-ui, sans-serif`;
      ctx.fillText(e.title, x0 + 22, y + 5);

      ctx.fillStyle = 'rgba(233,168,92,0.75)';
      ctx.font = '400 12px Inter, system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(e.year, W - 26, y + 5);
      ctx.textAlign = 'left';
    });

    texture.needsUpdate = true;
  }

  draw(0);
  return { texture, draw };
}

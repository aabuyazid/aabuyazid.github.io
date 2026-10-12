import * as THREE from 'three';
import { COLORS, matte, glow } from '../palette.js';
import { box, slab, cylinder, sphere } from './helpers.js';

/**
 * Hobbies station: basketball, film camera, a mini synth, and a penguin mug —
 * photography/film, music, basketball and Linux tinkering.
 */
export function buildHobbies() {
  const group = new THREE.Group();

  // --- Basketball ---
  const ball = sphere(0.58, matte(0xc1612c, { roughness: 0.95 }), 2);
  ball.position.set(-2.35, 0.58, 0.25);
  group.add(ball);
  // Seams, parented to the ball so they turn with it.
  const seamMat = matte(0x2b1a10, { roughness: 0.9 });
  for (let i = 0; i < 2; i++) {
    const seam = new THREE.Mesh(new THREE.TorusGeometry(0.585, 0.014, 6, 28), seamMat);
    seam.rotation.y = (i * Math.PI) / 2;
    ball.add(seam);
  }
  const seamH = new THREE.Mesh(new THREE.TorusGeometry(0.585, 0.014, 6, 28), seamMat);
  seamH.rotation.x = Math.PI / 2;
  ball.add(seamH);
  group.userData.ball = ball;

  // --- Film camera ---
  const cam = new THREE.Group();
  const bodyMat = matte(0x2a2724, { roughness: 0.6 });
  cam.add(box(1.25, 0.72, 0.6, bodyMat, 0, 0.36, 0));
  // Pentaprism hump.
  cam.add(box(0.46, 0.26, 0.42, bodyMat, -0.06, 0.82, 0));
  // Lens.
  const lens = cylinder(0.26, 0.3, 0.5, matte(0x1d1b19, { roughness: 0.45 }), 16);
  lens.rotation.x = Math.PI / 2;
  lens.position.set(-0.06, 0.36, 0.45);
  cam.add(lens);
  const glass = cylinder(0.2, 0.2, 0.03, matte(0x4a6b7a, { roughness: 0.15, metalness: 0.4 }), 16);
  glass.rotation.x = Math.PI / 2;
  glass.position.set(-0.06, 0.36, 0.7);
  cam.add(glass);
  // Shutter dial and button.
  const dial = cylinder(0.12, 0.12, 0.09, matte(COLORS.steel, { roughness: 0.35, metalness: 0.7 }), 12);
  dial.position.set(0.44, 0.76, -0.05);
  cam.add(dial);
  cam.position.set(-0.55, 0, 0.1);
  cam.rotation.y = -0.4;
  group.add(cam);

  // --- Mini synth / keyboard ---
  const synth = new THREE.Group();
  synth.add(slab(2.2, 0.18, 0.78, matte(COLORS.charcoal, { roughness: 0.7 }), 0, 0, 0));
  // White keys.
  const whiteMat = matte(COLORS.cream, { roughness: 0.8 });
  const blackMat = matte(0x16130f, { roughness: 0.7 });
  const nWhite = 14;
  for (let i = 0; i < nWhite; i++) {
    const k = slab(0.13, 0.05, 0.46, whiteMat, -0.95 + i * 0.145, 0.18, 0.12);
    synth.add(k);
  }
  // Black keys follow the usual 2-3 grouping.
  const pattern = [0, 1, 3, 4, 5];
  for (let oct = 0; oct < 2; oct++) {
    for (const p of pattern) {
      const idx = oct * 7 + p;
      if (idx >= nWhite - 1) continue;
      synth.add(
        slab(0.08, 0.06, 0.28, blackMat, -0.95 + idx * 0.145 + 0.0725, 0.23, 0.02)
      );
    }
  }
  // Two glowing knobs.
  for (let i = 0; i < 2; i++) {
    const knob = cylinder(0.07, 0.07, 0.06, glow(COLORS.amber, 0.7), 10);
    knob.position.set(-0.85 + i * 0.26, 0.21, -0.26);
    synth.add(knob);
  }
  synth.position.set(1.4, 0, 0.45);
  synth.rotation.y = 0.18;
  group.add(synth);

  // --- Penguin mug (Linux) ---
  const mug = new THREE.Group();
  mug.add(cylinder(0.28, 0.25, 0.5, matte(0x2d2a26, { roughness: 0.6 }), 16));
  mug.children[0].position.y = 0.25;
  const handle = new THREE.Mesh(
    new THREE.TorusGeometry(0.15, 0.035, 6, 14, Math.PI * 1.3),
    matte(0x2d2a26, { roughness: 0.6 })
  );
  handle.position.set(0.3, 0.27, 0);
  handle.rotation.z = -0.3;
  handle.castShadow = true;
  mug.add(handle);
  // A tiny beak-coloured dot, enough to read as the penguin.
  const beak = sphere(0.055, matte(0xe8a33d, { roughness: 0.7 }), 0);
  beak.position.set(-0.22, 0.3, 0.14);
  mug.add(beak);
  mug.position.set(2.95, 0, -0.35);
  group.add(mug);

  return group;
}

/** The basketball turns slowly, the only moving thing in this corner. */
export function animateHobbies(group, t) {
  if (group.userData.ball) {
    group.userData.ball.rotation.y = t * 0.3;
    group.userData.ball.rotation.x = Math.sin(t * 0.2) * 0.15;
  }
}

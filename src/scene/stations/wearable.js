import * as THREE from 'three';
import { COLORS, matte, glow } from '../palette.js';
import { box, slab, cylinder } from './helpers.js';

/**
 * Trashcan-detector station: the RealSense stereo camera on a stand, a
 * Raspberry Pi, and the 3x3 haptic motor grid whose cells pulse by "distance".
 */
export function buildWearable() {
  const group = new THREE.Group();

  const bodyMat = matte(COLORS.charcoal, { roughness: 0.6 });
  const steelMat = matte(COLORS.steel, { roughness: 0.4, metalness: 0.6 });

  // --- Stereo camera on a small stand ---
  const stand = new THREE.Group();
  stand.add(cylinder(0.42, 0.5, 0.08, steelMat, 12));
  stand.children[0].position.y = 0.04;
  const post = cylinder(0.07, 0.07, 1.15, steelMat, 8);
  post.position.y = 0.62;
  stand.add(post);

  const cam = new THREE.Group();
  cam.add(box(1.25, 0.26, 0.2, bodyMat, 0, 0, 0));
  // Two lenses (stereo pair) plus the IR projector between them.
  const lensMat = matte(0x1b2430, { roughness: 0.25 });
  for (const x of [-0.42, 0.42]) {
    const lens = cylinder(0.08, 0.08, 0.06, lensMat, 12);
    lens.rotation.x = Math.PI / 2;
    lens.position.set(x, 0, 0.12);
    cam.add(lens);
  }
  const ir = cylinder(0.045, 0.045, 0.06, glow(COLORS.terracotta, 0.9), 10);
  ir.rotation.x = Math.PI / 2;
  ir.position.set(0, 0, 0.12);
  cam.add(ir);
  cam.position.y = 1.25;
  stand.add(cam);
  stand.position.x = -1.15;
  group.add(stand);
  group.userData.ir = ir;

  // --- Raspberry Pi ---
  const pi = new THREE.Group();
  pi.add(slab(1.0, 0.05, 0.7, matte(COLORS.green, { roughness: 0.8 }), 0, 0, 0));
  pi.add(slab(0.3, 0.14, 0.26, steelMat, -0.3, 0.05, -0.18)); // USB block
  pi.add(slab(0.26, 0.12, 0.24, steelMat, -0.3, 0.05, 0.2));
  const gpio = slab(0.62, 0.08, 0.06, matte(COLORS.charcoal), 0.1, 0.05, -0.28);
  pi.add(gpio);
  const led = slab(0.05, 0.03, 0.05, glow(COLORS.green, 1.4), 0.38, 0.05, 0.24);
  pi.add(led);
  pi.position.set(0.55, 0, -0.5);
  pi.rotation.y = -0.25;
  group.add(pi);
  group.userData.led = led;

  // --- 3x3 haptic motor grid on a fabric strap ---
  const strap = slab(1.5, 0.04, 1.5, matte(0x3b3f4a, { roughness: 0.95 }), 0.75, 0, 0.9);
  group.add(strap);

  const motors = [];
  const pitch = 0.44;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const cell = new THREE.Group();
      // Motor can.
      const can = cylinder(0.14, 0.14, 0.1, matte(COLORS.charcoalLight, { roughness: 0.5 }), 10);
      can.position.y = 0.05;
      cell.add(can);
      // Test LED beside it, which is what actually glows.
      const l = cylinder(0.05, 0.05, 0.06, glow(COLORS.red, 0.15), 8);
      l.position.set(0, 0.12, 0);
      cell.add(l);
      cell.position.set(0.75 + (c - 1) * pitch, 0.04, 0.9 + (r - 1) * pitch);
      cell.userData.cellIndex = r * 3 + c;
      cell.userData.lamp = l;
      group.add(cell);
      motors.push(cell);
    }
  }
  group.userData.motors = motors;

  return group;
}

/**
 * The grid reacts as if a trashcan were sweeping past: one column lights up,
 * and its intensity rises as the simulated distance shrinks.
 */
export function animateWearable(group, t) {
  const motors = group.userData.motors;
  if (!motors) return;

  // Which column the "detection" currently sits in, and how close it is.
  const sweep = (Math.sin(t * 0.55) + 1) / 2; // 0..1
  const activeCol = sweep * 2; // 0..2
  const closeness = 0.35 + 0.65 * ((Math.sin(t * 0.9) + 1) / 2);

  for (const cell of motors) {
    const c = cell.userData.cellIndex % 3;
    const d = Math.abs(c - activeCol);
    const strength = Math.max(0, 1 - d) * closeness;
    cell.userData.lamp.material.emissiveIntensity = 0.12 + strength * 2.2;
    // Buzz: tiny vertical jitter scaled by intensity.
    cell.position.y = 0.04 + Math.sin(t * 45 + c * 2) * 0.012 * strength;
  }

  if (group.userData.led) {
    group.userData.led.material.emissiveIntensity = 1.0 + Math.sin(t * 3) * 0.5;
  }
  if (group.userData.ir) {
    group.userData.ir.material.emissiveIntensity = 0.7 + Math.sin(t * 2.2) * 0.3;
  }
}

import * as THREE from 'three';
import { COLORS, matte, glow } from '../palette.js';
import { box, slab, cylinder } from './helpers.js';

/**
 * Contact station: a desk letter tray with mail in it and a small lamp,
 * the warm full stop at the end of the bench.
 */
export function buildMailbox() {
  const group = new THREE.Group();
  const steel = matte(COLORS.steel, { roughness: 0.42, metalness: 0.55 });

  // --- Letter tray ---
  const tray = new THREE.Group();
  tray.add(slab(2.1, 0.06, 1.5, steel, 0, 0, 0));
  // Low walls.
  tray.add(box(2.1, 0.3, 0.05, steel, 0, 0.15, -0.72));
  tray.add(box(0.05, 0.3, 1.5, steel, -1.02, 0.15, 0));
  tray.add(box(0.05, 0.3, 1.5, steel, 1.02, 0.15, 0));
  // Feet.
  for (const [x, z] of [[-0.85, -0.6], [0.85, -0.6], [-0.85, 0.6], [0.85, 0.6]]) {
    tray.add(box(0.1, 0.18, 0.1, steel, x, -0.09, z));
  }
  tray.position.set(0.75, 0.18, 0);
  group.add(tray);

  // --- Envelopes ---
  const paper = matte(COLORS.cream, { roughness: 0.96 });
  const accent = matte(COLORS.terracotta, { roughness: 0.9 });
  for (let i = 0; i < 3; i++) {
    const env = slab(1.7, 0.035, 1.1, i === 2 ? accent : paper, 0.75, 0.21 + i * 0.04, 0.03);
    env.rotation.y = (i - 1) * 0.05;
    env.rotation.z = 0.015 * i;
    group.add(env);
  }
  // Flap line on the top envelope.
  const flap = slab(1.2, 0.01, 0.02, matte(COLORS.woodDark, { roughness: 0.9 }), 0.75, 0.3, 0.03);
  group.add(flap);

  // --- Desk lamp, the light source that anchors this end of the bench ---
  const lamp = new THREE.Group();
  const lampMat = matte(COLORS.terracotta, { roughness: 0.6 });
  lamp.add(cylinder(0.42, 0.48, 0.07, lampMat, 16));
  lamp.children[0].position.y = 0.035;

  const arm = cylinder(0.05, 0.05, 1.7, lampMat, 8);
  arm.position.set(0, 0.88, 0);
  arm.rotation.z = 0.2;
  lamp.add(arm);

  const shade = new THREE.Mesh(
    new THREE.ConeGeometry(0.46, 0.5, 16, 1, true),
    new THREE.MeshStandardMaterial({
      color: COLORS.terracotta,
      roughness: 0.6,
      side: THREE.DoubleSide,
      flatShading: true,
    })
  );
  shade.position.set(-0.3, 1.72, 0.1);
  shade.rotation.x = 0.5;
  shade.rotation.z = -0.25;
  shade.castShadow = true;
  lamp.add(shade);

  // The bulb: emissive, plus a real point light so the lamp actually lights.
  const bulb = cylinder(0.14, 0.14, 0.05, glow(0xffd9a0, 0.85), 12);
  bulb.position.set(-0.3, 1.58, 0.16);
  lamp.add(bulb);

  const lampLight = new THREE.PointLight(0xffc98a, 5.5, 8, 2);
  lampLight.position.set(-0.45, 1.4, 0.45);
  lampLight.castShadow = true;
  lampLight.shadow.mapSize.set(512, 512);
  lampLight.shadow.bias = -0.004;
  lamp.add(lampLight);

  lamp.position.set(-1.75, 0, -0.35);
  group.add(lamp);

  group.userData.bulb = bulb;
  group.userData.lampLight = lampLight;
  return group;
}

/** A barely-there filament flicker, so the lamp feels like a real bulb. */
export function animateMailbox(group, t) {
  const flicker = 1 + Math.sin(t * 7.3) * 0.015 + Math.sin(t * 2.1) * 0.02;
  if (group.userData.lampLight) group.userData.lampLight.intensity = 5.5 * flicker;
  if (group.userData.bulb) group.userData.bulb.material.emissiveIntensity = 0.85 * flicker;
}

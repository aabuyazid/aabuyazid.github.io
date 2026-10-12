import * as THREE from 'three';
import { COLORS, matte } from '../palette.js';
import { box, slab, cylinder } from './helpers.js';

/**
 * Crowdsource station: a desktop monitor running the compression slider,
 * with a stack of printed MTurk task sheets beside it.
 */
export function buildMonitor(screenTexture) {
  const group = new THREE.Group();
  const shell = matte(COLORS.charcoal, { roughness: 0.65 });

  // Stand.
  const base = cylinder(0.62, 0.72, 0.07, shell, 14);
  base.position.y = 0.035;
  group.add(base);
  const neck = box(0.22, 0.95, 0.16, shell, 0, 0.52, -0.05);
  neck.rotation.x = 0.07;
  group.add(neck);

  // Panel.
  const panel = new THREE.Group();
  panel.add(box(3.4, 2.1, 0.11, shell, 0, 0, 0));

  const screenMat = new THREE.MeshStandardMaterial({
    map: screenTexture,
    emissive: 0xffffff,
    emissiveMap: screenTexture,
    emissiveIntensity: 0.55,
    roughness: 0.42,
    metalness: 0,
  });
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(3.14, 1.84), screenMat);
  screen.position.z = 0.058;
  panel.add(screen);

  panel.position.set(0, 2.05, -0.02);
  panel.rotation.x = -0.05;
  group.add(panel);

  // Paper stack of task printouts.
  const paper = matte(COLORS.cream, { roughness: 0.96 });
  for (let i = 0; i < 4; i++) {
    const sheet = slab(1.15, 0.015, 1.5, paper, 2.25, i * 0.016, 0.55);
    sheet.rotation.y = (i - 1.5) * 0.035;
    group.add(sheet);
  }

  // A coffee ring's worth of mug.
  const mug = cylinder(0.26, 0.23, 0.42, matte(COLORS.terracotta, { roughness: 0.75 }), 14);
  mug.position.set(-2.0, 0.21, 0.6);
  group.add(mug);
  const coffee = cylinder(0.22, 0.22, 0.02, matte(0x2a1a10, { roughness: 0.3 }), 14);
  coffee.position.set(-2.0, 0.42, 0.6);
  group.add(coffee);

  return group;
}

import * as THREE from 'three';
import { COLORS, matte } from '../palette.js';
import { box, slab, cylinder } from './helpers.js';

/**
 * About station: a framed portrait on a small easel, with a brass nameplate.
 */
export function buildFrame(textures) {
  const group = new THREE.Group();

  const frameMat = matte(COLORS.woodDark, { roughness: 0.7 });
  const matMat = matte(COLORS.cream, { roughness: 0.95 });

  // Frame body, tilted back slightly as if resting on an easel.
  const frame = new THREE.Group();
  frame.add(box(1.7, 2.0, 0.09, frameMat, 0, 1.0, 0));
  frame.add(box(1.42, 1.72, 0.03, matMat, 0, 1.0, 0.055));

  // The portrait itself.
  const photoMat = new THREE.MeshStandardMaterial({
    map: textures.portrait ?? null,
    color: textures.portrait ? 0xffffff : COLORS.charcoalLight,
    roughness: 0.75,
    metalness: 0,
  });
  const photo = new THREE.Mesh(new THREE.PlaneGeometry(1.18, 1.18), photoMat);
  photo.position.set(0, 1.12, 0.072);
  frame.add(photo);

  frame.rotation.x = -0.1;
  frame.position.z = 0.1;
  group.add(frame);

  // Easel leg behind the frame.
  const leg = box(0.1, 1.9, 0.1, frameMat, 0, 0.95, -0.42);
  leg.rotation.x = 0.26;
  group.add(leg);

  // Brass nameplate on the desk in front.
  const plate = slab(1.5, 0.05, 0.34, matte(COLORS.brass, { roughness: 0.4, metalness: 0.6 }), 0, 0, 0.95);
  plate.rotation.x = -0.18;
  group.add(plate);

  // A couple of pencils, for life.
  const pencilMat = matte(COLORS.terracotta);
  for (let i = 0; i < 2; i++) {
    const p = cylinder(0.035, 0.035, 0.85, pencilMat, 6);
    p.rotation.z = Math.PI / 2;
    p.rotation.y = 0.3 + i * 0.5;
    p.position.set(1.35 + i * 0.1, 0.035, 0.75 + i * 0.22);
    group.add(p);
  }

  return group;
}

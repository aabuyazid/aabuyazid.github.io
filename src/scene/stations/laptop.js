import * as THREE from 'three';
import { COLORS, matte } from '../palette.js';
import { box, slab } from './helpers.js';

/**
 * CV station: an open laptop whose screen runs the career timeline.
 */
export function buildLaptop(screenTexture) {
  const group = new THREE.Group();
  const shell = matte(COLORS.charcoalLight, { roughness: 0.55, metalness: 0.25 });

  // Base and keyboard deck.
  group.add(slab(3.0, 0.11, 2.1, shell, 0, 0, 0));

  const keyMat = matte(0x23201c, { roughness: 0.85 });
  const keyWell = slab(2.5, 0.015, 1.1, keyMat, 0, 0.11, -0.25);
  group.add(keyWell);

  // Individual keys, kept coarse: 14 x 5 would be too many draw calls, so use
  // one instanced mesh for the whole keyboard.
  const cols = 14;
  const rows = 5;
  const keyGeo = new THREE.BoxGeometry(0.14, 0.03, 0.14);
  const keys = new THREE.InstancedMesh(keyGeo, keyMat, cols * rows);
  keys.castShadow = true;
  const m = new THREE.Matrix4();
  let i = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      m.setPosition(
        -1.17 + c * 0.18,
        0.135,
        -0.68 + r * 0.19
      );
      keys.setMatrixAt(i++, m);
    }
  }
  keys.instanceMatrix.needsUpdate = true;
  group.add(keys);

  // Trackpad.
  group.add(slab(0.9, 0.012, 0.6, matte(0x2c2824, { roughness: 0.4 }), 0, 0.11, 0.66));

  // Lid.
  const lid = new THREE.Group();
  lid.add(box(3.0, 2.0, 0.09, shell, 0, 1.0, 0));

  const screenMat = new THREE.MeshStandardMaterial({
    map: screenTexture,
    emissive: 0xffffff,
    emissiveMap: screenTexture,
    emissiveIntensity: 0.5,
    roughness: 0.45,
    metalness: 0,
  });
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(2.76, 1.78), screenMat);
  screen.position.set(0, 1.0, 0.05);
  lid.add(screen);

  lid.position.set(0, 0.05, -1.02);
  lid.rotation.x = -0.19; // open, leaning back
  group.add(lid);

  // Notebook and pen beside the laptop.
  const book = slab(1.3, 0.14, 1.7, matte(COLORS.terracotta, { roughness: 0.9 }), 2.5, 0, 0.3);
  book.rotation.y = 0.16;
  group.add(book);
  const pen = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.035, 0.95, 8),
    matte(COLORS.charcoal)
  );
  pen.rotation.z = Math.PI / 2;
  pen.rotation.y = 0.5;
  pen.position.set(2.5, 0.175, 0.35);
  pen.castShadow = true;
  group.add(pen);

  return group;
}

import * as THREE from 'three';
import { COLORS, matte, glow } from '../palette.js';
import { box, slab } from './helpers.js';

/**
 * CCF station: a PCB carrying a chip whose 4x4 grid of processing elements
 * lights up in sequence, echoing a dataflow graph being routed across a CGRA.
 */
export function buildChip() {
  const group = new THREE.Group();

  // Board.
  const board = slab(3.0, 0.08, 2.2, matte(COLORS.green, { roughness: 0.8 }), 0, 0, 0);
  group.add(board);

  // Chip package.
  const pkg = slab(1.75, 0.16, 1.75, matte(COLORS.charcoal, { roughness: 0.6 }), 0, 0.08, 0);
  group.add(pkg);

  // 4x4 grid of processing elements.
  const cells = [];
  const n = 4;
  const pitch = 0.36;
  const offset = ((n - 1) * pitch) / 2;
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const mat = glow(COLORS.amber, 0.12);
      const cell = slab(0.24, 0.05, 0.24, mat, c * pitch - offset, 0.24, r * pitch - offset);
      cell.userData.gridIndex = r * n + c;
      group.add(cell);
      cells.push(cell);
    }
  }

  // Nearest-neighbour interconnect between the PEs.
  const linkMat = matte(COLORS.charcoalLight, { roughness: 0.7 });
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (c < n - 1) {
        group.add(
          box(pitch - 0.24, 0.02, 0.04, linkMat, c * pitch - offset + pitch / 2, 0.25, r * pitch - offset)
        );
      }
      if (r < n - 1) {
        group.add(
          box(0.04, 0.02, pitch - 0.24, linkMat, c * pitch - offset, 0.25, r * pitch - offset + pitch / 2)
        );
      }
    }
  }

  // Pin headers along two edges.
  const pinMat = matte(COLORS.steel, { roughness: 0.35, metalness: 0.7 });
  for (let i = 0; i < 12; i++) {
    const x = -1.32 + i * 0.24;
    group.add(slab(0.07, 0.1, 0.07, pinMat, x, 0.08, -0.98));
    group.add(slab(0.07, 0.1, 0.07, pinMat, x, 0.08, 0.98));
  }

  // Two capacitors for silhouette interest.
  const capMat = matte(COLORS.charcoalLight, { roughness: 0.5 });
  for (let i = 0; i < 2; i++) {
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.26, 8), capMat);
    cap.position.set(1.15, 0.21, -0.55 + i * 1.1);
    cap.castShadow = true;
    group.add(cap);
  }

  group.userData.cells = cells;
  group.userData.gridSize = n;
  return group;
}

/**
 * Animate the PE grid: a wavefront sweeping across the array, the way a
 * scheduled loop iteration would propagate through the fabric.
 */
export function animateChip(group, t) {
  const cells = group.userData.cells;
  if (!cells) return;
  const n = group.userData.gridSize;
  for (const cell of cells) {
    const i = cell.userData.gridIndex;
    const r = Math.floor(i / n);
    const c = i % n;
    // Diagonal wavefront with a soft falloff.
    const phase = t * 1.6 - (r + c) * 0.45;
    const pulse = Math.max(0, Math.sin(phase));
    cell.material.emissiveIntensity = 0.1 + pulse * pulse * 1.5;
  }
}

import * as THREE from 'three';
import { COLORS, matte } from '../palette.js';
import { slab, cylinder, sphere } from './helpers.js';

/**
 * Inverse Cooking station: a plated dish with a recipe card beside it —
 * an image of food on one side, its generated recipe on the other.
 */
export function buildPlate() {
  const group = new THREE.Group();

  // Plate.
  const plate = cylinder(1.15, 0.95, 0.1, matte(COLORS.cream, { roughness: 0.55 }), 24);
  plate.position.y = 0.05;
  group.add(plate);
  const well = cylinder(0.92, 0.92, 0.04, matte(0xe6d9c4, { roughness: 0.6 }), 24);
  well.position.y = 0.1;
  group.add(well);

  // Food: a few low-poly components so it reads as a dish, not a blob.
  const greens = matte(COLORS.olive, { roughness: 0.85 });
  const protein = matte(0xa5633a, { roughness: 0.8 });
  const sauce = matte(COLORS.terracotta, { roughness: 0.7 });

  const main = sphere(0.33, protein, 0);
  main.scale.set(1.25, 0.6, 1.0);
  main.position.set(-0.18, 0.2, 0.05);
  group.add(main);

  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const g = sphere(0.14, greens, 0);
    g.scale.set(1, 0.65, 1);
    g.position.set(Math.cos(a) * 0.48 + 0.15, 0.17, Math.sin(a) * 0.42 + 0.1);
    g.rotation.y = a;
    group.add(g);
  }

  const drizzle = cylinder(0.3, 0.3, 0.015, sauce, 16);
  drizzle.position.set(0.3, 0.13, -0.3);
  group.add(drizzle);

  // Recipe card: the model's output, propped against the plate.
  const card = slab(1.5, 0.02, 1.0, matte(COLORS.cream, { roughness: 0.95 }), 1.95, 0, 0.35);
  card.rotation.y = -0.22;
  group.add(card);

  // Ruled lines on the card, suggesting ingredients and steps.
  const ink = matte(COLORS.charcoalLight, { roughness: 0.9 });
  for (let i = 0; i < 6; i++) {
    const w = i === 0 ? 0.75 : 0.95 - (i % 3) * 0.2;
    const line = slab(w, 0.006, 0.035, ink, 1.95 - 0.2 + (0.95 - w) / 2 - 0.1, 0.02, 0.0 + i * 0.13);
    line.rotation.y = -0.22;
    group.add(line);
  }

  // Fork: handle, a flared neck, then the tines, all touching end to end.
  const steel = matte(COLORS.steel, { roughness: 0.3, metalness: 0.75 });
  const forkX = -1.75;
  group.add(slab(0.07, 0.025, 0.95, steel, forkX, 0, 0.4)); // handle
  group.add(slab(0.17, 0.025, 0.2, steel, forkX, 0, -0.17)); // neck
  for (let i = 0; i < 4; i++) {
    group.add(slab(0.028, 0.022, 0.3, steel, forkX - 0.06 + i * 0.04, 0, -0.42));
  }

  return group;
}

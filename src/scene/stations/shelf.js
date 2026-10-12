import * as THREE from 'three';
import { COLORS, matte } from '../palette.js';
import { box, slab } from './helpers.js';

const SPINE_COLORS = [COLORS.terracotta, COLORS.olive, COLORS.brass, 0x6a7f8c];

/**
 * Repositories station: a small desktop bookshelf where each book is a repo.
 */
export function buildShelf(repos) {
  const group = new THREE.Group();
  const woodMat = matte(COLORS.woodDark, { roughness: 0.8 });

  const width = 3.2;
  const height = 2.0;
  const depth = 1.0;

  // Carcass.
  group.add(slab(width, 0.09, depth, woodMat, 0, 0, 0));
  group.add(slab(width, 0.09, depth, woodMat, 0, height, 0));
  group.add(box(0.09, height, depth, woodMat, -width / 2 + 0.045, height / 2, 0));
  group.add(box(0.09, height, depth, woodMat, width / 2 - 0.045, height / 2, 0));
  group.add(box(width, height, 0.06, woodMat, 0, height / 2, -depth / 2 + 0.03));
  // Middle shelf.
  group.add(slab(width - 0.18, 0.07, depth - 0.06, woodMat, 0, height / 2 - 0.035, 0));

  // The repos stand together on the lower shelf like books actually sit:
  // shoulder to shoulder, starting from the left panel.
  const bookDepth = depth - 0.24;
  const bookZ = 0.04;
  const lowerClear = height / 2 - 0.035 - 0.09;
  const shelfLeft = -width / 2 + 0.09;

  let cursor = shelfLeft + 0.1;
  repos.forEach((repo, i) => {
    const w = 0.3 + ((i * 5) % 3) * 0.055;
    const h = lowerClear * (0.8 + ((i * 7) % 4) * 0.045);
    const x = cursor + w / 2;

    const book = slab(
      w,
      h,
      bookDepth,
      matte(SPINE_COLORS[i % SPINE_COLORS.length], { roughness: 0.85 }),
      x,
      0.09,
      bookZ
    );
    // The last one leans into the gap, the way the end of a row always does.
    if (i === repos.length - 1) {
      book.rotation.z = -0.1;
      book.position.x += 0.04;
    }
    book.userData.repo = repo;
    group.add(book);

    // Two pale bands on the front face, standing in for title text.
    for (let b = 0; b < 2; b++) {
      const label = slab(
        w * 0.66,
        b === 0 ? 0.1 : 0.05,
        0.015,
        matte(COLORS.cream, { roughness: 0.95 }),
        book.position.x,
        0.09 + h * (b === 0 ? 0.68 : 0.52),
        bookZ + bookDepth / 2
      );
      label.rotation.z = book.rotation.z;
      group.add(label);
    }

    cursor += w + 0.025;
  });

  // Upper shelf: a flat stack, so the shelf does not read as half empty.
  const stackColors = [COLORS.olive, COLORS.terracotta, 0x6a7f8c];
  stackColors.forEach((color, i) => {
    const stacked = slab(
      1.5 - i * 0.1,
      0.14,
      bookDepth - 0.05,
      matte(color, { roughness: 0.88 }),
      shelfLeft + 0.85,
      height / 2 + 0.035 + i * 0.14,
      bookZ
    );
    stacked.rotation.y = (i - 1) * 0.045;
    group.add(stacked);
  });

  return group;
}

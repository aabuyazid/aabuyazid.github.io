import * as THREE from 'three';
import { COLORS, matte } from './palette.js';
import { stations as CONTENT } from '../data/content.js';
import { createCompressionScreen, createTimelineScreen } from './screens.js';
import { makePickable, box, slab } from './stations/helpers.js';
import { createWoodTexture } from './textures.js';

import { buildFrame } from './stations/frame.js';
import { buildChip, animateChip } from './stations/chip.js';
import { buildWearable, animateWearable } from './stations/wearable.js';
import { buildMonitor } from './stations/monitor.js';
import { buildPlate } from './stations/plate.js';
import { buildLaptop } from './stations/laptop.js';
import { buildShelf } from './stations/shelf.js';
import { buildHobbies, animateHobbies } from './stations/hobbies.js';
import { buildMailbox, animateMailbox } from './stations/mailbox.js';

// Where each station sits along the bench. Order matches content.js.
// Spacing is wide enough that the neighbouring station sits just outside the
// frame at the camera's working distance; see createCameraRig.
// `lookY` is roughly the visual centre of each station, so flat things like the
// plate and the chip board are not left sitting at the bottom of the frame.
const LAYOUT = {
  about: { x: -16.0, lookY: 1.0 },
  ccf: { x: -10.0, lookY: 0.5 },
  trashcan: { x: -4.0, lookY: 0.85 },
  crowdsource: { x: 2.2, lookY: 1.45 },
  'inverse-cooking': { x: 8.4, lookY: 0.45 },
  cv: { x: 14.2, lookY: 0.95 },
  repositories: { x: 20.4, lookY: 1.05 },
  hobbies: { x: 26.2, lookY: 0.6 },
  contact: { x: 32.4, lookY: 0.9 },
};

// The desk runs a good way past the end stations so the camera never sees it
// stop, even with the idle drift and the panel's sideways shift.
const DESK_MIN = -23.0;
const DESK_MAX = 40.0;

export function buildWorld({ textures }) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(COLORS.wallDeep);
  // Fog starts well beyond the working distance so the near objects stay crisp
  // and only the far ends of the bench fall away.
  scene.fog = new THREE.Fog(COLORS.wallDeep, 20, 58);

  const root = new THREE.Group();
  scene.add(root);

  // ---------- Room ----------
  const deskWidth = DESK_MAX - DESK_MIN;
  const deskCenter = (DESK_MIN + DESK_MAX) / 2;

  const DESK_DEPTH = 5.4;
  const woodTex = createWoodTexture({ repeatX: Math.round(deskWidth / 6), repeatY: 1 });
  const woodMat = new THREE.MeshStandardMaterial({
    map: woodTex,
    roughness: 0.78,
    metalness: 0,
  });
  const desk = slab(deskWidth, 0.35, DESK_DEPTH, woodMat, deskCenter, -0.35, 0);
  desk.castShadow = false;
  root.add(desk);

  // Front edge lip, so the desk reads as a solid slab.
  root.add(
    box(
      deskWidth,
      0.1,
      0.18,
      matte(COLORS.woodDark, { flat: false, roughness: 0.8 }),
      deskCenter,
      -0.06,
      DESK_DEPTH / 2
    )
  );

  // Back wall. A vertical gradient baked into the vertex colours keeps it from
  // reading as a flat black void: warm near the desk, falling off upward.
  const WALL_H = 20;
  const WALL_Y = 6.5;
  const wallGeo = new THREE.PlaneGeometry(deskWidth + 24, WALL_H, 1, 30);
  const wallTop = new THREE.Color(COLORS.wallDeep);
  const wallBottom = new THREE.Color(COLORS.wall);
  const pos = wallGeo.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    // Fade to dark over the first few units above the desk, so the warm band
    // sits right behind the objects instead of below them.
    const worldY = pos.getY(i) + WALL_Y;
    const f = THREE.MathUtils.clamp((worldY + 1) / 7, 0, 1);
    c.copy(wallBottom).lerp(wallTop, Math.pow(f, 1.1));
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  wallGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const wall = new THREE.Mesh(
    wallGeo,
    new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 1.0,
      metalness: 0,
    })
  );
  wall.position.set(deskCenter, WALL_Y, -4.2);
  wall.receiveShadow = true;
  root.add(wall);

  // Floor, caught only by the edges of the light but it grounds the scene.
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(deskWidth + 24, 30),
    matte(0x1b1511, { flat: false, roughness: 1.0 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(deskCenter, -3.2, 4);
  floor.receiveShadow = true;
  root.add(floor);

  // ---------- Lighting ----------
  // Warm tungsten key from the upper left, cool rim from behind right,
  // and a dim ambient so nothing goes fully black.
  const ambient = new THREE.AmbientLight(0xffe2bd, 0.28);
  scene.add(ambient);

  const hemi = new THREE.HemisphereLight(0xffd9ad, 0x2a1d14, 0.35);
  scene.add(hemi);

  // The key light travels with the camera. A fixed light covering the whole
  // bench would need a huge shadow frustum and the shadows would turn to mush,
  // so instead it keeps a tight frustum around whatever we are looking at.
  const key = new THREE.DirectionalLight(0xffc98f, 2.4);
  key.position.set(-7, 11, 8);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 40;
  const s = 11;
  key.shadow.camera.left = -s;
  key.shadow.camera.right = s;
  key.shadow.camera.top = s;
  key.shadow.camera.bottom = -s;
  key.shadow.bias = -0.0012;
  key.shadow.normalBias = 0.02;
  scene.add(key);
  scene.add(key.target);

  const rim = new THREE.DirectionalLight(0x8fb6d6, 0.7);
  rim.position.set(10, 6, -8);
  scene.add(rim);

  // Wall wash: a soft warm pool behind the objects so the backdrop reads as a
  // wall catching spill light rather than empty space. It travels with the
  // camera along with the key light.
  const wash = new THREE.PointLight(0xffb978, 26, 20, 2.0);
  wash.position.set(0, 3.2, -2.0);
  scene.add(wash);

  // ---------- Stations ----------
  const cvEntries = buildTimelineEntries();
  const compression = createCompressionScreen();
  const timeline = createTimelineScreen(cvEntries);

  const builders = {
    about: () => buildFrame(textures),
    ccf: () => buildChip(),
    trashcan: () => buildWearable(),
    crowdsource: () => buildMonitor(compression.texture),
    'inverse-cooking': () => buildPlate(),
    cv: () => buildLaptop(timeline.texture),
    repositories: () =>
      buildShelf(CONTENT.find((st) => st.id === 'repositories').repos),
    hobbies: () => buildHobbies(),
    contact: () => buildMailbox(),
  };

  const built = {};
  const order = [];

  for (const station of CONTENT) {
    const make = builders[station.id];
    if (!make) continue;
    const layout = LAYOUT[station.id] ?? { x: 0 };

    const group = make();
    group.position.x = layout.x;
    if (layout.scale) group.scale.setScalar(layout.scale);
    makePickable(group, station.id);
    root.add(group);

    built[station.id] = {
      id: station.id,
      group,
      x: layout.x,
      lookY: layout.lookY ?? 1.0,
    };
    order.push(built[station.id]);
  }

  // Dust motes drifting in the key light.
  const dust = createDust(deskCenter, deskWidth);
  root.add(dust.points);

  /** Keep the key light and its shadow frustum centred on the camera's focus. */
  function followLights(x) {
    key.position.x = x - 7;
    key.target.position.set(x, 0, 0);
    key.target.updateMatrixWorld();
    rim.position.x = x + 10;
    wash.position.x = x - 1.5;
  }

  function update(t, dt) {
    compression.draw(t);
    timeline.draw(t);
    if (built.ccf) animateChip(built.ccf.group, t);
    if (built.trashcan) animateWearable(built.trashcan.group, t);
    if (built.hobbies) animateHobbies(built.hobbies.group, t);
    if (built.contact) animateMailbox(built.contact.group, t);
    dust.update(t, dt);
  }

  return {
    scene,
    root,
    stations: built,
    order,
    update,
    followLights,
    lights: { key, rim, ambient, hemi },
  };
}

function buildTimelineEntries() {
  const cv = CONTENT.find((s) => s.id === 'cv')?.cv;
  if (!cv) return [];
  return [...cv.experience, ...cv.education]
    .map((e) => ({ title: e.title, year: e.year }))
    .slice(0, 5);
}

function createDust(centerX, width) {
  const count = 220;
  const positions = new Float32Array(count * 3);
  const speeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = centerX + (Math.random() - 0.5) * width;
    positions[i * 3 + 1] = Math.random() * 7 - 0.5;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 7;
    speeds[i] = 0.08 + Math.random() * 0.16;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const points = new THREE.Points(
    geo,
    new THREE.PointsMaterial({
      color: 0xffd9a8,
      size: 0.028,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
      sizeAttenuation: true,
    })
  );
  points.frustumCulled = false;

  function update(t, dt) {
    const arr = geo.attributes.position.array;
    for (let i = 0; i < count; i++) {
      const iy = i * 3 + 1;
      arr[iy] += speeds[i] * dt * 0.35;
      arr[i * 3] += Math.sin(t * 0.3 + i) * dt * 0.05;
      if (arr[iy] > 6.5) arr[iy] = -0.5;
    }
    geo.attributes.position.needsUpdate = true;
  }

  return { points, update };
}

export { LAYOUT, DESK_MIN, DESK_MAX };

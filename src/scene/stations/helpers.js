import * as THREE from 'three';

/** Box mesh with shadows enabled, positioned by its centre. */
export function box(w, h, d, material, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

/** Box resting ON the surface: y is the bottom, not the centre. */
export function slab(w, h, d, material, x = 0, yBottom = 0, z = 0) {
  return box(w, h, d, material, x, yBottom + h / 2, z);
}

export function cylinder(rTop, rBottom, h, material, segments = 10) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(rTop, rBottom, h, segments),
    material
  );
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

export function sphere(r, material, detail = 0) {
  const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(r, detail), material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

/**
 * Mark a subtree as clickable for the raycaster in interaction.js.
 * Every descendant mesh points back at the owning station id.
 */
export function makePickable(group, stationId) {
  group.traverse((o) => {
    if (o.isMesh) o.userData.stationId = stationId;
  });
  return group;
}

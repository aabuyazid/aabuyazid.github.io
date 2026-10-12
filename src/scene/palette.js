import * as THREE from 'three';

// Warm, photographic palette. Mirrors the CSS custom properties in src/styles/main.css.
export const COLORS = {
  wall: 0x3a2e25,
  wallDeep: 0x1d1611,
  wood: 0x7a5436,
  woodDark: 0x5a3b26,
  cream: 0xf2e8d8,
  creamDim: 0xcdbfaa,
  terracotta: 0xc4683c,
  olive: 0x8a9159,
  charcoal: 0x332e29,
  charcoalLight: 0x4a433b,
  amber: 0xe9a85c,
  screen: 0x9ec6d4,
  steel: 0x8e8d87,
  brass: 0xc69a53,
  green: 0x6f8f5a,
  red: 0xb8503c,
};

/**
 * Flat-shaded matte material: the base look for every low-poly object on the desk.
 */
export function matte(color, { flat = true, roughness = 0.85, metalness = 0.0 } = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness,
    flatShading: flat,
  });
}

/**
 * Emissive material for the parts that should glow and catch the bloom pass:
 * the CGRA grid, haptic motors, LEDs and screens.
 */
export function glow(color, intensity = 1.0) {
  return new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: intensity,
    roughness: 0.5,
    metalness: 0,
    flatShading: true,
  });
}

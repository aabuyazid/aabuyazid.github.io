import * as THREE from 'three';

/**
 * Pointer picking over the desk objects. Hovering lifts a station slightly and
 * warms its emissive response; clicking opens that station.
 */
export function createInteraction({ canvas, camera, stations, onSelect }) {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let hovered = null;
  let pointerInside = false;

  // Remember each station's resting height so hover can offset from it.
  for (const st of Object.values(stations)) {
    st.baseY = st.group.position.y;
    st.hoverAmount = 0;
  }

  const pickables = Object.values(stations).map((st) => st.group);

  function updatePointer(event) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    pointerInside = true;
  }

  function pick() {
    if (!pointerInside) return null;
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(pickables, true);
    for (const hit of hits) {
      const id = hit.object.userData.stationId;
      if (id) return id;
    }
    return null;
  }

  function onPointerMove(event) {
    updatePointer(event);
  }

  function onPointerLeave() {
    pointerInside = false;
  }

  function onClick(event) {
    updatePointer(event);
    const id = pick();
    if (id) onSelect(id);
  }

  canvas.addEventListener('pointermove', onPointerMove, { passive: true });
  canvas.addEventListener('pointerleave', onPointerLeave, { passive: true });
  canvas.addEventListener('click', onClick);

  /** Called every frame: resolve the hover and ease the lift animation. */
  function update(dt) {
    const id = pick();
    if (id !== hovered) {
      hovered = id;
      canvas.style.cursor = id ? 'pointer' : '';
    }

    for (const st of Object.values(stations)) {
      const want = st.id === hovered ? 1 : 0;
      st.hoverAmount += (want - st.hoverAmount) * Math.min(1, dt * 9);
      st.group.position.y = st.baseY + st.hoverAmount * 0.09;
    }

    return hovered;
  }

  return { update };
}

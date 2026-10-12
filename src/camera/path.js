import * as THREE from 'three';

/**
 * Camera rig that travels along the bench. Scroll position maps to a
 * continuous index across the stations; the camera eases toward the pose for
 * whatever index it currently sits at, so the motion stays smooth whether it
 * is driven by scrolling, a nav click or a deep link.
 */
export function createCameraRig(camera, order) {
  // One pose per station: where the camera sits and what it looks at.
  // The camera sits a fixed height and distance above whatever it is framing,
  // so the viewing angle stays consistent from station to station.
  const RISE = 1.5;
  const DISTANCE = 6.7;
  const poses = order.map((st) => {
    const lookY = st.lookY ?? 1.0;
    return {
      position: new THREE.Vector3(st.x + 0.5, lookY + RISE, DISTANCE),
      target: new THREE.Vector3(st.x, lookY, 0),
    };
  });

  const state = {
    index: 0, // continuous position along the station list
    targetIndex: 0,
    active: 0, // nearest whole station
    lateral: 0, // current sideways shift
    lateralTarget: 0, // where that shift is heading
  };

  const curPos = new THREE.Vector3().copy(poses[0]?.position ?? new THREE.Vector3(0, 3, 8));
  const curLook = new THREE.Vector3().copy(poses[0]?.target ?? new THREE.Vector3());
  const tmpPos = new THREE.Vector3();
  const tmpLook = new THREE.Vector3();

  camera.position.copy(curPos);
  camera.lookAt(curLook);

  function poseAt(index) {
    const clamped = THREE.MathUtils.clamp(index, 0, poses.length - 1);
    const i0 = Math.floor(clamped);
    const i1 = Math.min(i0 + 1, poses.length - 1);
    const f = clamped - i0;
    tmpPos.copy(poses[i0].position).lerp(poses[i1].position, f);
    tmpLook.copy(poses[i0].target).lerp(poses[i1].target, f);
    return { position: tmpPos, target: tmpLook };
  }

  /** Drive the rig from normalised scroll progress (0..1). */
  function setProgress(p) {
    state.targetIndex = THREE.MathUtils.clamp(p, 0, 1) * (poses.length - 1);
  }

  function snapTo(index) {
    state.index = THREE.MathUtils.clamp(index, 0, poses.length - 1);
    state.targetIndex = state.index;
    state.lateral = state.lateralTarget;
  }

  /**
   * Shift the framing sideways, in world units. Positive values push the
   * subject to the right, clearing space on the left for the open panel.
   */
  function setLateralOffset(value) {
    state.lateralTarget = value;
  }

  function update(dt, { t = 0, idle = true, reducedMotion = false } = {}) {
    // Ease the continuous index toward its target.
    const k = reducedMotion ? 1 : 1 - Math.pow(0.0016, dt);
    state.index += (state.targetIndex - state.index) * k;

    const pose = poseAt(state.index);
    curPos.copy(pose.position);
    curLook.copy(pose.target);

    // Slide the framing sideways so the subject clears the content panel.
    state.lateral += (state.lateralTarget - state.lateral) * (reducedMotion ? 1 : k);
    curPos.x -= state.lateral;
    curLook.x -= state.lateral;

    // A slow breathing drift so the shot never feels locked off.
    if (idle && !reducedMotion) {
      curPos.x += Math.sin(t * 0.21) * 0.17;
      curPos.y += Math.sin(t * 0.27 + 1.3) * 0.1;
      curLook.x += Math.sin(t * 0.19 + 0.6) * 0.06;
    }

    camera.position.copy(curPos);
    camera.lookAt(curLook);

    state.active = Math.round(state.index);
    return state.active;
  }

  return {
    setProgress,
    snapTo,
    setLateralOffset,
    update,
    get focusDistance() {
      return camera.position.distanceTo(curLook);
    },
    /** X of the point the camera is currently looking at, for light tracking. */
    get focusX() {
      return curLook.x;
    },
  };
}

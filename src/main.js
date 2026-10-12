import * as THREE from 'three';
import './styles/main.css';

import { stations as CONTENT, stationById } from './data/content.js';
import { buildWorld } from './scene/world.js';
import { createCameraRig } from './camera/path.js';
import { createPost } from './scene/post.js';
import { createInteraction } from './scene/interaction.js';
import { createPanel } from './ui/panels.js';
import { createNav } from './ui/nav.js';
import { renderStation } from './ui/render.js';

const canvas = document.getElementById('scene');
const loaderEl = document.getElementById('loader');
const loaderFill = document.getElementById('loader-fill');
const loaderHint = document.getElementById('loader-hint');
const panelEl = document.getElementById('content');
const toggleEl = document.getElementById('panel-toggle');
const navEl = document.getElementById('nav');
const trackEl = document.getElementById('scroll-track');
const hintEl = document.getElementById('scroll-hint');

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isCoarse = window.matchMedia('(pointer: coarse)').matches;

/* ------------------------------------------------------------------ */
/* Fallback: no WebGL means a plain, fully readable document.          */
/* ------------------------------------------------------------------ */

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext('webgl2') || c.getContext('webgl'))
    );
  } catch {
    return false;
  }
}

function renderFallback(reason) {
  document.body.classList.add('is-fallback');
  loaderEl.hidden = true;
  loaderEl.style.display = 'none';
  panelEl.classList.add('is-open');
  panelEl.innerHTML = CONTENT.map(
    (station) =>
      `<section class="fallback-section" id="${station.id}">${renderStation(station, {
        heading: 'h2',
      })}</section>`
  ).join('');
  if (reason) console.info(`[portfolio] static fallback: ${reason}`);
}

if (!hasWebGL()) {
  renderFallback('WebGL unavailable');
} else {
  start().catch((err) => {
    console.error(err);
    renderFallback('scene failed to start');
  });
}

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */

async function start() {
  const manager = new THREE.LoadingManager();
  manager.onProgress = (_url, loaded, total) => {
    const pct = total ? Math.round((loaded / total) * 100) : 0;
    loaderFill.style.width = `${pct}%`;
  };

  const textures = await loadTextures(manager);

  loaderFill.style.width = '100%';
  loaderHint.textContent = 'Almost there…';

  // ---------- Renderer ----------
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !isCoarse,
    powerPreference: 'high-performance',
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  // Mobile and low-power devices get a lower pixel ratio and a cheaper chain.
  const quality = isCoarse ? 'low' : 'high';
  const maxDpr = quality === 'low' ? 1.5 : 2;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr));

  // A longer lens than the usual default: it compresses the bench and keeps
  // the neighbouring station out of frame.
  const camera = new THREE.PerspectiveCamera(
    38,
    window.innerWidth / window.innerHeight,
    0.1,
    140
  );

  const world = buildWorld({ textures });
  const rig = createCameraRig(camera, world.order);
  const post = createPost(renderer, world.scene, camera, { quality });

  // ---------- UI ----------
  // On wide screens the panel covers the left of the viewport, so the camera
  // slides the subject to the right to keep it visible. On narrow screens the
  // panel is a bottom sheet and no shift is needed.
  const isWide = () => window.matchMedia('(min-width: 901px)').matches;
  const panelShift = () => (isWide() ? 2.4 : 0);

  const panel = createPanel({
    el: panelEl,
    toggle: toggleEl,
    onOpenChange: (open) => rig.setLateralOffset(open ? panelShift() : 0),
    onClose: () => {
      history.replaceState(null, '', window.location.pathname);
    },
  });

  const nav = createNav({
    el: navEl,
    stations: CONTENT,
    onSelect: (id) => goTo(id, { openPanel: true }),
  });

  const interaction = createInteraction({
    canvas,
    camera,
    stations: world.stations,
    onSelect: (id) => goTo(id, { openPanel: true }),
  });

  // ---------- Scroll driving ----------
  // The track gives the document real height: one viewport per station.
  const stationCount = world.order.length;
  trackEl.style.height = `${stationCount * 100}vh`;

  let currentIndex = 0;

  function scrollProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? window.scrollY / max : 0;
  }

  function onScroll() {
    rig.setProgress(scrollProgress());
    if (window.scrollY > 40) hintEl.hidden = true;
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  function indexOf(id) {
    return world.order.findIndex((st) => st.id === id);
  }

  /** Move the camera (and optionally the panel) to a station. */
  function goTo(id, { openPanel = false, instant = false } = {}) {
    const index = indexOf(id);
    if (index < 0) return;

    const jump = instant || reducedMotion;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const y = (index / Math.max(1, stationCount - 1)) * max;
    window.scrollTo({ top: y, behavior: jump ? 'auto' : 'smooth' });
    // A deep link or a reduced-motion jump should arrive immediately rather
    // than easing in from wherever the camera happened to be.
    if (jump) rig.snapTo(index);

    if (openPanel) {
      panel.setContent(stationById[id]);
      panel.setOpen(true);
      history.replaceState(null, '', `#${id}`);
    }
    hintEl.hidden = true;
  }

  // Deep links: /#ccf lands directly on that station with its panel open.
  // The scroll position depends on the track's laid-out height, so resolve it
  // after layout has settled rather than in the same synchronous block.
  const initialHash = window.location.hash.replace('#', '');
  if (initialHash && stationById[initialHash]) {
    panel.setContent(stationById[initialHash]);
    panel.setOpen(true);
    requestAnimationFrame(() => goTo(initialHash, { instant: true }));
  } else {
    panel.setContent(CONTENT[0]);
  }

  window.addEventListener('hashchange', () => {
    const id = window.location.hash.replace('#', '');
    if (id && stationById[id]) goTo(id, { openPanel: true });
  });

  // ---------- Resize ----------
  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr));
    renderer.setSize(w, h);
    post.setSize(w, h);
    // The panel changes from a side panel to a bottom sheet at this breakpoint.
    rig.setLateralOffset(panel.isOpen ? panelShift() : 0);
  }
  window.addEventListener('resize', resize);

  // ---------- Render loop ----------
  const clock = new THREE.Clock();
  let elapsed = 0;

  function frame() {
    const dt = Math.min(clock.getDelta(), 0.1);
    elapsed += dt;

    const active = rig.update(dt, { t: elapsed, idle: true, reducedMotion });
    post.setFocus(rig.focusDistance);
    world.followLights(rig.focusX);

    if (active !== currentIndex) {
      currentIndex = active;
      const station = world.order[active];
      if (station) {
        nav.setActive(station.id);
        // Keep the panel in step with the camera while it is open.
        if (panel.isOpen && panel.currentId !== station.id) {
          panel.setContent(stationById[station.id]);
          history.replaceState(null, '', `#${station.id}`);
        }
      }
    }

    interaction.update(dt);
    world.update(elapsed, dt);
    post.render(dt, elapsed);

    requestAnimationFrame(frame);
  }

  // First frame, then reveal.
  onScroll();
  resize();
  frame();

  // Highlight whatever station the first frame actually settled on, which is
  // not station 0 when the page was opened on a deep link.
  nav.setActive(world.order[currentIndex]?.id ?? world.order[0].id);
  requestAnimationFrame(() => {
    loaderEl.hidden = true;
    setTimeout(() => {
      loaderEl.style.display = 'none';
    }, 800);
  });
}

/** Load the few textures the scene needs. Missing files degrade gracefully. */
function loadTextures(manager) {
  const loader = new THREE.TextureLoader(manager);
  const load = (url) =>
    new Promise((resolve) => {
      loader.load(
        url,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.anisotropy = 4;
          resolve(tex);
        },
        undefined,
        () => resolve(null)
      );
    });

  return Promise.all([load('img/profile/prof-pic.webp')]).then(([portrait]) => ({
    portrait,
  }));
}

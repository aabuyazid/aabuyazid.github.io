import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

/**
 * Film grain + vignette, applied after bloom. Keeping these in one pass keeps
 * the chain short enough to stay cheap on integrated GPUs.
 */
const GrainVignetteShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uGrain: { value: 0.016 },
    uVignette: { value: 1.0 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uGrain;
    uniform float uVignette;
    varying vec2 vUv;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    void main() {
      vec4 color = texture2D(tDiffuse, vUv);

      // Vignette: darken toward the corners.
      vec2 d = vUv - 0.5;
      float vig = smoothstep(0.85, 0.22, length(d) * uVignette);
      color.rgb *= mix(0.55, 1.0, vig);

      // Animated grain, a touch stronger in the midtones like real film.
      float n = hash(vUv * vec2(1920.0, 1080.0) + fract(uTime) * 91.7) - 0.5;
      float luma = dot(color.rgb, vec3(0.299, 0.587, 0.114));
      color.rgb += n * uGrain * mix(0.7, 0.5, luma);

      gl_FragColor = color;
    }
  `,
};

export function createPost(renderer, scene, camera, { quality = 'high' } = {}) {
  const size = renderer.getSize(new THREE.Vector2());
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  // Depth of field: the single biggest contributor to the photographic feel.
  // Too expensive on low-power devices, so it is high-quality only.
  let bokeh = null;
  if (quality === 'high') {
    bokeh = new BokehPass(scene, camera, {
      focus: 7.0,
      aperture: 0.00055,
      maxblur: 0.009,
    });
    composer.addPass(bokeh);
  }

  let bloom = null;
  if (quality !== 'low') {
    bloom = new UnrealBloomPass(
      new THREE.Vector2(size.x, size.y),
      0.32, // strength
      0.65, // radius
      0.78 // threshold: only the emissive bits bloom
    );
    composer.addPass(bloom);
  }

  const grain = new ShaderPass(GrainVignetteShader);
  if (quality === 'low') grain.uniforms.uGrain.value = 0.03;
  composer.addPass(grain);

  composer.addPass(new OutputPass());

  return {
    composer,
    bloom,
    bokeh,
    /** Keep the focal plane on whatever the camera is looking at. */
    setFocus(distance) {
      if (bokeh) bokeh.uniforms.focus.value = distance;
    },
    render(dt, t) {
      grain.uniforms.uTime.value = t;
      composer.render(dt);
    },
    setSize(w, h) {
      composer.setSize(w, h);
      bloom?.setSize(w, h);
    },
  };
}

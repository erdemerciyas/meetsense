import * as THREE from "three";
import { buildMark, loadMarkPaths } from "./mark3d";

/**
 * The loader's opening shot. The mark starts as silence — nine bars pressed flat — then
 * the waveform comes alive bar by bar, the sparkles spin in, the camera settles to the
 * front and a band of light passes over it. After that it idles, listening, until the
 * page is ready and the curtain lifts.
 */

const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
const easeInOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const easeOutBack = (x: number) => {
  const c1 = 1.9;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};
const seg = (t: number, a: number, d: number) => Math.min(1, Math.max(0, (t - a) / d));

/** Seconds until the mark is fully assembled */
export const ASSEMBLED = 1.9;

export async function mountIntro(host: HTMLElement) {
  const paths = await loadMarkPaths();

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  Object.assign(renderer.domElement.style, { display: "block", width: "100%", height: "100%" });
  host.append(renderer.domElement);

  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xffffff, 0xe9e2d8, 1.9));
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(-80, 90, 140);
  scene.add(key);
  // The passing band of light
  const sweep = new THREE.DirectionalLight(0xfff1e0, 0);
  scene.add(sweep);

  const { pivot, bars, sparks, dispose: disposeMark } = buildMark(paths);
  scene.add(pivot);
  // Left to right, the order a waveform is drawn in
  const order = [...bars].sort((a, b) => a.m.position.x - b.m.position.x);
  const sparkOrder = [...sparks].sort((a, b) => b.position.y - a.position.y); // big one first (flipped y)

  const camera = new THREE.PerspectiveCamera(30, 1, 1, 2000);
  const fit = () => {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  fit();
  const ro = new ResizeObserver(fit);
  ro.observe(host);

  const t0 = performance.now();
  let raf = 0;
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const t = (now - t0) / 1000;

    // Camera dollies back and settles to the front
    const cam = easeInOutCubic(seg(t, 0, ASSEMBLED));
    camera.position.set(0, -24 * (1 - cam), 220 + 80 * cam);
    camera.lookAt(0, 0, 0);
    const turn = easeOutCubic(seg(t, 0, ASSEMBLED));
    pivot.rotation.set(-0.35 * (1 - turn) + 0.03, 1.1 * (1 - turn) - 0.1 * turn + Math.sin(t * 0.7) * 0.03 * turn, 0);

    // Silence → waveform: each bar rises from a flat line, then keeps listening
    order.forEach((b, i) => {
      const k = seg(t, 0.15 + i * 0.075, 0.55);
      const idle = k >= 1 ? (Math.sin(t * 4.6 + b.seed) * 0.5 + 0.5) * (Math.sin(t * 2.1 + b.seed * 1.7) * 0.5 + 0.5) : 0;
      b.m.scale.y = Math.max(0.03, easeOutBack(k)) * (0.94 + idle * 0.12);
      b.m.position.z = -30 * (1 - easeOutCubic(k)) + idle * 2;
    });

    // Sparkles spin in, then glint
    sparkOrder.forEach((s, i) => {
      const k = seg(t, 0.85 + i * 0.15, 0.6);
      s.scale.setScalar(Math.max(0.001, easeOutBack(k)) * (1 + (k >= 1 ? Math.sin(t * 2.4 + i * 3) * 0.06 : 0)));
      s.rotation.z = -Math.PI * (1 - easeOutCubic(k)) + (k >= 1 ? Math.sin(t * 0.8 + i * 2) * 0.25 : 0);
    });

    // A band of light passes across once
    const sw = seg(t, 0.7, 1.2);
    sweep.position.set(-240 + 480 * easeInOutCubic(sw), 40, 120);
    sweep.intensity = Math.sin(sw * Math.PI) * 2.4;

    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(frame);

  return {
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      disposeMark();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}

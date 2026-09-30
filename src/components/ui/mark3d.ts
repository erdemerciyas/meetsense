import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

/**
 * The MeetSense mark as an object: its bars are a voice waveform, so here they listen —
 * each bar rises and falls on its own level, the sparkles glint, and the whole mark turns
 * toward the pointer. Built from the brand SVG itself, coloured with its own gradient.
 * Decorative: the section's text carries the content.
 */

const SRC = "/brand/meetsense-mark.svg";
// The brand gradient (userSpaceOnUse, in the SVG's 120×120 space)
const G = { x1: 31.25, y1: 110, x2: 83.54, y2: 36.3 };
const STOPS: [number, string][] = [
  [0, "#DABBA3"],
  [0.255, "#EF6406"],
  [0.51, "#C60F01"],
  [0.827, "#620301"],
  [1, "#060505"],
];

function gradientAt(t: number, out: THREE.Color) {
  t = Math.min(1, Math.max(0, t));
  for (let i = 1; i < STOPS.length; i++) {
    const [b, cb] = STOPS[i];
    if (t <= b) {
      const [a, ca] = STOPS[i - 1];
      return out.set(ca).lerp(new THREE.Color(cb), (t - a) / (b - a));
    }
  }
  return out.set(STOPS.at(-1)![1]);
}

/** The brand SVG's paths, parsed once per load */
export async function loadMarkPaths() {
  return new SVGLoader().parse(await (await fetch(SRC)).text()).paths;
}

/**
 * Builds the extruded mark centred on the origin (120 units across). Bars pivot on their
 * own centre line so they can grow like level meters; sparkles pivot on their centre.
 */
export function buildMark(paths: Awaited<ReturnType<typeof loadMarkPaths>>) {
  const mark = new THREE.Group();
  const extrude = { depth: 7, bevelEnabled: true, bevelThickness: 1.6, bevelSize: 1, bevelSegments: 4, curveSegments: 28 };

  // Bars: the first path holds all nine as separate shapes
  const barMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.38, metalness: 0.15, side: THREE.DoubleSide });
  const gx = G.x2 - G.x1;
  const gy = G.y2 - G.y1;
  const glen2 = gx * gx + gy * gy;
  const col = new THREE.Color();
  const bars = paths[0].toShapes().map((shape) => {
    const geo = new THREE.ExtrudeGeometry(shape, extrude);
    // Colour each vertex by where it falls along the brand gradient (in SVG space)
    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const t = ((pos.getX(i) - G.x1) * gx + (pos.getY(i) - G.y1) * gy) / glen2;
      gradientAt(t, col).toArray(colors, i * 3);
    }
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    // Pivot at the bar's centre line so it can grow from its middle, like a level meter
    geo.computeBoundingBox();
    const bb = geo.boundingBox!;
    const cx = (bb.min.x + bb.max.x) / 2;
    const cy = (bb.min.y + bb.max.y) / 2;
    geo.translate(-cx, -cy, -extrude.depth / 2);
    const m = new THREE.Mesh(geo, barMat);
    m.position.set(cx, cy, 0);
    mark.add(m);
    return { m, seed: cx * 0.37, tall: bb.max.y - bb.min.y };
  });

  // Sparkles
  const sparkMat = new THREE.MeshStandardMaterial({ color: "#FFC700", roughness: 0.3, metalness: 0.2, side: THREE.DoubleSide });
  const sparks = paths.slice(1).flatMap((p) =>
    p.toShapes().map((shape) => {
      const geo = new THREE.ExtrudeGeometry(shape, { ...extrude, depth: 6 });
      geo.computeBoundingBox();
      const bb = geo.boundingBox!;
      const cx = (bb.min.x + bb.max.x) / 2;
      const cy = (bb.min.y + bb.max.y) / 2;
      geo.translate(-cx, -cy, -3);
      const m = new THREE.Mesh(geo, sparkMat);
      m.position.set(cx, cy, 6);
      mark.add(m);
      return m;
    }),
  );

  // SVG y runs down; flip, and centre the 120×120 artboard on the origin
  mark.scale.set(1, -1, 1);
  mark.position.set(-60, 60, 0);
  const pivot = new THREE.Group();
  pivot.add(mark);

  return {
    pivot,
    bars,
    sparks,
    dispose() {
      pivot.traverse((o) => (o as THREE.Mesh).geometry?.dispose());
      barMat.dispose();
      sparkMat.dispose();
    },
  };
}

export async function mountMark(host: HTMLElement, { still = false } = {}) {
  const paths = await loadMarkPaths();

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  Object.assign(renderer.domElement.style, { display: "block", width: "100%", height: "100%" });
  host.append(renderer.domElement);

  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xfff4ea, 0x2a2622, 1.6));
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(-60, 80, 120);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xffc9a0, 1.4);
  rim.position.set(90, -20, -60);
  scene.add(rim);

  const { pivot, bars, sparks, dispose: disposeMark } = buildMark(paths);
  scene.add(pivot);

  const camera = new THREE.PerspectiveCamera(30, 1, 1, 2000);
  camera.position.set(0, 0, 290);
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

  let px = 0;
  let py = 0;
  let energy = 0;
  let lastX = 0;
  const onMove = (e: PointerEvent) => {
    const r = host.getBoundingClientRect();
    px = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
    py = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
    // Moving the pointer is "talking": it raises the level for a moment
    energy = Math.min(1, energy + Math.abs(e.clientX - lastX) / 300);
    lastX = e.clientX;
  };
  addEventListener("pointermove", onMove, { passive: true });

  const draw = (time: number, dt: number) => {
    energy = Math.max(0, energy - dt * 0.6);
    const talk = 0.35 + energy * 0.65;
    bars.forEach((b) => {
      // Two detuned waves per bar: an uneven, voice-like level
      const level = (Math.sin(time * 5.1 + b.seed) * 0.5 + 0.5) * (Math.sin(time * 2.3 + b.seed * 1.7) * 0.5 + 0.5);
      b.m.scale.y = 1 - 0.28 * talk + level * 0.4 * talk;
      b.m.position.z = level * 4 * talk;
    });
    sparks.forEach((s, i) => {
      s.rotation.z = Math.sin(time * 0.8 + i * 2) * 0.35;
      s.scale.setScalar(0.9 + (Math.sin(time * 2.4 + i * 3) * 0.5 + 0.5) * 0.2);
    });
    const r = host.getBoundingClientRect();
    const scroll = Math.max(-1, Math.min(1, (r.top + r.height / 2 - innerHeight / 2) / innerHeight));
    pivot.rotation.y += (px * 0.28 - 0.12 + scroll * 0.18 - pivot.rotation.y) * 0.06;
    pivot.rotation.x += (py * 0.16 + 0.05 - pivot.rotation.x) * 0.06;
    renderer.render(scene, camera);
  };

  let raf = 0;
  let last = performance.now();
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    draw(now / 1000, Math.min(0.033, (now - last) / 1000));
    last = now;
  };
  let visible = false;
  const io = new IntersectionObserver(([e]) => {
    if (still || e.isIntersecting === visible) return;
    visible = e.isIntersecting;
    cancelAnimationFrame(raf);
    if (visible) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  });
  if (still) {
    pivot.rotation.set(0.06, -0.3, 0);
    draw(0.6, 0);
  } else io.observe(host);

  return {
    dispose() {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      removeEventListener("pointermove", onMove);
      disposeMark();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}

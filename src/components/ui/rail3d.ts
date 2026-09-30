import * as THREE from "three";

/**
 * The hero's rail as a real object: a steel bar with the week's notches, tickets that
 * print, fly onto it and swing on their clips. The pointer pushes them, a spoken line
 * tugs its ticket. Decorative only: the same tickets are on the page as text.
 *
 * World units are 1/100 of the board width it was laid out for (WORLD_W), so the whole
 * scene scales with the container like an SVG and ticket textures are drawn once.
 */

export type RailTicket = {
  no: string;
  kind: "decision" | "action" | "risk";
  kindLabel: string;
  text: string;
  rows: { label: string; value: string; alert?: boolean }[];
  day: number;
  /** Seconds after mount at which it prints */
  at: number;
};

export type RailData = {
  days: string[];
  active: number;
  span?: { from: number; to: number; ticket: string };
  tickets: RailTicket[];
};

const WORLD_W = 11.44;
const GAP = 0.16;
const PX = 100; // canvas px per world unit (drawn at 2x for sharpness)
const RAIL_Y = -0.5; // below the top edge; day labels sit above
const CLIP = 0.16; // gap between the rail (or the ticket above) and a ticket's top
const STACK = 0.2;

export type Palette = Record<"paper" | "ink" | "ink2" | "ink3" | "rule" | "steel" | "ember" | "emberInk", string>;

/** Canvas can resolve any CSS colour (oklch included); three can't, so go through a pixel. */
export function toRGB(css: string) {
  const c = document.createElement("canvas").getContext("2d", { willReadFrequently: true })!;
  c.fillStyle = css;
  c.fillRect(0, 0, 1, 1);
  const [r, g, b] = c.getImageData(0, 0, 1, 1).data;
  return new THREE.Color(r / 255, g / 255, b / 255).convertSRGBToLinear();
}

export function palette(): Palette {
  const s = getComputedStyle(document.documentElement);
  const v = (n: string) => s.getPropertyValue(n).trim();
  return {
    paper: v("--color-paper"),
    ink: v("--color-ink"),
    ink2: v("--color-ink-2"),
    ink3: v("--color-ink-3"),
    rule: v("--color-rule"),
    steel: v("--color-steel-lo"),
    ember: v("--color-ember"),
    emberInk: v("--color-ember-ink"),
  };
}

export function fonts() {
  const probe = document.createElement("span");
  probe.className = "mono";
  document.body.append(probe);
  const mono = getComputedStyle(probe).fontFamily;
  probe.remove();
  return { sans: getComputedStyle(document.body).fontFamily, mono };
}

function wrap(ctx: CanvasRenderingContext2D, text: string, width: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > width && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  lines.push(line);
  return lines;
}

function glyph(ctx: CanvasRenderingContext2D, kind: RailTicket["kind"], x: number, y: number, s: number) {
  ctx.beginPath();
  if (kind === "decision") {
    ctx.rect(x, y, s, s);
    ctx.moveTo(x + s * 0.25, y + s * 0.5);
    ctx.lineTo(x + s * 0.45, y + s * 0.7);
    ctx.lineTo(x + s * 0.78, y + s * 0.3);
  } else if (kind === "action") {
    ctx.arc(x + s / 2, y + s / 2, s / 2, 0, Math.PI * 2);
    ctx.moveTo(x + s * 0.3, y + s * 0.5);
    ctx.lineTo(x + s * 0.7, y + s * 0.5);
    ctx.moveTo(x + s * 0.52, y + s * 0.32);
    ctx.lineTo(x + s * 0.7, y + s * 0.5);
    ctx.lineTo(x + s * 0.52, y + s * 0.68);
  } else {
    ctx.moveTo(x + s / 2, y);
    ctx.lineTo(x + s, y + s);
    ctx.lineTo(x, y + s);
    ctx.closePath();
    ctx.moveTo(x + s / 2, y + s * 0.4);
    ctx.lineTo(x + s / 2, y + s * 0.65);
  }
  ctx.stroke();
}

/** Draws a ticket like the HTML one and returns its texture and height in world units. */
export function drawTicket(t: RailTicket, w: number, p: Palette, f: ReturnType<typeof fonts>) {
  const S = 2;
  const W = Math.round(w * PX);
  const pad = 16;
  const measure = document.createElement("canvas").getContext("2d")!;
  measure.font = `600 16px ${f.sans}`;
  const lines = wrap(measure, t.text, W - pad * 2);
  const H = Math.round(14 + 20 + 20 + lines.length * 21 + 12 + t.rows.length * 17 + 16);

  const canvas = document.createElement("canvas");
  canvas.width = W * S;
  canvas.height = H * S;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(S, S);
  ctx.fillStyle = p.paper;
  ctx.fillRect(0, 0, W, H);
  ctx.textBaseline = "top";

  let y = 14;
  ctx.fillStyle = p.ink;
  ctx.font = `600 13px ${f.mono}`;
  ctx.fillText(`#${t.no}`, pad, y);
  ctx.font = `600 12px ${f.mono}`;
  ctx.fillStyle = t.kind === "decision" ? p.ink : p.ink2;
  ctx.strokeStyle = ctx.fillStyle;
  ctx.lineWidth = 1.3;
  const kw = ctx.measureText(t.kindLabel).width;
  ctx.textAlign = "right";
  ctx.fillText(t.kindLabel, W - pad, y + 1);
  ctx.textAlign = "left";
  glyph(ctx, t.kind, W - pad - kw - 18, y + 1, 12);

  y += 26;
  ctx.strokeStyle = p.rule;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(pad, y);
  ctx.lineTo(W - pad, y);
  ctx.stroke();
  ctx.setLineDash([]);

  y += 12;
  ctx.fillStyle = p.ink;
  ctx.font = `600 16px ${f.sans}`;
  for (const l of lines) {
    ctx.fillText(l, pad, y);
    y += 21;
  }

  y += 10;
  ctx.font = `12px ${f.mono}`;
  const lw = Math.max(...t.rows.map((r) => ctx.measureText(r.label).width));
  for (const r of t.rows) {
    ctx.fillStyle = p.ink3;
    ctx.fillText(r.label, pad, y);
    ctx.fillStyle = r.alert ? p.emberInk : p.ink2;
    ctx.font = `${r.alert ? 600 : 400} 12px ${f.mono}`;
    ctx.fillText(r.value, pad + lw + 12, y);
    ctx.font = `12px ${f.mono}`;
    y += 17;
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return { tex, h: H / PX };
}

export function label(text: string, color: string, weight: number, f: ReturnType<typeof fonts>) {
  const S = 2;
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d")!;
  const font = `${weight} 12px ${f.mono}`;
  ctx.font = font;
  const w = Math.ceil(ctx.measureText(text).width) + 2;
  c.width = w * S;
  c.height = 16 * S;
  ctx.scale(S, S);
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textBaseline = "top";
  ctx.fillText(text, 0, 1);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w / PX, 16 / PX), new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
  m.geometry.translate(w / PX / 2, -8 / PX, 0);
  return m;
}

type Hanger = {
  t: RailTicket;
  pivot: THREE.Group; // hangs from the rail (or the ticket above) and swings
  flyer: THREE.Group; // carries the print-and-fly entrance
  outline: THREE.LineSegments;
  w: number;
  h: number;
  ax: number; // swing toward/away from the viewer
  az: number; // swing sideways
  vx: number;
  vz: number;
  printed: boolean;
  landed: boolean;
  flash: number;
};

export async function mountRail(host: HTMLElement, data: RailData) {
  await document.fonts.ready;
  const p = palette();
  const f = fonts();
  const col = (WORLD_W - GAP * (data.days.length - 1)) / data.days.length;
  const colX = (i: number) => -WORLD_W / 2 + i * (col + GAP);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.style.display = "block";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";

  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xffffff, toRGB(p.paper), 2.4));
  const sun = new THREE.DirectionalLight(0xffffff, 1.1);
  sun.position.set(-4, 5, 7);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 1024);
  sun.shadow.radius = 6;
  sun.shadow.bias = -0.0005;
  Object.assign(sun.shadow.camera, { left: -8, right: 8, top: 3, bottom: -6, near: 1, far: 20 });
  scene.add(sun);

  // The board behind: invisible, it only catches the tickets' shadows
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(40, 20), new THREE.ShadowMaterial({ opacity: 0.1 }));
  wall.position.z = -0.45;
  wall.receiveShadow = true;
  scene.add(wall);

  // The rail
  const steel = new THREE.MeshStandardMaterial({ color: toRGB(p.steel), metalness: 0.55, roughness: 0.35 });
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, WORLD_W, 24), steel);
  bar.rotation.z = Math.PI / 2;
  bar.position.y = RAIL_Y;
  bar.castShadow = true;
  scene.add(bar);
  for (const x of [-WORLD_W / 2, WORLD_W / 2]) {
    const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.45), steel);
    bracket.position.set(x, RAIL_Y, -0.22);
    bracket.castShadow = true;
    scene.add(bracket);
  }
  const ember = toRGB(p.ember);
  data.days.forEach((d, i) => {
    const on = i === data.active;
    const notch = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.09, 0.012), new THREE.MeshBasicMaterial({ color: on ? ember : toRGB(p.steel) }));
    notch.position.set(colX(i) + 0.006, RAIL_Y + 0.1, 0.05);
    scene.add(notch);
    const l = label(d, on ? p.emberInk : p.ink3, on ? 600 : 500, f);
    l.position.set(colX(i), RAIL_Y + 0.38, 0.05);
    scene.add(l);
  });
  // Active day: a faint wash down its column, like the 2D board
  const wash = new THREE.Mesh(new THREE.PlaneGeometry(col + GAP, 10), new THREE.MeshBasicMaterial({ color: ember, transparent: true, opacity: 0.045, depthWrite: false }));
  wash.geometry.translate(0, -5, 0);
  wash.position.set(colX(data.active) + col / 2, RAIL_Y - 0.1, -0.44);
  scene.add(wash);

  // The action's due span along the bar, grown when its ticket lands
  let span: THREE.Mesh | undefined;
  if (data.span) {
    const len = colX(data.span.to) - colX(data.span.from);
    span = new THREE.Mesh(new THREE.CylinderGeometry(0.056, 0.056, len, 24), new THREE.MeshStandardMaterial({ color: ember, roughness: 0.5 }));
    span.geometry.rotateZ(Math.PI / 2);
    span.geometry.translate(len / 2, 0, 0);
    span.position.set(colX(data.span.from), RAIL_Y, 0);
    span.scale.x = 0.0001;
    scene.add(span);
  }

  // Tickets
  const paper = toRGB(p.paper);
  const edge = new THREE.MeshStandardMaterial({ color: paper, roughness: 0.9 });
  const clipGeo = new THREE.BoxGeometry(0.18, 0.2, 0.05);
  const hangers: Hanger[] = [];
  let height = 0;
  data.days.forEach((_, day) => {
    let parent: THREE.Object3D = scene;
    let top = RAIL_Y;
    let depth = 0;
    for (const t of data.tickets.filter((t) => t.day === day)) {
      const { tex, h } = drawTicket(t, col, p, f);
      const pivot = new THREE.Group();
      const onRail = parent === scene;
      pivot.position.set(onRail ? colX(day) + col / 2 : 0, top, 0);
      parent.add(pivot);

      const flyer = new THREE.Group();
      pivot.add(flyer);
      const face = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.92 });
      const card = new THREE.Mesh(new THREE.BoxGeometry(col, h, 0.012), [edge, edge, edge, edge, face, edge]);
      card.position.y = -(onRail ? CLIP : STACK) - h / 2;
      card.castShadow = true;
      flyer.add(card);

      const clip = new THREE.Mesh(clipGeo, steel);
      clip.position.y = -(onRail ? CLIP : STACK) / 2;
      clip.castShadow = true;
      flyer.add(clip);

      const outline = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.PlaneGeometry(col + 0.06, h + 0.06)),
        new THREE.LineBasicMaterial({ color: ember, transparent: true, opacity: 0 }),
      );
      outline.position.set(0, card.position.y, 0.01);
      flyer.add(outline);

      flyer.visible = false;
      hangers.push({ t, pivot, flyer, outline, w: col, h, ax: 0, az: 0, vx: 0, vz: 0, printed: false, landed: false, flash: 0 });

      // The next ticket of the day hangs from this one's bottom edge
      parent = pivot;
      top = card.position.y - h / 2;
      depth += -card.position.y + h / 2;
      height = Math.max(height, -RAIL_Y + depth);
    }
  });

  const worldH = height + 0.9;
  const camera = new THREE.PerspectiveCamera(28, WORLD_W / worldH, 0.1, 100);
  const baseZ = worldH / 2 / Math.tan(THREE.MathUtils.degToRad(14));
  const center = new THREE.Vector3(0, -worldH / 2, 0);

  host.style.aspectRatio = `${WORLD_W} / ${worldH}`;
  host.append(renderer.domElement);

  const fit = () => {
    const { width, height } = host.getBoundingClientRect();
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  fit();
  const ro = new ResizeObserver(fit);
  ro.observe(host);

  // Pointer: parallax for the camera, and a push for whatever ticket it sweeps through
  const ndc = new THREE.Vector2(9, 9);
  const prev = new THREE.Vector3();
  const hitPoint = new THREE.Vector3();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const ray = new THREE.Raycaster();
  let pointerIn = false;
  let tracking = false;
  const onMove = (e: PointerEvent) => {
    const r = host.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    pointerIn = true;
  };
  const onLeave = () => (pointerIn = false);
  host.addEventListener("pointermove", onMove);
  host.addEventListener("pointerleave", onLeave);

  const t0 = performance.now();
  let last = t0;
  let raf = 0;
  let visible = true;
  const start = new THREE.Vector3(-WORLD_W / 2 - 1.5, 1.2, 2.2);
  const tmp = new THREE.Vector3();
  const box = new THREE.Box3();
  const ease = (x: number) => 1 - Math.pow(1 - x, 3);

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.033, (now - last) / 1000);
    last = now;
    const time = (now - t0) / 1000;

    // Camera: a touch of parallax, and it tilts away as the hero scrolls up
    const scrolled = Math.min(1, Math.max(0, -host.getBoundingClientRect().top / host.clientHeight));
    const px = pointerIn ? ndc.x : 0;
    const py = pointerIn ? ndc.y : 0;
    camera.position.x += (px * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (center.y + py * 0.3 + scrolled * 1.2 - camera.position.y) * 0.05;
    camera.position.z = baseZ;
    camera.lookAt(center.x, center.y + scrolled * 0.6, 0);

    // Pointer sweep → push
    let sweep: THREE.Vector3 | undefined;
    if (pointerIn) {
      ray.setFromCamera(ndc, camera);
      if (ray.ray.intersectPlane(plane, hitPoint)) {
        if (tracking) sweep = hitPoint.clone().sub(prev).divideScalar(Math.max(dt, 0.001));
        prev.copy(hitPoint);
        tracking = true;
      }
    } else tracking = false;

    for (const h of hangers) {
      const since = time - h.t.at;
      if (since < 0) continue;
      if (!h.printed) {
        h.printed = true;
        h.flyer.visible = true;
      }
      // Print and fly: from the printer off to the left, onto its clip
      const fly = Math.min(1, since / 0.9);
      if (fly < 1) {
        h.pivot.worldToLocal(tmp.copy(start));
        const k = ease(fly);
        h.flyer.position.copy(tmp).multiplyScalar(1 - k);
        h.flyer.position.y += Math.sin(k * Math.PI) * 0.8;
        h.flyer.rotation.set((1 - k) * -0.9, (1 - k) * 0.8, (1 - k) * 0.6);
      } else if (!h.landed) {
        h.landed = true;
        h.flyer.position.set(0, 0, 0);
        h.flyer.rotation.set(0, 0, 0);
        h.vz += 2.4;
        h.vx -= 3;
        if (span && h.t.no === data.span?.ticket) span.userData.grow = time;
      }
      if (!h.landed) continue;

      if (sweep && sweep.lengthSq() > 0.01) {
        box.setFromObject(h.flyer);
        const { min, max } = box;
        if (hitPoint.x > min.x && hitPoint.x < max.x && hitPoint.y > min.y && hitPoint.y < max.y) {
          h.vz += -sweep.x * 0.05;
          h.vx += Math.min(2, sweep.length() * 0.02);
        }
      }

      // Damped springs, plus the faintest draught so nothing is ever quite still
      const breeze = Math.sin(time * 0.9 + h.pivot.id) * 0.004;
      h.vz += (-40 * h.az - 2.6 * h.vz) * dt;
      h.vx += (-40 * h.ax - 2.6 * h.vx) * dt;
      h.az += h.vz * dt;
      h.ax += h.vx * dt;
      h.pivot.rotation.set(h.ax, 0, h.az + breeze);

      h.flash = Math.max(0, h.flash - dt * 0.8);
      (h.outline.material as THREE.LineBasicMaterial).opacity = Math.min(1, h.flash * 2);
    }

    if (span?.userData.grow !== undefined) span.scale.x = Math.max(0.0001, ease(Math.min(1, (time - span.userData.grow) / 0.8)));

    renderer.render(scene, camera);
  };

  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting === visible) return;
    visible = e.isIntersecting;
    cancelAnimationFrame(raf);
    if (visible) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  });
  io.observe(host);
  camera.position.set(0, center.y, baseZ);
  raf = requestAnimationFrame(frame);

  return {
    /** A spoken line printed this ticket: tug it and flash its outline */
    hit(no: string) {
      const h = hangers.find((x) => x.t.no === no);
      if (!h?.landed) return;
      h.vx -= 4;
      h.vz += 1.2;
      h.flash = 1.2;
    },
    dispose() {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose();
        for (const mat of ([] as THREE.Material[]).concat(m.material ?? [])) {
          (mat as THREE.MeshStandardMaterial).map?.dispose();
          mat.dispose();
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
      host.style.aspectRatio = "";
    },
  };
}

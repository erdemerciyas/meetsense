import * as THREE from "three";
import { drawTicket, fonts, label, palette, toRGB, type RailTicket } from "./rail3d";

/**
 * One meeting's life as a tabletop scene, scrubbed by scroll (P runs 0..5, one unit per step):
 *   0 invite  — the bot token drops onto the calendar invite
 *   1 record  — sound rings spread and the transcript strip prints out across the table
 *   2 moment  — each line that carried work is marked and its ticket rises out of the strip
 *   3 rail    — the tickets fly onto the week's rail and swing on their clips
 *   4 later   — they're filed away; a question comes, and the ticket that answers it rises back
 * Decorative: every step is told in text beside it and in the chapters below.
 */

export type ProcessData = {
  title: string;
  date: string;
  invite: string;
  assistant: string;
  question: string;
  days: string[];
  active: number;
  span?: { from: number; to: number; ticket: string };
  lines: { time: string; who: string; text: string }[];
  tickets: RailTicket[];
};

type Cam = { pos: THREE.Vector3; look: THREE.Vector3 };
const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
const VIEWS: Cam[] = [
  { pos: V(-2.2, 4.2, 5.6), look: V(-2.2, 0, 0.6) },
  { pos: V(0.8, 6.4, 10), look: V(0.9, 0, 0.3) },
  { pos: V(2.4, 3.4, 8.2), look: V(2.4, 0.9, 0.2) },
  { pos: V(0.3, 3.3, 10.6), look: V(0.3, 2.1, -0.8) },
  { pos: V(-2.4, 3.6, 7.8), look: V(-2.6, 1.1, 0.3) },
];

const SEG = 1.2; // transcript strip: length per line
const STRIP_W = 0.8;
const STRIP_X = -1.2;
const STRIP_Z = 0.4;
const RAIL = { y: 3.4, z: -1.2, x0: -3, len: 6.6 };
const CAL = V(-2.6, 0.02, 0.4);
const TOKEN = V(-1.85, 0.09, 1.0);

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const smooth = (x: number) => x * x * (3 - 2 * x);
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
const bounce = (x: number) => {
  const n = 7.5625;
  if (x < 1 / 2.75) return n * x * x;
  if (x < 2 / 2.75) return n * (x -= 1.5 / 2.75) * x + 0.75;
  if (x < 2.5 / 2.75) return n * (x -= 2.25 / 2.75) * x + 0.9375;
  return n * (x -= 2.625 / 2.75) * x + 0.984375;
};

function canvasTex(w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const S = 2;
  const c = document.createElement("canvas");
  c.width = w * S;
  c.height = h * S;
  const ctx = c.getContext("2d")!;
  ctx.scale(S, S);
  ctx.textBaseline = "top";
  draw(ctx);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function lines(ctx: CanvasRenderingContext2D, text: string, width: number, max: number) {
  const out: string[] = [];
  let line = "";
  for (const w of text.split(" ")) {
    const next = line ? `${line} ${w}` : w;
    if (ctx.measureText(next).width > width && line) {
      out.push(line);
      line = w;
    } else line = next;
  }
  out.push(line);
  if (out.length > max) out.splice(max - 1, out.length, `${out[max - 1]}…`);
  return out;
}

export async function mountProcess(host: HTMLElement, data: ProcessData) {
  await document.fonts.ready;
  const p = palette();
  const f = fonts();
  const ember = toRGB(p.ember);
  const paper = toRGB(p.paper);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  Object.assign(renderer.domElement.style, { display: "block", width: "100%", height: "100%" });
  host.append(renderer.domElement);

  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xffffff, paper, 2.3));
  const sun = new THREE.DirectionalLight(0xffffff, 1.2);
  sun.position.set(-3, 8, 5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.radius = 5;
  sun.shadow.bias = -0.0005;
  Object.assign(sun.shadow.camera, { left: -7, right: 7, top: 7, bottom: -5, near: 1, far: 25 });
  scene.add(sun);

  const table = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: 0.09 }));
  table.rotation.x = -Math.PI / 2;
  table.receiveShadow = true;
  scene.add(table);

  const edge = new THREE.MeshStandardMaterial({ color: paper, roughness: 0.9 });
  const steel = new THREE.MeshStandardMaterial({ color: toRGB(p.steel), metalness: 0.55, roughness: 0.35 });
  const flatCard = (w: number, d: number, tex: THREE.Texture) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, 0.03, d), [edge, edge, new THREE.MeshStandardMaterial({ map: tex, roughness: 0.92 }), edge, edge, edge]);
    m.castShadow = m.receiveShadow = true;
    return m;
  };

  // 0 · The invite on the calendar
  const calTex = canvasTex(480, 360, (ctx) => {
    ctx.fillStyle = p.paper;
    ctx.fillRect(0, 0, 480, 360);
    ctx.fillStyle = p.ink;
    ctx.font = `700 20px ${f.sans}`;
    ctx.fillText(data.title, 24, 22);
    ctx.fillStyle = p.ink3;
    ctx.font = `13px ${f.mono}`;
    ctx.fillText(data.date, 24, 50);
    ctx.strokeStyle = p.rule;
    ctx.lineWidth = 1;
    for (let r = 0; r <= 4; r++) {
      ctx.beginPath();
      ctx.moveTo(24, 84 + r * 44);
      ctx.lineTo(456, 84 + r * 44);
      ctx.stroke();
    }
    for (let d = 0; d < 35; d++) {
      const x = 24 + (d % 7) * 62;
      const y = 92 + Math.floor(d / 7) * 44;
      if (y > 250) break;
      ctx.fillStyle = p.ink3;
      ctx.font = `12px ${f.mono}`;
      ctx.fillText(String(d + 1), x + 6, y);
      if (d === 5) {
        ctx.strokeStyle = p.ember;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(x + 12, y + 7, 15, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = p.rule;
        ctx.lineWidth = 1;
      }
    }
    ctx.strokeStyle = p.ink;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(24, 300, 16, 16);
    ctx.fillStyle = p.ink;
    ctx.font = `600 16px ${f.sans}`;
    ctx.fillText(data.invite, 50, 300);
  });
  const calendar = flatCard(2.4, 1.8, calTex);
  calendar.position.copy(CAL);
  scene.add(calendar);

  // The bot is MeetSense itself: a coin carrying the mark
  const mark = new Image();
  mark.src = "/brand/meetsense-mark.svg";
  await mark.decode();
  const tokenTop = canvasTex(160, 160, (ctx) => {
    ctx.fillStyle = p.paper;
    ctx.fillRect(0, 0, 160, 160);
    ctx.drawImage(mark, 30, 26, 100, 100);
  });
  const emberMat = new THREE.MeshStandardMaterial({ color: ember, roughness: 0.5 });
  const rimMat = new THREE.MeshStandardMaterial({ color: toRGB(p.ink), roughness: 0.45, metalness: 0.2 });
  const token = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.1, 64), [rimMat, new THREE.MeshStandardMaterial({ map: tokenTop, roughness: 0.6 }), rimMat]);
  token.rotation.y = -0.4;
  token.castShadow = true;
  scene.add(token);

  // 1 · Sound rings and the transcript strip
  const ringMat = new THREE.MeshBasicMaterial({ color: toRGB(p.steel), transparent: true });
  const rings = [0, 1, 2].map(() => {
    const r = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.012, 8, 64), ringMat.clone());
    r.rotation.x = -Math.PI / 2;
    r.position.set(TOKEN.x, 0.05, TOKEN.z);
    scene.add(r);
    return r;
  });

  const segments = [
    ...data.lines.map((l) => ({ time: l.time, who: l.who, text: l.text })),
    ...data.tickets.filter((t) => !data.lines.some((l) => l.time === t.rows.at(-1)!.value)).map((t) => ({ time: t.rows.at(-1)!.value, who: "", text: "…" })),
  ];
  const stripLen = segments.length * SEG;
  const stripTex = canvasTex(Math.round(stripLen * 200), Math.round(STRIP_W * 200), (ctx) => {
    ctx.fillStyle = p.paper;
    ctx.fillRect(0, 0, stripLen * 200, STRIP_W * 200);
    segments.forEach((s, i) => {
      const x = i * SEG * 200 + 18;
      ctx.fillStyle = p.ink3;
      ctx.font = `12px ${f.mono}`;
      ctx.fillText(s.time, x, 18);
      ctx.fillStyle = p.ink;
      ctx.font = `600 13px ${f.sans}`;
      ctx.fillText(s.who, x + 48, 17);
      ctx.fillStyle = p.ink2;
      ctx.font = `13px ${f.sans}`;
      lines(ctx, s.text, SEG * 200 - 36, 4).forEach((l, j) => ctx.fillText(l, x, 44 + j * 19));
      if (i) {
        ctx.strokeStyle = p.rule;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(i * SEG * 200, 12);
        ctx.lineTo(i * SEG * 200, STRIP_W * 200 - 12);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });
  });
  const strip = flatCard(stripLen, STRIP_W, stripTex);
  strip.geometry.translate(stripLen / 2, 0, 0);
  strip.position.set(STRIP_X, 0.016, STRIP_Z);
  scene.add(strip);
  const segX = (time: string) => STRIP_X + (segments.findIndex((s) => s.time === time) + 0.5) * SEG;

  // 3 · The week's rail on its posts; it rises out of the table for its step
  const rail = new THREE.Group();
  scene.add(rail);
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, RAIL.len, 24), steel);
  bar.rotation.z = Math.PI / 2;
  bar.position.set(RAIL.x0 + RAIL.len / 2, RAIL.y, RAIL.z);
  bar.castShadow = true;
  rail.add(bar);
  for (const x of [RAIL.x0, RAIL.x0 + RAIL.len]) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, RAIL.y, 16), steel);
    post.position.set(x, RAIL.y / 2, RAIL.z);
    post.castShadow = true;
    rail.add(post);
  }
  const col = RAIL.len / data.days.length;
  data.days.forEach((d, i) => {
    const on = i === data.active;
    const l = label(d, on ? p.emberInk : p.ink3, on ? 600 : 500, f);
    l.position.set(RAIL.x0 + i * col + 0.04, RAIL.y + 0.34, RAIL.z);
    rail.add(l);
  });
  let span: THREE.Mesh | undefined;
  if (data.span) {
    const len = (data.span.to - data.span.from) * col;
    span = new THREE.Mesh(new THREE.CylinderGeometry(0.056, 0.056, len, 24), emberMat);
    span.geometry.rotateZ(Math.PI / 2);
    span.geometry.translate(len / 2, 0, 0);
    span.position.set(RAIL.x0 + data.span.from * col, RAIL.y, RAIL.z);
    rail.add(span);
  }

  // 4 · The archive box and the question
  const archive = new THREE.Group();
  const boxMat = new THREE.MeshStandardMaterial({ color: toRGB(p.rule), roughness: 0.8 });
  const wall = (w: number, h: number, d: number, x: number, y: number, z: number) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), boxMat);
    m.position.set(x, y, z);
    m.castShadow = m.receiveShadow = true;
    archive.add(m);
  };
  wall(2.3, 0.05, 1.6, 0, 0.025, 0);
  wall(2.3, 1, 0.05, 0, 0.5, 0.8);
  wall(2.3, 1, 0.05, 0, 0.5, -0.8);
  wall(0.05, 1, 1.6, -1.15, 0.5, 0);
  wall(0.05, 1, 1.6, 1.15, 0.5, 0);
  const holder = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.2, 0.02), steel);
  holder.position.set(0, 0.62, 0.83);
  archive.add(holder);
  archive.position.set(CAL.x, 0, CAL.z);
  scene.add(archive);

  const qTex = canvasTex(400, 170, (ctx) => {
    ctx.fillStyle = p.paper;
    ctx.fillRect(0, 0, 400, 170);
    ctx.fillStyle = p.emberInk;
    ctx.font = `600 12px ${f.mono}`;
    ctx.fillText(data.assistant, 20, 20);
    ctx.fillStyle = p.ink;
    ctx.font = `600 18px ${f.sans}`;
    lines(ctx, data.question, 360, 3).forEach((l, i) => ctx.fillText(l, 20, 48 + i * 24));
  });
  const question = new THREE.Mesh(new THREE.BoxGeometry(2, 0.85, 0.02), [edge, edge, edge, edge, new THREE.MeshStandardMaterial({ map: qTex, roughness: 0.92 }), edge]);
  question.castShadow = true;
  scene.add(question);

  // Tickets: a pivot at the clip; the card hangs below it
  const tickets = data.tickets.map((t) => {
    const { tex, h: h2 } = drawTicket(t, 2.2, p, f);
    const w = 1.1;
    const h = h2 / 2;
    const pivot = new THREE.Group();
    const card = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.012), [edge, edge, edge, edge, new THREE.MeshStandardMaterial({ map: tex, roughness: 0.92 }), edge]);
    card.position.y = -0.1 - h / 2;
    card.castShadow = true;
    pivot.add(card);
    const clip = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 0.03), steel);
    clip.position.y = -0.05;
    pivot.add(clip);
    const outline = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.PlaneGeometry(w + 0.05, h + 0.05)),
      new THREE.LineBasicMaterial({ color: ember, transparent: true, opacity: 0 }),
    );
    outline.position.set(0, card.position.y, 0.01);
    pivot.add(outline);
    scene.add(pivot);

    const mark = new THREE.Mesh(new THREE.BoxGeometry(SEG * 0.75, 0.012, 0.035), emberMat);
    mark.position.set(segX(t.rows.at(-1)!.value), 0.035, STRIP_Z + STRIP_W / 2 - 0.08);
    scene.add(mark);
    return { t, pivot, outline, mark, h, clip, ax: 0, az: 0, vx: 0, vz: 0, hung: false };
  });

  // Where each ticket hangs: on the rail over its day, or under the ticket above it
  const hangAt = new Map<string, THREE.Vector3>();
  data.days.forEach((_, day) => {
    let y = RAIL.y - 0.02;
    for (const k of tickets.filter((k) => k.t.day === day)) {
      hangAt.set(k.t.no, V(RAIL.x0 + (day + 0.5) * col, y, RAIL.z + 0.05));
      y -= 0.1 + k.h + 0.08;
    }
  });

  // Step 2 frames the standing tickets: centred on the row, backed off only as far as the row needs
  const views = VIEWS.map((v) => ({ pos: v.pos.clone(), look: v.look.clone() }));
  const xs = tickets.map((tk, i) => tk.mark.position.x - 0.1 * i);
  const rowMid = (Math.min(...xs) + Math.max(...xs)) / 2;
  const rowHalf = (Math.max(...xs) - Math.min(...xs)) / 2 + 0.55 + 0.35;
  const back = VIEWS[2].pos.clone().sub(VIEWS[2].look);
  views[2].look.x = rowMid;

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  const fit = () => {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    const tanH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect;
    const d = Math.max(back.length(), rowHalf / tanH);
    views[2].pos.copy(views[2].look).addScaledVector(back.clone().normalize(), d);
  };
  fit();
  const ro = new ResizeObserver(fit);
  ro.observe(host);

  let P = 0;
  let px = 0;
  let py = 0;
  const onMove = (e: PointerEvent) => {
    px = (e.clientX / innerWidth) * 2 - 1;
    py = (e.clientY / innerHeight) * 2 - 1;
  };
  addEventListener("pointermove", onMove, { passive: true });

  const camPos = V(0, 0, 0);
  const camLook = V(0, 0, 0);
  const tmpA = V(0, 0, 0);
  const tmpB = V(0, 0, 0);
  const flat = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0));
  const upright = new THREE.Quaternion();
  let last = performance.now();
  let raf = 0;

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.033, (now - last) / 1000);
    last = now;
    const time = now / 1000;
    const k = Math.min(4, Math.floor(P));
    const t = P - k;

    // Camera: glide to this step's view in the first third of the step, then hold
    const from = views[Math.max(0, k - 1)];
    const to = views[k];
    const c = smooth(k === 0 ? 1 : seg(t, 0, 0.35));
    camPos.lerpVectors(from.pos, to.pos, c).add(tmpA.set(px * 0.3, -py * 0.2, 0));
    camLook.lerpVectors(from.look, to.look, c);
    camera.position.lerp(camPos, 0.12);
    tmpB.copy(camLook);
    camera.lookAt(tmpB);

    const step = (n: number, a: number, b: number) => (P < n ? 0 : P >= n + 1 ? 1 : seg(P - n, a, b));

    // 0 · token drops onto the invite; 4 · the calendar and token sink as the archive rises
    const sink = step(4, 0.25, 0.45);
    const drop = step(0, 0.3, 0.75);
    token.position.set(TOKEN.x, TOKEN.y + (1 - bounce(drop)) * 2.6 - sink * 0.3, TOKEN.z);
    token.visible = drop > 0 && sink < 1;
    calendar.position.y = CAL.y - sink * 0.1;
    calendar.visible = sink < 1;
    archive.scale.y = Math.max(0.001, easeOut(sink));
    archive.visible = sink > 0;

    const up = easeOut(step(3, 0, 0.3)) * (1 - smooth(step(4, 0.7, 0.8)));
    rail.scale.y = Math.max(0.001, up);
    rail.visible = up > 0.001;

    // 1 · rings pulse while it listens; the strip prints out
    const listening = P > 0.75 && P < 2.2 ? 1 : 0;
    rings.forEach((r, i) => {
      const phase = (time * 0.6 + i / 3) % 1;
      r.scale.setScalar(1 + phase * 2.2);
      (r.material as THREE.MeshBasicMaterial).opacity = listening * (1 - phase) * 0.8;
    });
    const print = step(1, 0.3, 0.95);
    strip.scale.x = Math.max(0.001, print);
    strip.visible = print > 0;
    ((strip.material as THREE.Material[])[2] as THREE.MeshStandardMaterial).map!.repeat.x = Math.max(0.001, print);

    // 2..4 · tickets
    const ans = step(4, 0.85, 0.97);
    tickets.forEach((tk, i) => {
      const x = tk.mark.position.x;
      const rise = step(2, 0.3 + i * 0.2, 0.55 + i * 0.2);
      const fly = step(3, 0.3 + i * 0.16, 0.6 + i * 0.16);
      const file = step(4, 0.3 + i * 0.07, 0.55 + i * 0.07);
      tk.mark.visible = rise > 0;
      tk.mark.scale.x = Math.max(0.001, seg(rise, 0, 0.4));
      tk.pivot.visible = rise > 0.02;

      // flat in the strip → standing above it → hanging on the rail → down into the archive
      const lying = V(x, 0.05, STRIP_Z - STRIP_W / 2 + 0.1);
      const standing = V(x - 0.1 * i, 1.35 + tk.h / 2, 0.6 + i * 0.05);
      const hang = hangAt.get(tk.t.no)!;
      const filed = V(CAL.x - 0.5 + i * 0.5, 0.3, CAL.z);
      const answer = V(CAL.x + 1.4, 1.9 + tk.h / 2, CAL.z + 0.3);

      if (file > 0) {
        const up = tk.t.no === data.tickets[0].no ? ans : 0;
        tmpA.lerpVectors(hang, V(filed.x, 2, filed.z), smooth(seg(file, 0, 0.5)));
        tmpA.lerp(filed, smooth(seg(file, 0.5, 1)));
        tmpA.lerp(answer, easeOut(up));
        tk.pivot.position.copy(tmpA);
        tk.pivot.quaternion.identity();
        tk.pivot.visible = file < 1 || up > 0;
        (tk.outline.material as THREE.LineBasicMaterial).opacity = up > 0.6 ? 0.5 + Math.sin(time * 4) * 0.5 : 0;
      } else if (fly > 0) {
        const e = smooth(fly);
        tmpA.lerpVectors(standing, hang, e);
        tmpA.y += Math.sin(e * Math.PI) * 0.9;
        tk.pivot.position.copy(tmpA);
        if (fly >= 1 && !tk.hung) {
          tk.hung = true;
          tk.vz += 2.2 * (i % 2 ? -1 : 1);
          tk.vx -= 2.8;
        }
        if (fly < 1) tk.hung = false;
        if (tk.hung) {
          tk.vz += (-38 * tk.az - 2.4 * tk.vz) * dt;
          tk.vx += (-38 * tk.ax - 2.4 * tk.vx) * dt;
          tk.az += tk.vz * dt;
          tk.ax += tk.vx * dt;
          tk.pivot.rotation.set(tk.ax, 0, tk.az + Math.sin(time + i) * 0.004);
        } else tk.pivot.quaternion.identity();
        (tk.outline.material as THREE.LineBasicMaterial).opacity = 0;
      } else {
        tk.hung = false;
        tk.ax = tk.az = tk.vx = tk.vz = 0;
        const e = easeOut(rise);
        tk.pivot.position.lerpVectors(lying, standing, e);
        tk.pivot.quaternion.slerpQuaternions(flat, upright, e);
        (tk.outline.material as THREE.LineBasicMaterial).opacity = 0;
      }
      tk.pivot.children[1].visible = fly > 0 || file > 0; // the clip only once it's on the rail
    });

    if (span) {
      const spanned = tickets.findIndex((k) => k.t.no === data.span!.ticket);
      span.scale.x = Math.max(0.001, easeOut(step(3, 0.6 + spanned * 0.16, 0.85 + spanned * 0.16)));
    }

    const q = step(4, 0.75, 0.85);
    question.visible = q > 0;
    question.scale.setScalar(Math.max(0.001, easeOut(q)));
    question.position.set(CAL.x - 0.3, 2.3, CAL.z + 0.2);
    question.rotation.set(-0.08, 0.15, 0);

    renderer.render(scene, camera);
  };
  camera.position.copy(views[0].pos);
  raf = requestAnimationFrame(frame);

  return {
    /** Scroll progress through the steps, 0..5 */
    set(progress: number) {
      P = Math.min(4.999, Math.max(0, progress));
    },
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      removeEventListener("pointermove", onMove);
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
    },
  };
}

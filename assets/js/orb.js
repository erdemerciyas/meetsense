/* MeetSense — Three.js sahneleri: hero ses küresi + 3D logo */
(function () {
  "use strict";

  var LOGO = {
    bars: "M50.2786 34.2765C55.3546 35.6698 60.6309 37.5494 65.2926 40.0753C65.5978 43.6434 65.8422 47.4465 66.0141 51.429C66.1051 51.9623 66.2876 54.6974 66.2871 61.3736C66.3037 62.7406 66.3122 64.1217 66.3122 65.5149C66.3122 95.6062 62.3668 120 57.5 120C53.1387 120 49.5174 100.41 48.8123 74.6854C48.8123 60.2278 49.5911 43.601 49.9805 37.0948C50.0755 36.1354 50.1744 35.1955 50.2786 34.2765ZM36.2296 17.5C38.0318 17.5005 39.673 22.1834 40.9123 29.8726C38.1589 30.3836 35.6807 30.7503 33.6667 31.0078C35.766 31.2761 38.3702 31.6613 41.2641 32.2067C42.1475 38.5062 42.7826 46.4593 43.0607 55.3229C43.1331 59.8802 43.1874 71.4619 42.8262 81.3302C41.8722 100.029 39.2796 113.44 36.2296 113.441C32.634 113.441 29.6726 94.8041 29.2839 70.8366C29.2703 69.5595 29.2434 66.9482 29.2427 66.7139C29.2411 66.3008 29.24 65.8862 29.24 65.4706C29.24 38.9773 32.3697 17.5001 36.2296 17.5ZM72.4495 44.9962C72.8192 45.3256 73.179 45.662 73.5265 46.0062C79.7313 52.1531 83.4165 62.6079 85.7009 71.5753C85.264 95.1861 82.329 113.441 78.7704 113.441C74.9107 113.44 71.7817 91.9632 71.7817 65.4706C71.7817 63.2022 71.8054 60.9705 71.8498 58.7859C71.9019 54.4921 72.0805 51.0178 72.1631 49.8177C72.246 48.1679 72.3419 46.5589 72.4495 44.9962ZM18.6052 25.843C21.4581 25.8439 23.7704 43.6085 23.7704 65.522C23.7704 66.9396 23.7607 68.3401 23.7418 69.7193L23.7096 71.6578C23.3256 90.6581 21.1864 105.201 18.6052 105.202C15.7523 105.202 13.4391 87.4363 13.4391 65.522C13.4392 43.6079 15.7523 25.843 18.6052 25.843ZM101.099 49.1526C101.394 54.1433 101.561 59.6854 101.561 65.522C101.561 87.4361 99.2477 105.202 96.3948 105.202C93.867 105.201 91.7648 91.2534 91.3182 72.8311C93.2405 64.9676 96.2357 55.703 101.099 49.1526ZM5.23478 45.9344C6.74514 45.9346 7.96955 54.6843 7.96956 65.4777C7.96956 76.2712 6.74515 85.0217 5.23478 85.0219C3.72442 85.0216 2.5 76.2711 2.5 65.4777C2.50002 54.6844 3.72443 45.9347 5.23478 45.9344ZM109.765 45.9344C111.276 45.9348 112.5 54.6845 112.5 65.4777C112.5 76.271 111.276 85.0215 109.765 85.0219C108.255 85.0216 107.03 76.2711 107.03 65.4777C107.03 54.6844 108.255 45.9347 109.765 45.9344Z",
    spark1: "M96.6643 38.2584C91.3343 43.8202 89.5576 55.7865 88.75 60C87.9424 55.7865 86.1657 43.82 80.8357 38.2582C75.5056 32.6964 65.007 30.6742 60 30C65.007 29.3259 75.5056 27.3034 80.8357 21.7416C86.1657 16.1798 87.9424 4.21349 88.75 0C89.5576 4.21349 91.3343 16.1796 96.6643 21.7414C101.994 27.3032 112.493 29.3258 117.5 30C112.493 30.6741 101.994 32.6966 96.6643 38.2584Z",
    spark2: "M60.941 15.941C58.6236 18.2584 57.8511 23.2444 57.5 25C57.1489 23.2444 56.3764 18.2583 54.059 15.9409C51.7416 13.6235 47.177 12.7809 45 12.5C47.177 12.2191 51.7416 11.3764 54.059 9.059C56.3764 6.74158 57.1489 1.75562 57.5 0C57.8511 1.75562 58.6236 6.74149 60.941 9.0589C63.2584 11.3763 67.823 12.2191 70 12.5C67.823 12.7809 63.2584 13.6236 60.941 15.941Z"
  };

  var reduced = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  function parseShapes(T, d) {
    var toks = d.match(/[MCLZ]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi) || [];
    var shapes = [], sh = null, cmd = null, i = 0;
    function n() { return parseFloat(toks[i++]); }
    function Y(y) { return 120 - y; }
    while (i < toks.length) {
      var tk = toks[i];
      if (/^[MCLZ]$/i.test(tk)) {
        cmd = tk.toUpperCase(); i++;
        if (cmd === "Z") { if (sh) { sh.closePath(); shapes.push(sh); sh = null; } continue; }
      }
      if (cmd === "M") { sh = new T.Shape(); var x = n(), y = n(); sh.moveTo(x, Y(y)); cmd = "L"; }
      else if (cmd === "L" && sh) { var lx = n(), ly = n(); sh.lineTo(lx, Y(ly)); }
      else if (cmd === "C" && sh) { var a = n(), b = n(), c = n(), e = n(), f = n(), g = n(); sh.bezierCurveTo(a, Y(b), c, Y(e), f, Y(g)); }
      else i++;
    }
    if (sh) shapes.push(sh);
    return shapes;
  }

  function buildLogo(T) {
    var ext = { depth: 9, bevelEnabled: true, bevelThickness: 1.6, bevelSize: 0.9, bevelSegments: 3, curveSegments: 28 };
    var barGeo = new T.ExtrudeGeometry(parseShapes(T, LOGO.bars), ext);
    var stops = [[0, "#DABBA3"], [0.255, "#EF6406"], [0.51, "#C60F01"], [0.827, "#620301"], [1, "#060505"]].map(function (s) { return [s[0], new T.Color(s[1])]; });
    var ax = 31.25, ay = 10, bx = 83.54, by = 83.7, dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy;
    var pos = barGeo.attributes.position, cols = new Float32Array(pos.count * 3), col = new T.Color();
    for (var i = 0; i < pos.count; i++) {
      var t = ((pos.getX(i) - ax) * dx + (pos.getY(i) - ay) * dy) / L2;
      t = Math.max(0, Math.min(1, t));
      var k = 0;
      while (k < stops.length - 2 && t > stops[k + 1][0]) k++;
      col.copy(stops[k][1]).lerp(stops[k + 1][1], (t - stops[k][0]) / (stops[k + 1][0] - stops[k][0]));
      cols[i * 3] = col.r; cols[i * 3 + 1] = col.g; cols[i * 3 + 2] = col.b;
    }
    barGeo.setAttribute("color", new T.BufferAttribute(cols, 3));
    var barMat = new T.MeshStandardMaterial({ vertexColors: true, roughness: 0.32, metalness: 0.12 });
    var sparkGeo = new T.ExtrudeGeometry(parseShapes(T, LOGO.spark1).concat(parseShapes(T, LOGO.spark2)), { depth: 6, bevelEnabled: true, bevelThickness: 1.2, bevelSize: 0.6, bevelSegments: 3, curveSegments: 24 });
    var sparkMat = new T.MeshStandardMaterial({ color: "#FFC700", emissive: "#ff9d00", emissiveIntensity: 0.3, roughness: 0.28, metalness: 0.1 });
    var sparks = new T.Mesh(sparkGeo, sparkMat);
    sparks.position.z = 4;
    var inner = new T.Group();
    inner.add(new T.Mesh(barGeo, barMat));
    inner.add(sparks);
    inner.position.set(-60, -60, -4.5);
    var g = new T.Group();
    g.add(inner);
    return g;
  }

  function addLights(T, scene) {
    scene.add(new T.AmbientLight(0xffffff, 1.3));
    var key = new T.DirectionalLight(0xffffff, 2.6); key.position.set(2.5, 3, 4); scene.add(key);
    var rim = new T.DirectionalLight(0xffc49a, 1.4); rim.position.set(-3, -1.5, -2.5); scene.add(rim);
    var fill = new T.DirectionalLight(0xffffff, 0.8); fill.position.set(-2, 1, 3); scene.add(fill);
  }

  function makeRenderer(T, canvas) {
    var r = new T.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    r.setClearColor(0x000000, 0);
    return r;
  }

  function watch(canvas, renderer, camera, onResize) {
    var state = { visible: true };
    var parent = canvas.parentElement || canvas;
    function resize() {
      var b = parent.getBoundingClientRect();
      var w = Math.max(1, Math.round(b.width)), h = Math.max(1, Math.round(b.height));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      if (onResize) onResize();
    }
    resize();
    if (window.ResizeObserver) new ResizeObserver(resize).observe(parent);
    else window.addEventListener("resize", resize);
    if (window.IntersectionObserver) new IntersectionObserver(function (e) { state.visible = e[0] ? e[0].isIntersecting : true; }).observe(canvas);
    return state;
  }

  function startOrb(canvas, accent) {
    var T = window.THREE;
    if (!T || !canvas) return null;
    var renderer = makeRenderer(T, canvas);
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var scene = new T.Scene();
    var camera = new T.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(0, 0, 4.4);
    var group = new T.Group();
    group.rotation.z = 0.18;
    scene.add(group);

    var N = 2600, pos = new Float32Array(N * 3), seed = new Float32Array(N);
    for (var i = 0; i < N; i++) {
      var y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.399963229728653;
      pos[i * 3] = Math.cos(th) * r; pos[i * 3 + 1] = y; pos[i * 3 + 2] = Math.sin(th) * r;
      seed[i] = Math.random();
    }
    var geo = new T.BufferGeometry();
    geo.setAttribute("position", new T.BufferAttribute(pos, 3));
    geo.setAttribute("aSeed", new T.BufferAttribute(seed, 1));
    var mat = new T.ShaderMaterial({
      transparent: true, depthWrite: false, blending: T.NormalBlending,
      uniforms: { uTime: { value: 0 }, uSize: { value: 2.4 * dpr }, uColor: { value: new T.Color(accent) }, uInk: { value: new T.Color("#9a948b") } },
      vertexShader: [
        "attribute float aSeed; uniform float uTime; uniform float uSize; varying float vD; varying float vA;",
        "void main(){ vec3 p = position; float ang = atan(p.z, p.x);",
        " float band = 1.0 - smoothstep(0.0, 0.75, abs(p.y));",
        " float w = sin(ang * 6.0 + uTime * 1.3) * 0.55 + sin(ang * 11.0 - uTime * 2.1) * 0.3 + sin(p.y * 9.0 + uTime) * 0.15;",
        " float d = w * 0.085 * band + sin(uTime * 1.6 + aSeed * 6.2831) * 0.01; p *= 1.0 + d; vD = d;",
        " vec4 mv = modelViewMatrix * vec4(p, 1.0); vA = clamp((-mv.z - 5.6) / -2.4, 0.12, 1.0);",
        " gl_PointSize = uSize * (0.55 + vA * 0.75) * (4.4 / -mv.z); gl_Position = projectionMatrix * mv; }"
      ].join("\n"),
      fragmentShader: [
        "uniform vec3 uColor; uniform vec3 uInk; varying float vD; varying float vA;",
        "void main(){ vec2 c = gl_PointCoord - 0.5; float r = length(c); if (r > 0.5) discard;",
        " float a = smoothstep(0.5, 0.05, r); vec3 col = mix(uInk, uColor, clamp(vD * 10.0 + 0.4, 0.0, 1.0));",
        " gl_FragColor = vec4(col, a * vA * 0.95); }"
      ].join("\n")
    });
    group.add(new T.Points(geo, mat));

    var rings = [];
    [[1.32, 0.78, 0.5], [1.44, 0.55, 0.32], [1.56, 0.35, 0.2]].forEach(function (a, k) {
      var pts = [];
      for (var j = 0; j <= 160; j++) { var t = (j / 160) * Math.PI * 2 * a[1]; pts.push(new T.Vector3(Math.cos(t) * a[0], Math.sin(t) * a[0], 0)); }
      var line = new T.Line(new T.BufferGeometry().setFromPoints(pts), new T.LineBasicMaterial({ color: accent, transparent: true, opacity: a[2] }));
      line.rotation.x = 1.15 + k * 0.18; line.rotation.y = -0.25 + k * 0.3;
      group.add(line); rings.push(line);
    });

    addLights(T, scene);
    var logo = buildLogo(T);
    logo.scale.setScalar(0.56 / 60);
    var holder = new T.Group();
    holder.add(logo);
    scene.add(holder);

    function render() { renderer.render(scene, camera); }
    var vis = watch(canvas, renderer, camera, function () { if (reduced) render(); });
    if (reduced) { mat.uniforms.uTime.value = 1.2; holder.rotation.set(0.1, -0.4, 0); render(); return true; }
    var t0 = performance.now();
    (function tick(now) {
      requestAnimationFrame(tick);
      if (!vis.visible) return;
      var t = (now - t0) / 1000;
      mat.uniforms.uTime.value = t;
      group.rotation.y = t * 0.12;
      holder.rotation.y = Math.sin(t * 0.55) * 0.55;
      holder.rotation.x = 0.08 + Math.sin(t * 0.4) * 0.06;
      holder.position.y = Math.sin(t * 0.9) * 0.03;
      rings.forEach(function (r, k) { r.rotation.z = t * ((Math.PI * 2) / (8 + k * 1.5)) * (k % 2 ? -1 : 1); });
      render();
    })(t0);
    return true;
  }

  function startLogo(canvas) {
    var T = window.THREE;
    if (!T || !canvas) return null;
    var renderer = makeRenderer(T, canvas);
    var scene = new T.Scene();
    var camera = new T.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0, 5.2);
    addLights(T, scene);
    var logo = buildLogo(T);
    logo.scale.setScalar(1 / 60);
    var holder = new T.Group();
    holder.add(logo);
    scene.add(holder);
    function render() { renderer.render(scene, camera); }
    var vis = watch(canvas, renderer, camera, render);
    if (reduced) { holder.rotation.set(0.12, -0.4, 0); render(); return true; }
    var tx = 0, ty = 0, rx = 0, ry = 0;
    window.addEventListener("pointermove", function (e) {
      var b = canvas.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, (e.clientX - (b.left + b.width / 2)) / 500));
      ty = Math.max(-1, Math.min(1, (e.clientY - (b.top + b.height / 2)) / 500));
    }, { passive: true });
    var t0 = performance.now();
    (function tick(now) {
      requestAnimationFrame(tick);
      if (!vis.visible) return;
      var t = (now - t0) / 1000;
      ry += (tx * 0.7 + Math.sin(t * 0.6) * 0.35 - ry) * 0.06;
      rx += (ty * 0.45 + 0.08 - rx) * 0.06;
      holder.rotation.set(rx, ry, 0);
      holder.position.y = Math.sin(t * 1.1) * 0.05;
      render();
    })(t0);
    return true;
  }

  function safe(fn, canvas, arg) {
    try { return fn(canvas, arg); } catch (e) { if (window.console) console.warn("MeetSense 3D:", e); return null; }
  }

  window.MSOrb = {
    start: function (canvas, accent) { return safe(startOrb, canvas, accent || "#b8430f"); },
    startLogo: function (canvas) { return safe(startLogo, canvas); }
  };
})();

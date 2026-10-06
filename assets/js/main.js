/* MeetSense landing — etkileşimler */
(function () {
  "use strict";

  var I18N = window.MS_I18N;
  var CFG = window.MS_CONFIG;
  var LOGO_SRC = "assets/img/meetsense-mark.svg";
  var reduced = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  var state = {
    lang: "tr",
    phase: 3,
    elapsed: 254,
    recPaused: false,
    tab: "summary",
    tpl: "standard",
    q: 0,
    tourPos: 252,
    playing: false,
    focus: null,
    tplVideoOpen: false
  };
  var t = null;

  /* ---------- helpers ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function ic(id, size, extra) { size = size || 16; return '<svg width="' + size + '" height="' + size + '" aria-hidden="true"' + (extra || "") + '><use href="#i-' + id + '"/></svg>'; }
  function get(o, path) { return path.split(".").reduce(function (a, k) { return a == null ? a : a[k]; }, o); }
  function pad(n) { return String(n).padStart(2, "0"); }
  function hms(s) { return pad(Math.floor(s / 3600)) + ":" + pad(Math.floor((s % 3600) / 60)) + ":" + pad(s % 60); }
  function ms(s) { return pad(Math.floor(s / 60)) + ":" + pad(s % 60); }
  function toSec(tm) { var p = String(tm).split(":"); return parseInt(p[0], 10) * 60 + parseInt(p[1], 10); }
  function html(el, s) { if (el) el.innerHTML = s; }
  function kindIcon(k, size) { return ic(k === "decision" ? "decision" : k === "action" ? "action" : "risk", size || 16); }
  function eq() { return '<span class="eq" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>'; }
  function noise(i, seed) { return Math.abs(Math.sin((i + seed) * 12.9898) * 43758.5453) % 1; }

  function fillLogos(root) {
    $$(".l3d", root).forEach(function (el) {
      if (el.childElementCount) return;
      var inner = document.createElement("span");
      inner.className = "l3d-in";
      for (var i = 0; i < 6; i++) { var img = document.createElement("img"); img.src = LOGO_SRC; img.alt = ""; inner.appendChild(img); }
      el.appendChild(inner);
      el.setAttribute("aria-hidden", "true");
    });
  }

  /* ---------- i18n ---------- */
  function applyI18n() {
    document.documentElement.lang = state.lang;
    $$("[data-i18n]").forEach(function (el) {
      var v = get(t, el.getAttribute("data-i18n"));
      if (typeof v === "string") el.textContent = v;
    });
    $$("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var p = pair.split(":"); var v = get(t, p[1]);
        if (typeof v === "string") el.setAttribute(p[0], v);
      });
    });
    $$(".lang button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === state.lang)); });
    document.title = state.lang === "tr" ? "MeetSense — Microsoft Teams için yapay zekâ toplantı asistanı" : "MeetSense — AI meeting assistant for Microsoft Teams";
  }

  function setLang(lang) {
    if (!I18N[lang]) lang = "tr";
    state.lang = lang;
    t = I18N[lang];
    try { localStorage.setItem("ms-lang", lang); } catch (e) {}
    applyI18n();
    renderAll();
  }

  /* ---------- hero stage ---------- */
  function renderStage() {
    html($("#trust"), t.hero.trust.map(function (x) { return "<li>" + ic("shield", 18) + esc(x) + "</li>"; }).join(""));
    html($("#stage-lines"), t.stage.lines.map(function (l) {
      return '<div class="line-card" data-show="true" data-speaking="false"><span class="ava">' + esc(l.i) + '</span><div style="min-width:0;flex:1 1 auto"><div class="line-head"><span class="name">' + esc(l.n) + '</span><span class="tm mono">' + esc(l.tm) + '</span><span class="eq-slot" style="margin-left:auto"></span></div><p class="txt">' + esc(l.x) + "</p></div></div>";
    }).join(""));
    html($("#stage-outs"), t.stage.outs.map(function (o) {
      return '<div class="out-card" data-show="true"><div class="out-head"><span class="kind" data-kind="' + o.kind + '">' + kindIcon(o.kind) + esc(o.label) + '</span><span class="mono" style="font-size:11px;color:var(--ink-3)">' + esc(o.meta) + '</span></div><p class="out-x">' + esc(o.x) + "</p></div>";
    }).join(""));
    updateStage();
    updateRec();
  }

  function updateStage() {
    var ph = state.phase;
    var visLines = ph >= 3 ? 3 : ph + 1;
    var speak = ph < 3 && !state.recPaused ? ph : -1;
    var visOuts = ph >= 3 ? 3 : ph;
    $$("#stage-lines .line-card").forEach(function (el, i) {
      el.setAttribute("data-show", String(i < visLines));
      el.setAttribute("data-speaking", String(i === speak));
      var slot = $(".eq-slot", el);
      if (slot) slot.innerHTML = i === speak ? eq() : "";
    });
    $$("#stage-outs .out-card").forEach(function (el, i) { el.setAttribute("data-show", String(i < visOuts)); });
  }

  function updateRec() {
    $("#rec-time").textContent = hms(state.elapsed);
    $("#rec-label").textContent = state.recPaused ? t.stage.paused : t.stage.rec;
    var b = $("#rec-toggle");
    b.setAttribute("aria-pressed", String(state.recPaused));
    b.innerHTML = (state.recPaused ? '<span class="dot" style="width:10px;height:10px;color:var(--danger)"></span>' : ic("pause", 14)) + "<span>" + esc(state.recPaused ? t.stage.resume : t.stage.pause) + "</span>";
    $("#stage").setAttribute("data-paused", String(state.recPaused));
  }

  function buildWaves() {
    var base = [];
    for (var i = 0; i < 90; i++) {
      var env = 0.35 + 0.65 * Math.abs(Math.sin(i * 0.21) * Math.cos(i * 0.07));
      var silent = i % 23 > 19;
      var h = silent ? 8 : Math.max(12, Math.round((0.2 + 0.8 * noise(i, 0) * env) * 100));
      base.push('<span class="bar" data-sp="' + (silent ? 0 : (Math.floor(i / 23) % 2 ? 2 : 1)) + '" style="height:' + h + '%"></span>');
    }
    html($("#hero-wave"), base.concat(base).join(""));
    var band = [];
    for (var j = 0; j < 70; j++) {
      var e2 = 0.35 + 0.65 * Math.abs(Math.sin(j * 0.21) * Math.cos(j * 0.07));
      band.push('<span style="height:' + Math.max(12, Math.round((0.2 + 0.8 * noise(j, 0) * e2) * 100)) + '%"></span>');
    }
    html($("#band-wave"), band.join(""));
    var tw = [];
    for (var k = 0; k < 80; k++) tw.push(Math.max(10, Math.round((0.18 + 0.82 * (Math.abs(Math.sin(k * 78.233) * 12345.678) % 1) * (0.4 + 0.6 * Math.abs(Math.sin(k * 0.17)))) * 100)));
    html($("#player-bars"), tw.map(function (h) { return '<span class="wbar" style="height:' + h + '%"></span>'; }).join(""));
    html($("#band-mini"), tw.slice(0, 36).map(function (h, i) { return '<span class="wbar" data-played="' + (i < 24) + '" style="height:' + h + '%"></span>'; }).join(""));
  }

  /* ---------- simple lists ---------- */
  function renderLists() {
    html($("#facts"), t.facts.items.map(function (f) { return '<div class="fact"><div class="fact-n">' + esc(f.n) + '</div><div class="fact-l">' + esc(f.l) + '</div><div class="fact-c">' + esc(f.c) + "</div></div>"; }).join(""));
    html($("#steps"), t.how.steps.map(function (s) { return '<li><span class="step-n mono">' + esc(s.n) + "</span><h3>" + esc(s.t) + "</h3><p>" + esc(s.d) + '</p><span class="step-tag mono">' + esc(s.tag) + "</span></li>"; }).join(""));
    html($("#vsteps"), t.how.steps.map(function (s) { return '<li><span class="mono" style="font-size:12px;color:var(--ink-3)">' + esc(s.n) + "</span>" + esc(s.t) + "</li>"; }).join(""));
    html($("#band-steps"), t.band1.steps.map(function (s) { return '<li><span class="mono">' + esc(s.tm) + "</span><span>" + esc(s.x) + "</span>" + ic("check", 18, ' style="color:var(--ac)"') + "</li>"; }).join(""));
    html($("#tour-points"), t.tour.points.map(function (p) { return "<li>" + ic("decision", 20) + esc(p) + "</li>"; }).join(""));
    html($("#kpis"), t.weekly.kpis.map(function (k) {
      return "<div><b>" + esc(k.v) + '</b><div class="l">' + esc(k.l) + (k.flag ? '<span class="attn">' + ic("risk", 13) + esc(t.weekly.attention) + "</span>" : "") + '</div><div class="d mono">' + esc(k.d) + ' <span style="color:var(--ink-4)">' + esc(t.weekly.vsPrev) + "</span></div></div>";
    }).join(""));
    html($("#insights"), t.weekly.insights.map(function (x) {
      return '<div class="insight"><div style="display:flex;align-items:center;gap:8px"><span data-kind="' + x.kind + '" style="font-size:13px;font-weight:600">' + esc(x.tag) + '</span><span style="font-size:12px;color:var(--ink-3)">· ' + esc(x.level) + '</span></div><p style="font-size:15px;line-height:1.55">' + esc(x.x) + '</p><span class="mono" style="font-size:12px;color:var(--ink-3)">' + esc(x.m) + "</span></div>";
    }).join(""));
    var icons = { user: "lock", cal: "cal", eye: "shield", team: "team", share: "link", globe: "globe" };
    html($("#ent-items"), t.ent.items.map(function (e) { return '<div class="ent-item"><span class="ent-ico">' + ic(icons[e.ic] || "info", 20) + "</span><div><h3>" + esc(e.l) + "</h3><p>" + esc(e.v) + "</p></div></div>"; }).join(""));
    html($("#principles"), t.ent.principles.map(function (p) { return "<li>" + ic("check", 18) + esc(p) + "</li>"; }).join(""));
    html($("#it-tags"), t.band3.tags.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join(""));
    html($("#faq"), t.faq.items.map(function (f) { return "<details><summary>" + esc(f.q) + ic("chev", 20) + "</summary><p>" + esc(f.a) + "</p></details>"; }).join(""));
    html($("#agenda"), t.demo.agenda.map(function (a) { return '<li><span class="num mono">' + esc(a.n) + "</span>" + esc(a.x) + "</li>"; }).join(""));
    var sizes = t.demo.sizes;
    html($("#f-size"), ["a", "b", "c", "d"].map(function (k) { return "<option>" + esc(sizes[k]) + "</option>"; }).join(""));
  }

  /* ---------- product tour ---------- */
  var MARKS = [[252, "decision"], [271, "action"], [302, "risk"], [340, "decision"], [375, "risk"]];

  function renderTour() {
    var tabs = ["summary", "decisions", "actions", "risks", "transcript"];
    var counts = { decisions: t.tour.decisions.length, actions: t.tour.actions.length, risks: t.tour.risks.length };
    html($("#tour-tabs"), tabs.map(function (k) {
      return '<button type="button" role="tab" class="tab" data-tab="' + k + '" aria-selected="' + (state.tab === k) + '">' + esc(t.tour.tabs[k]) + (counts[k] ? '<span class="count">' + counts[k] + "</span>" : "") + "</button>";
    }).join(""));
    html($("#player-marks"), MARKS.map(function (m) { return '<span class="mark" data-kind="' + m[1] + '" style="left:' + (((m[0] - 240) / 150) * 100).toFixed(2) + '%"></span>'; }).join(""));
    var p = $("#tour-panel"), tt = t.tour, s = "";
    function seg(tm, label) { return '<button type="button" class="seg" data-seek="' + toSec(tm) + '" aria-label="' + esc(tt.player.seg + " " + tm) + '">' + ic("play", 10) + esc(tm) + "</button>"; }
    if (state.tab === "summary") {
      s = '<div style="display:flex;flex-direction:column;gap:18px"><p class="sum-lead">' + esc(tt.summaryLead) + '</p><p style="font-size:15px;line-height:1.65;color:var(--ink-3)">' + esc(tt.summary) + '</p><div class="sum-grid">' +
        '<div><b>3</b><span data-kind="decision">' + esc(tt.tabs.decisions) + "</span></div>" +
        '<div><b>4</b><span data-kind="action">' + esc(tt.tabs.actions) + "</span></div>" +
        '<div><b style="color:var(--ac)">1</b><span style="color:var(--danger)">' + esc(tt.noOwnerCount) + "</span></div>" +
        '<div><b>2</b><span data-kind="risk">' + esc(tt.tabs.risks) + "</span></div></div>" +
        '<div><div style="font-size:13px;font-weight:500;color:var(--ink-3);margin-bottom:8px">' + esc(tt.highlightsTitle) + '</div><ul class="bul">' + tt.highlights.map(function (h) { return "<li>" + esc(h) + "</li>"; }).join("") + "</ul></div></div>";
    } else if (state.tab === "decisions" || state.tab === "risks") {
      var kind = state.tab === "decisions" ? "decision" : "risk";
      s = '<ul class="list">' + tt[state.tab].map(function (d) {
        return '<li class="row"><span data-kind="' + kind + '" style="flex:0 0 auto;margin-top:2px">' + kindIcon(kind, 18) + '</span><div style="flex:1 1 auto;min-width:0"><div class="row-x">' + esc(d.x) + '</div><div class="row-meta">' + esc(d.who) + seg(d.tm) + "</div></div></li>";
      }).join("") + "</ul>";
    } else if (state.tab === "actions") {
      s = '<ul class="list">' + tt.actions.map(function (a) {
        return '<li class="row" style="flex-wrap:wrap;align-items:center;gap:12px 14px"><span data-kind="action" style="flex:0 0 auto">' + kindIcon("action", 18) + '</span><div class="row-x" style="flex:1 1 240px;min-width:0">' + esc(a.x) + "</div>" +
          (a.noOwner ? '<span class="noowner">' + ic("risk", 14) + esc(tt.noOwner) + "</span>" : '<span style="font-size:13px;color:var(--ink-2)">' + esc(a.owner) + "</span>") +
          '<span class="mono" style="font-size:12px;color:var(--ink-3);min-width:64px;text-align:right">' + esc(a.due) + "</span></li>";
      }).join("") + "</ul>";
    } else {
      s = '<ul class="list" style="gap:6px">' + tt.transcript.map(function (l, i) {
        return '<li class="tline" data-start="' + toSec(l.tm) + '"><span class="ava ava-sm">' + esc(l.i) + '</span><div style="min-width:0;flex:1 1 auto"><div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center"><span class="name">' + esc(l.n) + "</span>" + seg(l.tm) + '<span class="eq-slot"></span></div><p class="txt">' + esc(l.x) + "</p></div></li>";
      }).join("") + "</ul>";
    }
    html(p, s);
    updatePlayer();
  }

  function updatePlayer() {
    var frac = Math.max(0, Math.min(1, (state.tourPos - 240) / 150));
    $$("#player-bars .wbar").forEach(function (b, i) { b.setAttribute("data-played", String(i / 80 < frac)); });
    $("#player-head").style.left = (frac * 100).toFixed(2) + "%";
    $("#player-time").textContent = ms(state.tourPos);
    var btn = $("#player-btn");
    btn.setAttribute("aria-pressed", String(state.playing));
    btn.setAttribute("aria-label", state.playing ? t.tour.player.pause : t.tour.player.play);
    btn.innerHTML = ic(state.playing ? "pause" : "play", 16);
    var lines = $$("#tour-panel .tline");
    lines.forEach(function (el, i) {
      var s0 = +el.getAttribute("data-start");
      var s1 = lines[i + 1] ? +lines[i + 1].getAttribute("data-start") : 390;
      var active = state.tourPos >= s0 && state.tourPos < s1;
      el.setAttribute("data-active", String(active));
      var slot = $(".eq-slot", el);
      if (slot) slot.innerHTML = active && state.playing ? eq() : "";
    });
  }

  /* ---------- templates ---------- */
  function renderTemplates() {
    var T = t.templates;
    html($("#tpl-tabs"), T.list.map(function (x) {
      return '<button type="button" role="tab" class="tpl-btn" data-tpl="' + x.id + '" aria-selected="' + (state.tpl === x.id) + '"><b>' + esc(x.name) + "</b><span>" + esc(x.purpose) + "</span></button>";
    }).join(""));
    var vid = state.tpl === "sales" ? "d1" : state.tpl === "interview" ? "d2" : null;
    var s = "";
    if (vid) {
      var v = CFG.videos[vid];
      if (state.tplVideoOpen) {
        s += '<div class="vrow-inline"><div class="vslot" data-video="' + vid + '" data-autoplay="1"></div></div>';
      } else {
        s += '<button type="button" class="vrow" data-tplvideo="1"><span class="vrow-thumb"><img src="' + esc(v.poster) + '" alt="" loading="lazy"><span class="vplay">' + ic("play", 12) + '</span></span><span style="display:flex;flex-direction:column;gap:4px;min-width:0"><span style="font-size:13px;font-weight:600;color:var(--ac-ink)">' + esc(t.videos.tplWatch) + '</span><span style="font-size:16px;font-weight:600">' + esc(t.videos[vid]) + '</span><span class="mono" style="font-size:12px;color:var(--ink-3)">' + esc(t.videos.cats.d) + " · " + esc(v.dur) + "</span></span></button>";
      }
    }
    var head = function (title, meta, right) { return '<div class="spec-head"><div><div class="spec-title">' + esc(title) + '</div><div class="spec-meta mono">' + esc(meta) + "</div></div>" + (right || "") + "</div>"; };
    var ex = '<span class="tag-example" style="align-self:flex-start">' + esc(t.ui.example) + "</span>";
    if (state.tpl === "standard") {
      s += '<div class="spec">' + head(t.tour.page.title, t.tour.page.meta, ex) + '<p class="sum-lead" style="font-size:20px">' + esc(t.tour.summaryLead) + '</p><div class="kpi-row">' +
        T.standard.rows.map(function (r) { return "<div><b>" + esc(r.v) + "</b><span>" + esc(r.l) + "</span></div>"; }).join("") + '</div><ul class="bul">' + t.tour.highlights.map(function (h) { return "<li>" + esc(h) + "</li>"; }).join("") + "</ul></div>";
    } else if (state.tpl === "sales") {
      var S = T.sales;
      s += '<div class="spec">' + head(S.title, S.meta, '<button type="button" class="mini">' + ic("copy", 16) + esc(S.copy) + "</button>") +
        '<div class="score"><div><div style="font-size:13px;color:var(--ink-3)">' + esc(S.scoreLabel) + '</div><div class="score-n">68<small>/100</small></div><div style="margin-top:6px;font-size:13px;font-weight:500">' + esc(S.band) + '</div></div><div class="bars">' +
        S.bars.map(function (b) { return '<div><div class="bar-row"><span>' + esc(b.l) + '</span><span class="mono" style="color:var(--ink)">' + b.v + '</span></div><div class="track"><i style="width:' + b.v + '%"></i></div></div>'; }).join("") + "</div></div>" +
        '<div class="two"><div class="box"><div class="box-t" style="color:var(--ok)">' + ic("check", 16) + esc(S.posTitle) + "</div><ul>" + S.pos.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + '</ul></div><div class="box"><div class="box-t" style="color:var(--risk)">' + ic("risk", 16) + esc(S.riskTitle) + "</div><ul>" + S.risks.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div></div></div>";
    } else if (state.tpl === "interview") {
      var I = T.interview, dec = state.lang === "tr" ? "," : ".";
      s += '<div class="spec"><div class="spec-head" style="align-items:center"><div style="display:flex;align-items:center;gap:14px"><span class="ava" style="width:44px;height:44px;font-size:13px">CÖ</span><div><div class="spec-title">Can Öztürk</div><div class="spec-meta mono">' + esc(I.meta) + '</div></div></div><span class="chip">' + esc(I.type) + "</span></div>" +
        '<div class="rec-box"><div style="display:flex;flex-wrap:wrap;align-items:center;gap:10px"><span style="font-size:13px;color:var(--ink-3)">' + esc(I.recLabel) + '</span><span style="display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:600;color:var(--ok)">' + ic("check", 16) + esc(I.rec) + '</span></div><p style="margin-top:8px;font-size:14px;line-height:1.6;color:var(--ink-2)">' + esc(I.note) + "</p></div>" +
        '<div style="display:flex;flex-direction:column;gap:12px">' + I.criteria.map(function (c) { return '<div class="crit"><span>' + esc(c.l) + '</span><span class="track" style="margin:0"><i style="width:' + (c.v / 5) * 100 + '%"></i></span><span class="mono">' + String(c.v).replace(".", dec) + " / 5</span></div>"; }).join("") + "</div>" +
        '<div class="two" style="grid-template-columns:repeat(auto-fit,minmax(170px,1fr))">' +
        '<div class="box"><div class="box-t">' + esc(I.strTitle) + "</div><ul>" + I.str.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>" +
        '<div class="box"><div class="box-t">' + esc(I.devTitle) + "</div><ul>" + I.dev.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>" +
        '<div class="box"><div class="box-t" style="color:var(--risk)">' + esc(I.warnTitle) + "</div><ul>" + I.warn.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div></div>" +
        '<p style="font-size:13px;color:var(--ink-3)">' + esc(I.foot) + "</p></div>";
    } else {
      var U = T.standup;
      s += '<div class="spec" style="gap:18px">' + head(U.title, U.meta, ex) + '<div style="display:flex;flex-direction:column;gap:10px">' +
        U.rows.map(function (r) {
          var blocked = r.b !== "Yok" && r.b !== "None";
          var ini = r.p.split(" ").map(function (w) { return w.charAt(0); }).join("").slice(0, 2);
          return '<div class="su"><div style="display:flex;align-items:center;gap:10px"><span class="ava ava-sm">' + esc(ini) + '</span><span style="font-size:14px;font-weight:600">' + esc(r.p) + "</span>" + (blocked ? '<span class="attn" style="margin-left:auto;font-size:12px">' + ic("risk", 14) + esc(U.cols.b) + "</span>" : "") +
            '</div><div class="su-grid"><div><small>' + esc(U.cols.y) + "</small>" + esc(r.y) + "</div><div><small>" + esc(U.cols.t) + "</small>" + esc(r.t) + "</div><div><small>" + esc(U.cols.b) + "</small>" + esc(r.b) + "</div></div></div>";
        }).join("") + '</div><p style="font-size:13px;color:var(--ink-3)">' + esc(U.foot) + "</p></div>";
    }
    html($("#tpl-panel"), s);
    initVideoSlots($("#tpl-panel"));
  }

  /* ---------- assistant ---------- */
  function renderAssistant() {
    var A = t.assistant, cur = A.qa[state.q];
    html($("#qs"), A.qa.map(function (q, i) { return '<button type="button" class="qbtn" data-q="' + i + '" aria-pressed="' + (i === state.q) + '">' + ic("chat", 18) + esc(q.q) + "</button>"; }).join(""));
    html($("#scopes"), '<span style="font-size:12px;color:var(--ink-3);margin-right:6px">' + esc(A.scopeLabel) + "</span>" + A.scopes.map(function (l, i) { return '<span class="scope" data-on="' + (i === cur.scope) + '">' + esc(l) + "</span>"; }).join(""));
    var box = $("#chat-body");
    html(box, '<div class="bubble">' + esc(cur.q) + '</div><div class="answer"><span class="l3d" style="--s:30px;margin-top:2px"></span><div style="min-width:0;flex:1 1 auto"><div style="font-size:13px;font-weight:600">MeetSense AI</div><p>' + esc(cur.a) + '</p><div style="margin-top:18px;font-size:12px;font-weight:500;color:var(--ink-3)">' + esc(A.sources) + '</div><div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:8px">' +
      cur.src.map(function (x) { return '<span class="src">' + ic("doc", 15) + esc(x.l) + '<span class="mono" style="font-size:11px;color:var(--ink-3)">' + esc(x.r) + "</span></span>"; }).join("") + "</div></div></div>");
    fillLogos(box);
  }

  /* ---------- roles / focus ---------- */
  var ROLE_IDS = ["pm", "hr", "sales", "lead"];
  function renderRoles() {
    html($("#roles"), t.roles.items.map(function (r, i) {
      var id = ROLE_IDS[i];
      return '<button type="button" class="role" data-role="' + id + '" aria-pressed="' + (state.focus === id) + '"><span class="role-top"><span class="mono" style="font-size:12px;color:var(--ink-3)">' + esc(r.n) + '</span><span class="check">' + ic("check", 14) + "</span></span><b>" + esc(r.t) + "</b><p>" + esc(r.d) + '</p><span class="chip" style="align-self:flex-start">' + esc(r.tpl) + "</span></button>";
    }).join(""));
    var idx = ROLE_IDS.indexOf(state.focus);
    $("#role-hint").textContent = idx >= 0 ? t.roles.hintPre + t.roles.items[idx].tpl : t.roles.hintNone;
    var name = state.focus ? t.focusNames[state.focus] : "";
    $("#role-cta").textContent = name ? (state.lang === "tr" ? name + " için demo planla" : "Plan a demo for " + name) : t.nav.demo;
    $("#focus-chip").hidden = !name;
    $("#focus-name").textContent = name;
  }

  /* ---------- videos ---------- */
  var current = null;
  function posterHTML(id) {
    var v = CFG.videos[id];
    return '<button type="button" class="vposter" data-play-slot="1" aria-label="' + esc(t.videos.play + " " + t.videos[id]) + '"><img src="' + esc(v.poster) + '" alt=""><span class="vplay">' + ic("play", v.vertical ? 22 : 28) + '</span><span class="vbadge">' + esc(t.videos.watch) + " · " + esc(v.dur) + "</span></button>";
  }
  function initVideoSlots(root) {
    $$(".vslot[data-video]", root).forEach(function (slot) {
      if (slot.getAttribute("data-autoplay") === "1") { playSlot(slot); return; }
      if (slot.getAttribute("data-playing") === "1") return;
      slot.innerHTML = posterHTML(slot.getAttribute("data-video"));
    });
  }
  function stopCurrent() {
    if (!current) return;
    var slot = current;
    current = null;
    if (!document.body.contains(slot)) return;
    if (slot.closest("#tpl-panel")) { state.tplVideoOpen = false; renderTemplates(); return; }
    slot.removeAttribute("data-playing");
    slot.innerHTML = posterHTML(slot.getAttribute("data-video"));
  }
  function playSlot(slot) {
    if (current && current !== slot) stopCurrent();
    var id = slot.getAttribute("data-video"), v = CFG.videos[id];
    slot.setAttribute("data-playing", "1");
    slot.removeAttribute("data-autoplay");
    if (v.youtubeId) {
      slot.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(v.youtubeId) + '?autoplay=1&rel=0&modestbranding=1&playsinline=1" title="' + esc(t.videos[id]) + '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen loading="lazy"></iframe>';
    } else {
      slot.innerHTML = '<video controls playsinline preload="auto" poster="' + esc(v.poster) + '" src="' + esc(v.file) + '" aria-label="' + esc(t.videos[id]) + '"></video>';
      var vid = $("video", slot);
      var p = vid.play();
      if (p && p.catch) p.catch(function () {});
    }
    current = slot;
  }

  /* ---------- render all ---------- */
  function renderAll() {
    renderStage();
    renderLists();
    renderTour();
    renderTemplates();
    renderAssistant();
    renderRoles();
    $$(".vslot[data-video]").forEach(function (slot) { if (slot.getAttribute("data-playing") !== "1") slot.innerHTML = posterHTML(slot.getAttribute("data-video")); });
    fillLogos(document);
  }

  /* ---------- events ---------- */
  function bind() {
    document.addEventListener("click", function (e) {
      var el;
      if ((el = e.target.closest("[data-lang]"))) { setLang(el.getAttribute("data-lang")); return; }
      if ((el = e.target.closest("[data-tab]"))) { state.tab = el.getAttribute("data-tab"); renderTour(); return; }
      if ((el = e.target.closest("[data-seek]"))) { state.tourPos = +el.getAttribute("data-seek"); state.playing = true; if (state.tab !== "transcript") { state.tab = "transcript"; renderTour(); } else updatePlayer(); return; }
      if ((el = e.target.closest("[data-tpl]"))) { if (current && current.closest("#tpl-panel")) current = null; state.tpl = el.getAttribute("data-tpl"); state.tplVideoOpen = false; renderTemplates(); return; }
      if ((el = e.target.closest("[data-tplvideo]"))) { if (current) stopCurrent(); state.tplVideoOpen = true; renderTemplates(); return; }
      if ((el = e.target.closest("[data-q]"))) { state.q = +el.getAttribute("data-q"); renderAssistant(); return; }
      if ((el = e.target.closest("[data-role]"))) { var id = el.getAttribute("data-role"); state.focus = state.focus === id ? null : id; renderRoles(); return; }
      if ((el = e.target.closest("[data-play-slot]"))) { playSlot(el.closest(".vslot")); return; }
      if ((el = e.target.closest("[data-play]"))) { var s = $('.vslot[data-video="' + el.getAttribute("data-play") + '"]'); if (s) playSlot(s); return; }
    });
    $("#rec-toggle").addEventListener("click", function () { state.recPaused = !state.recPaused; updateRec(); updateStage(); });
    $("#player-btn").addEventListener("click", function () { state.playing = !state.playing; updatePlayer(); });
    $("#promo-close").addEventListener("click", function () { $("#promo").hidden = true; });
    $("#float-close").addEventListener("click", function () { floatClosed = true; $("#float").setAttribute("data-visible", "false"); });
    $("#it-cta").addEventListener("click", function () { state.focus = "it"; renderRoles(); });
    $("#focus-clear").addEventListener("click", function () { state.focus = null; renderRoles(); });
    $("#demo-again").addEventListener("click", function () { $("#demo-success").hidden = true; $("#demo-form").hidden = false; });
    $("#demo-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var f = e.target;
      if (!f.checkValidity()) { f.reportValidity(); return; }
      var v = function (n) { return f.elements[n] ? f.elements[n].value : ""; };
      var lines = [t.demo.f.name + ": " + v("name"), t.demo.f.email + ": " + v("email"), t.demo.f.company + ": " + v("company"), t.demo.f.size + ": " + v("size"), t.demo.f.msg + ": " + v("message")];
      if (state.focus) lines.push(t.demo.focusLabel + " " + t.focusNames[state.focus]);
      window.location.href = "mailto:" + CFG.demoEmail + "?subject=" + encodeURIComponent(t.demo.mailSubject) + "&body=" + encodeURIComponent(lines.join("\n"));
      f.hidden = true;
      $("#demo-success").hidden = false;
    });
  }

  /* ---------- floating pill ---------- */
  var floatClosed = false;
  function watchFloat() {
    if (!window.IntersectionObserver) { $("#float").setAttribute("data-visible", "true"); return; }
    var heroVisible = true, demoVisible = false;
    function upd() { $("#float").setAttribute("data-visible", String(!floatClosed && !heroVisible && !demoVisible)); }
    new IntersectionObserver(function (e) { heroVisible = e[0].isIntersecting; upd(); }).observe($("#top"));
    new IntersectionObserver(function (e) { demoVisible = e[0].isIntersecting; upd(); }, { threshold: 0.15 }).observe($("#demo"));
  }

  /* ---------- clock ---------- */
  function startClock() {
    var ticks = 0;
    setInterval(function () {
      if (!state.recPaused) {
        state.elapsed++;
        ticks++;
        $("#rec-time").textContent = hms(state.elapsed);
        if (!reduced && ticks % 3 === 0) { state.phase = (state.phase + 1) % 6; updateStage(); }
      }
      if (state.playing) { state.tourPos = state.tourPos + 1 >= 390 ? 240 : state.tourPos + 1; updatePlayer(); }
    }, 1000);
  }

  /* ---------- init ---------- */
  function init() {
    var lang = "tr";
    try {
      var q = new URLSearchParams(location.search).get("lang");
      lang = q || localStorage.getItem("ms-lang") || ((navigator.language || "").toLowerCase().indexOf("tr") === 0 ? "tr" : "tr");
    } catch (e) {}
    state.lang = I18N[lang] ? lang : "tr";
    t = I18N[state.lang];
    buildWaves();
    applyI18n();
    renderAll();
    bind();
    watchFloat();
    startClock();
    if (window.MSOrb) {
      if (window.MSOrb.start($("#orb"), "#b8430f")) $(".orb-box").classList.add("gl");
      if (window.MSOrb.startLogo($("#logo3d"))) $(".logo-stage").classList.add("gl");
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

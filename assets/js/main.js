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
    tplVideoOpen: false,
    appTab: "home"
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
    var tabs = ["summary", "actions", "decisions", "metrics", "transcript"];
    var tt = t.tour;
    var counts = { decisions: tt.decisions.length, actions: tt.actions.length };
    html($("#tour-tabs"), tabs.map(function (k) {
      return '<button type="button" role="tab" class="tab" data-tab="' + k + '" aria-selected="' + (state.tab === k) + '">' + esc(tt.tabs[k]) + (counts[k] ? '<span class="count">' + counts[k] + "</span>" : "") + "</button>";
    }).join(""));
    html($("#player-marks"), MARKS.map(function (m) { return '<span class="mark" data-kind="' + m[1] + '" style="left:' + (((m[0] - 240) / 150) * 100).toFixed(2) + '%"></span>'; }).join(""));
    var p = $("#tour-panel"), s = "";
    function seg(tm) { return '<button type="button" class="seg" data-seek="' + toSec(tm) + '" aria-label="' + esc(tt.player.seg + " " + tm) + '">' + ic("play", 10) + esc(tm) + "</button>"; }
    if (state.tab === "summary") {
      s = '<div style="display:flex;flex-direction:column;gap:16px">' +
        '<div><div class="mini-title">' + esc(tt.purposeTitle) + '</div><p style="margin-top:6px;font-size:15px;line-height:1.55">' + esc(tt.purpose) + "</p></div>" +
        '<div><div class="mini-title">' + esc(tt.resultTitle) + '</div><p class="sum-lead" style="margin-top:6px;font-size:18px">' + esc(tt.summaryLead) + '</p><p style="margin-top:6px;font-size:14px;line-height:1.65;color:var(--ink-3)">' + esc(tt.summary) + "</p></div>" +
        '<div><div class="mini-title" style="margin-bottom:8px">' + esc(tt.topicsTitle) + '</div><div style="display:flex;flex-direction:column;gap:8px">' +
        tt.topics.map(function (x, i) { return '<div class="topic"><span class="topic-n">' + (i + 1) + '</span><div><b style="font-size:14px">' + esc(x.t) + '</b><p style="margin-top:2px;font-size:13px;color:var(--ink-2)">' + esc(x.x) + "</p></div></div>"; }).join("") + "</div></div></div>";
    } else if (state.tab === "actions") {
      var groups = [], idx = {};
      tt.actions.forEach(function (a) { var k = a.noOwner ? "__none" : a.owner; if (!(k in idx)) { idx[k] = groups.length; groups.push({ k: k, items: [] }); } groups[idx[k]].items.push(a); });
      groups.sort(function (a, b) { return (a.k === "__none") - (b.k === "__none"); });
      s = '<div style="display:flex;flex-direction:column;gap:8px">' + groups.map(function (g) {
        var head = g.k === "__none" ? '<div class="unassigned">' + esc(tt.unassigned.toLocaleUpperCase(state.lang === "tr" ? "tr-TR" : "en-US")) + "</div>"
          : '<div class="owner-h"><span class="ava">' + esc(g.k.split(" ").map(function (w) { return w.charAt(0); }).join("").slice(0, 2)) + "</span>" + esc(g.k) + ' <span class="mono" style="font-size:11px;color:var(--ink-3)">· ' + g.items.length + "</span></div>";
        return head + g.items.map(function (a, i) {
          return '<div class="row" style="align-items:center;gap:12px"><span class="mono" style="font-size:12px;color:var(--ink-3)">' + (i + 1) + '</span><div class="row-x" style="flex:1 1 auto;min-width:0">' + esc(a.x) + (a.noOwner ? '<div style="margin-top:6px"><span class="noowner">' + ic("risk", 14) + esc(tt.noOwner) + "</span></div>" : "") +
            '</div><span class="mono hide-sm" style="font-size:12px;color:var(--ink-3)">' + esc(a.due) + '</span><span class="prio" data-p="' + a.p + '">' + esc(tt.prio[a.p]) + "</span></div>";
        }).join("");
      }).join("") + "</div>";
    } else if (state.tab === "decisions") {
      s = '<ul class="list">' + tt.decisions.map(function (d) {
        return '<li class="row"><span data-kind="decision" style="flex:0 0 auto;margin-top:2px">' + kindIcon("decision", 18) + '</span><div style="flex:1 1 auto;min-width:0"><div class="row-x">' + esc(d.x) + '</div><div class="row-meta">' + esc(d.who) + seg(d.tm) + "</div></div></li>";
      }).join("") + "</ul>";
    } else if (state.tab === "metrics") {
      var M = tt.metrics, colors = ["#cc4718", "#0b6bcb", "#1a7f43", "#6d3fd1"];
      s = '<div style="display:flex;flex-direction:column;gap:12px"><div class="metric-grid">' +
        '<div class="metric"><small>' + esc(M.participants) + "</small><b>4</b></div>" +
        '<div class="metric"><small>' + esc(M.duration) + "</small><b>45</b></div>" +
        '<div class="metric"><small>' + esc(M.confidence) + "</small><b>" + esc(M.confidenceV) + "</b></div></div>" +
        '<div class="balance"><div style="display:flex;justify-content:space-between;align-items:center"><span class="mini-title">' + esc(M.balance) + '</span><span class="ok-pill">' + esc(M.balanced) + '</span></div><div style="margin-top:8px;font-size:12px;color:var(--ink-3)">' + esc(M.mostActive) + '</div><div style="font-size:15px;font-weight:600">' + esc(tt.speakers[0][0]) + ' <span class="mono" style="font-size:12px;color:var(--ink-3)">· %' + tt.speakers[0][1] + '</span></div><div class="balance-bar">' +
        tt.speakers.map(function (sp, i) { return '<i style="width:' + sp[1] + "%;background:" + colors[i] + '"></i>'; }).join("") + '</div><div class="legend">' +
        tt.speakers.map(function (sp, i) { return '<span><i style="background:' + colors[i] + '"></i>' + esc(sp[0]) + " %" + sp[1] + "</span>"; }).join("") + "</div></div>" +
        '<div><div class="mini-title" style="margin-bottom:8px">' + esc(M.keywords) + '</div><div class="kw">' + M.kw.map(function (k) { return "<span>" + esc(k) + "</span>"; }).join("") + "</div></div></div>";
    } else {
      s = '<ul class="list" style="gap:6px">' + tt.transcript.map(function (l) {
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
  var TPL_VID = { sales: "d1", interview: "d2" };
  function renderTemplates() {
    var T = t.templates, R = T.report, tt = t.tour;
    html($("#tpl-tabs"), T.list.map(function (x) {
      return '<button type="button" role="tab" class="tpl-btn" data-tpl="' + x.id + '" aria-selected="' + (state.tpl === x.id) + '"><b>' + esc(x.name) + "</b><span>" + esc(x.purpose) + "</span>" + (TPL_VID[x.id] ? '<span class="tpl-vchip"><i>' + ic("play", 9) + "</i>" + esc(t.videos.badge) + " · " + esc(CFG.videos[TPL_VID[x.id]].dur) + "</span>" : "") + "</button>";
    }).join(""));
    var vid = state.tpl === "sales" ? "d1" : state.tpl === "interview" ? "d2" : null;
    var s = "";
    if (vid) {
      var v = CFG.videos[vid];
      if (state.tplVideoOpen) {
        s += '<div class="vrow-inline"><div class="vslot" data-video="' + vid + '" data-autoplay="1"></div></div>';
      } else {
        s += '<button type="button" class="vfeat" data-tplvideo="1" aria-label="' + esc(t.videos.play + " " + t.videos[vid]) + '"><span class="vfeat-thumb"><img src="' + esc(v.poster) + '" alt=""><span class="vfeat-tag">' + esc(t.videos.badge) + '</span><span class="vplay">' + ic("play", 20) + '</span><span class="vfeat-dur">' + esc(v.dur) + '</span></span><span class="vfeat-body"><span class="vfeat-k">' + esc(t.videos.tplWatch) + '</span><span class="vfeat-t">' + esc(t.videos[vid]) + '</span><span class="vfeat-d">' + esc(t.videos[vid + "Lead"]) + '</span><span class="vcta">' + ic("play", 12) + esc(t.videos.watchVideo) + ' <span class="mono">' + esc(v.dur) + "</span></span></span></button>";
      }
    }
    var cur = state.tpl === "standard" ? T.standard : state.tpl === "sales" ? T.sales : state.tpl === "interview" ? T.interview : T.standup;
    var title = state.tpl === "interview" ? "Can Öztürk" : cur.title;
    var cover = '<div class="rp-page rp-cover" aria-hidden="true"><span class="l3d" style="--s:38px"></span><div class="rp-brand">MeetSense</div><div class="rp-auto">' + esc(R.auto) + '</div><div class="rp-what"><b>' + esc(R.what) + "</b>" + esc(R.whatX) + '</div><div class="rp-card"><b>' + esc(title) + '</b><div class="row2"><span>' + esc(R.dt) + "<strong>" + esc(cur.when) + "</strong></span><span style=\"text-align:right\">" + esc(R.ppl) + "<strong>" + esc(cur.ppl) + '</strong></span></div><div class="row2" style="justify-content:center;text-align:center"><span>' + esc(R.org) + "<strong>" + esc(cur.org) + '</strong></span></div></div><div class="rp-copy">Copyright © 2026 - BGTS</div></div>';
    var name = T.list.filter(function (x) { return x.id === state.tpl; })[0].name;
    var head = '<div class="rp-head"><span class="t">' + esc(title) + '</span><span style="display:flex;gap:8px;align-items:center"><span class="chip">' + esc(name) + '</span><span class="mini hide-sm" aria-hidden="true">' + ic("download", 14) + esc(R.pdf) + "</span></span></div>";
    var foot = '<div class="rp-foot"><span>MeetSense · ' + esc(R.brand) + "</span><span>" + esc(t.ui.example) + "</span></div>";
    var body = "";
    if (state.tpl === "standard") {
      body = '<div class="rp-sec"><div class="mini-title">' + esc(tt.purposeTitle) + '</div><p style="margin-top:6px;font-size:13px;line-height:1.55">' + esc(tt.purpose) + "</p></div>" +
        '<div class="rp-sec"><div class="mini-title">' + esc(tt.resultTitle) + '</div><p style="margin-top:6px;font-size:13px;line-height:1.6;color:var(--ink-2)">' + esc(tt.summary) + "</p></div>" +
        '<div class="rp-sec"><div class="rp-sec-h">' + esc(tt.topicsTitle) + '</div><div style="display:flex;flex-direction:column;gap:6px">' + tt.topics.map(function (x, i) { return '<div class="topic" style="padding:9px 12px"><span class="topic-n">' + (i + 1) + '</span><div style="font-size:12.5px"><b>' + esc(x.t) + "</b> — " + esc(x.x) + "</div></div>"; }).join("") + "</div></div>" +
        '<div class="rp-sec"><div class="rp-sec-h">' + esc(tt.tabs.actions) + '</div><div style="display:flex;flex-direction:column;gap:6px">' + tt.actions.map(function (a) { return '<div style="display:flex;align-items:center;gap:10px;font-size:12.5px;padding:8px 0;border-top:1px solid var(--line)"><span style="flex:1 1 auto">' + esc(a.x) + '</span><span style="color:' + (a.noOwner ? "var(--danger)" : "var(--ink-3)") + ';font-size:11px;white-space:nowrap">' + esc(a.noOwner ? tt.unassigned : a.owner) + '</span><span class="prio" data-p="' + a.p + '">' + esc(tt.prio[a.p]) + "</span></div>"; }).join("") + "</div></div>" +
        '<div class="rp-sec"><div class="rp-sec-h">' + esc(tt.metrics.keywords) + '</div><div class="kw">' + tt.metrics.kw.map(function (k) { return "<span>" + esc(k) + "</span>"; }).join("") + "</div></div>";
    } else if (state.tpl === "sales") {
      var S = T.sales, score = 81, arc = Math.PI * 50, off = arc * (1 - score / 100);
      body = '<div class="rp-sec"><div class="rp-sec-h">' + esc(S.bant) + '<span class="mini" aria-hidden="true">' + ic("copy", 14) + esc(R.copy) + '</span></div><div class="bant">' +
        S.bantItems.map(function (b) { return '<div><div class="k">' + esc(b.k) + '<span class="net" data-ok="' + b.ok + '">● ' + esc(b.ok ? S.net : S.unclear) + "</span></div><p>" + esc(b.x) + "</p></div>"; }).join("") + "</div></div>" +
        '<div class="rp-sec"><div class="rp-sec-h">' + esc(S.objTitle) + '<span class="mono" style="font-size:11px;font-weight:500;color:var(--ink-3)">' + esc(S.objCount) + "</span></div>" +
        S.objs.map(function (o) { return '<div class="obj"><div class="obj-top"><span class="tagc">' + esc(o.c) + '</span><span class="prio" data-p="' + (o.s === "YÜKSEK" || o.s === "HIGH" ? "high" : "med") + '">' + esc(o.s) + '</span><span class="ans" data-open="' + o.open + '">' + (o.open ? "● " + esc(S.open) : "✓ " + esc(S.answered)) + "</span></div><p>" + esc(o.x) + "</p>" + (o.sug ? '<div class="sug"><b style="font-size:11px;color:var(--ac-ink)">' + esc(S.suggest) + ":</b> " + esc(o.sug) + "</div>" : "") + "</div>"; }).join("") + "</div>" +
        '<div class="rp-sec"><div class="rp-sec-h">' + esc(S.dealLabel) + '</div><div style="display:flex;flex-wrap:wrap;align-items:center;gap:20px"><div style="text-align:center"><div class="gauge"><svg viewBox="0 0 120 66" aria-hidden="true"><path d="M10 60 A50 50 0 0 1 110 60" fill="none" stroke="#e3dfd8" stroke-width="10" stroke-linecap="round"/><path d="M10 60 A50 50 0 0 1 110 60" fill="none" stroke="#1a7f43" stroke-width="10" stroke-linecap="round" stroke-dasharray="' + arc.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '"/></svg><b>' + score + '</b></div><div style="font-size:11px;font-weight:600;color:var(--ok)">' + esc(S.band) + '</div></div><div class="bars" style="flex:1 1 220px">' +
        S.bars.map(function (b, bi) { return '<div><div class="bar-row"><span>' + esc(b.l) + '</span><span class="mono" style="color:var(--ink)">' + b.v + '</span></div><div class="track"><i style="width:' + b.v + "%;background:" + (bi === 1 ? "var(--risk)" : b.v < 60 ? "var(--ac)" : "var(--ok)") + '"></i></div></div>'; }).join("") + "</div></div></div>" +
        '<div class="rp-sec"><div class="rp-sec-h">' + esc(S.next) + '</div><ol style="margin:0;padding-left:18px;font-size:12.5px;line-height:1.6;color:var(--ink-2)">' + S.nextItems.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ol></div>";
    } else if (state.tpl === "interview") {
      var I = T.interview, dec = state.lang === "tr" ? "," : ".";
      body = '<div class="rp-sec"><div class="rp-sec-h">' + esc(I.profile) + '</div><div style="display:flex;align-items:center;gap:12px"><span class="ava" style="width:40px;height:40px;font-size:13px">CÖ</span><div><b style="font-size:15px">Can Öztürk</b><div class="mono" style="font-size:11px;color:var(--ink-3)">' + esc(I.role) + "</div></div></div>" +
        '<div class="mini-title" style="margin-top:12px">' + esc(I.advice) + '</div><div class="advice" style="margin-top:6px">' + esc(I.note) + '</div><div style="margin-top:6px;font-size:11px;color:var(--ink-3)">' + esc(I.info) + "</div>" +
        '<div class="mini-title" style="margin-top:12px">' + esc(I.exp) + '</div><p style="margin-top:4px;font-size:12.5px;line-height:1.55;color:var(--ink-2)">' + esc(I.expX) + "</p>" +
        '<div class="mini-title" style="margin-top:12px;margin-bottom:6px">' + esc(I.skills) + '</div><div class="chips">' + I.skillList.map(function (k) { return "<span>" + esc(k) + "</span>"; }).join("") + "</div></div>" +
        '<div class="rp-sec"><div class="rp-sec-h">' + esc(I.card) + '</div><div style="display:flex;flex-direction:column;gap:10px">' + I.criteria.map(function (c) { var pct = (c.v / 5) * 100; return '<div class="crit"><span>' + esc(c.l) + '</span><span class="track" style="margin:0"><i style="width:' + pct + "%;background:" + (c.v < 3.5 ? "var(--ac)" : "var(--ok)") + '"></i></span><span class="mono">' + String(c.v).replace(".", dec) + " / 5</span></div>"; }).join("") + "</div></div>" +
        '<div class="rp-sec two" style="grid-template-columns:repeat(auto-fit,minmax(160px,1fr))">' +
        '<div class="box"><div class="box-t" style="color:var(--risk)">' + esc(I.warnTitle) + "</div><ul>" + I.warn.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>" +
        '<div class="box"><div class="box-t" style="color:var(--ok)">' + esc(I.strTitle) + "</div><ul>" + I.str.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>" +
        '<div class="box"><div class="box-t">' + esc(I.devTitle) + "</div><ul>" + I.dev.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div></div>" +
        '<div class="rp-sec"><div class="rp-sec-h">' + esc(I.questions) + '<span class="mono" style="font-size:11px;font-weight:500;color:var(--ink-3)">' + esc(I.qCount) + "</span></div>" +
        I.qs.map(function (q, i) { return '<div class="qrow"><span class="n mono">' + (i + 1) + "</span><span>" + esc(q.q) + (q.flag ? ' <span class="noowner" style="padding:1px 7px;font-size:10px">' + esc(q.flag) + "</span>" : "") + '</span><span class="c">' + esc(q.c) + "</span></div>"; }).join("") +
        '<p style="margin-top:10px;font-size:11.5px;color:var(--ink-3)">' + esc(I.foot) + "</p></div>";
    } else {
      var U = T.standup;
      body = '<div class="rp-sec"><div class="rp-sec-h">' + esc(U.team) + ' <span class="mono" style="font-size:11px;color:var(--ink-3)">' + U.rows.length + "</span></div>" +
        U.rows.map(function (r) {
          var ini = r.p.split(" ").map(function (w) { return w.charAt(0); }).join("").slice(0, 2);
          return '<div class="team-row" data-ok="' + r.ok + '"><div class="top"><span class="ava ava-sm" style="width:26px;height:26px">' + esc(ini) + "</span>" + esc(r.p) + '<span class="st">' + (r.ok ? '<span class="ok-pill">' + esc(U.ok) + "</span>" : '<span class="attn" style="color:var(--danger)">' + ic("risk", 13) + esc(U.blocked) + "</span>") + '</span></div><div class="team-grid"><div><small>' + esc(U.yesterday.toLocaleUpperCase(state.lang === "tr" ? "tr-TR" : "en-US")) + "</small>" + esc(r.y) + "</div><div><small>" + esc(U.today.toLocaleUpperCase(state.lang === "tr" ? "tr-TR" : "en-US")) + "</small>" + esc(r.t) + "</div></div></div>";
        }).join("") + '<p style="margin-top:10px;font-size:12.5px;color:var(--danger);font-weight:600">' + esc(U.blockers) + '</p><p style="margin-top:4px;font-size:12px;color:var(--ink-3)">' + esc(U.foot) + "</p></div>";
    }
    s += '<div class="rp-wrap">' + cover + '<div class="rp-page rp-main">' + head + body + foot + "</div></div>";
    html($("#tpl-panel"), s);
    fillLogos($("#tpl-panel"));
    initVideoSlots($("#tpl-panel"));
  }

  /* ---------- app section ---------- */
  function renderApp() {
    var A = t.app, tabs = ["home", "meetings", "bot", "settings"];
    html($("#app-tabs"), tabs.map(function (k) { return '<button type="button" role="tab" class="app-tab" data-apptab="' + k + '" aria-selected="' + (state.appTab === k) + '">' + esc(A.tabs[k]) + "</button>"; }).join(""));
    var navIdx = state.appTab === "meetings" ? 1 : state.appTab === "home" ? 0 : 3;
    function frame(inner) {
      return '<div class="app-frame"><div class="app-top"><span class="logo"><img src="' + LOGO_SRC + '" alt="" width="22" height="22">MeetSense</span><nav>' + A.nav.map(function (n, i) { return '<span data-on="' + (i === navIdx) + '">' + esc(n) + "</span>"; }).join("") + '</nav><span class="me" aria-hidden="true">SA</span></div><div class="app-body">' + inner + "</div></div>" +
        '<p class="mono" style="margin-top:12px;font-size:11px;color:var(--ink-4)">' + esc(t.ui.example) + "</p>";
    }
    function card(m) { return '<div class="app-card"><div style="display:flex;align-items:center;gap:8px"><span class="st-chip" data-s="' + m.s + '">● ' + esc(A[m.s]) + '</span><span class="teams-ico" aria-hidden="true">T</span><span style="margin-left:auto;color:#999">⋯</span></div><b>' + esc(m.t) + '</b><div class="app-meta"><span>' + esc(A.dt) + "<strong>" + esc(m.w) + "</strong></span>" + (m.s === "failed" ? "<span>—</span>" : '<span class="app-avs"><i>EK</i><i>BŞ</i><i>ZA</i><i>+3</i></span>') + "</div></div>"; }
    var s = "";
    if (state.appTab === "home") {
      var max = Math.max.apply(null, A.distVals);
      s = frame('<div class="app-h"><div><b>' + esc(A.hello) + "</b><small>" + esc(A.today) + '</small></div><span class="app-btn">+ ' + esc(A.newMeeting) + "</span></div>" +
        '<div class="app-stats">' + A.stats.map(function (x, i) { return '<div class="app-stat"><span style="color:' + ["#d9541f", "#12804a", "#0b5aa8"][i] + '">' + esc(x.l) + "<small>" + esc(A.range) + "</small></span><b>" + esc(x.v) + "</b></div>"; }).join("") + "</div>" +
        '<div class="app-sub">' + esc(A.todays) + "<small>" + esc(A.seeAll) + ' ›</small></div><div class="app-cards">' + A.meetings.map(card).join("") + "</div>" +
        '<div class="app-two"><div class="app-panel"><h4>' + esc(A.dist) + '</h4><div class="app-bars">' + A.distVals.map(function (v, i) { return "<div><span>" + v + '</span><i style="height:' + Math.round((v / max) * 80) + 'px"></i>' + esc(A.days[i]) + "</div>"; }).join("") + "</div></div>" +
        '<div class="app-panel"><div style="display:flex;justify-content:space-between;align-items:center"><h4>' + esc(A.live) + '</h4><span class="chip" style="font-size:10px">' + esc(A.liveOne) + '</span></div><div class="live-row"><span class="dot blink"></span><span style="flex:1 1 auto">' + esc(A.liveMeeting) + '</span><span class="eq" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span></div></div></div>');
    } else if (state.appTab === "meetings") {
      s = frame('<div class="app-h"><div><b>' + esc(A.nav[1]) + '</b></div><span class="app-btn">+ ' + esc(A.newMeeting) + '</span></div><div class="app-search"><span>⌕ ' + esc(A.search) + "</span><span>" + esc(A.filter) + "</span><span>" + esc(A.sort) + "</span></div>" +
        A.groups.map(function (g, gi) { return '<div class="app-group">' + esc(g.d) + " <i>" + g.items.length + '</i></div><div class="app-cards" style="margin-top:8px">' + g.items.map(function (m, mi) { var c = card(m); if (gi === 0 && mi === 0) c = c.replace('<div class="app-card">', '<div class="app-card" style="position:relative">').replace("</b>", '</b><div class="app-menu" aria-hidden="true">' + A.menu.map(function (x) { return "<div>" + esc(x) + "</div>"; }).join("") + "</div>"); return c; }).join("") + "</div>"; }).join(""));
    } else if (state.appTab === "bot") {
      s = '<div class="shot-grid"><figure class="shot" style="flex:0 1 300px"><img src="assets/img/app/new-meeting.jpg" alt="' + esc(A.botPoints[0].t) + '" width="331" height="380"><span class="shot-tag">' + esc(A.real) + '</span></figure>' +
        '<figure class="shot" style="flex:0 1 330px"><img src="assets/img/app/bot-panel.jpg" alt="' + esc(A.tabs.bot) + '" width="387" height="880"><span class="shot-tag">' + esc(A.real) + '</span></figure>' +
        '<ul class="points">' + A.botPoints.map(function (x) { return "<li><b>" + esc(x.t) + "</b><p>" + esc(x.x) + "</p></li>"; }).join("") + "</ul></div>";
    } else {
      s = '<div class="shot-grid"><figure class="shot" style="flex:1 1 460px;max-width:620px"><img src="assets/img/app/bot-settings.jpg" alt="' + esc(A.tabs.settings) + '" width="700" height="1195"><span class="shot-tag">' + esc(A.real) + '</span></figure>' +
        '<ul class="points">' + A.setPoints.map(function (x) { return "<li><b>" + esc(x.t) + "</b><p>" + esc(x.x) + "</p></li>"; }).join("") + '<li style="padding:0;overflow:hidden"><figure class="shot" style="border:0;box-shadow:none;border-radius:0"><img src="assets/img/app/general-settings.jpg" alt="" width="700" height="761"><span class="shot-tag">' + esc(A.real) + '</span></figure></li></ul></div>';
    }
    html($("#app-panel"), s);
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
      slot.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(v.youtubeId) + '?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1" title="' + esc(t.videos[id]) + '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen loading="lazy"></iframe>';
    } else {
      slot.innerHTML = '<video controls playsinline preload="auto" poster="' + esc(v.poster) + '" src="' + esc(v.file) + '" aria-label="' + esc(t.videos[id]) + '"></video>';
      var vid = $("video", slot);
      var p = vid.play();
      if (p && p.catch) p.catch(function () {});
    }
    current = slot;
    watchVisibility(slot);
  }

  /* Oynayan video ekranın dışına kaydırılınca otomatik durur (geri gelince kullanıcı devam ettirir). */
  var visObserver = null;
  function pauseSlot(slot) {
    var vid = $("video", slot);
    if (vid) {
      if (document.pictureInPictureElement === vid) return;
      if (!vid.paused) vid.pause();
      return;
    }
    var fr = $("iframe", slot);
    if (fr && fr.contentWindow) fr.contentWindow.postMessage(JSON.stringify({ event: "command", func: "pauseVideo", args: [] }), "*");
  }
  function watchVisibility(slot) {
    if (!window.IntersectionObserver) return;
    if (!visObserver) {
      visObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var s = en.target;
          if (s.getAttribute("data-playing") !== "1" || !document.body.contains(s)) { visObserver.unobserve(s); return; }
          if (en.intersectionRatio < 0.35) pauseSlot(s);
        });
      }, { threshold: [0, 0.35] });
    }
    visObserver.observe(slot);
  }

  /* ---------- render all ---------- */
  function renderAll() {
    renderStage();
    renderLists();
    renderTour();
    renderApp();
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
      if ((el = e.target.closest("[data-apptab]"))) { state.appTab = el.getAttribute("data-apptab"); renderApp(); return; }
      if ((el = e.target.closest("[data-q]"))) { state.q = +el.getAttribute("data-q"); renderAssistant(); return; }
      if ((el = e.target.closest("[data-role]"))) { var id = el.getAttribute("data-role"); state.focus = state.focus === id ? null : id; renderRoles(); return; }
      if ((el = e.target.closest("[data-play-slot]"))) { playSlot(el.closest(".vslot")); return; }
      if ((el = e.target.closest("[data-play]"))) { var s = $('.vslot[data-video="' + el.getAttribute("data-play") + '"]'); if (s) playSlot(s); return; }
    });
    $("#rec-toggle").addEventListener("click", function () { state.recPaused = !state.recPaused; updateRec(); updateStage(); });
    $("#player-btn").addEventListener("click", function () { state.playing = !state.playing; updatePlayer(); });
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
    startClock();
    if (window.MSOrb) {
      if (window.MSOrb.start($("#orb"), "#e4521f")) $(".orb-box").classList.add("gl");
      if (window.MSOrb.startLogo($("#logo3d"))) $(".logo-stage").classList.add("gl");
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

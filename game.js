/* RTS game layer: pixel characters + skins, achievements, XP and levels, the RTS HQ live map.
   Loaded before app.js; uses its helpers ($, esc, t, nm, ME...) only inside functions. */

/* ---------- pixel character (original design, 16 x 18) ----------
   H hair, S skin, E eyes, M mouth, O outfit, T outfit detail, P pants, B boots */
const SPRITE_TOP = [
  ".....HHHHHH.....",
  "....HHHHHHHH....",
  "...HHHHHHHHHH...",
  "...HSSSSSSSSH...",
  "...SSESSSSESS...",
  "...SSSSSSSSSS...",
  "....SSSMMSSS....",
  ".....SSSSSS.....",
  "....OOOTTOOO....",
  "...OOOOTTOOOO...",
  "..SOOOOTTOOOOS..",
  "..SOOOOTTOOOOS..",
  "....OOOOOOOO....",
];
const LEGS = [
  ["....PPPPPPPP....", "....PPP..PPP....", "....PPP..PPP....", "....BBB..BBB...."],
  ["....PPPPPPPP....", "...PPP....PPP...", "...PPP.....PP...", "..BBB......BBB.."],
];
const ACC = {
  crown: ["....G.G..G.G....", "....GGGGGGGG...."],
  cap: ["....AAAAAAAA....", "....AAAAAAAAAA.."],
  headphones: ["................", "..K..........K..", "..K..........K..", "..K..........K.."],
  shades: [null, null, null, null, "...KKKKKKKKKK..."],
};
const SKINS = [
  { id: "rookie", en: "Rookie", fr: "Rookie", unlock: null, pal: { H: "#3b2a1e", O: "#5b5b66", T: "#5b5b66", P: "#2b2b33", B: "#16161a" } },
  { id: "academy", en: "Academy hoodie", fr: "Sweat Academy", unlock: "team_academy", pal: { H: "#3b2a1e", O: "#c40404", T: "#fd0606", P: "#22222a", B: "#111" } },
  { id: "hoodie", en: "Challenger", fr: "Challenger", unlock: "team_challenger", pal: { H: "#1d1d1d", O: "#7a1010", T: "#f0b429", P: "#22222a", B: "#111" }, acc: "cap", A: "#7a1010" },
  { id: "suit", en: "Master suit", fr: "Costume Master", unlock: "team_master", pal: { H: "#151515", O: "#18181d", T: "#fd0606", P: "#18181d", B: "#050505" } },
  { id: "supreme", en: "Supreme crown", fr: "Couronne Supreme", unlock: "team_supreme", pal: { H: "#151515", O: "#0e0e12", T: "#d9b45a", P: "#0e0e12", B: "#050505" }, acc: "crown" },
  { id: "shark", en: "Shark", fr: "Requin", unlock: "nl500", pal: { H: "#20304a", O: "#1d4ed8", T: "#93c5fd", P: "#1e293b", B: "#0f172a" }, acc: "shades" },
  { id: "highroller", en: "High roller", fr: "High roller", unlock: "nl1000", pal: { H: "#111", O: "#f4f4f2", T: "#d9b45a", P: "#111", B: "#000" }, acc: "shades" },
  { id: "grinder", en: "Grinder", fr: "Grinder", unlock: "grinder100", pal: { H: "#3b2a1e", O: "#14532d", T: "#3ecf8e", P: "#1c1c22", B: "#111" }, acc: "headphones" },
  { id: "flame", en: "On fire", fr: "En feu", unlock: "streak30", pal: { H: "#7c2d12", O: "#c2410c", T: "#f0b429", P: "#27272a", B: "#111" }, aura: "#f97316" },
  { id: "scholar", en: "Scholar", fr: "Érudit", unlock: "scholar", pal: { H: "#3b2a1e", O: "#4c1d95", T: "#a855f7", P: "#1e1b2e", B: "#111" } },
  { id: "veteran", en: "Veteran", fr: "Vétéran", unlock: "season3", pal: { H: "#a3a3a3", O: "#a16207", T: "#fde68a", P: "#292524", B: "#111" }, aura: "#d9b45a" },
  { id: "cap", en: "Reviewer", fr: "Reviewer", unlock: "reviewer", pal: { H: "#3b2a1e", O: "#0f766e", T: "#5eead4", P: "#1c1c22", B: "#111" }, acc: "cap", A: "#0f766e" },
];
const skinOf = (id) => SKINS.find((s) => s.id === id) || SKINS[0];

function sprite(skinId, size = 64, cls = "") {
  const sk = skinOf(skinId);
  const pal = { S: "#f1c7a1", E: "#111", M: "#9a4a3a", G: "#f0b429", K: "#111", A: sk.A || "#333", ...sk.pal };
  const frame = (legs) => {
    let r = "";
    [...SPRITE_TOP, ...legs].forEach((row, y) => [...row].forEach((c, x) => { if (c !== ".") r += `<rect x="${x}" y="${y + 2}" width="1" height="1" fill="${pal[c]}"/>`; }));
    const acc = ACC[sk.acc];
    if (acc) acc.forEach((row, y) => row && [...row].forEach((c, x) => { if (c !== ".") r += `<rect x="${x}" y="${y + (sk.acc === "crown" ? 0 : sk.acc === "cap" ? 1 : 2)}" width="1" height="1" fill="${pal[c]}"/>`; }));
    return r;
  };
  return `<svg class="px ${cls}" viewBox="0 0 16 19" width="${size}" height="${size * 19 / 16}" shape-rendering="crispEdges" style="${sk.aura ? `filter:drop-shadow(0 0 ${Math.round(size / 16)}px ${sk.aura})` : ""}">
    <g class="f1">${frame(LEGS[0])}</g><g class="f2">${frame(LEGS[1])}</g></svg>`;
}

/* ---------- achievements ---------- */
const ACH = [
  { id: "first", icon: "♠", en: "First session", fr: "Première session", ok: (g) => g.sessions >= 1 },
  { id: "streak7", icon: "🔥", en: "7-day streak", fr: "Série de 7 jours", ok: (g) => g.bestStreak >= 7 },
  { id: "streak30", icon: "🔥", en: "30-day streak", fr: "Série de 30 jours", ok: (g) => g.bestStreak >= 30 },
  { id: "grinder100", icon: "⏱", en: "100 h played in a month", fr: "100 h jouées en un mois", ok: (g) => g.bestMonthPlay >= 100 },
  { id: "hours500", icon: "⏳", en: "500 hours of work", fr: "500 heures de travail", ok: (g) => g.hours >= 500 },
  { id: "scholar", icon: "📚", en: "25 conclusions written", fr: "25 conclusions écrites", ok: (g) => g.cards >= 25 },
  { id: "reviewer", icon: "🔍", en: "50 hands reviewed", fr: "50 mains revues", ok: (g) => g.reviewed >= 50 },
  { id: "teamplayer", icon: "🤝", en: "10 reviews with players", fr: "10 reviews entre joueurs", ok: (g) => g.joins >= 10 },
  { id: "team_academy", icon: "🎓", en: "Academy", fr: "Academy", ok: (g) => ["academy", "challenger", "master", "supreme"].includes(g.team) },
  { id: "team_challenger", icon: "⚔", en: "Challenger", fr: "Challenger", ok: (g) => ["challenger", "master", "supreme"].includes(g.team) },
  { id: "team_master", icon: "♜", en: "Master", fr: "Master", ok: (g) => ["master", "supreme"].includes(g.team) },
  { id: "team_supreme", icon: "♛", en: "Supreme", fr: "Supreme", ok: (g) => g.team === "supreme" },
  { id: "nl200", icon: "💠", en: "Plays NL200", fr: "Joue en NL200", ok: (g) => g.stake >= 200 },
  { id: "nl500", icon: "🦈", en: "Plays NL500", fr: "Joue en NL500", ok: (g) => g.stake >= 500 },
  { id: "nl1000", icon: "💎", en: "Plays NL1000", fr: "Joue en NL1000", ok: (g) => g.stake >= 1000 },
  { id: "season2", icon: "②", en: "Season 2 at RTS", fr: "Saison 2 chez RTS", ok: (g) => g.season >= 2 },
  { id: "season3", icon: "③", en: "Season 3 at RTS", fr: "Saison 3 chez RTS", ok: (g) => g.season >= 3 },
  { id: "lvl10", icon: "⭐", en: "Level 10", fr: "Niveau 10", ok: (g) => g.level >= 10 },
  { id: "lvl25", icon: "🌟", en: "Level 25", fr: "Niveau 25", ok: (g) => g.level >= 25 },
  { id: "pot500", icon: "💰", en: "Won a 500 bb pot", fr: "Gagné un pot de 500 bb", soon: true },
  { id: "record", icon: "🏆", en: "Hand record of the month", fr: "Record de mains du mois", soon: true },
];
const L2 = (o) => o[LANG] || o.en;

/* XP (Alexis's 6-line table): journal day 20, hour played or studied 10, hand reviewed with a note 5,
   conclusion 15, recall or quiz right 5, coaching or review attended 25. Levels get harder: n -> n+1 costs 100 x n^1.5. */
const XP_RULES = [["journalDay", 20], ["hour", 10], ["handNote", 5], ["conclusion", 15], ["right", 5], ["attended", 25]];
const levelCost = (n) => Math.round(100 * Math.pow(n, 1.5));
function levelOf(xp) {
  let lvl = 1, left = xp;
  while (left >= levelCost(lvl)) { left -= levelCost(lvl); lvl++; }
  return { level: lvl, into: left, need: levelCost(lvl) };
}

async function gameStats(p) {
  const [j, sess, hands, cards, ans, att, joins] = await Promise.all([db.journal(p.id, "2000-01-01"), db.sessions(p.id, "2000-01-01"),
    db.hands().catch(() => []), db.cards().catch(() => []), db.answers(p.id).catch(() => []), db.attendance(p.id).catch(() => []), db.myJoins().catch(() => [])]);
  const mineCards = cards.filter((c) => c.player_id === p.id);
  const wrote = (e) => ["played", "learned", "did_well", "mistakes"].some((k) => (e[k] || "").trim().length >= 3) || Number(e.hands) > 0;
  const hours = j.reduce((a, e) => a + Number(e.play_h || 0) + Number(e.study_h || 0), 0);
  const reviewed = hands.filter((h) => h.reviewed).length, handNote = hands.filter((h) => h.reviewed && (h.note || "").trim()).length;
  const right = ans.filter((a) => a.correct).length + mineCards.reduce((a, c) => a + Number(c.hits || 0), 0);
  const parts = { journalDay: j.filter(wrote).length, hour: Math.floor(hours), handNote, conclusion: mineCards.length, right, attended: att.length + joins.length };
  const xp = XP_RULES.reduce((a, [k, v]) => a + parts[k] * v, 0);
  // best streak ever (holidays don't break it)
  const days = [...new Set(j.map((e) => e.day))].sort();
  let best = 0, run = 0, prev = null;
  days.forEach((d) => { run = prev && addDays(1, new Date(prev + "T12:00:00")) === d ? run + 1 : 1; best = Math.max(best, run); prev = d; });
  const byMonth = {};
  j.forEach((e) => (byMonth[e.day.slice(0, 7)] = (byMonth[e.day.slice(0, 7)] || 0) + Number(e.play_h || 0)));
  const lv = levelOf(xp);
  const g = { xp, ...lv, parts, sessions: sess.length, bestStreak: best, bestMonthPlay: Math.max(0, ...Object.values(byMonth)), hours, cards: mineCards.length, reviewed, joins: joins.length,
    team: p.team_id || "", stake: parseInt(String(p.stakes || "").replace(/\D/g, "")) || 0, season: p.rts_since ? new Date().getFullYear() - p.rts_since + 1 : 1 };
  g.unlocked = ACH.filter((a) => !a.soon && a.ok(g)).map((a) => a.id);
  g.skins = SKINS.filter((s) => !s.unlock || g.unlocked.includes(s.unlock)).map((s) => s.id);
  return g;
}
const rankLine = (p, g) => [esc(teamOf(p).label), p.stakes ? esc(p.stakes) : null, `${t("season")} ${g.season}`].filter(Boolean).join(" · ");
const mySkin = (p, g) => (g?.skins || []).includes(p.skin) ? p.skin : (g?.skins || ["rookie"]).slice(-1)[0] || "rookie";

/* XP toast: shows what you earned since your last visit, and level ups. */
function xpToast(g) {
  let last = null; try { last = JSON.parse(localStorage.getItem("rts-xp-" + ME.id)); } catch {}
  try { localStorage.setItem("rts-xp-" + ME.id, JSON.stringify({ xp: g.xp, level: g.level })); } catch {}
  if (!last || g.xp <= last.xp) return;
  const el = document.createElement("div");
  el.className = "toast";
  el.innerHTML = g.level > last.level ? `<b>⭐ ${t("levelUp")} ${g.level}</b><span>+${g.xp - last.xp} XP</span>` : `<b>+${g.xp - last.xp} XP</b><span>${t("sinceLast")}</span>`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 4200);
}

/* ---------- accent color (only thing a player customises) ---------- */
const ACCENTS = ["#fd0606", "#f0b429", "#3ecf8e", "#3b82f6", "#a855f7", "#22d3ee"];
function applyAccent(c) {
  const ok = ACCENTS.includes(c) ? c : ACCENTS[0], r = document.documentElement.style;
  r.setProperty("--red", ok); r.setProperty("--red-dark", ok); r.setProperty("--red-soft", ok + "1f");
}
const swatches = (cur) => `<div class="swatches">${ACCENTS.map((c) => `<button class="sw ${c === (cur || ACCENTS[0]) ? "on" : ""}" data-accent="${c}" style="background:${c}" title="${c}"></button>`).join("")}</div>`;
function bindSwatches() {
  $$("[data-accent]").forEach((b) => b.onclick = async () => { applyAccent(b.dataset.accent); ME.accent = REAL.accent = b.dataset.accent; $$("[data-accent]").forEach((x) => x.classList.toggle("on", x === b)); await db.setPrefs(b.dataset.accent, null).catch(() => {}); });
}

/* ---------- hero page: character, skins, achievements, color ---------- */
async function viewHero() {
  const g = await gameStats(ME);
  const cur = mySkin(ME, g);
  $("#main").innerHTML = `
    <div class="hero-grid">
      <div class="card hero-card">
        <div class="hero-stage">${sprite(cur, 150, "idle")}</div>
        <h2 class="hero-name">${nm(ME)}</h2><p class="rank">${rankLine(ME, g)}</p>
        <div class="lvl-line"><span class="lvl-badge">${g.level}</span><div class="xpbar"><i style="width:${(g.into / g.need) * 100}%"></i></div><small>${fmtNum(g.into)} / ${fmtNum(g.need)} XP</small></div>
        <p class="lbl">${t("yourColor")}</p>${swatches(ME.accent)}
      </div>
      <div class="stack">
        <div class="card"><div class="card-head"><h3>${t("skins")}</h3><span class="muted small">${g.skins.length} / ${SKINS.length}</span></div>
          <div class="skins">${SKINS.map((s) => { const own = g.skins.includes(s.id), a = ACH.find((x) => x.id === s.unlock);
            return `<button class="skin ${own ? "" : "locked"} ${s.id === cur ? "on" : ""}" ${own ? `data-skin="${s.id}"` : "disabled"} title="${own ? "" : esc(L2(a || {}))}">${sprite(s.id, 44)}<b>${esc(L2(s))}</b><small>${own ? (s.id === cur ? t("wearing") : t("wear")) : "🔒 " + esc(L2(a || {}))}</small></button>`; }).join("")}</div></div>
        <div class="card"><div class="card-head"><h3>${t("achievements")}</h3><span class="muted small">${g.unlocked.length} / ${ACH.length}</span></div>
          <div class="achs">${ACH.map((a) => `<div class="ach ${g.unlocked.includes(a.id) ? "on" : ""}"><span>${a.icon}</span><b>${esc(L2(a))}</b>${a.soon ? `<small>${t("soonTracker")}</small>` : ""}</div>`).join("")}</div></div>
        <div class="card"><div class="card-head"><h3>XP</h3><span class="muted small">${fmtNum(g.xp)} XP</span></div>
          <div class="xprules">${XP_RULES.map(([k, v]) => `<span>${t("xp_" + k)} <b>+${v}</b> <small>× ${fmtNum(g.parts[k])}</small></span>`).join("")}</div></div>
      </div>
    </div>`;
  bindSwatches();
  $$("[data-skin]").forEach((b) => b.onclick = async () => { ME.skin = REAL.skin = b.dataset.skin; await db.setPrefs(null, b.dataset.skin).catch(() => {}); route(); });
}

/* ---------- RTS HQ: live map ---------- */
const ROOMS = {
  grind: { x: 0, y: 0, w: 330, h: 215, icon: "♠" }, study: { x: 335, y: 0, w: 330, h: 215, icon: "📚" }, coaching: { x: 670, y: 0, w: 330, h: 215, icon: "🎓" },
  lobby: { x: 0, y: 220, w: 1000, h: 120, icon: "🏠" },
  review: { x: 0, y: 345, w: 330, h: 215, icon: "🔍" }, mentor: { x: 335, y: 345, w: 330, h: 215, icon: "🤝" }, lounge: { x: 670, y: 345, w: 330, h: 215, icon: "☕" },
};
const CORRIDOR = 280;
const hashN = (s) => [...String(s)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
function hqSpot(room, id) {
  const r = ROOMS[room] || ROOMS.lobby, h = hashN(id);
  return { x: r.x + r.w / 2 + ((h % 7) - 3) * 34, y: r.y + r.h / 2 + 18 + (((h >> 4) % 3) - 1) * 30 };
}
let HQ = null;

async function viewHQ() {
  const g = await gameStats(ME).catch(() => ({ level: 1, skins: ["rookie"] }));
  const open = await db.openSession(ME.id).catch(() => null);
  const go = new URLSearchParams(location.hash.split("?")[1] || "").get("go");
  let saved = null; try { saved = localStorage.getItem("rts-hq-room"); } catch {}
  const startRoom = go || (open ? (open.kind === "grind" ? "grind" : "study") : saved) || "lobby";
  const evs = await db.events(new Date(Date.now() - 36e5).toISOString(), addDays(1) + "T23:59").catch(() => []);
  const reviews = evs.filter((e) => e.kind === "review");
  $("#main").innerHTML = `
    <div class="hq-wrap">
      <div class="hq-map" id="hqmap">
        ${Object.entries(ROOMS).map(([k, r]) => `<button class="room r-${k}" data-room="${k}" style="left:${r.x / 10}%;top:${r.y / 5.6}%;width:${r.w / 10}%;height:${r.h / 5.6}%"><span>${r.icon} ${t("room_" + k)}</span></button>`).join("")}
        <div id="hqpeople"></div>
      </div>
      <aside class="hq-side">
        <div class="card"><div class="card-head"><h3>RTS HQ</h3><span class="tag" id="hqcount">1</span></div><div id="hqwho" class="hq-who"></div></div>
        <div class="card"><div class="card-head"><h3>${t("room_review")}</h3></div>
          ${reviews.map((e) => `<p class="hrow">${hhmm(e.starts_at)} · ${esc(e.title)} <button class="btn btn-sm" data-goto="review">${t("goThere")}</button></p>`).join("") || `<p class="muted small">${t("noEvents")}</p>`}</div>
        <div class="card hq-chat"><div id="hqlog" class="hq-log"></div><form id="hqsay" class="inline"><input name="m" maxlength="140" placeholder="${t("saySomething")}" autocomplete="off"><button class="btn btn-sm btn-red">↵</button></form></div>
      </aside>
    </div>`;
  // Coming from "I'm in" on a review: appear where you were, then walk to the review room.
  const me = { id: ME.id, name: ME.name, skin: mySkin(ME, g), lvl: g.level, room: go && saved && saved !== go ? saved : startRoom };
  const els = {}, at = {}, people = {};
  const label = (p) => nm({ name: p.name || "?" });
  const place = (el, pt, ms) => { el.style.transition = ms ? `left ${ms}ms linear, top ${ms}ms linear` : "none"; el.style.left = pt.x / 10 + "%"; el.style.top = pt.y / 5.6 + "%"; };
  // Walk: out of the room to the corridor, along it, then into the new room.
  const walk = (id, from, to) => {
    const el = els[id]; if (!el) return;
    const a = at[id] || hqSpot(from, id), b = hqSpot(to, id);
    const legs = from === to ? [b] : [{ x: a.x, y: CORRIDOR }, { x: b.x, y: CORRIDOR }, b];
    let cur = a, i = 0;
    el.classList.add("moving"); el.classList.toggle("flip", b.x < a.x);
    const step = () => {
      if (i >= legs.length) { el.classList.remove("moving"); return; }
      const p = legs[i++], ms = Math.max(120, Math.hypot(p.x - cur.x, p.y - cur.y) * 4.2);
      place(el, p, ms); cur = p; at[id] = p; setTimeout(step, ms);
    };
    step();
  };
  const render = (list) => {
    const box = $("#hqpeople"); if (!box) return;
    list.forEach((p) => {
      if (!els[p.id]) {
        const el = document.createElement("div"); el.className = "pc" + (p.id === ME.id ? " me" : "");
        el.innerHTML = `<div class="bubble" hidden></div>${sprite(p.skin, 34)}<span class="pname">${label(p)} <small>${p.lvl || 1}</small></span>`;
        box.appendChild(el); els[p.id] = el; at[p.id] = hqSpot(p.room, p.id); place(el, at[p.id], 0);
      } else if (people[p.id] && people[p.id].room !== p.room) walk(p.id, people[p.id].room, p.room);
      people[p.id] = p;
    });
    Object.keys(els).forEach((id) => { if (!list.some((p) => p.id === id)) { els[id].remove(); delete els[id]; delete people[id]; } });
    $("#hqcount").textContent = list.length;
    $("#hqwho").innerHTML = list.map((p) => `<p>${sprite(p.skin, 18)} <b>${label(p)}</b> <small class="muted">${t("room_" + p.room)}</small></p>`).join("");
  };
  const chat = (m) => {
    const p = people[m.id]; const log = $("#hqlog"); if (!log) return;
    log.insertAdjacentHTML("beforeend", `<p><b>${label(p || {})}</b> ${esc(m.text)}</p>`); log.scrollTop = log.scrollHeight;
    const b = els[m.id]?.querySelector(".bubble"); if (b) { b.textContent = m.text; b.hidden = false; clearTimeout(b._t); b._t = setTimeout(() => (b.hidden = true), 6000); }
  };
  HQ?.leave(); HQ = db.hq(me, render, chat);
  const moveTo = (room) => { if (me.room === room) return; try { localStorage.setItem("rts-hq-room", room); } catch {} me.room = room; HQ.track({ ...me }); };
  $$("[data-room]").forEach((b) => b.onclick = () => moveTo(b.dataset.room));
  $$("[data-goto]").forEach((b) => b.onclick = () => moveTo(b.dataset.goto));
  if (me.room !== startRoom) setTimeout(() => moveTo(startRoom), 1200);
  $("#hqsay").onsubmit = (ev) => { ev.preventDefault(); const v = ev.target.m.value.trim(); if (v) HQ.say(v); ev.target.reset(); };
  
}

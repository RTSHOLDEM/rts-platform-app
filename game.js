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
  { id: "grinder", en: "Grinder", fr: "Grinder", unlock: "mh100", pal: { H: "#3b2a1e", O: "#14532d", T: "#3ecf8e", P: "#1c1c22", B: "#111" }, acc: "headphones" },
  { id: "flame", en: "On fire", fr: "En feu", unlock: "streak30", pal: { H: "#7c2d12", O: "#c2410c", T: "#f0b429", P: "#27272a", B: "#111" }, aura: "#f97316" },
  { id: "scholar", en: "Scholar", fr: "Érudit", unlock: "concl25", pal: { H: "#3b2a1e", O: "#4c1d95", T: "#a855f7", P: "#1e1b2e", B: "#111" } },
  { id: "veteran", en: "Veteran", fr: "Vétéran", unlock: "season3", pal: { H: "#a3a3a3", O: "#a16207", T: "#fde68a", P: "#292524", B: "#111" }, aura: "#d9b45a" },
  { id: "cap", en: "Reviewer", fr: "Reviewer", unlock: "rev50", pal: { H: "#3b2a1e", O: "#0f766e", T: "#5eead4", P: "#1c1c22", B: "#111" }, acc: "cap", A: "#0f766e" },
  { id: "coach", en: "Coach", fr: "Coach", unlock: "coach", pal: { H: "#1d1d1d", O: "#e5e5e5", T: "#fd0606", P: "#18181d", B: "#050505" }, acc: "cap", A: "#fd0606" },
  { id: "sensei", en: "Sensei", fr: "Sensei", unlock: "mentor", pal: { H: "#e5e5e5", O: "#f4f4f2", T: "#111", P: "#111", B: "#000" }, aura: "#93c5fd" },
  { id: "whale", en: "NL2000 whale", fr: "Baleine NL2000", unlock: "nl2000", pal: { H: "#0b1324", O: "#0b3b8c", T: "#d9b45a", P: "#0b1324", B: "#000" }, acc: "shades", aura: "#3b82f6" },
  { id: "legend", en: "NL5000 legend", fr: "Légende NL5000", unlock: "nl5000", pal: { H: "#f5f5f5", O: "#0a0a0a", T: "#ffd700", P: "#0a0a0a", B: "#000" }, acc: "crown", aura: "#ffd700" },
  { id: "iron", en: "Iron grinder", fr: "Grinder de fer", unlock: "mh150", pal: { H: "#3f3f46", O: "#52525b", T: "#a1a1aa", P: "#27272a", B: "#111" }, acc: "headphones", A: "#71717a" },
  { id: "machine", en: "The machine", fr: "La machine", unlock: "volume3", pal: { H: "#111", O: "#1f2937", T: "#22d3ee", P: "#111827", B: "#000" }, acc: "headphones", A: "#22d3ee", aura: "#22d3ee" },
  { id: "volume", en: "Volume king", fr: "Roi du volume", unlock: "mhands60000", pal: { H: "#3b2a1e", O: "#7f1d1d", T: "#fbbf24", P: "#1c1917", B: "#111" }, acc: "crown" },
  { id: "potm", en: "Player of the month", fr: "Joueur du mois", unlock: "potm", pal: { H: "#3b2a1e", O: "#b45309", T: "#fde68a", P: "#1c1917", B: "#111" }, aura: "#f59e0b" },
  { id: "spring", en: "Spring champion", fr: "Champion du printemps", unlock: "contest-spring", pal: { H: "#3b2a1e", O: "#db2777", T: "#fbcfe8", P: "#1f1f24", B: "#111" }, aura: "#f472b6" },
  { id: "summer", en: "Summer champion", fr: "Champion de l'été", unlock: "contest-summer", pal: { H: "#7c2d12", O: "#f59e0b", T: "#fff7ed", P: "#1f1f24", B: "#111" }, acc: "shades", aura: "#fbbf24" },
  { id: "winter", en: "Winter champion", fr: "Champion de l'hiver", unlock: "contest-winter", pal: { H: "#e2e8f0", O: "#1e3a8a", T: "#e0f2fe", P: "#0f172a", B: "#000" }, aura: "#93c5fd" },
];
const skinOf = (id) => SKINS.find((s) => s.id === id) || SKINS[0];
/* What a character looks like: an animal or creature picked from the catalog (img:<id>), the player's own look
   from a photo (me:<hair>,<skin>, the photo never leaves the browser) or the default character, all wearing the chosen skin. */
function avatarSvg(p, size = 64, cls = "") {
  const av = p.av || p.avatar || "";
  if (av.startsWith("img:")) return `<img class="px av ${cls}" src="img/av/${esc(av.slice(4))}.png" width="${size}" height="${size}" alt="">`;
  return sprite(p.skin, size, cls, av.startsWith("me:") ? av.slice(3).split(",") : null);
}

function sprite(skinId, size = 64, cls = "", look = null) {
  const sk = skinOf(skinId);
  const pal = { S: "#f1c7a1", E: "#111", M: "#9a4a3a", G: "#f0b429", K: "#111", A: sk.A || "#333", ...sk.pal, ...(look ? { H: look[0], S: look[1] } : {}) };
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
/* Achievements, Dofus style: categories, tiers, points. Alexis 2026-10-28: about 100 to start.
   series() makes one achievement per tier; pts grow with the tier. */
const ACH_CATS = [["grind", "♠", "Grind", "Grind"], ["regular", "🔥", "Consistency", "Régularité"], ["study", "📚", "Study", "Étude"], ["review", "🔍", "Reviews", "Reviews"],
  ["coaching", "🎓", "Coaching", "Coaching"], ["career", "♛", "Career", "Carrière"], ["honors", "🏅", "Honors", "Honneurs"], ["levels", "⭐", "Levels", "Niveaux"]];
const k_ = (n) => (n >= 1e6 ? n / 1e6 + "M" : n >= 1000 ? n / 1000 + "k" : String(n));
const series = (cat, id, icon, en, fr, tiers, get) => tiers.map((n, i) => ({ id: `${id}${n}`, cat, icon, en: en(k_(n)), fr: fr(k_(n)), pts: 10 * (i + 1), ok: (g) => get(g) >= n }));
const one = (cat, id, icon, en, fr, ok, pts = 30) => ({ id, cat, icon, en, fr, pts, ok });
const STAKES = [50, 100, 200, 500, 1000, 2000, 5000];
const ACH = [
  // grind
  ...series("grind", "h", "⏱", (n) => `${n} h played`, (n) => `${n} h jouées`, [10, 50, 100, 250, 500, 1000, 2500, 5000], (g) => g.play),
  ...series("grind", "hands", "♠", (n) => `${n} hands`, (n) => `${n} mains`, [10000, 50000, 100000, 250000, 500000, 1000000, 2000000], (g) => g.handsAll),
  ...series("grind", "mh", "📆", (n) => `${n} h played in a month`, (n) => `${n} h jouées en un mois`, [50, 100, 150, 200], (g) => g.bestMonthPlay),
  ...series("grind", "mhands", "🃏", (n) => `${n} hands in a month`, (n) => `${n} mains en un mois`, [30000, 50000, 60000, 100000], (g) => g.bestMonthHands),
  one("grind", "volume3", "🤖", "50k hands a month, 3 months in a row", "50k mains par mois, 3 mois d'affilée", (g) => g.run50k >= 3, 60),
  one("grind", "volume6", "🦾", "50k hands a month, 6 months in a row", "50k mains par mois, 6 mois d'affilée", (g) => g.run50k >= 6, 100),
  one("grind", "marathon4", "🏃", "A 4 h session", "Une session de 4 h", (g) => g.longest >= 4),
  one("grind", "marathon6", "🏅", "A 6 h session", "Une session de 6 h", (g) => g.longest >= 6, 50),
  one("grind", "early", "🌅", "Session started before 8:00", "Session lancée avant 8 h", (g) => g.early, 20),
  one("grind", "owl", "🦉", "Session still on after 2:00", "Session encore en cours après 2 h", (g) => g.owl, 20),
  one("grind", "first", "▶", "First session", "Première session", (g) => g.sessions >= 1, 10),
  // consistency
  ...series("regular", "streak", "🔥", (n) => `${n}-day streak`, (n) => `Série de ${n} jours`, [3, 7, 14, 30, 60, 100], (g) => g.bestStreak),
  ...series("regular", "journal", "📓", (n) => `${n} days in the journal`, (n) => `${n} jours dans le journal`, [1, 10, 30, 100, 200, 365], (g) => g.parts.journalDay),
  // study
  ...series("study", "sh", "🧠", (n) => `${n} h of study`, (n) => `${n} h d'étude`, [10, 50, 100, 250], (g) => g.study),
  ...series("study", "concl", "✍", (n) => `${n} conclusions written`, (n) => `${n} conclusions écrites`, [1, 10, 25, 50, 100, 250], (g) => g.cards),
  ...series("study", "right", "✅", (n) => `${n} right answers`, (n) => `${n} bonnes réponses`, [10, 50, 100, 500, 1000], (g) => g.parts.right),
  ...series("study", "ss", "📚", (n) => `${n} study sessions`, (n) => `${n} sessions d'étude`, [10, 50], (g) => g.studySessions),
  // reviews
  ...series("review", "rev", "🔍", (n) => `${n} hands reviewed`, (n) => `${n} mains revues`, [1, 10, 50, 100, 250, 500], (g) => g.reviewed),
  ...series("review", "note", "🗒", (n) => `${n} hands with a note`, (n) => `${n} mains annotées`, [25, 100], (g) => g.parts.handNote),
  ...series("review", "join", "🤝", (n) => `${n} reviews with players`, (n) => `${n} reviews entre joueurs`, [1, 5, 10, 25, 50], (g) => g.joins),
  // coaching
  ...series("coaching", "att", "🎓", (n) => `${n} coachings attended`, (n) => `${n} coachings suivis`, [1, 10, 25, 50, 100], (g) => g.attended),
  // career
  one("career", "team_academy", "🎓", "Academy", "Academy", (g) => ["academy", "challenger", "master", "supreme"].includes(g.team), 10),
  one("career", "team_challenger", "⚔", "Challenger", "Challenger", (g) => ["challenger", "master", "supreme"].includes(g.team), 20),
  one("career", "team_master", "♜", "Master", "Master", (g) => ["master", "supreme"].includes(g.team), 40),
  one("career", "team_supreme", "♛", "Supreme", "Supreme", (g) => g.team === "supreme", 80),
  ...STAKES.map((n, i) => one("career", `nl${n}`, ["🐟", "💠", "🔷", "🦈", "💎", "🐋", "👑"][i], `Plays NL${n}`, `Joue en NL${n}`, (g) => g.stake >= n, 10 * (i + 1))),
  ...series("career", "season", "🗓", (n) => `Season ${n} at RTS`, (n) => `Saison ${n} chez RTS`, [2, 3, 4, 5], (g) => g.season),
  // honors (roles + awards given by Direction)
  one("honors", "coach", "📣", "RTS coach", "Coach RTS", (g) => g.roles.includes("coach"), 80),
  one("honors", "mentor", "🧭", "RTS mentor", "Mentor RTS", (g) => g.roles.includes("mentor"), 60),
  one("honors", "potm", "🏅", "Player of the month", "Joueur du mois", (g) => g.award("potm") >= 1, 60),
  one("honors", "potm3", "🎖", "Player of the month ×3", "Joueur du mois ×3", (g) => g.award("potm") >= 3, 100),
  one("honors", "contest-spring", "🌸", "Spring contest winner", "Vainqueur du concours de printemps", (g) => g.award("contest-spring") >= 1, 80),
  one("honors", "contest-summer", "☀", "Summer contest winner", "Vainqueur du concours d'été", (g) => g.award("contest-summer") >= 1, 80),
  one("honors", "contest-winter", "❄", "Winter contest winner", "Vainqueur du concours d'hiver", (g) => g.award("contest-winter") >= 1, 80),
  one("honors", "triple", "🏆", "Won all 3 season contests", "Les 3 concours de saison gagnés", (g) => ["contest-spring", "contest-summer", "contest-winter"].every((x) => g.award(x)), 200),
  // levels
  ...series("levels", "lvl", "⭐", (n) => `Level ${n}`, (n) => `Niveau ${n}`, [5, 10, 15, 20, 25, 30, 40, 50], (g) => g.level),
  { id: "pot500", cat: "grind", icon: "💰", en: "Won a 500 bb pot", fr: "Gagné un pot de 500 bb", pts: 30, soon: true },
  { id: "record", cat: "grind", icon: "🏆", en: "Hand record of the month", fr: "Record de mains du mois", pts: 50, soon: true },
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
  const play = j.reduce((a, e) => a + Number(e.play_h || 0), 0), study = j.reduce((a, e) => a + Number(e.study_h || 0), 0);
  const mHands = {};
  j.forEach((e) => (mHands[e.day.slice(0, 7)] = (mHands[e.day.slice(0, 7)] || 0) + Number(e.hands || 0)));
  let run50k = 0, r50 = 0, pm = null;
  Object.keys(mHands).sort().forEach((m) => { const nxt = pm && new Date(new Date(pm + "-15").setMonth(new Date(pm + "-15").getMonth() + 1)).toISOString().slice(0, 7) === m;
    r50 = mHands[m] >= 50000 ? (nxt ? r50 + 1 : 1) : 0; run50k = Math.max(run50k, r50); pm = m; });
  const dur = (x) => ((x.ended_at ? new Date(x.ended_at) : new Date()) - new Date(x.started_at) - Number(x.paused_ms || 0)) / 36e5;
  const grinds = sess.filter((x) => x.kind === "grind");
  const extra = { play, study, handsAll: j.reduce((a, e) => a + Number(e.hands || 0), 0), bestMonthHands: Math.max(0, ...Object.values(mHands)), run50k,
    longest: Math.max(0, ...grinds.map(dur)), early: grinds.some((x) => new Date(x.started_at).getHours() < 8 && new Date(x.started_at).getHours() >= 4),
    owl: grinds.some((x) => x.ended_at && new Date(x.ended_at).getHours() >= 2 && new Date(x.ended_at).getHours() < 5),
    studySessions: sess.filter((x) => x.kind === "study").length, attended: att.length, roles: p.roles || [],
    award: (k) => (p.awards || []).filter((a) => a === k || a.startsWith(k + ":")).length };
  const lv = levelOf(xp);
  const g = { xp, ...lv, parts, sessions: sess.length, bestStreak: best, bestMonthPlay: Math.max(0, ...Object.values(byMonth)), hours, cards: mineCards.length, reviewed, joins: joins.length,
    ...extra, team: p.team_id || "", stake: parseInt(String(p.stakes || "").replace(/\D/g, "")) || 0, season: p.rts_since ? new Date().getFullYear() - p.rts_since + 1 : 1 };
  g.unlocked = ACH.filter((a) => !a.soon && a.ok(g)).map((a) => a.id);
  g.points = ACH.filter((a) => g.unlocked.includes(a.id)).reduce((a, x) => a + x.pts, 0);
  g.skins = SKINS.filter((s) => !s.unlock || g.unlocked.includes(s.unlock)).map((s) => s.id);
  return g;
}
/* Secret agent look for Supreme (Alexis 2026-10-28: "online poker secret agent team", replaced the army look). Ranks = clearance levels. */
const OPS_RANKS = [[1, "Recruit", "Recrue"], [3, "Field agent", "Agent de terrain"], [6, "Special agent", "Agent spécial"], [10, "Senior agent", "Agent senior"],
  [15, "Handler", "Officier traitant"], [22, "Station chief", "Chef de station"], [30, "Director", "Directeur"]];
const opsRank = (lvl) => { const r = OPS_RANKS.filter((x) => lvl >= x[0]).pop(); return LANG === "fr" ? r[2] : r[1]; };
const isOperation = (e) => e.kind === "coaching" && e.teams?.length === 1 && e.teams[0] === "supreme";
const opTitle = (e) => (isOperation(e) ? `MISSION · ${e.title}` : e.title);
const rankLine = (p, g) => [p.team_id === "supreme" ? `◆ ${opsRank(g.level)}` : null, esc(teamOf(p).label), p.stakes ? esc(p.stakes) : null, `${t("season")} ${g.season}`].filter(Boolean).join(" · ");
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
/* Avatar catalog (pixel art from Higgsfield sheets, app/img/av/<id>.png). */
const AV_CATALOG = {
  animals: ["whale", "frog", "fox", "owl", "shark", "bear", "cat", "panda", "octopus", "penguin", "lion", "wolf", "rabbit", "tiger", "monkey", "eagle"],
  poker: ["chip", "ace", "king", "queen", "dice", "dealer", "cowboy", "highroller", "fish", "donkey", "suitshark", "luckycat", "crown", "moneybag", "slots", "tophat"],
  army: ["commando", "sniper", "soldier", "pilot", "general", "diver", "tanker", "medic", "radio", "spy", "ninja", "samurai", "viking", "knight", "cyborg", "astronaut"],
  fantasy: ["wizard", "robot", "alien", "ghost", "dragon", "vampire", "pirate", "zombie", "unicorn", "skeleton", "elf", "dwarf", "mermaid", "demon", "angel", "mushroom"],
};
/* "Look like me": the photo never leaves the browser. We read the hair color (top of the head) and the skin tone (cheeks) from it. */
function lookFromPhoto(file) {
  return new Promise((ok, ko) => {
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => {
      const c = document.createElement("canvas"); c.width = c.height = 64;
      const k = Math.min(img.width, img.height), x = c.getContext("2d");
      x.drawImage(img, (img.width - k) / 2, (img.height - k) / 2, k, k, 0, 0, 64, 64); URL.revokeObjectURL(url);
      const avg = (x0, y0, w, h) => { const d = x.getImageData(x0, y0, w, h).data, px = [];
        for (let i = 0; i < d.length; i += 4) px.push([d[i], d[i + 1], d[i + 2]]);
        px.sort((a, b) => a[0] + a[1] + a[2] - (b[0] + b[1] + b[2]));
        const mid = px.slice(Math.floor(px.length * .25), Math.ceil(px.length * .75)) || px;
        return "#" + [0, 1, 2].map((j) => Math.round(mid.reduce((s, p) => s + p[j], 0) / mid.length).toString(16).padStart(2, "0")).join(""); };
      ok({ hair: avg(22, 4, 20, 9), skin: avg(20, 32, 24, 10) });
    };
    img.onerror = ko; img.src = url;
  });
}

async function viewHero() {
  const g = await gameStats(ME);
  const cur = mySkin(ME, g);
  $("#main").innerHTML = `
    <div class="hero-grid">
      <div class="card hero-card">
        <div class="hero-stage">${avatarSvg({ skin: cur, av: ME.avatar }, 150, "idle")}</div>
        <h2 class="hero-name">${nm({ name: ME.nick || ME.name })}</h2><p class="rank">${rankLine(ME, g)}</p>
        <div class="lvl-line"><span class="lvl-badge">${g.level}</span><div class="xpbar"><i style="width:${(g.into / g.need) * 100}%"></i></div><small>${fmtNum(g.into)} / ${fmtNum(g.need)} XP</small></div>
        <p class="lbl">${t("yourColor")}</p>${swatches(ME.accent)}
      </div>
      <div class="stack">
        <div class="card look"><div class="card-head"><h3>${t("avatarT")}</h3></div>
          <form class="nick-row" id="nickf"><label>${t("nickL")}<input name="nick" maxlength="20" value="${esc(ME.nick || "")}" placeholder="${esc((ME.name || "").split(" ")[0])}"></label><button class="btn btn-sm">${t("saveNick")}</button></form>
          <div class="seg av-tabs">${["classic", "photo", ...Object.keys(AV_CATALOG)].map((k, i) => `<button type="button" data-avtab="${k}" class="${i ? "" : "on"}">${t("av_" + k)}</button>`).join("")}</div>
          <div data-avpane="classic"><p class="muted small">${t("classicSub")}</p><button class="btn btn-sm" data-av="">${t("wear")}</button></div>
          <div data-avpane="photo" hidden><label class="drop" id="photodrop"><input type="file" accept="image/*" hidden>📷 ${t("dropPhoto")}<small>${t("fromPhotoSub")}</small></label>
            <div class="photo-look" hidden><div id="lookprev"></div><label>${t("hairC")}<input type="color" id="hairc"></label><label>${t("skinC")}<input type="color" id="skinc"></label><button class="btn btn-sm btn-red" id="uselook">${t("useLook")}</button></div></div>
          ${Object.entries(AV_CATALOG).map(([k, l]) => `<div data-avpane="${k}" hidden><div class="av-grid">${l.map((id) => `<button type="button" class="${ME.avatar === "img:" + id ? "on" : ""}" data-av="img:${id}" title="${id}"><img class="px" src="img/av/${id}.png" width="56" height="56" alt="${id}" loading="lazy"></button>`).join("")}</div></div>`).join("")}
        </div>
        <div class="card"><div class="card-head"><h3>${t("skins")}</h3><span class="muted small">${g.skins.length} / ${SKINS.length}</span></div>
          <div class="skins">${SKINS.map((s) => { const own = g.skins.includes(s.id), a = ACH.find((x) => x.id === s.unlock);
            return `<button class="skin ${own ? "" : "locked"} ${s.id === cur ? "on" : ""}" ${own ? `data-skin="${s.id}"` : "disabled"} title="${own ? "" : esc(L2(a || {}))}">${sprite(s.id, 44)}<b>${esc(L2(s))}</b><small>${own ? (s.id === cur ? t("wearing") : t("wear")) : "🔒 " + esc(L2(a || {}))}</small></button>`; }).join("")}</div></div>
        <div class="card"><div class="card-head"><h3>${t("achievements")}</h3><span class="muted small">${g.unlocked.length} / ${ACH.length} · <b class="pts">${fmtNum(g.points)} pts</b></span></div>
          <div class="ach-cats">${ACH_CATS.map(([k, icon, en, fr], i) => { const l = ACH.filter((a) => a.cat === k), n = l.filter((a) => g.unlocked.includes(a.id)).length;
            return `<button type="button" data-achcat="${k}" class="${i ? "" : "on"}"><span>${icon}</span>${LANG === "fr" ? fr : en}<small>${n}/${l.length}</small><i style="width:${(n / l.length) * 100}%"></i></button>`; }).join("")}</div>
          ${ACH_CATS.map(([k], i) => `<div class="achs" data-achpane="${k}" ${i ? "hidden" : ""}>${ACH.filter((a) => a.cat === k).map((a) => `<div class="ach ${g.unlocked.includes(a.id) ? "on" : ""}"><span>${a.icon}</span><b>${esc(L2(a))}</b><small>${a.soon ? t("soonTracker") : a.pts + " pts" + (SKINS.some((x) => x.unlock === a.id) ? " · 👕 skin" : "")}</small></div>`).join("")}</div>`).join("")}</div>
        <div class="card"><div class="card-head"><h3>XP</h3><span class="muted small">${fmtNum(g.xp)} XP</span></div>
          <div class="xprules">${XP_RULES.map(([k, v]) => `<span>${t("xp_" + k)} <b>+${v}</b> <small>× ${fmtNum(g.parts[k])}</small></span>`).join("")}</div></div>
      </div>
    </div>`;
  bindSwatches();
  $$("[data-achcat]").forEach((x) => x.onclick = () => { $$("[data-achcat]").forEach((y) => y.classList.toggle("on", y === x)); $$("[data-achpane]").forEach((p) => p.hidden = p.dataset.achpane !== x.dataset.achcat); });
  $$("[data-skin]").forEach((b) => b.onclick = async () => {
    ME.skin = REAL.skin = b.dataset.skin; await db.setPrefs(null, b.dataset.skin).catch(() => {});
    if ((ME.avatar || "").startsWith("img:")) { ME.avatar = REAL.avatar = ""; await db.setLook(null, "").catch(() => {}); } // wearing a skin = back to the pixel character
    route();
  });
  const setAv = async (av) => { ME.avatar = REAL.avatar = av; await db.setLook(null, av).catch(() => {}); presenceStop(); presenceStart(); route(); };
  $$("[data-av]").forEach((b) => b.onclick = () => setAv(b.dataset.av));
  $$("[data-avtab]").forEach((b) => b.onclick = () => { $$("[data-avtab]").forEach((x) => x.classList.toggle("on", x === b)); $$("[data-avpane]").forEach((p) => p.hidden = p.dataset.avpane !== b.dataset.avtab); });
  $("#nickf").onsubmit = async (e) => { e.preventDefault(); const n = e.target.nick.value.trim(); ME.nick = REAL.nick = n || null; await db.setLook(n, null).catch(() => {}); presenceStop(); presenceStart(); route(); };
  const prev = () => { $("#lookprev").innerHTML = sprite(cur, 96, "idle", [$("#hairc").value, $("#skinc").value]); };
  ["hairc", "skinc"].forEach((id) => $("#" + id).oninput = prev);
  $("#photodrop input").onchange = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    const l = await lookFromPhoto(f).catch(() => null); if (!l) return;
    $("#hairc").value = l.hair; $("#skinc").value = l.skin; $(".photo-look").hidden = false; prev();
  };
  $("#uselook").onclick = () => setAv(`me:${$("#hairc").value},${$("#skinc").value}`);
}

/* ---------- RTS HQ: live map ----------
   One presence channel for the whole app: you are on the map from the moment you log in.
   Start a poker session and your character walks to the grind room; end it and it walks back to the lobby. */
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
const PRES = { ch: null, me: null, list: [], subs: new Set(), chats: new Set(), log: [] };
const hqRoomNow = (open) => open ? (open.kind === "grind" ? "grind" : "study") : (() => { try { return localStorage.getItem("rts-hq-room") || "lobby"; } catch { return "lobby"; } })();
async function presenceStart() {
  if (PRES.ch || !ME) return;
  const [g, open] = await Promise.all([gameStats(ME).catch(() => ({ level: 1, skins: ["rookie"] })), db.openSession(ME.id).catch(() => null)]);
  PRES.me = { id: ME.id, name: ME.nick || ME.name, skin: mySkin(ME, g), av: ME.avatar || null, lvl: g.level, team: ME.team_id || "", room: hqRoomNow(open) };
  PRES.ch = db.hq(PRES.me, (l) => { PRES.list = l; PRES.subs.forEach((f) => f(l)); }, (m) => { PRES.log.push(m); PRES.log = PRES.log.slice(-40); PRES.chats.forEach((f) => f(m)); },
    { secret: !!ME.secret, sees: ME.team_id === "supreme" || isAdmin() });
}
function hqMove(room) {
  try { if (!["grind", "study"].includes(room)) localStorage.setItem("rts-hq-room", room); } catch {}
  if (!PRES.ch || PRES.me.room === room) return;
  PRES.me = { ...PRES.me, room }; PRES.ch.track(PRES.me);
}
function presenceStop() { PRES.ch?.leave(); PRES.ch = null; PRES.list = []; }

/* Draws the map into `box` and keeps it live. mini = the home preview (my team only, no names). */
function mountMap(box, { mini = false, onList } = {}) {
  box.innerHTML = `<div class="hq-map ${mini ? "mini" : ""}">${hqArt() ? `<img class="hq-art" src="${hqArt()}" alt="">` : ""}
    ${Object.entries(ROOMS).map(([k, r]) => `<button class="room r-${k} ${hqArt() ? "on-art" : ""}" data-room="${k}" style="left:${r.x / 10}%;top:${r.y / 5.6}%;width:${r.w / 10}%;height:${r.h / 5.6}%"><span>${r.icon} ${mini ? "" : t("room_" + k)}</span></button>`).join("")}
    <div class="hq-people"></div></div>`;
  const layer = box.querySelector(".hq-people"), els = {}, at = {}, rooms = {};
  const label = (p) => nm({ name: p.name || "?" });
  const place = (el, pt, ms) => { el.style.transition = ms ? `left ${ms}ms linear, top ${ms}ms linear` : "none"; el.style.left = pt.x / 10 + "%"; el.style.top = pt.y / 5.6 + "%"; };
  const walk = (id, from, to) => {
    const el = els[id]; if (!el) return;
    const a = at[id] || hqSpot(from, id), b = hqSpot(to, id);
    const legs = [{ x: a.x, y: CORRIDOR }, { x: b.x, y: CORRIDOR }, b];
    let cur = a, i = 0;
    el.classList.add("moving"); el.classList.toggle("flip", b.x < a.x);
    const step = () => {
      if (i >= legs.length) { el.classList.remove("moving"); return; }
      const p = legs[i++], ms = Math.max(120, Math.hypot(p.x - cur.x, p.y - cur.y) * 4.2);
      place(el, p, ms); cur = p; at[id] = p; setTimeout(step, ms);
    };
    step();
  };
  const render = (all) => {
    if (!box.isConnected) { PRES.subs.delete(render); PRES.chats.delete(chat); return; }
    const list = mini && !isStaff() ? all.filter((p) => p.id === ME.id || p.team === ME.team_id) : all;
    list.forEach((p) => {
      if (!els[p.id]) {
        const el = document.createElement("div"); el.className = "pc" + (p.id === ME.id ? " me" : "");
        el.innerHTML = `<div class="bubble" hidden></div>${avatarSvg(p, mini ? 26 : 42)}${mini ? "" : `<span class="pname">${label(p)} <small>${p.lvl || 1}</small></span>`}`;
        el.title = label(p);
        layer.appendChild(el); els[p.id] = el; at[p.id] = hqSpot(p.room, p.id); place(el, at[p.id], 0);
      } else if (rooms[p.id] !== p.room) walk(p.id, rooms[p.id], p.room);
      rooms[p.id] = p.room;
    });
    Object.keys(els).forEach((id) => { if (!list.some((p) => p.id === id)) { els[id].remove(); delete els[id]; delete rooms[id]; } });
    onList?.(list);
  };
  const chat = (m) => {
    const b = els[m.id]?.querySelector(".bubble"); if (!b || !box.isConnected) return;
    b.textContent = m.text; b.hidden = false; clearTimeout(b._t); b._t = setTimeout(() => (b.hidden = true), 6000);
  };
  PRES.subs.add(render); PRES.chats.add(chat);
  render(PRES.list);
  if (!mini) $$("[data-room]", box).forEach((b) => b.onclick = () => hqMove(b.dataset.room));
}

/* Home preview: who of my team is grinding, studying, in a review. Click = the full map. */
function hqPreview() {
  return `<a class="card hq-prev" href="#/hq"><div class="card-head"><h3>RTS HQ</h3><span class="muted small" id="hqp-n"></span></div><div id="hqp"></div></a>`;
}
function bindHqPreview() {
  const box = $("#hqp"); if (!box) return;
  mountMap(box, { mini: true, onList: (l) => {
    const n = (r) => l.filter((p) => p.room === r).length;
    $("#hqp-n") && ($("#hqp-n").textContent = `${l.length} ${t("online")} · ♠ ${n("grind")} · 📚 ${n("study")} · 🔍 ${n("review")}`);
  } });
}

async function viewHQ() {
  await presenceStart();
  const go = new URLSearchParams(location.hash.split("?")[1] || "").get("go");
  const evs = await db.events(new Date(Date.now() - 36e5).toISOString(), addDays(1) + "T23:59").catch(() => []);
  const reviews = evs.filter((e) => e.kind === "review" && forMe(e));
  $("#main").innerHTML = `
    <div class="hq-wrap">
      <div id="hqmap"></div>
      <aside class="hq-side">
        <div class="card"><div class="card-head"><h3>RTS HQ</h3><span class="tag" id="hqcount">1</span></div><div id="hqwho" class="hq-who"></div></div>
        <div class="card"><div class="card-head"><h3>${t("room_review")}</h3></div>
          ${reviews.map((e) => `<p class="hrow">${hhmm(e.starts_at)} · ${esc(e.title)} <button class="btn btn-sm" data-goto="review">${t("goThere")}</button></p>`).join("") || `<p class="muted small">${t("noEvents")}</p>`}</div>
        <div class="card hq-chat"><div id="hqlog" class="hq-log"></div><form id="hqsay" class="inline"><input name="m" maxlength="140" placeholder="${t("saySomething")}" autocomplete="off"><button class="btn btn-sm btn-red">↵</button></form></div>
      </aside>
    </div>`;
  const who = (p) => nm({ name: p?.name || "?" });
  mountMap($("#hqmap"), { onList: (l) => {
    $("#hqcount") && ($("#hqcount").textContent = l.length);
    $("#hqwho") && ($("#hqwho").innerHTML = l.map((p) => `<p>${avatarSvg(p, 18)} <b>${who(p)}</b> <small class="muted">${t("room_" + p.room)}</small></p>`).join(""));
  } });
  const logLine = (m) => { const log = $("#hqlog"); if (!log) { PRES.chats.delete(logLine); return; } log.insertAdjacentHTML("beforeend", `<p><b>${who(PRES.list.find((p) => p.id === m.id))}</b> ${esc(m.text)}</p>`); log.scrollTop = log.scrollHeight; };
  PRES.log.forEach(logLine); PRES.chats.add(logLine);
  $$("[data-goto]").forEach((b) => b.onclick = () => hqMove(b.dataset.goto));
  $("#hqsay").onsubmit = (ev) => { ev.preventDefault(); const v = ev.target.m.value.trim(); if (v) PRES.ch?.say(v); ev.target.reset(); };
  if (go) setTimeout(() => hqMove(go), 900);
}
/* Map art (Higgsfield, 2026-10-28): the HQ for everyone, the secret agent HQ for Supreme. */
const hqArt = () => (document.body.classList.contains("ops") ? "img/hq/hq-ops.webp" : "img/hq/hq.webp");

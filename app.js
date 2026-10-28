/* RTS Platform. One page app, hash routes:
   #/                home: streak, progress vs objective, hours this month, menu
   #/journal         daily journal (timers, one short form, month by month)
   #/p/ID/TAB        player page: overview, journal, mentoring, coaching, money, contract
   #/coaching        program + quizzes      #/c/ID coaching    #/quiz/ID quiz    #/review retry deck
   #/library         strategy by situation  #/s/ID situation   #/submit research
   #/calendar  #/team (staff)  #/admin (ops)  #/ceo (direction) */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const today = () => iso(new Date());
const daysAgo = (n) => addDays(-n);
const fmtDay = (d) => new Date(d + "T12:00:00").toLocaleDateString(LANG === "fr" ? "fr-FR" : "en-GB", { day: "numeric", month: "long" });
const fmtMonth = (d) => new Date(d.slice(0, 7) + "-15T12:00:00").toLocaleDateString(LANG === "fr" ? "fr-FR" : "en-GB", { month: "long", year: "numeric" });
const fmtNum = (n) => Math.round(Number(n || 0)).toLocaleString(LANG === "fr" ? "fr-FR" : "en-GB");
const fmtH = (n) => (Math.round(Number(n || 0) * 10) / 10).toLocaleString(LANG === "fr" ? "fr-FR" : "en-GB") + " h";
const eur = (n) => `<span class="sensitive">${fmtNum(n)} €</span>`;
const bar = (v, max, cls = "") => `<div class="bar ${cls}"><i style="width:${Math.min(100, max ? (v / max) * 100 : 0)}%"></i></div>`;
const daysInMonth = () => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(); };

/* Camera mode: blurs private data and shortens names while recording. */
const cam = {
  get on() { try { return localStorage.getItem("rts-cam") !== "off"; } catch { return true; } },
  set(v) { try { localStorage.setItem("rts-cam", v ? "on" : "off"); } catch {} document.body.classList.toggle("cam", v); },
};
const nm = (p) => {
  if (!p) return "—";
  if (!cam.on) return esc(p.name);
  return esc(p.name.split(" ").map((x) => x[0] + ".").join(" "));
};

let ME = null, VISIBLE = [], TEAMS = [];
const has = (p, r) => (p?.roles || []).includes(r);
const isAdmin = (p = ME) => has(p, "admin");
const isOps = (p = ME) => has(p, "ops") || isAdmin(p);
const isStaff = (p = ME) => ["mentor", "coach", "manager", "admin", "ops"].some((r) => has(p, r));
const person = (id) => VISIBLE.find((p) => p.id === id) || (ME?.id === id ? ME : null);
const teamOf = (p) => TEAMS.find((x) => x.id === p?.team_id) || TEAMS.find((x) => x.id === p?.team) || { label: p?.team || "", month_hands: 50000, week_hours: 35, cut_pct: 35 };
const sideLabel = (side) => ({ academy: "Academy", elite: "Elite", staff: "Staff" }[side] || side);
const seesMoney = (p) => ME.id === p.id || isAdmin() || (ME.manages || []).includes(p.team);
const coachesPlayer = (p) => isAdmin() || p.mentor_id === ME.id || (ME.coaches || []).includes(p.team) || (ME.manages || []).includes(p.team);
const isAway = (p, day) => !!(p && p.away_from && p.away_to && day >= p.away_from && day <= p.away_to);

/* ---------- numbers from journal entries ---------- */
function stats(entries, p) {
  const ms = monthStart();
  const month = entries.filter((e) => e.day >= ms);
  const sum = (l, k) => l.reduce((a, e) => a + Number(e[k] || 0), 0);
  const days = new Set(entries.map((e) => e.day));
  let streak = 0;
  // Holiday days freeze the streak: they neither break it nor add to it.
  for (let i = days.has(today()) ? 0 : 1; i < 400; i++) {
    const d = daysAgo(i);
    if (days.has(d)) streak++;
    else if (!isAway(p, d)) break;
  }
  const tm = teamOf(p);
  const goal = p._goal;
  const handsTarget = goal?.hands_target || tm.month_hands;
  const pace = handsTarget * (new Date().getDate() / daysInMonth());
  return {
    play: sum(month, "play_h"), study: sum(month, "study_h"), hands: sum(month, "hands"), handsTarget, pace,
    playTarget: goal?.play_h_target || null, studyTarget: goal?.study_h_target || null,
    streak, last: [...days].sort().pop() || null, filledToday: days.has(today()),
  };
}

/* Staff dot: hands vs pace + journal. Green on track, yellow slipping, red behind. */
function dot(s, p) {
  if (isAway(p, today())) return "grey";
  let level = s.hands >= s.pace * 0.9 ? 0 : s.hands >= s.pace * 0.7 ? 1 : 2;
  if (!s.last || s.last < daysAgo(2)) level = Math.min(2, level + 1);
  return ["green", "yellow", "red"][level];
}

/* ---------- small building blocks ---------- */
const kpi = (label, value, extra = "") => `<div class="card kpi"><span>${label}</span><b>${value}</b>${extra}</div>`;
const empty = (msg) => `<p class="muted card">${msg}</p>`;
const head = (eyebrow, title, sub = "") => `<section class="hello"><p class="eyebrow">${eyebrow}</p><h1>${title}</h1>${sub ? `<p class="muted">${sub}</p>` : ""}</section>`;

function streakDots(entries, p, n = 14) {
  const days = new Set(entries.map((e) => e.day));
  return `<div class="dots">${Array.from({ length: n }, (_, i) => { const d = daysAgo(n - 1 - i); return `<i class="${days.has(d) ? "on" : isAway(p, d) ? "away" : ""}" title="${fmtDay(d)}"></i>`; }).join("")}</div>`;
}

function dictateButton(textarea) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return;
  const b = document.createElement("button");
  b.type = "button"; b.className = "mic"; b.title = t("dictate"); b.textContent = "🎙";
  let rec = null;
  b.onclick = () => {
    if (rec) { rec.stop(); return; }
    rec = new SR(); rec.lang = LANG === "fr" ? "fr-FR" : "en-GB"; rec.interimResults = false; rec.continuous = true;
    rec.onresult = (e) => { const txt = [...e.results].slice(e.resultIndex).map((r) => r[0].transcript).join(" "); textarea.value = (textarea.value ? textarea.value + " " : "") + txt.trim(); };
    rec.onend = () => { rec = null; b.classList.remove("on"); };
    rec.start(); b.classList.add("on");
  };
  textarea.parentElement.appendChild(b);
}

/* ---------- calendar events: shared helpers ---------- */
const KIND_ICON = { coaching: "🎓", mentoring: "🤝", study: "📚", review: "🔍", other: "•", grind: "♠" };
const hhmm = (d) => new Date(d).toLocaleTimeString(LANG === "fr" ? "fr-FR" : "en-GB", { hour: "2-digit", minute: "2-digit" });
const weekStart = () => { const d = new Date(); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return iso(d); };
const dayName = (d) => new Date(d + "T12:00:00").toLocaleDateString(LANG === "fr" ? "fr-FR" : "en-GB", { weekday: "short", day: "numeric" });
const clock = (ms) => { const s = Math.max(0, Math.floor(ms / 1000)); return `${Math.floor(s / 3600)}:${String(Math.floor(s / 60) % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`; };
let DIR = null;
const directory = async () => (DIR ||= await db.directory().catch(() => []));

function nextUp(events) {
  const now = new Date().toISOString();
  const e = events.find((x) => new Date(new Date(x.starts_at).getTime() + x.minutes * 60000).toISOString() >= now);
  if (!e) return "";
  const live = e.starts_at <= now;
  return `<a class="card nextup ${live ? "live" : ""}" href="${e.link ? esc(e.link) : "#/calendar"}" ${e.link ? 'target="_blank" rel="noopener"' : ""}>
    <span class="eyebrow">${live ? t("liveNow") : t("nextUp")}</span>
    <b>${KIND_ICON[e.kind]} ${esc(e.title)}</b>
    <span class="muted">${e.starts_at.slice(0, 10) === today() ? t("today") : fmtDay(e.starts_at.slice(0, 10))} · ${hhmm(e.starts_at)}${e.link ? " · " + t("join") + " →" : ""}</span></a>`;
}

/* Week at a glance (inspired by Alexis's start page): one column per day, events + hours done. */
function weekView(events, sessions) {
  const ws = weekStart();
  const days = Array.from({ length: 7 }, (_, i) => addDays(i, new Date(ws + "T12:00:00")));
  return `<div class="card week"><div class="card-head"><h3>${t("thisWeek")}</h3><a class="btn btn-sm btn-ghost-red" href="#/calendar">${t("plan")}</a></div>
    <div class="week-grid">${days.map((d) => {
      const ev = events.filter((e) => e.starts_at.slice(0, 10) === d);
      const ss = sessions.filter((s) => s.started_at.slice(0, 10) === d && s.minutes);
      const g = ss.filter((s) => s.kind === "grind").reduce((a, s) => a + s.minutes, 0), st = ss.filter((s) => s.kind === "study").reduce((a, s) => a + s.minutes, 0);
      return `<div class="wday ${d === today() ? "today" : d < today() ? "past" : ""}"><p class="wd">${dayName(d)}</p>
        ${ev.map((e) => `<p class="wev k-${e.kind}"><small>${hhmm(e.starts_at)}</small>${KIND_ICON[e.kind]} ${esc(e.title)}</p>`).join("")}
        ${g ? `<p class="wev k-grind">♠ ${fmtH(g / 60)}</p>` : ""}${st ? `<p class="wev k-study">📚 ${fmtH(st / 60)}</p>` : ""}</div>`;
    }).join("")}</div></div>`;
}

/* ---------- home: the lobby (one screen, no scroll) ---------- */
const elapsed = (s) => (s.paused_at ? new Date(s.paused_at) : Date.now()) - new Date(s.started_at) - Number(s.paused_ms || 0);
const weekHours = (entries) => entries.filter((e) => e.day >= weekStart()).reduce((a, e) => a + Number(e.play_h || 0) + Number(e.study_h || 0), 0);
const xpBar = (v, max) => `<div class="xpbar big"><i style="width:${Math.min(100, max ? (v / max) * 100 : 0)}%"></i></div>`;

async function viewHome() {
  if (!has(ME, "player")) return viewHomeStaff();
  const [mine, goals, deck, events, open, hands, cards, g] = await Promise.all([db.journal(ME.id, daysAgo(400)), db.goals(ME.id), db.deck(ME.id),
    db.events(new Date(Date.now() - 864e5).toISOString(), addDays(14) + "T23:59"), db.openSession(ME.id), db.hands(), db.cards(), gameStats(ME)]);
  ME._goal = goals.find((x) => x.label === monthStart());
  const s = stats(mine, ME), target = teamOf(ME).week_hours || 35, wk = weekHours(mine) + (open ? elapsed(open) / 36e5 : 0);
  const handsLeft = hands.filter((h) => !h.reviewed).length, recall = cards.filter((c) => c.player_id === ME.id && c.due <= today()).length;
  const due = deck.filter((d) => d.due <= today()).length;
  const now = new Date().toISOString(), coming = events.filter((e) => new Date(new Date(e.starts_at).getTime() + e.minutes * 6e4).toISOString() >= now);
  const coach = coming.find((e) => e.kind === "coaching" && e.starts_at.slice(0, 10) === today());
  const quest = (done, href, label, xp, attr = "") => `<a class="quest ${done ? "done" : ""}" ${href ? `href="${href}"` : ""} ${attr}><span>${done ? "✓" : "○"} ${label}</span><b>+${xp} XP</b></a>`;
  const skin = mySkin(ME, g), first = cam.on ? esc(ME.name[0]) + "." : esc(ME.name.split(" ")[0]);
  const todayE = mine.find((e) => e.day === today()) || { player_id: ME.id, day: today() };
  $("#main").innerHTML = `
    <section class="lobby-top">
      <h1 class="hi">${t("hi")} ${first}</h1>
      ${open ? `<a class="go-pill on ${open.kind}" href="#/session">${KIND_ICON[open.kind]} ${t(open.kind === "grind" ? "grindOn" : "studyOn")} <b data-since>${clock(elapsed(open))}</b> <em>${t("backCockpit")} →</em></a>`
        : `<button class="go-pill grind" data-start="grind">♠ ${t("startPoker")}</button><button class="go-pill study" data-start="study">📚 ${t("startStudyS")}</button>`}
    </section>
    <div class="lobby">
      <aside class="card char">
        <a class="char-stage" href="#/hero" title="${t("charLink")}">${sprite(skin, 112, "idle")}</a>
        <h3 class="char-name">${nm(ME)}</h3><p class="rank">${rankLine(ME, g)}</p>
        <div class="lvl-line"><span class="lvl-badge">${g.level}</span><div class="xpbar"><i style="width:${(g.into / g.need) * 100}%"></i></div></div>
        <p class="muted tiny">${fmtNum(g.into)} / ${fmtNum(g.need)} XP · ${t("lvl")} ${g.level + 1}</p>
        <div class="ach-row">${ACH.filter((a) => g.unlocked.includes(a.id)).slice(-6).map((a) => `<span title="${esc(L2(a))}">${a.icon}</span>`).join("") || `<span class="muted tiny">${t("noAch")}</span>`}</div>
        <a class="btn btn-sm char-link" href="#/hero">${t("charLink")} · ${g.unlocked.length}/${ACH.length}</a>
      </aside>
      <section class="stack lobby-mid">
        <div class="card weekxp"><div class="card-head"><h3>${t("weekHours")}</h3><b class="wk-num">${fmtH(wk)} <small>/ ${target} h</small></b></div>${xpBar(wk, target)}</div>
        <div class="card"><div class="card-head"><h3>${t("quests")}</h3></div><div class="quests">
          ${quest(s.filledToday, null, t("questJournal"), 20, 'data-eod role="button"')}
          ${handsLeft ? quest(false, "#/hands", `${handsLeft} ${t("questHands")}`, 5 * handsLeft) : ""}
          ${recall ? quest(false, "#/recall", `${recall} ${t("questRecall")}`, 5 * recall) : ""}
          ${due ? quest(false, "#/review", `${due} ${t("questQuiz")}`, 5 * due) : ""}
          ${coach ? quest(false, coach.link || "#/calendar", `${t("questCoaching")} ${esc(coach.title)} · ${hhmm(coach.starts_at)}`, 25) : ""}
        </div></div>
        <div class="card stats-strip">
          <div><span>🔥 ${t("streak")}</span><b>${s.streak} <small>${s.streak === 1 ? t("day") : t("days")}</small></b></div>
          <div><span>♠ ${t("handsMonth")}</span><b>${fmtNum(s.hands)} <small>/ ${fmtNum(s.handsTarget)}</small></b>${bar(s.hands, s.handsTarget, s.hands >= s.pace * 0.9 ? "" : "warn")}</div>
          <div><span>⏱ ${t("hoursMonth")}</span><b>${fmtH(s.play + s.study)}</b></div>
        </div>
        <button class="btn btn-ghost-red eod-btn" data-eod>🌙 ${t("endOfDay")}</button>
      </section>
      <aside class="stack lobby-right">
        ${nextUp(coming)}
        <div class="card"><div class="card-head"><h3>${t("comingUp")}</h3><a class="small-link" href="#/calendar">${t("calendar")} →</a></div>
          ${coming.slice(1, 4).map((e) => `<p class="hrow">${KIND_ICON[e.kind]} ${esc(e.title)}<small class="muted"> · ${e.starts_at.slice(0, 10) === today() ? t("today") : dayName(e.starts_at.slice(0, 10))} ${hhmm(e.starts_at)}</small></p>`).join("") || `<p class="muted small">${t("noEvents")}</p>`}</div>
        <div class="dock">
          <a href="#/hq"><span>🏢</span>${t("hq")}</a>
          <a href="https://app.gtowizard.com" target="_blank" rel="noopener"><span>🧙</span>GTO Wizard</a>
          <a href="#/replayer"><span>▶</span>Replayer</a>
          <a href="#/library"><span>📖</span>${t("library")}</a>
        </div>
      </aside>
    </div>
    <dialog id="eod" class="card"><form method="dialog" id="eodf"><div class="card-head"><h3>🌙 ${t("endOfDay")}</h3><button class="x" value="cancel" formnovalidate>×</button></div>
      <p class="muted small">${t("eodSub")}</p>
      <label>${t("hands")}<input name="hands" type="number" min="0" step="50" inputmode="numeric" value="${todayE.hands ?? ""}" placeholder="0"></label>
      <p class="lbl">${t("mood")}</p><div class="mood">${[1, 2, 3, 4, 5].map((n) => `<input type="radio" name="mood" id="em${n}" value="${n}" ${Number(todayE.mood) === n ? "checked" : ""}><label for="em${n}">${n}</label>`).join("")}</div>
      <label class="ta">${t("eodHow")}<textarea name="played" rows="4" class="sensitive">${esc(todayE.played || "")}</textarea></label>
      <button class="btn btn-red" value="save">${t("save")} · +20 XP</button> <a class="btn btn-sm" href="#/journal">${t("fullJournal")}</a></form></dialog>`;
  $$("[data-start]").forEach((b) => b.onclick = async () => { b.disabled = true; await db.startSession(b.dataset.start); location.hash = "#/session"; });
  const since = $("[data-since]");
  if (since && !open.paused_at) timerTick = setInterval(() => { since.textContent = clock(elapsed(open)); }, 1000);
  const dlg = $("#eod");
  dictateButton(dlg.querySelector("textarea"));
  $$("[data-eod]").forEach((b) => b.onclick = (e) => { e.preventDefault(); dlg.showModal(); });
  $("#eodf").onsubmit = async (ev) => {
    if (ev.submitter?.value !== "save") return;
    const f = new FormData(ev.target);
    await db.saveJournal({ ...todayE, hands: +f.get("hands") || 0, mood: +f.get("mood") || todayE.mood || null, played: f.get("played").trim() });
    route();
  };
  xpToast(g);
}

/* Staff without a player seat keep the overview home. */
async function viewHomeStaff() {
  const [events, sessions] = await Promise.all([db.events(new Date(Date.now() - 864e5).toISOString(), addDays(14) + "T23:59"), db.sessions(ME.id, weekStart())]);
  const menu = [["#/coaching", t("coaching"), t("program") + " · " + t("quizzes")], ["#/library", t("library"), t("libSub")]]
    .concat(isStaff() ? [["#/team", t("team"), t("teamSub").split(".")[0]]] : [])
    .concat(isOps() ? [["#/admin", t("admin"), t("adminSub").split(".")[0]]] : [])
    .concat(isAdmin() ? [["#/ceo", t("ceo"), t("ceoSub")]] : []);
  $("#main").innerHTML = `
    ${head(fmtDay(today()), `${t("hi")} ${cam.on ? esc(ME.name[0]) + "." : esc(ME.name.split(" ")[0])}`)}
    ${nextUp(events)}
    ${weekView(events, sessions)}
    <div class="grid menu">${menu.map(([h, l, sub]) => `<a class="card menu-item" href="${h}"><b>${l}</b><span>${esc(sub)}</span></a>`).join("")}
      <a class="card menu-item" href="#/hq"><b>${t("hq")}</b><span>${t("hqSub")}</span></a></div>`;
}

/* ---------- session cockpit (grind or study): one screen ---------- */
async function focusList(pid, editable) {
  const items = await db.focus(pid);
  return `<div class="card focus"><div class="card-head"><h3>${t("focus")}</h3></div>
    ${items.map((f) => `<p class="fitem"><span>${esc(f.text)}</span>${editable ? `<button class="x" data-dropf="${f.id}" title="${t("del")}">×</button>` : ""}</p>`).join("") || `<p class="muted small">${t("noFocus")}</p>`}
    ${editable ? `<form class="inline" data-addf="${pid}"><input name="f" placeholder="${t("focusPh")}" required><button class="btn btn-sm btn-ghost-red">+</button></form>` : ""}</div>`;
}
function bindFocus() {
  $$("[data-dropf]").forEach((b) => b.onclick = async () => { await db.dropFocus(b.dataset.dropf); route(); });
  $$("[data-addf]").forEach((f) => f.onsubmit = async (ev) => { ev.preventDefault(); await db.addFocus(f.dataset.addf, new FormData(f).get("f").trim()); route(); });
}

/* Opponent notes: player only (RLS), typed during the session, kept for every future session. */
function oppForm(notes) {
  return `<form class="card" id="oform"><div class="card-head"><h3>${t("oppNotes")}</h3><a class="small-link" href="#/notes">${t("allNotes")} (${notes.length}) →</a></div>
    <input name="nick" list="nicks" required autocomplete="off" placeholder="${t("oppNick")}" class="sensitive">
    <datalist id="nicks">${notes.map((n) => `<option value="${esc(n.nick)}">`).join("")}</datalist>
    <textarea name="note" rows="3" placeholder="${t("oppNote")}" class="sensitive"></textarea>
    <button class="btn btn-sm btn-red">${t("saveNote")}</button><p class="saved" id="osaved"></p></form>`;
}
function bindOpp(notes) {
  const f = $("#oform"); if (!f) return;
  f.nick.oninput = () => { const n = notes.find((x) => x.nick.toLowerCase() === f.nick.value.trim().toLowerCase()); if (n) f.note.value = n.note; };
  f.onsubmit = async (ev) => { ev.preventDefault(); const nick = f.nick.value.trim(); if (!nick) return; await db.saveNote({ nick, note: f.note.value.trim() }); $("#osaved").textContent = `${nick} · ${t("saved")}`; f.reset(); };
}

async function viewSession() {
  const s = await db.openSession(ME.id);
  if (!s) { location.hash = "#/"; return; }
  const grind = s.kind === "grind";
  const [focus, hands, cards, notes, mine] = await Promise.all([focusList(ME.id, true), db.hands(), db.cards(), db.notes().catch(() => []), db.journal(ME.id, weekStart())]);
  const mineHere = hands.filter((h) => h.session_id === s.id), cardsHere = cards.filter((c) => c.session_id === s.id);
  const target = teamOf(ME).week_hours || 35, before = weekHours(mine);
  $("#main").innerHTML = `
    <section class="card cock-top ${s.paused_at ? "paused" : ""}">
      <div class="ct-side"><span class="eyebrow">${KIND_ICON[s.kind]} ${t(grind ? "grindCockpit" : "studyCockpit")}</span><small class="muted">${s.paused_at ? "⏸ " + t("paused") : t("startedAt") + " " + hhmm(s.started_at)}</small></div>
      <div class="ct-mid"><div class="midclock" id="sclock">${clock(elapsed(s))}</div>
        <div class="ct-week"><div class="xpbar big"><i id="wbar"></i></div><small class="muted" id="wtxt"></small></div></div>
      <div class="ct-side right"><button class="btn btn-sm" id="pause">${s.paused_at ? "▶ " + t("resume") : "⏸ " + t("pause")}</button><button class="btn btn-sm btn-red" id="endb">■ ${t("end")}</button></div>
    </section>
    <div class="cock-grid">
      <div class="stack">${focus}
        <form class="card" id="nform"><div class="card-head"><h3>${t(grind ? "sessionNotes" : "studyNotes")}</h3><span class="saved" id="nsaved"></span></div>
          <label class="ta"><textarea name="notes" rows="${grind ? 5 : 7}" class="sensitive" placeholder="${t("sessionNotesPh")}">${esc(s.notes)}</textarea></label></form>
      </div>
      <div class="stack">
        ${grind ? `<form class="card" id="hform"><div class="card-head"><h3>${t("addHand")}</h3><span class="tag">${mineHere.length}</span></div>
            <div class="drop" id="drop">${t("dropHere")}<input type="file" id="hfile" accept="image/*" multiple hidden></div>
            <textarea name="hh" rows="4" class="sensitive mono" placeholder="${t("pasteHH")}"></textarea>
            <input name="note" placeholder="${t("handNotePh")}">
            <button class="btn btn-sm btn-red">${t("saveHand")}</button><p class="saved" id="hsaved"></p></form>`
        : `<form class="card" id="cform"><div class="card-head"><h3>${t("addConclusion")}</h3><span class="tag">${cardsHere.length}</span></div>
            <p class="muted small">${t("conclusionAsk")}</p>
            <input name="situation" required placeholder="${t("situation")} · SB vs BTN, 3BP, K72r">
            <textarea name="conclusion" rows="3" required placeholder="${t("myConclusion")}"></textarea>
            <label class="check"><input type="checkbox" name="shared"><span>${t("shareTeam")}</span></label>
            <button class="btn btn-sm btn-red">${t("saveConclusion")}</button></form>`}
      </div>
      <div class="stack">
        ${grind ? `<div class="card scroll-card"><div class="card-head"><h3>${t("handsSession")}</h3></div>
          ${mineHere.map((h) => `<p class="hrow">${h.image_path || h.image_data ? "🖼" : "📋"} <span class="sensitive">${esc((h.note || h.hh || t("screenshot")).slice(0, 60))}</span></p>`).join("") || `<p class="muted small">${t("noHandsYet")}</p>`}</div>
          ${oppForm(notes)}`
        : `<div class="card scroll-card"><div class="card-head"><h3>${t("conclusions")}</h3></div>
          ${cardsHere.map((c) => `<p class="hrow"><b>${esc(c.situation)}</b><br><span class="muted sensitive">${esc(c.conclusion)}</span></p>`).join("") || `<p class="muted small">${t("noCardsYet")}</p>`}</div>`}
      </div>
    </div>
    <dialog id="endd" class="card"><form method="dialog"><div class="card-head"><h3>${t("endTitle")}</h3></div>
      <p class="end-dur" id="edur"></p><p class="muted small">${t("endSub")}</p>
      <p class="row-btns"><button class="btn btn-red" value="end">■ ${t("endGo")}</button><button class="btn" value="cancel">${t("cancel")}</button></p></form></dialog>`;
  bindFocus(); bindOpp(notes);
  $$("textarea").forEach(dictateButton);
  const tick = () => {
    const ms = elapsed(s), wk = before + ms / 36e5;
    $("#sclock") && ($("#sclock").textContent = clock(ms));
    $("#wbar") && ($("#wbar").style.width = Math.min(100, (wk / target) * 100) + "%");
    $("#wtxt") && ($("#wtxt").textContent = `${fmtH(wk)} / ${target} h · ${t("weekHours").toLowerCase()}`);
  };
  tick(); if (!s.paused_at) timerTick = setInterval(tick, 1000);
  const notesNow = () => $("[name=notes]").value;
  const saveNotes = async () => { await db.saveSession({ id: s.id, notes: notesNow() }); $("#nsaved").textContent = t("saved"); };
  $("[name=notes]").onblur = saveNotes;
  $("#pause").onclick = async () => {
    const x = s.paused_at ? { paused_ms: Number(s.paused_ms || 0) + (Date.now() - new Date(s.paused_at)), paused_at: null } : { paused_at: new Date().toISOString() };
    await db.saveSession({ id: s.id, notes: notesNow(), ...x }); route();
  };
  if (grind) {
    const save = async (h, file) => { $("#hsaved").textContent = "…"; try { await db.saveSession({ id: s.id, notes: notesNow() }); await db.addHand({ session_id: s.id, ...h }, file); route(); } catch (err) { $("#hsaved").textContent = t("error") + " : " + err.message; } };
    const files = async (list) => { await db.saveSession({ id: s.id, notes: notesNow() }); for (const f of [...list].filter((f) => f.type.startsWith("image/"))) await db.addHand({ session_id: s.id, note: $("[name=note]").value || null }, f); route(); };
    const drop = $("#drop");
    drop.onclick = () => $("#hfile").click();
    $("#hfile").onchange = (e) => files(e.target.files);
    drop.ondragover = (e) => { e.preventDefault(); drop.classList.add("over"); };
    drop.ondragleave = () => drop.classList.remove("over");
    drop.ondrop = (e) => { e.preventDefault(); files(e.dataTransfer.files); };
    // Cmd+V a screenshot anywhere in the cockpit saves it too.
    document.onpaste = (e) => { if (location.hash !== "#/session") return; const im = [...(e.clipboardData?.files || [])]; if (im.length) { e.preventDefault(); files(im); } };
    $("#hform").onsubmit = (ev) => { ev.preventDefault(); const f = new FormData(ev.target); const hh = f.get("hh").trim(); if (!hh) return; save({ hh, note: f.get("note").trim() || null }); };
  } else {
    $("#cform").onsubmit = async (ev) => {
      ev.preventDefault(); const f = new FormData(ev.target);
      await db.saveSession({ id: s.id, notes: notesNow() });
      await db.addCard({ session_id: s.id, situation: f.get("situation").trim(), conclusion: f.get("conclusion").trim(), shared: f.has("shared") }); route();
    };
  }
  // End: hours go straight into today's journal (hands are counted once, in the End of day journal).
  const dlg = $("#endd");
  $("#endb").onclick = () => { $("#edur").textContent = clock(elapsed(s)); dlg.showModal(); };
  dlg.onclose = async () => {
    if (dlg.returnValue !== "end") return;
    const minutes = Math.max(1, Math.round(elapsed(s) / 60000));
    await db.saveSession({ id: s.id, ended_at: new Date().toISOString(), minutes, notes: notesNow(),
      ...(s.paused_at ? { paused_ms: Number(s.paused_ms || 0) + (Date.now() - new Date(s.paused_at)), paused_at: null } : {}) });
    const day = s.started_at.slice(0, 10), e = (await db.journal(ME.id, day)).find((x) => x.day === day) || { player_id: ME.id, day };
    const k = grind ? "play_h" : "study_h";
    await db.saveJournal({ ...e, [k]: Math.round((Number(e[k] || 0) + minutes / 60) * 100) / 100 });
    location.hash = grind ? (mineHere.length ? "#/hands" : "#/") : "#/study";
  };
}

/* All opponent notes, searchable, editable. Player only. */
async function viewNotes() {
  const notes = await db.notes();
  $("#main").innerHTML = `${head(t("oppNotes"), t("oppNotes"), t("oppNotesSub"))}
    <input id="nq" placeholder="${t("searchNotes")}" class="sensitive">
    <div class="grid notes-grid">${notes.map((n) => `<form class="card onote" data-nick="${esc(n.nick.toLowerCase())}"><div class="card-head"><h3 class="sensitive">${esc(n.nick)}</h3><small class="muted">${fmtDay(n.updated_at.slice(0, 10))}</small></div>
      <textarea name="note" rows="3" class="sensitive">${esc(n.note)}</textarea><input type="hidden" name="nick" value="${esc(n.nick)}">
      <button class="btn btn-sm">${t("save")}</button></form>`).join("") || empty(t("noNotes"))}</div>`;
  $("#nq").oninput = (e) => $$(".onote").forEach((f) => { f.hidden = !f.dataset.nick.includes(e.target.value.toLowerCase()); });
  $$(".onote").forEach((f) => f.onsubmit = async (ev) => { ev.preventDefault(); await db.saveNote({ nick: f.nick.value, note: f.note.value.trim() }); ev.submitter.textContent = t("saved"); });
}

/* ---------- hands to review (player only) ---------- */
async function viewHands() {
  const hands = await db.hands();
  const todo = hands.filter((h) => !h.reviewed), done = hands.filter((h) => h.reviewed);
  const card = (h) => `<article class="card hand ${h.reviewed ? "done" : ""}">
    <div class="card-head"><h3>${fmtDay(h.created_at.slice(0, 10))} · ${hhmm(h.created_at)}</h3>
      <span>${h.hh ? `<button class="btn btn-sm" data-copy="${h.id}">${t("copyHH")}</button> ` : ""}<button class="btn btn-sm ${h.reviewed ? "" : "btn-red"}" data-rev="${h.id}" data-v="${h.reviewed ? "" : "1"}">${h.reviewed ? t("undo") : "✓ " + t("reviewed")}</button></span></div>
    ${h.note ? `<p>${esc(h.note)}</p>` : ""}
    ${h.image_path || h.image_data ? `<img class="hshot sensitive" data-img="${esc(h.image_path || "")}" ${h.image_data ? `src="${h.image_data}"` : ""} alt="">` : ""}
    ${h.hh ? `<pre class="hh sensitive">${esc(h.hh)}</pre>` : ""}</article>`;
  $("#main").innerHTML = `${head(t("hands"), t("handsTitle"), t("handsPrivate"))}
    <p><a class="btn btn-ghost-red" href="#/replayer">▶ RTS Replayer</a></p>
    <div class="stack">${todo.map(card).join("") || empty(t("noHands"))}</div>
    ${done.length ? `<details class="h-sec"><summary>${t("reviewedList")} (${done.length})</summary><div class="stack">${done.map(card).join("")}</div></details>` : ""}`;
  $$("[data-img]").forEach(async (im) => { if (im.dataset.img) im.src = (await db.handImage(im.dataset.img)) || ""; });
  $$("[data-rev]").forEach((b) => b.onclick = async () => { await db.setHand(b.dataset.rev, { reviewed: !!b.dataset.v }); route(); });
  $$("[data-copy]").forEach((b) => b.onclick = async () => { try { await navigator.clipboard.writeText(hands.find((h) => h.id === b.dataset.copy).hh); b.textContent = t("copied"); } catch {} });
}

/* ---------- study hub: sessions, conclusions, recall cards ---------- */
async function viewStudy() {
  const [sessions, cards] = await Promise.all([db.sessions(ME.id, daysAgo(120)), db.cards()]);
  const mine = cards.filter((c) => c.player_id === ME.id), team = cards.filter((c) => c.player_id !== ME.id && c.shared);
  const studies = sessions.filter((s) => s.kind === "study" && s.ended_at);
  const dueN = mine.filter((c) => c.due <= today()).length;
  const hours = studies.filter((s) => s.started_at >= monthStart()).reduce((a, s) => a + (s.minutes || 0), 0) / 60;
  $("#main").innerHTML = `${head(t("study"), t("studyHub"), t("studyHubSub"))}
    <div class="grid kpis">
      ${kpi(t("studyMonth"), fmtH(hours))}
      ${kpi(t("conclusions"), mine.length)}
      ${kpi(t("cardsToRecall"), dueN, dueN ? `<a class="btn btn-sm btn-red" href="#/recall">${t("recallNow")}</a>` : "")}
    </div>
    <div class="grid two">
      <div class="stack"><h2 class="h-sec">${t("conclusions")}</h2>
        ${mine.map((c) => `<article class="card"><div class="card-head"><h3>${esc(c.situation)}</h3><label class="check sm"><input type="checkbox" data-share="${c.id}" ${c.shared ? "checked" : ""}><span>${t("shared")}</span></label></div>
          <p class="sensitive">${esc(c.conclusion)}</p><p class="muted small">${t("nextRecall")} ${fmtDay(c.due)}</p></article>`).join("") || empty(t("noCardsYet"))}
        ${team.length ? `<h2 class="h-sec">${t("fromTeam")}</h2><div class="stack">${team.map((c) => `<article class="card"><h3>${esc(c.situation)}</h3><p class="muted small">${nm(person(c.player_id) || (DIR || []).find((d) => d.id === c.player_id))}</p></article>`).join("")}</div>
          <a class="btn btn-ghost-red" href="#/recall?team=1">${t("practiceTeam")}</a>` : ""}
      </div>
      <div class="stack"><h2 class="h-sec">${t("studySessions")}</h2>
        ${studies.map((s) => `<article class="card"><div class="card-head"><h3>${fmtDay(s.started_at.slice(0, 10))}</h3><span class="tag">${fmtH((s.minutes || 0) / 60)}</span></div>
          ${s.notes ? `<p class="sensitive pre">${esc(s.notes)}</p>` : `<p class="muted small">—</p>`}
          ${cards.filter((c) => c.session_id === s.id).map((c) => `<p class="small">→ ${esc(c.situation)}</p>`).join("")}</article>`).join("") || empty(t("noStudy"))}
      </div>
    </div>`;
  $$("[data-share]").forEach((c) => c.onchange = () => db.saveCard({ id: c.dataset.share, shared: c.checked }));
}

/* Recall: see the situation, answer in your head, reveal your own conclusion, say if you had it. */
async function viewRecall() {
  const teamMode = location.hash.includes("team=1");
  const cards = await db.cards();
  const list = teamMode ? cards.filter((c) => c.player_id !== ME.id && c.shared) : cards.filter((c) => c.player_id === ME.id && c.due <= today());
  let i = 0, got = 0;
  const paint = () => {
    if (i >= list.length) {
      $("#main").innerHTML = `<a class="back" href="#/study">← ${t("studyHub")}</a>${head(t("recall"), list.length ? `${got} / ${list.length}` : t("noRecall"), t("recallDone"))}<a class="btn btn-red" href="#/study">${t("finish")}</a>`;
      return;
    }
    const c = list[i];
    $("#main").innerHTML = `<a class="back" href="#/study">← ${t("studyHub")}</a>
      <section class="hello"><p class="eyebrow">${t("recall")} · ${i + 1}/${list.length}</p><h1 class="h-long">${esc(c.situation)}</h1><p class="muted">${t("recallAsk")}</p></section>
      <div id="rbox"><button class="btn btn-red" id="reveal">${t("reveal")}</button></div>`;
    $("#reveal").onclick = () => {
      $("#rbox").innerHTML = `<div class="card result"><span class="sub">${t("myConclusion")}</span><p class="sensitive">${esc(c.conclusion)}</p>
        <p><button class="btn btn-red" data-ok="1">✓ ${t("hadIt")}</button> <button class="btn btn-ghost-red" data-ok="">${t("missedIt")}</button></p></div>`;
      $$("[data-ok]").forEach((b) => b.onclick = async () => {
        const ok = !!b.dataset.ok; if (ok) got++;
        if (!teamMode) await db.saveCard({ id: c.id, ...nextRecall(c, ok), ...(ok ? { hits: Number(c.hits || 0) + 1 } : {}) });
        i++; paint();
      });
    };
  };
  paint();
}

/* ---------- journal ---------- */
const TIMER_KEY = "rts-timer";
const timer = {
  get() { try { return JSON.parse(localStorage.getItem(TIMER_KEY)); } catch { return null; } },
  set(v) { try { v ? localStorage.setItem(TIMER_KEY, JSON.stringify(v)) : localStorage.removeItem(TIMER_KEY); } catch {} },
};
let timerTick = null;

async function viewJournal() {
  const day = new URLSearchParams(location.hash.split("?")[1] || "").get("day") || today();
  const [mine, goals] = await Promise.all([db.journal(ME.id, daysAgo(400)), db.goals(ME.id)]);
  const e = mine.find((x) => x.day === day) || {};
  const tm = teamOf(ME);
  const run = timer.get();
  const months = [...new Set(mine.map((x) => x.day.slice(0, 7)))].sort().reverse().slice(0, 6);
  $("#main").innerHTML = `
    ${head(fmtDay(day), t("jTitle"), t("jSub"))}
    <div class="grid two">
      <form class="card journal-form" id="jform">
        <div class="timers">
          ${["play", "study"].map((k) => `<button type="button" class="timer ${run?.kind === k ? "on" : ""}" data-timer="${k}">
            <span>${t(k)}</span><b data-elapsed="${k}">${t("start")}</b></button>`).join("")}
        </div>
        <div class="row3">
          <label>${t("play")} (h)<input name="play_h" type="number" step="0.25" min="0" max="16" inputmode="decimal" value="${e.play_h ?? ""}" placeholder="0"></label>
          <label>${t("study")} (h)<input name="study_h" type="number" step="0.25" min="0" max="16" inputmode="decimal" value="${e.study_h ?? ""}" placeholder="0"></label>
          <label>${t("hands")}<input name="hands" type="number" step="50" min="0" inputmode="numeric" value="${e.hands ?? ""}" placeholder="0"></label>
        </div>
        <p class="lbl">${t("mood")}</p>
        <div class="mood">${[1, 2, 3, 4, 5].map((n) => `<input type="radio" name="mood" id="m${n}" value="${n}" ${Number(e.mood) === n ? "checked" : ""}><label for="m${n}">${n}</label>`).join("")}</div>
        <p class="lbl">${t("tags")}</p>
        <div class="chips">${Object.keys(TAGS).map((k) => `<button type="button" class="tagchip ${(e.tags || []).includes(k) ? "on" : ""}" data-tag="${k}">${tag(k)}</button>`).join("")}</div>
        ${[["played", "played"], ["learned", "learned"], ["did_well", "didWell"], ["mistakes", "mistakes"]].map(([k, l]) => `<label class="ta">${t(l)}<textarea name="${k}" rows="2" class="sensitive">${esc(e[k])}</textarea></label>`).join("")}
        <button class="btn btn-red" type="submit">${t("save")}</button>
        <p class="saved" id="jsaved"></p>
      </form>
      <div class="stack">
        <div class="card"><div class="card-head"><h3>${t("monthView")}</h3></div>
          <table class="mini"><thead><tr><th>${t("month")}</th><th>${t("play")}</th><th>${t("study")}</th><th>${t("hands")}</th></tr></thead><tbody>
          ${months.map((m) => {
            const l = mine.filter((x) => x.day.startsWith(m)); const g = goals.find((x) => x.label.startsWith(m));
            const hands = l.reduce((a, x) => a + Number(x.hands || 0), 0), target = g?.hands_target || tm.month_hands;
            return `<tr><td>${fmtMonth(m)}<small>${l.length} ${t("days")}</small></td><td>${fmtH(l.reduce((a, x) => a + Number(x.play_h || 0), 0))}</td><td>${fmtH(l.reduce((a, x) => a + Number(x.study_h || 0), 0))}</td><td>${fmtNum(hands)}<small>/ ${fmtNum(target)}</small>${bar(hands, target)}</td></tr>`;
          }).join("") || `<tr><td colspan="4" class="muted">—</td></tr>`}
          </tbody></table></div>
        ${awayCard()}
      </div>
    </div>`;
  $$("textarea", $("#jform")).forEach(dictateButton);
  $$(".tagchip").forEach((b) => b.onclick = () => {
    if (!b.classList.contains("on") && $$(".tagchip.on").length >= 10) return;
    b.classList.toggle("on");
  });
  // Timers: start when he sits down, stop adds the time to the hours box.
  const paint = () => {
    const r = timer.get();
    $$("[data-elapsed]").forEach((el) => {
      if (r?.kind !== el.dataset.elapsed) { el.textContent = t("start"); return; }
      const s = Math.floor((Date.now() - r.started) / 1000);
      el.textContent = `${Math.floor(s / 3600)}:${String(Math.floor(s / 60) % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
    });
  };
  clearInterval(timerTick); timerTick = setInterval(paint, 1000); paint();
  $$("[data-timer]").forEach((b) => b.onclick = () => {
    const r = timer.get(), k = b.dataset.timer;
    if (r) {
      const hours = Math.round(((Date.now() - r.started) / 3600000) * 4) / 4;
      const input = $(`[name=${r.kind}_h]`); input.value = Math.round((Number(input.value || 0) + hours) * 4) / 4;
      timer.set(null);
      $$(".timer").forEach((x) => x.classList.remove("on"));
      if (r.kind === k) { paint(); return; }
    }
    timer.set({ kind: k, started: Date.now() }); b.classList.add("on"); paint();
  });
  $("#jform").onsubmit = async (ev) => {
    ev.preventDefault();
    const f = new FormData(ev.target);
    const entry = { player_id: ME.id, day, play_h: +f.get("play_h") || 0, study_h: +f.get("study_h") || 0, hands: +f.get("hands") || 0,
      mood: f.get("mood") ? +f.get("mood") : null, tags: $$(".tagchip.on").map((b) => b.dataset.tag),
      played: f.get("played"), learned: f.get("learned"), did_well: f.get("did_well"), mistakes: f.get("mistakes") };
    try { await db.saveJournal(entry); $("#jsaved").textContent = t("saved"); setTimeout(() => (location.hash = "#/"), 700); }
    catch (err) { $("#jsaved").textContent = t("error") + " : " + err.message; }
  };
  bindAway();
}

function awayCard() {
  const on = ME.away_from && ME.away_to && ME.away_to >= today();
  return `<form class="card" id="aform"><div class="card-head"><h3>${t("away")}</h3>${on ? `<span class="tag">${fmtDay(ME.away_from)} → ${fmtDay(ME.away_to)}</span>` : ""}</div>
    <p class="muted small">${t("awaySub")}</p>
    <div class="row2"><label>${t("from")}<input type="date" name="from" value="${ME.away_from || ""}" required></label><label>${t("to")}<input type="date" name="to" value="${ME.away_to || ""}" required></label></div>
    <button class="btn btn-sm btn-ghost-red" type="submit">${t("save")}</button>${on ? ` <button class="btn btn-sm" type="button" id="aclear">${t("cancel")}</button>` : ""}</form>`;
}
function bindAway() {
  const save = async (from, to) => { await db.setAway(from, to); ME = await db.me(); route(); };
  $("#aform")?.addEventListener("submit", (ev) => { ev.preventDefault(); const f = new FormData(ev.target); save(f.get("from"), f.get("to")); });
  $("#aclear")?.addEventListener("click", () => save(null, null));
}

/* ---------- player page (Coaching Dashboard layout: goals, rate the month, habits, monthly review) ---------- */
async function viewPlayer(id, tab = "overview") {
  const p = person(id);
  if (!p) { $("#main").innerHTML = empty(t("notFound")); return; }
  const tabs = ["overview", "journal", "mentoring", "coaching"].concat(seesMoney(p) ? ["money", "contract"] : []);
  if (!tabs.includes(tab)) tab = "overview";
  const label = { overview: t("overview"), journal: t("journal"), mentoring: t("mentoring"), coaching: t("coaching"), money: t("money"), contract: t("contract") };
  const mentor = person(p.mentor_id);
  const body = await PLAYER_TABS[tab](p);
  $("#main").innerHTML = `
    <section class="hello player-head">
      <p class="eyebrow">${esc(teamOf(p).label)}${p.stakes ? " · " + esc(p.stakes) : ""}${isAway(p, today()) ? " · " + t("onHoliday") : ""}</p>
      <h1>${nm(p)}</h1>
      ${mentor ? `<p class="muted">${t("mentor")} : ${nm(mentor)}</p>` : ""}
    </section>
    <nav class="tabs">${tabs.map((k) => `<a href="#/p/${p.id}/${k}" class="${k === tab ? "on" : ""}">${label[k]}</a>`).join("")}</nav>
    <div class="tab-body">${body}</div>`;
  PLAYER_BIND[tab]?.(p);
}

const PLAYER_TABS = {
  async overview(p) {
    const [j, goals] = await Promise.all([db.journal(p.id, daysAgo(400)), db.goals(p.id)]);
    const g = goals.find((x) => x.label === monthStart());
    p._goal = g;
    const s = stats(j, p), tm = teamOf(p);
    const own = p.id === ME.id, mentorOf = p.mentor_id === ME.id || isAdmin();
    const month = new URLSearchParams(location.hash.split("?")[1] || "").get("m") || monthStart();
    const r = (await db.report(p.id, month)) || {};
    const tagCount = {};
    j.filter((e) => e.day >= daysAgo(60)).forEach((e) => (e.tags || []).forEach((k) => (tagCount[k] = (tagCount[k] || 0) + 1)));
    const editGoal = own && g?.status !== "confirmed";
    const dis = (ok) => (ok ? "" : "disabled");
    return `
      ${await focusList(p.id, true)}
      <div class="grid kpis">
        ${kpi(t("handsMonth"), `${fmtNum(s.hands)} <small>/ ${fmtNum(s.handsTarget)}</small>`, bar(s.hands, s.handsTarget))}
        ${kpi(t("hoursMonth"), fmtH(s.play + s.study), `<em>${fmtH(s.play)} ${t("play").toLowerCase()}${s.playTarget ? " / " + fmtH(s.playTarget) : ""} · ${fmtH(s.study)} ${t("study").toLowerCase()}${s.studyTarget ? " / " + fmtH(s.studyTarget) : ""}</em>`)}
        ${kpi(t("streak"), `${s.streak} <small>${t("days")}</small>`, streakDots(j, p))}
      </div>
      <div class="grid two">
        <form class="card" id="gform">
          <div class="card-head"><h3>${t("objectives")} · ${fmtMonth(monthStart())}</h3>${g ? `<span class="tag ${g.status === "confirmed" ? "ok" : "warn"}">${g.status === "confirmed" ? t("confirmed") : t("proposed")}</span>` : ""}</div>
          <div class="row3">
            <label>${t("hands")}<input name="hands_target" type="number" step="1000" value="${g?.hands_target ?? tm.month_hands}" ${dis(editGoal)}></label>
            <label>${t("play")} (h)<input name="play_h_target" type="number" value="${g?.play_h_target ?? Math.round(tm.week_hours * 4.3 * 0.7)}" ${dis(editGoal)}></label>
            <label>${t("study")} (h)<input name="study_h_target" type="number" value="${g?.study_h_target ?? Math.round(tm.week_hours * 4.3 * 0.3)}" ${dis(editGoal)}></label>
          </div>
          <label class="ta">${t("other")}<textarea name="items" rows="3" ${dis(editGoal)}>${esc((g?.items || []).join("\n"))}</textarea></label>
          ${!g ? `<p class="muted small">${t("teamDefault")} : ${fmtNum(tm.month_hands)} ${t("hands").toLowerCase()}</p>` : ""}
          ${editGoal ? `<button class="btn btn-sm btn-red" type="submit">${t("propose")}</button>` : ""}
          ${mentorOf && !own && g && g.status !== "confirmed" ? `<button class="btn btn-sm btn-ghost-red" type="button" id="gconfirm">${t("confirm")}</button>` : ""}
        </form>
        <div class="card"><div class="card-head"><h3>${t("habit")}</h3></div>
          ${heatmap(j, p)}
          <div class="chips static">${Object.entries(tagCount).sort((a, b) => b[1] - a[1]).map(([k, n]) => `<span class="tagchip">${tag(k)} · ${n}</span>`).join("") || `<span class="muted small">—</span>`}</div>
        </div>
      </div>
      <form class="card" id="rform">
        <div class="card-head"><h3>${t("report")}</h3>
          <select id="rmonth">${[monthStart(), prevMonthStart()].map((m) => `<option value="${m}" ${m === month ? "selected" : ""}>${fmtMonth(m)}</option>`).join("")}</select></div>
        <p class="muted small">${t("reportPrivate")}</p>
        <label class="ta">${t("rating")}<input name="rating" type="number" min="1" max="10" value="${r.rating ?? ""}" ${dis(own)}></label>
        <div class="grid two tight">
          <label class="ta">${t("wins")}<textarea name="wins" rows="3" class="sensitive" ${dis(own)}>${esc(r.wins)}</textarea></label>
          <label class="ta">${t("struggles")}<textarea name="struggles" rows="3" class="sensitive" ${dis(own)}>${esc(r.struggles)}</textarea></label>
        </div>
        <label class="ta">${t("nextFocus")}<textarea name="next_focus" rows="2" class="sensitive" ${dis(own)}>${esc(r.next_focus)}</textarea></label>
        <label class="ta">${t("mentorNote")}<textarea name="mentor_note" rows="2" class="sensitive" ${dis(coachesPlayer(p) && !own)}>${esc(r.mentor_note)}</textarea></label>
        <button class="btn btn-sm btn-red" type="submit">${t("save")}</button>
        ${own ? `<button class="btn btn-sm btn-ghost-red" type="button" id="rcopy">${t("copyDiscord")}</button>` : ""}
        <p class="saved" id="rsaved"></p>
      </form>`;
  },
  async journal(p) {
    const j = await db.journal(p.id, daysAgo(90));
    return j.length ? j.map((e) => `<article class="card entry">
      <div class="card-head"><h3>${fmtDay(e.day)}</h3><span class="muted small">${fmtH(e.play_h)} ${t("play").toLowerCase()} · ${fmtH(e.study_h)} ${t("study").toLowerCase()} · ${fmtNum(e.hands)} ${t("hands").toLowerCase()}${e.mood ? " · " + e.mood + "/5" : ""}</span></div>
      ${(e.tags || []).length ? `<div class="chips static">${e.tags.map((k) => `<span class="tagchip">${tag(k)}</span>`).join("")}</div>` : ""}
      <div class="grid two tight">${[["played", "played"], ["learned", "learned"], ["did_well", "didWell"], ["mistakes", "mistakes"]].filter(([k]) => e[k]).map(([k, l]) => `<p><span class="sub">${t(l)}</span><span class="sensitive">${esc(e[k])}</span></p>`).join("")}</div>
    </article>`).join("") : empty("—");
  },
  async mentoring(p) {
    const ms = await db.mentorings(p.id);
    const canApprove = p.mentor_id === ME.id || isAdmin();
    return ms.length ? ms.map((m) => `<article class="card session">
      <div class="card-head"><h3>${t("mentoring")} · ${fmtDay(m.day)}</h3><span class="tag ${m.status === "validated" ? "ok" : "warn"}">${m.status === "validated" ? t("validated") : t("draftClaude")}</span></div>
      <div class="grid two tight"><div><p class="sub">${t("feedback")}</p><ul class="sensitive">${(m.feedback || []).map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>
      <div><p class="sub">${t("nextSteps")}</p><ul class="sensitive">${(m.next_steps || []).map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div></div>
      ${m.transcript ? `<details><summary>${t("transcript")}</summary><p class="transcript sensitive">${esc(m.transcript)}</p></details>` : ""}
      ${m.status === "draft" && canApprove ? `<button class="btn btn-sm btn-ghost-red" data-approve="${esc(m.id)}">${t("approve")}</button>` : ""}
    </article>`).join("") : empty(t("noMentoring"));
  },
  async coaching(p) {
    const [cs, att, ex, done, qz, ans, deck, qs] = await Promise.all([db.coachings(), db.attendance(p.id), db.exercises(), db.exerciseDone(p.id), db.quizzes(), db.answers(p.id), db.deck(p.id), db.questions()]);
    const attended = cs.filter((c) => att.includes(c.id)).sort((a, b) => (a.day < b.day ? -1 : 1));
    const own = p.id === ME.id;
    const quizRows = qz.filter((q) => q.status === "live" && q.teams.includes(p.team)).map((q) => {
      const ids = new Set(qs.filter((x) => x.quiz_id === q.id).map((x) => x.id));
      const firstTry = {};
      ans.filter((a) => ids.has(a.question_id)).forEach((a) => { if (!(a.question_id in firstTry)) firstTry[a.question_id] = a.correct; });
      const tried = Object.keys(firstTry).length, right = Object.values(firstTry).filter(Boolean).length;
      return `<tr><td><a href="#/quiz/${q.id}">${esc(q.title)}</a></td><td>${tried ? `${right}/${ids.size}` : "—"}</td></tr>`;
    }).join("");
    const dueN = deck.filter((d) => d.due <= today()).length;
    return `
      <div class="grid two">
        <div class="card"><div class="card-head"><h3>${t("program")}</h3><span class="muted small">${attended.length}</span></div>
          ${attended.length ? `<div class="list">${attended.map(coachingRow).join("")}</div>` : `<p class="muted">${t("noCoaching")}</p>`}</div>
        <div class="stack">
          <div class="card"><div class="card-head"><h3>${t("exercises")}</h3></div>
            ${ex.filter((e) => e.teams.includes(p.team)).map((e) => `<label class="check"><input type="checkbox" data-ex="${e.id}" ${done.includes(e.id) ? "checked" : ""} ${own ? "" : "disabled"}><span><b>${esc(e.title)}</b><small>${esc(e.detail || "")}</small></span></label>`).join("") || `<p class="muted">—</p>`}</div>
          <div class="card"><div class="card-head"><h3>${t("quizzes")}</h3><span class="tag ${dueN ? "warn" : "ok"}">${dueN} ${t("toReview")}</span></div>
            <table class="mini"><tbody>${quizRows || `<tr><td class="muted">—</td></tr>`}</tbody></table></div>
        </div>
      </div>`;
  },
  async money(p) {
    const f = await db.finances(p.id);
    const tot = (k) => f.reduce((a, x) => a + Number(x[k] || 0), 0);
    const sheet = p.compta_sheet && p.compta_sheet !== "demo" ? `https://docs.google.com/spreadsheets/d/${encodeURIComponent(p.compta_sheet)}` : null;
    const last = f[f.length - 1];
    return `<p class="notice">${t("sample")}</p>
      ${f.length ? `<div class="grid kpis">
        ${kpi(t("profit"), eur(last.result), `<em>${fmtMonth(last.month)}</em>`)}
        ${kpi(t("cutOwed") + " / " + t("paid"), `${eur(tot("cut"))} <small>/ ${eur(tot("paid"))}</small>`)}
        ${kpi(t("makeup"), eur(last.makeup))}</div>
      <div class="card table-card"><table><thead><tr><th>${t("month")}</th><th>${t("profit")}</th><th>${t("cutOwed")}</th><th>${t("paid")}</th></tr></thead>
      <tbody>${f.map((x) => `<tr><td>${fmtMonth(x.month)}</td><td>${eur(x.result)}</td><td>${eur(x.cut)}</td><td>${eur(x.paid)}</td></tr>`).join("")}</tbody></table></div>` : ""}
      ${sheet ? `<a class="btn btn-red" href="${sheet}" target="_blank" rel="noopener">${t("openSheet")}</a>` : ""}`;
  },
  async contract(p) {
    const url = await db.contractUrl(p);
    return `<div class="card"><div class="card-head"><h3>${t("contract")} ${esc(teamOf(p).label)}</h3></div><p class="muted">${t("contractSub")}</p>
      ${url ? `<a class="btn btn-red" href="${url}" target="_blank" rel="noopener">${t("openContract")}</a>` : `<p class="muted">${t("noContract")}</p>`}</div>`;
  },
};

const PLAYER_BIND = {
  overview(p) {
    bindFocus();
    $("#gform")?.addEventListener("submit", async (ev) => {
      ev.preventDefault(); const f = new FormData(ev.target);
      await db.saveGoal({ player_id: p.id, period: "month", label: monthStart(), status: "proposed", hands_target: +f.get("hands_target") || null,
        play_h_target: +f.get("play_h_target") || null, study_h_target: +f.get("study_h_target") || null, items: String(f.get("items") || "").split("\n").map((x) => x.trim()).filter(Boolean) });
      route();
    });
    $("#gconfirm")?.addEventListener("click", async () => { await db.saveGoal({ player_id: p.id, period: "month", label: monthStart(), status: "confirmed", confirmed_by: ME.id }); route(); });
    $("#rmonth")?.addEventListener("change", (e) => { location.hash = `#/p/${p.id}/overview?m=${e.target.value}`; });
    $("#rform")?.addEventListener("submit", async (ev) => {
      ev.preventDefault(); const f = new FormData(ev.target);
      const r = { player_id: p.id, month: $("#rmonth").value };
      ["rating", "wins", "struggles", "next_focus", "mentor_note"].forEach((k) => { if (f.has(k)) r[k] = k === "rating" ? (+f.get(k) || null) : f.get(k); });
      try { await db.saveReport(r); $("#rsaved").textContent = t("saved"); } catch (err) { $("#rsaved").textContent = t("error") + " : " + err.message; }
    });
    // Bridge to the team report: one click copies a short summary for his Discord channel.
    $("#rcopy")?.addEventListener("click", async () => {
      const f = new FormData($("#rform")); const m0 = $("#rmonth").value;
      const m = (await db.journal(p.id, m0)).filter((e) => e.day.startsWith(m0.slice(0, 7)));
      const sum = (k) => m.reduce((a, e) => a + Number(e[k] || 0), 0);
      const txt = [`**${fmtMonth(m0)}**`, `${fmtNum(sum("hands"))} ${t("hands").toLowerCase()} · ${fmtH(sum("play_h"))} ${t("play").toLowerCase()} · ${fmtH(sum("study_h"))} ${t("study").toLowerCase()}`,
        f.get("rating") ? `${t("rating").split(" (")[0]} : ${f.get("rating")}/10` : "", f.get("wins") ? `✅ ${f.get("wins")}` : "", f.get("next_focus") ? `🎯 ${f.get("next_focus")}` : ""].filter(Boolean).join("\n");
      try { await navigator.clipboard.writeText(txt); } catch {}
      $("#rsaved").textContent = t("copied");
    });
  },
  mentoring() {
    $$("[data-approve]").forEach((b) => b.onclick = async () => { await db.saveMentoring({ id: b.dataset.approve, status: "validated" }); route(); });
  },
  coaching() {
    $$("[data-ex]").forEach((c) => c.onchange = () => db.setExercise(c.dataset.ex, c.checked));
  },
};

function heatmap(entries, p) {
  const days = new Set(entries.map((e) => e.day));
  const start = new Date(); start.setDate(start.getDate() - 7 * 8 - ((start.getDay() + 6) % 7));
  const cells = [];
  for (let i = 0; i < 7 * 9; i++) { const d = new Date(start); d.setDate(start.getDate() + i); const k = iso(d); if (k > today()) break; cells.push(`<i class="${days.has(k) ? "on" : isAway(p, k) ? "away" : ""}" title="${fmtDay(k)}"></i>`); }
  return `<div class="heat">${cells.join("")}</div>`;
}

function coachingRow(c, extra = "") {
  return `<a class="card row-link" href="#/c/${c.id}"><span class="date">${fmtDay(c.day)}</span><b>${esc(c.title)}<small>${esc(c.module || "")}</small></b><span class="muted">${extra || esc(c.coach || "")}</span></a>`;
}

/* ---------- coaching: every past session (replay + summary), quizzes, retry deck ---------- */
const TEAM_ORDER = ["Academy", "Challenger", "Master", "Supreme"];
const myTeamLabel = () => TEAMS.find((x) => x.id === ME.team_id)?.label;

/* Summaries are plain markdown: "## Heading", "- bullet", "[34]" = minute in the replay. */
function mdLite(s) {
  let html = "", inList = false;
  const inline = (x) => esc(x).replace(/^\[(\d+)\]\s*/, (_, m) => `<span class="min">${m} min</span> `);
  for (const raw of String(s || "").split("\n")) {
    const l = raw.trim();
    if (l.startsWith("- ")) { if (!inList) { html += "<ul>"; inList = true; } html += `<li>${inline(l.slice(2))}</li>`; continue; }
    if (inList) { html += "</ul>"; inList = false; }
    if (l.startsWith("## ")) html += `<h4>${esc(l.slice(3))}</h4>`;
    else if (l) html += `<p>${inline(l)}</p>`;
  }
  return html + (inList ? "</ul>" : "");
}

function replayRow(c, attended) {
  return `<div class="card replay" data-go="#/c/${c.id}">
    <span class="date">${fmtDay(c.day)}${c.starts_at ? `<small>${hhmm(c.starts_at)}</small>` : ""}</span>
    <b>${esc(c.title)}<small>${[c.coach, c.team_label, c.duration].filter(Boolean).map(esc).join(" · ")}${c.kind && c.kind !== "Coaching" ? " · " + esc(c.kind) : ""}</small></b>
    <span class="acts">${attended ? `<span class="tag ok">${t("attended")}</span>` : ""}${c.summary ? `<a class="btn btn-sm btn-ghost-red" href="#/c/${c.id}">${t("summary")}</a>` : ""}${c.replay_url ? `<a class="btn btn-sm btn-red" href="${esc(c.replay_url)}" target="_blank" rel="noopener">▶ ${t("watch")}</a>` : ""}</span>
  </div>`;
}

async function viewCoaching() {
  const [cs, att, qz] = await Promise.all([db.coachings(), db.attendance(ME.id), db.quizzes()]);
  const q = Object.fromEntries(new URLSearchParams(location.hash.split("?")[1] || ""));
  // A player lands on his own team's sessions; "All" is one tap away.
  if (q.team === undefined && has(ME, "player") && cs.some((c) => c.team_label === myTeamLabel())) q.team = myTeamLabel();
  const teams = TEAM_ORDER.filter((x) => cs.some((c) => c.team_label === x));
  const coaches = [...new Set(cs.map((c) => c.coach).filter(Boolean))].sort();
  const match = (c) => (!q.team || c.team_label === q.team) && (!q.coach || c.coach === q.coach)
    && (!q.q || [c.title, c.themes, c.coach, c.summary].join(" ").toLowerCase().includes(q.q.toLowerCase()));
  const found = cs.filter(match);
  const byMonth = {};
  found.forEach((c) => (byMonth[c.day.slice(0, 7)] ||= []).push(c));
  const link = (k, v) => { const p = new URLSearchParams({ ...q, [k]: v }); ["q", "coach"].forEach((x) => !p.get(x) && p.delete(x)); return "#/coaching?" + p; };
  $("#main").innerHTML = `
    ${head(t("coaching"), t("coachingsTitle"), t("coachingsSub"))}
    ${qz.length ? `<details class="card quizbox"><summary><b>${t("quizzes")}</b> <span class="muted small">${qz.length}</span> <a class="btn btn-sm btn-ghost-red" href="#/review">${t("review")}</a></summary>
      <div class="list">${qz.map((x) => `<a class="card row-link" href="#/quiz/${x.id}"><span class="date">${esc(x.module || "")}</span><b>${esc(x.title)}</b>${x.status === "draft" ? `<span class="tag warn">${t("pendingApproval")}</span>` : `<span class="tag ok">${t("live")}</span>`}</a>`).join("")}</div></details>` : ""}
    <div class="finder card">
      <input type="search" id="cq" placeholder="${t("searchCoaching")}" value="${esc(q.q || "")}">
      <div class="filters">
        <div class="chips">${[["", t("all")], ...teams.map((x) => [x, x])].map(([v, l]) => `<a class="tagchip ${(q.team || "") === v ? "on" : ""}" href="${link("team", v)}">${esc(l)}</a>`).join("")}</div>
        <select id="ccoach"><option value="">${t("allCoaches")}</option>${coaches.map((x) => `<option ${q.coach === x ? "selected" : ""}>${esc(x)}</option>`).join("")}</select>
      </div>
      <p class="muted small">${found.length} ${t("sessionsN")}</p>
    </div>
    ${Object.entries(byMonth).map(([m, l]) => `<p class="sub">${fmtMonth(m)}</p><div class="list">${l.map((c) => replayRow(c, att.includes(c.id))).join("")}</div>`).join("") || empty(t("noCoaching"))}`;
  const go = (k, v) => (location.hash = link(k, v));
  $("#cq").addEventListener("keydown", (e) => { if (e.key === "Enter") go("q", e.target.value.trim()); });
  $("#ccoach").onchange = (e) => go("coach", e.target.value);
}

async function viewCoachingOne(id) {
  const [cs, ex, done, qz] = await Promise.all([db.coachings(), db.exercises(), db.exerciseDone(ME.id), db.quizzes()]);
  const c = cs.find((x) => String(x.id) === id);
  if (!c) { $("#main").innerHTML = empty(t("notFound")); return; }
  const mine = ex.filter((e) => e.coaching_id === c.id), quiz = qz.find((q) => q.coaching_id === c.id);
  const meta = [fmtDay(c.day) + (c.starts_at ? " · " + hhmm(c.starts_at) : ""), c.coach, c.team_label, c.duration].filter(Boolean).map(esc).join(" · ");
  $("#main").innerHTML = `
    <a class="back" href="#/coaching">← ${t("coaching")}</a>
    <section class="hello"><p class="eyebrow">${meta}</p><h1 class="h-long">${esc(c.title)}</h1>
      ${c.themes ? `<div class="chips static">${c.themes.split("·").map((x) => `<span class="tagchip">${esc(x.trim())}</span>`).join("")}</div>` : ""}</section>
    <div class="grid two">
      <div class="card summary"><div class="card-head"><h3>${t("summary")}</h3></div>
        ${c.summary ? mdLite(c.summary) : `<p class="muted">${t("summarySoon")}</p>`}
        ${(c.notes || []).length ? `<ul>${c.notes.map((n) => `<li>${esc(n)}</li>`).join("")}</ul>` : ""}</div>
      <div class="stack">
        <div class="card watch"><div class="card-head"><h3>${t("replay")}</h3></div>
          ${c.replay_url ? `<a class="btn btn-red btn-big" href="${esc(c.replay_url)}" target="_blank" rel="noopener">▶ ${t("watchReplay")}</a><p class="muted small">${t("opensZoom")}</p>` : `<p class="muted">—</p>`}
          ${c.slides_url ? ` <a class="btn btn-ghost-red" href="${esc(c.slides_url)}" target="_blank" rel="noopener">${t("slides")}</a>` : ""}</div>
        ${mine.length ? `<div class="card"><div class="card-head"><h3>${t("exercises")}</h3></div>${mine.map((e) => `<label class="check"><input type="checkbox" data-ex="${e.id}" ${done.includes(e.id) ? "checked" : ""}><span><b>${esc(e.title)}</b><small>${esc(e.detail || "")}</small></span></label>`).join("")}</div>` : ""}
        ${quiz ? `<a class="card cta" href="#/quiz/${quiz.id}"><b>${t("startQuiz")}</b><span>${esc(quiz.title)}</span></a>` : ""}
      </div>
    </div>`;
  $$("[data-ex]").forEach((x) => x.onchange = () => db.setExercise(x.dataset.ex, x.checked));
}

function runQuiz(questions, title, back, quiz) {
  let i = 0, right = 0;
  const canApprove = quiz && quiz.status === "draft" && (isAdmin() || quiz.teams.some((x) => (ME.coaches || []).includes(x)));
  const spot = (s) => s && Object.keys(s).length ? `<div class="spot-box">${["positions", "stacks_bb", "board", "line"].filter((k) => s[k]).map((k) => `<span><small>${{ positions: "Positions", stacks_bb: "Stacks", board: "Board", line: "Line" }[k]}</small>${esc(s[k])}${k === "stacks_bb" ? " bb" : ""}</span>`).join("")}</div>` : "";
  const paint = () => {
    if (i >= questions.length) {
      $("#main").innerHTML = `<a class="back" href="${back}">← ${esc(title)}</a>${head(t("results"), `${right} / ${questions.length}`, t("backToDeck"))}<a class="btn btn-red" href="${back}">${t("finish")}</a>`;
      return;
    }
    const q = questions[i];
    $("#main").innerHTML = `
      <a class="back" href="${back}">← ${esc(title)}</a>
      <section class="hello"><p class="eyebrow">${esc(title)} · ${i + 1}/${questions.length}</p><h1 class="h-long">${esc(q.q)}</h1></section>
      ${canApprove ? `<p class="notice" id="qnotice">${t("pendingApproval")} <button class="btn btn-sm btn-red" id="qapprove">${t("approveQuiz")}</button></p>` : ""}
      ${spot(q.spot)}
      <div class="choices">${q.choices.map((c, k) => `<button class="choice" data-k="${k}">${esc(c)}</button>`).join("")}</div>
      <div id="qres"></div>`;
    $("#qapprove")?.addEventListener("click", async () => { await db.approveQuiz(quiz.id); quiz.status = "live"; $("#qnotice").remove(); });
    $$(".choice").forEach((b) => b.onclick = () => {
      const k = +b.dataset.k, ok = k === q.answer;
      $$(".choice").forEach((x) => { x.disabled = true; if (+x.dataset.k === q.answer) x.classList.add("right"); });
      if (ok) right++; else b.classList.add("wrong");
      if (has(ME, "player")) db.answer(q.id, ok).catch(console.error);
      $("#qres").innerHTML = `<div class="card result ${ok ? "ok" : "ko"}"><b>${ok ? t("correct") : t("wrong")}</b><p><span class="sub">${t("why")}</span>${esc(q.why || "")}</p>
        <p>${q.replay_url ? `<a href="${esc(q.replay_url)}" target="_blank" rel="noopener">${t("watchReplay")}</a>` : ""}${q.situation_id ? ` <a href="#/s/${esc(q.situation_id)}">${t("conclusion")} →</a>` : ""}</p>
        <button class="btn btn-red" id="qnext">${i + 1 < questions.length ? t("next") : t("finish")}</button></div>`;
      $("#qnext").onclick = () => { i++; paint(); };
    });
  };
  paint();
}

async function viewQuiz(id) {
  const qz = (await db.quizzes()).find((q) => q.id === id);
  if (!qz) { $("#main").innerHTML = empty(t("notFound")); return; }
  runQuiz(await db.questions(id), qz.title, "#/coaching", qz);
}

async function viewReview() {
  const [deck, qs] = await Promise.all([db.deck(ME.id), db.questions()]);
  const due = deck.filter((d) => d.due <= today()).map((d) => qs.find((q) => q.id === d.question_id)).filter(Boolean);
  if (!due.length) { $("#main").innerHTML = `<a class="back" href="#/coaching">← ${t("coaching")}</a>${head(t("review"), t("noReview"), t("backToDeck"))}`; return; }
  runQuiz(due, t("review"), "#/coaching");
}

/* ---------- strategies: every agreed sizing and frequency, as a tree ----------
   Tree: pot type (Preflop, SRP, 3-bet pot, 4-bet pot) > positions (BTN vs BB) > street > the cards.
   Hash: #/library?b=SRP&m=BTN vs BB&st=flop  (b = branch, m = matchup, st = street, q = search, vs = reg/fish) */
const POT_ORDER = ["Preflop", "SRP", "3BP", "4BP", "limp", "—"];
const potLabel = (b) => ({ SRP: t("potSRP"), "3BP": t("pot3BP"), "4BP": t("pot4BP"), limp: t("potLimp"), "—": t("potOther") }[b] || b);
const branchOf = (s) => (s.street === "preflop" ? "Preflop" : s.pot || "—");
const matchupOf = (s) => `${s.hero_pos || "?"} vs ${s.villain_pos || "?"}`;
const STREETS = ["preflop", "flop", "turn", "river"];

async function viewLibrary() {
  const sits = await db.situations();
  const live = sits.filter((s) => s.status === "live"), drafts = sits.filter((s) => s.status === "draft");
  const q = Object.fromEntries(new URLSearchParams(location.hash.split("?")[1] || ""));
  const href = (o) => "#/library" + (Object.keys(o).length ? "?" + new URLSearchParams(o) : "");
  const tree = {};
  live.forEach((s) => (((tree[branchOf(s)] ||= {})[matchupOf(s)] ||= {})[s.street || "flop"] ||= []).push(s));
  const count = (o) => Array.isArray(o) ? o.length : Object.values(o).reduce((n, x) => n + count(x), 0);
  const branches = POT_ORDER.filter((b) => tree[b]).concat(Object.keys(tree).filter((b) => !POT_ORDER.includes(b)));
  const byCount = (o) => Object.keys(o).sort((a, b) => count(o[b]) - count(o[a]));
  const vsOk = (s) => !q.vs || s.villain_type === q.vs || s.villain_type === "any";

  let right;
  if (q.q) {
    const words = q.q.toLowerCase();
    const found = live.filter((s) => vsOk(s) && [s.title, s.line, s.conclusion, s.board, s.hero_pos, s.villain_pos, s.sizing].join(" ").toLowerCase().includes(words));
    right = `<p class="crumbs"><a href="${href({})}">${t("library")}</a> › “${esc(q.q)}” · ${found.length}</p>${found.map(sitCard).join("") || empty(t("noSituation"))}`;
  } else if (!q.b || !tree[q.b]) {
    right = `<div class="grid branches">${branches.map((b) => `<a class="card branch" href="${href({ b })}"><b>${esc(potLabel(b))}</b><span>${count(tree[b])} ${t("cardsN")} · ${Object.keys(tree[b]).length} ${t("spotsN")}</span></a>`).join("") || empty(t("noSituation"))}</div>`;
  } else if (!q.m || !tree[q.b][q.m]) {
    const ms = byCount(tree[q.b]);
    right = `<p class="crumbs"><a href="${href({})}">${t("library")}</a> › ${esc(potLabel(q.b))}</p>
      <div class="grid branches">${ms.map((m) => `<a class="card branch" href="${href({ b: q.b, m })}"><b>${esc(m)}</b><span>${STREETS.filter((st) => tree[q.b][m][st]).map((st) => `${t("st_" + st)} ${tree[q.b][m][st].length}`).join(" · ")}</span></a>`).join("")}</div>`;
  } else {
    const node = tree[q.b][q.m], sts = STREETS.filter((st) => node[st]), st = node[q.st] ? q.st : sts[0];
    const list = (node[st] || []).filter(vsOk);
    right = `<p class="crumbs"><a href="${href({})}">${t("library")}</a> › <a href="${href({ b: q.b })}">${esc(potLabel(q.b))}</a> › ${esc(q.m)}</p>
      <div class="chips">${sts.map((x) => `<a class="tagchip ${x === st ? "on" : ""}" href="${href({ b: q.b, m: q.m, st: x })}">${t("st_" + x)} <small>${node[x].length}</small></a>`).join("")}</div>
      <div class="stack">${list.map(sitCard).join("") || empty(t("noSituation"))}</div>`;
  }

  $("#main").innerHTML = `
    ${head(t("library"), t("stratTitle"), t("libSub"))}
    <div class="finder card">
      <input type="search" id="lq" placeholder="${t("search")}" value="${esc(q.q || "")}">
      <div class="filters"><select data-f="vs"><option value="">${t("allVs")}</option>${["reg", "fish"].map((v) => `<option ${q.vs === v ? "selected" : ""}>${v}</option>`).join("")}</select></div>
    </div>
    <div class="grid lib">
      <nav class="card tree"><div class="card-head"><h3>${t("map")}</h3><span class="muted small">${live.length}</span></div>
        ${branches.map((b) => `<details ${q.b === b ? "open" : ""}><summary><a href="${href({ b })}">${esc(potLabel(b))}</a> <small>${count(tree[b])}</small></summary>
          ${byCount(tree[b]).map((m) => `<a class="${q.b === b && q.m === m ? "on" : ""}" href="${href({ b, m })}">${esc(m)} <small>${count(tree[b][m])}</small></a>`).join("")}</details>`).join("") || `<p class="muted">—</p>`}
      </nav>
      <div class="stack">${right}</div>
    </div>
    ${drafts.length && isStaff() ? `<h2 class="h-sec">${t("toReviewLib")} <small class="muted">${drafts.length}</small></h2><details class="card"><summary>${t("showDrafts")}</summary><div class="stack">${drafts.map(sitCard).join("")}</div></details>` : ""}
    <p><a class="btn btn-ghost-red" href="#/submit">${t("submit")}</a></p>
    <h2 class="h-sec">${t("onboarding")} · ${t("tools")}</h2>
    <div class="grid menu">
      <a class="card menu-item" href="https://app.gtowizard.com" target="_blank" rel="noopener"><b>GTO Wizard</b><span>Solver, trainer</span></a>
      <a class="card menu-item" href="#/replayer"><b>RTS Replayer</b><span>Hand histories</span></a>
    </div>`;
  const go = () => {
    const p = { ...q }; delete p.q;
    const v = $("#lq").value.trim(); if (v) { p.q = v; delete p.b; delete p.m; delete p.st; }
    $$("[data-f]").forEach((s) => { if (s.value) p[s.dataset.f] = s.value; else delete p[s.dataset.f]; });
    location.hash = href(p);
  };
  $$("[data-f]").forEach((s) => s.onchange = go);
  $("#lq").addEventListener("keydown", (e) => { if (e.key === "Enter") go(); });
}

function sitCard(s) {
  const fields = [["Pot", s.pot], ["Stacks", s.stacks_bb ? s.stacks_bb + " bb" : null], ["Board", s.board], ["vs", s.villain_type !== "any" ? s.villain_type : null]].filter(([, v]) => v);
  return `<a class="card sit" href="#/s/${esc(s.id)}">
    <div class="card-head"><h3>${esc(s.title)}</h3>${s.status === "draft" ? `<span class="tag warn">${t("draft")}</span>` : `<span class="tag">${esc(s.street || "")}</span>`}</div>
    <p class="line">${esc(s.line || "")}</p>
    <div class="answer"><b>${esc(s.action || "")}</b>${s.sizing ? `<span>${esc(s.sizing)}</span>` : ""}${s.frequency ? `<span>${esc(s.frequency)}</span>` : ""}</div>
    <p class="muted small">${fields.map(([k, v]) => `${k} ${esc(v)}`).join(" · ")}</p></a>`;
}

async function viewSituation(id) {
  const [sits, subjects, qs] = await Promise.all([db.situations(), db.subjects(), db.questions()]);
  const s = sits.find((x) => x.id === id);
  if (!s) { $("#main").innerHTML = empty(t("notFound")); return; }
  const subj = subjects.find((x) => x.id === s.subject_id);
  const canPublish = s.status === "draft" && (isAdmin() || subj?.coach_id === ME.id);
  const practice = qs.filter((q) => q.situation_id === s.id);
  $("#main").innerHTML = `
    <a class="back" href="#/library">← ${t("library")}</a>
    <section class="hello"><p class="eyebrow">${esc([s.pot, s.street, subj?.label].filter(Boolean).join(" · "))}</p><h1 class="h-long">${esc(s.title)}</h1></section>
    <div class="grid two">
      <div class="card conclusion">
        <div class="card-head"><h3>${t("conclusion")}</h3>${s.status === "draft" ? `<span class="tag warn">${t("draft")}</span>` : ""}</div>
        ${s.status === "draft" && s.review_note ? `<p class="notice">${t("toReviewLib")} : ${esc(s.review_note)}</p>` : ""}
        <div class="spot-box">${[["Positions", `${s.hero_pos || "?"} vs ${s.villain_pos || "?"}`], ["Stacks", s.stacks_bb ? s.stacks_bb + " bb" : null], ["Board", s.board], ["Line", s.line], ["vs", s.villain_type]].filter(([, v]) => v).map(([k, v]) => `<span><small>${k}</small>${esc(v)}</span>`).join("")}</div>
        <div class="answer big"><b>${esc(s.action || "")}</b>${s.sizing ? `<span>${esc(s.sizing)}</span>` : ""}${s.frequency ? `<span>${esc(s.frequency)}</span>` : ""}</div>
        <p>${esc(s.conclusion)}</p>
        ${s.why ? `<p class="muted"><span class="sub">${t("why")}</span>${esc(s.why)}</p>` : ""}
        ${canPublish ? `<button class="btn btn-red" id="publish">${t("publish")}</button>` : ""}
      </div>
      <div class="stack">
        <div class="card"><div class="card-head"><h3>${t("source")}</h3></div>
          <p>${esc(s.source_title || "—")}${s.source_ts ? ` · ${esc(s.source_ts)}` : ""}</p>
          ${s.replay_url ? `<a class="btn btn-sm btn-ghost-red" href="${esc(s.replay_url)}" target="_blank" rel="noopener">${t("watchReplay")}</a>` : ""}</div>
        ${practice.length ? `<div class="card"><div class="card-head"><h3>${t("practice")}</h3></div><button class="btn btn-red" id="practice">${t("startQuiz")} (${practice.length})</button></div>` : ""}
      </div>
    </div>`;
  $("#publish")?.addEventListener("click", async () => { await db.publishSituation(s.id); route(); });
  $("#practice")?.addEventListener("click", () => runQuiz(practice, s.title, "#/s/" + s.id));
}

async function viewSubmit() {
  $("#main").innerHTML = `
    <a class="back" href="#/library">← ${t("library")}</a>
    ${head(t("library"), t("submit"), t("submitSub"))}
    <form class="card journal-form" id="sform">
      <label>Title<input name="title" required placeholder="BTN vs CO open, 3-bet vs fish"></label>
      <div class="row3">
        <label>Pot<select name="pot"><option>SRP</option><option>3BP</option><option>4BP</option><option>limp</option></select></label>
        <label>Hero<input name="hero_pos" placeholder="BTN"></label>
        <label>Villain<input name="villain_pos" placeholder="CO"></label>
      </div>
      <div class="row3">
        <label>Street<select name="street"><option>preflop</option><option>flop</option><option>turn</option><option>river</option></select></label>
        <label>vs<select name="villain_type"><option>any</option><option>reg</option><option>fish</option></select></label>
        <label>Stacks (bb)<input name="stacks_bb" type="number" value="100"></label>
      </div>
      <label>Board<input name="board" placeholder="K72r"></label>
      <label>Line<input name="line" placeholder="CO opens 3 bb, BTN 3-bets 10 bb"></label>
      <div class="row3">
        <label>Action<input name="action" placeholder="3-bet"></label>
        <label>Sizing<input name="sizing" placeholder="10 bb"></label>
        <label>Frequency<input name="frequency" placeholder="70%"></label>
      </div>
      <label class="ta">${t("conclusion")}<textarea name="conclusion" rows="3" required></textarea></label>
      <label class="ta">${t("why")}<textarea name="why" rows="2"></textarea></label>
      <button class="btn btn-red" type="submit">${t("submit")}</button><p class="saved" id="ssaved"></p>
    </form>`;
  $("#sform").onsubmit = async (ev) => {
    ev.preventDefault();
    const f = Object.fromEntries(new FormData(ev.target));
    f.stacks_bb = +f.stacks_bb || null;
    f.id = "sub-" + Date.now().toString(36);
    f.teams = ME.team === "elite" ? ["elite"] : ["academy", "elite"];
    try { await db.submitSituation(f); $("#ssaved").textContent = t("saved"); setTimeout(() => (location.hash = "#/library"), 700); }
    catch (err) { $("#ssaved").textContent = t("error") + " : " + err.message; }
  };
}

/* ---------- calendar: one shared Google Calendar per team ---------- */
/* In-app events first (coaching, mentor call, study session, peer review). Peer review: private (tagged players) or open to chosen teams. */
async function viewCalendar() {
  const ids = [...new Set([ME.team_id, ...(ME.coaches || []).flatMap((s) => TEAMS.filter((x) => x.side === s).map((x) => x.id))].filter(Boolean))];
  const cals = TEAMS.filter((x) => ids.includes(x.id) && x.calendar_id);
  const [events, dir] = await Promise.all([db.events(new Date(Date.now() - 3 * 36e5).toISOString(), addDays(45) + "T23:59"), directory()]);
  const joins = await db.joins(events.map((e) => e.id));
  const who = (id) => nm(dir.find((d) => d.id === id) || person(id));
  const kinds = ["review", "study", "mentoring", "other"].concat(isStaff() ? ["coaching"] : []);
  const byDay = {};
  events.forEach((e) => (byDay[e.starts_at.slice(0, 10)] ||= []).push(e));
  $("#main").innerHTML = `${head(t("calendar"), t("calendar"), t("calSub2"))}
    <div class="grid two">
      <div class="stack">${Object.entries(byDay).map(([d, l]) => `<p class="sub">${d === today() ? t("today") : fmtDay(d)}</p>${l.map((e) => {
        const mine = e.created_by === ME.id, joined = joins.some((j) => j.event_id === e.id && j.player_id === ME.id), n = joins.filter((j) => j.event_id === e.id).length;
        return `<article class="card ev k-${e.kind}"><div class="card-head"><h3>${KIND_ICON[e.kind]} ${esc(e.title)}</h3><span class="tag">${hhmm(e.starts_at)} · ${e.minutes} min</span></div>
          <p class="muted small">${t("kind_" + e.kind)} · ${e.open ? `${t("openTo")} ${e.teams.length ? e.teams.map((x) => esc(TEAMS.find((y) => y.id === x)?.label || x)).join(", ") : t("allTeams")}` : t("private")}${mine ? "" : " · " + t("by") + " " + who(e.created_by)}</p>
          ${e.invitees.length ? `<p class="small">${t("with")} ${e.invitees.map(who).join(", ")}</p>` : ""}${n ? `<p class="small">${n} ${t("joined")}</p>` : ""}
          <p>${e.link ? `<a class="btn btn-sm btn-red" href="${esc(e.link)}" target="_blank" rel="noopener">${t("join")} ↗</a> ` : ""}${e.open && !mine && has(ME, "player") ? `<button class="btn btn-sm btn-ghost-red" data-join="${e.id}" data-v="${joined ? "" : "1"}">${joined ? t("leave") : t("imIn")}</button> ` : ""}${mine || isAdmin() ? `<button class="btn btn-sm" data-del="${e.id}">${t("del")}</button>` : ""}</p></article>`;
      }).join("")}`).join("") || empty(t("noEvents"))}</div>
      <form class="card" id="evform"><div class="card-head"><h3>${t("planSomething")}</h3></div>
        <label>${t("type")}<select name="kind">${kinds.map((k) => `<option value="${k}">${KIND_ICON[k]} ${t("kind_" + k)}</option>`).join("")}</select></label>
        <label>${t("titleL")}<input name="title" required placeholder="${t("titlePh")}"></label>
        <div class="row3"><label>${t("date")}<input type="date" name="date" required value="${today()}"></label><label>${t("time")}<input type="time" name="time" required value="16:00"></label>
          <label>${t("minutes")}<input type="number" name="minutes" value="60" step="15" min="15"></label></div>
        <label>${t("link")}<input name="link" type="url" placeholder="https://zoom.us/j/..."></label>
        <div id="who"><p class="lbl">${t("whoSees")}</p>
          <div class="seg"><label><input type="radio" name="vis" value="private" checked>${t("private")}</label><label><input type="radio" name="vis" value="open">${t("openSlot")}</label></div>
          <div id="vis-private"><input id="tagq" placeholder="${t("tagPlayers")}"><div class="chips pick">${dir.filter((d) => d.id !== ME.id).map((d) => `<label class="tagchip" data-name="${esc(d.name.toLowerCase())}"><input type="checkbox" name="inv" value="${d.id}" hidden>${nm(d)} <small>${esc(TEAMS.find((x) => x.id === d.team_id)?.label || "")}</small></label>`).join("")}</div></div>
          <div id="vis-open" hidden><p class="muted small">${t("openWho")}</p><div class="chips">${TEAMS.map((x) => `<label class="tagchip"><input type="checkbox" name="teams" value="${x.id}" hidden>${esc(x.label)}</label>`).join("")}</div></div></div>
        <button class="btn btn-red">${t("addEvent")}</button><p class="saved" id="evsaved"></p></form>
    </div>
    ${cals.map((c) => `<div class="card cal"><div class="card-head"><h3>${esc(c.label)} · Google</h3><a class="btn btn-sm btn-red" target="_blank" rel="noopener" href="https://calendar.google.com/calendar/r?cid=${encodeURIComponent(c.calendar_id)}">${t("subscribe")}</a></div>
      <iframe title="${esc(c.label)}" src="https://calendar.google.com/calendar/embed?src=${encodeURIComponent(c.calendar_id)}&mode=AGENDA&ctz=Europe%2FLondon&showTitle=0&showPrint=0&showTabs=0"></iframe></div>`).join("")}`;
  const f = $("#evform");
  const vis = () => { const v = f.vis.value; $("#vis-private").hidden = v !== "private"; $("#vis-open").hidden = v !== "open"; };
  $$("[name=vis]", f).forEach((r) => r.onchange = vis);
  $$(".tagchip input", f).forEach((c) => c.onchange = () => c.parentElement.classList.toggle("on", c.checked));
  $("#tagq").oninput = (e) => $$(".pick .tagchip", f).forEach((l) => { l.hidden = !l.dataset.name.includes(e.target.value.toLowerCase()); });
  f.onsubmit = async (ev) => {
    ev.preventDefault(); const d = new FormData(f);
    const open = d.get("vis") === "open";
    try {
      await db.saveEvent({ kind: d.get("kind"), title: d.get("title").trim(), starts_at: new Date(`${d.get("date")}T${d.get("time")}`).toISOString(), minutes: +d.get("minutes") || 60,
        link: d.get("link").trim() || null, open, teams: open ? d.getAll("teams") : [], invitees: open ? [] : d.getAll("inv") });
      route();
    } catch (err) { $("#evsaved").textContent = t("error") + " : " + err.message; }
  };
  $$("[data-join]").forEach((b) => b.onclick = async () => {
    await db.join(b.dataset.join, !!b.dataset.v);
    if (b.dataset.v && events.find((e) => e.id === b.dataset.join)?.kind === "review") location.hash = "#/hq?go=review"; else route();
  });
  $$("[data-del]").forEach((b) => b.onclick = async () => { if (confirm(t("removeEvent"))) { await db.dropEvent(b.dataset.del); route(); } });
}

/* ---------- my account: contract + accountability (off the home page) ---------- */
async function viewAccount() {
  $("#main").innerHTML = `${head(t("account"), t("account"))}
    <div class="grid menu">
      <a class="card menu-item" href="#/p/${ME.id}/money"><b>${t("money")}</b><span>${t("profit")} · ${t("cutOwed")}</span></a>
      <a class="card menu-item" href="#/p/${ME.id}/contract"><b>${t("contract")}</b><span>PDF</span></a>
      <a class="card menu-item" href="#/p/${ME.id}/overview"><b>${t("mypage")}</b><span>${t("objectives")} · ${t("report")}</span></a>
    </div>
    <div class="card"><div class="card-head"><h3>${t("yourColor")}</h3><a class="small-link" href="#/hero">${t("charLink")} →</a></div>${swatches(ME.accent)}</div>
    ${has(ME, "player") ? awayCard() : ""}`;
  bindAway(); bindSwatches();
}

/* ---------- staff: team dashboard ---------- */
async function viewTeam() {
  const players = VISIBLE.filter((p) => p.id !== ME.id && has(p, "player") && p.active !== false && coachesPlayer(p));
  const [all, qz, qs] = await Promise.all([db.journalAll(daysAgo(400)), db.quizzes(), db.questions()]);
  const goalsBy = Object.fromEntries(await Promise.all(players.map(async (p) => [p.id, (await db.goals(p.id)).find((g) => g.label === monthStart())])));
  const ansBy = Object.fromEntries(await Promise.all(players.map(async (p) => [p.id, await db.answers(p.id)])));
  const quizOf = Object.fromEntries(qs.map((q) => [q.id, q.quiz_id]));
  const groups = {};
  players.forEach((p) => (groups[teamOf(p).label || p.team] ||= []).push(p));
  const rows = (l) => l.map((p) => {
    p._goal = goalsBy[p.id];
    const s = stats(all.filter((e) => e.player_id === p.id), p);
    const answered = new Set(ansBy[p.id].map((a) => quizOf[a.question_id]));
    const quizBehind = qz.filter((q) => q.status === "live" && q.teams.includes(p.team) && !answered.has(q.id)).length;
    const d = dot(s, p);
    return { d, html: `<tr data-go="#/p/${p.id}/overview">
      <td><span class="dot ${d}"></span></td>
      <td><b>${nm(p)}</b><small>${esc(p.stakes || "")}</small></td>
      <td>${fmtNum(s.hands)}<small>/ ${fmtNum(s.handsTarget)}</small>${bar(s.hands, s.handsTarget, d === "red" ? "bad" : d === "yellow" ? "warn" : "")}</td>
      <td>${fmtH(s.play + s.study)}</td>
      <td>${s.streak} ${t("days")}</td>
      <td><span class="tag ${isAway(p, today()) ? "" : !s.last || s.last < daysAgo(2) ? "warn" : "ok"}">${isAway(p, today()) ? t("onHoliday") : s.last ? (s.last === today() ? t("today") : fmtDay(s.last)) : t("never")}</span></td>
      <td>${quizBehind ? `<span class="tag warn">${quizBehind}</span>` : "—"}</td></tr>` };
  });
  const order = { red: 0, yellow: 1, green: 2, grey: 3 };
  $("#main").innerHTML = `${head(t("team"), t("team"), t("teamSub"))}
    ${Object.entries(groups).map(([g, l]) => { const r = rows(l).sort((a, b) => order[a.d] - order[b.d]); return `<div class="card table-card"><div class="card-head"><h3>${esc(g)}</h3><span class="counts"><span class="dot red"></span>${r.filter((x) => x.d === "red").length} <span class="dot yellow"></span>${r.filter((x) => x.d === "yellow").length} <span class="dot green"></span>${r.filter((x) => x.d === "green").length}</span></div>
      <table><thead><tr><th></th><th>${t("player")}</th><th>${t("handsMonth")}</th><th>${t("hoursMonth")}</th><th>${t("streak")}</th><th>${t("lastJournal")}</th><th>${t("quizDue")}</th></tr></thead><tbody>${r.map((x) => x.html).join("")}</tbody></table></div>`; }).join("") || empty("—")}`;
}

/* ---------- ops: people ---------- */
async function viewAdmin() {
  if (!isOps()) { $("#main").innerHTML = empty(t("notFound")); return; }
  const people = await db.people();
  const mentors = people.filter((p) => has(p, "mentor") || has(p, "admin"));
  const ROLES = ["player", "mentor", "coach", "manager", "ops", "admin"];
  const form = (p = {}) => `<form class="card admin-form" data-id="${p.id || ""}">
    <div class="row3"><label>${t("name")}<input name="name" required value="${esc(p.name || "")}" class="sensitive"></label>
      <label>${t("email")}<input name="email" type="email" required value="${esc(p.email || "")}" class="sensitive"></label>
      <label>${t("teamCol")}<select name="team_id"><option value="">Staff</option>${TEAMS.map((x) => `<option value="${x.id}" ${p.team_id === x.id ? "selected" : ""}>${x.label}</option>`).join("")}</select></label></div>
    <div class="row3"><label>${t("mentor")}<select name="mentor_id"><option value="">—</option>${mentors.map((m) => `<option value="${m.id}" ${p.mentor_id === m.id ? "selected" : ""}>${nm(m)}</option>`).join("")}</select></label>
      <label>Coach<span class="checks">${["academy", "elite"].map((s) => `<label><input type="checkbox" name="coaches" value="${s}" ${(p.coaches || []).includes(s) ? "checked" : ""}>${sideLabel(s)}</label>`).join("")}</span></label>
      <label>Manager<span class="checks">${["academy", "elite"].map((s) => `<label><input type="checkbox" name="manages" value="${s}" ${(p.manages || []).includes(s) ? "checked" : ""}>${sideLabel(s)}</label>`).join("")}</span></label></div>
    <div class="row3"><label>${t("stakesL")}<input name="stakes" value="${esc(p.stakes || "")}" placeholder="NL200"></label>
      <label>${t("rtsSince")}<input name="rts_since" type="number" min="2022" max="2040" value="${p.rts_since || ""}" placeholder="2025"></label></div>
    <p class="lbl">${t("roles")}</p><span class="checks">${ROLES.map((r) => `<label><input type="checkbox" name="roles" value="${r}" ${(p.roles || ["player"]).includes(r) ? "checked" : ""}>${r}</label>`).join("")}</span>
    <div><button class="btn btn-sm btn-red" type="submit">${t("save")}</button>
    ${p.id ? `<button class="btn btn-sm btn-ghost-red" type="button" data-toggle="${p.active === false ? "on" : "off"}">${p.active === false ? t("restore") : t("remove")}</button>` : ""}</div></form>`;
  $("#main").innerHTML = `${head(t("admin"), t("admin"), t("adminSub"))}
    <details class="add"><summary class="btn btn-red">${t("add")}</summary>${form()}</details>
    <div class="card table-card"><table><thead><tr><th>${t("name")}</th><th>${t("teamCol")}</th><th>${t("roles")}</th><th>${t("mentor")}</th><th>${t("active")}</th></tr></thead>
    <tbody>${people.map((p) => `<tr data-edit="${p.id}" class="${p.active === false ? "off" : ""}"><td><b>${nm(p)}</b><small class="sensitive">${esc(p.email)}</small></td><td>${esc(p.team_id ? teamOf(p).label : "Staff")}</td><td>${esc((p.roles || []).join(", "))}</td><td>${nm(people.find((x) => x.id === p.mentor_id))}</td><td>${p.active === false ? "—" : "✓"}</td></tr>
      <tr class="edit-row" id="edit-${p.id}" hidden><td colspan="5">${form(p)}</td></tr>`).join("")}</tbody></table></div>`;
  $$("[data-edit]").forEach((tr) => tr.onclick = () => { const r = $("#edit-" + tr.dataset.edit); r.hidden = !r.hidden; });
  $$(".admin-form").forEach((f) => {
    f.onsubmit = async (ev) => {
      ev.preventDefault(); const fd = new FormData(f);
      const team = TEAMS.find((x) => x.id === fd.get("team_id"));
      const p = { name: fd.get("name").trim(), email: fd.get("email").trim().toLowerCase(), team_id: team?.id || null, team: team?.side || "staff",
        mentor_id: fd.get("mentor_id") || null, stakes: fd.get("stakes").trim() || null, rts_since: +fd.get("rts_since") || null, roles: fd.getAll("roles"), coaches: fd.getAll("coaches"), manages: fd.getAll("manages") };
      if (f.dataset.id) p.id = f.dataset.id;
      try { await db.saveProfile(p); VISIBLE = await db.people(); route(); } catch (err) { alert(t("error") + " : " + err.message); }
    };
    $("[data-toggle]", f)?.addEventListener("click", async (ev) => { await db.saveProfile({ id: f.dataset.id, active: ev.target.dataset.toggle === "on" }); VISIBLE = await db.people(); route(); });
  });
}

/* ---------- direction: CEO page ---------- */
async function viewCeo() {
  if (!isAdmin()) { $("#main").innerHTML = empty(t("notFound")); return; }
  const players = VISIBLE.filter((p) => has(p, "player") && p.active !== false);
  const all = await db.journalAll(monthStart());
  const fin = (await Promise.all(players.map((p) => db.finances(p.id)))).flat();
  const cut = fin.reduce((a, x) => a + Number(x.cut || 0), 0), paid = fin.reduce((a, x) => a + Number(x.paid || 0), 0);
  const per = {}, behind = [];
  players.forEach((p) => {
    const s = stats(all.filter((e) => e.player_id === p.id), p);
    const g = (per[teamOf(p).label] ||= { n: 0, hands: 0, target: 0, hours: 0, red: 0 });
    g.n++; g.hands += s.hands; g.target += s.handsTarget; g.hours += s.play + s.study;
    if (dot(s, p) === "red") { g.red++; behind.push(p); }
  });
  $("#main").innerHTML = `${head(t("ceo"), t("ceo"), t("ceoSub"))}
    <div class="grid kpis">
      ${kpi(t("cutTotal"), `${eur(cut)} <small>/ ${eur(paid)}</small>`, `<em>${t("sample")}</em>`)}
      ${kpi(t("handsMonth"), fmtNum(Object.values(per).reduce((a, g) => a + g.hands, 0)))}
      ${kpi(t("behindList"), `${behind.length} <small>/ ${players.length} ${t("players")}</small>`)}
    </div>
    <div class="card table-card"><table><thead><tr><th>${t("teamCol")}</th><th>${t("players")}</th><th>${t("handsMonth")}</th><th>${t("hoursMonth")}</th><th><span class="dot red"></span></th></tr></thead>
      <tbody>${Object.entries(per).map(([k, g]) => `<tr><td><b>${esc(k)}</b></td><td>${g.n}</td><td>${fmtNum(g.hands)}<small>/ ${fmtNum(g.target * new Date().getDate() / daysInMonth())} ${t("pace")}</small>${bar(g.hands, g.target)}</td><td>${fmtH(g.hours)}</td><td>${g.red}</td></tr>`).join("")}</tbody></table></div>
    <div class="card"><div class="card-head"><h3>${t("behindList")}</h3></div><div class="chips static">${behind.map((p) => `<a class="tagchip" href="#/p/${p.id}/overview">${nm(p)}</a>`).join("") || "—"}</div></div>`;
}

/* ---------- login ---------- */
function viewLogin(msg = "") {
  document.body.classList.add("is-login");
  const [w1, ...rest] = t("loginTitle").split(" ");
  $("#app").innerHTML = `<main class="login">
    <img src="img/logo.svg" alt="RTS" class="login-logo">
    <h1>${w1} <em>${rest.join(" ")}</em></h1>
    <p class="muted">${t("loginSub")}</p>
    <form id="lform"><input type="email" name="email" required placeholder="you@email.com" autocomplete="email"><button class="btn btn-red">${t("sendLink")}</button></form>
    <p class="saved" id="lmsg">${esc(msg)}</p>
    <button class="chip" id="llang">${LANG === "en" ? "FR" : "EN"}</button></main>`;
  $("#llang").onclick = () => { setLang(LANG === "en" ? "fr" : "en"); viewLogin(msg); };
  $("#lform").onsubmit = async (e) => {
    e.preventDefault();
    $("#lmsg").textContent = "…";
    try { await db.signIn(new FormData(e.target).get("email")); $("#lmsg").textContent = t("linkSent"); }
    catch (err) { $("#lmsg").textContent = err.message; }
  };
}

/* ---------- shell + router ---------- */
/* Player view: Alexis (admin) sees the app exactly as a player of his own team sees it, with his own data. */
let REAL = null;
const pv = {
  get on() { try { return localStorage.getItem("rts-pv") === "on"; } catch { return false; } },
  set(v) { try { localStorage.setItem("rts-pv", v ? "on" : "off"); } catch {} },
};
const asPlayer = (p) => ({ ...p, roles: ["player"], coaches: [], manages: [], team_id: p.team_id || "supreme", team: p.team === "staff" ? "elite" : p.team });

function shell() {
  document.body.classList.remove("is-login");
  const demo = db.mode === "demo";
  const links = [["", "home"], ["hq", "hq"]].concat(has(ME, "player") ? [["journal", "journal"], ["study", "study"]] : []).concat([["coaching", "coaching"], ["library", "library"], ["replayer", "replayer"], ["calendar", "calendar"]])
    .concat(isStaff() ? [["team", "team"]] : []).concat(isOps() ? [["admin", "admin"]] : []).concat(isAdmin() ? [["ceo", "ceo"]] : []).concat([["account", "account"]]);
  $("#app").innerHTML = `
    <header class="top"><div class="wrap">
      <a href="#/" class="logo"><img src="img/logo.svg" alt="RTS"></a>
      <nav class="links">${links.map(([k, l]) => `<a href="#/${k}" data-nav="${k}">${t(l)}</a>`).join("")}</nav>
      <div class="tools">
        ${demo ? `<select id="asuser" title="View as">${db.users.map((u) => `<option value="${u.id}" ${u.id === ME.id ? "selected" : ""}>${esc(u.label)}</option>`).join("")}</select>` : ""}
        ${isAdmin(REAL) ? `<button id="pvb" class="chip ${pv.on ? "on" : ""}" title="${t("playerViewSub")}">👤 ${t("playerView")}</button>` : ""}
        <button id="lang" class="chip">${LANG === "en" ? "FR" : "EN"}</button>
        <button id="camb" class="chip ${cam.on ? "on" : ""}" title="${t("camera")}">● ${t("camera")}</button>
        ${demo ? `<span class="chip">${t("demo")}</span>` : `<button id="out" class="chip">${t("logout")}</button>`}
      </div>
    </div></header>
    <main id="main" class="wrap"></main>`;
  $("#camb").onclick = () => { cam.set(!cam.on); shell(); route(); };
  $("#pvb")?.addEventListener("click", () => { pv.set(!pv.on); ME = pv.on ? asPlayer(REAL) : REAL; location.hash = "#/"; shell(); route(); });
  $("#lang").onclick = () => { setLang(LANG === "en" ? "fr" : "en"); db.setLang(LANG).catch(() => {}); shell(); route(); };
  $("#asuser")?.addEventListener("change", (e) => { db.setUser(e.target.value); boot(); });
  $("#out")?.addEventListener("click", async () => { await db.signOut(); boot(); });
  $("#app").onclick = (e) => { if (e.target.closest("input,select,button,textarea,a,label,form")) return; const tr = e.target.closest("[data-go]"); if (tr) location.hash = tr.dataset.go; };
}

async function route() {
  if (!ME) return;
  clearInterval(timerTick);
  document.onpaste = null;
  if (!location.hash.startsWith("#/hq")) { HQ?.leave(); HQ = null; }
  const [path] = (location.hash || "#/").split("?");
  const [, a = "", b, c] = path.split("/");
  const navKey = a === "p" ? "" : ["c", "quiz", "review"].includes(a) ? "coaching" : ["s", "submit"].includes(a) ? "library" : a === "recall" ? "study" : ["session", "hands", "hero"].includes(a) ? "" : a === "notes" ? "" : a;
  $$("[data-nav]").forEach((l) => l.classList.toggle("on", l.dataset.nav === navKey));
  $("#main").innerHTML = `<p class="muted loading">${t("loading")}</p>`;
  const views = { "": viewHome, journal: viewJournal, p: () => viewPlayer(b, c), coaching: viewCoaching, c: () => viewCoachingOne(b), quiz: () => viewQuiz(b),
    review: viewReview, library: viewLibrary, s: () => viewSituation(b), submit: viewSubmit, calendar: viewCalendar, team: viewTeam, admin: viewAdmin, ceo: viewCeo,
    session: viewSession, hands: viewHands, replayer: () => viewReplayer(b), study: viewStudy, recall: viewRecall, account: viewAccount, hero: viewHero, hq: viewHQ, notes: viewNotes };
  try { await (views[a] || viewHome)(); }
  catch (err) { $("#main").innerHTML = `<p class="card">${t("error")} : ${esc(err.message)}</p>`; console.error(err); }
  window.scrollTo(0, 0);
}

async function boot() {
  cam.set(cam.on);
  setLang(LANG);
  const s = await db.session();
  if (!s) return viewLogin();
  REAL = ME = await db.me();
  if (!ME) { await db.signOut(); return viewLogin(t("notRegistered")); }
  if (isAdmin(REAL) && pv.on) ME = asPlayer(REAL);
  applyAccent(REAL.accent);
  let saved = null; try { saved = localStorage.getItem("rts-lang"); } catch {}
  if (ME.lang && !saved) setLang(ME.lang);
  [VISIBLE, TEAMS] = await Promise.all([db.people(), db.teams()]);
  shell(); route();
}

window.addEventListener("hashchange", route);
db.onAuth(boot);
boot();

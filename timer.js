/* Session engine (2026-11-03). Sessions run as a countdown the player sets ("I play 2 h"), on every page, not only in the cockpit:
   at zero the session pauses and asks to relaunch; with no answer in 5 min it ends at the planned time, so hours stay right
   (AD started a chrono and forgot to stop it). Every hour of play Alexis pops up to say take a break.
   The bottom dock (start buttons, tools) and the pop out bar read the same state. */
const SES = { s: null, before: 0, target: 35, beat: null, asking: false, breakN: 0 };
const GRACE_MS = 5 * 6e4;
const DURATIONS = [30, 60, 90, 120, 180, 240];
const fmtMin = (m) => (m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? " " + String(m % 60).padStart(2, "0") : ""}` : `${m} min`);
const leftMs = (s) => (s?.planned_min ? s.planned_min * 6e4 - elapsed(s) : null);
// What the clocks show: time left on a countdown, time played on an old open-ended session.
const sesClock = (s) => (s.planned_min ? clock(Math.max(0, leftMs(s))) : clock(elapsed(s)));
const timeUp = (s) => !!s?.planned_min && leftMs(s) <= 0;

async function sesLoad() {
  if (!ME || !has(ME, "player")) { SES.s = null; paintDock(); return; }
  const [s, mine, goals] = await Promise.all([db.openSession(ME.id).catch(() => null), db.journal(ME.id, weekStart()).catch(() => []), db.goals(ME.id).catch(() => [])]);
  setGoals(ME, goals);
  SES.s = s; SES.before = weekHours(mine); SES.target = weekTarget(ME);
  SES.breakN = s ? Math.floor(elapsed(s) / 36e5) : 0;
  if (s) await sesSettle();
  if (!SES.beat) SES.beat = setInterval(sesBeat, 1000);
  paintDock();
}

/* Zero reached: freeze the clock at the planned end. Still no answer 5 min later: end the session at the planned time. */
async function sesSettle() {
  const s = SES.s; if (!s || !timeUp(s)) return;
  if (!s.paused_at) {
    const at = new Date(new Date(s.started_at).getTime() + Number(s.paused_ms || 0) + s.planned_min * 6e4).toISOString();
    Object.assign(s, (await db.saveSession({ id: s.id, paused_at: at })) || { paused_at: at });
  }
  if (Date.now() - new Date(s.paused_at) > GRACE_MS) return sesEnd(null, true);
  askRelaunch();
}

function sesBeat() {
  const s = SES.s; if (!s) return;
  $$("[data-left]").forEach((el) => (el.textContent = sesClock(s)));
  if (!s.paused_at && timeUp(s)) { sesSettle(); return; }
  if (s.paused_at && timeUp(s) && Date.now() - new Date(s.paused_at) > GRACE_MS) { sesEnd(null, true); return; }
  const n = Math.floor(elapsed(s) / 36e5);
  if (!s.paused_at && n > SES.breakN) { SES.breakN = n; showBreak(); }
  const g = $("#tu-grace"); if (g && s.paused_at) g.textContent = clock(GRACE_MS - (Date.now() - new Date(s.paused_at)));
}

async function sesStart(kind, minutes) {
  // Grind: the cockpit pops out over the tables at once. The window is asked for before any await, while the click still counts.
  const pop = kind === "grind" ? popRequest() : null;
  try { localStorage.setItem("rts-dur-" + kind, minutes); } catch {}
  SES.s = await db.startSession(kind, minutes); SES.breakN = 0;
  hqMove(kind === "grind" ? "grind" : "study");
  if (!SES.beat) SES.beat = setInterval(sesBeat, 1000);
  paintDock();
  location.hash = "#/session"; route();
  if (pop) openPop(pop);
}

async function sesPause() {
  const s = SES.s; if (!s || timeUp(s)) return;
  const x = s.paused_at ? { paused_ms: Number(s.paused_ms || 0) + (Date.now() - new Date(s.paused_at)), paused_at: null } : { paused_at: new Date().toISOString() };
  const notes = $("#nform [name=notes]")?.value;
  Object.assign(s, x); await db.saveSession({ id: s.id, ...x, ...(notes != null ? { notes } : {}) });
  paintDock(); if (location.hash.startsWith("#/session")) route();
}

/* Relaunch after zero: the plan grows by `add` minutes from where the clock stopped. */
async function sesRelaunch(add) {
  const s = SES.s; if (!s) return;
  const played = Math.ceil(elapsed(s) / 6e4);
  const x = { planned_min: played + add, paused_ms: Number(s.paused_ms || 0) + (s.paused_at ? Date.now() - new Date(s.paused_at) : 0), paused_at: null };
  Object.assign(s, x); await db.saveSession({ id: s.id, ...x });
  SES.asking = false; $("#timeup")?.close(); paintDock();
  if (location.hash.startsWith("#/session")) route();
}

/* End: hours go straight into the session's day in the journal (hands are counted once, in the journal). auto = ended by the grace rule. */
async function sesEnd(notes, auto = false) {
  const s = SES.s; if (!s) return;
  SES.s = null; SES.asking = false;
  const ms = s.planned_min ? Math.min(elapsed(s), s.planned_min * 6e4) : elapsed(s);
  const minutes = Math.max(1, Math.round(ms / 60000));
  const endAt = auto && s.paused_at ? s.paused_at : new Date().toISOString();
  await db.saveSession({ id: s.id, ended_at: endAt, minutes, ...(notes != null ? { notes } : {}),
    ...(s.paused_at ? { paused_ms: Number(s.paused_ms || 0) + (new Date(endAt) - new Date(s.paused_at)), paused_at: null } : {}) });
  const day = s.started_at.slice(0, 10), e = (await db.journal(ME.id, day)).find((x) => x.day === day) || { player_id: ME.id, day };
  const k = s.kind === "grind" ? "play_h" : "study_h";
  await db.saveJournal({ ...e, [k]: Math.round((Number(e[k] || 0) + minutes / 60) * 100) / 100 });
  hqMove("lobby"); $("#timeup")?.close(); closePop(); paintDock();
  if (!auto || location.hash.startsWith("#/session")) { location.hash = `#/log?d=${day}`; }
}

/* ---------- dialogs: pick a duration, time is up, take a break ---------- */
function askDuration(kind, ask = "") { // ask: the HQ room's "are you sure" question, shown as the title
  const dl = $("#durd"); if (!dl) return;
  let last = 120; try { last = +localStorage.getItem("rts-dur-" + kind) || (kind === "grind" ? 120 : 60); } catch {}
  dl.innerHTML = `<form method="dialog" class="dur"><div class="card-head"><h3>${KIND_ICON[kind]} ${ask || t(kind === "grind" ? "durGrind" : "durStudy")}</h3><button class="x" value="cancel">×</button></div>
    <p class="muted small">${ask ? t(kind === "grind" ? "durGrind" : "durStudy") + " " : ""}${t("durSub")}</p>
    <div class="dur-grid">${DURATIONS.map((m) => `<button class="dur-b ${m === last ? "on" : ""}" value="${m}">${fmtMin(m)}</button>`).join("")}</div>
    <label class="dur-own">${t("durOwn")} <input type="number" min="5" max="600" step="5" name="own" placeholder="${last}"> min <button class="btn btn-sm btn-red" value="own">${t("durGo")}</button></label></form>`;
  dl.onclose = () => {
    const v = dl.returnValue; if (!v || v === "cancel") return;
    const m = v === "own" ? +dl.querySelector("[name=own]").value || last : +v;
    sesStart(kind, Math.max(5, Math.min(600, m)));
  };
  dl.showModal();
}

function askRelaunch() {
  const dl = $("#timeup"), s = SES.s; if (!dl || !s || SES.asking) return;
  SES.asking = true;
  dl.innerHTML = `<form method="dialog"><div class="card-head"><h3>⏰ ${t("tuTitle")}</h3></div>
    <p>${t("tuSub").replace("{t}", fmtMin(s.planned_min))}</p>
    <div class="dur-grid">${[30, 60, 120].map((m) => `<button class="dur-b" value="${m}">+ ${fmtMin(m)}</button>`).join("")}</div>
    <p class="row-btns"><button class="btn btn-red" value="end">■ ${t("endGo")}</button></p>
    <p class="muted small">${t("tuAuto")} <b id="tu-grace"></b></p></form>`;
  dl.onclose = () => { SES.asking = false; const v = dl.returnValue; if (v === "end") sesEnd($("#nform [name=notes]")?.value ?? null); else if (+v) sesRelaunch(+v); };
  dl.oncancel = (e) => e.preventDefault(); // Esc never dismisses it: an answer or the 5 min rule ends it
  dl.showModal();
  popPaint();
}

/* Every hour of a running session: Alexis pops up for 20 s (cockpit/page and pop out bar). */
function showBreak() {
  const el = $("#brk"); if (!el) return;
  el.innerHTML = `<video src="img/alexis-break.mp4" poster="img/alexis-break.jpg" muted autoplay loop playsinline></video><div><b>${t("brkTitle")}</b><span>${t("brkSub")}</span></div><button class="x" data-brkx>×</button>`;
  el.hidden = false; $("[data-brkx]", el).onclick = () => (el.hidden = true);
  clearTimeout(el._t); el._t = setTimeout(() => (el.hidden = true), 20000);
  if (POP.win && !POP.win.closed) {
    const b = POP.win.document.getElementById("brk"); if (b) { b.hidden = false; clearTimeout(b._t); b._t = POP.win.setTimeout(() => (b.hidden = true), 20000); }
  }
}

/* ---------- bottom dock: every page ---------- */
const DISCORD_URL = "https://discord.com/channels/1447955931882192999";
const ICONS = {
  grind: `<svg viewBox="0 0 24 24"><path d="M12 2c3.5 4.2 8 6.6 8 10.6A4.4 4.4 0 0 1 12.8 16l1.2 5h-4l1.2-5A4.4 4.4 0 0 1 4 12.6C4 8.6 8.5 6.2 12 2z"/></svg>`,
  study: `<svg viewBox="0 0 24 24"><path d="M3 5.5C5.8 4.4 9 4.5 12 6.3c3-1.8 6.2-1.9 9-.8v13c-2.8-1.1-6-1-9 .8-3-1.8-6.2-1.9-9-.8z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 6.3v13" stroke="currentColor" stroke-width="1.8"/></svg>`,
  gto: `<svg viewBox="0 0 24 24"><path d="M12 2 6 16h12z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M3 18.5c5.5-2 12.5-2 18 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="13" cy="10" r="1.3"/></svg>`,
  replay: `<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M10 8.5v7l5.5-3.5z"/></svg>`,
  discord: `<svg viewBox="0 0 24 24"><path d="M19.3 5.4A16 16 0 0 0 15.4 4l-.5 1a14.6 14.6 0 0 0-5.8 0L8.6 4a16 16 0 0 0-3.9 1.4C2.2 9.1 1.5 12.7 1.9 16.3a16 16 0 0 0 4.8 2.5l1-1.6c-.6-.2-1.1-.5-1.6-.8l.4-.3a11.3 11.3 0 0 0 11 0l.4.3-1.6.8 1 1.6a16 16 0 0 0 4.8-2.5c.5-4.2-.8-7.8-2.8-10.9zM8.7 14.2c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2zm6.6 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2z"/></svg>`,
  feedback: `<svg viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
  sizing: `<svg viewBox="0 0 24 24"><path d="M6 18 18 6" stroke="currentColor" stroke-width="2"/><circle cx="7" cy="7" r="2.4" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17" cy="17" r="2.4" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>`,
};
function dockHtml() {
  return `<nav class="dockbar" id="dock" aria-label="Dock"><div class="dk-ses" id="dkses"></div>
    <i class="dk-sep"></i>
    <a class="dk" href="https://app.gtowizard.com" target="_blank" rel="noopener" data-tip="GTO Wizard">${ICONS.gto}</a>
    <a class="dk" href="#/replayer" data-tip="Replayer">${ICONS.replay}</a>
    <a class="dk" href="${DISCORD_URL}" target="_blank" rel="noopener" data-tip="Discord">${ICONS.discord}</a>
    ${isAdmin() ? `<a class="dk" href="#/sizing" data-tip="MonPetitSizing">${ICONS.sizing}</a>` : ""}
    <i class="dk-sep"></i>
    <button class="dk" id="fbb" data-tip="${t("fbBtn")}">${ICONS.feedback}</button></nav>
    <dialog id="durd" class="card"></dialog><dialog id="timeup" class="card timeup"></dialog>
    <div id="brk" class="brk" hidden></div>`;
}
function paintDock() {
  const box = $("#dkses"); if (!box) return;
  const s = SES.s;
  if (!has(ME, "player")) { box.innerHTML = ""; box.nextElementSibling?.setAttribute("hidden", ""); return; }
  box.innerHTML = s
    ? `<a class="dk-live ${s.kind} ${s.paused_at ? "paused" : ""}" href="#/session" data-tip="${t("backCockpit")}">${s.kind === "grind" ? ICONS.grind : ICONS.study}<b data-left>${sesClock(s)}</b>${s.planned_min ? `<small>${t("left")}</small>` : ""}</a>
       <button class="dk dk-mini" data-dkpause data-tip="${s.paused_at ? t("resume") : t("pause")}">${s.paused_at ? "▶" : "⏸"}</button>`
    : `<button class="dk dk-go grind" data-dkgo="grind" data-tip="${t("startPoker")}">${ICONS.grind}</button><button class="dk dk-go study" data-dkgo="study" data-tip="${t("startStudyS")}">${ICONS.study}</button>`;
  $$("[data-dkgo]", box).forEach((b) => b.onclick = () => askDuration(b.dataset.dkgo));
  $("[data-dkpause]", box)?.addEventListener("click", sesPause);
}

/* Mentoring cockpit (Alexis 2026-11-19, version A "Cockpit"): one screen with the year, quarter, month and week goals side by side,
   the mentor's comment on each, emoji cheers on achieved goals, the last mentoring call and last month's review.
   An achieved goal can be shared to the team feed (news kind "goal"). Built for the player first; the mentor reuses mcHtml(p) later.
   Also here: the "add hours I didn't log" window used on Grind and Études. */
Object.assign(STRINGS.en, {
  mcTitle: "My mentoring", mcYear: "Year", mcQuarter: "Quarter", mcMonth: "Month", mcWeek: "Week", mcAdd: "Add a goal", mcGoalsPh: "One goal per line",
  mcLastCall: "Last mentoring", mcNoCall: "No mentoring call yet.", mcLastMonth: "Last month", mcMyReview: "My review", mcMentorFb: "Mentor's feedback",
  mcNoReview: "No review for last month.", mcWins: "Achieved goals", mcNoWins: "Tick a goal when it's done: it shows up here.", mcShare: "Share", mcShared: "Shared",
  mcShareQ: "Share this goal with the team feed?", mcNext: "Next call", mcHistory: "All calls", mcBoard: "Detailed board", mcHours: "Hours", mcHands: "Hands",
  mcOpen: "Open", newsGoal: "reached a goal:", mcHomeT: "Mentoring",
  phBtn: "Add hours", phT: "Add hours you didn't log", phSub: "A day you played or studied without the timer.", phDay: "Day", phH: "Hours", phM: "Minutes",
  phSave: "Add", phNone: "Enter a length.", phDone: "Added", phGrind: "Grind", phStudy: "Study",
  mcGrindH: "Grind", mcStudyH: "Study", mcTargets: "Targets", mcSugg: "suggested", mcIdeas: "Ideas", mcLocked: "Set with your mentor", mcLockQ: "Lock (decided with the player)",
  mcYearHint: "Your year goals are set with your mentor at the start of the year.", mcLockedErr: "Year goals are locked: change them with your mentor.", mcGoals: "Goals",
  mcPrev: "Previous", mcNextP: "Next" });
Object.assign(STRINGS.fr, {
  mcTitle: "Mon mentoring", mcYear: "Année", mcQuarter: "Trimestre", mcMonth: "Mois", mcWeek: "Semaine", mcAdd: "Ajouter un objectif", mcGoalsPh: "Un objectif par ligne",
  mcLastCall: "Dernier mentoring", mcNoCall: "Pas encore de call de mentoring.", mcLastMonth: "Le mois dernier", mcMyReview: "Ma revue", mcMentorFb: "Retour du mentor",
  mcNoReview: "Pas de revue pour le mois dernier.", mcWins: "Objectifs atteints", mcNoWins: "Coche un objectif quand il est atteint : il apparaît ici.", mcShare: "Partager", mcShared: "Partagé",
  mcShareQ: "Partager cet objectif dans le fil de la team ?", mcNext: "Prochain call", mcHistory: "Tous les calls", mcBoard: "Tableau détaillé", mcHours: "Heures", mcHands: "Mains",
  mcOpen: "Ouvrir", newsGoal: "a atteint son objectif :", mcHomeT: "Mentoring",
  phBtn: "Ajouter des heures", phT: "Ajouter des heures non loguées", phSub: "Un jour où tu as joué ou étudié sans le chrono.", phDay: "Jour", phH: "Heures", phM: "Minutes",
  phSave: "Ajouter", phNone: "Indique une durée.", phDone: "Ajouté", phGrind: "Grind", phStudy: "Étude",
  mcGrindH: "Grind", mcStudyH: "Études", mcTargets: "Cibles", mcSugg: "suggéré", mcIdeas: "Idées", mcLocked: "Fixés avec ton mentor", mcLockQ: "Verrouiller (décidé avec le joueur)",
  mcYearHint: "Tes objectifs de l'année se fixent avec ton mentor en début d'année.", mcLockedErr: "Objectifs de l'année verrouillés : à changer avec ton mentor.", mcGoals: "Objectifs",
  mcPrev: "Précédent", mcNextP: "Suivant" });
const MC_IDEAS = {
  fr: { week: ["Revoir 20 mains taguées", "2 blocs d'étude de 90 min", "Stop-loss respecté à chaque session", "1 spot travaillé au solveur"],
        month: ["Revue du mois écrite avant le 3", "Tous les quiz du mois faits", "1 spot présenté à mon mentor", "Assister à tous les coachings"],
        quarter: ["Finir le module du trimestre", "Winrate positif sur le trimestre", "Monter d'une limite si les résultats suivent", "Constituer ma base de 100 mains revues"],
        year: ["Monter de limite", "Jouer X mains sur l'année", "Atteindre X € de gains", "Maîtriser une structure complète (ex. SRP BTN vs BB)"] },
  en: { week: ["Review 20 tagged hands", "2 study blocks of 90 min", "Stop-loss kept every session", "1 spot worked in the solver"],
        month: ["Monthly review written by the 3rd", "All quizzes of the month done", "1 spot presented to my mentor", "Attend every coaching"],
        quarter: ["Finish the quarter's module", "Positive winrate over the quarter", "Move up a limit if results follow", "Build a base of 100 reviewed hands"],
        year: ["Move up a limit", "Play X hands this year", "Reach X € in winnings", "Master one full structure (e.g. SRP BTN vs BB)"] } };

const MC_H = [["year", "mcYear"], ["quarter", "mcQuarter"], ["month", "mcMonth"], ["week", "mcWeek"]];
const MC_CHEERS = ["🎉", "🔥", "👏", "💪"];
const gTxt = (x) => String(x).replace(/^✓ /, ""), gDone = (x) => String(x).startsWith("✓ ");
// Each horizon can be moved back (and one step ahead) with ‹ › to see what was done (Alexis 2026-11-19). Kept while the app is open.
const MC_OFF = { quarter: 0, month: 0, week: 0 };
const mcShift = (k, n) => { const d = today(), y = +d.slice(0, 4), m = +d.slice(5, 7) - 1;
  if (k === "week") return mondayOf(addDays(7 * n, new Date(mondayOf(d) + "T12:00:00")));
  if (k === "month") return iso(new Date(Date.UTC(y, m + n, 1)));
  if (k === "quarter") return qOf(iso(new Date(Date.UTC(y, m + 3 * n, 15))));
  return d.slice(0, 4); };
const mcLabels = (off = {}) => ({ year: today().slice(0, 4), quarter: mcShift("quarter", off.quarter || 0), month: mcShift("month", off.month || 0), week: mcShift("week", off.week || 0) });
// first and last day of a horizon
const mcRange = (k, L) => { if (k === "week") return [L.week, addDays(6, new Date(L.week + "T12:00:00"))];
  if (k === "month") { const [y, m] = L.month.split("-").map(Number); return [L.month, iso(new Date(Date.UTC(y, m, 0)))]; }
  if (k === "quarter") { const ms = qMonths(L.quarter), [y, m] = ms[2].split("-").map(Number); return [ms[0] + "-01", iso(new Date(Date.UTC(y, m, 0)))]; }
  return [L.year + "-01-01", L.year + "-12-31"]; };
// suggested targets, from the team's weekly hours (70 % grind, 30 % study) and monthly hands
const mcSuggest = (p, k) => { const W = weekTarget(p), MH = teamOf(p).month_hands || 50000, f = { week: 1, month: 4.3, quarter: 13 }[k];
  if (!f) return null; const hf = { week: 1 / 4.3, month: 1, quarter: 3 }[k];
  return { play_h_target: Math.round(W * 0.7 * f), study_h_target: Math.round(W * 0.3 * f), hands_target: Math.round((MH * hf) / 1000) * 1000 }; };
const mcLab = (k, L) => (k === "year" ? L.year : k === "quarter" ? fmtQ(L.quarter) : k === "month" ? fmtMonth(L.month) : `${t("weekN")} ${isoWeekN(L.week)}`);

async function mcLoad(p, { light = false, off = {} } = {}) {
  const L = mcLabels(off);
  const [mg, wq, calls, reps, jr, evs] = await Promise.all([db.goals(p.id).catch(() => []), db.weekGoals(p.id).catch(() => []),
    light ? [] : db.mentorings(p.id).catch(() => []), light ? [] : db.reports(p.id).catch(() => []), db.journal(p.id, light ? (L.month < L.week ? L.month : L.week) : daysAgo(400)).catch(() => []),
    db.events(new Date().toISOString(), addDays(45) + "T23:59").catch(() => [])]);
  const all = [...mg, ...wq], G = {};
  MC_H.forEach(([k]) => (G[k] = all.find((g) => g.period === k && g.label === L[k]) || null));
  G.prev = mg.find((g) => g.label === prevMonthStart()) || null;
  return { L, G, all, calls: calls.filter((c) => c.status === "validated"), reps, jr, next: evs.find((e) => e.kind === "mentoring") };
}

/* one goal line: tick (the player), its cheers (anyone else can add one) */
function mcItem(p, k, g, x, i) {
  const own = p.id === ME.id, txt = gTxt(x), ch = (g?.cheers || {})[txt] || {};
  const chips = gDone(x) ? `<span class="mc-cheers">${MC_CHEERS.map((e) => { const l = ch[e] || [], on = l.includes(ME.id);
      if (!l.length && own) return "";
      return `<button type="button" class="mc-ch ${on ? "on" : ""} ${l.length ? "" : "zero"}" data-mcch="${k}|${i}|${e}" ${own ? "disabled" : ""} title="${esc(l.map((u) => nm(person(u) || { name: "?" })).join(", "))}">${e}${l.length ? `<i>${l.length}</i>` : ""}</button>`; }).join("")}</span>` : "";
  return `<div class="mc-it ${gDone(x) ? "done" : ""}"><label><input type="checkbox" data-mctick="${k}|${i}" ${gDone(x) ? "checked" : ""} ${own || coachesPlayer(p) ? "" : "disabled"}><span>${esc(txt)}</span></label>${chips}</div>`;
}

const mcCanEdit = (p) => p.id === ME.id || coachesPlayer(p);
const mcLocked = (k, g, p) => k === "year" && g?.status === "confirmed" && !coachesPlayer(p);
function mcCard(p, k, D) {
  const g = D.G[k], items = g?.items || [], done = items.filter(gDone).length, key = MC_H.find((h) => h[0] === k)[1];
  const mentor = person(p.mentor_id), off = MC_OFF[k] || 0, past = off < 0;
  let extra = "";
  if (k !== "year") { // grind, study and hands in that period, against the targets when there are some
    const [a, b] = mcRange(k, D.L), js = D.jr.filter((e) => e.day >= a && e.day <= b);
    const sum = (f) => js.reduce((x, e) => x + Number(e[f] || 0), 0), play = sum("play_h"), study = sum("study_h"), hands = sum("hands");
    const pT = Number(g?.play_h_target || 0), sT = Number(g?.study_h_target || 0), hdT = Number(g?.hands_target || 0);
    // one compact line each: label, bar, value / target
    const line = (ic, l, v, shown, tg, tShown) => `<span class="mc-n"><span>${ic} ${l}</span><span class="hg-bar">${tg ? `<i style="width:${Math.min(100, (v / tg) * 100)}%"></i>` : ""}</span><b>${shown}${tg ? ` <small>/ ${tShown}</small>` : ""}</b></span>`;
    extra = `<div class="mc-nums">${line("♠", t("mcGrindH"), play, fmtH(play), pT, pT + " h")}${line("📚", t("mcStudyH"), study, fmtH(study), sT, sT + " h")}${line("🃏", t("mcHands"), hands, fmtNum(hands), hdT, fmtNum(hdT))}</div>`;
  }
  const lock = k === "year" && g?.status === "confirmed";
  const arrow = (n, ch, dis) => k === "year" ? `<span class="mc-arr0"></span>` : `<button type="button" class="mc-arr" data-mcnav="${k}|${n}" title="${t(n < 0 ? "mcPrev" : "mcNextP")}" ${dis ? "disabled" : ""}>${ch}</button>`;
  const canEd = mcCanEdit(p) && !past && !mcLocked(k, g, p);
  return `<section class="card mc-h ${past ? "past" : ""}"><div class="mc-hd">${arrow(-1, "‹", false)}<span class="mc-ht"><span class="eyebrow">${t(key)}</span><b>${esc(mcLab(k, D.L))}</b></span>${arrow(1, "›", off >= 1)}
      ${lock ? `<span class="mc-lock" title="${t("mcLocked")}">🔒</span>` : canEd ? `<button type="button" class="mc-ed" data-mced="${k}" title="${t("pgEdit")}">✎</button>` : ""}</div>
    ${extra}
    <div class="mc-items">${items.map((x, i) => mcItem(p, k, g, x, i)).join("") || (canEd ? `<button type="button" class="mc-add" data-mced="${k}">+ ${t("mcAdd")}</button>` : `<p class="muted small">${t("noGoals")}</p>`)}
      ${k === "year" && !lock && p.id === ME.id ? `<p class="muted small mc-hint">${t("mcYearHint")}</p>` : ""}${lock ? `<p class="muted small mc-hint">🔒 ${t("mcLocked")}</p>` : ""}</div>
    ${items.length ? `<div class="mc-prog"><span class="hg-bar"><i style="width:${(done / items.length) * 100}%"></i></span><small>${done}/${items.length}</small></div>` : ""}
    ${g?.mentor_note ? `<p class="mc-note">💬 <b>${mentor ? esc(nm(mentor)) : t("mentor")}</b> ${esc(g.mentor_note)}</p>` : ""}</section>`;
}

function mcHtml(p, D) {
  const own = p.id === ME.id, mentor = person(p.mentor_id), c = D.calls[0], L = D.L;
  const step = (x, i) => `<label class="pg-step ${(c.steps_done || []).includes(i) ? "done" : ""}"><input type="checkbox" data-step="${esc(c.id)}:${i}" ${(c.steps_done || []).includes(i) ? "checked" : ""}><span class="sensitive">${esc(x)}</span></label>`;
  const callCard = `<section class="card mc-b"><div class="card-head"><h3>🤝 ${t("mcLastCall")}</h3>${c ? `<small class="muted">${fmtDay(c.day)}${callBy(c) ? " · " + esc(callBy(c)) : ""}</small>` : ""}</div>
    ${c ? `${(c.conclusions || []).length ? `<ul class="sensitive mc-ul">${c.conclusions.slice(0, 3).map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
      ${(c.next_steps || []).length ? `<p class="sub">${t("nextSteps")}</p>${c.next_steps.slice(0, 4).map(step).join("")}` : ""}` : `<p class="muted small">${t("mcNoCall")}</p>`}
    <a class="small-link mc-more" href="#/progress">${t("mcHistory")} →</a></section>`;
  const r = D.reps.find((x) => x.month === prevMonthStart());
  const pv = D.G.prev, pDone = (pv?.items || []).filter(gDone).length;
  const revCard = `<section class="card mc-b"><div class="card-head"><h3>📅 ${t("mcLastMonth")}</h3><small class="muted">${fmtMonth(prevMonthStart())}${pv?.items?.length ? ` · 🎯 ${pDone}/${pv.items.length}` : ""}</small></div>
    ${r ? `${r.wins || r.struggles ? `<p class="sub">${t("mcMyReview")}${r.rating ? ` · ${r.rating}/10` : ""}</p><p class="sensitive mc-clip">${esc([r.wins, r.struggles].filter(Boolean).join(" · "))}</p>` : ""}
      ${(r.mentor_note || "").trim() ? `<p class="sub">${t("mcMentorFb")}</p><p class="sensitive mc-clip mc-fb">💬 ${esc(r.mentor_note)}</p>` : ""}` : `<p class="muted small">${t("mcNoReview")}</p>`}
    <a class="small-link mc-more" href="#/mentoring?board=1${own ? "" : "&p=" + p.id}">${t("mcBoard")} →</a></section>`;
  const wins = [...MC_H.map(([k]) => [k, D.G[k]]), ["prev", D.G.prev]].flatMap(([k, g]) => (g?.items || []).map((x, i) => [k, g, x, i]).filter(([, , x]) => gDone(x)));
  const winCard = `<section class="card mc-b mc-wins"><div class="card-head"><h3>🏆 ${t("mcWins")}</h3><small class="muted">${wins.length || ""}</small></div>
    <div class="mc-wl">${wins.map(([k, g, x, i]) => { const txt = gTxt(x), ch = (g.cheers || {})[txt] || {}, n = Object.values(ch).reduce((a, l) => a + l.length, 0), sh = (g.shared || []).includes(txt);
      return `<div class="mc-w"><span class="mc-wt"><b>${esc(txt)}</b><small class="muted">${k === "prev" ? fmtMonth(prevMonthStart()) : esc(mcLab(k, L))}${n ? " · " + MC_CHEERS.filter((e) => (ch[e] || []).length).map((e) => e + (ch[e].length > 1 ? ch[e].length : "")).join(" ") : ""}</small></span>
        ${own ? (sh ? `<span class="tag ok">✓ ${t("mcShared")}</span>` : `<button type="button" class="btn btn-sm" data-mcshare="${k}|${i}">📣 ${t("mcShare")}</button>`) : ""}</div>`; }).join("") || `<p class="muted small">${t("mcNoWins")}</p>`}</div></section>`;
  return `<div class="mc">
    <div class="mc-top"><h2>${own ? t("mcTitle") : esc(nm(p))}</h2><span class="muted small">${mentor ? `${t("mentor")} : <b>${esc(nm(mentor))}</b>` : ""}${D.next ? ` · ${t("mcNext")} : <b>${fmtDay(D.next.starts_at.slice(0, 10))} ${hhmm(D.next.starts_at)}</b>` : ""}</span></div>
    <div class="mc-row4">${MC_H.map(([k]) => mcCard(p, k, D)).join("")}</div>
    <div class="mc-row3">${callCard}${revCard}${winCard}</div></div>`;
}

function mcBind(p, D) {
  const key = (s) => { const [k, i] = s.split("|"); const g = k === "prev" ? D.G.prev : D.G[k]; return { k, g, i: +i, period: k === "prev" ? "month" : k, label: k === "prev" ? prevMonthStart() : D.L[k] }; };
  const save = (o, v) => db.saveGoal({ player_id: p.id, period: o.period, label: o.label, status: o.g?.status || "proposed", ...v })
    .catch((err) => hqToast(/year_goals_locked/.test(err.message) ? t("mcLockedErr") : err.message, 6000));
  $$("[data-mcnav]").forEach((b) => b.onclick = () => { const [k, n] = b.dataset.mcnav.split("|"); MC_OFF[k] = Math.min(1, (MC_OFF[k] || 0) + +n); route(); });
  $$("[data-mctick]").forEach((cb) => cb.onchange = async () => { const o = key(cb.dataset.mctick), items = [...(o.g?.items || [])];
    items[o.i] = (cb.checked ? "✓ " : "") + gTxt(items[o.i]); cb.disabled = true; await save(o, { items }); route(); });
  $$("[data-mcch]").forEach((b) => b.onclick = async () => { const [k, i, e] = b.dataset.mcch.split("|"), o = key(k + "|" + i), txt = gTxt(o.g.items[o.i]);
    const cheers = JSON.parse(JSON.stringify(o.g.cheers || {})), l = ((cheers[txt] ||= {})[e] ||= []);
    l.includes(ME.id) ? l.splice(l.indexOf(ME.id), 1) : l.push(ME.id); b.disabled = true; await save(o, { cheers }); route(); });
  $$("[data-mcshare]").forEach((b) => b.onclick = async () => { const o = key(b.dataset.mcshare), txt = gTxt(o.g.items[o.i]);
    if (!confirm(t("mcShareQ"))) return; b.disabled = true;
    try { await db.postNews({ kind: "goal", title: txt, body: o.k === "prev" ? fmtMonth(prevMonthStart()) : mcLab(o.k, D.L) });
      await save(o, { shared: [...(o.g.shared || []), txt] }); hqToast("✓ " + t("mcShared")); } catch (err) { hqToast(err.message, 6000); }
    route(); });
  $$("[data-step]").forEach((cb) => cb.onchange = async () => { const [id, i] = cb.dataset.step.split(":"); cb.disabled = true; await db.tickStep(id, +i, cb.checked); route(); });
  $$("[data-mced]").forEach((b) => b.onclick = () => mcEdit(p, b.dataset.mced, D));
}

/* edit one horizon's goals: one per line, ticks kept for unchanged lines */
function mcEdit(p, k, D) {
  $("#mcd")?.remove();
  const g = D.G[k], old = g?.items || [], sg = mcSuggest(p, k), mentorSide = coachesPlayer(p) && p.id !== ME.id;
  const num = (n, ic, l, step) => { const has = g?.[n] != null && g[n] !== "", v = has ? g[n] : sg[n];
    return `<label class="mc-tg">${ic} ${l}<input type="number" name="${n}" min="0" step="${step}" value="${v}">${has ? "" : `<small>${t("mcSugg")}</small>`}</label>`; };
  const ideas = (MC_IDEAS[LANG] || MC_IDEAS.fr)[k] || [];
  document.body.insertAdjacentHTML("beforeend", `<dialog id="mcd" class="card mc-dlg"><form id="mcf"><div class="card-head"><h3>🎯 ${t(MC_H.find((h) => h[0] === k)[1])} · ${esc(mcLab(k, D.L))}</h3><button class="x" type="button" data-mcx>×</button></div>
    ${sg ? `<p class="sub">${t("mcTargets")}</p><div class="mc-tgs">${num("play_h_target", "♠", t("mcGrindH") + " (h)", 1)}${num("study_h_target", "📚", t("mcStudyH") + " (h)", 1)}${num("hands_target", "🃏", t("mcHands"), 1000)}</div>` : ""}
    <p class="sub">${t("mcGoals")}</p>
    <textarea name="items" rows="5" placeholder="${t("mcGoalsPh")}">${esc(old.map(gTxt).join("\n"))}</textarea>
    <div class="mc-ideas"><small class="muted">💡 ${t("mcIdeas")}</small>${ideas.map((x) => `<button type="button" class="chip" data-mcidea="${esc(x)}">+ ${esc(x)}</button>`).join("")}</div>
    ${k === "year" && mentorSide ? `<label class="check sm"><input type="checkbox" name="lock" ${g?.status === "confirmed" ? "checked" : ""}><span>🔒 ${t("mcLockQ")}</span></label>` : ""}
    <p class="row-btns"><button class="btn btn-red">${t("save")}</button></p></form></dialog>`);
  $$("[data-mcidea]").forEach((b) => b.onclick = () => { const ta = $("#mcf textarea"); ta.value = (ta.value.trim() ? ta.value.trim() + "\n" : "") + b.dataset.mcidea; b.disabled = true; ta.focus(); });
  const d = $("#mcd"); d.showModal(); d.querySelector("textarea").focus();
  $("[data-mcx]", d).onclick = () => d.close();
  d.onclose = () => d.remove();
  $("#mcf").onsubmit = async (ev) => {
    ev.preventDefault();
    const f = ev.target, items = f.items.value.split("\n").map((x) => x.trim()).filter(Boolean).map((x) => (old.includes("✓ " + x) ? "✓ " + x : x));
    const nums = sg ? Object.fromEntries(["play_h_target", "study_h_target", "hands_target"].map((n) => [n, f[n].value === "" ? null : Math.max(0, Math.round(+f[n].value))])) : {};
    // the player's change goes back to the mentor (proposed); the mentor's lock on the year makes it final
    const status = f.lock ? (f.lock.checked ? "confirmed" : "proposed") : mentorSide ? g?.status || "proposed" : "proposed";
    try { await db.saveGoal({ player_id: p.id, period: k, label: D.L[k], status, items, ...nums }); d.close(); route(); }
    catch (err) { hqToast(/year_goals_locked/.test(err.message) ? t("mcLockedErr") : err.message, 6000); }
  };
}

async function viewCockpit(p = ME) {
  const my = RENDER, D = await mcLoad(p, { off: MC_OFF });
  if (my !== RENDER) return;
  $("#main").innerHTML = mcHtml(p, D);
  fitToDock(".mc");
  mcBind(p, D);
}

/* Home: the same four horizons in one small card (Alexis 2026-11-19) */
async function mcHomeHtml() {
  if (!has(ME, "player")) return "";
  const D = await mcLoad(ME, { light: true }).catch(() => null); if (!D) return ""; // home: always the current periods
  const rows = MC_H.map(([k, key]) => { const it = D.G[k]?.items || [], dn = it.filter(gDone).length;
    return `<span class="mh-r"><span>${t(key)}</span><span class="hg-bar"><i style="width:${it.length ? (dn / it.length) * 100 : 0}%"></i></span><b>${it.length ? `${dn}/${it.length}` : "—"}</b></span>`; }).join("");
  const cheers = MC_H.reduce((a, [k]) => a + Object.values(D.G[k]?.cheers || {}).reduce((b, m) => b + Object.values(m).reduce((c, l) => c + l.filter((u) => u !== ME.id).length, 0), 0), 0);
  return `<a class="card mh" href="#/mentoring"><span class="hg-head"><b>🤝 ${t("mcHomeT")}</b><small>${t("mcOpen")} →</small></span>${rows}
    ${D.next || cheers ? `<small class="muted mh-f">${cheers ? `🎉 ${cheers}` : ""}${cheers && D.next ? " · " : ""}${D.next ? `${t("mcNext")} : ${fmtDay(D.next.starts_at.slice(0, 10))} ${hhmm(D.next.starts_at)}` : ""}</small>` : ""}</a>`;
}

/* Add hours played or studied without the timer, on any past day (Alexis 2026-11-19): a session row + the day's journal hours */
function pastHoursDlg(kind = "grind") {
  $("#phd")?.remove();
  const y = iso(new Date(Date.now() - 864e5));
  document.body.insertAdjacentHTML("beforeend", `<dialog id="phd" class="card ph-d"><form id="phf"><div class="card-head"><h3>⏱ ${t("phT")}</h3><button class="x" type="button" data-phx>×</button></div>
    <p class="muted small">${t("phSub")}</p>
    <div class="ph-kind">${[["grind", "♠", "phGrind"], ["study", "📚", "phStudy"]].map(([k, ic, l]) => `<label class="tagchip ${k === kind ? "on" : ""}"><input type="radio" name="kind" value="${k}" ${k === kind ? "checked" : ""} hidden>${ic} ${t(l)}</label>`).join("")}</div>
    <div class="ph-row"><label>${t("phDay")}<input type="date" name="day" value="${y}" max="${today()}" required></label>
      <label>${t("phH")}<input type="number" name="h" min="0" max="16" step="1" value="2"></label><label>${t("phM")}<input type="number" name="m" min="0" max="55" step="5" value="0"></label></div>
    <div class="ph-topic" ${kind === "study" ? "" : "hidden"}>${topicSelect()}</div>
    <p class="row-btns"><button class="btn btn-red">${t("phSave")}</button><span class="saved" id="phmsg"></span></p></form></dialog>`);
  const d = $("#phd"), f = $("#phf"); d.showModal();
  $("[data-phx]", d).onclick = () => d.close(); d.onclose = () => d.remove();
  f.onchange = () => { const k = f.kind.value; $$(".ph-kind .tagchip", f).forEach((l) => l.classList.toggle("on", $("input", l).checked)); $(".ph-topic", f).hidden = k !== "study"; };
  f.onsubmit = async (ev) => {
    ev.preventDefault();
    const min = Math.round((+f.h.value || 0) * 60 + (+f.m.value || 0)), day = f.day.value, k = f.kind.value;
    if (min < 1 || !day || day > today()) { $("#phmsg").textContent = t("phNone"); return; }
    f.querySelector("button.btn-red").disabled = true;
    const st = day === today() ? new Date(Date.now() - min * 6e4) : new Date(day + "T12:00:00");
    const x = await db.addSession({ kind: k, topic: k === "study" ? f.topic?.value || null : null, started_at: st.toISOString(), ended_at: new Date(st.getTime() + min * 6e4).toISOString(), minutes: min, planned_min: null });
    await sesJournalShift(x, min);
    d.close(); hqToast(`✓ ${t("phDone")} · ${fmtH(min / 60)} · ${fmtDay(day)}`); route();
  };
}

// any [data-addh] button anywhere opens the window (Grind, Études)
document.addEventListener("click", (e) => { const b = e.target.closest("[data-addh]"); if (b) pastHoursDlg(b.dataset.addh); });

/* Mentor side, simplified (Alexis 2026-11-19): one screen per player, by month or by quarter (Max and Alexis follow quarterly).
   The period's hours and hands against the targets, the goals, what the player wrote, and the mentor's own notes (autosave,
   the player sees them: month = the monthly report's mentor note, quarter = the quarter goal's mentor note).
   Extras kept: 1on1 calls (Zoom links) and the journal. Communication itself happens on calls and Discord. */
Object.assign(STRINGS.en, { mtMonth: "Month", mtQuarter: "Quarter", mtPlayerRev: "What he wrote", mtMyNotes: "My notes", mtNotesQ: "Quarter notes",
  mtSeen: "The player sees these notes.", mtNoGoalsP: "No goal set for this period.", mtEditGoals: "Edit the goals", mtNoRev: "Nothing written yet.", mtMore: "More" });
Object.assign(STRINGS.fr, { mtMonth: "Mois", mtQuarter: "Trimestre", mtPlayerRev: "Ce qu'il a écrit", mtMyNotes: "Mes notes", mtNotesQ: "Notes du trimestre",
  mtSeen: "Le joueur voit ces notes.", mtNoGoalsP: "Pas d'objectif pour cette période.", mtEditGoals: "Modifier les objectifs", mtNoRev: "Rien d'écrit pour l'instant.", mtMore: "Plus" });
const mtShiftM = (m, n) => iso(new Date(Date.UTC(+m.slice(0, 4), +m.slice(5, 7) - 1 + n, 1)));
const mtShiftQ = (q, n) => qOf(iso(new Date(Date.UTC(+q.slice(0, 4), (+q.slice(-1) - 1) * 3 + 3 * n, 15))));
function mtPanelHtml(p, o) {
  const { per, month, qq, all, gl, wq, reps, href } = o, isQ = per === "q";
  const g = isQ ? wq.find((x) => x.period === "quarter" && x.label === qq) : gl.find((x) => x.label === month);
  const months = isQ ? qMonths(qq).map((m) => m + "-01") : [month];
  const a = months[0], last = months[months.length - 1], b = iso(new Date(Date.UTC(+last.slice(0, 4), +last.slice(5, 7), 0)));
  const ent = all.filter((e) => e.player_id === p.id && e.day >= a && e.day <= b), sum = (k) => ent.reduce((x, e) => x + Number(e[k] || 0), 0);
  const play = sum("play_h"), study = sum("study_h"), hands = sum("hands"), days = new Set(ent.filter((e) => (e.played || "").trim()).map((e) => e.day)).size;
  const tile = (ic, l, v, shown, tg, tShown) => `<div class="card mt-t"><span>${ic} ${l}</span><b>${shown}${tg ? ` <small>/ ${tShown}</small>` : ""}</b>${tg ? `<span class="hg-bar"><i style="width:${Math.min(100, (v / tg) * 100)}%"></i></span>` : ""}</div>`;
  const pT = Number(g?.play_h_target || 0), sT = Number(g?.study_h_target || 0), hT = Number(g?.hands_target || 0);
  const label = isQ ? fmtQ(qq) : fmtMonth(month), prev = isQ ? { qq: mtShiftQ(qq, -1) } : { m: mtShiftM(month, -1) }, next = isQ ? { qq: mtShiftQ(qq, 1) } : { m: mtShiftM(month, 1) };
  const items = g?.items || [], done = items.filter(gDone).length;
  const monthLine = (m) => { const mg = gl.find((x) => x.label === m), it = mg?.items || []; return `<span class="mt-ml"><span>${fmtMonth(m)}</span><span class="hg-bar"><i style="width:${it.length ? (it.filter(gDone).length / it.length) * 100 : 0}%"></i></span><b>${it.length ? `${it.filter(gDone).length}/${it.length}` : "—"}</b></span>`; };
  const goals = `<section class="card mt-c"><div class="card-head"><h3>🎯 ${t("mcGoals")}</h3><small class="muted">${items.length ? `${done}/${items.length}` : ""}</small></div>
    <div class="mt-cb">${items.map((x) => `<p class="mt-gi ${gDone(x) ? "done" : ""}">${gDone(x) ? "☑" : "☐"} ${esc(gTxt(x))}</p>`).join("") || `<p class="muted small">${t("mtNoGoalsP")}</p>`}
    ${isQ ? `<div class="mt-mls">${months.map(monthLine).join("")}</div>` : ""}</div>
    <a class="small-link mt-cl" href="#/mentoring?cp=${p.id}">✎ ${t("mtEditGoals")} →</a></section>`;
  const rOf = (m) => reps.find((r) => r.month === m);
  const rev = isQ ? months.map((m) => { const r = rOf(m); return `<div class="mt-qr"><b>${fmtMonth(m)}${r?.rating ? ` · ${r.rating}/10` : ""}</b>${r && (r.wins || r.struggles) ? `<p class="sensitive mc-clip">${esc([r.wins, r.struggles].filter(Boolean).join(" · "))}</p>` : `<p class="muted small">${t("mtNoRev")}</p>`}</div>`; }).join("")
    : (() => { const r = rOf(month), f = (k, l) => r?.[k] ? `<div class="mt-r"><span>${l}</span><p class="sensitive">${esc(String(r[k]))}</p></div>` : "";
        return [f("rating", t("rating")), f("wins", t("wins")), f("struggles", t("struggles")), f("next_focus", t("nextFocus"))].join("") || `<p class="muted small">${t("mtNoRev")}</p>`; })();
  const note = isQ ? g?.mentor_note || "" : rOf(month)?.mentor_note || "";
  return `<div class="mt-per"><span class="chips mt-sw"><a class="chip ${isQ ? "" : "on"}" href="${href({ per: "", s: "" })}">${t("mtMonth")}</a><a class="chip ${isQ ? "on" : ""}" href="${href({ per: "q", s: "" })}">${t("mtQuarter")}</a></span>
      <span class="mt-pnav"><a class="mc-arr" href="${href(prev)}">‹</a><b>${esc(label)}</b><a class="mc-arr" href="${href(next)}">›</a></span><span></span></div>
    <div class="mt-tiles">${tile("♠", t("mcGrindH"), play, fmtH(play), pT, pT + " h")}${tile("📚", t("mcStudyH"), study, fmtH(study), sT, sT + " h")}${tile("🃏", t("mcHands"), hands, fmtNum(hands), hT, fmtNum(hT))}
      <div class="card mt-t"><span>📓 ${t("journal")}</span><b>${days} <small>${t("days")}</small></b></div></div>
    <div class="mt-cols3">${goals}
      <section class="card mt-c"><div class="card-head"><h3>📝 ${t("mtPlayerRev")}</h3></div><div class="mt-cb">${rev}</div></section>
      <form class="card mt-c mt-notes" id="mtf"><div class="card-head"><h3>✎ ${isQ ? t("mtNotesQ") : t("mtMyNotes")}</h3><small class="saved" id="mtok"></small></div>
        <textarea name="mentor_note" class="sensitive" placeholder="${t("mtNotesPh")}">${esc(note)}</textarea><small class="muted">${t("mtSeen")}</small></form></div>
    <div class="mt-xtra">${["calls", "journal"].map((s) => `<a class="card bd-tile sm" href="${href({ s })}"><span class="bd-ic">${BICON[s]}</span><span class="bd-tx"><b>${esc(bTitle(s))}</b><small>${esc(bSummary(s, {}))}</small></span></a>`).join("")}</div>`;
}
function mtPanelBind(p, o) {
  const { per, month, qq, wq } = o, ta = $("#mtf textarea"); if (!ta) return; let tm = null;
  const save = async () => { $("#mtok").textContent = "…";
    try {
      if (per === "q") { const g = wq.find((x) => x.period === "quarter" && x.label === qq);
        await db.saveGoal({ player_id: p.id, period: "quarter", label: qq, status: g?.status || "proposed", items: g?.items || [], mentor_note: ta.value });
        if (g) g.mentor_note = ta.value; else wq.push({ period: "quarter", label: qq, items: [], mentor_note: ta.value }); }
      else await db.saveReport({ player_id: p.id, month, mentor_note: ta.value });
      $("#mtok").textContent = t("saved"); } catch (err) { $("#mtok").textContent = err.message; } };
  ta.oninput = () => { clearTimeout(tm); $("#mtok").textContent = ""; tm = setTimeout(save, 900); }; // saves while the mentor types
  ta.onblur = () => { if (tm) { clearTimeout(tm); tm = null; save(); } };
}

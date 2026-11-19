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
  phSave: "Add", phNone: "Enter a length.", phDone: "Added", phGrind: "Grind", phStudy: "Study" });
Object.assign(STRINGS.fr, {
  mcTitle: "Mon mentoring", mcYear: "Année", mcQuarter: "Trimestre", mcMonth: "Mois", mcWeek: "Semaine", mcAdd: "Ajouter un objectif", mcGoalsPh: "Un objectif par ligne",
  mcLastCall: "Dernier mentoring", mcNoCall: "Pas encore de call de mentoring.", mcLastMonth: "Le mois dernier", mcMyReview: "Ma revue", mcMentorFb: "Retour du mentor",
  mcNoReview: "Pas de revue pour le mois dernier.", mcWins: "Objectifs atteints", mcNoWins: "Coche un objectif quand il est atteint : il apparaît ici.", mcShare: "Partager", mcShared: "Partagé",
  mcShareQ: "Partager cet objectif dans le fil de la team ?", mcNext: "Prochain call", mcHistory: "Tous les calls", mcBoard: "Tableau détaillé", mcHours: "Heures", mcHands: "Mains",
  mcOpen: "Ouvrir", newsGoal: "a atteint son objectif :", mcHomeT: "Mentoring",
  phBtn: "Ajouter des heures", phT: "Ajouter des heures non loguées", phSub: "Un jour où tu as joué ou étudié sans le chrono.", phDay: "Jour", phH: "Heures", phM: "Minutes",
  phSave: "Ajouter", phNone: "Indique une durée.", phDone: "Ajouté", phGrind: "Grind", phStudy: "Étude" });

const MC_H = [["year", "mcYear"], ["quarter", "mcQuarter"], ["month", "mcMonth"], ["week", "mcWeek"]];
const MC_CHEERS = ["🎉", "🔥", "👏", "💪"];
const gTxt = (x) => String(x).replace(/^✓ /, ""), gDone = (x) => String(x).startsWith("✓ ");
const mcLabels = () => { const d = today(); return { year: d.slice(0, 4), quarter: qOf(d), month: monthStart(), week: mondayOf(d) }; };
const mcLab = (k, L) => (k === "year" ? L.year : k === "quarter" ? fmtQ(L.quarter) : k === "month" ? fmtMonth(L.month) : fmtWeek(L.week));

async function mcLoad(p, { light = false } = {}) {
  const L = mcLabels();
  const [mg, wq, calls, reps, jr, evs] = await Promise.all([db.goals(p.id).catch(() => []), db.weekGoals(p.id).catch(() => []),
    light ? [] : db.mentorings(p.id).catch(() => []), light ? [] : db.reports(p.id).catch(() => []), db.journal(p.id, L.month < L.week ? L.month : L.week).catch(() => []),
    db.events(new Date().toISOString(), addDays(45) + "T23:59").catch(() => [])]);
  const all = [...mg, ...wq], G = {};
  MC_H.forEach(([k]) => (G[k] = all.find((g) => g.period === k && g.label === L[k]) || null));
  G.prev = mg.find((g) => g.label === prevMonthStart()) || null;
  return { L, G, calls: calls.filter((c) => c.status === "validated"), reps, jr, next: evs.find((e) => e.kind === "mentoring") };
}

/* one goal line: tick (the player), its cheers (anyone else can add one) */
function mcItem(p, k, g, x, i) {
  const own = p.id === ME.id, txt = gTxt(x), ch = (g?.cheers || {})[txt] || {};
  const chips = gDone(x) ? `<span class="mc-cheers">${MC_CHEERS.map((e) => { const l = ch[e] || [], on = l.includes(ME.id);
      if (!l.length && own) return "";
      return `<button type="button" class="mc-ch ${on ? "on" : ""} ${l.length ? "" : "zero"}" data-mcch="${k}|${i}|${e}" ${own ? "disabled" : ""} title="${esc(l.map((u) => nm(person(u) || { name: "?" })).join(", "))}">${e}${l.length ? `<i>${l.length}</i>` : ""}</button>`; }).join("")}</span>` : "";
  return `<div class="mc-it ${gDone(x) ? "done" : ""}"><label><input type="checkbox" data-mctick="${k}|${i}" ${gDone(x) ? "checked" : ""} ${own ? "" : "disabled"}><span>${esc(txt)}</span></label>${chips}</div>`;
}

function mcCard(p, k, D) {
  const g = D.G[k], items = g?.items || [], done = items.filter(gDone).length, key = MC_H.find((h) => h[0] === k)[1];
  const mentor = person(p.mentor_id);
  let extra = "";
  if (k === "month" || k === "week") { // hours and hands so far, against the targets when there are some
    const from = k === "month" ? D.L.month : D.L.week, js = D.jr.filter((e) => e.day >= from);
    const sum = (f) => js.reduce((a, e) => a + Number(e[f] || 0), 0), hours = sum("play_h") + sum("study_h"), hands = sum("hands");
    const hT = k === "month" ? (Number(g?.play_h_target || 0) + Number(g?.study_h_target || 0)) || (g?.week_h_target ? Math.round(g.week_h_target * 4.3) : 0)
      : (Number(g?.play_h_target || 0) + Number(g?.study_h_target || 0)) || Number(D.G.month?.week_h_target || 0);
    const hdT = Number(g?.hands_target || 0);
    const line = (ic, l, v, shown, tg, tShown) => `<span class="hg-l"><span>${ic} ${l}</span><b>${shown}${tg ? ` <small>/ ${tShown}</small>` : ""}</b></span>${tg ? `<span class="hg-bar"><i style="width:${Math.min(100, (v / tg) * 100)}%"></i></span>` : ""}`;
    extra = `<div class="mc-nums">${line("⏱", t("mcHours"), hours, fmtH(hours), hT, hT + " h")}${hands || hdT ? line("🃏", t("mcHands"), hands, fmtNum(hands), hdT, fmtNum(hdT)) : ""}</div>`;
  }
  return `<section class="card mc-h"><div class="mc-hd"><span><span class="eyebrow">${t(key)}</span><b>${esc(mcLab(k, D.L))}</b></span>
      ${p.id === ME.id ? `<button type="button" class="mc-ed" data-mced="${k}" title="${t("pgEdit")}">✎</button>` : ""}</div>
    ${extra}
    <div class="mc-items">${items.map((x, i) => mcItem(p, k, g, x, i)).join("") || (p.id === ME.id ? `<button type="button" class="mc-add" data-mced="${k}">+ ${t("mcAdd")}</button>` : `<p class="muted small">${t("noGoals")}</p>`)}</div>
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
  const save = (o, v) => db.saveGoal({ player_id: p.id, period: o.period, label: o.label, status: o.g?.status || "proposed", ...v });
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
  const g = D.G[k], old = g?.items || [];
  document.body.insertAdjacentHTML("beforeend", `<dialog id="mcd" class="card mc-dlg"><form id="mcf"><div class="card-head"><h3>🎯 ${t(MC_H.find((h) => h[0] === k)[1])} · ${esc(mcLab(k, D.L))}</h3><button class="x" type="button" data-mcx>×</button></div>
    <textarea name="items" rows="6" placeholder="${t("mcGoalsPh")}">${esc(old.map(gTxt).join("\n"))}</textarea>
    <p class="row-btns"><button class="btn btn-red">${t("save")}</button></p></form></dialog>`);
  const d = $("#mcd"); d.showModal(); d.querySelector("textarea").focus();
  $("[data-mcx]", d).onclick = () => d.close();
  d.onclose = () => d.remove();
  $("#mcf").onsubmit = async (ev) => {
    ev.preventDefault();
    const items = ev.target.items.value.split("\n").map((x) => x.trim()).filter(Boolean).map((x) => (old.includes("✓ " + x) ? "✓ " + x : x));
    await db.saveGoal({ player_id: p.id, period: k, label: D.L[k], status: g?.status || "proposed", items }); d.close(); route();
  };
}

async function viewCockpit() {
  const my = RENDER, D = await mcLoad(ME);
  if (my !== RENDER) return;
  $("#main").innerHTML = mcHtml(ME, D);
  fitToDock(".mc");
  mcBind(ME, D);
}

/* Home: the same four horizons in one small card (Alexis 2026-11-19) */
async function mcHomeHtml() {
  if (!has(ME, "player")) return "";
  const D = await mcLoad(ME, { light: true }).catch(() => null); if (!D) return "";
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

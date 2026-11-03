/* Logbook, Resources and saved hands (2026-11-03, Alexis: "pas trop de tabs, bien rangé, pas de répétition").
   #/log?d=DAY | ?w=MONDAY | ?m=YYYY-MM | ?q=YYYY-Qn   left: quarters and their months, middle: that period (a month = Week 1 to 5,
   one bubble per day), right: ONE goal card, the one of the period you look at
   #/calls   my calls with mentor and coaches (Resources > Mine)      #/hands   saved hands by title (Resources > Mine) */
Object.assign(STRINGS.en, {
  gtoTip: "Copies the hand and opens GTO Wizard", gtoCopied: "Hand copied. In GTO Wizard: <b>Upload</b> (top right), <b>Cmd+V</b>, <b>Enter</b>.",
  sesEdit: "Change", sesStart: "Start", sesLen: "Length (min)", sesSave: "Save", sesDelAsk: "Delete this session? Its hours come off the journal of that day. Its hands stay saved.", sesDel: "Delete session",
  logbook: "Logbook", resources: "Resources", direction: "Direction", resMine: "Mine", resRts: "RTS", myCalls: "My calls", savedHands: "Saved hands",
  coachingsQuiz: "Coachings & quiz", grindW: "Grind", studyW: "Study", journalW: "Journal", weekOf: "Week of", weekN: "Week", goalsW: "Goals", lgPeriodW: "Week", lgPeriodM: "Month", lgPeriodQ: "Quarter", lgDays: "MTWTFSS", lgTotal: "Total",
  goalsWeek: "This week's goals", goalsMonthT: "Month goals", goalsQuarter: "Quarter goals", goalsPh: "One goal per line", noGoals: "No goal yet.",
  noSessionDay: "No session this day.", hoursWeek: "Hours this week", openSteps: "open next steps", seeCalls: "See my calls",
  totalPlay: "Play", totalStudy: "Study", totalHands: "Hands", daysLogged: "days logged", journalSaved: "Journal saved ✓",
  toReviewT: "To review", reviewedT: "Reviewed", allT: "All", noHandsT: "No hand here.", hhText: "Hand history", openFull: "Full size",
  durGrind: "How long do you play?", durStudy: "How long do you study?", durSub: "The clock counts down. At zero you choose: go again or stop.",
  durOwn: "Or", durGo: "Start", left: "left", tuTitle: "Time is up", tuSub: "Your {t} are done. Go again?",
  tuAuto: "No answer: the session ends at the planned time in", brkTitle: "Take a break", brkSub: "5 minutes away from the screen. Water, stretch, breathe.",
  calls: "Calls", hcTitle: "Hours check", hcBelow: "You wrote {w} of {k}, but {t} were tracked in your sessions. A gap of {d}: did you forget some?",
  hcAbove: "You wrote {w} of {k}, but only {t} were tracked in your sessions ({d} more). Did you play or study without starting a session?",
  hcUseTracked: "Use the tracked {t}", hcKeep: "Keep {w}",
});
Object.assign(STRINGS.fr, {
  gtoTip: "Copie la main et ouvre GTO Wizard", gtoCopied: "Main copiée. Dans GTO Wizard : <b>Upload</b> (en haut à droite), <b>Cmd+V</b>, <b>Entrée</b>.",
  sesEdit: "Modifier", sesStart: "Début", sesLen: "Durée (min)", sesSave: "Enregistrer", sesDelAsk: "Supprimer cette session ? Ses heures sont retirées du journal de ce jour. Ses mains restent sauvegardées.", sesDel: "Supprimer la session",
  logbook: "Journal de bord", resources: "Ressources", direction: "Direction", resMine: "Les miennes", resRts: "RTS", myCalls: "Mes calls", savedHands: "Mains sauvées",
  coachingsQuiz: "Coachings & quiz", grindW: "Grind", studyW: "Études", journalW: "Journal", weekOf: "Semaine du", weekN: "Semaine", goalsW: "Objectifs", lgPeriodW: "Semaine", lgPeriodM: "Mois", lgPeriodQ: "Trimestre", lgDays: "LMMJVSD", lgTotal: "Total",
  goalsWeek: "Objectifs de la semaine", goalsMonthT: "Objectifs du mois", goalsQuarter: "Objectifs du trimestre", goalsPh: "Un objectif par ligne", noGoals: "Pas encore d'objectif.",
  noSessionDay: "Aucune session ce jour-là.", hoursWeek: "Heures cette semaine", openSteps: "prochaines étapes ouvertes", seeCalls: "Voir mes calls",
  totalPlay: "Jeu", totalStudy: "Étude", totalHands: "Mains", daysLogged: "jours remplis", journalSaved: "Journal enregistré ✓",
  toReviewT: "À revoir", reviewedT: "Revues", allT: "Toutes", noHandsT: "Aucune main ici.", hhText: "Historique", openFull: "Plein écran",
  durGrind: "Tu joues combien de temps ?", durSub: "Le chrono descend. À zéro, tu choisis : on relance ou on arrête.", durStudy: "Tu étudies combien de temps ?",
  durOwn: "Ou", durGo: "Lancer", left: "restant", tuTitle: "Temps écoulé", tuSub: "Tes {t} sont faites. On relance ?",
  tuAuto: "Sans réponse, la session se termine à l'heure prévue dans", brkTitle: "Prends une pause", brkSub: "5 minutes loin de l'écran. De l'eau, des étirements, respire.",
  calls: "Calls", hcTitle: "Vérification des heures", hcBelow: "Tu as mis {w} de {k}, mais tes sessions en ont traqué {t}. Il y a un décalage de {d} : tu en as oublié ?",
  hcAbove: "Tu as mis {w} de {k}, mais tes sessions n'en ont traqué que {t} ({d} de plus). Tu as joué ou étudié sans lancer de session ?",
  hcUseTracked: "Prendre les {t} traquées", hcKeep: "Garder {w}",
});

/* ---------- sub navigation: Resources (mine | RTS) and Direction ---------- */
const GROUP = { log: "log", calls: "res", hands: "res", notes: "res", study: "res", recall: "res", coaching: "res", c: "res", quiz: "res", review: "res",
  library: "res", s: "res", submit: "res", ceo: "dir", admin: "dir", inbox: "dir" };
function subnavHtml(group, a) {
  const l = (k, label) => `<a href="#/${k}" class="${a === k || (k === "coaching" && ["c", "quiz", "review"].includes(a)) || (k === "library" && ["s", "submit"].includes(a)) || (k === "study" && a === "recall") ? "on" : ""}">${label}</a>`;
  if (group === "res") return (has(ME, "player") ? `<span class="sn-g">${t("resMine")}</span>${l("calls", t("myCalls"))}${l("hands", t("savedHands"))}${l("study", t("myCards"))}${l("notes", t("oppNotes"))}<i class="sn-sep"></i>` : "")
    + `<span class="sn-g">${t("resRts")}</span>${l("coaching", t("coachingsQuiz"))}${l("library", t("library"))}`;
  if (group === "dir") return [isAdmin() && l("ceo", t("ceo")), isOps() && l("admin", t("admin")), isAdmin() && l("inbox", t("inbox"))].filter(Boolean).join("");
  return "";
}

/* ---------- dates ---------- */
const mondayOf = (d) => { const x = new Date(d + "T12:00:00"); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return iso(x); };
const qOf = (d) => `${d.slice(0, 4)}-Q${Math.floor((+d.slice(5, 7) - 1) / 3) + 1}`;
const qMonths = (q) => { const y = q.slice(0, 4), n = +q.slice(-1); return [0, 1, 2].map((i) => `${y}-${String((n - 1) * 3 + i + 1).padStart(2, "0")}`); };
/* Weeks are numbered inside their month (Alexis 2026-11-03: "semaine 1, semaine 2... chaque mois"). A week belongs to the
   month of its Thursday (ISO rule), so each month has Week 1 to 4 or 5 and no week is counted twice. */
const monthWeeks = (m) => { const [y, mo] = m.split("-").map(Number), out = [];
  for (let d = 1; d <= new Date(y, mo, 0).getDate(); d++) { const x = new Date(y, mo - 1, d, 12); if (x.getDay() === 4) { x.setDate(d - 3); out.push(iso(x)); } }
  return out; };
const weekMonth = (w) => { const x = new Date(w + "T12:00:00"); x.setDate(x.getDate() + 3); return iso(x).slice(0, 7); };
const fmtWeek = (w) => `${t("weekN")} ${monthWeeks(weekMonth(w)).indexOf(w) + 1} · ${fmtMonth(weekMonth(w) + "-01")}`;
const fmtQ = (q) => `${q.slice(-2)} ${q.slice(0, 4)}`;
const longDay = (d) => new Date(d + "T12:00").toLocaleDateString(LANG === "fr" ? "fr-FR" : "en-GB", { weekday: "long", day: "numeric", month: "long" });
const shortDay = (d) => new Date(d + "T12:00").toLocaleDateString(LANG === "fr" ? "fr-FR" : "en-GB", { weekday: "short", day: "numeric" });
const dur = (min) => (min >= 60 ? `${Math.floor(min / 60)} h ${String(min % 60).padStart(2, "0")}` : `${min} min`);
const MOODS = ["😫", "😕", "😐", "🙂", "🔥"];

/* ---------- saved hands: one line per hand, titled by its note (or its time), small picture on demand ---------- */
const handTitle = (h) => (h.note || "").split("\n")[0].trim().slice(0, 80) || `${fmtDay(h.created_at.slice(0, 10))} · ${hhmm(h.created_at)}`;
function handRow(h) {
  const pic = h.image_path || h.image_data;
  return `<details class="hd ${h.reviewed ? "done" : ""}" data-hd="${h.id}"><summary>
      <span class="hd-ic">${pic ? "🖼" : h.link ? "🔗" : "📋"}</span><b class="hd-t">${esc(handTitle(h))}</b>
      ${(h.tags || []).map((k) => `<span class="tag">${t("tag_" + k)}</span>`).join("")}<small class="muted">${h.note ? hhmm(h.created_at) : ""}</small>${h.reviewed ? `<span class="tag ok">✓</span>` : `<span class="tag red">${t("toReviewT")}</span>`}</summary>
    <div class="hd-body">
      ${pic ? `<img class="hd-thumb" data-img="${esc(h.image_path || "")}" ${h.image_data ? `src="${h.image_data}"` : ""} alt="" title="${t("openFull")}">` : ""}
      <div class="hd-side">${(h.note || "").includes("\n") ? `<p class="small">${esc(h.note)}</p>` : ""}
        ${h.hh ? `<details class="hd-hh"><summary class="small-link">${t("hhText")}</summary><pre class="hh">${esc(h.hh)}</pre></details>` : ""}
        <p class="row-btns">${isHH(h.hh) ? `<a class="btn btn-sm btn-red" href="#/replayer/${h.id}">▶ ${t("popReplay")}</a>` : ""}${h.link ? `<a class="btn btn-sm" href="${esc(h.link)}" target="_blank" rel="noopener">🔗 ${t("popLink")}</a>` : ""}${isHH(h.hh) ? `<button class="btn btn-sm btn-gto" data-gto="${h.id}" title="${t("gtoTip")}">GTO Wizard</button>` : ""}${h.hh ? `<button class="btn btn-sm" data-copy="${h.id}">${t("copyHH")}</button>` : ""}
          <button class="btn btn-sm ${h.reviewed ? "" : "btn-red"}" data-rev="${h.id}" data-v="${h.reviewed ? "" : "1"}">${h.reviewed ? t("undo") : "✓ " + t("reviewed")}</button></p></div>
    </div></details>`;
}
function bindHands(hands) {
  $$("[data-hd]").forEach((d) => d.addEventListener("toggle", async () => {
    const im = d.querySelector("img[data-img]"); if (d.open && im && im.dataset.img && !im.src) im.src = (await db.handImage(im.dataset.img)) || "";
  }));
  $$(".hd-thumb").forEach((im) => im.onclick = () => { const lb = $("#lb"); if (!lb || !im.src) return; lb.querySelector("img").src = im.src; lb.showModal(); });
  $$("[data-rev]").forEach((b) => b.onclick = async () => { b.disabled = true; await db.setHand(b.dataset.rev, { reviewed: !!b.dataset.v }); route(); });
  // GTO Wizard (Alexis 2026-11-03): it has no link to open a hand and ignores pastes sent by another site (tested),
  // so one click copies the HH and opens it; there: Upload (top right), Cmd+V, Enter = analysed.
  $$("[data-gto]").forEach((b) => b.onclick = () => {
    const hh = hands.find((h) => h.id === b.dataset.gto)?.hh; if (!hh) return;
    navigator.clipboard.writeText(hh).catch(() => {});
    window.open("https://app.gtowizard.com/", "_blank", "noopener");
    hqToast(`✓ ${t("gtoCopied")}`, 9000);
  });
  $$("[data-copy]").forEach((b) => b.onclick = async () => { try { await navigator.clipboard.writeText(hands.find((h) => h.id === b.dataset.copy).hh); b.textContent = t("copied"); } catch {} });
}

/* Resources > Mine > Saved hands: To review / Reviewed / All, by day, then by session. */
async function viewHands() {
  const my = RENDER;
  const [hands, sessions] = await Promise.all([db.hands(), db.sessions(ME.id, daysAgo(400)).catch(() => [])]);
  if (my !== RENDER) return;
  const f = new URLSearchParams(location.hash.split("?")[1] || "").get("f") || "todo";
  const shown = hands.filter((h) => (f === "todo" ? !h.reviewed : f === "done" ? h.reviewed : true));
  const n = (k) => hands.filter((h) => (k === "todo" ? !h.reviewed : k === "done" ? h.reviewed : true)).length;
  const days = [...new Set(shown.map((h) => h.created_at.slice(0, 10)))].sort().reverse();
  const sess = (id) => sessions.find((x) => x.id === id);
  $("#main").innerHTML = `${head(t("resMine"), t("savedHands"), t("handsPrivate"))}
    <div class="nb-bar">${[["todo", "toReviewT"], ["done", "reviewedT"], ["all", "allT"]].map(([k, l]) => `<a class="chip ${f === k ? "on" : ""}" href="#/hands?f=${k}">${t(l)} · ${n(k)}</a>`).join("")}
      <span class="grow"></span><a class="btn btn-sm btn-ghost-red" href="#/replayer">▶ RTS Replayer</a></div>
    <div class="stack hd-days">${days.map((d, i) => {
      const hs = shown.filter((h) => h.created_at.slice(0, 10) === d), ids = [...new Set(hs.map((h) => h.session_id || ""))];
      return `<details class="card hd-day" ${i < 3 ? "open" : ""}><summary><b>${longDay(d)}</b><span class="tag">${hs.length}</span><a class="small-link" href="#/log?d=${d}">${t("logbook")} →</a></summary>
        ${ids.map((id) => { const x = sess(id), l = hs.filter((h) => (h.session_id || "") === id);
          return `${x ? `<p class="hd-sess">${KIND_ICON[x.kind] || "♠"} ${hhmm(x.started_at)}${x.ended_at ? " → " + hhmm(x.ended_at) : ""}${x.minutes ? " · " + dur(x.minutes) : ""}</p>` : ""}${l.map(handRow).join("")}`; }).join("")}</details>`;
    }).join("") || empty(t("noHandsT"))}</div>`;
  bindHands(hands);
}

/* Resources > Mine > My calls: every 1-on-1 call, its conclusions and next steps to tick. */
async function viewCalls() {
  const my = RENDER, body = await progressHtml(ME, { callsOnly: true });
  if (my !== RENDER) return;
  $("#main").innerHTML = `${head(t("resMine"), t("myCalls"), "")}${body}`;
  bindProgress();
}

/* ---------- Logbook ---------- */
async function viewLog() {
  if (!has(ME, "player")) { location.hash = "#/"; return; }
  const my = RENDER, q = Object.fromEntries(new URLSearchParams(location.hash.split("?")[1] || ""));
  const since = daysAgo(400);
  const [jr, sessions, hands, cards, goals, wq, calls] = await Promise.all([db.journal(ME.id, since), db.sessions(ME.id, since).catch(() => []), db.hands().catch(() => []),
    db.cards().catch(() => []), db.goals(ME.id), db.weekGoals(ME.id).catch(() => []), db.mentorings(ME.id).catch(() => [])]);
  if (my !== RENDER) return;
  setGoals(ME, goals);
  const T = today();
  const sel = q.q ? { k: "q", v: q.q } : q.m ? { k: "m", v: q.m } : q.w ? { k: "w", v: q.w } : { k: "d", v: q.d || T };
  const anchor = sel.k === "d" ? sel.v : sel.k === "w" ? sel.v : sel.k === "m" ? sel.v + "-01" : qMonths(sel.v)[0] + "-01";
  const selW = sel.k === "d" || sel.k === "w" ? mondayOf(anchor) : null, selM = selW ? weekMonth(selW) : anchor.slice(0, 7), selQ = qOf(selM + "-01");

  // numbers per day
  const J = Object.fromEntries(jr.map((e) => [e.day, e]));
  const sDay = (x) => x.started_at.slice(0, 10);
  const dayN = (d) => ({ play: Number(J[d]?.play_h || 0), study: Number(J[d]?.study_h || 0), hands: Number(J[d]?.hands || 0), mood: J[d]?.mood, j: !!J[d], s: sessions.some((x) => sDay(x) === d) });
  const sumDays = (days) => days.reduce((a, d) => { const n = dayN(d); a.play += n.play; a.study += n.study; a.hands += n.hands; a.logged += n.j ? 1 : 0; return a; }, { play: 0, study: 0, hands: 0, logged: 0 });
  const daysIn = (from, to) => { const out = []; for (let d = from; d <= to && d <= T; d = addDays(1, new Date(d + "T12:00:00"))) out.push(d); return out; };
  const monthDays = (m) => { const [y, mo] = m.split("-").map(Number); return daysIn(m + "-01", `${m}-${String(new Date(y, mo, 0).getDate()).padStart(2, "0")}`); };
  const weekDays = (w) => daysIn(w, addDays(6, new Date(w + "T12:00:00")));

  // the tree: from the first logged day (max 400 days) to today
  const first = [jr.at(-1)?.day, sessions.at(-1) && sDay(sessions.at(-1))].filter(Boolean).sort()[0] || T;
  const quarters = []; for (let d = T.slice(0, 7) + "-01"; d >= first.slice(0, 7) + "-01"; d = (() => { const x = new Date(d + "T12:00:00"); x.setMonth(x.getMonth() - 1); return iso(x).slice(0, 7) + "-01"; })()) { const qq = qOf(d); if (!quarters.includes(qq)) quarters.push(qq); }
  const hrs = (x) => x.play + x.study;
  const tree = quarters.map((qq) => `<div class="lt-q2"><a href="#/log?q=${qq}" class="lt-qh ${sel.k === "q" && sel.v === qq ? "on" : ""}">${fmtQ(qq)}</a>
    ${qMonths(qq).filter((m) => m <= T.slice(0, 7) && m >= first.slice(0, 7)).reverse().map((m) => `<a class="lt-m2 ${m === selM && sel.k !== "q" ? "on" : ""}" href="#/log?m=${m}"><span>${fmtMonth(m + "-01")}</span><small>${fmtH(hrs(sumDays(monthDays(m))))}</small></a>`).join("")}</div>`).join("");

  // middle
  const stat = (label, v, target, shown) => `<div class="pg-stat"><span class="sub">${label}</span><b>${shown}${target ? ` <small class="muted">/ ${target}</small>` : ""}</b>${target ? xpBar(v, +String(target).replace(/[^\d.]/g, "")) : ""}</div>`;
  const rows = (items) => `<div class="lg-rows">${items.map(([href, label, x, extra = ""]) => `<a class="lg-row ${x.logged || hrs(x) ? "" : "empty"}" href="${href}"><b>${label}</b><span>♠ ${fmtH(x.play)}</span><span>📚 ${fmtH(x.study)}</span><span>${fmtNum(x.hands)} ${t("hands").toLowerCase()}</span>${extra}</a>`).join("")}</div>`;
  const mGoal = (m) => goals.find((g) => g.label.slice(0, 7) === m), tm = teamOf(ME);
  let mid = "";
  if (sel.k === "d") mid = dayHtml(sel.v);
  else if (sel.k === "w") {
    const x = sumDays(weekDays(sel.v)), tgt = mGoal(sel.v.slice(0, 7))?.week_h_target || weekTarget(ME);
    mid = `<div class="card"><div class="pg-stats">${stat(t("hoursWeek"), hrs(x), tgt + " h", fmtH(hrs(x)))}${stat(t("totalPlay"), x.play, null, fmtH(x.play))}${stat(t("totalStudy"), x.study, null, fmtH(x.study))}${stat(t("totalHands"), x.hands, null, fmtNum(x.hands))}</div></div>
      ${rows(weekDays(sel.v).map((d) => [`#/log?d=${d}`, longDay(d), { ...dayN(d), logged: dayN(d).j }, `<span>${dayN(d).mood ? MOODS[dayN(d).mood - 1] : ""}</span>`]))}`;
  } else if (sel.k === "m") {
    const x = sumDays(monthDays(sel.v)), g = mGoal(sel.v), [y, mo] = sel.v.split("-").map(Number);
    const n = sel.v === T.slice(0, 7) ? new Date().getDate() : new Date(y, mo, 0).getDate(), perWeek = hrs(x) / Math.max(1, n / 7);
    mid = `<div class="card"><div class="pg-stats">${stat(t("goalWeekH"), perWeek, (g?.week_h_target ?? tm.week_hours) + " h", fmtH(perWeek))}${stat(t("goalHands"), x.hands, fmtNum(g?.hands_target ?? tm.month_hands), fmtNum(x.hands))}
        ${stat(t("goalPlayH"), x.play, g?.play_h_target ? g.play_h_target + " h" : null, fmtH(x.play))}${stat(t("goalStudyH"), x.study, g?.study_h_target ? g.study_h_target + " h" : null, fmtH(x.study))}</div>
        <p class="muted small">${x.logged} ${t("daysLogged")}</p></div>
      ${weekLog(sel.v, g?.week_h_target || weekTarget(ME))}`;
  } else {
    const x = sumDays(qMonths(sel.v).flatMap(monthDays));
    mid = `<div class="card"><div class="pg-stats">${stat(t("totalPlay"), x.play, null, fmtH(x.play))}${stat(t("totalStudy"), x.study, null, fmtH(x.study))}${stat(t("totalHands"), x.hands, null, fmtNum(x.hands))}${stat(t("daysLogged"), x.logged, null, x.logged)}</div></div>
      ${rows(qMonths(sel.v).filter((m) => m <= T.slice(0, 7)).reverse().map((m) => [`#/log?m=${m}`, fmtMonth(m + "-01"), sumDays(monthDays(m))]))}`;
  }
  function weekLog(m, tgt) {
    const all = (w) => { const out = []; for (let i = 0; i < 7; i++) out.push(addDays(i, new Date(w + "T12:00:00"))); return out; };
    const bubble = (d) => { if (d > T) return `<span></span>`; const n = dayN(d), h = n.play + n.study, z = h ? Math.round(10 + Math.min(h, 12) * 2.2) : 6;
      return `<a class="wl-d ${d.slice(0, 7) !== m ? "out" : ""}" href="#/log?d=${d}" title="${longDay(d)} · ♠ ${fmtH(n.play)} · 📚 ${fmtH(n.study)}"><i class="${h ? (n.play >= n.study ? "g" : "s") : "z"}" style="width:${z}px;height:${z}px"></i></a>`; };
    return `<div class="card wlog"><div class="wl-row wl-head"><span></span>${[...t("lgDays")].map((x) => `<span>${x}</span>`).join("")}<span>${t("lgTotal")}</span></div>
      ${monthWeeks(m).filter((w) => w <= T).map((w, i) => { const h = hrs(sumDays(weekDays(w)));
        return `<div class="wl-row"><a class="wl-w" href="#/log?w=${w}"><b>${t("weekN")} ${i + 1}</b><small>${fmtDay(w)}</small></a>${all(w).map(bubble).join("")}
          <span class="wl-t"><b>${fmtH(h)}</b> <small class="muted">/ ${tgt} h</small>${xpBar(h, tgt)}</span></div>`; }).join("")}
      <p class="wl-key muted small"><i class="g"></i> ${t("grindW")} <i class="s"></i> ${t("studyW")}</p></div>`;
  }
  const title = sel.k === "d" ? longDay(sel.v) : sel.k === "w" ? fmtWeek(sel.v) : sel.k === "m" ? fmtMonth(sel.v + "-01") : fmtQ(sel.v);
  const shift = (n) => sel.k === "d" ? `d=${addDays(n, new Date(sel.v + "T12:00:00"))}` : sel.k === "w" ? `w=${addDays(7 * n, new Date(sel.v + "T12:00:00"))}`
    : sel.k === "m" ? `m=${iso(new Date(+sel.v.slice(0, 4), +sel.v.slice(5) - 1 + n, 15)).slice(0, 7)}` : `q=${qOf(iso(new Date(+sel.v.slice(0, 4), (+sel.v.slice(-1) - 1) * 3 + 3 * n, 15)))}`;
  const nextOk = shift(1).split("=")[1] <= (sel.k === "q" ? qOf(T) : sel.k === "m" ? T.slice(0, 7) : T);

  // right: goals of the selected period (past goals = pick a past period on the left)
  const wkLabel = selW || mondayOf(sel.k === "q" ? T : anchor), wG = wq.find((g) => g.period === "week" && g.label === wkLabel), qG = wq.find((g) => g.period === "quarter" && g.label === selQ), mG = mGoal(selM);
  const wkHrs = hrs(sumDays(weekDays(wkLabel))), wkT = mG?.week_h_target || weekTarget(ME);
  const goalList = (period, label, g, titleKey, extra = "") => `<div class="card lg-goals"><div class="card-head"><h3>${t(titleKey)}</h3><small class="muted">${period === "week" ? fmtWeek(label) : period === "month" ? fmtMonth(label) : fmtQ(label)}</small></div>
      ${extra}
      ${(g?.items || []).map((x, i) => `<label class="pg-step ${x.startsWith("✓ ") ? "done" : ""}"><input type="checkbox" data-gtick="${period}|${label}|${i}" ${x.startsWith("✓ ") ? "checked" : ""}><span>${esc(x.replace(/^✓ /, ""))}</span></label>`).join("") || `<p class="muted small">${t("noGoals")}</p>`}
      <details class="pg-edit"><summary class="small-link">✎ ${t("pgEdit")}</summary><form data-gform="${period}|${label}">
        ${period === "month" ? `<div class="goals-grid two">${[["week_h_target", "goalWeekH", 1, tm.week_hours || 35], ["hands_target", "goalHands", 1000, tm.month_hands], ["play_h_target", "goalPlayH", 1, ""], ["study_h_target", "goalStudyH", 1, ""]]
          .map(([k, l, st, ph]) => `<label>${t(l)}<input name="${k}" type="number" min="0" step="${st}" value="${g?.[k] ?? ""}" placeholder="${ph}"></label>`).join("")}</div>` : ""}
        <textarea name="items" rows="4" placeholder="${t("goalsPh")}">${esc((g?.items || []).map((x) => x.replace(/^✓ /, "")).join("\n"))}</textarea>
        <button class="btn btn-sm btn-red">${t("save")}</button></form></details></div>`;
  const open = calls.filter((c) => c.status === "validated").reduce((a, c) => a + (c.next_steps || []).filter((_, i) => !(c.steps_done || []).includes(i)).length, 0);
  const per = sel.k === "q" ? "quarter" : sel.k === "m" ? "month" : "week";
  const right = `<div class="seg lg-seg">${[["week", "lgPeriodW", `w=${wkLabel}`], ["month", "lgPeriodM", `m=${selM}`], ["quarter", "lgPeriodQ", `q=${selQ}`]]
      .map(([k, l, h]) => `<a class="${per === k ? "on" : ""}" href="#/log?${h}">${t(l)}</a>`).join("")}</div>
    ${per === "week" ? goalList("week", wkLabel, wG, "goalsWeek", `<div class="pg-stat"><span class="sub">${t("hoursWeek")}</span><b>${fmtH(wkHrs)} <small class="muted">/ ${wkT} h</small></b>${xpBar(wkHrs, wkT)}</div>`)
      : per === "month" ? goalList("month", selM + "-01", mG, "goalsMonthT", mG ? `<span class="tag ${mG.status === "confirmed" ? "ok" : "warn"}">${mG.status === "confirmed" ? t("confirmed") : t("proposed")}</span>` : `<p class="muted small">${t("pgTeamDefault")}</p>`)
      : goalList("quarter", selQ, qG, "goalsQuarter")}
    ${open ? `<a class="card lg-steps" href="#/calls"><b>${open}</b> ${t("openSteps")} <span class="small-link">${t("seeCalls")} →</span></a>` : ""}
    <details class="lg-away">${awayCard().replace('<form class="card" id="aform">', '<summary class="small-link">🏖 ' + t("away") + '</summary><form class="card" id="aform">')}</details>`;

  $("#main").innerHTML = `<div class="logbook">
      <nav class="card lg-tree">${tree}</nav>
      <section class="lg-mid"><div class="lg-head"><a class="btn btn-sm" href="#/log?${shift(-1)}">←</a><h2>${title}</h2>${nextOk ? `<a class="btn btn-sm" href="#/log?${shift(1)}">→</a>` : "<span></span>"}
        ${sel.k === "d" && sel.v === T ? "" : `<a class="small-link" href="#/log">${t("today")}</a>`}</div>${mid}</section>
      <aside class="stack lg-right">${right}</aside></div>`;

  // day: sessions with their hands and conclusions, then the journal page
  function dayHtml(d) {
    const e = J[d] || {}, ss = sessions.filter((x) => sDay(x) === d).sort((a, b) => (a.started_at < b.started_at ? -1 : 1));
    const loose = hands.filter((h) => !h.session_id && h.created_at.slice(0, 10) === d);
    const sessBox = (kind) => {
      const l = ss.filter((x) => x.kind === kind);
      return `<div class="card lg-k k-${kind}"><div class="card-head"><h3>${KIND_ICON[kind]} ${t(kind === "grind" ? "grindW" : "studyW")}</h3><span class="muted small">${fmtH(kind === "grind" ? Number(e.play_h || 0) : Number(e.study_h || 0))}</span></div>
        ${l.map((x) => { const hs = hands.filter((h) => h.session_id === x.id), cs = cards.filter((c) => c.session_id === x.id), min = x.ended_at ? Number(x.minutes || 0) : Math.round(elapsed(x) / 6e4);
          const todo = hs.filter((h) => !h.reviewed).length;
          // One session = one dropdown line (Alexis 2026-11-03): time and length at a glance, × deletes, open it to change the time.
          return `<details class="lg-sess" data-ses="${x.id}"><summary><span class="lg-st"><b>${hhmm(x.started_at)}${x.ended_at ? " → " + hhmm(x.ended_at) : ""}</b>
              ${x.ended_at ? "" : `<span class="live">${t("nbLive")}</span>`}<span class="muted">${dur(min)}${x.planned_min ? " / " + fmtMin(x.planned_min) : ""}</span>
              ${hs.length ? `<span class="tag">${hs.length} ${t("hands").toLowerCase()}</span>` : ""}${todo ? `<span class="tag red">${todo} ${t("toReviewT").toLowerCase()}</span>` : ""}</span>
              ${x.ended_at ? `<button class="x" data-sesdel="${x.id}" title="${t("sesDel")}">×</button>` : ""}</summary>
            <div class="lg-sbody">
            ${x.ended_at ? `<form class="inline ses-edit" data-sesedit="${x.id}"><label>${t("sesStart")} <input type="time" name="at" value="${hhmm(x.started_at)}" required></label>
              <label>${t("sesLen")} <input type="number" name="min" min="1" max="900" value="${min}" required></label><button class="btn btn-sm btn-red">${t("sesSave")}</button></form>` : ""}
            ${(x.notes || "").trim() ? `<p class="nb-notes sensitive">${esc(x.notes)}</p>` : ""}
            ${hs.map(handRow).join("")}
            ${cs.map((c) => `<p class="hrow"><b>${esc(c.situation)}</b><br><span class="muted sensitive">${esc(c.conclusion)}</span></p>`).join("")}</div></details>`; }).join("") || `<p class="muted small">${t("noSessionDay")}</p>`}
        ${kind === "grind" && loose.length ? loose.map(handRow).join("") : ""}</div>`;
    };
    const text = [e.played, e.learned && `${t("pLearned")} ${e.learned}`, e.did_well && `${t("pWell")} ${e.did_well}`, e.mistakes && `${t("pMistake")} ${e.mistakes}`].filter((x) => (x || "").trim()).join("\n\n");
    return `<div class="grid two lg-day">${sessBox("grind")}${sessBox("study")}</div>
      <form class="card journal-page jbook" id="jform"><div class="card-head"><h3>✎ ${t("journalW")}</h3><span class="saved" id="jsaved"></span></div>
        <div class="row3">
          <label>♠ ${t("play")} (h)<input name="play_h" type="number" step="0.25" min="0" max="16" inputmode="decimal" value="${e.play_h ?? ""}" placeholder="0"></label>
          <label>📚 ${t("study")} (h)<input name="study_h" type="number" step="0.25" min="0" max="16" inputmode="decimal" value="${e.study_h ?? ""}" placeholder="0"></label>
          <label>${t("hands")}<input name="hands" type="number" step="50" min="0" inputmode="numeric" value="${e.hands ?? ""}" placeholder="0"></label></div>
        <div class="jmood">${MOODS.map((m, i) => `<input type="radio" name="mood" id="m${i + 1}" value="${i + 1}" ${Number(e.mood) === i + 1 ? "checked" : ""}><label for="m${i + 1}">${m}</label>`).join("")}</div>
        <textarea name="text" class="paper sensitive" rows="8" placeholder="${t("journalPh")}">${esc(text)}</textarea>
        <div class="prompts">${["pPlayed", "pLearned", "pWell", "pMistake", "pTomorrow"].map((k) => `<button type="button" class="chip" data-prompt="${k}">+ ${t(k)}</button>`).join("")}</div>
        <div class="chips jtags">${Object.keys(TAGS).map((k) => `<button type="button" class="tagchip ${(e.tags || []).includes(k) ? "on" : ""}" data-tag="${k}">${tag(k)}</button>`).join("")}</div>
        <button class="btn btn-red" type="submit">${t("save")}${e.day ? "" : " · +20 XP"}</button></form><dialog id="hchk" class="card timeup"></dialog>`;
  }

  // bindings
  bindHands(hands);
  bindSessions(sessions);
  const jf = $("#jform");
  if (jf) {
    const ta = jf.querySelector("textarea"); dictateButton(ta);
    $$("[data-prompt]", jf).forEach((b) => b.onclick = () => { ta.value += (ta.value.trim() ? "\n\n" : "") + t(b.dataset.prompt) + " "; ta.focus(); });
    $$(".tagchip", jf).forEach((b) => b.onclick = () => { if (!b.classList.contains("on") && $$(".tagchip.on", jf).length >= 10) return; b.classList.toggle("on"); });
    jf.onsubmit = async (ev) => {
      ev.preventDefault(); const f = new FormData(jf);
      let play = +f.get("play_h") || 0, study = +f.get("study_h") || 0;
      play = await checkHours("grind", play); if (play == null) return;
      study = await checkHours("study", study); if (study == null) return;
      try {
        await db.saveJournal({ player_id: ME.id, day: sel.v, play_h: play, study_h: study, hands: +f.get("hands") || 0,
          mood: f.get("mood") ? +f.get("mood") : null, tags: $$(".tagchip.on", jf).map((b) => b.dataset.tag), played: f.get("text"), learned: "", did_well: "", mistakes: "" });
        $("#jsaved").textContent = t("journalSaved"); setTimeout(route, 600);
      } catch (err) { $("#jsaved").textContent = t("error") + " : " + err.message; }
    };
  }
  /* Hours check (Alexis 2026-11-03): the journal is compared with the tracked sessions of that day.
     Up to 30 min above what was tracked: accepted as written. Below what was tracked, or more than 30 min above: ask. */
  function checkHours(kind, wrote) {
    const tracked = Math.round(sessions.filter((x) => sDay(x) === sel.v && x.kind === kind).reduce((a, x) => a + (x.ended_at ? Number(x.minutes || 0) : elapsed(x) / 6e4), 0) / 60 * 100) / 100;
    const diff = wrote - tracked;
    if (!tracked && !wrote || (diff >= -0.01 && diff <= 0.5)) return Promise.resolve(wrote);
    const dl = $("#hchk"), label = t(kind === "grind" ? "play" : "study").toLowerCase();
    dl.innerHTML = `<form method="dialog"><div class="card-head"><h3>⏱ ${t("hcTitle")}</h3></div>
      <p>${(diff < 0 ? t("hcBelow") : t("hcAbove")).replace("{k}", label).replace("{w}", fmtH(wrote)).replace("{t}", fmtH(tracked)).replace("{d}", fmtH(Math.abs(diff)))}</p>
      <p class="row-btns"><button class="btn btn-red" value="t">${t("hcUseTracked").replace("{t}", fmtH(tracked))}</button><button class="btn" value="w">${t("hcKeep").replace("{w}", fmtH(wrote))}</button></p></form>`;
    return new Promise((ok) => { dl.onclose = () => ok(dl.returnValue === "w" ? wrote : dl.returnValue === "t" ? tracked : null); dl.showModal(); });
  }
  const goalOf = (period, label) => (period === "month" ? goals.find((g) => g.label === label) : wq.find((g) => g.period === period && g.label === label));
  const saveG = (period, label, patch) => { const g = goalOf(period, label);
    return db.saveGoal({ player_id: ME.id, period, label, status: "proposed", items: g?.items || [], ...patch }); }; // an edit goes back to the mentor (proposed)
  $$("[data-gtick]").forEach((cb) => cb.onchange = async () => {
    const [period, label, i] = cb.dataset.gtick.split("|"), items = [...(goalOf(period, label)?.items || [])];
    items[+i] = (cb.checked ? "✓ " : "") + items[+i].replace(/^✓ /, ""); cb.disabled = true;
    await saveG(period, label, { items, status: goalOf(period, label)?.status || "proposed" }); route();
  });
  $$("[data-gform]").forEach((f) => f.onsubmit = async (ev) => {
    ev.preventDefault(); const [period, label] = f.dataset.gform.split("|"), fd = new FormData(f), old = goalOf(period, label)?.items || [];
    const items = String(fd.get("items") || "").split("\n").map((x) => x.trim()).filter(Boolean).map((x) => (old.includes("✓ " + x) ? "✓ " + x : x));
    const n = (k) => (fd.get(k) === "" || fd.get(k) == null ? null : +fd.get(k));
    await saveG(period, label, { items, ...(period === "month" ? { week_h_target: n("week_h_target"), hands_target: n("hands_target"), play_h_target: n("play_h_target"), study_h_target: n("study_h_target") } : {}) });
    route();
  });
  bindAway();
  $(".lt-m2.on")?.scrollIntoView({ block: "nearest" });
}

/* Session list (Logbook day): × deletes a session, the form changes its start and length.
   The journal hours of that day follow, so the hours check stays right. */
async function sesJournalShift(x, deltaMin) {
  const day = x.started_at.slice(0, 10), k = x.kind === "grind" ? "play_h" : "study_h";
  const e = (await db.journal(ME.id, day)).find((j) => j.day === day); if (!e) return;
  await db.saveJournal({ ...e, [k]: Math.max(0, Math.round((Number(e[k] || 0) + deltaMin / 60) * 100) / 100) });
}
function bindSessions(sessions) {
  const byId = (id) => sessions.find((x) => x.id === id);
  $$("[data-sesdel]").forEach((b) => b.onclick = async (ev) => {
    ev.preventDefault(); ev.stopPropagation();
    const x = byId(b.dataset.sesdel); if (!x || !confirm(t("sesDelAsk"))) return;
    const was = Number(x.minutes || 0); await db.dropSession(x.id); await sesJournalShift(x, -was); route();
  });
  $$("[data-sesedit]").forEach((f) => f.onsubmit = async (ev) => {
    ev.preventDefault();
    const x = byId(f.dataset.sesedit); if (!x) return;
    const [h, m] = f.at.value.split(":").map(Number), min = Math.max(1, Math.min(900, Math.round(+f.min.value || 0)));
    const start = new Date(x.started_at), was = Number(x.minutes || 0); start.setHours(h, m, 0, 0);
    await db.saveSession({ id: x.id, started_at: start.toISOString(), ended_at: new Date(start.getTime() + min * 6e4).toISOString(), minutes: min, paused_ms: 0 });
    await sesJournalShift(x, min - was); route();
  });
}

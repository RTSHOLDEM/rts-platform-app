/* Cockpit (was Logbook), Resources and saved hands (2026-11-03, Alexis: "pas trop de tabs, bien rangé, pas de répétition").
   #/log?d=DAY | ?w=MONDAY | ?m=YYYY-MM | ?q=YYYY-Qn   left: quarters and their months, middle: that period (a month = Week 1 to 5,
   one bubble per day), right: ONE goal card, the one of the period you look at
   #/calls   my calls with mentor and coaches (Resources > Mine)      #/hands   saved hands by title (Resources > Mine) */
Object.assign(STRINGS.en, {
  clkT: "Session clock", clk_chrono: "Stopwatch", clk_chronoS: "One click starts it. You stop it when you are done.", clk_timer: "Timer", clk_timerS: "You say how long. It stops by itself at zero.",
  mtMine: "My monthly reviews", mtMineSub: "My mentor's feedback", mtHasFb: "Mentor feedback ✓", mtNoFb: "No feedback yet", mtFb: "My mentor's feedback", mtFbNone: "Your mentor has not written his feedback for this month yet.",
  mtMyReport: "What I wrote", mtNoMine: "You have not written your review for this month.", mtWrite: "Write",
  tabMentor: "Mentoring", mtMy: "My players", mtNone: "No player to mentor yet.", mtPick: "Pick a player", mtOpen: "Player page →", mtWeekG: "Grind this week", mtWeekS: "Study this week",
  mtReport: "His monthly review", mtNoReport: "The player has not written his review for this month yet.", mtNotes: "My review notes", mtNotesPh: "What we said, his strengths, what he works on this month…",
  ckWkGrind: "Grind this week", ckWkStudy: "Study this week", ckStMonth: "this month",
  fNote: "Note", fNoteHere: "Write a note here",
  hcNoToday: "Nothing planned today.",
  fTitle: "Folders", fTitle1: "Folder", fNew: "Folder", fSub: "Sub-folder", fAll: "All notes", fNone: "No folder", fMove: "Move to a folder", fNamePh: "e.g. SRP or BB vs BTN", fEmpty: "No note in this folder yet.", fStarter: "Add suggested folders", fDelAsk: "Delete the folder \"{f}\" and its sub-folders? Its notes stay, without a folder.",
  stNotesT: "My study notes", stNotesN: "notes", stNewNote: "New note", stNewNoteSub: "Outside a session", stSearch: "Search my notes…", stNotePh: "What I worked on, what I learned, what to check next…", stNoNotes: "No note yet. Start a study session or write a note.",
  tabGrind: "Grind", tabStudy: "Study", tabCoach: "Coachings", stNew: "New card", stNewT: "New study card", stSit: "The spot", stSitPh: "e.g. BTN vs BB, single raised pot, K72r, villain checks turn",
  stConc: "My conclusion", stConcPh: "What I do and why", stShare: "Share with my team", stStart: "Start a study session", calendarT: "Calendar",
  gtoTip: "Copies the hand and opens GTO Wizard", gtoCopied: "Hand copied. In GTO Wizard: <b>Upload</b> (top right), <b>Cmd+V</b>, <b>Enter</b>.",
  sesEdit: "Change", sesStart: "Start", sesLen: "Length (min)", sesSave: "Save", sesDelAsk: "Delete this session? Its hours come off the journal of that day. Its hands stay saved.", sesDel: "Delete session",
  resHome: "Overview", resHomeSub: "Everything you keep and everything RTS shares, one click away.", resOpen: "Open", resStepsOpen: "next steps open", resNoSteps: "No step open",
  resToReview: "to review", resAllReviewed: "All reviewed", resNotesN: "players noted", resQuizN: "quizzes", resLast: "Last", resCardsN: "cards", resDueN: "to recall today", resStratSub: "RTS strategies + your own cards, on one map.",
  logbook: "Cockpit", resources: "Resources", direction: "Direction", resMine: "Mine", resRts: "RTS", myCalls: "My calls", savedHands: "Saved hands",
  coachingsQuiz: "Coachings & quiz", grindW: "Grind", studyW: "Study", journalW: "Journal", weekOf: "Week of", weekN: "Week", goalsW: "Goals", lgPeriodW: "Week", lgPeriodM: "Month", lgPeriodQ: "Quarter", lgDays: "MTWTFSS", lgTotal: "Total",
  goalsWeek: "This week's goals", goalsMonthT: "Month goals", goalsQuarter: "Quarter goals", goalsPh: "One goal per line", noGoals: "No goal yet.",
  noSessionDay: "No session this day.", hoursWeek: "Hours this week", openSteps: "open next steps", seeCalls: "See my calls",
  totalPlay: "Play", totalStudy: "Study", totalHands: "Hands", daysLogged: "days logged", journalSaved: "Journal saved ✓",
  toReviewT: "To review", reviewedT: "Reviewed", allT: "All", noHandsT: "No hand here.", hhText: "Hand history", openFull: "Full size",
  hsReady: "Ready?", hsTitle: "Start a session", hsGrind: "Poker session", hsGrindSub: "You play, the clock runs", hsStudy: "Study session", hsStudySub: "Wizard, review, trainer", hsLive: "Session running", ckStudyNotes: "Notes of the day →", resDayT: "Study of the day", resDayAll: "See all", resNoNotes: "No notes in this session.", resDayNone: "No study session that day.", hsLast: "My last sessions", hsNone: "No session yet.", hbCk: "Grind", hbCkOpen: "Open", hqBig: "Open the HQ big", hqSmall: "Make the HQ small",
  ckYear: "Year", ckWork: "Work", ckJournalSub: "Your feelings of the day", ckWritten: "written", ckJrWrite: "Write",
  ckGTitle: "This week's goals", ckGPlay: "Play hours", ckGHands: "Hands", ckGFree: "Other goals (one per line)", ckGFreePh: "e.g. Review 20 hands with the solver\nStop after 3 buy-ins lost",
  ckGOpt: "All optional. They show at the top right of your Cockpit.", ckGAsk: "New week: your goals?", ckGLater: "Later", ckGSet: "Set my goals",
  ckGWhen: "Ask me for my week goals", ckGSun: "Sunday evening", ckGMon: "Monday (first login)", ckWkSub: "Counted on the week (on its last day so far).", ckPrevW: "Previous week", ckNextW: "Next week",
  ckToday: "Today", ckAdd: "Add", ckEdit: "Edit", ckAddT: "Add", ckDone: "Done that day", ckHandsDay: "Hands that day", ckCoachCal: "From the calendar",
  ckCoaching: "Coaching", ckWeekGoals: "Week goals", ckAddSes: "Add a session I did", ckAddGo: "Add", ckNoCoach: "No coaching that day.",
  ckCoachSub: "Your team's coachings from the calendar count by themselves. Add here a coaching that is not in the calendar.", ckHandsSub: "Set the total for this period: the days you already filled stay as they are.",
  ckHandsLow: "The days already filled make {n} hands: the total can't be lower.", lgTracked: "tracked", durGrind: "How long do you play?", durStudy: "How long do you study?", durSub: "The clock counts down. At zero you choose: go again or stop.",
  durOwn: "Or", durGo: "Start", left: "left", tuTitle: "Time is up", tuSub: "Your {t} are done. Go again?",
  tuAuto: "No answer: the session ends at the planned time in", brkTitle: "Take a break", brkSub: "5 minutes away from the screen. Water, stretch, breathe.",
  calls: "Calls", hcTitle: "Hours check", hcBelow: "You wrote {w} of {k}, but {t} were tracked in your sessions. A gap of {d}: did you forget some?",
  hcAbove: "You wrote {w} of {k}, but only {t} were tracked in your sessions ({d} more). Did you play or study without starting a session?",
  hcUseTracked: "Use the tracked {t}", hcKeep: "Keep {w}",
});
Object.assign(STRINGS.fr, {
  clkT: "Chrono des sessions", clk_chrono: "Chronomètre", clk_chronoS: "Un clic et ça part. Tu l'arrêtes quand tu as fini.", clk_timer: "Minuteur", clk_timerS: "Tu dis combien de temps. Il s'arrête tout seul à zéro.",
  mtMine: "Mes bilans mensuels", mtMineSub: "Les retours de mon mentor", mtHasFb: "Retour du mentor ✓", mtNoFb: "Pas encore de retour", mtFb: "Le retour de mon mentor", mtFbNone: "Ton mentor n'a pas encore écrit son retour pour ce mois.",
  mtMyReport: "Ce que j'ai écrit", mtNoMine: "Tu n'as pas encore écrit ton bilan pour ce mois.", mtWrite: "Écrire",
  tabMentor: "Mentoring", mtMy: "Mes joueurs", mtNone: "Aucun joueur à mentorer pour l'instant.", mtPick: "Choisis un joueur", mtOpen: "Fiche joueur →", mtWeekG: "Grind cette semaine", mtWeekS: "Études cette semaine",
  mtReport: "Son bilan du mois", mtNoReport: "Le joueur n'a pas encore écrit son bilan pour ce mois.", mtNotes: "Mes notes de bilan", mtNotesPh: "Ce qu'on s'est dit, ses points forts, ce qu'il travaille ce mois-ci…",
  ckWkGrind: "Grind cette semaine", ckWkStudy: "Études cette semaine", ckStMonth: "ce mois",
  fNote: "Note", fNoteHere: "Écrire une note ici",
  hcNoToday: "Rien de prévu aujourd'hui.",
  fTitle: "Dossiers", fTitle1: "Dossier", fNew: "Dossier", fSub: "Sous-dossier", fAll: "Toutes les notes", fNone: "Sans dossier", fMove: "Ranger dans un dossier", fNamePh: "ex. SRP ou BB vs BTN", fEmpty: "Pas encore de note dans ce dossier.", fStarter: "Ajouter les dossiers proposés", fDelAsk: "Supprimer le dossier \"{f}\" et ses sous-dossiers ? Ses notes restent, sans dossier.",
  stNotesT: "Mes notes d'études", stNotesN: "notes", stNewNote: "Nouvelle note", stNewNoteSub: "Hors session", stSearch: "Chercher dans mes notes…", stNotePh: "Sur quoi j'ai bossé, ce que j'ai appris, ce que je dois revoir…", stNoNotes: "Pas encore de note. Lance une session d'études ou écris une note.",
  tabGrind: "Grind", tabStudy: "Études", tabCoach: "Coachings", stNew: "Nouvelle carte", stNewT: "Nouvelle carte d'étude", stSit: "Le spot", stSitPh: "ex. BTN vs BB, pot simple relancé, K72r, villain check le turn",
  stConc: "Ma conclusion", stConcPh: "Ce que je fais et pourquoi", stShare: "Partager avec mon équipe", stStart: "Lancer une session d'études", calendarT: "Calendrier",
  gtoTip: "Copie la main et ouvre GTO Wizard", gtoCopied: "Main copiée. Dans GTO Wizard : <b>Upload</b> (en haut à droite), <b>Cmd+V</b>, <b>Entrée</b>.",
  sesEdit: "Modifier", sesStart: "Début", sesLen: "Durée (min)", sesSave: "Enregistrer", sesDelAsk: "Supprimer cette session ? Ses heures sont retirées du journal de ce jour. Ses mains restent sauvegardées.", sesDel: "Supprimer la session",
  resHome: "Vue d'ensemble", resHomeSub: "Tout ce que tu gardes et tout ce que RTS partage, en un clic.", resOpen: "Ouvrir", resStepsOpen: "prochaines étapes ouvertes", resNoSteps: "Aucune étape ouverte",
  resToReview: "à revoir", resAllReviewed: "Tout est revu", resNotesN: "joueurs notés", resQuizN: "quiz", resLast: "Dernier", resCardsN: "cartes", resDueN: "à réviser aujourd'hui", resStratSub: "Les stratégies RTS + tes propres cartes, sur une seule carte.",
  logbook: "Cockpit", resources: "Ressources", direction: "Direction", resMine: "Les miennes", resRts: "RTS", myCalls: "Mes calls", savedHands: "Mains sauvées",
  coachingsQuiz: "Coachings & quiz", grindW: "Grind", studyW: "Études", journalW: "Journal", weekOf: "Semaine du", weekN: "Semaine", goalsW: "Objectifs", lgPeriodW: "Semaine", lgPeriodM: "Mois", lgPeriodQ: "Trimestre", lgDays: "LMMJVSD", lgTotal: "Total",
  goalsWeek: "Objectifs de la semaine", goalsMonthT: "Objectifs du mois", goalsQuarter: "Objectifs du trimestre", goalsPh: "Un objectif par ligne", noGoals: "Pas encore d'objectif.",
  noSessionDay: "Aucune session ce jour-là.", hoursWeek: "Heures cette semaine", openSteps: "prochaines étapes ouvertes", seeCalls: "Voir mes calls",
  totalPlay: "Jeu", totalStudy: "Étude", totalHands: "Mains", daysLogged: "jours remplis", journalSaved: "Journal enregistré ✓",
  toReviewT: "À revoir", reviewedT: "Revues", allT: "Toutes", noHandsT: "Aucune main ici.", hhText: "Historique", openFull: "Plein écran",
  hsReady: "Prêt ?", hsTitle: "Lance une session", hsGrind: "Session de poker", hsGrindSub: "Tu joues, le chrono tourne", hsStudy: "Session d'études", hsStudySub: "Wizard, review, trainer", hsLive: "Session en cours", ckStudyNotes: "Notes du jour →", resDayT: "Études du jour", resDayAll: "Tout voir", resNoNotes: "Pas de notes dans cette session.", resDayNone: "Aucune session d'études ce jour-là.", hsLast: "Mes dernières sessions", hsNone: "Pas encore de session.", hbCk: "Grind", hbCkOpen: "Ouvrir", hqBig: "Ouvrir le QG en grand", hqSmall: "Réduire le QG",
  ckYear: "Année", ckWork: "Travail", ckJournalSub: "Tes ressentis du jour", ckWritten: "écrit", ckJrWrite: "Écrire",
  ckGTitle: "Objectifs de la semaine", ckGPlay: "Heures de jeu", ckGHands: "Mains", ckGFree: "Autres objectifs (un par ligne)", ckGFreePh: "ex. Revoir 20 mains au solver\nStop après 3 caves perdues",
  ckGOpt: "Tout est facultatif. Ils s'affichent en haut à droite du Cockpit.", ckGAsk: "Nouvelle semaine : tes objectifs ?", ckGLater: "Plus tard", ckGSet: "Fixer mes objectifs",
  ckGWhen: "Me demander mes objectifs de la semaine", ckGSun: "Le dimanche soir", ckGMon: "Le lundi (première connexion)", ckWkSub: "Compté sur la semaine (sur son dernier jour passé).", ckPrevW: "Semaine précédente", ckNextW: "Semaine suivante",
  ckToday: "Aujourd'hui", ckAdd: "Ajouter", ckEdit: "Modifier", ckAddT: "Ajouter", ckDone: "Fait ce jour-là", ckHandsDay: "Mains du jour", ckCoachCal: "Du calendrier",
  ckCoaching: "Coaching", ckWeekGoals: "Objectifs semaine", ckAddSes: "Ajouter une session faite", ckAddGo: "Ajouter", ckNoCoach: "Pas de coaching ce jour-là.",
  ckCoachSub: "Les coachings de ton équipe du calendrier comptent tout seuls. Ajoute ici un coaching qui n'y est pas.", ckHandsSub: "Mets le total de la période : les jours déjà remplis ne bougent pas.",
  ckHandsLow: "Les jours déjà remplis font {n} mains : le total ne peut pas être plus bas.", lgTracked: "chrono", durGrind: "Tu joues combien de temps ?", durSub: "Le chrono descend. À zéro, tu choisis : on relance ou on arrête.", durStudy: "Tu étudies combien de temps ?",
  durOwn: "Ou", durGo: "Lancer", left: "restant", tuTitle: "Temps écoulé", tuSub: "Tes {t} sont faites. On relance ?",
  tuAuto: "Sans réponse, la session se termine à l'heure prévue dans", brkTitle: "Prends une pause", brkSub: "5 minutes loin de l'écran. De l'eau, des étirements, respire.",
  calls: "Calls", hcTitle: "Vérification des heures", hcBelow: "Tu as mis {w} de {k}, mais tes sessions en ont traqué {t}. Il y a un décalage de {d} : tu en as oublié ?",
  hcAbove: "Tu as mis {w} de {k}, mais tes sessions n'en ont traqué que {t} ({d} de plus). Tu as joué ou étudié sans lancer de session ?",
  hcUseTracked: "Prendre les {t} traquées", hcKeep: "Garder {w}",
});

/* ---------- sub navigation: Resources (mine | RTS) and Direction ---------- */
const GROUP = { res: "res", log: "log", calls: "res", hands: "res", notes: "res", study: "study", recall: "study", coaching: "coaching", c: "coaching", quiz: "coaching", review: "coaching",
  library: "study", s: "study", submit: "study", ceo: "dir", admin: "dir", inbox: "dir" };
function subnavHtml(group, a) {
  const l = (k, label) => `<a href="#/${k}" class="${a === k || (k === "coaching" && ["c", "quiz", "review"].includes(a)) || (k === "study" && ["recall", "s", "submit"].includes(a)) ? "on" : ""}">${label}</a>`;
  // Resources (Alexis 2026-11-03): an overview first; My cards and Strategies are one page now (the Study hub with a Mine / RTS filter).
  if (group === "res" && false) return l("res", "◎ " + t("resHome")) + `<i class="sn-sep"></i>` + (has(ME, "player") ? `<span class="sn-g">${t("resMine")}</span>${l("calls", t("myCalls"))}${l("hands", t("savedHands"))}${l("notes", t("oppNotes"))}<i class="sn-sep"></i>` : "")
    + `<span class="sn-g">${t("resRts")}</span>${l("coaching", t("coachingsQuiz"))}${l("study", t("library"))}`;
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
const fmtWeek = (w) => `${t("weekN")} ${isoWeekN(w)} · ${fmtMonth(weekMonth(w) + "-01")}`; // ISO week number (Alexis 2026-11-03: "Semaine 45")
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
    <div class="stack hd-days res-scroll">${days.map((d, i) => {
      const hs = shown.filter((h) => h.created_at.slice(0, 10) === d), ids = [...new Set(hs.map((h) => h.session_id || ""))];
      return `<details class="card hd-day" ${i < 3 ? "open" : ""}><summary><b>${longDay(d)}</b><span class="tag">${hs.length}</span><a class="small-link" href="#/log?d=${d}">${t("logbook")} →</a></summary>
        ${ids.map((id) => { const x = sess(id), l = hs.filter((h) => (h.session_id || "") === id);
          return `${x ? `<p class="hd-sess">${KIND_ICON[x.kind] || "♠"} ${hhmm(x.started_at)}${x.ended_at ? " → " + hhmm(x.ended_at) : ""}${x.minutes ? " · " + dur(x.minutes) : ""}</p>` : ""}${l.map(handRow).join("")}`; }).join("")}</details>`;
    }).join("") || empty(t("noHandsT"))}</div>`;
  fitToDock(".res-scroll"); bindHands(hands);
}

/* Resources > Mine > My calls: every 1-on-1 call, its conclusions and next steps to tick. */
async function viewCalls() {
  const my = RENDER, body = await progressHtml(ME, { callsOnly: true });
  if (my !== RENDER) return;
  $("#main").innerHTML = `${head(t("resMine"), t("myCalls"), "")}<div class="res-scroll">${body}</div>`;
  bindProgress(); fitToDock(".res-scroll");
}

/* Resources home (Alexis 2026-11-03): one tile per section with what waits there, one screen. */
async function viewRes() {
  const my = RENDER, player = has(ME, "player");
  const [calls, hands, notes, csAll, qz, cards, sits] = await Promise.all([player ? db.mentorings(ME.id).catch(() => []) : [], player ? db.hands().catch(() => []) : [],
    player ? db.notes().catch(() => []) : [], db.coachings().catch(() => []), db.quizzes().catch(() => []), db.cards().catch(() => []), db.situations().catch(() => [])]);
  if (my !== RENDER) return;
  const steps = calls.filter((c) => c.status === "validated").reduce((a, c) => a + (c.next_steps || []).filter((_, i) => !(c.steps_done || []).includes(i)).length, 0);
  const todo = hands.filter((h) => !h.reviewed).length, cs = csAll.filter(myCoaching).sort((a, b) => (a.day < b.day ? 1 : -1)), last = cs[0];
  const mine = cards.filter((c) => c.player_id === ME.id), due = mine.filter((c) => c.due && c.due <= today()).length, live = sits.filter((s) => s.status === "live").length;
  const tile = (href, icon, title, big, sub, hot = false) => `<a class="card res-tile ${hot ? "hot" : ""}" href="${href}"><span class="res-ic">${icon}</span><b class="res-t">${title}</b>
      <span class="res-n">${big}</span><small class="muted">${sub}</small><span class="res-go">${t("resOpen")} →</span></a>`;
  $("#main").innerHTML = `${head(t("resources"), t("resHome"), t("resHomeSub"))}
    ${player ? `<p class="res-g">${t("resMine")}</p><div class="res-grid">
      ${tile("#/calls", "🤝", t("myCalls"), steps, steps ? t("resStepsOpen") : t("resNoSteps"), steps > 0)}
      ${tile("#/hands", "🃏", t("savedHands"), todo, todo ? t("resToReview") : t("resAllReviewed"), todo > 0)}
      ${tile("#/notes", "🗒", t("oppNotes"), notes.length, t("resNotesN"))}</div>` : ""}
    <p class="res-g">${t("resRts")}</p><div class="res-grid two">
      ${tile("#/coaching", "🎓", t("coachingsQuiz"), cs.length, `${qz.length} ${t("resQuizN")}${last ? ` · ${t("resLast")} : ${esc(last.title)}` : ""}`)}
      ${tile("#/study", "♠", t("library"), live + mine.length, due ? `<b class="red">${due} ${t("resDueN")}</b> · ${t("resStratSub")}` : t("resStratSub"), due > 0)}</div>`;
}

/* ---------- Cockpit (was the Logbook, Alexis 2026-11-03) ----------
   Left: the year as a tree, year > quarter > month > week > day, opened down to the day shown; today is marked.
   A day: grind, study and coaching hours, hands and the week goals on one strip; click one to see or change it.
   Hours only change through sessions (add, edit, delete). Sessions keep the journal's day totals (play_h, study_h) in step,
   and those totals are what every other page reads, so there is one count, not two. Coaching hours come from the calendar.
   Hands can be set for a day, a week or a month: the period total is kept, the difference lands on its last day.
   The journal is free writing only. */
const isoWeekN = (d) => { const x = new Date(d + "T12:00:00"); x.setDate(x.getDate() + 3 - ((x.getDay() + 6) % 7)); const y1 = new Date(x.getFullYear(), 0, 4); return 1 + Math.round(((x - y1) / 864e5 - 3 + ((y1.getDay() + 6) % 7)) / 7); };
const monthOnly = (m) => { const s = new Date(m + "-15T12:00:00").toLocaleDateString(LANG === "fr" ? "fr-FR" : "en-GB", { month: "long" }); return s[0].toUpperCase() + s.slice(1); };
const CK_PANE = { get: () => { try { return sessionStorage.getItem("ck-pane") || ""; } catch { return ""; } }, set: (v) => { try { sessionStorage.setItem("ck-pane", v); } catch {} } };

const CK_ADD = { get: () => { try { return sessionStorage.getItem("ck-add") === "1"; } catch { return false; } }, set: (v) => { try { sessionStorage.setItem("ck-add", v ? "1" : ""); } catch {} } };
const CK_OPEN = { get: (k) => { try { return sessionStorage.getItem("ck-" + k) === "1"; } catch { return false; } },
  set: (k, v) => { try { sessionStorage.setItem("ck-" + k, v ? "1" : ""); } catch {} } };
async function viewLog() {
  if (!has(ME, "player")) { location.hash = "#/"; return; }
  const my = RENDER, q = Object.fromEntries(new URLSearchParams(location.hash.split("?")[1] || ""));
  const T = today();
  const sel = q.q ? { k: "q", v: q.q } : q.m ? { k: "m", v: q.m } : q.w ? { k: "w", v: q.w } : { k: "d", v: q.d || T };
  const anchor = sel.k === "d" ? sel.v : sel.k === "w" ? sel.v : sel.k === "m" ? sel.v + "-01" : qMonths(sel.v)[0] + "-01";
  const selW = sel.k === "d" || sel.k === "w" ? mondayOf(anchor) : null, selM = selW ? weekMonth(selW) : anchor.slice(0, 7), selQ = qOf(selM + "-01"), year = selQ.slice(0, 4);
  const since = [daysAgo(400), year + "-01-01"].sort()[0];
  const [jr, sessions, hands, cards, goals, wq, calls, evs] = await Promise.all([db.journal(ME.id, since), db.sessions(ME.id, since).catch(() => []), db.hands().catch(() => []),
    db.cards().catch(() => []), db.goals(ME.id), db.weekGoals(ME.id).catch(() => []), db.mentorings(ME.id).catch(() => []),
    sel.k === "d" ? db.events(sel.v + "T00:00", sel.v + "T23:59").catch(() => []) : []]);
  if (my !== RENDER) return;
  setGoals(ME, goals);

  // numbers per day: the journal's day totals (written by the sessions)
  const J = Object.fromEntries(jr.map((e) => [e.day, e]));
  const sDay = (x) => x.started_at.slice(0, 10);
  const dayN = (d) => ({ play: Number(J[d]?.play_h || 0), study: Number(J[d]?.study_h || 0), hands: Number(J[d]?.hands || 0), mood: J[d]?.mood, j: !!J[d] });
  const sumDays = (days) => days.reduce((a, d) => { const n = dayN(d); a.play += n.play; a.study += n.study; a.hands += n.hands; a.logged += n.j ? 1 : 0; return a; }, { play: 0, study: 0, hands: 0, logged: 0 });
  const daysIn = (from, to) => { const out = []; for (let d = from; d <= to && d <= T; d = addDays(1, new Date(d + "T12:00:00"))) out.push(d); return out; };
  const monthDays = (m) => { const [y, mo] = m.split("-").map(Number); return daysIn(m + "-01", `${m}-${String(new Date(y, mo, 0).getDate()).padStart(2, "0")}`); };
  const weekDays = (w) => daysIn(w, addDays(6, new Date(w + "T12:00:00")));
  const all7 = (w) => [0, 1, 2, 3, 4, 5, 6].map((i) => addDays(i, new Date(w + "T12:00:00")));
  const hrs = (x) => x.play + x.study;

  // left: the tree. Every year with data, every quarter and month of it (empty ones too), opened down to the selection.
  const first = [jr.at(-1)?.day, sessions.at(-1) && sDay(sessions.at(-1))].filter(Boolean).sort()[0] || T;
  const years = []; for (let y = +T.slice(0, 4); y >= Math.min(+first.slice(0, 4), +year); y--) years.push(String(y));
  const on = (k, v) => (sel.k === k && sel.v === v ? "on" : "");
  const tog = `<span class="ck-tg" aria-hidden="true"></span>`;
  const tW = mondayOf(T), tM = weekMonth(tW), tQ = qOf(tM + "-01");
  const tree = years.map((y) => `<details class="ck-y" ${y === year ? "open" : ""}><summary>${tog}<b>${y}</b></summary>
    ${[1, 2, 3, 4].map((n) => { const qq = `${y}-Q${n}`;
      return `<details class="ck-q" ${qq === selQ || qq === tQ ? "open" : ""}><summary>${tog}<a href="#/log?q=${qq}" class="${on("q", qq)} ${qq > qOf(T) ? "fut" : ""}">Q${n}</a></summary>
      ${qMonths(qq).map((m) => `<details class="ck-m" ${(m === selM && sel.k !== "q") || m === tM ? "open" : ""}><summary>${tog}<a href="#/log?m=${m}" class="${on("m", m)} ${m > T.slice(0, 7) ? "fut" : ""}">${monthOnly(m)}</a><small>${m > T.slice(0, 7) ? "" : fmtH(hrs(sumDays(monthDays(m))))}</small></summary>
        ${monthWeeks(m).map((w) => `<details class="ck-w ${w === tW ? "now" : ""}" ${w === selW || w === tW ? "open" : ""}><summary>${tog}<a href="#/log?w=${w}" class="${on("w", w)} ${w > T ? "fut" : ""}">${t("weekN")} ${isoWeekN(w)}</a><small>${w > T ? "" : fmtH(hrs(sumDays(weekDays(w))))}</small></summary>
          <div class="ck-days">${all7(w).map((d) => d > T ? `<span class="ck-d fut">${shortDay(d)}</span>`
            : `<a href="#/log?d=${d}" class="ck-d ${on("d", d)} ${d === T ? "today" : ""}">${shortDay(d)}${hrs(dayN(d)) ? `<small>${fmtH(hrs(dayN(d)))}</small>` : ""}</a>`).join("")}</div></details>`).join("")}
        </details>`).join("")}</details>`; }).join("")}</details>`).join("");

  // shared pieces
  const tm = teamOf(ME), mGoal = (m) => goals.find((g) => g.label.slice(0, 7) === m);
  const stat = (label, v, target, shown) => `<div class="pg-stat"><span class="sub">${label}</span><b>${shown}${target ? ` <small class="muted">/ ${target}</small>` : ""}</b>${target ? xpBar(v, +String(target).replace(/[^\d.]/g, "")) : ""}</div>`;
  const rows = (items) => `<div class="lg-rows">${items.map(([href, label, x, extra = ""]) => `<a class="lg-row ${x.logged || hrs(x) ? "" : "empty"}" href="${href}"><b>${label}</b><span>♠ ${fmtH(x.play)}</span><span>📚 ${fmtH(x.study)}</span><span>${fmtNum(x.hands)} ${t("hands").toLowerCase()}</span>${extra}</a>`).join("")}</div>`;
  const goalList = (period, label, g, titleKey, extra = "") => `<div class="card lg-goals"><div class="card-head"><h3>${t(titleKey)}</h3><small class="muted">${period === "week" ? fmtWeek(label) : period === "month" ? fmtMonth(label) : fmtQ(label)}</small></div>
      ${extra}
      ${(g?.items || []).map((x, i) => `<label class="pg-step ${x.startsWith("✓ ") ? "done" : ""}"><input type="checkbox" data-gtick="${period}|${label}|${i}" ${x.startsWith("✓ ") ? "checked" : ""}><span>${esc(x.replace(/^✓ /, ""))}</span></label>`).join("") || `<p class="muted small">${t("noGoals")}</p>`}
      <details class="pg-edit"><summary class="small-link">✎ ${t("pgEdit")}</summary><form data-gform="${period}|${label}">
        ${period === "month" ? `<div class="goals-grid two">${[["week_h_target", "goalWeekH", 1, tm.week_hours || 35], ["hands_target", "goalHands", 1000, tm.month_hands], ["play_h_target", "goalPlayH", 1, ""], ["study_h_target", "goalStudyH", 1, ""]]
          .map(([k, l, st, ph]) => `<label>${t(l)}<input name="${k}" type="number" min="0" step="${st}" value="${g?.[k] ?? ""}" placeholder="${ph}"></label>`).join("")}</div>` : ""}
        <textarea name="items" rows="4" placeholder="${t("goalsPh")}">${esc((g?.items || []).map((x) => x.replace(/^✓ /, "")).join("\n"))}</textarea>
        <button class="btn btn-sm btn-red">${t("save")}</button></form></details></div>`;
  // hands for a period: shows the total, saving keeps the other days and puts the difference on the period's last day so far
  const handsBox = (days, label) => `<form class="card ck-hands" data-hands="${days.join(",")}"><div class="card-head"><h3>♠ ${t("hands")}</h3><small class="muted">${label}</small></div>
      <div class="ck-row">${stepper("n", sumDays(days).hands, 500, 0, 9999999, "n")}<button class="btn btn-red">${t("save")}</button></div>
      <p class="muted small">${t("ckHandsSub")}</p></form>`;
  const wkLabel = selW || mondayOf(sel.k === "q" ? T : anchor), wG = wq.find((g) => g.period === "week" && g.label === wkLabel), qG = wq.find((g) => g.period === "quarter" && g.label === selQ), mG = mGoal(selM);
  // Top of the Cockpit (Alexis 2026-11-03): the week first with its own arrows, one bar for all the work
  // (grind red + study green on the same bar), and the week goals at the top right.
  const wkSum = sumDays(weekDays(wkLabel)), wkPlay = wkSum.play, wkStudy = wkSum.study, wkHrs = wkPlay + wkStudy, wkT = mG?.week_h_target || weekTarget(ME);
  const pct = (v) => Math.min(100, wkT ? (v / wkT) * 100 : 0), pG = pct(wkPlay), pS = Math.min(100 - pG, pct(wkStudy));
  const wkPrev = addDays(-7, new Date(wkLabel + "T12:00:00")), wkNext = addDays(7, new Date(wkLabel + "T12:00:00"));
  const wkGi = wG?.items || [], gPlay = Number(wG?.play_h_target || 0), gHands = Number(wG?.hands_target || 0);
  const gLines = [gPlay ? `<span class="ck-gl">♠ <b>${fmtH(wkPlay)}</b> / ${gPlay} h</span>` : "", gHands ? `<span class="ck-gl">🃏 <b>${fmtNum(wkSum.hands)}</b> / ${fmtNum(gHands)}</span>` : "",
    ...wkGi.slice(0, 3).map((x, i) => `<label class="ck-gl ${x.startsWith("✓ ") ? "done" : ""}"><input type="checkbox" data-gtick="week|${wkLabel}|${i}" ${x.startsWith("✓ ") ? "checked" : ""}><span>${esc(x.replace(/^✓ /, ""))}</span></label>`),
    wkGi.length > 3 ? `<span class="ck-gl muted">+${wkGi.length - 3}</span>` : ""].filter(Boolean).join("");
  const wkPanel = weekPanelHtml({ label: wkLabel, play: wkPlay, study: wkStudy, hands: wkSum.hands, target: wkT, wG, mode: "grind", nav: "#/log?" });
  const wkPanelAll = `<div class="ck-week"><div class="ck-wk-l"><span class="ck-eb">${t("hoursWeek")}</span>
      <div class="ck-wk-nav"><a class="btn btn-sm" href="#/log?w=${wkPrev}" title="${t("ckPrevW")}">←</a><a class="ck-wk-t" href="#/log?w=${wkLabel}">${t("weekN")} ${isoWeekN(wkLabel)}</a>${wkNext <= T ? `<a class="btn btn-sm" href="#/log?w=${wkNext}" title="${t("ckNextW")}">→</a>` : `<span class="btn btn-sm ck-off">→</span>`}</div>
      <small>${fmtDay(wkLabel)} → ${fmtDay(addDays(6, new Date(wkLabel + "T12:00:00")))}</small></div>
    <div class="ck-bars"><div class="ck-tot"><span>⚡ ${t("ckWork")}</span><b>${fmtH(wkHrs)} <small>/ ${wkT} h</small></b></div>
      <div class="ck-track ck-stack"><i class="g" style="width:${pG}%"></i><i class="s" style="width:${pS}%"></i></div>
      <div class="ck-key"><span><i class="g"></i>♠ ${t("grindW")} <b>${fmtH(wkPlay)}</b></span><span><i class="s"></i>📚 ${t("studyW")} <b>${fmtH(wkStudy)}</b></span></div></div>
    <div class="ck-wk-g"><button type="button" class="ck-gh" id="ckgoals">🎯 ${t("ckWeekGoals")} <span>✎</span></button>${gLines || `<button type="button" class="ck-gl ck-gset" data-gopen>+ ${t("ckGSet")}</button>`}</div></div>`;
  const openSteps = calls.filter((c) => c.status === "validated").reduce((a, c) => a + (c.next_steps || []).filter((_, i) => !(c.steps_done || []).includes(i)).length, 0);
  const stepsLink = openSteps ? `<a class="small-link ck-steps" href="#/calls"><b>${openSteps}</b> ${t("openSteps")} →</a>` : "";

  // middle
  let mid = "";
  if (sel.k === "d") mid = dayHtml(sel.v);
  else if (sel.k === "w") {
    const x = sumDays(weekDays(sel.v));
    // a week works like a day (Alexis 2026-11-03): its tiles, + Ajouter on each, then its days
    const pane = CK_PANE.get(), wd = weekDays(sel.v);
    const tile = (k, icon, label, val) => `<button type="button" class="ck-t ${pane === k ? "on" : ""}" data-pane="${k}"><span class="ck-tl">${icon} ${label}</span><b>${val}</b><span class="ck-act">+ ${t("ckAdd")}</span></button>`;
    const wAdd = (kind) => `<form class="ck-addf" data-sesweek="${kind}"><h4>+ ${t("ckAddT")} · ${kind === "grind" ? "♠ " + t("grindW") : "📚 " + t("studyW")} · ${fmtWeek(sel.v)}</h4>
        <div class="ck-row">${stepper("min", 60, 15, 15, 3000)}${kind === "study" ? topicSel("wizard") : ""}<button class="btn btn-red">+ ${t("ckAddGo")}</button></div><p class="muted small">${t("ckWkSub")}</p></form>`;
    const wPanes = { grind: () => wAdd("grind"), study: () => wAdd("study"),
      hands: () => `<form class="ck-addf ck-hands" data-hands="${wd.join(",")}"><h4>🃏 ${t("hands")} · ${fmtWeek(sel.v)}</h4><div class="ck-row">${stepper("n", x.hands, 500, 0, 9999999, "n")}<button class="btn btn-red">${t("save")}</button></div><p class="muted small">${t("ckHandsSub")}</p></form>` };
    mid = `<div class="ck-strip w1">${tile("grind", "♠", t("grindW"), fmtH(x.play))}</div>
      ${wPanes[pane] && wd.length ? `<div class="card ck-pane">${wPanes[pane]()}</div>` : ""}
      ${rows(wd.map((d) => [`#/log?d=${d}`, longDay(d), { ...dayN(d), logged: dayN(d).j }, `<span>${dayN(d).mood ? MOODS[dayN(d).mood - 1] : ""}</span>`]))}
      ${stepsLink ? `<p class="row-btns">${stepsLink}</p>` : ""}`;
  } else if (sel.k === "m") {
    const x = sumDays(monthDays(sel.v)), g = mG, [y, mo] = sel.v.split("-").map(Number);
    const n = sel.v === T.slice(0, 7) ? new Date().getDate() : new Date(y, mo, 0).getDate(), perWeek = hrs(x) / Math.max(1, n / 7);
    mid = `<div class="card"><div class="pg-stats">${stat(t("goalWeekH"), perWeek, (g?.week_h_target ?? tm.week_hours) + " h", fmtH(perWeek))}${stat(t("goalHands"), x.hands, fmtNum(g?.hands_target ?? tm.month_hands), fmtNum(x.hands))}
        ${stat(t("goalPlayH"), x.play, g?.play_h_target ? g.play_h_target + " h" : null, fmtH(x.play))}${stat(t("goalStudyH"), x.study, g?.study_h_target ? g.study_h_target + " h" : null, fmtH(x.study))}</div>
        <p class="muted small">${x.logged} ${t("daysLogged")}</p></div>
      ${weekLog(sel.v, g?.week_h_target || weekTarget(ME))}
      <div class="grid two ck-pair">${monthDays(sel.v).length ? handsBox(monthDays(sel.v), fmtMonth(sel.v + "-01")) : ""}
        ${goalList("month", selM + "-01", mG, "goalsMonthT", mG ? `<span class="tag ${mG.status === "confirmed" ? "ok" : "warn"}">${mG.status === "confirmed" ? t("confirmed") : t("proposed")}</span>` : `<p class="muted small">${t("pgTeamDefault")}</p>`)}</div>`;
  } else {
    const x = sumDays(qMonths(sel.v).flatMap(monthDays));
    mid = `<div class="card"><div class="pg-stats">${stat(t("totalPlay"), x.play, null, fmtH(x.play))}${stat(t("totalStudy"), x.study, null, fmtH(x.study))}${stat(t("totalHands"), x.hands, null, fmtNum(x.hands))}${stat(t("daysLogged"), x.logged, null, x.logged)}</div></div>
      ${rows(qMonths(sel.v).filter((m) => m <= T.slice(0, 7)).reverse().map((m) => [`#/log?m=${m}`, fmtMonth(m + "-01"), sumDays(monthDays(m))]))}
      ${goalList("quarter", selQ, qG, "goalsQuarter")}`;
  }
  function weekLog(m, tgt) {
    const bubble = (d) => { if (d > T) return `<span></span>`; const n = dayN(d), h = n.play + n.study, z = h ? Math.round(10 + Math.min(h, 12) * 2.2) : 6;
      return `<a class="wl-d ${d.slice(0, 7) !== m ? "out" : ""}" href="#/log?d=${d}" title="${longDay(d)} · ♠ ${fmtH(n.play)} · 📚 ${fmtH(n.study)}"><i class="${h ? (n.play >= n.study ? "g" : "s") : "z"}" style="width:${z}px;height:${z}px"></i></a>`; };
    return `<div class="card wlog"><div class="wl-row wl-head"><span></span>${[...t("lgDays")].map((x) => `<span>${x}</span>`).join("")}<span>${t("lgTotal")}</span></div>
      ${monthWeeks(m).filter((w) => w <= T).map((w) => { const h = hrs(sumDays(weekDays(w)));
        return `<div class="wl-row"><a class="wl-w" href="#/log?w=${w}"><b>${t("weekN")} ${isoWeekN(w)}</b><small>${fmtDay(w)}</small></a>${all7(w).map(bubble).join("")}
          <span class="wl-t"><b>${fmtH(h)}</b> <small class="muted">/ ${tgt} h</small>${xpBar(h, tgt)}</span></div>`; }).join("")}
      <p class="wl-key muted small"><i class="g"></i> ${t("grindW")} <i class="s"></i> ${t("studyW")}</p></div>`;
  }

  // a day: the strip (grind, study, coaching, hands, week goals), the open panel, then the journal
  function dayHtml(d) {
    const e = J[d] || {}, ss = sessions.filter((x) => sDay(x) === d).sort((a, b) => (a.started_at < b.started_at ? -1 : 1));
    const loose = hands.filter((h) => !h.session_id && h.created_at.slice(0, 10) === d);
    const now = Date.now(), coach = evs.filter((x) => x.kind === "coaching" && forMe(x) && x.starts_at.slice(0, 10) === d && new Date(x.starts_at).getTime() <= now);
    const coachMin = coach.reduce((a, x) => a + Number(x.minutes || 60), 0);
    const pane = CK_PANE.get();
    const manCoach = ss.filter((x) => x.kind === "coaching"), coachAll = coachMin + manCoach.reduce((a, x) => a + Number(x.minutes || 0), 0);
    const tile = (k, icon, label, val, sub = "", go = "") => `<button type="button" class="ck-t ${pane === k ? "on" : ""}" data-pane="${k}" ${go ? `data-go="${go}"` : ""}><span class="ck-tl">${icon} ${label}</span><b>${val}</b>${sub ? `<small>${sub}</small>` : ""}<span class="ck-act">+ ${t("ckAdd")}</span></button>`;
    const addOn = CK_ADD.get();
    const addForm = (kind) => `<form class="ck-addf" data-sesadd="${kind}"><h4>+ ${t("ckAddT")} · ${{ grind: "♠ " + t("grindW"), study: "📚 " + t("studyW"), coaching: "🎓 " + t("ckCoaching") }[kind]}</h4>
        <div class="ck-row">${stepper("min", 60, 15, 15, 900)}<label>${t("sesStart")} <input type="time" name="at" value="${d === T ? hhmm(new Date(Date.now() - 36e5).toISOString()) : "14:00"}" required></label>
        ${kind === "study" ? topicSel("wizard") : ""}<button class="btn btn-red">+ ${t("ckAddGo")}</button></div></form>`;
    const sesList = (kind) => {
      const l = ss.filter((x) => x.kind === kind);
      return `${addOn ? addForm(kind) : ""}<h4 class="ck-sub">${t("ckDone")}${addOn ? "" : ` <button type="button" class="ck-act ck-more" data-pane="${kind}">+ ${t("ckAdd")}</button>`}</h4>${l.map((x) => { const hs = hands.filter((h) => h.session_id === x.id), cs = cards.filter((c) => c.session_id === x.id), min = x.ended_at ? Number(x.minutes || 0) : Math.round(elapsed(x) / 6e4);
          const todo = hs.filter((h) => !h.reviewed).length;
          return `<details class="lg-sess" data-ses="${x.id}" ${q.s === x.id ? "open" : ""}><summary><span class="lg-st"><b>${hhmm(x.started_at)}${x.ended_at ? " → " + hhmm(x.ended_at) : ""}</b>
              ${x.topic && TOPICS[x.topic] ? `<span class="tag">${TOPICS[x.topic].icon} ${t("topic_" + x.topic)}</span>` : ""}
              ${x.ended_at ? "" : `<span class="live">${t("nbLive")}</span>`}<span class="muted">${dur(min)}${x.planned_min ? " / " + fmtMin(x.planned_min) : ""}</span>
              ${hs.length ? `<span class="tag">${hs.length} ${t("hands").toLowerCase()}</span>` : ""}${todo ? `<span class="tag red">${todo} ${t("toReviewT").toLowerCase()}</span>` : ""}</span>
              ${x.ended_at ? `<span class="btn btn-sm ck-edit">✎ ${t("ckEdit")}</span><button class="x" data-sesdel="${x.id}" title="${t("sesDel")}">×</button>` : ""}</summary>
            <div class="lg-sbody">
            ${x.ended_at ? `<form class="ck-row ses-edit" data-sesedit="${x.id}">${stepper("min", min, 15, 1, 900)}<label>${t("sesStart")} <input type="time" name="at" value="${hhmm(x.started_at)}" required></label>
              ${kind === "study" ? topicSel(x.topic) : ""}<button class="btn btn-sm btn-red">${t("sesSave")}</button></form>` : ""}
            ${(x.notes || "").trim() ? `<p class="nb-notes sensitive">${esc(x.notes)}</p>` : ""}
            ${hs.map(handRow).join("")}
            ${cs.map((c) => `<p class="hrow"><b>${esc(c.situation)}</b><br><span class="muted sensitive">${esc(c.conclusion)}</span></p>`).join("")}</div></details>`; }).join("") || `<p class="muted small">${t("noSessionDay")}</p>`}
        ${kind === "grind" && loose.length ? loose.map(handRow).join("") : ""}`;
    };
    const panes = {
      grind: () => sesList("grind"), study: () => sesList("study"),
      coaching: () => `${sesList("coaching")}${coach.length ? `<h4 class="ck-sub">${t("ckCoachCal")}</h4>` : ""}${coach.map((x) => `<p class="hrow">🎓 <b>${hhmm(x.starts_at)}</b> · ${esc(evTitle(x))} <span class="muted">· ${dur(Number(x.minutes || 60))}</span></p>`).join("")}
        <p class="muted small">${t("ckCoachSub")} <a class="small-link" href="#/calendar">${t("calendar")} →</a></p>`,
      hands: () => `<form class="ck-addf ck-hands" data-hands="${d}"><h4>🃏 ${t("ckHandsDay")}</h4><div class="ck-row">${stepper("n", Number(e.hands || 0), 500, 0, 9999999, "n")}<button class="btn btn-red">${t("save")}</button></div></form>`,
      journal: () => `<form class="journal-page jbook ck-journal" id="jform"><span class="saved" id="jsaved"></span>
        <div class="jmood">${MOODS.map((m, i) => `<input type="radio" name="mood" id="m${i + 1}" value="${i + 1}" ${Number(e.mood) === i + 1 ? "checked" : ""}><label for="m${i + 1}">${m}</label>`).join("")}</div>
        <textarea name="text" class="paper sensitive" rows="8" placeholder="${t("journalPh")}">${esc([e.played, e.learned && `${t("pLearned")} ${e.learned}`, e.did_well && `${t("pWell")} ${e.did_well}`, e.mistakes && `${t("pMistake")} ${e.mistakes}`].filter((x) => (x || "").trim()).join("\n\n"))}</textarea>
        <div class="prompts">${["pPlayed", "pLearned", "pWell", "pMistake", "pTomorrow"].map((k) => `<button type="button" class="chip" data-prompt="${k}">+ ${t(k)}</button>`).join("")}</div>
        <div class="chips jtags">${Object.keys(TAGS).map((k) => `<button type="button" class="tagchip ${(e.tags || []).includes(k) ? "on" : ""}" data-tag="${k}">${tag(k)}</button>`).join("")}</div>
        <button class="btn btn-red" type="submit">${t("save")}${e.day ? "" : " · +20 XP"}</button></form>`,
    };
    const written = (e.played || "").trim();
    const jTile = `<button type="button" class="ck-t ck-jt ${pane === "journal" ? "on" : ""}" data-pane="journal" title="${t("journalW")} · ${t("ckJournalSub")}" aria-label="${t("journalW")}">
        <span class="ck-nb"><i>${e.mood ? MOODS[e.mood - 1] : written ? "✓" : "✎"}</i>${written ? `<small>✓ ${t("ckWritten")}</small>` : ""}</span></button>`;
    return `<div class="ck-strip w2">${tile("grind", "♠", t("grindW"), fmtH(Number(e.play_h || 0)))}
        ${jTile}</div>
      ${panes[pane] ? `<div class="card ck-pane ${pane === "journal" ? "ck-jpane" : ""}">${panes[pane]()}</div>` : ""}`;
  }
  function topicSel(cur) { return `<label>${t("topicL")} <select name="topic">${Object.keys(TOPICS).map((k) => `<option value="${k}" ${k === cur ? "selected" : ""}>${TOPICS[k].icon} ${t("topic_" + k)}</option>`).join("")}</select></label>`; }

  const title = sel.k === "d" ? longDay(sel.v) : sel.k === "w" ? fmtWeek(sel.v) : sel.k === "m" ? fmtMonth(sel.v + "-01") : fmtQ(sel.v);
  const shift = (n) => sel.k === "d" ? `d=${addDays(n, new Date(sel.v + "T12:00:00"))}` : sel.k === "w" ? `w=${addDays(7 * n, new Date(sel.v + "T12:00:00"))}`
    : sel.k === "m" ? `m=${iso(new Date(+sel.v.slice(0, 4), +sel.v.slice(5) - 1 + n, 15)).slice(0, 7)}` : `q=${qOf(iso(new Date(+sel.v.slice(0, 4), (+sel.v.slice(-1) - 1) * 3 + 3 * n, 15)))}`;
  const nextOk = shift(1).split("=")[1] <= (sel.k === "q" ? qOf(T) : sel.k === "m" ? T.slice(0, 7) : T);
  // quick start: the dock's own start buttons and duration box; a running session shows the way back instead
  const startRow = `<div class="ck-start">${SES.s ? `<a class="hs-live" href="#/session">${KIND_ICON[SES.s.kind]} ${t("hsLive")} · <b>${t("backCockpit")} →</b></a>`
    : `<button type="button" class="hs-btn grind" data-ckgo="grind"><span>♠</span><b>${t("hsGrind")}</b><small>${t("hsGrindSub")}</small></button>`}</div>`;

  const treeOn = CK_OPEN.get("tree");
  $("#main").innerHTML = `<div class="logbook cockpit ${treeOn ? "tree-on" : ""}">
      <nav class="card lg-tree ck-tree" ${treeOn ? "" : "hidden"}>${tree}
        <details class="lg-away">${awayCard().replace('<form class="card" id="aform">', '<summary class="small-link">🏖 ' + t("away") + '</summary><form class="card" id="aform">')}</details></nav>
      <section class="lg-mid ck-mid">${wkPanel}${startRow}<div class="lg-head ck-head"><span class="ck-hl"><button type="button" class="btn ck-yr ${treeOn ? "on" : ""}" id="cktree" aria-pressed="${treeOn}">🗓 ${t("ckYear")}</button><a class="btn ck-today ${sel.k === "d" && sel.v === T ? "on" : ""}" href="#/log">📍 ${t("ckToday")}</a></span>
        <span class="ck-nav"><a class="btn btn-sm" href="#/log?${shift(-1)}">←</a><h2>${title}</h2>${nextOk ? `<a class="btn btn-sm" href="#/log?${shift(1)}">→</a>` : `<span class="btn btn-sm ck-off">→</span>`}</span>
        <span></span></div>${mid}</section></div>`;
  fitToDock(".logbook");

  // bindings
  bindSteppers();
  $("#cktree").onclick = () => { CK_OPEN.set("tree", !treeOn); route(); };
  $$("#ckgoals, [data-gopen]").forEach((b) => b.onclick = () => openWeekGoals(wkLabel, wG, false));
  // study or grind for a whole week: one session on the week's last day so far (same rule as the hands)
  $$("[data-sesweek]").forEach((f) => f.onsubmit = async (ev) => {
    ev.preventDefault(); const kind = f.dataset.sesweek, wd = weekDays(sel.v), d = wd[wd.length - 1]; if (!d) return;
    const min = Math.max(1, Math.min(3000, Math.round(+f.min.value || 0))), st = d === T ? new Date(Date.now() - min * 6e4) : new Date(d + "T12:00:00");
    f.querySelector("button.btn-red").disabled = true;
    const x = await db.addSession({ kind, topic: kind === "study" ? f.topic?.value || null : null, started_at: st.toISOString(), ended_at: new Date(st.getTime() + min * 6e4).toISOString(), minutes: min, planned_min: null });
    await sesJournalShift(x, min); route();
  });
  bindHands(hands);
  bindSessions(sessions);
  $$("[data-ckgo]").forEach((b) => b.onclick = () => sesGo(b.dataset.ckgo)); // the session may have loaded after this page
  // a tile opens what it holds (the day's sessions, coachings, journal; study goes to its notes); its "+ Ajouter" opens the add form
  $$("[data-pane]").forEach((b) => b.onclick = (ev) => {
    const add = !!ev.target.closest(".ck-act"), k = b.dataset.pane;
    if (!add && b.dataset.go) { location.hash = b.dataset.go; return; }
    const same = CK_PANE.get() === k && CK_ADD.get() === add && !b.classList.contains("ck-more");
    CK_PANE.set(same ? "" : k); CK_ADD.set(!same && add); route();
  });
  $$("[data-sesadd]").forEach((f) => f.onsubmit = async (ev) => {
    ev.preventDefault(); const kind = f.dataset.sesadd, [h, m] = f.at.value.split(":").map(Number), min = Math.max(1, Math.min(900, Math.round(+f.min.value || 0)));
    const st = new Date(sel.v + "T12:00:00"); st.setHours(h, m, 0, 0);
    f.querySelector("button").disabled = true;
    const x = await db.addSession({ kind, topic: kind === "study" ? f.topic?.value || null : null, started_at: st.toISOString(), ended_at: new Date(st.getTime() + min * 6e4).toISOString(), minutes: min, planned_min: null });
    await sesJournalShift(x, min); route();
  });
  $$("[data-hands]").forEach((f) => f.onsubmit = async (ev) => {
    ev.preventDefault(); const days = f.dataset.hands.split(","), total = Math.max(0, Math.round(+f.n.value || 0));
    const last = days[days.length - 1], others = days.slice(0, -1).reduce((a, d) => a + Number(J[d]?.hands || 0), 0);
    if (total < others) { alert(t("ckHandsLow").replace("{n}", fmtNum(others))); return; }
    await db.saveJournal({ ...(J[last] || { player_id: ME.id, day: last }), hands: total - others }); route();
  });
  const jf = $("#jform");
  if (jf) {
    const ta = jf.querySelector("textarea"); dictateButton(ta);
    $$("[data-prompt]", jf).forEach((b) => b.onclick = () => { ta.value += (ta.value.trim() ? "\n\n" : "") + t(b.dataset.prompt) + " "; ta.focus(); });
    $$(".tagchip", jf).forEach((b) => b.onclick = () => { if (!b.classList.contains("on") && $$(".tagchip.on", jf).length >= 10) return; b.classList.toggle("on"); });
    // the journal saves the writing only: hours and hands of the day stay as the sessions and the hands box set them
    jf.onsubmit = async (ev) => {
      ev.preventDefault(); const f = new FormData(jf);
      try {
        const cur = (await db.journal(ME.id, sel.v)).find((x) => x.day === sel.v) || { player_id: ME.id, day: sel.v };
        await db.saveJournal({ ...cur, mood: f.get("mood") ? +f.get("mood") : null, tags: $$(".tagchip.on", jf).map((b) => b.dataset.tag), played: f.get("text"), learned: "", did_well: "", mistakes: "" });
        $("#jsaved").textContent = t("journalSaved"); setTimeout(route, 600);
      } catch (err) { $("#jsaved").textContent = t("error") + " : " + err.message; }
    };
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
  if (treeOn) $(".ck-tree a.on, .ck-tree .ck-d.on")?.scrollIntoView({ block: "center" });
}

/* Week goals (Alexis 2026-11-03): play hours, hands, and any goal in words, all optional. Shown at the top right of the Cockpit.
   ask: the new-week question (first login of the week, or Sunday evening if the player chose it). */
/* One week panel (Alexis 2026-11-03): the whole week on Home (grind + study on one bar, week goals), grind only on Grind, study only on Études.
   o: label (Monday), play, study, hands, target (week hours), wG (week goal), mode "all" | "grind" | "study", nav ("#/log?" for week arrows, or null) */
function weekPanelHtml(o) {
  const T = today(), L = o.label, prev = addDays(-7, new Date(L + "T12:00:00")), next = addDays(7, new Date(L + "T12:00:00"));
  const wkN = `${t("weekN")} ${isoWeekN(L)}`, gP = Number(o.wG?.play_h_target || 0), gH = Number(o.wG?.hands_target || 0), gS = Number(o.wG?.study_h_target || 0);
  const nav = o.nav ? `<a class="btn btn-sm" href="${o.nav}w=${prev}" title="${t("ckPrevW")}">←</a><a class="ck-wk-t" href="${o.nav}w=${L}">${wkN}</a>${next <= T ? `<a class="btn btn-sm" href="${o.nav}w=${next}" title="${t("ckNextW")}">→</a>` : `<span class="btn btn-sm ck-off">→</span>`}`
    : `<span class="ck-wk-t">${wkN}</span>`;
  const eb = { all: "hoursWeek", grind: "ckWkGrind", study: "ckWkStudy" }[o.mode];
  const left = `<div class="ck-wk-l"><span class="ck-eb">${t(eb)}</span><div class="ck-wk-nav">${nav}</div><small>${fmtDay(L)} → ${fmtDay(addDays(6, new Date(L + "T12:00:00")))}</small></div>`;
  const pc = (v, max) => Math.min(100, max ? (v / max) * 100 : 0);
  if (o.mode === "grind") { const tg = gP || o.target;
    return `<div class="ck-week ck-one">${left}<div class="ck-bars"><div class="ck-tot"><span>♠ ${t("grindW")}</span><b>${fmtH(o.play)} <small>/ ${tg} h</small></b></div>
      <div class="ck-track ck-stack"><i class="g" style="width:${pc(o.play, tg)}%"></i></div>
      <div class="ck-key"><span>🃏 ${t("hands")} <b>${fmtNum(o.hands)}</b>${gH ? ` / ${fmtNum(gH)}` : ""}</span></div></div></div>`; }
  if (o.mode === "study") { const tg = gS || null;
    return `<div class="ck-week ck-one">${left}<div class="ck-bars"><div class="ck-tot"><span>📚 ${t("studyW")}</span><b>${fmtH(o.study)}${tg ? ` <small>/ ${tg} h</small>` : ""}</b></div>
      ${tg ? `<div class="ck-track ck-stack"><i class="s" style="width:${pc(o.study, tg)}%"></i></div>` : ""}
      <div class="ck-key"><span>${o.extra || ""}</span></div></div></div>`; }
  const gi = o.wG?.items || [], pG = pc(o.play, o.target), pS = Math.min(100 - pG, pc(o.study, o.target));
  const lines = [gP ? `<span class="ck-gl">♠ <b>${fmtH(o.play)}</b> / ${gP} h</span>` : "", gH ? `<span class="ck-gl">🃏 <b>${fmtNum(o.hands)}</b> / ${fmtNum(gH)}</span>` : "",
    ...gi.slice(0, 3).map((x, i) => `<label class="ck-gl ${x.startsWith("✓ ") ? "done" : ""}"><input type="checkbox" data-wgtick="${i}" ${x.startsWith("✓ ") ? "checked" : ""}><span>${esc(x.replace(/^✓ /, ""))}</span></label>`),
    gi.length > 3 ? `<span class="ck-gl muted">+${gi.length - 3}</span>` : ""].filter(Boolean).join("");
  return `<div class="ck-week">${left}
    <div class="ck-bars"><div class="ck-tot"><span>⚡ ${t("ckWork")}</span><b>${fmtH(o.play + o.study)} <small>/ ${o.target} h</small></b></div>
      <div class="ck-track ck-stack"><i class="g" style="width:${pG}%"></i><i class="s" style="width:${pS}%"></i></div>
      <div class="ck-key"><span><i class="g"></i>♠ ${t("grindW")} <b>${fmtH(o.play)}</b></span><span><i class="s"></i>📚 ${t("studyW")} <b>${fmtH(o.study)}</b></span></div></div>
    <div class="ck-wk-g"><button type="button" class="ck-gh" id="wpgoals">🎯 ${t("ckWeekGoals")} <span>✎</span></button>${lines || `<button type="button" class="ck-gl ck-gset" data-wpgopen>+ ${t("ckGSet")}</button>`}</div></div>`;
}
function bindWeekPanel(label, wG) {
  $$("#wpgoals, [data-wpgopen]").forEach((b) => b.onclick = () => openWeekGoals(label, wG, false));
  $$("[data-wgtick]").forEach((cb) => cb.onchange = async () => {
    const items = [...(wG?.items || [])], i = +cb.dataset.wgtick; items[i] = (cb.checked ? "✓ " : "") + items[i].replace(/^✓ /, ""); cb.disabled = true;
    await db.saveGoal({ player_id: ME.id, period: "week", label, status: wG?.status || "proposed", items, play_h_target: wG?.play_h_target ?? null, hands_target: wG?.hands_target ?? null }); route();
  });
}
function openWeekGoals(label, g, ask) {
  let dl = $("#wgoalsd");
  if (!dl) { dl = document.createElement("dialog"); dl.id = "wgoalsd"; dl.className = "card"; document.body.appendChild(dl); }
  const items = (g?.items || []).map((x) => x.replace(/^✓ /, "")), day = ME.goals_day || "mon";
  dl.innerHTML = `<form method="dialog" class="wg"><div class="card-head"><h3>🎯 ${t(ask ? "ckGAsk" : "ckGTitle")}</h3><button class="x" value="cancel" formnovalidate>×</button></div>
    <p class="muted small">${t("weekN")} ${isoWeekN(label)} · ${fmtDay(label)} → ${fmtDay(addDays(6, new Date(label + "T12:00:00")))}</p>
    <div class="goals-grid two"><label>♠ ${t("ckGPlay")}<input name="play_h_target" type="number" min="0" step="1" value="${g?.play_h_target ?? ""}" placeholder="20"></label>
      <label>🃏 ${t("ckGHands")}<input name="hands_target" type="number" min="0" step="1000" value="${g?.hands_target ?? ""}" placeholder="15000"></label></div>
    <label>${t("ckGFree")}<textarea name="items" rows="5" placeholder="${t("ckGFreePh")}">${esc(items.join("\n"))}</textarea></label>
    <p class="muted small">${t("ckGOpt")}</p>
    <div class="wg-when"><span>${t("ckGWhen")}</span>${[["sun", "ckGSun"], ["mon", "ckGMon"]].map(([v, k]) => `<label class="chip ${day === v ? "on" : ""}"><input type="radio" name="gday" value="${v}" ${day === v ? "checked" : ""} hidden>${t(k)}</label>`).join("")}</div>
    <p class="row-btns"><button class="btn btn-red" value="save">${t("save")}</button><button class="btn" value="cancel" formnovalidate>${t(ask ? "ckGLater" : "cancel")}</button></p></form>`;
  const f = dl.querySelector("form");
  f.onchange = (ev) => { if (ev.target.name === "gday") $$("input[name=gday]", f).forEach((r) => r.parentElement.classList.toggle("on", r.checked)); };
  dl.onclose = async () => {
    const gd = f.querySelector("input[name=gday]:checked")?.value;
    if (gd && gd !== (ME.goals_day || "mon")) { try { await db.setGoalsDay(gd); ME.goals_day = gd; if (REAL) REAL.goals_day = gd; } catch {} }
    if (dl.returnValue !== "save") return;
    const old = g?.items || [], n = (k) => (f[k].value === "" ? null : +f[k].value);
    const list = f.items.value.split("\n").map((x) => x.trim()).filter(Boolean).map((x) => (old.includes("✓ " + x) ? "✓ " + x : x));
    await db.saveGoal({ player_id: ME.id, period: "week", label, status: g?.status || "proposed", items: list, play_h_target: n("play_h_target"), hands_target: n("hands_target") });
    route();
  };
  dl.showModal();
}
async function weekGoalsPrompt() {
  if (!ME || !has(ME, "player") || REAL?.id !== ME.id) return;
  const now = new Date(), T = today(), sun = (ME.goals_day || "mon") === "sun";
  let label = mondayOf(T);
  if (now.getDay() === 0) { if (sun && now.getHours() >= 18) label = addDays(1, now); else return; } // Sunday: the week is ending, ask only for the next one
  const key = "rts-wg-" + ME.id + "-" + label;
  try { if (localStorage.getItem(key)) return; } catch { return; }
  const g = (await db.weekGoals(ME.id).catch(() => [])).find((x) => x.period === "week" && x.label === label);
  if (g && ((g.items || []).length || g.play_h_target || g.hands_target)) return;
  if ($("dialog[open]")) return;
  try { localStorage.setItem(key, "1"); } catch {} // asked once a week, "Later" does not come back at every login
  openWeekGoals(label, g, true);
}

/* Stepper (Alexis 2026-11-03: "une petite molette"): − and + buttons, the mouse wheel turns it too.
   Minutes show as "1 h 30"; a count (hands) stays typeable. */
function stepper(name, val, step, min, max, kind = "min") {
  return `<div class="ck-step" data-step="${step}" data-min="${min}" data-max="${max}" title="−/+ or wheel"><button type="button" data-d="-1">−</button>
    ${kind === "min" ? `<output>${dur(val)}</output><input type="hidden" name="${name}" value="${val}">` : `<input name="${name}" type="number" min="${min}" step="1" inputmode="numeric" value="${val}">`}<button type="button" data-d="1">+</button></div>`;
}
function bindSteppers() {
  $$(".ck-step").forEach((w) => {
    const inp = w.querySelector("input"), out = w.querySelector("output"), st = +w.dataset.step, lo = +w.dataset.min, hi = +w.dataset.max;
    const go = (n) => { const v = Math.max(lo, Math.min(hi, (n > 0 ? Math.floor : Math.ceil)((+inp.value || 0) / st) * st + n * st)); inp.value = v; if (out) out.textContent = dur(v); };
    $$("[data-d]", w).forEach((b) => b.onclick = () => go(+b.dataset.d));
    w.addEventListener("wheel", (ev) => { ev.preventDefault(); go(ev.deltaY < 0 ? 1 : -1); }, { passive: false });
  });
}

/* One screen (Alexis 2026-11-03): the block ends just above the dock, its columns scroll inside, the page never scrolls.
   Below 1100 px the columns stack and the page scrolls as usual. */
function fitToDock(selector) {
  const fit = () => {
    const el = $(selector); if (!el) { removeEventListener("resize", fit); return; }
    if (innerWidth <= 1100) { el.style.height = ""; return; }
    const bottom = dockBottom();
    el.style.height = Math.max(380, bottom - el.getBoundingClientRect().top) + "px";
  };
  fit(); addEventListener("resize", fit);
}

/* Session list (Logbook day): × deletes a session, the form changes its start and length.
   The journal hours of that day follow, so the hours check stays right. */
async function sesJournalShift(x, deltaMin) {
  if (x.kind === "coaching") return;
  const day = x.started_at.slice(0, 10), k = x.kind === "grind" ? "play_h" : "study_h";
  const e = (await db.journal(ME.id, day)).find((j) => j.day === day) || { player_id: ME.id, day };
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
    await db.saveSession({ id: x.id, started_at: start.toISOString(), ended_at: new Date(start.getTime() + min * 6e4).toISOString(), minutes: min, paused_ms: 0, ...(f.topic ? { topic: f.topic.value } : {}) });
    await sesJournalShift(x, min - was); route();
  });
}

/* Mentoring dashboard (Alexis 2026-11-05): every player gets an empty copy of a 1on1 coaching dashboard, 10 sections,
   and everything in it can be changed (titles, columns, options, habits, templates). The player fills it, his mentor and
   Direction see it and edit it, nobody else (supabase/022, board_ok). One screen: tiles, a click opens one section.
   Storage: one row per piece in board_items (key -> data), so two people editing two pieces never overwrite each other.
     meta              tile titles and intros
     t:<section>       a table   { cols:[{id,name,type,opts,shared}], rows:[{id,c:{colId:value}}], opts:[shared options] }
     tpl:<kind>        a form template { fields:[{id,type,label,hint,n,opts,def}] }   kinds: header daily weekly monthly sheet
     header            the header form's values { v:{} }
     e:<kind>:<id>     a journal entry or a session sheet { date, title, v:{} }
   Nothing is written until someone types: defaults are built on the fly in the reader's language. */

const BOARD = { pid: null, items: {}, tm: {}, ctx: null };
const BSECS = ["reviews", "header", "links", "goals", "habits", "calls", "routine", "shape", "journal", "time", "sheets"];
const BICON = { reviews: "🤝", header: "🏁", links: "🔗", goals: "🎯", habits: "✅", calls: "📞", routine: "☀️", shape: "💪", journal: "📓", time: "⏱", sheets: "🧭" };
const BTABLES = ["links", "goals", "habits", "calls", "routine", "shape", "time"];
const L2t = (fr, en) => (LANG === "fr" ? fr : en);
const bid = () => Math.random().toString(36).slice(2, 9);
const pl = (n, fr, en) => `${n} ${L2t(fr, en)}${n > 1 ? "s" : ""}`; // "1 objectif", "2 objectifs"

/* ---------- defaults (the empty dashboard) ---------- */
function bTitle(sec) {
  return BOARD.items.meta?.t?.[sec] || {
    reviews: L2t("Bilans mensuels", "Monthly reviews"), header: L2t("Programme", "Program"), links: L2t("Liens importants", "Important links"),
    goals: L2t("Objectifs", "Goals"), habits: L2t("Suivi des habitudes", "Habit tracker"), calls: L2t("Calls 1on1", "1on1 coaching calls"),
    routine: L2t("Routines", "Daily routine planner"), shape: L2t("Suivi physique", "Shape tracker"), journal: L2t("Journal", "Journal"),
    time: L2t("Suivi du temps", "Daily time tracker"), sheets: L2t("Fiches de session", "Session sheets") }[sec];
}
function bIntro(sec) {
  const own = BOARD.items.meta?.i?.[sec]; if (own != null) return own;
  return {
    routine: L2t("Écris tes routines ↓", "Write down your routines ↓"),
    shape: L2t("C'est souvent dur de voir ses progrès quand on est en plein effort. Les photos valent mille mots : garde une trace de tes progrès ici.", "It's often hard to see progress when you're in the middle of the hard work. Pictures tell a thousand words, use this section to keep track of your progress."),
    journal: L2t("Clique sur + Nouvelle revue pour créer une page. C'est ton journal : utilise ces modèles pour prendre du recul.", "Click on + New review below to create a new page. This is your journal, you can use these templates to reflect."),
    time: L2t("Optionnel : une ligne par jour, une activité par heure.", "Optional: one row per day, one activity per hour."),
    sheets: L2t("Le sprint d'engagement de 14 jours.", "The 14-day commitment sprint."),
    habits: L2t("Tes propres habitudes : ajoute-les avec + Habitude, puis coche chaque jour.", "Your own habits: add them with + Habit, then tick them every day."),
  }[sec] || "";
}

// Default ids are fixed (c1, c2…, r1…, f1…): what someone types stays attached to its column or question even if the
// default was never stored. Ids added later by the player are random.
function bDefTable(sec) {
  let n = 0, m = 0;
  const c = (name, type, opts) => ({ id: "c" + ++n, name, type, ...(opts ? { opts } : {}) });
  const row = (cells = {}) => ({ id: "r" + ++m, c: cells });
  if (sec === "links") return { cols: [c(L2t("Titre", "Title"), "text"), c("URL", "link")], rows: [] };
  if (sec === "goals") return { cols: [c(L2t("Objectif", "Goal"), "text"), c("Type", "choice", [L2t("Principal", "Primary"), L2t("Secondaire", "Secondary")]),
    c(L2t("Statut", "Status"), "choice", [L2t("Pas commencé", "Not started"), L2t("En cours", "In progress"), L2t("Accompli", "Accomplished")]), c("Date", "date"),
    c(L2t("Note 0-10 au départ", "Score 0-10 at start"), "number"), c(L2t("Note 0-10 à la fin", "Score 0-10 at end"), "number"),
    c(L2t("Commentaires de progression", "Progress comments"), "text")], rows: [] };
  if (sec === "habits") return { cols: [c("Date", "date")], rows: [], addType: "check", pct: true, dated: true };
  if (sec === "calls") return { cols: [c(L2t("Coach", "Coach name"), "text"), c(L2t("Semaine", "Week number"), "choice", Array.from({ length: 13 }, (_, i) => L2t("Semaine ", "Week ") + (i + 1))),
    c("Date", "date"), c(L2t("P.O.I. / défi", "P.O.I. / challenge"), "text"), c(L2t("Commentaires", "Comments"), "text"), c(L2t("Lien vers les notes", "Link to notes doc"), "link")], rows: [] };
  if (sec === "routine") {
    const cols = [c(L2t("Rituel de début de travail", "Work start ritual"), "text"), c(L2t("Rituel de fin de travail", "Work closing ritual"), "text"),
      c(L2t("Routine du matin", "Morning routine"), "text"), c(L2t("Routine du soir", "Evening routine"), "text")];
    const hint = L2t("(de préférence court et applicable partout)", "(preferably short & applicable everywhere)");
    return { cols, rows: [row({ [cols[0].id]: hint, [cols[1].id]: hint }),
      row({ [cols[0].id]: L2t("Téléphone coupé, café, eau et thé. J'allume une bougie et je me mets au travail.", "Shut down phones, make coffee, water & tea. Light candle and get to work."),
        [cols[1].id]: L2t("Inbox zéro, finir toutes mes tâches, faire la liste de demain et ranger complètement mon bureau.", "Inbox zero, finish all your tasks, make to-do list for tomorrow and completely declutter/clean your desk") }),
      row(), row(), row(), row()] };
  }
  if (sec === "shape") return { cols: [c(L2t("Nom / date", "Name / date"), "text"), c(L2t("Poids actuel", "Current weight"), "number"), c(L2t("Poids objectif", "Goal weight"), "number"), c(L2t("Photo (lien)", "Photo (link)"), "link")], rows: [] };
  if (sec === "time") {
    const date = c("Date", "date"), slots = Array.from({ length: 19 }, (_, i) => ({ id: "c" + ++n, name: String(5 + i).padStart(2, "0") + ":00", type: "choice", shared: true }));
    return { cols: [date, ...slots], rows: [], dated: true, addType: "choice-shared",
      opts: L2t("Réveil|Routine du matin|Petit-déjeuner|Sport|Salle|Travail profond|Déjeuner|Travail léger|Dîner|Temps OFF|Chill|Détente|Décompression|Routine du soir|Coucher",
        "Wake up|Morning routine|Breakfast|Workout|Gym|Deep work|Lunch|Light work|Diner|OFF time|Chill|Relax|Wind down|Evening routine|Go to bed").split("|") };
  }
  return { cols: [c(L2t("Colonne", "Column"), "text")], rows: [] };
}

function bDefTpl(kind) {
  let n = 0;
  const f = (type, label, more = {}) => ({ id: "f" + ++n, type, label, ...more });
  const box = (fr, en, more) => f("box", L2t(fr, en), more), lines = (n, fr, en, more) => f("lines", L2t(fr, en), { n, ...more });
  const checks = (n, fr, en, opts) => f("checks", L2t(fr, en), { n, ...(opts ? { opts } : {}) }), rate = (fr, en) => f("rating", L2t(fr, en));
  const head = (fr, en, hfr = "", hen = "") => f("head", L2t(fr, en), { hint: L2t(hfr, hen) });
  const brain = () => box("Vide-tête : pensées, idées, notes", "Brain dump: thoughts, ideas, notes");
  const T = {
    header: () => [f("line", L2t("Titre", "Title"), { def: "{title}" }), f("line", L2t("Sous-titre", "Subtitle"), { def: L2t("Tableau de bord de coaching 1on1 sur mesure", "1on1 tailored coaching dashboard") }),
      box("Citation", "Quote", { def: L2t("Nous avons le pouvoir de diriger notre propre vie, de décider de notre bonheur et de notre réussite.", "We have the power to control our own lives, to determine our own happiness and success.") }),
      f("line", L2t("Auteur", "Author"), { def: L2t("Sénèque", "Seneca") }), f("line", L2t("Durée du programme", "Program duration")),
      f("date", L2t("Début", "Start date")), f("date", L2t("Fin", "End date")), box("Accord", "Agreement")],
    daily: () => [box("Mot du jour", "Word of the day"),
      f("choice", L2t("Humeur du jour", "Today's mood"), { opts: L2t("Génial|Bien|Normal|Chargé|Triste", "Amazing|Good|Normal|Busy|Sad").split("|") }),
      box("Ma journée en 3 mots", "My day in 3 words"), lines(3, "Aujourd'hui, je suis reconnaissant pour…", "Today, I'm grateful for…"),
      box("Mes victoires du jour", "My wins today"), lines(3, "Objectifs / compétences / choses sur lesquelles j'ai travaillé", "Goals / skills / things I worked on"),
      lines(3, "Défis", "Challenges"), checks(3, "Focus / priorités de demain", "Focus / highlights tomorrow"), rate("Note ta journée", "Rate your day"),
      checks(6, "Au réveil : routine du matin", "Things I did when I came out of bed (morning routine)"),
      checks(6, "Avant de dormir : routine du soir", "Things to do before sleep (evening routine)"), brain()],
    weekly: () => [box("Comment s'est passée cette semaine", "How was this week"), lines(3, "Cette semaine, je suis reconnaissant pour", "I feel grateful this week for"),
      lines(3, "Victoires de la semaine", "Wins of the week", { hint: L2t("Liste-les toutes, petites ou grandes", "List all of them, small or big") }),
      lines(4, "Ce que je peux améliorer", "Things I can improve on"), box("Ce qui s'est bien passé", "Things went well"), box("Ce qui ne s'est pas bien passé", "Things didn't go well"),
      lines(3, "Tâches en cours", "Tasks in progress"), lines(3, "Focus / priorités de la semaine prochaine", "Focus / highlights for the next week"), rate("Note ta semaine", "Rate your week"), brain()],
    monthly: () => [box("Comment s'est passé mon mois", "How was my month", { hint: L2t("Le mieux : relis tes revues de la semaine et pars de là", "It's best if you check out your past weekly reviews and find out from there") }),
      lines(3, "Ce mois-ci, je suis reconnaissant pour", "I feel grateful this month for"), lines(3, "Victoires du mois", "Wins of the month"), lines(3, "Ce que je peux améliorer", "Things I can improve on"),
      f("grid", L2t("Choses à…", "Things to…"), { n: 4, opts: L2t("Commencer|Arrêter|Continuer", "Start doing|Stop doing|Keep going").split("|") }),
      lines(3, "Défis et leçons", "Challenges & lessons"), lines(3, "Focus / priorités du mois prochain", "Focus / highlights for next month"), rate("Note ton mois", "Rate your month"), brain()],
    sheet: () => [f("date", "Date"), f("link", L2t("Lien audio", "Audio link")),
      box("Pourquoi c'est important", "Why this matters", { def: L2t("Avant de trouver ta grande quête, construis la confiance en toi pour choisir une direction et t'y tenir. Il s'agit de créer ta propre vie, pas seulement d'être plus productif.", "Before finding your bigger main quest, build the self-trust to choose a direction and follow through. This is about creating your own life, not just being more productive.") }),
      head("01 / Leadership de soi · 20 min", "01 / Self-leadership · 20 min", "Question principale : où ne vas-tu pas au bout de ce qui compte pour toi ?", "Main question: where are you not following through on what matters to you?"),
      box("Mon état d'esprit actuel", "My current state of mind"),
      f("ratings", L2t("Comportements, note /10", "Behavior rating /10"), { opts: L2t("Je prends des décisions au lieu de les repousser|Je tiens mes engagements envers moi-même|Je protège mon attention et mes priorités|J'agis sans attendre une certitude parfaite|Je fais ce que j'ai décidé, même si c'est dur",
        "I make decisions instead of postponing them|I keep commitments to myself|I protect my attention and priorities|I act without waiting for perfect certainty|I do what I decided I would do even if it's hard").split("|") }),
      box("Un exemple réel", "One real example"), box("À quoi ressemblerait prendre la responsabilité ?", "What would taking ownership look like?"),
      box("Quel rôle joues-tu ? Suis-je à la bonne place ?", "What role are you in? Am I in the right seat?"),
      box("Que faut-il changer pour que tu ne te sentes plus dans la jungle ?", "What do we need to change for you to feel you are not in the jungle?"),
      head("02 / RTS · 20 min", "02 / RTS · 20 min", "Question principale : quel rôle dois-tu prendre chez RTS pour bien la mener sans perdre la vie que tu veux en dehors du travail ?", "Main question: what role do you need to step into at RTS to lead it well without losing the life you want outside work?"),
      box("Mon rôle à plus forte valeur", "My highest-value role"), box("Une chose à arrêter, déléguer ou décider", "One thing to stop, delegate or decide"),
      head("03 / L'engagement de 14 jours · 15 min", "03 / The 14-day commitment · 15 min", "Chaque réponse précise et sous ton contrôle.", "Make each answer specific and within your control."),
      f("line", L2t("Une décision (qu'est-ce que je choisis)", "One decision (what am I choosing)")), f("line", L2t("Une limite (à quoi je dis non)", "One boundary (what am I saying no to)")),
      f("line", L2t("Une action (que vais-je faire, et pour quand)", "One action (what will I do, and by when)")),
      checks(3, "Bilan", "Check", L2t("Décision prise|Limite protégée|Action faite", "Decision made|Boundary protected|Action completed").split("|")),
      head("04 / Suivi · 5 min", "04 / Follow-through · 5 min"), f("date", L2t("Première revue", "First review")),
      box("Ai-je fait ce que j'avais dit ? Qu'ai-je appris ?", "Did I do what I said I would do? What did I learn?"),
      f("date", L2t("Revue à 14 jours", "14-day review")), box("Qu'est-ce qui a changé dans ma façon de me diriger ?", "What changed in how I lead myself?"),
      head("Suite : la quête principale", "Next: the main quest")],
  };
  return { fields: T[kind] ? T[kind]() : [] }; // one kind built per call, so its ids are f1, f2… whatever the other templates hold
}

const bTable = (sec) => BOARD.items["t:" + sec] || bDefTable(sec);
const bTpl = (kind) => BOARD.items["tpl:" + kind] || bDefTpl(kind);
const bEntries = (kind) => Object.entries(BOARD.items).filter(([k, d]) => d && k.startsWith(`e:${kind}:`)).map(([key, d]) => ({ key, ...d })).sort((a, b) => ((b.date || "") + (b.at || "")).localeCompare((a.date || "") + (a.at || "")));
// first edit of a default piece writes it: the defaults built on screen become the stored copy
function bOwn(key, make) { if (!BOARD.items[key]) BOARD.items[key] = make(); return BOARD.items[key]; }
// Saves wait 700 ms while someone types. They hold the player and the piece itself, and boardLoad finishes them first,
// so leaving the page right after a change never loses it (bug seen in demo 2026-11-05: new journal page vanished).
function bSave(key, now = false) {
  const ok = $("#bok"); if (ok) ok.textContent = "…";
  const pid = BOARD.pid, data = BOARD.items[key];
  if (data == null) return; // nothing to write (never store an empty row)
  clearTimeout(BOARD.tm[key]?.t);
  const run = async () => { delete BOARD.tm[key];
    try { await db.saveBoard(pid, key, data); if ($("#bok")) $("#bok").textContent = t("saved"); }
    catch (err) { if ($("#bok")) $("#bok").textContent = err.message; } };
  BOARD.tm[key] = { run, t: setTimeout(run, now ? 0 : 700) };
}
async function bFlush() { const l = Object.values(BOARD.tm); l.forEach((x) => clearTimeout(x.t)); await Promise.all(l.map((x) => x.run())); }
async function bDrop(key) { delete BOARD.items[key]; await db.dropBoard(BOARD.pid, key).catch(() => {}); }

async function boardLoad(pid) {
  await bFlush();
  BOARD.pid = pid; BOARD.items = {};
  (await db.board(pid).catch(() => [])).forEach((x) => (BOARD.items[x.key] = x.data));
}

/* ---------- tiles ---------- */
function bSummary(sec, ctx) {
  const tb = BTABLES.includes(sec) ? bTable(sec) : null, n = tb ? tb.rows.length : 0;
  if (sec === "reviews") return ctx.reviewSum || "";
  if (sec === "header") { const v = BOARD.items.header?.v || {}, f = bTpl("header").fields, d = f.filter((x) => x.type === "date").map((x) => v[x.id]).filter(Boolean);
    return d.length ? d.map((x) => fmtDay(x)).join(" → ") : L2t("Citation + dates du programme", "Quote + program dates"); }
  if (sec === "links") return n ? pl(n, "lien", "link") : L2t("Aucun lien", "No link yet");
  if (sec === "goals") { const st = tb.cols.find((c) => c.type === "choice" && (c.opts || []).length === 3), done = st ? tb.rows.filter((r) => r.c?.[st.id] === st.opts[2]).length : 0;
    return n ? `${pl(n, "objectif", "goal")} · ${done} ✓` : L2t("Aucun objectif", "No goal yet"); }
  if (sec === "habits") { const h = tb.cols.filter((c) => c.type === "check"); if (!h.length) return L2t("Ajoute tes habitudes", "Add your habits");
    const last = tb.rows.slice(0, 7), p = last.length ? Math.round(last.reduce((a, r) => a + h.filter((c) => r.c?.[c.id]).length / h.length, 0) / last.length * 100) : 0;
    return `${pl(h.length, "habitude", "habit")} · ${p} % ${L2t("sur 7 j", "last 7 d")}`; }
  if (sec === "calls") return n ? pl(n, "call", "call") : L2t("Aucun call", "No call yet");
  if (sec === "routine") { const filled = tb.rows.slice(2).reduce((a, r) => a + Object.values(r.c || {}).filter((x) => String(x).trim()).length, 0); return filled ? `${pl(filled, "case", "cell")} ${L2t("remplie" + (filled > 1 ? "s" : ""), "filled")}` : L2t("À écrire", "To write"); }
  if (sec === "shape") { const r = tb.rows[0], cw = tb.cols[1], gw = tb.cols[2]; return r && cw ? `${r.c?.[cw.id] || "?"} → ${gw ? r.c?.[gw.id] || "?" : ""}` : L2t("Aucune mesure", "No entry yet"); }
  if (sec === "journal") { const e = ["daily", "weekly", "monthly"].flatMap(bEntries).sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    return e.length ? `${pl(e.length, "revue", "review")} · ${fmtDay(e[0].date)}` : L2t("Aucune revue", "No review yet"); }
  if (sec === "time") return n ? pl(n, "jour", "day") : L2t("Optionnel", "Optional");
  if (sec === "sheets") { const e = bEntries("sheet"); return e.length ? pl(e.length, "fiche", "sheet") : L2t("Aucune fiche", "No sheet yet"); }
  return "";
}
function boardTiles(ctx) {
  return `<div class="bd-tiles">${BSECS.map((s) => `<a class="card bd-tile" href="${ctx.href({ s })}"><span class="bd-ic">${BICON[s]}</span><span class="bd-tx"><b>${esc(bTitle(s))}</b><small>${esc(bSummary(s, ctx))}</small></span></a>`).join("")}</div>`;
}

/* ---------- one section ---------- */
// ctx: { href(o), q, reviewsHtml(), bindReviews() } from the Mentoring page
function boardSection(ctx) {
  const sec = ctx.q.s, q = ctx.q;
  let tools = "", body = "";
  if (sec === "reviews") body = ctx.reviewsHtml();
  else if (BTABLES.includes(sec)) { const d = bTable(sec);
    tools = (sec === "habits" ? `<button type="button" class="btn btn-sm" data-addc>+ ${L2t("Habitude", "Habit")}</button>` : "")
      + (d.dated ? `<button type="button" class="btn btn-sm btn-ghost-red" data-today>+ ${L2t("Aujourd'hui", "Today")}</button>` : "")
      + (sec === "goals" ? `<button type="button" class="btn btn-sm" data-ckpt>+ ${L2t("Point d'étape", "Checkpoint")}</button>` : "");
    body = (sec === "time" ? `<details class="bd-acts"><summary>${L2t("Activités (modifier la liste)", "Activities (edit the list)")}</summary><textarea id="bopts" rows="5">${esc((d.opts || []).join("\n"))}</textarea><small class="muted">${L2t("Une par ligne.", "One per line.")}</small></details>` : "") + bTableHtml(d); }
  else if (sec === "header") { const tpl = bTpl("header"), v = BOARD.items.header?.v || {};
    tools = `<button type="button" class="btn btn-sm ${q.tpl ? "on" : ""}" data-tpl>✎ ${L2t("Modèle", "Template")}</button>`;
    body = bFormHtml(tpl, v, !!q.tpl); }
  else if (sec === "journal" || sec === "sheets") {
    const kinds = sec === "journal" ? ["daily", "weekly", "monthly"] : ["sheet"];
    const kName = { daily: L2t("Revue du jour", "Daily review"), weekly: L2t("Revue de la semaine", "Weekly review"), monthly: L2t("Revue du mois", "Monthly review"), sheet: L2t("Fiche de session", "Session sheet") };
    if (q.e && BOARD.items[q.e]) { const kind = q.e.split(":")[1], e = BOARD.items[q.e];
      tools = `<button type="button" class="btn btn-sm ${q.tpl ? "on" : ""}" data-tpl>✎ ${L2t("Modèle", "Template")}</button><button type="button" class="btn btn-sm" data-edel>× ${L2t("Supprimer", "Delete")}</button>`;
      body = `<a class="small-link" href="${ctx.href({ e: "", tpl: "" })}">← ${esc(bTitle(sec))}</a>
        <div class="bf-top"><span class="tag">${esc(kName[kind])}</span><input type="date" data-ef="date" value="${esc(e.date || "")}"><input class="bf-title" data-ef="title" value="${esc(e.title || "")}" placeholder="${L2t("Titre (optionnel)", "Title (optional)")}"></div>
        ${bFormHtml(bTpl(kind), e.v || {}, !!q.tpl)}`; }
    else { const f = q.j && kinds.includes(q.j) ? [q.j] : kinds, list = f.flatMap(bEntries).sort((a, b) => (b.date || "").localeCompare(a.date || ""));
      tools = kinds.map((k) => `<button type="button" class="btn btn-sm btn-ghost-red" data-enew="${k}">+ ${esc(kName[k])}</button>`).join("");
      const rateOf = (e) => { const r = bTpl(e.key.split(":")[1]).fields.find((x) => x.type === "rating"); return r && e.v?.[r.id] ? ` · ${e.v[r.id]}/10` : ""; };
      body = (kinds.length > 1 ? `<div class="chips bd-chips"><a class="chip ${q.j ? "" : "on"}" href="${ctx.href({ j: "" })}">${L2t("Tout", "All")}</a>${kinds.map((k) => `<a class="chip ${q.j === k ? "on" : ""}" href="${ctx.href({ j: k })}">${esc(kName[k])}</a>`).join("")}</div>` : "")
        + (list.length ? `<div class="bd-list">${list.map((e) => `<a class="bd-row" href="${ctx.href({ e: e.key })}"><b>${e.date ? fmtDay(e.date) : "…"}</b><span class="tag">${esc(kName[e.key.split(":")[1]])}</span><span>${esc(e.title || "")}</span><small class="muted">${rateOf(e)}</small></a>`).join("")}</div>`
          : `<p class="muted bd-empty">${L2t("Rien pour l'instant. Crée la première avec le bouton en haut.", "Nothing yet. Create the first one with the button above.")}</p>`); }
  }
  const intro = bIntro(sec);
  return `<div class="card bd-sec" id="bsec">
    <div class="bd-sh"><a class="small-link" href="${ctx.href({ s: "", e: "", tpl: "", j: "" })}">← ${L2t("Tableau", "Dashboard")}</a><span class="bd-ic">${BICON[sec]}</span>
      <input class="bd-tt" data-meta="t" value="${esc(bTitle(sec))}"><small class="saved" id="bok"></small><span class="bd-tools">${tools}</span></div>
    ${sec === "reviews" ? "" : `<textarea class="bd-intro" data-meta="i" rows="1" placeholder="${L2t("Texte d'intro (optionnel)", "Intro text (optional)")}">${esc(intro)}</textarea>`}
    <div class="bd-body">${body}</div></div>`;
}

/* ---------- editable table ---------- */
function bTableHtml(d) {
  const opt = (c) => (c.shared ? d.opts || [] : c.opts || []);
  const checks = d.cols.filter((c) => c.type === "check");
  const cell = (r, c) => { const v = r.c?.[c.id] ?? "", a = `data-r="${r.id}" data-c="${c.id}"`;
    if (c.type === "check") return `<input type="checkbox" ${a} ${v ? "checked" : ""}>`;
    if (c.type === "choice") return `<select ${a}><option value=""></option>${opt(c).map((o) => `<option ${o === v ? "selected" : ""}>${esc(o)}</option>`).join("")}${v && !opt(c).includes(v) ? `<option selected>${esc(v)}</option>` : ""}</select>`;
    if (c.type === "date") return `<input type="date" ${a} value="${esc(v)}">`;
    if (c.type === "number") return `<input type="number" step="any" ${a} value="${esc(v)}">`;
    if (c.type === "link") return `<span class="bt-link"><input type="url" ${a} value="${esc(v)}" placeholder="https://">${v ? `<a href="${esc(v)}" target="_blank" rel="noopener">↗</a>` : ""}</span>`;
    return `<textarea rows="1" ${a}>${esc(v)}</textarea>`; };
  const pct = (r) => (checks.length ? Math.round(checks.filter((c) => r.c?.[c.id]).length / checks.length * 100) + " %" : "");
  return `<div class="bt-wrap"><table class="bt ${d.cols.length > 8 ? "wide" : ""}"><thead><tr>
      ${d.cols.map((c) => `<th class="t-${c.type}"><span class="bt-h"><input value="${esc(c.name)}" data-hc="${c.id}"><button type="button" class="bt-cm" data-cm="${c.id}" title="${L2t("Colonne : type, options, supprimer", "Column: type, options, delete")}">⋯</button></span></th>`).join("")}
      ${d.pct ? `<th class="bt-pct">${L2t("Jour", "Daily")}</th>` : ""}<th class="bt-x"><button type="button" class="bt-cm" data-addc title="${L2t("Ajouter une colonne", "Add a column")}">+</button></th></tr></thead>
    <tbody>${d.rows.map((r) => `<tr>${d.cols.map((c) => `<td class="t-${c.type}">${cell(r, c)}</td>`).join("")}${d.pct ? `<td class="bt-pct" data-pct="${r.id}">${pct(r)}</td>` : ""}<td class="bt-x"><button type="button" class="x" data-rdel="${r.id}" title="${L2t("Supprimer la ligne", "Delete row")}">×</button></td></tr>`).join("")}</tbody></table>
    <button type="button" class="bt-addr" data-addr>+ ${L2t("Ligne", "Row")}</button></div>`;
}

/* ---------- editable form (header, journal, session sheets) ---------- */
function bFormHtml(tpl, v, edit) {
  const types = { head: L2t("Titre de partie", "Heading"), box: L2t("Texte", "Text box"), line: L2t("Ligne", "Line"), lines: L2t("Lignes numérotées", "Numbered lines"), checks: L2t("Cases à cocher", "Checkboxes"),
    choice: L2t("Choix", "Choice"), rating: L2t("Note 1 à 10", "Rating 1 to 10"), ratings: L2t("Notes /10 par ligne", "Ratings /10 per row"), grid: L2t("Tableau", "Grid"), date: "Date", link: L2t("Lien", "Link") };
  const fld = (f) => { const val = v[f.id] ?? (f.def != null ? f.def.replace("{title}", BOARD.ctx?.title || "") : null), a = `data-f="${f.id}"`, n = f.n || 3;
    let x = "";
    if (f.type === "box") x = `<textarea rows="2" ${a}>${esc(val || "")}</textarea>`;
    else if (f.type === "line") x = `<input ${a} value="${esc(val || "")}">`;
    else if (f.type === "date") x = `<input type="date" ${a} value="${esc(val || "")}">`;
    else if (f.type === "link") x = `<span class="bt-link"><input type="url" ${a} value="${esc(val || "")}" placeholder="https://">${val ? `<a href="${esc(val)}" target="_blank" rel="noopener">↗</a>` : ""}</span>`;
    else if (f.type === "lines") x = `<ol class="bf-lines">${Array.from({ length: n }, (_, i) => `<li><input ${a} data-i="${i}" value="${esc((val || [])[i] || "")}"></li>`).join("")}</ol>`;
    else if (f.type === "checks") x = `<div class="bf-checks">${Array.from({ length: n }, (_, i) => { const it = (val || [])[i] || {};
      return `<label><input type="checkbox" ${a} data-i="${i}" ${it.on ? "checked" : ""}>${f.opts?.[i] ? `<span>${esc(f.opts[i])}</span>` : `<input ${a} data-i="${i}" data-t value="${esc(it.t || "")}">`}</label>`; }).join("")}</div>`;
    else if (f.type === "choice") x = `<div class="bf-pills">${(f.opts || []).map((o) => `<button type="button" class="dur-b ${val === o ? "on" : ""}" ${a} data-pick="${esc(o)}">${esc(o)}</button>`).join("")}</div>`;
    else if (f.type === "rating") x = `<div class="bf-pills r10">${Array.from({ length: 10 }, (_, i) => `<button type="button" class="dur-b ${+val === i + 1 ? "on" : ""}" ${a} data-pick="${i + 1}">${i + 1}</button>`).join("")}</div>`;
    else if (f.type === "ratings") x = `<div class="bf-rates">${(f.opts || []).map((o, i) => `<label><span>${esc(o)}</span><select ${a} data-i="${i}"><option value=""></option>${Array.from({ length: 10 }, (_, k) => `<option ${+(val || {})[i] === k + 1 ? "selected" : ""}>${k + 1}</option>`).join("")}</select></label>`).join("")}</div>`;
    else if (f.type === "grid") x = `<table class="bt bf-grid"><thead><tr>${(f.opts || []).map((o) => `<th>${esc(o)}</th>`).join("")}</tr></thead><tbody>${Array.from({ length: n }, (_, i) => `<tr>${(f.opts || []).map((_, j) => `<td><textarea rows="1" ${a} data-i="${i}" data-j="${j}">${esc(((val || [])[i] || [])[j] || "")}</textarea></td>`).join("")}</tr>`).join("")}</tbody></table>`;
    const ed = edit ? `<div class="bf-ed"><input data-tf="${f.id}" data-tp="label" value="${esc(f.label)}" placeholder="${L2t("Titre", "Label")}">
        <input data-tf="${f.id}" data-tp="hint" value="${esc(f.hint || "")}" placeholder="${L2t("Aide (optionnel)", "Hint (optional)")}">
        ${["lines", "checks", "grid"].includes(f.type) ? `<label class="small">${L2t("Nombre", "Count")} <input type="number" min="1" max="20" data-tf="${f.id}" data-tp="n" value="${n}"></label>` : ""}
        ${["choice", "ratings", "grid", "checks"].includes(f.type) ? `<textarea rows="2" data-tf="${f.id}" data-tp="opts" placeholder="${L2t("Options, une par ligne", "Options, one per line")}">${esc((f.opts || []).join("\n"))}</textarea>` : ""}
        <span class="bf-mv"><button type="button" data-tmv="-1" data-tid="${f.id}">↑</button><button type="button" data-tmv="1" data-tid="${f.id}">↓</button><button type="button" class="x" data-tdel="${f.id}">×</button></span></div>` : "";
    return f.type === "head" ? `<div class="bf-f bf-head">${ed}<h4>${esc(f.label)}</h4>${f.hint ? `<p class="muted">${esc(f.hint)}</p>` : ""}</div>`
      : `<div class="bf-f">${ed}<p class="lbl">${esc(f.label)}</p>${f.hint ? `<small class="muted">${esc(f.hint)}</small>` : ""}${x}</div>`; };
  return `<div class="bf ${edit ? "editing" : ""}">${tpl.fields.map(fld).join("")}
    ${edit ? `<div class="bf-add"><select id="btype">${Object.entries(types).map(([k, l]) => `<option value="${k}">${esc(l)}</option>`).join("")}</select><button type="button" class="btn btn-sm" data-tadd>+ ${L2t("Champ", "Field")}</button></div>` : ""}</div>`;
}

/* ---------- column menu ---------- */
function bColMenu(sec, colId) {
  let dl = $("#btcm"); if (!dl) { dl = document.createElement("dialog"); dl.id = "btcm"; document.body.appendChild(dl); }
  const d = bOwn("t:" + sec, () => bTable(sec)), c = d.cols.find((x) => x.id === colId); if (!c) return;
  const types = { text: L2t("Texte", "Text"), choice: L2t("Choix", "Choice"), date: "Date", number: L2t("Nombre", "Number"), check: L2t("Case à cocher", "Checkbox"), link: L2t("Lien", "Link") };
  dl.innerHTML = `<form method="dialog"><div class="card-head"><h3>⋯ ${esc(c.name)}</h3><button class="x" value="cancel" formnovalidate>×</button></div>
    <label>${L2t("Nom", "Name")}<input name="name" value="${esc(c.name)}"></label>
    <label>Type<select name="type">${Object.entries(types).map(([k, l]) => `<option value="${k}" ${k === c.type ? "selected" : ""}>${l}</option>`).join("")}</select></label>
    ${c.shared ? `<p class="muted small">${L2t("Options : la liste « Activités » au-dessus du tableau.", "Options: the Activities list above the table.")}</p>`
      : `<label>${L2t("Options (pour Choix, une par ligne)", "Options (for Choice, one per line)")}<textarea name="opts" rows="5">${esc((c.opts || []).join("\n"))}</textarea></label>`}
    <p class="row-btns"><button class="btn btn-red" value="save">${t("save")}</button><button class="btn" value="del" formnovalidate>× ${L2t("Supprimer la colonne", "Delete column")}</button></p></form>`;
  dl.onclose = () => {
    const f = dl.querySelector("form");
    if (dl.returnValue === "save") { c.name = f.name.value.trim() || c.name; c.type = f.type.value; if (f.opts) c.opts = f.opts.value.split("\n").map((x) => x.trim()).filter(Boolean); }
    else if (dl.returnValue === "del") { if (!confirm(L2t("Supprimer cette colonne et ce qu'elle contient ?", "Delete this column and what it holds?"))) return; d.cols = d.cols.filter((x) => x.id !== colId); }
    else return;
    bSave("t:" + sec, true); boardPaint();
  };
  dl.showModal();
}

/* ---------- paint + events ---------- */
function boardPaint() { const box = $("#bsec"); if (!box || !BOARD.ctx) return; box.outerHTML = boardSection(BOARD.ctx); boardBind(); }
const bGrow = (el) => { el.style.height = "auto"; el.style.height = el.scrollHeight + 2 + "px"; };

function boardBind() {
  const ctx = BOARD.ctx, box = $("#bsec"); if (!box || !ctx) return;
  const sec = ctx.q.s, q = ctx.q;
  if (sec === "reviews") { ctx.bindReviews?.(); }
  $$("textarea", box).forEach(bGrow);
  const formKey = () => (sec === "header" ? "header" : q.e), tplKind = () => (sec === "header" ? "header" : q.e?.split(":")[1]);
  const metaSet = (k, val) => { const m = bOwn("meta", () => ({ t: {}, i: {} })); (m[k] ||= {})[sec] = val; bSave("meta"); };

  box.addEventListener("input", (ev) => {
    const el = ev.target; if (el.tagName === "TEXTAREA") bGrow(el);
    if (el.dataset.meta) return metaSet(el.dataset.meta, el.value);
    if (el.id === "bopts") { const d = bOwn("t:time", () => bTable("time")); d.opts = el.value.split("\n").map((x) => x.trim()).filter(Boolean); bSave("t:time"); return; }
    if (BTABLES.includes(sec)) {
      const key = "t:" + sec, d = bOwn(key, () => bTable(sec));
      if (el.dataset.hc) { const c = d.cols.find((x) => x.id === el.dataset.hc); if (c) { c.name = el.value; bSave(key); } return; }
      if (el.dataset.r) { const r = d.rows.find((x) => x.id === el.dataset.r); if (!r) return; (r.c ||= {})[el.dataset.c] = el.type === "checkbox" ? el.checked : el.value; bSave(key);
        const p = $(`[data-pct="${r.id}"]`, box); if (p) { const ch = d.cols.filter((c) => c.type === "check"); p.textContent = ch.length ? Math.round(ch.filter((c) => r.c[c.id]).length / ch.length * 100) + " %" : ""; } }
      return;
    }
    // forms: template edits, entry top fields, entry values
    if (el.dataset.tf) { const kind = tplKind(), tk = "tpl:" + kind, tpl = bOwn(tk, () => bTpl(kind)), f = tpl.fields.find((x) => x.id === el.dataset.tf); if (!f) return;
      const p = el.dataset.tp; f[p] = p === "n" ? Math.max(1, Math.min(20, +el.value || 1)) : p === "opts" ? el.value.split("\n").map((x) => x.trim()).filter(Boolean) : el.value; bSave(tk); return; }
    const key = formKey(); if (!key) return;
    const ent = bOwn(key, () => ({ v: {} })); ent.v ||= {};
    if (el.dataset.ef) { ent[el.dataset.ef] = el.value; bSave(key); return; }
    const fid = el.dataset.f; if (!fid) return;
    const f = bTpl(tplKind()).fields.find((x) => x.id === fid); if (!f) return;
    const i = +el.dataset.i;
    if (f.type === "lines") { (ent.v[fid] ||= [])[i] = el.value; }
    else if (f.type === "checks") { const l = (ent.v[fid] ||= []); l[i] ||= {}; if (el.type === "checkbox") l[i].on = el.checked; else l[i].t = el.value; }
    else if (f.type === "ratings") { (ent.v[fid] ||= {})[i] = +el.value || null; }
    else if (f.type === "grid") { const g = (ent.v[fid] ||= []); (g[i] ||= [])[+el.dataset.j] = el.value; }
    else ent.v[fid] = el.value;
    bSave(key);
  });
  box.addEventListener("change", (ev) => { const el = ev.target; if (el.type === "checkbox" || el.tagName === "SELECT") el.dispatchEvent(new Event("input", { bubbles: true })); });

  box.addEventListener("click", async (ev) => {
    const b = ev.target.closest("button"); if (!b || !box.contains(b)) return;
    const go = (o) => { location.hash = ctx.href(o); };
    if (b.dataset.cm) return bColMenu(sec, b.dataset.cm);
    if (BTABLES.includes(sec)) {
      const key = "t:" + sec, d = bOwn(key, () => bTable(sec));
      if (b.dataset.addc !== undefined) { const ty = d.addType || "text";
        d.cols.push({ id: bid(), name: ty === "check" ? L2t("Nouvelle habitude", "New habit") : ty === "choice-shared" ? "00:00" : L2t("Nouvelle colonne", "New column"), type: ty === "choice-shared" ? "choice" : ty, ...(ty === "choice-shared" ? { shared: true } : {}) });
        bSave(key, true); boardPaint(); const hs = $$("[data-hc]", $("#bsec")); hs.at(-1)?.select(); return; }
      if (b.dataset.addr !== undefined || b.dataset.today !== undefined) {
        const dc = d.cols.find((c) => c.type === "date");
        if (b.dataset.today !== undefined && dc && d.rows.some((r) => r.c?.[dc.id] === today())) return;
        const r = { id: bid(), c: b.dataset.today !== undefined && dc ? { [dc.id]: today() } : {} };
        d.dated ? d.rows.unshift(r) : d.rows.push(r); bSave(key, true); boardPaint(); return; }
      if (b.dataset.ckpt !== undefined) { const end = d.cols.findIndex((c) => c.type === "number" && /fin|end/i.test(c.name)), dt = new Date();
        const name = L2t("Note ", "Score ") + [dt.getDate(), dt.getMonth() + 1].map((x) => String(x).padStart(2, "0")).join(".") + "." + String(dt.getFullYear()).slice(2);
        d.cols.splice(end >= 0 ? end : d.cols.length, 0, { id: bid(), name, type: "number" }); bSave(key, true); boardPaint(); return; }
      if (b.dataset.rdel) { d.rows = d.rows.filter((r) => r.id !== b.dataset.rdel); bSave(key, true); boardPaint(); return; }
      return;
    }
    if (b.dataset.tpl !== undefined) return go({ tpl: q.tpl ? "" : "1" });
    if (b.dataset.enew) { const key = `e:${b.dataset.enew}:${bid()}`, v = {};
      bTpl(b.dataset.enew).fields.forEach((f) => { if (f.def) v[f.id] = f.def; });
      BOARD.items[key] = { date: today(), at: new Date().toISOString().slice(11, 19), title: "", v }; bSave(key, true); return go({ e: key, j: "" }); }
    if (b.dataset.edel !== undefined) { if (!confirm(L2t("Supprimer cette page ?", "Delete this page?"))) return; await bDrop(q.e); return go({ e: "", tpl: "" }); }
    const kind = tplKind(); if (!kind) return;
    if (b.dataset.pick != null && b.dataset.f) { const key = formKey(), ent = bOwn(key, () => ({ v: {} })), f = bTpl(kind).fields.find((x) => x.id === b.dataset.f); ent.v ||= {};
      const val = f.type === "rating" ? +b.dataset.pick : b.dataset.pick; ent.v[f.id] = ent.v[f.id] === val ? null : val;
      $$(`[data-f="${f.id}"][data-pick]`, box).forEach((x) => x.classList.toggle("on", String(ent.v[f.id]) === x.dataset.pick)); bSave(key); return; }
    const tk = "tpl:" + kind;
    if (b.dataset.tadd !== undefined) { const tpl = bOwn(tk, () => bTpl(kind)), ty = $("#btype").value;
      tpl.fields.push({ id: bid(), type: ty, label: L2t("Nouveau champ", "New field"), ...(["lines", "checks", "grid"].includes(ty) ? { n: 3 } : {}), ...(["choice", "ratings", "grid"].includes(ty) ? { opts: ["A", "B", "C"] } : {}) });
      bSave(tk, true); boardPaint(); return; }
    if (b.dataset.tdel) { if (!confirm(L2t("Supprimer ce champ du modèle ?", "Delete this field from the template?"))) return; const tpl = bOwn(tk, () => bTpl(kind)); tpl.fields = tpl.fields.filter((x) => x.id !== b.dataset.tdel); bSave(tk, true); boardPaint(); return; }
    if (b.dataset.tmv) { const tpl = bOwn(tk, () => bTpl(kind)), i = tpl.fields.findIndex((x) => x.id === b.dataset.tid), j = i + +b.dataset.tmv;
      if (i < 0 || j < 0 || j >= tpl.fields.length) return; [tpl.fields[i], tpl.fields[j]] = [tpl.fields[j], tpl.fields[i]]; bSave(tk, true); boardPaint(); return; }
  });
}

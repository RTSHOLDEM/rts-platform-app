/* ---------- Études: study notes like OneNote (Alexis 2026-11-18) ----------
   Left, the folders (an RTS tree proposed to everyone + the player's own). Middle, the pages of the folder. Right, the page itself, full height.
   A page saves itself while you type (and a copy stays in this browser until the server has it), so a note is never lost:
   another tab, another note, another page of the app, a crash. Folders: right-click for new note, sub-folder, rename, delete (asks first);
   click a selected folder again (or double-click) to rename it. A page can carry a situation (format, pot, positions, board in 4 colours,
   picked like on GTO Wizard): it files itself in the matching folder, created if missing. A study session started here stays on this page:
   its page is the live note, with the clock on top. Rows: one study session per page (0 min when written outside a session). */
Object.assign(STRINGS.en, {
  nbNotes: "Notes", nbNewNote: "New note", nbNewFolder: "New folder", nbNewSub: "New sub-folder", nbRename: "Rename", nbDelete: "Delete", nbMove: "Move to…",
  nbAll: "All notes", nbNone: "No folder", nbRts: "RTS tree", nbMine: "My folders", nbUntitled: "Untitled", nbTitlePh: "Title",
  nbBodyPh: "Write here. Bold, underline, colours, cards: the bar above. Saved as you type.", nbSaving: "Saving…", nbSaved: "Saved ✓", nbOffline: "Kept in this browser, will save",
  nbPick: "Pick a note on the left or create one.", nbEmptyF: "No note in this folder yet.", nbSearch: "Search my notes…",
  nbDelFolder: "Delete the folder “{f}” and its sub-folders? Its notes go to “No folder”.", nbDelNote: "Delete the note “{f}”? It stays 30 days in the Trash.",
  nbSure: "Are you sure?", nbCancel: "Cancel", nbFolderName: "Folder name", nbCreate: "Create", nbSpot: "Situation", nbSpotSet: "Pick the situation",
  nbFormat: "Format", nbPot: "Pot", nbHero: "Me", nbVillain: "Against", nbBoard: "Board", nbClear: "Clear", nbApply: "Apply", nbCards: "Cards", nbInsert: "Insert",
  nbStartStudy: "Start a study session", nbLive: "Study session live", nbEnd: "End", nbHere: "New note here", nbFiled: "Filed in", nbSeedRts: "Add the RTS tree",
  nbBold: "Bold", nbItalic: "Italic", nbUnder: "Underline", nbStrike: "Strike", nbH: "Heading", nbList: "List", nbNum: "Numbered list", nbColor: "Text colour", nbMark: "Highlight", nbClearF: "Clear formatting",
});
Object.assign(STRINGS.fr, {
  nbNotes: "Notes", nbNewNote: "Nouvelle note", nbNewFolder: "Nouveau dossier", nbNewSub: "Nouveau sous-dossier", nbRename: "Renommer", nbDelete: "Supprimer", nbMove: "Déplacer vers…",
  nbAll: "Toutes les notes", nbNone: "Sans dossier", nbRts: "Arborescence RTS", nbMine: "Mes dossiers", nbUntitled: "Sans titre", nbTitlePh: "Titre",
  nbBodyPh: "Écris ici. Gras, souligné, couleurs, cartes : la barre au-dessus. Enregistré pendant que tu tapes.", nbSaving: "Enregistrement…", nbSaved: "Enregistré ✓", nbOffline: "Gardé dans ce navigateur, sera enregistré",
  nbPick: "Choisis une note à gauche ou crées-en une.", nbEmptyF: "Pas encore de note dans ce dossier.", nbSearch: "Chercher dans mes notes…",
  nbDelFolder: "Supprimer le dossier « {f} » et ses sous-dossiers ? Ses notes vont dans « Sans dossier ».", nbDelNote: "Supprimer la note « {f} » ? Elle reste 30 jours dans la corbeille.",
  nbSure: "Tu es sûr ?", nbCancel: "Annuler", nbFolderName: "Nom du dossier", nbCreate: "Créer", nbSpot: "Situation", nbSpotSet: "Choisir la situation",
  nbFormat: "Format", nbPot: "Pot", nbHero: "Moi", nbVillain: "Contre", nbBoard: "Board", nbClear: "Effacer", nbApply: "Valider", nbCards: "Cartes", nbInsert: "Insérer",
  nbStartStudy: "Lancer une session d'étude", nbLive: "Session d'étude en cours", nbEnd: "Terminer", nbHere: "Nouvelle note ici", nbFiled: "Rangée dans", nbSeedRts: "Ajouter l'arborescence RTS",
  nbBold: "Gras", nbItalic: "Italique", nbUnder: "Souligné", nbStrike: "Barré", nbH: "Titre", nbList: "Liste", nbNum: "Liste numérotée", nbColor: "Couleur du texte", nbMark: "Surligner", nbClearF: "Enlever la mise en forme",
});

const NB_ROOTS = ["6-max", "Heads-up"]; // the proposed RTS tree; every other root folder is the player's own
const NB_SEED = ["6-max", "6-max/Preflop", "6-max/SRP", "6-max/SRP/BTN vs BB", "6-max/SRP/CO vs BB", "6-max/SRP/SB vs BB", "6-max/SRP/BB vs BTN", "6-max/SRP/BB vs CO", "6-max/SRP/BB vs SB",
  "6-max/3BP", "6-max/3BP/BTN vs CO", "6-max/3BP/CO vs BTN", "6-max/3BP/BB vs BTN", "6-max/3BP/SB vs BTN", "6-max/4BP", "6-max/Multiway",
  "Heads-up", "Heads-up/Preflop", "Heads-up/SRP", "Heads-up/SRP/BTN vs BB", "Heads-up/SRP/BB vs BTN", "Heads-up/3BP", "Heads-up/3BP/BTN vs BB", "Heads-up/3BP/BB vs BTN", "Heads-up/4BP"];
const NB_SUIT = { s: "♠", h: "♥", d: "♦", c: "♣" };
const NB_RANKS = "AKQJT98765432".split("");
const NB_POS = { "6-max": ["UTG", "HJ", "CO", "BTN", "SB", "BB"], "Heads-up": ["BTN", "BB"] };
const NB_POTS = ["SRP", "3BP", "4BP", "Limp", "Multiway"];
const NB_COLORS = [["", "Auto"], ["#ff4d4d", "Red"], ["#3ddc84", "Green"], ["#4da3ff", "Blue"], ["#ffc14d", "Yellow"], ["#c48bff", "Purple"]];
const NB_MARKS = [["transparent", "None"], ["rgba(255,193,77,.35)", "Yellow"], ["rgba(61,220,132,.3)", "Green"], ["rgba(77,163,255,.3)", "Blue"], ["rgba(255,77,77,.3)", "Red"]];
const pcard = (c, cls = "") => `<span class="pk ${c[1]} ${cls}" contenteditable="false" data-c="${c}">${c[0]}<i>${NB_SUIT[c[1]]}</i></span>`;
const NB = { cur: null, timer: null, dirty: false, saving: null };
const nbKey = (id) => "rts-nb-" + id;
const nbLS = {
  get(id) { try { return JSON.parse(localStorage.getItem(nbKey(id)) || "null"); } catch { return null; } },
  set(id, v) { try { localStorage.setItem(nbKey(id), JSON.stringify(v)); } catch {} },
  drop(id) { try { localStorage.removeItem(nbKey(id)); } catch {} },
};
const nbOpen = { get() { try { return new Set(JSON.parse(localStorage.getItem("rts-nb-open") || "[]")); } catch { return new Set(); } },
  set(s) { try { localStorage.setItem("rts-nb-open", JSON.stringify([...s])); } catch {} } };

/* Rich text kept to a short safe list: what the toolbar makes, nothing a pasted page could smuggle in. */
function nbClean(html) {
  const doc = new DOMParser().parseFromString(`<div>${html || ""}</div>`, "text/html"), root = doc.body.firstElementChild;
  const OK = new Set(["B", "STRONG", "I", "EM", "U", "S", "STRIKE", "BR", "DIV", "P", "UL", "OL", "LI", "H2", "H3", "SPAN", "FONT", "BLOCKQUOTE"]);
  const COL = /^(#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\)|transparent)$/i;
  const walk = (n) => [...n.childNodes].forEach((ch) => {
    if (ch.nodeType === 3) return;
    if (ch.nodeType !== 1) { ch.remove(); return; }
    if (!OK.has(ch.tagName)) { if (["SCRIPT", "STYLE", "IFRAME", "OBJECT", "EMBED", "IMG", "SVG", "VIDEO", "AUDIO", "LINK", "META"].includes(ch.tagName)) ch.remove(); else { walk(ch); ch.replaceWith(...ch.childNodes); } return; }
    const card = ch.tagName === "SPAN" && ch.classList.contains("pk") ? ch.getAttribute("data-c") : null;
    const color = ch.style?.color || (ch.tagName === "FONT" ? ch.getAttribute("color") : ""), bg = ch.style?.backgroundColor || "";
    [...ch.attributes].forEach((a) => ch.removeAttribute(a.name));
    if (card && /^[AKQJT2-9][shdc]$/.test(card)) { ch.outerHTML = pcard(card); return; }
    if (color && COL.test(color.trim())) ch.style.color = color.trim();
    if (bg && COL.test(bg.trim())) ch.style.backgroundColor = bg.trim();
    walk(ch);
  });
  walk(root);
  return root.innerHTML;
}
const nbText = (html) => { const d = document.createElement("div"); d.innerHTML = nbClean(html); $$(".pk", d).forEach((c) => c.replaceWith(c.dataset.c)); d.querySelectorAll("br").forEach((b) => b.replaceWith("\n")); d.querySelectorAll("div,p,li,h2,h3").forEach((b) => b.append("\n")); return d.textContent.replace(/\n{3,}/g, "\n\n").trim(); };
const nbHtmlOf = (s) => s.notes_html != null ? nbClean(s.notes_html) : esc(s.notes || "").replace(/\n/g, "<br>");
const nbTitleOf = (s) => (s.title || "").trim() || (s.notes || "").trim().split("\n")[0].slice(0, 60) || t("nbUntitled");

/* Save the page now (leaving it, another page, closing the tab). The browser copy is written on every key, so even a failed save loses nothing. */
async function nbFlush() {
  const c = NB.cur; if (!c) return;
  clearTimeout(NB.timer);
  if (!NB.dirty) return;
  NB.dirty = false;
  const row = { id: c.id, title: c.title, notes_html: c.html, notes: nbText(c.html) };
  const mark = (k) => { const el = $("#nbsaved"); if (el && NB.cur === c) el.textContent = t(k); };
  mark("nbSaving");
  try { NB.saving = db.saveSession(row); await NB.saving; const d = nbLS.get(c.id); if (d && d.h === c.html && d.t === c.title) nbLS.drop(c.id); mark("nbSaved"); }
  catch { NB.dirty = true; mark("nbOffline"); clearTimeout(NB.timer); NB.timer = setTimeout(nbFlush, 5000); }
  finally { NB.saving = null; }
}
addEventListener("pagehide", () => { nbFlush(); });
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") nbFlush(); });

async function viewStudyNotes() {
  const my = RENDER;
  const q = Object.fromEntries(new URLSearchParams(location.hash.split("?")[1] || ""));
  const href = (o) => { const p = new URLSearchParams(Object.entries({ ...q, ...o }).filter(([, v]) => v)); return "#/study" + (p.toString() ? "?" + p : ""); };
  let [sess, saved, openS] = await Promise.all([db.sessions(ME.id, daysAgo(730)), db.folders().catch(() => []), db.openSession(ME.id).catch(() => null)]);
  if (my !== RENDER) return;
  // the running session, read here too: the page can draw before the dock has loaded it
  if (openS && !SES.s) { SES.s = openS; if (!SES.beat) SES.beat = setInterval(sesBeat, 1000); paintDock(); }
  const running = SES.s || openS, liveId = running && running.kind === "study" ? running.id : null;
  // the RTS tree, once per player (never back after he deletes it: a mark in this browser, and any 6-max/Heads-up folder means it was given)
  let seeded = false; try { seeded = localStorage.getItem("rts-nb-seed-" + ME.id) === "1"; } catch {}
  let rtsR = await db.rtsRoots().catch(() => []);
  if (!seeded && !rtsR.length && !saved.some((p) => NB_ROOTS.includes(p.split("/")[0]))) { await db.addFolders(NB_SEED).catch(() => {}); await db.setGroup(NB_ROOTS, "rts").catch(() => {}); saved = await db.folders().catch(() => saved); rtsR = [...NB_ROOTS]; }
  // the RTS group = top folders marked 'rts' (editable: rename, add, delete); old folders get their mark here once
  if (!rtsR.length) { const r = saved.filter((p) => NB_ROOTS.includes(p)); if (r.length) { await db.setGroup(r, "rts").catch(() => {}); rtsR = r; } }
  const rtsSet = new Set(rtsR);
  try { localStorage.setItem("rts-nb-seed-" + ME.id, "1"); } catch {}
  const all = sess.filter((s) => s.kind === "study" && (s.ended_at || s.id === liveId) && !s._gone).sort((a, b) => (a.started_at < b.started_at ? 1 : -1));
  const notes = all.filter((s) => (s.notes || "").trim() || (s.title || "").trim() || s.notes_html || s.spot || s.id === liveId || q.n === s.id);
  // poker order first (Preflop, SRP, 3BP, 4BP, Limp, Multiway), then A to Z
  const ORD = ["6-max", "Heads-up", "Preflop", "SRP", "3BP", "4BP", "Limp", "Multiway"], rk = (x) => { const i = ORD.indexOf(x); return i < 0 ? 99 : i; };
  const byPoker = (a, b) => { const A = a.split("/"), B = b.split("/"); for (let i = 0; i < Math.min(A.length, B.length); i++) { if (A[i] !== B[i]) return rk(A[i]) - rk(B[i]) || A[i].localeCompare(B[i], "fr", { numeric: true }); } return A.length - B.length; };
  const paths = [...new Set([...saved, ...notes.map((s) => s.folder).filter(Boolean)].flatMap((p) => p.split("/").map((_, i, a) => a.slice(0, i + 1).join("/"))))].sort(byPoker);
  const inF = (s, f) => f === "~" ? !s.folder : !f || s.folder === f || (s.folder || "").startsWith(f + "/");
  const leaf = (p) => p.split("/").pop(), depth = (p) => p.split("/").length - 1;
  const n = (f) => notes.filter((s) => inF(s, f)).length;
  const open = nbOpen.get(); if (q.f && q.f !== "~") q.f.split("/").forEach((_, i, a) => open.add(a.slice(0, i + 1).join("/")));
  const cur = q.n ? all.find((s) => s.id === q.n) || null : null;
  if (cur?.folder && !q.f) cur.folder.split("/").slice(0, -1).forEach((_, i, a) => open.add(a.slice(0, i + 1).join("/")));
  const hours = all.filter((s) => s.started_at >= monthStart()).reduce((a, s) => a + Number(s.minutes || 0), 0) / 60;
  const live = liveId ? running : null;

  const ICO = {
    folder: `<svg viewBox="0 0 24 24" class="nb-svg"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="currentColor" opacity=".9"/></svg>`,
    newf: `<svg viewBox="0 0 24 24" class="nb-svg"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 10.5v5M9.5 13h5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`,
    subf: `<svg viewBox="0 0 24 24" class="nb-svg"><path d="M4 4v9a2 2 0 0 0 2 2h3" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M10 11a1.5 1.5 0 0 1 1.5-1.5h2.5l1.5 1.5h5a1.5 1.5 0 0 1 1.5 1.5v5.5a1.5 1.5 0 0 1-1.5 1.5h-9a1.5 1.5 0 0 1-1.5-1.5z" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>`,
    pen: `<svg viewBox="0 0 24 24" class="nb-svg"><path d="M4 20h4L19 9l-4-4L4 16z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M13.5 6.5l4 4" stroke="currentColor" stroke-width="1.7"/></svg>`,
  };
  const node = (p) => {
    const kids = paths.filter((x) => x.startsWith(p + "/") && depth(x) === depth(p) + 1), isOpen = open.has(p);
    return `<div class="nb-node"><div class="nb-f ${q.f === p ? "on" : ""}" data-f="${esc(p)}" style="--d:${depth(p)}" tabindex="0">
        <button type="button" class="nb-tw ${kids.length ? "" : "nokid"} ${isOpen ? "open" : ""}" data-tw="${esc(p)}" tabindex="-1">▸</button>${ICO.folder}<span class="nb-fn">${esc(leaf(p))}</span><small>${n(p) || ""}</small></div>
      ${kids.length && isOpen ? `<div class="nb-kids">${kids.map(node).join("")}</div>` : ""}</div>`;
  };
  const roots = paths.filter((p) => !p.includes("/")), rts = roots.filter((p) => rtsSet.has(p)), mine = roots.filter((p) => !rtsSet.has(p));
  const list = notes.filter((s) => inF(s, q.f));
  const pageRow = (s) => `<a class="nb-pg ${q.n === s.id ? "on" : ""} ${live && live.id === s.id ? "live" : ""}" href="${href({ n: s.id })}" data-pg="${s.id}" data-txt="${esc((nbTitleOf(s) + " " + (s.notes || "") + " " + (s.folder || "")).toLowerCase())}">
      <b>${live && live.id === s.id ? `<i class="nb-dot"></i>` : ""}${esc(nbTitleOf(s))}</b>
      <small>${fmtDay(s.started_at.slice(0, 10))} · ${hhmm(s.started_at)}${Number(s.minutes) ? " · " + dur(Number(s.minutes)) : ""}</small>
      ${s.spot?.board?.length ? `<span class="nb-mini">${s.spot.board.map((c) => pcard(c, "xs")).join("")}</span>` : (s.notes || "").trim() ? `<span class="nb-snip">${esc((s.notes || "").replace(/\s+/g, " ").slice(0, 70))}</span>` : ""}</a>`;
  const where = q.f === "~" ? t("nbNone") : q.f ? q.f.split("/").join(" › ") : t("nbAll");

  const spotChips = (sp) => sp ? `${sp.format ? `<span class="tag">${esc(sp.format)}</span>` : ""}${sp.pot ? `<span class="tag">${esc(sp.pot)}</span>` : ""}${sp.hero ? `<span class="tag">${esc(sp.hero)}${sp.villain ? " vs " + esc(sp.villain) : ""}</span>` : ""}${(sp.board || []).length ? `<span class="nb-board">${sp.board.map((c) => pcard(c)).join("")}</span>` : ""}` : "";
  const fOpts = (curF) => `<option value="">📥 ${t("nbNone")}</option>` + paths.map((p) => `<option value="${esc(p)}" ${p === curF ? "selected" : ""}>${esc(p.split("/").join(" › "))}</option>`).join("");
  const tb = (cmd, label, tip, extra = "") => `<button type="button" class="nb-tbb" data-cmd="${cmd}" ${extra} title="${tip}" tabindex="-1">${label}</button>`;
  const page = cur ? `<article class="card nb-page" id="nbpage">
      ${live && live.id === cur.id ? `<div class="nb-livebar ${live.paused_at ? "paused" : ""}"><i class="nb-dot"></i>${t("nbLive")} · <b data-left>${sesClock(live)}</b><span class="nb-lb"><button type="button" class="btn btn-sm" id="nbpause">${live.paused_at ? "▶ " + t("resume") : "⏸ " + t("pause")}</button><button type="button" class="btn btn-sm btn-red" id="nbend">■ ${t("nbEnd")}</button></span></div>` : ""}
      <div class="nb-ph"><input class="nb-title sensitive" id="nbtitle" value="${esc(cur.title || "")}" placeholder="${t("nbTitlePh")}" maxlength="140" autocomplete="off"><span class="saved" id="nbsaved"></span></div>
      <div class="nb-meta"><span class="muted">${longDay(cur.started_at.slice(0, 10))} · ${hhmm(cur.started_at)}</span>
        <label class="nb-mv" title="${t("nbMove")}">📁 <select id="nbmv">${fOpts(cur.folder || "")}</select></label>
        <span class="nb-spot" id="nbspotv">${spotChips(cur.spot)}</span>
        <button type="button" class="btn btn-sm nb-spotb" id="nbspotb">🂠 ${cur.spot ? t("nbSpot") : t("nbSpotSet")}</button>
        <button type="button" class="btn btn-sm nb-histb" id="nbhist" title="${t("nbHistTip")}">🕘 ${t("nbHist")}</button>
        ${cur.hand_id ? `<a class="btn btn-sm" href="#/hands?h=${cur.hand_id}">🃏 ${t("nbHand")}</a>` : ""}</div>
      <div class="nb-tb" id="nbtb">
        ${tb("bold", "<b>B</b>", t("nbBold"))}${tb("italic", "<i>I</i>", t("nbItalic"))}${tb("underline", "<u>U</u>", t("nbUnder"))}${tb("strikeThrough", "<s>S</s>", t("nbStrike"))}<i class="nb-sep"></i>
        <span class="nb-sw" title="${t("nbColor")}">A${NB_COLORS.map(([c, l]) => `<button type="button" class="nb-col" data-color="${c}" style="--c:${c || "var(--text)"}" title="${l}" tabindex="-1"></button>`).join("")}</span><i class="nb-sep"></i>
        <span class="nb-sw" title="${t("nbMark")}">🖍${NB_MARKS.map(([c, l]) => `<button type="button" class="nb-col mk" data-mark="${c}" style="--c:${c}" title="${l}" tabindex="-1"></button>`).join("")}</span><i class="nb-sep"></i>
        ${tb("h", "H", t("nbH"))}${tb("insertUnorderedList", "•", t("nbList"))}${tb("insertOrderedList", "1.", t("nbNum"))}${tb("removeFormat", "⌫", t("nbClearF"))}<i class="nb-sep"></i>
        <button type="button" class="nb-tbb nb-cardsb" id="nbcards" tabindex="-1">🂠 ${t("nbCards")}</button></div>
      <div class="nb-body sensitive" id="nbbody" contenteditable="true" spellcheck="true" data-ph="${t("nbBodyPh")}">${nbHtmlOf(cur)}</div></article>`
    : `<article class="card nb-page nb-empty"><p class="muted">${list.length || !q.f ? t("nbPick") : t("nbEmptyF")}</p><button type="button" class="btn btn-red" data-nbnew>${ICO.pen} ${t("nbNewNote")}</button></article>`;

  $("#main").innerHTML = `<div class="nb" id="nb">
    <aside class="card nb-tree">
      <div class="nb-th"><b>${t("nbNotes")}</b><span class="nb-ic"><button type="button" class="nb-icb" data-nbnewf="" title="${t("nbNewFolder")}">${ICO.newf}</button><button type="button" class="nb-icb red" data-nbnew title="${t("nbNewNote")}">${ICO.pen}</button></span></div>
      <div class="nb-sc" data-sescard="study">${sesCardHtml("study")}</div>${live && q.n !== live.id ? `<a class="nb-livego" href="${href({ n: live.id })}">✎ ${t("scOpenNote")} →</a>` : ""}
      <small class="muted nb-stat">${t("ckStMonth")} <b>${fmtH(hours)}</b> · ${notes.length} ${t("stNotesN")}</small>
      <div class="nb-scroll" id="nbtree">
        <a class="nb-f top ${!q.f ? "on" : ""}" href="${href({ f: "", n: q.n })}">📒 <span class="nb-fn">${t("nbAll")}</span><small>${notes.length}</small></a>
        <a class="nb-f top ${q.f === "~" ? "on" : ""}" href="${href({ f: "~", n: q.n })}">📥 <span class="nb-fn">${t("nbNone")}</span><small>${n("~") || ""}</small></a>
        <p class="nb-grp">${t("nbRts")}<button type="button" class="nb-icb sm" data-nbnewf="" data-grp="rts" title="${t("nbNewFolder")}">${ICO.newf}</button></p>${rts.map(node).join("") || `<button type="button" class="small-link" id="nbseed">+ ${t("nbSeedRts")}</button>`}
        <p class="nb-grp">${t("nbMine")}<button type="button" class="nb-icb sm" data-nbnewf="" title="${t("nbNewFolder")}">${ICO.newf}</button></p>${mine.map(node).join("")}
      </div>
      <button type="button" class="nb-f top nb-trashb" id="nbtrash">🗑 <span class="nb-fn">${t("nbTrash")}</span><small id="nbtrashn"></small></button>
    </aside>
    <section class="card nb-pages">
      <div class="nb-pgh"><b title="${esc(where)}">${esc(where)}</b><button type="button" class="nb-icb red" data-nbnew title="${t("nbNewNote")}">${ICO.pen}</button></div>
      <input type="search" id="nbq" class="sensitive" placeholder="${t("nbSearch")}">
      <div class="nb-scroll" id="nbpages">${list.map(pageRow).join("") || `<p class="muted small nb-none">${t("nbEmptyF")}</p>`}</div>
    </section>
    ${page}
  </div>
  <div class="nb-menu" id="nbmenu" hidden></div>
  <dialog id="nbask" class="card nb-ask"></dialog>
  <dialog id="nbspot" class="card nb-spotd"></dialog>
  <dialog id="nbsafe" class="card nb-safe"></dialog>`;
  fitToDock("#nb");
  db.noteTrash().then((l) => { const el = $("#nbtrashn"); if (el) el.textContent = l.length || ""; }).catch(() => {});
  $("#nbtrash").onclick = async () => { await nbFlush(); nbTrashDlg((id) => { NB.cur = null; NB.dirty = false; go({ f: "", n: id }); route(); }); };

  // ---------- folders ----------
  const go = (o) => { location.hash = href(o); };
  const newNote = async (folder) => {
    await nbFlush();
    const at = new Date().toISOString();
    const x = await db.addSession({ kind: "study", started_at: at, ended_at: at, minutes: 0, topic: "wizard", folder: folder || null, title: "", notes: "", notes_html: "" });
    go({ n: x.id, f: q.f });
    setTimeout(() => $("#nbtitle")?.focus(), 350);
  };
  $$("[data-nbnew]").forEach((b) => b.onclick = () => newNote(q.f && q.f !== "~" ? q.f : cur?.folder || ""));
  const ask = (html, okLabel, red = true) => new Promise((res) => {
    const d = $("#nbask");
    d.innerHTML = `<form method="dialog">${html}<p class="row-btns"><button class="btn ${red ? "btn-red" : "btn-red"}" value="ok">${okLabel}</button><button class="btn" value="no" formnovalidate>${t("nbCancel")}</button></p></form>`;
    d.onclose = () => res(d.returnValue === "ok" ? (d.querySelector("input")?.value ?? true) : null);
    d.showModal(); d.querySelector("input")?.focus();
  });
  const folderName = async (title, val = "") => { const v = await ask(`<div class="card-head"><h3>${title}</h3></div><input name="name" required maxlength="60" value="${esc(val)}" placeholder="${t("nbFolderName")}" autocomplete="off">`, t("nbCreate"));
    return v && typeof v === "string" ? v.replace(/\//g, "-").trim() : null; };
  const addFolder = async (parent, grp = null) => {
    const name = await folderName(parent ? `${t("nbNewSub")} · ${parent.split("/").join(" › ")}` : grp ? `${t("nbNewFolder")} · ${t("nbRts")}` : t("nbNewFolder")); if (!name) return;
    const path = parent ? parent + "/" + name : name;
    await db.addFolders([path]); if (grp) await db.setGroup([path], grp); if (parent) { open.add(parent); nbOpen.set(open); } go({ f: path });
  };
  $$("[data-nbnewf]").forEach((b) => b.onclick = () => addFolder("", b.dataset.grp || null));
  const renameFolder = (row) => {
    const p = row.dataset.f, span = row.querySelector(".nb-fn"); if (!span || span.isContentEditable) return;
    span.contentEditable = "true"; span.focus(); document.getSelection().selectAllChildren(span);
    const done = async (keep) => {
      span.contentEditable = "false"; span.onblur = span.onkeydown = null;
      const name = span.textContent.replace(/\//g, "-").trim();
      if (!keep || !name || name === leaf(p)) { span.textContent = leaf(p); return; }
      const to = (p.includes("/") ? p.slice(0, p.lastIndexOf("/") + 1) : "") + name;
      if (paths.includes(to)) { span.textContent = leaf(p); return; }
      await nbFlush(); await db.renameFolder(p, to);
      if (open.has(p)) { open.delete(p); open.add(to); nbOpen.set(open); }
      const cf = new URLSearchParams(location.hash.split("?")[1] || "").get("f") || ""; // the folder open now (a double-click may have just opened it)
      const nf = cf && (cf === p || cf.startsWith(p + "/")) ? to + cf.slice(p.length) : cf;
      if (nf !== cf) go({ f: nf }); else route();
    };
    span.onkeydown = (e) => { if (e.key === "Enter") { e.preventDefault(); done(true); } if (e.key === "Escape") { e.preventDefault(); done(false); } };
    span.onblur = () => done(true);
  };
  const delFolder = async (p) => {
    if (!(await ask(`<div class="card-head"><h3>⚠️ ${t("nbSure")}</h3></div><p>${esc(t("nbDelFolder").replace("{f}", p.split("/").join(" › ")))}</p>`, t("nbDelete")))) return;
    await nbFlush(); await db.dropFolder(p); go({ f: q.f && (q.f === p || q.f.startsWith(p + "/")) ? "" : q.f });
  };
  $$(".nb-f[data-f]").forEach((row) => {
    const p = row.dataset.f;
    row.onclick = (e) => {
      if (e.target.closest("[data-tw]")) return;
      if (row.querySelector(".nb-fn").isContentEditable) return;
      if (q.f === p && e.target.closest(".nb-fn")) { renameFolder(row); return; } // click the selected folder's name again: rename (like Finder)
      go({ f: p });
    };
    row.ondblclick = (e) => { e.preventDefault(); renameFolder(row); };
    row.onkeydown = (e) => { if (e.key === "F2") renameFolder(row); };
    row.oncontextmenu = (e) => { e.preventDefault(); menu(e, [
      ["✎", t("nbHere"), () => newNote(p)], ["sub", t("nbNewSub"), () => addFolder(p)], ["Aa", t("nbRename"), () => renameFolder(row)],
      ...(p.includes("/") ? [] : [["⇄", rtsSet.has(p) ? t("nbToMine") : t("nbToRts"), async () => { await db.setGroup([p], rtsSet.has(p) ? null : "rts"); route(); }]]),
      ["🗑", t("nbDelete"), () => delFolder(p), "danger"]]); };
  });
  $$("[data-tw]").forEach((b) => b.onclick = (e) => { e.preventDefault(); e.stopPropagation(); const p = b.dataset.tw; open.has(p) ? open.delete(p) : open.add(p); nbOpen.set(open); route(); });
  $("#nbseed")?.addEventListener("click", async () => { await db.addFolders(NB_SEED); await db.setGroup(NB_ROOTS, "rts"); route(); });

  // right-click menu
  function menu(e, items) {
    const m = $("#nbmenu");
    m.innerHTML = items.map(([i, l, , cls], k) => `<button type="button" class="${cls || ""}" data-k="${k}"><span>${i === "sub" ? ICO.subf : i}</span>${l}</button>`).join("");
    m.hidden = false; m.style.left = Math.min(e.clientX, innerWidth - 230) + "px"; m.style.top = Math.min(e.clientY, innerHeight - items.length * 38 - 20) + "px";
    $$("button", m).forEach((b) => b.onclick = () => { m.hidden = true; items[+b.dataset.k][2](); });
    const off = (ev) => { if (!m.contains(ev.target)) { m.hidden = true; removeEventListener("mousedown", off, true); } };
    setTimeout(() => addEventListener("mousedown", off, true));
    addEventListener("keydown", function esc1(ev) { if (ev.key === "Escape") { m.hidden = true; removeEventListener("keydown", esc1); } });
  }

  // ---------- pages ----------
  const delNote = async (s) => {
    if (!(await ask(`<div class="card-head"><h3>⚠️ ${t("nbSure")}</h3></div><p>${esc(t("nbDelNote").replace("{f}", nbTitleOf(s)))}</p>`, t("nbDelete")))) return;
    if (NB.cur?.id === s.id) { NB.cur = null; NB.dirty = false; clearTimeout(NB.timer); }
    nbLS.drop(s.id);
    // a page that carries study time keeps the time (the hours stay right): only its writing goes
    if (Number(s.minutes) > 0 || s.id === liveId) await db.saveSession({ id: s.id, title: null, notes: null, notes_html: null, spot: null, folder: null });
    else await db.dropSession(s.id);
    go({ n: q.n === s.id ? "" : q.n });
  };
  $$("[data-pg]").forEach((a) => {
    const s = notes.find((x) => x.id === a.dataset.pg);
    a.oncontextmenu = (e) => { e.preventDefault(); menu(e, [
      ["Aa", t("nbRename"), () => { if (q.n !== s.id) { go({ n: s.id }); setTimeout(() => { const ti = $("#nbtitle"); ti?.focus(); ti?.select(); }, 400); } else { $("#nbtitle").focus(); $("#nbtitle").select(); } }],
      ["📁", t("nbMove"), async () => { if (q.n !== s.id) go({ n: s.id }); setTimeout(() => { const sel = $("#nbmv"); sel?.focus(); sel?.showPicker?.(); }, 400); }],
      ["🗑", t("nbDelete"), () => delNote(s), "danger"]]); };
  });
  $("#nbq").oninput = (e) => { const w = e.target.value.trim().toLowerCase(); $$(".nb-pg").forEach((a) => (a.hidden = !!w && !a.dataset.txt.includes(w))); };
  $("[data-stgo]")?.addEventListener("click", () => sesGo("study"));

  if (!cur) { NB.cur = null; return; }

  // ---------- the page ----------
  const body = $("#nbbody"), title = $("#nbtitle");
  let html = nbHtmlOf(cur), ttl = cur.title || "";
  const draft = nbLS.get(cur.id);
  if (draft && (draft.h !== html || draft.t !== ttl)) { html = nbClean(draft.h); ttl = draft.t || ""; body.innerHTML = html; title.value = ttl; NB.dirty = true; } // a copy the server never got: it wins
  NB.cur = { id: cur.id, title: ttl, html };
  const changed = () => {
    NB.cur.title = title.value; NB.cur.html = nbClean(body.innerHTML);
    nbLS.set(cur.id, { t: NB.cur.title, h: NB.cur.html, at: Date.now() });
    NB.dirty = true; $("#nbsaved").textContent = "…";
    clearTimeout(NB.timer); NB.timer = setTimeout(nbFlush, 700);
    const row = $(`[data-pg="${cur.id}"] b`); if (row) row.lastChild.textContent = title.value.trim() || nbText(NB.cur.html).split("\n")[0].slice(0, 60) || t("nbUntitled");
  };
  if (NB.dirty) { clearTimeout(NB.timer); NB.timer = setTimeout(nbFlush, 300); }
  title.oninput = changed;
  title.onkeydown = (e) => { if (e.key === "Enter") { e.preventDefault(); body.focus(); } };
  body.oninput = changed;
  body.onpaste = (e) => { e.preventDefault(); const txt = e.clipboardData.getData("text/plain"); document.execCommand("insertText", false, txt); };
  body.onkeydown = (e) => {
    const k = e.key.toLowerCase();
    if ((e.metaKey || e.ctrlKey) && ["b", "i", "u"].includes(k)) { e.preventDefault(); document.execCommand({ b: "bold", i: "italic", u: "underline" }[k]); changed(); }
    if (k === "tab") { e.preventDefault(); document.execCommand(e.shiftKey ? "outdent" : "indent"); changed(); }
  };
  document.execCommand("styleWithCSS", false, true);
  // toolbar: mousedown keeps the selection in the page
  let range = null;
  const keep = () => { const s = getSelection(); if (s.rangeCount && body.contains(s.anchorNode)) range = s.getRangeAt(0).cloneRange(); };
  body.addEventListener("keyup", keep); body.addEventListener("mouseup", keep); body.addEventListener("blur", keep);
  const back = () => { body.focus(); if (range) { const s = getSelection(); s.removeAllRanges(); s.addRange(range); } };
  $$("#nbtb button").forEach((b) => b.onmousedown = (e) => e.preventDefault());
  $$("#nbtb [data-cmd]").forEach((b) => b.onclick = () => {
    back(); const c = b.dataset.cmd;
    if (c === "h") { const blk = document.queryCommandValue("formatBlock").toLowerCase(); document.execCommand("formatBlock", false, blk === "h2" ? "div" : "h2"); }
    else document.execCommand(c); changed(); keep();
  });
  $$("#nbtb [data-color]").forEach((b) => b.onclick = () => { back(); document.execCommand("foreColor", false, b.dataset.color || getComputedStyle(body).color); changed(); keep(); });
  $$("#nbtb [data-mark]").forEach((b) => b.onclick = () => { back(); document.execCommand("hiliteColor", false, b.dataset.mark); changed(); keep(); });
  // cards go where the cursor was, and the cursor ends up after them (insertHTML left it in front of the cards)
  $("#nbcards").onclick = () => { keep(); spotPicker({ insert: true }, (cards) => {
    back(); const sel = getSelection();
    const r = sel.rangeCount && body.contains(sel.anchorNode) ? sel.getRangeAt(0) : (() => { const x = document.createRange(); x.selectNodeContents(body); x.collapse(false); return x; })();
    r.deleteContents();
    const tmp = document.createElement("div"); tmp.innerHTML = cards.map((c) => pcard(c)).join("");
    const after = document.createTextNode(" "), frag = document.createDocumentFragment();
    [...tmp.childNodes, after].forEach((n) => frag.appendChild(n)); r.insertNode(frag);
    const c = document.createRange(); c.setStart(after, 1); c.collapse(true); sel.removeAllRanges(); sel.addRange(c); range = c.cloneRange();
    changed(); }); };

  $("#nbmv").onchange = async (e) => { await nbFlush(); await db.saveSession({ id: cur.id, folder: e.target.value || null }); go({ f: e.target.value || "~" }); };
  $("#nbspotb").onclick = () => spotPicker(cur.spot || {}, async (sp) => {
    const folder = sp ? nbSpotFolder(sp) : cur.folder;
    if (folder) await db.addFolders(folder.split("/").map((_, i, a) => a.slice(0, i + 1).join("/")));
    if (sp && !title.value.trim()) { title.value = nbSpotTitle(sp); changed(); }
    await nbFlush();
    await db.saveSession({ id: cur.id, spot: sp, folder: folder || null });
    if (folder) folder.split("/").forEach((_, i, a) => open.add(a.slice(0, i + 1).join("/"))); nbOpen.set(open);
    go({ f: folder || q.f, n: cur.id });
  });
  $("#nbhist").onclick = async () => { await nbFlush(); nbHistory(cur, (id) => { NB.cur = null; NB.dirty = false; nbLS.drop(id); go({ n: id }); route(); }); };
  $("#nbpause")?.addEventListener("click", async () => { await nbFlush(); await sesPause(); route(); });
  $("#nbend")?.addEventListener("click", async () => { await nbFlush(); await sesEnd(null); });
  if (!body.textContent.trim() && !title.value.trim()) title.focus();
}

/* ---------- situation + cards picker (GTO Wizard look: 4 colours) ---------- */
const nbSpotFolder = (sp) => [sp.format || "6-max", sp.pot || "SRP", sp.pot === "Multiway" || sp.pot === "Preflop" ? "" : sp.hero && sp.villain ? `${sp.hero} vs ${sp.villain}` : ""].filter(Boolean).join("/");
const nbSpotTitle = (sp) => [sp.pot, sp.hero && sp.villain && sp.pot !== "Multiway" ? `${sp.hero} vs ${sp.villain}` : sp.hero, (sp.board || []).join(" ")].filter(Boolean).join(" · ");
function spotPicker(start, done) {
  const insert = !!start.insert;
  const st = { format: start.format || "6-max", pot: start.pot || "SRP", hero: start.hero || "", villain: start.villain || "", board: [...(start.board || [])] };
  let d = $("#nbspot");
  if (!d) { d = document.createElement("dialog"); d.id = "nbspot"; d.className = "card nb-spotd"; document.body.appendChild(d); }
  const draw = () => {
    const pos = NB_POS[st.format] || NB_POS["6-max"];
    const seg = (key, items) => `<div class="sb-seg">${items.map((v) => `<label class="${st[key] === v ? "on" : ""}" data-k="${key}" data-v="${v}">${v}</label>`).join("")}</div>`;
    const max = insert ? 7 : 5;
    d.innerHTML = `<div class="card-head"><h3>🂠 ${insert ? t("nbCards") : t("nbSpot")}</h3><button class="x" type="button" data-x>×</button></div>
      ${insert ? "" : `<div class="nb-sprow"><span>${t("nbFormat")}</span>${seg("format", ["6-max", "Heads-up"])}</div>
      <div class="nb-sprow"><span>${t("nbPot")}</span>${seg("pot", NB_POTS)}</div>
      <div class="nb-sprow"><span>${t("nbHero")}</span>${seg("hero", pos)}</div>
      ${st.pot === "Multiway" ? "" : `<div class="nb-sprow"><span>${t("nbVillain")}</span>${seg("villain", pos.filter((p) => p !== st.hero))}</div>`}`}
      <div class="nb-sprow"><span>${insert ? t("nbCards") : t("nbBoard")}</span><div class="nb-slots">${Array.from({ length: max }, (_, i) => st.board[i] ? `<button type="button" class="nb-slot full" data-rm="${i}">${pcard(st.board[i], "lg")}</button>` : `<span class="nb-slot">${insert ? "" : ["Flop", "Flop", "Flop", "Turn", "River"][i]}</span>`).join("")}</div></div>
      <div class="nb-deck">${["s", "h", "d", "c"].map((su) => `<div class="nb-drow">${NB_RANKS.map((r) => { const c = r + su, on = st.board.includes(c); return `<button type="button" class="nb-dk ${on ? "used" : ""}" data-card="${c}" ${on ? "disabled" : ""}>${pcard(c)}</button>`; }).join("")}</div>`).join("")}</div>
      <p class="row-btns"><button type="button" class="btn btn-red" data-ok>${insert ? t("nbInsert") : t("nbApply")}</button><button type="button" class="btn" data-clear>${t("nbClear")}</button></p>`;
    $$("[data-k]", d).forEach((l) => l.onclick = () => { st[l.dataset.k] = st[l.dataset.k] === l.dataset.v && ["hero", "villain"].includes(l.dataset.k) ? "" : l.dataset.v;
      if (l.dataset.k === "format") { const ps = NB_POS[st.format]; if (!ps.includes(st.hero)) st.hero = ""; if (!ps.includes(st.villain)) st.villain = ""; }
      if (st.villain === st.hero) st.villain = ""; draw(); });
    $$("[data-card]", d).forEach((b) => b.onclick = () => { if (st.board.length < max) { st.board.push(b.dataset.card); draw(); } });
    $$("[data-rm]", d).forEach((b) => b.onclick = () => { st.board.splice(+b.dataset.rm, 1); draw(); });
    $("[data-x]", d).onclick = () => d.close();
    $("[data-clear]", d).onclick = () => { if (insert) { st.board = []; draw(); return; } d.close(); done(null); };
    $("[data-ok]", d).onclick = () => { d.close(); if (insert) { if (st.board.length) done(st.board); return; }
      done({ format: st.format, pot: st.pot, hero: st.hero || null, villain: st.pot === "Multiway" ? null : st.villain || null, board: st.board }); };
  };
  draw(); d.showModal();
}

Object.assign(STRINGS.en, { calLink: "Link my calendar", calLinkSub: "All your RTS coachings and calls in the calendar you already use. It updates on its own (every few hours on Google).",
  calOpenG: "Add to Google", calOpenA: "Add to Apple Calendar", calStepG: "If it doesn't open: Google Calendar > Other calendars > + > From URL > paste the link.",
  calStepA: "Mac and iPhone: the button opens Calendar, confirm Subscribe.", calStepN: "Notion Calendar shows your Google calendars: add it to Google above, it appears in Notion Calendar.",
  calPrivate: "This link is private: anyone who has it sees your calendar.", calNew: "New link", calNewQ: "Make a new link? The old one stops working everywhere.", calLinkErr: "Couldn't make your link. Try again." });
Object.assign(STRINGS.fr, { calLink: "Relier mon agenda", calLinkSub: "Tous tes coachings et appels RTS dans l'agenda que tu utilises déjà. Mis à jour tout seul (toutes les quelques heures sur Google).",
  calOpenG: "Ajouter à Google", calOpenA: "Ajouter à Calendrier Apple", calStepG: "Si ça ne s'ouvre pas : Google Agenda > Autres agendas > + > À partir de l'URL > colle le lien.",
  calStepA: "Mac et iPhone : le bouton ouvre Calendrier, confirme S'abonner.", calStepN: "Notion Calendar affiche tes agendas Google : ajoute-le dans Google ci-dessus, il apparaît dans Notion Calendar.",
  calPrivate: "Ce lien est privé : toute personne qui l'a voit ton agenda.", calNew: "Nouveau lien", calNewQ: "Créer un nouveau lien ? L'ancien ne marchera plus nulle part.", calLinkErr: "Impossible de créer ton lien. Réessaie." });
Object.assign(STRINGS.en, { scPaused: "Paused", scEnd: "End", scCockpit: "Cockpit", scOpenNote: "Open the session's note" });
Object.assign(STRINGS.fr, { scPaused: "En pause", scEnd: "Terminer", scCockpit: "Cockpit", scOpenNote: "Ouvrir la note de la session" });
Object.assign(STRINGS.en, { nbToMine: "Move to My folders", nbToRts: "Move to the RTS tree" });
Object.assign(STRINGS.fr, { nbToMine: "Déplacer dans Mes dossiers", nbToRts: "Déplacer dans l'arborescence RTS" });

/* Note safety (Alexis 2026-11-18): every note has its history (one click puts an older version back, and that can be undone too)
   and deleted notes wait 30 days in the Trash. The database keeps these copies itself (029), whatever the app does. */
const nbWhen = (iso) => `${fmtDay(iso.slice(0, 10))} · ${hhmm(iso)}`;
async function nbHistory(cur, done) {
  const d = $("#nbsafe"), vs = await db.noteVersions(cur.id).catch(() => []);
  let sel = vs[0];
  const draw = () => {
    d.innerHTML = `<div class="card-head"><h3>🕘 ${t("nbHist")} · ${esc(nbTitleOf(cur))}</h3><button class="x" type="button" data-x>×</button></div>
      ${vs.length ? `<div class="nb-hs"><div class="nb-hl">${vs.map((v) => `<button type="button" class="nb-hv ${v === sel ? "on" : ""}" data-v="${v.id}"><b>${nbWhen(v.saved_at)}</b><small>${esc(((v.notes || "").replace(/\s+/g, " ").slice(0, 60)) || "—")}</small></button>`).join("")}</div>
        <div class="nb-hp"><h4>${esc(sel.title || "")}</h4><div class="nb-hb">${nbClean(sel.notes_html ?? esc(sel.notes || ""))}</div></div></div>
        <p class="row-btns"><button type="button" class="btn btn-red" data-ok>↺ ${t("nbRestoreV")}</button><span class="muted small">${t("nbRestoreTip")}</span></p>`
        : `<p class="muted">${t("nbHistNone")}</p>`}`;
    $("[data-x]", d).onclick = () => d.close();
    $$("[data-v]", d).forEach((b) => b.onclick = () => { sel = vs.find((v) => String(v.id) === b.dataset.v); draw(); });
    const ok = $("[data-ok]", d); if (ok) ok.onclick = async () => { ok.disabled = true; const id = await db.restoreVersion(sel.id); d.close(); hqToast(`✓ ${t("nbRestored")}`, 4000); done(id); };
  };
  draw(); d.showModal();
}
async function nbTrashDlg(done) {
  const d = $("#nbsafe"), ls = await db.noteTrash().catch(() => []);
  d.innerHTML = `<div class="card-head"><h3>🗑 ${t("nbTrash")}</h3><button class="x" type="button" data-x>×</button></div>
    <p class="muted small">${t("nbTrashSub")}</p>
    ${ls.length ? `<div class="nb-tl">${ls.map((x) => `<div class="nb-tr"><span><b>${esc((x.title || "").trim() || (x.notes || "").trim().split("\n")[0].slice(0, 60) || t("nbUntitled"))}</b>
      <small>${t("nbDeletedOn")} ${nbWhen(x.deleted_at)}${x.folder ? " · " + esc(x.folder.split("/").join(" › ")) : ""}</small></span>
      <button type="button" class="btn btn-sm btn-red" data-r="${x.id}">↺ ${t("nbRestore")}</button></div>`).join("")}</div>` : `<p class="muted">${t("nbTrashEmpty")}</p>`}`;
  $("[data-x]", d).onclick = () => d.close();
  $$("[data-r]", d).forEach((b) => b.onclick = async () => { b.disabled = true; const x = ls.find((y) => String(y.id) === b.dataset.r); const id = await db.restoreTrash(x.id); d.close(); hqToast(`✓ ${t("nbRestored")}`, 4000); done(id); });
  d.showModal();
}
Object.assign(STRINGS.en, { nbHist: "History", nbHistTip: "Every version of this note, restorable", nbHistNone: "No older version yet. One is kept every 10 minutes while you write.",
  nbRestoreV: "Restore this version", nbRestoreTip: "The note as it is now is kept in the history too.", nbRestored: "Note restored", nbRestore: "Restore",
  nbTrash: "Trash", nbTrashSub: "Deleted notes stay here 30 days.", nbTrashEmpty: "The trash is empty.", nbDeletedOn: "Deleted" });
Object.assign(STRINGS.fr, { nbHist: "Historique", nbHistTip: "Toutes les versions de cette note, restaurables", nbHistNone: "Pas encore d'ancienne version. Une est gardée toutes les 10 minutes pendant que tu écris.",
  nbRestoreV: "Restaurer cette version", nbRestoreTip: "La note telle qu'elle est maintenant reste aussi dans l'historique.", nbRestored: "Note restaurée", nbRestore: "Restaurer",
  nbTrash: "Corbeille", nbTrashSub: "Les notes supprimées restent ici 30 jours.", nbTrashEmpty: "La corbeille est vide.", nbDeletedOn: "Supprimée le" });

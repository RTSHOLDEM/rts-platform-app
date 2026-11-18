/* RTS Replayer page: my hands on the left, Paul's replayer (rts.pokereplayer.com) on the right.
   Hands live in the 'hands' table (only the player sees his own). The replayer gets each hand packed in its link,
   so nothing is stored on Paul's server. Loaded before app.js; uses its helpers ($, t, db, esc, head...) at call time. */
const REPLAYER = "https://rts.pokereplayer.com";
Object.assign(STRINGS.en, { rpCopyHH: "Copy hand history", rpCopyLink: "Copy link", rpCopied: "Copied" });
Object.assign(STRINGS.fr, { rpCopyHH: "Copier l'historique", rpCopyLink: "Copier le lien", rpCopied: "Copié" });
/* A screenshot of a hand (Betclic first) becomes a hand history, then a replayer link (Alexis 2026-11-18).
   The image goes to our server function hh-from-image, which asks Claude Haiku 5.5 to write it out in the Betclic
   format; the key never reaches the page. 30 screenshots a player a day. */
const RP_DEMO_HH = `Game #1766437236: Table €1000 NL - 5.00/10.00 - No Limit Hold'Em - 07:50:53 2026/11/15
*** Seated players ***
Seat 1: Hero (€1451.69)
Seat 4: Villain (€1000)
*** Blinds and button ***
Villain has the button
Villain posts small blind €5
Hero posts big blind €10
*** Hole cards ***
Dealt to Hero [8h 7d]
*** Preflop ***
Villain raises €18 to €23
Hero calls €13
*** Flop *** [8c 3s 8s]
Hero checks
Villain bets €13.13
Hero raises €48.14 to €48.14
Villain calls €35.01
*** Turn *** [8c 3s 8s] [3d]
Hero checks
Villain bets €42.01
Hero calls €42.01
*** River *** [8c 3s 8s] [3d] [3h]
Hero checks
Villain checks
*** Showdown ***
Hero shows [8h 7d], Full House, Eights full
Villain shows [Ks 5c], Full House, Threes full
Hero wins €224.05
*** Summary ***
Total pot €226.30 Rake €2.25`;
const imgOf = (dt) => [...(dt?.files || [])].find((f) => /^image\//.test(f.type))
  || [...(dt?.items || [])].map((i) => (i.kind === "file" ? i.getAsFile() : null)).find((f) => f && /^image\//.test(f.type)) || null;
async function hhFromImage(file) {
  const bmp = await createImageBitmap(file), k = Math.min(2000 / Math.max(bmp.width, bmp.height), Math.max(1, 1700 / Math.max(bmp.width, bmp.height))); // small phone captures enlarged ~2x: suits read 3/3 right vs wrong once at 1x (2026-11-18)
  const c = Object.assign(document.createElement("canvas"), { width: Math.round(bmp.width * k), height: Math.round(bmp.height * k) });
  c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
  try { return (await db.hhFromImage(c.toDataURL("image/png").split(",")[1], "image/png")).hh; }
  catch (e) { throw new Error(t({ limit: "ocrLimit", not_a_hand: "ocrNotHand" }[e.message] || "ocrFail")); }
}
Object.assign(STRINGS.en, { ocrDrop: "Drop or paste a screenshot of the hand (Betclic): it becomes a replayer link", ocrReading: "📷 Reading the screenshot…",
  ocrDone: "✓ Hand read from the screenshot: check the cards and amounts", ocrLinked: "🔗 Replayer link copied", ocrClick: "Click 🔗 Copy link to share it",
  ocrLimit: "Limit of 30 screenshots a day reached. Try again tomorrow.", ocrNotHand: "This image doesn't look like a poker hand.",
  ocrFail: "Can't read it right now. Paste the hand history as text.", ocrOr: "📷 or a screenshot" });
Object.assign(STRINGS.fr, { ocrDrop: "Glisse ou colle une capture de la main (Betclic) : elle devient un lien replayer", ocrReading: "📷 Lecture de la capture…",
  ocrDone: "✓ Main lue depuis la capture : vérifie les cartes et les montants", ocrLinked: "🔗 Lien replayer copié", ocrClick: "Clique 🔗 Copier le lien pour le partager",
  ocrLimit: "Limite de 30 captures par jour atteinte. Réessaie demain.", ocrNotHand: "Cette image ne ressemble pas à une main de poker.",
  ocrFail: "Lecture impossible pour le moment. Colle l'historique en texte.", ocrOr: "📷 ou une capture" });
const isHH = (s) => /\*\*\*|Dealt to|HandId|GAME #/i.test(s || "");

/* Who "me" is in a hand. After a showdown some sites (Unibet) list every player's "Dealt to" line, me last, and the
   replayer takes the first one as the hero: it showed my opponent's cards, not mine (Alexis 2026-11-07).
   Order: a "Hero" name, the account tag Unibet adds to my name, the name dealt cards in most of my saved hands
   (opponents change, I am in every hand), a name that never shows (opponents' cards are known only when shown). */
let RP_ME = new Map();
const realCards = (c) => /(?:[2-9TJQKA]|10)[shdc]|[shdc](?:[2-9TJQKA]|10)/i.test(c);
const dealtLines = (hh) => [...(hh || "").matchAll(/^[ \t]*Dealt to (.+?) \[([^\]]*)\].*$/gm)].filter((m) => realCards(m[2]));
function learnMe(hands) {
  RP_ME = new Map();
  for (const h of hands) for (const n of new Set(dealtLines(h.hh).map((m) => m[1]))) RP_ME.set(n, (RP_ME.get(n) || 0) + 1);
}
function heroLine(hh) {
  const d = dealtLines(hh);
  if (d.length < 2) return d[0] || null;
  const shows = (n) => hh.includes(`${n} shows [`) || hh.includes(`${n}: shows [`);
  const score = (m) => (m[1] === "Hero" ? 1e6 : 0) + (/\[[A-Za-z]+_[0-9a-f]{8,}\]$/.test(m[1]) ? 1e5 : 0) + (RP_ME.get(m[1]) || 0) * 2 + (shows(m[1]) ? 0 : 1);
  return d.reduce((a, m) => (score(m) > score(a) ? m : a));
}
// The text the replayer gets: my "Dealt to" line moved first, so it seats me as the hero. The saved hand stays as pasted.
function heroFirst(hh) {
  const me = heroLine(hh), first = (hh || "").match(/^[ \t]*Dealt to .*$/m);
  if (!me || !first || first.index === me.index) return hh;
  const out = hh.slice(0, me.index) + hh.slice(me.index + me[0].length).replace(/^\r?\n/, "");
  return out.slice(0, first.index) + me[0].trim() + "\n" + out.slice(first.index);
}

// Same packing as the replayer's own long links: base64url(deflate-raw(JSON {t: text, v: seat, a: anonymize})).
async function replayUrl(hh) {
  const z = new Blob([JSON.stringify({ t: heroFirst(hh), v: null, a: false })]).stream().pipeThrough(new CompressionStream("deflate-raw"));
  const bytes = new Uint8Array(await new Response(z).arrayBuffer());
  let s = ""; bytes.forEach((x) => s += String.fromCharCode(x));
  return `${REPLAYER}/replay?h=${btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")}`;
}

function handInfo(hh) {
  const first = hh.split("\n")[0];
  const site = [["Winamax", /winamax/i], ["PokerStars", /pokerstars/i], ["Unibet", /unibet/i], ["Betclic", /betclic/i], ["PMU", /pmu/i], ["GGPoker", /ggpoker|poker hand #/i], ["iPoker", /^GAME #/i]]
    .find(([, r]) => r.test(first))?.[0] || "";
  const bb = first.match(/\d+(?:[.,]\d+)?\s*[€$£]?\s*\/\s*[€$£]?\s*(\d+(?:[.,]\d+)?)/);
  const stakes = bb ? "NL" + Math.round(parseFloat(bb[1].replace(",", ".")) * 100) : "";
  // "Ah Kd" (most sites) or "HA DK" (iPoker: suit first).
  const cards = (heroLine(hh)?.[2] || "").trim().split(/\s+/).filter(Boolean)
    .map((c) => (/^[shdc]/i.test(c) ? c.slice(1) + c[0] : c))
    .map((c) => ({ r: c.slice(0, -1).replace("10", "T").toUpperCase(), s: c.slice(-1).toLowerCase() }));
  return { site, stakes, cards };
}

/* Each hand's replayer stays alive, hidden, while you use other pages or hands, so it reopens where you left it,
   e.g. on the turn, instead of back at the start (Alexis 2026-11-07). The frames live in <body> (an iframe reloads
   when it moves in the page) and lie over the replayer page's frame spot. The 6 latest hands are kept. */
const RP_KEEP = 6, RP_FRAMES = new Map(), RP_MIN_H = 600;
function rpPlace() {
  const spot = document.getElementById("rpframe"), cur = spot && RP_FRAMES.get(spot.dataset.url);
  RP_FRAMES.forEach((f) => { if (f !== cur) { f.style.visibility = "hidden"; f.style.pointerEvents = "none"; } });
  if (!cur) return;
  const r = spot.getBoundingClientRect();
  const s = Math.min(1, r.height / RP_MIN_H); // controls under the table, always (Alexis 2026-11-18)
  Object.assign(cur.style, { top: r.top + "px", left: r.left + "px", width: r.width / s + "px", height: r.height / s + "px", transform: s < 1 ? `scale(${s})` : "", transformOrigin: "0 0", visibility: "visible", pointerEvents: "" });
}
function rpShow(url, spot) {
  spot.dataset.url = url;
  let f = RP_FRAMES.get(url);
  if (f) RP_FRAMES.delete(url); // put back as the latest
  else { f = Object.assign(document.createElement("iframe"), { className: "rp-live", title: "RTS Replayer", src: url }); f.allow = "clipboard-write; fullscreen"; document.body.appendChild(f); }
  RP_FRAMES.set(url, f);
  while (RP_FRAMES.size > RP_KEEP) { const [k, old] = RP_FRAMES.entries().next().value; old.remove(); RP_FRAMES.delete(k); }
  rpPlace(); new ResizeObserver(rpPlace).observe(spot);
}
addEventListener("resize", rpPlace); addEventListener("scroll", rpPlace, true);
addEventListener("hashchange", () => setTimeout(rpPlace)); // after route() has replaced the page

const LAST = 10; // the list shows the 10 latest hands, "See all" opens the rest
const SUIT = { s: "♠", h: "♥", d: "♦", c: "♣" };
const rpTags = (h) => (h.tags || []).length ? `<span class="rp-tags">${h.tags.map((k) => `<span class="tag">${esc(tagLabel(k))}</span>`).join("")}</span>` : "";
const cardsHtml = (cards) => cards.map((c) => `<span class="rpc ${c.s}">${esc(c.r)}<i>${SUIT[c.s] || ""}</i></span>`).join("");

async function viewReplayer(id) {
  const hands = (await db.hands()).filter((h) => isHH(h.hh));
  learnMe(hands);
  const cur = id === "new" ? null : hands.find((h) => h.id === id) || hands[0] || null;
  const item = (h) => {
    const i = handInfo(h.hh);
    return `<a class="rp-item ${h === cur ? "on" : ""}" href="#/replayer/${h.id}">
      <span class="rp-cards">${cardsHtml(i.cards) || `<span class="rpc">?</span>`}</span>
      <span class="rp-meta"><b>${esc([i.stakes, i.site].filter(Boolean).join(" · ") || t("hand"))}</b>
        <small>${fmtDay(h.created_at.slice(0, 10))} · ${hhmm(h.created_at)}</small>
        ${h.note ? `<small class="rp-note">${esc(h.note)}</small>` : ""}${rpTags(h)}</span></a>`;
  };
  const form = `<form class="rp-new card" id="rpform">
      <p class="eyebrow">${t("newHand")}</p><h2 class="rp-h">${t("pasteHand")}</h2>
      <textarea name="hh" rows="10" class="mono sensitive" placeholder="Winamax Poker - CashGame - HandId: #…" required></textarea>
      <input name="note" placeholder="${t("noteQ")}">
      <label class="rp-drop" id="rpdrop"><input type="file" accept="image/*" id="rpimg" hidden>📷 ${t("ocrDrop")}</label>
      <div class="rp-row"><button class="btn btn-red">▶ ${t("replayGo")}</button><span class="muted">${t("pasteAnywhere")}</span></div>
      <p class="saved" id="rpmsg"></p></form>`;
  $("#main").innerHTML = `${head("RTS Replayer", t("replayer"), t("replayerPage"))}
    <section class="rp">
      <aside class="rp-side card">
        <div class="rp-side-head"><h3>${t("myHands")} <span class="muted">${hands.length || ""}</span></h3><a class="btn btn-sm btn-red" href="#/replayer/new">+ ${t("newHand")}</a></div>
        <div class="rp-list ${hands.indexOf(cur) >= LAST ? "all" : ""}">${hands.map((h, i) => (i === LAST ? `<button class="rp-more" id="rpmore">${t("seeAll")} (${hands.length})</button>` : "") + item(h)).join("") || `<p class="muted rp-empty">${t("noReplays")}</p>`}</div>
      </aside>
      <div class="rp-stage">${cur ? `
        <div class="rp-bar"><span class="rp-cards">${cardsHtml(handInfo(cur.hh).cards)}</span>
          <b>${esc([handInfo(cur.hh).stakes, handInfo(cur.hh).site].filter(Boolean).join(" · "))}</b>
          <span class="rp-tools"><button class="chip btn-gto" id="rpgto" title="${t("gtoTip")}">GTO Wizard ↗</button><button class="chip" id="rpcopy">📋 ${t("rpCopyHH")}</button><button class="chip" id="rplink">🔗 ${t("rpCopyLink")}</button><button class="chip" id="rpnote">📝 ${t("hnWrite")}</button><a class="chip" id="rpfull" target="_blank" rel="noopener">${t("fullScreen")} ↗</a></span></div>
        <div class="rp-sub">${cur.note ? `<p class="rp-q">${esc(cur.note)}</p>` : ""}${tagEditHtml(cur, hands)}</div>
        <div class="rp-frame" id="rpframe"></div>` : form}</div>
    </section>`;

  const save = async (hh, note = "", file = null) => {
    if (!isHH(hh)) { if ($("#rpmsg")) $("#rpmsg").textContent = t("notAHand"); return; }
    await db.addHand({ hh: hh.trim(), note: (note || "").trim() || null }, file);
    location.hash = `#/replayer/${(await db.hands())[0].id}`;
  };
  // A screenshot: read it, save the hand with the picture, play it and copy its link.
  let busy = false;
  const fromImage = async (file) => {
    if (busy || !file) return; busy = true;
    const say = (s) => ($("#rpmsg") ? ($("#rpmsg").textContent = s) : hqToast(s, 60000));
    say(t("ocrReading"));
    try { const hh = await hhFromImage(file); sessionStorage.setItem("rp-ocr", "1"); await save(hh, "", file); }
    catch (e) { $("#rpmsg") ? say(e.message) : hqToast(e.message, 8000); }
    busy = false;
  };
  // Zero friction: Cmd+V a hand (text or screenshot) anywhere on the page saves and plays it.
  document.onpaste = (e) => {
    const img = imgOf(e.clipboardData);
    if (img) { e.preventDefault(); return fromImage(img); }
    if (e.target.closest?.("textarea,input")) return;
    const s = e.clipboardData.getData("text");
    if (isHH(s)) { e.preventDefault(); save(s); }
  };
  const main = $("#main");
  main.ondragover = (e) => { if ([...(e.dataTransfer?.items || [])].some((i) => i.kind === "file")) { e.preventDefault(); main.classList.add("rp-dragging"); } };
  main.ondragleave = (e) => { if (!main.contains(e.relatedTarget)) main.classList.remove("rp-dragging"); };
  main.ondrop = (e) => { main.classList.remove("rp-dragging"); const img = imgOf(e.dataTransfer); if (img) { e.preventDefault(); fromImage(img); } };
  $("#rpimg")?.addEventListener("change", (e) => fromImage(e.target.files[0]));
  $("#rpmore")?.addEventListener("click", () => $(".rp-list").classList.add("all"));
  if (cur) {
    const url = await replayUrl(cur.hh);
    fitToDock("#rpframe"); rpShow(url, $("#rpframe")); $("#rpfull").href = url;
    $("#rpgto").onclick = () => { navigator.clipboard.writeText(cur.hh).catch(() => {}); window.open("https://app.gtowizard.com/", "_blank", "noopener"); hqToast(`✓ ${t("gtoCopied")}`, 9000); };
    // Two clear buttons: the hand history text, or the shared replay link (Alexis 2026-11-18)
    const done = (b, label) => { b.textContent = "✓ " + t("rpCopied"); setTimeout(() => (b.textContent = label), 2000); };
    $("#rpnote").onclick = () => handNote(cur);
    $("#rpcopy").onclick = async (e) => { const b = e.currentTarget; try { await navigator.clipboard.writeText(cur.hh); done(b, "📋 " + t("rpCopyHH")); } catch {} };
    bindTagEdit(hands, () => route()); // tags change after saving (Alexis 2026-11-18); the replayer frame stays alive
    $("#rplink").onclick = async (e) => { const b = e.currentTarget; try { await navigator.clipboard.writeText(url); done(b, "🔗 " + t("rpCopyLink")); } catch {} };
    if (sessionStorage.getItem("rp-ocr")) { // just read from a screenshot: copy its link if the browser lets us
      sessionStorage.removeItem("rp-ocr");
      navigator.clipboard.writeText(url).then(() => hqToast(`${t("ocrDone")}<br>${t("ocrLinked")}`, 9000), () => hqToast(`${t("ocrDone")}<br>${t("ocrClick")}`, 9000));
    }
  } else {
    $("#rpform").onsubmit = (e) => { e.preventDefault(); const fd = new FormData(e.target); save(fd.get("hh"), fd.get("note")); };
  }
}

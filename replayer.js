/* RTS Replayer page: my hands on the left, Paul's replayer (rts.pokereplayer.com) on the right.
   Hands live in the 'hands' table (only the player sees his own). The replayer gets each hand packed in its link,
   so nothing is stored on Paul's server. Loaded before app.js; uses its helpers ($, t, db, esc, head...) at call time. */
const REPLAYER = "https://rts.pokereplayer.com";
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
const RP_KEEP = 6, RP_FRAMES = new Map();
function rpPlace() {
  const spot = document.getElementById("rpframe"), cur = spot && RP_FRAMES.get(spot.dataset.url);
  RP_FRAMES.forEach((f) => { if (f !== cur) { f.style.visibility = "hidden"; f.style.pointerEvents = "none"; } });
  if (!cur) return;
  const r = spot.getBoundingClientRect();
  Object.assign(cur.style, { top: r.top + "px", left: r.left + "px", width: r.width + "px", height: r.height + "px", visibility: "visible", pointerEvents: "" });
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
const rpTags = (h) => (h.tags || []).length ? `<span class="rp-tags">${h.tags.map((k) => `<span class="tag">${t("tag_" + k)}</span>`).join("")}</span>` : "";
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
          <b>${esc([handInfo(cur.hh).stakes, handInfo(cur.hh).site].filter(Boolean).join(" · "))}</b>${rpTags(cur)}
          <span class="rp-tools"><button class="chip btn-gto" id="rpgto" title="${t("gtoTip")}">GTO Wizard ↗</button><button class="chip" id="rpcopy">${t("copyHH")}</button><a class="chip" id="rpfull" target="_blank" rel="noopener">${t("fullScreen")} ↗</a></span></div>
        ${cur.note ? `<p class="rp-q">${esc(cur.note)}</p>` : ""}
        <div class="rp-frame" id="rpframe"></div>` : form}</div>
    </section>`;

  const save = async (hh, note = "") => {
    if (!isHH(hh)) { if ($("#rpmsg")) $("#rpmsg").textContent = t("notAHand"); return; }
    await db.addHand({ hh: hh.trim(), note: (note || "").trim() || null });
    location.hash = `#/replayer/${(await db.hands())[0].id}`;
  };
  // Zero friction: Cmd+V a hand anywhere on the page saves and plays it.
  document.onpaste = (e) => {
    if (e.target.closest?.("textarea,input")) return;
    const s = e.clipboardData.getData("text");
    if (isHH(s)) { e.preventDefault(); save(s); }
  };
  $("#rpmore")?.addEventListener("click", () => $(".rp-list").classList.add("all"));
  if (cur) {
    const url = await replayUrl(cur.hh);
    fitToDock("#rpframe"); rpShow(url, $("#rpframe")); $("#rpfull").href = url;
    $("#rpgto").onclick = () => { navigator.clipboard.writeText(cur.hh).catch(() => {}); window.open("https://app.gtowizard.com/", "_blank", "noopener"); hqToast(`✓ ${t("gtoCopied")}`, 9000); };
    $("#rpcopy").onclick = async () => { try { await navigator.clipboard.writeText(cur.hh); $("#rpcopy").textContent = "✓"; } catch {} };
  } else {
    $("#rpform").onsubmit = (e) => { e.preventDefault(); const fd = new FormData(e.target); save(fd.get("hh"), fd.get("note")); };
  }
}

/* RTS Replayer page: my hands on the left, Paul's replayer (rts.pokereplayer.com) on the right.
   Hands live in the 'hands' table (only the player sees his own). The replayer gets each hand packed in its link,
   so nothing is stored on Paul's server. Loaded before app.js; uses its helpers ($, t, db, esc, head...) at call time. */
const REPLAYER = "https://rts.pokereplayer.com";
const isHH = (s) => /\*\*\*|Dealt to|HandId|GAME #/i.test(s || "");

// Same packing as the replayer's own long links: base64url(deflate-raw(JSON {t: text, v: seat, a: anonymize})).
async function replayUrl(hh) {
  const z = new Blob([JSON.stringify({ t: hh, v: null, a: false })]).stream().pipeThrough(new CompressionStream("deflate-raw"));
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
  const cards = ((hh.match(/Dealt to [^\n]*?\[([^\]]+)\]/) || [])[1] || "").trim().split(/\s+/).filter(Boolean)
    .map((c) => (/^[shdc]/i.test(c) ? c.slice(1) + c[0] : c))
    .map((c) => ({ r: c.slice(0, -1).replace("10", "T").toUpperCase(), s: c.slice(-1).toLowerCase() }));
  return { site, stakes, cards };
}

const SUIT = { s: "♠", h: "♥", d: "♦", c: "♣" };
const cardsHtml = (cards) => cards.map((c) => `<span class="pc ${c.s}">${esc(c.r)}<i>${SUIT[c.s] || ""}</i></span>`).join("");

async function viewReplayer(id) {
  const hands = (await db.hands()).filter((h) => isHH(h.hh));
  const cur = id === "new" ? null : hands.find((h) => h.id === id) || hands[0] || null;
  const item = (h) => {
    const i = handInfo(h.hh);
    return `<a class="rp-item ${h === cur ? "on" : ""}" href="#/replayer/${h.id}">
      <span class="rp-cards">${cardsHtml(i.cards) || `<span class="pc">?</span>`}</span>
      <span class="rp-meta"><b>${esc([i.stakes, i.site].filter(Boolean).join(" · ") || t("hand"))}</b>
        <small>${fmtDay(h.created_at.slice(0, 10))} · ${hhmm(h.created_at)}</small>
        ${h.note ? `<small class="rp-note">${esc(h.note)}</small>` : ""}</span></a>`;
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
        <div class="rp-list">${hands.map(item).join("") || `<p class="muted rp-empty">${t("noReplays")}</p>`}</div>
      </aside>
      <div class="rp-stage">${cur ? `
        <div class="rp-bar"><span class="rp-cards">${cardsHtml(handInfo(cur.hh).cards)}</span>
          <b>${esc([handInfo(cur.hh).stakes, handInfo(cur.hh).site].filter(Boolean).join(" · "))}</b>
          <span class="rp-tools"><button class="chip" id="rpcopy">${t("copyHH")}</button><a class="chip" id="rpfull" target="_blank" rel="noopener">${t("fullScreen")} ↗</a></span></div>
        ${cur.note ? `<p class="rp-q">${esc(cur.note)}</p>` : ""}
        <iframe class="rp-frame" id="rpframe" title="RTS Replayer" allow="clipboard-write; fullscreen"></iframe>` : form}</div>
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
  if (cur) {
    const url = await replayUrl(cur.hh);
    $("#rpframe").src = url; $("#rpfull").href = url;
    $("#rpcopy").onclick = async () => { try { await navigator.clipboard.writeText(cur.hh); $("#rpcopy").textContent = "✓"; } catch {} };
  } else {
    $("#rpform").onsubmit = (e) => { e.preventDefault(); const fd = new FormData(e.target); save(fd.get("hh"), fd.get("note")); };
  }
}

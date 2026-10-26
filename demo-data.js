/* Sample data for demo mode (?demo). Made-up players and numbers, safe to show on screen.
   Same shape as the database tables (supabase/*.sql). */

const D_TEAMS = [
  { id: "academy", label: "Academy", side: "academy", cut_pct: 35, month_hands: 50000, week_hours: 35, calendar_id: null },
  { id: "challenger", label: "Challenger", side: "academy", cut_pct: 35, month_hands: 50000, week_hours: 35, calendar_id: null },
  { id: "master", label: "Master", side: "elite", cut_pct: 30, month_hands: 60000, week_hours: 35, calendar_id: null },
  { id: "supreme", label: "Supreme", side: "elite", cut_pct: 30, month_hands: 60000, week_hours: 35, calendar_id: null },
];

const D_PEOPLE = [
  { id: "lucas", name: "Lucas Martin", team: "academy", team_id: "academy", roles: ["player"], mentor_id: "theo", stakes: "NL100", compta_sheet: "demo" },
  { id: "nina", name: "Nina Roux", team: "academy", team_id: "academy", roles: ["player"], mentor_id: "theo", stakes: "NL50" },
  { id: "hugo", name: "Hugo Dubois", team: "academy", team_id: "challenger", roles: ["player"], mentor_id: "sam", stakes: "NL200" },
  { id: "ines", name: "Inès Moreau", team: "academy", team_id: "academy", roles: ["player"], mentor_id: "sam", stakes: "NL100" },
  { id: "theo", name: "Théo Bernard", team: "elite", team_id: "master", roles: ["player", "mentor"], mentor_id: "alex", stakes: "NL1000" },
  { id: "sam", name: "Samuel Klein", team: "elite", team_id: "master", roles: ["player", "mentor"], mentor_id: "alex", stakes: "NL600" },
  { id: "max", name: "Maxime Petit", team: "elite", team_id: "supreme", roles: ["player", "coach", "manager"], coaches: ["academy", "elite"], manages: ["academy"], mentor_id: "alex", stakes: "NL2000" },
  { id: "alex", name: "Alex Demo", team: "elite", team_id: "supreme", roles: ["player", "coach", "mentor", "admin"], coaches: ["academy", "elite"], stakes: "NL2000" },
  { id: "ops", name: "Olivier Ops", team: "staff", team_id: null, roles: ["ops"] },
].map((p) => ({ coaches: [], manages: [], email: p.id + "@example.com", active: true, away_from: null, away_to: null, lang: "en", ...p }));

const D_USERS = [
  { id: "lucas", label: "Academy player" },
  { id: "theo", label: "Mentor (Elite player)" },
  { id: "max", label: "Coach + team manager" },
  { id: "alex", label: "Direction (admin)" },
  { id: "ops", label: "Ops (accounts)" },
];

function dIso(n) { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10); }
function dRand(seed) { return (n) => (Math.sin(seed * 97.3 + n * 13.7) + 1) / 2; }

const D_JOURNAL = [];
[["lucas", 1, 4, 2, 2100, 0], ["nina", 2, 3, 1.5, 1500, 2], ["hugo", 3, 4.5, 2.5, 2400, 0], ["ines", 4, 3, 1, 900, 5],
 ["theo", 5, 4, 1.5, 2800, 0], ["sam", 6, 4, 1, 2300, 1], ["max", 7, 3.5, 1, 2400, 0], ["alex", 8, 3, 1, 1500, 3]]
  .forEach(([pid, seed, play, study, hands, gap]) => {
    const r = dRand(seed);
    for (let i = gap + 1; i <= 75; i++) {
      if (i > gap + 2 && r(i) < 0.12) continue;                   // a few days off
      const tags = Object.keys(TAGS).filter((k, j) => r(i * 3 + j) > 0.86).slice(0, 3);
      D_JOURNAL.push({
        player_id: pid, day: dIso(i), play_h: Math.round(play * (0.5 + r(i + 1)) * 2) / 2, study_h: Math.round(study * (0.4 + r(i + 2)) * 2) / 2,
        hands: Math.round(hands * (0.5 + r(i + 3)) / 50) * 50, mood: 2 + Math.round(r(i + 4) * 3), tags,
        played: ["Solid session, good table selection.", "Started well, lost focus after 2 hours.", "Patient, waited for good spots."][i % 3],
        learned: ["River overbets need a capped range.", "Fold more vs regs' turn raises.", "3-bet linear vs fish."][i % 3],
        did_well: ["Stuck to my stop-loss.", "Reviewed 20 hands after the session.", "No tilt after a cooler."][i % 3],
        mistakes: ["One emotional river call.", "Too many tables late.", "Skipped the warm-up."][i % 3],
      });
    }
  });

const D_GOALS = [
  { player_id: "lucas", period: "month", label: "current", status: "confirmed", hands_target: 50000, play_h_target: 110, study_h_target: 45, items: ["Review SB vs BTN: 30 tagged hands", "Stop-loss at 3 buy-ins every session"] },
  { player_id: "nina", period: "month", label: "current", status: "proposed", hands_target: 40000, play_h_target: 90, study_h_target: 40, items: ["Finish the multiway module"] },
];

const D_REPORTS = [
  { player_id: "lucas", month: "prev", rating: 7, wins: "Best volume month so far. Stop-loss respected.", struggles: "Big blind defence vs aggressive buttons.", next_focus: "BB vs BTN, check-raise flop.", mentor_note: "Good month. Keep the volume, fix BB defence." },
];

const D_MENTORINGS = [
  { id: "m1", player_id: "lucas", mentor_id: "theo", day: dIso(6), status: "validated",
    feedback: ["Great discipline: stop-loss kept all week.", "BB defence too passive vs aggressive BTN.", "Volume behind: 31k hands on the 20th."],
    next_steps: ["Catch up volume: 2,300 hands a day", "Rewatch the BB vs BTN coaching"], transcript: "Théo: How did the week feel at the table? Lucas: Pretty good, I kept my stop-loss every day..." },
  { id: "m2", player_id: "nina", mentor_id: "theo", day: dIso(2), status: "draft",
    feedback: ["Volume up 20% vs last month.", "Journal filled 22 days out of 24.", "Multiway spots still shaky."],
    next_steps: ["Finish the multiway module before the 8th", "35k hands next month"], transcript: "Théo: Hi Nina, shall we go over the month? Nina: Yes, I played more this time..." },
];

const D_COACHINGS = [
  { id: "c1", day: dIso(52), title: "Multiway: playing 3-way pots", coach: "Enzo", teams: ["academy"], module: "Module 1 · Multiway", duration: "1 h 32", slides_url: null, replay_url: null,
    notes: ["Multiway: c-bet much less, checking is the base.", "Draws lose value, made hands gain.", "Against two players a bluff must work twice."] },
  { id: "c2", day: dIso(38), title: "SB vs HJ: 3-bet or fold", coach: "Alex", teams: ["academy", "elite"], module: "Module 2 · Blinds", duration: "1 h 45", slides_url: null, replay_url: null,
    notes: ["Flatting SB vs HJ is costly: remove almost all calls.", "11 bb sizing to take the initiative out of position.", "Bluffs chosen for blockers (Ax) and playability (suited)."] },
  { id: "c3", day: dIso(24), title: "BB vs BTN: flop check-raise", coach: "Adrien", teams: ["academy"], module: "Module 3 · Big blind", duration: "1 h 40", slides_url: null, replay_url: null,
    notes: ["Check-raise mostly on low connected boards.", "Size: 3x the c-bet.", "Check-raise range = strong hands + draws, no pure bluffs."] },
  { id: "c4", day: dIso(10), title: "Value bet: thickness and sizing", coach: "Alex", teams: ["elite"], module: "Module 4 · River", duration: "1 h 55", slides_url: null, replay_url: null,
    notes: ["River: value bet thinner vs players who call too much.", "Overbet for value when villain's range is capped."] },
];
const D_ATTENDANCE = { lucas: ["c1", "c2", "c3"], nina: ["c1", "c3"], hugo: ["c1", "c2", "c3"], ines: ["c2"], theo: ["c2", "c4"], sam: ["c4"], max: ["c2", "c4"], alex: ["c2", "c4"] };

const D_EXERCISES = [
  { id: "e1", coaching_id: "c2", teams: ["academy", "elite"], title: "Tag 30 SB vs HJ hands in your database", detail: "Mark every flat, compare with the new 3-bet range." },
  { id: "e2", coaching_id: "c3", teams: ["academy"], title: "Review 20 BB vs BTN flops", detail: "Note where you should have check-raised." },
  { id: "e3", coaching_id: "c4", teams: ["elite"], title: "Find 10 thin river value spots", detail: "Post 2 of them in your Discord channel." },
];
const D_EXDONE = { lucas: ["e1"] };

const D_QUIZZES = [
  { id: "q-sb-hj", title: "SB vs HJ: 3-bet or fold", module: "Module 2 · Blinds", coaching_id: "c2", teams: ["academy", "elite"], status: "live" },
  { id: "q-value", title: "Value bet: thickness and sizing", module: "Module 4 · River", coaching_id: "c4", teams: ["elite"], status: "draft" },
];
const D_QUESTIONS = [
  { id: "qq1", quiz_id: "q-sb-hj", pos: 1, q: "HJ opens 2.5 bb, folds to you in the SB with KQo, 100 bb deep. Agreed play?", spot: { positions: "SB vs HJ", stacks_bb: 100, line: "HJ open 2.5bb" }, choices: ["Call", "3-bet to 11 bb", "3-bet to 8 bb", "Fold"], answer: 1, why: "We remove calls in the SB vs HJ; KQo is a value 3-bet at 11 bb out of position.", situation_id: "sb-hj-pre" },
  { id: "qq2", quiz_id: "q-sb-hj", pos: 2, q: "Same spot with A4s. Agreed play?", spot: { positions: "SB vs HJ", stacks_bb: 100, line: "HJ open 2.5bb" }, choices: ["3-bet to 11 bb as a bluff", "Call", "Fold", "Limp"], answer: 0, why: "Ax suited blocks AA/AK and plays well when called: a standard bluff 3-bet.", situation_id: "sb-hj-pre" },
  { id: "qq3", quiz_id: "q-sb-hj", pos: 3, q: "Same spot with 76s. Agreed play?", spot: { positions: "SB vs HJ", stacks_bb: 100, line: "HJ open 2.5bb" }, choices: ["Call", "3-bet to 11 bb", "Fold", "3-bet to 15 bb"], answer: 2, why: "Without the flat, mid suited connectors without blockers fold vs HJ.", situation_id: "sb-hj-pre" },
  { id: "qq4", quiz_id: "q-value", pos: 1, q: "River, villain's range is capped and he calls too much. Best value sizing?", spot: { positions: "BTN vs BB", stacks_bb: 100, board: "K72r 4 2", line: "c-bet, check, check" }, choices: ["33% pot", "75% pot", "150% pot overbet", "Check"], answer: 2, why: "Capped range + calling station: overbet for value.", situation_id: null },
];

const D_SUBJECTS = [{ id: "sb-defence", label: "SB defence", coach_id: "alex" }, { id: "bb-defence", label: "BB defence", coach_id: "max" }];
const D_SITUATIONS = [
  { id: "sb-hj-pre", subject_id: "sb-defence", title: "SB vs HJ open, 100 bb", pot: "SRP", hero_pos: "SB", villain_pos: "HJ", street: "preflop", villain_type: "any", stacks_bb: 100, board: null,
    line: "HJ opens 2.5 bb, folds to SB", action: "3-bet or fold", sizing: "11 bb", frequency: "~12% 3-bet", conclusion: "No flat in the SB vs HJ. 3-bet linear-ish to 11 bb, fold the rest.", why: "Flatting out of position with BB behind loses EV; the initiative matters more.", teams: ["academy", "elite"], source_title: "SB vs HJ: 3-bet or fold", source_ts: "00:14:20", status: "live" },
  { id: "bb-btn-cr", subject_id: "bb-defence", title: "BB vs BTN c-bet, low connected flop", pot: "SRP", hero_pos: "BB", villain_pos: "BTN", street: "flop", villain_type: "reg", stacks_bb: 100, board: "765 two-tone",
    line: "BTN open 2.5 bb, BB call, BB check, BTN c-bet 33%", action: "Check-raise", sizing: "3x the c-bet", frequency: "~18%", conclusion: "Check-raise strong hands + draws on low connected boards, no pure bluffs.", why: "These boards hit the BB range; draws give equity when called.", teams: ["academy", "elite"], source_title: "BB vs BTN: flop check-raise", source_ts: "00:32:05", status: "live" },
  { id: "river-overbet", subject_id: null, title: "River overbet vs capped range", pot: "SRP", hero_pos: "BTN", villain_pos: "BB", street: "river", villain_type: "fish", stacks_bb: 100, board: "K72r 4 2",
    line: "c-bet flop, check turn, villain checks river", action: "Bet", sizing: "150% pot", frequency: null, conclusion: "Overbet for value when villain is capped and calls too much.", why: "His range has no strong Kx left; a station pays big sizes.", teams: ["elite"], source_title: "Value bet: thickness and sizing", source_ts: "01:02:40", status: "live" },
  { id: "co-btn-3b", subject_id: null, title: "BTN vs CO open, 3-bet vs fish", pot: "SRP", hero_pos: "BTN", villain_pos: "CO", street: "preflop", villain_type: "fish", stacks_bb: 100, board: null,
    line: "CO (fish) opens 3 bb", action: "3-bet linear", sizing: "10 bb", frequency: null, conclusion: "Vs fish, 3-bet linear and bigger; drop the light bluffs.", why: "Fish call 3-bets too wide: value hands win more, bluffs lose fold equity.", teams: ["academy", "elite"], source_title: "Player research (draft)", source_ts: null, status: "draft", submitted_by: "lucas" },
];

/* Sample money only (decided: finance tab on sample data at the demo). */
function dFinances(pid) {
  const r = dRand(pid.length * 7), out = [], now = new Date();
  for (let i = 5; i >= 0; i--) {
    const m = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const result = Math.round((r(i) - 0.3) * 6000 / 10) * 10;
    out.push({ month: m.toISOString().slice(0, 10), result, cut: Math.max(0, result) * 0.35, paid: i > 0 ? Math.max(0, result) * 0.35 : 0, makeup: result < 0 ? -result : 0 });
  }
  return out;
}

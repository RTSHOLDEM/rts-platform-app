/* Data layer. Same calls for both sources:
   - live: Supabase. The database rules (supabase/*.sql) decide what each person receives.
   - demo (?demo in the URL): made-up players from demo-data.js, with a "view as" switcher.
     The demo copies the same who-sees-what rules in JavaScript. */

const CFG = window.RTS_CONFIG || {};
const LIVE = !!(CFG.supabaseUrl && CFG.supabaseAnonKey) && !new URLSearchParams(location.search).has("demo");

const iso = (d) => d.toISOString().slice(0, 10);
const addDays = (n, from = new Date()) => { const d = new Date(from); d.setDate(d.getDate() + n); return iso(d); };
const monthStart = (d = new Date()) => iso(new Date(Date.UTC(d.getFullYear(), d.getMonth(), 1)));
const prevMonthStart = () => { const d = new Date(); return iso(new Date(Date.UTC(d.getFullYear(), d.getMonth() - 1, 1))); };

/* Retry deck: a missed question comes back in 2 days; each right answer multiplies the wait by 2.5; out after 12+ days. */
function nextReview(prev, correct) {
  if (!correct) return { due: addDays(2), interval_days: 2 };
  if (!prev) return null;
  const interval = Math.round(prev.interval_days * 2.5);
  return interval >= 12 ? null : { due: addDays(interval), interval_days: interval };
}

/* ---------- live (Supabase) ---------- */
function liveDb() {
  const sb = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey);
  const rows = async (q) => { const { data, error } = await q; if (error) throw error; return data || []; };
  let meCache = null;
  const db = {
    mode: "live",
    async session() { return (await sb.auth.getSession()).data.session; },
    async signIn(email) {
      const { error } = await sb.auth.signInWithOtp({ email: email.trim().toLowerCase(), options: { emailRedirectTo: location.origin + location.pathname } });
      if (error) throw new Error(/registered|Database error/i.test(error.message) ? t("notRegistered") : error.message);
    },
    async signOut() { meCache = null; await sb.auth.signOut(); },
    onAuth(fn) { sb.auth.onAuthStateChange((ev) => { if (ev === "SIGNED_IN" || ev === "SIGNED_OUT") { meCache = null; fn(); } }); },
    async me() {
      if (meCache) return meCache;
      const s = await db.session(); if (!s) return null;
      const [p] = await rows(sb.from("profiles").select("*").eq("auth_id", s.user.id).limit(1));
      return (meCache = p || null);
    },
    refresh() { meCache = null; },
    async people() { return rows(sb.from("profiles").select("*").order("name")); },
    async teams() { return rows(sb.from("teams").select("*")); },
    async setLang(l) { await sb.rpc("set_lang", { l }); },
    async setAway(from, to) { const { error } = await sb.rpc("set_away", { d_from: from || null, d_to: to || null }); if (error) throw error; meCache = null; },
    async journal(pid, from) { return rows(sb.from("journal").select("*").eq("player_id", pid).gte("day", from).order("day", { ascending: false })); },
    async journalAll(from) { return rows(sb.from("journal").select("player_id,day,study_h,play_h,hands,tags").gte("day", from)); },
    async saveJournal(e) { return rows(sb.from("journal").upsert({ ...e, updated_at: new Date().toISOString() }, { onConflict: "player_id,day" }).select()); },
    async goals(pid) { return rows(sb.from("goals").select("*").eq("player_id", pid).eq("period", "month").order("label", { ascending: false })); },
    async weekGoals(pid) { return rows(sb.from("goals").select("*").eq("player_id", pid).in("period", ["week", "quarter"]).order("label", { ascending: false })); },
    async saveGoal(g) { return rows(sb.from("goals").upsert({ ...g, updated_at: new Date().toISOString() }, { onConflict: "player_id,period,label" }).select()); },
    async report(pid, month) { return (await rows(sb.from("monthly_reports").select("*").eq("player_id", pid).eq("month", month)))[0] || null; },
    async saveReport(r) { return rows(sb.from("monthly_reports").upsert({ ...r, updated_at: new Date().toISOString() }, { onConflict: "player_id,month" }).select()); },
    async mentorings(pid) { return rows(sb.from("mentorings").select("*").eq("player_id", pid).order("day", { ascending: false })); },
    async saveMentoring(m) { return rows(sb.from("mentorings").update({ status: m.status }).eq("id", m.id).select()); },
    async editCall(c) { return rows(sb.from("mentorings").update({ conclusions: c.conclusions, feedback: c.feedback, next_steps: c.next_steps, steps_done: [] }).eq("id", c.id).select()); },
    async tickStep(id, idx, done) { const { error } = await sb.rpc("tick_step", { call_id: id, idx, done }); if (error) throw error; },
    async coachings() { return rows(sb.from("coachings").select("*").order("day", { ascending: false })); },
    async attendance(pid) { return (await rows(sb.from("attendance").select("coaching_id").eq("player_id", pid))).map((r) => r.coaching_id); },
    async exercises() { return rows(sb.from("exercises").select("*")); },
    async exerciseDone(pid) { return (await rows(sb.from("exercise_done").select("exercise_id").eq("player_id", pid))).map((r) => r.exercise_id); },
    async setExercise(id, done) {
      const pid = (await db.me()).id;
      return done ? rows(sb.from("exercise_done").upsert({ exercise_id: id, player_id: pid })) : rows(sb.from("exercise_done").delete().eq("exercise_id", id).eq("player_id", pid));
    },
    async quizzes() { return rows(sb.from("quizzes").select("*").order("created_at", { ascending: false })); },
    async approveQuiz(id) { const me = await db.me(); return rows(sb.from("quizzes").update({ status: "live", approved_by: me.id }).eq("id", id)); },
    async questions(quizId) { let q = sb.from("questions").select("*").order("pos"); if (quizId) q = q.eq("quiz_id", quizId); return rows(q); },
    async answers(pid) { return rows(sb.from("answers").select("*").eq("player_id", pid)); },
    async deck(pid) { return rows(sb.from("retry_deck").select("*").eq("player_id", pid)); },
    async answer(qid, correct) {
      const pid = (await db.me()).id;
      await rows(sb.from("answers").insert({ player_id: pid, question_id: qid, correct }));
      const [prev] = await rows(sb.from("retry_deck").select("*").eq("player_id", pid).eq("question_id", qid));
      const next = nextReview(prev, correct);
      if (next) await rows(sb.from("retry_deck").upsert({ player_id: pid, question_id: qid, ...next }));
      else if (prev) await rows(sb.from("retry_deck").delete().eq("player_id", pid).eq("question_id", qid));
    },
    async subjects() { return rows(sb.from("subjects").select("*")); },
    async situations() { return rows(sb.from("situations").select("*").order("title")); },
    async submitSituation(s) { const me = await db.me(); return rows(sb.from("situations").insert({ ...s, status: "draft", submitted_by: me.id }).select()); },
    async publishSituation(id) { const me = await db.me(); return rows(sb.from("situations").update({ status: "live", reviewed_by: me.id }).eq("id", id)); },
    async finances(pid) { return rows(sb.from("finances").select("*").eq("player_id", pid).order("month")); },
    async contractUrl(p) {
      if (!p.contract_path) return null;
      const { data, error } = await sb.storage.from("contracts").createSignedUrl(p.contract_path, 600);
      return error ? null : data.signedUrl;
    },
    async saveProfile(p) { return rows(p.id ? sb.from("profiles").update(p).eq("id", p.id).select() : sb.from("profiles").insert(p).select()); },
    // player hub (004)
    async sessions(pid, from) { return rows(sb.from("sessions").select("*").eq("player_id", pid).gte("started_at", from).order("started_at", { ascending: false })); },
    async openSession(pid) { return (await rows(sb.from("sessions").select("*").eq("player_id", pid).is("ended_at", null).order("started_at", { ascending: false }).limit(1)))[0] || null; },
    async startSession(kind, planned_min = null, topic = null) { const me = await db.me(); return (await rows(sb.from("sessions").insert({ player_id: me.id, kind, planned_min, ...(topic ? { topic } : {}) }).select()))[0]; },
    async saveSession(s) { return (await rows(sb.from("sessions").update(s).eq("id", s.id).select()))[0]; },
    async dropSession(id) { return rows(sb.from("sessions").delete().eq("id", id)); },
    async focus(pid) { return rows(sb.from("focus_items").select("*").eq("player_id", pid).eq("active", true).order("created_at")); },
    async addFocus(pid, text) { const me = await db.me(); return rows(sb.from("focus_items").insert({ player_id: pid, text, added_by: me.id }).select()); },
    async dropFocus(id) { return rows(sb.from("focus_items").update({ active: false }).eq("id", id)); },
    async hands() { const me = await db.me(); return rows(sb.from("hands").select("*").eq("player_id", me.id).order("created_at", { ascending: false })); },
    async addHand(h, file) {
      const me = await db.me();
      if (file) {
        const path = `${me.id}/${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`;
        const { error } = await sb.storage.from("hands").upload(path, file, { contentType: file.type });
        if (error) throw error;
        h.image_path = path;
      }
      return rows(sb.from("hands").insert({ ...h, player_id: me.id }).select());
    },
    async setHand(id, v) { return rows(sb.from("hands").update(v).eq("id", id)); },
    async toolUrl(name) { const { data, error } = await sb.storage.from("tools").createSignedUrl(name, 600, { download: true }); return error ? null : data.signedUrl; },
    async handImage(path) { const { data, error } = await sb.storage.from("hands").createSignedUrl(path, 600); return error ? null : data.signedUrl; },
    async cards() { return rows(sb.from("study_cards").select("*").order("created_at", { ascending: false })); },
    async addCard(c) { const me = await db.me(); return rows(sb.from("study_cards").insert({ ...c, player_id: me.id }).select()); },
    async addCards(l) { const me = await db.me(); return rows(sb.from("study_cards").insert(l.map((c) => ({ ...c, player_id: me.id }))).select()); },
    async saveCard(c) { return rows(sb.from("study_cards").update(c).eq("id", c.id)); },
    async directory() { const { data, error } = await sb.rpc("player_directory"); if (error) throw error; return data || []; },
    async events(from, to) { return rows(sb.from("events").select("*").gte("starts_at", from).lte("starts_at", to).order("starts_at")); },
    async saveEvent(e) { const me = await db.me(); return rows(e.id ? sb.from("events").update(e).eq("id", e.id).select() : sb.from("events").insert({ created_by: me.id, ...e }).select()); },
    async dropEvent(id) { return rows(sb.from("events").delete().eq("id", id)); },
    async joins(ids) { return ids.length ? rows(sb.from("event_joins").select("*").in("event_id", ids)) : []; },
    async join(id, on) { const me = await db.me(); return on ? rows(sb.from("event_joins").upsert({ event_id: id, player_id: me.id })) : rows(sb.from("event_joins").delete().eq("event_id", id).eq("player_id", me.id)); },
    // game layer (005)
    async myJoins() { const me = await db.me(); return rows(sb.from("event_joins").select("*").eq("player_id", me.id)); },
    async setPrefs(accent, skin) { const { error } = await sb.rpc("set_prefs", { p_accent: accent ?? null, p_skin: skin ?? null }); if (error) throw error; meCache = null; },
    async setLook(nick, avatar) { const { error } = await sb.rpc("set_look", { p_nick: nick ?? null, p_avatar: avatar ?? null }); if (error) throw error; meCache = null; },
    async notes() { const me = await db.me(); return rows(sb.from("opp_notes").select("*").eq("player_id", me.id).order("updated_at", { ascending: false })); },
    async saveNote(n) { const me = await db.me(); return rows(sb.from("opp_notes").upsert({ ...n, player_id: me.id, updated_at: new Date().toISOString() }, { onConflict: "player_id,nick" }).select()); },
    // feedback inbox (014): everyone sends, only admin reads all and ticks done
    async sendFeedback(f) { const me = await db.me(); return rows(sb.from("feedback").insert({ ...f, author_id: me.id })); },
    async feedback() { return rows(sb.from("feedback").select("*").order("created_at", { ascending: false })); },
    async setFeedback(id, status) { return rows(sb.from("feedback").update({ status }).eq("id", id)); },
    // RTS News (018): announcements + achievements, emoji reactions only
    async news() { return rows(sb.from("news").select("*, news_reactions(emoji, user_id)").eq("quiet", false).order("created_at", { ascending: false }).limit(40)); },
    async postNews(n) { const me = await db.me(); return rows(sb.from("news").insert({ kind: "announce", author_id: me.id, author_name: me.nick || me.name, ...n }).select()); },
    async dropNews(id) { return rows(sb.from("news").delete().eq("id", id)); },
    async myAch() { const me = await db.me(); return (await rows(sb.from("news").select("ach_id").eq("kind", "achievement").eq("author_id", me.id))).map((r) => r.ach_id); },
    async postAch(ids, quiet) { const me = await db.me(); return rows(sb.from("news").upsert(ids.map((a) => ({ kind: "achievement", author_id: me.id, author_name: me.nick || me.name, ach_id: a, quiet })), { onConflict: "author_id,ach_id", ignoreDuplicates: true })); },
    async react(news_id, emoji, on) { const me = await db.me(); const r = sb.from("news_reactions"); return on ? rows(r.insert({ news_id, user_id: me.id, emoji })) : rows(r.delete().match({ news_id, user_id: me.id, emoji })); },
    /* RTS HQ: live presence (who is where) + chat bubbles. Realtime only, nothing stored. */
    /* Public HQ channel for everyone. Secret accounts (Supreme only) live on the private "hq-sup" channel,
       which only Supreme and admin can join (Realtime policies, supabase/007). */
    hq(me, onSync, onChat, { secret = false, sees = false, hidden = false } = {}) {
      const opt = (priv) => ({ config: { private: priv, presence: { key: me.id }, broadcast: { self: true } } });
      const pub = sb.channel("rts-hq", opt(false)), sup = sees || secret ? sb.channel("hq-sup", opt(true)) : null, home = secret ? sup : pub;
      const sync = () => { const seen = {}; [pub, sup].filter(Boolean).forEach((ch) => Object.values(ch.presenceState()).forEach((l) => { const p = l[l.length - 1]; seen[p.id] = p; })); onSync(Object.values(seen)); };
      [pub, sup].filter(Boolean).forEach((ch) => ch.on("presence", { event: "sync" }, sync).on("broadcast", { event: "chat" }, ({ payload }) => onChat(payload))
        .subscribe((s) => { if (s === "SUBSCRIBED" && ch === home && !hidden) ch.track(me); }));
      return { track: (st) => home.track(st), untrack: () => home.untrack(), say: (text, kind) => home.send({ type: "broadcast", event: "chat", payload: { id: me.id, text, at: Date.now(), ...(kind ? { kind } : {}) } }),
        leave: () => [pub, sup].filter(Boolean).forEach((ch) => sb.removeChannel(ch)) };
    },
  };
  return db;
}

/* Recall cards (own study conclusions): a miss comes back in 1 day, each hit multiplies the wait by 2.5. */
function nextRecall(card, ok) {
  const interval = ok ? Math.max(2, Math.round((card.interval_days || 1) * 2.5)) : 1;
  return { due: addDays(interval), interval_days: interval };
}

/* ---------- demo (demo-data.js) ---------- */
function demoDb() {
  const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
  const store = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
  const S = load("rts-demo-v3", null) || {
    people: D_PEOPLE, journal: D_JOURNAL,
    goals: D_GOALS.map((g) => ({ ...g, label: g.label === "current" ? monthStart() : g.label })),
    reports: D_REPORTS.map((r) => ({ ...r, month: r.month === "prev" ? prevMonthStart() : r.month })),
    mentorings: D_MENTORINGS, situations: D_SITUATIONS, quizzes: D_QUIZZES,
    exdone: D_EXDONE, answers: [], deck: [],
  };
  if (typeof demoCoachings === "function" && !(S.events || []).some((e) => e.kind === "coaching")) (S.events ||= []).push(...demoCoachings());
  const save = () => store("rts-demo-v3", S);
  const meId = () => load("rts-demo-user", "lucas");
  const me = () => S.people.find((p) => p.id === meId());
  const byId = (id) => S.people.find((p) => p.id === id);
  const hid = (x) => !!x?.secret && x.id !== meId() && !(me().team_id === "supreme" || me().roles.includes("admin"));
  const canSee = (m, x) => !!x && (m.id === x.id || m.roles.includes("admin") || x.mentor_id === m.id || m.coaches.includes(x.team) || m.manages.includes(x.team));
  const canCoach = (m, x) => canSee(m, x) && (m.id !== x.id || m.roles.includes("admin"));
  const isOps = (m) => m.roles.includes("ops") || m.roles.includes("admin");
  const isStaffM = (m) => m.roles.some((r) => ["mentor", "coach", "manager", "admin", "ops"].includes(r));
  const inTeams = (m, teams) => m.roles.includes("admin") || teams.includes(m.team) || teams.some((x) => m.coaches.includes(x)) || teams.some((x) => m.manages.includes(x));
  const db = {
    mode: "demo", users: D_USERS,
    setUser(id) { store("rts-demo-user", id); },
    reset() { try { localStorage.removeItem("rts-demo-v3"); } catch {} },
    async session() { return { user: { id: meId() } }; },
    async signIn() {}, async signOut() {}, onAuth() {}, refresh() {},
    async me() { return me(); },
    async people() { const m = me(); return S.people.filter((p) => !hid(p) && (canSee(m, p) || p.id === m.mentor_id || isOps(m))); },
    async teams() { return D_TEAMS; },
    async setLang(l) { me().lang = l; save(); },
    async setAway(from, to) { Object.assign(me(), { away_from: from || null, away_to: to || null }); save(); },
    async journal(pid, from) { return canSee(me(), byId(pid)) ? S.journal.filter((e) => e.player_id === pid && e.day >= from).sort((a, b) => (a.day < b.day ? 1 : -1)) : []; },
    async journalAll(from) { const m = me(); return S.journal.filter((e) => e.day >= from && canSee(m, byId(e.player_id)) && !hid(byId(e.player_id))); },
    async saveJournal(e) { const i = S.journal.findIndex((x) => x.player_id === e.player_id && x.day === e.day); i >= 0 ? (S.journal[i] = e) : S.journal.push(e); save(); return [e]; },
    async goals(pid) { return canSee(me(), byId(pid)) ? S.goals.filter((g) => g.player_id === pid && (g.period || "month") === "month").sort((a, b) => (a.label < b.label ? 1 : -1)) : []; },
    async weekGoals(pid) { return canSee(me(), byId(pid)) ? S.goals.filter((g) => g.player_id === pid && ["week", "quarter"].includes(g.period)).sort((a, b) => (a.label < b.label ? 1 : -1)) : []; },
    async saveGoal(g) { const i = S.goals.findIndex((x) => x.player_id === g.player_id && x.label === g.label); i >= 0 ? (S.goals[i] = { ...S.goals[i], ...g }) : S.goals.push(g); save(); return [g]; },
    async report(pid, month) { return canSee(me(), byId(pid)) ? S.reports.find((r) => r.player_id === pid && r.month === month) || null : null; },
    async saveReport(r) { const i = S.reports.findIndex((x) => x.player_id === r.player_id && x.month === r.month); i >= 0 ? (S.reports[i] = { ...S.reports[i], ...r }) : S.reports.push(r); save(); return [r]; },
    async mentorings(pid) { const m = me(), x = byId(pid); return S.mentorings.filter((y) => y.player_id === pid && (canCoach(m, x) || (m.id === pid && y.status === "validated"))); },
    async saveMentoring(x) { const o = S.mentorings.find((y) => y.id === x.id); if (o) o.status = x.status; save(); return [o]; },
    async editCall(c) { const o = S.mentorings.find((y) => y.id === c.id); if (o) { Object.assign(o, c, { steps_done: [] }); save(); } return [o]; },
    async tickStep(id, idx, done) { const o = S.mentorings.find((y) => y.id === id); if (o) { o.steps_done = (o.steps_done || []).filter((i) => i !== idx).concat(done ? [idx] : []); save(); } },
    async coachings() { const m = me(); return D_COACHINGS.filter((c) => inTeams(m, c.teams)).sort((a, b) => (a.day < b.day ? 1 : -1)); },
    async attendance(pid) { return D_ATTENDANCE[pid] || []; },
    async exercises() { const m = me(); return D_EXERCISES.filter((e) => inTeams(m, e.teams)); },
    async exerciseDone(pid) { return S.exdone[pid] || []; },
    async setExercise(id, done) { const l = (S.exdone[meId()] ||= []); if (done) { if (!l.includes(id)) l.push(id); } else l.splice(l.indexOf(id), 1); save(); },
    async quizzes() { const m = me(); return S.quizzes.filter((q) => m.roles.includes("admin") || q.teams.some((x) => m.coaches.includes(x)) || (q.status === "live" && q.teams.includes(m.team))); },
    async approveQuiz(id) { S.quizzes.find((q) => q.id === id).status = "live"; save(); },
    async questions(quizId) { const ok = new Set((await db.quizzes()).map((q) => q.id)); return D_QUESTIONS.filter((q) => ok.has(q.quiz_id) && (!quizId || q.quiz_id === quizId)).sort((a, b) => a.pos - b.pos); },
    async answers(pid) { return canSee(me(), byId(pid)) ? S.answers.filter((a) => a.player_id === pid) : []; },
    async deck(pid) { return canSee(me(), byId(pid)) ? S.deck.filter((d) => d.player_id === pid) : []; },
    async answer(qid, correct) {
      const pid = meId();
      S.answers.push({ player_id: pid, question_id: qid, correct, answered_at: new Date().toISOString() });
      const i = S.deck.findIndex((d) => d.player_id === pid && d.question_id === qid);
      const next = nextReview(i >= 0 ? S.deck[i] : null, correct);
      if (next) { if (i >= 0) Object.assign(S.deck[i], next); else S.deck.push({ player_id: pid, question_id: qid, ...next }); }
      else if (i >= 0) S.deck.splice(i, 1);
      save();
    },
    async subjects() { return D_SUBJECTS; },
    async situations() {
      const m = me();
      return S.situations.filter((s) => m.roles.includes("admin") || (isStaffM(m) && s.status === "draft") || (s.status === "live" && inTeams(m, s.teams)) || s.submitted_by === m.id);
    },
    async submitSituation(s) { const x = { ...s, id: "sub-" + Date.now(), status: "draft", submitted_by: meId() }; S.situations.push(x); save(); return [x]; },
    async publishSituation(id) { S.situations.find((s) => s.id === id).status = "live"; save(); },
    async finances(pid) { const m = me(), x = byId(pid); return m.id === pid || m.roles.includes("admin") || m.manages.includes(x.team) ? dFinances(pid) : []; },
    async contractUrl() { return null; },
    async toolUrl() { return null; },
    async saveProfile(p) {
      if (!isOps(me())) throw new Error("Not allowed");
      if (p.id && byId(p.id)) Object.assign(byId(p.id), p);
      else S.people.push({ coaches: [], manages: [], active: true, lang: "en", away_from: null, away_to: null, ...p, id: "u" + Date.now() });
      save();
    },
    // player hub (004), same rules as the database
    async sessions(pid, from) { return canSee(me(), byId(pid)) ? (S.sessions ||= []).filter((s) => s.player_id === pid && s.started_at >= from).sort((a, b) => (a.started_at < b.started_at ? 1 : -1)) : []; },
    async openSession(pid) { return (S.sessions ||= []).find((s) => s.player_id === pid && !s.ended_at) || null; },
    async startSession(kind, planned_min = null, topic = null) { const s = { id: "se" + Date.now(), player_id: meId(), kind, planned_min, topic, started_at: new Date().toISOString(), ended_at: null }; (S.sessions ||= []).push(s); save(); return s; },
    async saveSession(x) { const s = S.sessions.find((y) => y.id === x.id); Object.assign(s, x); save(); return s; },
    async dropSession(id) { S.sessions = S.sessions.filter((x) => x.id !== id); (S.hands || []).forEach((h) => { if (h.session_id === id) h.session_id = null; }); save(); },
    async focus(pid) { return canSee(me(), byId(pid)) ? (S.focus ||= []).filter((f) => f.player_id === pid && f.active) : []; },
    async addFocus(pid, text) { (S.focus ||= []).push({ id: "f" + Date.now(), player_id: pid, text, added_by: meId(), active: true }); save(); },
    async dropFocus(id) { S.focus.find((f) => f.id === id).active = false; save(); },
    async hands() { return (S.hands ||= []).filter((h) => h.player_id === meId()).sort((a, b) => (a.created_at < b.created_at ? 1 : -1)); },
    async addHand(h, file) {
      if (file) h.image_data = await new Promise((ok) => { const r = new FileReader(); r.onload = () => ok(r.result); r.readAsDataURL(file); });
      (S.hands ||= []).push({ ...h, id: "h" + Date.now() + Math.random().toString(36).slice(2, 5), player_id: meId(), reviewed: false, created_at: new Date().toISOString() }); save();
    },
    async setHand(id, v) { Object.assign(S.hands.find((h) => h.id === id), v); save(); },
    async handImage() { return null; },
    async cards() { const m = me(); return (S.cards ||= []).filter((c) => canSee(m, byId(c.player_id)) || (c.shared && byId(c.player_id)?.team === m.team)); },
    async addCard(c) { (S.cards ||= []).push({ due: addDays(1), interval_days: 1, hits: 0, ...c, id: "k" + Date.now() + Math.random().toString(36).slice(2, 6), player_id: meId(), shared: !!c.shared, created_at: new Date().toISOString() }); save(); return [S.cards.at(-1)]; },
    async addCards(l) { for (const c of l) await db.addCard(c); },
    async saveCard(c) { Object.assign(S.cards.find((x) => x.id === c.id), c); save(); },
    async directory() { return S.people.filter((p) => p.roles.includes("player") && p.active !== false && !hid(p)).map((p) => ({ id: p.id, name: p.name, team_id: p.team_id || p.team, nick: p.nick, avatar: p.avatar, skin: p.skin })); },
    async events(from, to) {
      const m = me();
      return (S.events ||= []).filter((e) => e.starts_at >= from && e.starts_at <= to && !hid(byId(e.created_by)) && (e.created_by === m.id || e.invitees.includes(m.id) || (e.open && (!e.teams.length || e.teams.includes(m.team_id || m.team) || isStaffM(m)))))
        .sort((a, b) => (a.starts_at < b.starts_at ? -1 : 1));
    },
    async saveEvent(e) { if (e.id) Object.assign(S.events.find((x) => x.id === e.id), e); else (S.events ||= []).push({ invitees: [], teams: [], open: false, minutes: 60, created_by: meId(), ...e, id: "e" + Date.now() }); save(); },
    async dropEvent(id) { S.events = S.events.filter((e) => e.id !== id); save(); },
    async joins(ids) { return (S.joins ||= []).filter((j) => ids.includes(j.event_id)); },
    async join(id, on) { S.joins = (S.joins || []).filter((j) => !(j.event_id === id && j.player_id === meId())); if (on) S.joins.push({ event_id: id, player_id: meId() }); save(); },
    async myJoins() { return (S.joins || []).filter((j) => j.player_id === meId()); },
    async setPrefs(accent, skin) { if (accent) me().accent = accent; if (skin) me().skin = skin; save(); },
    async setLook(nick, avatar) { const m = me(); if (nick !== null) m.nick = (nick || "").trim().slice(0, 20) || null; if (avatar !== null) m.avatar = avatar; save(); },
    async notes() { return (S.notes ||= []).filter((n) => n.player_id === meId()).sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1)); },
    async saveNote(n) { const l = (S.notes ||= []); const i = l.findIndex((x) => x.player_id === meId() && x.nick === n.nick); const row = { ...(i >= 0 ? l[i] : { id: "n" + Date.now() }), ...n, player_id: meId(), updated_at: new Date().toISOString() }; i >= 0 ? (l[i] = row) : l.push(row); save(); },
    async sendFeedback(f) { (S.feedback ||= []).push({ id: "f" + Date.now(), status: "new", created_at: new Date().toISOString(), ...f, author_id: meId() }); save(); },
    async feedback() { const m = me(); return (S.feedback || []).filter((f) => m.roles.includes("admin") || f.author_id === m.id).sort((a, b) => (a.created_at < b.created_at ? 1 : -1)); },
    async setFeedback(id, status) { const f = (S.feedback || []).find((x) => x.id === id); if (f && me().roles.includes("admin")) { f.status = status; save(); } },
    async news() {
      if (!(S.news || []).some((n) => n.id === "nw1")) { const ago = (h) => new Date(Date.now() - h * 36e5).toISOString(), p = S.people.filter((x) => x.roles.includes("player")); S.news = [
        { id: "nw1", kind: "announce", author_id: "alexis", author_name: "Alex RTS", title: "Seminar 2027", body: "Dates are out: 15 to 18 January. Block them now.", created_at: ago(3), news_reactions: [{ emoji: "🔥", user_id: p[0]?.id }, { emoji: "🚀", user_id: p[1]?.id }] },
        { id: "nw2", kind: "achievement", author_id: p[0]?.id, author_name: p[0]?.name, ach_id: "hands500000", created_at: ago(20), news_reactions: [{ emoji: "👏", user_id: p[1]?.id }, { emoji: "👏", user_id: p[2]?.id }] },
        { id: "nw3", kind: "achievement", author_id: p[1]?.id, author_name: p[1]?.name, ach_id: "h100", created_at: ago(30), news_reactions: [] }, ...(S.news || [])]; save(); }
      return S.news.filter((n) => !n.quiet).sort((a, b) => (a.created_at < b.created_at ? 1 : -1)); },
    async postNews(n) { const m = me(); (S.news ||= []).push({ id: "nw" + Date.now(), kind: "announce", author_id: m.id, author_name: m.nick || m.name, created_at: new Date().toISOString(), news_reactions: [], ...n }); save(); },
    async dropNews(id) { S.news = (S.news || []).filter((n) => n.id !== id); save(); },
    async myAch() { return (S.news || []).filter((n) => n.kind === "achievement" && n.author_id === meId()).map((n) => n.ach_id); },
    async postAch(ids, quiet) { const m = me(); ids.forEach((a) => (S.news ||= []).push({ id: "nw" + Date.now() + a, kind: "achievement", author_id: m.id, author_name: m.nick || m.name, ach_id: a, quiet, created_at: new Date().toISOString(), news_reactions: [] })); save(); },
    async react(id, emoji, on) { const n = (S.news || []).find((x) => x.id === id); if (!n) return; n.news_reactions = (n.news_reactions || []).filter((r) => !(r.user_id === meId() && r.emoji === emoji)).concat(on ? [{ emoji, user_id: meId() }] : []); save(); },
    /* Demo HQ: teammates wander between rooms, so the map is alive without a server. */
    hq(meState, onSync, onChat) {
      let mine = meState;
      const rooms = ["lobby", "grind", "study", "review", "coaching"];
      const npcs = S.people.filter((p) => p.id !== meState.id && p.roles.includes("player") && !hid(p)).slice(0, 5).map((p, i) => ({ id: p.id, name: p.name, team: p.team_id, skin: ["academy", "suit", "hoodie", "shark", "cap"][i], room: rooms[(i + 1) % rooms.length], lvl: 3 + i * 4 }));
      const push = () => onSync([mine, ...npcs]);
      const lines = ["gl all", "anyone for a review at 20:00?", "running 6 tables tonight", "who has the SB vs BTN deck?", "gg"];
      const tick = setInterval(() => {
        const n = npcs[Math.floor(Math.random() * npcs.length)];
        if (Math.random() < 0.6) { n.room = rooms[Math.floor(Math.random() * rooms.length)]; push(); }
        else onChat({ id: n.id, text: lines[Math.floor(Math.random() * lines.length)], at: Date.now() });
      }, 6000);
      setTimeout(push, 50);
      return { track: (st) => { mine = st; push(); }, untrack: () => onSync(npcs), say: (text, kind) => onChat({ id: mine.id, text, at: Date.now(), ...(kind ? { kind } : {}) }), leave: () => clearInterval(tick) };
    },
  };
  return db;
}

window.db = LIVE ? liveDb() : demoDb();

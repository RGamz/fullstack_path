(() => {
  "use strict";

  const STORAGE_KEY = "fullstack-tracker-v1";
  const MODULES = window.CURRICULUM || [];

  // ---------- State ----------
  const emptyState = () => ({ done: {}, notes: {}, repos: {} });

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? { ...emptyState(), ...JSON.parse(raw) } : emptyState();
    } catch {
      return emptyState();
    }
  }
  let state = loadState();

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* storage unavailable */ }
  }

  const isDone = (id) => Boolean(state.done[id]);
  function setDone(id, value) {
    if (value) state.done[id] = new Date().toISOString();
    else delete state.done[id];
    save();
  }

  // ---------- Helpers ----------
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const ytSearch = (q) => "https://www.youtube.com/results?search_query=" + encodeURIComponent(q);
  const exId = (lessonId, i) => `${lessonId}#ex${i}`;
  const featId = (projectId, i) => `${projectId}#f${i}`;
  const pct = (a, b) => (b === 0 ? 0 : Math.round((a / b) * 100));
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const fmtDate = (iso) => new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

  // Everything you tick off, in learning order: each section's lessons, then its project(s).
  function* steps() {
    for (const m of MODULES) for (const s of m.sections) {
      for (const l of s.lessons) yield { kind: "lesson", item: l, module: m, section: s };
      for (const p of s.projects) yield { kind: "project", item: p, module: m, section: s };
    }
  }

  // ---------- Rendering ----------
  function renderNav() {
    $("#module-nav").innerHTML = MODULES.map((m, i) => `
      <li><a href="#m-${m.id}">
        <div class="nav-row"><span><span class="num">${i + 1}.</span>${esc(m.title)}</span><span class="nav-pct" data-nav-pct="${m.id}">0%</span></div>
        <div class="bar small"><div class="bar-fill" data-nav-bar="${m.id}"></div></div>
      </a></li>`).join("");
  }

  const checklist = (items, idFn) => items.map((html, i) => {
    const id = idFn(i);
    return `<li><input type="checkbox" id="${esc(id)}" data-id="${esc(id)}" ${isDone(id) ? "checked" : ""}><label for="${esc(id)}">${html}</label></li>`;
  }).join("");

  function renderLesson(l, n) {
    const docs = l.docs.map(([label, url]) =>
      `<a class="res" href="${esc(url)}" target="_blank" rel="noopener"><span class="ico">📄</span>${esc(label)}</a>`).join("");
    return `
    <div class="lesson ${isDone(l.id) ? "is-done" : ""}" id="l-${l.id}" data-lesson="${l.id}">
      <input type="checkbox" class="check lesson-check" data-id="${l.id}" aria-label="Mark “${esc(l.title)}” as done" ${isDone(l.id) ? "checked" : ""}>
      <details class="lesson-details">
      <summary>
        <span class="lesson-num">${n}</span>
        <span class="lesson-title">${esc(l.title)}</span>
        <span class="lesson-meta">
          <span class="chip" data-ex-count="${l.id}"></span>
          <span class="chip time">${esc(l.time)}</span>
        </span>
      </summary>
      <div class="lesson-body">
        <div class="theory">${l.theory}</div>
        <h4 class="label">Watch &amp; read</h4>
        <div class="resources">
          ${l.videos.map((v) => Array.isArray(v)
            ? `<a class="res video" href="${esc(v[1])}" target="_blank" rel="noopener"><span class="ico">▶</span>${esc(v[0])}</a>`
            : `<a class="res video" href="${ytSearch(v)}" target="_blank" rel="noopener"><span class="ico">▶</span>YouTube: ${esc(v)}</a>`).join("")}
          ${l.videos.some(Array.isArray)
            ? `<a class="res" href="${ytSearch(l.title)}" target="_blank" rel="noopener"><span class="ico">🔍</span>More on YouTube</a>`
            : ""}
          ${docs}
        </div>
        <h4 class="label">Exercises</h4>
        <ul class="ex-list">${checklist(l.exercises, (i) => exId(l.id, i))}</ul>
        <h4 class="label">My notes</h4>
        <textarea class="notes" data-notes="${l.id}" placeholder="What did you learn? What was confusing? Links to your code…">${esc(state.notes[l.id] || "")}</textarea>
        <div class="lesson-footer">
          <button type="button" class="btn mark-done ${isDone(l.id) ? "" : "primary"}" data-mark="${l.id}">${markLabel(isDone(l.id))}</button>
          <span class="done-at" data-done-at="${l.id}">${isDone(l.id) ? "Completed " + fmtDate(state.done[l.id]) : ""}</span>
        </div>
      </div>
      </details>
    </div>`;
  }

  const markLabel = (done) => (done ? "↺ Mark as not done" : "✓ Mark as done");

  function renderProject(p) {
    return `
    <article class="project ${isDone(p.id) ? "is-done" : ""}" id="p-${p.id}" data-project="${p.id}">
      <div class="project-head">
        <input type="checkbox" class="check" data-id="${p.id}" aria-label="Mark project done" ${isDone(p.id) ? "checked" : ""}>
        <div>
          <div class="project-kicker">🛠 Project <span class="chip" data-feat-count="${p.id}"></span></div>
          <h3>${esc(p.title)}</h3>
          <p class="project-summary">${esc(p.summary)}</p>
        </div>
      </div>
      <details class="brief">
        <summary>📋 Read the full brief</summary>
        <div class="theory">${p.brief}</div>
      </details>
      <h4 class="label">Done when</h4>
      <ul class="ex-list">${checklist(p.features, (i) => featId(p.id, i))}</ul>
      <div class="repo-row">
        <input class="repo" type="url" data-repo="${p.id}" placeholder="Paste your GitHub / live link" value="${esc(state.repos[p.id] || "")}">
        <a class="repo-open" data-repo-link="${p.id}" target="_blank" rel="noopener" hidden>↗ Open</a>
      </div>
    </article>`;
  }

  function renderModules() {
    $("#modules").innerHTML = MODULES.map((m, i) => {
      const lessons = m.sections.reduce((n, s) => n + s.lessons.length, 0);
      const projects = m.sections.reduce((n, s) => n + s.projects.length, 0);
      let n = 0;
      return `
      <section class="module" id="m-${m.id}">
        <div class="module-head">
          <h2><span class="mnum">${String(i + 1).padStart(2, "0")}</span>${esc(m.title)}</h2>
          <div class="meta">
            <span>⏱ ${esc(m.weeks)}</span>
            <span>📚 ${lessons} lessons · ${projects} projects</span>
            ${m.scrimba ? `<span>Scrimba equivalent: ${esc(m.scrimba)}</span>` : ""}
            ${m.fullCourse ? `<a href="${ytSearch(m.fullCourse)}" target="_blank" rel="noopener">▶ Find a full course video</a>` : ""}
          </div>
          <p>${esc(m.intro)}</p>
          <div class="module-progress">
            <div class="bar"><div class="bar-fill" data-mod-bar="${m.id}"></div></div>
            <span data-mod-label="${m.id}"></span>
          </div>
        </div>
        ${m.sections.map((s, si) => `
          <div class="section" id="s-${s.id}">
            <div class="section-head">
              <div class="section-kicker">Part ${si + 1} <span class="chip" data-sec-count="${s.id}"></span></div>
              <h3>${esc(s.title)}</h3>
              ${s.intro ? `<p>${esc(s.intro)}</p>` : ""}
            </div>
            ${s.lessons.map((l) => renderLesson(l, `${i + 1}.${++n}`)).join("")}
            ${s.projects.map(renderProject).join("")}
          </div>`).join("")}
        <nav class="module-pager" aria-label="Module navigation">
          ${i > 0 ? `<a class="btn" href="#m-${MODULES[i - 1].id}">← ${esc(MODULES[i - 1].title)}</a>` : "<span></span>"}
          ${i < MODULES.length - 1
            ? `<a class="btn primary" href="#m-${MODULES[i + 1].id}">Next module: ${esc(MODULES[i + 1].title)} →</a>`
            : `<span class="muted">🎉 This is the last module.</span>`}
        </nav>
      </section>`;
    }).join("");
  }

  // ---------- One module at a time ----------
  const MODULE_KEY = STORAGE_KEY + "-module";
  let currentModule = null;
  const moduleFromHash = () => {
    const id = location.hash.replace(/^#m-/, "");
    return MODULES.some((m) => m.id === id) ? id : null;
  };

  function showModule(id, { scroll = true } = {}) {
    currentModule = id;
    for (const m of MODULES) $(`#m-${CSS.escape(m.id)}`).hidden = m.id !== id;
    for (const a of $$("#module-nav a")) a.classList.toggle("active", a.getAttribute("href") === `#m-${id}`);
    if (location.hash !== `#m-${id}`) history.replaceState(null, "", `#m-${id}`);
    try { localStorage.setItem(MODULE_KEY, id); } catch {}
    if (scroll) $(`#m-${CSS.escape(id)}`).scrollIntoView({ block: "start" });
  }

  // ---------- Syntax highlighting (only when a lesson is opened; skipped if the CDN didn't load) ----------
  const LANG_ALIAS = { jsx: "javascript", tsx: "typescript", js: "javascript", ts: "typescript", sh: "bash", shell: "bash", powershell: "powershell", html: "xml", env: "bash" };
  function highlightIn(root) {
    if (!window.hljs) return;
    for (const el of $$("pre code:not(.hljs)", root)) {
      const m = el.className.match(/language-(\S+)/);
      if (m) {
        const lang = LANG_ALIAS[m[1]] || m[1];
        if (hljs.getLanguage(lang)) { el.className = "language-" + lang; hljs.highlightElement(el); continue; }
      }
      el.classList.add("hljs");
    }
  }

  // ---------- Progress ----------
  function computeStreak() {
    const days = new Set(Object.values(state.done).map((iso) => new Date(iso).toDateString()));
    let streak = 0;
    const d = new Date();
    if (!days.has(d.toDateString())) d.setDate(d.getDate() - 1); // streak still alive if you studied yesterday
    while (days.has(d.toDateString())) { streak++; d.setDate(d.getDate() - 1); }
    return streak;
  }

  function updateProgress() {
    let total = 0, doneTotal = 0, lessons = 0, lessonsDone = 0, exs = 0, exsDone = 0, projs = 0, projsDone = 0;

    for (const m of MODULES) {
      let mItems = 0, mDone = 0, mLessons = 0, mLessonsDone = 0, mProjs = 0, mProjsDone = 0;
      for (const s of m.sections) {
        const sl = s.lessons.filter((l) => isDone(l.id)).length;
        const sp = s.projects.filter((p) => isDone(p.id)).length;
        const sTotal = s.lessons.length + s.projects.length;
        const chip = $(`[data-sec-count="${s.id}"]`);
        chip.textContent = `${sl + sp}/${sTotal}`;
        chip.classList.toggle("done", sl + sp === sTotal);
        $(`#s-${CSS.escape(s.id)}`).classList.toggle("is-done", sl + sp === sTotal);

        for (const p of s.projects) {
          const f = p.features.filter((_, i) => isDone(featId(p.id, i))).length;
          const c = $(`[data-feat-count="${p.id}"]`);
          c.textContent = `${f}/${p.features.length} done`;
          c.classList.toggle("done", f === p.features.length);
        }
        mLessons += s.lessons.length; mLessonsDone += sl; mProjs += s.projects.length; mProjsDone += sp;

        for (const l of s.lessons) {
          exs += l.exercises.length;
          const e = l.exercises.filter((_, i) => isDone(exId(l.id, i))).length;
          exsDone += e;
          const c = $(`[data-ex-count="${l.id}"]`);
          c.textContent = `${e}/${l.exercises.length} ex`;
          c.classList.toggle("done", e === l.exercises.length);
        }
      }
      mItems = mLessons + mProjs; mDone = mLessonsDone + mProjsDone;
      total += mItems; doneTotal += mDone;
      lessons += mLessons; lessonsDone += mLessonsDone; projs += mProjs; projsDone += mProjsDone;

      const p = pct(mDone, mItems);
      for (const sel of [`[data-mod-bar="${m.id}"]`, `[data-nav-bar="${m.id}"]`]) {
        const bar = $(sel);
        bar.style.width = p + "%";
        bar.classList.toggle("complete", p === 100);
      }
      $(`[data-mod-label="${m.id}"]`).textContent = `${mLessonsDone}/${mLessons} lessons · ${mProjsDone}/${mProjs} projects · ${p}%`;
      $(`[data-nav-pct="${m.id}"]`).textContent = p === 100 ? "✓" : p + "%";
    }

    const overall = pct(doneTotal, total);
    $("#overall-pct").textContent = overall + "%";
    $("#overall-bar").style.width = overall + "%";
    $("#overall-bar").classList.toggle("complete", overall === 100);

    $("#stats").innerHTML = `
      <div class="stat"><div class="v">${lessonsDone}<span class="muted">/${lessons}</span></div><div class="l">Lessons</div></div>
      <div class="stat"><div class="v">${exsDone}<span class="muted">/${exs}</span></div><div class="l">Exercises</div></div>
      <div class="stat"><div class="v">${projsDone}<span class="muted">/${projs}</span></div><div class="l">Projects</div></div>
      <div class="stat"><div class="v">${computeStreak()} 🔥</div><div class="l">Day streak</div></div>`;

    const next = [...steps()].find((s) => !isDone(s.item.id));
    $("#continue-btn").textContent = next
      ? `▶ Continue: ${next.kind === "project" ? "🛠 " : ""}${next.item.title}`
      : "🎉 Everything is done!";
  }

  // ---------- Events ----------
  function onChange(e) {
    const t = e.target;
    if (!t.matches("input[type=checkbox][data-id]")) return;
    const id = t.dataset.id;
    setDone(id, t.checked);
    if (t.classList.contains("check")) markCard(id, t.checked);

    // Ticking the last "Done when" box of a project completes the project.
    const feat = id.match(/^(.+)#f\d+$/);
    if (feat && t.checked && !isDone(feat[1])) {
      const project = findProject(feat[1]);
      if (project && project.features.every((_, i) => isDone(featId(project.id, i)))) {
        setDone(project.id, true);
        markCard(project.id, true);
      }
    }
    updateProgress();
  }

  function markCard(id, done) {
    const card = $(`#l-${CSS.escape(id)}, #p-${CSS.escape(id)}`);
    if (!card) return;
    card.classList.toggle("is-done", done);
    $(`.check[data-id="${CSS.escape(id)}"]`, card).checked = done;
    const at = $(`[data-done-at="${CSS.escape(id)}"]`);
    if (at) at.textContent = done ? "Completed " + fmtDate(state.done[id]) : "";
    const btn = $(`[data-mark="${CSS.escape(id)}"]`);
    if (btn) { btn.textContent = markLabel(done); btn.classList.toggle("primary", !done); }
  }

  // "Mark as done" at the end of a lesson: tick it, close it, and keep its header in view.
  function onMarkClick(e) {
    const btn = e.target.closest(".mark-done");
    if (!btn) return;
    const id = btn.dataset.mark;
    const done = !isDone(id);
    setDone(id, done);
    markCard(id, done);
    if (done) {
      const card = $(`#l-${CSS.escape(id)}`);
      $(".lesson-details", card).open = false;
      if (card.getBoundingClientRect().top < 0) card.scrollIntoView({ block: "start" });
    }
    updateProgress();
  }

  function findProject(id) {
    for (const m of MODULES) for (const s of m.sections) for (const p of s.projects) if (p.id === id) return p;
    return null;
  }

  const isLink = (v) => /^https?:\/\/\S+\.\S+/.test(v.trim());
  function updateRepoLink(id) {
    const link = $(`[data-repo-link="${CSS.escape(id)}"]`);
    const value = state.repos[id] || "";
    link.hidden = !isLink(value);
    if (isLink(value)) link.href = value.trim();
  }

  function onInput(e) {
    const t = e.target;
    if (t.dataset.notes) { state.notes[t.dataset.notes] = t.value; save(); }
    if (t.dataset.repo) { state.repos[t.dataset.repo] = t.value; save(); updateRepoLink(t.dataset.repo); }
  }

  function continueLearning() {
    const next = [...steps()].find((s) => !isDone(s.item.id));
    if (!next) return;
    if (next.module.id !== currentModule) showModule(next.module.id, { scroll: false });
    const el = next.kind === "lesson" ? $(`#l-${CSS.escape(next.item.id)}`) : $(`#p-${CSS.escape(next.item.id)}`);
    $(next.kind === "lesson" ? ".lesson-details" : ".brief", el).open = true;
    highlightIn(el);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash");
  }

  function exportProgress() {
    const blob = new Blob([JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), ...state }, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `study-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000); // give the browser time to start the download
  }

  function importProgress(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        const isObj = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
        if (!isObj(data) || !isObj(data.done)) throw new Error("Missing 'done'");
        if (!confirm("Replace your current progress with the imported file?")) return;
        state = { done: data.done, notes: isObj(data.notes) ? data.notes : {}, repos: isObj(data.repos) ? data.repos : {} };
        save();
        renderAll();
      } catch (err) {
        alert("That file doesn't look like an exported progress file.\n" + err.message);
      }
    };
    reader.readAsText(file);
  }

  function renderAll() {
    renderNav();
    renderModules();
    for (const m of MODULES) for (const s of m.sections) for (const p of s.projects) updateRepoLink(p.id);
    updateProgress();
    showModule(currentModule, { scroll: false });
  }

  // ---------- Init ----------
  if (!MODULES.length) return; // keeps the "lessons haven't loaded" message visible
  let saved = null;
  try { saved = localStorage.getItem(MODULE_KEY); } catch {}
  currentModule = moduleFromHash() ?? (MODULES.some((m) => m.id === saved) ? saved : MODULES[0].id);
  renderAll();
  // Sidebar links and the previous/next buttons change the #m-… hash.
  window.addEventListener("hashchange", () => { const id = moduleFromHash(); if (id) showModule(id); });

  const main = $("main");
  main.addEventListener("change", onChange);
  main.addEventListener("input", onInput);
  main.addEventListener("toggle", (e) => { if (e.target.open) highlightIn(e.target); }, true);
  main.addEventListener("click", onMarkClick);

  $("#continue-btn").addEventListener("click", continueLearning);
  $("#hide-done").addEventListener("change", (e) => {
    document.body.classList.toggle("hide-done", e.target.checked);
    try { localStorage.setItem(STORAGE_KEY + "-hide", e.target.checked ? "1" : ""); } catch {}
  });
  try {
    if (localStorage.getItem(STORAGE_KEY + "-hide")) { $("#hide-done").checked = true; document.body.classList.add("hide-done"); }
  } catch {}
  $("#expand-all").addEventListener("click", () => $$(".module:not([hidden]) .lesson-details").forEach((d) => { d.open = true; }));
  $("#collapse-all").addEventListener("click", () => $$(".module:not([hidden]) .lesson-details, .module:not([hidden]) .brief").forEach((d) => { d.open = false; }));
  $("#export-btn").addEventListener("click", exportProgress);
  $("#import-input").addEventListener("change", (e) => { if (e.target.files[0]) importProgress(e.target.files[0]); e.target.value = ""; });
  $("#reset-btn").addEventListener("click", () => {
    if (confirm("Reset ALL progress, notes and links? Consider exporting first. This cannot be undone.")) {
      state = emptyState(); save(); renderAll();
    }
  });
})();

#!/usr/bin/env node
// Turns content/*.md into data/curriculum.js, which the website loads.
//
//   node build.mjs            build everything
//   node build.mjs --check    validate only, print stats, write nothing
//   node build.mjs --check content/02-express.md   validate one file
//   node build.mjs --links    print every external URL (for link checking)
//
// The format of the .md files is described in content/FORMAT.md.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

// Needs Node 20.11+ (import.meta.dirname); the course itself uses Node 22+.
const ROOT = import.meta.dirname;
const CONTENT_DIR = path.join(ROOT, "content");
const OUT_FILE = path.join(ROOT, "data", "curriculum.js");
const SITE_URL = "https://rgamz.github.io/fullstack_path/"; // change this if you fork the repo
const args = process.argv.slice(2);
const CHECK_ONLY = args.includes("--check");
const PRINT_LINKS = args.includes("--links");
const MIN_THEORY_WORDS = 350;

class BuildError extends Error {}
const fail = (file, line, msg) => { throw new BuildError(`${path.basename(file)}:${line}: ${msg}`); };

// ---------------------------------------------------------------- Markdown → HTML
const escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const links = new Set();
let tableWarnings = []; // filled by md(), reported per lesson/project

function inline(text) {
  const codes = [];
  // ``code with ` inside`` or `code`
  let s = text.replace(/``\s?(.+?)\s?``|`([^`]+)`/g, (_, dbl, single) => { codes.push(dbl ?? single); return `\u0000${codes.length - 1}\u0000`; });
  s = escapeHtml(s);
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, url) => {
    if (/^https?:/.test(url)) links.add(url.replace(/&amp;/g, "&"));
    return `<a href="${url}" target="_blank" rel="noopener">${label}</a>`;
  });
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?=[^*\w]|$)/g, "$1<em>$2</em>");
  s = s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${escapeHtml(codes[i])}</code>`);
  return s;
}

const isFence = (l) => /^\s*(```|~~~)/.test(l);
// Tracks code fences the same way md() does: a block opened with ``` only closes with ```, and ~~~ with ~~~.
function fenceTracker() {
  let open = null;
  return (line) => {
    if (isFence(line)) {
      const mark = line.trim().slice(0, 3);
      if (!open) open = mark;
      else if (line.trim().startsWith(open)) open = null;
    }
    return open !== null;
  };
}
// Split a table row on "|", but not on "|" inside `code` or written as "\|".
function splitRow(l) {
  const s = l.trim().replace(/^\|/, "").replace(/(?<!\\)\|$/, "");
  const cells = [];
  let cur = "", inCode = false;
  for (let k = 0; k < s.length; k++) {
    const c = s[k];
    if (c === "\\" && s[k + 1] === "|") { cur += "|"; k++; continue; }
    if (c === "`") inCode = !inCode;
    if (c === "|" && !inCode) { cells.push(cur.trim()); cur = ""; continue; }
    cur += c;
  }
  cells.push(cur.trim());
  return cells;
}
const isHeading = (l) => /^#{1,4}\s+\S/.test(l);
const isQuote = (l) => /^>\s?/.test(l);
const ulItem = (l) => l.match(/^(\s*)[-*]\s+(.*)$/);
const olItem = (l) => l.match(/^(\s*)\d+[.)]\s+(.*)$/);
const isTableStart = (lines, i) => /^\s*\|/.test(lines[i]) && /^\s*\|?\s*:?-{3,}/.test(lines[i + 1] || "");
const startsBlock = (lines, i) => {
  const l = lines[i];
  return !l.trim() || isFence(l) || isHeading(l) || isQuote(l) || ulItem(l) || olItem(l) || isTableStart(lines, i);
};

function md(src) {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }

    if (isFence(line)) {
      const fence = line.trim().slice(0, 3);
      const lang = line.trim().slice(3).trim();
      const code = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith(fence)) code.push(lines[i++]);
      i++; // closing fence
      const cls = lang ? ` class="language-${escapeHtml(lang)}"` : "";
      out.push(`<pre><code${cls}>${escapeHtml(code.join("\n"))}</code></pre>`);
      continue;
    }

    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      const tag = h[1].length <= 2 ? "h4" : "h5";
      out.push(`<${tag}>${inline(h[2].trim())}</${tag}>`);
      i++;
      continue;
    }

    if (isQuote(line)) {
      const inner = [];
      while (i < lines.length && isQuote(lines[i])) inner.push(lines[i++].replace(/^>\s?/, ""));
      out.push(`<blockquote>${md(inner.join("\n"))}</blockquote>`);
      continue;
    }

    if (isTableStart(lines, i)) {
      const head = splitRow(lines[i]);
      i += 2;
      const body = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) {
        const r = splitRow(lines[i]);
        if (r.length !== head.length) tableWarnings.push(`a table row has ${r.length} cells but the header has ${head.length}: ${lines[i].trim().slice(0, 70)}`);
        body.push(r);
        i++;
      }
      out.push(`<div class="table-wrap"><table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join("")}</tr></thead><tbody>${
        body.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`);
      continue;
    }

    const firstItem = ulItem(line) || olItem(line);
    if (firstItem) {
      const ordered = Boolean(olItem(line));
      const baseIndent = firstItem[1].length;
      const items = [];
      while (i < lines.length) {
        const l = lines[i];
        const m = ordered ? olItem(l) : ulItem(l);
        if (m && m[1].length === baseIndent) {
          items.push({ first: m[2], rest: [] });
          i++;
        } else if (items.length && l.trim() && (l.match(/^\s*/)[0].length > baseIndent)) {
          items.at(-1).rest.push(l.slice(Math.min(baseIndent + 2, l.match(/^\s*/)[0].length)));
          i++;
        } else if (items.length && !l.trim() && i + 1 < lines.length && lines[i + 1].match(/^\s*/)[0].length > baseIndent && lines[i + 1].trim()) {
          items.at(-1).rest.push("");
          i++;
        } else break;
      }
      const tag = ordered ? "ol" : "ul";
      out.push(`<${tag}>${items.map((it) => {
        const rest = it.rest.join("\n").trim();
        if (!rest) return `<li>${inline(it.first)}</li>`;
        // continuation text that is just a wrapped line stays inline; blocks are rendered
        const restLines = rest.split("\n");
        if (!restLines.some((_, k) => startsBlock(restLines, k) && restLines[k].trim()) && !rest.includes("\n\n")) {
          return `<li>${inline(it.first + " " + restLines.map((x) => x.trim()).join(" "))}</li>`;
        }
        return `<li>${inline(it.first)}${md(rest)}</li>`;
      }).join("")}</${tag}>`);
      continue;
    }

    const para = [];
    while (i < lines.length && !startsBlock(lines, i)) para.push(lines[i++].trim());
    out.push(`<p>${inline(para.join(" "))}</p>`);
  }
  return out.join("\n");
}

// ---------------------------------------------------------------- Parse content files
const ALLOWED_KEYS = {
  module: ["id", "title", "scrimba", "weeks", "fullCourse", "intro"],
  section: ["id", "title", "intro"],
  lesson: ["id", "title", "time", "video", "docs"],
  project: ["id", "title", "summary"],
};

function parseBlocks(file) {
  const lines = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  const inFenceAfter = fenceTracker();
  let cur = null, inHeader = false, inFence = false;
  lines.forEach((line, idx) => {
    const ln = idx + 1;
    if (!inHeader) inFence = inFenceAfter(line);
    const start = !inFence && line.match(/^---(module|section|lesson|project)\s*$/);
    if (start) {
      if (inHeader) fail(file, ln, `previous header (line ${cur.line}) was not closed with ---`);
      cur = { type: start[1], meta: {}, docs: [], body: [], line: ln, file };
      blocks.push(cur);
      inHeader = true;
      return;
    }
    if (inHeader) {
      if (line.trim() === "---") { inHeader = false; return; }
      if (!line.trim()) return;
      const kv = line.match(/^(\w+):\s*(.*)$/);
      if (!kv) fail(file, ln, `expected "key: value" inside the ${cur.type} header, got: ${line}`);
      if (!ALLOWED_KEYS[cur.type].includes(kv[1])) {
        fail(file, ln, `unknown key "${kv[1]}:" in a ${cur.type} header (allowed: ${ALLOWED_KEYS[cur.type].join(", ")})`);
      }
      if (kv[1] === "docs") cur.docs.push({ value: kv[2].trim(), line: ln });
      else cur.meta[kv[1]] = kv[2].trim();
      return;
    }
    if (cur) cur.body.push({ text: line, line: ln });
  });
  if (inFence) fail(file, lines.length, "a ``` code fence is never closed");
  if (inHeader) fail(file, lines.length, "a header is never closed with ---");
  return blocks;
}

function need(block, ...keys) {
  for (const k of keys) if (!block.meta[k]) fail(block.file, block.line, `${block.type} is missing "${k}:"`);
}

function listItems(file, lines, what) {
  // top-level "- item" / "1. item" entries; indented lines continue the previous item
  const items = [];
  for (const { text, line } of lines) {
    const m = text.match(/^[-*]\s+(.*)$/) || text.match(/^\d+[.)]\s+(.*)$/);
    if (m) items.push(m[1]);
    else if (text.trim() && items.length && /^\s+/.test(text)) items[items.length - 1] += " " + text.trim();
    else if (text.trim()) fail(file, line, `${what} must be a list ("- item"); this line would be lost: ${text.trim().slice(0, 60)}`);
  }
  return items;
}

function splitSections(bodyLines) {
  // split a body by "### Heading" lines (outside code fences)
  const parts = [{ title: null, line: bodyLines[0]?.line, lines: [] }];
  const inFenceAfter = fenceTracker();
  for (const l of bodyLines) {
    const inFence = inFenceAfter(l.text);
    const h = !inFence && l.text.match(/^###\s+(.+?)\s*$/);
    if (h) parts.push({ title: h[1], line: l.line, lines: [] });
    else parts.at(-1).lines.push(l);
  }
  return parts;
}

const hasText = (part) => part.lines.some((l) => l.text.trim());

// Report table problems found while rendering, pointing at the lesson/project they belong to.
function render(file, block, markdown) {
  tableWarnings = [];
  const html = md(markdown);
  for (const w of tableWarnings) console.log(`   ⚠ ${path.basename(file)}:${block.line} (${block.meta.id}): ${w}`);
  return html;
}

const wordCount = (s) => (s.match(/[A-Za-z0-9'’]+/g) || []).length;
const textOf = (lines) => lines.map((l) => l.text).join("\n");

function buildModule(file) {
  const blocks = parseBlocks(file);
  if (!blocks.length || blocks[0].type !== "module") fail(file, 1, "file must start with a ---module header");
  const mb = blocks[0];
  need(mb, "id", "title", "weeks", "intro");
  const mod = {
    id: mb.meta.id, title: mb.meta.title, scrimba: mb.meta.scrimba || "", weeks: mb.meta.weeks,
    intro: mb.meta.intro, fullCourse: mb.meta.fullCourse || "", sections: [],
  };
  const stats = { lessons: 0, projects: 0, videos: 0, words: [], short: [] };

  for (const b of blocks.slice(1)) {
    if (b.type === "module") fail(file, b.line, "only one ---module per file");
    if (b.type === "section") {
      need(b, "id", "title");
      mod.sections.push({ id: b.meta.id, title: b.meta.title, intro: b.meta.intro || "", lessons: [], projects: [] });
      continue;
    }
    const sec = mod.sections.at(-1);
    if (!sec) fail(file, b.line, `${b.type} must come after a ---section`);

    if (b.type === "lesson") {
      need(b, "id", "title", "time", "video");
      const parts = splitSections(b.body);
      const exIndex = parts.findIndex((p) => /^exercises$/i.test(p.title));
      if (exIndex === -1) fail(file, b.line, `lesson ${b.meta.id} has no "### Exercises" heading`);
      const exPart = parts[exIndex];
      const after = parts.slice(exIndex + 1);
      if (after.length) fail(file, after[0].line, `lesson ${b.meta.id}: "### ${after[0].title}" comes after "### Exercises" and would be lost; move it above the exercises`);
      const theoryLines = [];
      for (const p of parts.slice(0, exIndex)) {
        if (p.title) theoryLines.push({ text: "### " + p.title });
        theoryLines.push(...p.lines);
      }
      const theory = textOf(theoryLines).trim();
      const exercises = listItems(file, exPart.lines, `lesson ${b.meta.id}: exercises`);
      if (!theory) fail(file, b.line, `lesson ${b.meta.id} has no theory`);
      if (exercises.length < 2) fail(file, b.line, `lesson ${b.meta.id} needs at least 2 exercises`);
      const docs = b.docs.map(({ value, line }) => {
        const [label, url] = value.split(/\s+\|\s+/);
        if (!label || !/^https?:\/\//.test(url || "")) fail(file, line, `docs must look like "Label | https://…"`);
        links.add(url);
        return [label, url];
      });
      // video: either a YouTube search query, or "Label | https://…" for a specific video
      let video = b.meta.video;
      if (/\s\|\s/.test(video)) {
        const [label, url, ...rest] = video.split(/\s+\|\s+/);
        if (!label || !/^https?:\/\//.test(url || "") || rest.length) {
          fail(file, b.line, `video must be a search query or "Label | https://…" (no other " | " in the label)`);
        }
        links.add(url);
        video = [label, url];
        stats.videos++;
      }
      const words = wordCount(theory);
      stats.words.push(words);
      if (words < MIN_THEORY_WORDS) stats.short.push(`${b.meta.id} (${words} words)`);
      sec.lessons.push({
        id: b.meta.id, title: b.meta.title, time: b.meta.time, video, docs,
        theory: render(file, b, theory), exercises: exercises.map(inline), words,
      });
      stats.lessons++;
      continue;
    }

    if (b.type === "project") {
      need(b, "id", "title", "summary");
      const parts = splitSections(b.body);
      const done = parts.find((p) => /^done when$/i.test(p.title || ""));
      if (!done) fail(file, b.line, `project ${b.meta.id} has no "### Done when" list`);
      const features = listItems(file, done.lines, `project ${b.meta.id}: "Done when"`);
      if (features.length < 2) fail(file, b.line, `project ${b.meta.id} needs at least 2 "Done when" items`);
      if (!parts.some((p) => /^the task$/i.test(p.title || ""))) fail(file, b.line, `project ${b.meta.id} has no "### The task"`);
      if (hasText(parts[0])) fail(file, parts[0].lines.find((l) => l.text.trim()).line, `project ${b.meta.id}: text before the first "###" heading would be lost; put it under "### The task"`);
      const brief = parts.filter((p) => p !== done && p.title)
        .map((p) => `## ${p.title}\n${textOf(p.lines)}`).join("\n\n");
      sec.projects.push({ id: b.meta.id, title: b.meta.title, summary: b.meta.summary, brief: render(file, b, brief), features: features.map(inline) });
      stats.projects++;
    }
  }
  for (const s of mod.sections) {
    if (!s.lessons.length && !s.projects.length) fail(file, 1, `section ${s.id} is empty`);
  }
  return { mod, stats };
}

// ---------------------------------------------------------------- SYLLABUS.md (readable on GitHub)
const SYLLABUS_FILE = path.join(ROOT, "SYLLABUS.md");

function syllabus(modules, totals) {
  const out = [
    "# Syllabus",
    "",
    "<!-- GENERATED by build.mjs from content/*.md. Do not edit by hand. -->",
    "",
    `${modules.length} modules · ${totals.lessons} lessons · ${totals.exercises} exercises · ${totals.projects} projects. ` +
      "Each part is a few lessons followed by a project (🛠) that uses what those lessons taught.",
    "",
    `Full lessons, exercises, project briefs and a progress tracker: **${SITE_URL}** (or open \`index.html\` locally).`,
    "",
    "## Modules",
    "",
    ...modules.map((m, i) => `${i + 1}. [${m.title}](#${i + 1}-${m.title.toLowerCase().replace(/[^a-z0-9 -]/g, "").replace(/ /g, "-")}) · ${m.weeks}`),
    "",
  ];
  modules.forEach((m, i) => {
    out.push(`## ${i + 1}. ${m.title}`, "", `*${m.weeks}.* ${m.intro}`, "");
    let n = 0;
    m.sections.forEach((s, si) => {
      out.push(`### Part ${si + 1}: ${s.title}`, "");
      if (s.intro) out.push(s.intro, "");
      for (const l of s.lessons) out.push(`- ${i + 1}.${++n} ${l.title} *(${l.time})*`);
      for (const p of s.projects) out.push(`- 🛠 **Project: ${p.title}**: ${p.summary}`);
      out.push("");
    });
  });
  return out.join("\n");
}

// ---------------------------------------------------------------- Main
try {
  const only = args.filter((a) => a.endsWith(".md")).map((a) => path.basename(a));
  if (only.length && !CHECK_ONLY) throw new BuildError("naming single files only works with --check");
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => /^\d+.*\.md$/.test(f))
    .filter((f) => !only.length || only.includes(f)).sort();
  if (!files.length) throw new BuildError("no content/NN-*.md files found");
  const modules = [];
  const seen = new Map();
  let totals = { lessons: 0, projects: 0, exercises: 0 };

  for (const f of files) {
    const { mod, stats } = buildModule(path.join(CONTENT_DIR, f));
    const ids = [mod.id, ...mod.sections.flatMap((s) => [s.id, ...s.lessons.map((l) => l.id), ...s.projects.map((p) => p.id)])];
    for (const id of ids) {
      if (seen.has(id)) throw new BuildError(`duplicate id "${id}" in ${f} and ${seen.get(id)}`);
      seen.set(id, f);
    }
    modules.push(mod);
    const ex = mod.sections.reduce((n, s) => n + s.lessons.reduce((m, l) => m + l.exercises.length, 0), 0);
    totals.lessons += stats.lessons; totals.projects += stats.projects; totals.exercises += ex;
    const avg = stats.words.length ? Math.round(stats.words.reduce((a, b) => a + b, 0) / stats.words.length) : 0;
    if (!PRINT_LINKS) {
      console.log(`${f.padEnd(28)} ${String(mod.sections.length).padStart(2)} sections ${String(stats.lessons).padStart(3)} lessons ${String(ex).padStart(3)} exercises ${String(stats.projects).padStart(2)} projects  ${String(stats.videos).padStart(2)}/${stats.lessons} picked videos  avg ${avg} words/lesson`);
      if (stats.short.length) console.log(`   ⚠ theory shorter than ${MIN_THEORY_WORDS} words: ${stats.short.join(", ")}`);
    }
  }

  if (PRINT_LINKS) { console.log([...links].sort().join("\n")); process.exit(0); }
  console.log(`TOTAL: ${modules.length} modules, ${totals.lessons} lessons, ${totals.exercises} exercises, ${totals.projects} projects`);
  if (CHECK_ONLY) process.exit(0);

  for (const m of modules) for (const s of m.sections) for (const l of s.lessons) delete l.words;
  const js = `// GENERATED by build.mjs from content/*.md. Do not edit this file; edit the .md files and run: node build.mjs\nwindow.CURRICULUM = ${JSON.stringify(modules)};\n`;
  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, js);
  console.log(`Wrote ${path.relative(ROOT, OUT_FILE)} (${Math.round(js.length / 1024)} KB)`);

  // Cache-busting: index.html loads each file as file?v=<hash of its content>,
  // so browsers fetch new content, scripts and styles right after a deploy.
  const version = (text) => crypto.createHash("sha256").update(text).digest("hex").slice(0, 10);
  const assets = [
    ["src", "data/curriculum.js", version(js)],
    ["src", "app.js", version(fs.readFileSync(path.join(ROOT, "app.js")))],
    ["href", "styles.css", version(fs.readFileSync(path.join(ROOT, "styles.css")))],
  ];
  const indexFile = path.join(ROOT, "index.html");
  const html = fs.readFileSync(indexFile, "utf8");
  let updated = html;
  for (const [attr, file, v] of assets) {
    const re = new RegExp(`${attr}="${file.replace(/[.\/]/g, "\\$&")}(\\?v=[^"]*)?"`);
    if (!re.test(updated)) throw new BuildError(`index.html has no ${attr}="${file}" to version`);
    updated = updated.replace(re, `${attr}="${file}?v=${v}"`);
  }
  if (updated !== html) { fs.writeFileSync(indexFile, updated); console.log("Updated index.html asset versions"); }

  fs.writeFileSync(SYLLABUS_FILE, syllabus(modules, totals));
  console.log(`Wrote ${path.relative(ROOT, SYLLABUS_FILE)}`);
} catch (e) {
  if (e instanceof BuildError) { console.error("✖ " + e.message); process.exit(1); }
  throw e;
}

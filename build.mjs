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

const ROOT = import.meta.dirname;
const CONTENT_DIR = path.join(ROOT, "content");
const OUT_FILE = path.join(ROOT, "data", "curriculum.js");
const args = process.argv.slice(2);
const CHECK_ONLY = args.includes("--check");
const PRINT_LINKS = args.includes("--links");
const MIN_THEORY_WORDS = 350;

class BuildError extends Error {}
const fail = (file, line, msg) => { throw new BuildError(`${path.basename(file)}:${line}: ${msg}`); };

// ---------------------------------------------------------------- Markdown → HTML
const escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const links = new Set();

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
      const row = (l) => l.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
      const head = row(lines[i]);
      i += 2;
      const body = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) body.push(row(lines[i++]));
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
function parseBlocks(file) {
  const lines = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let cur = null, inHeader = false, inFence = false;
  lines.forEach((line, idx) => {
    const ln = idx + 1;
    if (!inHeader && isFence(line)) inFence = !inFence;
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

function listItems(lines) {
  // top-level "- item" / "1. item" entries; indented lines continue the previous item
  const items = [];
  for (const { text } of lines) {
    const m = text.match(/^[-*]\s+(.*)$/) || text.match(/^\d+[.)]\s+(.*)$/);
    if (m) items.push(m[1]);
    else if (text.trim() && items.length && /^\s+/.test(text)) items[items.length - 1] += " " + text.trim();
  }
  return items;
}

function splitSections(bodyLines) {
  // split a body by "### Heading" lines (outside code fences)
  const parts = [{ title: null, lines: [] }];
  let fence = false;
  for (const l of bodyLines) {
    if (isFence(l.text)) fence = !fence;
    const h = !fence && l.text.match(/^###\s+(.+?)\s*$/);
    if (h) parts.push({ title: h[1], lines: [] });
    else parts.at(-1).lines.push(l);
  }
  return parts;
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
  const stats = { lessons: 0, projects: 0, words: [], short: [] };

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
      const exPart = parts.find((p) => /^exercises$/i.test(p.title));
      if (!exPart) fail(file, b.line, `lesson ${b.meta.id} has no "### Exercises" heading`);
      const theoryLines = [];
      for (const p of parts) {
        if (p === exPart) break;
        if (p.title) theoryLines.push({ text: "### " + p.title });
        theoryLines.push(...p.lines);
      }
      const theory = textOf(theoryLines).trim();
      const exercises = listItems(exPart.lines);
      if (!theory) fail(file, b.line, `lesson ${b.meta.id} has no theory`);
      if (exercises.length < 2) fail(file, b.line, `lesson ${b.meta.id} needs at least 2 exercises`);
      const docs = b.docs.map(({ value, line }) => {
        const [label, url] = value.split(/\s+\|\s+/);
        if (!label || !/^https?:\/\//.test(url || "")) fail(file, line, `docs must look like "Label | https://…"`);
        links.add(url);
        return [label, url];
      });
      const words = wordCount(theory);
      stats.words.push(words);
      if (words < MIN_THEORY_WORDS) stats.short.push(`${b.meta.id} (${words} words)`);
      sec.lessons.push({
        id: b.meta.id, title: b.meta.title, time: b.meta.time, video: b.meta.video, docs,
        theory: md(theory), exercises: exercises.map(inline), words,
      });
      stats.lessons++;
      continue;
    }

    if (b.type === "project") {
      need(b, "id", "title", "summary");
      const parts = splitSections(b.body);
      const done = parts.find((p) => /^done when$/i.test(p.title || ""));
      if (!done) fail(file, b.line, `project ${b.meta.id} has no "### Done when" list`);
      const features = listItems(done.lines);
      if (features.length < 2) fail(file, b.line, `project ${b.meta.id} needs at least 2 "Done when" items`);
      if (!parts.some((p) => /^the task$/i.test(p.title || ""))) fail(file, b.line, `project ${b.meta.id} has no "### The task"`);
      const brief = parts.filter((p) => p !== done && p.title)
        .map((p) => `## ${p.title}\n${textOf(p.lines)}`).join("\n\n");
      sec.projects.push({ id: b.meta.id, title: b.meta.title, summary: b.meta.summary, brief: md(brief), features: features.map(inline) });
      stats.projects++;
    }
  }
  for (const s of mod.sections) {
    if (!s.lessons.length && !s.projects.length) fail(file, 1, `section ${s.id} is empty`);
  }
  return { mod, stats };
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
      console.log(`${f.padEnd(28)} ${String(mod.sections.length).padStart(2)} sections ${String(stats.lessons).padStart(3)} lessons ${String(ex).padStart(3)} exercises ${String(stats.projects).padStart(2)} projects  avg ${avg} words/lesson`);
      if (stats.short.length) console.log(`   ⚠ theory shorter than ${MIN_THEORY_WORDS} words: ${stats.short.join(", ")}`);
    }
  }

  if (PRINT_LINKS) { console.log([...links].sort().join("\n")); process.exit(0); }
  console.log(`TOTAL: ${modules.length} modules, ${totals.lessons} lessons, ${totals.exercises} exercises, ${totals.projects} projects`);
  if (CHECK_ONLY) process.exit(0);

  for (const m of modules) for (const s of m.sections) for (const l of s.lessons) delete l.words;
  const js = `// GENERATED by build.mjs from content/*.md. Do not edit this file; edit the .md files and run: node build.mjs\nwindow.CURRICULUM = ${JSON.stringify(modules)};\n`;
  fs.writeFileSync(OUT_FILE, js);
  console.log(`Wrote ${path.relative(ROOT, OUT_FILE)} (${Math.round(js.length / 1024)} KB)`);
} catch (e) {
  if (e instanceof BuildError) { console.error("✖ " + e.message); process.exit(1); }
  throw e;
}

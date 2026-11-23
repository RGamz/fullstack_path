# Content format

Every module lives in one file: `content/NN-name.md` (NN = order on the page).
After editing, run `node build.mjs` in the project's root folder (the folder with `index.html`; it's `fullstack_path` on GitHub). It validates the files and regenerates:

- `data/curriculum.js`, which the website loads (it also updates the version codes in `index.html`, so browsers fetch the new files right away)
- `SYLLABUS.md`, the plain-Markdown outline shown on GitHub

`node build.mjs --check` only validates and prints stats; add file names to check just those, e.g. `node build.mjs --check content/02-express.md`. `node build.mjs --links` prints every external link (docs and links in the text) so you can check them.

## What the build checks

The build **stops with an error** (file name and line number) when:

- a header has an unknown key (allowed: module `id, title, scrimba, weeks, fullCourse, intro`; section `id, title, intro`; lesson `id, title, time, video, docs`; project `id, title, summary`) or a required one is missing
- a lesson has no `### Exercises`, fewer than 2 exercises, or a `###` heading *after* the exercises
- a project has no `### The task`, fewer than 2 "Done when" items, or text before its first `###` heading
- a line inside the exercises or "Done when" list isn't a list item (for example `-missing space`)
- an id is used twice, a code fence is never closed, or a `docs:` line isn't `Label | URL`

It **warns** (but still builds) when a lesson's theory is shorter than 350 words, or a table row has a different number of cells than its header. To put a `|` inside a table cell, write it inside `code` or as `\|`.

## Structure

A module is split into **sections**. Each section is a chunk of related lessons that ends with **one or two projects** that use exactly what those lessons taught (like Scrimba's "Build a Node API" sections). Learn a chunk, build something, move on. A section may also contain only a project (like the career capstone).

```
---module
id: node
title: Node.js
scrimba: Node.js
weeks: 3–4 weeks
fullCourse: freeCodeCamp Node.js full course for beginners
intro: One or two sentences shown at the top of the module.
---

---section
id: node-s1
title: Getting started with Node
intro: What this section covers and what you'll build at the end.
---

---lesson
id: node-1
title: What is Node.js?
time: 1h
video: Fireship Node.js in 100 seconds
docs: Node.js – Learn | https://nodejs.org/en/learn
docs: Another link | https://example.com
---
Theory in Markdown…

### Exercises
- First exercise
- Second exercise

---project
id: node-p3
title: CLI Task Manager
summary: One line shown on the card.
---
### The task
### What it must do
### Steps
### Hints
### Stretch goals
### Done when
- each item here becomes a checkbox
```

Rules:
- Headers start with `---module`, `---section`, `---lesson` or `---project` on their own line and end with `---`.
- `video:` is either a YouTube **search query** (the site turns it into a search link), or a specific video as `Label | URL`, e.g. `video: Fireship — CORS in 100 Seconds | https://www.youtube.com/watch?v=4KHiSt0oLJ0`. A specific video also gets a "More on YouTube" search link as a fallback. The label must not contain ` | `. Like `docs:`, `video:` can be repeated: a lesson that covers two topics can list one video for each, in the order the lesson teaches them. Before adding a video, check that it exists and matches the lesson (for example by opening `https://www.youtube.com/oembed?format=json&url=<video URL>`, which shows its real title and channel).
- `docs:` can repeat; format `Label | URL`.
- **IDs must never change** once you've started ticking things off: progress is saved by ID.
- Exercises and "Done when" items are saved by their **position** in the list. Add new ones at the end and don't reorder or delete existing ones, or ticks move to the wrong item. Rewording an item in place is fine.
- In the theory, use `##` for subheadings (they become small headings on the page). `###` is reserved for `### Exercises` in lessons and the named parts of projects.
- Supported Markdown: paragraphs, `##` headings, `- lists`, `1. numbered lists`, fenced code blocks with a language (```` ```js ````), `> quotes` (shown as tip boxes), tables, `inline code`, **bold**, *italic*, [links](https://…).

## What a good lesson looks like

The theory should teach, not just summarise. Aim for 500–900 words:

1. **Why it matters**: one short paragraph connecting the topic to what you're building.
2. **The concept, step by step**: `##` subheadings, plain language, one idea at a time.
3. **Code examples**: small, complete and runnable, each followed by an explanation of what the important lines do.
4. **Common mistakes**: the 2–4 errors beginners actually hit, and how to recognise and fix them.
5. **In short**: a 3–5 bullet recap. (Module 1 replaces this with the Takeaways and Check parts below; they're being piloted there first.)

Exercises are small, concrete tasks that practise exactly this lesson (2–4 per lesson), ordered easy → harder.

### Optional parts (piloted in Module 1)

These go between the theory and `### Exercises`, in this order:

```
### Takeaways
**Understand**
- 2–4 ideas you should be able to explain without notes
**Muscle memory (no need to cram: it sticks by using it)**
- the few lines you'll type often
**Look up when needed**
- things to know exist, not to memorise

### Check your understanding
- A question to answer from memory?
  Answer: The answer, shown behind "Show answer".
```

- Exercises can have a hint, shown behind "💡 Hint": put it on an indented line under the exercise, starting with `Hint:`. Add one whenever an exercise needs a skill the lesson didn't teach.
- `notes:` in the lesson header sets a specific question above the notes box, e.g. `notes: In two sentences, why do you JSON.stringify before saving?`
- A project's first step can be a short warm-up from memory: rebuild the lesson's key function in a blank file, then compare.

## What a good project brief looks like

- **The task**: the scenario in 2–4 sentences: what you build and for whom.
- **What it must do**: precise requirements (endpoints, data shape, screens, error cases).
- **Steps**: an ordered list of milestones; each one small enough for one sitting and ending in something you can run. Commit after each.
- **Hints**: where people get stuck.
- **Stretch goals**: optional extras.
- **Done when**: 4–7 checkable outcomes (these become checkboxes).

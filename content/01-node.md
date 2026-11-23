---module
id: node
title: Node.js
scrimba: Node.js
weeks: 3–4 weeks
fullCourse: freeCodeCamp Node.js full course for beginners
intro: JavaScript outside the browser. You'll write command-line tools, build an HTTP API using only Node's built-in modules, and finish with a small full-stack app, so that when you meet Express you know exactly what it does for you.
---

---section
id: node-s1
title: Getting started with Node
intro: Install Node, learn how projects and modules are organised, and read and write files. You'll finish by building a to-do app that runs in your terminal.
---

---lesson
id: node-1
title: What is Node.js? Setup and your first script
time: 1h
notes: In your own words: what can Node do that browser JavaScript can't, and what can't it do?
video: Fireship — Node.js Ultimate Beginner's Guide in 7 Easy Steps | https://www.youtube.com/watch?v=ENrzD9HAZK4
docs: Node.js – Learn | https://nodejs.org/en/learn
docs: Introduction to Node.js | https://nodejs.org/en/learn/getting-started/introduction-to-nodejs
docs: The event loop explained | https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick
---
Until now, all your JavaScript has run inside a browser. The browser gave you the `document`, `window`, `fetch` and the DOM. **Node.js** takes the same JavaScript language and lets you run it directly on your computer or on a server. That's what makes it possible to write backends, APIs, command-line tools and build scripts in the language you already know.

## What Node actually is

Node is a **runtime**: a program that runs JavaScript. Inside it is V8, the same engine Chrome uses to run JavaScript, plus a set of extra built-in modules that browsers don't have:

- `fs`: read and write files on disk
- `http`: create web servers
- `path`: work with file paths
- `process`: information about the running program (arguments, environment variables, exit codes)

What Node does **not** have: `window`, `document`, `alert()` or the DOM. There is no page to manipulate; your program talks to files, the network and the terminal instead.

## Installing Node

Install **Node 24 LTS** (Long-Term Support) from nodejs.org. LTS versions get bug fixes for years, which is what you want for learning and real projects. This course uses several recent features (`import.meta.dirname`, `--env-file`, `util.styleText`, the built-in `node:sqlite`), so you need **at least Node 22**; older versions will give confusing errors later. Then open a new terminal and check it worked:

```bash
node -v
npm -v
```

You should see two version numbers, and the first should start with `v22` or higher. `npm` (Node Package Manager) is installed with Node; you'll use it in the next lesson.

> **Tip:** On Windows, if `node` is "not recognised", close and reopen your terminal (or VS Code) so it picks up the new PATH.

## Running your first script

Create a folder, add a file called `hello.js`, and write:

```js
const name = "Node";
const now = new Date();

console.log(`Hello from ${name}!`);
console.log(`It is ${now.toLocaleTimeString()}`);
```

Run it from the terminal, in the same folder:

```bash
node hello.js
```

`console.log` now prints to your **terminal**, not the browser console. This is the basic workflow you'll use constantly: edit a file, run it with `node`, read the output.

## The REPL

Type just `node` and press Enter. You're now in the **REPL** (Read–Eval–Print Loop): a live JavaScript prompt, like the browser console. It's useful for quickly testing an expression:

```
> 2 ** 10
1024
> typeof window
'undefined'
> process.platform
'win32'
```

Press `Ctrl + C` twice (or type `.exit`) to leave.

## Reading command-line arguments

The global `process` object describes the running program. `process.argv` is an array of the command-line arguments:

```js
// greet.js
console.log(process.argv);
```

```bash
node greet.js Anna
```

```
[ 'C:\\Program Files\\nodejs\\node.exe', 'C:\\code\\greet.js', 'Anna' ]
```

The first two entries are always the path to Node and the path to your script. Your own arguments start at index 2. So a greeting script looks like this:

```js
const name = process.argv[2] ?? "stranger";
console.log(`Hi, ${name}!`);
```

`??` provides a default when no argument was given.

## Non-blocking: why Node is fast for servers

Node runs your JavaScript on a **single thread**. That sounds slow, but slow work like reading a file, querying a database or waiting for a network response isn't done by your code: Node hands it off to the operating system and keeps going. When the work is finished, your callback (or the `await`) continues. This mechanism is the **event loop**, and it's why one Node process can serve thousands of users who are mostly *waiting*.

The practical rule for you: use the asynchronous versions of functions (with `await`) and never write long CPU-heavy loops in a server.

## Common mistakes

- **Running `node` in the wrong folder.** `node hello.js` looks for the file in the *current* folder. Check where you are with `pwd` (or `cd` on its own in Windows cmd) and move with `cd`.
- **Using browser APIs.** `document.querySelector` will throw `ReferenceError: document is not defined`. That's expected: there's no page in Node.
- **Forgetting that `process.argv` values are strings.** `node add.js 2 3` gives you `"2"` and `"3"`; convert with `Number()` before adding.

### Takeaways
**Understand**
- Node runs JavaScript outside the browser: the same language, but with tools for files, the network and processes, and no DOM.
- Slow work (files, network) is non-blocking: Node starts it, keeps going, and continues your code when the result is ready (the event loop).
- Command-line arguments arrive as an array of strings in `process.argv`; yours start at index 2.

**Muscle memory (no need to cram: it sticks by using it)**
- `node file.js` to run a script, `node` alone for the REPL
- `process.argv[2]`

**Look up when needed**
- Other `process` features (`process.platform`, `process.cwd()`, `process.exit()`)
- How the event loop works in detail

### Check your understanding
- Why does `document.querySelector` throw in Node?
  Answer: Node has no page and no DOM: `document` and `window` exist only in browsers.
- You run `node add.js 2 3` and get `23` instead of `5`. Why?
  Answer: Everything in `process.argv` is a string, so `+` joins them. Convert with `Number()` first.
- Node runs your code on one thread. How can one server still handle many users at once?
  Answer: Most of a request's time is spent waiting for disks and networks. Node hands that waiting to the operating system and serves other requests in the meantime.

### Exercises
- Install Node LTS and print both `node -v` and `npm -v`.
- Create `hello.js` that logs a greeting plus today's date in a readable format. Run it.
  Hint: This part is plain JavaScript from your frontend course: `new Date().toLocaleDateString()` gives a readable date.
- Write `greet.js` so that `node greet.js Anna` prints `Hi, Anna!` and `node greet.js` (no name) prints `Hi, stranger!`.
- Write `add.js` so that `node add.js 4 5 10` prints the sum of all the numbers given (any number of them). Print a helpful message if one of them isn't a number.
  Hint: Take all the arguments with `process.argv.slice(2)`, convert each one with `Number()`, and check it with `Number.isNaN()`. To add them up, a `for…of` loop works (or `reduce` if you know it).

---lesson
id: node-2
title: npm, package.json and modules
time: 1.5h
notes: Explain to a friend the difference between your own module (./math.js) and a package (dayjs): where does each come from, and how do you import it?
video: Coder Coder — What is NPM, and Why Do We Need It? | https://www.youtube.com/watch?v=P3aKRdUyr0s
video: Codevolution — Node.js ES Modules | https://www.youtube.com/watch?v=g98XlFOiXz0
docs: package.json reference | https://docs.npmjs.com/cli/configuring-npm/package-json
docs: ES modules in Node | https://nodejs.org/api/esm.html
docs: Node.js: an introduction to npm | https://nodejs.org/en/learn/getting-started/an-introduction-to-the-npm-package-manager
---
Real programs aren't one giant file. You split code into **modules** (files that export functions and values), and you reuse code other people wrote (**packages**) instead of reinventing it. This lesson covers both, plus the file that ties a project together: `package.json`.

## package.json: your project's ID card

Every Node project has a `package.json` at its root. Create one with:

```bash
npm init -y
```

`-y` accepts all the defaults. Open the file and add `"type": "module"` so you can use modern `import`/`export` syntax:

```json
{
  "name": "my-first-project",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js"
  }
}
```

The important fields:

- **`type: "module"`** tells Node your `.js` files use ES Modules (`import`/`export`), the same syntax you used in the browser. Without it, Node assumes the older CommonJS style (`require`/`module.exports`), which you'll still see in older tutorials.
- **`scripts`** are named shortcuts. `npm start` runs the `start` script, and any other script runs with `npm run <name>`, for example `npm run dev`.
- `node --watch` restarts your program every time you save a file. It's built into Node, so you don't need the `nodemon` package that older tutorials install.

## Your own modules: import and export

Create `math.js`:

```js
// math.js
export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}

export const PI = 3.14159;
```

And use it from `index.js`:

```js
// index.js
import { add, multiply, PI } from "./math.js";

console.log(add(2, 3));       // 5
console.log(multiply(4, PI)); // 12.56636
```

Two details that trip people up in Node (but not in bundlers like Vite):

1. The path must start with `./` (or `../`) for your own files. Without it, Node looks for a *package* called `math`.
2. You must include the `.js` extension.

You can also have one **default export** per file: `export default function greet() {}` imported as `import greet from "./greet.js"` (no braces).

## Built-in modules

Node's own modules are imported the same way. The `node:` prefix makes it clear it's built in:

```js
import os from "node:os";
import path from "node:path";

console.log(os.userInfo().username);
console.log(path.join("data", "tasks.json")); // data\tasks.json on Windows
```

## Packages from npm

npm hosts millions of packages. Install one with `npm install` (or `npm i`):

```bash
npm install dayjs
```

Three things happen:

1. The code is downloaded into a `node_modules` folder.
2. `package.json` gets a `"dependencies"` entry: `"dayjs": "^1.11.13"`.
3. `package-lock.json` records the *exact* versions installed, so everyone gets the same thing.

Then import it by name (no `./`):

```js
import dayjs from "dayjs";
console.log(dayjs().format("dddd D MMMM"));
```

Tools you only need while developing (test runners, linters) are installed as **devDependencies** with `npm install -D vitest`. Remove a package with `npm uninstall dayjs`.

## node_modules and git

`node_modules` can contain thousands of files. **Never commit it.** Create a `.gitignore` file:

```
node_modules
.env
```

Anyone who clones your project runs `npm install`, and npm rebuilds `node_modules` from `package.json` and `package-lock.json`.

## Common mistakes

- **`SyntaxError: Cannot use import statement outside a module`**: you forgot `"type": "module"` in `package.json`.
- **`ERR_MODULE_NOT_FOUND` for your own file**: missing `./` or missing `.js` in the import path.
- **Mixing `require` and `import`** in the same project. Pick ES Modules and stick with them.
- **Committing `node_modules`**: add the `.gitignore` *before* your first commit.

### Takeaways
**Understand**
- `package.json` describes the project: its scripts, its dependencies and (with `"type": "module"`) that files use `import`/`export`.
- Your own files are imported with a relative path (`./`, with the `.js` ending); packages are imported by name, from `node_modules`.
- `node_modules` is rebuilt from `package.json` and `package-lock.json` with `npm install`, so it never goes into git.

**Muscle memory (no need to cram: it sticks by using it)**
- `npm init -y`, `npm install name`, `npm install -D name`
- `export function …` / `import { … } from "./file.js"`
- A `"dev": "node --watch index.js"` script

**Look up when needed**
- Version ranges like `^1.11.13`
- CommonJS (`require`, `module.exports`), for reading older code
- The list of built-in modules (`node:os`, `node:path`, …)

### Check your understanding
- What does `"type": "module"` in `package.json` change?
  Answer: It tells Node your `.js` files use ES Modules (`import`/`export`). Without it, Node expects the older `require` style.
- Why does `import { add } from "math.js"` fail with `ERR_MODULE_NOT_FOUND`?
  Answer: Without `./`, Node looks for a package called `math.js` in `node_modules`. Your own files need a relative path like `./math.js`.
- A teammate clones your repo, which has no `node_modules` folder. How do they get the packages?
  Answer: They run `npm install`, which reads `package.json` and `package-lock.json` and installs the same versions.

### Exercises
- Create a new folder, run `npm init -y`, add `"type": "module"` and `start`/`dev` scripts. Check both work.
- Create `math.js` exporting `add`, `subtract`, `multiply` and `divide` (throw an error when dividing by zero). Import them in `index.js` and log some results.
  Hint: Throwing is plain JavaScript: `throw new Error("Cannot divide by zero")` inside `divide`, then call it inside `try { … } catch (err) { console.log(err.message) }` to see the message.
- Install `dayjs` and print how many days are left until New Year. Then uninstall it and look at what changed in `package.json`.
  Hint: Look up `diff` in the dayjs docs. One way: `dayjs().endOf("year").diff(dayjs(), "day")`.
- Add a `.gitignore`, run `git init` and `git status`, and confirm `node_modules` is not listed.

---lesson
id: node-9
title: Reading and writing files with fs and path
time: 1.5h
notes: In two sentences: why do you JSON.stringify before saving a file, and JSON.parse after reading it?
video: Codevolution — Node.js fs Promise Module | https://www.youtube.com/watch?v=wG2-vF4QyZ0
docs: fs/promises API | https://nodejs.org/api/fs.html#promises-api
docs: path module | https://nodejs.org/api/path.html
docs: Node.js: reading files | https://nodejs.org/en/learn/manipulating-files/reading-files-with-nodejs
---
Most programs need to remember things between runs: settings, user data, a list of tasks. Before you learn databases, the simplest way is a file on disk. Node's `fs` (file system) module lets you read and write files, and `path` helps you build file paths that work on every operating system.

## The promise-based fs API

`fs` exists in three styles (callbacks, synchronous and promises). Use the promises version: it works with `async`/`await`, which you already know from `fetch`.

```js
import fs from "node:fs/promises";

const text = await fs.readFile("notes.txt", "utf8");
console.log(text);

await fs.writeFile("copy.txt", text.toUpperCase());
console.log("Saved!");
```

- `readFile(path, "utf8")` returns the file's content as a string. Without `"utf8"` you get a `Buffer` (raw bytes).
- `writeFile(path, data)` creates the file, or **replaces** it entirely if it exists.
- `appendFile(path, data)` adds to the end instead.

Top-level `await` (outside a function) works because we're using ES Modules.

## Storing data as JSON

Files only hold text, so to save arrays and objects you convert them to JSON and back:

```js
import fs from "node:fs/promises";

const tasks = [
  { id: 1, text: "Learn fs", done: false },
  { id: 2, text: "Build a CLI", done: false },
];

// object → text → file
await fs.writeFile("tasks.json", JSON.stringify(tasks, null, 2));

// file → text → object
const loaded = JSON.parse(await fs.readFile("tasks.json", "utf8"));
console.log(loaded[1].text); // "Build a CLI"
```

`JSON.stringify(value, null, 2)` pretty-prints with 2-space indentation, so the file stays readable when you open it.

## When the file doesn't exist yet

The first time your program runs, there's no `tasks.json`. `readFile` then throws an error with `code: "ENOENT"` ("Error NO ENTry"). Handle that case and start with an empty list:

```js
async function loadTasks() {
  try {
    const text = await fs.readFile(FILE, "utf8");
    return JSON.parse(text);
  } catch (err) {
    if (err.code === "ENOENT") return []; // first run: no file yet
    throw err; // anything else is a real problem: don't hide it
  }
}
```

Only swallow the error you expect. If the file exists but contains broken JSON, you *want* to see that error.

## Building paths with path and import.meta.dirname

Relative paths like `"tasks.json"` are resolved from the folder you **run** the command in, not the folder the script is in. Run `node app/cli.js` from the parent folder and suddenly the file is in the wrong place. Fix this by building the path from the script's own location:

```js
import path from "node:path";

const FILE = path.join(import.meta.dirname, "tasks.json");
```

- `import.meta.dirname` is the folder containing the current file (Node 20.11+). Older tutorials use `__dirname`, which only exists in CommonJS.
- `path.join` inserts the right separator (`\` on Windows, `/` on Mac/Linux) and tidies up `..` segments.

Other useful helpers: `path.extname("photo.png")` gives `".png"` and `path.basename("/a/b/notes.txt")` gives `"notes.txt"`.

## Common mistakes

- **Forgetting `await`.** `const text = fs.readFile(...)` gives you a Promise, not the content. Logging it prints `Promise { <pending> }`.
- **Forgetting `"utf8"`.** You'll get `<Buffer 48 65 6c ...>` instead of text.
- **Writing an object directly.** `fs.writeFile("x.json", tasks)` writes `[object Object]`. Always `JSON.stringify` first.
- **Paths relative to the terminal.** Use `path.join(import.meta.dirname, …)` for files that belong next to your script.

### Takeaways
**Understand**
- Files store only text (or raw bytes), not JavaScript objects: turn data into JSON text to save it, and parse it back to use it.
- Reading and writing files is slow, so the `fs/promises` functions are asynchronous and must be awaited.
- A relative path like `"tasks.json"` is resolved from the folder you run the command in, not the script's folder. Build paths from `import.meta.dirname` for files that belong to your script.
- Catch only the error you expect (a missing file on the first run) and rethrow everything else, so real bugs stay visible.

**Muscle memory (no need to cram: it sticks by using it)**
- `import fs from "node:fs/promises"`
- `await fs.readFile(file, "utf8")` / `await fs.writeFile(file, text)`
- `JSON.stringify(data)` / `JSON.parse(text)`
- `path.join(import.meta.dirname, "tasks.json")`

**Look up when needed**
- The error code for "file not found" (`ENOENT`) and other codes
- Pretty-printing: `JSON.stringify(data, null, 2)`
- `fs.appendFile`, `fs.mkdir`, `fs.readdir`, `path.extname`, `path.basename`

### Check your understanding
- You log `fs.readFile("notes.txt", "utf8")` and see `Promise { <pending> }`. What's missing?
  Answer: `await`: `readFile` returns a promise, and only `await` gives you the content.
- Why does `fs.readFile("notes.txt")` without `"utf8"` print `<Buffer 48 65 …>`?
  Answer: Without an encoding, Node returns raw bytes (a Buffer). `"utf8"` tells it to decode the bytes as text.
- Your script works with `node cli.js`, but not with `node app/cli.js` from the parent folder. Why?
  Answer: The relative path is resolved from the terminal's current folder. Build it with `path.join(import.meta.dirname, "tasks.json")` instead.

### Exercises
- Create `notes.txt` with a few lines. Write a script that reads it and writes `notes-upper.txt` in capitals.
  Hint: Uppercasing is plain JavaScript: `text.toUpperCase()`.
- Write a script that counts the lines, words and characters in any file passed as an argument: `node count.js notes.txt`.
  Hint: Counting is plain JavaScript you already know: the file content is one long string. Characters: `text.length`. Lines: `text.split("\n").length`. Words: `text.trim().split(/\s+/).length` (and treat an empty file as 0 words).
- A warm-up for this part's project (a to-do list in the terminal): create `tasks.js`. In it, write `loadTasks()`, which returns the array saved in `tasks.json` (or `[]` if the file doesn't exist yet), and `saveTasks(tasks)`, which writes the array to `tasks.json`. At the bottom of the script, load the tasks, add one new task like `{ id: 1, text: "Task 1", done: false }` (numbered after the existing ones), and save. Run `node tasks.js` three times, then open `tasks.json`: it should contain 3 tasks.
  Hint: Start from the `loadTasks()` example in "When the file doesn't exist yet" above. The new task's number is `tasks.length + 1`; add it with `tasks.push(…)`, then call `saveTasks(tasks)`.
- Create a folder `app`, move `tasks.js` into it, and run `node app/tasks.js` from the parent folder. Where does `tasks.json` end up now: next to the script, or in the folder you ran the command from? Fix it with `path.join(import.meta.dirname, "tasks.json")` so the file always stays next to the script.

---project
id: node-p3
title: CLI Task Manager
summary: A to-do app that runs in your terminal and saves tasks to a JSON file.
---
### The task
Build a to-do list you use from the terminal, like `node tasks.js add "Buy milk"`. It uses everything from this section: `process.argv` for commands, modules to organise the code, and `fs` to save tasks between runs. No web, no browser: just you and Node.

### What it must do
- `node tasks.js add "Buy milk"`: adds a task and prints `Added task 3: Buy milk`
- `node tasks.js list`: shows all tasks, for example `1. [ ] Buy milk` and `2. [x] Call mum`
- `node tasks.js done 2`: marks task 2 as done; `node tasks.js undo 2` reverses it
- `node tasks.js remove 2`: deletes task 2
- `node tasks.js clear`: deletes all completed tasks
- Tasks are stored in `tasks.json` next to the script, as `{ id, text, done, createdAt }`
- Unknown commands, missing text or invalid numbers print a short usage guide instead of crashing

### Steps
1. **Warm-up from memory (10 minutes).** Before you start, open a blank file and write `loadTasks()` and `saveTasks(tasks)` without looking at the lesson. Then compare with lesson 1.3 and fix what you missed.
2. Create the project with `npm init -y`, set `"type": "module"`, and create `tasks.js`. Log `process.argv.slice(2)` and try a few commands to see what you receive.
3. Create `storage.js` exporting `loadTasks()` and `saveTasks(tasks)` (from the fs lesson, using `import.meta.dirname`).
4. In `tasks.js`, read the command (`argv[2]`) and use a `switch` statement to call a function per command. Start with `add` and `list`.
5. Implement `done`, `undo` and `remove`. Find the task by id; if it doesn't exist, print `No task with id 7`.
6. Implement `clear` and a `printUsage()` function shown for unknown commands or `help`.
7. Make it look good: colour done tasks green and pending ones yellow with Node's built-in `util.styleText` (`import { styleText } from "node:util"`).
8. Add a README with example commands and a screenshot of your terminal, then push to GitHub.

### Hints
- Give new tasks `id = highest existing id + 1` (not `tasks.length + 1`), or ids repeat after deletions.
- `Number("abc")` is `NaN`; check with `Number.isInteger(id)`.
- Keep each command as its own small function (`addTask(text)`, `markDone(id)`…). They're easy to test later in the Testing module.

### Stretch goals
- Add `--priority high` with `util.parseArgs` and sort the list by priority.
- Add `"bin": { "tasks": "tasks.js" }` to package.json (plus a `#!/usr/bin/env node` first line) and run `npm link`, so you can type `tasks list` from anywhere.
- `node tasks.js stats`: how many tasks are done, and your oldest open task.

### Done when
- `add`, `list`, `done`, `undo`, `remove` and `clear` all work
- Tasks survive closing the terminal (saved in tasks.json)
- Bad input prints a usage message instead of a stack trace
- Code is split into at least two modules
- The project is on GitHub with a README showing example usage

---section
id: node-s2
title: Build a Node API
intro: Learn how the web talks (HTTP), then build a JSON API using nothing but Node's built-in http module: routing, path and query parameters, clean code structure and CORS. You'll finish with a travel destinations API a frontend can use.
---

---lesson
id: node-3
title: The http module: your first server
time: 1h
notes: Describe step by step what happens between typing localhost:8000 in the browser and seeing your text on the page.
video: Programming with Mosh — HTTP Module in Node.js | https://www.youtube.com/watch?v=VLXAzzRjQws
docs: http module docs | https://nodejs.org/api/http.html
docs: Anatomy of an HTTP transaction | https://nodejs.org/en/learn/http/anatomy-of-an-http-transaction
---
A **server** is just a program that waits for requests and sends back responses. Every website and API you've ever used is one. Node can create a server in about five lines with its built-in `http` module, and building one by hand (before using Express) shows you exactly what happens on every request.

## The smallest possible server

Create `server.js`:

```js
import http from "node:http";

const PORT = 8000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello from my server!");
});

server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
```

Run `node server.js` and open `http://localhost:8000` in your browser. You'll see your message. Line by line:

- `http.createServer(callback)` creates a server. The callback runs **once for every request** that arrives.
- `req` (request) describes what the client asked for: the URL, the method, the headers and, later, the body.
- `res` (response) is what you send back. You set a **status code** (200 means OK), **headers** (extra information about the response) and finally the **body**.
- `res.end(body)` sends the response and finishes it.
- `server.listen(PORT)` starts listening. The program keeps running (it doesn't exit like your scripts did) until you stop it with `Ctrl + C`.

`localhost` means "this computer" and `8000` is the **port**: a number that identifies which program on your computer should receive the request. Use ports like 3000, 5000 or 8000 for development.

## Looking at the request

Log what arrives:

```js
const server = http.createServer((req, res) => {
  console.log(req.method, req.url);
  res.end("ok");
});
```

Visit `http://localhost:8000/hello?name=sam` and your terminal shows:

```
GET /hello?name=sam
GET /favicon.ico
```

Two things to notice. `req.url` is only the **path and query** (everything after the port), not the full address. And browsers automatically request `/favicon.ico` (the little tab icon), so you'll often see a second request you didn't make.

## Sending HTML

The `Content-Type` header tells the browser how to interpret the body:

```js
res.setHeader("Content-Type", "text/html");
res.end("<h1>Welcome</h1><p>This HTML came from Node.</p>");
```

With `text/plain` the browser would show the tags as text; with `text/html` it renders them. For APIs you'll use `application/json` in a couple of lessons.

You can also set the status and headers in one call: `res.writeHead(200, { "Content-Type": "text/html" })`.

## Restarting automatically

A running server doesn't pick up code changes on its own. Use watch mode while developing:

```bash
node --watch server.js
```

Or put it in your `package.json` scripts as `"dev": "node --watch server.js"` and run `npm run dev`.

## Common mistakes

- **Forgetting `res.end()`.** The browser spins forever because the response never finishes. Every path through your code must end the response exactly once.
- **`EADDRINUSE: address already in use`.** Another program (often your server running in another terminal) already uses that port. Stop the other one or choose a different port.
- **Calling `res.end()` twice.** You'll get `ERR_STREAM_WRITE_AFTER_END`. Use `return res.end(...)` so the function stops after responding.
- **Editing code but seeing old output**: you forgot to restart (use `--watch`).

### Takeaways
**Understand**
- A server is a program that waits for requests; `http.createServer` runs your callback once for every request.
- `req` describes what the client asked for; `res` is what you send back: a status code, headers and a body.
- Every request must get exactly one response: always finish with `res.end()`, exactly once.
- The `Content-Type` header tells the browser how to treat the body (plain text, HTML, JSON…).

**Muscle memory (no need to cram: it sticks by using it)**
- `http.createServer((req, res) => { … })` and `server.listen(PORT)`
- `res.statusCode = 200`, `res.setHeader("Content-Type", "text/html")`, `res.end(body)`
- `node --watch server.js`

**Look up when needed**
- `res.writeHead(status, headers)` as a shortcut
- Full lists of status codes and content (MIME) types
- What `EADDRINUSE` means (the port is already in use)

### Check your understanding
- The browser keeps loading and never shows your page. What's the most likely bug?
  Answer: A code path that never calls `res.end()`, so the response never finishes.
- Why does your server log a request for `/favicon.ico` that you never made?
  Answer: Browsers automatically ask every site for its tab icon.
- What's the difference between sending HTML with `text/plain` and with `text/html`?
  Answer: With `text/plain` the browser shows the tags as text; with `text/html` it renders them as a page.

### Exercises
- Build a server on port 8000 that replies with plain text: `Hello from my server`.
- Change it to reply with an HTML page containing a heading and a paragraph about you. Try it once with `text/plain` and once with `text/html` and compare.
- Log `req.method` and `req.url` for every request. Visit three different URLs and explain where the `/favicon.ico` request comes from.
- Return status 418 with the text `I'm a teapot` and check the status in DevTools → Network.

---lesson
id: node-4
title: HTTP and the request/response cycle
time: 1h
notes: Pick one request from DevTools on a site you use and explain each part: method, path, one header, the status and what the body contained.
video: Traversy Media — HTTP Crash Course & Exploration | https://www.youtube.com/watch?v=iYM2zFP3Zn0
docs: MDN: An overview of HTTP | https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview
docs: MDN: HTTP status codes | https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
docs: MDN: HTTP request methods | https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
---
Before building an API, you need to know the language your server and its clients speak: **HTTP**. Every time a browser loads a page or your frontend calls `fetch`, the same cycle happens: the client sends a **request**, and the server answers with a **response**. Once you can read both, debugging becomes much easier.

## Anatomy of a request

A request has four parts:

```
POST /api/stories HTTP/1.1          ← method, path, version
Host: localhost:8000                ← headers
Content-Type: application/json
                                    ← blank line
{ "title": "A strange night" }      ← body (optional)
```

- **Method**: what you want to do.
- **Path** (and query string): which resource.
- **Headers**: extra information as `Name: value` pairs, such as the content type, authentication or the preferred language.
- **Body**: data sent to the server. GET requests have no body; POST/PUT/PATCH usually do.

## Methods

| Method | Meaning | Example |
|---|---|---|
| GET | read data | `GET /api/books` |
| POST | create something new | `POST /api/books` |
| PUT | replace something completely | `PUT /api/books/7` |
| PATCH | change part of something | `PATCH /api/books/7` |
| DELETE | remove something | `DELETE /api/books/7` |

The method is a promise about what the request does. A GET should never change data, because browsers, caches and search engines assume it's safe to repeat.

## Anatomy of a response

```
HTTP/1.1 404 Not Found              ← status code and text
Content-Type: application/json      ← headers

{ "error": "not found" }            ← body
```

## Status codes

The first digit tells you the category:

- **2xx success**: `200 OK`, `201 Created` (after a successful POST), `204 No Content` (success, nothing to return, e.g. after DELETE)
- **3xx redirect**: `301 Moved Permanently`, `302 Found`
- **4xx the client made a mistake**: `400 Bad Request` (invalid data), `401 Unauthorized` (not logged in), `403 Forbidden` (logged in but not allowed), `404 Not Found`
- **5xx the server failed**: `500 Internal Server Error`

Picking the right code matters: frontends and tools decide what to do based on it. `fetch` does **not** throw on a 404 or 500; it's your code that checks `response.ok` (true for 2xx).

## Watching it happen

You already have a great HTTP inspector: your browser's DevTools.

1. Open any website, press `F12`, go to the **Network** tab and reload.
2. Click a request. **Headers** shows the method, URL, status and all headers. **Response** shows the body.

To send requests yourself (including POST with a body), use **curl** in the terminal or a GUI tool like **Thunder Client** (a VS Code extension) or **Postman**:

```bash
curl -i http://localhost:8000
curl -i -X POST http://localhost:8000/api/stories -H "Content-Type: application/json" -d "{\"title\":\"Hi\"}"
```

`-i` includes the response headers in the output, `-X` sets the method, `-H` adds a header and `-d` sends a body. (The escaped quotes are needed in Windows terminals.)

## Common mistakes

- **Using GET to change data**, e.g. `GET /deleteBook?id=3`. Use the method that matches the action.
- **Always returning 200**, even for errors. The client can't tell success from failure without reading your message.
- **Confusing 401 and 403.** 401 = "who are you?", 403 = "I know who you are, and the answer is no."
- **Assuming `fetch` throws on 404.** It only throws on network failures; check `response.ok`.

### Takeaways
**Understand**
- A request has a method, a path, headers and sometimes a body; a response has a status code, headers and a body.
- The method says what the request does: GET reads (and must never change data), POST creates, PUT/PATCH update, DELETE removes.
- The first digit of a status code is its category: 2xx success, 3xx redirect, 4xx the client's mistake, 5xx the server's failure.
- `fetch` does not throw on a 404 or 500: your code must check `response.ok`.

**Muscle memory (no need to cram: it sticks by using it)**
- The common codes: 200, 201, 204, 400, 401, 403, 404, 500
- `curl -i URL` to see a response with its headers

**Look up when needed**
- Rarer status codes (301 vs 302, 409, 429…)
- curl options (`-X`, `-H`, `-d`)
- Specific headers like `Cache-Control` or `Authorization`

### Check your understanding
- Why is a route like `GET /deleteBook?id=3` a bad idea?
  Answer: GET must be safe to repeat: browsers, caches and search engines may call it on their own and delete data by accident. Use DELETE.
- A logged-in regular user opens `/admin`, a page only admins may see. 401 or 403?
  Answer: 403 Forbidden: the server knows who they are, but they aren't allowed. 401 means "not logged in".
- Your frontend's `fetch` gets a 404, but no error is thrown. Why?
  Answer: `fetch` only rejects on network failures. A 404 is a normal response, so check `response.ok`.

### Exercises
- Open a website you use daily, open DevTools → Network, and write down three requests with their method, status code and `Content-Type`.
  Hint: In DevTools → Network, click a request: the Headers tab shows the method, status and `Content-Type`.
- Run `curl -i http://localhost:8000` against your server from the last lesson and identify the status line, the headers and the body.
- Install Thunder Client or Postman and send a POST request to your server. What status does it return, and why does the server not care that it was a POST?
- For each situation, pick the status code: a user submits a form with an invalid email; a book was created; a page doesn't exist; the database crashed; a user opens someone else's private diary entry.

---lesson
id: node-5
title: Routing and serving JSON
time: 1.5h
notes: From memory, write the route table of your API (method, path, what it returns), then compare it with your code.
video: Traversy Media — Vanilla Node.js REST API (No Framework) | https://www.youtube.com/watch?v=_1xa8Bsho6A
docs: MDN: Working with JSON | https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON
docs: Anatomy of an HTTP transaction | https://nodejs.org/en/learn/http/anatomy-of-an-http-transaction
---
Right now your server answers every URL with the same thing. A real API returns different data depending on what was asked: `/api/books` gives you books, `/api/authors` gives you authors. Deciding which code runs for which request is called **routing**. And because APIs are consumed by code (your frontend), they answer in **JSON** rather than HTML.

## Routing with if statements

Without a framework, routing is simply checking `req.url` and `req.method`:

```js
import http from "node:http";
import { destinations } from "./data.js";

const server = http.createServer((req, res) => {
  if (req.url === "/api" && req.method === "GET") {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;
    return res.end(JSON.stringify(destinations));
  }

  res.setHeader("Content-Type", "application/json");
  res.statusCode = 404;
  res.end(JSON.stringify({ error: "not found", message: "The requested route does not exist" }));
});

server.listen(8000);
```

The order matters: specific routes come first, and the "not found" answer is the **fallback** at the end that catches everything else. The `return` makes sure that, once a route has answered, the rest of the function doesn't run.

## Sending JSON properly

`res.end()` only accepts text (or bytes), so objects must be converted with `JSON.stringify()`. Equally important is the header:

```js
res.setHeader("Content-Type", "application/json");
```

It tells the client "this text is JSON". The browser then displays it nicely, and tools like Postman format it. Your frontend can call `await response.json()` on it either way, but other clients and frameworks rely on the header, so always set it.

## The data module

Keep your data separate from your server logic:

```js
// data.js
export const destinations = [
  {
    uuid: "a1f9…",
    name: "Lake Bled",
    location: "Bled",
    country: "Slovenia",
    continent: "Europe",
    is_open_to_public: true,
    details: [{ name: "Activities", description: "Rowing to the island church." }],
  },
  // …more
];
```

Later, this module can be swapped for a database without touching the routing code.

## Checking it from the browser and the frontend

Open `http://localhost:8000/api` and you'll see your JSON. From a frontend page, it's the `fetch` you already know:

```js
const response = await fetch("http://localhost:8000/api");
const data = await response.json();
console.log(data[0].name);
```

(If that page runs on a different port, the browser will block it. That's CORS, and you'll fix it in a later lesson.)

## Planning your routes

Before writing code, list your routes in a small table. It's what professional API docs look like:

| Method | Path | Returns |
|---|---|---|
| GET | `/api` | all destinations |
| GET | `/api/continent/:continent` | destinations on that continent |
| anything else | | 404 + JSON error |

## Common mistakes

- **Sending an object without stringifying it.** `res.end(destinations)` throws `ERR_INVALID_ARG_TYPE`.
- **Forgetting `return`** after answering a route, so the 404 code also runs and you get "write after end".
- **Exact matches break with a trailing slash or query string.** `req.url === "/api"` is false for `/api/` and `/api?x=1`. The next lesson parses URLs properly.
- **Inconsistent error formats.** Pick one shape (e.g. `{ error, message }`) and use it everywhere.

### Takeaways
**Understand**
- Routing means choosing what to do from the request's method and path: specific routes first, a 404 fallback last.
- APIs answer in JSON: convert with `JSON.stringify` and set `Content-Type: application/json` so clients know what they got.
- `return` right after answering a route, so no other code sends a second response.
- Keep the data in its own module, so where it comes from can change later.

**Muscle memory (no need to cram: it sticks by using it)**
- `if (req.url === "/api" && req.method === "GET") { … }`
- `res.setHeader("Content-Type", "application/json")` and `res.end(JSON.stringify(data))`

**Look up when needed**
- The exact shape of your error responses (just keep it consistent)
- `res.writeHead(...)` shortcuts

### Check your understanding
- Why must the 404 answer come after all the other routes?
  Answer: It's the fallback for anything not matched. Placed earlier, it would answer requests meant for real routes.
- What happens with `res.end(destinations)`, passing the array directly?
  Answer: It throws `ERR_INVALID_ARG_TYPE`: `res.end` only accepts text or bytes, so stringify first.
- Why does `req.url === "/api"` stop matching `/api?country=italy`?
  Answer: `req.url` includes the query string. The next lesson parses the URL so you can match only the path.

### Exercises
- Create `data.js` exporting an array of at least 8 destinations with the fields shown above.
- Make `GET /api` return all destinations as JSON with the correct `Content-Type` and status 200.
- Return a 404 JSON error for every other URL. Test with the browser and curl.
- Add `GET /api/count` returning `{ "count": 8 }` (computed, not hard-coded). Think about where it must go relative to the 404 fallback.
  Hint: Count with the array's `.length`, and remember the order rule from this lesson.

---lesson
id: node-6
title: Path parameters and query parameters
time: 2h
notes: Give one example of a path parameter and one of a query parameter, and explain why each belongs where it is.
video: WebStylePress — Get URL Parameters in JavaScript (URLSearchParams) | https://www.youtube.com/watch?v=CZP1iQFQjEY
docs: URL class (Node) | https://nodejs.org/api/url.html#the-whatwg-url-api
docs: MDN: URLSearchParams | https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
---
APIs rarely return "everything". Clients want *one* item, or items *filtered* by something. URLs have two standard ways to carry that information: **path parameters** (`/api/continent/europe`) and **query parameters** (`/api?country=italy&is_open_to_public=true`). In this lesson you'll learn to read both reliably.

## Path vs query: when to use which

- **Path parameters** identify *which* resource: `/api/books/42`, `/api/continent/asia`. They're part of the resource's address.
- **Query parameters** *filter, sort or paginate* a collection: `/api/books?genre=fantasy&sort=year`. They're optional, and you can combine them freely.

A simple test: if removing it changes *what* you're looking at, it belongs in the path. If it narrows down a list, it's a query parameter.

## Parsing the URL

`req.url` is a string like `/api?country=italy`. Don't split it by hand: use the built-in `URL` class, which handles encoding (`%20`), repeated keys and edge cases:

```js
const url = new URL(req.url, `http://${req.headers.host}`);

console.log(url.pathname);     // "/api"
console.log(url.searchParams); // URLSearchParams { 'country' => 'italy' }
```

`URL` needs a full address, so you give it the request's host as the base. Now routes can match on `url.pathname`, which no longer contains the query string.

## Reading path parameters

Split the path into segments:

```js
// GET /api/continent/europe
if (url.pathname.startsWith("/api/continent/") && req.method === "GET") {
  const continent = decodeURIComponent(url.pathname.split("/").pop()); // "europe"
  const result = destinations.filter(
    (d) => d.continent.toLowerCase() === continent.toLowerCase()
  );
  res.setHeader("Content-Type", "application/json");
  return res.end(JSON.stringify(result));
}
```

`"/api/continent/europe".split("/")` gives `["", "api", "continent", "europe"]`, and `.pop()` takes the last piece. Comparing in lowercase makes `/api/continent/Europe` and `/api/continent/europe` both work.

**`decodeURIComponent` matters for names with spaces.** Browsers send `/api/continent/north america` as `/api/continent/north%20america`, and `url.pathname` keeps the `%20`. Decoding turns it back into `"north america"`. (A broken sequence like `%E0%A4%A` makes `decodeURIComponent` throw a `URIError`; you'll learn to catch unexpected errors in the next lesson.)

## Reading query parameters

```js
const queryObj = Object.fromEntries(url.searchParams);
// /api?country=italy&is_open_to_public=true
// → { country: "italy", is_open_to_public: "true" }
```

Then filter by every parameter that's present:

```js
function filterByQuery(data, { continent, country, is_open_to_public }) {
  let result = data;
  if (continent) {
    result = result.filter((d) => d.continent.toLowerCase() === continent.toLowerCase());
  }
  if (country) {
    result = result.filter((d) => d.country.toLowerCase() === country.toLowerCase());
  }
  if (is_open_to_public) {
    const wanted = is_open_to_public === "true";
    result = result.filter((d) => d.is_open_to_public === wanted);
  }
  return result;
}
```

Each `if` narrows the list further, so `?continent=europe&is_open_to_public=true` applies both filters. If no query parameters are given, the full list comes back.

## Query values are always strings

This is the number one bug with query parameters. `?is_open_to_public=false` gives you the **string** `"false"`, and the string `"false"` is truthy! Convert explicitly:

```js
const wanted = is_open_to_public === "true";  // boolean
const limit = Number(url.searchParams.get("limit")) || 10; // number, default 10
```

`searchParams.get(name)` returns a single value (or `null` if it's missing).

## Common mistakes

- **Matching `req.url` instead of `url.pathname`**, so routes break as soon as a query string is added.
- **Comparing `"true"` with `true`.** Always convert query values.
- **Case-sensitive comparisons**: users type `Italy`, `italy` and `ITALY`.
- **Forgetting URL encoding.** A path like `/api/country/new%20zealand` contains `%20`; decode path segments with `decodeURIComponent`. (`searchParams` already decodes query values for you.)

### Takeaways
**Understand**
- Path parameters identify which resource (`/api/books/42`); query parameters filter or sort a list (`?genre=fantasy`).
- Parse URLs with the `URL` class instead of splitting strings by hand.
- Query values are always strings: convert `"true"` and `"5"` yourself.
- Path segments keep their URL encoding (`%20`), so decode them; `searchParams` decodes for you.

**Muscle memory (no need to cram: it sticks by using it)**
- ``new URL(req.url, `http://${req.headers.host}`)``
- `url.pathname`, `url.searchParams.get("limit")`, `Object.fromEntries(url.searchParams)`
- `url.pathname.split("/").pop()`

**Look up when needed**
- Other `URLSearchParams` methods (`getAll`, `has`, …)
- `decodeURIComponent` and its `URIError`

### Check your understanding
- You request `?is_open_to_public=false`, but get the open places instead of the closed ones. What's wrong?
  Answer: The value is the string `"false"`, which is truthy. Compare with `=== "true"` to get a real boolean.
- Should "books by genre" be a path parameter or a query parameter?
  Answer: A query parameter (`/api/books?genre=fantasy`): it filters a list instead of naming one resource.
- Why does `/api/country/new%20zealand` find nothing without `decodeURIComponent`?
  Answer: The path still contains `%20` instead of a space, so the comparison with `"new zealand"` fails.

### Exercises
- Switch your router to use `url.pathname` and confirm `/api?anything=1` still returns all destinations.
- Add `GET /api/continent/:continent` and `GET /api/country/:country` (case-insensitive). Unknown values should return an empty array, not a 404.
- Make `GET /api` support `continent`, `country` and `is_open_to_public` query parameters, combined.
- Add `?limit=3` support. Make sure `limit=abc` doesn't break anything.
  Hint: `Number("abc")` is `NaN`. Only apply the limit when `Number.isInteger(limit) && limit > 0`, then use `array.slice(0, limit)`.

---lesson
id: node-7
title: Modularising your code
time: 1h
notes: If the data moved to a real database, which file would you change, and why would nothing else need to change?
video: Software Developer Diaries — Node.js Project Structure & Architecture | https://www.youtube.com/watch?v=fc6o1gwqZuA
docs: Node.js best practices (GitHub) | https://github.com/goldbergyoni/nodebestpractices
---
Your `server.js` is probably getting long: routing, filtering, JSON responses and data, all in one function. That works for 50 lines but becomes painful at 300. Splitting code into small modules with one job each makes it easier to read, to change and (later) to test. This is also exactly how Express projects are organised, so you're learning the shape early.

## Spot the repetition

You've likely written this three or four times:

```js
res.setHeader("Content-Type", "application/json");
res.statusCode = 200;
res.end(JSON.stringify(data));
```

Repeated code is a signal to extract a function:

```js
// utils/sendJSONResponse.js
export function sendJSONResponse(res, statusCode, payload) {
  res.setHeader("Content-Type", "application/json");
  res.statusCode = statusCode;
  res.end(JSON.stringify(payload));
}
```

Every route now ends with one readable line: `return sendJSONResponse(res, 200, result)`. And when you need to add a header to *every* response, you change one place. (You'll do exactly that in the CORS lesson next.)

## A data-access layer

Instead of importing the array directly into the server, wrap it in an `async` function:

```js
// database/db.js
import { destinations } from "../data/data.js";

export async function getDataFromDB() {
  return destinations;
}
```

Why `async` when the data is already in memory? Because when you replace the array with a real database later, reading data *will* be asynchronous. If callers already `await getDataFromDB()`, they won't need to change at all. This idea, hiding *where* data comes from behind a function, is called a **data-access layer**.

## Filters as pure functions

Move filtering logic into its own files:

```js
// utils/getDataByPathParams.js
export function getDataByPathParams(data, locationType, value) {
  return data.filter(
    (d) => d[locationType].toLowerCase() === value.toLowerCase()
  );
}
```

This is a **pure function**: it only uses its inputs and returns a result, without touching `req`, `res` or files. Pure functions are the easiest code to reuse and to test.

## The result: a thin server

```js
// server.js
import http from "node:http";
import { getDataFromDB } from "./database/db.js";
import { sendJSONResponse } from "./utils/sendJSONResponse.js";
import { getDataByPathParams } from "./utils/getDataByPathParams.js";
import { getDataByQueryParams } from "./utils/getDataByQueryParams.js";

const PORT = 8000;

async function handleRequest(req, res) {
  const destinations = await getDataFromDB();
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === "/api" && req.method === "GET") {
    const queryObj = Object.fromEntries(url.searchParams);
    return sendJSONResponse(res, 200, getDataByQueryParams(destinations, queryObj));
  }

  if (url.pathname.startsWith("/api/continent/") && req.method === "GET") {
    const continent = decodeURIComponent(url.pathname.split("/").pop());
    return sendJSONResponse(res, 200, getDataByPathParams(destinations, "continent", continent));
  }

  return sendJSONResponse(res, 404, { error: "not found", message: "The requested route does not exist" });
}

const server = http.createServer(async (req, res) => {
  try {
    await handleRequest(req, res);
  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
      sendJSONResponse(res, 500, { error: "server error", message: "Something went wrong" });
    } else {
      res.end();
    }
  }
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
```

Read `handleRequest` top to bottom: it now *describes* the API instead of implementing every detail.

## Catching unexpected errors

Notice the `try/catch` around `handleRequest`. The `http` module doesn't know your callback is `async`, so if anything inside it throws (a bug, a broken data file, a malformed `%` sequence in `decodeURIComponent`), the rejected promise isn't handled by anyone. Node then either **crashes the whole server** ("unhandled promise rejection") or leaves the request hanging. The wrapper turns any unexpected error into a `500` response and logs the details for you. `res.headersSent` checks whether a response had already started, because you can't send a new status code after that. (Express 5, which you'll learn next, does this for you automatically.)

The folder structure:

```
destinations-api/
├─ data/data.js
├─ database/db.js
├─ utils/
│  ├─ sendJSONResponse.js
│  ├─ getDataByPathParams.js
│  └─ getDataByQueryParams.js
├─ server.js
└─ package.json
```

## How to refactor safely

Refactoring means changing the structure **without** changing the behaviour. Do it in small steps: extract one function, run the server, test the routes, commit. Then the next one. If something breaks, you know exactly which step caused it.

## Common mistakes

- **Wrong relative import paths** after moving files. From `utils/` the data file is `../data/data.js`. Read the error message: it prints the path it tried.
- **Forgetting `await`** on `getDataFromDB()`, so you filter a Promise and get `data.filter is not a function`.
- **No `try/catch` around an `async` request handler.** One unexpected error then crashes the server for every user.
- **Over-splitting**: one file per three-line function isn't always better. Group by responsibility.
- **Refactoring and adding features at the same time.** Keep them separate so you can tell what broke.

### Takeaways
**Understand**
- Repeated code is a signal to extract a helper (like `sendJSONResponse`).
- A data-access layer hides where data comes from; making it `async` now means callers won't change when a database arrives.
- Pure functions (arguments in, result out, no `req`/`res`) are the easiest to reuse and test.
- The `http` module doesn't catch errors from `async` handlers: wrap your handler in `try/catch` and answer 500.
- Refactor in small steps: change the structure, re-test, commit.

**Muscle memory (no need to cram: it sticks by using it)**
- `export async function getDataFromDB()` / `await getDataFromDB()`
- The `try/catch` wrapper around your request handler

**Look up when needed**
- Folder-structure conventions (they vary between projects)
- `res.headersSent`

### Check your understanding
- Why is `getDataFromDB` async when the data is just an array?
  Answer: So the code calling it won't need to change when a real (asynchronous) database replaces the array.
- What makes `getDataByPathParams` a pure function?
  Answer: It only uses its arguments and returns a result, without touching `req`, `res`, files or anything else outside.
- What happens without the `try/catch` if your async handler throws?
  Answer: The rejected promise isn't handled, so Node can crash the whole server or leave the request hanging.

### Exercises
- Write `utils/sendJSONResponse.js` and replace every repeated response block with it.
- Move data access into `database/db.js` with an async `getDataFromDB()`.
- Move filtering into `utils/getDataByPathParams.js` and `utils/getDataByQueryParams.js`. After each move, re-test all routes.
- Compare the old and new `server.js`: write down how many lines each has and which one you'd rather debug in six months.

---lesson
id: node-8
title: CORS
time: 45m
notes: Explain CORS to someone who just saw the red error: whose rule is it, who has to fix it, and why does Postman not complain?
video: Fireship — CORS in 100 Seconds | https://www.youtube.com/watch?v=4KHiSt0oLJ0
docs: MDN: CORS | https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
---
Sooner or later you'll see this red error in the browser console: *"has been blocked by CORS policy"*. It confuses almost everyone the first time, because the same request works perfectly in Postman or curl. This lesson explains why, and how to fix it on the server, which is the only place it can be fixed.

## The same-origin policy

An **origin** is the combination of protocol, domain and port: `http://localhost:5173` and `http://localhost:8000` are *different* origins (different ports).

For security, browsers apply the **same-origin policy**: JavaScript on one origin may *send* requests to another origin, but it may not *read the response* unless the other server says it's allowed. Without this rule, any website you visit could use your logged-in session to read your email or bank data from other tabs.

## CORS: the server gives permission

**CORS** (Cross-Origin Resource Sharing) is how a server says "these origins may read my responses". It does so with response headers:

```js
res.setHeader("Access-Control-Allow-Origin", "*");
```

`*` means "any origin". That's fine for a public, read-only API like your destinations API. For APIs that use cookies or private data, you list the exact origin instead:

```js
res.setHeader("Access-Control-Allow-Origin", "https://my-frontend.netlify.app");
```

Since `sendJSONResponse` sets headers for every response, that's the perfect place to add it.

## Why curl and Postman don't care

CORS is enforced **by the browser**, to protect the browser's user. curl, Postman and other servers don't apply it at all. So "it works in Postman but not in my app" is the classic symptom of a CORS problem, not a bug in your API logic.

## Preflight requests

For "simple" requests (a GET with no special headers), the browser sends the request and then checks the response headers. For anything else, such as a POST with `Content-Type: application/json`, a PUT or a DELETE, it first sends an automatic **preflight** request with the `OPTIONS` method, asking "may I?". Your server must answer it:

```js
if (req.method === "OPTIONS") {
  res.writeHead(204, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  return res.end();
}
```

Put this at the top of your request handler. `204 No Content` means "OK, nothing to send". You'll see these OPTIONS requests in DevTools → Network.

## Reproducing the error (worth doing once)

1. Run your API on port 8000.
2. Create `index.html` that `fetch`es `http://localhost:8000/api` and logs the result.
3. Open it with VS Code's Live Server (port 5500) instead of your Node server.
4. Without the header: CORS error in the console. Add the header, restart: it works.

Seeing the error and the fix with your own eyes makes it stick.

## Common mistakes

- **Trying to fix CORS in the frontend** (e.g. `mode: "no-cors"`). That gives you an empty, unreadable response. The fix is always on the server.
- **Setting the header only on success responses.** Errors need it too, or the frontend can't read your 404 message.
- **Ignoring OPTIONS**, so GET works but POST fails with a preflight error.
- **Using `*` together with cookies.** Browsers reject that combination; credentials require an exact origin.

### Takeaways
**Understand**
- An origin is protocol + domain + port: `localhost:5173` and `localhost:8000` are different origins.
- Browsers block a page from reading another origin's responses unless that server allows it with CORS headers.
- CORS is enforced by the browser to protect its user: curl and Postman ignore it, and the fix is always on the server.
- Non-simple requests (JSON POST, PUT, DELETE) send an OPTIONS "preflight" first, which the server must answer.

**Muscle memory (no need to cram: it sticks by using it)**
- `res.setHeader("Access-Control-Allow-Origin", "*")` for public data

**Look up when needed**
- `Access-Control-Allow-Methods` / `Access-Control-Allow-Headers` and the exact preflight rules
- Why `*` doesn't work together with cookies

### Check your understanding
- Your API works in Postman, but your page shows a CORS error. Is the API broken?
  Answer: No. CORS is a browser rule: the server must send `Access-Control-Allow-Origin` for the page's origin.
- Why doesn't `mode: "no-cors"` in `fetch` fix the error?
  Answer: It makes the response opaque (unreadable), so your code still can't use the data. The fix belongs on the server.
- GET works from your page, but a POST with JSON fails. What's missing?
  Answer: An answer to the OPTIONS preflight request, listing the allowed methods and headers.

### Exercises
- Reproduce the CORS error: serve an `index.html` from another port (Live Server) that fetches your API.
  Hint: VS Code's Live Server extension serves a folder on port 5500, which is a different origin from your API on port 8000. Any other static server works too, for example `npx serve`.
- Add `Access-Control-Allow-Origin: *` in `sendJSONResponse` and confirm the page now shows the data.
- Add OPTIONS handling, then send a POST with a JSON body from the page and find the preflight request in DevTools → Network.
- Change the allowed origin to an exact URL that is *not* your page's origin and observe the error message change.

---project
id: node-p1
title: Destinations API (built-ins only)
summary: A JSON API of travel destinations, built with only Node's http module.
---
### The task
A travel website needs a backend that returns destinations as JSON, with filtering. You'll build it using **only** Node's built-in modules (no Express, no packages), using everything from this section: the http module, routing, path and query parameters, clean modules and CORS. When you learn Express next, you'll see exactly which parts it does for you.

### What it must do
- Data: `data/data.js` exports at least 12 destinations: `{ uuid, name, location, country, continent, is_open_to_public, details: [{ name, description }] }`
- `GET /api` returns all destinations
- `GET /api?continent=europe&country=italy&is_open_to_public=true` returns only destinations matching **all** given filters (case-insensitive); no query = everything
- `GET /api/continent/:continent` and `GET /api/country/:country` filter by path parameter
- `GET /api/:uuid` returns one destination, or a 404 if the uuid doesn't exist
- Any other route returns `404` with `{ "error": "not found", "message": "The requested route does not exist" }`
- Every response has `Content-Type: application/json` and `Access-Control-Allow-Origin: *`; OPTIONS requests get a 204
- Code split into `server.js`, `database/`, `utils/` and `data/`

### Steps
1. **Warm-up from memory (10 minutes).** In a blank file, write a server that answers `GET /api` with a JSON array and every other URL with a 404 JSON error, without looking. Then compare with lessons 1.4–1.6.
2. Create the project (`npm init -y`, `"type": "module"`, a `dev` script with `node --watch`). Write `data/data.js` with real places you'd like to visit. Generate uuids with `crypto.randomUUID()` in the REPL and paste them in.
3. Create `server.js` that returns the whole array for `GET /api` and a 404 JSON for everything else. Test both with the browser and curl.
4. Parse URLs with `new URL(...)` and add the `/api/continent/:continent` and `/api/country/:country` routes.
5. Add query-parameter filtering to `/api`, converting `is_open_to_public` to a boolean.
6. Add `GET /api/:uuid`. Think about route order: why must it come after the continent/country routes?
7. Refactor into `utils/sendJSONResponse.js`, `database/db.js` and the two filter modules. Re-test every route after each step.
8. Add CORS headers and OPTIONS handling. Build a tiny `index.html` (served from another port) with a dropdown of continents that fetches and lists matching destinations.
9. Write a README: a table of all endpoints with an example request and response for each. Push to GitHub.

### Hints
- Write your test URLs in a `requests.http` file (REST Client extension) or a Postman collection, so re-testing after each step takes seconds.
- `url.pathname.split("/")` for `/api/country/italy` is `["", "api", "country", "italy"]`. Check the *length* to tell `/api/:uuid` apart from longer paths.
- If something returns nothing, log `url.pathname` and your parsed parameters before filtering.

### Stretch goals
- `?limit=5&page=2` pagination, returning `{ data, page, total }`.
- `?search=lake` matching the name or description.
- Deploy it to Render (free) and use the live URL in your frontend page.

### Done when
- All routes in "What it must do" return the correct data and status codes
- Combined query filters work and are case-insensitive
- Unknown routes and unknown uuids return a 404 JSON error
- A page on another origin can fetch the API (CORS works)
- `server.js` only does routing; helpers, data access and filters live in their own modules
- The repo has a README documenting every endpoint

---section
id: node-s3
title: Build a full-stack Node app
intro: Make one Node server deliver both a website and an API. You'll serve static files, accept data with POST requests, push live updates with Server-Sent Events and keep secrets in environment variables. The section ends with a live story board where new posts appear on everyone's screen.
---

---lesson
id: node-13
title: Serving a website: static files
time: 1.5h
notes: Why does the browser need the right Content-Type for a CSS file, and what happens when it's wrong?
video: Traversy Media — Node.js Crash Course (2024; watch the http server and file-serving parts) | https://www.youtube.com/watch?v=32M1al-Y6Ag
docs: MDN: MIME types | https://developer.mozilla.org/en-US/docs/Web/HTTP/MIME_types/Common_types
docs: path module | https://nodejs.org/api/path.html
---
So far your API returns JSON and you've opened frontends from a separate tool like Live Server. A **full-stack** Node app usually does both from one server: it sends the HTML, CSS, JavaScript and images of the website (the **static files**), and it answers the API requests that page makes. One server, one origin, no CORS needed.

## What "static" means

A static file is sent exactly as it is on disk: `index.html`, `styles.css`, `app.js`, `logo.png`. The server doesn't generate it; it just finds it and sends it. Conventionally they live in a `public/` folder:

```
story-board/
├─ public/
│  ├─ index.html
│  ├─ styles.css
│  └─ index.js
├─ server.js
└─ package.json
```

## Mapping a URL to a file

The idea: take the request path, look for that file inside `public/`, and send it.

```js
import fs from "node:fs/promises";
import path from "node:path";

const PUBLIC_DIR = path.join(import.meta.dirname, "public");

export async function serveStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);

  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname); // "/my%20photo.png" → "/my photo.png"
  } catch {
    res.writeHead(400, { "Content-Type": "text/plain" });
    return res.end("Bad request");
  }
  if (pathname.endsWith("/")) pathname += "index.html";

  const filePath = path.join(PUBLIC_DIR, pathname);
  if (!filePath.startsWith(PUBLIC_DIR + path.sep)) {
    res.writeHead(403, { "Content-Type": "text/plain" });
    return res.end("Forbidden"); // see "Security: path traversal" below
  }

  try {
    const content = await fs.readFile(filePath);
    res.writeHead(200, { "Content-Type": getContentType(filePath) });
    res.end(content);
  } catch (err) {
    if (err.code === "ENOENT" || err.code === "EISDIR") {
      res.writeHead(404, { "Content-Type": "text/html" });
      return res.end("<h1>404: page not found</h1>");
    }
    throw err; // anything else is a real problem
  }
}
```

Step by step:

- **Decode the path.** `url.pathname` keeps URL encoding, so a file called `my photo.png` is requested as `/my%20photo.png`. `decodeURIComponent` turns it back into the real file name. It throws on broken sequences like `%E0%A4%A`, which we answer with `400 Bad request`.
- **Folders get `index.html`.** `/` becomes `/index.html` (browsers request `/` for the home page), and `/blog/` becomes `/blog/index.html`.
- **Stay inside `public/`.** Explained in the security section below.
- **Missing files are a 404.** `ENOENT` means the file doesn't exist. `EISDIR` means the path is a *folder* (e.g. `/images` without a slash): `readFile` can't read a folder, so we treat it as not found too.

Notice there's no `"utf8"` in `readFile`: we want the raw bytes, because images aren't text.

## Content types (MIME types)

The browser decides what to do with a file based on its `Content-Type` header, not its extension. Send CSS as `text/plain` and the page is unstyled; send JavaScript wrong and it won't run (browsers enforce this strictly for `<script type="module">`). Map extensions to types:

```js
const TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

function getContentType(filePath) {
  return TYPES[path.extname(filePath).toLowerCase()] ?? "application/octet-stream";
}
```

`application/octet-stream` means "unknown binary data", a safe default.

## Combining API routes and static files

In `server.js`, check API routes first; everything else is treated as a file:

```js
const server = http.createServer(async (req, res) => {
  try {
    if (req.url.startsWith("/api")) {
      return await handleApi(req, res);
    }
    return await serveStatic(req, res);
  } catch (err) {
    console.error(err);
    if (!res.headersSent) res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Server error");
  }
});
```

The `try/catch` is the same safety net as in the "Modularising your code" lesson: any unexpected error becomes a 500 instead of crashing the server. The `await` matters: without it, a rejected promise would skip the `catch`.

In the frontend you can now use **relative** URLs, `fetch("/api/stories")`, because the page and the API share the same origin.

## Security: path traversal

What if someone requests `/../server.js` or `/../.env`? `path.join` resolves `..` segments, so the final path could point *outside* `public/`, leaking your source code or secrets. The `URL` class removes plain `/../` from the path, but an attacker can hide the slash as `%2F`: `/..%2F.env` survives URL parsing, and after `decodeURIComponent` it becomes `/../.env`. So after decoding, always check that the final path is still inside the public folder:

```js
const filePath = path.join(PUBLIC_DIR, pathname);
if (!filePath.startsWith(PUBLIC_DIR + path.sep)) {
  res.writeHead(403);
  return res.end("Forbidden");
}
```

Why `PUBLIC_DIR + path.sep` and not just `PUBLIC_DIR`? If your folder is `C:\app\public`, a request for `/..%2Fpublic-secret%2Fkey.txt` resolves to `C:\app\public-secret\key.txt`, which still *starts with* `C:\app\public`! Adding the separator (`\` on Windows, `/` elsewhere) means "inside this folder", not "a name that begins the same way".

## Common mistakes

- **Reading images with `"utf8"`**, which corrupts them. Read bytes (no encoding).
- **Wrong or missing Content-Type**, so CSS is ignored or JS modules refuse to load. Check the Network tab.
- **Absolute links in HTML** like `<link href="C:\...">`. Use paths relative to the site root: `/styles.css`.
- **Skipping the path-traversal check**, or writing it as `startsWith(PUBLIC_DIR)` without the separator.
- **Not decoding the path**, so files with spaces or accents in their names always 404.
- **Only handling `ENOENT`**: requesting a folder throws `EISDIR`, which then crashes the request.

### Takeaways
**Understand**
- Static files are sent exactly as they are on disk; one server can deliver both the website and the API (same origin, so no CORS).
- The browser decides what a file is from its `Content-Type` header, not from its extension.
- Read files as bytes (no `"utf8"`), so images aren't corrupted.
- Never trust the request path: decode it, then make sure the final path is still inside `public/`.

**Muscle memory (no need to cram: it sticks by using it)**
- `path.join(PUBLIC_DIR, pathname)` and the `startsWith(PUBLIC_DIR + path.sep)` check
- A small object mapping file extensions to content types

**Look up when needed**
- Content types for other kinds of files
- Error codes like `EISDIR`

### Check your understanding
- Your page loads but has no styles, and DevTools shows `styles.css` arriving as `text/plain`. What's wrong?
  Answer: The server sent the wrong `Content-Type`: map `.css` to `text/css`.
- Why must the path check come after `decodeURIComponent`?
  Answer: Encoded tricks like `%2F` only turn into `/` after decoding, so a check before decoding would miss them.
- Why check `startsWith(PUBLIC_DIR + path.sep)` and not just `startsWith(PUBLIC_DIR)`?
  Answer: Without the separator, a sibling folder like `public-secret` also "starts with" `public`.

### Exercises
- Create `public/index.html`, `styles.css` and `index.js` (logging "loaded"), and serve them with `serveStatic`. Check all three arrive with the right `Content-Type` in DevTools.
- Add an image and display it on the page.
- Create a custom `public/404.html` and send it (with status 404) for missing files.
- Temporarily remove the path-traversal check and run `curl "http://localhost:8000/..%2Fpackage.json"`: your server leaks `package.json`. Put the check back and run it again to get a 403.
  Hint: Your browser cleans up `..` in addresses, so use curl. The `%2F` is an encoded `/` that only becomes a real slash after `decodeURIComponent`.

---lesson
id: node-10
title: Handling POST requests and request bodies
time: 1.5h
notes: List, in order, the five things your create-story endpoint does, and explain why the server (not the client) creates the id and the date.
video: ProgrammingKnowledge — Read Request Body & Streams in Node.js HTTP Module | https://www.youtube.com/watch?v=EqnwUbXc-SA
docs: Anatomy of an HTTP transaction | https://nodejs.org/en/learn/http/anatomy-of-an-http-transaction
docs: Streams overview | https://nodejs.org/api/stream.html
docs: OWASP: Cross Site Scripting | https://owasp.org/www-community/attacks/xss/
---
Up to now your API only *gives* data. Real apps also *receive* it: a sign-up form, a new comment, a story. The client sends that data in the **body** of a POST request. In this lesson you'll read the body, check it, save it, and protect your users from malicious input.

## The body arrives in pieces

Request bodies can be large (think of a file upload), so Node doesn't wait to receive all of it. `req` is a **stream**: the body arrives in chunks, each one a `Buffer` (raw bytes). With `for await…of` you can collect them:

```js
const MAX_BODY_BYTES = 10_000; // 10 KB is plenty for a short story

export async function parseJSONBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      const err = new Error("Request body too large");
      err.statusCode = 413; // 413 Content Too Large
      throw err;
    }
    chunks.push(chunk);
  }
  const text = Buffer.concat(chunks).toString("utf8");
  return JSON.parse(text);
}
```

Three details make this robust:

- **Collect bytes, convert once.** It's tempting to write `body += chunk`, which converts each chunk to text separately. But characters like `é` or `🙂` take several bytes, and a chunk can end in the middle of one, leaving garbage characters (`�`). Joining all the bytes with `Buffer.concat` first and converting to text once avoids that.
- **Limit the size.** Without a limit, someone can send a 2 GB body and your server keeps all of it in memory. Stop reading once the body is bigger than you'd ever need and answer `413`. (Express's `express.json({ limit: "10kb" })` does exactly this, as you'll see in the next module.)
- **Invalid JSON throws.** `JSON.parse` throws a `SyntaxError` if the client sent broken JSON, so the caller must handle it.

## A POST route

```js
if (url.pathname === "/api/stories" && req.method === "POST") {
  let data;
  try {
    data = await parseJSONBody(req);
  } catch (err) {
    if (err.statusCode === 413) return sendJSONResponse(res, 413, { error: "Story is too large" });
    return sendJSONResponse(res, 400, { error: "Invalid JSON" });
  }

  const problem = validateStory(data);
  if (problem) return sendJSONResponse(res, 400, { error: problem });

  const story = {
    id: crypto.randomUUID(),
    title: data.title.trim(),
    text: data.text.trim(),
    location: data.location.trim(),
    createdAt: new Date().toISOString(),
  };
  await addStory(story);
  return sendJSONResponse(res, 201, story);
}
```

The flow is the same for every "create" endpoint you'll ever write: **parse → validate → build the object → save → respond 201 with the created item**. The server, not the client, decides the `id` and timestamp. Never trust those from the client.

## Validation

Validation means rejecting data that doesn't make sense *before* it reaches your storage:

```js
function validateStory({ title, text, location } = {}) {
  if (typeof title !== "string" || !title.trim()) return "Title is required";
  if (typeof text !== "string" || !text.trim()) return "Text is required";
  if (text.length > 280) return "Text must be 280 characters or fewer";
  if (typeof location !== "string" || !location.trim()) return "Location is required";
  return null;
}
```

Clear error messages help the frontend show the user what to fix. (In the Express module you'll use a library, Zod, that makes this shorter.)

## Saving to a file

Reuse what you learned with `fs`:

```js
export async function addStory(story) {
  const stories = await getStories();   // read + JSON.parse, [] if missing
  stories.push(story);
  await fs.writeFile(FILE, JSON.stringify(stories, null, 2));
}
```

## Sending data from the frontend

```js
const response = await fetch("/api/stories", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title, text, location }),
});
const result = await response.json();
if (!response.ok) showError(result.error);
```

## Sanitising: protecting other users

Imagine someone posts the "story" `<img src=x onerror="alert('hacked')">`. If your page inserts stories with `innerHTML`, that code runs **in every visitor's browser**. This attack is called **XSS** (cross-site scripting). Two defences, use both:

1. On the frontend, insert user text with `textContent`, not `innerHTML`.
2. On the server, clean input before storing it, e.g. with the `sanitize-html` package:

```js
import sanitizeHtml from "sanitize-html";
const clean = sanitizeHtml(data.text, { allowedTags: [], allowedAttributes: {} });
```

With no tags allowed, any HTML is stripped and only plain text remains.

## Common mistakes

- **Parsing without try/catch**: one bad request crashes the whole server.
- **`body += chunk`**: works in English tests, then corrupts accented letters and emoji in real use.
- **No size limit**: anyone can fill your server's memory with one huge request.
- **Forgetting the `Content-Type: application/json` header in fetch**, or sending an object without `JSON.stringify`.
- **Trusting client-sent ids, dates or prices.** The server generates them.
- **Rendering user input with `innerHTML`.**

### Takeaways
**Understand**
- A request body arrives as a stream of byte chunks: collect them all, then convert to text once.
- Never trust input: parse inside `try/catch`, validate, and reject bad data with a 400 before saving anything.
- Every create endpoint follows the same flow: parse → validate → build → save → respond 201.
- User text shown to other people must be sanitized and inserted with `textContent`, or attackers can run scripts in their browsers (XSS).

**Muscle memory (no need to cram: it sticks by using it)**
- `for await (const chunk of req)` and `Buffer.concat(chunks).toString("utf8")`
- `fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })`

**Look up when needed**
- `sanitize-html` options
- Status 413 and body size limits

### Check your understanding
- Why collect the chunks and convert once, instead of `body += chunk`?
  Answer: A character like é or 🙂 takes several bytes and can be split across two chunks; converting each chunk separately corrupts it.
- Why does the server generate `id` and `createdAt`?
  Answer: The client can't be trusted to send correct or unique values: the server is the source of truth.
- What's the danger of showing a story with `innerHTML`?
  Answer: If the story contains HTML or a script, it runs in every visitor's browser (XSS). Use `textContent`.

### Exercises
- Write `parseJSONBody(req)` and a `POST /api/echo` route that sends back whatever JSON it receives. Test it with Thunder Client/Postman, including a body with emoji and accented letters.
- Send invalid JSON (e.g. `{title:`) and make sure you get a 400, not a crash.
  Hint: In Thunder Client or Postman, choose a raw JSON body and type broken JSON yourself, like `{"title":` with nothing after it.
- Build `POST /api/stories` that validates and appends to `data/stories.json`, responding with 201.
- Post a story containing `<b>bold</b><script>alert(1)</script>` and check what gets stored after adding `sanitize-html`.

---lesson
id: node-11
title: Events, EventEmitter and Server-Sent Events
time: 1.5h
notes: Explain how one new story travels from the POST request to every open browser, step by step.
video: Codevolution — Node.js Events Module | https://www.youtube.com/watch?v=Su0-Y9coU3s
video: Web Dev Cody — Server-Sent Events Are Pretty Cool | https://www.youtube.com/watch?v=_XQiU3mLNk0
docs: events module | https://nodejs.org/api/events.html
docs: MDN: Using server-sent events | https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events
---
Normally the browser asks and the server answers. But what if the server has news? A new chat message, a new story, a price change: you want it to appear on everyone's screen **without refreshing**. In this lesson you'll learn Node's event system and use it, together with **Server-Sent Events (SSE)**, to push live updates to the browser.

## EventEmitter: "when this happens, do that"

Much of Node is built on events: a server emits a `"request"` event, a stream emits `"data"`. You can create your own events with `EventEmitter`:

```js
// events.js
import { EventEmitter } from "node:events";

export const storyEvents = new EventEmitter();
```

```js
import { storyEvents } from "./events.js";

// subscribe: run this function whenever "story-added" happens
storyEvents.on("story-added", (story) => {
  console.log("New story:", story.title);
});

// publish: somewhere else in the code
storyEvents.emit("story-added", { title: "The silent lighthouse" });
```

`on(name, listener)` registers a listener; `emit(name, data)` calls every listener registered for that name, passing the data. The code that emits doesn't need to know who is listening. That's what makes events useful: your POST route can announce "a story was added" without knowing anything about live updates.

## Server-Sent Events: keeping the response open

Normally you call `res.end()` immediately. With SSE you **don't**: you keep the response open and write messages into it whenever you have something to say. The browser receives each message as it arrives.

```js
if (url.pathname === "/api/live" && req.method === "GET") {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.write(": connected\n\n"); // a comment line: sends the headers right away

  const onStory = (story) => {
    res.write(`data: ${JSON.stringify(story)}\n\n`);
  };
  storyEvents.on("story-added", onStory);

  res.on("close", () => {
    storyEvents.off("story-added", onStory);
  });
  return;
}
```

The important parts:

- **`text/event-stream`** tells the browser this is an SSE stream.
- **`: connected`** is an SSE comment (lines starting with `:` are ignored by the browser). Writing something immediately makes Node send the headers now, so the browser knows the stream is open instead of waiting for the first story.
- Each message has the format `data: <text>` followed by a **blank line** (`\n\n`). Without the blank line, the browser keeps waiting.
- Every connected browser gets its own `onStory` listener. When `"story-added"` is emitted, all of them write to their own open response, which is how one new story reaches everyone.
- When the user closes the tab, the **response** (`res`) emits `"close"` and we remove the listener. Otherwise listeners pile up forever (a memory leak). Listen on `res`, not `req`: the response's `"close"` is the documented signal that the connection to this client is gone. The request's `"close"` is about the *incoming* request, and in some Node versions it fired as soon as the request had been read, long before the user left.

## More than 10 listeners

By default an EventEmitter prints `MaxListenersExceededWarning` when one event has more than 10 listeners, because that's often a sign of a leak. With SSE, 11 open tabs means 11 legitimate listeners, so raise the limit on purpose:

```js
export const storyEvents = new EventEmitter();
storyEvents.setMaxListeners(100); // one listener per connected browser
```

The cleanup on `close` is still essential: the limit only silences the warning, it doesn't free memory.

## The browser side

Browsers have a built-in `EventSource` for SSE:

```js
const source = new EventSource("/api/live");

source.onmessage = (event) => {
  const story = JSON.parse(event.data);
  renderStory(story); // prepend it to the list
};
```

`EventSource` also reconnects automatically if the connection drops.

## Connecting the pieces

In your POST handler, after saving:

```js
await addStory(story);
storyEvents.emit("story-added", story);
return sendJSONResponse(res, 201, story);
```

Open the page in two windows side by side, post in one, and watch it appear in the other.

## SSE or WebSockets?

SSE is **one-way** (server to browser) over normal HTTP, and very simple. **WebSockets** are two-way and better for things like multiplayer games or chat with typing indicators. For notifications and live feeds, SSE is often all you need.

## Common mistakes

- **Missing the blank line** after `data: …`, so messages never arrive.
- **Calling `res.end()`** in the SSE route: the stream closes immediately.
- **Not removing listeners on `close`**: memory grows with every visitor who ever opened the page.
- **Cleaning up on `req.on("close")`** instead of `res.on("close")`: depending on the Node version, the listener may be removed too early and live updates silently stop.
- **Sending objects without `JSON.stringify`.**

### Takeaways
**Understand**
- An EventEmitter separates parts of your code: one part announces "something happened" and any number of listeners react, without knowing about each other.
- Server-Sent Events keep a response open and write messages into it; the browser's `EventSource` receives them.
- Each SSE message is `data: …` followed by a blank line.
- Remove listeners when the client disconnects (`res.on("close")`), or memory keeps growing.

**Muscle memory (no need to cram: it sticks by using it)**
- `emitter.on(name, fn)`, `emitter.emit(name, data)`, `emitter.off(name, fn)`
- `new EventSource(url)` with `onmessage`

**Look up when needed**
- The exact SSE headers
- `setMaxListeners`, `listenerCount`
- When WebSockets are the better choice

### Check your understanding
- Messages never arrive in the browser, and there's no error. What's the classic cause?
  Answer: A missing blank line (`\n\n`) after `data: …`, so the browser keeps waiting for the message to end.
- Why remove the listener when the connection closes?
  Answer: Otherwise every visitor who ever connected leaves a listener behind that keeps running and holding memory.
- When would you choose WebSockets instead of SSE?
  Answer: When the browser also needs to send a stream of messages to the server (two-way), like games or chats with typing indicators.

### Exercises
- Create an EventEmitter, register two listeners for `"greet"`, emit it with a name and see both run.
- Build `GET /api/time` that streams the current time every 2 seconds via SSE (`setInterval`, cleared on close). Show it live on a page.
  Hint: Start a timer with `const timer = setInterval(() => res.write(…), 2000)` and stop it with `res.on("close", () => clearInterval(timer))`.
- Emit `"story-added"` in your POST route and push new stories to all connected browsers. Test with two windows.
- Log `storyEvents.listenerCount("story-added")` every time a browser connects or disconnects. Open 12 tabs (see the warning without `setMaxListeners`), then close them all and check the count goes back to 0.

---lesson
id: node-12
title: Environment variables and configuration
time: 45m
notes: Why should secrets never be written in your code, and what must you do if one reaches GitHub anyway?
video: Backend Brewery — Node.js Built-in --env-file & process.loadEnvFile() | https://www.youtube.com/watch?v=8TrmkT90vGE
docs: Node.js: environment variables | https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs
docs: process.env | https://nodejs.org/api/process.html#processenv
---
Your code will run in different places: your laptop, a test server, a hosting provider. Each place needs different settings (a port, a database address) and some settings are **secrets** (API keys, passwords) that must never be written in your code, because your code goes to GitHub. **Environment variables** solve both problems.

## What environment variables are

They're named values that the operating system gives to every program it starts. Node exposes them on `process.env`:

```js
console.log(process.env.PATH);       // the system PATH
console.log(process.env.PORT);       // undefined, unless set
```

All values are **strings** (or `undefined` if not set).

## The .env file

Setting variables by hand in the terminal is tedious, so by convention you put them in a file called `.env` in your project root:

```
PORT=8000
ADMIN_PASSWORD=change-me
SITE_NAME=Story Board
```

Node (20.6 and later) can load it for you, with no package needed:

```bash
node --env-file=.env server.js
```

Put it in your scripts so you never forget:

```json
"scripts": {
  "dev": "node --watch --env-file=.env server.js",
  "start": "node server.js"
}
```

In older tutorials you'll see the `dotenv` package doing the same job. Notice that `start` doesn't load the file: in production, the hosting provider sets real environment variables in its dashboard instead.

One catch: `--env-file=.env` **stops with an error if the file doesn't exist**, which is exactly what happens when someone clones your repo and hasn't created their `.env` yet. If your app has sensible defaults for everything, use `--env-file-if-exists=.env` instead (Node 22.9+): it loads the file when it's there and quietly skips it otherwise.

## Reading them with defaults

```js
const PORT = Number(process.env.PORT) || 8000;
const SITE_NAME = process.env.SITE_NAME ?? "My site";
```

Hosting providers like Render and Railway tell your app which port to use through `PORT`, so your server must read it.

## Required variables: fail fast

For secrets with no sensible default, stop immediately with a clear message instead of failing mysteriously later:

```js
// config.js
function required(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing environment variable ${name}. Did you create .env?`);
    process.exit(1);
  }
  return value;
}

export const config = {
  port: Number(process.env.PORT) || 8000,
  adminPassword: required("ADMIN_PASSWORD"),
};
```

Importing `config` everywhere (instead of reading `process.env` all over your code) keeps configuration in one place.

## Keeping secrets out of git

1. Add `.env` to `.gitignore` **before** your first commit.
2. Commit a **`.env.example`** with the same keys but fake values, so others know what to set:

```
PORT=8000
ADMIN_PASSWORD=your-password-here
```

If you ever push a real key to GitHub, consider it stolen: bots scan GitHub for keys within minutes. Revoke it and create a new one. Deleting the commit isn't enough.

## Common mistakes

- **Committing `.env`.** Check with `git status` before committing.
- **Spaces or quotes in `.env`**: write `PORT=8000`, not `PORT = "8000"` (quotes are usually OK, spaces around `=` are not).
- **Forgetting values are strings**: `process.env.DEBUG === "true"`, not `=== true`.
- **Changing `.env` and not restarting.** Env files are read once at startup (even `--watch` may not reload them).

### Takeaways
**Understand**
- Settings and secrets come from environment variables, not from code, because your code ends up on GitHub.
- Locally they live in `.env` (git-ignored); in production the hosting platform sets them; `.env.example` documents which ones exist.
- All values are strings, and a missing required value should stop the app at startup with a clear message.
- A leaked key is compromised for good: revoke it and create a new one.

**Muscle memory (no need to cram: it sticks by using it)**
- `process.env.NAME`
- `node --env-file=.env server.js` in your `dev` script
- `.env` in `.gitignore`

**Look up when needed**
- `--env-file-if-exists`
- `process.exit(1)` and exit codes
- The `dotenv` package (in older projects)

### Check your understanding
- Why doesn't the `start` script load `.env`?
  Answer: In production the hosting platform sets real environment variables; `.env` is only for your own machine.
- `process.env.DEBUG === true` is never true. Why?
  Answer: Environment variables are always strings: compare with `"true"`.
- You pushed an API key to GitHub and then deleted the commit. Are you safe?
  Answer: No. Bots scan GitHub within minutes. Revoke the key and create a new one.

### Exercises
- Move your server's port into `.env` and load it with `--env-file`. Change the port and confirm it's used.
- Create `.gitignore` (with `node_modules` and `.env`) and `.env.example`. Run `git status` to check `.env` isn't tracked.
- Write `config.js` with a `required()` helper and make the server exit with a helpful message when `ADMIN_PASSWORD` is missing.
- Add a `GET /api/info` route returning `SITE_NAME` from the config (never return secrets!).

---project
id: node-p2
title: Live Story Board (full-stack)
summary: A website where people post short stories and everyone sees new ones appear live.
---
### The task
Build a small community website where visitors post short, anonymous stories (up to 280 characters) and everyone viewing the page sees new stories appear instantly, without refreshing. One Node server, with no frameworks, delivers both the website and the API. This uses every lesson in this section: static files, POST bodies, validation and sanitising, events with SSE, and environment variables.

### What it must do
- `public/` contains `index.html` (a form and a list of stories), `styles.css` and `index.js`, served by your own static file handler with correct content types
- `GET /api/stories` returns all stories, newest first
- `POST /api/stories` accepts `{ title, text, location }`, validates it (all required, text ≤ 280 characters), sanitises it, and stores it with a server-generated `id` and `createdAt`
- Stories are saved in `data/stories.json` and survive a server restart
- Invalid input (missing fields, too long, invalid JSON) returns `400` with a clear message, shown next to the form
- `GET /api/live` is an SSE stream: every open browser receives new stories in real time
- The port comes from `.env`; `.env` is git-ignored and `.env.example` is committed

### Steps
1. **Warm-up from memory (10 minutes).** In a blank file, write `parseJSONBody(req)` (byte chunks in, object out, with a size limit) without looking. Then compare with lesson 1.11.
2. Set up the project and `public/` with a static `index.html` (form + empty list). Write `serveStatic` and route everything that isn't `/api` to it. Check the page, CSS and JS load.
3. Create `data/stories.json` with 3 example stories. Build `GET /api/stories` and render the list in `index.js` with `fetch` and `textContent`.
4. Write `parseJSONBody` and `POST /api/stories` with validation. Test it with Thunder Client/Postman before touching the frontend.
5. Connect the form: prevent the default submit, POST with fetch, clear the form on success, and show the server's error message on failure.
6. Install `sanitize-html` and sanitise all three fields before saving. Try posting HTML to check.
7. Create `events.js` with an EventEmitter. Emit `"story-added"` after saving.
8. Build `GET /api/live` (SSE) with listener cleanup on close. In the browser, use `EventSource` to add new stories to the top of the list. Test with two windows side by side.
9. Move the port into `.env`, add `.env.example`, and write a README with screenshots. Push to GitHub.
10. Deploy to Render or Railway and send the link to a friend to test it live.

### Hints
- When the page posts a story, it will also receive it through SSE. Either render it only from SSE, or skip duplicates by `id`.
- Free hosts may reset files on each deploy; that's fine for now (the Databases module fixes it).
- If live updates don't arrive, check DevTools → Network → `live` → EventStream, and remember the blank line after each `data:`.

### Stretch goals
- Show "posted 3 minutes ago" times with `Intl.RelativeTimeFormat`.
- A like button (`PATCH /api/stories/:id/like`) that also updates live for everyone.
- Rate-limit posting to one story per 30 seconds per IP address (`req.socket.remoteAddress`).

### Done when
- The page, styles and script are served by your own Node server
- Posting a valid story saves it and shows it; invalid input shows a clear error
- HTML in a story is stripped and never runs on other users' screens
- A new story appears in a second browser window without refreshing
- Stories survive a server restart, and no secrets or `.env` are in the repo
- The app is deployed and the link is in the README
- `.env.example` lists every environment variable with placeholder values, and `.env` is git-ignored

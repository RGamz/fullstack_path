---module
id: express
title: Express.js
scrimba: Express.js
weeks: 3 weeks
fullCourse: Traversy Media Express crash course
intro: In the Node module you built servers with the raw `http` module, parsing URLs, setting headers and reading bodies by hand. Express is a thin layer on top of that same server that does those chores for you, so you can spend your time on what your API actually does.
---

---section
id: express-s1
title: Build an Express API
intro: Learn the building blocks of Express (routes, routers, middleware, error handling and validation) and how to design a clean REST API. You'll finish by building a Book Library API that you'll keep upgrading in later modules.
---

---lesson
id: ex-1
title: Hello Express
time: 1h
video: Net Ninja Express.js tutorial for beginners
docs: Express: Hello world | https://expressjs.com/en/starter/hello-world.html
docs: Express 5 migration notes | https://expressjs.com/en/guide/migrating-5.html
docs: Express 5 API reference | https://expressjs.com/en/5x/api.html
---
In the Node module, even a small server needed a lot of code: `if (req.url === ... && req.method === ...)` chains, `res.writeHead`, `JSON.stringify`, and reading the request body chunk by chunk. **Express** removes that boilerplate. It doesn't replace Node's `http` module: it uses it underneath. The `req` and `res` objects you get in Express are the same Node objects you already know, with useful helper methods added.

## Installing Express

```bash
mkdir hello-express
cd hello-express
npm init -y
npm install express
```

Add `"type": "module"` and a `dev` script (`"dev": "node --watch server.js"`) to `package.json`, exactly as in the Node module. Check that `dependencies` shows `"express": "^5..."`. Express 5 is the current major version. Many tutorials online still use Express 4: most code is identical, and the differences that matter are pointed out in these lessons.

## Your first Express server

```js
// server.js
import express from "express";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.get("/", (req, res) => {
  res.send("Hello from Express!");
});

app.get("/api/time", (req, res) => {
  res.json({ now: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

- `express()` creates an **application**: an object that holds your routes and settings.
- `app.get(path, handler)` registers a **route**: when a `GET` request arrives for that path, Express calls the handler. There are matching methods for the other HTTP verbs: `app.post`, `app.put`, `app.patch` and `app.delete`.
- The handler receives `req` (the request) and `res` (the response).
- `app.listen` calls `http.createServer` for you and starts listening on the port.

Run `npm run dev` and open `http://localhost:3000/api/time`. Now try `http://localhost:3000/nope`: Express automatically answers with a 404 and a small HTML page saying `Cannot GET /nope`. You'll replace that with a JSON response in the error-handling lesson.

## The response helpers

| Helper | What it does |
|---|---|
| `res.send(text)` | Sends a string; sets `Content-Type: text/html` |
| `res.json(data)` | Runs `JSON.stringify` and sets `Content-Type: application/json` |
| `res.status(code)` | Sets the status code and returns `res`, so you can chain |
| `res.set(name, value)` | Sets a response header |
| `res.redirect(url)` | Redirects (status 302 by default) |
| `res.end()` | Ends the response with no body |

Compare the same response in raw Node and in Express:

```js
// raw http
res.writeHead(201, { "Content-Type": "application/json" });
res.end(JSON.stringify({ id: 4, title: "Dune" }));

// Express
res.status(201).json({ id: 4, title: "Dune" });
```

One rule never changes: **every request gets exactly one response**.

## Reading the request: params and query

A path segment that starts with a colon is a **route parameter**. Whatever is in that position of the URL ends up in `req.params`:

```js
const books = [
  { id: 1, title: "1984", author: "George Orwell" },
  { id: 2, title: "Dune", author: "Frank Herbert" },
];

app.get("/api/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const book = books.find((b) => b.id === id);
  if (!book) {
    return res.status(404).json({ error: `No book with id ${id}` });
  }
  res.json(book);
});
```

For `/api/books/2`, `req.params` is `{ id: "2" }`. Notice the quotes: params are **always strings**, so convert them with `Number()` before comparing. For `/api/books/abc`, `id` becomes `NaN` and the client gets "No book with id NaN". That's fine for now; in the validation lesson you'll reject such ids with a 400 instead.

The query string (everything after `?`) is already parsed into `req.query`. No more `new URL(req.url, ...)`:

```js
app.get("/api/books", (req, res) => {
  const author = req.query.author?.toLowerCase();
  const result = author
    ? books.filter((b) => b.author.toLowerCase().includes(author))
    : books;
  res.json(result);
});
```

`GET /api/books?author=orwell` returns only Orwell's book. The two routes don't clash: `/:id` must match exactly one extra segment, and `/api/books` has none. Other useful request properties are `req.method`, `req.path` and `req.get("user-agent")` for reading a header.

## Testing your routes

The browser is fine for `GET` requests. For everything else (and to see status codes), use `curl`, the VS Code **REST Client** extension, Thunder Client, Bruno or Postman.

```bash
curl -i http://localhost:3000/api/books/2
curl -i http://localhost:3000/api/books/99
```

`-i` prints the status line and headers before the body.

> **Tip:** In Windows PowerShell 5.1, `curl` is an alias for a different command. Type `curl.exe` to get the real curl.

## Common mistakes

- **Sending two responses.** Forgetting `return` before `res.status(404).json(...)` means the code continues and calls `res.json(book)` too. Node throws `Cannot set headers after they are sent to the client`.
- **Comparing a param to a number.** `"2" === 2` is `false`, so every lookup returns 404. Convert with `Number(req.params.id)`.
- **Copying Express 4 code blindly.** For example `app.get("*", ...)` now throws `Missing parameter name` because Express 5 requires wildcards to have a name. Check the version in `package.json` and the migration notes.
- **Not restarting.** Without `node --watch`, your changes don't take effect until you restart the server.

## In short

- `const app = express()`, register routes with `app.get/post/patch/delete(path, handler)`, start with `app.listen(PORT)`.
- `res.status(code).json(data)` replaces `writeHead` + `JSON.stringify` + `end`.
- `req.params` holds `:named` URL segments, `req.query` holds the query string. Both are strings.
- One request, one response: use `return` when you respond early.

### Exercises
- Create the `hello-express` project with `/` and `/api/time`. Visit an unknown URL and look at the default 404 page and its status code in DevTools.
- Add `GET /health` that returns `{ status: "ok", uptime: process.uptime() }`.
- Rebuild one route of the API you wrote with the `http` module in the Node module, in Express. Compare the number of lines.
- Add `GET /api/books` (an array of 5 books, with an optional `?author=` filter) and `GET /api/books/:id` (404 JSON for unknown ids). Test both with `curl -i`.

---lesson
id: ex-2
title: Routers and project structure
time: 1.5h
video: Express Router tutorial routes controllers folder structure
docs: Express routing guide | https://expressjs.com/en/guide/routing.html
docs: Express 5 API: Router | https://expressjs.com/en/5x/api.html#router
---
With three routes, one `server.js` is fine. With thirty, it becomes a long file where you scroll forever to find anything. Real Express apps split the code in two directions: **by resource** (books, users, orders) and **by responsibility** (URLs, request handling, data). This lesson shows a structure you'll use for every API in this course, including the Book Library project at the end of this section.

## express.Router: a mini app

`Router()` creates an object with the same `get`, `post`, `patch` and `delete` methods as `app`, but it isn't a server on its own. You **mount** it on the app under a path prefix:

```js
// routes/books.js
import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json([{ id: 1, title: "Dune" }]);
});

router.get("/:id", (req, res) => {
  res.json({ id: Number(req.params.id) });
});

export default router;
```

```js
// server.js
import express from "express";
import booksRouter from "./routes/books.js";

const app = express();
app.use("/api/books", booksRouter);
app.listen(3000);
```

`app.use("/api/books", booksRouter)` sends every request starting with `/api/books` to the router. Inside the router, paths are **relative** to that prefix: `router.get("/:id")` answers `GET /api/books/:id`. If you later want `/api/v2/books`, you change one line.

## Three layers: routes, controllers, data

A common way to organise an API is three layers, each with one job:

- **Routes** only connect a method + URL to a function. No logic.
- **Controllers** handle the request: read `req`, call the data layer, choose a status code and send the response.
- **Data access** (often called a *model* or *repository*) is the only code that knows where the data lives. Today it's an array; in the Databases module it will be PostgreSQL.

```
book-api/
  package.json
  server.js                 ← starts the server
  app.js                    ← creates and configures the app
  routes/books.js
  controllers/booksController.js
  data/books.js
```

The data layer:

```js
// data/books.js
const books = [
  { id: 1, title: "1984", author: "George Orwell", year: 1949 },
  { id: 2, title: "Dune", author: "Frank Herbert", year: 1965 },
];

export async function findAll() {
  return books;
}

export async function findById(id) {
  return books.find((b) => b.id === id) ?? null;
}
```

Why `async` when an array is instant? Because database calls are asynchronous. If the controllers already `await` these functions, you can replace this file with a database version later and **nothing else has to change**.

The controller:

```js
// controllers/booksController.js
import * as Books from "../data/books.js";

export async function listBooks(req, res) {
  const books = await Books.findAll();
  res.json(books);
}

export async function getBook(req, res) {
  const book = await Books.findById(Number(req.params.id));
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json(book);
}
```

`import * as Books` imports every export of the file as one object, so calls read nicely: `Books.findAll()`, `Books.findById(2)`.

The routes file is now tiny:

```js
// routes/books.js
import { Router } from "express";
import { listBooks, getBook } from "../controllers/booksController.js";

const router = Router();
router.get("/", listBooks);
router.get("/:id", getBook);

export default router;
```

## Separate app.js and server.js

Split "build the app" from "start the server":

```js
// app.js
import express from "express";
import booksRouter from "./routes/books.js";

const app = express();

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/books", booksRouter);

export default app;
```

```js
// server.js
import app from "./app.js";

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
```

It costs nothing now and pays off in the Testing module: tests import `app` and send fake requests to it without starting a real server on a port.

## Grouping routes for the same path

When several methods share a path, `router.route()` keeps them together. You'll use this once you add create, update and delete:

```js
router.route("/").get(listBooks).post(createBook);
router.route("/:id").get(getBook).patch(updateBook).delete(deleteBook);
```

It does the same as writing separate `router.get(...)` and `router.post(...)` lines; use whichever you find easier to read.

## Common mistakes

- **Repeating the prefix inside the router.** `router.get("/api/books/:id")` mounted at `/api/books` creates the URL `/api/books/api/books/:id`. Inside a router, start paths from `/`.
- **Calling the controller instead of passing it.** `router.get("/", listBooks())` runs the function once at startup and passes its result (a Promise) to Express. Pass the function itself: `listBooks`.
- **Mixing default and named imports.** If the file says `export default router`, import it without braces: `import booksRouter from "./routes/books.js"`. With braces you get `does not provide an export named 'router'`.
- **Letting layers leak.** The data layer should never touch `req` or `res`, and controllers should never touch the array directly. If they do, the database swap later will be painful.

## In short

- `Router()` groups related routes; mount it with `app.use("/prefix", router)`.
- Routes connect URLs to controllers; controllers handle requests; the data layer stores and finds data.
- Make data functions `async` from day one so they can become database calls later.
- `app.js` builds the app, `server.js` starts it.

### Exercises
- Move your `/api/books` routes from the previous lesson into `routes/books.js` and mount the router at `/api/books`. Check that all URLs still work.
- Split the logic into `controllers/booksController.js` and `data/books.js` (with `async` functions), so the routes file only contains wiring.
- Split the app into `app.js` and `server.js`, and add `GET /health`.
- Add a second resource: give each book an `authorId`, then create `/api/authors` with its own router, controller and data file. Add `GET /api/authors/:id/books` that returns that author's books.

---lesson
id: ex-3
title: Middleware
time: 1.5h
video: Web Dev Simplified Express middleware
docs: Using middleware | https://expressjs.com/en/guide/using-middleware.html
docs: Writing middleware | https://expressjs.com/en/guide/writing-middleware.html
---
Almost everything in Express is **middleware**: logging, parsing JSON bodies, serving files, checking whether someone is logged in, even your route handlers. Once you understand the middleware chain, Express stops being magic: it's just a list of functions that run one after another for each request.

## The middleware chain

A middleware is a function with three parameters: `(req, res, next)`. When a request arrives, Express runs the matching functions **in the order you registered them**. Each one can:

1. read or change `req` and `res` (for example, add `req.user`),
2. **end** the request by sending a response, or
3. call `next()` to hand the request to the next function in the list.

If a middleware does neither 2 nor 3, the request just hangs until the client gives up.

```js
import express from "express";

const app = express();

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send("Home");
});

app.listen(3000);
```

`app.use(fn)` without a path runs `fn` for every request. The logger prints a line and calls `next()`, so Express continues to the `/` route. A route handler is also middleware: one that ends the request and doesn't call `next`.

## Order matters

Express walks through the list from top to bottom and stops when something sends a response. If you register the logger **after** `app.get("/")`, requests to `/` never reach it, because the route handler already answered. That's why setup middleware (logging, body parsing, security) goes at the top of `app.js`, and "catch-all" handlers go at the bottom.

## Built-in middleware: express.json()

In the Node module you collected body chunks, joined them and called `JSON.parse`. In Express:

```js
app.use(express.json());

app.post("/api/echo", (req, res) => {
  res.status(201).json({ youSent: req.body });
});
```

`express.json()` checks the request's `Content-Type`. If it is `application/json`, it reads the body, parses it and puts the result in `req.body`. If the JSON is broken, it creates a 400 error for you. In Express 5, when no body was parsed (no middleware, or the client didn't send `Content-Type: application/json`), `req.body` is `undefined`.

To test it, save this in a file called `requests.http` and click "Send Request" (VS Code REST Client extension):

```http
POST http://localhost:3000/api/echo
Content-Type: application/json

{ "title": "Dune", "year": 1965 }
```

Other built-in middleware you'll meet: `express.urlencoded()` for HTML form submissions and `express.static()` for files (both in the next section).

## Writing your own: a request logger

```js
// middleware/logger.js
export function logger(req, res, next) {
  const start = performance.now();
  res.on("finish", () => {
    const ms = (performance.now() - start).toFixed(1);
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`);
  });
  next();
}
```

The trick is `res.on("finish")`: when the logger runs, the response hasn't been created yet, so there's no status code to print. The `finish` event fires after the response has been sent, when the status and the duration are known. `req.originalUrl` is the full URL, even inside a router (where `req.url` is shortened to the part after the prefix). The popular `morgan` package does the same job if you prefer a ready-made logger.

## Route-level middleware

Not every middleware should run everywhere. You can pass one or more middleware functions **before** the handler of a single route:

```js
// middleware/requireApiKey.js
export function requireApiKey(req, res, next) {
  const key = req.get("x-api-key");
  if (!key || key !== process.env.API_KEY) {
    return res.status(401).json({ error: "Missing or wrong API key" });
  }
  next();
}
```

```js
router.get("/", listBooks);                   // public
router.post("/", requireApiKey, createBook);  // protected
```

For a `POST /api/books`, Express runs `requireApiKey` first. Only if it calls `next()` does `createBook` run. Put `API_KEY=some-long-random-text` in a `.env` file and start the server with `node --watch --env-file=.env server.js`. To protect every route in a router at once, use `router.use(requireApiKey)` at the top of the router file.

## Passing data to later middleware

Because all functions in the chain share the same `req` and `res`, a middleware can leave information for the ones after it. A typical example: an auth middleware sets `req.user = user`, and the controller reads `req.user`. You'll do exactly this in the authentication lesson. For values meant only for the response, Express also offers `res.locals`, an empty object you can fill.

## Common mistakes

- **Forgetting `next()`.** The request hangs: the browser spinner keeps going and curl waits forever. Every middleware must either respond or call `next()`.
- **Responding and calling `next()`.** Then a later handler responds too and you get `Cannot set headers after they are sent`. Use `return res.status(...)...` to stop.
- **`req.body` is `undefined`.** Either `app.use(express.json())` is missing or registered after your routes, or the request has no `Content-Type: application/json` header.
- **Trusting a missing secret.** If `API_KEY` isn't set, `process.env.API_KEY` is `undefined`, and a naive `req.get("x-api-key") === process.env.API_KEY` lets requests *without* the header through (`undefined === undefined`). Always check the key exists.

## In short

- Middleware is `(req, res, next)`; it responds or calls `next()`.
- Middleware runs in registration order; setup at the top, catch-alls at the bottom.
- `express.json()` fills `req.body` for JSON requests.
- Put middleware before a handler (`router.post("/", check, handler)`) to apply it to one route only.

### Exercises
- Add a middleware that logs the method and URL. Then move it below one of your routes and observe which requests are no longer logged.
- Write the `logger` middleware that prints method, URL, status code and duration using `res.on("finish")`.
- Add `POST /api/echo` with `express.json()`. Send valid JSON, broken JSON, and JSON without the `Content-Type` header. Write down what you get back each time.
- Write `requireApiKey` (reading `API_KEY` from `.env`) and apply it only to the `POST`, `PATCH` and `DELETE` routes of your books router.

---lesson
id: ex-4
title: REST API design and CRUD
time: 2h
video: REST API explained crash course
docs: MDN: HTTP request methods | https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
docs: MDN: HTTP response status codes | https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
docs: Microsoft REST API design guide | https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design
---
An API is a contract between your server and whoever calls it: your own frontend, a mobile app, or another developer. **REST** is a set of conventions for that contract. If you follow them, people can guess how your API works before they read the documentation, and frontend code like `if (!res.ok)` works as expected. This lesson covers designing URLs, choosing methods and status codes, and implementing full **CRUD** (Create, Read, Update, Delete).

## Resources and URLs

In REST, your data is made of **resources** (books, users, orders). URLs name the resource with a plural noun, and the HTTP method says what to do with it:

| Method | URL | Meaning | Success status |
|---|---|---|---|
| GET | `/api/books` | List books | 200 |
| GET | `/api/books/:id` | Get one book | 200 |
| POST | `/api/books` | Create a book | 201 + the new book |
| PATCH | `/api/books/:id` | Change some fields | 200 + the updated book |
| PUT | `/api/books/:id` | Replace the whole book | 200 |
| DELETE | `/api/books/:id` | Delete a book | 204, no body |

Avoid verbs in URLs: `/api/getBooks` or `/api/books/delete/3` break the pattern. Related resources can be nested: `/api/authors/7/books`.

## Status codes that matter

- **200 OK**, **201 Created**, **204 No Content**: success.
- **400 Bad Request**: the data sent is invalid.
- **401 Unauthorized**: not logged in, or no valid credentials.
- **403 Forbidden**: logged in, but not allowed to do this.
- **404 Not Found**: the resource doesn't exist.
- **409 Conflict**: the request clashes with existing data, like a duplicate email.
- **500 Internal Server Error**: a bug or failure on your side.

Rule of thumb: 4xx means the client made a mistake, 5xx means you did. Pick one shape for errors and use it everywhere, for example `{ "error": "Book not found" }`.

## Implementing CRUD: the data layer

Add the write operations to `data/books.js`:

```js
// data/books.js
const books = [
  { id: 1, title: "1984", author: "George Orwell", year: 1949 },
  { id: 2, title: "Dune", author: "Frank Herbert", year: 1965 },
];
let nextId = 3;

export async function create(data) {
  const book = { ...data, id: nextId++ };
  books.push(book);
  return book;
}

export async function update(id, changes) {
  const book = books.find((b) => b.id === id);
  if (!book) return null;
  Object.assign(book, changes, { id }); // never let the body change the id
  return book;
}

export async function remove(id) {
  const index = books.findIndex((b) => b.id === id);
  if (index === -1) return false;
  books.splice(index, 1);
  return true;
}
```

Notice `{ ...data, id: nextId++ }`: the `id` comes **after** the spread, so a client sending `"id": 1` can't overwrite it.

## Implementing CRUD: the controllers

```js
// controllers/booksController.js (continued)
export async function createBook(req, res) {
  const { title, author, year } = req.body ?? {};
  if (!title || !author) {
    return res.status(400).json({ error: "title and author are required" });
  }
  const book = await Books.create({ title, author, year });
  res.status(201).location(`/api/books/${book.id}`).json(book);
}

export async function updateBook(req, res) {
  const book = await Books.update(Number(req.params.id), req.body ?? {});
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json(book);
}

export async function deleteBook(req, res) {
  const deleted = await Books.remove(Number(req.params.id));
  if (!deleted) return res.status(404).json({ error: "Book not found" });
  res.status(204).end();
}
```

- `req.body ?? {}` avoids a crash when there is no body.
- `createBook` picks only the fields it knows. That's a first, simple defence; in the validation lesson you'll replace these hand-written checks with Zod.
- `res.location(...)` sets the `Location` header, telling the client where the new resource lives.
- 204 means "no content", so you call `res.end()` instead of sending JSON.

## Search, filters and pagination

Lists grow. Let clients ask for a slice with query parameters like `GET /api/books?search=dune&page=2&limit=10`. The controller reads and cleans the parameters; the data layer does the filtering (later, this becomes a SQL `WHERE ... LIMIT ... OFFSET`):

```js
// controller
export async function listBooks(req, res) {
  const search = String(req.query.search ?? "").toLowerCase();
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));

  const { data, total } = await Books.findAll({ search, page, limit });
  res.json({ data, page, limit, total });
}

// data/books.js
export async function findAll({ search = "", page = 1, limit = 10 } = {}) {
  const matches = books.filter((b) =>
    `${b.title} ${b.author}`.toLowerCase().includes(search)
  );
  const start = (page - 1) * limit;
  return { data: matches.slice(start, start + limit), total: matches.length };
}
```

`Number("abc")` is `NaN`, and `NaN || 1` gives the default. `Math.max(1, ...)` stops `?limit=-5` or `?page=0`, and `Math.min(50, ...)` stops someone from requesting a million rows. Returning `total` lets the frontend show "page 2 of 5".

## Testing every endpoint

Keep a `requests.http` file in your project with one request per endpoint, separated by `###`, including the error cases:

```http
@base = http://localhost:3000/api/books

GET {{base}}?search=dune&page=1&limit=5

###
POST {{base}}
Content-Type: application/json

{ "title": "Neuromancer", "author": "William Gibson", "year": 1984 }

###
DELETE {{base}}/999
```

It doubles as documentation, and you can re-run everything after each change.

## Common mistakes

- **Returning 200 for errors**, for example `res.json({ error: "Not found" })`. The frontend's `res.ok` is then `true` and the error slips through. Always set the status.
- **Verbs in URLs** like `/api/createBook`. Use the method as the verb.
- **Letting the body overwrite server fields.** `{ id: nextId++, ...req.body }` lets a client choose the id. Put server-controlled fields last, or pick fields explicitly.
- **Inconsistent response shapes.** If the list endpoint returns `{ data, total }`, don't return a bare array from a similar endpoint.

## In short

- URLs are plural nouns; HTTP methods are the verbs.
- Use specific status codes: 201 for create, 204 for delete, 400/404/409 for client errors.
- Keep one error shape, like `{ error: "..." }`.
- Lists support `?search=`, `?page=` and `?limit=`, and return `{ data, page, limit, total }`.

### Exercises
- Before coding, write the endpoint table (method, URL, status codes) for a `movies` resource in a README.
- Implement full CRUD for `/api/books` in memory, using your routes / controllers / data structure.
- Add `?search=` (title or author) and pagination, returning `{ data, page, limit, total }`. Check what happens with `?page=abc` and `?limit=1000`.
- Write a `requests.http` file covering every endpoint, including at least one 400 and one 404 case.

---lesson
id: ex-6
title: Error handling
time: 1h
video: Express error handling middleware tutorial
docs: Express error handling | https://expressjs.com/en/guide/error-handling.html
---
So far, every controller checks for problems and sends its own error response. That's repetitive, and it's easy to end up with `{ error: ... }` in one place and `{ message: ... }` in another. Worse: what happens when something *unexpected* throws, like a bug or a file that can't be read? Express has one central place for all of this: **error-handling middleware**.

## What Express does by default

If a handler throws, Express catches the error and responds with status 500 and an HTML error page (including the stack trace while you're developing). In **Express 5** this also works for `async` handlers: if the returned promise rejects, for example because something you `await`ed threw, Express forwards the error automatically.

```js
app.get("/boom", async (req, res) => {
  await new Promise((r) => setTimeout(r, 100));
  throw new Error("Something broke");
});
```

In Express 4, this request would hang and Node would log an "unhandled rejection". That's why older tutorials wrap every handler in `try/catch` or install `express-async-errors`. With Express 5 you don't need either. But an HTML page with a stack trace isn't what a JSON API should return, so let's replace it.

## Error-handling middleware

An error handler is middleware with **four** parameters:

```js
// middleware/errorHandler.js
export function errorHandler(err, req, res, next) {
  const status = err.status ?? 500;
  if (status >= 500) console.error(err);

  res.status(status).json({
    error: status >= 500 ? "Something went wrong on our side" : err.message,
  });
}
```

- Express recognises an error handler **by its four parameters**. Keep `next` in the list even though you don't use it.
- It runs when a handler throws, when an async handler rejects, or when someone calls `next(err)`.
- For 5xx errors, the full error is logged on the server, but the client only gets a generic message. Internal details (file paths, database messages) are useful to attackers, not to users.

When do you need `next(err)` instead of `throw`? Inside callbacks that Express doesn't control, such as `setTimeout` or a callback-style library. A `throw` there escapes Express completely and can crash the process; `next(err)` hands the error over properly.

## A 404 handler for unknown routes

When no route matches, Express falls through to its default "Cannot GET" page. Replace it with a middleware at the end of the chain:

```js
// middleware/notFound.js
export function notFound(req, res) {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
}
```

The order in `app.js` is now important:

```js
app.use(express.json());
app.use(logger);

app.use("/api/books", booksRouter);

app.use(notFound);      // no route matched
app.use(errorHandler);  // something threw
```

`notFound` is a normal middleware: it only runs if nothing above answered. `errorHandler` goes last, after all routes.

## A custom error class

Built-in `Error` objects have no status code. A small class fixes that:

```js
// utils/AppError.js
export class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = "AppError";
    this.status = status;
  }
}
```

Now controllers can simply throw:

```js
import { AppError } from "../utils/AppError.js";

export async function getBook(req, res) {
  const book = await Books.findById(Number(req.params.id));
  if (!book) throw new AppError("Book not found", 404);
  res.json(book);
}
```

No `return res.status(404).json(...)` and no chance of a second response: `throw` stops the function, and the error handler builds a consistent response. A data layer function can throw `AppError` too, for example a 409 for a duplicate.

## Errors from express.json()

When a client sends broken JSON, `express.json()` creates an error with `status: 400` and `type: "entity.parse.failed"`. Your handler already uses `err.status`, so the client gets a 400. The default message is a technical parser message, so you might want something friendlier:

```js
if (err.type === "entity.parse.failed") {
  return res.status(400).json({ error: "Request body is not valid JSON" });
}
```

## Development vs production

While developing, the stack trace in the response is handy. In production it must never be sent. Use the `NODE_ENV` environment variable, which hosts set to `production`:

```js
const isDev = process.env.NODE_ENV !== "production";

res.status(status).json({
  error: status >= 500 ? "Something went wrong on our side" : err.message,
  ...(isDev && { stack: err.stack }),
});
```

`...(isDev && { stack })` adds the `stack` property only when `isDev` is true (spreading `false` adds nothing).

## Common mistakes

- **Three parameters instead of four.** `(err, req, res)` looks like a normal middleware to Express, so it's never called for errors.
- **Registering the error handler before the routes.** Errors only travel forward through the chain, so a handler at the top never sees them.
- **Swallowing errors.** A `catch` block that only does `console.log(err)` and doesn't respond leaves the request hanging. Either respond or rethrow.
- **Sending `err.message` for 500 errors.** It can reveal internals, like a SQL query or a file path. Log it; send a generic message.

## In short

- Error handlers have four parameters, `(err, req, res, next)`, and are registered last.
- In Express 5, `throw` in sync and async handlers reaches the error handler; use `next(err)` inside callbacks.
- Put a `notFound` middleware just before the error handler.
- `AppError` carries a status code, so controllers just `throw new AppError("...", 404)`.

### Exercises
- Add a route that throws synchronously and an `async` route that awaits something and then throws. Look at Express's default response for both, then add your `errorHandler` and compare.
- Add `notFound` and `errorHandler` to your books API. Test an unknown URL and a POST with broken JSON.
- Create `AppError` and replace every inline 404 response in your books controllers with `throw new AppError("Book not found", 404)`.
- Make the error response include `stack` only when `NODE_ENV` isn't `production`. Test both ways (in PowerShell: `$env:NODE_ENV="production"; npm start`).

---lesson
id: ex-7
title: Validation
time: 1.5h
video: Zod validation Express tutorial
docs: Zod docs | https://zod.dev
docs: Zod: basic usage | https://zod.dev/basics
---
Anyone can send anything to your API, not only your own frontend. A buggy client, a curious user with curl, or an attacker might send `"year": "banana"`, a 50,000-character title, missing fields, or extra fields like `"isAdmin": true`. **Never trust client input.** Validate it at the edge of your app, before it reaches the controllers, so the rest of your code can trust the data it receives.

## Hand-written checks don't scale

```js
const { title, year } = req.body ?? {};
if (typeof title !== "string" || title.trim() === "") { /* 400 */ }
if (!Number.isInteger(year) || year < 0 || year > new Date().getFullYear()) { /* 400 */ }
// ...and the same again for every field, on every route
```

It's long, easy to get wrong and easy to forget on one route. A schema library lets you **describe the shape once** and check any data against it. The most popular one is **Zod**.

## Defining a schema with Zod

```bash
npm install zod
```

```js
// schemas/book.js
import { z } from "zod";

export const BookSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  author: z.string().trim().min(1, "Author is required"),
  year: z.number().int().min(0).max(new Date().getFullYear()),
  tags: z.array(z.string()).optional(),
});

export const BookUpdateSchema = BookSchema.partial();
```

Each field describes its type and rules. The second argument of `min(1, "...")` is the error message. `.optional()` allows the field to be missing. `BookSchema.partial()` creates a copy where **every** field is optional: exactly what a `PATCH` needs.

## Checking data: safeParse

```js
import { BookSchema } from "./schemas/book.js";

const result = BookSchema.safeParse({ title: "", author: "Frank Herbert", year: "1965" });

if (!result.success) {
  for (const issue of result.error.issues) {
    console.log(issue.path.join("."), "→", issue.message);
  }
} else {
  console.log(result.data);
}
```

```
title → Title is required
year → Invalid input: expected number, received string
```

- `safeParse` never throws. It returns `{ success: true, data }` or `{ success: false, error }`.
- `error.issues` is an array with one entry per problem, each with a `path` (which field) and a `message`.
- `result.data` is a **clean copy**: strings are trimmed and unknown keys are removed (by default `z.object` strips them). So `"isAdmin": true` simply disappears. Always continue with `result.data`, not the original input.

There is also `schema.parse(data)`, which returns the data or **throws** a `ZodError`.

## A reusable validate middleware

Rather than calling `safeParse` in every controller, write a function that *creates* a middleware for any schema:

```js
// middleware/validate.js
export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: "Invalid request body",
        details: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }
    req.body = result.data; // continue with the cleaned data
    next();
  };
}
```

```js
// routes/books.js
router.post("/", validate(BookSchema), createBook);
router.patch("/:id", validate(BookUpdateSchema), updateBook);
```

`validate(BookSchema)` runs once at startup and returns the real middleware. By the time `createBook` runs, `req.body` is guaranteed to match the schema, so all the manual `if` checks in the controller can go.

## Validating query parameters

Query values are always strings, so `z.number()` would always fail. `z.coerce.number()` converts the input with `Number()` first:

```js
export const ListQuerySchema = z.object({
  search: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});
```

`.default(1)` is used when the parameter is missing. One Express 5 detail: `req.query` is read-only, so `req.query = result.data` throws a `TypeError`. The simplest approach is to parse inside the controller:

```js
export async function listBooks(req, res) {
  const { search, page, limit } = ListQuerySchema.parse(req.query);
  const { data, total } = await Books.findAll({ search, page, limit });
  res.json({ data, page, limit, total });
}
```

`parse` throws a `ZodError` when the query is invalid. Without extra work, your error handler would turn it into a 500. Teach it to recognise Zod errors:

```js
// middleware/errorHandler.js
import { z } from "zod";

export function errorHandler(err, req, res, next) {
  if (err instanceof z.ZodError) {
    return res.status(400).json({
      error: "Invalid request",
      details: err.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
    });
  }
  // ...the rest of your handler
}
```

## Validating route params

`/api/books/abc` still turns into `Number("abc")`, which is `NaN`. Validate `:id` with a small schema too:

```js
// schemas/book.js
export const IdParamSchema = z.coerce.number().int().positive();
```

```js
// controllers/booksController.js
export async function getBook(req, res) {
  const id = IdParamSchema.parse(req.params.id);
  const book = await Books.findById(id);
  if (!book) throw new AppError("Book not found", 404);
  res.json(book);
}
```

Use it the same way in every `:id` route (get, update, delete). `abc`, `1.5`, `0` and `-3` now give a 400 through your error handler, and only real ids reach the data layer. This matters later: PostgreSQL rejects `NaN` for an integer column with error `22P02`, which would otherwise become a 500.

## Common mistakes

- **Using the original input after validating.** If you call `safeParse` in a controller, continue with `result.data`, otherwise trimming and stripping unknown keys are lost.
- **`z.number()` for query or path values.** They're strings; use `z.coerce.number()`.
- **Assigning to `req.query`.** It's read-only in Express 5. Parse into a variable instead.
- **Validating only on the frontend.** The HTML `required` attribute improves the user experience, but anyone can skip your form and call the API directly. The server is where validation protects you.

## In short

- Describe the expected shape once with a Zod schema; `.partial()` makes a version for `PATCH`.
- `safeParse` returns `{ success, data | error }`; `error.issues` lists each problem.
- A `validate(schema)` middleware returns 400 with field-level details and replaces `req.body` with clean data.
- Use `z.coerce` for query strings and `:id` params, and turn `ZodError` into a 400 in the error handler.

### Exercises
- Define `BookSchema` (title: non-empty string, author, year: integer from 0 to the current year, tags: optional string array). In a scratch file, run `safeParse` on three valid and three invalid objects and print the issues.
- Write the `validate(schema)` middleware and use it on POST and PATCH. Send invalid data and check you get a readable 400 response.
- Add `ListQuerySchema` for `search`, `page` and `limit`. Check that `?page=-1` and `?limit=1000` return 400 and that missing values fall back to the defaults.
- Extend your error handler so a thrown `ZodError` becomes a 400 with the list of fields.

---project
id: ex-p1
title: Book Library REST API
summary: A complete in-memory CRUD API with routers, validation, central error handling, search and pagination.
---
### The task
Build the backend for a small online library catalogue. It's your first professional-shaped API: organised folders, validation, correct status codes and central error handling. The data lives in memory for now. In the Databases module you'll swap in PostgreSQL, and later modules add tests and TypeScript to this same project, so build it carefully and keep all data access in one file.

### What it must do
- A book looks like `{ id, title, author, year, genre, pages, read }`, where `read` is a boolean
- `GET /api/books`: list books. Supports `?search=` (title or author, case-insensitive), `?genre=`, `?read=true|false`, `?page=1&limit=10`. Responds with `{ data, page, limit, total }`
- `GET /api/books/:id`: one book, or 404
- `POST /api/books`: create a book; 201 with the new book; validated with Zod (400 with field details on failure)
- `PATCH /api/books/:id`: partial update, validated; 404 if the book doesn't exist
- `DELETE /api/books/:id`: 204; 404 if the book doesn't exist
- `GET /health` returns `{ status: "ok" }`
- Unknown routes return 404 JSON. All errors use `{ error: "..." }` (validation errors also include `details`)
- A logger middleware prints method, URL, status and duration for every request
- Folder structure: `app.js`, `server.js`, `routes/`, `controllers/`, `middleware/`, `schemas/`, `utils/`, `data/books.js`. Only `data/books.js` touches the array, and all its functions are `async`

### Steps
1. **Set up.** `npm init -y`, install Express, set `"type": "module"`, add `dev` (`node --watch server.js`) and `start` scripts. Create `app.js` (exports the app) and `server.js` (listens), plus `GET /health`. Open it in the browser.
2. **Read endpoints.** Create `data/books.js` with about 15 seeded books and async `findAll()` and `findById(id)`. Add `routes/books.js` and `controllers/booksController.js` for `GET /api/books` and `GET /api/books/:id`, and mount the router at `/api/books`. Start your `requests.http` file.
3. **Errors.** Add `utils/AppError.js`, `middleware/notFound.js` and `middleware/errorHandler.js`. Replace inline 404 responses with `throw new AppError("Book not found", 404)`. Test an unknown id, an unknown URL and an async error.
4. **Write endpoints.** Add `express.json()`, then `create`, `update` and `remove` in the data layer and the POST, PATCH and DELETE controllers. Add a request for each to `requests.http` and check every status code.
5. **Validation.** Create `schemas/book.js` with `BookSchema` and `BookUpdateSchema`, write `middleware/validate.js`, and use it on POST and PATCH. Make the error handler turn a `ZodError` into a 400. Add invalid requests to `requests.http`.
6. **Search, filters and pagination.** Add `ListQuerySchema` and parse `req.query` in the list controller. Change the data layer to `findAll({ search, genre, read, page, limit })` returning `{ data, total }`. Test combinations like `?search=the&read=false&page=2&limit=3`.
7. **Logging.** Write `middleware/logger.js` with `res.on("finish")` and register it near the top of `app.js`.
8. **Document and publish.** Write a README with setup steps and a table of endpoints (method, URL, body, possible status codes) plus one example request and response. Commit `requests.http` and push to GitHub.

### Hints
- Middleware order in `app.js`: `express.json()` and `logger` first, then routers, then `notFound`, then `errorHandler`.
- Query values are strings. For `?read=`, avoid `z.coerce.boolean()`: it turns the string `"false"` into `true` (any non-empty string is truthy). Use `z.enum(["true", "false"])` and compare, or Zod's `z.stringbool()`.
- New ids: keep a `nextId` counter, or use the highest existing id + 1. Never `books.length + 1`: ids repeat after a delete.
- Put server-controlled fields last when creating: `{ ...data, id: nextId++ }`.
- A quick check of your structure: could you replace `data/books.js` with a database version without editing any other file? If not, something is leaking between layers.

### Stretch goals
- Sorting with `?sort=year&order=desc`, validated with `z.enum`
- Protect the write routes with your `requireApiKey` middleware
- Save the books to a `books.json` file with `fs`, loading it at startup and saving after each change (only inside `data/books.js`)
- After the deployment lesson in the next section, deploy the API and add the live URL to the README
- An API documentation page with Swagger / OpenAPI

### Done when
- All endpoints return the right data and status codes (200, 201, 204, 400, 404)
- Invalid bodies and query parameters get a 400 with field-level details; unknown ids and routes get 404 JSON
- Search, the genre and read filters, and pagination work together, and the response includes `total`
- Only `data/books.js` touches the books array, and all its functions are async
- Every request is logged with method, URL, status and duration
- The repo is on GitHub with a README endpoint table and a `requests.http` file

---section
id: express-s2
title: Build a full-stack Express app
intro: Serve a frontend from the same Express app, render HTML on the server with templates, and put your app online. You'll finish by building and deploying your own URL shortener.
---

---lesson
id: ex-5
title: Serving static files and templates
time: 1h
video: Express static files and EJS templates tutorial
docs: Serving static files | https://expressjs.com/en/starter/static-files.html
docs: Using template engines with Express | https://expressjs.com/en/guide/using-template-engines.html
docs: EJS | https://ejs.co/
---
An API on its own has no face: people need pages to click on. Express can give them pages in two ways. It can send **static files** (HTML, CSS, JavaScript) and let the browser fetch JSON from your API, or it can build the HTML **on the server** with a template engine. In the Node module you wrote a static file server by hand: reading files, setting MIME types, blocking `../` paths. In Express it's one line.

## express.static

```js
import express from "express";
import path from "node:path";

const app = express();

app.use(express.static(path.join(import.meta.dirname, "public")));

app.listen(3000);
```

Every file in the `public` folder is now available by its path, without the word `public`:

- `public/index.html` → `http://localhost:3000/` (an `index.html` is served for the folder itself)
- `public/style.css` → `/style.css`
- `public/js/app.js` → `/js/app.js`

`express.static` sets the right `Content-Type`, adds caching headers, and refuses paths that try to escape the folder. If no file matches, it calls `next()` and your other routes get a chance. Build the path with `import.meta.dirname` (as in the Node module), because a plain `"public"` is resolved from the folder you started the terminal in.

## A frontend and an API in one app

Put your API routes and the static folder in the same app:

```html
<!-- public/index.html -->
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Books</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <h1>Books</h1>
  <ul id="list"></ul>
  <script type="module" src="/app.js"></script>
</body>
</html>
```

```js
// public/app.js
const res = await fetch("/api/books");
const { data } = await res.json();

const list = document.querySelector("#list");
for (const book of data) {
  const li = document.createElement("li");
  li.textContent = `${book.title} by ${book.author}`;
  list.append(li);
}
```

Because the page and the API come from the **same origin**, `fetch("/api/books")` needs no full URL and no CORS setup. `textContent` (instead of `innerHTML`) makes sure a book title containing `<script>` is shown as text, not run as code. This is also how you'll serve a React app later: its build is just static files.

## Server-side rendering with EJS

A **template engine** fills an HTML file with data on the server, so the browser receives a finished page. EJS uses normal HTML with small JavaScript tags.

```bash
npm install ejs
```

```js
app.set("view engine", "ejs");
app.set("views", path.join(import.meta.dirname, "views"));

const books = [
  { title: "1984", year: 1949 },
  { title: "Dune", year: 1965 },
];

app.get("/books", (req, res) => {
  res.render("books", { title: "All books", books });
});
```

```html
<!-- views/books.ejs -->
<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title><%= title %></title></head>
<body>
  <h1><%= title %></h1>
  <% if (books.length === 0) { %>
    <p>No books yet.</p>
  <% } else { %>
    <ul>
      <% for (const book of books) { %>
        <li><%= book.title %> (<%= book.year %>)</li>
      <% } %>
    </ul>
  <% } %>
</body>
</html>
```

`res.render("books", data)` finds `views/books.ejs`, runs it with `data`, and sends the resulting HTML. The three tags:

- `<%= value %>` outputs a value, **escaped** (`<` becomes `&lt;`), so it's safe for user data.
- `<% code %>` runs JavaScript (loops, ifs) without outputting anything.
- `<%- value %>` outputs **raw, unescaped** HTML. Use it only for trusted content, typically `<%- include("partials/header") %>` to reuse a piece of a page.

## Handling HTML forms

A plain HTML form sends its data as `application/x-www-form-urlencoded` (like `title=Dune&author=Frank+Herbert`), not JSON. `express.urlencoded()` parses it into `req.body`:

```html
<form method="post" action="/books">
  <input name="title" required>
  <input name="year" type="number">
  <button>Add book</button>
</form>
```

```js
app.use(express.urlencoded({ extended: false }));

app.post("/books", (req, res) => {
  books.push({ title: req.body.title, year: Number(req.body.year) });
  res.redirect("/books");
});
```

After a successful form POST, **redirect** instead of rendering. This pattern is called Post/Redirect/Get: if the user refreshes the page, the browser repeats the harmless GET, not the POST (no "resubmit form?" warning, no duplicate book). Form values are all strings, so validate them with Zod just like JSON bodies.

## Which approach when?

- **Static files + fetch**: interactive pages that update without reloading. This is the model for React apps, which you'll build later.
- **Templates**: simple pages, admin screens or content sites. They work without JavaScript and the HTML arrives complete, which is good for search engines.

Next.js, at the end of the course, combines both ideas.

## Common mistakes

- **A relative static path.** `express.static("public")` breaks when you start the server from another folder. Use `path.join(import.meta.dirname, "public")`.
- **`<%-` with user data.** It skips escaping, so a malicious title can inject a script (an XSS attack). Use `<%=`.
- **Route order.** If you register `app.get("/")` before `express.static`, your route wins and `index.html` is never served for `/`. Whatever is registered first answers.
- **`req.body` is `undefined` on form posts.** You forgot `app.use(express.urlencoded(...))`; `express.json()` doesn't parse forms.

## In short

- `app.use(express.static(path.join(import.meta.dirname, "public")))` serves a whole frontend.
- A same-origin frontend calls the API with `fetch("/api/...")`, no CORS needed.
- EJS: `res.render("view", data)`, `<%= %>` escapes, `<%- %>` doesn't.
- Forms need `express.urlencoded()`; redirect after a successful POST.

### Exercises
- Serve a `public/` folder with `index.html`, `style.css` and `app.js` that lists books from your API using `fetch`.
- Create an EJS page `/books` that renders the same list on the server. Move the header into `views/partials/header.ejs` and include it on two pages.
- Add a form to the EJS page that creates a book with Post/Redirect/Get. If validation fails, render the form again with status 400 and the error messages.
- Write two or three sentences: for which kind of page would you choose each approach, and why?

---lesson
id: ex-10
title: Deploying an Express app
time: 1.5h
video: deploy Node Express app to Render free
docs: Render: deploy Express | https://render.com/docs/deploy-node-express-app
docs: Render: free instances | https://render.com/docs/free
docs: Express: production best practices | https://expressjs.com/en/advanced/best-practice-performance.html
---
An app on `localhost` is something only you can see. Deployed, it's a link you can put in your CV, open on your phone and send to a friend. Free hosting platforms make this simple: you connect a GitHub repository, and the host installs your dependencies, runs your start script and gives you a public HTTPS URL. Your job is to make the app ready for that.

## What a host needs from your app

1. **A start script.** The host runs `npm start`, so `package.json` needs `"start": "node server.js"`.
2. **The port from the environment.** The host decides the port and passes it in `process.env.PORT`.
3. **Configuration from environment variables**, never hard-coded secrets.
4. **A committed `package-lock.json`**, so the host installs exactly the versions you tested. `node_modules` and `.env` stay out of git.
5. **The Node version** in `engines`, so the host doesn't pick an old one.

```json
{
  "name": "url-shortener",
  "type": "module",
  "engines": { "node": ">=22" },
  "scripts": {
    "dev": "node --watch --env-file=.env server.js",
    "start": "node server.js"
  }
}
```

```js
// server.js
import app from "./app.js";

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
```

Notice that `--env-file=.env` is only in the `dev` script. In production there is no `.env` file (you never commit it), and Node stops with an error if the file given to `--env-file` doesn't exist. On the host, you type the variables into its dashboard instead, and they appear in `process.env` the same way.

## Production settings

- **`NODE_ENV=production`.** Set this variable on the host. Express then caches templates and hides stack traces in its default error page, and your own error handler can check it too.
- **`trust proxy`.** Hosts put your app behind a *proxy* that handles HTTPS. Your app receives plain HTTP requests from that proxy, so without extra configuration `req.protocol` says `"http"` and `req.ip` is the proxy's address, not the visitor's. `app.set("trust proxy", 1)` tells Express to trust the `X-Forwarded-*` headers from one proxy. You'll need this for secure cookies and rate limiting in the next section, and for building correct `https://` links.
- **A health check route** like `GET /health`. The host (and you) can call it to see whether the app is up.

## Deploying to Render, step by step

1. Push your project to GitHub.
2. In the Render dashboard, create a new **Web Service** and connect your repository.
3. Choose the Node runtime. Build command: `npm install` (or `npm ci`). Start command: `npm start`. Instance type: Free.
4. Add environment variables: `NODE_ENV=production` plus any secrets your app reads.
5. Deploy and watch the logs. When it says your service is live, you get a URL like `https://your-app.onrender.com`.
6. From now on, every push to your main branch redeploys automatically.

Dashboards change their wording from time to time, but the ideas are the same on Railway, Fly.io or Koyeb: connect a repo, set build and start commands, set environment variables, read the logs.

Test the live app from your machine:

```bash
curl -i https://your-app.onrender.com/health
```

In your `requests.http` file, replace the base URL variable (`@base = ...`) to run all your saved requests against the live app.

## Free-tier facts you should know

- **The app sleeps** after a period without traffic (about 15 minutes on Render). The next request wakes it up, which can take up to a minute. That's fine for a portfolio project.
- **The file system is temporary.** Anything your app writes to disk (like a `links.json` file) and everything in memory is lost when the app restarts or redeploys. That's normal: the Databases module moves your data into a hosted database that survives restarts.

## Common mistakes

Most deployment problems are visible in the host's logs. Read them first.

| Symptom | Likely cause |
|---|---|
| The deploy never finishes; the host says no open port was detected | The port is hard-coded instead of `process.env.PORT` |
| `Cannot find package 'express'` on the host | The package was installed with `-D`, or not saved in `package.json` |
| Works on your laptop, `ERR_MODULE_NOT_FOUND` on the host | Letter case: `./Routes/books.js` vs `routes/books.js`. Windows and macOS ignore case; Linux servers don't |
| A config value is `undefined` | The environment variable wasn't added in the host's dashboard |
| The page loads but CSS and JS return 404 | The static folder path is relative instead of using `import.meta.dirname` |

## In short

- Need: `start` script, `process.env.PORT`, env vars for config, committed lock file, `engines`.
- Use `--env-file` only for local development; set variables in the host's dashboard.
- Set `NODE_ENV=production` and `app.set("trust proxy", 1)` on the host.
- Free tiers sleep and forget files; when something breaks, read the logs.

### Exercises
- Make your Book Library API deploy-ready: `start` script, `process.env.PORT`, `engines`, `.gitignore`. Check locally that it uses a different port when you set one (PowerShell: `$env:PORT=4000; npm start`).
- Deploy it to Render and run every request in your `requests.http` file against the live URL.
- Break it on purpose: change the letter case of one import path, push, find the error in the logs, then fix it.
- Add the live URL to the README, and a "Deployment" section listing the environment variables the app needs.

---project
id: ex-p3
title: URL Shortener
summary: Your own mini Bitly: shorten links, redirect visitors and count clicks, served from one Express app and deployed online.
---
### The task
Build your own mini Bitly: paste a long URL, get a short link like `your-app.onrender.com/x7Kq2a`, and see how many times it has been clicked. It combines a JSON API, a static frontend served by the same Express app, redirects, and your first real deployment.

### What it must do
- `POST /api/links` with `{ url }`: checks that it's a valid `http` or `https` URL (400 otherwise) and responds 201 with `{ code, url, shortUrl }`
- `GET /api/links`: all links with their click counts, newest first
- `GET /api/links/:code/stats`: `{ code, url, clicks, createdAt, lastClickedAt }`, or 404 JSON
- `GET /:code`: redirects (302) to the original URL, increases its click count and sets `lastClickedAt`. An unknown code shows a friendly HTML 404 page with status 404
- Codes are 6 random URL-safe characters and always unique
- The page at `/` is served with `express.static` from `public/`: a form to shorten a URL, the result with a copy button, and a list of links with click counts
- Links are saved to `links.json` by the data layer, so they survive a local restart
- The app is deployed and the README contains the live URL

### Steps
1. **Set up.** Create the project with the same structure as the Book Library (`app.js`, `server.js`, `express.json()`, `notFound`, `errorHandler`, `AppError`). Create `data/links.js` with a `Map` (code → link) and async `create`, `findByCode`, `findAll` and `recordClick` functions.
2. **Codes.** Write `generateCode()` in `utils/` that picks 6 random characters from `A–Z`, `a–z` and `0–9` using `crypto.randomInt` from `node:crypto`. In `create`, generate again if the code already exists. Log ten codes to check.
3. **Create links.** Add `POST /api/links` with a Zod schema for the URL (see Hints) and the `validate` middleware. Build `shortUrl` from a `BASE_URL` environment variable, falling back to `req.protocol` + `://` + `req.get("host")`. Test valid, invalid and `javascript:` URLs in `requests.http`.
4. **Redirect.** Add `GET /:code` that finds the link, calls `recordClick`, and `res.redirect(link.url)`. For unknown codes, send `public/404.html` with `res.status(404).sendFile(...)`. Test in the browser.
5. **Stats and list.** Add `GET /api/links/:code/stats` and `GET /api/links`.
6. **Frontend.** Create `public/index.html`, `style.css` and `app.js`: the form POSTs with `fetch`, shows the short link with a Copy button (`navigator.clipboard.writeText`), and refreshes the list of links with their click counts.
7. **Persistence.** Make `data/links.js` load `links.json` at startup and save it after every change (using `fs` from the Node module). Restart the server and check that links and counts are still there.
8. **Deploy.** Go through the deploy-ready checklist, add `app.set("trust proxy", 1)`, deploy to Render, set `NODE_ENV` (and `BASE_URL` if you use it). Shorten a link on the live site and open the short link on your phone.

### Hints
- Route order in `app.js`: `express.static`, then the `/api` routers, then `GET /:code`, then `notFound` and `errorHandler`. `/:code` matches any single segment, so it must come after everything more specific.
- `z.url()` accepts any scheme, including `javascript:alert(1)`. Restrict it: `z.url({ protocol: /^https?$/ })`. Or write a small helper with `new URL(value)` inside `try/catch` and check that `protocol` is `"http:"` or `"https:"`.
- Use 302 redirects (the default). Browsers cache 301 redirects aggressively, so clicks stop reaching your server and stop being counted.
- `res.sendFile` needs an absolute path: `path.join(import.meta.dirname, "public", "404.html")`.
- A `Map` can't be passed directly to `JSON.stringify`. Save `[...links.values()]` and rebuild the `Map` from the array when loading.
- On Render, `links.json` is reset on every deploy and restart. That's expected; the Databases module fixes it.
- `navigator.clipboard` only works on `https://` pages or `localhost`.

### Stretch goals
- Custom aliases like `/my-cv`: letters, numbers and dashes only, not already taken, and not a reserved word like `api`
- A QR code for each link (the `qrcode` package)
- An expiry date per link; expired links show a page with status 410 Gone
- A server-rendered stats page at `/stats/:code` using EJS
- Rate-limit link creation (after the security lesson in the next section)

### Done when
- Shortening a valid URL returns a 6-character code, and invalid or non-http(s) URLs get a 400
- Visiting `/:code` redirects to the original URL and the click count goes up; unknown codes show a 404 page
- The stats endpoint returns clicks, `createdAt` and `lastClickedAt`
- The page at `/` shortens links, copies them, and lists all links with their click counts
- Links and counts survive a local server restart
- The app is deployed and the README contains the live URL

---section
id: express-s3
title: Authentication and security
intro: Let people create accounts and log in, keep each user's data private, and add the security defaults every public Express app needs. You'll finish by building a private journal app.
---

---lesson
id: ex-8
title: Authentication: passwords, sessions and JWT
time: 3h
video: Web Dev Simplified JWT authentication Node
docs: OWASP Authentication Cheat Sheet | https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
docs: OWASP Password Storage Cheat Sheet | https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
docs: express-session | https://github.com/expressjs/session
---
Most real apps have users, and users have private data. Two questions come up on every request: **authentication** ("who are you?") and **authorization** ("are you allowed to do this?"). Mistakes here leak passwords and private data, so you don't invent anything yourself: you use well-tested libraries and follow a few strict rules.

## Never store passwords, store hashes

A **hash function** turns a password into a fixed-length string, and it can't be reversed. You store only the hash. At login, you hash the attempt and compare. If your database leaks, attackers get hashes, not passwords.

Not every hash is good for passwords. General hashes like SHA-256 are designed to be *fast*, which lets attackers try billions of guesses per second. **bcrypt** is slow on purpose and adds a random **salt** to each password, so two users with the same password get different hashes.

```bash
npm install bcrypt
```

```js
import bcrypt from "bcrypt";

const hash = await bcrypt.hash("correct horse battery staple", 12);
console.log(hash); // $2b$12$... (60 characters, different every run)

console.log(await bcrypt.compare("correct horse battery staple", hash)); // true
console.log(await bcrypt.compare("wrong password", hash));               // false
```

`12` is the **cost factor**: each step up doubles the work. If installing `bcrypt` fails on your machine, `bcryptjs` is a pure-JavaScript package with the same `hash` and `compare` functions. bcrypt only looks at the first 72 bytes of a password, so limit passwords to 72 characters in your schema.

## Register and login

Users live in a data layer like your books: `data/users.js` with `findByEmail(email)` and `create({ email, passwordHash })`. The bodies are validated with Zod first (`email: z.email()`, `password: z.string().min(8).max(72)`).

```js
// controllers/authController.js
import bcrypt from "bcrypt";
import * as Users from "../data/users.js";
import { AppError } from "../utils/AppError.js";

export async function register(req, res) {
  const email = req.body.email.toLowerCase();
  if (await Users.findByEmail(email)) {
    throw new AppError("Email already registered", 409);
  }
  const passwordHash = await bcrypt.hash(req.body.password, 12);
  const user = await Users.create({ email, passwordHash });
  res.status(201).json({ id: user.id, email: user.email });
}

export async function login(req, res, next) {
  const email = req.body.email.toLowerCase();
  const user = await Users.findByEmail(email);
  const ok = user && (await bcrypt.compare(req.body.password, user.passwordHash));
  if (!ok) throw new AppError("Invalid email or password", 401);
  // ...remember the user: see the next part
}
```

Three details matter. The response contains `id` and `email` only, **never** the hash. Login gives **the same message** for "no such email" and "wrong password", so attackers can't use it to find out which emails are registered. And emails are lowercased, so `Anna@Mail.com` and `anna@mail.com` are the same account.

## Remembering the user: sessions

HTTP is stateless: each request arrives on its own, with no memory of the previous one. A **session** solves this. After login, the server stores a small record (`{ userId: 7 }`) under a long random id and sends that id to the browser in a **cookie**. The browser automatically sends the cookie with every following request, and the server looks up the record.

```bash
npm install express-session
```

```js
// app.js
import session from "express-session";

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  },
}));
```

- `secret` signs the cookie so it can't be forged. Generate a long random value with `node -p "require('node:crypto').randomBytes(32).toString('hex')"` and put it in `.env`.
- `httpOnly` stops JavaScript in the page from reading the cookie, so an XSS bug can't steal it.
- `sameSite: "lax"` stops the browser from sending the cookie with POST requests that come from other websites, which blocks most CSRF attacks.
- `secure` sends the cookie over HTTPS only. Turn it on in production (where you also need `trust proxy`), but not on `http://localhost`.
- `saveUninitialized: false` means visitors only get a cookie once there's something to remember.

Now finish `login`:

```js
  req.session.regenerate((err) => {
    if (err) return next(err);
    req.session.userId = user.id;
    res.json({ id: user.id, email: user.email });
  });
```

`regenerate` creates a fresh session id at login, which prevents an attack called *session fixation*. It uses a callback, so errors must go through `next(err)`, as you learned in the error-handling lesson. Logout destroys the session:

```js
export function logout(req, res, next) {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie("connect.sid", { // the default cookie name
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    res.status(204).end();
  });
}
```

`clearCookie` only works when its options match the ones the cookie was set with, so repeat the `cookie` options from `session()` (without `maxAge`). `path: "/"` is express-session's default.

By default, express-session keeps sessions in memory: they disappear when the server restarts, and this store isn't meant for production. In the Databases module you'll store them in the database.

## Protecting routes: requireAuth and ownership

```js
// middleware/requireAuth.js
export function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Please log in" });
  }
  next();
}
```

Use it on single routes (`router.post("/", requireAuth, createBook)`) or a whole router (`router.use(requireAuth)`). A `GET /auth/me` route that returns the current user lets the frontend ask "am I logged in?".

Being logged in isn't enough, though. That's authentication. **Authorization** means checking that the user owns what they're touching: look up records with *both* the id and `req.session.userId`, and answer 404 when they don't match.

## The other approach: JWT

A **JSON Web Token** is a signed string containing data like the user id. The server creates it at login; the client stores it and sends it in an `Authorization: Bearer <token>` header. The server checks the signature and needs no session storage.

```js
import jwt from "jsonwebtoken";

const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
const payload = jwt.verify(token, process.env.JWT_SECRET); // throws if invalid or expired
```

The trade-offs: a session can be ended instantly on the server, while a JWT stays valid until it expires. JWTs suit mobile apps and APIs called by other servers. A JWT kept in `localStorage` can be stolen by any XSS bug, and its content is readable by anyone (it's signed, not encrypted). For a website with its own backend, **sessions with httpOnly cookies are simpler and safer**, so that's what you'll use in this section.

## Common mistakes

- **Sending the password hash back**, for example `res.json(user)`. Always pick the fields you return.
- **Revealing which emails exist** through different login error messages.
- **A hard-coded or committed session secret.** It belongs in `.env`, and `.env` belongs in `.gitignore`.
- **`secure: true` on localhost.** The browser refuses the cookie over plain HTTP, so login seems to work but you're never logged in.
- **Checking login but not ownership.** Any logged-in user could read anyone's data by changing the id in the URL.

## In short

- Store bcrypt hashes, never passwords; compare with `bcrypt.compare`.
- Sessions: the server keeps `req.session.userId`, the browser keeps an httpOnly cookie.
- `regenerate` at login, `destroy` at logout, `requireAuth` on protected routes.
- Authorization means checking ownership on every request, not only login.
- JWTs fit mobile apps and server-to-server APIs; for websites, prefer sessions.

### Exercises
- In a scratch script, hash the same password twice and print both hashes (they differ). Check that `bcrypt.compare` accepts the password for both.
- Build `POST /auth/register` with Zod validation (email, password 8–72 characters) and a 409 for duplicate emails. Make sure the hash never appears in a response.
- Add `POST /auth/login`, `POST /auth/logout` and `GET /auth/me` with express-session. Test the flow in REST Client or Postman (both keep cookies between requests) and look at the cookie in the response headers.
- Add `requireAuth` and use it to protect the write routes of a copy of your Book Library API. Check you get 401 when logged out.
- Bonus: implement login with a JWT instead, and write down two advantages and two disadvantages compared to sessions.

---lesson
id: ex-9
title: Security essentials
time: 1h
video: Node.js Express security best practices
docs: Express security best practices | https://expressjs.com/en/advanced/best-practice-security.html
docs: OWASP Top 10 | https://owasp.org/www-project-top-ten/
docs: Helmet | https://helmetjs.github.io/
docs: express-rate-limit | https://github.com/express-rate-limit/express-rate-limit
---
Once your app is online, bots will find it within hours: guessing passwords, scanning for known weaknesses, sending strange input. No app is perfectly secure, but a handful of defaults block the most common attacks. This lesson builds on what you already do (validation with Zod, hashing passwords, hiding error details) and adds the remaining basics.

## Secure headers with helmet

```bash
npm install helmet express-rate-limit cors
```

```js
import helmet from "helmet";

app.use(helmet());
```

Register it near the top of `app.js`. `helmet()` sets about a dozen HTTP response headers that tell the browser to be stricter. The important ones:

- **Content-Security-Policy (CSP)** limits where scripts, styles and images may load from. If an attacker manages to inject a `<script>` into your page, the browser refuses to run it.
- **Strict-Transport-Security** tells browsers to only use HTTPS for your site.
- **X-Content-Type-Options: nosniff** stops browsers from guessing file types.
- It also removes `X-Powered-By: Express`, which advertised your framework to attackers.

The side effect you'll notice: the default CSP blocks **inline** scripts, including `onclick="..."` attributes and `<script>` tags with code inside the HTML, and scripts loaded from CDNs. The fix is good practice anyway: keep your JavaScript in files under `public/` and attach events with `addEventListener`.

## Rate limiting

Without limits, a bot can try thousands of passwords per minute against your login route. `express-rate-limit` counts requests per IP address and answers **429 Too Many Requests** when someone goes over the limit:

```js
// middleware/rateLimits.js
import { rateLimit } from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5,                 // 5 requests per IP per window
  message: { error: "Too many attempts, please try again later" },
});
```

```js
// routes/auth.js
router.post("/login", authLimiter, validate(LoginSchema), login);
router.post("/register", authLimiter, validate(RegisterSchema), register);
```

Apply strict limits only where they're needed (login, register, password reset), and a more generous one, say 100 requests per 15 minutes, to the whole API if you like. Older tutorials use a `max` option; current versions call it `limit`.

On a host behind a proxy, every request seems to come from the proxy's IP unless you set `app.set("trust proxy", 1)`. Without it, all your users share one counter, and express-rate-limit logs a warning about the `X-Forwarded-For` header.

## CORS: only when the frontend lives elsewhere

If your frontend is served by the same Express app (with `express.static`), you don't need CORS at all. You need it when the frontend runs on another origin, like a React dev server on `http://localhost:5173` calling your API on port 3000:

```js
import cors from "cors";

app.use(cors({
  origin: ["http://localhost:5173", "https://my-journal.example.com"],
  credentials: true,
}));
```

`origin` is an allow-list: only these sites may call your API from a browser. `credentials: true` allows cookies; the frontend must then also use `fetch(url, { credentials: "include" })`. Browsers refuse `origin: "*"` together with credentials.

Remember what CORS is: a **browser** rule that protects users, not a lock on your server. curl, Postman and bots ignore it completely. Your real protection is authentication, validation and rate limits.

## Input and output

- **Limit body size**: `express.json({ limit: "10kb" })`. The default is 100kb; a journal entry or a book doesn't need more.
- **Validate everything** with Zod, including lengths (`.max(...)`), so nobody stores a 5 MB "title".
- **Escape output** to prevent XSS: `textContent` in the browser, `<%= %>` in EJS. Never put user data into `innerHTML` or `<%- %>`.
- **SQL injection**: in the Databases module you'll always use parameterised queries. Never build SQL by joining strings with user input.
- **Hide errors**: your error handler already sends generic messages for 500s.

## Secrets and dependencies

- Secrets (session secret, API keys) live in environment variables. If one is ever committed to git, consider it public: generate a new one. Deleting the commit isn't enough.
- Most real-world breaches use known bugs in old packages. Run `npm audit` to list vulnerable dependencies and `npm audit fix` to update them where it's safe. On GitHub, Dependabot can open update pull requests for you.

## Putting it together

```js
// app.js
const app = express();

app.set("trust proxy", 1);
app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(session({ /* options from the auth lesson */ }));
app.use(express.static(path.join(import.meta.dirname, "public")));

app.use("/auth", authRouter);           // authLimiter inside, on login/register
app.use("/api/entries", entriesRouter); // requireAuth inside

app.use(notFound);
app.use(errorHandler);
```

## Common mistakes

- **"helmet broke my page."** Inline scripts or `onclick` attributes are blocked by CSP. Move the code into a `.js` file instead of turning CSP off.
- **Rate limiting `/auth/me` with the login limiter.** The frontend calls it on every page load, so users get 429 after five clicks. Limit only the routes attackers target.
- **`cors({ origin: "*" })` because "it fixed the error".** Allow only the origins you actually use.
- **Thinking CORS protects your API.** It doesn't; anything outside a browser ignores it.

## In short

- `helmet()` sets secure headers; keep JavaScript out of inline attributes.
- Rate-limit login and register; set `trust proxy` behind a host's proxy.
- Use CORS only for cross-origin frontends, with an explicit allow-list.
- Limit body size, validate input, escape output, keep secrets in env vars, run `npm audit`.

### Exercises
- Add `helmet()` and compare the response headers before and after in the DevTools Network tab. Add an inline `onclick` to a page, see the CSP error in the console, then fix it with `addEventListener` in a `.js` file.
- Rate-limit your login route to 5 attempts per 15 minutes. Send six wrong logins from REST Client and check the sixth gets 429.
- Configure `cors` with an allow-list. Serve a small test page from another port (for example with VS Code Live Server) and check that `fetch` works from an allowed origin and fails from one that isn't in the list.
- Run `npm audit` in your projects and read the report. Then read the OWASP Top 10 headings and note which ones your app already handles, and how.

---project
id: ex-p2
title: Private Journal
summary: Users register, log in and keep journal entries that only they can see.
---
### The task
Build a private online diary: each person creates an account and writes journal entries that only they can read. The focus is authentication done safely and authorization done everywhere. The frontend is served by the same Express app, so the session cookie works without any CORS setup.

### What it must do
- `POST /auth/register` with `{ email, password }`: validated with Zod (valid email, password 8–72 characters), password hashed with bcrypt, duplicate email gives 409. Responds 201 with `{ id, email }` and logs the new user in
- `POST /auth/login` sets the session cookie; the same 401 message for an unknown email and a wrong password
- `POST /auth/logout` destroys the session (204); `GET /auth/me` returns `{ id, email }` or 401
- An entry looks like `{ id, userId, title, body, mood, createdAt, updatedAt }`, with `mood` one of `"great"`, `"good"`, `"okay"`, `"bad"`, `"awful"`
- `GET /api/entries` (the current user's entries, newest first), `POST /api/entries`, and `GET`/`PATCH`/`DELETE /api/entries/:id`. All require login (401 otherwise), and bodies are validated with Zod
- Asking for another user's entry gives 404, so the app doesn't reveal that it exists
- Frontend: register page, login page, a page listing entries with a form to create and edit them, delete buttons and a logout button. API errors are shown to the user
- Security: helmet, rate limiting on login and register, a JSON body size limit, the session secret from `.env`, and the password hash never sent to the client
- Data access in `data/users.js` and `data/entries.js` (in memory or a JSON file), with async functions, like the Book Library

### Steps
1. **Set up.** Reuse the structure from the Book Library (`app.js`, `server.js`, `AppError`, `validate`, `notFound`, `errorHandler`). Create `.env` with `SESSION_SECRET`, add it to `.gitignore`, use `--env-file=.env` in the `dev` script, and configure express-session.
2. **Register.** Create `data/users.js` and `POST /auth/register` with Zod and bcrypt. Unlike the lesson version, register must also log the user in: call `req.session.regenerate`, set `req.session.userId`, then send the 201. Test it in `requests.http` and log the stored user on the server to see the hash.
3. **Login, logout, me.** Add the three routes, with `regenerate` on login and `destroy` on logout. Check that `/auth/me` works after login and returns 401 after logout.
4. **Entries.** Write `requireAuth` and `data/entries.js` with functions that always take the user id, for example `findAllByUser(userId)` and `findOwned(id, userId)`. Build the CRUD routes behind `requireAuth`, taking `userId` from the session.
5. **Prove authorization.** Register two users. As user A, create entries; as user B, try to read, update and delete them by id. Every attempt must return 404. Save these requests in `requests.http`.
6. **Frontend.** In `public/`, create `login.html`, `register.html` and `index.html` with their own `.js` files. On load, `index.html` calls `/auth/me` and sends the user to the login page on 401. Display entries with `textContent`, never `innerHTML`.
7. **Security.** Add `helmet()` (check nothing on your pages breaks), the auth rate limiter on login and register, and `express.json({ limit: "10kb" })`. Try six wrong logins and check for a 429.
8. **README.** Explain the auth flow in your app step by step: register (hash), login (session cookie), each request (requireAuth, ownership check), logout. Push to GitHub.

### Hints
- A same-origin `fetch` sends cookies automatically; you only need `credentials: "include"` when the frontend runs on another origin.
- Put the ownership check inside the data layer (`entries.find((e) => e.id === id && e.userId === userId)`), so no controller can forget it. It's exactly how a SQL query with `WHERE id = $1 AND user_id = $2` will look in the next module.
- Never take `userId` from the request body: always from `req.session.userId`. Don't spread `req.body` into a new entry without validating it first.
- Sessions live in memory, so every `--watch` restart logs you out. That's normal for now.
- To be two users at once, use a normal and a private browser window, or two different browsers.
- The default CSP from helmet blocks inline `<script>` and `onclick` attributes. Keep all JavaScript in `.js` files.

### Stretch goals
- Search entries by text and filter by mood
- A change-password endpoint that requires the current password and regenerates the session
- A "Remember me" checkbox that sets a longer `req.session.cookie.maxAge`
- Server-rendered versions of the pages with EJS
- Deploy to Render with `trust proxy`, `secure` cookies and `NODE_ENV=production` (users, entries and sessions will reset on restarts until the Databases module)

### Done when
- Passwords are stored only as bcrypt hashes and never appear in any response
- Register, login, logout and `/auth/me` work, and login gives the same error for an unknown email and a wrong password
- Every entries route returns 401 when logged out
- User B gets 404 when reading, updating or deleting user A's entries
- In the browser, a user can register, log in, write, edit and delete entries, and log out
- helmet is enabled, and the sixth failed login within 15 minutes returns 429
- The README explains the auth flow
- `.env.example` lists every environment variable with placeholder values, and `.env` is git-ignored

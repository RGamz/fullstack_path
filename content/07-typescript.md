---module
id: ts
title: TypeScript
scrimba: TypeScript
weeks: 2–3 weeks
fullCourse: freeCodeCamp TypeScript full course
intro: JavaScript with types. TypeScript catches whole groups of bugs before you run your code and makes your editor much smarter, and most job listings expect it. You'll learn the language, then use it in a library, a React app and your Express API.
---

---section
id: ts-s1
title: TypeScript fundamentals
intro: Set up TypeScript and learn the type system step by step, from basic types to generics and utility types. You'll finish by converting your TDD utility library to strict TypeScript and publishing-ready type definitions.
---

---lesson
id: ts-1
title: Why TypeScript and setup
time: 1h
video: Fireship — TypeScript in 100 Seconds | https://www.youtube.com/watch?v=zQnBQ4tB3ZA
docs: TypeScript handbook | https://www.typescriptlang.org/docs/handbook/intro.html
docs: TS Playground | https://www.typescriptlang.org/play
docs: TSConfig reference | https://www.typescriptlang.org/tsconfig/
docs: Node.js: running TypeScript | https://nodejs.org/api/typescript.html
docs: Total TypeScript free beginner tutorial | https://www.totaltypescript.com/tutorials
---
In JavaScript, many bugs only show up when the code runs: you call `book.titel` instead of `book.title` and get `undefined`, you pass a string where a number was expected, you forget that a value can be `null`. **TypeScript** is JavaScript plus a way to describe what kind of value each variable, parameter and property holds. A checker reads those descriptions and points out the mistakes in your editor, before you ever run the code. Most professional JavaScript today is written in TypeScript, and almost every job listing mentions it.

## What TypeScript adds

Here is a plain JavaScript function with a bug that's easy to miss:

```js
function totalPages(books) {
  return books.reduce((sum, b) => sum + b.pages, 0);
}

totalPages([{ title: "Dune", pages: "412" }]); // "0412": a string, not a number!
```

The same function in TypeScript:

```ts
type Book = { title: string; pages: number };

function totalPages(books: Book[]): number {
  return books.reduce((sum, b) => sum + b.pages, 0);
}

totalPages([{ title: "Dune", pages: "412" }]);
// Error: Type 'string' is not assignable to type 'number'.
```

The `: Book[]` after the parameter is a **type annotation**. The editor underlines the wrong call in red as you type. You also get autocomplete: type `b.` and the editor lists `title` and `pages`.

## Types disappear at runtime

TypeScript files (`.ts`) can't be run by browsers. They're turned into plain JavaScript first, and in that step **all types are removed**. The output for the example above is the original JavaScript function, without annotations.

This has an important consequence: types check *your code*, not *your data*. If an API sends `{ pages: "412" }` at runtime, TypeScript can't stop it, because the types no longer exist when the response arrives. For data from outside (request bodies, `fetch` responses, `localStorage`), you still need runtime validation, for example with Zod, which you used in the Express module.

## Setting up a project

```bash
npm install -D typescript
npx tsc --init
```

`tsc` is the TypeScript compiler. `--init` creates a `tsconfig.json`, the file that configures it. The generated file contains many options, some of them extra strict, and recent versions set `"types": []`, which hides Node's built-in types like `process`. While you're learning, replace its content with this smaller starting point for a Node project (and run `npm install -D @types/node` once you use Node APIs):

```json
{
  "compilerOptions": {
    "target": "ES2023",
    "module": "NodeNext",
    "strict": true,
    "outDir": "dist",
    "rootDir": "src",
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

- **`strict: true`** turns on all the important checks, most importantly that `null` and `undefined` must be handled. Always use it; TypeScript without strict mode misses a lot of bugs.
- **`module: "NodeNext"`** makes TypeScript follow Node's rules for ES modules.
- **`outDir` / `rootDir`**: your `.ts` files live in `src/`, the compiled `.js` goes to `dist/`.
- **`skipLibCheck`** skips checking the type files of installed packages, which is faster and avoids errors in code you can't fix.

## Checking, building and running

Three different jobs, three commands:

```json
"scripts": {
  "typecheck": "tsc --noEmit",
  "build": "tsc",
  "dev": "tsx watch src/index.ts"
}
```

- `tsc --noEmit` only **checks** types and prints errors; it writes no files. Run it before every commit and in CI.
- `tsc` checks **and** writes `.js` files to `dist/`, which you run in production with `node dist/index.js`.
- **tsx** (`npm i -D tsx`) runs `.ts` files directly during development, and `tsx watch` restarts on save. It's fast because it only removes the types and does **not** check them, so keep `typecheck` in your workflow.

Node itself can also run many `.ts` files directly in recent versions (`node src/index.ts`) by stripping the types. It's handy for small scripts, but it has limits: it doesn't type-check either, imports must use the real `.ts` file extension, and it refuses TypeScript features that generate code, like `enum` and `namespace`. In this module we use tsx for running and `tsc` for checking and building, and write relative imports with a `.js` ending (`import { add } from "./math.js"`), which TypeScript maps to `math.ts`.

## Your editor is the main tool

VS Code has TypeScript built in. Hover over any variable to see its type, press F12 to jump to a definition, and read red underlines as you type. The **TS Playground** (linked above) lets you try snippets in the browser and see the JavaScript output next to them.

## Common mistakes

- **Thinking types validate data.** `const book: Book = await res.json()` doesn't check anything at runtime. Validate external data.
- **Ignoring red underlines because "it still runs".** tsx and Vite run code with type errors. Run `npm run typecheck`.
- **Turning off strict mode** to make errors go away. Fix the errors; they're usually real.
- **Using `any`** to silence the compiler. It turns checking off for that value, and the bug comes back later.

## In short

- TypeScript adds type annotations to JavaScript; the checker finds mistakes before the code runs.
- Types are removed when compiling, so they don't validate runtime data.
- `tsconfig.json` with `"strict": true`; `tsc --noEmit` to check, `tsc` to build, `tsx` to run in development.
- Node can strip types from simple `.ts` files itself, without checking them and without support for enums.

### Exercises
- Create a folder `ts-practice` for the small exercises in lessons 7.1–7.6: `npm init -y`, add `"type": "module"`, install `typescript` and `tsx`, and use the `tsconfig.json` and the three scripts from the lesson. Write `src/index.ts` that logs a greeting. `npm run dev` should print it (stop it with Ctrl+C), and `npm run typecheck` should finish with no errors.
- Paste the `totalPages` example into the TS Playground. Read the error, fix the call, and look at the JavaScript output on the right.
- Copy one JavaScript file that has no imports from an earlier project (for example `utils/getDataByQueryParams.js` from `destinations-api`, or a function file from `tdd-utils`) into `ts-practice/src/`, rename it to `.ts`, and fix errors until `npm run typecheck` reports none.
  Hint: Most errors will be "Parameter 'x' implicitly has an 'any' type". Add a type after each parameter, as in `totalPages(books: Book[])`; for objects, write a small `type` first, like `Book` in the lesson.
- In `ts-practice`, run `npm run build` and compare `src/index.ts` with `dist/index.js` (and your copied file with its `.js` version). What exactly was removed?

---lesson
id: ts-2
title: Basic types and inference
time: 1h
video: Dave Gray — TypeScript Basic Types (Beginners Lesson) | https://www.youtube.com/watch?v=bDCPYSanB7A
docs: Everyday types | https://www.typescriptlang.org/docs/handbook/2/everyday-types.html
docs: Type inference | https://www.typescriptlang.org/docs/handbook/type-inference.html
---
You don't need to write a type on every line. TypeScript is good at working out types by itself, which is called **inference**. Knowing which types exist, and where you *do* need to write them, keeps your code short and still fully checked.

## Primitive types

```ts
let title: string = "Dune";
let pages: number = 412;      // integers and decimals: both number
let isRead: boolean = false;
let nothing: null = null;
let notSet: undefined = undefined;
```

The names are lowercase: `string`, not `String`.

## Inference: let TypeScript do the work

Most of the time you can leave annotations out:

```ts
let title = "Dune";   // inferred: string
let pages = 412;      // inferred: number
title = 42;           // Error: Type 'number' is not assignable to type 'string'.

const genres = ["sci-fi", "fantasy"]; // inferred: string[]
const total = pages * 2;              // inferred: number
```

TypeScript looks at the value and remembers the type. Hover over a variable in VS Code to see what it inferred.

The rule of thumb: **annotate function parameters, let TypeScript infer the rest.** Parameters can't be inferred, because TypeScript can't know what callers will pass:

```ts
function formatPrice(cents: number, currency: string) {
  return `${(cents / 100).toFixed(2)} ${currency}`;
}
// return type inferred: string
```

You *can* annotate return types (`function f(): string`), and it's a good idea for exported functions in a library: it documents the contract and catches mistakes inside the function.

## Arrays and tuples

```ts
const scores: number[] = [10, 8, 9];
const names: Array<string> = ["Ana", "Ben"]; // same thing, other syntax

scores.push("ten"); // Error: Argument of type 'string' is not assignable…

const point: [number, number] = [52.37, 4.89];   // a tuple: fixed length and types
const entry: [string, number] = ["Dune", 1965];
```

A **tuple** is an array with a fixed number of items, each with its own type. You've used one already: `useState` returns a tuple `[value, setter]`.

## Literal types and as const

With `const`, TypeScript infers the narrowest type possible, the exact value:

```ts
let a = "todo";   // type: string (a let can change)
const b = "todo"; // type: "todo" (a literal type)

const statuses = ["todo", "doing", "done"];           // string[]
const fixed = ["todo", "doing", "done"] as const;     // readonly ["todo", "doing", "done"]
```

`as const` says "this will never change", so TypeScript keeps the exact values. You'll use this in later lessons to turn a list of values into a type.

## null and undefined in strict mode

With `strict` on, a value that might be missing must be declared that way, and you must check it before using it:

```ts
function findTitle(id: number): string | undefined {
  return id === 1 ? "Dune" : undefined;
}

const title = findTitle(2);
title.toUpperCase();  // Error: 'title' is possibly 'undefined'.

if (title) {
  title.toUpperCase(); // fine: inside the if, title is a string
}
title?.toUpperCase();  // also fine: optional chaining
```

`string | undefined` means "a string or undefined" (a union; more in a later lesson). This check alone prevents the classic "Cannot read properties of undefined" crash.

## any and unknown

- **`any`** turns checking off. You can do anything with it, and TypeScript won't warn you. Avoid it.
- **`unknown`** means "I don't know what this is yet". It's safe: you can't use it until you've checked what it is.

```ts
const data: unknown = JSON.parse('{"title":"Dune"}');

data.title; // Error: 'data' is of type 'unknown'.

if (typeof data === "object" && data !== null && "title" in data) {
  console.log(data.title); // allowed after the checks
}
```

`JSON.parse` returns `any` by default, so assigning it to `unknown` is a good habit. In practice you'll often check unknown data with a Zod schema instead of manual checks.

## Type assertions: as

`value as Type` tells TypeScript "trust me, it's this type". It doesn't check or convert anything at runtime:

```ts
const input = document.querySelector("#email") as HTMLInputElement;
input.value; // OK
```

Use it only when you really know more than the compiler (like here, where you wrote the HTML). If you're wrong, you're back to runtime crashes.

## Common mistakes

- **Annotating everything**: `const n: number = 5` adds noise. Let inference work; annotate parameters.
- **Using `String`, `Number`, `Boolean`** (capitalised). Those are wrapper objects. Use lowercase.
- **Using `any` when stuck.** Use `unknown` and narrow it, or find the right type by hovering.
- **Using `as` to silence an error** instead of fixing the cause. An assertion is a promise to the compiler that you might break.

## In short

- Primitive types: `string`, `number`, `boolean`, `null`, `undefined`; arrays `T[]`; tuples `[A, B]`.
- TypeScript infers most types; annotate function parameters (and exported return types).
- `as const` keeps exact literal values; with strict mode you must handle `undefined` and `null`.
- Prefer `unknown` over `any`; use `as` rarely.

### Exercises
- Copy 5 small functions from earlier projects (for example from `tdd-utils`) into `ts-practice/src/functions.ts` and annotate their parameters. Hover over each function name to check the inferred return type, and make sure `npm run typecheck` reports no errors.
- In `ts-practice/src/average.ts`, write `average(numbers: number[]): number`. What should it return for an empty array? Make that explicit in the code.
- In `ts-practice/src/statuses.ts`, write `const statuses = ["todo", "doing", "done"]` and hover over it: it's `string[]`. Add `as const` and hover again to see the exact values.
- In `ts-practice/src/parse.ts`, parse a JSON string into an `unknown` variable and safely log one property using `typeof` and `in` checks. Run it with `npx tsx src/parse.ts`.

---lesson
id: ts-3
title: Object types: type aliases and interfaces
time: 1h
video: Dave Gray — TypeScript Objects, Arrays, Tuples & Enums | https://www.youtube.com/watch?v=9dw2ik9N8wo
docs: Object types | https://www.typescriptlang.org/docs/handbook/2/objects.html
docs: Everyday types: aliases and interfaces | https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases
---
Most data in your apps is objects: a book, a user, an API response, a card in a game. Describing their shape once, with a name, lets TypeScript check every place that creates, reads or passes them around, and gives you autocomplete for every property.

## Type aliases

`type` gives a name to any type, usually an object shape:

```ts
type Book = {
  id: number;
  title: string;
  author: string;
  year: number;
};

const dune: Book = { id: 1, title: "Dune", author: "Frank Herbert", year: 1965 };

function describe(book: Book) {
  return `${book.title} (${book.year})`;
}
```

If you forget a property, misspell one, or use the wrong type, you get an error at the exact spot. By convention type names start with a capital letter.

## Optional and readonly properties

```ts
type Book = {
  readonly id: number;   // can't be changed after creation
  title: string;
  year?: number;         // optional: may be missing
};

const b: Book = { id: 1, title: "Dune" };  // fine without year
b.id = 2;                                  // Error: Cannot assign to 'id' because it is a read-only property.

console.log(b.year.toString());  // Error: 'b.year' is possibly 'undefined'.
console.log(b.year?.toString()); // fine
```

`year?: number` means the type of `b.year` is `number | undefined`, so strict mode makes you handle the missing case.

## Nested objects and arrays of objects

Types can use other types:

```ts
type Author = { id: number; name: string };

type Book = {
  id: number;
  title: string;
  author: Author;
  tags: string[];
};

type BooksResponse = {
  data: Book[];
  page: number;
  total: number;
};
```

`BooksResponse` describes the JSON your Books API returns from `GET /api/books`. Writing types for your API responses is one of the most useful things TypeScript does in a frontend.

## Interfaces

An **interface** is another way to describe an object shape:

```ts
interface User {
  readonly id: string;
  name: string;
  email: string;
}

interface Admin extends User {
  permissions: string[];
}

const admin: Admin = { id: "a1", name: "Ana", email: "ana@x.com", permissions: ["delete"] };
```

`extends` copies all properties of `User` into `Admin` and adds new ones.

## type or interface?

For object shapes, both work and the differences rarely matter. What each can do:

- A **type alias** can name *any* type: unions (`"todo" | "done"`), tuples, functions. You combine object types with `&` (an intersection): `type Admin = User & { permissions: string[] }`.
- An **interface** can only describe objects, can `extends` other interfaces, and two interfaces with the same name are merged together (useful for adding properties to library types, which you'll see with Express).

A simple, common rule: use `type` by default, and `interface` when you need to extend or merge. Whatever you choose, be consistent in a project.

## Objects with unknown keys: Record

Sometimes the keys aren't known in advance, like a lookup table:

```ts
const pagesByTitle: Record<string, number> = {
  Dune: 412,
  Emma: 474,
};

pagesByTitle["Dracula"] = 418; // fine: any string key, number value
```

`Record<K, V>` means "an object whose keys are `K` and whose values are `V`".

## Structural typing

TypeScript compares types by **shape**, not by name. Any object with the right properties fits:

```ts
type Point = { x: number; y: number };

function printPoint(p: Point) { console.log(p.x, p.y); }

const location = { x: 3, y: 7, label: "home" };
printPoint(location); // fine: it has x and y (extra properties are OK here)

printPoint({ x: 3, y: 7, label: "home" }); // Error: Object literal may only specify known properties
```

The second call fails because of **excess property checking**: when you write an object literal directly where a type is expected, TypeScript assumes an extra property is a typo.

## Common mistakes

- **Forgetting `?` for optional data**, then getting runtime `undefined` anyway. If the API can leave a field out, mark it optional.
- **Using `object` or `{}` as a type.** They accept almost anything. Describe the real shape.
- **Duplicating the same shape** in several files. Define each type once (for example in `types.ts`) and import it with `import type { Book } from "./types.js"`.
- **Typos in property names that are "fixed" with optional properties.** If TypeScript says a property doesn't exist, check the spelling before changing the type.

## In short

- `type Book = { ... }` names an object shape; `?` makes a property optional, `readonly` makes it unchangeable.
- Types can nest and reference other types, which is perfect for API responses.
- `interface` describes objects and can `extends`; `type` can also describe unions and combine with `&`.
- `Record<K, V>` for lookup objects; TypeScript compares types by shape.

### Exercises
- In `ts-practice/src/types.ts`, write types `Book`, `Author` and `Tag` that match the columns of your `books`, `authors` and `tags` tables from the Databases module, plus a `BookWithAuthor` type for a book with a nested `author: { id, name }`, the way your `books-api` returns it. `npm run typecheck` should pass.
- In `ts-practice/src/types.ts`, add a `BooksResponse` type for an API response: `{ data: Book[]; page: number; total: number }`. Then write `getTitles(response: BooksResponse): string[]` that returns the titles.
- Rewrite `User` and `Admin` above with `type` and `&` instead of `interface` and `extends`.
- Write a `Record<string, number>` that counts how many books each author has, built from an array of `Book`.

---lesson
id: ts-4
title: Unions, literal types and narrowing
time: 1.5h
video: Andrew Burgess — TypeScript Exhaustive Switch & Discriminated Unions | https://www.youtube.com/watch?v=CG3_Y9T03J4
docs: Narrowing | https://www.typescriptlang.org/docs/handbook/2/narrowing.html
docs: Discriminated unions | https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions
---
Real data is often "one of several things": an id that's a number or a string, a request that's loading, finished or failed, a task that's todo, doing or done. **Union types** describe exactly that, and **narrowing** is how TypeScript follows your `if` statements to know which case you're in. This is where TypeScript starts preventing whole categories of bugs instead of just typos.

## Union types

A union means "one of these types", written with `|`:

```ts
function formatId(id: number | string) {
  return `#${id}`;
}

formatId(42);     // fine
formatId("a7");   // fine
formatId(true);   // Error
```

Inside the function you can only do things that work for **every** member of the union. `id.toUpperCase()` is an error, because numbers don't have it.

## Literal types

A literal type is one exact value. Combined in a union, they make a list of allowed values:

```ts
type Status = "todo" | "doing" | "done";
type Priority = "low" | "medium" | "high";

let status: Status = "todo";
status = "finished"; // Error: Type '"finished"' is not assignable to type 'Status'.
```

Your editor now autocompletes the allowed values, and a typo is caught immediately. This replaces "magic strings" that were only documented in comments.

## Narrowing

When you check a union value, TypeScript narrows its type inside that branch:

```ts
function formatId(id: number | string) {
  if (typeof id === "string") {
    return id.toUpperCase();   // here id is string
  }
  return id.toFixed(0);        // here id must be number
}
```

The checks TypeScript understands:

- `typeof x === "string"` (also `"number"`, `"boolean"`, `"object"`, `"function"`, `"undefined"`)
- truthiness: `if (user)` removes `null` and `undefined`
- equality: `if (status === "done")`
- `"title" in obj`: the object has that property
- `x instanceof Date`, `err instanceof Error`
- `Array.isArray(x)`

A very common one is errors: in `catch (err)`, `err` has type `unknown`, so you narrow it:

```ts
try {
  await saveBook(book);
} catch (err) {
  const message = err instanceof Error ? err.message : "Unknown error";
  console.error(message);
}
```

## Discriminated unions

The most useful pattern in this lesson. Give each variant of an object a shared property with a different literal value, the **discriminant** (often called `kind`, `type` or `status`):

```ts
type FetchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: string[] }
  | { status: "error"; message: string };

function render(state: FetchState) {
  switch (state.status) {
    case "idle":
      return "Search for something";
    case "loading":
      return "Loading…";
    case "success":
      return state.data.join(", ");   // data only exists here
    case "error":
      return `Error: ${state.message}`; // message only exists here
  }
}
```

Compare this with three separate variables (`isLoading`, `data`, `error`): those allow impossible combinations like "loading *and* error *and* data". The union makes impossible states impossible to write.

## Exhaustiveness checking with never

What happens when someone adds `{ status: "cancelled" }` to `FetchState` next month? You want TypeScript to show you every `switch` that doesn't handle it yet:

```ts
function render(state: FetchState): string {
  switch (state.status) {
    case "idle": return "Search for something";
    case "loading": return "Loading…";
    case "success": return state.data.join(", ");
    case "error": return `Error: ${state.message}`;
    default: {
      const unhandled: never = state;
      throw new Error(`Unhandled state: ${JSON.stringify(unhandled)}`);
    }
  }
}
```

`never` is the type with no possible values. When every case is handled, `state` in `default` has type `never` and the assignment is fine. Add a new status and forget to handle it, and `state` becomes `{ status: "cancelled" }`, which can't be assigned to `never`: a compile error pointing at this exact line.

## Type predicates

You can write your own narrowing functions with a return type of the form `value is Type`:

```ts
type Book = { title: string; year: number };

function isBook(value: unknown): value is Book {
  return typeof value === "object" && value !== null
    && "title" in value && "year" in value;
}

const items: unknown[] = JSON.parse(text);
const books = items.filter(isBook); // type: Book[]
```

## Common mistakes

- **Using `string` where a literal union fits.** `status: string` accepts `"dnoe"`; `status: Status` doesn't.
- **Separate boolean flags** for states that exclude each other. Use a discriminated union.
- **Accessing a property before narrowing**: `state.data` outside the `"success"` branch is an error, and that's the point.
- **Lying in a type predicate.** If `isBook` returns `true` for something that isn't a book, TypeScript believes you.

## In short

- `A | B` means one of several types; you can only use what all members share until you narrow.
- Literal unions like `"todo" | "doing" | "done"` replace magic strings.
- Narrow with `typeof`, truthiness, `===`, `in`, `instanceof` and `Array.isArray`.
- Discriminated unions model states safely; a `never` check makes TypeScript find unhandled cases.

### Exercises
- Write `type Status = "todo" | "doing" | "done"` and a function `nextStatus(s: Status): Status` that moves a task forward (done stays done).
- Model a fetch state as a discriminated union and write a function that returns a message for each state.
- Add a `never` check to the `switch` from the previous exercise, then add a `{ status: "cancelled" }` variant and run `npm run typecheck`: the error points at the `const unhandled: never` line. Fix it by handling `"cancelled"`.
- Write `isBook(value: unknown): value is Book` and use it to filter a parsed JSON array.

---lesson
id: ts-5
title: Functions and generics
time: 1.5h
video: Web Dev Simplified — Learn TypeScript Generics in 13 Minutes | https://www.youtube.com/watch?v=EcCTIExsqmI
docs: More on functions | https://www.typescriptlang.org/docs/handbook/2/functions.html
docs: Generics | https://www.typescriptlang.org/docs/handbook/2/generics.html
---
Functions are where types pay off most: every call to a typed function is checked. And many functions work the same way for any kind of data: "get the first item", "find by id", "fetch some JSON". **Generics** let you write those once while still keeping the exact type of the data, instead of falling back to `any`. You use generics constantly already (`Array<string>`, `Promise<Book>`), so it's time to write your own.

## Typing functions

```ts
// parameters and return type
function add(a: number, b: number): number {
  return a + b;
}

// optional parameter and default value
function greet(name: string, greeting = "Hello", punctuation?: string) {
  return `${greeting}, ${name}${punctuation ?? "!"}`;
}

// arrow function
const double = (n: number): number => n * 2;

// a function that returns nothing
function log(message: string): void {
  console.log(message);
}

// async functions always return a Promise
async function loadTitle(id: number): Promise<string> {
  const res = await fetch(`/api/books/${id}`);
  const book = await res.json();
  return book.title;
}
```

`greeting = "Hello"` is inferred as `string` and optional for callers. `punctuation?` is `string | undefined` inside the function.

## Function types and callbacks

A function's type looks like an arrow function: `(params) => returnType`.

```ts
type Formatter = (value: number) => string;

const euro: Formatter = (v) => `€${v.toFixed(2)}`;   // v inferred as number

function formatAll(values: number[], format: Formatter): string[] {
  return values.map(format);
}

formatAll([1, 2.5], euro); // ["€1.00", "€2.50"]
```

When you pass an inline callback, TypeScript infers its parameter types from the expected function type, so you rarely annotate callback parameters yourself.

## The problem generics solve

Write a function returning the first item of an array:

```ts
function firstAny(items: any[]): any {
  return items[0];
}

const n = firstAny([1, 2, 3]); // type: any. All checking lost.
n.toUpperCase();               // no error, crashes at runtime
```

With a **type parameter** `T`, the function remembers which type went in:

```ts
function first<T>(items: T[]): T | undefined {
  return items[0];
}

const n = first([1, 2, 3]);         // T = number, so n: number | undefined
const s = first(["a", "b"]);        // T = string
const b = first<Book>([]);          // you can also set T explicitly
```

`<T>` declares a placeholder type. TypeScript fills it in from the argument, so callers usually don't write it. Think of it as a parameter, but for a type.

## Constraints: extends

Sometimes `T` must have certain properties. `extends` adds a requirement:

```ts
function findById<T extends { id: number }>(items: T[], id: number): T | undefined {
  return items.find((item) => item.id === id);
}

const book = findById(books, 3);   // type: Book | undefined (not just { id: number })
findById(["a", "b"], 1);            // Error: string doesn't have an id
```

Inside the function you can use `item.id` because of the constraint, and the caller still gets the full `Book` type back.

## Several type parameters

```ts
function mapValues<T, U>(items: T[], fn: (item: T) => U): U[] {
  return items.map(fn);
}

const titles = mapValues(books, (b) => b.title); // string[]
```

## Generic types

Types can have parameters too. This is perfect for API responses that share a wrapper:

```ts
type ApiResponse<T> = {
  data: T;
  page: number;
  total: number;
};

type BooksResponse = ApiResponse<Book[]>;
type AuthorResponse = ApiResponse<Author>;

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json() as Promise<T>;
}

const result = await fetchJSON<BooksResponse>("/api/books");
result.data[0].title; // fully typed
```

Remember that `fetchJSON<T>` only *tells* TypeScript what the data is; it doesn't check it. For data you don't control, validate it (for example with a Zod schema) before trusting the type.

## Common mistakes

- **Using `any` instead of a generic.** If the output type depends on the input type, that's a generic.
- **Generics that aren't needed.** `function log<T>(value: T): void` gains nothing over `value: unknown`. A type parameter should connect at least two places (input and output, or two inputs).
- **Forgetting the constraint**, then getting "Property 'id' does not exist on type 'T'". Add `T extends { id: number }`.
- **Forgetting `Promise<...>`** on async return types: an async function returning a string has the type `Promise<string>`.

## In short

- Annotate parameters, optional `?` parameters and defaults; `void` for no return value; `Promise<T>` for async.
- Function types look like `(value: number) => string`; callbacks get their types inferred.
- Generics (`<T>`) keep the link between input and output types; TypeScript usually infers `T`.
- `T extends { ... }` constrains what `T` can be; types like `ApiResponse<T>` can be generic too.

### Exercises
- Write a generic `last<T>(items: T[]): T | undefined` and check the inferred types for a number array and a `Book` array.
- Write a generic `findById<T extends { id: number }>(items: T[], id: number)` and use it with books and authors.
- In `ts-practice/src/fetch-books.ts`, write a typed `fetchJSON<T>(url): Promise<T>`, import `Book` from `./types.js`, and call it as `fetchJSON<ApiResponse<Book[]>>("http://localhost:3000/api/books")` while your `books-api` is running. Log the first title and run the file with `npx tsx src/fetch-books.ts`. (In Node the URL must be complete: `/api/books` alone only works in a browser.)
- Write `groupBy<T>(items: T[], getKey: (item: T) => string): Record<string, T[]>` and use it to group an array of books by genre (use `"none"` for books without one).

---lesson
id: ts-6
title: Utility types, keyof and typeof
time: 1h
video: Dave Gray — TypeScript Utility Types | https://www.youtube.com/watch?v=YN4RoihmVKM
docs: Utility types | https://www.typescriptlang.org/docs/handbook/utility-types.html
docs: keyof type operator | https://www.typescriptlang.org/docs/handbook/2/keyof-types.html
docs: typeof type operator | https://www.typescriptlang.org/docs/handbook/2/typeof-types.html
---
As a project grows you need many variations of the same type: a `Book` from the database has an `id`, the data to *create* a book doesn't, and a `PATCH` request may contain any subset of fields. Writing each variation by hand means updating four types every time you add a property. TypeScript can **derive** new types from existing ones instead, so there's one source of truth.

## Partial, Required, Pick and Omit

These built-in **utility types** transform an object type:

```ts
type Book = {
  id: number;
  title: string;
  year: number;
  read: boolean;
  author: { id: number; name: string };
  tags: string[];
};

// what POST /api/books accepts: no id, and the author and tags as ids
type NewBook = Omit<Book, "id" | "author" | "tags"> & { authorId: number; tagIds?: number[] };
type BookPatch = Partial<NewBook>;        // every property optional
type BookSummary = Pick<Book, "id" | "title">; // only id and title
type CompleteBook = Required<BookPatch>;  // every property required again
```

`Omit` removes the properties the server creates (`id`) or returns in a different form (`author`, `tags`), and `&` adds what the client sends instead. Now `createBook(data: NewBook)` and `updateBook(id: number, patch: BookPatch)` stay correct automatically: add a `pages` field to `Book`, and both follow.

## Record and readonly helpers

```ts
type Status = "todo" | "doing" | "done";

const columnTitles: Record<Status, string> = {
  todo: "To do",
  doing: "Doing",
  done: "Done",
};
```

`Record<Status, string>` requires **every** status as a key. Add `"blocked"` to `Status`, and TypeScript tells you `columnTitles` is missing it. `Readonly<Book>` makes every property read-only, and `ReadonlyArray<Book>` (or `readonly Book[]`) prevents `push` and other changes.

## keyof: the keys of a type

`keyof` produces a union of an object type's property names:

```ts
type BookKey = keyof Book; // "id" | "title" | "year" | "read" | "author" | "tags"

function sortBy<T>(items: T[], key: keyof T): T[] {
  return [...items].sort((a, b) => (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0));
}

sortBy(books, "year");   // fine
sortBy(books, "yeer");   // Error: not a key of Book
```

## Indexed access: T["key"]

You can read the type of one property, like reading a value from an object:

```ts
type Year = Book["year"];                 // number
type BookId = Book["id"];                 // number

function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const title = getProp(dune, "title");    // type: string
const year = getProp(dune, "year");      // type: number
```

`K extends keyof T` means "K must be one of T's keys", and `T[K]` is the type of that property. This is how libraries type things like `form.watch("email")`.

## typeof: the type of a value

In a type position, `typeof` gives you the type of an existing variable:

```ts
const defaultSettings = {
  theme: "dark",
  pageSize: 20,
  showRead: true,
};

type Settings = typeof defaultSettings;
// { theme: string; pageSize: number; showRead: boolean }
```

This is useful when the value comes first, like a config object.

## From a list of values to a union

Combining `as const`, `typeof` and indexed access turns an array into a union type, so you can keep a list for runtime (to render buttons) and a type, without repeating yourself:

```ts
export const STATUSES = ["todo", "doing", "done"] as const;
export type Status = (typeof STATUSES)[number]; // "todo" | "doing" | "done"

STATUSES.map((s) => `<button>${s}</button>`);   // runtime list
```

`(typeof STATUSES)[number]` reads as "the type of any item in this array".

The same idea works for object keys with `keyof typeof`:

```ts
const routes = { home: "/", books: "/books", about: "/about" };
type RouteName = keyof typeof routes; // "home" | "books" | "about"
```

## ReturnType, Parameters and Awaited

```ts
async function loadBooks() {
  return [{ id: 1, title: "Dune" }];
}

type Loaded = Awaited<ReturnType<typeof loadBooks>>; // { id: number; title: string }[]
```

`ReturnType` gives what a function returns (here a Promise), and `Awaited` unwraps the Promise. `Parameters<typeof fn>` gives a tuple of a function's parameter types.

## satisfies: check without widening

`satisfies` checks that a value matches a type but keeps the precise inferred type:

```ts
const columnTitles = {
  todo: "To do",
  doing: "Doing",
  done: "Done",
} satisfies Record<Status, string>;
```

You get the "every status is present" check, and the object keeps its exact keys for autocomplete.

## Common mistakes

- **Copy-pasting types** (`NewBook` written out by hand next to `Book`). They drift apart. Derive them with `Omit`, `Pick` and `Partial`.
- **Mixing up `typeof` in code and in types.** `typeof x === "string"` is a runtime check; `type T = typeof x` reads a type at compile time.
- **`keyof typeof` without `as const`** on arrays gives `number` keys or `string`, not your values. For arrays use `(typeof LIST)[number]` with `as const`.
- **Overdoing it.** Deeply nested utility types are hard to read. If a derived type gets confusing, writing it out is fine.

## In short

- `Partial`, `Required`, `Pick`, `Omit`, `Record`, `Readonly` derive new object types from existing ones.
- `keyof T` is the union of T's keys; `T[K]` is the type of one property.
- `typeof value` gets a value's type; `(typeof LIST)[number]` with `as const` turns a list into a union.
- `ReturnType`, `Parameters` and `Awaited` read types from functions; `satisfies` checks without widening.

### Exercises
- In `ts-practice/src/types.ts`, derive `NewBook` and `BookPatch` from `Book`, and write the types of `createBook` and `updateBook` as function types that use them, for example `type CreateBook = (data: NewBook) => Promise<Book>`.
- Create `STATUSES` with `as const`, derive the `Status` union from it, and build a `Record<Status, string>` of column titles.
- Write `getProp<T, K extends keyof T>(obj: T, key: K): T[K]` and check the inferred types for three different keys.
- Create a typed config object and derive a union of its keys with `keyof typeof`. Then use `satisfies` to check it against `Record<string, string>`.

---project
id: ts-p3
title: Type-safe utility library
summary: Convert your TDD utility library to strict TypeScript, with exported types and .d.ts files.
---
### The task
Take the utility library you built test-first in the Testing module and convert it to strict TypeScript. When you're done, anyone who installs it gets autocomplete and type errors in their editor, your tests still pass, and the build produces JavaScript plus `.d.ts` type definition files, exactly like a real npm package. This is the same kind of migration real teams do.

### What it must do
- All source and test files are `.ts`, checked with `"strict": true`.
- **Zero `any`** in the project (search for it), and no `as` assertions that hide real problems.
- Every exported function has typed parameters and an explicit return type.
- Meaningful exported types: for example `Currency = "EUR" | "USD" | "GBP"` and `FormatOptions` for money, `DateInput = Date | string | number` for dates, `TruncateOptions` for strings. Users can import them: `import type { Currency } from "your-lib"`.
- At least one **generic** function or type where it genuinely helps (for example `chunk<T>(items: T[], size: number): T[][]`, `sortBy<T>(items: T[], key: keyof T)`, or a `Result<T>` type).
- Runtime input checks stay: TypeScript protects TypeScript users, but JavaScript users can still pass anything.
- All existing tests pass, plus tests marked `// @ts-expect-error` proving that wrong calls are rejected by the type checker.
- `npm run build` runs `tsc` and emits `.js` and `.d.ts` files to `dist/`; `package.json` points `exports` and `types` at them.

### Steps
1. **Branch and install.** In your `tdd-utils` folder from the Testing module, create a `typescript` branch. Install `typescript` (and `@types/node` if you use Node APIs). Create `tsconfig.json` with `strict`, `module: "NodeNext"`, `declaration: true`, `outDir: "dist"`, `skipLibCheck`. Move source files into `src/` if they aren't already. Add a `typecheck` script (`tsc --noEmit`). Commit.
2. **Types first.** Create `src/types.ts` with the types your library is about: currencies, options objects, accepted inputs. Use literal unions and `as const` lists where values are fixed. Commit.
3. **Convert one file at a time.** Start with the file that has no imports. Rename it to `.ts`, annotate parameters and return types, and fix every error. Run `npm test` (Vitest runs `.ts` files without any setup) and `npm run typecheck`. Commit, then do the next file.
4. **Remove the weak spots.** Search for `any`, unnecessary `as` and `!`. Replace them with `unknown` plus narrowing, better types, or real checks. Add a generic function or type where it makes the API better.
5. **Convert the tests.** Rename test files to `.test.ts` and fix any errors. Wrong-type calls in your invalid-input tests now fail type-checking: put `// @ts-expect-error` on the line above each one. That comment *fails* if the line ever stops being an error, so it doubles as a type test.
6. **Build setup.** Create `tsconfig.build.json` that `extends` the main config and excludes `**/*.test.ts`. Add `"build": "tsc -p tsconfig.build.json"`. Run it and look inside `dist/`: `.js` files and matching `.d.ts` files.
7. **Package fields.** In `package.json` set `"exports": { ".": { "types": "./dist/index.d.ts", "default": "./dist/index.js" } }`, `"types": "./dist/index.d.ts"` and `"files": ["dist"]`. Add `dist` to `.gitignore`.
8. **Try it as a user.** Run `npm pack`, then in a separate small TypeScript project run `npm install ../path/to/your-lib-1.0.0.tgz`. Import a function, hover over it, and call it wrongly on purpose to see the error. Update the README with TypeScript examples, add `typecheck` and `build` to your CI workflow, and merge the branch.

### Hints
- Inside `.ts` files, keep writing relative imports with `.js` (`import { slugify } from "./slugify.js"`). TypeScript resolves them to the `.ts` file, and the compiled output works in Node.
- With `strict` on, indexing an array (`items[0]`) gives you the item type, not `| undefined`. If you want TypeScript to also warn about that, look at the `noUncheckedIndexedAccess` option.
- JSDoc comments (`/** Formats cents as a currency string. */`) above exported functions end up in the `.d.ts` files and show up when users hover.
- If a test needs to pass a wrong type on purpose and `@ts-expect-error` feels wrong, `"abc" as unknown as number` is the honest way to say "deliberately invalid".

### Stretch goals
- Add type-level tests with Vitest's `expectTypeOf` (for example, that `chunk([1, 2, 3], 2)` returns `number[][]`).
- Use branded types for money: `type Cents = number & { __brand: "Cents" }` so plain numbers can't be passed where cents are expected.
- Publish the package to npm with its types and install it in your Books frontend.

### Done when
- All files are `.ts`, `npm run typecheck` passes with `strict` on, and the project contains no `any`
- All tests pass, including `@ts-expect-error` tests for wrong calls
- `npm run build` creates `.js` and `.d.ts` files in `dist/`
- Another TypeScript project can install the packed library and gets autocomplete and type errors
- The library exports its main types and has at least one useful generic
- CI runs typecheck, tests and build

---section
id: ts-s2
title: TypeScript in React
intro: Use TypeScript in a React project: typed props, state, events and generic components. You'll finish by building a typed Kanban board.
---

---lesson
id: ts-8
title: TypeScript with React
time: 1.5h
video: ByteGrad — TypeScript in React (Complete Tutorial) | https://www.youtube.com/watch?v=TPACABQTHvM
docs: React TypeScript Cheatsheet | https://react-typescript-cheatsheet.netlify.app/
docs: react.dev: Using TypeScript | https://react.dev/learn/typescript
docs: Vite guide | https://vite.dev/guide/
---
React and TypeScript are the most common combination in frontend job listings. In a React app, types catch the mistakes you've probably made already: passing a prop with the wrong name, forgetting a required prop, calling `setBooks` with the wrong shape, reading `e.target.value` from the wrong element. You don't need anything new from React; you add types to what you already know.

## Setting up

Vite has a ready-made template:

```bash
npm create vite@latest kanban -- --template react-ts
cd kanban
npm install
npm run dev
```

Components now live in `.tsx` files (TypeScript + JSX). The template's tsconfig already has `strict` on. Note that `npm run dev` doesn't stop for type errors; `npm run build` runs `tsc` first and fails on them, and your editor shows them as you type.

## Typing props

Describe a component's props with a type and annotate the destructured parameter:

```tsx
type BookCardProps = {
  title: string;
  author: string;
  year?: number;                       // optional
  onDelete: (id: number) => void;      // a callback prop
  id: number;
};

export function BookCard({ id, title, author, year, onDelete }: BookCardProps) {
  return (
    <article>
      <h3>{title}</h3>
      <p>{author}{year !== undefined && ` (${year})`}</p>
      <button onClick={() => onDelete(id)}>Delete</button>
    </article>
  );
}
```

Now `<BookCard title="Dune" />` is an error that lists the missing props, and a misspelled prop name is caught immediately. You don't need to annotate the return type of components; TypeScript infers it.

Default values work as in JavaScript: `function Badge({ tone = "neutral" }: BadgeProps)`.

## children and reusing HTML props

`children` can be text, elements, lists of them or nothing. Its type is `ReactNode`:

```tsx
import type { ReactNode, ComponentProps } from "react";

type PanelProps = { title: string; children: ReactNode };

export function Panel({ title, children }: PanelProps) {
  return <section><h2>{title}</h2>{children}</section>;
}

// a button that accepts every normal <button> prop, plus a variant
type ButtonProps = ComponentProps<"button"> & { variant?: "primary" | "ghost" };

export function Button({ variant = "primary", ...rest }: ButtonProps) {
  return <button className={`btn btn-${variant}`} {...rest} />;
}
```

`import type` imports only a type, which is removed completely when compiling. The Vite template expects it for type-only imports.

## Typing state

`useState` infers the type from the initial value:

```tsx
const [count, setCount] = useState(0);         // number
const [query, setQuery] = useState("");        // string
```

When the initial value doesn't show the full type, pass it explicitly:

```tsx
type Book = { id: number; title: string };

const [books, setBooks] = useState<Book[]>([]);         // [] alone would be never[]
const [selected, setSelected] = useState<Book | null>(null);

setBooks([{ id: 1, title: "Dune" }]);  // fine
setBooks([{ id: 1, name: "Dune" }]);   // Error
```

With `Book | null`, you must check `selected` before using it, which prevents the classic "cannot read properties of null" crash.

## Typing events

Inline handlers get their types automatically:

```tsx
<input value={query} onChange={(e) => setQuery(e.target.value)} />
```

When you write the handler as a separate function, use React's event types:

```tsx
function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  setQuery(e.target.value);
}

function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  // ...
}
```

Not sure which type? Write the handler inline first and hover over `e`: the editor tells you. With a form action (`<form action={addBook}>`), the function receives `formData: FormData`, and `formData.get("title")` returns `FormDataEntryValue | null`, so check it's a string before using it.

## Generic components

A component can be generic, just like a function. This list works for any item type, and the item type flows into `renderItem`:

```tsx
type ListProps<T> = {
  items: T[];
  getKey: (item: T) => string | number;
  renderItem: (item: T) => ReactNode;
  emptyText?: string;
};

export function List<T>({ items, getKey, renderItem, emptyText = "Nothing here" }: ListProps<T>) {
  if (items.length === 0) return <p>{emptyText}</p>;
  return <ul>{items.map((item) => <li key={getKey(item)}>{renderItem(item)}</li>)}</ul>;
}

// usage: T is inferred as Book, so book.title autocompletes
<List items={books} getKey={(b) => b.id} renderItem={(b) => b.title} />
```

## Typing fetched data

`await res.json()` has type `any`. Give it a type at the boundary, and remember that this is only a promise to the compiler:

```tsx
useEffect(() => {
  async function load() {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/books`);
    const body: { data: Book[] } = await res.json();
    setBooks(body.data);
  }
  load();
}, []);
```

For data from `localStorage` or an API you don't control, validate it (with Zod or a type predicate) before trusting it.

## Common mistakes

- **`useState([])` without a type**: the state becomes `never[]` and nothing can be added. Use `useState<Book[]>([])`.
- **Typing props as `any`** or not at all. Every component gets a props type.
- **`React.FC` everywhere.** Old tutorials use `const Card: React.FC<Props> = ...`. Plain functions with typed props are simpler and recommended.
- **Ignoring errors because the dev server still runs.** Run `npm run build` (or `npx tsc -b`) before pushing.

## In short

- Use the `react-ts` Vite template; components live in `.tsx` files.
- Type props with a type alias; `ReactNode` for `children`, `ComponentProps<"button">` to reuse HTML props.
- `useState<Book[]>([])` and `useState<Book | null>(null)` when the initial value isn't enough.
- `React.ChangeEvent<HTMLInputElement>` and `React.FormEvent<HTMLFormElement>` for handlers; generic components with `<T>`.

### Exercises
- Create the `kanban` app as in "Setting up" (you'll turn it into this section's Kanban board project). As practice, build a typed `src/TodoList.tsx` with add, toggle and delete, using `useState<Todo[]>([])`, and show it in `App.tsx`. `npm run build` should pass.
- In `src/TodoList.tsx`, move the add form's `onChange` and `onSubmit` handlers into separate functions typed with `React.ChangeEvent<HTMLInputElement>` and `React.FormEvent<HTMLFormElement>`, without using `any`. `npm run build` should still pass.
- In `kanban`, write `src/Button.tsx`: a `Button` component that accepts all normal button props plus `variant: "primary" | "ghost"`. Check that `<Button variant="ghost" disabled>Save</Button>` works and `variant="big"` is a type error.
- In `kanban`, build the generic `List<T>` component in `src/List.tsx` and use it for two different item types (for example your todos and an array of strings).

---project
id: ts-p2
title: Typed Kanban board
summary: A React + TypeScript task board with three columns, typed state and localStorage.
---
### The task
Build a Trello-style board for your own tasks with React and TypeScript. Cards move between "To do", "Doing" and "Done". The goal is not a fancy UI but a well-typed app: the types are written first, and TypeScript guides you through every feature.

### What it must do
- Three columns: To do, Doing, Done. Each card shows its title, optional description, priority (low/medium/high) and created date.
- Add, edit and delete cards. Move cards between columns with ← and → buttons (a card in "To do" has no ←, a card in "Done" has no →).
- Filter by priority (all/low/medium/high) and search by text in title and description.
- Cards are saved in `localStorage` and restored on reload. Broken or old data in storage must not crash the app.
- Types: `Status` and `Priority` as literal unions derived from `as const` lists; a `Card` type; `NewCard` derived with `Omit`. No `any` anywhere.
- The add/edit dialog state is a **discriminated union**: `{ mode: "closed" } | { mode: "add"; status: Status } | { mode: "edit"; card: Card }`.
- A generic `List<T>` component renders the cards in each column.

### Steps
1. **Project.** Continue in your `kanban` folder from lesson 7.7 (created with the `react-ts` template); treat the steps below as a checklist and add only what's missing. Keep `List.tsx` and `Button.tsx`, remove the demo content and the practice `TodoList`, and check `npm run build` passes. Commit.
2. **Types first.** Write `src/types.ts`: `STATUSES` and `PRIORITIES` with `as const`, `Status` and `Priority` derived from them, `Card` (`id`, `title`, `description?`, `priority`, `status`, `createdAt`), and `NewCard = Omit<Card, "id" | "createdAt">`. Add `COLUMN_TITLES` with `satisfies Record<Status, string>`.
3. **Static layout.** Build `Board`, `Column` and `CardView` components with typed props, rendering a hard-coded array of 5 cards. Each column shows only the cards with its status.
4. **Generic List.** Write `List<T>` (items, `getKey`, `renderItem`, `emptyText`) and use it in `Column`. Check that `renderItem` knows its argument is a `Card`.
5. **State and moving.** Move the cards into `useState<Card[]>` in `App`. Write typed functions `moveCard(id: string, direction: "left" | "right")` and `deleteCard(id: string)`, pass them down as props and add the ← / → / delete buttons.
6. **Add and edit.** Add the dialog state union and a `CardForm` component with typed `onChange`/`onSubmit` handlers. Validate that the title isn't empty. New cards get `crypto.randomUUID()` as id and `new Date().toISOString()` as `createdAt`.
7. **Filter and search.** Add `priorityFilter` state typed as `Priority | "all"` and a search string. Compute the visible cards from state while rendering (no extra state needed).
8. **Test.** Set up Vitest, jsdom and React Testing Library as in the Testing module (`vite.config.ts` with `environment: "jsdom"`, a `src/setupTests.ts` file, and a `test` script). Write `src/App.test.tsx`: render `<App />`, add a card, click its → button with `user-event`, and check that the card now appears in the "Doing" column (`within(...)` helps you search inside one column). Run `npm test` and `npm run build`. Commit.
9. **Persist and deploy.** Load cards from `localStorage` in the `useState` initializer function and save them in a `useEffect` whenever they change. Treat the stored JSON as `unknown` and validate it before using it. Deploy to Netlify or Vercel.

### Hints
- Write the dialog `switch (dialog.mode)` with a `never` check in `default`. If you add a mode later, TypeScript shows you everything to update.
- `JSON.parse` returns `any`: assign it to `unknown` straight away. A Zod schema (`z.array(CardSchema).safeParse(data)`) is the easiest way to validate stored cards; fall back to an empty board when it fails.
- `<select>` values are plain strings. To turn one into a `Priority`, check it with `PRIORITIES.includes(...)` in a small type predicate instead of using `as`.
- Moving a card: find the index of its status in `STATUSES`, add or subtract 1, and create a new array with `map` (never mutate the card).
- Once cards are saved in `localStorage`, call `localStorage.clear()` in a `beforeEach` in your tests, so every test starts with an empty board.

### Stretch goals
- Drag and drop between columns with the native HTML drag events (`onDragStart`, `onDragOver`, `onDrop`, typed as `React.DragEvent<HTMLElement>`).
- Due dates with overdue cards highlighted.
- After the Advanced React module: move the board state into `useReducer` with the actions as a discriminated union, and extract a `useLocalStorage<T>` hook.

### Done when
- Cards can be added, edited, deleted and moved between all three columns
- Priority filter and text search work together
- Cards survive a page reload, and corrupt localStorage data doesn't crash the app
- `Status`, `Priority`, `Card` and the dialog state are typed as described, and the project contains no `any`
- A generic `List<T>` component renders the columns
- `npm run build` passes and the app is deployed
- At least one React Testing Library test passes (for example: moving a card to another column)
- The README explains what the project does and how to run it locally, with a screenshot

---section
id: ts-s3
title: TypeScript and Express
intro: Add types to a Node and Express backend, with Zod schemas as the single source of truth for request data. You'll finish by converting your Books API to TypeScript.
---

---lesson
id: ts-7
title: TypeScript with Node and Express
time: 2h
video: freeCodeCamp — TypeScript in Express Tutorial | https://www.youtube.com/watch?v=bYgphDEWwvs
docs: Node.js: TypeScript | https://nodejs.org/en/learn/typescript/introduction
docs: Zod basics and type inference | https://zod.dev/basics
docs: tsx | https://tsx.is/
---
On the backend, types protect the most important code you have: the code that reads requests and writes to your database. A typo in a column name or a forgotten `Number()` around a URL parameter becomes a compile error instead of a 500 in production. And with Zod, the schema that validates request bodies at runtime also produces the TypeScript type, so validation and types can never disagree.

## Setting up an Express project

```bash
npm install express zod
npm install -D typescript tsx @types/node @types/express
```

Packages that are written in JavaScript publish their types separately as `@types/...` packages (Express does; Zod is written in TypeScript and includes its types). A `tsconfig.json` for a Node API whose tests live in `test/`:

```json
{
  "compilerOptions": {
    "target": "ES2023",
    "module": "NodeNext",
    "strict": true,
    "outDir": "dist",
    "skipLibCheck": true,
    "verbatimModuleSyntax": true
  },
  "include": ["src", "test"]
}
```

`verbatimModuleSyntax` requires `import type` for imports that are only types, so it's always clear what disappears when compiling. This config includes `test/`, so `tsc --noEmit` checks your tests too. The build should compile only `src/`, so add a second file, `tsconfig.build.json`, that extends the first:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": { "rootDir": "src" },
  "include": ["src"]
}
```

`rootDir: "src"` makes `src/server.ts` compile to `dist/server.js` (not `dist/src/server.js`). Scripts:

```json
"scripts": {
  "dev": "tsx watch --env-file=.env src/server.ts",
  "typecheck": "tsc --noEmit",
  "build": "tsc -p tsconfig.build.json",
  "start": "node dist/server.js"
}
```

In development tsx runs the `.ts` files directly and loads `.env` with Node's `--env-file` flag; for production you build once and run the plain JavaScript in `dist/`. `start` has no `--env-file`, because in production the hosting platform sets the environment variables (like `DATABASE_URL`).

## Typed route handlers

Express's types describe `req` and `res`. When you write a handler inline, they're inferred. For handlers in separate controller files, import the types:

```ts
// src/controllers/books.ts
import type { Request, Response } from "express";
import * as books from "../data/books.js";
import { AppError } from "../utils/AppError.js";

export async function getBook(req: Request<{ id: string }>, res: Response) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) throw new AppError("id must be a number", 400);
  const book = await books.findById(id);
  if (!book) throw new AppError("Book not found", 404);
  res.json(book);
}
```

`Request<{ id: string }>` says this route has an `:id` parameter. URL parameters are **always strings**, and now TypeScript reminds you to convert them. `Request` has more type parameters, in this order: params, response body, request body, query: `Request<Params, ResBody, ReqBody, Query>`.

Express 5 sends errors thrown in `async` handlers to your error middleware automatically, so you don't need `try/catch` in every handler. (`AppError` is the class from the Express module; its typed version is at the end of this lesson.)

## Zod: one schema, two jobs

```ts
// src/schemas/book.ts
import { z } from "zod";

export const NewBookSchema = z.object({
  title: z.string().min(1),
  authorId: z.number().int().positive(),
  tagIds: z.array(z.number().int().positive()).optional(),
  year: z.number().int().max(new Date().getFullYear()),
  genre: z.string().optional(),
  read: z.boolean().default(false),
});

export const BookPatchSchema = NewBookSchema.partial();

export type NewBook = z.infer<typeof NewBookSchema>;
export type BookPatch = z.infer<typeof BookPatchSchema>;
```

`z.infer<typeof NewBookSchema>` produces `{ title: string; authorId: number; tagIds?: number[]; year: number; genre?: string; read: boolean }`. Add a field to the schema and the type updates by itself. There's no separate interface to forget.

## A typed validation middleware

```ts
// src/middleware/validate.ts
import type { RequestHandler } from "express";
import type { z } from "zod";

export function validate(schema: z.ZodType): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        error: "Invalid request body",
        details: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }
    req.body = result.data; // the cleaned data, with defaults applied
    next();
  };
}
```

And in the router and controller:

```ts
router.post("/", validate(NewBookSchema), createBook);

export async function createBook(req: Request<{}, unknown, NewBook>, res: Response) {
  const book = await books.create(req.body); // req.body is typed as NewBook
  res.status(201).json(book);
}
```

The `Request<{}, unknown, NewBook>` annotation is a promise that the middleware already validated the body; keep the two next to each other in the router so they stay in sync. Query strings work the same way, with one Express 5 detail: `req.query` can't be reassigned, so store parsed query values in `res.locals` or parse them inside the handler.

## Typing the database layer

With the `pg` library (and `@types/pg`), `query` accepts a row type:

```ts
// src/data/books.ts
import { pool } from "../db/pool.js";

export type Book = {
  id: number;
  title: string;
  year: number;
  genre: string | null;
  pages: number | null;
  read: boolean;
  author: { id: number; name: string };
  tags: string[];
};

export async function findById(id: number): Promise<Book | undefined> {
  const { rows } = await pool.query<Book>(
    `SELECT b.id, b.title, b.year, b.genre, b.pages, b.read,
            json_build_object('id', a.id, 'name', a.name) AS author,
            COALESCE(json_agg(t.name) FILTER (WHERE t.id IS NOT NULL), '[]') AS tags
     FROM books b
     JOIN authors a ON a.id = b.author_id
     LEFT JOIN book_tags bt ON bt.book_id = b.id
     LEFT JOIN tags t ON t.id = bt.tag_id
     WHERE b.id = $1
     GROUP BY b.id, a.id`,
    [id]
  );
  return rows[0];
}
```

The query is the kind you wrote in the Databases module, and `Book` is exactly the JSON your API returns; only the types are new. Columns that can be `NULL` in the database are `string | null` or `number | null` in the type. TypeScript can't check that the SQL really returns those columns; the row type is your promise. Keep all queries in one folder so these promises live in one place, and let your integration tests verify them. (If you used an ORM such as Drizzle or Prisma, it generates these types for you.)

## The error handler

```ts
// src/utils/AppError.ts
export class AppError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "AppError";
    this.status = status;
  }
}
```

The arguments are in the same order as in the Express module: `throw new AppError("Book not found", 404)`.

```ts
// src/middleware/errorHandler.ts
import type { ErrorRequestHandler } from "express";
import { z } from "zod";
import { AppError } from "../utils/AppError.js";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof z.ZodError) {
    res.status(400).json({
      error: "Invalid request",
      details: err.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
    });
    return;
  }
  if (err instanceof AppError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
};
```

Thrown values aren't guaranteed to be `Error`s, so narrow with `instanceof` before reading properties.

## Common mistakes

- **Missing `@types/express`**: "Could not find a declaration file for module 'express'". Install the types package.
- **Forgetting `.js` in relative imports** (`"../data/books"`). With `module: "NodeNext"`, write `"../data/books.js"` even though the file is `.ts`.
- **Trusting `req.query` types.** A query value can be a string, an array of strings (`?genre=a&genre=b`) or missing. Parse it with a Zod schema or check it with `typeof` before using it.
- **Running `npm start` without building.** `dist/` is stale or missing; run `npm run build` first (and in your deploy's build command).

## In short

- Install `@types/node` and `@types/express`; develop with `tsx watch --env-file=.env`, check `src` and `test` with `tsc --noEmit`, build only `src` with `tsc -p tsconfig.build.json`.
- Type handlers with `Request<Params, ResBody, ReqBody, Query>`; URL params are always strings.
- Zod schemas validate at runtime and give you types with `z.infer`, one source of truth.
- Give database rows explicit types, and narrow errors in the error handler.

### Exercises
- Create a practice folder `express-ts-practice`: `npm init -y`, add `"type": "module"`, install the packages and create both tsconfig files and the four scripts from the lesson. Add an `.env` file (just `PORT=3000` is fine: `--env-file` stops with an error if the file is missing) and `src/server.ts` with one `GET /health` route that returns `{ status: "ok" }`. Run `npm run build`, then `npm start`, and open `http://localhost:3000/health`.
- In `express-ts-practice/src/schemas/book.ts`, write a Zod schema for a `NewBook`, derive the type with `z.infer`, and hover over the type to see what Zod produced.
- In `express-ts-practice`, write the typed `validate` middleware in `src/middleware/validate.ts` and a `POST /api/books` route that uses it and simply answers 201 with the validated `req.body` (no database here; remember `app.use(express.json())`). With Thunder Client or Postman, a valid body should come back with `read: false` added, and an invalid one should get a 400 with `details`.
- Push `express-ts-practice` to GitHub with a workflow `.github/workflows/ci.yml` (checkout and setup-node as in lesson 6.5, then `npm ci`, `npm run typecheck` and `npm run build`) and get a green tick. (Your `books-api` has no `typecheck` script yet; you'll add these steps to its test workflow in this section's project.)

---project
id: ts-p1
title: Books API in TypeScript
summary: Convert your tested Express + Postgres Books API to strict TypeScript, without breaking a single test.
---
### The task
Convert your Book Library API (Express + PostgreSQL, with the test suite you wrote in the Testing module) to TypeScript. Nothing about its behaviour should change: every endpoint works the same and every test still passes. What changes is that the compiler now checks every request, query and response. This is exactly the kind of migration real teams do, and your tests are what make it safe.

### What it must do
- All source and test files are `.ts`, with `"strict": true`.
- Zero uses of `any` (search the project for it).
- Request body types come from Zod schemas with `z.infer`; no hand-written duplicates of the schemas.
- Database functions have explicit row types and return types (`Promise<Book | undefined>`, `Promise<{ data: Book[]; total: number }>`, etc.), and books keep the same JSON shape as before: `author: { id, name }` and `tags: string[]`.
- Controllers type their params, bodies and queries; URL params are converted and checked.
- The error handler and `AppError` are typed; thrown values are narrowed before use.
- Scripts: `dev` (`tsx watch --env-file=.env src/server.ts`), `typecheck` (`tsc --noEmit`, checks `src` and `test`), `build` (`tsc -p tsconfig.build.json`, compiles only `src`), `start` (`node dist/server.js`), `test`.
- All existing tests pass, and CI runs typecheck, tests and build.

### Steps
1. **Branch and tooling.** In your `books-api` folder, create a `typescript` branch. Install `typescript`, `tsx`, `@types/node`, `@types/express`, `@types/pg` and `@types/supertest`. Create `tsconfig.json` (strict, NodeNext, `outDir: "dist"`, `"include": ["src", "test"]`, no `rootDir`) with `"allowJs": true` so `.js` and `.ts` files can live together during the migration, and `tsconfig.build.json` that extends it with `"rootDir": "src"` and `"include": ["src"]`, as in the lesson. Move the code into `src/` if needed (tests stay in `test/`), set the `dev` script to `tsx watch --env-file=.env src/server.ts`, and check the API still runs. Commit.
2. **Utilities first.** Rename the files with the fewest imports (helpers, pagination parsing, `AppError`) to `.ts` and fix the errors. Run `npm run typecheck` and `npm test` after each file. Commit.
3. **Schemas and types.** Convert the Zod schema files and export `z.infer` types (`NewBook`, `BookPatch`, query types). Delete any hand-written interfaces that duplicate them.
4. **Database layer.** Convert `db/pool.js` and the data-access files (`data/books.js`, `data/authors.js`, `data/tags.js` become `.ts`). Define the row types (`Book` with `author: { id: number; name: string }` and `tags: string[]`, and `Author` with `id`, `name` and `born`) and use `pool.query<RowType>(...)`. Give every function an explicit return type, for example `findAll(...): Promise<{ data: Book[]; total: number }>`. If you convert `db/seed.js` too, run it with tsx in its script: `tsx --env-file=.env src/db/seed.ts`.
5. **Middleware and controllers.** Type the `validate` middleware, the error handler and every controller with `Request<Params, ResBody, ReqBody>`. Convert ids from strings with checks, not with `as`.
6. **App, server and tests.** Convert `app.ts` (still `export default app`), `server.ts`, the test helpers and test files. Remove `"allowJs"` and confirm there are no `.js` files left in `src/`. Search for `any` and remove every one.
7. **Build and run.** Add the `build` and `start` scripts, run `npm run build`, then `npm start`, and check a few endpoints against the compiled version. Update your hosting's build command (for example `npm ci && npm run build`) and start command.
8. **CI and merge.** Add `npm run typecheck` and `npm run build` steps to your GitHub Actions workflow. Push the branch, open a pull request on GitHub describing what changed and what you learned, wait for green, and merge.

### Hints
- Hover over values in VS Code to see what TypeScript infers. Many errors become obvious once you see the inferred type.
- Postgres returns `COUNT(*)` as a string; type it as `string` in the row type and convert with `Number()`, instead of pretending it's a number.
- To add a property to `req` (for example `req.user` from authentication), extend Express's `Request` type in a `src/types/express.d.ts` file with `declare global { namespace Express { interface Request { user?: { id: number } } } }`. This is the interface merging you read about.
- Vitest runs `.ts` test files with no extra setup, but it doesn't type-check them. That's what `npm run typecheck` is for.

### Stretch goals
- Type your responses too: `Response<BookResponse>`, so returning the wrong shape is a compile error.
- Generate OpenAPI documentation from your Zod schemas.
- Share the `types` between the API and your Books frontend (for example, a small shared package or a monorepo with npm workspaces).

### Done when
- Every file in `src/` and the tests is `.ts`, `npm run typecheck` passes in strict mode, and there is no `any`
- Request body types are derived from Zod schemas with `z.infer`
- Database functions have explicit row and return types
- `npm run build`, then `npm start`, runs the compiled API and all endpoints work
- All tests pass, and CI runs typecheck, tests and build on every push
- The changes were merged through a pull request with a description
- `.env.example` lists every environment variable with placeholder values, and `.env` is git-ignored
- The README explains what the project does and how to run it locally, with a screenshot

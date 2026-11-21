---module
id: testing
title: Testing
scrimba: Testing
weeks: 2 weeks
fullCourse: Vitest tutorial for beginners
intro: Write code that proves your code works. You'll learn Vitest for unit tests and TDD, Supertest for your Books API, React Testing Library for components and Playwright for end-to-end tests, and make GitHub run all of them on every push.
---

---section
id: testing-s1
title: Unit testing and TDD
intro: What tests are for, how to write them with Vitest, how to work test-first, and how to replace things like the network or the clock with fakes. You'll finish by building a small utility library entirely test-first.
---

---lesson
id: test-1
title: Why test? Types of tests
time: 45m
video: Fireship testing JavaScript explained
docs: Kent C. Dodds: the testing trophy | https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications
docs: Martin Fowler: the test pyramid | https://martinfowler.com/bliki/TestPyramid.html
---
So far you have checked your code by running it and looking: clicking around the page, sending a request in Postman, reading the terminal. That works for a small project, but every time you change something you would have to check *everything* again, and nobody does. An automated test is a small program that checks your program for you, in milliseconds, as often as you like. Tests are what let professional developers change code without fear, and employers look for them in your GitHub projects.

## What a test actually is

A test calls your code with some input and compares the result with what you expected. You can write one with nothing but Node:

```js
// slugify.check.js
import assert from "node:assert/strict";
import { slugify } from "./slugify.js";

assert.equal(slugify("Hello World"), "hello-world");
assert.equal(slugify("  Trim me  "), "trim-me");
console.log("All checks passed");
```

If `slugify` returns the wrong value, `assert.equal` throws an error that shows the expected and actual values, and the script stops. That is all a test is. A **test runner** like Vitest (next lesson) adds the comfort: it finds all your test files, runs them, shows a clear report of what passed and failed, and reruns them when you save.

## Arrange, Act, Assert

Almost every good test has three parts:

```js
// Arrange: prepare the input and any data the code needs
const cart = [{ price: 10, qty: 2 }, { price: 5, qty: 1 }];

// Act: call the thing you are testing (one call)
const total = cartTotal(cart);

// Assert: check the result
assert.equal(total, 25);
```

If a test is hard to split into these three parts, it is probably testing too many things at once. Write two tests instead.

## Three kinds of tests

- **Unit tests** check one small piece in isolation, usually a single function: `slugify`, `cartTotal`, a Zod schema. They're very fast (thousands per second) and tell you exactly what broke.
- **Integration tests** check several pieces working together. For your Books API: send a real HTTP request to an Express route that talks to a real test database, and check the response. Slower, but they catch the bugs that live *between* the pieces.
- **End-to-end (E2E) tests** drive a real browser like a user: open the page, type in the form, click "Add", see the new book in the list. They test the whole stack, but they're the slowest and break most easily.

The classic **testing pyramid** says: many unit tests at the bottom, fewer integration tests in the middle, a handful of E2E tests at the top. Kent C. Dodds' **testing trophy** puts more weight on integration tests, because they give the most confidence per test. Both agree on the important part: don't test everything through the browser, and don't stop at unit tests.

## Test behaviour, not implementation

A test should describe *what* the code does for its user, not *how* it does it inside. Compare:

- Behaviour: "`cartTotal` returns 0 for an empty cart."
- Implementation: "`cartTotal` calls `reduce` once."

If you later replace `reduce` with a `for` loop, the behaviour test still passes (correct: nothing broke for the user) while the implementation test fails (a false alarm). Tests that fail when nothing is broken teach people to ignore failing tests, which is the worst outcome.

## What to test

You can't test every possible input, so pick the interesting ones:

- **The normal case**: a typical, valid input.
- **Edge cases**: empty string, empty array, `0`, negative numbers, one item, a huge number.
- **Invalid input**: wrong type, missing field. What *should* happen: an error, a default?
- **Bugs you've fixed**: when you fix a bug, first write a test that reproduces it. It can never come back silently.

Tests also act as **documentation**: a list of test names like "returns 404 when the book doesn't exist" tells a new developer exactly how the code is supposed to behave, and unlike a README, it can't go out of date without someone noticing.

## Common mistakes

- **Testing only the happy path.** Most bugs live in the edge cases: empty input, missing data, the second click.
- **One giant test that checks ten things.** When it fails, you don't know which of the ten broke. Keep each test focused on one behaviour.
- **Tests that depend on each other.** If test B only passes after test A has run, running B alone (or in a different order) fails. Each test must set up its own data.
- **Aiming for "100% coverage" instead of confidence.** Coverage tells you which lines ran, not whether you checked the right thing.

## In short

- A test calls your code and compares the result with what you expected; a test runner automates running and reporting.
- Structure tests as Arrange → Act → Assert.
- Unit tests are fast and focused, integration tests check pieces together, E2E tests drive a real browser.
- Test behaviour that users rely on, especially edge cases and invalid input, not internal details.

### Exercises
- Write `slugify.check.js` using `node:assert/strict` for a simple `slugify` function and run it with `node`. Break `slugify` on purpose and read the error.
- List 5 things in your Books API that could break. Label each one unit, integration or E2E, and write one sentence on how you'd test it.
- For a `cartTotal(items)` function, write down 6 test cases (input → expected output): at least two edge cases and one invalid input.
- Write in your own words what "test behaviour, not implementation" means, with an example from one of your own projects.

---lesson
id: test-2
title: Vitest basics
time: 1.5h
video: Vitest crash course
docs: Vitest guide | https://vitest.dev/guide/
docs: expect API | https://vitest.dev/api/expect.html
docs: Vitest coverage | https://vitest.dev/guide/coverage.html
---
Vitest is the test runner you'll use for everything in this module: plain functions, Express APIs and React components. It's fast, works with ES Modules out of the box, and its API is compatible with Jest, the older runner you'll see in many tutorials and job descriptions. If you know one, you know the other.

## Setting up

In any project with a `package.json` (with `"type": "module"`):

```bash
npm install -D vitest
```

Add two scripts:

```json
"scripts": {
  "test": "vitest run",
  "test:watch": "vitest"
}
```

`vitest run` runs every test once and exits; use it in CI. Plain `vitest` starts **watch mode**: it keeps running and reruns the affected tests every time you save a file. Leave it open in a terminal while you work.

Vitest finds test files automatically: any file named `*.test.js` or `*.spec.js` (also `.ts`, `.jsx`, `.tsx`). Put `math.test.js` next to `math.js`, or put all tests in a `test/` folder; both are common.

## Your first test file

```js
// math.js
export function add(a, b) {
  return a + b;
}

export function divide(a, b) {
  if (b === 0) throw new RangeError("Cannot divide by zero");
  return a / b;
}
```

```js
// math.test.js
import { describe, it, expect } from "vitest";
import { add, divide } from "./math.js";

describe("add", () => {
  it("adds two positive numbers", () => {
    expect(add(2, 3)).toBe(5);
  });

  it("handles negative numbers", () => {
    expect(add(-2, -3)).toBe(-5);
  });
});

describe("divide", () => {
  it("throws when dividing by zero", () => {
    expect(() => divide(1, 0)).toThrow("Cannot divide by zero");
  });
});
```

- `describe` groups related tests under a name. It's optional but makes the report readable.
- `it` (or its alias `test`) defines one test: a name that reads like a sentence, and a function.
- `expect(value)` starts an assertion; the **matcher** after it (`toBe`, `toThrow`…) does the check.

Run `npm test` and you'll see each file with a green tick per test.

## The matchers you'll use most

| Matcher | Use it for |
|---|---|
| `toBe(x)` | primitives: numbers, strings, booleans (`===`) |
| `toEqual(x)` | objects and arrays, compared by content |
| `toBeNull()`, `toBeUndefined()`, `toBeTruthy()` | the obvious cases |
| `toContain(x)` | an array contains an item, or a string contains a substring |
| `toHaveLength(n)` | arrays and strings |
| `toMatch(/regex/)` | strings matching a pattern |
| `toBeCloseTo(0.3)` | decimals, where `0.1 + 0.2` is not exactly `0.3` |
| `toThrow("message")` | a function throws |

Put `.not` in front of any matcher to reverse it: `expect(list).not.toContain("x")`.

The difference between `toBe` and `toEqual` matters: `expect({ a: 1 }).toBe({ a: 1 })` **fails**, because they are two different objects in memory. `toEqual` compares what's inside them.

## Testing async code

Make the test function `async` and `await` the result, exactly like normal code:

```js
it("loads the settings", async () => {
  const settings = await loadSettings();
  expect(settings.theme).toBe("dark");
});

it("rejects for a missing file", async () => {
  await expect(loadSettings("nope.json")).rejects.toThrow();
});
```

If you forget `await`, the test finishes before the promise does, and it can pass even though the code is broken.

## Many examples, one test: it.each

When you want to check the same behaviour with a table of inputs:

```js
it.each([
  ["Hello World", "hello-world"],
  ["  spaces  ", "spaces"],
  ["Café au lait", "cafe-au-lait"],
])("slugify(%s) → %s", (input, expected) => {
  expect(slugify(input)).toBe(expected);
});
```

Each row becomes its own test, with `%s` replaced by the values in the name.

## Reading a failure

When a test fails, Vitest prints the test name, the line of the failing `expect`, and a diff: `- Expected` and `+ Received`. Read the diff first: it usually tells you exactly what's wrong (a missing space, a number as a string, an extra property). While debugging, `it.only(...)` runs just that one test in the file, and `it.skip(...)` skips one. Remove both before you commit.

## Coverage

```bash
npm install -D @vitest/coverage-v8
npx vitest run --coverage
```

This prints a table showing what percentage of lines and branches your tests executed, and creates a `coverage/` folder with an HTML report (add it to `.gitignore`). Open `coverage/index.html` to see uncovered lines highlighted in red: they are where to write your next test.

## Common mistakes

- **`toBe` on objects or arrays.** Use `toEqual`.
- **`expect(divide(1, 0)).toThrow()`.** The error is thrown *before* `expect` runs, so the test crashes. Wrap the call in a function: `expect(() => divide(1, 0)).toThrow()`.
- **Forgetting `await`** in async tests, so the test passes no matter what.
- **Leaving `it.only` in a file.** Every other test silently stops running.

## In short

- `npm i -D vitest`; `vitest` for watch mode, `vitest run` for a single run.
- `describe` groups, `it` defines a test, `expect(x).matcher()` checks.
- `toBe` for primitives, `toEqual` for objects, `() =>` around code that should throw.
- `await` async results; use `it.each` for tables of examples; `--coverage` shows untested lines.

### Exercises
- Set up Vitest in a new folder and write tests for `add` and `divide` above. Run both `npm test` and `npm run test:watch`.
- Write tests for a `slugify(title)` function: spaces, uppercase, punctuation, accents, empty string. Use `it.each` for the simple cases.
- Copy your `getDataByQueryParams` filter from the Node module and test it with at least 4 cases, including "no filters" and "no matches".
- Make one test fail on purpose (change an expected value) and explain each part of the error output in your own words. Then run coverage and find one uncovered line.

---lesson
id: test-3
title: Test-driven development (TDD)
time: 1.5h
video: TDD test driven development JavaScript tutorial
docs: Kata: String Calculator | https://osherove.com/tdd-kata-1
docs: Martin Fowler: test-driven development | https://martinfowler.com/bliki/TestDrivenDevelopment.html
---
Usually you write code first and tests afterwards (if there's time). **Test-driven development** turns this around: you write a failing test first, then just enough code to make it pass. It sounds slow, but it forces you to decide exactly what the code should do before you write it, it keeps each step tiny, and when you're finished you have a complete set of tests for free. Even if you don't use TDD for everything, it's the best way to get good at writing tests.

## The cycle: red, green, refactor

1. **Red**: write one small test for behaviour that doesn't exist yet. Run it and watch it fail. (If it passes, the test is wrong or the behaviour already exists.)
2. **Green**: write the *simplest* code that makes it pass. Hard-coding a value is allowed at this stage.
3. **Refactor**: now that the test protects you, clean up: better names, remove duplication. Run the tests again: still green.

Then repeat with the next small behaviour. Each cycle takes a few minutes. Commit whenever you're green.

## A worked example: formatDuration

Goal: `formatDuration(seconds)` turns `75` into `"1:15"`. Start with watch mode running (`npm run test:watch`).

**Cycle 1, red.** The simplest case:

```js
// duration.test.js
import { describe, it, expect } from "vitest";
import { formatDuration } from "./duration.js";

describe("formatDuration", () => {
  it("formats zero as 0:00", () => {
    expect(formatDuration(0)).toBe("0:00");
  });
});
```

It fails: `duration.js` doesn't exist. **Green**, the simplest thing:

```js
// duration.js
export function formatDuration(seconds) {
  return "0:00";
}
```

That looks like cheating, but it's on purpose: the next test will force the real logic.

**Cycle 2, red.**

```js
it("formats less than a minute with padded seconds", () => {
  expect(formatDuration(5)).toBe("0:05");
});
```

**Green**:

```js
export function formatDuration(seconds) {
  return `0:${String(seconds).padStart(2, "0")}`;
}
```

**Cycle 3, red.**

```js
it("formats minutes and seconds", () => {
  expect(formatDuration(75)).toBe("1:15");
});
```

**Green**:

```js
export function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}
```

All three tests pass. **Refactor**: the code is already small, so maybe just rename `rest` to `secs`. Tests still green. Commit.

**Cycle 4, red**, an error case: what should `formatDuration(-1)` do? You decide now, in the test, and that decision becomes documentation:

```js
it("throws a RangeError for negative input", () => {
  expect(() => formatDuration(-1)).toThrow(RangeError);
});
```

Green: add `if (seconds < 0) throw new RangeError("seconds must be 0 or more");` at the top. Next cycles could cover hours (`3725` → `"1:02:05"`), decimals and non-numbers.

## Why the tiny steps?

- Each failing test tells you **exactly** what to do next, so you never sit wondering where to start.
- If something breaks, you only changed a few lines since the last green, so the bug is easy to find (or `git checkout .` and try again).
- Writing the test first makes you design the function from the **caller's** point of view: its name, arguments and return value. Awkward-to-test code usually means an awkward API.
- Adding a test that passes immediately is fine when you're checking an edge case, but in normal cycles, a test you never saw fail might not test anything.

## When TDD fits (and when it doesn't)

TDD shines for logic with clear inputs and outputs: formatting, calculations, validation, parsers, game rules. It's harder when you're still exploring (trying out a new library, sketching a layout). A common approach: spike (experiment) without tests, throw the spike away, then build the real thing test-first.

**Katas** are small practice problems designed for TDD, like the String Calculator kata linked above. Doing one kata several times is a great way to get the rhythm into your fingers.

## Common mistakes

- **Writing several tests at once**, then a lot of code. You lose the step-by-step guidance. One test, then make it pass.
- **Writing more code than the test needs.** Every line of logic should be there because a test demanded it; otherwise it's untested.
- **Skipping the refactor step.** Green code that's messy stays messy. The tests are there so cleaning up is safe.
- **Not watching the test fail.** Always see red first; it proves the test can actually catch a problem.

## In short

- Red (failing test) → Green (simplest code that passes) → Refactor (clean up, still green).
- Take tiny steps; commit on every green.
- Decide behaviour, including errors, in the test before writing code.
- Use TDD for logic with clear inputs and outputs; practise with katas.

### Exercises
- Follow the `formatDuration` example yourself, then continue with TDD to support hours (`3725` → `"1:02:05"`).
- Do the String Calculator kata (steps 1–5) with TDD. Commit after each green step and look at your git log afterwards.
- Build `validatePassword(password)` TDD-style. It returns an array of error messages (empty when valid): at least 8 characters, contains a number, contains an uppercase letter.
- Do the String Calculator kata again from scratch a few days later and compare how long it took.

---lesson
id: test-4
title: Mocks, spies and fake timers
time: 1h
video: Vitest mocking tutorial vi.fn vi.mock
docs: Vitest mocking | https://vitest.dev/guide/mocking.html
docs: Vitest vi API | https://vitest.dev/api/vi.html
---
Some code is hard to test because it depends on something outside your control: a network request, the current date, `Math.random()`, a `setTimeout`. A test that calls a real weather API is slow, fails when you're offline, and gets a different answer every day. **Test doubles** (mocks, spies, fakes) replace these dependencies during a test so you control exactly what they do. Vitest provides them through the `vi` object.

## vi.fn(): a function that records its calls

`vi.fn()` creates a fake function that remembers every call. It's perfect for callbacks:

```js
import { it, expect, vi } from "vitest";

function forEachEven(numbers, callback) {
  for (const n of numbers) if (n % 2 === 0) callback(n);
}

it("calls the callback for each even number", () => {
  const callback = vi.fn();

  forEachEven([1, 2, 3, 4], callback);

  expect(callback).toHaveBeenCalledTimes(2);
  expect(callback).toHaveBeenCalledWith(2);
  expect(callback).toHaveBeenLastCalledWith(4);
});
```

You can also tell it what to return: `vi.fn().mockReturnValue(42)`, or for async functions `vi.fn().mockResolvedValue({ id: 1 })` (returns a promise that resolves) and `mockRejectedValue(new Error("boom"))`.

## vi.spyOn(): watch or replace an existing function

`vi.spyOn(object, "method")` wraps a real method. Most often you use it to replace `fetch`:

```js
// weather.js
export async function getTemperature(city) {
  const res = await fetch(`https://api.example.com/weather?city=${city}`);
  if (!res.ok) throw new Error(`Weather request failed: ${res.status}`);
  const data = await res.json();
  return Math.round(data.temp);
}
```

```js
// weather.test.js
import { it, expect, vi, afterEach } from "vitest";
import { getTemperature } from "./weather.js";

afterEach(() => {
  vi.restoreAllMocks(); // put the real fetch back after every test
});

it("returns the rounded temperature", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue({
    ok: true,
    json: async () => ({ temp: 21.6 }),
  });

  expect(await getTemperature("Oslo")).toBe(22);
  expect(fetch).toHaveBeenCalledWith(expect.stringContaining("city=Oslo"));
});

it("throws when the API fails", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: false, status: 500 });

  await expect(getTemperature("Oslo")).rejects.toThrow("500");
});
```

The fake response only needs the parts your code uses (`ok`, `status`, `json`). `afterEach` is a **hook**: it runs after every test in the file. There's also `beforeEach`, `beforeAll` and `afterAll`. Restoring mocks in `afterEach` makes sure one test's fake never leaks into the next.

`expect.stringContaining(...)` is an **asymmetric matcher**: it matches any string containing that text, so you don't have to repeat the whole URL.

## vi.mock(): replace a whole module

When your code imports a module you want to fake, `vi.mock` replaces it for the whole test file:

```js
import { it, expect, vi } from "vitest";
import { sendWelcome } from "./signup.js";
import { sendEmail } from "./email.js";

vi.mock("./email.js", () => ({
  sendEmail: vi.fn().mockResolvedValue(true),
}));

it("sends a welcome email", async () => {
  await sendWelcome("ana@example.com");
  expect(sendEmail).toHaveBeenCalledWith("ana@example.com", expect.any(String));
});
```

Vitest moves `vi.mock` calls to the top of the file before the imports run, so `signup.js` receives the fake `sendEmail`. Use module mocks sparingly: the more you fake, the less your test proves.

## Fake timers: control time

For `setTimeout`, `setInterval` and `new Date()`, Vitest can replace the clock:

```js
import { it, expect, vi, beforeEach, afterEach } from "vitest";
import { debounce } from "./debounce.js";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

it("only calls the function once, after the delay", () => {
  const fn = vi.fn();
  const debounced = debounce(fn, 300);

  debounced("a");
  debounced("b");
  expect(fn).not.toHaveBeenCalled();

  vi.advanceTimersByTime(300);
  expect(fn).toHaveBeenCalledOnce();
  expect(fn).toHaveBeenCalledWith("b");
});

it("knows what day it is", () => {
  vi.setSystemTime(new Date("2026-01-01T10:00:00"));
  expect(new Date().getFullYear()).toBe(2026);
});
```

`advanceTimersByTime(300)` instantly runs everything scheduled in the next 300 ms. No real waiting, so the test takes microseconds. `setSystemTime` freezes "now", which makes functions like `timeAgo(date)` testable.

For randomness: `vi.spyOn(Math, "random").mockReturnValue(0.5)`.

## Mock at the boundaries

Fake the things at the **edge** of your program: network, clock, randomness, email, payment. Don't mock your own small functions: if `cartTotal` calls `applyDiscount`, let it call the real one. Often the cleanest option is to pass dependencies in as arguments (`createGame({ shuffle })`, `timeAgo(date, now)`), so tests can give a fixed value without any mocking tools at all.

## Common mistakes

- **Not restoring mocks.** A fake `fetch` from one test breaks the next. Use `afterEach(() => vi.restoreAllMocks())`.
- **Forgetting `vi.useRealTimers()`** after fake timers, so later tests or libraries hang.
- **Mocking so much that the test only tests the mocks.** If every line of the code under test is faked, the test proves nothing.
- **A fake response with the wrong shape** (for example `json` as a value instead of a function). Match exactly what your code calls.

## In short

- `vi.fn()` records calls; check them with `toHaveBeenCalledWith` and friends.
- `vi.spyOn(globalThis, "fetch").mockResolvedValue(...)` fakes network calls; restore in `afterEach`.
- `vi.mock("./module.js")` replaces a whole module; use it sparingly.
- `vi.useFakeTimers()`, `advanceTimersByTime` and `setSystemTime` control time.
- Mock at the boundaries, or pass dependencies in as arguments.

### Exercises
- Write `forEachEven` and test it with `vi.fn()`, including a test that the callback is never called for `[1, 3, 5]`.
- Test a `getWeather(city)` function by mocking `fetch`: success, a 404 response, and a network error (`mockRejectedValue`).
- Write a `debounce(fn, ms)` function and test it with fake timers: one call, many quick calls, and two calls further apart than `ms`.
- Write `timeAgo(date)` returning `"just now"`, `"5 minutes ago"`, `"2 days ago"`, and test it with `vi.setSystemTime`.

---project
id: test-p2
title: TDD utility library
summary: Build a small npm-style library (money, dates or strings) entirely test-first.
---
### The task
Build a small, genuinely useful JavaScript library entirely test-first: no line of logic without a failing test before it. You choose the theme. The result is a well-tested package with a README, and a git history that shows employers you know how to work with TDD. In the TypeScript module you'll convert this same library to TypeScript, so build it carefully.

### What it must do
- Pick **one** theme:
  - **Money**: `add`, `subtract`, `multiply` and `split` amounts without floating-point errors (work in cents), `format(cents, currency)` → `"€1,234.50"`, `parse("€1,234.50")` → `123450`.
  - **Dates**: `timeAgo(date)`, `isWeekend(date)`, `addBusinessDays(date, n)`, `daysBetween(a, b)`, `formatShort(date)`, `startOfWeek(date)`.
  - **Strings**: `slugify`, `truncate(text, max)`, `capitalize`, `pluralize(count, word)`, `initials(name)`, `wordCount`, `mask(cardNumber)`.
- At least **6 exported functions**, all exported from one entry file `index.js`.
- At least **30 tests**, covering normal cases, edge cases (empty, zero, negative, huge, unicode) and invalid input.
- Invalid input throws a `TypeError` or `RangeError` with a helpful message (`"truncate: max must be a positive integer"`), and every such error has a test.
- At least one function depends on the current time or on randomness, and is tested with fake timers or a spy.
- `npm test` runs all tests once; `npm run coverage` shows at least 90% line coverage.
- A README with installation and a usage example for every function.

### Steps
1. **Setup.** Create the folder, `npm init -y`, add `"type": "module"`, install Vitest, add `test`, `test:watch` and `coverage` scripts. Write one throwaway test (`expect(1 + 1).toBe(2)`), see it pass, delete it. Run `git init` with a `.gitignore` (`node_modules`, `coverage`). Commit.
2. **Plan.** Write `TODO.md`: one heading per function and, under it, a list of behaviours written like test names ("truncate leaves short text unchanged", "truncate adds … when cutting"). This is your to-do list for the whole project.
3. **First function, TDD.** Pick the simplest function. Take one behaviour from `TODO.md`, write the test, see red, make it green with minimal code, refactor, commit. Repeat until that function's list is done. Tick items off as you go.
4. **The other core functions.** Same cycle for each remaining function. When you have many input → output examples for one behaviour, use `it.each`.
5. **Errors and edge cases.** Go back over every function and add tests for empty input, zero, negative numbers, very large numbers, non-ASCII characters and wrong types. Make each one pass.
6. **Time or randomness.** Build your time- or random-dependent function test-first, using `vi.useFakeTimers()` with `vi.setSystemTime(...)`, or `vi.spyOn(Math, "random")`. Restore real timers and mocks in `afterEach`.
7. **Coverage and refactor.** Run `npm run coverage`, open the HTML report and add tests for any red lines or branches. Then refactor anything messy (duplicate checks into a small helper, clearer names) with the tests running in watch mode.
8. **Public API and README.** Create `index.js` that re-exports every function. Add one test file that imports from `index.js` to check the exports exist. Write the README by copying examples from your tests. Push to GitHub.

### Hints
- **Money**: never store `12.5`; store `1250` cents. `0.1 + 0.2 !== 0.3` in JavaScript, and that bug is exactly what this library prevents. For `split(1000, 3)`, decide where the leftover cent goes (`[334, 333, 333]`) and test it.
- **Money**: `Intl.NumberFormat` is great for `format`, but some locales put a special non-breaking space (` `) in the output. If a test fails with two strings that *look* identical, that's the reason.
- **Dates**: months are 0-based in `new Date(2026, 0, 15)` (that's January). Create test dates with explicit times so time zones don't surprise you.
- **Strings**: to remove accents, `text.normalize("NFD").replace(/[̀-ͯ]/g, "")` turns `"Café"` into `"Cafe"`.
- Commit after every green step with a message like `truncate: adds ellipsis`. Your history then tells the TDD story.

### Stretch goals
- Add JSDoc comments (`/** @param {number} cents */`) to every function so editors show help on hover.
- Publish the package to npm under a scoped name (`@yourname/money`) and install it in another project.
- Add a second theme to the same library.

### Done when
- At least 6 exported functions and 30+ tests, all passing with `npm test`
- `npm run coverage` shows 90% or more line coverage
- Every invalid-input error is covered by a test
- At least one test uses fake timers or a spy on `Math.random`
- The README shows a usage example for every function
- The git history shows small commits, one per green step

---section
id: testing-s2
title: Testing APIs
intro: Test your Express routes from the outside with Supertest, against a real test database, and make GitHub run your tests on every push. You'll finish by giving your Books API a complete test suite with CI.
---

---lesson
id: test-5
title: Testing APIs with Supertest
time: 2h
video: Supertest Express API testing tutorial
docs: Supertest | https://github.com/ladjs/supertest
docs: Vitest config reference | https://vitest.dev/config/
docs: GitHub Actions documentation | https://docs.github.com/en/actions
---
Your Books API is the kind of code that benefits most from tests: it has many routes, many error cases, and it talks to a database. Clicking through every request in Postman after each change takes ages. With **Supertest** you send real HTTP requests to your Express app from a test file, check the status code and JSON, and run the whole set in a few seconds. Add a CI workflow and GitHub runs it for you on every push.

## Step 1: separate the app from the server

Supertest needs your Express `app` *without* it listening on a port. Split your entry file in two:

```js
// app.js: builds and exports the app, doesn't start it
import express from "express";
import { booksRouter } from "./routes/books.js";
import { errorHandler, notFound } from "./middleware/errors.js";

export const app = express();
app.use(express.json());
app.use("/api/books", booksRouter);
app.use(notFound);
app.use(errorHandler);
```

```js
// server.js: the only file that calls listen()
import { app } from "./app.js";

const port = process.env.PORT ?? 3000;
app.listen(port, () => console.log(`Listening on ${port}`));
```

Your `start` script now runs `server.js`. Tests import `app.js`.

## Step 2: your first Supertest test

```bash
npm install -D vitest supertest
```

```js
// test/books.test.js
import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../app.js";

describe("GET /api/books", () => {
  it("returns a list of books", async () => {
    const res = await request(app).get("/api/books");

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
```

`request(app)` starts the app on a temporary port, sends the request and closes it again. `res.body` is the parsed JSON. Sending data works like this:

```js
const res = await request(app)
  .post("/api/books")
  .send({ title: "Dune", author: "Frank Herbert", year: 1965 });

expect(res.status).toBe(201);
expect(res.body).toMatchObject({ title: "Dune", year: 1965 });
expect(res.body.id).toEqual(expect.any(Number));
```

`toMatchObject` checks only the properties you list and ignores the rest, which is handy when the response also contains `id` or timestamps.

## Step 3: a separate test database

Tests create and delete data, so they must **never** touch your development or production database. Create a second database (for example `books_test`) with the same tables, and point the tests at it with a test env file:

```bash
# .env.test
DATABASE_URL=postgres://postgres:postgres@localhost:5432/books_test
```

Load it before any test code runs, using a Vitest setup file:

```js
// test/setup.js
import fs from "node:fs";

if (fs.existsSync(".env.test")) process.loadEnvFile(".env.test");

if (!process.env.DATABASE_URL?.includes("test")) {
  throw new Error("Refusing to run tests: DATABASE_URL is not a test database");
}
```

```js
// vitest.config.js
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["./test/setup.js"],
    fileParallelism: false, // test files share one database: run them one at a time
  },
});
```

The safety check costs one line and can save your real data. `fileParallelism: false` matters because Vitest normally runs test files in parallel, and two files resetting the same database at the same time cause random failures.

## Step 4: reset the data before each test

Every test should start from the same known state. Write a helper that empties the tables and inserts a few fixtures:

```js
// test/helpers.js
import { pool } from "../db/pool.js";

export async function resetDb() {
  await pool.query("TRUNCATE books, authors RESTART IDENTITY CASCADE");
  const { rows } = await pool.query(
    "INSERT INTO authors (name) VALUES ('Ursula K. Le Guin') RETURNING id"
  );
  await pool.query(
    "INSERT INTO books (title, year, author_id) VALUES ('A Wizard of Earthsea', 1968, $1)",
    [rows[0].id]
  );
}
```

```js
import { beforeEach, afterAll } from "vitest";
import { resetDb } from "./helpers.js";
import { pool } from "../db/pool.js";

beforeEach(resetDb);
afterAll(() => pool.end()); // close connections so Vitest can exit
```

Now each test is independent: a test that deletes a book can't break a test that lists books.

## What to test for each endpoint

For every route, test the happy path *and* each error case your API promises: `GET /api/books/999` → 404 with `{ error }`; `POST` with a missing title → 400; `PATCH` with an invalid year → 400. After a write, check the database really changed, for example with a follow-up `GET`.

## Step 5: run the tests on GitHub (CI)

**Continuous integration** means a server runs your tests on every push. With GitHub Actions you add one file:

```yaml
# .github/workflows/test.yml
name: tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:17
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: books_test
        ports:
          - 5432:5432
        options: --health-cmd pg_isready --health-interval 5s --health-retries 10
    env:
      DATABASE_URL: postgres://postgres:postgres@localhost:5432/books_test
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v5
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm run db:migrate
      - run: npm test
```

The `services` block starts a temporary Postgres for the job; `db:migrate` should create your tables. Push, open the **Actions** tab on GitHub and watch it run. A red cross on a commit means a test failed.

## Common mistakes

- **Importing `server.js` in tests.** The app starts listening and the port is "already in use" on the second file. Import `app.js`.
- **Tests running against the dev database** and deleting your data. Use a separate database and the safety check.
- **Vitest hangs after the tests finish.** An open database pool keeps Node alive; call `pool.end()` in `afterAll`.
- **Tests that depend on ids** like `/api/books/1`. Use the id returned when you created the fixture, or `RESTART IDENTITY` as above.

## In short

- Export `app` from `app.js`; only `server.js` calls `listen()`.
- `await request(app).get(url)` / `.post(url).send(body)`, then check `res.status` and `res.body`.
- Use a separate test database, reset it in `beforeEach`, close the pool in `afterAll`, run files one at a time.
- A GitHub Actions workflow with a Postgres service runs everything on every push.

### Exercises
- Split your Books API into `app.js` and `server.js` and check `npm start` still works.
- Create the test database, the setup file and a single Supertest test for `GET /api/books`. Make it pass.
- Write tests for `GET /api/books/:id`: an existing book (200), a missing id (404) and a non-numeric id (400 or 404, whatever your API promises).
- Add the GitHub Actions workflow, push, and get a green tick. Then break a test on purpose, push, and look at the failed run's log.

---project
id: test-p1
title: Fully tested Books API
summary: Give your Express + Postgres Books API a full test suite and run it on GitHub for every push.
---
### The task
Add a professional test suite to your Book Library API (Express + PostgreSQL, from the Express and Databases modules) and make GitHub run it automatically on every push and pull request. When you're done you can refactor anything in the API and know within seconds whether you broke something. A green test badge in the README is something employers notice.

### What it must do
- `app.js` exports the app; `server.js` is the only file that calls `listen()`.
- **Unit tests** for every helper that doesn't need the database: pagination parsing (`?page=abc` → page 1), filter building, and your Zod schemas (valid data passes, each invalid field fails).
- **Integration tests** with Supertest for **every** endpoint (books, authors, tags), each with its happy path and every error case it can return: 400 for invalid input, 404 for missing resources (plus 401/403 if your API has authentication).
- Write tests also check the database changed, for example with a follow-up `GET`.
- Tests run against a **separate Postgres test database**, which is reset before every test. No test depends on another.
- `npm test` runs everything once; `npm run coverage` shows at least 80% line coverage.
- A GitHub Actions workflow runs the tests (with a Postgres service container) on every push and pull request, and the README shows a status badge.

### Steps
1. **Split app and server.** Move `listen()` into `server.js`, export `app` from `app.js`, update the `start`/`dev` scripts. Check the API still runs. Commit.
2. **Create the test database.** Create `books_test` (`CREATE DATABASE books_test;` in psql, or a second database on your local or Docker Postgres). Add a `db:migrate` script that runs your schema file against `DATABASE_URL`, and run it with the test URL. Add `.env.test`.
3. **Set up Vitest.** Install `vitest`, `supertest` and `@vitest/coverage-v8`. Create `vitest.config.js` (setup file, `fileParallelism: false`) and `test/setup.js` (loads `.env.test`, refuses to run if the URL doesn't contain "test"). Write one smoke test: `GET /api/books` returns 200. Make it pass.
4. **Fixtures and reset.** Write `resetDb()` that truncates all tables and inserts a small, known set of data (2 authors, 3 books, 2 tags). Call it in `beforeEach`, close the pool in `afterAll`. Run the smoke test several times: always the same result.
5. **Unit tests.** Test your pure helpers and Zod schemas. These are fast and don't need the database. Use `it.each` for lists of invalid inputs.
6. **Read endpoints.** Test every `GET` route: list, filters (`?genre=`, `?search=`), pagination (`page`, `limit`, `total`), single item, 404s, and the author/tag routes.
7. **Write endpoints.** Test `POST`, `PATCH` and `DELETE`: correct status (201/200/204), response body, a follow-up `GET` that proves the change, and each 400/404 case.
8. **Coverage.** Run `npm run coverage`, open the HTML report, and add tests for uncovered branches (often error handlers and rarely used filters). Reach 80%+.
9. **CI and badge.** Add `.github/workflows/test.yml` with the Postgres service, `npm ci`, `npm run db:migrate` and `npm test`. Push, get it green, and add the badge to the README.

### Hints
- The badge is an image: `![tests](https://github.com/USERNAME/REPO/actions/workflows/test.yml/badge.svg)`.
- `db:migrate` can be a tiny Node script: read `schema.sql` with `fs` and run it with `pool.query(sql)`. The `pg` library accepts several statements in one query when there are no parameters.
- Hosted databases (Neon, Supabase) are for your deployed app. For tests, use a local Postgres (installed or in Docker) and the service container in CI.
- Postgres returns `COUNT(*)` and `bigint` columns as **strings**. If `total` comes back as `"3"`, convert it in the API with `Number()`, and your test will tell you whether you did.
- Express 5 passes errors thrown in `async` route handlers to your error middleware automatically, so a failing query gives a clean 500 in your tests instead of a hanging request.
- Seeing different results each run? A test is probably relying on data another test created. Every test should start from `resetDb()`.

### Stretch goals
- If your API has login, test the whole flow with `request.agent(app)`, which keeps cookies between requests.
- Add a coverage threshold in `vitest.config.js` so CI fails when coverage drops below 80%.
- Add a `lint` step to the workflow and require the checks to pass before merging pull requests (branch protection).

### Done when
- `npm test` runs unit and integration tests for every endpoint, including error cases, and they all pass
- Tests use a separate test database that is reset before each test
- `npm run coverage` shows 80% or more line coverage
- The GitHub Actions workflow runs on every push and pull request and is green
- The README shows the test status badge and explains how to run the tests locally

---section
id: testing-s3
title: Testing user interfaces
intro: Test React components the way a user sees them with React Testing Library, then drive a real browser with Playwright. You'll finish by adding tests to the React apps you've already built.
---

---lesson
id: test-6
title: Testing React components
time: 2h
video: React Testing Library tutorial Vitest
docs: React Testing Library | https://testing-library.com/docs/react-testing-library/intro/
docs: Which query should I use? | https://testing-library.com/docs/queries/about/#priority
docs: user-event | https://testing-library.com/docs/user-event/intro
docs: jest-dom matchers | https://github.com/testing-library/jest-dom
---
React components are where most frontend bugs live: a button that does nothing, a loading spinner that never disappears, an error message that never shows. **React Testing Library** (RTL) renders a component inside a fake browser page and lets you interact with it the way a user would: find the button by its text, click it, check what appears. Your tests then keep working when you refactor the component's internals, because users don't see internals either.

## The tools and the setup

- **Vitest** runs the tests.
- **jsdom** is a fake browser DOM that runs inside Node, so `document` exists in your tests.
- **@testing-library/react** renders components and gives you queries to find elements.
- **@testing-library/user-event** simulates real clicks and typing.
- **@testing-library/jest-dom** adds readable matchers like `toBeInTheDocument()`.

In your Vite React project:

```bash
npm install -D vitest jsdom @testing-library/react @testing-library/dom @testing-library/user-event @testing-library/jest-dom
```

```js
// vite.config.js
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/setupTests.js"],
  },
});
```

```js
// src/setupTests.js
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => cleanup()); // remove the rendered component after each test
```

Add `"test": "vitest run"` and `"test:watch": "vitest"` to your scripts.

## Your first component test

```jsx
// Counter.jsx
import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
      <button onClick={() => setCount((c) => c - 1)} disabled={count === 0}>
        Decrement
      </button>
    </div>
  );
}
```

```jsx
// Counter.test.jsx
import { it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Counter } from "./Counter.jsx";

it("starts at 0 and increments when clicked", async () => {
  const user = userEvent.setup();
  render(<Counter />);

  expect(screen.getByText("Count: 0")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Increment" }));

  expect(screen.getByText("Count: 1")).toBeInTheDocument();
});

it("can't go below zero", () => {
  render(<Counter />);
  expect(screen.getByRole("button", { name: "Decrement" })).toBeDisabled();
});
```

- `render(<Counter />)` mounts the component into jsdom.
- `screen` is the whole page; its queries find elements.
- `userEvent.setup()` creates a simulated user; every interaction is `await`ed.
- The test file uses JSX, so it ends in `.jsx`.

## Choosing a query

RTL recommends queries in this order, because it matches how people (including screen-reader users) find things:

1. `getByRole("button", { name: "Save" })`: buttons, links, headings, textboxes, checkboxes. Your first choice.
2. `getByLabelText("Email")`: form fields with a `<label>`.
3. `getByPlaceholderText`, `getByText`: when there's no role or label.
4. `getByTestId("card-3")`: last resort, using a `data-testid` attribute.

If you can't find an element by role or label, that's often an accessibility problem worth fixing in the component (an icon button without an `aria-label`, an input without a label).

## getBy, queryBy and findBy

Each query comes in three versions:

- `getBy…` returns the element or **throws** if it's missing. Use it for things that should be there now.
- `queryBy…` returns `null` if missing. Use it to assert something is **not** there: `expect(screen.queryByText("Error")).not.toBeInTheDocument()`.
- `findBy…` returns a **promise** and retries until the element appears (default: up to 1 second). Use it for anything that shows up after a fetch or a timer: `await screen.findByText("Dune")`.

Each also has an `All` version (`getAllByRole("listitem")`) that returns an array.

## Components that fetch data

Don't call the real API in component tests. Mock `fetch` exactly as in the mocking lesson, then wait for the result with `findBy`:

```jsx
it("shows books from the API", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue({
    ok: true,
    json: async () => ({ data: [{ id: 1, title: "Dune" }] }),
  });

  render(<BookList />);

  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  expect(await screen.findByText("Dune")).toBeInTheDocument();
  expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
});
```

Add `vi` to the import from `"vitest"` and restore mocks in `afterEach`. Test the error state the same way, with `mockResolvedValue({ ok: false, status: 500 })` or `mockRejectedValue(new Error("offline"))`.

## Common mistakes

- **`document is not defined`**: the `environment: "jsdom"` setting is missing.
- **Forgetting `await` on `user.click` or `findBy`.** The assertion runs before React has updated, and the test fails (or worse, passes by accident).
- **Testing state or internals** (`count` variable, CSS class names). Assert on what the user sees: text, roles, disabled buttons.
- **Using `getBy` to check something is absent.** It throws. Use `queryBy` with `.not.toBeInTheDocument()`.

## In short

- Vitest + jsdom + React Testing Library + user-event + jest-dom, configured in `vite.config.js`.
- `render(<Component />)`, find elements on `screen`, interact with `await user.click/type`.
- Prefer `getByRole` and `getByLabelText`; `queryBy` for absence, `findBy` for things that appear later.
- Mock `fetch` for components that load data and test loading, success and error states.

### Exercises
- Set up RTL in a Vite React app and test the `Counter` above: starts at 0, increments, decrements, can't go below 0.
- Test a login form: submitting it empty shows "Email is required"; typing an email (`await user.type(input, "a@b.co")`) and submitting removes the error.
- Test a component that fetches a list: loading state, list shown, empty list message, and error message when `fetch` rejects.
- Find one element in an old project that you can't query by role or label. Fix the component's accessibility so you can.

---lesson
id: test-7
title: End-to-end tests with Playwright
time: 1.5h
video: Playwright tutorial for beginners
docs: Playwright docs | https://playwright.dev/docs/intro
docs: Playwright locators | https://playwright.dev/docs/locators
docs: Playwright: web server | https://playwright.dev/docs/test-webserver
docs: Playwright: CI | https://playwright.dev/docs/ci-intro
---
Unit and component tests check the pieces. But users don't use pieces: they open your site, fill in a form, and expect the data to be saved in a real database and shown on the page. **End-to-end (E2E) tests** do exactly that in a real browser, with your real frontend talking to your real API. They catch the bugs nothing else catches (wrong API URL, CORS, a missing database column), but they're slower and more fragile, so you write only a few, for the journeys that matter most.

## Installing Playwright

Playwright is Microsoft's E2E tool. It drives Chromium, Firefox and WebKit (Safari's engine). In your frontend project:

```bash
npm init playwright@latest
```

The installer asks a few questions (JavaScript or TypeScript, where to put tests, whether to add a GitHub Actions workflow, whether to install browsers). It creates `playwright.config` and an `e2e/` (or `tests/`) folder with an example. Run the tests with:

```bash
npx playwright test
npx playwright show-report   # open the HTML report
```

Playwright tests are run by Playwright's own test runner, not Vitest. Keep them in their own folder so Vitest doesn't try to run them (Vitest only picks up `*.test.*` and `*.spec.*` files, so name E2E files consistently and, if needed, exclude the folder in your Vitest config).

## A first test

```js
// e2e/home.spec.js
import { test, expect } from "@playwright/test";

test("shows the book list", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  await expect(page.getByRole("heading", { name: "My Library" })).toBeVisible();
  await expect(page.getByRole("listitem").first()).toBeVisible();
});
```

- Each test receives a fresh `page`: a new browser tab with no cookies or storage from other tests.
- `page.getByRole(...)` creates a **locator**. The queries are the same idea as React Testing Library: role, label, text.
- `await expect(locator).toBeVisible()` is a **web-first assertion**: it retries until the condition is true or a timeout (5 seconds by default) passes. You almost never need manual waits.

## Interacting with the page

```js
test("adds a book", async ({ page }) => {
  const title = `Test book ${Date.now()}`;

  await page.goto("/");
  await page.getByRole("link", { name: "Add book" }).click();
  await page.getByLabel("Title").fill(title);
  await page.getByLabel("Author").fill("Test Author");
  await page.getByLabel("Year").fill("2020");
  await page.getByRole("button", { name: "Save" }).click();

  await expect(page.getByText(title)).toBeVisible();
});
```

Actions like `click()` and `fill()` wait automatically until the element is visible and enabled. The unique title (`Date.now()`) means the test still works when you run it twice against the same database.

`page.goto("/")` works when you set `baseURL` in the config.

## Starting your app automatically

Playwright can start your dev server before the tests and stop it afterwards:

```js
// playwright.config.js (the relevant parts)
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
});
```

`reuseExistingServer` means: locally, if your dev server is already running, use it; in CI, always start a fresh one. `webServer` can also be an **array** of servers, for example your API and your frontend, each with its own `command`, `url` and `cwd` (folder).

## Tools that save time

- **Codegen**: `npx playwright codegen http://localhost:5173` opens a browser, records your clicks and writes the test code for you. Use it to find good locators, then tidy the code.
- **UI mode**: `npx playwright test --ui` shows each step with a screenshot, and you can rerun single tests while you edit.
- **Trace viewer**: when a test fails in CI, the trace shows the page, network requests and console at every step. With `trace: "on-first-retry"`, Playwright records a trace when it retries a failed test.

## Keep E2E tests few and focused

E2E tests are slow (seconds each, not milliseconds) and depend on everything working at once. Test the **critical journeys**: sign up and log in, create the main thing, the checkout. Leave the edge cases (every validation message, every empty state) to unit and component tests, which are faster and more precise.

## Common mistakes

- **Using `page.waitForTimeout(2000)`** to "wait for things". It makes tests slow *and* flaky. Use web-first assertions; they wait exactly as long as needed.
- **Tests depending on existing data** ("the third book is Dune"). Create the data you need in the test, or reset the database before the run.
- **Fragile CSS selectors** like `page.locator("div > ul > li:nth-child(3) span")`. One layout change breaks them. Use roles, labels and text.
- **Forgetting to install browsers in CI** (`npx playwright install --with-deps`). The workflow the installer creates already does this.

## In short

- `npm init playwright@latest`; run with `npx playwright test`, debug with `--ui`.
- Find elements with `page.getByRole` / `getByLabel` / `getByText`; act with `click()` and `fill()`.
- `await expect(locator).toBeVisible()` retries automatically; never use fixed waits.
- `webServer` in the config starts your app(s); keep E2E tests for a few critical journeys.

### Exercises
- Install Playwright in one of your React projects and write a test that opens the home page and checks the main heading is visible.
- Use `npx playwright codegen` to record a journey in your app, then clean up the generated code so it uses roles and labels.
- Write an E2E test for your Journal app: register, log in, create an entry, see it listed. Use a unique email per run.
- Run your tests in UI mode (`npx playwright test --ui`) and break one on purpose to see how the failure is shown.

---project
id: test-p3
title: Test your React apps
summary: Add React Testing Library tests to your Memory game and Recipe Finder, plus a Playwright test for your Books frontend, all running in CI.
---
### The task
Go back to the React apps you built in the React Fundamentals module and give them real tests. Your **Memory card game** gets component tests for the game rules, your **Recipe Finder** gets tests for search with a mocked API, and your **Books frontend** gets one end-to-end Playwright test that proves the whole stack (React → Express → Postgres) works. Each repo runs its tests on GitHub for every push.

### What it must do
- **Memory card game** (React Testing Library):
  - Unit tests for the pure game functions (for example `createDeck` creates matching pairs, `shuffle` keeps the same cards).
  - The game starts with all cards face down; clicking a card turns it face up.
  - Two matching cards stay face up and the move counter goes up by 1.
  - Two non-matching cards turn face down again after the delay.
  - A third card can't be flipped while two unmatched cards are showing.
  - Matching all pairs shows the win screen; "Play again" starts a new game with 0 moves.
- **Recipe Finder** (React Testing Library, `fetch` always mocked, no real network):
  - Typing a search shows a loading state, then the matching recipes.
  - A search with no results shows "No recipes found".
  - A failed request (rejected `fetch` or `ok: false`) shows the error state.
  - Adding a favourite shows it in the Favourites view (and saves it to `localStorage`).
- **Books frontend** (Playwright): one E2E test: open the book list, add a book through the form, and see it in the list, against your real API and a test database.
- Every repo has `npm test` (and `npm run test:e2e` for the Books frontend) and a GitHub Actions workflow that runs them on every push, with a badge in the README.

### Steps
1. **Memory game: setup.** Install Vitest, jsdom, React Testing Library, user-event and jest-dom; configure `vite.config.js` and `src/setupTests.js` as in the lesson. Write a smoke test: the app renders 16 cards. Commit.
2. **Memory game: make it testable.** Make each card a `<button>` with an `aria-label` such as `"Card 3, face down"` / `"Card 3, 🐶"`, so tests (and screen readers) can find it. Make the deck predictable in tests: either let `<Game>` accept an optional `deck` prop, or `vi.mock` your shuffle module so it returns the cards unshuffled. Add unit tests for `createDeck` and `shuffle`.
3. **Memory game: game rules.** Write component tests for flipping, a match, a mismatch, the two-card lock, the win screen and "Play again". Fix any bugs the tests find.
4. **Memory game: CI.** Add `.github/workflows/test.yml` (checkout → setup-node → `npm ci` → `npm test`), push, get it green, add the badge.
5. **Recipe Finder: setup and fixtures.** Same setup as step 1. Save a small, realistic API response in `src/test/fixtures/meals.json` (copy 2–3 meals from a real TheMealDB response). Write a helper that mocks `fetch` to return it.
6. **Recipe Finder: search states.** Test loading → results, the empty state (`{ meals: null }`, which is what TheMealDB returns for no results), and the error state. Then test favourites, and add the CI workflow.
7. **Books frontend: Playwright.** Run `npm init playwright@latest`. Keep your API repo in a folder next to the frontend. Configure `webServer` as an array: your API (`cwd: "../books-api"`, test `DATABASE_URL`) and the Vite dev server (with `VITE_API_URL` pointing at the local API). Write the test: list → add book → see it.
8. **Books frontend: CI.** In the workflow, start a Postgres service, check out both repos (the second `actions/checkout` step with `repository:` and `path:`), install both, run the API's migration, install Playwright browsers and run `npx playwright test`. Upload the HTML report as an artifact so you can inspect failures.

### Hints
- The memory game's 1-second "flip back" delay: with real timers, `await waitFor(() => expect(...).toBeInTheDocument(), { timeout: 2000 })` waits for it. With fake timers, create the user with `userEvent.setup({ advanceTimers: vi.advanceTimersByTime })` so user-event and the fake clock work together.
- Debounced search: `findBy` queries wait up to 1 second by default, longer than a 400 ms debounce, so real timers are usually fine. If your debounce is longer, pass `{ timeout: 2000 }` as the third argument to `findBy`.
- `localStorage` exists in jsdom but survives between tests in the same file. Call `localStorage.clear()` in `beforeEach`.
- Your API's CORS settings must allow `http://localhost:5173`, or the E2E test fails with an empty list and a CORS error in the trace.
- In the Books E2E test, use a unique title (`Date.now()`) so it passes on repeated local runs.
- Each `webServer` entry accepts `env: { ... }`, which is the easiest way to give the API its test database URL and the frontend its `VITE_API_URL`.

### Stretch goals
- Add the "best score saved in `localStorage`" behaviour to the memory game tests.
- Add a second Playwright test to the Books frontend: edit a book, then delete it with the confirmation dialog.
- Run the Playwright test in Chromium, Firefox and WebKit (the `projects` setting in the config).

### Done when
- The Memory game has passing tests for flipping, matching, mismatching, the two-card lock and winning
- The Recipe Finder has passing tests for results, loading, empty and error states, with `fetch` mocked
- The Books frontend has a passing Playwright test that adds a book and sees it in the list
- All three repos run their tests in GitHub Actions on every push, and the runs are green
- Each README shows a test badge and how to run the tests

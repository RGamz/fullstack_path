---module
id: react
title: React.js Fundamentals
scrimba: React.js Fundamentals
weeks: 2–3 weeks (less if it's a refresher)
fullCourse: freeCodeCamp React course for beginners
intro: React is the most used library for building user interfaces. If you already learned React in the frontend part of your course, skim the theory, do the exercises quickly and spend your time on the projects, especially the last one, which connects React to your own Book Library API.
---

---section
id: react-s1
title: Static and data-driven pages
intro: Set up a React project with Vite, split a page into components, pass data with props, and render lists and conditional content from an array. You'll finish by building and deploying a bookshelf page generated from a data file.
---

---lesson
id: react-1
title: JSX and components
time: 1.5h
video: Fireship React in 100 seconds
docs: react.dev: Describing the UI | https://react.dev/learn/describing-the-ui
docs: react.dev: Writing markup with JSX | https://react.dev/learn/writing-markup-with-jsx
docs: Vite guide | https://vite.dev/guide/
---
With plain JavaScript you build interfaces by finding elements and changing them: `querySelector`, `textContent`, `appendChild`. That works for small pages, but in a bigger app it becomes hard to know which code changed what. **React** turns this around: you describe what the UI *should look like* for the current data, and React updates the page for you. You describe the UI with **components**, small reusable functions, written in **JSX**.

## Creating a project with Vite

React code needs a build tool that turns JSX into normal JavaScript. The standard choice is **Vite**:

```bash
npm create vite@latest my-react-app -- --template react
cd my-react-app
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). The important files are:

- `index.html`: contains an empty `<div id="root"></div>`.
- `src/main.jsx`: the entry point that puts your app into that div.
- `src/App.jsx`: your first component.

```jsx
// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

`createRoot(...).render(...)` tells React: "manage everything inside `#root` and show `<App />` there". `StrictMode` adds extra checks during development only. Vite reloads the page instantly when you save, so keep `npm run dev` running while you work.

## Components are functions

A component is a JavaScript function that returns JSX. Its name **must start with a capital letter**:

```jsx
// src/App.jsx
function Header() {
  return (
    <header>
      <h1>My Bookshelf</h1>
    </header>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <main>
        <p>Books I've read and want to read.</p>
      </main>
    </>
  );
}
```

You use a component like an HTML tag: `<Header />`. The capital letter is how React tells your components (`<Header />`) apart from HTML elements (`<header>`). The parentheses around the returned JSX let you write it over several lines.

## The rules of JSX

JSX looks like HTML, but it's JavaScript underneath, so a few rules are different:

- **Return one parent element.** To return two siblings without an extra `div`, wrap them in a **fragment**: `<>…</>`.
- **Close every tag**, including `<img />`, `<input />` and `<br />`.
- **`className` instead of `class`**, and `htmlFor` instead of `for` on labels, because `class` and `for` are JavaScript keywords.
- **Attributes are camelCase**: `onClick`, `tabIndex`, `strokeWidth`. (`aria-*` and `data-*` keep their dashes.)
- **Inline styles are objects**: `style={{ color: "red", fontSize: "1.25rem" }}`. The outer braces mean "JavaScript here", the inner ones are the object.

## JavaScript inside JSX with { }

Curly braces let you put any JavaScript **expression** (something that produces a value) into JSX:

```jsx
export default function Greeting() {
  const name = "Anna";
  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";

  return (
    <p className="greeting">
      Good {timeOfDay}, {name.toUpperCase()}! You have {3 + 2} books to read.
    </p>
  );
}
```

Variables, function calls, ternaries and maths all work. Statements like `if` or `for` do **not** work inside `{ }`; compute values above the `return` instead, as `timeOfDay` does here.

## One component per file

As your app grows, move each component into its own file in `src/components/` and export it:

```jsx
// src/components/Footer.jsx
export default function Footer() {
  const year = new Date().getFullYear();
  return <footer>© {year} My Bookshelf</footer>;
}
```

```jsx
// src/App.jsx
import Footer from "./components/Footer.jsx";
```

This is the same ES Modules `import`/`export` you used in Node. CSS works by importing a file: `import "./App.css";` adds those styles to the page.

## From dev server to real files

`npm run dev` is only for development. `npm run build` creates optimised plain HTML, CSS and JavaScript in a `dist/` folder, which any static host can serve. You'll deploy your first React page at the end of this section, and learn deployment properly later in the module.

## Common mistakes

- **Lowercase component names.** `<header />` renders an HTML header, not your `header` component. Use `Header`.
- **Returning two elements side by side.** "Adjacent JSX elements must be wrapped" means you need a fragment or a parent element.
- **Writing `class=`.** React warns in the console; use `className`.
- **Putting `if` inside `{ }`.** Use a ternary, or calculate the value before `return`.

## In short

- Create projects with `npm create vite@latest`; `main.jsx` renders `<App />` into `#root`.
- A component is a capitalised function returning JSX; use it like a tag.
- JSX rules: one parent (or a fragment), close every tag, `className`, camelCase attributes.
- `{ }` inserts any JavaScript expression; keep each component in its own file.

### Exercises
- Create a Vite React app, delete the demo content, and build `Header`, `Main` and `Footer` components, each in its own file under `src/components/`.
- Show today's date and a greeting that depends on the time of day (morning/afternoon/evening), computed with `{ }`.
- Rebuild a section of an old plain-HTML project (for example your landing page's features section) as React components. Fix every JSX error the console shows.
- Run `npm run build`, open the `dist/` folder, and look at what Vite produced. Then run `npm run preview` to serve the built version.

---lesson
id: react-2
title: Props
time: 1.5h
video: React props tutorial
docs: Passing props | https://react.dev/learn/passing-props-to-a-component
docs: react.dev: Your first component | https://react.dev/learn/your-first-component
---
A component that always shows the same text isn't very useful. **Props** (short for properties) let a parent component pass data to a child, so one `BookCard` component can show a hundred different books. If components are functions, props are their arguments.

## Passing and reading props

You pass props like HTML attributes, and the component receives them as one object:

```jsx
function BookCard(props) {
  return (
    <article className="book-card">
      <h2>{props.title}</h2>
      <p>by {props.author}</p>
    </article>
  );
}

export default function App() {
  return (
    <main>
      <BookCard title="Dune" author="Frank Herbert" />
      <BookCard title="Kindred" author="Octavia E. Butler" />
    </main>
  );
}
```

React calls `BookCard({ title: "Dune", author: "Frank Herbert" })` for the first card and `BookCard({ title: "Kindred", ... })` for the second. Same component, different data.

## Destructuring and default values

Instead of writing `props.` everywhere, destructure the object in the parameter list. You can also give defaults:

```jsx
function BookCard({ title, author, year, pages = 0 }) {
  return (
    <article className="book-card">
      <h2>{title}</h2>
      <p>by {author}, {year}</p>
      <p className="muted">{pages} pages</p>
    </article>
  );
}
```

Now the component's "signature" shows exactly which props it expects. If `pages` isn't passed, it's `0`.

## Passing values that aren't strings

Quotes pass a string. For anything else (numbers, booleans, arrays, objects, functions) use curly braces:

```jsx
<BookCard
  title="Dune"
  author="Frank Herbert"
  year={1965}
  pages={412}
  isRead={true}
  tags={["sci-fi", "classic"]}
/>
```

`year="1965"` would give you the *string* `"1965"`, and `isRead="false"` is a non-empty string, which is truthy! A prop written without a value (`<BookCard isRead />`) means `true`.

## Spreading an object as props

Your data usually lives in objects. If the object's keys match the prop names, you can spread it:

```jsx
const book = { title: "Dune", author: "Frank Herbert", year: 1965, pages: 412 };

<BookCard {...book} />
```

This is shorthand for writing every prop one by one. It's convenient, but writing `book={book}` and reading `book.title` inside the component is also fine and sometimes clearer. Pick one style per project.

## children: passing JSX inside a component

Anything you put between a component's opening and closing tags arrives as a special prop called `children`. This makes wrapper components possible:

```jsx
function Panel({ title, children }) {
  return (
    <section className="panel">
      <h2 className="panel-title">{title}</h2>
      <div className="panel-body">{children}</div>
    </section>
  );
}

export default function App() {
  return (
    <Panel title="Currently reading">
      <p>Dune, page 214 of 412.</p>
      <button>Update progress</button>
    </Panel>
  );
}
```

`Panel` doesn't know or care what's inside it; it only provides the frame. Cards, modals, layouts and buttons are often built this way.

## Props are read-only

A component must never change its props. Think of them as the instructions the parent gave: the child can use them, combine them and calculate new values from them, but it doesn't modify them.

```jsx
function Price({ amount }) {
  // amount = amount * 1.2;          ❌ don't reassign props
  const withTax = amount * 1.2;      // ✅ compute a new value
  return <span>€{withTax.toFixed(2)}</span>;
}
```

React relies on components being **pure**: the same props always produce the same output. That's what lets React re-render safely. When data needs to *change* over time (a counter, a form), you'll use **state**, coming in the next section.

## Thinking in components

When you look at a design, draw boxes around repeated or self-contained pieces: a page has a `Header`, a `BookList`, many `BookCard`s, and each card has a `Rating` and some `Tag`s. Data flows **down**: `App` holds the data and passes pieces of it to children through props. A good component is small enough that its name describes it completely.

## Common mistakes

- **Forgetting the braces when destructuring.** `function BookCard(title)` gives you the whole props object named `title`. Write `function BookCard({ title })`.
- **Passing numbers and booleans as strings.** `rating="4"` is a string; use `rating={4}`.
- **Misspelled prop names.** `<BookCard autor="…" />` gives no error, just `undefined`. If something is blank, log the props.
- **Modifying props.** Compute new values in variables instead.

## In short

- Props pass data from parent to child, like function arguments.
- Destructure them in the parameter list and give defaults where useful.
- Strings in quotes, everything else in `{ }`; `{...obj}` spreads an object as props.
- `children` is whatever you put between the tags; props are read-only.

### Exercises
- Build a `ContactCard` component (name, email, phone, avatar URL) and render four different contacts with props.
- Build a `Panel` component that uses `children`, and use it three times with different content inside.
- Build a `Rating` component that takes a number from 0 to 5 and shows stars, for example `★★★☆☆` for 3. Hint: `"★".repeat(n)`.
- Store three book objects in an array in `App.jsx` and render a `BookCard` for each one by writing `<BookCard {...books[0]} />` three times. (Next lesson you'll replace this with `.map()`.)

---lesson
id: react-4
title: Conditional rendering and lists
time: 1.5h
video: React conditional rendering lists keys
docs: Conditional rendering | https://react.dev/learn/conditional-rendering
docs: Rendering lists | https://react.dev/learn/rendering-lists
---
Real data is never a fixed set of three items. You have a list of unknown length, some items have a cover image and some don't, some books are read and some aren't. This lesson covers the two techniques that turn data into UI: **conditional rendering** (show different things depending on a value) and **list rendering** (one component per array item).

## Conditional rendering with if and early return

Because components are just functions, you can use a normal `if` before the `return`:

```jsx
function Cover({ src, title }) {
  if (!src) {
    return <div className="cover cover-missing">No cover</div>;
  }
  return <img className="cover" src={src} alt={`Cover of ${title}`} />;
}
```

This is called an **early return**. It's the clearest option when the two outputs are quite different. A component can also `return null` to render nothing at all.

## Ternaries and && inside JSX

For small differences inside a bigger block of JSX, use expressions:

```jsx
function BookCard({ title, isRead, isFavourite }) {
  return (
    <article className="book-card">
      <h2>{title}</h2>
      <span className={isRead ? "badge badge-read" : "badge"}>
        {isRead ? "Read" : "Want to read"}
      </span>
      {isFavourite && <span className="badge badge-fav">♥ Favourite</span>}
    </article>
  );
}
```

- `condition ? a : b` chooses between two things.
- `condition && something` shows something or nothing. If the condition is false, React renders nothing.

## The && trap with numbers

`&&` returns its left side when it's falsy, and React *does* render the number `0`:

```jsx
{books.length && <p>You have {books.length} books</p>}   // ❌ shows "0" when empty
{books.length > 0 && <p>You have {books.length} books</p>} // ✅
```

Always make the left side of `&&` a real boolean when it might be a number.

## Rendering lists with map

To render an array, turn each item into JSX with `.map()`:

```jsx
const books = [
  { id: 1, title: "Dune", author: "Frank Herbert", isRead: true },
  { id: 2, title: "Kindred", author: "Octavia E. Butler", isRead: false },
  { id: 3, title: "Piranesi", author: "Susanna Clarke", isRead: true },
];

export default function BookList() {
  return (
    <ul className="book-list">
      {books.map((book) => (
        <li key={book.id}>
          {book.title} by {book.author}
        </li>
      ))}
    </ul>
  );
}
```

`map` returns a new array of `<li>` elements, and React renders an array of elements as siblings. Note the arrow function uses parentheses `( … )` to return the JSX directly; with curly braces you'd need an explicit `return`.

## Keys

Every element in a list needs a `key` prop that is **unique among its siblings** and **stable** (the same item always gets the same key). React uses keys to match items between renders: when you remove, add or reorder items, it knows which element is which instead of rebuilding everything.

- The best key is an id from your data: `key={book.id}`.
- Don't use `Math.random()`: a new key every render means React recreates every element.
- The array index (`key={index}`) only works if the list never changes order and items are never removed. With filters and deletions it causes bugs, so prefer ids.

The key goes on the outermost element inside `map`. When you render a component, put it there: `<BookCard key={book.id} {...book} />`. `key` is used by React itself; your component doesn't receive it as a prop.

## Filter, then map

To show only some items, filter the array first, then map the result. You can store the filter in a variable for now (in the next section, state will let users change it):

```jsx
export default function App() {
  const filter = "unread"; // "all" | "read" | "unread"

  const visibleBooks = books.filter((book) => {
    if (filter === "read") return book.isRead;
    if (filter === "unread") return !book.isRead;
    return true;
  });

  return (
    <main>
      <p>{visibleBooks.length} of {books.length} books</p>
      {visibleBooks.length === 0 ? (
        <p className="empty">No books match this filter.</p>
      ) : (
        <div className="grid">
          {visibleBooks.map((book) => (
            <BookCard key={book.id} {...book} />
          ))}
        </div>
      )}
    </main>
  );
}
```

This also shows the **empty state** from the UI module: when the filtered list is empty, the user gets a message instead of a blank page. The same pattern works for sorting: `[...books].sort(...)` creates a sorted copy (sort changes the original array, so copy first).

## Common mistakes

- **Missing keys.** The console warns: "Each child in a list should have a unique key prop". Add `key={item.id}`.
- **Forgetting to return in map.** `books.map((b) => { <li>{b.title}</li> })` returns `undefined` for every item, so nothing appears. Use `( )` or write `return`.
- **Showing `0` with `&&`.** Compare with `> 0`.
- **Sorting the original array.** `books.sort()` changes the data you imported; sort a copy.

## In short

- Use `if` with an early return for very different outputs; `? :` and `&&` inside JSX for small ones.
- Render arrays with `.map()`, returning JSX for each item.
- Every list item needs a stable, unique `key`, ideally an id.
- Filter or sort a copy first, then map, and show an empty state when nothing is left.

### Exercises
- Create a `data.js` file exporting an array of 8 books (with `id`, `title`, `author`, `isRead`) and render them as a list with `.map()` and keys.
- Add a "Read" / "Want to read" badge with a ternary, and a "♥" only for favourites with `&&`.
- Add a `filter` variable (`"all"`, `"read"`, `"unread"`) and render only the matching books, with an empty-state message when none match. Change the variable by hand to test all three.
- Show the books sorted by title (A–Z) without changing the original array, and display a summary line like "8 books · 5 read".

---project
id: react-p4
title: Bookshelf page
summary: A responsive, data-driven page of your books built from components and a data.js array, deployed online.
---
### The task
Build a personal bookshelf page: a responsive grid of books you've read or want to read, generated entirely from an array in `data.js`. There's no interactivity yet: the goal is to practise thinking in components, passing props, rendering lists with keys and handling missing or optional data. When you add a book to the array, it should appear on the page with no other changes.

### What it must do
- `src/data.js` exports an array of at least 10 books: `{ id, title, author, cover, rating, isRead, tags }`, where `cover` is an image URL or `null`, `rating` is 0–5 (or `null` for unread books) and `tags` is an array of strings
- Components at least: `Header`, `Stats`, `BookGrid`, `BookCard`, `Cover`, `Rating`, `Tag`
- Every book shows its cover, title, author, tags and a "Read" / "Want to read" badge
- Books without a cover show a styled "No cover" placeholder with the title instead of a broken image
- Read books show a star rating (for example `★★★★☆`) with an accessible label such as "4 out of 5 stars"; unread books show no rating
- A `Stats` line computed from the data: total books, how many read, average rating of read books
- Two sections: "Read" and "Want to read", each with an empty state message if it has no books
- Responsive grid from 360px to 1440px, using your design tokens from the UI module
- Deployed on Netlify or Vercel

### Steps
1. Create the project with `npm create vite@latest bookshelf -- --template react`, delete the demo content, and add a `tokens.css` with your type scale, colours and spacing from the UI module.
2. Write `src/data.js` with 10+ books. Make sure your data includes edge cases: at least two books without a cover, a book with no tags, a very long title and some unread books.
3. Build `BookCard` with hard-coded props for one book and style it. Then build `Cover`, which returns either the `<img>` or the "No cover" placeholder (early return).
4. Render all books with `books.map(book => <BookCard key={book.id} {...book} />)` inside `BookGrid`, using a `repeat(auto-fit, minmax(…, 1fr))` grid.
5. Build `Rating` (stars from a number, with `aria-label`) and `Tag`, and use `&&` or a ternary so ratings only appear for read books.
6. Split the page into "Read" and "Want to read" sections by filtering the array. Reuse `BookGrid` for both and pass an empty-state message as a prop.
7. Build `Stats`: compute the totals and average rating from the array (use `filter` and `reduce`, and `toFixed(1)` for the average). Handle the case where nothing is read yet.
8. Test the edge cases: temporarily make the array empty, remove all covers, and check 360px width in DevTools. Fix anything that looks broken.
9. Push to GitHub and deploy: on Vercel or Netlify, import the repository (build command `npm run build`, output folder `dist`), or run `npm run build` and drag the `dist` folder into Netlify's manual deploy page. Add the live link and a screenshot to the README.

### Hints
- Free cover images: Open Library serves covers by ISBN, for example `https://covers.openlibrary.org/b/isbn/9780441172719-M.jpg`.
- Set `width`, `height` and `object-fit: cover` on covers (or use `aspect-ratio: 2 / 3`) so all cards line up even when images have different sizes.
- For the stars, use `"★".repeat(rating) + "☆".repeat(5 - rating)` inside a `span`, and give the span an `aria-label` built with a template literal, such as "4 out of 5 stars", so screen readers don't read out each star symbol.
- If the average shows `NaN`, you divided by zero: check that at least one book has a rating first.

### Stretch goals
- Group the "Read" books by tag, with a heading per tag.
- Add a "Currently reading" section with a progress bar (`pagesRead` / `pages`) using the `<progress>` element.
- Show a small "New" badge for books added in the last 30 days (add an `addedAt` date to the data).
- After the next section: add filter buttons and a search box using state.

### Done when
- All books come from `data.js`, and adding a new object makes a new card appear
- The page is built from at least 7 components that receive data through props
- Every list uses stable `key`s and there are no warnings in the console
- Missing covers, unread books and empty sections are handled gracefully
- The layout works from 360px to 1440px wide
- The site is deployed and the README links to it

---section
id: react-s2
title: State, events and forms
intro: Make components interactive. You'll learn how state makes React re-render, how to handle events, update arrays and objects safely, and build forms the classic way and with React 19 form actions. You'll finish by building a memory card game with a start-screen form.
---

---lesson
id: react-3
title: State and events
time: 2h
video: React useState hook tutorial
docs: State: a component's memory | https://react.dev/learn/state-a-components-memory
docs: Updating arrays in state | https://react.dev/learn/updating-arrays-in-state
docs: Responding to events | https://react.dev/learn/responding-to-events
docs: Sharing state between components | https://react.dev/learn/sharing-state-between-components
---
So far your components show data, but nothing changes when the user clicks. To make a page interactive, a component needs memory: a value that can change, and that makes React draw the component again when it does. That memory is called **state**, and it's the heart of React.

## Why a normal variable doesn't work

```jsx
function Counter() {
  let count = 0;
  return <button onClick={() => { count++; }}>Clicked {count} times</button>;
}
```

Clicking changes `count`, but the screen never updates. React has no idea the variable changed, and even if the component ran again, `let count = 0` would reset it. You need a value that React stores *between* renders and that triggers a new render when it changes.

## useState

```jsx
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

`useState(0)` returns an array with two things: the current value and a function to change it. Calling `setCount(…)` stores the new value and tells React to **re-render**: call `Counter` again, which now gets the new `count` from `useState`, and update the page with the result.

Functions starting with `use` are **hooks**. Call them at the top level of your component, never inside `if` statements or loops.

## Handling events

Pass a **function** to event props like `onClick`, `onChange` or `onSubmit`:

```jsx
function LikeButton() {
  const [liked, setLiked] = useState(false);

  function handleClick() {
    setLiked(!liked);
  }

  return (
    <button onClick={handleClick} aria-pressed={liked}>
      {liked ? "♥ Liked" : "♡ Like"}
    </button>
  );
}
```

Write `onClick={handleClick}`, not `onClick={handleClick()}`. With parentheses, the function runs during rendering instead of on click. When you need to pass an argument, wrap it in an arrow function: `onClick={() => removeItem(item.id)}`.

## State is a snapshot: the updater function

Inside one render, `count` is a fixed value. Setting state doesn't change it immediately; it schedules a new render:

```jsx
function handleTriple() {
  setCount(count + 1);
  setCount(count + 1);
  setCount(count + 1); // count is still the old value: result is +1, not +3
}
```

When the new value depends on the previous one, pass an **updater function**. React gives it the latest value:

```jsx
setCount((prev) => prev + 1);
```

## Updating arrays and objects

React compares the old and new state to decide whether to re-render. If you change an array or object *in place* (`push`, `item.done = true`), it's still the same object, so React may not update. Always create a **new** array or object:

```jsx
const [items, setItems] = useState([]);

// add
setItems((prev) => [...prev, { id: crypto.randomUUID(), text, bought: false }]);

// remove
setItems((prev) => prev.filter((item) => item.id !== id));

// update one item
setItems((prev) =>
  prev.map((item) => (item.id === id ? { ...item, bought: !item.bought } : item))
);

// update a field of an object
setUser((prev) => ({ ...prev, name: "Anna" }));
```

These four patterns (spread to add, `filter` to remove, `map` to update, object spread to change a field) cover almost everything you'll do with state.

## Don't store what you can calculate

If a value can be computed from state or props, compute it during render instead of storing it:

```jsx
const [items, setItems] = useState([]);
const boughtCount = items.filter((item) => item.bought).length; // ✅ derived
```

Keeping `boughtCount` in its own state would mean updating two things every time and risking them getting out of sync.

## Lifting state up

When two components need the same state, move it to their closest common parent and pass it down as props, together with the function that changes it:

```jsx
function App() {
  const [filter, setFilter] = useState("all");
  return (
    <>
      <FilterButtons filter={filter} onChange={setFilter} />
      <BookList filter={filter} />
    </>
  );
}

function FilterButtons({ filter, onChange }) {
  return ["all", "read", "unread"].map((f) => (
    <button key={f} aria-pressed={filter === f} onClick={() => onChange(f)}>
      {f}
    </button>
  ));
}
```

Data still flows down; events flow up through callback props like `onChange`.

## Initial state from localStorage

`useState` can take a function that runs only on the first render. That's useful for reading saved data:

```jsx
const [best, setBest] = useState(() => Number(localStorage.getItem("best")) || 0);

function handleWin(moves) {
  if (best === 0 || moves < best) {
    setBest(moves);
    localStorage.setItem("best", String(moves));
  }
}
```

## Common mistakes

- **Mutating state.** `items.push(x); setItems(items)` may not re-render. Create a new array.
- **Calling the handler immediately.** `onClick={handleClick()}` runs during render (and can cause an infinite loop if it sets state).
- **Expecting state to change straight away.** `setCount(5); console.log(count)` logs the old value. The new one arrives in the next render.
- **Duplicate state.** Derive values like counts and filtered lists instead of storing them.

## In short

- `const [value, setValue] = useState(initial)`; calling the setter re-renders the component.
- Pass functions to `onClick` and friends; use the updater form when the new value depends on the old.
- Never mutate: spread to add, `filter` to remove, `map` to update.
- Derive what you can; lift shared state to the closest common parent.

### Exercises
- Build a counter with +, − and reset, where − never goes below zero.
- Build a shopping list: add items from a text input, toggle "bought" by clicking an item, delete items, and show "3 of 5 bought" (derived, not stored).
- Lift state: build a `ColorPicker` and a `Preview` as sibling components that share a selected colour stored in their parent.
- Go back to your Bookshelf page and add filter buttons (all / read / unread) and a "mark as read" button on each card, using state in `App`.

---lesson
id: react-5
title: Forms
time: 2h
video: React forms tutorial controlled inputs
docs: Reacting to input with state | https://react.dev/learn/reacting-to-input-with-state
docs: <form> reference | https://react.dev/reference/react-dom/components/form
docs: useActionState reference | https://react.dev/reference/react/useActionState
---
Almost every app has forms: search boxes, sign-up pages, "add a book" dialogs, settings. React gives you two ways to handle them. **Controlled inputs** keep every keystroke in state, which is perfect when the UI must react while the user types. **Form actions**, added in React 19, read the whole form at once when it's submitted, which is simpler for many forms. You'll learn both, and when to choose which.

## Controlled inputs

A controlled input gets its value from state and updates state on every change:

```jsx
import { useState } from "react";

export default function Search() {
  const [query, setQuery] = useState("");

  return (
    <>
      <label htmlFor="q">Search books</label>
      <input id="q" value={query} onChange={(e) => setQuery(e.target.value)} />
      <p>You typed: {query}</p>
    </>
  );
}
```

`value={query}` means the input always shows the state, and `onChange` copies what the user typed into state. Because the current text is in state, you can use it anywhere: filter a list, count characters, show a preview. Checkboxes use `checked` and `e.target.checked` instead of `value`.

## Many fields in one state object

For a form with several fields, use one object and the inputs' `name` attribute:

```jsx
const [form, setForm] = useState({ title: "", author: "", isRead: false });

function handleChange(e) {
  const { name, value, type, checked } = e.target;
  setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
}

<input name="title" value={form.title} onChange={handleChange} />
<input name="author" value={form.author} onChange={handleChange} />
<input name="isRead" type="checkbox" checked={form.isRead} onChange={handleChange} />
```

`[name]` is a computed property name: the key comes from the input that changed. One handler serves every field.

## Submitting with onSubmit

The classic way to submit is the `submit` event, exactly as in plain JavaScript:

```jsx
function handleSubmit(e) {
  e.preventDefault(); // stop the browser from reloading the page
  if (!form.title.trim()) {
    setErrors({ title: "Enter a title" });
    return;
  }
  onAdd(form);
  setForm({ title: "", author: "", isRead: false });
}

<form onSubmit={handleSubmit}>…<button>Add book</button></form>
```

A `<button>` inside a form submits it by default, and pressing Enter in an input does too. That's why you listen on the form, not on the button.

## Form actions (React 19)

In React 19 you can pass a **function** to a form's `action` prop. React calls it with a `FormData` object when the form is submitted, and you don't need `preventDefault` or state for every field:

```jsx
export default function AddBookForm({ onAdd }) {
  function addBook(formData) {
    onAdd({
      title: formData.get("title"),
      author: formData.get("author"),
      isRead: formData.get("isRead") === "on",
    });
  }

  return (
    <form action={addBook}>
      <label>Title <input name="title" required /></label>
      <label>Author <input name="author" /></label>
      <label><input name="isRead" type="checkbox" /> Already read</label>
      <button>Add book</button>
    </form>
  );
}
```

The inputs are **uncontrolled**: the browser keeps their values, and you read them with `formData.get(name)` (always strings; a checked checkbox gives `"on"`). After the action finishes, React resets the form's fields for you. Use `defaultValue` (not `value`) to pre-fill an uncontrolled input.

## Errors and pending state with useActionState

`useActionState` wraps an action and keeps whatever it returns as state. That's a neat place for validation errors and a "pending" flag, and the action can be `async`:

```jsx
import { useActionState } from "react";

async function signUp(prevState, formData) {
  const email = formData.get("email").trim();
  if (!email.includes("@")) {
    return { error: "Enter an email like name@example.com", email };
  }
  await new Promise((r) => setTimeout(r, 1000)); // pretend to call an API
  return { success: true };
}

export default function SignUpForm() {
  const [state, formAction, isPending] = useActionState(signUp, {});

  return (
    <form action={formAction}>
      <label htmlFor="email">Email</label>
      <input id="email" name="email" defaultValue={state.email}
             aria-invalid={Boolean(state.error)} aria-describedby="email-error" />
      {state.error && <p id="email-error" className="field-error">{state.error}</p>}
      {state.success && <p>Thanks for signing up!</p>}
      <button disabled={isPending}>{isPending ? "Signing up…" : "Sign up"}</button>
    </form>
  );
}
```

The action receives the previous state first and the form data second. Whatever it returns becomes the new `state`. `isPending` is `true` while an async action runs, so the button can show "Signing up…". Because the form resets after the action, the code returns the typed `email` with the error and puts it back with `defaultValue`, so the user doesn't lose their input.

## Which one should I use?

- **Controlled inputs** when the UI reacts *while typing*: live search, character counters, enabling a button only when a field is valid, a field that depends on another.
- **Form actions** for "fill in, then submit" forms: sign-up, add item, settings. Less code, and pending state comes for free.

Mixing is fine: a form can have an action and one controlled input.

## Common mistakes

- **`value` without `onChange`.** The input becomes read-only and React warns. Add `onChange`, or use `defaultValue` for an uncontrolled input.
- **Forgetting `preventDefault` with `onSubmit`.** The page reloads and your state disappears. (Not needed with `action`.)
- **Forgetting `name` attributes with form actions.** `formData.get("title")` returns `null` if the input has no `name="title"`.
- **Treating FormData values as numbers.** `formData.get("year")` is a string; convert with `Number()`.

## In short

- Controlled input: `value={state}` plus `onChange` that updates the state.
- `onSubmit` + `e.preventDefault()` is the classic way to submit.
- React 19 form actions: `<form action={fn}>`, read values with `formData.get(name)`; the form resets afterwards.
- `useActionState` keeps the action's result (errors, success) and an `isPending` flag.

### Exercises
- Build a live search: a controlled input that filters a list of 20 names as you type, with a "No matches" message.
- Build a sign-up form (name, email, password, "accept terms" checkbox) with controlled inputs, validated on submit, with error messages next to each field.
- Rebuild the same form with a form action and `useActionState`: errors come from the returned state, and the button shows "Signing up…" while a fake 1-second request runs.
- Add an "Add book" form to your Bookshelf page that adds a new book to the list in state, with the title required and the rating limited to 0–5.

---project
id: react-p2
title: Memory card game
summary: A card-matching game with a start-screen form, game state, move counter and a saved best score.
---
### The task
Build a memory game: cards lie face down, the player flips two at a time and tries to find all matching pairs in as few moves as possible. Before the game starts, a small form asks for the player's name and difficulty. It's a great state exercise: the game has several pieces of state that must stay consistent, plus a delay that needs careful handling.

### What it must do
- A start screen with a form: player name (required) and difficulty (Easy: 4×4 = 8 pairs, Hard: 6×6 = 18 pairs) as radio buttons; submitting starts the game
- Cards use emojis (or images) and are shuffled at the start of every game
- Clicking a face-down card flips it. After two flips: matching cards stay face up; non-matching cards flip back after 1 second
- The player can't flip a third card while two unmatched cards are showing, and clicking a matched or already flipped card does nothing
- A move counter (one move = two flips) and a "pairs found" counter
- A win screen: "Well done, Anna! 14 moves", a "Play again" button (same settings) and a "Change settings" button (back to the form)
- Best score (fewest moves) saved in `localStorage` separately for each difficulty and shown during the game
- Cards are real `<button>` elements, so the game works with the keyboard

### Steps
1. Create the Vite project. Write a pure function `createDeck(pairs)` that picks emojis, duplicates them, shuffles them (Fisher–Yates) and returns `[{ id, value, isFlipped: false, isMatched: false }]`. Log its result to check it.
2. Build the `StartScreen` form with a form action (or controlled inputs): name and difficulty. In `App`, keep `player`, `difficulty` and a `status` state (`"setup"`, `"playing"`, `"won"`) and show the right screen for each status.
3. Build `Board` and `Card` components and render the deck in a CSS Grid whose number of columns depends on the difficulty. Show the emoji when `isFlipped || isMatched`, otherwise a card back.
4. Implement flipping: clicking a card sets its `isFlipped` to `true` using `map` (never mutate). Keep track of the flipped-but-unmatched cards (derive them with `filter` or store their ids).
5. Implement the comparison: when the second card is flipped, add a move. If the values match, mark both as `isMatched`. If not, use `setTimeout` (inside the click handler) to flip them back after 1 second, and ignore clicks while two cards are showing.
6. Detect the win (every card `isMatched`), switch `status` to `"won"`, and build the win screen with "Play again" and "Change settings".
7. Add the best scores: keep one state object with a score per difficulty, like `{ easy: 12, hard: null }`, read from `localStorage` with a lazy `useState(() => …)` initialiser (one key per difficulty, like `"best-easy"`). Show `best[difficulty]`, so switching difficulty shows the right score. When the player wins, compare, update only that difficulty's entry (`{ ...best, [difficulty]: moves }`) and save it under its key.
8. Polish: a flip animation with CSS `transform: rotateY(180deg)` and `transition`, a responsive grid that fits a phone screen, focus styles, and `aria-label`s like "Card, face down". Deploy and add a README with a GIF or screenshot.

### Hints
- Fisher–Yates: loop `i` from the end down to 1, pick `j = Math.floor(Math.random() * (i + 1))`, swap items `i` and `j`. Shuffle a copy, not the original array.
- Keep game logic (`createDeck`, `isWin`, comparing two cards) in a separate `game.js` file of pure functions. You'll write unit tests for them in the Testing module.
- Inside the `setTimeout` callback, use the updater form `setCards(prev => …)`: the `cards` variable in the handler is a snapshot from when the click happened.
- A new game can start while a flip-back timer is still waiting (for example if you add a "Restart" button during the game). The old timer then fires on the new deck and flips its cards. Keep the timer id in a variable outside the component (`let flipTimer;` at the top of the file, then `flipTimer = setTimeout(…)`) and call `clearTimeout(flipTimer)` in the function that starts a new game. In Advanced React you'll learn `useRef`, the usual place for values like this.
- Use the card's `id` (not its emoji) as the `key`: each emoji appears twice.

### Stretch goals
- After the next section: a timer with `setInterval` in a `useEffect` (with cleanup), and the timer stops on win.
- A third "Medium" difficulty and a leaderboard of the top 5 scores per difficulty.
- After the next section: fetch card images from an API (dog or Pokémon images) instead of emojis.
- Two-player mode: players take turns, and a matched pair gives another turn.

### Done when
- The start form requires a name and lets the player choose the difficulty
- Cards are shuffled each game, and matching and non-matching pairs behave correctly
- It's impossible to flip more than two unmatched cards at once
- Moves are counted, the win screen shows the player's name and score, and both buttons work
- The best score per difficulty survives a page reload
- The game is deployed and playable with the keyboard
- The README explains what the project does and how to run it locally, with a screenshot

---section
id: react-s3
title: Side effects and APIs
intro: Connect React to the world outside it: fetch data, run timers, debounce searches and deploy apps that talk to real APIs. You'll build a recipe finder on a public API, then a React frontend for the Book Library API you built in the Express and Databases modules.
---

---lesson
id: react-6
title: Effects and data fetching
time: 2h
video: React useEffect explained
docs: Synchronizing with effects | https://react.dev/learn/synchronizing-with-effects
docs: You might not need an effect | https://react.dev/learn/you-might-not-need-an-effect
docs: useEffect reference | https://react.dev/reference/react/useEffect
---
A component's job is to turn props and state into JSX, and that should be pure: no network requests, no timers, no changing things outside React. But real apps must load data, start timers and talk to browser APIs. **Effects** are React's place for that: code that runs *after* React has updated the page, to keep your component in sync with something outside it.

## Your first effect

```jsx
import { useEffect, useState } from "react";

export default function PageTitle() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  }, [count]);

  return <button onClick={() => setCount(count + 1)}>Click</button>;
}
```

`useEffect(fn, deps)` runs `fn` after the component renders. The **dependency array** `[count]` tells React: "run this again only when `count` changed since the last render".

## The dependency array

- `useEffect(fn, [a, b])`: runs after the first render and whenever `a` or `b` changes. This is the normal case.
- `useEffect(fn, [])`: runs once, after the first render.
- `useEffect(fn)` with no array: runs after *every* render. You rarely want this.

The rule: every value from the component (props, state, functions defined inside it) that the effect uses must be in the array. If you leave one out, the effect keeps using an old value. The React ESLint plugin, included in the Vite template, warns you when you forget one.

## Cleanup

Some effects start something that must be stopped later: an interval, an event listener, a request. Return a **cleanup function** from the effect:

```jsx
export default function Clock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id); // cleanup
  }, []);

  return <p>{now.toLocaleTimeString()}</p>;
}
```

React runs the cleanup when the component disappears from the page, and also before re-running the effect when dependencies change. Without it, every time `Clock` mounts you'd start another interval that never stops.

In development, `StrictMode` deliberately mounts your component, cleans up and mounts it again. If you see an effect run twice in development, that's why: it's a test that your cleanup works. It doesn't happen in production.

## Fetching data

Data fetching needs three pieces of state: the data, whether it's loading, and any error.

```jsx
export default function MealSearch({ query }) {
  const [meals, setMeals] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  useEffect(() => {
    if (!query) return;
    const controller = new AbortController();

    async function load() {
      setStatus("loading");
      try {
        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setMeals(data.meals ?? []);
        setStatus("success");
      } catch (err) {
        if (err.name !== "AbortError") setStatus("error");
      }
    }

    load();
    return () => controller.abort();
  }, [query]);

  if (!query) return null; // empty search: show nothing, not old results
  if (status === "loading") return <p>Loading…</p>;
  if (status === "error") return <p>Couldn't load recipes. Try again.</p>;
  if (status === "success" && meals.length === 0) return <p>No recipes found.</p>;
  return <ul>{meals.map((m) => <li key={m.idMeal}>{m.strMeal}</li>)}</ul>;
}
```

The important parts:

- The effect function itself can't be `async`, so define an async function inside it and call it.
- `fetch` doesn't throw on 404 or 500, so check `res.ok` yourself.
- The cleanup **aborts** the request. If `query` changes from "chi" to "chicken" quickly, the old request is cancelled, so a slow, outdated response can't overwrite the newer one. Aborting makes `fetch` throw an `AbortError`, which we ignore.
- `encodeURIComponent` makes user input safe to put in a URL.
- When the search box is cleared, the effect does nothing, so `meals` still holds the old results. Instead of resetting state inside the effect, the render simply checks `if (!query) return null;` first. Deciding what to show from props during render is simpler than another state update.

## Debouncing a search

Fetching on every keystroke sends many useless requests. **Debouncing** waits until the user stops typing:

```jsx
const [query, setQuery] = useState("");
const [debouncedQuery, setDebouncedQuery] = useState("");

useEffect(() => {
  const id = setTimeout(() => setDebouncedQuery(query), 400);
  return () => clearTimeout(id);
}, [query]);
```

Every keystroke changes `query`, which cleans up the previous timer and starts a new one. Only when 400 ms pass without typing does `debouncedQuery` change, and *that* is what you pass to the fetching effect.

## Syncing with localStorage

Effects are also good for saving state somewhere else whenever it changes:

```jsx
const [favourites, setFavourites] = useState(
  () => JSON.parse(localStorage.getItem("favourites")) ?? []
);

useEffect(() => {
  localStorage.setItem("favourites", JSON.stringify(favourites));
}, [favourites]);
```

## You might not need an effect

Effects are for synchronising with *external* systems. Don't use them for things React already handles:

- **Derived values**: don't copy `items.filter(…)` into state with an effect; compute it during render.
- **Reacting to a click**: put the logic in the event handler, not in an effect that watches state.

Too many effects make components hard to follow and cause extra renders. Later, in Advanced React and Next.js, you'll meet other ways to load data, such as the `use` hook with Suspense and server components. Understanding effects first makes those much easier.

## Common mistakes

- **Missing dependencies.** The effect uses stale values. Add everything it uses to the array.
- **Infinite loops.** An effect that sets state it depends on, with no condition, runs forever. Check the dependency array and the logic.
- **No cleanup.** Intervals and listeners pile up; responses arrive out of order.
- **Making the effect function `async`.** Define an async function inside instead.

## In short

- `useEffect(fn, deps)` runs after render, again when dependencies change.
- Return a cleanup function to stop timers, remove listeners and abort requests.
- Fetching needs data, loading and error state; check `res.ok` and abort stale requests.
- Debounce searches with `setTimeout` plus cleanup; don't use effects for derived values or click logic.

### Exercises
- Build a live clock with `setInterval` and proper cleanup. Add a button that hides and shows it, and check in the console that no interval keeps running when it's hidden.
- Fetch the list of categories from TheMealDB (`categories.php`) when the component mounts, and show loading, error and success states. Test the error state by misspelling the URL.
- Add a search input that fetches recipes with a 400 ms debounce and aborts old requests. Watch the Network tab in DevTools while typing fast.
- Save a list of favourite meal ids to `localStorage` with an effect, and restore it on reload.

---lesson
id: react-7
title: Build and deploy a React app
time: 1.5h
video: deploy Vite React app to Netlify
docs: Vite: deploying a static site | https://vite.dev/guide/static-deploy.html
docs: Vite: env variables and modes | https://vite.dev/guide/env-and-mode
---
An app on `localhost` only exists for you. Deploying makes it real: you can share a link, put it in your portfolio and use it on your phone. A Vite React app builds into plain static files, so hosting is free and takes minutes. The parts that need care are configuration (API URLs), secrets, and talking to your own backend on another domain.

## Development vs production

`npm run dev` starts a development server with instant reload and helpful warnings. It's not meant for real users. For production:

```bash
npm run build     # creates the dist/ folder
npm run preview   # serves dist/ locally so you can test the real build
```

`npm run build` bundles and minifies your code into a few files in `dist/`: an `index.html`, JavaScript and CSS files with hashes in their names (like `index-a1b2c3.js`) so browsers can cache them forever. Always run `npm run preview` once before deploying: some problems (wrong paths, missing environment variables) only appear in the built version.

## Environment variables in Vite

Your app will talk to different APIs in development and production, for example `http://localhost:3000` locally and `https://my-books-api.onrender.com` live. Don't hard-code the URL; use an environment variable. Create `.env.development` and `.env.production` in the project root:

```bash
# .env.development
VITE_API_URL=http://localhost:3000

# .env.production
VITE_API_URL=https://my-books-api.onrender.com
```

And read it in your code:

```js
// src/api.js
const API_URL = import.meta.env.VITE_API_URL;

export async function getBooks(params = {}) {
  // Drop empty values, otherwise { genre: undefined } becomes "genre=undefined"
  const filled = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null && value !== ""
  );
  const query = new URLSearchParams(filled).toString();
  const res = await fetch(`${API_URL}/api/books?${query}`);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}
```

Vite replaces `import.meta.env.VITE_API_URL` with the actual value **at build time**. `npm run dev` uses the development file; `npm run build` uses the production one. Only variables starting with `VITE_` are exposed to your code. Restart the dev server after changing a `.env` file. You can also set these variables in your host's dashboard instead of committing a `.env.production` file.

## Frontend variables are public

Everything in your built JavaScript can be read by anyone who opens DevTools. **Never put secrets** (database passwords, private API keys, JWT secrets) in a `VITE_` variable. An API URL is fine; an API key for a paid service is not. If you need a secret, the request must go through your own backend, which keeps the key on the server. That's one reason full-stack apps have a backend at all.

## Deploying to Netlify or Vercel

Both have free plans and work the same way:

1. Push your project to GitHub.
2. In Netlify or Vercel, choose "import a project" and select the repository.
3. Check the settings: build command `npm run build`, output (publish) directory `dist`. Vercel usually detects Vite automatically.
4. Add environment variables like `VITE_API_URL` in the site settings if you don't commit them.
5. Deploy. You get a URL like `my-app.netlify.app`.

From now on, every `git push` to the main branch rebuilds and redeploys the site. Pull requests can even get their own preview URLs. Cloudflare Pages and GitHub Pages work too; the Vite deployment guide covers each.

## Single-page apps and the fallback

A React app has one real HTML file. If you later add client-side routing (React Router, in Advanced React), a URL like `/books/42` doesn't exist as a file on the server, so refreshing it gives a 404. The fix is a **fallback** that serves `index.html` for every path:

```text
# Netlify: public/_redirects
/*    /index.html   200
```

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

The second block is a `vercel.json` file in the project root. Files in `public/` are copied into `dist/` as they are, which is how `_redirects` ends up on Netlify.

## Talking to your own API: CORS

When your frontend runs on `my-books.netlify.app` and your API on `my-books-api.onrender.com`, they are different **origins**, so the browser only lets the frontend read API responses if the API allows it with CORS headers. You configured this in the Express module; now add your real frontend URL:

```js
// in your Express app
app.use(cors({
  origin: ["http://localhost:5173", "https://my-books.netlify.app"],
}));
```

If you see a CORS error in the browser console, the fix is always on the **server**, never in React.

## Common mistakes

- **`undefined` API URL in production.** The variable is missing the `VITE_` prefix, or wasn't set in the host's settings before building. Rebuild after adding it.
- **Secrets in `VITE_` variables.** They are public. Move them to a backend.
- **Wrong output folder.** Netlify publishing the project root instead of `dist` shows a blank page or a source listing.
- **CORS errors after deploying.** The API still only allows `localhost`. Add the deployed frontend's origin.

## In short

- `npm run build` creates static files in `dist/`; test them with `npm run preview`.
- Configure URLs with `VITE_`-prefixed variables read via `import.meta.env`; they're baked in at build time and are public.
- Netlify and Vercel deploy from GitHub with build command `npm run build` and output `dist`.
- Routed SPAs need an `index.html` fallback; your API must allow your frontend's origin.

### Exercises
- Deploy your shopping list (or Bookshelf) app to Netlify or Vercel from GitHub. Push a small change and watch it redeploy automatically.
- Add `.env.development` and `.env.production` with a `VITE_GREETING` value, display it on the page, and check that `npm run dev` and `npm run preview` show different values.
- Create `src/api.js` with a `getBooks()` function that uses `VITE_API_URL`, and display the books from your local Book Library API. Then point it at your deployed API.
- Open your deployed site, find your `VITE_` value in the built JavaScript using DevTools' Sources panel, and write one sentence in the README explaining why secrets can't go there.

---project
id: react-p1
title: Recipe Finder
summary: Search recipes from TheMealDB, view details and save favourites, with proper loading, empty and error states.
---
### The task
Build an app to find recipes by name using the free TheMealDB API (no key needed for the test API), browse them by category and keep a list of favourites. It's a classic "API + UI" app and practises everything from this section: effects, fetching, debouncing, cleanup and deployment.

### What it must do
- A search box: results update as you type, debounced by 400 ms, with old requests aborted
- A results grid of cards: image, name, category, area (country)
- Clicking a card opens a details view: large image, ingredients with measures, instructions and a link to the YouTube video if there is one
- A category filter (the list of categories comes from the API's categories endpoint)
- A heart button on each card and in the details view to add or remove a favourite; a "Favourites" view; favourites survive a page reload (`localStorage`)
- Loading, empty ("No recipes found for 'xyz'") and error states, each with a clear message
- Responsive layout, deployed online

### Steps
1. Explore the API in your browser first. The base URL is `https://www.themealdb.com/api/json/v1/1/`; try `search.php?s=chicken`, `lookup.php?i=52772`, `categories.php` and `filter.php?c=Seafood`. Note the shape of each response.
2. Create the Vite app and an `api.js` module with `searchMeals(query, signal)`, `getMeal(id)`, `getCategories()` and `getMealsByCategory(category, signal)`. Fetch and render results for a hard-coded query.
3. Add the search input (controlled) with a debounced query and an aborting fetch effect. Add the loading, empty and error states.
4. Build the details view: keep `selectedId` in state, fetch the full meal when it changes, and show it in a section or a `<dialog>`. Add a "Back to results" button.
5. Write a `getIngredients(meal)` function that turns `strIngredient1…20` and `strMeasure1…20` into an array like `[{ ingredient, measure }]`, skipping empty ones, and render it as a list.
6. Add favourites: an array of `{ idMeal, strMeal, strMealThumb }` in state, initialised from `localStorage` and saved with an effect. Add the heart buttons and a "Favourites" tab.
7. Add the category filter: load categories once on mount and show them as a `<select>` or buttons. Choosing a category fetches meals for it and clears the search.
8. Polish and deploy: responsive grid, focus styles, `alt` texts, a heart button with `aria-pressed`. Deploy to Netlify or Vercel and add a README with the live link and a screenshot.

### Hints
- When nothing matches, the API returns `{ "meals": null }`, not an empty array. Use `data.meals ?? []`.
- The category endpoint only returns id, name and image for each meal, not its category or area. Show what you have, or fetch details on click.
- Keep "what is shown" simple: one `view` state (`"results"`, `"favourites"`, `"details"`) is easier than several booleans.
- Store the whole small favourite object, not just the id, so the Favourites view can render without extra requests.

### Stretch goals
- A shopping list generated from the ingredients of selected recipes, with duplicates merged.
- A "Surprise me" button using the `random.php` endpoint.
- Search by main ingredient using `filter.php?i=` as an alternative mode.
- In the Advanced React module: add React Router so every recipe has its own URL.

### Done when
- Typing in the search box shows matching recipes after a short pause, without a request per keystroke
- The details view shows the ingredients with measures and the instructions
- Favourites can be added and removed and are still there after a reload
- Loading, empty and error states are all visible and understandable
- Categories load from the API and filter the results
- The app is deployed and the README links to it

---project
id: react-p3
title: Books frontend
summary: A React frontend for your own Book Library API: list, search, add, edit, delete and toggle read.
---
### The task
Build the frontend for the Book Library API you built in the Express module and moved to PostgreSQL in the Databases module. Now you have a real full-stack app: a React app on one host and your own API on another, talking over HTTP. This is a strong portfolio piece because you wrote both halves.

### What it must do
- A list of books with search, genre filter and pagination, all done **by your API** using query parameters (`?search=`, `?genre=`, `?page=`, `?limit=`)
- Each book shows title, author name (`book.author.name`), year, genre, its tags as small "chips", and a "read" toggle that updates the API directly (`PATCH`)
- A details view for one book (`GET /api/books/:id`)
- An add/edit form: the same form component for both, pre-filled when editing; the author is chosen from a `<select>` filled from `GET /api/authors`, and the form sends `authorId` as a number; validation errors returned by your API are shown next to the right fields
- Delete with a confirmation step (a `<dialog>` or `confirm()`), then the list updates
- The API base URL comes from `VITE_API_URL`; CORS on your API allows `localhost:5173` and the deployed frontend
- Loading, empty and error states everywhere, and buttons disabled while their request is running

### Steps
1. Check your API first: is it deployed and working? Test the list, create and validation-error responses in Thunder Client or Postman and write down their exact JSON shape: the list is `{ data, page, limit, total }`, each book looks like `{ id, title, year, genre, pages, read, author: { id, name }, tags: [...] }`, and errors are `{ error, details }`. Make sure CORS allows `http://localhost:5173`.
2. Create the Vite app, `.env.development` with `VITE_API_URL`, and `src/api.js` with one function per endpoint: `getBooks(params)`, `getBook(id)`, `createBook(data)`, `updateBook(id, data)`, `deleteBook(id)` and `getAuthors()`. Each checks `res.ok` and throws an error that includes the API's error body (`deleteBook` gets a 204 with no body, so don't call `res.json()` there).
3. Build the list: keep `search`, `genre` and `page` in state, fetch with an effect that depends on them (debounce the search, abort old requests), and render the books with loading, empty and error states. Show the author with `{book.author.name}` and map `book.tags` to small chips.
4. Add pagination controls ("Previous", "Page 2 of 5", "Next") using `total` and `limit` from the response. Reset to page 1 when the search or genre changes.
5. Build the `BookForm` component with a form action (or controlled inputs): title, year, genre, pages, read, and an author `<select>`. Load the authors once with `getAuthors()` and render one `<option value={author.id}>` per author. Form values are strings, so send `authorId: Number(formData.get("authorId"))` (convert `year` and `pages` too, and a checkbox gives `"on"` or `null`, so use `formData.get("read") === "on"`). Use the form for adding; on a validation error, show each message next to its field and keep the user's input. On success, return to the list and refresh it.
6. Reuse `BookForm` for editing: pass the existing book as `initialValues` and use them as `defaultValue`s; for the author `<select>`, that is `defaultValue={book.author.id}`. Give the form `key={book.id}` so it resets when you edit a different book.
7. Add the read toggle (`PATCH` with `{ read: !book.read }`) and delete with confirmation. Disable each button while its request runs and show an error message if it fails.
8. Deploy the frontend with `VITE_API_URL` pointing to your live API, add the frontend's URL to your API's CORS origins, and redeploy the API.
9. Write a README with a screenshot, both live links, and a link to the API repository (and add a link back from the API's README).

### Hints
- Build the query string with `URLSearchParams` and leave out empty values, so you don't send `?genre=` (the `getBooks` helper from the deployment lesson already does this).
- Seeing "Objects are not valid as a React child"? You rendered `{book.author}`, which is an object. Render `{book.author.name}` instead. Getting a 400 when saving? Check that you send `authorId` (a number), not `author`.
- After a create, update or delete, the simplest way to stay correct is to fetch the list again. A `refreshKey` number in state, added to the effect's dependencies and incremented after each change, does this neatly.
- If your API's errors look like `{ error: "Validation failed", details: [...] }`, write one small function that turns them into `{ title: "…", year: "…" }` for the form.
- Seeing a CORS error? The fix is in the API's `cors()` origins, not in React. Check the exact origin including `https://` and with no trailing slash.

### Stretch goals
- Optimistic update for the read toggle: change the UI immediately and roll back if the request fails.
- Sort options (`?sort=year&order=desc`) if your API supports them, or add them to the API.
- Add login using the authentication you built in the Express module, and only allow editing when logged in.

### Done when
- Search, genre filter and pagination work and are handled by the API
- Books can be added, edited and deleted, and the list updates afterwards
- The read status can be toggled from the list
- Validation errors from the API appear next to the right form fields
- Loading, empty and error states exist, and buttons are disabled during requests
- The frontend is deployed, talks to the deployed API, and the README links both repositories
- Each book shows its author's name and tags, and the form picks the author from a list loaded from `GET /api/authors`

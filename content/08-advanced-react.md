---module
id: areact
title: Advanced React
scrimba: Advanced React.js
weeks: 3–4 weeks
fullCourse: Advanced React patterns course
intro: The patterns real React codebases use: composition, refs, context, reducers and custom hooks, then routing, server data with TanStack Query, code splitting, Tailwind and performance. You'll build a personal dashboard, an online shop front end, and finally take a deliberately slow app and make it fast.
---

---section
id: areact-s1
title: Reusability and shared state
intro: Learn how to build components that are easy to reuse, reach into the DOM with refs, share state without passing props through every level, organise complex updates with reducers, and package logic into your own hooks. You'll finish by building a personal dashboard full of widgets.
---

---lesson
id: ar-1
title: Composition and reusable components
time: 1.5h
video: Cosden Solutions — Compound Components in React (Design Patterns) | https://www.youtube.com/watch?v=N_WgBU3S9W8
docs: Passing JSX as children | https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children
docs: Common props of built-in components | https://react.dev/reference/react-dom/components/common
---
In the React Fundamentals module you built components that each did one job. In real apps the same button, card or tab bar appears in dozens of places, each time slightly different. The beginner reaction is to add a prop for every difference until a component has fifteen of them. **Composition** is the better answer: instead of configuring a component with more and more props, you let the parent pass in the pieces. This lesson shows the three patterns you'll use most: `children`, slots, and compound components.

## The problem: prop explosion

Imagine a `Card` that started simple and then grew:

```tsx
<Card
  title="Weather"
  subtitle="Amsterdam"
  icon="sun"
  showFooter
  footerText="Updated 5 min ago"
  footerLink="/weather"
  bodyText="18°C, sunny"
/>
```

Every new design requirement ("can the footer have a button?") means a new prop and a new `if` inside `Card`. The component becomes hard to read and still can't do what the next screen needs.

## children: the simplest composition

Every component receives a special prop called `children`: whatever you put between its opening and closing tags.

```tsx
import type { ReactNode } from "react";

type CardProps = { title: string; children: ReactNode };

export function Card({ title, children }: CardProps) {
  return (
    <section className="card">
      <h2>{title}</h2>
      <div className="card-body">{children}</div>
    </section>
  );
}

// Usage: the parent decides what goes inside
<Card title="Weather">
  <p>18°C, sunny</p>
  <button>Refresh</button>
</Card>
```

`ReactNode` is the TypeScript type for "anything React can render": elements, strings, numbers, `null`, arrays. `Card` now owns only the *frame* (border, padding, heading) and doesn't care about the content. That's the key idea: a reusable component should decide as little as possible.

## Slots: more than one hole

Sometimes you need content in several places, for example a header area and a footer. Props can hold JSX too, so you can create named "slots":

```tsx
type PanelProps = { header: ReactNode; footer?: ReactNode; children: ReactNode };

export function Panel({ header, footer, children }: PanelProps) {
  return (
    <section className="panel">
      <header>{header}</header>
      <div>{children}</div>
      {footer && <footer>{footer}</footer>}
    </section>
  );
}

<Panel header={<h2>GitHub</h2>} footer={<a href="https://github.com">Open GitHub</a>}>
  <p>42 public repos</p>
</Panel>
```

The parent passes real elements, so it can put anything in the footer (a link, a button, a whole form) without `Panel` needing to change.

## Wrapping native elements: forward the rest

A reusable `Button` should still accept everything a normal `<button>` accepts: `onClick`, `disabled`, `type`, `aria-label` and so on. Don't list them all by hand. Take the props you care about and spread the rest onto the element:

```tsx
import type { ComponentProps } from "react";

type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "secondary";
  size?: "sm" | "md";
};

export function Button({ variant = "primary", size = "md", className = "", ...rest }: ButtonProps) {
  return <button className={`btn btn-${variant} btn-${size} ${className}`} {...rest} />;
}

<Button variant="secondary" onClick={() => alert("Hi")} disabled>Save</Button>
```

- `ComponentProps<"button">` gives you the type of every prop a native button accepts, including `children`.
- `...rest` collects everything you didn't name, and `{...rest}` passes it on. `children` travels inside `rest`, so it renders too.
- `className` is merged instead of overwritten, so the caller can still add a margin.

## Compound components

Some components are made of parts that must work together: tabs, accordions, dropdown menus. A **compound component** splits them into pieces the parent arranges freely, while the pieces share state behind the scenes:

```tsx
<Tabs defaultTab="today">
  <TabButton id="today">Today</TabButton>
  <TabButton id="week">This week</TabButton>
  <TabPanel id="today">Sunny, 18°C</TabPanel>
  <TabPanel id="week">Rain from Wednesday</TabPanel>
</Tabs>
```

How do `TabButton` and `TabPanel` know which tab is active? `Tabs` stores the state and shares it through **context** (the full topic of lesson 3; for now just notice the shape):

```tsx
import { createContext, use, useState, type ReactNode } from "react";

type TabsState = { active: string; setActive: (id: string) => void };
const TabsContext = createContext<TabsState | null>(null);

function useTabs() {
  const ctx = use(TabsContext);
  if (!ctx) throw new Error("Tab parts must be used inside <Tabs>");
  return ctx;
}

export function Tabs({ defaultTab, children }: { defaultTab: string; children: ReactNode }) {
  const [active, setActive] = useState(defaultTab);
  return <TabsContext value={{ active, setActive }}>{children}</TabsContext>;
}

export function TabButton({ id, children }: { id: string; children: ReactNode }) {
  const { active, setActive } = useTabs();
  return (
    <button role="tab" aria-selected={active === id} onClick={() => setActive(id)}>
      {children}
    </button>
  );
}

export function TabPanel({ id, children }: { id: string; children: ReactNode }) {
  const { active } = useTabs();
  return active === id ? <div role="tabpanel">{children}</div> : null;
}
```

The parent now controls the layout (buttons on top, at the bottom, with icons) while `Tabs` controls the behaviour. Many libraries attach the parts as properties (`Tabs.Button`), but separate named exports work just as well.

## Common mistakes

- **Forgetting to forward the rest.** If your `Button` ignores unknown props, `onClick` or `type="submit"` silently stop working. Always spread `...rest`.
- **Overwriting `className`.** Writing `className="btn"` *after* `{...rest}` throws the caller's class away. Merge them, as above.
- **Abstracting too early.** Don't build a "universal" component after seeing one use. Wait until you have two or three real cases, then extract what they share.
- **Using a compound part on its own.** A `TabPanel` outside `<Tabs>` has no context. The `useTabs` check turns that into a clear error message instead of a confusing crash.

## In short

- Prefer composition over configuration: let the parent pass content in.
- `children` is the default slot; extra props of type `ReactNode` give you named slots.
- Wrap native elements with `ComponentProps<"element">` and spread `...rest`.
- Compound components share hidden state through context and let the parent arrange the parts.

### Exercises
- Create the app for this part: `npm create vite@latest dashboard -- --template react-ts`. You'll do most of this part's exercises in this `dashboard` folder and grow it into the Personal dashboard project at the end. In `src/components/Card.tsx`, build a `Card` with a `title` and `children`, and use it three times in `App.tsx` with completely different content (for example a paragraph, a list and a button). Run `npm run dev` and check that each card shows its own content.
- In `dashboard`, build a reusable `Button` in `src/components/Button.tsx` supporting `variant` (`primary`, `secondary`, `danger`), `size`, and every native button prop, with CSS that makes the variants look different. Check that `type="submit"` and `disabled` work: put two of them in a `<form>` whose `onSubmit` calls `e.preventDefault()` and logs "submitted". The normal one logs it; the `disabled` one can't be clicked.
- In `dashboard`, build a `Panel` in `src/components/Panel.tsx` with `header`, `children` and an optional `footer` slot. Use it in `App.tsx` once with a link in the footer and once without a footer, and check in DevTools → Elements that the second one has no empty `<footer>`.
- Create a second, throwaway app for practice exercises that don't belong in the dashboard: `npm create vite@latest react-playground -- --template react-ts`. In it, build compound `Accordion` / `AccordionItem` components (each item has an `id`, a `title` and `children`) where only one item can be open at a time: opening one closes the others. Then render an `AccordionItem` outside an `Accordion` and check that your own helpful error message appears.
  Hint: Copy the shape of the `Tabs` example above: `Accordion` keeps the open item's id in state and shares it through context, and each `AccordionItem` reads it with a `useAccordion()` hook that throws when the context is `null`.

---lesson
id: ar-2
title: Refs
time: 1h
video: Web Dev Simplified — Learn useRef in 11 Minutes | https://www.youtube.com/watch?v=t2ypzz6gJm0
docs: Referencing values with refs | https://react.dev/learn/referencing-values-with-refs
docs: Manipulating the DOM with refs | https://react.dev/learn/manipulating-the-dom-with-refs
docs: useRef reference | https://react.dev/reference/react/useRef
---
React wants you to describe the screen with state and let it update the DOM for you. But sometimes you need to step outside that model: put the cursor in an input, scroll a list to the bottom, measure an element, or remember a timer id without causing a re-render. That's what **refs** are for. They're an "escape hatch": very useful, but only for the jobs React can't do declaratively.

## State versus ref

`useRef` returns a plain object `{ current: ... }` that React keeps for the whole life of the component. You can read and change `ref.current` freely, and **changing it does not re-render** the component.

```tsx
import { useRef, useState } from "react";

export function ClickCounter() {
  const [shown, setShown] = useState(0);
  const clicks = useRef(0);

  function handleClick() {
    clicks.current += 1; // no re-render
  }

  return (
    <>
      <button onClick={handleClick}>Click me</button>
      <button onClick={() => setShown(clicks.current)}>Show count</button>
      <p>Clicks: {shown}</p>
    </>
  );
}
```

Clicking the first button changes the ref, but nothing on screen updates. Only when you set state does React re-render and show the number. That's the rule: **if it appears on screen, it's state. If it's only needed by your event handlers, it can be a ref.**

## Refs to DOM elements

The most common use is getting hold of a real DOM node. Create a ref, attach it with the `ref` attribute, and React fills in `current` once the element exists:

```tsx
import { useRef } from "react";

export function SearchBox() {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input ref={inputRef} placeholder="Search…" />
      <button onClick={() => inputRef.current?.focus()}>Focus search</button>
    </>
  );
}
```

- `useRef<HTMLInputElement>(null)` tells TypeScript which element the ref will hold. It starts as `null` because during the first render the input doesn't exist yet.
- `inputRef.current?.focus()` calls the real DOM method. The `?.` handles the moment where it could still be `null`.

Other everyday uses: `element.scrollIntoView()`, `dialogRef.current?.showModal()` for a native `<dialog>`, `element.getBoundingClientRect()` to measure size.

## Passing a ref to your own component

In React 19, `ref` is a normal prop on function components. If you build your own `TextInput`, you simply pass the ref on to the real input:

```tsx
import type { ComponentProps } from "react";

export function TextInput({ label, ref, ...rest }: ComponentProps<"input"> & { label: string }) {
  return (
    <label>
      {label}
      <input ref={ref} {...rest} />
    </label>
  );
}

// The parent can now focus it:
// <TextInput label="Email" ref={emailRef} />
```

Older code wraps components in `forwardRef(...)` to do this. You'll still see it in libraries and tutorials, but in React 19 you don't need it.

## Values that aren't for display

Refs also store values that must survive between renders but don't affect the output, like the id of a running interval:

```tsx
import { useEffect, useRef, useState } from "react";

export function Stopwatch() {
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const intervalRef = useRef<number | null>(null);

  function start() {
    stop();
    setStartedAt(Date.now());
    setNow(Date.now());
    intervalRef.current = window.setInterval(() => setNow(Date.now()), 10);
  }

  function stop() {
    if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
    intervalRef.current = null;
  }

  // Cleanup only: stop the interval if the component disappears while running
  useEffect(() => () => {
    if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
  }, []);

  const seconds = startedAt ? (now - startedAt) / 1000 : 0;

  return (
    <>
      <p>{seconds.toFixed(2)} s</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </>
  );
}
```

The interval id is never shown, but `stop()` needs it later. A normal variable (`let id`) would be reset on every render; state would cause pointless re-renders. A ref is exactly right. We use `window.setInterval` so TypeScript knows it returns a `number`. The effect has no setup, only a cleanup: without it, leaving the page while the stopwatch runs would keep the interval calling `setNow` forever.

## Ref callbacks

Instead of a ref object you can pass a function. React calls it with the DOM node when the element appears. In React 19 it can return a cleanup function that runs when the element is removed. This is handy for lists, where you can't create one `useRef` per item:

```tsx
const itemRefs = useRef(new Map<number, HTMLLIElement>());

{items.map((item) => (
  <li
    key={item.id}
    ref={(node) => {
      if (node) itemRefs.current.set(item.id, node);
      return () => { itemRefs.current.delete(item.id); };
    }}
  >
    {item.text}
  </li>
))}

// later, in an event handler:
itemRefs.current.get(id)?.scrollIntoView({ behavior: "smooth" });
```

Careful: an inline ref callback is a **new function on every render**, so React runs the cleanup and calls it again after every re-render. That's harmless for storing nodes, but bad for side effects: `ref={(node) => { node?.scrollIntoView(); }}` would scroll on *every* render, not only when a new message arrives. For "scroll to the newest message", put a normal ref on an element after the list and scroll in an effect:

```tsx
const endRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  endRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages.length]);

return (
  <>
    <ul>{messages.map((m) => <li key={m.id}>{m.text}</li>)}</ul>
    <div ref={endRef} />
  </>
);
```

## Common mistakes

- **Using a ref for something the user should see.** The value changes but the screen doesn't. If it's displayed, use state.
- **Reading `ref.current` during rendering.** During the first render, a DOM ref is still `null`, and refs don't trigger updates. Read refs in event handlers and effects, not in the JSX you return.
- **Forgetting the type.** `useRef(null)` without `<HTMLInputElement>` gives a ref TypeScript won't let you call `.focus()` on.
- **Manipulating the DOM React owns.** Focusing or scrolling is fine. Adding or removing elements by hand with `appendChild` fights React and leads to strange bugs.

## In short

- `useRef` gives a persistent `{ current }` box; changing it doesn't re-render.
- Attach a ref with `ref={myRef}` to reach a DOM node (focus, scroll, measure, `showModal`).
- In React 19, `ref` is a regular prop, so your own components can pass it on without `forwardRef`.
- Displayed data belongs in state; timer ids and DOM nodes belong in refs.

### Exercises
- In `react-playground`, build a `SearchBox` component whose input is focused automatically when the page loads (use an effect plus a ref) and again when the user clicks a "Focus" button. Check: after a reload you can type straight away, without clicking the input.
- In `react-playground`, build the `Stopwatch` above, then add a "Lap" button that adds the current time to a `laps` array in state and shows the laps as a list under the buttons.
- In `react-playground`, build a form with three inputs (name, email, message). On submit, if a field is empty, focus the first empty field and show an error message next to it. Check by filling in only the name: the cursor should jump to the email field.
- In `react-playground`, build a chat-style list: a text input and a "Send" button that add a message to a `messages` array in state. Put the `<ul>` and an empty `<div ref={endRef} />` together inside a box with a fixed height and `overflow-y: auto`, and scroll `endRef` into view in an effect, as in the lesson. Check: after 15 messages, the newest one is still visible every time you send.

---lesson
id: ar-3
title: Context
time: 1.5h
video: Web Dev Simplified — Learn useContext in 13 Minutes | https://www.youtube.com/watch?v=5LrDIWkK_Bc
docs: Passing data deeply with context | https://react.dev/learn/passing-data-deeply-with-context
docs: createContext reference | https://react.dev/reference/react/createContext
docs: useContext reference | https://react.dev/reference/react/useContext
---
Some data is needed almost everywhere: the current theme, the logged-in user, the language, the shopping cart. Passing it as a prop from the top through every component in between ("prop drilling") makes the middle components carry data they never use. **Context** lets a component high up in the tree make a value available to *any* component below it, however deep, without passing props.

## The problem: prop drilling

```tsx
function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  return <Layout theme={theme} setTheme={setTheme} />;
}
function Layout({ theme, setTheme }) {
  return <Header theme={theme} setTheme={setTheme} />; // Layout doesn't use them
}
function Header({ theme, setTheme }) {
  return <ThemeToggle theme={theme} setTheme={setTheme} />; // neither does Header
}
```

Every new level means more props to pass along, and renaming one means editing every file in the chain.

## Three steps: create, provide, read

**1. Create** the context, usually in its own file:

```tsx
import { createContext } from "react";

export type Theme = "light" | "dark";
export const ThemeContext = createContext<Theme>("light");
```

The argument is the **default value**, used only when a component reads the context without any provider above it.

**2. Provide** a value by wrapping part of the tree. In React 19 the context itself is the provider component:

```tsx
<ThemeContext value="dark">
  <Layout />
</ThemeContext>
```

Older code (and React 18) writes `<ThemeContext.Provider value="dark">`. It means the same thing.

**3. Read** it in any component below:

```tsx
import { useContext } from "react";

function ThemeLabel() {
  const theme = useContext(ThemeContext);
  return <p>Current theme: {theme}</p>;
}
```

React 19 also has `use(ThemeContext)`, which does the same job but, unlike other hooks, may be called inside an `if`. Use whichever your team prefers; this module uses `use`.

## The provider-and-hook pattern

A context with only a value isn't very useful: you usually want to *change* it too. The standard pattern puts the state, the provider and a custom hook in one file:

```tsx
import { createContext, use, useState, type ReactNode } from "react";

type Theme = "light" | "dark";
type ThemeContextValue = { theme: Theme; toggleTheme: () => void };

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  function toggleTheme() {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }

  return <ThemeContext value={{ theme, toggleTheme }}>{children}</ThemeContext>;
}

export function useTheme() {
  const ctx = use(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
```

And in your app:

```tsx
// main.tsx
<ThemeProvider>
  <App />
</ThemeProvider>

// anywhere below
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>Switch to {theme === "light" ? "dark" : "light"}</button>;
}
```

Why this shape?

- The default is `null`, and `useTheme` throws if there's no provider. A missing provider becomes an obvious error instead of a silent bug.
- Components never import `ThemeContext` directly; they call `useTheme()`. If you later change how the theme is stored, only this file changes.
- TypeScript knows that the value returned by `useTheme()` is never `null`.

## Context and re-renders

When the value of a provider changes, **every component that reads that context re-renders**. Two practical consequences:

- **Keep contexts focused.** Don't put the theme, the user and the cart in one big `AppContext`. Adding an item to the cart would then re-render every component that only wanted the theme. Make one context per concern.
- **Keep fast-changing data out.** Something that changes on every keystroke or every second is usually better as local state.

Note that `ThemeProvider` receives `children` from its parent. When the theme changes, only `ThemeProvider` and the components that *read* the context re-render, not the whole app between them. You'll learn more about this in the performance lesson.

## When not to use context

- **Data needed one or two levels down.** Just pass a prop. It's explicit and easy to follow.
- **Avoiding a few props in a layout.** Composition (passing `children`) often removes the drilling without any context.
- **Data from a server.** Lists of products or posts are better handled by a server-state library like TanStack Query, which you'll meet in section 2.

## Common mistakes

- **Reading the context outside the provider.** You get the default value, which often looks like "my toggle does nothing". The throwing custom hook catches this.
- **Placing the provider too low.** A component that is a *sibling* of the provider, not inside it, can't see the value. Providers usually go in `main.tsx` or the root layout.
- **Creating the context inside a component.** `createContext` belongs at the top level of a module, not in a function body, or you'll get a new, empty context on every render.
- **One giant context for everything.** Split it, so unrelated updates don't re-render the whole app.

## In short

- Context passes a value to any depth without prop drilling.
- `createContext(default)` → `<MyContext value={...}>` → `use(MyContext)` or `useContext(MyContext)`.
- Wrap it in a provider component plus a `useSomething()` hook that throws when the provider is missing.
- Every reader re-renders when the value changes: keep contexts small and focused.

### Exercises
- In `dashboard`, create `src/theme/ThemeContext.tsx` with a `ThemeProvider` and a `useTheme()` hook, and wrap `<App />` in `main.tsx`. Put a toggle button in a component nested at least two levels below `App`. Make the theme set a `data-theme` attribute on `<html>`, and add CSS for `[data-theme="dark"]` (for example a dark background). Check: clicking the button changes the page colours, and DevTools → Elements shows `<html data-theme="dark">`.
  Hint: In `ThemeProvider`, add an effect that runs when `theme` changes: `document.documentElement.dataset.theme = theme;`.
- In `dashboard`, make the theme persist after a page reload (save it in `localStorage`). On the first visit, when nothing is saved yet, start with the user's OS preference: `window.matchMedia("(prefers-color-scheme: dark)").matches` is `true` when the OS uses dark mode. Check: toggle and reload, and the theme stays. Then delete the saved value in DevTools → Application → Local Storage and reload to get the OS theme again.
- In `react-playground`, build an `AuthProvider` and a `useAuth()` hook with `user` (a name, or `null`), `login(name)` and `logout()`. It's a fake login with no password and no server: `login` only stores the name in state. Show "Hi, name" and a "Log out" button in a `Header` component, and a login form (one name input) when logged out.
- In `dashboard`, temporarily render a component that calls `useTheme()` *outside* the `ThemeProvider` (for example next to `<ThemeProvider>` in `main.tsx`) and check that the error shown in the browser is your own clear message. Then undo the change.

---lesson
id: ar-4
title: useReducer
time: 1.5h
video: Web Dev Simplified — Learn useReducer in 20 Minutes | https://www.youtube.com/watch?v=kK_Wqx3RnHk
docs: Extracting state logic into a reducer | https://react.dev/learn/extracting-state-logic-into-a-reducer
docs: Scaling up with reducer and context | https://react.dev/learn/scaling-up-with-reducer-and-context
docs: useReducer reference | https://react.dev/reference/react/useReducer
---
When a component has several pieces of related state and many event handlers that update them, the update logic ends up spread over the whole file. `useReducer` moves all of it into one function, outside the component. Your handlers shrink to one line that says *what happened*, and the reducer decides *how the state changes*. It's easier to read, easy to test, and combined with context it becomes a small "global store" for your app.

## From useState to a reducer

A **reducer** is a pure function with this shape:

```ts
(state, action) => newState
```

It receives the current state and an **action** (an object describing what happened) and returns the next state. Let's write one for a to-do list. With TypeScript, the actions are a union type, one member per kind of event:

```ts
// todosReducer.ts
export type Todo = { id: string; text: string; done: boolean };
export type Filter = "all" | "open" | "done";
export type TodosState = { todos: Todo[]; filter: Filter };

export type TodosAction =
  | { type: "added"; id: string; text: string }
  | { type: "toggled"; id: string }
  | { type: "deleted"; id: string }
  | { type: "filterChanged"; filter: Filter };

export function todosReducer(state: TodosState, action: TodosAction): TodosState {
  switch (action.type) {
    case "added":
      return { ...state, todos: [...state.todos, { id: action.id, text: action.text, done: false }] };
    case "toggled":
      return {
        ...state,
        todos: state.todos.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t)),
      };
    case "deleted":
      return { ...state, todos: state.todos.filter((t) => t.id !== action.id) };
    case "filterChanged":
      return { ...state, filter: action.filter };
  }
}
```

- The `type` field is a **discriminated union** (from the TypeScript module). Inside `case "added"`, TypeScript knows `action.text` exists; inside `case "toggled"` it doesn't.
- Each case returns a **new** object or array, using spread, `map` and `filter`. Nothing is mutated.
- Because every action type is handled and the function's return type is `TodosState`, TypeScript complains if you add a new action type and forget a case.

## Using it in a component

```tsx
import { useReducer, useState } from "react";
import { todosReducer } from "./todosReducer";

export function TodoApp() {
  const [state, dispatch] = useReducer(todosReducer, { todos: [], filter: "all" });
  const [text, setText] = useState("");

  const visible = state.todos.filter((t) =>
    state.filter === "all" ? true : state.filter === "done" ? t.done : !t.done,
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    dispatch({ type: "added", id: crypto.randomUUID(), text: text.trim() });
    setText("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <ul>
        {visible.map((t) => (
          <li key={t.id}>
            <label>
              <input type="checkbox" checked={t.done} onChange={() => dispatch({ type: "toggled", id: t.id })} />
              {t.text}
            </label>
            <button type="button" onClick={() => dispatch({ type: "deleted", id: t.id })}>Delete</button>
          </li>
        ))}
      </ul>
    </form>
  );
}
```

`useReducer(reducer, initialState)` returns the current state and a `dispatch` function. Calling `dispatch(action)` makes React run your reducer and re-render with the result. Notice that the input text still uses `useState`: you can mix both. Only the related to-do logic moved into the reducer.

## Rules for reducers

- **Pure.** Same state and action in, same result out. No `fetch`, no `localStorage`, no `Math.random()` or `crypto.randomUUID()` inside. That's why the id above is created in the event handler and passed in the action. In development, React's Strict Mode calls reducers twice to help you spot impure ones.
- **Never mutate.** `state.todos.push(...)` changes the old array, React sees the same reference and may not re-render.
- **Name actions after events**, in the past tense: `added`, `toggled`, `filterChanged`. Not `setTodos`. Actions describe what the user did; the reducer decides what that means.

## Testing a reducer

A reducer is a plain function, so testing it with Vitest needs no React at all:

```ts
import { expect, test } from "vitest";
import { todosReducer } from "./todosReducer";

test("toggling a todo flips done", () => {
  const start = { todos: [{ id: "1", text: "Learn reducers", done: false }], filter: "all" as const };
  const next = todosReducer(start, { type: "toggled", id: "1" });
  expect(next.todos[0].done).toBe(true);
  expect(start.todos[0].done).toBe(false); // the old state was not mutated
});
```

## Reducer plus context

To share the state with the whole app, combine this lesson with the previous one: run `useReducer` in a provider and share `state` and `dispatch` through context.

```tsx
const TodosContext = createContext<{ state: TodosState; dispatch: React.Dispatch<TodosAction> } | null>(null);

export function TodosProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(todosReducer, { todos: [], filter: "all" });
  return <TodosContext value={{ state, dispatch }}>{children}</TodosContext>;
}
```

Add a `useTodos()` hook that throws outside the provider, exactly as you did for the theme. Any component can now read the list or dispatch actions. This is the classic pattern for a shopping cart.

## useState or useReducer?

Use `useState` for independent, simple values: an input's text, whether a menu is open. Switch to `useReducer` when several values change together, when the same update happens from many places, or when you want to unit test the logic.

## Common mistakes

- **Mutating the state** with `push`, `splice` or `state.count++`. Always return new objects and arrays.
- **Forgetting to `return`** in a case. The new state becomes `undefined` and the next render crashes.
- **Side effects in the reducer**, such as saving to `localStorage`. Do that in an effect that watches the state instead.
- **Dispatching the wrong shape**, like `dispatch("added")`. With typed actions, TypeScript catches this for you.

## In short

- A reducer is a pure `(state, action) => newState` function, outside the component.
- `const [state, dispatch] = useReducer(reducer, initialState)`; handlers call `dispatch({ type: "…" })`.
- Type actions as a discriminated union; never mutate; no side effects or randomness inside.
- Reducers are easy to unit test, and reducer + context makes a lightweight global store.

### Exercises
- In `react-playground`, build a counter with `useReducer` and the actions `incremented`, `decremented`, `reset` and `incrementedBy` (which carries an `amount`, for example from a "+5" button). Check every button in the browser.
- In `dashboard`, build the to-do app above (`src/todos/todosReducer.ts` plus a `TodoApp` component shown in `App.tsx`), then add a `completedCleared` action with a "Clear completed" button. Set up Vitest as in the Testing module and write one test per action in `src/todos/todosReducer.test.ts`. Check: `npm test` passes.
- In `react-playground`, write a shopping-cart reducer in `src/cart/cartReducer.ts` with `added`, `removed`, `quantityChanged` and `cleared` actions, plus a `getCartTotal(state)` function that adds up price × quantity. Set up Vitest in this app too and test the reducer and the total before building any UI. You can reuse this code in Part 2's online shop.
- In `react-playground`, share the cart through a `CartProvider` and a `useCart()` hook. Render a `Header` that shows the number of items and, in a different branch of the tree, a `ProductList` of 3–4 hard-coded products with "Add to cart" buttons. Check: clicking a button updates the count in the header, although the two components pass no props to each other.

---lesson
id: ar-5
title: Custom hooks
time: 1.5h
video: Web Dev Simplified — Learn Custom Hooks in 10 Minutes | https://www.youtube.com/watch?v=6ThXsUwLWvc
docs: Reusing logic with custom hooks | https://react.dev/learn/reusing-logic-with-custom-hooks
docs: Rules of Hooks | https://react.dev/reference/rules/rules-of-hooks
docs: renderHook (React Testing Library) | https://testing-library.com/docs/react-testing-library/api/#renderhook
---
You'll notice the same few lines of state and effects appearing in many components: "load data from a URL", "save this to localStorage", "wait until the user stops typing". A **custom hook** lets you pull that logic out into a function and reuse it, the same way a component lets you reuse a piece of UI. Your components become shorter and read like a description of what they do.

## What a custom hook is

A custom hook is just a function whose name starts with `use` and that calls other hooks. Nothing more. React treats it like any hook: it must follow the Rules of Hooks (only call it at the top level of a component or another hook, never inside `if` or loops).

Here's the first one you'll want in almost every project:

```tsx
import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved !== null ? (JSON.parse(saved) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
```

- The function passed to `useState` runs only on the first render (lazy initial state), so we read `localStorage` once, not on every render.
- `try/catch` protects against broken JSON in storage.
- The effect saves the value every time it changes.
- `as const` makes TypeScript treat the result as a tuple, so it can be used exactly like `useState`:

```tsx
const [city, setCity] = useLocalStorage("city", "Amsterdam");
```

## Hooks share logic, not state

If two components both call `useLocalStorage("city", ...)`, each gets its **own** `useState` inside. They don't automatically stay in sync. A custom hook is a recipe that every caller cooks separately. When you need one shared value, put it in context (lesson 3) and write a hook that *reads* the context.

## useDebounce: waiting for the user

Searching on every keystroke sends a request per letter. A debounced value only updates after the user stops typing for a moment:

```tsx
export function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

// In a component:
const [search, setSearch] = useState("");
const debouncedSearch = useDebounce(search, 400);
// use debouncedSearch to filter or fetch
```

Every time `value` changes, the cleanup cancels the previous timer and a new one starts. Only when the value stays the same for `delay` milliseconds does the timer finish.

## useFetch: loading data

Loading data needs the same three pieces every time: the data, an error, and whether it's still loading. Here's a hook that handles them, including the case where the URL changes before the old request finishes:

```tsx
import { useEffect, useState } from "react";

type Result<T> = { url: string; data: T | null; error: Error | null };

export function useFetch<T>(url: string | null) {
  const [result, setResult] = useState<Result<T> | null>(null);

  useEffect(() => {
    if (url === null) return; // nothing to fetch yet
    const controller = new AbortController();

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json() as Promise<T>;
      })
      .then((data) => setResult({ url, data, error: null }))
      .catch((err: unknown) => {
        if (controller.signal.aborted) return; // we cancelled it ourselves
        setResult({ url, data: null, error: err instanceof Error ? err : new Error(String(err)) });
      });

    return () => controller.abort();
  }, [url]);

  if (url === null) return { data: null, error: null, isLoading: false };
  if (!result || result.url !== url) return { data: null, error: null, isLoading: true };
  return { data: result.data, error: result.error, isLoading: false };
}
```

- `fetch` doesn't reject on a 404 or 500, so we check `res.ok` and throw ourselves.
- When `url` changes, the cleanup aborts the old request, so an old, slow response can never overwrite a newer one.
- We store which URL the result belongs to. "Loading" is simply "the result we have isn't for the current URL", so we never need to set a loading flag by hand.
- `url` may be `null`: then the hook fetches nothing. That's how a component "skips" a hook without calling it inside an `if`, for example while it waits for a username or coordinates.

Using it reads almost like English:

```tsx
type User = { login: string; public_repos: number };

function GitHubCard({ username }: { username: string }) {
  const { data, error, isLoading } = useFetch<User>(`https://api.github.com/users/${username}`);
  if (isLoading) return <p>Loading…</p>;
  if (error) return <p>Error: {error.message}</p>;
  return <p>{data?.login} has {data?.public_repos} public repos</p>;
}
```

You can build more specific hooks on top: `useGitHubUser(name)` that calls `useFetch` with the right URL and type. In section 2 you'll replace this hand-made hook with TanStack Query, which adds caching and retries. Writing it yourself first shows you what that library does for you.

## Testing a hook

React Testing Library's `renderHook` runs a hook inside a tiny test component:

```tsx
import { act, renderHook } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { useDebounce } from "./useDebounce";

test("updates only after the delay", () => {
  vi.useFakeTimers();
  const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
    initialProps: { value: "a" },
  });

  rerender({ value: "ab" });
  expect(result.current).toBe("a");

  act(() => vi.advanceTimersByTime(500));
  expect(result.current).toBe("ab");
  vi.useRealTimers();
});
```

`result.current` is whatever the hook returned in the latest render; `rerender` passes new arguments; fake timers let you skip the 500 ms instantly.

## Common mistakes

- **Not starting the name with `use`.** React's lint rules then can't check that the Rules of Hooks are followed inside it. The opposite is also wrong: a function that calls no hooks should be a normal function, not `useSomething`.
- **Calling a hook conditionally**, like `if (loggedIn) useFetch(...)`. Instead, pass an argument that tells the hook to do nothing, or move the condition into a child component.
- **Expecting shared state.** Two calls to the same hook are independent.
- **Returning JSX.** Hooks return data and functions; components return UI.
- **Changing the `key` of `useLocalStorage`.** The `useState` initialiser runs only on the first render, so with a new key the effect saves the *old* value under the new key. If the key can change, render the component with `key={storageKey}`: React then remounts it and reads storage again.

## In short

- A custom hook is a `use…` function that calls other hooks to package reusable logic.
- Each caller gets its own independent state.
- Good first hooks: `useLocalStorage`, `useDebounce`, `useFetch`.
- Test hooks with `renderHook` and, for timers, Vitest's fake timers.

### Exercises
- In `dashboard`, write `useLocalStorage(key, initial)` in `src/hooks/useLocalStorage.ts` and use it for a "Your name" input above the widgets that shows "Hello, name". Check: type a name, reload the page, and the name is still there.
- In `dashboard`, write `useDebounce(value, delay)` in `src/hooks/useDebounce.ts`. Add a search input and log its debounced value with `console.log` in an effect, so the query is logged only after 400 ms without typing: typing "react" quickly should give one log, not five. Then add the test above as `src/hooks/useDebounce.test.ts` (with React Testing Library set up as in the Testing module) and check that `npm test` passes.
- In `dashboard`, write `useFetch<T>(url)` in `src/hooks/useFetch.ts` and use it to show a GitHub user (try your own username): login and number of public repos, with loading and error states. Then build `useGitHubUser(username)` in `src/hooks/useGitHubUser.ts` on top of it and use that instead. Check: a username that doesn't exist shows the 404 error message.
- In `dashboard`, write `useMediaQuery(query)` in `src/hooks/useMediaQuery.ts` that returns `true`/`false` and updates when the window is resized (listen to the `change` event of `window.matchMedia(query)` and remove the listener in the cleanup). Show "Wide screen" or "Narrow screen" with `useMediaQuery("(min-width: 768px)")` and resize the browser to check that the text switches.
  Hint: Start with `useState(() => window.matchMedia(query).matches)`. In the effect, create `const mql = window.matchMedia(query)` and a handler `(e: MediaQueryListEvent) => setMatches(e.matches)`, add it with `mql.addEventListener("change", handler)`, and return a cleanup that calls `mql.removeEventListener("change", handler)`.

---project
id: ar-p2
title: Personal dashboard
summary: A start page with widgets (clock, todos, weather, GitHub, quote), built with reusable components, context, reducers and custom hooks.
---
### The task
Build a personal start page with widgets you'd actually use every day: a clock, a to-do list, the weather where you are, your GitHub stats and a quote of the day. It's the perfect project for this section: each widget is a reusable card, each data source gets its own custom hook, and the theme and settings are shared through context. Write it in React with TypeScript.

### What it must do
- A reusable `Widget` component (title, optional `actions` slot, `children`) used for every widget, laid out in a responsive grid (1 column on phones, 2–3 on larger screens)
- **Clock**: current time and date, updating every second
- **Todo list**: add, toggle, delete and "clear completed", managed with `useReducer`, saved in `localStorage`
- **Weather**: current temperature and conditions from the free Open-Meteo API (no key needed), using the browser's location, with a fallback city if the user refuses
- **GitHub**: avatar, name, public repos and followers for a username, from the public GitHub API
- **Quote of the day**: from `https://dummyjson.com/quotes/random`, or from a local array of quotes chosen by the day of the year
- Every data widget uses its own custom hook (`useWeather`, `useGitHubUser`, `useQuote`) returning `{ data, error, isLoading }`, and shows a loading state and a friendly error message
- A `ThemeProvider` with a light/dark toggle, starting from the OS preference and remembered after reload
- A settings panel (a native `<dialog>` opened through a ref) where you set your GitHub username and fallback city and choose which widgets are shown; settings are managed with a reducer, shared through context and persisted
- Tests: the todo and settings reducers, plus at least two custom hooks with `renderHook`

### Steps
1. **Scaffold and layout.** Continue in your `dashboard` folder from lessons 8.1–8.5: you've already built several pieces of this project there (cards, the theme, the todos reducer, the hooks), so treat the steps below as a checklist and add only what's missing. (If you skipped those exercises, create it with `npm create vite@latest dashboard -- --template react-ts`.) Make sure Vitest and React Testing Library are set up as in the Testing module. Build the `Widget` component and a CSS grid with five placeholder widgets. Run it and check the grid at phone and desktop width.
2. **Clock and todos.** Build the Clock (an interval in an effect, cleaned up). Write `todosReducer` with typed actions and test every action *before* building the Todo widget's UI. Focus the new-todo input when the widget loads, using a ref.
3. **Persistence.** Write `useLocalStorage` with tests (`renderHook`) and use it for simple values like the theme and the fallback city. Make the todos survive a reload too (a reducer needs a slightly different approach, see the hints).
4. **GitHub widget.** Write `useFetch<T>`, then `useGitHubUser(username)` on top of it. Show the avatar and stats, a loading state, and a clear message for an unknown username (the API answers 404).
5. **Weather widget.** Write a `useGeolocation()` hook that wraps `navigator.geolocation.getCurrentPosition` and returns coordinates or an error. Build `useWeather(coords)` with Open-Meteo and turn the weather code into a readable label.
6. **Quote widget.** Build `useQuote()` and the quote widget. Add a "New quote" button in the widget's `actions` slot.
7. **Theme and settings.** Build `ThemeProvider`/`useTheme` and a `SettingsProvider` (reducer + context, persisted). Build the settings `<dialog>` and open it with `dialogRef.current?.showModal()`. Hide widgets that are switched off.
8. **Polish and ship.** Check keyboard use (tab order, visible focus, the dialog closes with Escape), write a README with a screenshot and a short explanation of your hooks, and deploy to a static host such as Netlify or Vercel.

### Hints
- Open-Meteo example: `https://api.open-meteo.com/v1/forecast?latitude=52.37&longitude=4.89&current=temperature_2m,weather_code`. Weather codes are documented on open-meteo.com; a small lookup object (`0: "Clear"`, `61: "Rain"`, …) is enough.
- The GitHub API allows 60 requests per hour without a key. Don't fetch on every keystroke in the settings: save the username on submit, or use `useDebounce`.
- A hook can't be called conditionally. If there are no coordinates yet, let `useWeather` accept `null` and simply not fetch (like `useFetch` with a `null` URL), instead of wrapping it in an `if`.
- `useLocalStorage` wraps `useState`, so it can't hold reducer state. For the todos (and the settings), give `useReducer` an init function as third argument, which runs once: `useReducer(todosReducer, [], loadTodos)`, where `loadTodos` reads and parses `localStorage.getItem("todos")` inside `try/catch` and falls back to `[]`. Then save in an effect: `useEffect(() => { localStorage.setItem("todos", JSON.stringify(todos)); }, [todos])`.
- For the theme, set a `data-theme` attribute on `document.documentElement` in an effect and define your colours as CSS variables for each theme.
- Generate todo ids with `crypto.randomUUID()` in the event handler, not in the reducer.

### Stretch goals
- After the next section's lesson on error boundaries, wrap each widget in an `ErrorBoundary` so one broken widget can't take down the page. Test it by breaking a URL on purpose.
- Drag-and-drop widget reordering with dnd-kit, with the order saved in settings.
- Cache the GitHub and quote responses in `localStorage` with a timestamp and reuse them for an hour.
- Make it your browser's new-tab page.

### Done when
- All five widgets work, each inside the reusable `Widget` component, in a responsive grid
- Each data widget gets its data from its own custom hook and shows loading and error states
- Todos, theme and settings survive a page reload
- The settings dialog can change the GitHub username and hide or show widgets
- Reducer tests and at least two hook tests pass with `npm test`
- The project is deployed and on GitHub with a README and screenshot

---section
id: areact-s2
title: Routing, data and styling
intro: Turn a single page into a real multi-page app with React Router, load and cache server data with TanStack Query, split your code with lazy loading and catch errors with error boundaries, then style it all quickly with Tailwind. You'll finish by building the front end of an online shop.
---

---lesson
id: ar-6
title: React Router
time: 2h
video: Maximilian Schwarzmüller — React Router 7: library mode vs framework mode | https://www.youtube.com/watch?v=NVuxUktUvxc
docs: React Router docs | https://reactrouter.com/home
docs: React Router: declarative routing | https://reactrouter.com/start/declarative/routing
---
So far your React apps have been a single page. Real apps have many: a product list, a product page, a cart, an account. In a single-page app the browser never really loads a new page; instead, a **router** looks at the URL and decides which components to show. The URL still matters a lot: users bookmark it, share it, and use the back button. React Router is the most widely used router for React, and this lesson uses its simplest setup, called **declarative mode**.

## Setup

```bash
npm install react-router
```

In React Router v7 everything is imported from the `react-router` package. Older tutorials use `react-router-dom`; in v7 that package only re-exports the same things.

Wrap your app in a `BrowserRouter`, which connects React Router to the browser's address bar:

```tsx
// main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

## Routes and nested layouts

```tsx
// App.tsx
import { Route, Routes } from "react-router";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="books" element={<Books />} />
        <Route path="books/:id" element={<BookDetail />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
```

- `<Routes>` picks the best matching `<Route>` for the current URL.
- The outer route has no `path`, only an `element`: it's a **layout route**. All the routes inside it render *inside* `Layout`.
- `index` means "the default child", shown at `/`.
- `:id` is a **URL parameter**: `/books/42` matches, with `id = "42"`.
- `path="*"` matches anything else: your 404 page.

The layout decides *where* the child page appears with `<Outlet />`:

```tsx
import { NavLink, Outlet } from "react-router";

function Layout() {
  return (
    <>
      <header>
        <nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/books">Books</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
```

The header stays on screen while only the content inside `<main>` changes.

## Links and navigation

Use `<Link to="/books">` (or `NavLink`) instead of `<a href>`. A link changes the URL *without* reloading the page, so your state survives and the switch is instant. `NavLink` also knows whether it's active, so you can style the current page:

```tsx
<NavLink to="/books" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
  Books
</NavLink>
```

To navigate from code, for example after a form is submitted, use `useNavigate`:

```tsx
const navigate = useNavigate();
// …after saving:
navigate("/books");
navigate(-1); // like the browser's back button
```

## Reading URL parameters

```tsx
import { useParams } from "react-router";

function BookDetail() {
  const { id } = useParams();
  return <h1>Book {id}</h1>;
}
```

Parameters are always **strings** (or `undefined`). Convert with `Number(id)` when your data uses numeric ids.

## Search params: state in the URL

Filters, sorting, a search term, the current page: if you store these in the URL (`/books?genre=fantasy&sort=title`), users can share and bookmark the exact view, and the back button works. `useSearchParams` works like `useState`, but the state lives in the query string:

```tsx
import { useSearchParams } from "react-router";

function Books() {
  const [searchParams, setSearchParams] = useSearchParams();
  const genre = searchParams.get("genre") ?? "all";

  function changeGenre(next: string) {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev); // a copy: don't change prev itself
      if (next === "all") params.delete("genre");
      else params.set("genre", next);
      return params;
    });
  }

  return (
    <select value={genre} onChange={(e) => changeGenre(e.target.value)}>
      <option value="all">All</option>
      <option value="fantasy">Fantasy</option>
      <option value="history">History</option>
    </select>
  );
}
```

Passing a function to `setSearchParams` keeps the other params (like `sort`) that you're not changing.

## Protected routes

Some pages are only for logged-in users. A small layout route can guard a whole group:

```tsx
import { Navigate, Outlet } from "react-router";

function RequireAuth() {
  const { user } = useAuth(); // from your AuthProvider
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

// in App:
<Route element={<RequireAuth />}>
  <Route path="account" element={<Account />} />
  <Route path="orders" element={<Orders />} />
</Route>
```

`<Navigate>` redirects as soon as it renders; `replace` stops the protected page from staying in the history. Remember this only hides pages in the browser: real protection of data always happens on the server.

## Other modes

React Router v7 can also run in **data mode** (routes defined as objects with `createBrowserRouter`, with functions that load data before a page renders) and **framework mode** (a full framework with server rendering). Declarative mode is all you need here; you'll meet loading data on the server properly in the Next.js module.

## Common mistakes

- **Using `<a href>` for internal links.** The whole app reloads and all state is lost. Use `Link`.
- **Forgetting `<Outlet />` in a layout.** The URL changes but the page content never appears.
- **Treating params as numbers.** `useParams().id` is a string; `"42" === 42` is `false`.
- **404 on refresh after deploying.** The host looks for a real file at `/books/42`. Configure your host to serve `index.html` for every path (a "rewrite" or "SPA fallback" setting on Netlify, Vercel and similar).

## In short

- `BrowserRouter` + `Routes` + `Route` map URLs to components; layout routes render children in `<Outlet />`.
- Use `Link`/`NavLink` for links and `useNavigate` to navigate from code.
- `useParams` reads `:id` parts (as strings); `useSearchParams` stores shareable UI state in the URL.
- A layout route with `<Navigate>` can protect a group of pages.

### Exercises
- Create the app for this part's project, the online shop: `npm create vite@latest online-shop -- --template react-ts`, then `npm install react-router`. You'll grow this `online-shop` folder through lessons 8.6–8.9. Build Home, Products, About and a 404 page, all inside a shared `Layout` with a navigation bar that highlights the active link. Check: clicking a link changes the URL without reloading the page, and a made-up URL like `/xyz` shows your 404 page.
- In `online-shop`, add `/products/:id` that shows one product from a local array (`src/products.ts`: 6 products with `id`, `title`, `price` and `category`), and link each product on the Products page to it. An unknown id like `/products/999` shows a "Product not found" message. Add a "Back" button that uses `useNavigate`.
- On the Products page of `online-shop`, add a category filter and a sort option (by price or title), both stored in search params. Copy the URL (for example `/products?category=books&sort=price`) into a new tab and check it shows the same view.
- In `online-shop`, add a fake login: an `AuthProvider` with `user`, `login(name)` and `logout()` (like the one from lesson 8.3), and a `/login` page with a name input that calls `login` and then navigates to `/account`. Protect an `/account` page with a `RequireAuth` layout route. Check: while logged out, opening `/account` sends you to `/login`. (A full page reload forgets the fake user, so typing `/account` in the address bar also sends you to `/login`.)

---lesson
id: ar-7
title: Server state with TanStack Query
time: 2h
video: Cosden Solutions — React Query (TanStack Query) Complete Tutorial | https://www.youtube.com/watch?v=8K1N3fE-cDs
docs: TanStack Query docs | https://tanstack.com/query/latest/docs/framework/react/overview
docs: Queries guide | https://tanstack.com/query/latest/docs/framework/react/guides/queries
docs: Mutations guide | https://tanstack.com/query/latest/docs/framework/react/guides/mutations
docs: Query keys guide | https://tanstack.com/query/latest/docs/framework/react/guides/query-keys
---
Your `useFetch` hook works, but real apps quickly need more: if two components show the same data, they fetch it twice; going back to a page shows a spinner again even though you just had the data; a failed request isn't retried; after you add an item, the list doesn't update. Data that comes from a server ("server state") has different problems from local UI state. **TanStack Query** (formerly React Query) solves them: it caches responses, removes duplicate requests, retries failures, refetches in the background and lets you refresh data after a change.

## Setup

```bash
npm install @tanstack/react-query
```

Create **one** `QueryClient` (it holds the cache) outside your components and provide it at the top of the app:

```tsx
// main.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
);
```

## Reading data with useQuery

```tsx
import { useQuery } from "@tanstack/react-query";

type Product = { id: number; title: string; price: number };

async function fetchProducts(): Promise<Product[]> {
  const res = await fetch("https://dummyjson.com/products?limit=20");
  if (!res.ok) throw new Error(`Could not load products (${res.status})`);
  const json = await res.json();
  return json.products;
}

export function ProductList() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  if (isPending) return <p>Loading…</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data.map((p) => (
        <li key={p.id}>{p.title} (${p.price})</li>
      ))}
    </ul>
  );
}
```

- **`queryKey`** is the name of this data in the cache. Every component that uses `["products"]` shares the same cached result and the same request.
- **`queryFn`** is any function that returns a Promise. It must **throw** on failure; that's how TanStack Query knows something went wrong. `fetch` doesn't throw on a 404, so you check `res.ok` yourself.
- **`isPending`** is true while there's no data yet. In TanStack Query v5 this replaced the older `isLoading` you'll see in v4 tutorials.
- After the `isPending` and `isError` checks, TypeScript knows `data` is defined.

## Query keys with variables

If the data depends on a value, put that value in the key:

```tsx
function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await fetch(`https://dummyjson.com/products/${id}`);
      if (!res.ok) throw new Error("Product not found");
      return (await res.json()) as Product;
    },
  });
}
```

`["product", "1"]` and `["product", "2"]` are cached separately. When `id` changes, the key changes and TanStack Query fetches the new product automatically. A good rule: **everything the `queryFn` uses goes into the `queryKey`**: ids, filters, page numbers, search terms.

## Caching and freshness

Two settings control the cache:

- **`staleTime`**: how long data counts as fresh. The default is `0`, so data is "stale" immediately and TanStack Query refetches it in the background when a component mounts again or the window regains focus. Users still see the cached data instantly; it's just updated behind the scenes.
- **`gcTime`**: how long *unused* data stays in the cache before it's removed (default 5 minutes).

For data that rarely changes, like a product catalogue, set a longer `staleTime`:

```tsx
useQuery({ queryKey: ["products"], queryFn: fetchProducts, staleTime: 60_000 }); // 1 minute
```

`isPending` is only true the first time; `isFetching` is true during *any* request, including background refreshes, so you can show a small "updating" indicator.

For pagination, `placeholderData: keepPreviousData` (imported from `@tanstack/react-query`) keeps showing the previous page while the next one loads, instead of flashing a spinner.

## Changing data with useMutation

Reading uses `useQuery`; creating, updating and deleting use `useMutation`. After a successful change, you tell the cache which data is now outdated:

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";

function AddTodo() {
  const queryClient = useQueryClient();

  const addTodo = useMutation({
    mutationFn: async (text: string) => {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("Could not save");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  return (
    <button onClick={() => addTodo.mutate("Learn TanStack Query")} disabled={addTodo.isPending}>
      {addTodo.isPending ? "Saving…" : "Add todo"}
    </button>
  );
}
```

`mutate(...)` runs the `mutationFn`. `invalidateQueries` marks every query whose key starts with `["todos"]` as stale and refetches the ones on screen, so the list updates by itself. This works perfectly with the Express APIs you built earlier.

## Devtools

```bash
npm install -D @tanstack/react-query-devtools
```

Add `<ReactQueryDevtools />` (from `@tanstack/react-query-devtools`) inside the provider. A small panel shows every query, its key, its status and its cached data. It's the fastest way to understand what the library is doing.

## Common mistakes

- **Not throwing in the `queryFn`.** A 404 response is "successful" for `fetch`, so you end up with error JSON as your data. Check `res.ok`.
- **Missing variables in the key.** With `queryKey: ["product"]` for every id, all product pages share one cache entry and show the wrong product.
- **Creating the `QueryClient` inside a component.** It's recreated on every render and the cache is thrown away. Create it once at module level.
- **Copying query data into `useState`.** Then you have two sources of truth that drift apart. Use `data` directly and compute what you need from it.

## In short

- Server state needs caching, deduping, retries and refreshing: TanStack Query does that for you.
- `useQuery({ queryKey, queryFn })` gives `data`, `isPending`, `isError`, `error`; the `queryFn` must throw on failure.
- Put every variable the query depends on into the `queryKey`; tune freshness with `staleTime`.
- `useMutation` changes data; `invalidateQueries` refreshes what changed.

### Exercises
- In `online-shop`, set up TanStack Query (`QueryClientProvider` in `main.tsx`) and change the Products page to load products from `https://dummyjson.com/products` with `useQuery` instead of your local array, with loading and error states. Break the URL on purpose (for example `/productz`) and check that your error message appears. TanStack Query retries a failed request 3 times first, so the error takes a few seconds to show.
- In `online-shop`, change the `/products/:id` page to load one product with `queryKey: ["product", id]` (like `useProduct` above). Install the Devtools, add `<ReactQueryDevtools />`, open two different products and watch a separate cache entry appear for each.
- Add pagination to the Products page of `online-shop`: 10 products per page with DummyJSON's `?limit=10&skip=…` (`skip` is `(page - 1) * 10`), the page number in the query key, "Previous"/"Next" buttons and `placeholderData: keepPreviousData`. Check with network throttling in DevTools: the old page stays visible while the next one loads, instead of a loading message.
- In your `books-frontend` app from the React module (start your `books-api` too), set up TanStack Query and replace the `useEffect` + `fetch` code that loads the book list with `useQuery` (put the search, genre and page in the query key). Then do adding and deleting with `useMutation` and `invalidateQueries`. Check: after you add or delete a book, the list updates by itself, without your `refreshKey` trick.

---lesson
id: ar-9
title: Suspense, lazy loading and error boundaries
time: 1.5h
video: RoadsideCoder — Code Splitting & Lazy Loading in React | https://www.youtube.com/watch?v=IBrmsyy9R94
video: Web Dev Simplified — Learn React Error Boundaries in 7 Minutes | https://www.youtube.com/watch?v=_FuDMEgIy7I
docs: Suspense | https://react.dev/reference/react/Suspense
docs: lazy | https://react.dev/reference/react/lazy
docs: react-error-boundary | https://github.com/bvaughn/react-error-boundary
---
As an app grows, two things start to hurt. First, the JavaScript bundle gets big: a visitor who only wants the home page still downloads the code for checkout, settings and admin. Second, one bug in one small component can blank the entire page. **Lazy loading** with `Suspense` fixes the first problem by downloading code only when it's needed, and **error boundaries** fix the second by containing a crash to one part of the screen.

## Code splitting with lazy

Normally Vite puts all your imported components into one bundle. `lazy` tells it to make a separate file and only download it when the component is first rendered:

```tsx
import { lazy } from "react";

const Checkout = lazy(() => import("./pages/Checkout"));
const Settings = lazy(() => import("./pages/Settings"));
```

- `import("./pages/Checkout")` (with brackets) is a **dynamic import**: it returns a Promise for the module. Bundlers split such modules into their own file.
- `lazy` expects the module to have a **default export** that is a component.
- Declare lazy components at the **top level** of a file, never inside another component.

Pages are the natural place to split, because users visit one page at a time.

## Suspense: what to show while waiting

While the code downloads, the lazy component isn't ready. React then looks for the nearest `<Suspense>` boundary above it and shows its `fallback`:

```tsx
import { Suspense } from "react";
import { Outlet } from "react-router";

function Layout() {
  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<p className="loading">Loading page…</p>}>
          <Outlet />
        </Suspense>
      </main>
    </>
  );
}
```

Because the boundary sits *inside* the layout, the header stays visible and only the page area shows the fallback. If you put one `Suspense` around the whole app, the entire screen is replaced by the spinner, which feels worse. Where you place boundaries is a design decision: put them around the part that's actually waiting.

In your routes, use the lazy components like any other:

```tsx
<Route path="checkout" element={<Checkout />} />
```

Open the Network tab, click to the checkout page, and you'll see a new JavaScript file being downloaded at that moment.

## Suspense for data

`Suspense` isn't only for code. Libraries can "suspend" while data loads too. TanStack Query has `useSuspenseQuery`: it has the same options as `useQuery`, but instead of returning `isPending` it lets the nearest `Suspense` boundary show the loading state, and `data` is always defined. React 19 also has `use(promise)` for reading a promise inside a component, but the promise must be created *outside* rendering (for example by a library or a parent), not with a fresh `fetch` in the component body. For now, `useQuery` or `useSuspenseQuery` is the simpler choice.

## Error boundaries

By default, if any component throws while rendering, React removes the **whole** tree and you get a white page. An **error boundary** is a component that catches errors thrown while rendering the components inside it and shows a fallback instead, while the rest of the page keeps working.

React only offers error boundaries as class components, so almost everyone uses the small `react-error-boundary` package:

```bash
npm install react-error-boundary
```

```tsx
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";

function WidgetError({ error, resetErrorBoundary }: FallbackProps) {
  const message = error instanceof Error ? error.message : "Something went wrong";
  return (
    <div role="alert" className="widget-error">
      <p>This widget crashed: {message}</p>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

export function Dashboard() {
  return (
    <div className="grid">
      <ErrorBoundary FallbackComponent={WidgetError}>
        <WeatherWidget />
      </ErrorBoundary>
      <ErrorBoundary FallbackComponent={WidgetError}>
        <GitHubWidget />
      </ErrorBoundary>
    </div>
  );
}
```

- `FallbackComponent` receives the `error` and a `resetErrorBoundary` function that renders the children again ("Try again").
- If `WeatherWidget` throws, only its card shows the error; the GitHub widget is unaffected.
- `resetKeys={[something]}` resets the boundary automatically when a value changes. In a router layout, `resetKeys={[location.pathname]}` (with `useLocation()`) clears the error when the user navigates to another page.

## What error boundaries don't catch

Error boundaries only catch errors that happen **while React renders** (and in effects). They do **not** catch errors in event handlers or in async code like a `setTimeout` or a `fetch().then()`, because those run outside rendering. For those, handle the error yourself (show a message from state), or pass it to the boundary with the `useErrorBoundary` hook from the same package:

```tsx
const { showBoundary } = useErrorBoundary();

async function handleSave() {
  try {
    await saveSettings();
  } catch (err) {
    showBoundary(err);
  }
}
```

With TanStack Query, `useSuspenseQuery` sends errors to the nearest error boundary automatically, and `useQuery` does too if you set `throwOnError: true`.

## Putting them together

A common shape: an `ErrorBoundary` outside a `Suspense`, around each area that loads independently. If the code or data fails to load, the error boundary shows its fallback; while it loads, `Suspense` shows its fallback.

```tsx
<ErrorBoundary FallbackComponent={PageError}>
  <Suspense fallback={<PageSkeleton />}>
    <Outlet />
  </Suspense>
</ErrorBoundary>
```

## Common mistakes

- **Declaring `lazy` inside a component.** A new lazy component is created on every render, so it reloads and loses its state every time.
- **Lazy-loading a named export.** `lazy` needs a default export. Either add one, or map it: `lazy(() => import("./Cart").then((m) => ({ default: m.Cart })))`.
- **Expecting a boundary to catch a click handler error.** It won't; use `try/catch` and state, or `showBoundary`.
- **One boundary at the very top only.** Then any error still replaces the whole page. Add boundaries around independent parts.

## In short

- `lazy(() => import("./Page"))` splits a component into its own file, downloaded on first use.
- `<Suspense fallback>` shows a placeholder while code (or suspense-ready data) loads; place it around the waiting part.
- `ErrorBoundary` from `react-error-boundary` contains rendering errors to one area and can reset with "Try again".
- Event-handler and async errors need `try/catch` or `showBoundary`.

### Exercises
- In `online-shop`, lazy-load every page with `lazy(() => import("./pages/Products"))` and so on (move each page into its own file in `src/pages/` with a default export first, if it isn't already). For now, wrap your `<Routes>` in one `<Suspense fallback={<p>Loading…</p>}>`. In DevTools → Network (filter "JS"), check that each page's code downloads only when you first visit it.
- In `online-shop`, move that `Suspense` boundary from around `<Routes>` to around the `<Outlet />` in your `Layout`, and compare how navigation feels. Turn on network throttling (for example "Slow 4G") and reload before each try, because each page's code downloads only once. With the boundary in the layout, the header stays visible while a page loads.
- Back in your `dashboard` from Part 1, install `react-error-boundary` and wrap two widgets in separate error boundaries with a fallback that has a "Try again" button. Make one widget throw during rendering about half of the time: `if (Math.random() < 0.5) throw new Error("Boom")`. Check that the other widget keeps working and that "Try again" brings the broken one back (it may take a few clicks).
- In `online-shop`, put an `ErrorBoundary` around the `Suspense` in your `Layout`, with `resetKeys={[location.pathname]}` (`location` comes from `useLocation()`). Make the About page throw during rendering, open it, then click another link in the navigation: the new page should appear normally instead of the error.

---lesson
id: ar-10
title: Styling with Tailwind CSS
time: 1.5h
video: JavaScript Mastery — Tailwind CSS v4 Full Course | https://www.youtube.com/watch?v=6biMWgD6_JY
docs: Tailwind docs | https://tailwindcss.com/docs
docs: Installing Tailwind with Vite | https://tailwindcss.com/docs/installation/using-vite
docs: Responsive design | https://tailwindcss.com/docs/responsive-design
docs: Dark mode | https://tailwindcss.com/docs/dark-mode
---
Tailwind CSS is a **utility-first** CSS framework: instead of writing your own class names and CSS rules, you style elements with many small, single-purpose classes directly in your JSX, like `p-4`, `flex`, `text-lg` or `rounded-xl`. It sounds messy at first, but it's very fast once you know the names, it keeps spacing and colours consistent, and it's used in a large share of React and Next.js jobs. Everything you learned about CSS still applies: Tailwind is just a different way of writing it.

## Setup with Vite (Tailwind v4)

```bash
npm install tailwindcss @tailwindcss/vite
```

Add the plugin to `vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

And replace the contents of your main CSS file (for example `src/index.css`) with one line:

```css
@import "tailwindcss";
```

That's it: no config file needed. Older (v3) tutorials show a `tailwind.config.js` file and `@tailwind base;` lines; you won't need those.

## Utility classes

Here's a product card:

```tsx
export function ProductCard({ title, price, image }: { title: string; price: number; image: string }) {
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <img src={image} alt="" className="aspect-square w-full rounded-lg object-cover" />
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <p className="text-gray-600">${price.toFixed(2)}</p>
      <button className="mt-auto rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
        Add to cart
      </button>
    </article>
  );
}
```

Each class maps to one or two CSS declarations:

- `flex flex-col gap-3`: a vertical flexbox with a gap.
- `p-4`, `px-4`, `py-2`: padding. The numbers are steps on a spacing scale (`4` = `1rem`), which keeps spacing consistent across the app.
- `text-lg`, `font-semibold`, `text-gray-900`: size, weight, colour. Colours go from `50` (lightest) to `950` (darkest).
- `rounded-xl`, `border`, `shadow-sm`: corners, border, shadow.
- `mt-auto`: pushes the button to the bottom of the card.

You don't need to memorise these: install the **Tailwind CSS IntelliSense** extension for VS Code, which autocompletes class names and shows the CSS on hover.

## States and variants

Put a prefix in front of a class to apply it only in a certain state:

```tsx
<button className="bg-blue-600 hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-blue-400 disabled:opacity-50">
  Save
</button>
```

`hover:`, `focus-visible:`, `active:` and `disabled:` work on almost any class.

## Responsive design: mobile first

Unprefixed classes apply to **all** screen sizes. Prefixes like `sm:`, `md:` and `lg:` apply **from that width upwards**:

```tsx
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
  {products.map((p) => <ProductCard key={p.id} {...p} />)}
</div>
```

One column on phones, two from `sm` (640px), four from `lg` (1024px). So you design for the phone first, then add prefixes for larger screens.

## Dark mode

The `dark:` prefix applies a class in dark mode: `bg-white dark:bg-gray-900`. By default it follows the user's operating system setting. If you want a toggle button instead, tell Tailwind to use a `dark` class on a parent element by adding this to your CSS:

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
```

Then add or remove the `dark` class on `<html>` from your theme context.

## Your own design tokens

Customise the theme with CSS variables in an `@theme` block. Tailwind turns each one into classes:

```css
@theme {
  --color-brand-500: oklch(0.62 0.19 260);
  --color-brand-600: oklch(0.55 0.2 260);
  --font-display: "Inter", sans-serif;
}
```

Now `bg-brand-500`, `text-brand-600` and `font-display` exist. For one-off values you can use brackets: `w-[37rem]` or `top-[117px]`, but if you use a value often, add it to the theme.

## Reuse with components, not @apply

Long class lists repeat. The Tailwind way to reuse them is your React components: you write the classes once in `Button` or `ProductCard` and reuse the component everywhere. For classes that depend on props, map each option to a **complete** class string:

```tsx
const variants = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
} as const;

export function Button({ variant = "primary", className = "", ...rest }: ButtonProps) {
  return <button className={`rounded-lg px-4 py-2 font-medium ${variants[variant]} ${className}`} {...rest} />;
}
```

Small helper libraries like `clsx` make conditional classes neater. The `prettier-plugin-tailwindcss` plugin sorts class names automatically so they're easier to scan.

## Common mistakes

- **Building class names from pieces**, like `` `bg-${color}-500` ``. Tailwind scans your files for complete class names and only generates CSS for those it finds, so this class won't exist. Always write the full names, as in the `variants` object above.
- **Following a v3 tutorial.** If you see `tailwind.config.js`, `npx tailwindcss init` or `@tailwind base`, the setup is outdated. Follow the official Vite installation page.
- **Thinking `sm:` means "small screens only".** It means "640px and wider". Unprefixed classes are your mobile styles.
- **Forgetting CSS fundamentals.** If you don't understand flexbox, `flex` won't help. Tailwind is a shortcut, not a replacement.

## In short

- Tailwind v4 with Vite: install `tailwindcss` and `@tailwindcss/vite`, add the plugin, `@import "tailwindcss";`.
- Style with utility classes; prefixes add states (`hover:`), breakpoints (`md:`) and dark mode (`dark:`).
- Design mobile first: unprefixed classes for phones, prefixes for bigger screens.
- Customise with `@theme`; reuse styles through components; always write complete class names.

### Exercises
- Add Tailwind to your `online-shop` (setup above) and use it to style a `ProductCard` component on the Products page: the product image (DummyJSON's `thumbnail`), title, price and an "Add to cart" button (not connected yet).
- On the Products page of `online-shop`, show the cards in a responsive grid: 1 column on phones, 2 on tablets, 4 on desktops. Check it with the device toolbar in Chrome DevTools (Ctrl+Shift+M) at 375px, 768px and 1280px wide.
- In the `Layout` of `online-shop`, build a responsive navbar: links in a row on desktop, and on mobile a hamburger button that opens and closes the menu (state + `md:hidden` / `hidden md:flex`). Check it at 375px and at desktop width.
- In `online-shop`, add a brand colour with `@theme` in `src/index.css`, a `Button` component in `src/components/Button.tsx` with `primary`/`secondary` variants, and a dark mode toggle in the header using `@custom-variant dark`. Add a few `dark:` classes (for example `dark:bg-gray-900 dark:text-white` on the layout) so you can see the switch.
  Hint: Keep `isDark` in state in the header and, in an effect, run `document.documentElement.classList.toggle("dark", isDark)`.

---project
id: ar-p1
title: Online shop (front end)
summary: A multi-page store with React Router, TanStack Query, a reducer-based cart, lazy routes, error boundaries and Tailwind.
---
### The task
Build the front end of an online shop using the free DummyJSON products API (`https://dummyjson.com/products`). Shoppers can browse and filter products, open a product page, manage a cart and go through a checkout. There are no real payments: the checkout ends with an order confirmation. It combines everything in this module so far, written in React with TypeScript.

### What it must do
- Pages: Home (a few featured products), Products (`/products`), Product detail (`/products/:id`), Cart (`/cart`), Checkout (`/checkout`), Order confirmation, and a 404 page
- A shared layout with a header showing navigation (active link highlighted) and the number of items in the cart
- All product data loaded with TanStack Query, with query keys that include every parameter, loading skeletons, and an error message with a "Retry" button
- Category filter, search, sorting (price, rating) and pagination on the Products page, all stored in URL search params so links can be shared
- A cart managed with `useReducer` + context and a `useCart()` hook: add, remove, change quantity, clear; shows line totals and the order total; saved in `localStorage`
- A checkout form (name, email, address) with validation messages; on submit, the cart is emptied and the user is sent to a confirmation page with an order summary
- Product detail, Cart and Checkout pages are lazy-loaded with a `Suspense` fallback inside the layout; an error boundary around the page area resets when the user navigates
- Styled with Tailwind, responsive from 375px phones to desktops
- Tests for the cart reducer and the total calculation

### Steps
1. **Scaffold.** Continue in your `online-shop` folder from lessons 8.6–8.9: much of this project already exists there, so treat the steps below as a checklist and add only what's missing. Make sure `react-router`, `@tanstack/react-query` and Tailwind (`tailwindcss`, `@tailwindcss/vite`) are installed, and that `BrowserRouter` and `QueryClientProvider` are in `main.tsx`. Build the layout and all routes, with placeholder text for pages you don't have yet, including the 404 page. Click through every link.
2. **Product list.** Create `src/api.ts` with typed functions (`getProducts`, `getProduct`, `getCategories`) that throw on bad responses. Show products in a responsive grid of `ProductCard`s using `useQuery`, with a skeleton while loading and an error message with a retry button (`refetch`).
3. **Product page.** Build `/products/:id` with `queryKey: ["product", id]`: images, description, price, rating and an "Add to cart" button (not connected yet). An unknown id shows a friendly "product not found" message.
4. **Filters in the URL.** Add a category select (from the categories endpoint), a sort select, a search input (debounced with your `useDebounce` hook) and previous/next pagination, all read from and written to `useSearchParams`. Put them in the query key and use `placeholderData: keepPreviousData`.
5. **Cart logic.** Write `cartReducer` with typed actions and a `getCartTotal` function, and test them with Vitest. Then build `CartProvider`, `useCart()`, and save the cart to `localStorage` in an effect.
6. **Cart UI.** Connect the "Add to cart" buttons, show the count in the header, and build the Cart page with quantity controls, remove buttons, line totals and an empty-cart message linking back to the products.
7. **Checkout.** Build the checkout form with validation (required fields, a valid email). On submit, save the order summary, clear the cart and `navigate` to the confirmation page.
8. **Lazy loading, errors and polish.** Lazy-load the detail, cart and checkout pages; put `Suspense` and an `ErrorBoundary` (with `resetKeys` on the pathname) around the `<Outlet />`. Test at 375px width and with the keyboard, then deploy with an SPA fallback so refreshing `/products/5` works.

### Hints
- DummyJSON supports `limit` and `skip` for pagination, `/products/search?q=…` for search, `/products/category/<slug>` for one category, and `sortBy`/`order` for sorting. Open the URLs in your browser first to see the exact response shape. When the API can't combine two options (for example search *and* category), decide what your UI does and explain it in the README.
- In the cart, store either just product ids and quantities (and look up details) or a snapshot of title, price and image. A snapshot is simpler; write down why you chose it.
- Keep prices in the cart as numbers and only format them for display with `Intl.NumberFormat`.
- If the cart count in the header doesn't update, check that the header and the cart page are both inside the same `CartProvider`.
- Pass the order summary to the confirmation page with `navigate("/order/confirmed", { state: order })` or store the last order in context; handle the case where someone opens that URL directly.

### Stretch goals
- A wishlist (a second reducer + context), saved in `localStorage`
- A fake login with a protected "Order history" page (`RequireAuth` layout route)
- Dark mode with `@custom-variant dark` and a toggle in the header
- Use `useMutation` with DummyJSON's simulated `POST /carts/add` endpoint to "send" the order
- Component tests for the product list with a mocked `fetch`

### Done when
- All pages work, including the 404 page and direct links like `/products/5` after a refresh on the deployed site
- Filters, search, sort and page live in the URL, and sharing the URL reproduces the same view
- Product data comes from TanStack Query with loading, error and retry states
- The cart (add, remove, quantity, total) survives a reload, and the header count is always correct
- The checkout validates input, empties the cart and shows an order confirmation
- Detail, cart and checkout are lazy-loaded (visible in the Network tab), and the cart reducer tests pass
- The site is responsive at 375px and on desktop, deployed, and on GitHub with a README

---section
id: areact-s3
title: Performance
intro: Learn why React re-renders, how to measure it with the React DevTools Profiler, and which tools actually make a slow app fast. You'll finish by taking a deliberately slow 10,000-row product table and documenting how you sped it up.
---

---lesson
id: ar-8
title: Performance: re-renders, memo, deferred values and virtualisation
time: 2h
video: Cosden Solutions — The Best Ways to Optimize Performance in Modern React | https://www.youtube.com/watch?v=LuQ8VWh6eYE
docs: memo | https://react.dev/reference/react/memo
docs: useMemo | https://react.dev/reference/react/useMemo
docs: useCallback | https://react.dev/reference/react/useCallback
docs: useDeferredValue | https://react.dev/reference/react/useDeferredValue
docs: React Developer Tools | https://react.dev/learn/react-developer-tools
docs: React Compiler | https://react.dev/learn/react-compiler
docs: TanStack Virtual | https://tanstack.com/virtual/latest
---
Most React apps are fast enough without any special work. But sooner or later you'll build a screen with thousands of rows, a heavy chart or a big form, and typing starts to lag. Then you need to know *why* React does work, how to *measure* it, and which fix to use. The most important rule of this lesson: **measure first**. Optimising code that wasn't slow makes it harder to read and gains nothing.

## When does a component re-render?

A component re-renders when:

1. **Its own state changes** (`setState`, `dispatch`).
2. **Its parent re-renders.** By default, *all* children re-render too, even if their props didn't change.
3. **A context it reads changes.**

A re-render means React calls your function again and compares the result with the previous one. If nothing changed, the DOM isn't touched. Usually this is very fast. It becomes a problem when a re-render does expensive work (sorting 10,000 items) or when thousands of components re-render on every keystroke.

## Measure with the React DevTools Profiler

Install the React Developer Tools browser extension. It adds a **Profiler** tab:

1. Click record, do the slow interaction (type in the search box), stop.
2. Each bar at the top is a **commit** (one update to the screen). Click one to see how long it took.
3. The flame graph shows which components rendered and how long each took. Grey ones didn't render.

In the Profiler settings, turn on **"Record why each component rendered"**, and in the general settings **"Highlight updates when components render"**. The highlight makes unnecessary re-renders visible straight away. Chrome DevTools' Performance tab with CPU throttling (4× slowdown) is useful too: it shows what a slower laptop or phone would feel.

Development builds are slower than production, so don't trust the absolute numbers too much. Compare *before and after* in the same setup.

## Fix 1: move state down

Often a slow component re-renders because some unrelated state lives too high up:

```tsx
// Before: every tick re-renders the whole table
function App() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <>
      <header>{time.toLocaleTimeString()}</header>
      <ProductTable />
    </>
  );
}
```

Move the clock's state into its own `Clock` component. Now only `Clock` re-renders every second and `ProductTable` is left alone. This costs nothing and is often the biggest win. The related trick is **passing content as `children`**: a component that re-renders doesn't re-render the `children` elements its parent created.

## Fix 2: memo, useMemo and useCallback

**`memo`** wraps a component so it skips re-rendering when its props are the same as last time:

```tsx
import { memo } from "react";

const ProductRow = memo(function ProductRow({ product, onSelect }: RowProps) {
  return (
    <tr onClick={() => onSelect(product.id)}>
      <td>{product.name}</td>
      <td>{product.price}</td>
    </tr>
  );
});
```

"The same" means equal with `Object.is`: numbers and strings compare by value, but objects, arrays and functions compare by **reference**. A new arrow function created on every render is a different function each time, so `memo` never skips. That's what the other two hooks are for:

```tsx
function ProductTable({ products, query }: { products: Product[]; query: string }) {
  const visible = useMemo(
    () => products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
                  .sort((a, b) => a.price - b.price),
    [products, query],
  );

  const handleSelect = useCallback((id: number) => {
    console.log("selected", id);
  }, []);

  return (
    <table>
      <tbody>
        {visible.map((p) => <ProductRow key={p.id} product={p} onSelect={handleSelect} />)}
      </tbody>
    </table>
  );
}
```

- **`useMemo(fn, deps)`** caches the *result* of a calculation and only recalculates when a dependency changes. Use it for expensive work (filtering and sorting thousands of items), not for `a + b`.
- **`useCallback(fn, deps)`** caches a *function*, so a `memo` child receives the same function each time.
- `filter` already returns a new array, so sorting that is safe. Calling `products.sort(...)` directly would mutate the prop.

`useCallback` alone does nothing useful; it only helps when the function goes to a `memo` component or into a dependency array.

## The React Compiler

The **React Compiler** is a build tool that adds this memoisation for you automatically, at a finer level than you would by hand. In projects that use it, you rarely need to write `memo`, `useMemo` or `useCallback` yourself. You still need to understand them: you'll read them in existing code, and when something is still slow you must know what the compiler is (or isn't) doing. Check the official React Compiler docs for setting it up with Vite. In this section's project, keep it **off** at first, so you can see the effect of your own fixes.

## Fix 3: keep typing responsive

Some work is unavoidable: filtering 10,000 rows takes time. But the *input* should never lag. `useDeferredValue` lets React update the input first and render the slow list a moment later, with an older value, without blocking the user:

```tsx
import { useDeferredValue, useState } from "react";

function SearchPage({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <div style={{ opacity: isStale ? 0.6 : 1 }}>
        <ProductTable products={products} query={deferredQuery} />
      </div>
    </>
  );
}
```

React first re-renders with the new `query` but the old `deferredQuery`, which is fast. Then it renders the table with the new value **in the background**, and if the user types again, it throws that work away and starts over. Important: this only helps if `ProductTable` is wrapped in `memo` (or compiled by the React Compiler); otherwise it re-renders in the fast pass too. The `ProductTable` from Fix 2 isn't yet, so wrap it the same way as `ProductRow`: `const ProductTable = memo(function ProductTable(...) { ... })`.

`useTransition` is the related tool for updates *you* trigger, like clicking a sort button: `startTransition(() => setSort("price"))` marks the update as non-urgent, and `isPending` tells you to show a small spinner. You can't use it for the input's own value, which must update immediately.

## Fix 4: virtualise long lists

Rendering 10,000 table rows creates 10,000+ DOM elements, which is slow no matter how you memoise. **Virtualisation** renders only the rows currently visible (plus a few extra) and fakes the full scroll height. TanStack Virtual does the maths:

```tsx
import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

function VirtualList({ items }: { items: Product[] }) {
  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40, // row height in px
    overscan: 10,
  });

  return (
    <div ref={parentRef} style={{ height: 600, overflow: "auto" }}>
      <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
        {virtualizer.getVirtualItems().map((row) => (
          <div
            key={row.key}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: row.size, transform: `translateY(${row.start}px)` }}
          >
            {items[row.index].name}
          </div>
        ))}
      </div>
    </div>
  );
}
```

The outer `div` scrolls; the inner one is as tall as all rows together; only about 25 rows actually exist in the DOM, each moved into place with `translateY`.

## Common mistakes

- **Optimising without measuring.** Wrapping everything in `memo` and `useMemo` adds complexity and often changes nothing. Profile, fix the biggest cost, profile again.
- **`memo` with new props every render.** An inline object (`style={{…}}`) or arrow function breaks `memo`. Stabilise them or move them out.
- **Using the array index as `key` in a sortable list.** React then mixes up rows after sorting. Use the item's id.
- **Missing dependencies in `useMemo`.** The cached result goes stale and shows old data. Let the React Hooks lint rule check your dependency arrays.

## In short

- Components re-render when their state, their parent or a context they read changes.
- Measure with the React DevTools Profiler before and after every change.
- Cheapest fixes first: move state down, pass content as `children`.
- `memo` + `useMemo` + `useCallback` skip work; the React Compiler can do this automatically.
- `useDeferredValue`/`useTransition` keep the UI responsive; virtualisation makes huge lists cheap.

### Exercises
- Open your `dashboard` from Part 1 (its clock ticks every second), turn on "Highlight updates when components render" in React DevTools, and watch what flashes each second. If more than the clock flashes, fix it by moving the time state down into a `Clock` component. If only the clock flashes, you already did it right: move the time state up into `App` for a moment to see the difference, then move it back.
- In `react-playground`, create `src/SearchList.tsx` with 5,000 generated items, created at module level (outside the component), for example `Array.from({ length: 5000 }, (_, i) => ({ id: i, name: "Item " + i }))`. Add a search input that filters them by name, and render each one with an `ItemRow` component. Record typing in the Profiler and note the commit duration. Then add `useMemo` for the filtering and `memo` for `ItemRow`, profile again, and write down both numbers.
- In the same `SearchList`, add `useDeferredValue` with a "stale" opacity effect. Move the list into a `memo` component (`ItemList`) that receives the deferred query, because `useDeferredValue` only helps when the slow child is memoised. Throttle the CPU 4× (Chrome DevTools → Performance → CPU) and compare how typing feels with and without it.
- Search your `dashboard`, `online-shop` and `react-playground` code for `useMemo` and `useCallback` (Ctrl+Shift+F in VS Code). Find one that doesn't help (a cheap calculation, or a function that isn't passed to a `memo` component or a dependency array), remove it, and check in the Profiler that nothing got slower. If you find none, write down one place in your code where adding one would gain nothing, and why.

---project
id: ar-p3
title: Speed up a slow app
summary: Build a deliberately slow 10,000-row product table, measure it with the Profiler, fix it step by step and document before/after timings.
---
### The task
Performance work is a skill you prove with numbers, not opinions. Build a product table with 10,000 rows, search, sorting and filters that is **deliberately slow**, measure exactly where the time goes with the React DevTools Profiler, and fix it one technique at a time. The result is a React + TypeScript app plus a README that reads like a short performance report: what was slow, what you changed, and how much faster it became.

### What it must do
- Generate 10,000 products with a **seeded** generator, so every run has the same data: `id`, `name`, `category`, `price`, `stock`, `rating`, `updatedAt`
- A table showing all columns; clicking a column header sorts by it (click again to reverse)
- A search input filtering by name, a category filter, a price range (min/max) and an "in stock only" checkbox
- A header with a clock that ticks every second and a count of visible rows
- **The slow version** (kept in git with a tag): all state in `App`, filtering and sorting done on every render without memoisation, all 10,000 rows rendered, each row doing some deliberately expensive work (for example a `computeScore(product)` loop or creating a new `Intl.NumberFormat` per row), and new inline functions passed to every row
- **The fast version** applies, one by one and each measured: moving state down, `memo`/`useMemo`/`useCallback` where the Profiler shows they help, `useDeferredValue` for the search (and/or `useTransition` for sort and filter clicks), and list virtualisation with TanStack Virtual
- Filtering and sorting live in pure functions with Vitest tests, so the optimisations can't silently change the results
- A README with a before/after table of timings for each interaction and Profiler screenshots

### Steps
1. **Data and logic.** Create a new Vite `react-ts` project: `npm create vite@latest slow-table -- --template react-ts`. Write `generateProducts(count, seed)` in `data.ts` using a small seeded random function (search for "mulberry32") or `@faker-js/faker` with `faker.seed(42)`. Write pure `filterProducts(products, filters)` and `sortProducts(products, sort)` functions and test them with Vitest.
2. **Build the slow version.** Put all state (clock, search, filters, sort) in `App`. Render every row with a `ProductRow` component that does the deliberately expensive work and receives inline arrow functions. Check it works, commit, and run `git tag slow`.
3. **Measure the baseline.** Install React DevTools, turn on "Record why each component rendered". Record three interactions: typing a five-letter word in the search, clicking a sort header, and one clock tick. Note the commit durations (repeat each three times and take the middle value) and take screenshots. Optionally add 4× CPU throttling in Chrome's Performance tab, and note it in the README.
4. **Fix 1: move state down.** Move the clock into its own component. Re-measure the clock tick and write the numbers down.
5. **Fix 2: memoise where it helps.** Wrap the filtered and sorted list in `useMemo`, make `ProductRow` a `memo` component, and stabilise the handlers with `useCallback`. Re-measure all three interactions. Note which change made a difference and which didn't.
6. **Fix 3: responsive input.** Use `useDeferredValue` for the search query, with a faded "stale" state on the table, and `useTransition` with a small spinner for sort and filter changes. Re-measure typing; also describe how it *feels*.
7. **Fix 4: virtualise.** Replace the full table body with a TanStack Virtual list. Check that only a few dozen rows exist in the DOM (Elements panel) and that scrolling stays smooth. Re-measure everything.
8. **Write the report.** In the README: a table with one row per interaction and one column per stage (baseline, after each fix), your screenshots, a short explanation of why each fix worked, and anything that surprised you. Deploy the fast version and link to it.

### Hints
- `<table>` elements are awkward to virtualise. The simplest approach is rows made of `div`s laid out with CSS grid (`grid-template-columns`) and `role="table"`, `role="row"` and `role="cell"` for accessibility, with the header row outside the scrolling area.
- `useDeferredValue` only helps if the slow child is a `memo` component. If typing is still slow after step 6, check that first.
- Generate the 10,000 products once: at module level (`const products = generateProducts(10_000, 42);` outside any component) or in a lazy initialiser (`useState(() => generateProducts(10_000, 42))`). If you call it in the component body, every render creates a new array, so `useMemo` and `memo` always see "new" products and never skip.
- Sort a copy (`[...list].sort(...)`), never the original array, and use `product.id` as the key, never the index.
- Make the "expensive work" big enough to feel but not so big the page freezes: aim for typing that clearly lags in the baseline.
- Profile the same way every time (same browser, same window size, same text typed), otherwise the numbers can't be compared.

### Stretch goals
- Turn on the React Compiler on a separate branch, remove your manual `memo`/`useMemo`/`useCallback`, and compare its numbers with yours
- Keep the search, filters and sort in URL search params with React Router
- Move filtering and sorting into a Web Worker and measure whether it helps
- Rebuild the table with TanStack Table plus TanStack Virtual and compare

### Done when
- The slow version is tagged in git and the fast version is on the main branch
- Search, sort and all filters work in both versions, and the filter/sort tests pass
- Typing in the search box no longer lags in the fast version, even with CPU throttling
- Only the visible rows (plus overscan) are in the DOM in the fast version
- The README has a before/after timing table for at least three interactions, with Profiler screenshots
- The README explains each fix in a few sentences, including at least one that didn't help much
- The fast version is deployed and the live link is in the README

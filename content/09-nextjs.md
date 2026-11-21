---module
id: next
title: Next.js
scrimba: Next.js
weeks: 3–4 weeks
fullCourse: Next.js full course App Router
intro: Next.js is a React framework that puts routing, server rendering, database access and API endpoints in one project. This is where your frontend and backend skills merge, and you start building complete full-stack apps in a single codebase.
---

---section
id: next-s1
title: Build a Next.js app
intro: Create a Next.js project, learn how folders become pages and layouts, understand which code runs on the server and which in the browser, and build dynamic pages with good metadata. You'll finish by building your own portfolio site.
---

---lesson
id: next-1
title: What is Next.js? App Router basics
time: 1.5h
video: Fireship Next.js in 100 seconds
docs: Learn Next.js (official free course) | https://nextjs.org/learn
docs: Next.js: installation | https://nextjs.org/docs/app/getting-started/installation
docs: Next.js: project structure | https://nextjs.org/docs/app/getting-started/project-structure
---
In the React module you built single-page apps with Vite: the browser downloads an almost empty HTML file plus a JavaScript bundle, and React builds the page in the browser. For data you needed a separate Express server, with `fetch`, CORS and two projects to deploy. **Next.js** is a React framework that joins those two worlds: your React components can run on the server, routing comes from your folders, and backend code lives in the same project. Most new React jobs and tutorials assume Next.js (or a similar framework), so this module is where everything you've learned comes together.

## What Next.js adds to React

React is a *library*: it renders components and leaves every other decision to you. Next.js is a *framework*: it decides how the project is organised, and in return it gives you:

- **File-based routing**: folders in `app/` become URLs. No router library to configure.
- **Server rendering**: pages arrive as finished HTML, which is faster for users and much better for search engines.
- **Server code inside components**: read a database or use a secret API key directly in a component, without building a separate API.
- **Mutations and endpoints**: Server Actions for forms and route handlers for JSON APIs.
- **Built-in optimisations** for images, fonts and code splitting.

## Creating a project

You need Node.js 20.9 or newer. Then run:

```bash
npx create-next-app@latest my-site
cd my-site
npm run dev
```

The setup asks a few questions, and they change a little between versions. Choose the recommended defaults: **TypeScript**, **ESLint**, **Tailwind CSS**, the **App Router** and the `@/*` import alias. This module assumes you did *not* choose a `src/` folder; if you did, everything below simply lives inside `src/`.

Open http://localhost:3000 and you'll see the starter page. Edit `app/page.tsx`, save, and the browser updates immediately.

## The project structure

```
my-site/
├─ app/
│  ├─ layout.tsx     ← wraps every page (contains <html> and <body>)
│  ├─ page.tsx       ← the page at "/"
│  └─ globals.css    ← global styles (Tailwind is imported here)
├─ public/           ← static files, served as-is: public/cv.pdf → /cv.pdf
├─ next.config.ts    ← Next.js settings
├─ package.json
└─ tsconfig.json
```

The `@/*` alias means `import { x } from "@/lib/posts"` always starts at the project root, so you never write `../../../lib/posts`.

## Folders are routes

Inside `app/`, every folder is a URL segment, and a `page.tsx` file inside it makes that URL public:

| File | URL |
|---|---|
| `app/page.tsx` | `/` |
| `app/about/page.tsx` | `/about` |
| `app/blog/first-post/page.tsx` | `/blog/first-post` |

A page is just a React component exported as the **default export**:

```tsx
// app/about/page.tsx
export default function AboutPage() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-bold">About me</h1>
      <p className="mt-4">I'm learning full-stack development.</p>
    </main>
  );
}
```

The function name doesn't matter to Next.js; the file name and the default export do. Visit http://localhost:3000/about and it's there. No router setup, no `<Route>` elements.

## Special file names

Next.js gives meaning to a small set of file names inside `app/`. You'll meet each one in this module:

- `page.tsx`: the UI for a URL
- `layout.tsx`: a wrapper shared by a folder's pages
- `loading.tsx` and `error.tsx`: loading and error states
- `not-found.tsx`: the 404 page
- `route.ts`: an API endpoint instead of a page

Other files are ignored by the router, so you can keep components next to the page that uses them. A folder whose name starts with an underscore, like `app/_components/`, is never turned into a route. Many projects also use a top-level `components/` and `lib/` folder; both work.

## Where does this code run?

Open the About page, right-click and choose **View Page Source**. In a Vite app you'd see an empty `<div id="root">`; here you see your `<h1>` and paragraph already in the HTML. The page was rendered on the **server**. Try adding `console.log("rendering About")` inside `AboutPage`: the message appears in your **terminal**, not in the browser console. Why this happens, and when code runs in the browser instead, is the topic of lesson 3.

## Development vs production

- `npm run dev` starts the development server: instant updates on save, detailed error overlays, and every page rendered fresh on each request.
- `npm run build` creates an optimised production version, then `npm start` runs it.

Run `npm run build` regularly. It type-checks the whole project and prints a table of your routes, showing how each one is rendered: ahead of time (**static**), on every request (**dynamic**), or a mix of both. Problems that dev mode lets slide often show up here first.

## Common mistakes

- **Naming the file wrong.** `app/about/About.tsx` or `app/about.tsx` gives a 404. It must be a folder containing `page.tsx`.
- **Forgetting `export default`.** Next.js then reports that the page has no valid default export.
- **Following Pages Router tutorials.** Older tutorials use a `pages/` folder with `getServerSideProps` and `getStaticProps`. That's the previous router. Check that a tutorial uses the `app/` folder before following it.
- **Adding `<html>` or `<body>` in a page.** Only the root layout contains those.

## In short

- Next.js is a React framework: routing, server rendering and backend code in one project.
- Create a project with `npx create-next-app@latest`; run it with `npm run dev`.
- `app/about/page.tsx` becomes `/about`; the page is the default export.
- Special files (`layout`, `loading`, `error`, `not-found`, `route`) add behaviour to a folder.
- Pages render on the server by default: check with View Page Source.

### Exercises
- Create a project with `create-next-app`, run it, and replace the starter home page with a short welcome text of your own.
- Add About and Contact pages. Open each in the browser and check with View Page Source that the text is in the HTML.
- Add a `console.log` to a page component and find out where the message appears. Then run `npm run build` followed by `npm start` and read the route table the build prints.
- Start the official Learn Next.js course and do chapters 1–4 alongside this module.

---lesson
id: next-2
title: Layouts, navigation and styling
time: 1.5h
video: Next.js layouts and navigation tutorial
docs: Next.js: layouts and pages | https://nextjs.org/docs/app/getting-started/layouts-and-pages
docs: Next.js: linking and navigating | https://nextjs.org/docs/app/getting-started/linking-and-navigating
docs: Next.js: CSS | https://nextjs.org/docs/app/getting-started/css
docs: Next.js: images | https://nextjs.org/docs/app/getting-started/images
docs: Next.js: fonts | https://nextjs.org/docs/app/getting-started/fonts
---
Almost every site has parts that appear on every page: a header, a navigation bar, a footer. You don't want to copy them into each page, and you don't want them to flash or reset when the user moves between pages. Next.js solves this with **layouts** and the `<Link>` component. This lesson also covers the two things that slow down most real websites, images and fonts, which Next.js optimises for you.

## The root layout

Every app has one required `app/layout.tsx`. It contains `<html>` and `<body>` and wraps every page:

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anna Codes",
  description: "Portfolio of a full-stack developer",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900">
        <header className="border-b p-4 font-semibold">Anna Codes</header>
        <main className="mx-auto max-w-3xl p-6">{children}</main>
        <footer className="p-4 text-sm text-gray-500">© 2026 Anna</footer>
      </body>
    </html>
  );
}
```

- `children` is the current page. When you visit `/about`, `children` is the About page.
- `globals.css` is imported once, here. It already contains `@import "tailwindcss";` if you chose Tailwind.
- The `metadata` export sets the page `<title>` and description. You'll do much more with it in lesson 4 of this section.

## Nested layouts

Any folder can have its own `layout.tsx`. It wraps only the pages in that folder, *inside* the parent layout:

```tsx
// app/dashboard/layout.tsx
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-6">
      <nav className="flex w-40 flex-col gap-2">
        <Link href="/dashboard">Overview</Link>
        <Link href="/dashboard/settings">Settings</Link>
      </nav>
      <section className="flex-1">{children}</section>
    </div>
  );
}
```

Now `/dashboard` and `/dashboard/settings` show the root header, then the sidebar, then the page. The important detail: **layouts persist**. When you navigate from Overview to Settings, only the page part changes; the layout is not re-created, so any state inside it (an open menu, text in a search box) survives.

## Navigating with Link

Use `<Link>` from `next/link` for links inside your app:

```tsx
import Link from "next/link";

<Link href="/about" className="underline">About me</Link>
```

It renders a normal `<a>` tag, but clicking it doesn't reload the whole page. Next.js fetches only what changed and swaps it in. In production it also **prefetches** links that are visible on screen, so navigation feels instant. For links to other websites, a plain `<a href="https://github.com/...">` is fine.

To navigate from code (for example after a button click), use the `useRouter` hook from `next/navigation` inside a client component: `router.push("/dashboard")`.

## Highlighting the active link

To style the link of the current page, you need the current URL. The `usePathname` hook gives it to you, but hooks only work in **client components**, so the file starts with `"use client"` (fully explained in the next lesson):

```tsx
// app/_components/nav-link.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive =
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
  return (
    <Link href={href} className={isActive ? "font-bold underline" : "text-gray-600"}>
      {children}
    </Link>
  );
}
```

The check also marks "Projects" as active on a page inside it, like `/projects/my-app`, but not on `/projects-old`; the home link `/` is only active on the home page itself.

Use `<NavLink href="/about">About</NavLink>` in your layout. The layout itself stays a normal (server) component; only this small piece runs in the browser.

## Route groups

A folder name in parentheses, like `(marketing)`, groups routes **without** adding to the URL. `app/(marketing)/pricing/page.tsx` is still `/pricing`. This lets different parts of a site use different layouts: `app/(marketing)/layout.tsx` for the public pages with a big header, `app/(app)/layout.tsx` for the logged-in area with a sidebar.

## Images with next/image

```tsx
import Image from "next/image";
import portrait from "./portrait.jpg";

<Image src={portrait} alt="Anna smiling at her desk" className="rounded-full" />
```

The `Image` component resizes the image for each screen size, serves modern formats like WebP or AVIF, lazy-loads images below the fold, and reserves space so the layout doesn't jump. With a **static import** (as above), Next.js knows the width and height automatically. For a string path such as `src="/projects/shop.png"` (a file in `public/`) you must add `width` and `height`. Images from other domains also need to be allowed in `next.config.ts`:

```ts
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "avatars.githubusercontent.com" }],
  },
};

export default nextConfig;
```

## Fonts with next/font

```tsx
// app/layout.tsx
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

// ...
<body className={inter.className}>
```

The font is downloaded at **build time** and served from your own site. The user's browser never contacts Google (good for privacy), and the text doesn't jump when the font arrives.

## Common mistakes

- **Using `<a href="/about">` for internal links.** It works, but it reloads the whole page and loses all state. Use `<Link>`.
- **Importing `useRouter` from `next/router`.** That's the old Pages Router. In the App Router, import from `next/navigation`.
- **Remote image errors.** "hostname is not configured under images" means you forgot `remotePatterns`.
- **Using hooks in a layout or page without `"use client"`.** Move the interactive part into its own small client component, like `NavLink`.

## In short

- `app/layout.tsx` wraps every page and holds `<html>` and `<body>`; nested layouts wrap only their folder.
- Layouts persist between navigations, so their state survives.
- `<Link>` gives fast client-side navigation with prefetching; `usePathname` finds the active page.
- Route groups `(name)` organise routes and layouts without changing URLs.
- `next/image` and `next/font` optimise images and fonts with almost no effort.

### Exercises
- Add a shared header with navigation and a footer to the root layout, and create three pages that use it.
- Build the `NavLink` component so the current page's link is highlighted.
- Create a `/dashboard` section with its own sidebar layout and two sub-pages. Put an `<input>` in the sidebar, type something, then navigate between the sub-pages: does the text stay? Explain why.
- Add a profile photo with `next/image` and a Google font with `next/font`. Run Lighthouse in Chrome DevTools on the production build (`npm run build && npm start`) and note your performance score.

---lesson
id: next-3
title: Server Components vs Client Components
time: 2h
video: React Server Components explained Next.js
docs: Next.js: server and client components | https://nextjs.org/docs/app/getting-started/server-and-client-components
docs: React: 'use client' directive | https://react.dev/reference/rsc/use-client
---
This is the most important idea in modern Next.js. Every component you write runs either on the server or in the browser, and that choice decides what it can do: read a database, use a secret key, respond to clicks, use `useState`. Get this right and your apps are fast and secure; get it wrong and you'll see confusing errors. The good news: the rules are simple once you see them.

## Two kinds of components

**Server Components** are the default in the `app/` folder. They run only on the server (during the build or when a request arrives). Their output is sent to the browser as HTML plus a compact description of the component tree, but their JavaScript code is **never sent to the browser**. That means:

- They can be `async` and `await` data directly.
- They can read databases, files and secret environment variables.
- They can't use `useState`, `useEffect`, event handlers like `onClick`, or browser APIs like `localStorage`.

**Client Components** start with the `"use client"` directive. They are the React components you already know. They are rendered to HTML on the server first (so the page appears quickly), then their JavaScript is sent to the browser and they become interactive. This step is called **hydration**.

## An async Server Component

```tsx
// app/users/page.tsx
type User = { id: number; name: string; email: string };

export default async function UsersPage() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  const users: User[] = await res.json();

  return (
    <ul className="space-y-2">
      {users.map((user) => (
        <li key={user.id}>
          {user.name} ({user.email})
        </li>
      ))}
    </ul>
  );
}
```

Compare this with what you did in the React module: no `useEffect`, no `useState` for the data, no loading flag, no CORS problems. The component simply awaits the data, and the users are already in the HTML the browser receives.

> **Tip:** New projects created with the recommended settings use a mode called *Cache Components*. In that mode, a page that waits for data needs a loading state. If you see an error about "uncached data" being accessed outside of `<Suspense>`, add a file `app/users/loading.tsx` containing `export default function Loading() { return <p>Loading…</p>; }`. The next section explains exactly why.

## When you need "use client"

| You need… | Use |
|---|---|
| Fetch data, read a database, use secrets | Server Component |
| `onClick`, `onChange`, form inputs with state | Client Component |
| `useState`, `useReducer`, `useEffect` | Client Component |
| Browser APIs: `window`, `localStorage` | Client Component |
| Hooks like `usePathname` or `useRouter` | Client Component |
| Large libraries only needed for rendering (e.g. Markdown) | Server Component |

A small interactive piece looks like this:

```tsx
// app/_components/like-button.tsx
"use client";
import { useState } from "react";

export function LikeButton() {
  const [likes, setLikes] = useState(0);
  return (
    <button onClick={() => setLikes(likes + 1)} className="rounded border px-3 py-1">
      ♥ {likes}
    </button>
  );
}
```

And the server page simply uses it: `<LikeButton />` inside the list. The page stays a Server Component that fetches data; only the button's code goes to the browser.

## The boundary

`"use client"` marks a **boundary**: that file, and every component it imports, becomes client code. So if you put `"use client"` at the top of a page just because one button needs a click handler, the whole page and everything it imports become client code: no more `async`, no more database access, and more JavaScript for the user to download. The rule: **keep Client Components small and push them to the leaves** of your component tree.

## Passing data from server to client

A Server Component passes data to a Client Component through props, as usual. Because the props travel over the network, they must be **serialisable**: strings, numbers, booleans, `null`, arrays, plain objects and `Date` work. Ordinary functions and class instances don't.

```tsx
// Server Component
<LikeButton initialLikes={post.likes} />          // ✅ a number
<LikeButton onLike={() => console.log("hi")} />   // ❌ a function: error
```

(There is one kind of function you *can* pass: Server Actions, which you'll learn in the next section.)

## Server Components inside Client Components

A Client Component can't import a Server Component, but it can receive one as `children`:

```tsx
// app/_components/collapsible.tsx
"use client";
import { useState } from "react";

export function Collapsible({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(!open)}>{title}</button>
      {open && children}
    </div>
  );
}
```

```tsx
// in a server page (Suspense is imported from "react")
<Collapsible title="Show statistics">
  <Suspense fallback={<p>Loading…</p>}>
    <ServerStats />
  </Suspense>
</Collapsible>
```

`ServerStats` is an async Server Component that fetches its own data. It still runs on the server; the Client Component only decides whether to show its finished output. The `<Suspense>` boundary (which you know from the React module) shows a fallback while `ServerStats` waits for its data.

## Keeping secrets on the server

Environment variables are available in Server Components through `process.env`. In Client Components, only variables whose names start with `NEXT_PUBLIC_` exist, and their values are written into the JavaScript bundle at build time, so **anyone can read them**. Never put a secret in a `NEXT_PUBLIC_` variable.

For extra safety, install the `server-only` package and add `import "server-only";` at the top of modules that use secrets or the database. If a Client Component ever imports that module, the build fails with a clear error instead of leaking your code.

## Common mistakes

- **"You're importing a component that needs useState…"**: you used a hook in a Server Component. Add `"use client"` to that component's file, or better, move the interactive part into its own small client component.
- **"Functions cannot be passed directly to Client Components"**: you passed an event handler from a Server Component. Define the handler inside the Client Component instead.
- **`window is not defined`**: Client Components also render on the server first, where `window` doesn't exist. Access browser APIs inside `useEffect` or event handlers.
- **Hydration mismatch errors**: the server HTML and the first browser render must be identical. Rendering `Math.random()`, `new Date().toLocaleTimeString()` or a `localStorage` value directly in a Client Component breaks this. Read such values in `useEffect`.

## In short

- Components in `app/` are Server Components by default: async, data access, secrets, zero browser JavaScript.
- Add `"use client"` for state, effects, event handlers and browser APIs.
- `"use client"` makes the file and its imports client code, so keep client components small and at the leaves.
- Props from server to client must be serialisable; Server Components can be passed in as `children`.
- Only `NEXT_PUBLIC_` env variables reach the browser; use `server-only` to protect server modules.

### Exercises
- Build an async Server Component page that fetches users from JSONPlaceholder and renders them.
- Add the `LikeButton` client component next to each user. Put a `console.log` in both the page and the button: where does each message appear?
- Add `useState` to the page component itself, read the error message, and fix it by moving the stateful part into its own component.
- Build the `Collapsible` component and pass it a Server Component child that fetches and shows the number of posts from `https://jsonplaceholder.typicode.com/posts`.

---lesson
id: next-5
title: Dynamic routes and metadata
time: 1.5h
video: Next.js dynamic routes generateMetadata
docs: Next.js: dynamic routes | https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes
docs: Next.js: metadata and OG images | https://nextjs.org/docs/app/getting-started/metadata-and-og-images
docs: Next.js: MDX | https://nextjs.org/docs/app/guides/mdx
docs: react-markdown | https://github.com/remarkjs/react-markdown
---
A blog with fifty posts can't have fifty folders. Instead you write one page template and let part of the URL decide what to show: `/posts/hello-world`, `/posts/my-first-api`. And because each of those pages is different, each needs its own title and description, for Google results and for the preview card when someone shares the link on LinkedIn. This lesson covers both: **dynamic routes** and **metadata**.

## Dynamic segments

A folder name in square brackets is a **dynamic segment**. `app/posts/[slug]/page.tsx` matches `/posts/anything`, and the page receives the value in `params`:

```tsx
// app/posts/[slug]/page.tsx
type Props = { params: Promise<{ slug: string }> };

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  return <h1>You are reading: {slug}</h1>;
}
```

`params` is a **Promise**, so you must `await` it. Older tutorials read `params.slug` directly; that no longer works in current Next.js. The same is true for `searchParams` (the `?key=value` part of the URL), which you'll use in the next section. Recent versions also generate a global type helper, so you can write `props: PageProps<"/posts/[slug]">` instead of declaring `Props` yourself.

A catch-all segment, `[...slug]`, matches several levels: `/docs/a/b/c` gives `slug: ["a", "b", "c"]`.

## Content from Markdown files

For a blog or portfolio, a simple and popular approach is one Markdown file per item, with **frontmatter** (metadata between `---` lines) at the top:

```md
---
title: Hello world
date: 2026-11-01
description: Why I started this blog.
---
This is my **first** post.
```

Server Components can read files directly, so a small helper module loads them. Install the helpers with `npm install gray-matter react-markdown`:

```ts
// lib/posts.ts
import "server-only";
import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export type Post = { slug: string; title: string; date: string; description: string; body: string };

export const getPost = cache((slug: string): Post | null => {
  if (!/^[a-z0-9-]+$/.test(slug)) return null; // never trust URL input in a file path
  try {
    const file = fs.readFileSync(path.join(POSTS_DIR, `${slug}.md`), "utf8");
    const { data, content } = matter(file);
    const date = new Date(data.date).toISOString().slice(0, 10);
    return { slug, title: data.title, date, description: data.description, body: content };
  } catch {
    return null;
  }
});

export function getAllPosts(): Post[] {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => getPost(f.replace(/\.md$/, "")))
    .filter((p): p is Post => p !== null)
    .sort((a, b) => b.date.localeCompare(a.date));
}
```

- `process.cwd()` is the project root, so `content/posts/` sits next to `app/`.
- The synchronous `readFileSync` is a deliberate choice here. In a server you normally prefer async I/O, but these are a few small files that belong to the site itself, and synchronous reads let Next.js render the pages completely at build time without any extra caching setup.
- `matter(file)` splits the frontmatter (`data`) from the Markdown body (`content`). YAML turns dates into `Date` objects, so we convert them to a `YYYY-MM-DD` string.
- The regular expression check stops someone from requesting `/posts/..%2F..%2Fsecret` and reading files outside the folder.
- `cache` from React makes repeated calls with the same slug during one request run only once. You'll see why that matters in a moment.

## Rendering the page, or a 404

```tsx
// app/posts/[slug]/page.tsx
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import { getPost } from "@/lib/posts";

type Props = { params: Promise<{ slug: string }> };

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="prose">
      <h1>{post.title}</h1>
      <p>{post.date}</p>
      <Markdown>{post.body}</Markdown>
    </article>
  );
}
```

`notFound()` stops rendering and shows the nearest `not-found.tsx` (create `app/not-found.tsx` for a custom 404 page). `react-markdown` turns Markdown into React elements on the server, so the library adds no JavaScript to the browser. The `prose` class comes from the `@tailwindcss/typography` plugin and styles headings, lists and code in long text.

## Pre-rendering with generateStaticParams

If you know all slugs in advance, tell Next.js so it can render every post to static HTML at build time:

```tsx
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}
```

After `npm run build`, the route table lists each pre-rendered post. These pages load extremely fast because no work happens per request. It also tells Next.js that these `params` values are known in advance, which matters for caching (next section): a page that reads a param *not* in this list is treated as request-specific.

## Metadata per page

You've seen the static `metadata` export in the layout. For dynamic pages, export a `generateMetadata` function instead:

```tsx
import type { Metadata } from "next";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.description,
    openGraph: { title: post.title, description: post.description, type: "article" },
  };
}
```

Both `generateMetadata` and the page call `getPost(slug)`; thanks to `cache`, the file is read only once. In the root layout, a title **template** gives every page a consistent suffix:

```tsx
export const metadata: Metadata = {
  title: { default: "Anna Codes", template: "%s | Anna Codes" },
};
```

Now the post page's title becomes "Hello world | Anna Codes". For link previews, add an `opengraph-image.png` file to `app/` (or to a route folder) and Next.js adds the right `<meta>` tags automatically.

## MDX: when Markdown isn't enough

MDX is Markdown that can contain React components, for example an interactive demo inside a case study. Next.js supports it through the `@next/mdx` package (see the docs link). Start with plain Markdown; switch to MDX when you actually need components.

## Common mistakes

- **`params.slug` is undefined**: you forgot `await params`.
- **Wrong folder shape**: it must be a folder named `[slug]` containing `page.tsx`, not a file called `[slug].tsx` (that's the old Pages Router).
- **"Cannot read properties of null"**: you forgot to call `notFound()` when the item doesn't exist.
- **Exporting metadata from a client component**: `metadata` and `generateMetadata` only work in Server Components (pages and layouts).

## In short

- `[slug]` folders create dynamic routes; `params` is a Promise you must await.
- Load content by slug, validate the slug, and call `notFound()` when nothing matches.
- `generateStaticParams` pre-renders known pages at build time.
- `generateMetadata` gives each page its own title, description and Open Graph tags; wrap shared loaders in `cache`.

### Exercises
- Create `app/posts/[slug]/page.tsx` that shows the slug. Try several URLs.
- Add three Markdown posts in `content/posts/`, a `/posts` list page and the post page rendered with `react-markdown`. An unknown slug must show your custom 404 page.
- Add `generateMetadata` and a title template. Check the browser tab title and the `<meta>` tags with View Page Source.
- Add `generateStaticParams`, run `npm run build`, and find your pre-rendered posts in the route table.

---project
id: next-p3
title: Portfolio site in Next.js
summary: Your own portfolio with project case studies from Markdown, dynamic pages and good metadata. You'll keep improving it until the Career module.
---
### The task
Build the professional portfolio website you'll show to employers. Project case studies are Markdown files, each with its own dynamic page and metadata, so adding a new project later means adding one file. You'll deploy it at the end of this module and keep improving it until the Career module.

### What it must do
- Pages: `/` (your name, a one-line pitch, a short intro, links to GitHub, LinkedIn and a CV PDF in `public/`), `/projects` (a card per project), `/projects/[slug]` (a case study) and `/about`
- Projects are Markdown files in `content/projects/` with frontmatter: `title`, `summary`, `tech` (a list), `image`, `liveUrl`, `repoUrl`, `order`
- A shared layout with a header (the current page's link highlighted) and a footer
- Each case study page has its own title, description and Open Graph tags via `generateMetadata`; an unknown slug shows a custom 404 page
- Images use `next/image`; text uses a font loaded with `next/font`
- Dark mode that follows the system setting, plus a toggle button that remembers the choice
- Contact: a `mailto:` link on the About page and in the footer (a real contact form comes in the next section)
- Responsive from phone to desktop; Lighthouse 95+ in all four categories on the production build

### Steps
1. **Write the content first.** Your pitch, an About text and 2–4 case studies (problem → your solution → tech decisions → what you learned). Sketch the layout on paper or in Figma using what you learned in the UI Design module.
2. **Create the project** with `create-next-app` (TypeScript, Tailwind, ESLint, App Router). Build the root layout with header and footer, a `next/font` font and a title template. Create the Home and About pages with your real text. Commit.
3. **Navigation.** Build the `NavLink` client component that highlights the current page and use it in the header. Make the header work on a phone (wrap the links, or add a simple menu button).
4. **Content loader.** Create `lib/projects.ts` with `getAllProjects()` (sorted by `order`) and `getProject(slug)` (synchronous file reads like in the lesson, wrapped in `cache`, with slug validation). Define a `Project` type. Test it by rendering the project titles as a plain list on `/projects`.
5. **Projects page.** Replace the list with responsive cards: screenshot via `next/image` (files in `public/projects/`), summary, tech tags, and live/GitHub links. Show your top two projects on the home page too.
6. **Case study pages.** Create `app/projects/[slug]/page.tsx`: await `params`, load the project, call `notFound()` if missing, render the Markdown with `react-markdown` and the typography plugin. Add `generateStaticParams`, `generateMetadata` and `app/not-found.tsx`.
7. **Dark mode.** Add `dark:` variants to your colours and check the site with your system set to dark. Then add a toggle button (a client component) using the `next-themes` package.
8. **Production check.** Run `npm run build && npm start`, then Lighthouse in an incognito window. Fix what it reports (missing `alt` text, colour contrast, heading order, oversized images). Add an `opengraph-image.png` to `app/`.
9. **Test the loader.** Set up Vitest (as in the Testing module) and write a test for `lib/projects.ts`: `getAllProjects()` returns the projects sorted by `order`, and `getProject()` returns `null` for an unknown or invalid slug. Make it run with `npm test`.
10. **Publish the code.** Write a README (what it is, the tech used, how to add a project) and push to GitHub. You'll deploy it after the "Deploying to Vercel" lesson in the last section of this module, then add the live link to the README.

### Hints
- `gray-matter` returns `data` with type `any`. Validate it with a small Zod schema (you know Zod from the Express module) so a typo in the frontmatter gives a clear error instead of a broken page.
- With Tailwind v4, enable the typography plugin by adding `@plugin "@tailwindcss/typography";` to `globals.css` after installing it.
- By default, Tailwind's `dark:` follows the system setting. For a toggle, make it follow a class instead: add `@custom-variant dark (&:where(.dark, .dark *));` to `globals.css` and use `<ThemeProvider attribute="class">` from `next-themes`.
- `next-themes` changes the `<html>` element before React loads, so add `suppressHydrationWarning` to `<html>`. The theme isn't known on the server, so render the toggle's icon only after the component has mounted, or you'll get a hydration mismatch.
- Always measure Lighthouse on the production build. The dev server is much slower and gives misleading scores.
- If your loader has `import "server-only"`, that import throws when Vitest loads the file. Add `vi.mock("server-only", () => ({}));` at the top of the test file.

### Stretch goals
- After the next section: replace the `mailto:` link with a contact form that sends you an email through a Server Action (Resend's free tier), with a hidden honeypot field against spam bots.
- Add a blog section that reuses your Markdown loader.
- Switch case studies to MDX with `@next/mdx` and embed a small interactive React demo in one of them.
- Generate an Open Graph image per project with an `opengraph-image.tsx` file and `ImageResponse`.
- Buy a custom domain (about €10 a year) and connect it when you deploy.

### Done when
- Home, About, Projects and at least two case study pages work, with case studies loaded from Markdown files
- An unknown project URL shows your custom 404 page
- Every case study has its own title, description and Open Graph tags (checked with View Page Source)
- The active nav link is highlighted, and dark mode works with a toggle that remembers the choice
- Lighthouse scores 95+ in all four categories on the production build
- The code is on GitHub with a README
- At least one automated test runs with `npm test` (for example a Vitest test of the Markdown loader)
- Deployed on Vercel with the live link in the README (after the "Deploying to Vercel" lesson in the last section)

---section
id: next-s2
title: Making data flow
intro: Load data on the server with proper loading and error states, change data with Server Actions, expose JSON with route handlers, and store everything in Postgres. You'll finish by building a bookmarks manager.
---

---lesson
id: next-4
title: Data fetching, caching and streaming
time: 2h
video: Next.js data fetching caching tutorial
docs: Next.js: fetching data | https://nextjs.org/docs/app/getting-started/fetching-data
docs: Next.js: caching | https://nextjs.org/docs/app/getting-started/caching
docs: Next.js: revalidating | https://nextjs.org/docs/app/getting-started/revalidating
docs: Next.js: error handling | https://nextjs.org/docs/app/getting-started/error-handling
docs: Next.js: caching without Cache Components (previous model) | https://nextjs.org/docs/app/guides/caching-without-cache-components
---
Real pages wait for data: an API, a database, a slow third-party service. That raises three questions every full-stack developer has to answer. *What does the user see while waiting?* *What happens if it fails?* *And how fresh must the data be: can we reuse a result from an hour ago, or must every visitor get live data?* This lesson answers all three the Next.js way. It's the most "version-dependent" lesson in the module, so read it slowly.

## Fetching in Server Components, in parallel

You already know the basic pattern: an `async` Server Component awaits its data. When a component needs several independent pieces, start them together:

```tsx
async function DashboardSummary() {
  // ❌ waterfall: the second request starts only after the first finishes
  // const user = await getUser();
  // const posts = await getPosts();

  // ✅ parallel: both requests run at the same time
  const [user, posts] = await Promise.all([getUser(), getPosts()]);

  return <h1>{user.name} has {posts.length} posts</h1>;
}
```

Each `await` in a row adds its waiting time to the total. Two 1-second requests take 2 seconds in sequence but about 1 second in parallel.

## Streaming with loading.tsx and Suspense

Add a `loading.tsx` file next to a page and Next.js shows it immediately while the page's data loads:

```tsx
// app/users/loading.tsx
export default function Loading() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((n) => (
        <div key={n} className="h-6 animate-pulse rounded bg-gray-200" />
      ))}
    </div>
  );
}
```

Behind the scenes, Next.js wraps your page in a React `<Suspense>` boundary with this component as the fallback. The layout appears at once, the skeleton shows, and the real content **streams** in when it's ready, over the same HTTP response. To see it, add a fake delay to the page: `await new Promise((r) => setTimeout(r, 2000));`.

For finer control, wrap only the slow part in `<Suspense>` yourself, so the rest of the page shows straight away:

```tsx
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <Suspense fallback={<p>Loading summary…</p>}>
        <DashboardSummary />
      </Suspense>
    </>
  );
}
```

The heading appears instantly; `DashboardSummary` fills in when its data arrives. Give each slow component its own boundary and they appear independently.

## Static, cached or streamed?

A page, or a piece of a page, can be produced at different moments:

- **Static**: rendered once at build time. Every visitor gets the same stored HTML, which is extremely fast and can be served from a CDN close to the user.
- **Cached**: computed once, then reused for a while (an hour, a day) before it is refreshed.
- **Dynamic**: computed for every request. Needed when the result depends on *who* is asking (cookies, headers) or *what* they asked for (`searchParams`), or when the data must always be live.

Recent Next 16 versions turn on a model called **Cache Components** in new projects (look for `cacheComponents: true` in `next.config.ts`). It works like this: during the build, Next.js renders as much of each page as it can into a **static shell**. Plain JSX and synchronous code go into the shell automatically. Every piece of *async* data, and every use of request information (`cookies()`, `headers()`, `searchParams`, and `params` not listed by `generateStaticParams`), must then be one of two things:

1. **Cached** with the `"use cache"` directive, so it can become part of the shell:

```tsx
import { cacheLife } from "next/cache";

async function getProducts() {
  "use cache";
  cacheLife("hours"); // reuse the result for up to about an hour
  return db.select().from(products);
}
```

2. **Streamed** inside `<Suspense>` (or a `loading.tsx`), so the fallback goes into the shell and the real content is rendered for each request.

If a piece of async data is neither, the dev overlay shows an error about uncached data being accessed outside of `<Suspense>`, and the build fails. That's strict, but it forces you to decide how fresh each piece of data must be.

Values that change every time, like the current time or `Math.random()`, follow the same rule. To compute them per request, call `await connection()` (from `next/server`) first, inside a component wrapped in `<Suspense>`.

## Projects without Cache Components

Older projects, and many tutorials, use the **previous model** (no `cacheComponents` flag). There, Next.js decides per *route*: if the page uses `cookies()`, `headers()` or `searchParams`, the whole route is rendered per request; otherwise it is pre-rendered at build time. That leads to a classic surprise: a page that reads a database but uses no request information is rendered **once, at build time**, and shows that old data to everyone until it is revalidated. `await connection()` at the top of the page forces per-request rendering, and `export const revalidate = 60` allows re-rendering at most every 60 seconds. The docs have a separate guide for this model (linked above).

The practical rule for this module works in **both** models: **give every page that reads the database, cookies, `params` or `searchParams` a `loading.tsx`, or wrap the data-reading part in `<Suspense>`.** Use `"use cache"` only when you deliberately want a result reused.

## Revalidation: refreshing what was stored

Stored doesn't have to mean "frozen forever". Refreshing stored results is called **revalidation**:

- **Time-based**: "this may be up to an hour old". With Cache Components you set this with `cacheLife`.
- **On-demand**: "I just changed the data, refresh now". After saving a post you call `revalidatePath("/posts")` in a Server Action, and the next visit to `/posts` gets fresh content. You'll use this from the next lesson on. (For more precise control, cached functions can be labelled with `cacheTag("posts")` and refreshed with `updateTag("posts")`; see the revalidating docs.)

Caching has changed more than any other part of Next.js between versions, so read the docs for the version in your `package.json` and be careful with older tutorials. The underlying question never changes: **is this data the same for everyone and allowed to be a bit old (cache it), or is it per user or must it be live (stream it per request)?**

## Handling failures with error.tsx

If something throws while rendering a page, `error.tsx` in the same folder is shown instead of a crashed page:

```tsx
// app/users/error.tsx
"use client";

type Props = { error: unknown; retry: () => void };

export default function UsersError({ error, retry }: Props) {
  console.error(error);
  return (
    <div className="rounded border border-red-300 p-4">
      <h2 className="font-semibold">We couldn't load the users.</h2>
      <button onClick={() => retry()} className="mt-2 underline">Try again</button>
    </div>
  );
}
```

- It **must** be a Client Component, because it has a button with an event handler.
- `retry()` fetches and renders the segment again. (Earlier versions call this prop `reset`; use whatever the error-handling docs for your version show.)
- It catches errors in the page and its child routes, but not in the `layout.tsx` of the same folder; put an `error.tsx` one level higher for that.
- In production, server error messages are hidden from the browser for safety, so show a friendly message rather than the error's text.

Remember that `fetch` does **not** throw on a 404 or 500 response. Check it yourself: `if (!res.ok) throw new Error("Failed to load users");`.

## Common mistakes

- **Accidental waterfalls**: several `await`s in a row for independent data. Use `Promise.all`.
- **"Uncached data was accessed outside of `<Suspense>`"**: add a `loading.tsx` to that route, wrap the slow component in `<Suspense>`, or cache the data with `"use cache"` if it may be reused.
- **"It works in dev but shows old data in production"**: something was cached or pre-rendered at build time. Check the build output, then revalidate after changes or stream that part per request.
- **Not checking `res.ok`**: a failed request silently becomes broken data instead of reaching `error.tsx`.

## In short

- Fetch in Server Components; run independent requests in parallel with `Promise.all`.
- `loading.tsx` and `<Suspense>` show a fallback instantly and stream the real content in.
- With Cache Components (new projects), async data is either cached with `"use cache"` or streamed inside `<Suspense>`; without it, Next.js decides static or dynamic per route.
- Revalidate with `cacheLife` (time) or `revalidatePath` / `updateTag` (on demand), and check the docs for your version.
- `error.tsx` (a Client Component) catches failures and offers a retry.

### Exercises
- Build a `/users` page that fetches from JSONPlaceholder with a 2-second fake delay, and add a skeleton `loading.tsx`.
- Add `error.tsx`, then break the fetch URL on purpose and check that your `res.ok` check leads to your error page. Test the "Try again" button.
- Make a page with a static heading and two slow components (1 second and 3 seconds), each in its own `<Suspense>`. Watch them appear one after another.
- Create a component that shows the current time. Make one version cached with `"use cache"` and one per-request version with `await connection()` inside `<Suspense>`. Run `npm run build && npm start`, reload a few times and explain the difference. (No Cache Components in your project? Compare a page with and without `await connection()` instead.)

---lesson
id: next-6
title: Server Actions and forms
time: 2h
video: Next.js server actions tutorial
docs: Next.js: mutating data (Server Actions) | https://nextjs.org/docs/app/getting-started/mutating-data
docs: Next.js: forms guide | https://nextjs.org/docs/app/guides/forms
docs: React: useActionState | https://react.dev/reference/react/useActionState
docs: Zod docs | https://zod.dev
---
Reading data is half of an app; the other half is changing it: creating, editing and deleting. In React plus Express you needed a lot of plumbing for one form: a `fetch` POST in the browser, an Express route, JSON parsing, CORS, and then updating React state. **Server Actions** remove most of that. A Server Action is an async function that runs on the server, and you connect it directly to a form. In this lesson you'll build a guestbook; for now the messages live in memory, and in the last lesson of this section you'll move them to Postgres.

## A simple data store

```ts
// lib/messages.ts
export type Message = { id: number; name: string; text: string; createdAt: Date };

const messages: Message[] = []; // lives in server memory: lost on restart
let nextId = 1;

export function getMessages() {
  return [...messages].reverse(); // newest first
}

export function addMessage(data: { name: string; text: string }) {
  const message = { id: nextId++, ...data, createdAt: new Date() };
  messages.push(message);
  return message;
}
```

The id comes from a counter, not from `messages.length + 1`: later you'll delete messages, and after a delete the length goes down, so two messages could get the same id.

## Your first Server Action

```ts
// app/guestbook/actions.ts
"use server";
import { revalidatePath } from "next/cache";
import { addMessage } from "@/lib/messages";

export async function createMessage(formData: FormData) {
  const name = String(formData.get("name") ?? "");
  const text = String(formData.get("text") ?? "");
  addMessage({ name, text });
  revalidatePath("/guestbook");
}
```

```tsx
// app/guestbook/page.tsx
import { getMessages } from "@/lib/messages";
import { createMessage } from "./actions";

export default function GuestbookPage() {
  const messages = getMessages();
  return (
    <main className="space-y-4">
      <form action={createMessage} className="flex gap-2">
        <input name="name" placeholder="Your name" className="border p-1" />
        <input name="text" placeholder="Say hi" className="border p-1" />
        <button type="submit">Sign</button>
      </form>
      <ul>
        {messages.map((m) => (
          <li key={m.id}><b>{m.name}</b>: {m.text}</li>
        ))}
      </ul>
    </main>
  );
}
```

What happens here:

- `"use server"` at the top of the file turns every exported function into a Server Action.
- `<form action={createMessage}>` passes the function itself. Next.js creates a hidden endpoint for it; submitting the form sends the form data there, and your function runs **on the server**.
- The function receives a standard `FormData` object. Each input's `name` attribute becomes a key.
- `revalidatePath("/guestbook")` tells Next.js that the page's data changed, so the page re-renders with the new message.
- The form even works before the page's JavaScript has loaded (this is called *progressive enhancement*).

## Actions are public endpoints: validate!

Because Next.js creates an endpoint for every Server Action, **anyone can call it with any data**, without using your form. Treat it exactly like an Express POST route: validate the input and (in the next section) check who the user is. Zod makes validation easy:

```ts
// app/guestbook/actions.ts
"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { addMessage } from "@/lib/messages";
import { MessageSchema } from "@/lib/schemas";

export type FormState = {
  errors?: { name?: string[]; text?: string[] };
  message?: string;
};

export async function createMessage(prevState: FormState, formData: FormData): Promise<FormState> {
  const result = MessageSchema.safeParse({
    name: formData.get("name"),
    text: formData.get("text"),
  });
  if (!result.success) {
    return { errors: z.flattenError(result.error).fieldErrors };
  }
  addMessage(result.data);
  revalidatePath("/guestbook");
  return { message: "Thanks for signing!" };
}
```

```ts
// lib/schemas.ts
import { z } from "zod";

export const MessageSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(50),
  text: z.string().trim().min(1, "Write a message").max(280, "Keep it under 280 characters"),
});
```

The schema lives in its own file because a `"use server"` file may only export async functions (exporting types is fine). The action now takes the **previous state** as its first argument and **returns** a new state object. That shape is what `useActionState` expects.

## Errors and pending state with useActionState

```tsx
// app/guestbook/message-form.tsx
"use client";
import { useActionState } from "react";
import { createMessage, type FormState } from "./actions";

const initialState: FormState = {};

export function MessageForm() {
  const [state, formAction, isPending] = useActionState(createMessage, initialState);

  return (
    <form action={formAction} className="space-y-2">
      <input name="name" placeholder="Your name" className="block border p-1" />
      {state.errors?.name && <p className="text-sm text-red-600">{state.errors.name[0]}</p>}

      <textarea name="text" placeholder="Say hi" className="block border p-1" />
      {state.errors?.text && <p className="text-sm text-red-600">{state.errors.text[0]}</p>}

      <button disabled={isPending}>{isPending ? "Signing…" : "Sign"}</button>
      {state.message && <p className="text-green-700">{state.message}</p>}
    </form>
  );
}
```

`useActionState` (from React) wraps the action and gives you three things: the latest `state` returned by the action, a `formAction` to put on the form, and `isPending`, which is `true` while the action runs. The page renders `<MessageForm />` and stays a Server Component.

## Redirecting and passing extra arguments

After creating something you often want to go to another page. Call `redirect("/guestbook/thanks")` from `next/navigation` at the end of the action. It works by throwing a special error, so **never call it inside a `try` block**.

To pass an ID to an action (for a delete button), use `bind`:

```tsx
// in the page, for each message
const deleteThis = deleteMessage.bind(null, m.id);
<form action={deleteThis}><button>Delete</button></form>
```

```ts
// in actions.ts
export async function deleteMessage(id: number) {
  removeMessage(id); // add removeMessage() to lib/messages.ts
  revalidatePath("/guestbook");
}
```

## Common mistakes

- **Inputs without a `name`**: `formData.get("text")` returns `null`. Every field needs a `name` attribute.
- **Calling `redirect()` inside `try/catch`**: your `catch` swallows it and you see an error mentioning `NEXT_REDIRECT`. Move `redirect` after the `try/catch`.
- **Forgetting `revalidatePath`**: the data is saved, but the page keeps showing the old version.
- **Fields are cleared after an error**: React resets a form after its action finishes. Return the submitted values in the state (for example `values: { name, text }`) and use `defaultValue={state.values?.name}` on the inputs.

## In short

- A Server Action is an async function in a `"use server"` file, used as `<form action={fn}>`.
- It receives `FormData`, runs on the server and calls `revalidatePath` to refresh the page.
- Every action is a public endpoint: validate with Zod (and check auth later).
- `useActionState` gives you the returned state (errors, messages) and `isPending`.
- Use `bind` for extra arguments; call `redirect` outside `try/catch`.

### Exercises
- Build the basic guestbook: a form with a Server Action that adds a message, and a list that updates after submitting.
- Add the Zod schema and `useActionState`. Show field errors, and add a 1-second fake delay to the action so you can see the pending state on the button.
- Add a delete button to each message using `bind`.
- Keep the typed values when validation fails, by returning them in the state and using `defaultValue`.

---lesson
id: next-7
title: Route Handlers (API endpoints)
time: 1h
video: Next.js route handlers API routes tutorial
docs: Next.js: route handlers | https://nextjs.org/docs/app/getting-started/route-handlers
docs: MDN: Response.json() | https://developer.mozilla.org/en-US/docs/Web/API/Response/json_static
---
Server Actions are perfect for your own forms, but sometimes something *other* than your Next.js UI needs your data: a mobile app, a browser extension, a webhook from Stripe or GitHub, a scheduled job, or another developer using your public API. For these you need a normal HTTP endpoint that returns JSON. In Next.js that's a **route handler**: a small Express-like endpoint living inside your app.

## A first route handler

A route handler is a file called `route.ts` that exports functions named after HTTP methods:

```ts
// app/api/messages/route.ts
import { getMessages } from "@/lib/messages";

export async function GET() {
  return Response.json(getMessages());
}
```

Visit http://localhost:3000/api/messages and you get JSON. Some details:

- The folder path is the URL, just like pages. `app/api/` is a convention, not a requirement.
- Export `GET`, `POST`, `PUT`, `PATCH` or `DELETE`. A method you don't export automatically gets a `405 Method Not Allowed`.
- A folder can contain a `page.tsx` **or** a `route.ts`, never both.
- Handlers use the standard Web `Request` and `Response` objects, the same ones you used with `fetch` in the browser. `Response.json(data, { status })` creates a JSON response.

## Reading query parameters

Type the request as `NextRequest` to get a handy `nextUrl` property:

```ts
// app/api/messages/route.ts
import type { NextRequest } from "next/server";
import { getMessages } from "@/lib/messages";

export async function GET(request: NextRequest) {
  const limit = Number(request.nextUrl.searchParams.get("limit") ?? 20);
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    return Response.json({ error: "limit must be a whole number from 1 to 100" }, { status: 400 });
  }
  return Response.json(getMessages().slice(0, limit));
}
```

`/api/messages?limit=5` returns the five newest messages. Like Express's `req.query`, the values are always strings (or `null`), so convert and validate them.

## Handling a POST with validation

```ts
// app/api/messages/route.ts (add below GET)
import { z } from "zod";
import { MessageSchema } from "@/lib/schemas";
import { addMessage } from "@/lib/messages";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Body must be valid JSON" }, { status: 400 });
  }

  const result = MessageSchema.safeParse(body);
  if (!result.success) {
    return Response.json({ errors: z.flattenError(result.error).fieldErrors }, { status: 400 });
  }

  const message = addMessage(result.data);
  return Response.json(message, { status: 201 });
}
```

This is the same pattern as in the Express module: parse, validate, act, respond with the right status code. Because `MessageSchema` lives in `lib/schemas.ts`, the Server Action and the route handler share one set of rules.

Test it from the terminal:

```bash
curl -X POST http://localhost:3000/api/messages -H "Content-Type: application/json" -d "{\"name\":\"Ana\",\"text\":\"Hi!\"}"
```

## Dynamic route handlers

Square-bracket folders work here too. The second argument contains `params`, which is a Promise, just like in pages:

```ts
// app/api/messages/[id]/route.ts
import { removeMessage } from "@/lib/messages";

type Context = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, { params }: Context) {
  const { id } = await params;
  const removed = removeMessage(Number(id));
  if (!removed) {
    return Response.json({ error: "Message not found" }, { status: 404 });
  }
  return new Response(null, { status: 204 });
}
```

## Headers, cookies and CORS

Read request headers with `request.headers.get("authorization")`, and cookies with the `cookies()` function from `next/headers`. Requests from your own pages are same-origin, so they need no CORS. If a page on a **different** origin calls your API, the browser blocks the response unless you add headers such as `Access-Control-Allow-Origin`, exactly as you learned with Express (for non-simple requests, also export an `OPTIONS` handler).

When does a `GET` handler run? If it reads the request (query string, headers, cookies) or queries a database, it runs on every request, so the JSON is always fresh. But a handler that touches nothing request-specific, like the very first example above that returns an in-memory array, may be pre-rendered once at build time in projects using Cache Components, and then always return the build-time result in production. Reading the request or the database avoids this; the route handlers docs explain the details and how to cache a response on purpose.

## Server Action or route handler?

| Situation | Use |
|---|---|
| A form or button in your own Next.js app | Server Action |
| A mobile app or another website calls your backend | Route handler |
| Webhooks from Stripe, GitHub, etc. | Route handler |
| A public API for other developers | Route handler |
| Returning a file, an RSS feed or a streamed response | Route handler |

## Common mistakes

- **Using `export default`**: route handlers need named exports (`export async function GET`).
- **`page.tsx` and `route.ts` in the same folder**: Next.js reports a conflict. Keep APIs under `app/api/`.
- **Returning 200 for everything**: use 400 for bad input, 404 for missing items, 201 for created, 204 for "done, nothing to return". Clients rely on these codes.
- **Fetching your own API from a Server Component**: `await fetch("/api/messages")` in a server page is an unnecessary network round trip (and fails without a full URL). Call `getMessages()` directly instead.

## In short

- `app/.../route.ts` exports `GET`, `POST`, `DELETE`… and returns `Response` objects.
- Read query strings from `request.nextUrl.searchParams` and bodies with `await request.json()`.
- Validate exactly like in Express, and share Zod schemas with your Server Actions.
- Dynamic route handlers get `params` as a Promise in the second argument.
- Server Actions for your own UI; route handlers for everyone else.

### Exercises
- Add `GET /api/messages` to your guestbook and open it in the browser and in Postman (or with curl).
- Support `?limit=` with validation: `?limit=abc` and `?limit=500` must return a 400 with a helpful message.
- Add `POST /api/messages` with Zod validation, sharing the schema with your Server Action. Test valid and invalid bodies with curl.
- Add `DELETE /api/messages/[id]` returning 404 or 204. Then call `GET /api/messages` from a plain HTML page served on another port (for example with VS Code's Live Server): read the CORS error in the console, and fix it by adding an `Access-Control-Allow-Origin` header to the GET response.

---lesson
id: next-8
title: Databases in Next.js
time: 2h
video: Next.js Drizzle Postgres tutorial
docs: Learn Next.js: setting up your database | https://nextjs.org/learn/dashboard-app/setting-up-your-database
docs: Drizzle ORM docs | https://orm.drizzle.team/docs/overview
docs: Prisma docs | https://www.prisma.io/docs
docs: Neon docs | https://neon.tech/docs
---
Your guestbook forgets everything when the server restarts. Worse, in production your app may run as many separate server instances, each with its own memory, so visitors would see different messages. Real data belongs in a database. You already know Postgres and an ORM from the Databases module; what's new here is *where* the database code lives in a Next.js app and *how* the pieces call it. The examples use Drizzle; Prisma works the same way with a different syntax.

## Where database code goes

Keep all database access in a few server-only modules, often called a **data access layer**:

```
db/
├─ schema.ts           ← table definitions
└─ index.ts            ← the database client
lib/data/
└─ messages.ts         ← query functions: getMessages(), insertMessage()…
```

These functions are called from three places only: **Server Components** (to read), **Server Actions** and **route handlers** (to read and write). Never from Client Components: the database password must never reach the browser.

## Setting up Drizzle with Postgres

Create a free Postgres database on Neon (or Supabase) and copy its connection string into `.env.local`. Next.js loads this file automatically, and `create-next-app` already keeps it out of git. Then install the packages:

```bash
npm install drizzle-orm pg
npm install -D drizzle-kit @types/pg
```

```bash
# .env.local
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```

Define a table and a client:

```ts
// db/schema.ts
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

```ts
// db/index.ts
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

export const db = drizzle(process.env.DATABASE_URL!, { schema });
```

`drizzle-kit` runs outside Next.js, so it doesn't read `.env.local` by itself. Load it with Next's own helper in the config:

```ts
// drizzle.config.ts
import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";

loadEnvConfig(process.cwd());

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
});
```

Then create and apply the migration with `npx drizzle-kit generate` followed by `npx drizzle-kit migrate`.

## Query functions

```ts
// lib/data/messages.ts
import "server-only";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { messages } from "@/db/schema";

export async function getMessages() {
  return db.select().from(messages).orderBy(desc(messages.createdAt)).limit(50);
}

export async function insertMessage(data: { name: string; text: string }) {
  const [row] = await db.insert(messages).values(data).returning();
  return row;
}

export async function deleteMessageById(id: number) {
  const rows = await db.delete(messages).where(eq(messages.id, id)).returning();
  return rows.length > 0;
}
```

`import "server-only"` makes the build fail if a Client Component ever imports this file. It's placed here rather than in `db/index.ts` on purpose: `server-only` throws when it's imported from a plain Node script, and you'll want to import the client from a seed script.

## Reading in a page, writing in an action

```tsx
// app/guestbook/page.tsx
import { getMessages } from "@/lib/data/messages";
import { MessageForm } from "./message-form";

export default async function GuestbookPage() {
  const messages = await getMessages();
  return (
    <main>
      <MessageForm />
      <ul>{messages.map((m) => <li key={m.id}><b>{m.name}</b>: {m.text}</li>)}</ul>
    </main>
  );
}
```

```ts
// app/guestbook/actions.ts (the important part)
export async function createMessage(prevState: FormState, formData: FormData): Promise<FormState> {
  const result = MessageSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) return { errors: z.flattenError(result.error).fieldErrors };

  try {
    await insertMessage(result.data);
  } catch (err) {
    console.error(err); // full details go to the server log
    return { message: "Could not save your message. Please try again." };
  }

  revalidatePath("/guestbook");
  return { message: "Thanks for signing!" };
}
```

The page is now `async` and awaits the query, and the action writes to the database before revalidating. Errors are logged on the server, while the user sees a friendly message.

Remember the first lesson of this section: a database query is uncached async data. Add `app/guestbook/loading.tsx` (or wrap the list in `<Suspense>`), so the form appears instantly and the messages stream in. With Cache Components that's required; without it, it still gives a better experience. In projects using the previous model, also remember that a page with no request-specific input may be pre-rendered at build time, which means connecting to your database during the build. That's fine as long as `DATABASE_URL` is available at build time, and `revalidatePath` keeps the page fresh after each new message.

## Too many connections in development

In development, every time you save a file Next.js re-runs your modules, and each run can create a new connection pool. After a while Postgres refuses with "too many clients". The usual fix is to keep one client on `globalThis`, which survives reloads:

```ts
// db/index.ts
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as { db?: NodePgDatabase<typeof schema> };

export const db = globalForDb.db ?? drizzle(process.env.DATABASE_URL!, { schema });

if (process.env.NODE_ENV !== "production") globalForDb.db = db;
```

Prisma's documentation recommends the same pattern for `PrismaClient`. In production on a serverless platform such as Vercel, use your provider's **pooled** connection string (on Neon, the host name contains `-pooler`).

## Common mistakes

- **Importing the database in a Client Component**: you get errors about modules like `pg`, `fs` or `net` not being found, or the `server-only` error. Move the query into a Server Component or a Server Action.
- **`drizzle-kit` can't find `DATABASE_URL`**: load `.env.local` in `drizzle.config.ts` as shown above.
- **An "uncached data" error on the page that queries the database**: add a `loading.tsx` or a `<Suspense>` boundary around the part that reads the data.
- **The build fails while connecting to the database**: something is being pre-rendered at build time. Make sure the variable is set where you build, or render that part per request.
- **Committing `.env.local`**, or giving the database URL a `NEXT_PUBLIC_` prefix. Both leak your password.

## In short

- Put database code in server-only modules (a data access layer) and call it from Server Components, Server Actions and route handlers.
- Keep `DATABASE_URL` in `.env.local`; load it for `drizzle-kit` with `@next/env`.
- Pages `await` queries; actions write, then call `revalidatePath`.
- Reuse one client on `globalThis` in development; use a pooled connection string in production.

### Exercises
- Create a Postgres database on Neon, set up Drizzle (or Prisma) and migrate the `messages` table.
- Move the guestbook to Postgres. Restart the dev server and confirm the messages survive.
- Make your route handlers from the previous lesson use the same data functions, so the API and the page always agree.
- Write a seed script (`db/seed.ts`, run with `npx tsx db/seed.ts`) that inserts ten messages. Then finish the database and mutation chapters of the official Learn Next.js course.

---project
id: next-p4
title: Bookmarks manager
summary: Save links with notes and tags in Postgres, filter by tag, edit and delete them, and expose them as a JSON API.
---
### The task
While learning you find great articles, videos and docs every day, and browser bookmarks quickly become a mess. Build your own bookmarks manager: save a link with a title, notes and tags, find it again by tag, and edit or delete it. It's a single-user app for now (you'll add sign-in in the next section), and it uses everything from this section: Server Components reading Postgres, Server Actions with Zod, loading and error states, and a JSON route handler.

### What it must do
- A `bookmarks` table: `id`, `url` (required), `title` (required), `notes` (optional), `tags` (a Postgres text array, empty by default), `created_at`, `updated_at`
- `/bookmarks`: all bookmarks, newest first. Each shows the title as a link (opening in a new tab with `rel="noopener noreferrer"`), the domain, the notes and the tags as clickable chips
- Filter by tag through the URL: `/bookmarks?tag=react` shows only matching bookmarks plus "Tagged react · Clear filter". The filtered URL can be reloaded and shared
- `/bookmarks/new`: a form with url, title, notes and tags (comma-separated), handled by a Server Action with Zod validation: the url must be a valid `http://` or `https://` URL, the title 1–120 characters, notes at most 1000 characters, and tags are trimmed, lowercased and de-duplicated (at most 10)
- Field errors appear under each field, the button shows a pending state, and typed values stay after an error
- `/bookmarks/[id]/edit`: the same form, pre-filled, saving through an update action; an unknown or non-numeric id shows a 404 page
- Delete with a confirmation; the list updates without a manual refresh
- `loading.tsx` (a skeleton) and `error.tsx` (a friendly message with a "Try again" button) for the bookmarks routes
- `GET /api/bookmarks` returns all bookmarks as JSON and supports `?tag=`
- No sign-in yet: one user, you

### Steps
1. **Setup.** Create the project with `create-next-app`, add Drizzle (or Prisma), create a Neon database, put `DATABASE_URL` in `.env.local`, define the `bookmarks` table and migrate. Write a seed script that inserts 5 bookmarks with a mix of tags, and run it. Commit.
2. **Data layer.** Create `lib/data/bookmarks.ts` (with `import "server-only"`) containing `listBookmarks({ tag })`, `getBookmark(id)`, `createBookmark(data)`, `updateBookmark(id, data)` and `deleteBookmark(id)`. Check it works by rendering `JSON.stringify(await listBookmarks({}))` in a temporary page.
3. **List page.** Build `app/bookmarks/page.tsx`: await `searchParams`, read `tag`, call `listBookmarks`, and render cards. Tag chips are links to `"/bookmarks?tag=" + encodeURIComponent(tag)`. Add the filter header with a "Clear filter" link, and an empty state ("No bookmarks yet. Add your first one!").
4. **Loading and error states.** Add `loading.tsx` with a skeleton and `error.tsx` with a retry button. Test them with a temporary 2-second delay and a temporary `throw` in the page, then remove both.
5. **Create.** Put the Zod schema in `lib/schemas.ts`. Write `createBookmarkAction` in `app/bookmarks/actions.ts` (validate, insert, `revalidatePath("/bookmarks")`, then `redirect("/bookmarks")`). Build a `BookmarkForm` client component with `useActionState` that shows field errors and a pending button, and keeps values on error.
6. **Test the schema.** Set up Vitest and write tests for the schema in `lib/schemas.ts`: valid and invalid URLs (including a `javascript:` link), title length, and tag normalisation (spaces, upper case, duplicates, empty tags). Make them run with `npm test`.
7. **Edit and delete.** Create `app/bookmarks/[id]/edit/page.tsx`: await `params`, check the id is a whole number, load the bookmark or call `notFound()`. Reuse `BookmarkForm` with default values and an update action bound to the id. Add a delete button in a small client component that asks `confirm()` before submitting a form with the bound delete action.
8. **JSON API.** Create `app/api/bookmarks/route.ts` with a `GET` handler that reuses `listBookmarks` and supports `?tag=`. Test it in the browser and with curl.
9. **Polish and document.** Make the layout responsive, add a header with a "New bookmark" button, run `npm run build` and fix any type errors. Add a `.env.example`. Write a README with a screenshot and setup instructions (environment variables, migrate, seed). You'll deploy the app after the "Deploying to Vercel" lesson in the next section, then add the live link to the README.

### Hints
- A text array column in Drizzle is `text("tags").array().notNull()` with an empty-array default written with Drizzle's `sql` helper (`'{}'::text[]`). Filter by one tag with `arrayContains(bookmarks.tags, [tag])`. In Prisma: `tags String[]` and `where: { tags: { has: tag } }`.
- Normalise tags inside the schema with a transform: split on commas, `trim()`, `toLowerCase()`, drop empty strings, and remove duplicates with `[...new Set(tags)]`.
- `z.url()` accepts any valid URL, including dangerous `javascript:` links. Add a `.refine()` that only allows URLs starting with `http://` or `https://`.
- `searchParams` values can be a string, an array of strings (`?tag=a&tag=b`) or `undefined`. Handle all three before passing a tag to your query.
- Show the domain with `new URL(bookmark.url).hostname`.
- For the delete confirmation, the client component can use `onSubmit={(e) => { if (!confirm("Delete this bookmark?")) e.preventDefault(); }}` on the form.
- `redirect()` throws on purpose: call it after your `try/catch`, never inside.
- After editing, revalidate both `/bookmarks` and the edit page's path.
- The edit page reads `params` and the database, so it needs its own `loading.tsx` (or a `<Suspense>` boundary) too. If the dev overlay complains about uncached data outside of `<Suspense>`, that's what it means.

### Stretch goals
- Search with `?q=` across titles and notes (case-insensitive `ilike`), combined with the tag filter.
- A sidebar listing every tag with its number of bookmarks.
- Fill in the title automatically: when the title field is left empty, fetch the URL in the action and read its `<title>` (with a timeout).
- Pagination with `?page=`.
- Store tags in their own table with a many-to-many join table instead of an array.

### Done when
- Bookmarks are stored in Postgres and survive a server restart
- Creating and editing show Zod field errors and a pending state, and keep typed values after an error
- Clicking a tag filters the list through `?tag=`, and the filtered URL still works when reloaded
- Delete asks for confirmation and the list updates without a manual refresh
- The loading skeleton, the error page and the 404 for unknown bookmark ids all work
- `GET /api/bookmarks` and `GET /api/bookmarks?tag=react` return the right JSON
- `npm run build` succeeds and the README explains how to set the project up
- Vitest tests cover the Zod bookmark schema, including URL validation and tag normalisation
- `.env.example` lists every environment variable with placeholder values, and `.env` is git-ignored
- Deployed on Vercel with the live link in the README (after the "Deploying to Vercel" lesson in the next section)

---section
id: next-s3
title: Authentication and shipping
intro: Add sign-in so each user sees only their own data, protect pages and actions properly, and deploy to Vercel. You'll finish with two complete apps: a blog with an admin area, and a multi-user habit tracker.
---

---lesson
id: next-9
title: Authentication
time: 2.5h
video: Next.js authentication tutorial Better Auth
docs: Next.js: authentication guide | https://nextjs.org/docs/app/guides/authentication
docs: Next.js: proxy | https://nextjs.org/docs/app/getting-started/proxy
docs: Better Auth | https://www.better-auth.com/
docs: Better Auth: Next.js integration | https://www.better-auth.com/docs/integrations/next
docs: Auth.js | https://authjs.dev/
---
Your guestbook and bookmarks manager have one big gap: anyone can do anything. A blog needs an admin who alone can write posts; a habit tracker needs every user to see only their own habits. Two words to keep apart: **authentication** answers "who are you?" (signing in), and **authorization** answers "what are you allowed to do?" (checking permissions). Building authentication yourself means password hashing, secure session cookies, OAuth flows, CSRF protection and account linking; one mistake can expose every user. So you use a well-tested library, and focus your own effort on authorization, which only you can get right for your app.

## How sign-in works

Almost every auth library follows the same flow:

1. The user signs in with an email and password, or with **OAuth**: they are sent to GitHub or Google, approve your app, and are sent back to a **callback URL** on your site with a code that the library exchanges for their profile.
2. The server creates a **session** (a row in a `session` table) and sends the browser an `httpOnly` cookie containing a random session token. JavaScript in the page can't read that cookie.
3. Every following request includes the cookie automatically. The server looks up the session and knows the user.
4. Signing out deletes the session and the cookie.

## Choosing a library

- **Better Auth**: an open-source TypeScript library that stores users and sessions in *your* database through your ORM, supports email/password and many OAuth providers, and has a plugin system. This lesson uses it.
- **Auth.js** (formerly NextAuth): very widely used, so you'll meet it in existing projects and older tutorials. The ideas below transfer directly.
- Hosted services like **Clerk** or **Supabase Auth** run the auth for you in exchange for less control (and, above a free tier, money).

## Setting up Better Auth

Install it with `npm install better-auth`, then add the secrets to `.env.local`:

```bash
# .env.local
BETTER_AUTH_SECRET=a-long-random-string   # generate with: openssl rand -base64 32
BETTER_AUTH_URL=http://localhost:3000
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

Create a GitHub OAuth app (GitHub → Settings → Developer settings → OAuth Apps) with the callback URL `http://localhost:3000/api/auth/callback/github` to get the client ID and secret. Then configure the library:

```ts
// lib/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: { enabled: true },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  plugins: [nextCookies()], // lets Server Actions set auth cookies
});
```

Better Auth needs its own tables (`user`, `session`, `account`, `verification`). Its CLI generates them for your ORM (at the time of writing `npx auth@latest generate`; check the installation page), and then you run your normal migration. The generated tables must be part of the Drizzle schema the adapter receives: put them in `db/schema.ts` (or export them from it) next to your own tables, and pass `schema` to `drizzleAdapter` as above. Otherwise the adapter can't find them, and sign-in fails at runtime with an error that a model (like `user`) wasn't found. Finally, two small files connect it to Next.js:

```ts
// app/api/auth/[...all]/route.ts
import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

export const { GET, POST } = toNextJsHandler(auth);
```

```ts
// lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();
```

The route handler (a catch-all route, from the dynamic routes lesson) receives all of the library's own endpoints: sign-in, callbacks, sign-out. The client is for Client Components.

## Signing in and out

```tsx
// app/_components/sign-in-button.tsx
"use client";
import { authClient } from "@/lib/auth-client";

export function SignInButton() {
  return (
    <button onClick={() => authClient.signIn.social({ provider: "github", callbackURL: "/dashboard" })}>
      Sign in with GitHub
    </button>
  );
}
```

A sign-out button calls `authClient.signOut()` and then, for example, `router.push("/")`.

## Reading the session on the server

On the server you ask the library for the session using the incoming request headers. Wrap this in a small helper:

```ts
// lib/session.ts
import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});

export async function requireUser() {
  const session = await getSession();
  if (!session) redirect("/sign-in");
  return session.user;
}
```

Now any Server Component, Server Action or route handler can call `const user = await requireUser();`. `cache` makes several calls during one request look up the session only once.

Because the session comes from the request, it's request-specific data (previous section): pages that call `requireUser()` need a `loading.tsx` or `<Suspense>`, and a "Signed in as …" menu in the root layout must be its own async component wrapped in `<Suspense>`.

## Authorization belongs in the data layer

The most important rule of this lesson: **check permissions on the server, in every action and every query, not only by hiding buttons.** Remember that every Server Action is a public endpoint:

```ts
// app/guestbook/actions.ts
"use server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { requireUser } from "@/lib/session";

export async function deleteMessage(id: number) {
  const user = await requireUser();
  await db.delete(messages).where(and(eq(messages.id, id), eq(messages.userId, user.id)));
  revalidatePath("/guestbook");
}
```

The `where` clause includes the owner, so even if someone calls the action with another user's message id, nothing is deleted. Likewise, when creating data, take the user id from the session, never from a form field.

## proxy.ts: a quick first gate

`proxy.ts` (called `middleware.ts` before Next 16) runs before a route is rendered. It's useful for a fast, *optimistic* redirect of signed-out visitors:

```ts
// proxy.ts (in the project root, next to app/)
import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function proxy(request: NextRequest) {
  if (!getSessionCookie(request)) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*", "/admin/:path*"] };
```

This only checks that a session cookie *exists*, not that it's valid, so it is never your only protection. The real checks stay in your pages, actions and queries.

## Common mistakes

- **Protecting only the UI or only `proxy.ts`.** Hidden buttons and redirects don't stop a direct call to a Server Action or route handler. Check the session in each one.
- **Trusting a user id from the form.** A hidden `<input name="userId">` can be changed in DevTools. Always use the session's user.
- **"redirect_uri mismatch" from GitHub.** The callback URL in your OAuth app must exactly match your site, including `http` vs `https` and the port.
- **Secrets in the wrong place.** Never prefix `BETTER_AUTH_SECRET` or OAuth secrets with `NEXT_PUBLIC_`, and never commit `.env.local`.

## In short

- Authentication is "who are you?", authorization is "what may you do?". Use a library for the first; the second is your job.
- Better Auth stores users and sessions in your database and exposes its endpoints through one catch-all route handler.
- Read the session on the server with `auth.api.getSession({ headers: await headers() })`, wrapped in a `requireUser()` helper.
- Check ownership in every action and query; take the user id from the session.
- `proxy.ts` gives a fast optimistic redirect, never your only check.

### Exercises
- Add Better Auth with GitHub sign-in to your guestbook. Show "Signed in as …" and a sign-out button in the header (inside `<Suspense>`).
- Only signed-in users can post. Add a `userId` column to `messages`, fill it from the session, and show the author's name from their account.
- Users can delete only their own messages. Prove it: temporarily show the delete button on every message, sign in with a second account (email and password), and check that deleting someone else's message does nothing.
- Add `proxy.ts` that redirects signed-out visitors away from `/dashboard`. Sign out, visit `/dashboard`, and check where you land.

---lesson
id: next-10
title: Deploying to Vercel
time: 1h
video: deploy Next.js app to Vercel
docs: Next.js: deploying | https://nextjs.org/docs/app/getting-started/deploying
docs: Vercel: environment variables | https://vercel.com/docs/environment-variables
docs: Neon docs | https://neon.tech/docs
---
An app that only runs on `localhost` doesn't help your job search: employers want a link they can click. **Vercel**, the company behind Next.js, makes deploying a Next.js app almost effortless: connect a GitHub repository and every push is built and deployed automatically. This lesson walks through a first deployment, environment variables, databases and auth in production, and what to do when the live site behaves differently from your laptop.

## Before you deploy: build locally

The build on Vercel runs the same `next build` you can run yourself. Run it first and fix every error:

```bash
npm run build
npm start
```

`npm start` serves the production build at http://localhost:3000. Click through the main flows. Type errors, a page that can't be pre-rendered, or a missing `loading.tsx` show up here, where they are easy to debug.

## Your first deployment

1. Push your project to a GitHub repository.
2. Go to vercel.com, sign in with GitHub, and choose **Add New → Project**.
3. Import your repository. Vercel detects Next.js and fills in the build settings for you.
4. Add your environment variables (see below) and click **Deploy**.

After a minute or two you get a URL like `my-app.vercel.app`. From now on:

- Every push to `main` creates a new **production** deployment.
- Every push to another branch, and every pull request, gets its own **preview deployment** with a unique URL. You can test a change, or send the link to someone for feedback, before merging.

The free Hobby plan is meant for personal, non-commercial projects, which is exactly what your portfolio projects are.

## Environment variables

Your `.env.local` file is not in git (and shouldn't be), so Vercel doesn't have those values. Add them under **Project → Settings → Environment Variables**, choosing for each one which environments it applies to: Production, Preview, Development.

```bash
DATABASE_URL=postgresql://...-pooler.../neondb?sslmode=require
BETTER_AUTH_SECRET=...            # a new random value for production
BETTER_AUTH_URL=https://my-app.vercel.app
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

Two rules to remember:

- Changing a variable does **not** affect deployments that already exist. Redeploy afterwards.
- `NEXT_PUBLIC_` variables are written into the JavaScript at **build** time, so they also need a new deployment to change.

With the Vercel CLI, `vercel env pull` downloads the Development variables into `.env.local`, which is handy on a second computer.

## The database in production

- Use a **separate database** for production (on Neon, a separate branch or project), so experiments on your laptop never touch real data.
- Use the **pooled** connection string. Serverless functions start many short-lived instances, and pooling stops them from exhausting Postgres connections.
- **Run your migrations** against the production database before deploying code that needs them, for example `npx drizzle-kit migrate` with `DATABASE_URL` pointing at production. Some teams add this to the build or a CI step; doing it by hand is fine for now, as long as you don't forget it.

## Auth in production

OAuth providers only redirect to URLs you registered. Create a **second** GitHub OAuth app for production with the callback URL `https://my-app.vercel.app/api/auth/callback/github`, put its ID and secret in Vercel's Production variables, and set `BETTER_AUTH_URL` to your production URL. Preview deployments get a different URL each time, so GitHub sign-in usually won't work there; email and password sign-in is the simplest way to test previews.

## When the live site breaks

Vercel shows two kinds of logs:

- **Build logs**: when a deployment fails. Read from the first error, not the last line.
- **Runtime logs** (the Logs tab): errors that happen while serving requests, including your `console.error` calls from Server Actions.

"It works locally but not on Vercel" is almost always one of these:

- A missing or wrongly scoped environment variable.
- The production database isn't migrated, or is unreachable.
- **File name case.** Windows doesn't care whether you import `./Header` or `./header`; Vercel's Linux servers do. Make the import match the real file name exactly.
- Something was pre-rendered or cached at build time, so it shows old data.

## Other hosting options

Vercel isn't the only option. Any server with Node.js can run `npm run build && npm start` (Render, Railway, Fly.io or your own VPS), and Next.js can produce a small self-contained server for Docker with `output: "standalone"` in `next.config.ts`. Netlify also supports Next.js. The deploying page in the docs compares the options.

## Common mistakes

- **Never running `npm run build` locally**, so the first build error appears on Vercel where it's slower to debug.
- **Forgetting to redeploy** after changing environment variables.
- **Pointing production at your development database**, or forgetting to migrate the production one.
- **Committing secrets** to "make the deploy work". If a secret ever reaches GitHub, rotate it (create a new one) immediately.

## In short

- Run `npm run build && npm start` locally before deploying.
- Import the GitHub repo on Vercel: `main` deploys to production, other branches and pull requests get preview URLs.
- Add environment variables per environment and redeploy after changes.
- Use a separate, migrated production database with a pooled connection string, and a production OAuth app.
- Read build logs and runtime logs; check env vars, migrations and file name case first.

### Exercises
- Deploy your guestbook (with database and auth) to Vercel, including a production database and a production GitHub OAuth app.
- Create a branch, change a heading, open a pull request, and open its preview URL. Merge it and watch production update.
- Break it on purpose: remove `DATABASE_URL` from the Production variables and redeploy. Find the error in the logs, then fix it.
- Deploy your portfolio site from the first section and add the live URL to its README and your GitHub profile.

---project
id: next-p1
title: Full-stack blog / CMS
summary: A public blog plus a private admin area where you write, edit and publish posts. Postgres, Server Actions, auth and deployment in one project.
---
### The task
Build a blog with two sides: a public side where anyone can read published posts, and a private admin area where only you can write, edit, publish and delete them. This is the classic full-stack Next.js project and combines the whole module: dynamic routes and metadata, Postgres with an ORM, Server Actions with Zod, authentication, and deployment.

### What it must do
- Public pages: `/` lists the latest published posts (title, date, excerpt, tags); `/posts/[slug]` renders a post's Markdown with its own `generateMetadata` (title, description, Open Graph); `/tags/[tag]` lists posts with that tag
- Drafts are never visible publicly: a draft's URL returns a 404
- Admin area `/admin`, for your account only (for example: the signed-in user's email equals an `ADMIN_EMAIL` environment variable):
  - a table of all posts, including drafts, with their status
  - create and edit forms with a live Markdown preview
  - publish/unpublish and delete (with confirmation)
- Database: `posts` (`id`, `slug` unique, `title`, `excerpt`, `content`, `published`, `published_at`, `created_at`, `updated_at`), `tags` (`id`, `name` unique), `post_tags` (`post_id`, `tag_id`), plus Better Auth's tables
- Every write is a Server Action that validates with Zod **and** checks for the admin inside the action itself
- Slugs are generated from the title, are unique (add `-2`, `-3` when needed) and can be edited
- `loading.tsx`, `error.tsx` and a custom 404 page; an `app/sitemap.ts` listing all published posts
- Deployed on Vercel with a production database and working GitHub sign-in

### Steps
1. **Setup.** Create the project, connect Drizzle (or Prisma) to a Neon database, define `posts`, `tags` and `post_tags`, migrate, and write a seed script with 3 posts (one of them a draft). Commit.
2. **Public pages.** Write data functions that only return published posts: `getPublishedPosts()`, `getPublishedPostBySlug(slug)`, `getPublishedPostsByTag(tag)`. Build the home, post and tag pages (Markdown with `react-markdown`, `notFound()` for missing or draft posts), each with a `loading.tsx`. Add `generateMetadata` and a title template.
3. **Authentication.** Add Better Auth with GitHub sign-in and a `/sign-in` page. Write `requireAdmin()` in `lib/session.ts`: it gets the session and checks the email against `ADMIN_EMAIL`, otherwise redirects (or calls `notFound()`). Add `proxy.ts` for `/admin` as a first gate.
4. **Admin list.** Build `/admin` with a table of all posts (drafts too), their status and dates, and "Edit" links. Call `requireAdmin()` at the top.
5. **Create and edit.** Build a `PostForm` client component with `useActionState`: title, slug (optional, generated when empty), excerpt, tags (comma-separated) and content with a live preview next to it. Write `createPost` and `updatePost` actions: `requireAdmin()`, Zod validation, unique slug, save the post and its tags in one transaction, `revalidatePath`, then `redirect` to the admin list.
6. **Publish and delete.** Add publish/unpublish and delete actions (bound to the post id), each starting with `requireAdmin()`. Set `published_at` on first publish. Ask for confirmation before deleting.
7. **Polish.** Add `error.tsx`, a custom `not-found.tsx` and `app/sitemap.ts`. Style long text with the typography plugin. Write Vitest tests for your `slugify` function (spaces, accents, punctuation, repeated dashes) and your post Zod schema. Then add one Playwright test against the seeded data: the home page shows a published post, opening it shows its title, and the draft's URL returns a 404.
8. **Deploy.** Create the production database and run the migrations, create a production GitHub OAuth app, set all environment variables on Vercel and deploy. Test the full flow on the live URL: sign in, write, publish, read as a signed-out visitor. Write a README with the live link, screenshots and setup steps.

### Hints
- Put the "published only" condition inside the public data functions, not in the pages. Then no page can forget it.
- For the live preview, the textarea must be controlled (`useState`) so the preview updates as you type. Keep its `name="content"` so it's still included in the form data.
- Save a post and its tags with `db.transaction(async (tx) => { ... })`, so a failure never leaves a post with half its tags.
- Check slug uniqueness in your action, but also catch the database's unique-constraint error: two saves at the same moment can both pass the check.
- After publishing, revalidate the home page, the post's page and the admin list. `revalidatePath("/posts/[slug]", "page")` revalidates every page of that dynamic route at once.
- `react-markdown` doesn't render raw HTML by default, which protects you from script injection. Keep it that way.
- Format dates with `Intl.DateTimeFormat`, for example `new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(date)`.

### Stretch goals
- Image uploads for posts (Vercel Blob, UploadThing or Supabase Storage).
- Comments from signed-in readers, which the admin can delete.
- An RSS feed: a route handler at `app/feed.xml/route.ts` that returns XML with the right `Content-Type`.
- A generated Open Graph image per post with `opengraph-image.tsx`.
- Scheduled posts: a `publish_at` date in the future, and public queries that respect it.

### Done when
- Public pages show only published posts, and a draft's URL returns a 404
- Only the admin account can open `/admin` and run admin actions (checked by signing in with a second account)
- Creating, editing, publishing, unpublishing and deleting posts all work, with Zod errors shown in the form
- Each post page has its own title, description and Open Graph tags, and `/sitemap.xml` lists the published posts
- The site is deployed on Vercel with a production database and working GitHub sign-in
- The README has the live link, screenshots and setup steps
- Vitest tests cover slug generation and post validation, and a Playwright test checks that a published post appears on the blog
- `.env.example` lists every environment variable with placeholder values, and `.env` is git-ignored

---project
id: next-p2
title: Habit tracker SaaS
summary: A multi-user app where people track daily habits and see streaks and charts. Every query is scoped to the signed-in user.
---
### The task
Build a small SaaS-style app where anyone can sign up, track daily habits ("read 20 minutes", "drink 2 litres of water") and stay motivated with streaks, a heatmap and a weekly chart. The core skill here is **multi-user data**: every query and every action must only ever touch the signed-in user's data. People will use it on their phones, so mobile comes first.

### What it must do
- Sign in with GitHub or Google (optionally also email and password); signed-out visitors see a short landing page
- Habits have a name, a colour and a target number of days per week; users can create, edit and archive them
- `/today`: the user's active habits with a one-tap check/uncheck for today
- `/habits/[id]`: a habit's current streak, longest streak and a heatmap of the last 12 weeks
- A weekly chart: completed habits per day for the last 7 days
- `calculateStreaks(dates, today)` is a pure function with Vitest tests (empty list, a gap, today not yet done, duplicates, unsorted input)
- Database: `habits` (`id`, `user_id`, `name`, `color`, `target_per_week`, `archived`, `created_at`) and `check_ins` (`id`, `habit_id`, `date` as a `DATE`, unique on `habit_id` + `date`), plus the auth tables
- All data is per user: opening another user's habit URL returns a 404, and actions refuse to change other users' data
- Mobile-first layout; deployed on Vercel

### Steps
1. **Plan and set up.** Sketch the three main screens (Today, Habit detail, Manage habits) and the schema. Create the project with the database and Better Auth (GitHub). Build the landing page; signed-in users are redirected to `/today`. Commit.
2. **User-scoped data layer.** In `lib/data/habits.ts`, write every function with the user id as its first parameter: `listHabits(userId)`, `getHabit(userId, habitId)`, `createHabit(userId, data)`, `toggleCheckIn(userId, habitId, date)`… Each query filters on `user_id` (check-ins through a join with `habits`). Write these before any UI.
3. **Manage habits.** Build `/habits` with a create form (Server Action, Zod, `<input type="color">` for the colour), plus edit and archive. Every action starts with `requireUser()` and passes `user.id` to the data layer.
4. **Today view.** Build `/today`: active habits with a big check button each. The toggle action inserts or deletes the check-in for today's date and calls `revalidatePath("/today")`.
5. **Streaks, test-first.** Write Vitest tests for `calculateStreaks(dates, today)` before the implementation. Decide the rules first, for example: a streak is a run of consecutive days; if today isn't checked yet, the current streak still counts up to yesterday. Then implement until all tests pass.
6. **Habit detail.** Build `/habits/[id]` (await `params`, load the habit for this user or call `notFound()`): show both streaks and a 12-week heatmap built with CSS grid, one square per day coloured by check-in.
7. **Weekly chart.** Prepare the data on the server (7 days with a count each) and pass it as props to a chart Client Component. Use a library such as Recharts, or build simple bars with CSS.
8. **Polish and ship.** Big tap targets, a bottom navigation bar on small screens, `loading.tsx` and `error.tsx` states. Deploy to Vercel, then ask three friends to use it for a week and write their feedback down as GitHub issues.

### Hints
- Dates and time zones are the hardest part. Store check-ins as a plain `DATE`. The server's "today" (often UTC) can differ from the user's, so let the client send its local date as a hidden `YYYY-MM-DD` field in the toggle form, validate the format with Zod, and only accept dates within one day of the server's date.
- Test `calculateStreaks` with date strings (`"2026-11-20"`), not `Date` objects, to avoid time-zone surprises in your tests.
- The unique constraint on (`habit_id`, `date`) makes double taps harmless: in Drizzle, `onConflictDoNothing()` on insert.
- Chart libraries need `"use client"`; pass them plain arrays of numbers and strings, not database rows with `Date` objects.
- To prove the per-user checks work, sign in as a second user (a second browser or a private window) and try to open the first user's habit URLs.
- Employers who review your app may not want to sign in with their own Google or GitHub account. Enable Better Auth's email and password sign-in too, create a demo account (for example `demo@example.com`) with a few habits and check-ins, and put its email and password in the README. Create it through Better Auth's sign-up (in the app, or with `auth.api.signUpEmail` in a seed script) so the password is hashed correctly. Use a new password made only for this demo, never one you use anywhere else.

### Stretch goals
- Instant toggles with React's `useOptimistic`, so the check appears before the server responds.
- Make it installable on a phone with an `app/manifest.ts` file (a PWA).
- Daily reminder emails with Resend, sent by a route handler that Vercel Cron calls every evening.
- Weekly goal progress: show "3 of 5 days" based on `target_per_week`.
- Dark mode.

### Done when
- Users sign in with OAuth and see only their own habits; another user's habit URL returns a 404
- Habits can be created, edited and archived, and checking off today takes one tap
- `calculateStreaks` has at least 6 passing Vitest tests and powers the streaks on each habit page
- The heatmap and the weekly chart show real check-in data
- The app works well on a real phone
- It's deployed on Vercel and at least one other person has used it
- `.env.example` lists every environment variable with placeholder values, and `.env` is git-ignored
- The README explains what the project does and how to run it locally, with a screenshot

---module
id: ui
title: User Interface Design
scrimba: User Interface Design
weeks: 1–2 weeks
fullCourse: UI design fundamentals for developers
intro: You don't need to become a designer, but a handful of rules (hierarchy, type, colour, spacing and good states) make everything you build look and feel professional. Short module, big payoff for every project after it.
---

---section
id: ui-s1
title: UI design fundamentals
intro: The four tools designers use on every screen: hierarchy, typography, colour and spacing. Each lesson turns a principle into CSS you can reuse. You'll finish by designing and building a polished landing page for an imaginary product.
---

---lesson
id: ui-1
title: Visual hierarchy
time: 1h
video: Flux Academy — Why Hierarchy Is So Important in Web Design | https://www.youtube.com/watch?v=kOJ4c5THLQk
docs: Laws of UX | https://lawsofux.com/
docs: web.dev – Learn Design | https://web.dev/learn/design
---
When someone opens a page, their eyes jump around for a second or two before they decide where to look. **Visual hierarchy** is how you control that jump: it tells people what is most important, what comes next, and what they can ignore. Most "this looks amateur" problems in developer projects are not about ugly colours. They are about everything shouting at the same volume.

## What hierarchy is

Hierarchy is the *difference* in visual weight between elements. A page where everything is big and bold has no hierarchy, just like a page where everything is small and grey. A quick test is the **squint test**: step back from your screen and squint until the text is blurry. You should still see one clear starting point (usually a heading or a main button), then a few secondary blocks, then the details.

## The tools: size, weight, colour, space, position

You have five ways to make something stand out:

- **Size**: bigger things are seen first.
- **Weight**: bold (600–700) text stands out even at the same size.
- **Colour and contrast**: dark text on white is louder than grey text; a saturated colour is louder than a muted one.
- **Space**: an element with lots of empty space around it feels important.
- **Position**: top and left (in left-to-right languages) are read first.

Beginners reach for size every time. Try weight and colour first: they create hierarchy without making the layout huge.

## Emphasise by de-emphasising

Often the best way to make the main thing stand out is to make the *other* things quieter. Here is a product card where everything competes:

```css
/* Before: everything is loud */
.card h3      { font-size: 1.5rem; font-weight: 700; color: #000; }
.card .brand  { font-size: 1.25rem; font-weight: 700; color: #000; }
.card .price  { font-size: 1.5rem; font-weight: 700; color: #e11d48; }
.card .rating { font-size: 1.25rem; font-weight: 700; color: #e11d48; }
```

And the same card with a clear order: title first, price second, details last.

```css
/* After: one loud thing, one medium thing, quiet details */
.card h3      { font-size: 1.125rem; font-weight: 600; color: #111827; }
.card .price  { font-size: 1.25rem;  font-weight: 700; color: #111827; }
.card .brand,
.card .rating { font-size: 0.875rem; font-weight: 400; color: #6b7280; }
```

The brand and rating are still readable, but they are smaller, lighter and grey, so they no longer fight with the title. Notice the price didn't need red: size and weight were enough.

## Labels are secondary, values are primary

In dashboards and profile pages, developers often style the label and the value the same: "Followers: 1,204". Users scan for the *number*, so make the value loud and the label quiet:

```html
<div class="stat">
  <span class="stat-label">Followers</span>
  <span class="stat-value">1,204</span>
</div>
```

```css
.stat        { display: flex; flex-direction: column; gap: 0.25rem; }
.stat-label  { font-size: 0.875rem; color: #6b7280; }
.stat-value  { font-size: 2rem; font-weight: 700; color: #111827; }
```

Sometimes you don't need the label at all: "1,204 followers" in one line reads better than a label and a value.

## Button hierarchy

A page usually has one main action (Sign up, Save, Buy) and some secondary ones (Cancel, Learn more). If every button is a big coloured box, users must stop and think. Create three levels:

```css
.btn           { padding: 0.75rem 1.25rem; border-radius: 0.5rem; font-weight: 600; }
.btn-primary   { background: #2563eb; color: #fff; border: none; }
.btn-secondary { background: transparent; color: #2563eb; border: 1px solid #2563eb; }
.btn-tertiary  { background: none; color: #374151; border: none; text-decoration: underline; }
```

Primary is filled, secondary is outlined, tertiary looks like a link. Destructive actions (Delete) don't have to be big and red everywhere: on a settings page they can be a quiet tertiary button that becomes red and bold in the confirmation dialog, where it *is* the main action.

## Common mistakes

- **Making everything bold.** If three things on a card are bold, none of them is. Pick one.
- **Using only size.** Huge headings push content below the fold. Try weight, colour or space first.
- **Pure black and pure grey everywhere.** Use a dark grey (like `#111827`) for main text and a mid grey (like `#6b7280`) for secondary text. That is already two levels of hierarchy.
- **Several primary buttons side by side.** Only one action should look like the main one.

## In short

- Hierarchy is the difference in visual weight; the squint test shows if you have it.
- Use size, weight, colour, space and position, and try weight and colour before size.
- Make secondary things quieter instead of making the main thing louder.
- Values beat labels; one primary button per area.

### Exercises
- Take a screenshot of one of your old projects, do the squint test, and write down 3 hierarchy problems you see.
- Build a "stat card" row (3 stats such as followers, posts, likes) where the values are clearly louder than the labels.
- Build a product card (image, title, brand, price, rating, button) twice: first with everything bold and the same size, then with clear hierarchy. Put them side by side and compare.
- Create `.btn-primary`, `.btn-secondary` and `.btn-tertiary` classes and use them in a dialog with "Delete", "Cancel" and "Learn more".

---lesson
id: ui-2
title: Typography
time: 1h
video: Kevin Powell — Simple Solutions to Responsive Typography | https://www.youtube.com/watch?v=wARbgs5Fmuw
docs: Google Fonts Knowledge | https://fonts.google.com/knowledge
docs: Type scale tool | https://typescale.com/
---
Most of a web page is text. If the text is comfortable to read, the whole page feels professional, even with plain colours. Good typography is mostly about a few numbers: font sizes, line height and line length. Once you store those numbers as CSS custom properties, every page you build gets them for free.

## Choosing fonts

Use **one** font family, or two at most (one for headings, one for body). Good free options are Inter, Source Sans 3, IBM Plex Sans, Nunito Sans and, for a classic serif, Lora or Merriweather. The fastest choice of all is the **system font stack**, which uses the font each operating system already has:

```css
body {
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
```

To use a Google Font, copy the `<link>` tags Google Fonts gives you into your `<head>`, then refer to it by name with a fallback: `font-family: "Inter", system-ui, sans-serif;`. Only load the weights you use (for example 400, 600 and 700): every extra weight is another file to download.

## A type scale

Random font sizes (15px here, 17px there, 22px somewhere else) make a page feel messy. Instead, choose a **type scale**: a short list of sizes that grow by the same ratio. With a ratio of 1.25 starting at 1rem you get:

```css
:root {
  --text-sm:   0.8rem;    /* 12.8px: captions, labels */
  --text-base: 1rem;      /* 16px: body text */
  --text-lg:   1.25rem;   /* 20px: lead paragraph, card titles */
  --text-xl:   1.563rem;  /* 25px: h3 */
  --text-2xl:  1.953rem;  /* 31px: h2 */
  --text-3xl:  2.441rem;  /* 39px: h1 */
}

body { font-size: var(--text-base); }
h1   { font-size: var(--text-3xl); }
h2   { font-size: var(--text-2xl); }
h3   { font-size: var(--text-xl); }
.caption { font-size: var(--text-sm); }
```

Now there are only six possible sizes, and you choose between them instead of inventing new ones. Tools like typescale.com generate these numbers for any ratio. A smaller ratio (1.2) looks calm; a bigger one (1.333) looks dramatic and suits landing pages.

## Why rem

`rem` means "relative to the root font size", which is 16px by default. If a user increases the font size in their browser settings, everything in `rem` grows with it. Sizes in `px` ignore that setting, which is an accessibility problem. Use `rem` for font sizes and, usually, for spacing too.

## Line height and line length

Two settings make body text comfortable:

```css
body {
  line-height: 1.5;
}

.prose p,
.prose li {
  max-width: 65ch;
}

h1, h2, h3 {
  line-height: 1.15;
  text-wrap: balance;
}
```

- **Line height** around 1.5 gives body text room to breathe. Large headings need *less* (1.1–1.25), otherwise multi-line headings look like separate lines.
- **Line length** of 45–75 characters per line is easiest to read. The `ch` unit is the width of the "0" character, so `max-width: 65ch` limits lines to roughly 65 characters. Long lines across a wide screen make readers lose their place. The rule is scoped to a `.prose` wrapper (put it on your article or main text area): a global `li { max-width: 65ch }` would also squeeze list items used for navbars, menus and card grids.
- `text-wrap: balance` spreads heading words evenly across lines, so you don't get one lonely word on the last line. Browsers that don't support it simply ignore it.

## Fluid headings with clamp

On a phone, a 39px h1 can be too big; on a large screen it can feel small. `clamp(min, preferred, max)` lets a size grow smoothly with the screen width:

```css
h1 {
  font-size: clamp(2rem, 1.2rem + 3vw, 3.5rem);
}
```

The h1 is never smaller than 2rem or larger than 3.5rem, and in between it grows with the viewport width (`vw`). Mixing `rem` into the middle value keeps it responding to the user's font setting. Use this for big headings; body text can stay at a fixed `1rem`.

## Weight, case and letter spacing

- Use two or three weights: 400 for body, 600 for emphasis and headings, maybe 700 for numbers and the h1.
- Small uppercase labels look better with a little extra spacing: `text-transform: uppercase; letter-spacing: 0.05em; font-size: var(--text-sm);`
- Large headings often look better with slightly *tighter* spacing: `letter-spacing: -0.01em;`.
- Avoid long passages in all caps or italics: they are slower to read.

## Common mistakes

- **Body text smaller than 16px.** It feels "elegant" on your big monitor and is hard to read on a phone. Start at 1rem.
- **Paragraphs that span the full screen width.** Add `max-width: 65ch`.
- **Too many fonts and weights.** Three fonts and five weights look chaotic and load slowly.
- **Centring long text.** Centred text is fine for a short heading or a hero, but paragraphs longer than two or three lines should be left-aligned.

## In short

- One or two fonts; load only the weights you use.
- Define a type scale as custom properties and only use those sizes.
- Body: `1rem`, `line-height: 1.5`, `max-width: 65ch`. Headings: tighter line height.
- Use `rem` for sizes and `clamp()` for big fluid headings.

### Exercises
- Define a type scale (ratio 1.25) as CSS custom properties and apply it to `h1`–`h3`, body text and a `.caption` class.
- Take a long article (copy a Wikipedia page's text into an HTML file) and make it comfortable to read: font, line height, line length, heading sizes and spacing.
- Make the article's h1 fluid with `clamp()` and check it at 360px and 1440px wide in DevTools' device toolbar.
- Change your browser's default font size to "Large" and check the page still works. Find any `px` font sizes and convert them to `rem`.

---lesson
id: ui-3
title: Colour and accessibility
time: 1.5h
video: Flux Academy — How to Choose Colors (Easy 3-Step Process) | https://www.youtube.com/watch?v=KMS3VwGh3HY
docs: WebAIM contrast checker | https://webaim.org/resources/contrastchecker/
docs: W3C: accessibility intro | https://www.w3.org/WAI/fundamentals/accessibility-intro/
docs: Lighthouse overview | https://developer.chrome.com/docs/lighthouse/overview
---
Colour is the first thing people notice and the easiest thing to get wrong. Too many colours look chaotic; low-contrast colours make text unreadable for many users (and for everyone on a phone in sunlight). The good news: a small, planned palette stored in CSS custom properties solves almost every colour problem, and it makes dark mode easy later.

## What a palette needs

A practical UI palette has three parts:

- **One brand (primary) colour** for main buttons, links and highlights.
- **A range of greys** for text, borders and backgrounds. Most of your interface is grey.
- **A few semantic colours** with a fixed meaning: green for success, amber for warning, red for danger/errors.

Each colour needs several **shades** (light to dark), because you'll use a light blue for a background, a medium blue for a button and a dark blue for text on that light background. A common naming is 50–900:

```css
:root {
  --blue-50:  #eff6ff;
  --blue-100: #dbeafe;
  --blue-500: #3b82f6;
  --blue-600: #2563eb;
  --blue-700: #1d4ed8;

  --gray-50:  #f9fafb;
  --gray-200: #e5e7eb;
  --gray-500: #6b7280;
  --gray-700: #374151;
  --gray-900: #111827;

  --green-600: #16a34a;
  --amber-500: #f59e0b;
  --red-600:   #dc2626;
}
```

You don't have to invent these: tools and frameworks publish ready-made palettes, and tinted greys (with a hint of blue or warm brown) usually look better than pure grey.

## Semantic tokens: name colours by job

Don't use `--blue-600` directly all over your CSS. Add a second layer of variables that describe the *job* of the colour:

```css
:root {
  --color-bg:        #ffffff;
  --color-surface:   var(--gray-50);
  --color-text:      var(--gray-900);
  --color-text-muted: var(--gray-500);
  --color-border:    var(--gray-200);
  --color-primary:   var(--blue-600);
  --color-on-primary: #ffffff; /* text on a primary background */
  --color-danger:    var(--red-600);
}

body   { background: var(--color-bg); color: var(--color-text); }
.card  { background: var(--color-surface); border: 1px solid var(--color-border); }
.btn-primary { background: var(--color-primary); color: var(--color-on-primary); }
```

If you later change the brand to purple, you change one line. These named values are often called **design tokens**. Notice `--color-on-primary`: text that sits *on* a coloured background gets its own token, because it must change together with that background (you'll see why in dark mode below).

## Contrast: the rule you must check

The **WCAG** accessibility guidelines define a contrast ratio between text and its background, from 1:1 (same colour) to 21:1 (black on white). Level AA, the usual target, requires:

- **4.5:1** for normal text.
- **3:1** for large text (about 24px, or about 19px bold) and for important UI parts like input borders and icons.

Some real examples on a white background: `#6b7280` grey text is about 4.8:1 (passes), `#9ca3af` light grey is about 2.5:1 (fails), and white text on `#3b82f6` blue is about 3.7:1 (fails for normal text) while white on the darker `#2563eb` is about 5.2:1 (passes). That's why buttons often use the 600 shade, not the 500.

Check pairs with the WebAIM contrast checker, or in Chrome DevTools: inspect a text element and the colour picker shows its contrast ratio. **Lighthouse** (in DevTools) runs an accessibility audit of the whole page, including contrast.

## Don't rely on colour alone

About 1 in 12 men has some form of colour blindness. If an error is shown *only* by a red border, some users won't see it. Always add a second signal: an icon, a text message or a pattern.

```html
<input id="email" aria-invalid="true" aria-describedby="email-error">
<p id="email-error" class="error">⚠ Enter an email address like name@example.com</p>
```

The same applies to charts (use labels, not only colour) and to links inside text (keep the underline).

## Focus styles are colour too

Keyboard users need to see which element is focused. Never remove the outline without replacing it:

```css
:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}
```

`:focus-visible` shows the ring for keyboard users but not after a mouse click, so it doesn't annoy mouse users.

## Hover colours and dark mode with tokens

`color-mix()` creates variations of a token without adding more variables:

```css
.btn-primary:hover {
  background: color-mix(in oklch, var(--color-primary), black 15%);
}
```

Because components only use semantic tokens, dark mode is just a new set of values. Don't simply invert the colours: dark backgrounds should be dark grey (not pure black), and colours often need lighter shades to keep enough contrast.

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #0f172a;
    --color-surface: #1e293b;
    --color-text: #f1f5f9;
    --color-text-muted: #94a3b8;
    --color-border: #334155;
    --color-primary: #60a5fa;
    --color-on-primary: #0f172a;
  }
}
```

The lighter `#60a5fa` blue is easy to see on a dark background, but white text on it is only about 2.5:1 (fails). Dark navy `#0f172a` text on it is about 7:1, so the button text switches to dark in dark mode. This is exactly why `--color-on-primary` is a token and not a hard-coded `#fff`.

## Common mistakes

- **Light grey text for "elegance".** It usually fails contrast. Test it.
- **Too many colours.** If you have five accent colours, nothing feels important. One brand colour plus greys is enough.
- **Hard-coded hex values everywhere.** You can't change them consistently. Use tokens.
- **`outline: none` with no replacement.** Keyboard users get lost on the page.

## In short

- Palette = one brand colour + greys + semantic colours, each with several shades.
- Use semantic tokens (`--color-text`, `--color-primary`) in components.
- Text needs 4.5:1 contrast (3:1 for large text and UI parts); check with WebAIM, DevTools or Lighthouse.
- Never use colour as the only signal, and always show focus.

### Exercises
- Build a palette as CSS variables: one brand colour and greys with 5 shades each, plus success, warning and danger. Display them as swatches on a page.
- Add a semantic token layer on top (`--color-bg`, `--color-text`, `--color-primary`…) and restyle a small component using only those tokens.
- Check every text/background pair in one of your existing projects with the WebAIM checker or DevTools. Fix every failure and note the before/after ratios.
- Add dark mode to the same component with `prefers-color-scheme`, changing only token values. Test it with DevTools' "Emulate CSS prefers-color-scheme" option.

---lesson
id: ui-4
title: Spacing and layout
time: 1.5h
video: Kevin Powell — Breakpoint-Free CSS Grid Layouts | https://www.youtube.com/watch?v=bj0Z_GncIwY
docs: MDN: CSS Grid | https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout
docs: web.dev – Learn CSS | https://web.dev/learn/css
---
White space is not empty space: it's what groups related things, separates unrelated things and makes a page feel calm. Developer-built pages often look "off" because the spacing is random: 13px here, 20px there, 7px below a heading. A spacing scale and a few layout patterns fix this, and they make your CSS faster to write because you stop guessing numbers.

## A spacing scale

Like the type scale, a **spacing scale** is a short list of allowed values. Many design systems use multiples of 4 or 8 pixels (the "8-point grid"):

```css
:root {
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */
}

.card    { padding: var(--space-6); }
.stack > * + * { margin-top: var(--space-4); }
.section { padding-block: var(--space-16); }
```

Notice the gaps between values get bigger as numbers grow. The difference between 4px and 8px is obvious; between 60px and 64px it isn't, so the scale skips values you'd never notice. The `.stack > * + *` rule (the "lobotomised owl") adds space *between* children but not above the first one.

## Proximity: space shows relationships

The brain groups things that are close together. This is the **law of proximity**. A label must be closer to its own input than to the input above it; a heading must be closer to its paragraph than to the previous section.

```css
/* Before: same gap everywhere, so you can't tell which label belongs to which input */
label, input { display: block; margin-bottom: 16px; }

/* After: tight inside a field, loose between fields */
.field         { display: grid; gap: var(--space-1); }
.field + .field { margin-top: var(--space-6); }
```

A useful rule: **space inside a group should be smaller than space between groups.** If a card has 24px padding, the gap between cards should not be 8px.

## Start with too much space

When in doubt, add more space than feels natural, then remove some. Crowded designs are a much more common problem than empty ones. Landing pages in particular need generous vertical padding between sections (48–96px on desktop).

## Layout: Flexbox for one direction, Grid for two

- **Flexbox** arranges items in a single row *or* column: navbars, button groups, a card's icon next to its text.
- **Grid** arranges items in rows *and* columns at the same time: card grids, page layouts, forms with aligned columns.

Both use `gap` for spacing between items, which is cleaner than margins on every child.

```css
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(16rem, 100%), 1fr));
  gap: var(--space-6);
}
```

The card grid line is worth memorising: "make as many columns as fit, each at least 16rem wide, sharing the remaining space". It is responsive without a single media query: one column on a phone, two on a tablet, three or four on desktop. The `min(16rem, 100%)` part matters: with a plain `16rem`, a container narrower than 16rem (a very small phone, a sidebar) would overflow sideways; with `min()`, the column simply shrinks to the container's width.

## A content container

Full-width text on a wide monitor is hard to read. Wrap page content in a container that has a maximum width and side padding:

```css
.container {
  width: min(100% - 2rem, 70rem);
  margin-inline: auto;
}
```

`min()` picks the smaller value: on a phone the content is the screen width minus 1rem on each side; on a large screen it stops at 70rem and `margin-inline: auto` centres it.

## Mobile first

Write the CSS for small screens first, then add `min-width` media queries for larger ones. Small-screen layouts are usually simpler (one column), so you add complexity instead of undoing it:

```css
.layout { display: grid; gap: var(--space-6); }

@media (min-width: 48rem) {
  .layout { grid-template-columns: 16rem 1fr; } /* sidebar + main */
}
```

## Alignment

Pick a few vertical lines and line things up on them. Text in a card should start at the same left edge as the card title; buttons in a form should line up with the inputs. Mixed alignment (some things centred, some left, some indented by a random amount) is one of the quickest ways to make a page look unplanned.

## Common mistakes

- **Random values.** `margin: 13px` or `padding: 22px 17px`. Use the scale.
- **Equal spacing everywhere.** Groups disappear; use proximity.
- **Margins on every child instead of `gap`.** You end up fighting extra space after the last item.
- **Fixed widths like `width: 1200px`.** The page scrolls sideways on a phone. Use `max-width` or `min()`.

## In short

- Store spacing as custom properties and only use those values.
- Close together means related: space inside groups is smaller than space between them.
- Flexbox for one direction, Grid for two; use `gap`.
- Constrain content width with a container, and build mobile first.

### Exercises
- Add spacing tokens to one existing project and replace every hard-coded margin, padding and gap with a token.
- Build a sign-up form with five fields where proximity makes it obvious which label belongs to which input.
- Build a responsive card grid with `repeat(auto-fit, minmax(…, 1fr))` and check it at 360px, 768px and 1280px wide.
- Build a dashboard layout with Grid: a header across the top, a sidebar on the left (hidden or moved to the top on mobile) and a main area with a grid of cards.

---project
id: ui-p2
title: Landing page
summary: A polished, responsive marketing page for an imaginary product, built with design tokens.
---
### The task
Design and build a one-page marketing site for an imaginary product, such as a habit-tracking app, a plant-watering gadget or a local bike repair service. Landing pages are a common freelance job, and they are the perfect place to practise hierarchy, typography, colour and spacing: there's no backend, so all your attention goes to how it looks and reads.

### What it must do
- Sections: navbar, hero (headline, short subtext, a call-to-action button, an image or illustration), 3–6 features, testimonials or other social proof, pricing (3 tiers, with one highlighted), FAQ, footer
- Semantic HTML: `header`, `nav`, `main`, `section`, `footer`, exactly one `h1`, headings in order
- A `tokens.css` (or a `:root` block) with your type scale, colour palette (brand, greys, semantic) and spacing scale; the rest of the CSS uses only those tokens
- Responsive from 360px to 1440px wide, with no horizontal scrolling
- All text passes WCAG AA contrast; visible `:focus-visible` styles on links and buttons
- Images have `alt` text, `width` and `height` attributes, and images below the first screen use `loading="lazy"`
- Lighthouse in Chrome DevTools: Accessibility 95+, Performance 90+

### Steps
1. Write the copy first in a plain text file: product name, a headline that says what the user *gets*, a one-sentence subtext, 3–6 features with short descriptions, two or three testimonials, pricing tiers and 5 FAQ questions. Design is much easier with real text.
2. Sketch the page on paper: one box per section, for mobile and for desktop. Decide which section has the strongest call to action and what the one primary button says.
3. Create `index.html` with all sections in semantic HTML and no CSS. Read it top to bottom in the browser: it should already make sense as a document.
4. Create `tokens.css` with your type scale, palette (check your text/background pairs in the WebAIM checker now) and spacing scale. Add base styles: font, body colours, `line-height`, `max-width: 65ch` for paragraphs and a `.container`.
5. Style the sections mobile first, one at a time: navbar, hero, features, testimonials, pricing, FAQ, footer. Use Flexbox for rows of items and Grid for the features and pricing cards. Open the page at 360px wide in DevTools after each section.
6. Add `min-width` media queries for tablet and desktop: wider hero layout, multi-column features and pricing, and a fluid `clamp()` headline.
7. Build the FAQ with `<details>` and `<summary>` elements: they open and close with no JavaScript and work with the keyboard. Style the open state with `details[open]`.
8. Run Lighthouse (DevTools → Lighthouse → Analyze page load) for mobile. Fix every accessibility and performance issue it reports: missing alt text, contrast, image sizes, heading order. Also Tab through the whole page and check you can always see the focus.
9. Deploy to Netlify (drag and drop the folder) or GitHub Pages, and add a README with the live link and a screenshot.

### Hints
- The headline should say what the user gets ("Never forget to water your plants again"), not what the product is ("A smart plant sensor").
- Keep the highlighted pricing tier different by more than colour: add a "Most popular" label, a border or a slightly bigger card.
- Free images: Unsplash or Pexels; free illustrations: unDraw. Resize big photos before using them and save them as WebP. Most Performance problems on landing pages are oversized images.
- If something sticks out on mobile and causes horizontal scrolling, temporarily add `* { outline: 1px solid red; }` to find it.

### Stretch goals
- Add dark mode by overriding your colour tokens inside `@media (prefers-color-scheme: dark)`.
- Subtle fade-in animations on scroll that are turned off inside `@media (prefers-reduced-motion: reduce)`.
- A working newsletter form using Netlify Forms or Formspree, with a success message.
- After the next section: recreate the page in Figma and compare it with what you built.

### Done when
- All required sections are present and the HTML is semantic, with one h1
- Colours, font sizes and spacing come from tokens, with no random values
- The page works from 360px to 1440px wide without horizontal scrolling
- Lighthouse shows Accessibility 95+ and Performance 90+
- The page is deployed and the README links to it with a screenshot

---section
id: ui-s2
title: Figma and UX
intro: Learn the design tool developers meet at work, and the UX side of interfaces: states, forms and feedback. You'll finish by redesigning one of your own old projects in Figma and then in code.
---

---lesson
id: ui-5
title: Figma basics
time: 1.5h
video: Aliena Cai — Figma Tutorial for Beginners (Auto Layout & Components) | https://www.youtube.com/watch?v=HwiHqfax7Uk
docs: Figma help center | https://help.figma.com/
---
In most teams, designers work in **Figma** and developers turn those designs into code. Even if nobody gives you designs, sketching a screen in Figma before writing CSS saves time: moving a box in Figma takes a second, rewriting a layout in CSS takes much longer. This lesson covers the parts of Figma a developer actually uses. Figma runs in the browser and has a free plan, which is enough for everything here.

## Files, pages and frames

A Figma **file** contains one or more **pages** (like tabs). On a page you draw **frames**. A frame is a container, similar to a `div`: it can have a size, a background, a border radius and children. A top-level frame usually represents a screen. When you press `F` (Frame tool), the right panel offers presets such as "Desktop" or "iPhone", which gives you a screen-sized frame to design in.

Inside frames you add text (`T`), rectangles (`R`), images (drag them in) and more frames. The left panel shows the **layers**, which is just the element tree, like the DOM in DevTools.

## Auto layout = Flexbox

Auto layout is the most important Figma feature for developers, because it behaves like Flexbox. Select a frame or several layers and press `Shift + A`. The frame now:

- stacks its children horizontally or vertically,
- has a **gap** between children,
- has **padding**,
- grows or shrinks with its content.

The mapping to CSS is almost one to one:

| Figma auto layout | CSS |
| --- | --- |
| Direction: horizontal / vertical | `flex-direction: row` / `column` |
| Gap between items | `gap` |
| Padding | `padding` |
| Alignment | `align-items` and `justify-content` |
| Hug contents | width or height fits the content |
| Fill container | `flex: 1` (or `width: 100%`) |
| Fixed | a fixed `width` or `height` |

For example, a button built with horizontal auto layout, 12px vertical and 20px horizontal padding, "Hug contents" on both axes and a text layer inside, becomes:

```css
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
}
```

If you change the button's text, the button resizes, exactly like in the browser. Build every card, button, navbar and form with auto layout and your designs will be easy to translate into CSS.

## Components and variants

A **component** is a reusable design element, like a React component. Select a frame and press `Ctrl + Alt + K` (`Cmd + Option + K` on Mac). Copies of it are **instances**: change the main component and every instance updates. You can still override text or colour in a single instance.

**Variants** group versions of the same component: a Button with `type = primary | secondary` and `state = default | hover | disabled`. In code these become CSS classes or props. Designing variants forces you to think about every state *before* coding.

## Styles and variables: tokens in Figma

You can save colours, text settings and effects as **styles**, and numbers and colours as **variables**. They are Figma's version of your CSS custom properties. Create a variable for each colour token (`color/primary`, `color/text`) and each spacing value (`space/4`, `space/6`), and use them instead of typing hex codes. A good habit is to name them exactly like your CSS variables, so translation is mechanical.

## Inspecting a design

When you receive a design, you need numbers: sizes, spacing, colours, fonts. Select any layer and the right panel shows its properties. Hold `Alt` (`Option` on Mac) and hover over another layer to see the **distance** between them in pixels. Figma's **Dev Mode** shows the same information as ready-to-copy CSS; whether you can use it depends on your plan, but the normal panel already gives you every value you need.

To use icons and images, select a layer and use the **Export** section at the bottom of the right panel: SVG for icons and logos, PNG or JPG for photos.

## A simple workflow

1. **Wireframe**: grey boxes and real text, no colour. Decide what goes where and what's most important.
2. **Visual design**: apply your type scale, palette and spacing variables.
3. **Components**: turn repeated pieces into components with variants.
4. **Mobile and desktop**: design both. Auto layout makes resizing easier.
5. **Prototype** (optional): link frames together so clicking a button moves to another screen, to test a flow before coding it.

Don't aim for pixel-perfect art. For a developer, Figma is a thinking tool.

## Common mistakes

- **Placing everything by hand without auto layout.** When text changes, nothing moves, and the design is hard to translate into Flexbox.
- **Typing colours and sizes directly.** You end up with 14 slightly different greys. Use styles or variables.
- **Designing only for desktop.** Most visitors are on phones; design the mobile frame too.
- **Spending hours on details.** The goal is a clear plan for the code, not a perfect picture.

## In short

- Frames are containers; the layers panel is your element tree.
- Auto layout works like Flexbox: direction, gap, padding, hug/fill.
- Components and variants are reusable pieces with states, like React components.
- Styles and variables are your design tokens; inspect layers to read the values you need.

### Exercises
- Create a free Figma account and a file. Recreate a simple hero section (heading, paragraph, two buttons, image placeholder) using auto layout only.
- Create colour and spacing variables named like your CSS tokens and apply them to the hero.
- Create a Button component with variants `primary` / `secondary` and `default` / `disabled`, then use instances in the hero.
- Find a free community design file (search "landing page" in the Figma Community), inspect it, and write the CSS for one of its cards using the values you read from the panel.

---lesson
id: ui-6
title: UX: states, forms and feedback
time: 1.5h
video: Kole Jain — Every UI/UX Concept Explained in Under 10 Minutes | https://www.youtube.com/watch?v=EcbgbKtOELY
docs: Nielsen's 10 usability heuristics | https://www.nngroup.com/articles/ten-usability-heuristics/
docs: web.dev – Learn Forms | https://web.dev/learn/forms
---
UI is how an interface looks; **UX** (user experience) is how it feels to use. A beautiful app that shows a blank screen while loading, or a form that says "Invalid input" without saying which field, feels broken. As a developer you control most of UX, because you write the code that decides what happens in every situation. This lesson covers the situations beginners forget.

## Every screen has several states

Designs usually show the **ideal state**: a list full of nicely named items. Real apps also spend time in these states:

- **Empty**: the user has no data yet (first visit, nothing matches the search).
- **Loading**: data is on its way.
- **Error**: the request failed, or the input was wrong.
- **Partial**: one item, or one very long name, or a missing image.
- **Success**: the action worked and the user should know.

Design them all. A good trick is to design the empty state *first*: it's the first thing a new user sees.

## Empty states

"No data" is a dead end. A good empty state explains what will appear here and gives one action to start:

```html
<div class="empty-state">
  <h2>No books yet</h2>
  <p>Books you add will appear here, with your rating and notes.</p>
  <button class="btn btn-primary">Add your first book</button>
</div>
```

For an empty *search*, say what was searched and how to fix it: "No results for 'dnue'. Check the spelling or clear the filters."

## Loading states

If something takes more than a fraction of a second, show it. Options, from simple to fancy:

- Disable the button and change its text: "Saving…".
- A spinner in the area that is loading (not the whole page).
- A **skeleton**: grey boxes in the shape of the content, which makes waiting feel shorter.

```js
async function handleSubmit(event) {
  event.preventDefault();
  const button = event.target.querySelector("button[type=submit]");
  button.disabled = true;
  button.textContent = "Saving…";
  try {
    await saveBook(new FormData(event.target));
    showMessage("Book saved");
  } catch {
    showMessage("Couldn't save the book. Check your connection and try again.");
  } finally {
    button.disabled = false;
    button.textContent = "Save book";
  }
}
```

Disabling the button also prevents double submissions. `finally` makes sure it's re-enabled whether the request worked or not.

`showMessage` should write into an element that is already on the page, marked as a status region:

```html
<p id="message" role="status"></p>
```

`role="status"` (which implies `aria-live="polite"`) makes screen readers announce new text in that element, like "Book saved", without moving the user's focus. Without it, blind users get no feedback at all.

## Error messages: what happened and how to fix it

A good error message is specific, polite and tells the user what to do:

| Bad | Good |
| --- | --- |
| Invalid input | Enter a year between 1450 and 2026 |
| Error 500 | Something went wrong on our side. Your changes are not lost: try again in a minute. |
| Wrong format | Phone numbers can only contain digits and spaces |

Show field errors next to the field, not only in a box at the top, and keep what the user typed: clearing a form after an error is very frustrating.

## Forms that are easy to fill

Forms are where users give up most often. The basics:

- **Every input has a visible `<label>`.** A placeholder is not a label: it disappears when you type and is usually too light to pass contrast.
- **Use the right input type**: `type="email"`, `type="tel"`, `type="number"`, `type="date"`. Phones show the right keyboard.
- **Add `autocomplete`** (`name`, `email`, `new-password`) so browsers and password managers can fill fields.
- **Mark required or optional fields** clearly, and ask for as little as possible.
- **Connect errors to fields** so screen readers announce them:

```html
<div class="field">
  <label for="year">Publication year</label>
  <input id="year" name="year" type="number" inputmode="numeric"
         aria-invalid="true" aria-describedby="year-error">
  <p id="year-error" class="field-error">Enter a year between 1450 and 2026</p>
</div>
```

```css
.field-error { color: var(--color-danger); font-size: var(--text-sm); }
[aria-invalid="true"] { border-color: var(--color-danger); }
```

Styling with `[aria-invalid="true"]` means the visual state and the accessible state can never disagree.

## Feedback for every action

After the user does something, the interface should respond: a button changes on hover and press, an item appears in the list after "Add", a short message confirms "Saved". For destructive actions, ask for confirmation or, even better, offer **Undo** for a few seconds. This is the first of Nielsen's usability heuristics: *visibility of system status*. The other nine (match the real world, user control, consistency, error prevention…) are a great checklist for reviewing any screen.

## Keyboard and screen readers

Many people use a keyboard instead of a mouse. Test every page by pressing Tab: can you reach every link, button and input, in a sensible order, and can you always see where you are? Use real `<button>` and `<a>` elements instead of clickable `<div>`s: they work with the keyboard and screen readers for free. For messages that appear after an action ("Saved", "3 results"), use a `role="status"` element, as shown in the loading section above, so screen readers announce them.

## Common mistakes

- **Placeholder instead of a label.** Use a `<label>`; a placeholder can show an example.
- **Generic error messages.** Say what's wrong and how to fix it.
- **No loading feedback.** Users click again and submit twice.
- **Clickable `div`s.** They can't be reached with Tab. Use `button`.

## In short

- Design the empty, loading, error, partial and success states, not just the ideal one.
- Error messages explain what happened and how to fix it, next to the field.
- Forms need labels, correct input types, `autocomplete` and connected error messages.
- Give feedback for every action and test everything with the keyboard.

### Exercises
- Pick a list in one of your apps and add a proper empty state (message + action) and an empty-search state.
- Add a loading state to a form or fetch in one of your projects: disabled button with "Saving…" text, and an error message if it fails.
- Audit a sign-up form (yours or a real website) against Nielsen's 10 heuristics. Write down three problems and fix them in your own version.
- Build an accessible form field component in HTML/CSS with label, hint text and an error message connected via `aria-describedby`. Test it by navigating with Tab only.

---project
id: ui-p1
title: Redesign an old project
summary: Redesign your least professional project in Figma, then rebuild its look in code with tokens and proper UI states.
---
### The task
Pick the project of yours that looks the least professional (an old JavaScript app, your Express app's HTML pages or anything from the frontend course) and give it a full visual redesign: first in Figma, then in code. You will keep the functionality and change how it looks and feels. The before/after screenshots will show you, and future employers, how much a few design rules can do.

### What it must do
- "Before" screenshots (desktop and mobile) saved before you change anything
- A Figma file with: colour, type and spacing variables or styles; components for button, input and card (with variants for at least two states); the main screen(s) for desktop and mobile
- Loading, empty and error states designed in Figma and implemented in code (where the app has data or a form)
- Code uses CSS custom properties for colours, font sizes and spacing, with no random values
- All text passes WCAG AA contrast; every interactive element is reachable with Tab and has a visible focus style
- Form fields have visible labels and helpful error messages
- README with before/after screenshots side by side and a short list of what you changed and why

### Steps
1. Choose the project, create a new git branch called `redesign`, and take "before" screenshots at 375px and 1280px wide. Write down at least 5 problems using the vocabulary from this module (hierarchy, contrast, spacing, alignment, states).
2. In Figma, create variables (or styles) for your palette, type scale and spacing scale. Make a small "tokens" page that shows the swatches and text sizes.
3. Build the components with auto layout: button (primary, secondary, disabled), input (default, focus, error), and the card or list item your app uses most.
4. Design the main screen for mobile first, then desktop, using only your components and variables. Then design the empty, loading and error states for the same screen.
5. Translate your Figma variables into a `tokens.css` file of `:root` custom properties, with the same names. Link it in your HTML and check that nothing breaks.
6. Restyle the app one component at a time, starting with the base styles (body text, headings, links), then buttons and inputs, then layout. Commit after each component.
7. Implement the missing states: an empty state with an action, a loading indicator or disabled "Saving…" button, and specific error messages next to fields.
8. Audit: check contrast with DevTools or WebAIM, run Lighthouse, and Tab through the whole app. Fix what you find.
9. Take "after" screenshots at the same sizes, write the README section, merge the branch, and redeploy if the project was online.

### Hints
- Look at apps you like on Dribbble or Mobbin for inspiration: copy layout ideas, not exact designs.
- Use fewer colours and more white space than you think you need. Most redesigns improve just by removing things.
- If your old CSS is a mess, it's fine to start a new stylesheet and rebuild from your tokens rather than patching old rules.
- Keep the Figma file shareable (view-only link) and link it from the README.

### Stretch goals
- Add dark mode by overriding only the colour tokens.
- Add a small prototype in Figma that clicks through the main flow (for example, empty → add item → list).
- Do the same redesign process for a second project in half the time.

### Done when
- The README shows before and after screenshots side by side
- The Figma file contains variables, components with variants, and desktop and mobile screens
- All colours, font sizes and spacing in the CSS come from custom properties
- Every text/background pair passes WCAG AA contrast
- Empty, loading and error states exist in the app, and the app is fully usable with the keyboard

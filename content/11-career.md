---module
id: career
title: Launching Your Career
scrimba: Launching Your Career
weeks: Ongoing (start early!)
fullCourse: how to get your first developer job self taught
intro: Start this module in parallel from around the Express module, with an hour or two a week. A portfolio, a network and interview skills take months to build, so begin long before you feel "ready".
---

---section
id: career-s1
title: Portfolio and online presence
intro: Make your work easy to find and easy to judge: three polished projects, a portfolio site, a strong GitHub profile, a one-page CV and an active LinkedIn. You'll finish with a job-ready checklist that says you can start applying.
---

---lesson
id: car-1
title: Choose and polish 3 portfolio projects
time: 4h
video: Phillip Choi — How to Get Hired as a Software Engineer (The One Project Rule) | https://www.youtube.com/watch?v=tr4saJGic4o
docs: roadmap.sh: Full Stack | https://roadmap.sh/full-stack
docs: Make a README | https://www.makeareadme.com/
---
As a self-taught developer, your projects are your experience. A recruiter or hiring manager will spend about a minute on your portfolio before deciding whether to read on, so they need to see quickly that you can build real, working software. Three strong, finished, well-presented projects beat thirty half-finished tutorial copies every time. This lesson helps you choose those three and polish them until they look professional.

## What reviewers actually check

People reviewing junior candidates usually look at the same few things, in this order:

1. **Does it work?** A live link that loads in a few seconds. A broken demo is worse than no demo.
2. **What is it and why?** A clear README: what problem it solves, a screenshot, the tech stack.
3. **Is the code reasonable?** Sensible folder structure, readable names, no huge commented-out blocks, some tests.
4. **Did they build it themselves?** A commit history spread over days or weeks, with meaningful messages, tells a story. One commit called "initial commit" with 5,000 lines does not.

## Choosing your three

Pick projects that together show **different** skills. A good combination for a full-stack developer from this curriculum:

| Slot | Shows | Example from this curriculum |
|---|---|---|
| Full-stack app | Auth, database, CRUD, deployment | Habit tracker SaaS or Full-stack blog (Next.js) |
| AI feature | Modern skills, working with APIs and data | Chat with your docs (RAG) or the AI agent |
| Quality and backend | API design, tests, TypeScript | Fully tested Books API with CI |

Later, your **capstone** (end of this module) should replace the weakest of the three. Avoid famous tutorial projects (todo apps, weather apps, Netflix clones) as main pieces unless you've taken them much further than the tutorial: reviewers have seen hundreds of them.

> **Tip:** A project that solves a real problem for a real person ("my sister's bakery uses it to take orders") is more interesting than a technically impressive project nobody uses.

## The README template

Your README is the project's landing page. Use this structure:

```markdown
# Habit Hero

Track daily habits, keep streaks and see your progress in charts.
**Live demo:** https://habit-hero.vercel.app (demo login: demo@example.com / demo1234)

![Screenshot of the dashboard](docs/screenshot.png)

## Why I built it
I kept forgetting my daily Spanish practice and wanted streaks that motivate me...

## Features
- Sign in with GitHub
- Create habits with daily or weekly goals
- Streaks calculated server-side (unit-tested)

## Tech stack
Next.js, TypeScript, PostgreSQL (Neon) with Drizzle, Better Auth, Vitest, Playwright

## Run it locally
1. `git clone ...` and `npm install`
2. Copy `.env.example` to `.env` and fill in the values
3. `npm run db:migrate` then `npm run dev`

## What I learned / next steps
Calculating streaks across time zones was harder than expected...
```

The **demo login** matters: reviewers won't sign up for an account. Create a seeded demo user with sample data so the app looks alive. If the app only has Google or GitHub sign-in (like the Habit tracker), also enable email/password sign-in in Better Auth and seed the demo account with it, so reviewers can try the app without using their own Google or GitHub account. The "What I learned" section gives interviewers something to ask you about.

## The polish checklist

Go through each project with this list:

- Live demo works on desktop and phone, with sample data, and loads quickly. (Free hosting tiers that "sleep" can take 30+ seconds to wake up: mention it in the README or keep the service awake.)
- README with screenshot or GIF, features, stack, how to run, and a demo login.
- `.env.example` listing every variable (without real values); no secrets in the git history.
- No `console.log` debugging leftovers, commented-out code or unused files.
- Consistent formatting (run Prettier) and no lint errors.
- At least a few tests for the core logic, and CI passing (a green badge in the README is a nice signal).
- Error states and empty states handled: what does a new user with zero data see?
- A good repo description and topics on GitHub, and the live URL in the repo's "About" box.

## Common mistakes

- **Too many weak projects.** Archive or unpin the tutorial follow-alongs; show only your best work.
- **A dead demo.** Databases on free tiers get paused after inactivity. Check your live links every month.
- **A README that only says "npm start".** Nobody will clone your repo to find out what it does.
- **Hiding that a project was based on a tutorial.** Be honest, and explain what you added yourself.

## In short

- Pick 3 finished projects that show different skills: full-stack, AI, and quality/backend.
- Every project needs a working live demo with a demo login and sample data.
- A strong README: what and why, screenshot, features, stack, how to run, what you learned.
- Polish code, secrets, tests and empty states; check live links regularly.

### Exercises
- List every project you've built so far and score each from 1–5 on "works live", "README", "code quality" and "uniqueness". Choose your top 3.
- Write the README for each of the 3 using the template above, including a screenshot or GIF and a demo login.
- Go through the polish checklist for one project and fix everything on it. Commit each fix separately with a clear message.
- Ask a friend to run one project using only the README. Watch without helping, write down where they got stuck, and fix the README.

---lesson
id: car-2
title: Portfolio website and GitHub profile
time: 3h
video: Miraya — How to Make Your GitHub Stand Out | https://www.youtube.com/watch?v=z8UPAVTh2aE
docs: GitHub profile README | https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/managing-your-profile-readme
docs: GitHub Pages | https://docs.github.com/en/pages
---
When someone hears about you (from your CV, LinkedIn or a message you sent), they search for you. Within two clicks they should find a simple site that says who you are, shows your best work and tells them how to contact you, plus a GitHub profile that backs it up with real code. This lesson turns the Next.js portfolio you built in the Next.js module into that landing page, and sets up your GitHub profile.

## What a portfolio site needs (and doesn't)

A portfolio is a **landing page for you**, not a design experiment. It needs four things:

1. **Hero**: your name, one line about what you do, and a photo (optional but friendly). For example: "Full-stack developer building web apps with React, Node.js and PostgreSQL."
2. **Projects**: your 3 best, each as a card with an image, a two-sentence description, the stack, and links to the live demo and the code.
3. **About**: a short paragraph: your background (a previous career is an asset, not something to hide), what you enjoy building, what kind of role you want.
4. **Contact**: email (or a contact form), LinkedIn and GitHub links. Make it impossible to miss.

What it doesn't need: skill bars ("JavaScript 80%" means nothing), long lists of every technology you've touched, heavy animations that make it slow, or a blog with one post from two years ago.

## Project cards and case studies

A good project card answers "what, for whom, with what" in seconds:

```
Habit Hero
Track habits and streaks with charts. Built for people learning a language daily.
Next.js · TypeScript · PostgreSQL · Better Auth
[Live demo]  [Code]  [Case study]
```

For your strongest project (later: your capstone), add a **case study** page: the problem, your solution, an architecture diagram, two or three technical challenges and how you solved them, and what you'd do next. It shows how you think, which is exactly what interviewers try to find out.

## Technical quality

Your portfolio is itself a code sample, so make it good:

- Fast: aim for 90+ in Lighthouse for performance and accessibility.
- Responsive: test it at phone width; many people will open it from LinkedIn on a phone.
- Accessible: alt text on images, good contrast, keyboard navigation.
- Proper metadata: title, description and a social preview image, so links look good when shared.
- A clean URL: a custom domain (`yourname.dev`, about the price of a pizza per year) is a nice touch, but `yourname.vercel.app` is perfectly fine.

## Your GitHub profile

GitHub is the second place people look. Set it up properly:

- **Profile photo and name**: the same photo and name as on LinkedIn and your CV, so people know it's you.
- **Bio and links**: one line, your location (or "Remote") and your portfolio URL.
- **Pinned repositories**: pin up to 6. Your 3 portfolio projects first, then other solid work. Every pinned repo needs a description and a README.
- **Profile README**: create a public repository named **exactly** like your username. Its README appears at the top of your profile.

A simple profile README:

```markdown
# Hi, I'm Sam 👋

Full-stack developer (React, Node.js, TypeScript, PostgreSQL), based in Lisbon and open to junior roles.
Before coding I spent 5 years in logistics, so I love building tools that save people time.

**Featured projects**
- [Habit Hero](https://habit-hero.vercel.app): habit tracker with streaks and charts (Next.js, Postgres)
- [DocChat](https://docchat.example.com): ask questions about your documents, with citations (RAG, pgvector)
- [Books API](https://github.com/sam/books-api): fully tested REST API with CI (Express, Vitest)

📫 sam@example.com · [Portfolio](https://sam.dev) · [LinkedIn](https://linkedin.com/in/sam)
```

Keep it short and honest. Avoid walls of badges and auto-generated stats cards: they add noise, not information.

## The contribution graph

The green squares show *when* you commit. Regular activity looks good, but don't fake it with empty commits: experienced reviewers notice, and it's not what gets you hired. Committing your real daily work (including exercises from this curriculum, in a learning repo) is enough.

## Common mistakes

- **A portfolio that's slow or broken on mobile.** Test it on your own phone.
- **Pinned repos without READMEs**, or tutorial forks pinned at the top.
- **Different names and photos everywhere**, so people aren't sure they found the right person.
- **Spending weeks on the portfolio design** instead of on projects. A simple, clean template is fine.

## In short

- Portfolio = hero, 3 project cards, short about, obvious contact. Fast, responsive, accessible.
- Add a case study for your strongest project.
- GitHub: same photo and name, bio with portfolio link, 6 pinned repos with READMEs, a profile README.
- Consistency across portfolio, GitHub, LinkedIn and CV builds trust.

### Exercises
- Create your GitHub profile README (a repo named exactly like your username) and pin your 6 best repositories, each with a description.
- Update your Next.js portfolio from the Next.js module with the four sections above, and publish it.
- Run Lighthouse on your portfolio and fix issues until performance and accessibility are 90+. Test it at phone width.
- Write a case study page for your best project: problem, solution, architecture diagram, 2 challenges, next steps.

---lesson
id: car-3
title: CV / résumé
time: 2h
video: Anthony Sistilli — How to Make a Dev Resume That Actually Gets You Hired | https://www.youtube.com/watch?v=fD0E57QYSPk
docs: Tech Interview Handbook: résumé | https://www.techinterviewhandbook.org/resume/
---
Your CV (called a résumé in the US) has one job: get you an interview. It's read in seconds, often first by software (an Applicant Tracking System, or ATS) and then by a recruiter who may not be technical. Without developer job experience, you need to make your projects and transferable skills do the work. This lesson gives you a structure, a formula for strong bullet points, and a way to tailor your CV to each job quickly.

## Structure: one page, simple layout

For a junior developer, use one page in this order:

1. **Header**: name, city (or "Remote, UTC+1"), email, phone, and links to portfolio, GitHub and LinkedIn.
2. **Summary** (2–3 lines, optional): who you are and what you're looking for.
3. **Skills**: one or two lines grouped by type.
4. **Projects**: your 3 best, with links. For career changers this goes *above* experience.
5. **Experience**: previous jobs, even non-tech ones, focused on transferable skills.
6. **Education**: degree if you have one, plus relevant courses or certificates (one line each).

Use a plain single-column layout, a standard font, and real text (not text inside images). ATS software parses simple layouts reliably; fancy two-column designs with icons and skill bars often come out as garbage. Save as PDF named `Firstname-Lastname-CV.pdf`.

## The skills line

Group skills and list only what you could discuss in an interview:

```
Languages: JavaScript, TypeScript, SQL, HTML, CSS
Frontend: React, Next.js, Tailwind CSS
Backend: Node.js, Express, PostgreSQL, REST APIs, Better Auth
Tools & practices: Git, GitHub Actions, Docker, Vitest, Playwright, Vercel, LLM APIs & RAG
```

## Writing bullet points that work

Each bullet should show **what you did, how, and what resulted**. A useful formula:

> **Action verb** + **what you built or did** + **with which technology** + **result or number**

Weak and strong versions:

| Weak | Strong |
|---|---|
| Made a habit tracking app. | Built a habit tracker with Next.js and PostgreSQL used daily by 12 people in my language class. |
| Worked on testing. | Wrote 60+ unit and integration tests with Vitest and Supertest, running in GitHub Actions on every pull request. |
| Used AI in a project. | Built a document Q&A app using RAG (pgvector, embeddings) that answers with citations; raised eval accuracy from 55% to 85%. |

Good action verbs: built, designed, implemented, automated, reduced, improved, migrated, tested, deployed, led, trained.

A project entry then looks like this:

```
Habit Hero · Live demo · GitHub                                    Next.js, TypeScript, PostgreSQL
- Built a full-stack habit tracker with GitHub login, per-user data and streak charts.
- Designed the database schema and wrote server-side streak logic covered by 25 unit tests.
- Deployed on Vercel with CI running type checks, tests and Playwright E2E tests on each PR.
```

## Turning previous jobs into strengths

Your past career shows skills employers want: responsibility, communication, working under pressure, understanding customers. Translate them into language a tech team values, with numbers where possible:

- Retail: "Trained 6 new staff members and wrote the shop's onboarding guide."
- Logistics: "Built an Excel tracking sheet that cut weekly reporting time from 4 hours to 1."
- Teaching: "Explained complex topics to groups of 30 and adapted material for different levels."

Any time you automated, improved or organised something, put it in.

## Tailoring for each job

Keep a master CV, then spend 10 minutes per application tailoring it:

1. Read the job ad and highlight the key technologies and skills (for example "React, TypeScript, REST APIs, testing").
2. Make sure the ones you genuinely have appear in your skills line and in project bullets, using the **same words** as the ad (ATS filters often match exact keywords).
3. Reorder projects so the most relevant one is first.
4. Adjust the summary line to the role ("frontend-focused" vs "full-stack").

Never list skills you don't have: interviews will find out.

## Common mistakes

- **Two or more pages** for a junior role. Cut it to one.
- **Responsibilities instead of results**: "Responsible for the website" says nothing about what you achieved.
- **Spelling mistakes and inconsistent formatting.** Ask someone to proofread; it's a signal of attention to detail.
- **No links**, or links that don't work. Click every link in the PDF before sending.
- **A photo, age, or marital status** where it's not expected (in many countries, including the UK and US, leave them out; check local norms).

## In short

- One page, simple single-column layout, PDF with a sensible filename.
- Projects with links come before experience when you're changing careers.
- Bullets: action verb + what + technology + result, with numbers where possible.
- Translate previous jobs into transferable skills.
- Tailor keywords and project order to each job ad.

### Exercises
- Write your master CV using the structure above. Rewrite every bullet with the action + what + technology + result formula.
- Rewrite three bullets from a previous non-tech job to show transferable skills, with a number in each.
- Get feedback from at least 2 people (for example in r/cscareerquestions, a developer Discord, or a friend who hires people) and apply it.
- Find one real job listing and make a tailored version of your CV for it. Highlight the keywords you matched.

---lesson
id: car-4
title: LinkedIn, networking and building in public
time: 2h
video: Kevin Stratvert — How to Set Up Your LinkedIn Profile (Ultimate Guide) | https://www.youtube.com/watch?v=hNzpEeU3a4I
docs: LinkedIn Help: edit your profile | https://www.linkedin.com/help/linkedin/answer/a546603
docs: LinkedIn Help: the About section | https://www.linkedin.com/help/linkedin/answer/a553140
---
Many developer jobs, especially junior ones, are filled through people: a referral, a recruiter who saw your post, someone you met at a meetup. Applying cold through job boards works, but a warm introduction is many times more likely to get you an interview. Networking for developers isn't about selling yourself; it's about being visible, helpful and genuinely curious. This lesson covers LinkedIn, building in public, and reaching out without being awkward.

## A LinkedIn profile that works

Recruiters search LinkedIn by keywords, so your profile needs the right words in the right places:

- **Photo**: friendly, clear face, plain background. The same one as on GitHub.
- **Headline**: what you do and your main technologies, not "Aspiring developer looking for opportunities". For example: `Full-stack Developer · React · Node.js · TypeScript · PostgreSQL`.
- **About**: a short story in the first person (template below).
- **Featured**: links to your portfolio and your best project.
- **Experience**: previous jobs with transferable achievements (from your CV). You can add a "Software Developer (self-directed)" entry describing your projects.
- **Projects** and **Skills**: add your 3 portfolio projects and the skills from your CV.
- **Open to work**: you can show this only to recruiters if you prefer.

An About section template:

```
I'm a full-stack developer who builds web apps with React, Next.js, Node.js and PostgreSQL.

Before moving into software, I spent 5 years in logistics, where I kept automating spreadsheets,
which is how I discovered I love building tools that save people time.

Recently I built:
• Habit Hero: a habit tracker with streaks and charts, used daily by my language class
• DocChat: an AI app that answers questions about your documents, with citations

I'm looking for a junior full-stack or frontend role where I can keep learning from a strong team.
Portfolio: sam.dev · Email: sam@example.com
```

## Building in public

**Building in public** means sharing what you're learning and building as you go. It creates a public record of your progress and makes people remember you. One post a week is plenty. Good topics:

- You finished a project: what it does, a GIF, one thing you learned.
- A bug that took you hours and how you finally fixed it.
- Something that confused you, explained simply (teaching is the best way to learn).
- A comparison: "I built the same feature with and without the Vercel AI SDK. Here's what I noticed."

A simple post template:

```
I just finished DocChat, an app that answers questions about your own documents. 📄

The hardest part wasn't the AI. It was retrieval: my first version found the wrong paragraphs
half the time. Splitting documents by headings instead of fixed sizes raised my eval score
from 55% to 85%.

Built with Next.js, PostgreSQL + pgvector and the Claude API.
Demo and code: [link]

What's the trickiest bug you've hit while learning? 👇
```

Specific beats generic: a real number and a real lesson are more interesting than "Excited to share my new project!". Also **comment thoughtfully** on other developers' posts: a useful comment is often seen by more people than your own posts.

## Communities and events

- Join 2–3 online communities (for example the freeCodeCamp forum, a Discord for a framework you use, or a local tech community's Slack). Introduce yourself, answer beginner questions you can answer, and share your projects when it fits.
- Go to local meetups or online events. You don't need to network aggressively: listen to the talk, ask one question, talk to one or two people. Add them on LinkedIn afterwards with a short note.
- Consider small open-source contributions: documentation fixes and "good first issue" labels are a good start.

## Reaching out without being awkward

Never message a stranger with "Can you get me a job?". Ask a specific, small question that's easy to answer and shows you did your homework:

```
Hi Ana, I saw your talk on testing React apps at the JS meetup last week. The part about
testing behaviour instead of implementation changed how I write my tests. I'm a junior developer
applying to companies like Acme. Could I ask you two quick questions about how your team
onboards juniors? A 15-minute call or a short reply here would be great. Thanks either way!
```

It's personal (mentions something real), short, specific, and easy to say yes to. Many people will ignore you; some will help a lot. Follow up once after a week, then let it go. When someone helps you, thank them and later tell them what happened.

## Common mistakes

- **"Aspiring developer" or "Looking for opportunities" as a headline.** Say what you *do*.
- **Only posting when you need a job.** The network is built by showing up regularly, months in advance.
- **Copy-paste connection requests** with no personal note.
- **Asking for a referral in the first message.** Build a little relationship first; referrals come naturally.

## In short

- LinkedIn: clear photo, keyword headline, a short story in About, projects featured.
- Build in public: one specific post a week about what you built or learned.
- Join communities and meetups; be helpful and curious.
- Reach out with short, personal, specific questions, never "get me a job".

### Exercises
- Update your LinkedIn: photo, keyword headline, About section using the template, featured portfolio and 3 projects.
- Write and publish a post about a project you finished, using the template (with a GIF and one real lesson learned).
- Join 2 developer communities, introduce yourself, and answer one question from someone else.
- Attend one meetup or online event and send one personal connection request to someone you met or heard speak.

---project
id: car-p2
title: Job-ready checklist
summary: Not code: everything in place so you can start applying with confidence.
---
### The task
This project has no code. It's the checklist that says you're ready to apply for jobs, using everything from this section. Work through it a little each week, starting around the Express module, so that by the time you finish the curriculum, your projects, portfolio, CV and LinkedIn are already done and you've practised applying. Applying while you're still learning is fine: every application and interview is practice.

### What it must do
- A portfolio site live on a custom or clean URL, with your 3 best projects and a working contact link
- 3 polished projects, each with a live demo (and demo login), a README with screenshot, and passing CI
- A GitHub profile with photo, bio, profile README and 6 pinned repositories with descriptions
- A one-page CV reviewed by at least 2 people, plus one tailored version for a real job
- A LinkedIn profile with keyword headline, About section, featured projects, and at least 3 posts about your work
- An application tracker set up, and your first 10 tailored applications sent

### Steps
1. **Block the time.** Put 2 hours a week for career tasks in your calendar (for example Saturday morning) and keep a simple `career.md` checklist in a repo or notes app with every item from "What it must do".
2. **Projects.** Choose your 3 projects with the scoring exercise from Lesson car-1 and polish one per week with the checklist. Each ends with a live demo, a README and a green CI badge.
3. **Portfolio and GitHub.** Update your Next.js portfolio with the 3 project cards and contact details, deploy it, and set up your GitHub profile README and pinned repos.
4. **CV.** Write your master CV, get feedback from 2 people, apply it, and save it as a PDF with a sensible filename. Click every link in the PDF.
5. **LinkedIn.** Update your profile and publish your first post about a finished project. Schedule the next 2 posts (one per week).
6. **Tracker and first applications.** Set up the tracker from Lesson car-5 and send 10 tailored applications (tailored CV, short personal note), at most 3–4 per week so each one gets proper attention.
7. **Review.** After 10 applications, look at the tracker: which ones got replies, and what did they have in common? Adjust your CV, targeting or portfolio, and write 3 bullet points about what you'll change.

### Hints
- Don't wait until you "know enough". You will never feel completely ready; most people applying for junior roles don't either.
- Ask for feedback early, when changes are cheap: a rough CV reviewed now beats a perfect one nobody has seen.
- Use the same name, photo and one-line description everywhere.
- Silence is normal. A 5–10% reply rate on cold applications is common for juniors; referrals do much better.

### Stretch goals
- Get a referral or warm introduction for at least one application.
- Write a case study page for your strongest project.
- Record a 2-minute video walkthrough of one project and add it to the README.

### Done when
- Portfolio live on a clean URL with 3 projects and a working contact link
- 3 polished projects, each with a live demo, README with screenshot and passing CI
- GitHub profile README written and 6 repositories pinned
- CV reviewed by at least 2 people and one tailored version created
- LinkedIn updated with headline, About, projects and at least 3 posts
- Application tracker set up and 10 tailored applications sent

---section
id: career-s2
title: Job search and interviews
intro: Run your job search like a project, then prepare for the three kinds of interviews you'll meet: coding challenges, behavioural questions and take-home tasks. You'll finish with a six-week interview practice plan.
---

---lesson
id: car-5
title: Job search strategy
time: 2h
video: Maddy Zhang — How to (Actually) Get a Software Engineering Job | https://www.youtube.com/watch?v=Egr6BiXpHQc
docs: Tech Interview Handbook | https://www.techinterviewhandbook.org/
---
Finding your first developer job is often the hardest part of the whole journey, and it's rarely quick: for self-taught juniors, three to six months of steady searching is normal. The people who succeed aren't always the most skilled; they're the ones who treat the search like a project, with a plan, a tracker, a weekly routine and regular reviews. This lesson gives you that system.

## Where junior jobs are

Cast a wide net. Good entry points include:

- **Junior and graduate roles** on job boards (LinkedIn Jobs, Indeed, local job sites) and company career pages.
- **Internships and apprenticeships**, including paid ones for career changers.
- **Agencies and consultancies** that build websites and apps for clients: they often hire juniors and you learn fast.
- **Startups**, which care more about what you can build than about degrees.
- **Your current or previous industry**: a company in logistics, healthcare or retail values a developer who understands its business.
- **Freelance or small paid projects** for local businesses: real experience for your CV while you search.
- **Roles next to development**: QA/test automation, technical support, solutions engineering. Many people move into development from these.

## Reading a job ad

Job ads are wish lists. If you match about **60% of the requirements** and the core technologies, apply. Read the ad in three parts:

- **Must-haves**: the main stack (for example React and TypeScript). You need most of these.
- **Nice-to-haves**: "experience with AWS, GraphQL, Kubernetes". Not required, despite how they sound.
- **Signals**: "3+ years" in a junior ad is often flexible; "senior" or "lead" in the title usually isn't.

Look for patterns. If 8 out of 10 ads in your area ask for something you don't have (for example GraphQL), that's a sign to learn it next.

## The application tracker

Track every application in a spreadsheet (or a Notion table, or a small app you build yourself):

| Company | Role | Link | Date applied | Source | Contact | Status | Next step | Notes |
|---|---|---|---|---|---|---|---|---|
| Acme | Junior Full-stack Dev | … | 03 Mar | Referral (Ana) | ana@… | Interview 1 | Prep take-home by 10 Mar | Uses Next.js + Postgres |
| Bolt Agency | Frontend Developer | … | 04 Mar | LinkedIn | — | Applied | Follow up 14 Mar | Asked for portfolio |

Useful status values: `To apply`, `Applied`, `Followed up`, `Interview`, `Take-home`, `Offer`, `Rejected`, `No reply`. The tracker lets you follow up on time, prepare for interviews with your notes, and later see what works.

## Quality over quantity

Sending 200 identical applications gets very few replies. A **tailored** application takes 20–30 minutes:

1. Tailor your CV keywords and project order (Lesson car-3).
2. Write a short, specific note. Many applications don't need a long cover letter, but a few personal sentences help:

```
Hi! I'm applying for the Junior Full-stack Developer role. I noticed you build booking software
for small clinics. I recently built a similar scheduling feature in my habit tracker (Next.js,
PostgreSQL), and before coding I worked 5 years in healthcare admin, so I know the problems
receptionists face. Portfolio: sam.dev. I'd love to talk!
```

3. Look for a **warm route** in: someone you know at the company, an alumni of your course, or a developer there you could message (Lesson car-4). A referral can make an interview several times more likely.

## A weekly routine

Consistency beats intensity. A sustainable week might be:

- 5–10 tailored applications
- 2 networking actions (a meetup, a comment, a personal message)
- 1 LinkedIn post
- Interview practice (Lessons car-6 and car-7)
- Continued building: a new feature or project keeps your skills and your GitHub active

## Following up and handling rejection

If you hear nothing after about a week, one short, polite follow-up is fine. After an interview, send a thank-you message the same day. If you're rejected after an interview, ask politely for feedback: many companies won't give it, but some will, and it's gold.

Rejection and silence are normal for everyone, including experienced developers. Measure what you control (applications sent, follow-ups, practice hours), not just offers.

## Review your funnel every few weeks

Your tracker shows a funnel: applications → replies → interviews → offers. Each stage points to a different fix:

- **Few replies**: improve the CV, portfolio and targeting; get more referrals.
- **Replies but no second interviews**: practise interviewing.
- **Fail at take-homes or technical rounds**: more coding practice, better READMEs and tests.

## Common mistakes

- **Waiting until you feel ready.** Start applying while you learn; early interviews are valuable practice.
- **Only applying to "perfect match" roles.** At 60% you should apply.
- **No tracking**, so you forget follow-ups and can't learn from results.
- **Mass-applying with the same CV.** A few tailored applications beat many generic ones.

## In short

- Look broadly: junior roles, internships, agencies, startups, your previous industry, freelancing.
- Apply when you match about 60% and the core stack.
- Track every application and review your funnel every few weeks.
- Tailor each application and look for warm introductions.
- Keep a sustainable weekly routine and measure what you control.

### Exercises
- Set up your application tracker with the columns above.
- Find 10 junior roles in your area or remote, add them to the tracker, and list the skills that appear in at least half of them. Mark the ones you don't have yet.
- Write 3 short tailored application notes for 3 of those roles.
- Plan your weekly job-search routine and put it in your calendar for the next 4 weeks.

---lesson
id: car-6
title: Technical interviews: coding challenges
time: ongoing
video: NeetCode — Top 6 Coding Interview Concepts (Data Structures & Algorithms) | https://www.youtube.com/watch?v=ft0owvS5tQA
docs: NeetCode roadmap | https://neetcode.io/roadmap
docs: Tech Interview Handbook | https://www.techinterviewhandbook.org/
docs: LeetCode | https://leetcode.com/
docs: Big-O Cheat Sheet | https://www.bigocheatsheet.com/
---
Many companies include a coding challenge: solve a small problem live with an interviewer, or in a timed online test. It can feel unrelated to building web apps, but it's a skill you can learn like any other, and it's mostly about recognising a handful of patterns and explaining your thinking clearly. Junior interviews usually stay at the "easy to medium" level, so steady practice over a few months is enough.

## What interviewers are looking for

Getting the perfect answer matters less than you think. Interviewers check whether you:

- **Understand the problem** and ask clarifying questions.
- **Communicate**: explain your approach before and while coding.
- **Get to a working solution**, even a simple one first.
- **Test** your code with examples and edge cases.
- **Know the cost** of your solution (Big-O).

A candidate who explains a simple solution clearly often beats one who silently writes a clever one.

## Big-O in five minutes

**Big-O** describes how the running time (or memory) grows as the input grows. You need these:

| Big-O | Name | Example |
|---|---|---|
| O(1) | constant | read `arr[5]`, `map.get(key)` |
| O(log n) | logarithmic | binary search in a sorted array |
| O(n) | linear | one loop over the array |
| O(n log n) | | sorting with `arr.sort()` |
| O(n²) | quadratic | a loop inside a loop over the same array |

The most common interview improvement is turning an O(n²) nested loop into O(n) with a **hash map** (`Map` or `Set` in JavaScript).

## The patterns that cover most easy/medium problems

**1. Hash maps**: remember what you've seen, for O(1) lookups.

```js
// Two Sum: return the indexes of two numbers that add up to target.
function twoSum(nums, target) {
  const seen = new Map(); // value -> index
  for (let i = 0; i < nums.length; i++) {
    const needed = target - nums[i];
    if (seen.has(needed)) return [seen.get(needed), i];
    seen.set(nums[i], i);
  }
  return null;
}

console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
```

The brute-force version checks every pair (O(n²)). Here, for each number we ask "have I already seen the number that completes it?" in O(1), so the whole thing is O(n) time and O(n) memory.

**2. Two pointers**: on sorted arrays or strings, move one pointer from each end.

```js
function isPalindrome(s) {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, "");
  let left = 0, right = clean.length - 1;
  while (left < right) {
    if (clean[left] !== clean[right]) return false;
    left++;
    right--;
  }
  return true;
}
```

**3. Sliding window**: for "longest/shortest substring or subarray that…" problems, grow the window on the right and shrink it from the left when it becomes invalid.

```js
// Length of the longest substring without repeating characters
function longestUnique(s) {
  const inWindow = new Set();
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    while (inWindow.has(s[right])) {
      inWindow.delete(s[left]);
      left++;
    }
    inWindow.add(s[right]);
    best = Math.max(best, right - left + 1);
  }
  return best;
}

console.log(longestUnique("abcabcbb")); // 3 ("abc")
```

**4. Stacks and queues**: a stack (array with `push`/`pop`) for matching brackets, undo, or "most recent" problems; a queue for processing in order.

**5. Trees and graphs (BFS/DFS)**: depth-first search uses recursion (or a stack); breadth-first search uses a queue and visits level by level.

```js
// Breadth-first search: values of a binary tree, level by level
function levelOrder(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];
  while (queue.length) {
    const levelSize = queue.length;
    const level = [];
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}
```

Interview bonus: `queue.shift()` is O(n), because every remaining element moves one place forward. For big inputs, keep a head index instead and never remove items: `let head = 0;` and `const node = queue[head++];`, with `while (head < queue.length)` as the loop condition (count `levelSize` as `queue.length - head`). Mentioning this shows you know the cost of the methods you use.

## A process for every problem

Use the same steps every time, out loud, in practice and in interviews:

1. **Understand**: repeat the problem in your own words. Ask about input size, empty input, duplicates, negative numbers.
2. **Examples**: work through one normal example and one edge case by hand.
3. **Approach**: describe a brute-force solution and its Big-O, then look for a better one (which pattern fits?).
4. **Code**: write clean code with good names, explaining as you go.
5. **Test**: run through your examples line by line; fix bugs calmly.
6. **Analyse**: state the time and space complexity.

If you're stuck, say what you're thinking ("I'm wondering whether a hash map could avoid the nested loop"): interviewers often give hints, and they can only help if they hear you.

## How to practise

- Follow a structured list (NeetCode's roadmap or the Tech Interview Handbook) instead of random problems, starting with arrays and hash maps.
- Give each problem 25–30 minutes. If stuck, read the solution, understand it, and solve it again yourself two days later.
- Write a short note per problem: the pattern, the key insight, and your mistake. You'll do this systematically in the interview practice plan project.
- Practise **talking out loud**: record yourself, or do mock interviews with a friend or on a mock-interview platform such as Pramp.

## Common mistakes

- **Coding immediately** without clarifying or planning. Spend the first few minutes understanding.
- **Silence.** The interviewer can't give credit for thinking they can't hear.
- **Grinding hundreds of random problems** without reviewing patterns. 50 problems understood deeply beat 300 skimmed.
- **Never testing edge cases**: empty arrays, one element, duplicates.

## In short

- Interviewers judge communication, a working solution, testing and Big-O, not just the answer.
- Most easy/medium problems use hash maps, two pointers, sliding window, stacks/queues or BFS/DFS.
- Follow the same process every time: understand, examples, approach, code, test, analyse.
- Practise consistently with a structured list, notes and mock interviews.

### Exercises
- Solve Two Sum twice: first with a nested loop, then with a `Map`. Write the Big-O of each in a comment.
- Solve 2 easy problems a week from the arrays & hash maps section of a structured list (NeetCode or the Tech Interview Handbook), writing notes for each.
- Record yourself solving one problem out loud using the 6-step process. Watch it back and note one thing to improve.
- Do one mock interview on Pramp or with a friend, then write down what went well and what didn't.

---lesson
id: car-7
title: Behavioural interviews and take-home tasks
time: 2h
video: Aced (Exponent) — Top 10 Behavioral Software Engineering Interview Questions | https://www.youtube.com/watch?v=T25I2FQ9Mok
docs: Tech Interview Handbook: behavioural | https://www.techinterviewhandbook.org/behavioral-interview/
---
Technical skill gets you considered; people skills get you hired. Most interview processes include a **behavioural interview** ("Tell me about a time when…") to see how you work with others, handle problems and learn. Many also include a **take-home task**: a small project to build in a few hours or days. Both are very learnable with preparation, and as a career changer you have more good stories than you think.

## Behavioural questions and the STAR method

Behavioural questions assume past behaviour predicts future behaviour. Answer them with **STAR**:

- **Situation**: the context, in one or two sentences.
- **Task**: what you needed to achieve or solve.
- **Action**: what *you* did, step by step. This is the longest part. Say "I", not "we".
- **Result**: what happened, ideally with a number, plus what you learned.

An example for "Tell me about a difficult bug you solved":

> **Situation:** In my document Q&A app, about half the answers were wrong even though the documents contained the information.
> **Task:** I needed to find out whether the problem was the prompt or the search, and fix it.
> **Action:** I wrote an eval script with 20 questions and logged which chunks were retrieved for each. I saw that the right paragraph often wasn't in the top 5, because my chunks split sections in the middle. I changed the chunking to split by headings and added the heading text to each chunk, rerunning the eval after each change.
> **Result:** Accuracy went from 55% to 85%. I learned to measure before changing things, and I now write evals before tuning any AI feature.

Two minutes, specific, technical enough to be credible, and ending with a lesson.

## Build a story bank

Prepare 6 stories you can adapt to many questions. Draw from your projects, previous jobs, studies and volunteering:

1. A difficult technical problem you solved
2. Learning something new quickly
3. A mistake or failure, and what you changed afterwards
4. A disagreement or conflict, and how you handled it
5. Helping someone or working in a team
6. Something you're proud of / going beyond what was asked

Common questions these cover: "Tell me about yourself", "Why do you want to be a developer?", "Why this company?", "Tell me about a time you failed", "How do you handle feedback?", "How do you learn new technologies?".

For **"Tell me about yourself"**, prepare a 60–90 second answer: present (what you do now), past (your background and why you switched), future (why this role). Practise it until it sounds natural, not memorised.

## Honesty and "I don't know"

You will be asked things you don't know. Say so, then show how you'd find out: "I haven't used Redis in a project yet. I understand it's a fast in-memory data store that's often used for caching, and I'd start with the official getting-started guide and add caching to my Books API to learn it." This is a good answer: honest, shows basic understanding and a plan.

## Questions to ask them

At the end you'll be asked "Do you have any questions?". Always have 3–4 ready; it shows real interest:

- "What would a successful first three months look like in this role?"
- "How do juniors get support: pair programming, code reviews, mentoring?"
- "What does the team's development process look like, from ticket to production?"
- "What's the biggest challenge the team is facing right now?"

Research the company first: its product, its customers, its tech stack (job ads and engineering blogs reveal a lot).

## Take-home tasks

A take-home is usually a small app or API with a time limit (for example "spend no more than 4 hours"). It's your chance to show how you work when no one is watching. How to approach it:

1. **Read the brief twice.** List every requirement and question. If something is unclear, email them and ask, or write down your assumption.
2. **Plan before coding.** Sketch the data model and the components or endpoints. Decide what's essential and what's a bonus.
3. **Set up properly.** A fresh repo, TypeScript if appropriate, linting, a test runner. Commit early and often with clear messages; reviewers read the history.
4. **Build the core first.** A small, complete, working solution beats a big unfinished one.
5. **Test the important logic** and the main flow.
6. **Write a great README**: how to run it, what you built, decisions and trade-offs, what you'd do with more time, and how long you spent.

A README section like this impresses reviewers:

```markdown
## Decisions and trade-offs
- Stored data in SQLite to keep setup to one command; in production I'd use PostgreSQL.
- Validated all input with Zod; invalid requests return 400 with field errors.
- Skipped authentication as the brief didn't require it.

## With more time I would
- Add pagination to GET /tasks
- Add E2E tests for the edit flow
```

Respect the time limit: spending 20 hours on a 4-hour task often shows in the result and isn't sustainable. In the follow-up interview, expect to explain your code and extend it live.

## Common mistakes

- **Vague, general answers** ("I'm a team player") instead of a specific story.
- **"We did…" all the time.** They're hiring you: say what *you* did.
- **Badmouthing a previous employer or colleague.** Stay factual and focus on what you learned.
- **Take-homes without a README or tests**, or that don't run from a fresh clone.

## In short

- Answer behavioural questions with STAR: Situation, Task, Action (most of the time), Result.
- Prepare 6 stories and a 60–90 second "tell me about yourself".
- Be honest about what you don't know, and explain how you'd learn it.
- Ask thoughtful questions; research the company.
- Take-homes: read carefully, build the core first, test, commit often, explain decisions in the README.

### Exercises
- Write 6 STAR stories from your learning journey and past jobs, one for each category in the story bank. Keep each under 2 minutes when spoken.
- Write and practise your "tell me about yourself" answer out loud until it takes 60–90 seconds.
- Write 4 questions you'd ask an interviewer, then research one real company and adapt them to it.
- Do a practice take-home: build a small API + UI (for example a recipe box) in 4 hours with tests and a README that explains your decisions.

---project
id: car-p3
title: Interview practice plan
summary: A six-week plan: 30 coding problems with explanations, 6 STAR stories, 2 mock interviews and a timed take-home.
---
### The task
Interview skills improve with structured practice, not with last-minute cramming. In this project you follow a six-week plan that prepares you for all three interview types from this section: coding challenges, behavioural questions and take-home tasks. Everything goes into a public GitHub repository, which becomes evidence of your problem-solving and a revision guide you can reread before every real interview.

### What it must do
- A repo `interview-practice` with one folder per problem, for example `problems/01-two-sum/`, containing `solution.js` and a `solution.test.js` (Vitest), or `solution.ts` and `solution.test.ts` if you prefer TypeScript, and a `README.md` with the problem link, your approach, the pattern used, time and space complexity, and the mistake you made
- 30 easy/medium problems in this order: arrays and hash maps → two pointers and sliding window → stacks and queues → trees and BFS/DFS
- A root `README.md` with a progress table: number, problem, pattern, difficulty, date, solved alone (yes / with hints)
- 6 written STAR stories in `stories.md`, one per story-bank category from Lesson car-7
- 2 mock interviews (on Pramp, another mock-interview platform, or with a developer friend), each followed by a written reflection in `mocks/`
- 1 timed take-home: a small API + UI built in 4 hours, with tests and a README explaining decisions, in its own repo linked from this one

### Steps
1. **Set up (before week 1).** Create the repo with Vitest, the folder structure, a problem `README.md` template, and the progress table. Choose a structured problem list (NeetCode roadmap or the Tech Interview Handbook) and pick your 30 problems in advance.
2. **Week 1: arrays and hash maps (6 problems).** For example Two Sum, Contains Duplicate, Valid Anagram, Group Anagrams. Use the 6-step process from Lesson car-6, out loud. Write the first 2 STAR stories.
3. **Week 2: arrays and hash maps continued + two pointers (5 problems).** For example Top K Frequent Elements, Valid Palindrome, Two Sum II (sorted input). Write STAR stories 3 and 4. Re-solve one week-1 problem from memory.
4. **Week 3: sliding window (5 problems) + mock interview 1.** For example Best Time to Buy and Sell Stock, Longest Substring Without Repeating Characters. Write STAR stories 5 and 6. Do your first mock interview at the end of the week and write the reflection the same day.
5. **Week 4: stacks and queues (5 problems) + the take-home.** For example Valid Parentheses, Min Stack, Implement Queue using Stacks. At the weekend, do the timed take-home: choose a brief (or ask a friend to write one), set a 4-hour timer, and build it with tests and a README.
6. **Week 5: trees with DFS (5 problems).** For example Maximum Depth of Binary Tree, Invert Binary Tree, Same Tree. Review the take-home with fresh eyes and write a short "what I'd change" note in its README.
7. **Week 6: BFS on trees and grids (4 problems) + mock interview 2.** For example Binary Tree Level Order Traversal, Number of Islands. Do the second mock, write the reflection, and compare it with the first.
8. **Wrap up.** Update the root README with a summary: problems solved alone vs with hints, the patterns you're strongest and weakest at, and your plan for the next six weeks.

### Hints
- 5 problems a week is about 30–45 minutes on most days. Consistency matters more than long weekend sessions.
- If you're stuck after 25–30 minutes, read a solution, understand it, close it, and write it yourself. Mark it "with hints" and re-solve it a week later.
- The tests make your solutions trustworthy and give you Vitest practice: include at least one edge case per problem (empty input, one element, duplicates).
- In each mock reflection, answer: Did I clarify the problem? Did I talk through my approach before coding? Did I test? What will I do differently next time?
- Read each STAR story out loud and time it; aim for under 2 minutes.

### Stretch goals
- Add 10 more problems from the weakest pattern in your summary.
- Do a third mock interview where *you* are the interviewer for someone else; you'll learn a lot from the other side.
- Write a blog or LinkedIn post about one pattern (for example sliding window) explained simply.

### Done when
- 30 problems solved, each with a solution, passing Vitest tests and a README explaining approach and complexity
- The progress table is complete and the problems follow the pattern order
- 6 STAR stories are written in `stories.md`
- 2 mock interviews are done, each with a written reflection
- The 4-hour take-home is in its own repo with tests and a README explaining decisions
- The root README has a final summary with strengths, weaknesses and next steps

---section
id: career-s3
title: Capstone
intro: Your signature project: your own idea, built for real users, combining everything from the whole curriculum. It becomes the centrepiece of your portfolio and your best source of interview stories.
---

---project
id: car-p1
title: Capstone project
summary: Your own idea solving a real problem for real people, built end to end with everything you've learned.
---
### The task
Build your signature project: your own idea, ideally solving a real problem for real people you know (a sports club, a family business, a teacher, a group of friends). It combines everything from this curriculum: a typed full-stack app with a database, authentication, tests, CI, good design and an AI feature where it genuinely helps. Because you design it yourself and put it in front of real users, it gives you the best interview stories you'll have: decisions, trade-offs, feedback and problems you solved.

### What it must do
- A one-page spec written **before** coding: the problem, the users, max 5 core features for version 1, and an explicit "out of scope" list
- Stack: Next.js (or React + Express), TypeScript, PostgreSQL, authentication, and at least one AI feature that solves a real part of the problem (for example summarising, searching documents, classifying, or a helpful assistant), with evals
- Work tracked in GitHub Issues; features built in branches and merged through pull requests with a short description
- Unit tests for core logic, at least one end-to-end test of the main flow, and CI running type checks, lint and tests on every pull request
- Deployed, with at least 3 real users who have given feedback
- A case-study page on your portfolio: problem, solution, architecture diagram, challenges, what you'd do next

### Steps
1. **Find a real problem.** Talk to 5 people about repetitive, annoying tasks in their work, club or hobby. Pick one problem that a small web app could solve and where at least one person would really use it.
2. **Write the spec and sketch the screens.** One page: problem, users, 5 core features, out of scope. Sketch the main screens on paper or in Figma and show them to your future user. Adjust before writing code.
3. **Set up everything on day one.** Create the repo, a Next.js + TypeScript app, the database connection, CI (type check, lint, test), and deploy an empty "hello" version. Create a GitHub Issue for each feature in the spec.
4. **Data model and authentication.** Design the tables, write migrations and a seed script, and add login. Users only see their own (or their organisation's) data, with a test that proves it.
5. **Build the smallest useful version.** Implement the core features one issue and one pull request at a time. Aim to have something your users can try within 1–2 weeks, even if it's plain.
6. **Put it in front of users.** Give access to at least 3 people, watch one of them use it without helping, and collect feedback in Issues. Fix the most important problems first.
7. **Add the AI feature, with evals.** Choose the AI feature that helps your users most, build it with the techniques from the AI module (server-side keys, streaming or validation, limits), and write an eval set of at least 10 cases.
8. **Polish, test and write the case study.** Add the E2E test for the main flow, handle empty and error states, check accessibility and mobile, then write the case study page with an architecture diagram and add the project to your portfolio and CV.

### Hints
- Scope is the enemy: a finished small app with real users beats an unfinished big one. Move every "nice idea" to the out-of-scope list or a later Issue.
- Keep a `decisions.md` log of choices, problems and fixes as you go; it becomes your case study and your STAR stories.
- Don't add AI for its own sake. The best AI feature removes a real chore for your users; ask them what takes the most time.
- Deploying on day one means you never have a scary "deploy at the end" moment, and you find environment problems early.
- If you can't find users, build for yourself and a group of fellow learners, but still collect feedback from at least 3 people.

### Stretch goals
- An accessibility audit with fixes (axe DevTools or Lighthouse) documented in the README.
- Error tracking and monitoring (for example the Sentry free tier).
- A short demo video on the case-study page.
- Write a technical blog post about the hardest problem you solved.

### Done when
- The written spec and out-of-scope list exist in the repo and were written before coding started
- Features were built through GitHub Issues and pull requests, and CI runs type checks, lint and tests on every pull request
- Core logic has unit tests and the main flow has an E2E test
- The AI feature works with server-side keys, usage limits and an eval set of at least 10 cases
- The app is deployed and at least 3 real users have used it and given feedback
- A case-study page with an architecture diagram is live on your portfolio
- `.env.example` lists every environment variable with placeholder values, and `.env` is git-ignored

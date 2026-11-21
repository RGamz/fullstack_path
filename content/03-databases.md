---module
id: db
title: Databases
scrimba: Databases
weeks: 3–4 weeks
fullCourse: freeCodeCamp SQL tutorial full database course for beginners
intro: Store data properly. You'll learn SQL (the most valuable data skill you can have), design relational schemas, and connect your Express apps to SQLite and PostgreSQL, so your data survives restarts and many users can work with it safely at the same time.
---

---section
id: db-s1
title: Writing SQL queries
intro: Learn what a database is and how to talk to one in SQL: reading, filtering, sorting, creating tables, changing data and summarising it. You'll finish with a SQL practice set that you keep on GitHub.
---

---lesson
id: db-1
title: What is a database?
time: 1h
video: Fireship SQL explained in 100 seconds
docs: PostgreSQL tutorial | https://www.postgresqltutorial.com/
docs: SQLite: appropriate uses | https://www.sqlite.org/whentouse.html
docs: DB Browser for SQLite | https://sqlitebrowser.org/
---
So far your apps have kept data in two places: in a JavaScript array (gone as soon as the server restarts) or in a JSON file (survives restarts, but the whole file is read and rewritten on every change). That works for one person on one laptop. It breaks down as soon as you have real users: two requests saving at the same moment can overwrite each other, finding one record means loading everything, and nothing stops a bug from saving a book without a title. A **database** is software built to solve exactly these problems, and almost every backend you will ever work on has one.

## What a database does for you

A database (more precisely, a *database management system*) stores data on disk and gives you a language to read and change it. Compared with a JSON file, it gives you:

- **Persistence**: data survives restarts and crashes.
- **Safe concurrent access**: many users can read and write at the same time without corrupting anything.
- **Fast lookups**: it can find one row among millions without reading them all.
- **Rules**: you can declare that every book must have a title, or that an email can only be used once, and the database refuses data that breaks those rules.

## Tables, rows and columns

A **relational database** stores data in **tables**. A table looks like a spreadsheet with strict rules: every **column** has a name and a type, and every **row** is one record.

| id | title | year | author_id |
|---|---|---|---|
| 1 | Dune | 1965 | 1 |
| 2 | The Martian | 2011 | 2 |
| 3 | Project Hail Mary | 2021 | 2 |

Unlike a spreadsheet, you can't put a word in the `year` column of one row and a number in another, and each table holds one kind of thing only: books here, authors in a separate table.

## Keys: how rows point to each other

- A **primary key** is a column that uniquely identifies each row, usually a number called `id`. No two books can have `id` 2, and a row's id never changes.
- A **foreign key** is a column that stores the primary key of a row in *another* table. Above, `author_id` says "this book was written by the author whose id is 2".

Here is the `authors` table those ids point to:

| id | name |
|---|---|
| 1 | Frank Herbert |
| 2 | Andy Weir |

Andy Weir's name is stored once, and both of his books point to him. If you fix a typo in his name, you fix it in one place. These links between tables are the "relations" in "relational database".

## SQL: asking for data

You talk to a relational database in **SQL** (Structured Query Language, pronounced "S-Q-L" or "sequel"). SQL is **declarative**: you describe the result you want, and the database works out how to get it.

```sql
SELECT title, year
FROM books
WHERE year > 2000
ORDER BY year;
```

| title | year |
|---|---|
| The Martian | 2011 |
| Project Hail Mary | 2021 |

Read it almost like English: "select the title and year from books where the year is after 2000, ordered by year". You never write a loop. The same SQL works, with small differences, in every relational database, which is why SQL is one of the most valuable and long-lasting skills in tech.

## SQLite and PostgreSQL

You'll use two relational databases in this module:

| | SQLite | PostgreSQL |
|---|---|---|
| Where it runs | Inside your program; the data is one file | A separate server program you connect to |
| Setup | None: Node 24 has it built in | Install it locally or use a free host (Neon, Supabase) |
| Good for | Learning, prototypes, small apps, tests | Production web apps with many users |

The SQL you learn works in both. You'll start with SQLite because there's nothing to set up, and move to PostgreSQL in the last section of this module.

There are also **document databases** like MongoDB, which store JSON-like documents instead of tables. They're covered in an optional lesson at the end. For most web apps, a relational database is the right default.

## Transactions and ACID

Databases also let you group several changes into a **transaction**: either all of them happen, or none of them do. Think of moving money: taking 50 from one account and adding 50 to another must never stop halfway. The guarantees behind this are called **ACID** (Atomic, Consistent, Isolated, Durable). You'll use transactions in section 2; for now, just know that this safety is a big reason we use databases.

## Your SQL playground

For the first lessons you only need a place to type SQL:

- **DB Browser for SQLite** (a free desktop app): click *New Database*, save a file like `playground.db`, then type SQL in the *Execute SQL* tab and press the run button.
- **sqliteonline.com**: SQLite in the browser, nothing to install. Good for quick tests, but keep a copy of your queries in a file.

Try your first statement. It doesn't even need a table:

```sql
SELECT 'Hello, database!' AS greeting, 6 * 7 AS answer;
```

| greeting | answer |
|---|---|
| Hello, database! | 42 |

`AS` gives a column in the result a name. Text values go in single quotes.

## Common mistakes

- **Treating a table like a spreadsheet.** Don't put several values in one cell (`'sci-fi, classic'`) or mix different kinds of things in one table. You'll learn the proper way in the schema design lesson.
- **Giving ids a meaning.** An id is just a label. Don't reuse ids, and don't expect them to have no gaps after rows are deleted.
- **Choosing a database by hype.** "MongoDB has no schema, so it's easier" sounds attractive, but usually it means the rules move into your code, where they are easier to forget. Start relational.

## In short

- A database stores data persistently, safely for many users, with fast lookups and rules.
- Relational databases store rows in tables; primary keys identify rows, foreign keys link tables.
- SQL is declarative: you describe the result, the database finds it.
- SQLite is a file inside your app; PostgreSQL is a server used in production. The SQL is almost the same.

### Exercises
- Install DB Browser for SQLite (or open sqliteonline.com), create `playground.db` and run `SELECT 'Hello, database!' AS greeting, 6 * 7 AS answer;`.
- Sketch (on paper) tables for a library: books, authors, members and loans. Write the columns of each table and mark the primary keys and foreign keys. Which table connects members to books?
- Write 3–5 sentences comparing the JSON file from your Express projects with a database. Describe one concrete thing that could go wrong with the file if 100 people used your API at the same time.
- Pick an app you use every day (a music app, a shop, a chat app). List three tables it probably has and how they link to each other.

---lesson
id: db-2
title: SQL basics: SELECT, WHERE, ORDER BY
time: 2h
video: Programming with Mosh SQL tutorial for beginners
docs: SQLBolt interactive lessons | https://sqlbolt.com/
docs: SQLZoo | https://sqlzoo.net/
---
Reading data is what your backend will do most of the time: "show this user's orders", "find books about space", "give me page 3 of the results". In SQL, all of that is one statement: `SELECT`. This lesson covers the parts of `SELECT` you'll use every day. Learn them well; everything else builds on them.

## Set up a practice table

Open your playground database and run this script. You'll learn exactly how `CREATE TABLE` and `INSERT` work in the next lesson; for now, just run it.

```sql
CREATE TABLE books (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  year INTEGER,
  genre TEXT,
  pages INTEGER,
  rating REAL
);

INSERT INTO books (title, author, year, genre, pages, rating) VALUES
  ('Dune', 'Frank Herbert', 1965, 'sci-fi', 412, 4.3),
  ('The Hobbit', 'J.R.R. Tolkien', 1937, 'fantasy', 310, 4.2),
  ('Project Hail Mary', 'Andy Weir', 2021, 'sci-fi', 476, 4.5),
  ('The Martian', 'Andy Weir', 2011, 'sci-fi', 369, 4.4),
  ('Pride and Prejudice', 'Jane Austen', 1813, 'classic', 279, 4.1),
  ('Educated', 'Tara Westover', 2018, 'memoir', 334, 4.0),
  ('The Name of the Wind', 'Patrick Rothfuss', 2007, 'fantasy', 662, 4.6),
  ('Untitled Draft', 'Anna Smith', NULL, NULL, 120, NULL);
```

`NULL` means "no value / unknown". The last book has no year, genre or rating yet.

## SELECT and FROM

`SELECT` lists the columns you want; `FROM` names the table. `*` means "all columns".

```sql
SELECT * FROM books;
SELECT title, author FROM books;
SELECT title, 2026 - year AS age FROM books;
```

The third query shows that you can compute new columns. `AS age` names the computed column. For `Untitled Draft`, `age` is `NULL`: any calculation with `NULL` gives `NULL`.

## WHERE: filtering rows

`WHERE` keeps only the rows for which a condition is true. Compare with `=`, `<>` (not equal, `!=` also works), `<`, `>`, `<=` and `>=`, and combine conditions with `AND`, `OR` and `NOT`:

```sql
SELECT title, pages
FROM books
WHERE genre = 'sci-fi' AND pages < 450;
```

| title | pages |
|---|---|
| Dune | 412 |
| The Martian | 369 |

When you mix `AND` and `OR`, use parentheses. `AND` is evaluated before `OR`, just like `*` before `+` in maths:

```sql
SELECT title, rating
FROM books
WHERE (genre = 'sci-fi' OR genre = 'fantasy') AND rating >= 4.5;
```

| title | rating |
|---|---|
| Project Hail Mary | 4.5 |
| The Name of the Wind | 4.6 |

Some shortcuts make conditions easier to read:

- `genre IN ('sci-fi', 'fantasy')` is the same as two `OR`ed equals.
- `year BETWEEN 2000 AND 2020` includes both ends (2000 and 2020).
- `title LIKE '%the%'` matches text patterns: `%` means "any characters", `_` means "exactly one character". In SQLite, `LIKE` ignores upper/lower case for English letters; in PostgreSQL it's case-sensitive, and you use `ILIKE` to ignore case.

## NULL needs special treatment

`NULL` is not a value you can compare with `=`. To find missing values, use `IS NULL` or `IS NOT NULL`:

```sql
SELECT title FROM books WHERE rating IS NULL;
```

| title |
|---|
| Untitled Draft |

## ORDER BY: sorting

Without `ORDER BY`, the database may return rows in any order it likes. Sort with `ASC` (the default) or `DESC`, and add more columns to break ties:

```sql
SELECT title, year, rating
FROM books
WHERE year > 2000
ORDER BY year DESC;
```

| title | year | rating |
|---|---|---|
| Project Hail Mary | 2021 | 4.5 |
| Educated | 2018 | 4.0 |
| The Martian | 2011 | 4.4 |
| The Name of the Wind | 2007 | 4.6 |

`ORDER BY rating DESC, title` sorts by rating first, then alphabetically for equal ratings. Note that databases disagree on where `NULL` goes: SQLite puts it first in ascending order, PostgreSQL last.

## LIMIT and OFFSET: pagination

`LIMIT` caps the number of rows; `OFFSET` skips rows first. Together they give you pages:

```sql
SELECT id, title FROM books ORDER BY id LIMIT 3 OFFSET 3;
```

| id | title |
|---|---|
| 4 | The Martian |
| 5 | Pride and Prejudice |
| 6 | Educated |

This is page 2 with 3 books per page. The general formula is `OFFSET = (page - 1) * limit`, exactly what your Book Library API's `?page=` and `?limit=` will need.

## DISTINCT: removing duplicates

```sql
SELECT DISTINCT genre FROM books WHERE genre IS NOT NULL ORDER BY genre;
```

This returns each genre once: classic, fantasy, memoir, sci-fi.

## The order SQL actually runs in

You *write* `SELECT … FROM … WHERE … ORDER BY … LIMIT`, but the database *runs* it as **FROM → WHERE → SELECT → ORDER BY → LIMIT**. That explains a rule that surprises people: an alias created in `SELECT` (like `age`) can be used in `ORDER BY`, but not in `WHERE`, because `WHERE` runs first. PostgreSQL rejects it with an error; SQLite is more forgiving, but don't rely on that.

## Common mistakes

- **`WHERE rating = NULL`** returns nothing, without any error. Use `IS NULL`.
- **Double quotes around text.** In SQL, text goes in single quotes: `'sci-fi'`. Double quotes are for column and table names. SQLite sometimes accepts `"sci-fi"`, but PostgreSQL will say `column "sci-fi" does not exist`. For an apostrophe inside text, double it: `'Ender''s Game'`.
- **Mixing `AND` and `OR` without parentheses**, which gives rows you didn't expect.
- **Paginating without `ORDER BY`.** Pages can overlap or skip rows. Always sort by something unique, like `id`.

## In short

- `SELECT columns FROM table` reads data; `*` means all columns, `AS` names a column.
- `WHERE` filters with comparisons, `AND`/`OR`, `IN`, `BETWEEN`, `LIKE` and `IS NULL`.
- `ORDER BY` sorts; `LIMIT`/`OFFSET` paginate; `DISTINCT` removes duplicates.
- Text in single quotes; use parentheses when mixing `AND` and `OR`.

### Exercises
- Complete SQLBolt lessons 1–5.
- Using the practice table, write queries for: all fantasy books ordered by pages; books with "the" in the title; books without a rating; the 3 longest books.
- Show page 2 of the books sorted by title, 3 books per page. Then write down the `LIMIT`/`OFFSET` values for page 5 with 20 books per page.
- List all books that are *not* sci-fi with `WHERE genre <> 'sci-fi'`. Does `Untitled Draft` appear? Explain why not, then change the query so it does.

---lesson
id: db-3
title: Creating tables and modifying data
time: 1.5h
video: SQL CREATE TABLE INSERT UPDATE DELETE tutorial
docs: SQLBolt: creating and modifying | https://sqlbolt.com/lesson/inserting_rows
docs: SQLite: CREATE TABLE | https://www.sqlite.org/lang_createtable.html
docs: PostgreSQL: constraints | https://www.postgresql.org/docs/current/ddl-constraints.html
---
In the last lesson you ran a script someone else wrote. Now you'll write your own: define tables, then add, change and remove rows. The most important idea here is **constraints**: rules you give the database so it refuses bad data. A constraint protects your data even when your JavaScript has a bug, which is something a JSON file can never do.

## CREATE TABLE

A table definition lists each column with a name, a type and optional constraints:

```sql
CREATE TABLE authors (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  born INTEGER CHECK (born > 0),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

- `id INTEGER PRIMARY KEY`: in SQLite, this column gets a new number automatically when you insert a row without an id.
- `NOT NULL`: the column must have a value.
- `UNIQUE`: no two rows may have the same value (several `NULL`s are allowed).
- `CHECK (...)`: any condition that must be true for every row.
- `DEFAULT ...`: the value used when an insert doesn't provide one. `CURRENT_TIMESTAMP` is the current date and time.

Use `CREATE TABLE IF NOT EXISTS` in scripts that may run twice, and `DROP TABLE IF EXISTS books;` to delete a table completely (with all its data).

## Data types

SQLite has just a few storage types: `INTEGER`, `REAL` (decimal numbers), `TEXT` and `BLOB` (raw bytes). It has no real boolean (use `0`/`1`) and no date type (store dates as ISO text like `'2026-11-20'`, which also sorts correctly). SQLite is also relaxed: it will happily store `'abc'` in an `INTEGER` column. PostgreSQL is strict and has many more types:

| You want to store | SQLite | PostgreSQL |
|---|---|---|
| Auto-numbered id | `INTEGER PRIMARY KEY` | `INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY` |
| Whole numbers | `INTEGER` | `INTEGER` (or `BIGINT` for huge ones) |
| Text | `TEXT` | `TEXT` or `VARCHAR(n)` |
| True/false | `INTEGER` (0 or 1) | `BOOLEAN` |
| Date / date and time | `TEXT` | `DATE` / `TIMESTAMPTZ` |
| Money | `INTEGER` (cents) | `INTEGER` (cents) or `NUMERIC(10, 2)` |

Store money as whole cents (`1999` instead of `19.99`). Decimal numbers like `REAL` can't store `0.1` exactly, and rounding errors in money are bugs.

## Foreign keys with REFERENCES

```sql
PRAGMA foreign_keys = ON;

CREATE TABLE books (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  year INTEGER CHECK (year > 0),
  author_id INTEGER NOT NULL REFERENCES authors(id)
);
```

`REFERENCES authors(id)` makes `author_id` a foreign key: the database refuses a book whose `author_id` doesn't exist in `authors`, and refuses to delete an author who still has books. Two details: create the referenced table (`authors`) first, and in SQLite run `PRAGMA foreign_keys = ON;` because, for historical reasons, SQLite doesn't enforce foreign keys unless you switch them on for each connection. PostgreSQL always enforces them.

## INSERT: adding rows

```sql
INSERT INTO authors (name, email, born)
VALUES ('Frank Herbert', 'frank@example.com', 1920);

INSERT INTO authors (name, born) VALUES
  ('Andy Weir', 1972),
  ('Jane Austen', 1775);

INSERT INTO books (title, year, author_id)
VALUES ('Dune', 1965, 1)
RETURNING id, title;
```

Always list the columns: the values are matched to them in order, and your insert keeps working if someone adds a column later. Columns you leave out get their `DEFAULT` (or `NULL`). `RETURNING` (supported by SQLite and PostgreSQL) gives you back the new row, including its generated id. Your API will use this to answer `POST` requests.

## UPDATE and DELETE

```sql
UPDATE authors
SET email = 'andy@example.com', born = 1972
WHERE id = 2;

DELETE FROM books WHERE year < 1900;
```

`UPDATE` changes the columns in `SET` for every row that matches `WHERE`. `DELETE` removes every matching row. Read that again: **every** matching row. Without a `WHERE`, `UPDATE` changes the whole table and `DELETE` empties it, and there is no undo button.

A safe habit: first write the statement as a `SELECT` with the same `WHERE`, check the rows are the ones you mean, then change `SELECT *` into `UPDATE` or `DELETE`.

## Changing a table: ALTER TABLE

```sql
ALTER TABLE books ADD COLUMN rating REAL;
ALTER TABLE books RENAME COLUMN year TO published_year;
```

Existing rows get `NULL` (or the default) in a new column. SQLite supports fewer `ALTER TABLE` operations than PostgreSQL; for bigger changes in SQLite, the usual trick is to create a new table, copy the data across and drop the old one.

## When a constraint says no

Breaking a rule gives you an error, and the row is not saved. In SQLite the messages look like this:

```
NOT NULL constraint failed: authors.name
UNIQUE constraint failed: authors.email
CHECK constraint failed: born > 0
FOREIGN KEY constraint failed
```

These errors are good news: the database just stopped bad data. Later, your Express app will turn them into `400` or `409` responses.

## Common mistakes

- **`UPDATE` or `DELETE` without `WHERE`.** Always check with a `SELECT` first.
- **Forgetting `PRAGMA foreign_keys = ON` in SQLite**, so invalid `author_id`s are silently accepted.
- **Inserting without a column list**, so values end up in the wrong columns.
- **Storing money as `REAL`.** Use integer cents.

## In short

- `CREATE TABLE` defines columns, types and constraints: `PRIMARY KEY`, `NOT NULL`, `UNIQUE`, `CHECK`, `DEFAULT`, `REFERENCES`.
- `INSERT INTO t (cols) VALUES (...)` adds rows; `RETURNING` gives back the new row.
- `UPDATE … SET … WHERE` and `DELETE FROM … WHERE` change or remove matching rows: never forget the `WHERE`.
- Constraints make the database refuse bad data, even when your code has bugs.

### Exercises
- Complete SQLBolt lessons 13–18.
- In a new database, create `authors` and `books` with a foreign key and `CHECK (year > 0)`. Insert 3 authors and 6 books using multi-row `INSERT`s.
- Try to break each constraint on purpose (`NOT NULL`, `UNIQUE`, `CHECK` and `FOREIGN KEY`) and write the error messages down. Then turn foreign keys off and see which insert suddenly succeeds.
- Add a `rating` column with `ALTER TABLE`, give three books a rating with `UPDATE`, then delete all books published before 1900. Check each `WHERE` with a `SELECT` first.

---lesson
id: db-4
title: Aggregation: COUNT, SUM, GROUP BY
time: 1.5h
video: SQL GROUP BY HAVING explained
docs: SQLBolt: aggregates | https://sqlbolt.com/lesson/select_queries_with_aggregates
docs: SQLite: date and time functions | https://www.sqlite.org/lang_datefunc.html
---
Every dashboard and report asks the same kinds of questions: *how many*, *how much in total*, *what's the average*, *per month*, *per category*. You could load all rows into JavaScript and loop over them, but the database can answer these questions much faster, and without sending thousands of rows over the network. That is what **aggregation** is for. This lesson uses the `books` practice table from the SQL basics lesson.

## Aggregate functions

An aggregate function turns many rows into one value:

```sql
SELECT COUNT(*) AS books,
       COUNT(rating) AS rated,
       ROUND(AVG(rating), 2) AS avg_rating,
       MAX(pages) AS longest
FROM books;
```

| books | rated | avg_rating | longest |
|---|---|---|---|
| 8 | 7 | 4.3 | 662 |

- `COUNT(*)` counts rows. `COUNT(column)` counts only the rows where that column is **not** `NULL`. That's why `rated` is 7: one book has no rating.
- `SUM`, `AVG`, `MIN` and `MAX` also skip `NULL`s. The average is over the 7 rated books, not 8.
- `ROUND(value, 2)` rounds to 2 decimal places.

## GROUP BY: one result row per group

`GROUP BY` splits the rows into groups with the same value, then runs the aggregates once per group:

```sql
SELECT genre,
       COUNT(*) AS books,
       SUM(pages) AS total_pages,
       MAX(rating) AS best_rating
FROM books
WHERE genre IS NOT NULL
GROUP BY genre
ORDER BY books DESC, genre;
```

| genre | books | total_pages | best_rating |
|---|---|---|---|
| sci-fi | 3 | 1257 | 4.5 |
| fantasy | 2 | 972 | 4.6 |
| classic | 1 | 279 | 4.1 |
| memoir | 1 | 334 | 4.0 |

Think of it as sorting the books into piles by genre, then counting and summing each pile.

## The GROUP BY rule

In a grouped query, every column in `SELECT` must either be in the `GROUP BY` or be inside an aggregate function. Adding `title` to the query above makes no sense: which of the three sci-fi titles should it show? PostgreSQL refuses with an error like `column "books.title" must appear in the GROUP BY clause or be used in an aggregate function`. SQLite allows it but picks a title from the group, which is almost never what you want.

## HAVING: filtering groups

`WHERE` filters rows *before* grouping. `HAVING` filters groups *after* the aggregates are calculated:

```sql
SELECT author, COUNT(*) AS books
FROM books
GROUP BY author
HAVING COUNT(*) > 1;
```

| author | books |
|---|---|
| Andy Weir | 2 |

You can use both in one query: `WHERE year > 1900` removes old books first, then `HAVING` keeps only the authors with more than one of the remaining books.

## Grouping by calculated values

You can group by any expression, for example the decade a book was published in:

```sql
SELECT (year / 10) * 10 AS decade, COUNT(*) AS books
FROM books
WHERE year IS NOT NULL
GROUP BY decade
ORDER BY decade;
```

| decade | books |
|---|---|
| 1810 | 1 |
| 1930 | 1 |
| 1960 | 1 |
| 2000 | 1 |
| 2010 | 2 |
| 2020 | 1 |

Dividing two integers gives an integer (the decimals are dropped), so `2018 / 10` is `201` and `201 * 10` is `2010`.

## Grouping by month

Reports by month are very common. Here is a small `sales` table:

```sql
CREATE TABLE sales (
  id INTEGER PRIMARY KEY,
  sold_on TEXT NOT NULL,          -- 'YYYY-MM-DD'
  amount_cents INTEGER NOT NULL
);

INSERT INTO sales (sold_on, amount_cents) VALUES
  ('2026-09-03', 1500), ('2026-09-17', 2500),
  ('2026-10-01', 4000), ('2026-10-20', 1000), ('2026-10-28', 3000),
  ('2026-11-05', 2000);

SELECT strftime('%Y-%m', sold_on) AS month,
       COUNT(*) AS sales,
       SUM(amount_cents) / 100.0 AS revenue
FROM sales
GROUP BY month
ORDER BY month;
```

| month | sales | revenue |
|---|---|---|
| 2026-09 | 2 | 40.0 |
| 2026-10 | 3 | 80.0 |
| 2026-11 | 1 | 20.0 |

In SQLite, `strftime('%Y-%m', date)` turns a date into its year and month. In PostgreSQL you'd use `to_char(sold_on, 'YYYY-MM')` or `date_trunc('month', sold_on)`. Dividing by `100.0` instead of `100` gives a decimal result instead of a whole number.

## The full order of execution

With grouping, the database runs your query in this order:

**FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT**

When a query gets confusing, build it in that order: pick the table, filter rows, group, filter groups, then choose what to show.

## Common mistakes

- **Using an aggregate in `WHERE`.** `WHERE COUNT(*) > 1` is an error (`misuse of aggregate` in SQLite), because groups don't exist yet when `WHERE` runs. Use `HAVING`.
- **`COUNT(column)` when you meant `COUNT(*)`**, or the other way round. Remember the `NULL` rule.
- **Integer division.** `SUM(amount_cents) / 100` drops the cents. Divide by `100.0`, or better, do the formatting in JavaScript.
- **Selecting columns that aren't grouped.** Follow the GROUP BY rule.

## In short

- `COUNT`, `SUM`, `AVG`, `MIN`, `MAX` summarise many rows; all except `COUNT(*)` skip `NULL`s.
- `GROUP BY` gives one result row per group; every selected column is grouped or aggregated.
- `WHERE` filters rows before grouping, `HAVING` filters groups after.
- Group by expressions like decades or months (`strftime` in SQLite, `to_char`/`date_trunc` in PostgreSQL).

### Exercises
- Complete SQLBolt lessons 10–12 (skip any exercise that needs a `JOIN`; you'll learn those next section).
- Show the number of books and the average number of pages per genre, but only for genres with at least 2 books.
- Count books per decade for books published after 1900, and show the decade as text like `2010s` (hint: in SQLite, `||` joins text together).
- Using the `sales` table, find the best month by revenue and the average sale amount per month.
- Find the author with the highest average rating, ignoring authors without any rated book.

---project
id: db-p3
title: SQL practice set
summary: A GitHub repo of SQL you wrote yourself: your own dataset with questions, plus 15 solved practice problems.
---
### The task
This project isn't an app: it's a structured practice set that makes SQL second nature. SQL comes up constantly in backend jobs and interviews, and the only way to get fluent is to write a lot of queries. You'll build a small dataset about something you like, ask it real questions, solve practice problems from SQL training sites, and keep everything in a GitHub repo that shows your progress.

### What it must do
- A GitHub repo `sql-practice` with a README explaining what's inside and which tool you used (DB Browser for SQLite, sqliteonline.com…)
- `dataset/schema.sql` and `dataset/seed.sql`: one or two tables about a topic you care about (films, games, football matches, songs, recipes…) with at least 25 rows, at least 6 columns, sensible types and constraints, and some `NULL` values
- `dataset/questions.sql`: 15 questions about your data, each written as a comment, followed by the query that answers it and the result pasted in as a comment
- The 15 questions use everything from this section: `WHERE` with `AND`/`OR`, `IN`, `BETWEEN`, `LIKE`, `IS NULL`, `ORDER BY`, `LIMIT`/`OFFSET`, `DISTINCT`, `UPDATE`/`DELETE`, aggregates, `GROUP BY` and `HAVING`
- SQLBolt lessons 1–5 and 10–18 completed
- `problems/`: 15 problems from HackerRank's SQL track (Basic Select and Aggregation) or LeetCode's "SQL 50" study plan, one `.sql` file each, containing the problem link, your query and a 1–2 line explanation in your own words

### Steps
1. Create the repo with a README and the folders `dataset/` and `problems/`. Choose your topic and write down 5 things you'd like to know about the data.
2. Write `schema.sql` with `CREATE TABLE` statements (start the file with `DROP TABLE IF EXISTS` so you can rerun it). Run it and fix errors until it works.
3. Write `seed.sql` with at least 25 rows. Include a few rows with missing values. Run schema + seed together and check with `SELECT *`.
4. Write the first 8 questions in `questions.sql`: filtering, sorting and pagination. Run each query and paste the result below it as a comment.
5. Write 7 more questions using aggregates, `GROUP BY` and `HAVING`, plus at least one `UPDATE` and one `DELETE` (check them with a `SELECT` first).
6. Work through SQLBolt lessons 1–5 and 10–18. Skip exercises that need a `JOIN` for now; you'll come back to them after the JOINs lesson.
7. Solve problems on HackerRank or LeetCode, 3 per study session, starting with the easiest. Save each in `problems/` as soon as it passes. Skip problems that need a `JOIN` until the next section.
8. A week later, pick the 3 problems that took you longest, delete your answers, and solve them again from scratch.

### Hints
- Stuck on a query? Build it in execution order: `FROM` first, then `WHERE`, then `GROUP BY`, then `HAVING`, and decide the `SELECT` columns last.
- Run a query after every small change instead of writing the whole thing at once.
- Training sites use different databases (often MySQL or PostgreSQL). Basic SQL is the same; if a function doesn't exist, search for "<function> in MySQL" or similar.
- Comment format that reads well on GitHub: `-- Q3: Which films are longer than 2 hours, newest first?`

### Stretch goals
- After the JOINs lesson: add a second, related table to your dataset and 5 questions that join them, and solve the JOIN problems you skipped.
- Learn window functions (`ROW_NUMBER`, `RANK`, `SUM(...) OVER`) and solve 5 problems with them.
- Time yourself: solve 5 easy problems in 30 minutes.

### Done when
- The repo has a README, `schema.sql`, `seed.sql` and `questions.sql` that run without errors from an empty database
- `questions.sql` has 15 answered questions covering filtering, sorting, pagination, aggregates and `GROUP BY`/`HAVING`
- SQLBolt lessons 1–5 and 10–18 are completed
- 15 practice problems are solved and saved, each with an explanation in your own words
- You re-solved 3 hard problems from scratch a week later

---section
id: db-s2
title: Relationships and schema design
intro: Real data is spread over many related tables. Learn to combine them with JOINs, design a clean schema from scratch, and keep it fast and correct with indexes and transactions. You'll finish by designing a complete online shop database, still in a SQL editor, with no app yet.
---

---lesson
id: db-5
title: JOINs and relationships
time: 2h
video: SQL joins explained visually
docs: SQLBolt: joins | https://sqlbolt.com/lesson/select_queries_with_joins
docs: PostgreSQL tutorial: joins | https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-joins/
---
In a well-designed database, each kind of thing has its own table: books in one, authors in another, tags in a third. That avoids duplicated data, but your app usually needs the pieces together: "show each book with its author's name and its tags". A **JOIN** combines rows from related tables in a single query. It's the feature that makes relational databases powerful, and the one beginners find hardest, so take your time with this lesson.

## Practice data

Create a new database file, `library.db`, and run this script:

```sql
PRAGMA foreign_keys = ON;

CREATE TABLE authors (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE books (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  year INTEGER,
  author_id INTEGER NOT NULL REFERENCES authors(id)
);

CREATE TABLE tags (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE book_tags (
  book_id INTEGER NOT NULL REFERENCES books(id),
  tag_id INTEGER NOT NULL REFERENCES tags(id),
  PRIMARY KEY (book_id, tag_id)
);

INSERT INTO authors (id, name) VALUES
  (1, 'Frank Herbert'), (2, 'Andy Weir'), (3, 'Jane Austen'), (4, 'Ursula K. Le Guin');

INSERT INTO books (id, title, year, author_id) VALUES
  (1, 'Dune', 1965, 1),
  (2, 'Project Hail Mary', 2021, 2),
  (3, 'The Martian', 2011, 2),
  (4, 'Pride and Prejudice', 1813, 3);

INSERT INTO tags (id, name) VALUES (1, 'sci-fi'), (2, 'classic'), (3, 'space');

INSERT INTO book_tags (book_id, tag_id) VALUES
  (1, 1), (1, 2), (2, 1), (2, 3), (3, 1), (3, 3), (4, 2);
```

Notice that Ursula K. Le Guin has no books in this table yet. That will matter soon.

## One-to-many relationships

One author writes many books; each book has one author. This is a **one-to-many** relationship, and it's stored with a foreign key on the "many" side: `books.author_id`. You never store a list of book ids in the author row.

## INNER JOIN: only the matches

```sql
SELECT b.title, a.name AS author
FROM books AS b
JOIN authors AS a ON a.id = b.author_id
ORDER BY b.title;
```

| title | author |
|---|---|
| Dune | Frank Herbert |
| Pride and Prejudice | Jane Austen |
| Project Hail Mary | Andy Weir |
| The Martian | Andy Weir |

How to read it: for every row in `books`, find the rows in `authors` where the `ON` condition is true, and glue them together into one wider row. `b` and `a` are **aliases**: short names for the tables, so you can write `b.title` instead of `books.title`. `JOIN` on its own means `INNER JOIN`: rows without a match on the other side are left out. That's why Ursula K. Le Guin doesn't appear.

## LEFT JOIN: keep everything from the left

A `LEFT JOIN` keeps **all** rows from the first (left) table, even when nothing matches. The missing columns are filled with `NULL`:

```sql
SELECT a.name, b.title
FROM authors AS a
LEFT JOIN books AS b ON b.author_id = a.id
ORDER BY a.name, b.title;
```

| name | title |
|---|---|
| Andy Weir | Project Hail Mary |
| Andy Weir | The Martian |
| Frank Herbert | Dune |
| Jane Austen | Pride and Prejudice |
| Ursula K. Le Guin | NULL |

Combined with `GROUP BY`, this answers "how many books does each author have, including zero":

```sql
SELECT a.name, COUNT(b.id) AS books
FROM authors AS a
LEFT JOIN books AS b ON b.author_id = a.id
GROUP BY a.id, a.name
ORDER BY books DESC, a.name;
```

| name | books |
|---|---|
| Andy Weir | 2 |
| Frank Herbert | 1 |
| Jane Austen | 1 |
| Ursula K. Le Guin | 0 |

And adding `WHERE b.id IS NULL` to the `LEFT JOIN` finds rows with **no** match at all: authors without books, customers who never ordered, products never sold. You'll use this pattern a lot.

## Many-to-many relationships

A book can have many tags, and a tag belongs to many books. You can't store that with one foreign key, so you add a **join table** (`book_tags`) whose rows each link one book to one tag. Its primary key is the *pair* `(book_id, tag_id)`, so the same link can't be stored twice.

To query through it, you join twice:

```sql
SELECT b.title, a.name AS author
FROM books AS b
JOIN authors AS a ON a.id = b.author_id
JOIN book_tags AS bt ON bt.book_id = b.id
JOIN tags AS t ON t.id = bt.tag_id
WHERE t.name = 'sci-fi'
ORDER BY b.year;
```

| title | author |
|---|---|
| Dune | Frank Herbert |
| The Martian | Andy Weir |
| Project Hail Mary | Andy Weir |

To show each book with all its tags in one row, group and glue the names together. SQLite has `group_concat`; PostgreSQL has `string_agg` with the same arguments:

```sql
SELECT b.title, group_concat(t.name, ', ') AS tags
FROM books AS b
JOIN book_tags AS bt ON bt.book_id = b.id
JOIN tags AS t ON t.id = bt.tag_id
GROUP BY b.id, b.title
ORDER BY b.title;
```

| title | tags |
|---|---|
| Dune | sci-fi, classic |
| Pride and Prejudice | classic |
| Project Hail Mary | sci-fi, space |
| The Martian | sci-fi, space |

The order of the tags inside each row isn't guaranteed.

## Subqueries

Sometimes it's easier to put one query inside another. A query in brackets can be used like a list of values:

```sql
SELECT name FROM authors
WHERE id NOT IN (SELECT author_id FROM books);
```

This also returns Ursula K. Le Guin. Both this and the `LEFT JOIN … IS NULL` version are fine; use whichever you find easier to read.

One trap: if the subquery returns even one `NULL` (for example a book without an `author_id`), `NOT IN` returns **no rows at all**. `NOT EXISTS` and the `LEFT JOIN … IS NULL` version don't have this problem:

```sql
SELECT a.name FROM authors AS a
WHERE NOT EXISTS (SELECT 1 FROM books AS b WHERE b.author_id = a.id);
```

## Common mistakes

- **`ambiguous column name: id`.** Both tables have an `id`, so the database doesn't know which you mean. Always prefix columns with the table alias in joins.
- **A wrong `ON` condition.** `ON a.id = b.id` runs without error but matches author 1 with book 1, which is nonsense. The `ON` always connects a foreign key to the primary key it points to.
- **`COUNT(*)` with a `LEFT JOIN`.** An author without books still produces one row (with `NULL`s), so `COUNT(*)` says 1. Count a column from the right table: `COUNT(b.id)`.
- **Filtering the right table in `WHERE` after a `LEFT JOIN`.** `WHERE b.year > 2000` removes the `NULL` rows again, turning it into an inner join. Put such conditions in the `ON` instead.

## In short

- One-to-many: a foreign key on the "many" side. Many-to-many: a join table with two foreign keys.
- `JOIN … ON` combines matching rows; `LEFT JOIN` keeps all rows from the left table, with `NULL`s where nothing matches.
- `LEFT JOIN … WHERE right.id IS NULL` finds rows with no match.
- Use aliases and always prefix columns in joins.

### Exercises
- Complete SQLBolt lessons 6–9, plus any exercises you skipped earlier because they needed a `JOIN`.
- List every book with its author's name and year, newest first.
- Add the tag `romance`, link it to Pride and Prejudice, and add a tag `fantasy` that no book uses. Then list all tags with their number of books, including tags with zero books.
- Find all books tagged both `sci-fi` and `space`. (Hint: filter on both tag names with `IN`, group by book, and keep groups with `HAVING COUNT(*) = 2`.)

---lesson
id: db-6
title: Schema design and normalisation
time: 1.5h
video: database design course normalization
docs: dbdiagram.io | https://dbdiagram.io/
docs: PostgreSQL: constraints | https://www.postgresql.org/docs/current/ddl-constraints.html
---
The **schema** is the set of tables, columns and constraints in your database. Code is easy to change; a schema with real data in it is not. A badly designed schema causes bugs and awkward queries for the whole life of an app, while a good one makes most queries obvious. Spending 30 minutes drawing tables before you write any code is one of the best investments you can make in a project.

## Start from the nouns

Describe the app in a few sentences, then look at the nouns and verbs. For a recipe app: "*Users* save *recipes*. Each recipe has *ingredients* with quantities. A user can *review* a recipe." The important nouns (users, recipes, ingredients, reviews) become tables. The verbs (save, has, review) become relationships between them.

## Why duplicated data is a problem

Here's how a beginner might store recipes in one table:

| recipe | author | author_email | ingredients |
|---|---|---|---|
| Pancakes | Mia | mia@example.com | flour, eggs, milk |
| Omelette | Mia | mia@example.com | eggs, cheese |

It looks simple, but:

- **Update problems**: Mia changes her email and you must update every row. Miss one and your data contradicts itself.
- **Delete problems**: delete Mia's last recipe and you've lost the fact that Mia exists.
- **Query problems**: "which recipes use eggs?" needs text searching, and the quantities have nowhere to go.

## Normalisation in plain words

**Normalisation** is the process of removing this duplication. Textbooks describe "normal forms" (1NF, 2NF, 3NF), but the practical rules are:

1. **One value per cell.** No lists like `flour, eggs, milk` in a column (that's the first normal form).
2. **Each fact is stored in exactly one place.** Mia's email lives in one row of `users`, and everything else points to it with a foreign key.
3. **Every column describes the thing the row is about.** `author_email` describes a user, not a recipe, so it belongs in `users`.

## The three kinds of relationships

- **One-to-many** (a user has many recipes): put a foreign key on the "many" side, `recipes.user_id`.
- **Many-to-many** (recipes have many ingredients, an ingredient is in many recipes): add a join table, `recipe_ingredients`. A join table can hold its own columns too, here the quantity and unit.
- **One-to-one** (a user has one settings row): a foreign key with `UNIQUE`. It's rare; usually the columns just go in the same table.

## The normalised schema

```sql
PRAGMA foreign_keys = ON;

CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recipes (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  servings INTEGER NOT NULL DEFAULT 2 CHECK (servings > 0),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ingredients (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE recipe_ingredients (
  recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_id INTEGER NOT NULL REFERENCES ingredients(id) ON DELETE RESTRICT,
  quantity REAL NOT NULL CHECK (quantity > 0),
  unit TEXT NOT NULL,
  PRIMARY KEY (recipe_id, ingredient_id)
);
```

Now "which recipes use eggs?" is a simple join, Mia's email is stored once, and every ingredient has a quantity.

## What happens on delete

The `ON DELETE` part of a foreign key decides what happens to child rows when the parent row is deleted:

- `CASCADE`: delete the children too. Deleting a user deletes their recipes; deleting a recipe deletes its ingredient lines.
- `RESTRICT` (or leaving it out, which behaves almost the same): refuse to delete the parent while children exist. You can't delete "eggs" while a recipe uses it.
- `SET NULL`: keep the children but empty the foreign key (the column must allow `NULL`).

Choose per relationship: what *should* happen in the real world?

## Types, names and other good habits

- **Names**: `snake_case`, plural table names (`users`), foreign keys named `<thing>_id` (`user_id`). Be consistent.
- **Money** as integer cents; **dates** as ISO text in SQLite, `DATE`/`TIMESTAMPTZ` in PostgreSQL.
- **Fixed sets of values** with a `CHECK`: `status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'shipped'))`.
- **`created_at`** on most tables. You'll want it for sorting and debugging.
- **Constraints in the database**, not only in your code. Your validation might have a bug; the constraint won't.

## When duplication is the right choice

Sometimes you copy data on purpose. An order line should store the **price at the moment of purchase**, because the product's price will change later and old orders must not change with it. That's not a normalisation mistake: it's a different fact ("what the customer paid"). Denormalise only on purpose, and know why.

## Draw it first

An **ER diagram** (entity-relationship diagram) shows tables as boxes and relationships as lines. On dbdiagram.io you describe tables in a short text format and it draws the diagram for you:

```text
Table recipes {
  id integer [pk]
  user_id integer [not null, ref: > users.id]
  title text [not null]
}
```

`ref: > users.id` means "many recipes point to one user". Export the image and put it in your project's README.

## Common mistakes

- **Lists in a column** (`tags = 'sci-fi,space'`). Use a join table.
- **Using a name as a key.** Names change and aren't unique. Point to an `id`.
- **Floats for money.** Use integer cents.
- **Skipping constraints** because "the app checks it". Sooner or later, a bug or a manual edit will get past the app.

## In short

- Nouns become tables, verbs become relationships. Draw an ER diagram before writing SQL.
- Normalise: one value per cell, each fact stored once, everything else points to it.
- One-to-many uses a foreign key; many-to-many uses a join table (which can have its own columns).
- Choose `ON DELETE` behaviour, types and constraints deliberately; denormalise only on purpose.

### Exercises
- A school keeps this spreadsheet: `student_name, student_email, course_titles, teacher_name, teacher_room`. List three problems with it and the tables you'd split it into.
- Design a blog schema in dbdiagram.io: users, posts, comments and tags (posts have many tags). Mark every relationship type and export the diagram.
- Write the `CREATE TABLE` statements for your blog in SQLite, with constraints and a deliberate `ON DELETE` choice for each foreign key. Insert some data, delete a user, and check what happened to their posts and comments.
- Write a query that shows each post with its author's name, its number of comments and its tags.

---lesson
id: db-10
title: Indexes and transactions
time: 1.5h
video: database indexing explained
docs: Use The Index, Luke | https://use-the-index-luke.com/
docs: SQLite: EXPLAIN QUERY PLAN | https://www.sqlite.org/eqp.html
docs: PostgreSQL: transactions | https://www.postgresql.org/docs/current/tutorial-transactions.html
---
Two things start to matter as soon as an app has real data and real users. **Speed**: a query that's instant with 50 rows can take seconds with 5 million. **Correctness**: when one action needs several changes (create an order, add its items, reduce the stock), they must all happen or none of them. Indexes solve the first problem, transactions the second.

## How a database finds rows

Without help, the database answers `WHERE author_id = 42` by reading **every row** in the table and checking each one. This is called a *full table scan*. It's fine for small tables and terrible for large ones.

An **index** works like the index at the back of a book. Instead of reading every page to find "foreign keys", you look it up in the sorted index and jump straight to the right page. A database index is a sorted structure (usually a *B-tree*) that maps column values to the rows that contain them.

## Creating an index

```sql
CREATE INDEX idx_books_author_id ON books(author_id);
CREATE UNIQUE INDEX idx_users_email ON users(email);
DROP INDEX idx_books_author_id;
```

Primary keys and `UNIQUE` columns get an index automatically. **Foreign keys do not**, in SQLite or PostgreSQL, even though you join on them all the time. Indexing them yourself is usually the first index you'll add.

## Seeing the difference

Let's make a big table. This SQLite script generates 100,000 rows with a *recursive query* that counts from 1 to 100,000 (you don't need to understand every detail of it):

```sql
CREATE TABLE big_books (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  author_id INTEGER NOT NULL,
  year INTEGER NOT NULL
);

WITH RECURSIVE n(i) AS (
  SELECT 1 UNION ALL SELECT i + 1 FROM n WHERE i < 100000
)
INSERT INTO big_books (title, author_id, year)
SELECT 'Book ' || i, abs(random()) % 5000 + 1, 1900 + abs(random()) % 126
FROM n;
```

Now ask SQLite *how* it would run a query, with `EXPLAIN QUERY PLAN`:

```sql
EXPLAIN QUERY PLAN SELECT * FROM big_books WHERE author_id = 42;
-- SCAN big_books

CREATE INDEX idx_big_books_author_id ON big_books(author_id);

EXPLAIN QUERY PLAN SELECT * FROM big_books WHERE author_id = 42;
-- SEARCH big_books USING INDEX idx_big_books_author_id (author_id=?)
```

`SCAN` means it reads the whole table; `SEARCH … USING INDEX` means it jumps straight to the matching rows. Your SQL tool shows how long each query took: compare the time before and after. The bigger the table, the bigger the difference. In PostgreSQL, use `EXPLAIN ANALYZE` instead: it runs the query and shows `Seq Scan` (full scan) or `Index Scan`, with real timings.

## What to index

- Foreign key columns you join on (`books.author_id`, `order_items.product_id`).
- Columns you often filter by in `WHERE` (`orders.status`, `users.email`).
- Columns you sort by together with a filter. A **composite index** on two columns, like `CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);`, makes "this user's orders, newest first" fast. Column order matters: this index helps queries filtering by `user_id`, but not queries filtering only by `created_at`.

Don't index everything. Every index takes space and slows down every `INSERT`, `UPDATE` and `DELETE`, because the index must be updated too. And a normal index can't help with `LIKE '%word%'` (a pattern starting with `%`): there's no sorted position to jump to.

## Transactions: all or nothing

A **transaction** groups statements into one unit. Start it with `BEGIN`, make it permanent with `COMMIT`, or undo everything since `BEGIN` with `ROLLBACK`:

```sql
CREATE TABLE accounts (
  id INTEGER PRIMARY KEY,
  owner TEXT NOT NULL,
  balance INTEGER NOT NULL CHECK (balance >= 0)
);
INSERT INTO accounts (owner, balance) VALUES ('Mia', 100), ('Leo', 20);

BEGIN;
UPDATE accounts SET balance = balance - 50 WHERE id = 1;
UPDATE accounts SET balance = balance + 50 WHERE id = 2;
COMMIT;
```

If the power fails between the two updates, the database undoes the first one when it starts again. Nobody ever sees money that has left Mia but not reached Leo. Other users also don't see your changes until you `COMMIT`.

## Checking stock inside a transaction

Placing an order is the classic example: insert the order, then reduce the stock, and refuse everything if there isn't enough stock. There are two good ways to make the stock check safe.

**1. Let a constraint refuse it.** With `stock INTEGER NOT NULL CHECK (stock >= 0)` on the products table, an update that would make the stock negative fails:

```sql
BEGIN;
INSERT INTO orders (customer, created_at) VALUES ('Mia', CURRENT_TIMESTAMP);
UPDATE products SET stock = stock - 3 WHERE id = 1;
-- Error: CHECK constraint failed (only 2 left)
ROLLBACK;
```

After the error, run `ROLLBACK`, and the order insert is undone too. In SQLite, only the failing statement is cancelled and the transaction stays open until you roll it back. PostgreSQL goes further: after any error it refuses all further statements (`current transaction is aborted`) until you `ROLLBACK`.

**2. Make the condition part of the update.**

```sql
UPDATE products SET stock = stock - 3
WHERE id = 1 AND stock >= 3;
```

If there isn't enough stock, this updates **0 rows** instead of failing. Your SQL tool shows the number of affected rows; when you do this from Node, you'll check that number in code and roll back if it's 0.

Don't first `SELECT` the stock and then `UPDATE` it in a separate step: another customer can buy the last item between your two statements.

> **Tip:** Graphical tools sometimes manage transactions for you. If DB Browser for SQLite says "cannot start a transaction within a transaction", click *Write Changes* first, or try the experiment on sqliteonline.com.

## Common mistakes

- **Not indexing foreign keys**, then wondering why joins get slow as data grows.
- **Indexing every column "just in case"**, which slows down every write.
- **Forgetting `COMMIT`.** Your changes stay invisible to everyone else and are lost when the connection closes.
- **Check-then-update in two steps**, which lets two buyers take the same last item.

## In short

- An index makes lookups by a column fast, at the cost of storage and slower writes. Index foreign keys and commonly filtered columns.
- Check how a query runs with `EXPLAIN QUERY PLAN` (SQLite) or `EXPLAIN ANALYZE` (PostgreSQL).
- `BEGIN … COMMIT` makes several statements all-or-nothing; `ROLLBACK` undoes them.
- Check stock with a `CHECK` constraint or a conditional `UPDATE`, never with a separate `SELECT` first.

### Exercises
- Create `big_books` with 100,000 rows. Run `SELECT * FROM big_books WHERE author_id = 42;` and note the time and the query plan. Add an index, then compare.
- Run `EXPLAIN QUERY PLAN SELECT * FROM big_books WHERE author_id = 42 ORDER BY year;`. You'll see a step for sorting (`USE TEMP B-TREE FOR ORDER BY`). Create a composite index that removes it.
- Create the `accounts` table and transfer more money than Mia has inside a transaction. Read the error, roll back, and confirm both balances are unchanged.
- Create a small `products` table and write "place an order" as a transaction using the conditional `UPDATE`. Run it once with enough stock and once without, and check the stock after each.

---project
id: db-p4
title: Online shop database
summary: Design a complete shop database with keys, constraints, seed data, business queries, indexes and an order transaction.
---
### The task
A small online shop is about to build its website and needs a database first. Your job is to design it: the tables, relationships and rules, realistic test data, the queries the shop owner will ask every week, and a safe way to place an order. Everything happens in a SQL editor (SQLite with DB Browser, or the SQL editor of a free Supabase or Neon project). There is no app yet; you'll connect a database to code in the next section.

### What it must do
- Tables: `users`, `categories`, `products`, `orders`, `order_items` and `reviews`, with primary keys, foreign keys and sensible `ON DELETE` rules
- Constraints that protect the data: unique emails, prices above 0, stock never below 0, quantities above 0, ratings from 1 to 5, an order status limited to a fixed list (for example `pending`, `paid`, `shipped`, `cancelled`), and at most one review per user per product
- `order_items` stores the quantity **and the unit price at the moment of purchase**
- An ER diagram (image) in the README
- `schema.sql` and `seed.sql` that rebuild the whole database from nothing; seed data spans at least 3 months, and includes at least one user who never ordered and one product that was never sold
- `queries.sql` with at least 10 business queries, each with a comment saying what question it answers, for example:
  - best-selling products (top 5 by units sold)
  - revenue per month (only paid and shipped orders)
  - revenue per category
  - customers who never placed an order
  - average rating and number of reviews per product, including products without reviews
  - top 3 customers by total spent
  - products that were never sold
  - products low on stock (fewer than 5)
  - all orders of one user with their totals and number of items
  - average order value
- `indexes.sql` with indexes for the foreign keys and columns your queries filter on, and a comment for each explaining why
- `place-order.sql`: a transaction that creates an order with two items and reduces stock, which is rolled back when there isn't enough stock

### Steps
1. Choose your tool and create an empty database. In the README, write the shop in 3–4 sentences and list the entities and how they relate (one-to-many or many-to-many).
2. Draw the ER diagram on dbdiagram.io with all tables, columns and relationships. Export it as an image and add it to the README.
3. Write `schema.sql`. Start with `DROP TABLE IF EXISTS` for every table (children first), then create the tables (parents first). Run it until it works without errors.
4. Write `constraints-test.sql`: one statement that breaks each rule (negative price, rating 6, duplicate email, unknown `product_id`…), with the expected error in a comment. Run each and check it really fails.
5. Write `seed.sql`: about 4 categories, 15–20 products, 8 users, 15–20 orders over at least 3 months, 30–40 order items and 15 reviews. Run schema + seed and check the data with a few `SELECT`s.
6. Write the business queries in `queries.sql` one at a time. Run each, check the result makes sense against your seed data, and paste a short version of the result below it as a comment.
7. Run `EXPLAIN QUERY PLAN` (SQLite) or `EXPLAIN ANALYZE` (PostgreSQL) on two of your join queries. Write `indexes.sql`, run it, and compare the plans before and after in a comment.
8. Write `place-order.sql` in two parts: a successful order (commit, then check the new rows and the reduced stock) and an order for more items than are in stock (rolled back, then check that nothing changed).
9. Finish the README (how to run the files, in which order), push everything to GitHub.

### Hints
- Order totals: you can calculate them from the items with `SUM(quantity * unit_price_cents)`, so you don't need to store a total on `orders`. If you do store one, explain why in the README.
- Use `PRAGMA foreign_keys = ON;` at the top of every SQLite file, or foreign keys are silently ignored.
- Dates in the seed: in SQLite write them as text like `'2026-09-14 10:30:00'`, so that `strftime('%Y-%m', created_at)` can group them by month. In PostgreSQL use `TIMESTAMPTZ` and `to_char(created_at, 'YYYY-MM')`.
- "Customers who never ordered" and "products never sold" are the `LEFT JOIN … WHERE … IS NULL` pattern.
- For the average rating, a `LEFT JOIN` from products to reviews keeps products without reviews; their average is `NULL`.
- In `place-order.sql`, you need the new order's id for the `order_items` rows. In a script you run alone, `(SELECT MAX(id) FROM orders)` works fine. In an app you'll use `RETURNING id` instead. You can also insert the result of a `SELECT`, which lets you copy the current price: `INSERT INTO order_items (order_id, product_id, quantity, unit_price_cents) SELECT (SELECT MAX(id) FROM orders), id, 2, price_cents FROM products WHERE id = 5;`

### Stretch goals
- Add a `cart_items` table and write the queries to turn a cart into an order.
- Add product images and addresses (a user can have several addresses; an order uses one).
- Write the same schema for both SQLite and PostgreSQL and list every difference you had to make.
- Later in this module: write a small Node script that places an order through `node:sqlite` with the transaction from step 8.

### Done when
- The ER diagram is in the README and matches the actual tables
- `schema.sql` and `seed.sql` rebuild the database from scratch without errors
- Every rule in `constraints-test.sql` is refused by the database
- `queries.sql` answers at least 10 business questions with correct results for your seed data
- `indexes.sql` adds sensible indexes, and you compared at least two query plans before and after
- An order with too little stock is rolled back, leaving orders, items and stock unchanged

---section
id: db-s3
title: Databases in your Node apps
intro: Connect your Express apps to real databases: SQLite with Node's built-in module, then PostgreSQL with the pg package (hosted, and locally in Docker), safely protected against SQL injection. You'll also try an ORM with migrations and (optionally) MongoDB. You'll finish by upgrading your Book Library API and building a full-stack Expense Tracker.
---

---lesson
id: db-7
title: Using SQLite from Node (and SQL injection)
time: 2h
video: Node.js built-in SQLite node:sqlite tutorial
docs: node:sqlite | https://nodejs.org/api/sqlite.html
docs: OWASP: SQL injection prevention | https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html
---
You can write SQL; now your code needs to run it. Node includes SQLite as a built-in module, `node:sqlite`, which works without any flag on Node 22.13+ and Node 24 (the version this course recommends), so there's nothing to install: your Express app can store its data in a real database file with a few lines of code. This lesson also covers the most famous security hole in web development, **SQL injection**, and the simple habit that prevents it completely.

## Opening a database

```js
// db.js
import { DatabaseSync } from "node:sqlite";
import path from "node:path";

const db = new DatabaseSync(path.join(import.meta.dirname, "library.db"));

db.exec(`
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    year INTEGER
  );
`);

export default db;
```

- `new DatabaseSync(file)` opens the database file, and creates it if it doesn't exist yet. Build the path with `import.meta.dirname`, as you did for JSON files.
- `db.exec(sql)` runs one or more SQL statements that don't return rows. It's perfect for creating tables.
- `node:sqlite` already switches foreign keys on by default; the `PRAGMA` line just makes it explicit.
- The API is **synchronous** ("Sync"): calls return results directly, no `await`. That's fine for SQLite, which reads a local file very quickly.

Depending on your exact Node version, you may see an `ExperimentalWarning` when the module loads. It's safe to ignore while learning.

## Prepared statements: run, get and all

To run queries with values, **prepare** a statement with `?` placeholders, then call one of three methods:

```js
import db from "./db.js";

const insert = db.prepare("INSERT INTO books (title, year) VALUES (?, ?)");
console.log(insert.run("Dune", 1965));
// { lastInsertRowid: 1, changes: 1 }

const findById = db.prepare("SELECT * FROM books WHERE id = ?");
console.log(findById.get(1));   // { id: 1, title: 'Dune', year: 1965 }
console.log(findById.get(999)); // undefined

const all = db.prepare("SELECT * FROM books ORDER BY year").all();
console.log(all.length);
```

| Method | Use it for | Returns |
|---|---|---|
| `.run(...values)` | `INSERT`, `UPDATE`, `DELETE` | `{ changes, lastInsertRowid }` |
| `.get(...values)` | one row | an object, or `undefined` |
| `.all(...values)` | many rows | an array of objects (maybe empty) |

The values replace the `?`s in order. `changes` tells you how many rows were affected: if an `UPDATE … WHERE id = ?` reports `changes: 0`, the id didn't exist, which means a 404 in your API. Prepare a statement once and reuse it as often as you like.

## SQL injection

Imagine a search endpoint that builds SQL by gluing user input into a string:

```js
// BAD: user input inside the SQL text
app.get("/api/books", (req, res) => {
  const sql = `SELECT * FROM books WHERE title = '${req.query.title}'`;
  res.json(db.prepare(sql).all());
});
```

A normal user sends `?title=Dune`. An attacker sends `?title=' OR '1'='1`, and the SQL becomes:

```sql
SELECT * FROM books WHERE title = '' OR '1'='1'
```

`'1'='1'` is always true, so every row is returned. The attacker's input changed the *meaning* of your query. With the same trick, attackers can read other tables, log in without a password, or change data. This is **SQL injection**, and it's still one of the most common security holes on the web.

The fix is always the same: **never put user input into the SQL text. Use placeholders.**

```js
// GOOD: the value is sent separately and is never treated as SQL
app.get("/api/books", (req, res) => {
  const books = db.prepare("SELECT * FROM books WHERE title = ?").all(req.query.title ?? "");
  res.json(books);
});
```

Now `' OR '1'='1` is just a strange book title that matches nothing. For `LIKE` searches, the `%` signs go in the **value**, not in the SQL: write `WHERE title LIKE ?` and pass `"%" + search + "%"` as the value.

## Placeholders only work for values

You can't use `?` for a column name or for `ASC`/`DESC`. To let users sort with `?sort=year&order=desc`, only allow values from your own list:

```js
const SORTABLE = { title: "title", year: "year" };
const column = SORTABLE[req.query.sort] ?? "id";
const direction = req.query.order === "desc" ? "DESC" : "ASC";

const books = db
  .prepare(`SELECT * FROM books ORDER BY ${column} ${direction} LIMIT ? OFFSET ?`)
  .all(limit, offset);
```

This is safe because only strings *you* wrote can end up in the SQL text. Anything else falls back to `id`.

## A data-access module

Keep all SQL in one module, so your routes don't care how the data is stored. Your Book Library API already has one: `data/books.js`. Only the inside of that file changes:

```js
// data/books.js  (SQLite version)
import db from "../db.js";

const selectPage = db.prepare("SELECT * FROM books ORDER BY id LIMIT ? OFFSET ?");
const countAll = db.prepare("SELECT COUNT(*) AS total FROM books");
const selectOne = db.prepare("SELECT * FROM books WHERE id = ?");
const insertOne = db.prepare("INSERT INTO books (title, year) VALUES (?, ?) RETURNING *");
const deleteOne = db.prepare("DELETE FROM books WHERE id = ?");

export async function findAll({ page = 1, limit = 10 } = {}) {
  const data = selectPage.all(limit, (page - 1) * limit);
  return { data, total: countAll.get().total };
}
export async function findById(id) {
  return selectOne.get(id);
}
export async function create({ title, year }) {
  return insertOne.get(title, year ?? null);
}
export async function remove(id) {
  return deleteOne.run(id).changes > 0;
}
```

The functions keep the same names and stay `async`, even though SQLite answers synchronously. So your controllers, which already `await Books.findById(id)`, don't change at all. `update(id, data)` and the `search` filter follow the same pattern (see the exercises).

`RETURNING *` with `.get()` gives you the newly created row, ready to send back with status 201.

## Transactions in Node

`node:sqlite` has no special transaction helper; you run `BEGIN`, `COMMIT` and `ROLLBACK` yourself, with `try`/`catch`:

```js
const insertTag = db.prepare("INSERT INTO book_tags (book_id, tag_id) VALUES (?, ?)");

export function createBookWithTags(book, tagIds) {
  db.exec("BEGIN");
  try {
    const created = insertOne.get(book.title, book.year ?? null);
    for (const tagId of tagIds) insertTag.run(created.id, tagId);
    db.exec("COMMIT");
    return created;
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
}
```

If any tag id is invalid, the foreign key error jumps to `catch`, the book insert is rolled back, and the error goes on to your Express error handler.

## Common mistakes

- **Template literals with user input in SQL.** If you see `${` inside a SQL string, check that only your own whitelisted values go there.
- **Passing `undefined`.** `node:sqlite` throws `Provided value cannot be bound to SQLite parameter`. Convert missing values to `null` (`year ?? null`).
- **Strange output in the console.** Rows print as `[Object: null prototype] { id: 1, … }`. That's harmless: `res.json(row)` works normally.
- **Committing the database file.** Add `*.db` to `.gitignore` and create the data with a seed script instead.

## In short

- `new DatabaseSync(file)` opens SQLite; `db.exec` runs setup SQL; `db.prepare(sql)` creates reusable statements.
- `.run()` for changes, `.get()` for one row, `.all()` for many.
- Always use `?` placeholders for values; whitelist column names and sort directions.
- Use `BEGIN`/`COMMIT`/`ROLLBACK` in `try`/`catch` for multi-step changes.

### Exercises
- Write `db/init.js` that creates your tables and inserts sample data. Make it safe to run twice (use `IF NOT EXISTS`, and delete the old rows before seeding).
- Replace the in-memory array in your Book Library API's `data/books.js` with SQLite: `findAll` (with `search`), `findById`, `create`, `update` and `remove`. When no row was found (`changes` is 0), return `undefined` or `false` as before, so the controllers still answer 404.
- In a scratch file, write a deliberately vulnerable search query, exploit it with `' OR '1'='1`, then fix it with placeholders and show that the attack no longer works.
- Add `?sort=` and `?order=` to your list endpoint using a whitelist. Try `?sort=year;DROP TABLE books` and confirm it's simply ignored.

---lesson
id: db-8
title: PostgreSQL and hosted databases
time: 2h
video: PostgreSQL Node.js tutorial pg
docs: node-postgres | https://node-postgres.com/
docs: node-postgres: transactions | https://node-postgres.com/features/transactions
docs: Supabase docs | https://supabase.com/docs
docs: Neon docs | https://neon.tech/docs
---
SQLite is great, but most production web apps use a database **server**. When your API runs on a hosting platform, its disk may be wiped on every deploy, you may run several copies of the server at once, and you want backups you don't have to think about. **PostgreSQL** ("Postgres") is the most popular open-source choice, and free hosted versions make it easy to start. The SQL you know works almost unchanged.

## Getting a Postgres database

The quickest way is a free hosted database:

- **Neon**: "serverless" Postgres. The database goes to sleep when unused, so the first query after a break can take a moment.
- **Supabase**: Postgres plus extras like a table editor, authentication and file storage. Free projects are paused after a period of inactivity; you can restore them from the dashboard.

For either one: create a project, open its **SQL editor** in the dashboard to create tables, and copy the **connection string** it shows you. For development you can also run Postgres on your own machine; the next lesson, "Running Postgres locally with Docker", shows how. A hosted database stays the choice for production.

## What's different from SQLite

| Thing | SQLite | PostgreSQL |
|---|---|---|
| Auto-numbered id | `INTEGER PRIMARY KEY` | `INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY` |
| True/false | `0` / `1` | `BOOLEAN` (`true` / `false`) |
| Dates | `TEXT` | `DATE`, `TIMESTAMPTZ` |
| Current time | `CURRENT_TIMESTAMP` | `now()` |
| Case-insensitive match | `LIKE` | `ILIKE` |
| Placeholders in Node | `?` | `$1`, `$2`, … |
| Types | relaxed | strict |

A books table in Postgres looks like this:

```sql
CREATE TABLE books (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  year INTEGER CHECK (year > 0),
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## The connection string

A connection string contains everything needed to connect, **including the password**:

```bash
# .env
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```

Keep it in `.env` (which is in `.gitignore`) and start your app with `node --env-file=.env server.js`. On your hosting platform, set `DATABASE_URL` as an environment variable. If the string ever leaks (for example, you pushed it to GitHub), reset the database password in the dashboard straight away.

## Connecting with pg and a Pool

Install the driver with `npm install pg`, then create one **pool** for the whole app:

```js
// db/pool.js
import pg from "pg";

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
```

Opening a connection to a database server is slow, so a pool keeps a few connections open and lends one to each query. Test it:

```js
// test-db.js  (run: node --env-file=.env test-db.js)
import { pool } from "./db/pool.js";

const { rows } = await pool.query("SELECT now() AS time, version()");
console.log(rows[0]);
await pool.end(); // close the pool so the script can exit
```

## Queries with $1, $2 placeholders

`pool.query(sql, values)` is **asynchronous**: it returns a promise of a result with `rows` (an array of objects) and `rowCount` (the number of rows affected). Placeholders are numbered:

```js
// data/books.js  (PostgreSQL version)
import { pool } from "../db/pool.js";

export async function findById(id) {
  const { rows } = await pool.query("SELECT * FROM books WHERE id = $1", [id]);
  return rows[0]; // undefined if not found
}

export async function create({ title, year }) {
  const { rows } = await pool.query(
    "INSERT INTO books (title, year) VALUES ($1, $2) RETURNING *",
    [title, year ?? null]
  );
  return rows[0];
}

export async function remove(id) {
  const { rowCount } = await pool.query("DELETE FROM books WHERE id = $1", [id]);
  return rowCount > 0;
}
```

The SQL injection rule is exactly the same as before: values only through placeholders. The function names and signatures are the same as in the Express module, and your controllers already `await` them, so only `data/books.js` changes. In Express 5, a rejected promise in an `async` handler goes straight to your error middleware, so you don't need `try`/`catch` in every route.

## Transactions need one client

Each `pool.query` may use a *different* connection, and a transaction only works on one connection. So for transactions, borrow a client and use it for every statement:

```js
const client = await pool.connect();
try {
  await client.query("BEGIN");
  const { rows } = await client.query(
    "INSERT INTO books (title, year) VALUES ($1, $2) RETURNING id", [title, year]
  );
  for (const tagId of tagIds) {
    await client.query("INSERT INTO book_tags (book_id, tag_id) VALUES ($1, $2)", [rows[0].id, tagId]);
  }
  await client.query("COMMIT");
} catch (err) {
  await client.query("ROLLBACK");
  throw err;
} finally {
  client.release(); // always give the connection back
}
```

## Turning database errors into HTTP responses

Postgres errors have a `code` property. Four are worth handling in your error middleware:

| `err.code` | Meaning | Response |
|---|---|---|
| `23505` | unique violation (e.g. email taken) | 409 Conflict |
| `23503` | foreign key violation (e.g. unknown `author_id`) | 400 Bad Request |
| `23514` | check violation | 400 Bad Request |
| `22P02` | invalid input syntax (e.g. `abc` or `NaN` as an integer id) | 400 Bad Request |

If you validate `:id` with `IdParamSchema` as in the Express module, `22P02` should not happen, but the mapping is a good safety net.

## Common mistakes

- **Using `?` instead of `$1`** gives a syntax error from Postgres.
- **Numbers that arrive as strings.** `COUNT(*)` and `SUM()` return a big integer type, which `pg` gives you as a string (`"42"`) so no precision is lost. Cast in SQL (`COUNT(*)::int`) or convert with `Number()`.
- **Dates that shift by a day.** `pg` turns `DATE` columns into JavaScript `Date` objects, which can move across midnight because of time zones. If you just want the text, select `to_char(spent_on, 'YYYY-MM-DD')`.
- **Forgetting `client.release()`**, so the pool runs out of connections and the app freezes. Always release in `finally`.

## In short

- Postgres is a database server; Neon and Supabase host one for free.
- Keep `DATABASE_URL` in `.env`; create one `pg.Pool` for the whole app.
- `await pool.query(sql, [values])` with `$1, $2` placeholders; read `rows` and `rowCount`.
- Transactions use one client from `pool.connect()`, released in `finally`.

### Exercises
- Create a free Neon or Supabase project. In its SQL editor, create the `books` table above and insert 3 rows.
- Write `test-db.js` that connects with a pool, prints `SELECT now()` and then all books.
- Switch your Book Library API's `data/books.js` from SQLite to Postgres (with `db/pool.js`). Your controllers already `await` the data layer, so don't touch them: check that every endpoint still works.
- Add a `UNIQUE` constraint on book titles and make a duplicate `POST` return 409 by checking `err.code` in your error middleware.
- Deploy the API with `DATABASE_URL` set as an environment variable on your hosting platform.

---lesson
id: db-12
title: Running Postgres locally with Docker
time: 1.5h
video: Docker for beginners Postgres docker compose tutorial
docs: Docker: get started | https://docs.docker.com/get-started/
docs: Official postgres image | https://hub.docker.com/_/postgres
docs: Docker Compose docs | https://docs.docker.com/compose/
---
A hosted database is perfect for production, but for day-to-day development it has downsides: it needs internet, everyone on a team shares the same data, and you can't quickly wipe it and start fresh. Tests are worse: they need a database they can empty before every test, which you definitely don't want to do to your real one. **Docker** solves this by running a real PostgreSQL server on your own machine with one command, in the exact version you choose, and throwing it away just as easily.

## Images, containers and Docker Desktop

Docker runs programs in **containers**: isolated mini-environments that contain the program and everything it needs. A container is started from an **image**, a ready-made package published by someone else. The official `postgres` image contains a complete Postgres server, so you don't install Postgres on Windows at all.

Install **Docker Desktop** from docker.com (on Windows it uses WSL 2; the installer sets it up). Start Docker Desktop, then check in a terminal:

```bash
docker --version
docker run hello-world
```

The second command downloads a tiny test image and runs it. If it prints "Hello from Docker!", everything works. Docker Desktop must be running whenever you use `docker` commands.

## Starting Postgres with one command

```bash
docker run --name books-db -e POSTGRES_PASSWORD=devpass -e POSTGRES_DB=books -p 127.0.0.1:5432:5432 -d postgres:17
```

Piece by piece:

- `--name books-db` gives the container a name, so you can refer to it later.
- `-e POSTGRES_PASSWORD=devpass` and `-e POSTGRES_DB=books` are environment variables the image reads on first start: the password for the `postgres` user and a database to create.
- `-p 127.0.0.1:5432:5432` connects **your** port 5432 to the container's port 5432 (`yourPort:containerPort`), so programs on your computer can reach it at `localhost:5432`. The `127.0.0.1:` part means "only from this computer": without it, anyone on the same Wi-Fi could try to connect to a database whose password is `devpass`.
- `-d` runs it in the background ("detached").
- `postgres:17` is the image and its **tag** (version). Always pin a version, so the database doesn't change under you when a new major version comes out.

Your connection string is now:

```bash
# .env
DATABASE_URL=postgresql://postgres:devpass@localhost:5432/books
```

There's no `?sslmode=require` here: a local container doesn't use SSL. Your `pg.Pool` code from the previous lesson works unchanged.

## Everyday commands

| Command | What it does |
|---|---|
| `docker ps` | list running containers |
| `docker logs books-db` | show the server's log (useful when something fails) |
| `docker stop books-db` / `docker start books-db` | stop / start it again later |
| `docker exec -it books-db psql -U postgres -d books` | open a SQL prompt inside the container (`\dt` lists tables, `\q` quits) |
| `docker rm -f books-db` | delete the container |

## Keeping your data: volumes

A container's files disappear when the container is deleted. To keep the database's data, store it in a **volume**, a storage area Docker manages outside the container. Container names must be unique, so first delete the container from the previous step with `docker rm -f books-db`, then start a new one:

```bash
docker run --name books-db -e POSTGRES_PASSWORD=devpass -e POSTGRES_DB=books -p 127.0.0.1:5432:5432 -v books-data:/var/lib/postgresql/data -d postgres:17
```

`-v books-data:/var/lib/postgresql/data` means "keep the folder where Postgres 17 stores its data in a volume named `books-data`". Now you can delete and recreate the container and your tables are still there. (Newer major versions of the image may store data in a different folder; check the image's page on Docker Hub when you upgrade.)

## Docker Compose: the whole setup in one file

Typing long commands gets old. **Docker Compose** describes your containers in a file you commit with your project, so anyone can start the same setup with one command.

Two things first. Remove the container from the `docker run` steps (`docker rm -f books-db`), or Compose can't use port 5432. And make sure your schema file `db/migrations/001_init.sql` **exists** (it can start with just your `CREATE TABLE books …`), because Compose mounts it into the containers. Then create `compose.yaml` in the project root:

```yaml
services:
  db:
    image: postgres:17
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: devpass
      POSTGRES_DB: books
    ports:
      - "127.0.0.1:5432:5432"
    volumes:
      - db-data:/var/lib/postgresql/data
      - ./db/migrations/001_init.sql:/docker-entrypoint-initdb.d/01-init.sql:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d books"]
      interval: 2s
      retries: 15

  db-test:
    image: postgres:17
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: testpass
      POSTGRES_DB: books_test
    ports:
      - "127.0.0.1:5433:5432"
    volumes:
      - ./db/migrations/001_init.sql:/docker-entrypoint-initdb.d/01-init.sql:ro
    tmpfs:
      - /var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d books_test"]
      interval: 2s
      retries: 15

volumes:
  db-data:
```

What's new here:

- **Two databases.** `db` is for development (port 5432, data kept in the `db-data` volume). `db-test` is for automated tests (port 5433). Its data lives in `tmpfs`, which is memory: fast, and wiped every time the container stops. That's exactly what tests want.
- **`docker-entrypoint-initdb.d`.** Any `.sql` file mounted into this folder runs automatically the **first time** the database starts with an empty data folder. Mounting your schema file (`db/migrations/001_init.sql`, the SQL file that creates your tables; the Books API project uses this name) there means both databases get your tables without any manual step. `:ro` mounts it read-only.
- **`healthcheck`.** `pg_isready` asks Postgres whether it accepts connections yet. Compose uses it to know when the database is really ready, not just started. `--wait` only waits for services that *have* a healthcheck, which is why both databases get one.

Use it with:

```bash
docker compose up -d --wait   # start everything and wait until healthy
docker compose ps             # see the status
docker compose down           # stop and remove the containers (volume kept)
docker compose down -v        # also delete the volumes: a completely fresh start
```

Your `.env` points at the development database, and your tests use `postgresql://postgres:testpass@localhost:5433/books_test`. You'll use that second database in the Testing module.

## Common mistakes

- **"Port is already allocated"**: something else (often a Postgres you installed earlier) already uses 5432. Change your side of the mapping, `"127.0.0.1:5434:5432"`, and use port 5434 in your connection string. If the culprit is your own `books-db` container from the `docker run` steps, remove it with `docker rm -f books-db`.
- **"Connection refused" right after starting**: Postgres needs a few seconds to boot. Use `--wait` with a healthcheck, or check `docker logs`.
- **Changes to `001_init.sql` don't apply**: init scripts only run on an *empty* database. Run `docker compose down -v` and `up` again to recreate it (this deletes the dev data, so keep a seed script).
- **The schema file didn't exist when you ran `docker compose up`**: Docker then silently creates an empty *folder* named `001_init.sql`, and your tables never appear. Delete that folder, create the real file, then `docker compose down -v` and `up` again.
- **"The container name is already in use"**: you ran `docker run --name books-db` twice. Remove the old one with `docker rm -f books-db` (its volume and data are kept).
- **`sslmode=require` copied from the hosted URL**: the local server rejects SSL connections. Remove it.
- **Docker Desktop isn't running**: every command then fails with an error about the Docker daemon or engine.

## In short

- Docker runs a real Postgres in a container: `docker run ... postgres:17`, reachable at `localhost:5432`.
- Pin the image version, and store data in a volume so it survives the container.
- Put the setup in `compose.yaml`: `docker compose up -d --wait`, `down`, and `down -v` for a fresh start.
- Keep a separate, disposable test database (another port, `tmpfs`), and let `docker-entrypoint-initdb.d` create the tables.

### Exercises
- Install Docker Desktop and run `docker run hello-world`.
- Start Postgres 17 with `docker run` (with a volume), connect with `docker exec -it books-db psql -U postgres -d books`, create a table and insert a row. Delete the container with `docker rm -f books-db`, start a new one with the same volume, and check the row is still there.
- Create `compose.yaml` with the `db` and `db-test` services and your `db/migrations/001_init.sql`. Run `docker compose up -d --wait` and confirm both databases have your tables.
- Point your Book Library API's `.env` at the local database and check every endpoint works without internet. Then run `docker compose down -v` and `up` again, and run your seed script to restore the data.

---lesson
id: db-9
title: ORMs, query builders and migrations
time: 2h
video: Drizzle ORM crash course PostgreSQL
docs: Prisma docs | https://www.prisma.io/docs
docs: Drizzle ORM docs | https://orm.drizzle.team/docs/overview
---
Writing raw SQL strings works, but in a bigger app you write the same `SELECT`/`INSERT`/`UPDATE` patterns again and again, a renamed column means searching through strings, and you need a reliable way to apply schema changes to your laptop's database, a teammate's, and production. Two kinds of tools help: **ORMs and query builders** for writing queries, and **migrations** for changing the schema. Many real projects use them, so you should recognise them, but always remember: they generate SQL, and when something goes wrong, your SQL knowledge is what helps you understand it.

## Raw SQL, query builders and ORMs

| Approach | Example | You write |
|---|---|---|
| Raw SQL | `pg`, `node:sqlite` | SQL strings |
| Query builder / light ORM | Drizzle | JavaScript that looks like SQL |
| Full ORM | Prisma | A schema file, then method calls like `findMany()` |

An **ORM** (Object-Relational Mapper) maps tables to objects in your code. You describe your tables once, and the tool gives you functions to query them, often with editor autocompletion, which gets even better once you learn TypeScript later in this curriculum.

## Migrations

A **migration** is a file that describes one change to the schema: "create the books table", "add a rating column". Migrations are numbered or timestamped, committed to git, and applied in order:

```text
drizzle/
  0000_create_authors_and_books.sql
  0001_add_rating_to_books.sql
```

The migration tool remembers (in a table of its own) which migrations have already run, and only applies the new ones. So every database, from your laptop to production, can be brought to exactly the same schema with one command. The golden rule: **never edit a migration that has already run somewhere else.** Write a new one instead.

## Drizzle: schema in JavaScript

Install it with `npm install drizzle-orm pg` and `npm install -D drizzle-kit`. Then describe your tables:

```js
// db/schema.js
import { pgTable, integer, text, boolean } from "drizzle-orm/pg-core";

export const authors = pgTable("authors", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
});

export const books = pgTable("books", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  year: integer("year"),
  read: boolean("read").notNull().default(false),
  authorId: integer("author_id").notNull().references(() => authors.id),
});
```

The first argument of each column (`"author_id"`) is the real column name in the database; the object key (`authorId`) is the name you use in JavaScript. Next, a config file tells `drizzle-kit` where things are:

```js
// drizzle.config.js
import { defineConfig } from "drizzle-kit";

process.loadEnvFile(); // reads .env into process.env (built into Node 22+)

export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema.js",
  out: "./drizzle",
  dbCredentials: { url: process.env.DATABASE_URL },
});
```

`npx drizzle-kit generate` compares your schema with the previous migrations and writes a new SQL migration file into `drizzle/`. Open it: it's plain SQL you already understand. `npx drizzle-kit migrate` applies the pending migrations to the database. `drizzle-kit` isn't started with `--env-file`, so `process.loadEnvFile()` at the top of the config loads `DATABASE_URL` from your `.env` file. It throws an error if there is no `.env` file.

## Drizzle: queries

```js
// db/index.js
import { drizzle } from "drizzle-orm/node-postgres";
import { eq, gt, desc } from "drizzle-orm";
import { books, authors } from "./schema.js";

export const db = drizzle(process.env.DATABASE_URL);

const recent = await db
  .select()
  .from(books)
  .where(gt(books.year, 2000))
  .orderBy(desc(books.year));

const [created] = await db
  .insert(books)
  .values({ title: "Dune", year: 1965, authorId: 1 })
  .returning();

const withAuthors = await db
  .select({ title: books.title, author: authors.name })
  .from(books)
  .innerJoin(authors, eq(authors.id, books.authorId));
```

Read each one as SQL: `SELECT * FROM books WHERE year > 2000 ORDER BY year DESC`, an `INSERT … RETURNING *`, and a `JOIN`. Values are always sent as parameters, so SQL injection is handled for you.

## Prisma at a glance

Prisma uses its own schema language in a `schema.prisma` file:

```prisma
model Author {
  id    Int    @id @default(autoincrement())
  name  String
  books Book[]
}

model Book {
  id       Int    @id @default(autoincrement())
  title    String
  year     Int?
  author   Author @relation(fields: [authorId], references: [id])
  authorId Int
}
```

`npx prisma migrate dev --name init` creates and applies a migration, and Prisma generates a client for your models. Queries look like this:

```js
const books = await prisma.book.findMany({
  where: { year: { gt: 2000 } },
  include: { author: true },
  orderBy: { year: "desc" },
});
```

How you create the `prisma` client object has changed between Prisma versions, so follow the current Prisma quickstart for that part.

## Which one should you use?

Both are popular and either is a good choice. Drizzle stays close to SQL, so your SQL knowledge carries straight over. Prisma's queries read more like plain JavaScript objects and it hides more of the SQL. Plain `pg` with your own numbered `.sql` migration files is also a perfectly professional choice for small projects.

## Common mistakes

- **Learning the ORM instead of SQL.** When a query is slow or wrong, you need to read the SQL it generated. Both tools can log their queries; turn that on while learning.
- **Editing old migrations** instead of adding a new one, so databases get out of sync.
- **Using `push` in production.** `drizzle-kit push` and `prisma db push` change the database directly without migration files. That's handy for quick prototypes, but use migrations for anything real.
- **The N+1 problem**: loading 50 books, then running one extra query per book to get its author (51 queries). Use a join (`innerJoin` in Drizzle, `include` in Prisma) to get everything in one query.

## In short

- ORMs and query builders generate SQL from JavaScript; they save typing but don't replace SQL knowledge.
- Migrations are versioned, committed schema changes, applied in order by a tool.
- Drizzle: schema in JS, `drizzle-kit generate` + `migrate`, SQL-like queries.
- Prisma: `schema.prisma`, `prisma migrate dev`, object-style queries.

### Exercises
- On a new git branch of your Book Library API, set up Drizzle (or Prisma). Model `Author` and `Book`, generate the first migration, read the generated SQL, then apply it.
- Add a `Tag` model and a book–tag join table, and create a second migration. Check that both migration files are committed.
- Rewrite `findAll` and `findById` in `data/books.js` (including the author's name) with the ORM. Compare them with your raw SQL versions and write 3 sentences about which you prefer and why.
- Turn on query logging, load the books list, and find the exact SQL the ORM ran.

---lesson
id: db-11
title: (Optional) NoSQL with MongoDB
time: 1.5h
video: Net Ninja MongoDB tutorial
docs: MongoDB manual | https://www.mongodb.com/docs/manual/
docs: Mongoose docs | https://mongoosejs.com/docs/
---
Not every database uses tables. **MongoDB** is the most popular *document database*: it stores JSON-like documents, and many tutorials (especially "MERN stack" ones: MongoDB, Express, React, Node) use it. This lesson is optional. Relational databases remain the better default for most apps, but knowing how the document model works lets you follow those tutorials and choose the right tool with good reasons.

## Documents and collections

Instead of rows in tables, MongoDB stores **documents** in **collections**. A document is like a JavaScript object, and it can contain arrays and nested objects:

```json
{
  "_id": "6650f1c2a1b2c3d4e5f60718",
  "title": "Learn MongoDB",
  "tags": ["db", "nosql"],
  "comments": [
    { "author": "Ana", "text": "Nice!", "createdAt": "2026-11-20T10:00:00Z" },
    { "author": "Leo", "text": "Thanks", "createdAt": "2026-11-20T11:30:00Z" }
  ]
}
```

In SQL, those tags and comments would be separate tables and you'd need joins. Here they live inside the note. Every document gets a unique `_id` (an *ObjectId*) automatically.

| SQL | MongoDB |
|---|---|
| database | database |
| table | collection |
| row | document |
| column | field |
| `JOIN` | embedding, or `$lookup` |
| `CREATE TABLE` with a schema | no schema required (Mongoose adds one) |

## Embedding or referencing?

This is *the* design question in MongoDB:

- **Embed** data that belongs to the parent and is always loaded with it: a note's comments, an order's items. One read gets everything.
- **Reference** (store another document's `_id`) when the data is shared, large or grows without limit: a note's author is a user who has many notes. A single document can be at most 16 MB, so never embed a list that keeps growing forever.

## Setting up Atlas

**MongoDB Atlas** offers a free cluster. Create one, add a database user with a password, allow your IP address under *Network Access*, and copy the connection string (it starts with `mongodb+srv://`). Put it in `.env` as `MONGODB_URI`.

## Mongoose: schemas for MongoDB

MongoDB itself doesn't enforce structure, so most Node apps use **Mongoose** (`npm install mongoose`), which adds schemas, validation and handy query methods:

```js
// models/note.js
import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    tags: [String],
    comments: [
      {
        author: { type: String, required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true } // adds createdAt and updatedAt to each note
);

export const Note = mongoose.model("Note", noteSchema);
```

Connect once when your server starts:

```js
import mongoose from "mongoose";
await mongoose.connect(process.env.MONGODB_URI);
```

## CRUD with Mongoose

```js
import { Note } from "./models/note.js";

const note = await Note.create({ title: "Learn Mongo", tags: ["db"] });

const dbNotes = await Note.find({ tags: "db" }).sort({ createdAt: -1 }).limit(10);
const one = await Note.findById(note._id);

const updated = await Note.findByIdAndUpdate(
  note._id,
  { $push: { comments: { author: "Ana", text: "Nice!" } } },
  { new: true } // return the updated document, not the old one
);

await Note.findByIdAndDelete(note._id);
```

Filters are objects. `{ tags: "db" }` matches notes whose `tags` array contains `"db"`. Operators start with `$`: `{ views: { $gt: 100 } }` means "views greater than 100", like `WHERE views > 100`.

## A different kind of injection

Placeholders aren't needed in MongoDB, but a similar attack exists. If you pass `req.body.email` straight into a filter and the attacker sends `{ "email": { "$ne": null } }` instead of a string, the filter matches *any* user. Validate input types (for example with Zod, as in the Express module), so that values you expect to be strings really are strings.

## When to choose which

Choose **MongoDB** when your data is naturally a tree of nested documents, the shape varies a lot between records, and you rarely need to combine collections. Choose **PostgreSQL** (the usual answer) when your data has many relationships (users, orders, products, reviews), you need joins, reports and transactions across tables, and you want the database to enforce the rules.

## Common mistakes

- **Forgetting Atlas network access**: the connection times out until your IP address is allowed.
- **Invalid ids.** `Note.findById("abc")` throws a `CastError` because `"abc"` isn't a valid ObjectId. Turn that into a 404 or 400 response.
- **Embedding lists that grow forever** (all of a user's messages in the user document).
- **Treating MongoDB like SQL** and referencing everything, then needing joins everywhere. If that happens, a relational database fits your data better.

## In short

- MongoDB stores JSON-like documents in collections; documents can nest arrays and objects.
- Embed what belongs together and is read together; reference what's shared or grows without limit.
- Mongoose adds schemas and validation: `Model.create`, `find`, `findById`, `findByIdAndUpdate`, `findByIdAndDelete`.
- Relational is the better default for related data; MongoDB fits document-shaped data.

### Exercises
- Create a free Atlas cluster and connect to it from a small Node script with Mongoose. Log "connected" and disconnect.
- Create the `Note` model and store 5 notes with embedded comments. Query the notes tagged `db`, newest first.
- Find all notes with more than 2 comments. (Hint: look up how to check whether an array element at a certain position exists, or the `$size` operator, in the MongoDB manual.)
- Write a short comparison (5–8 sentences) of how you'd store your Book Library's books, authors and tags in MongoDB versus PostgreSQL, and which you'd pick.

---project
id: db-p1
title: Books API with a real database
summary: Upgrade your Express Book Library API from an in-memory array to PostgreSQL, with authors, tags, migrations and a seed script.
---
### The task
Your Book Library API from the Express module keeps its books in an array, so everything disappears on restart, and the author is just a text field. Now you'll give it a real PostgreSQL database with proper relations: authors and tags become their own tables, books link to them, and the whole thing runs on a free hosted database. This is the same upgrade real projects go through when a prototype becomes a product.

### What it must do
- Tables: `authors(id, name, born)`, `books(id, title, year, genre, pages, read, author_id → authors, created_at)`, `tags(id, name UNIQUE)`, and `book_tags(book_id, tag_id)` with a composite primary key
- All previous endpoints still work: list with `?search=`, `?genre=`, `?read=`, `?page=` and `?limit=` (returning `{ data, page, limit, total }`), get by id, create, partial update and delete, with the same validation and error format as before
- Books are returned with their author and tags, for example `{ id, title, year, genre, pages, read, author: { id, name }, tags: ["sci-fi", "space"] }`. Creating or updating a book takes `authorId` and an optional array of `tagIds` (document this change in the README)
- New endpoints: `GET /api/authors`, `GET /api/authors/:id/books` and `GET /api/tags/:name/books`
- Every query uses placeholders (or an ORM). No user input is ever glued into SQL text
- Creating a book together with its tags happens in a transaction
- Database errors become proper responses: unknown `authorId` gives 400, a duplicate tag name gives 409
- A schema/migration file and a seed script (`npm run db:seed`) that creates at least 30 books, 10 authors and 8 tags, and can be run repeatedly
- Indexes on `books(author_id)` and `book_tags(tag_id)`
- Hosted on Neon or Supabase, with `DATABASE_URL` in `.env` locally and as an environment variable in production

### Steps
1. Draw the ER diagram on dbdiagram.io and add the image to the README. Create a Neon or Supabase project (for development you can use your local Docker database from "Running Postgres locally with Docker" instead), put `DATABASE_URL` in `.env`, add `db/pool.js` (or your ORM setup), and check the connection with a `SELECT now()` script.
2. Write the schema: either `db/migrations/001_init.sql`, run in the SQL editor (on Docker: run `docker compose down -v` and `up -d --wait` so the init script creates the tables), or ORM schema + first migration. Include the constraints and the two indexes. Check the tables exist.
3. Write `db/seed.js` and add `"db:seed": "node --env-file=.env db/seed.js"` to `package.json`. Empty the tables first so the script can run again, then insert authors, tags, books and links. Run it twice and check the counts.
4. Rewrite the read functions in `data/books.js`: `findById` (with author and tags), then `findAll` with search, filters and pagination, still returning `{ data, total }`. Test with your saved Thunder Client/Postman requests.
5. Rewrite `create`, `update` and `remove`. Use a transaction for "insert book + insert its tags" (and for "replace the tags" on update). Map Postgres error codes to 400/409 in your error middleware.
6. Add the authors and tags endpoints. Test each, including a 404 for an unknown author or tag.
7. Run `EXPLAIN ANALYZE` on `GET /api/authors/:id/books`'s query with and without the `author_id` index, and note the result in the README.
8. Deploy: set `DATABASE_URL` on your hosting platform to your Neon/Supabase connection string (your local `.env` can keep pointing at Docker), run the schema and seed against the hosted database, and test the live URL. Update the README with setup steps and the new endpoint table.

### Hints
- Your controllers already `await` the functions in `data/books.js` (`findAll`, `findById`, `create`, `update`, `remove`), so only the inside of that file changes. The new endpoints get their own `data/authors.js` and `data/tags.js`.
- To empty tables in Postgres in one statement and restart the ids: `TRUNCATE book_tags, books, tags, authors RESTART IDENTITY CASCADE;`
- Optional filters: build the `WHERE` from two arrays. Push each value, and a condition that uses the array length as the placeholder number. Only your own fixed strings go into the SQL text:

```js
const conditions = [];
const values = [];
if (genre) {
  values.push(genre);
  conditions.push(`b.genre = $${values.length}`);
}
const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
```

- Search by title or author: `WHERE b.title ILIKE $1 OR a.name ILIKE $1` with the value `%${search}%`. The total for pagination is a second query with the same `WHERE` and `SELECT COUNT(*)::int AS total`.
- Book with its tags in one query (Postgres): `LEFT JOIN` the tags, then `GROUP BY b.id, a.id` and use `COALESCE(json_agg(t.name) FILTER (WHERE t.id IS NOT NULL), '[]') AS tags`. Two simple queries (one for the book, one for its tags) are also completely fine.
- Error codes: `23503` is a foreign key violation, `23505` a unique violation.

### Stretch goals
- Full-text search with Postgres `tsvector`, or fast `ILIKE` searching with the `pg_trgm` extension and a trigram index.
- Soft delete: a `deleted_at` column instead of really deleting rows, and all queries ignoring deleted books.
- Build the same project on a second branch with Drizzle or Prisma, and compare.
- Reviews: `reviews(id, book_id, rating, body)` and an average rating on every book.

### Done when
- All old endpoints work against PostgreSQL, and books come back with their author and tags
- The authors and tags endpoints work, including 404s for unknown ids or names
- `npm run db:seed` can be run repeatedly and creates 30+ books
- No SQL string contains user input (only placeholders or ORM calls)
- Creating a book with tags is a transaction, and an invalid tag id leaves no half-created book behind
- The API is deployed with a hosted database, and the README contains the ER diagram, setup steps and endpoints
- `.env.example` lists every environment variable with placeholder values, and `.env` is git-ignored

---project
id: db-p2
title: Expense Tracker
summary: A full-stack app to log what you spend, organise it in categories and see monthly reports and charts.
---
### The task
Build a personal finance app: people sign up, log their expenses, put them in categories, and see where their money goes each month. It combines everything from this module and the Express module: authentication, a relational schema with constraints, user-scoped queries, `GROUP BY` reports, and a plain HTML/CSS/JavaScript frontend with charts. You can reuse the authentication code from your Private Journal project, so you can focus on the data.

### What it must do
- Users register and log in with email and password (bcrypt + session cookie, as in the Private Journal project), now stored in the database
- Tables: `users`, `categories(id, user_id, name)` with `UNIQUE (user_id, name)`, and `expenses(id, user_id, category_id, amount_cents, note, spent_on, created_at)`
- Money is stored as integer cents with `CHECK (amount_cents > 0)`; `spent_on` is a date
- Categories CRUD: `GET/POST /api/categories`, `PATCH/DELETE /api/categories/:id`. New users get a few default categories (Food, Transport, Housing, Fun)
- Expenses CRUD: `GET/POST /api/expenses`, `PATCH/DELETE /api/expenses/:id`. The list supports `?month=2026-11` and `?category=3`, newest first, and includes the category name
- Every query is limited to the logged-in user. Another user's expense or category gives 404, and an expense can only use the user's own categories
- `GET /api/reports/monthly?year=2026` returns the total per month, e.g. `[{ "month": "2026-10", "totalCents": 84250 }, …]`
- `GET /api/reports/categories?month=2026-11` returns the total per category for that month
- Frontend (plain HTML, CSS and JavaScript served by Express): register/login, an add-expense form, the expense list with month and category filters and a delete button, and two charts made with [Chart.js](https://www.chartjs.org/docs/latest/): a pie chart per category and a bar chart per month
- Input validated with Zod; all SQL uses placeholders (or an ORM)

### Steps
1. Create the project and copy over the auth parts of your Private Journal (session setup, `requireAuth`, register/login/logout/me routes). Create a Postgres database (Neon or Supabase, or your local Docker one for development), put `DATABASE_URL` and `SESSION_SECRET` in `.env`, and test the connection.
2. Write the schema (SQL migration or ORM): `users`, `categories` and `expenses` with all constraints, foreign keys with deliberate `ON DELETE` rules, and an index on `expenses(user_id, spent_on)`. Insert a test row by hand in the SQL editor.
3. Move auth to the database: register inserts a user (duplicate email gives 409 via error code `23505`), login looks the user up by email. In the same transaction as the new user, insert the default categories. Test with Thunder Client/Postman.
4. Build categories CRUD, always with `WHERE user_id = $…`. Decide what happens when a category that still has expenses is deleted (refuse with 409, or move them to "Other") and implement it. If you refuse with `ON DELETE RESTRICT`, Postgres throws `23503`, which your global error handler turns into 400: catch `23503` in this route and answer 409 yourself.
5. Build expenses CRUD with Zod validation and the list filters. Check that the `category_id` belongs to the logged-in user before inserting or updating.
6. Write the two report queries in the SQL editor first, check the numbers by hand on a few rows, then expose them as endpoints.
7. Build the frontend: a login/register page and a dashboard page with the form, the filters and the expense list. Format money only in the browser.
8. Add the two Chart.js charts to the dashboard, fed by your report endpoints, and update them when an expense is added or deleted.
9. Write a seed script that creates a demo user with 3 months of realistic expenses. Deploy, take screenshots for the README, and describe the schema and endpoints.

### Hints
- Group by month in Postgres with `to_char(spent_on, 'YYYY-MM')` or `date_trunc('month', spent_on)`. (In SQLite: `strftime('%Y-%m', spent_on)`.)
- For one month, filter a date range rather than formatting every row: `spent_on >= $2 AND spent_on < $3`, with the first day of the month and the first day of the next month. That range can use your `(user_id, spent_on)` index.
- `SUM()` comes back from `pg` as a string. Write `SUM(amount_cents)::int` in SQL, or convert with `Number()`.
- `pg` turns `DATE` columns into JavaScript `Date` objects, which can shift by a day in JSON. Select `to_char(e.spent_on, 'YYYY-MM-DD') AS spent_on` to get plain text back.
- Accept amounts from the form as text like `12.50` and convert with `Math.round(Number(value) * 100)` on the server; show them with `(cents / 100).toFixed(2)`.
- A chart needs a `<canvas>` element, `labels` and one dataset of numbers. helmet's default Content Security Policy blocks scripts from other sites, so a Chart.js `<script>` from a CDN won't load. Serve it yourself instead: `npm install chart.js` and `app.use("/vendor", express.static("node_modules/chart.js/dist"))`, then load `/vendor/chart.umd.js` (or download that file into `public/`). The other option is to allow the CDN in helmet's `contentSecurityPolicy` settings.

### Stretch goals
- A monthly budget per category, with a warning when you've spent more than 80% of it.
- CSV export of a month's expenses.
- Recurring expenses (rent, subscriptions) that are added automatically each month.
- Store sessions in Postgres (for example with `connect-pg-simple`) so logins survive server restarts.
- Rebuild the frontend in React after the React module.

### Done when
- Two users in two browsers each see only their own categories, expenses and reports
- Expenses can be added, edited, filtered by month and category, and deleted
- Both report endpoints return correct totals (checked by hand against a few rows)
- The dashboard shows a pie chart per category and a bar chart per month
- Money is stored as integer cents and every query uses placeholders or an ORM
- The app is deployed with a hosted database and a demo user, and the README has screenshots
- `.env.example` lists every environment variable with placeholder values, and `.env` is git-ignored

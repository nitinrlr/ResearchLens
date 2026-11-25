# ResearchLens

A place for computer science students to discover, organize and understand research papers. It holds 50,000 open-access CS papers, each with an estimated difficulty and reading time.

## Features

- **Discover:** search titles, abstracts, authors and topics, or filter by a topic pill.
- **Paper pages:** read the PDF in the page, and ask Lens, the AI assistant, about the paper or any passage you highlight.
- **Difficulty and reading time:** every paper is rated 1–5 from its abstract, with a one-line reason, and reading time comes from its page count.
- **Continue Reading:** papers are tracked when you open them, most recent first.
- **Collections:** a default Saved collection, plus your own with a title, description and color.
- **Goals:** pick a role, such as Machine Learning Engineer, and work through its skill tree of concepts and the papers that teach them.
- **Planned:** semantic search and paper comparison.

## Tech stack

- **App:** Next.js 16 (App Router, Server Actions), React 19, TypeScript
- **UI:** Tailwind CSS 4, Radix Themes, GSAP for the landing page, React-PDF for the reader
- **Data:** PostgreSQL on Neon, Prisma 7
- **Auth:** Auth.js (credentials)
- **AI:** Google Gemini, for the paper chat and difficulty ratings
- **Paper data:** OpenAlex
- **Tests:** Vitest

## Running it locally

1. Copy `.env.example` to `.env` and fill in `DATABASE_URL`, `AUTH_SECRET`, `GEMINI_API_KEY` and, optionally, `OPENALEX_API_KEY`.
2. Install and set up the database:
   ```bash
   npm install
   npx prisma migrate deploy
   ```
3. Start the app at http://localhost:3000:
   ```bash
   npm run dev
   ```

`npm test` runs the tests and `npm run lint` checks the code. The scripts that import papers, count pages and rate difficulty are described in [src/scripts/README.md](src/scripts/README.md).

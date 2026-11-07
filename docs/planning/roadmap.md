# ResearchLens Roadmap

Last updated: 2026-11-05

## Goal

**v1** is a deployed app that works end to end: Phases 1–4 below.
**v2** adds the AI features: Phase 5.

A working live link is worth more than a half-built AI feature on localhost, so v1 ships first.

## Where things stand

**Built**

- Register, login and logout, with the user id stored in the session and a profile menu
- Explore, which searches title, abstract, author and topic
- Paper detail page with an embedded PDF where one is available
- Continue Reading, which tracks papers automatically when you open them
- Collections: a default "Saved" collection plus custom ones you can create and delete, and remove papers from
- Landing page (light theme) that sends signed-in users to `/explore`
- OpenAlex import script: 1,000 papers across 47 CS topics

**Gaps**

- Goals is a static stub; Settings is a placeholder
- Difficulty is a placeholder: OpenAlex has no difficulty data, so every paper shows 1/5
- No tests
- Not deployed
- README lists the OpenAI API, which isn't in the project yet

## Phase 1: Make what exists real

- [x] **1. Import a few hundred papers.** Done: 1,000 papers across 47 topics, with abstracts and page-based reading times. The script's list has a few topics that aren't fully imported yet. See `src/scripts/README.md`.
- [x] **1a. Paginate Explore.** Done: 25 per page with numbered links. Page loads went from about 1–1.8s to about 0.4s.
- [x] **2. Add papers to custom collections.** Done: the bookmark opens a picker listing every collection as a checkbox, on paper cards and the paper page.
- [ ] **3. Decide what to do with Goals.** Build it (the schema already supports it) or hide it from the sidebar until it's built.
- [x] **4. Fix unsave on the collection page.** Done: the page refreshes when the picker closes, so a removed card disappears.

## Phase 2: Light theme conversion

- [x] **5. Convert the dashboard and auth screens to white and blue.** Done: every color comes from tokens in `src/app/globals.css`, and the dark-mode block is gone. The accent is now Radix's indigo, which gives white button text enough contrast.
- [x] **6. Pick a component library.** Chose Radix Themes over shadcn/ui. The picker, user menu, buttons, inputs and a delete confirmation use it; cards and page layouts still use Tailwind.
- [x] **6a. Move cards and page layouts to Radix Themes.** Cards, topic badges, page headings and text, and the Profile details now use Radix. Layout and the sidebar stay in Tailwind.

Phase 2 comes before Phase 3 so the loading and error pages are only built once.

## Phase 3: Polish

- [x] **7. Add `loading.tsx`, `error.tsx` and `not-found.tsx`.** Done: skeleton loading screens, error screens with a Try again button, and not-found pages, inside and outside the dashboard.
- [x] **8. Show save failures to the user.** Toasts for the bookmark and Remove buttons, inline errors in the create and delete forms.
- [x] **9. Give each page its own title.** Paper and collection pages use their own names.
- ~~[ ] 10. Add experience level to Settings. `User.experienceLevel` already exists and nothing uses it yet.~~
- [x] **11. Write a few real tests.** Vitest on the service layer, starting with the collection ownership checks.
- [x] **12. Final pass on the landing page.** Done: the claims match the app, real papers are previewed, the tiles use Radix, and the favicon is ours. The paper count in the headline is written by hand, so update it after big imports.
- [ ] **12a. Rebuild the landing page around motion.** Code lives in `src/components/landing/`.
  - [x] Libraries (GSAP, Lenis), colors and smooth scrolling.
  - [x] Ribbed-glass background, glass nav and hero.
  - [x] Falling papers prototype, built with CSS 3D. Switch to Three.js only if it doesn't feel 3D enough.
  - [x] One-size white sheet, with the glass nav readable over it.
  - [ ] Hover reveal section with four feature mock-ups.
  - [ ] Mobile, reduced motion, accessibility and a speed check.

## Phase 4: Ship v1

- [ ] **13. Deploy to Vercel.** Set `DATABASE_URL`, `AUTH_SECRET` and `OPENALEX_API_KEY`, run `prisma migrate deploy` during the build, fix the SSL-mode warning in the connection string, and add a link-preview image and `metadataBase` once the domain is known.
- [ ] **14. Rate-limit login and register.**
- [ ] **15. Make the docs match reality.** Fix the README's stack list and fill in `docs/planning/`.

## Phase 5: AI features (v2)

In order of difficulty; each builds on the one before.

- [ ] **16. AI summaries.** Explain a paper at the user's experience level and cache the result in the database. Also use the model to estimate difficulty and fix reading times. The provider is still open; the README says OpenAI, but nothing is wired up.
- [ ] **17. Semantic search.** Embeddings stored with pgvector on Neon.
- [ ] **18. Q&A over a paper (RAG).** Extract PDF text, split it into chunks, retrieve the relevant ones, answer from them.
- [ ] **19. Paper comparison.** Easy once summaries exist.

## Open decisions

- **Goals:** build it in v1, or hide it until later?
- **v1 scope:** confirm Phases 1–4 for v1, with AI as v2.

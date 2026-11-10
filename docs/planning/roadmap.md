# ResearchLens Roadmap

Last updated: 2026-11-09

## Goal

**v1** is a deployed app that works end to end, with the AI features and Goals included. Everything is built first (Phases 1–4), then shipped (Phase 5).

## Where things stand

**Built**

- Register, login and logout, with the user id stored in the session and a profile menu
- Explore, which searches title, abstract, author and topic
- Paper detail page with an embedded PDF where one is available
- Continue Reading, which tracks papers automatically when you open them
- Collections: a default "Saved" collection plus custom ones you can create and delete, and remove papers from
- Animated landing page that sends signed-in users to `/explore`, and a metallic glass design across the app
- OpenAlex import script: the 50,000 most-cited English open-access CS papers
- Vitest tests for the collection ownership checks, Server Actions and pagination

**Gaps**

- Goals is a static stub; Settings is a placeholder
- Difficulty is a placeholder: OpenAlex has no difficulty data, so every paper shows 1/5
- Not deployed
- README lists the OpenAI API, which isn't in the project yet

## Phase 1: Make what exists real

- [x] **1. Import papers at scale.** Bulk importer and a full-text search index. Imports the most-cited English open-access CS papers, skipping duplicates and incomplete records. See `src/scripts/README.md`.
- [x] **1a. Paginate Explore.** Done: 25 per page with numbered links. Page loads went from about 1–1.8s to about 0.4s.
- [x] **2. Add papers to custom collections.** Done: the bookmark opens a picker listing every collection as a checkbox, on paper cards and the paper page.
- [x] **3. Decide what to do with Goals.** Decided: build it with the AI features, in step 17.
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
  - [x] Hover reveal section with four feature mock-ups.
  - [ ] Mobile, reduced motion, accessibility and a speed check.
- [x] **12b. Bring the metallic glass design to the rest of the app.** Every dashboard page uses the frozen background and frosted panels. Login and register still use the light design.

## Phase 4: AI features and Goals

In order of difficulty; each builds on the one before.

- [x] **13. Paper chat.** Built with Gemini's free tier: full paper for typed questions, abstract plus the passage for "Ask AI" on highlighted abstract text, 30 messages a day, and saved starter answers. About 64% of PDFs can be read; the rest fall back to the abstract. Next: "Ask AI" inside the PDF itself needs our own PDF viewer (PDF.js).
  Original plan: A chat panel beside the PDF that answers questions from the paper, and says when something isn't in it. Starter buttons such as "Explain this simply" replace AI summaries, and their answers are saved per paper so common requests only run once. First test how many PDF links can actually be read, and fall back to the abstract when one can't. Signed-in users only, with a daily message limit. Chats stay in the browser at first. The provider is still open, Gemini's free tier is the likely start.
- [ ] **14. Semantic search.** Embeddings stored with pgvector on Neon.
- [ ] **15. Difficulty and reading time.** Estimate difficulty from each abstract. Reading time needs a real page count from the PDF.
- [ ] **16. Paper comparison.** Reads the two papers directly.
- [ ] **17. Build Goals.** Replace the placeholder page. The `Goal` and `GoalTopic` tables already exist.

## Phase 5: Ship v1

- [ ] **18. Deploy to Vercel.** Set `DATABASE_URL`, `AUTH_SECRET`, `OPENALEX_API_KEY` and the AI provider's key, run `prisma migrate deploy` during the build, fix the SSL-mode warning in the connection string, and add a link-preview image and `metadataBase` once the domain is known.
- [ ] **19. Rate-limit login and register.** Include the AI endpoints, since each call costs money.
- [ ] **20. Make the docs match reality.** Fix the README's stack list.

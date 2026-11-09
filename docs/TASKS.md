# Implementation Task Breakdown (`docs/TASKS.md`)

This document provides the sequential, dependency-ordered execution checklist for building and verifying **NetQuest: Protocol Architect** end-to-end in a single continuous run.

> **Important Execution Guidelines:**
> - Build inside `app/` using Next.js (App Router) and `pnpm`. Do **not** create `service/` or `aggregator/` (see [ADR-001](./DECISIONS.md)).
> - For environment setup and package management, refer to [`AGENTS.md`](../AGENTS.md) or standard Next.js / pnpm workflows.

---

## Phase 1: Project Scaffolding & Core Data Pipeline

### [ ] Task 1: Initialize Next.js Application (`app/`) & Tooling
- **Goal:** Set up the `app/` Next.js project with TypeScript, Tailwind CSS, Framer Motion (`motion`), Zustand, Lucide icons, and Vitest.
- **Files to Create/Configure:**
  - `.gitignore` / `app/.gitignore` (ensure `node_modules/`, `.next/`, `out/`, `coverage/`, `app/.data/`, and `*.tsbuildinfo` are ignored)
  - `app/package.json` (scripts: `dev`, `build`, `start`, `test`)
  - `app/tsconfig.json`, `app/next.config.ts`, `app/postcss.config.mjs`
  - `app/vitest.config.ts`
  - `app/src/app/globals.css` (dark theme variables, cyber-grid subtle backdrop, custom scrollbars)
  - `app/src/lib/utils.ts` (`cn` class merger)
- **Acceptance Criteria:**
  - Dependencies install cleanly via `pnpm install`.
  - `@/*` path alias resolves to `app/src/*`.

### [ ] Task 2: Domain Types & `Lectures.json` Normalizer Pipeline
- **Goal:** Define the TypeScript interfaces and build the `Lectures.json` parser & slide-text de-duplicator.
- **Files to Create:**
  - `app/src/types/curriculum.ts` (all interfaces defined in [`docs/ARCHITECTURE.md`](./ARCHITECTURE.md#4-core-domain-models-srctypescurriculumts))
  - `app/src/lib/lecture-parser.ts`:
    - Loads [`c:\Dev\Network Study\Lectures.json`](../Lectures.json) (either via relative import or `fs` in Server Components / API routes, plus a synced JSON import so client bundles and Vitest work seamlessly).
    - Implements `deduplicateSlideText(raw: string)` to remove consecutive duplicated phrases in Lectures 4, 11, and 14.
    - Implements `parseLectureSlides(rawContent: string)` to split slide bullets (``, ``, ``, ``, ``, `•`) into clean `NormalizedSlideBlock[]`.
- **Acceptance Criteria:**
  - All 14 lectures from `Lectures.json` load with exact indices `1..14`.
  - `deduplicateSlideText` cleanly removes repeated slide shadow strings (e.g., `"Local Area Networks. Local Area Networks"` → `"Local Area Networks."`) while preserving technical terms and numbers.

### [ ] Task 3: Author Complete 14-Lecture Structured Curriculum Dataset
- **Goal:** Create rich, accurate pedagogical data for all 14 lectures mapped across the 5 Network Operations Sectors (zero stubs or placeholders).
- **Files to Create:**
  - `app/src/data/curriculum/sector1-foundations.ts` (Lectures 1 & 2)
  - `app/src/data/curriculum/sector2-area-nets.ts` (Lectures 3 & 4)
  - `app/src/data/curriculum/sector3-internet.ts` (Lectures 5, 6, & 7)
  - `app/src/data/curriculum/sector4-transport.ts` (Lectures 8, 9, & 10)
  - `app/src/data/curriculum/sector5-security.ts` (Lectures 11, 12, 13, & 14)
  - `app/src/data/index.ts` (exports `CURRICULUM_MODULES`, `SECTORS`, and lookup helpers `getLectureById`, `getAllFlashcards`, `getAllQuizQuestions`)
- **Acceptance Criteria:**
  - Every lecture (`1` through `14`) contains:
    - `4–6` detailed `ConceptCard` objects with `keyPoints`, `examTip`, `formulaOrSpec`, and optional `comparisonTable` matching the exact metrics in [`docs/PRD.md`](./PRD.md#3-complete-14-lecture-curriculum-mapping-lecturesjson).
    - `1` complete `LabConfig` (`HeaderAssemblerConfig`, `SequenceSimulatorConfig`, `TopologyLabConfig`, or `MatrixArenaConfig`).
    - `6–8` `Flashcard` items (`84–112` total flashcards across the 14 lectures).
    - `5–6` `QuizQuestion` items (`70–84` total quiz questions across the 14 lectures).

> **Git Milestone 1 Checkpoint:** Stage and commit Phase 1 (`git add . && git commit -m "feat(data): scaffold Next.js app and add 14-lecture normalized curriculum"`).

---

## Phase 2: State Management, Spaced Repetition, Audio & Persistence

### [ ] Task 4: SM-2 Scheduler, Web Audio Synthesizer, Zustand Store & `/api/progress`
- **Goal:** Implement the core game progression store, SM-2 flashcard math, procedural audio feedback, and local disk backup endpoint.
- **Files to Create:**
  - `app/src/lib/srs.ts` (`createInitialSRSState`, `rateCard`, `isCardDue`)
  - `app/src/lib/sound.ts` (Web Audio API synth: `playClick`, `playSnap`, `playSuccess`, `playError`, `playLevelUp` — safe no-op in SSR/test environments)
  - `app/src/store/useProgressStore.ts` (Zustand store with `localStorage` persistence + debounced sync to `/api/progress`, tracking `xp`, `streakDays`, `audioMuted`, `lectureProgress` map for lectures 1–14, `srsState` map, `blitzHighScore`, `exportSaveJson`, `importSaveJson`, `resetProgress`)
  - `app/src/app/api/progress/route.ts` (`GET` reads `app/.data/progress.json` if present; `POST` writes JSON state to `app/.data/progress.json`)
  - `app/src/app/api/lectures/route.ts` (`GET` returns the 14 normalized lectures + curriculum summary)
- **Acceptance Criteria:**
  - `srs.ts` accurately computes next intervals and clamps `easeFactor >= 1.3`.
  - Store actions (`markBriefingRead`, `markLabCompleted`, `recordQuizScore`, `reviewCard`) award XP and compute Architect Rank accurately.

### [ ] Task 5: Root Layout, Command HUD (`NavbarHUD`), & Campaign Skill Tree (`/`)
- **Goal:** Build the persistent navigation HUD, Save/Load modal, and the 5-Sector / 14-Lecture Campaign Dashboard.
- **Files to Create:**
  - `app/src/components/layout/NavbarHUD.tsx` (links to `Campaign (/)`, `Packet Sandbox (/sandbox)`, `Memory Vault (/vault)`, `Exam Blitz (/blitz)`; displays current Rank badge, XP progress bar, Due SRS Card badge count, Audio Mute button, and Save/Load modal trigger)
  - `app/src/components/layout/SaveDataModal.tsx` (Export JSON, Import JSON, Reset Progress)
  - `app/src/app/layout.tsx`
  - `app/src/app/page.tsx` (Hero Architect status banner, Quick-Launch cards for Due Flashcards & Sandbox, and the 5 Sector sections containing the 14 Lecture Mission cards with mastery progress bars and status badges)
- **Acceptance Criteria:**
  - All 14 lecture cards render on `/` with `data-testid="lecture-card-{id}"` (`1` to `14`).
  - Clicking any lecture card navigates to `/lecture/[id]`.

> **Git Milestone 2 Checkpoint:** Stage and commit Phase 2 (`git add . && git commit -m "feat(core): implement SRS store, local disk sync, and campaign dashboard"`).

---

## Phase 3: The 3-Stage Lecture Hub & 4 Interactive Simulation Engines

### [ ] Task 6: Stage 1 — Concept Briefing & Cleaned Source Slide Inspector
- **Goal:** Build the lecture reading and exploration components.
- **Files to Create:**
  - `app/src/components/lecture/ConceptBriefing.tsx` (renders OSI layer pills, Concept Cards, formula/spec callouts, comparison tables, and a *"Mark Briefing Complete (+50 XP) & Launch Protocol Lab"* CTA button)
  - `app/src/components/lecture/SlideInspector.tsx` (renders the de-duplicated slide blocks from `Lectures.json`, includes a live search input `data-testid="slide-search-input"` that filters and highlights matching terms, plus a toggle to view raw vs. cleaned slide blocks)
- **Acceptance Criteria:**
  - Users can read structured mental models or inspect the cleaned `Lectures.json` slide blocks and filter by keyword.

### [ ] Task 7: Stage 2 — The 4 Reusable Interactive Protocol Lab Engines
- **Goal:** Implement the 4 data-driven simulation engines and the `LabDispatcher`.
- **Files to Create:**
  - `app/src/components/engines/HeaderAssembler.tsx`:
    - Interactive PDU slot builder (click or drag protocol header fields into bit/byte slots in order) + interactive parameter tasks (e.g., CIDR subnetting, IPv6 compression, EUI-64 bit flip, 802.1Q VLAN tag).
  - `app/src/components/engines/SequenceSimulator.tsx`:
    - Animated vertical timeline between 2 or 3 network actors (`Client`, `Server`, `Router`, `RA`, `CA`) where the user steps through packets and resolves interactive challenge steps (e.g., Go-Back-N `V(S)`/`V(R)`, TCP 3-way handshake, SLAAC ICMPv6 133/134).
  - `app/src/components/engines/TopologyLab.tsx`:
    - Interactive SVG network topology diagram with clickable nodes (`Host`, `Switch`, `Router`, `WAN Switch`, `Firewall`) where the user solves node configuration challenges (e.g., ATM 53B VPI/VCI, Datagram vs. VC forwarding table, Enterprise DMZ/VLAN design).
  - `app/src/components/engines/MatrixArena.tsx`:
    - Interactive classification arena where the user assigns protocol features/scenarios to the correct category bucket (e.g., Bluetooth vs. NFC vs. ZigBee; Symmetric $N(N-1)/2$ vs. Asymmetric crypto) with instant diagnostic feedback.
  - `app/src/components/engines/LabDispatcher.tsx`:
    - Renders the appropriate engine for `lecture.labConfig` and triggers `markLabCompleted(lecture.id)` (+150 XP) when all lab steps are solved.
- **Acceptance Criteria:**
  - Every lecture (`1..14`) loads its interactive lab in `/lecture/[id]` (`tab=lab`), validates user choices, provides diagnostic hints, and awards +150 XP upon completion.

### [ ] Task 8: Stage 3 — Lecture Boss Battle Quiz & Unified `/lecture/[id]` Page
- **Goal:** Build the active-recall Boss Quiz component and wire all tabs together on `/lecture/[id]`.
- **Files to Create:**
  - `app/src/components/lecture/BossQuiz.tsx` (question progress bar, combo multiplier badge, 4 answer buttons with keyboard `1–4` support, diagnostic explanation card after answering, final score summary screen, and automatic flagging of missed lecture flashcards in `useProgressStore`)
  - `app/src/app/lecture/[id]/page.tsx` (4 tabs: `1. Concept Briefing`, `2. Protocol Lab`, `3. Boss Battle Quiz`, `4. Source Slides (Lectures.json)`, plus Previous/Next Lecture navigation)
- **Acceptance Criteria:**
  - Completing a Boss Quiz records the percentage score, awards XP, unlocks the Boss Defeated badge at `>= 80%`, and links directly to the next lecture or Memory Vault.

> **Git Milestone 3 Checkpoint:** Stage and commit Phase 3 (`git add . && git commit -m "feat(labs): build lecture hub, 4 protocol simulation engines, and boss quiz"`).

---

## Phase 4: Global Packet Sandbox, Memory Vault & Exam Blitz

### [ ] Task 9: Global Packet Journey Sandbox (`/sandbox`), Memory Vault (`/vault`) & Exam Blitz (`/blitz`)
- **Goal:** Build the three global cross-lecture mastery tools.
- **Files to Create:**
  - `app/src/data/sandbox-scenarios.ts` & `app/src/app/sandbox/page.tsx`:
    - 3-column interactive Packet Journey Simulator (`OSI/TCP-IP Layer Stack` | `Animated Topology Journey Canvas` | `Live PDU Header & Byte Inspector`).
    - Supports 3 presets (*HTTPS over NAT & 802.1Q VLAN*, *IPv6 SLAAC & EUI-64 Routing*, *IPsec ESP Tunnel Mode VPN*), Play/Pause, Step Forward/Back, Speed control, and an interactive **"Fix the Broken Packet"** debugging challenge mode.
  - `app/src/app/vault/page.tsx`:
    - SM-2 Spaced Repetition Flashcard deck with Filter tabs (`Due Now`, `All Cards`, `Flagged`, plus Sector/Lecture filter dropdown), 3D flip animation (`Space` or click), and 4 SM-2 rating buttons (`Again`, `Hard`, `Good`, `Easy`) showing the next scheduled interval.
  - `app/src/app/blitz/page.tsx`:
    - Timed **60-Second Arcade Blitz** and **20-Question Comprehensive Mock Exam** across all 14 lectures, with a post-game sector-by-sector diagnostic breakdown and direct links to review weak lectures.
- **Acceptance Criteria:**
  - `/sandbox`, `/vault`, and `/blitz` render smoothly, update XP in `useProgressStore`, and work with both mouse and keyboard controls.

> **Git Milestone 4 Checkpoint:** Stage and commit Phase 4 (`git add . && git commit -m "feat(modes): add packet journey sandbox, SM-2 memory vault, and exam blitz"`).

---

## Phase 5: Automated Testing, Production Build & End-to-End Verification

### [ ] Task 10: Run Unit Tests, Production Build, & E2E Verification
- **Goal:** Write and execute the automated test suite and verify the running application end-to-end as specified in [`docs/TESTING.md`](./TESTING.md).
- **Files to Create:**
  - `app/__tests__/lecture-parser.test.ts`
  - `app/__tests__/curriculum.test.ts`
  - `app/__tests__/srs.test.ts`
  - `app/__tests__/simulators.test.ts`
- **Verification Steps:**
  1. Run `pnpm test --run` and confirm 100% of unit and integration tests pass.
  2. Run `pnpm build` and confirm zero TypeScript, ESLint, or Next.js build errors.
  3. Start the server and run the E2E verification checks across `/`, `/lecture/1`..`/lecture/14`, `/sandbox`, `/vault`, `/blitz`, and `/api/progress`.
  4. Ensure `git status` is clean of build/runtime artifacts (`app/.data/` ignored) and create the final Milestone 5 commit (`git add . && git commit -m "test(verify): add unit and integration test suites and verify production build"`).

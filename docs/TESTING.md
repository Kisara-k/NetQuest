# Testing & Verification Specification (`docs/TESTING.md`)

This document defines the automated unit, integration, build, and end-to-end (E2E) verification requirements for **NetQuest: Protocol Architect**.

---

## 1. Testing Pyramid Overview

| Layer | Runner / Tool | Scope | Target Execution Time |
| :--- | :--- | :--- | :--- |
| **1. Unit Tests** | `vitest` | `lecture-parser.ts` (slide normalization & de-duplication), `srs.ts` (SM-2 math), `curriculum` completeness across all 14 lectures, `useProgressStore` state transitions | `< 3 seconds` |
| **2. Component / Engine Tests** | `vitest` + `@testing-library/react` | Simulation validation logic (`HeaderAssembler`, `SequenceSimulator`, `TopologyLab`, `MatrixArena`), `BossQuiz` scoring | `< 5 seconds` |
| **3. Build & Static Type Check** | `pnpm build` (`next build`) | TypeScript strict type checking, route compilation, static/dynamic bundle validation | `< 30 seconds` |
| **4. End-to-End (E2E) Smoke & Flow Verification** | HTTP/DOM Route Probing & Browser/Playwright Check | Verifies live rendering of `/`, `/lecture/[1..14]`, `/sandbox`, `/vault`, `/blitz`, and `/api/progress` persistence | `< 30 seconds` |

---

## 2. Mandatory `data-testid` Attributes Contract

To ensure deterministic automated testing, components must include the following `data-testid` attributes:

### Global Navigation & HUD (`NavbarHUD.tsx`)
- `data-testid="nav-campaign"` — Link to `/`
- `data-testid="nav-sandbox"` — Link to `/sandbox`
- `data-testid="nav-vault"` — Link to `/vault`
- `data-testid="nav-blitz"` — Link to `/blitz`
- `data-testid="hud-xp"` — Displays current user XP
- `data-testid="hud-rank"` — Displays current Architect Rank title
- `data-testid="btn-audio-toggle"` — Mute/unmute Web Audio synthesizer
- `data-testid="btn-save-modal"` — Opens Save/Export/Reset dialog

### Campaign Dashboard (`app/page.tsx`)
- `data-testid="sector-section-{1..5}"` — Container for each of the 5 sectors
- `data-testid="lecture-card-{1..14}"` — Mission card linking to `/lecture/{id}`

### Lecture Mission Hub (`app/lecture/[id]/page.tsx`)
- `data-testid="tab-briefing"` — Switches to Stage 1: Concept Briefing
- `data-testid="tab-lab"` — Switches to Stage 2: Interactive Protocol Lab
- `data-testid="tab-quiz"` — Switches to Stage 3: Boss Battle Quiz
- `data-testid="tab-slides"` — Switches to Cleaned Source Slides (`Lectures.json`)
- `data-testid="btn-complete-briefing"` — Marks briefing read (+50 XP) and opens Protocol Lab
- `data-testid="slide-search-input"` — Keyword search input inside `SlideInspector`

### Interactive Protocol Lab Engines (`src/components/engines/*`)
- `data-testid="lab-container"` — Wrapper around the active simulation engine
- `data-testid="btn-lab-verify"` / `data-testid="btn-lab-complete"` — Submits/completes lab step or awards +150 XP
- `data-testid="btn-lab-reset"` — Resets current lab state

### Boss Battle Quiz (`BossQuiz.tsx`)
- `data-testid="quiz-question-text"` — Current question prompt
- `data-testid="quiz-option-{0..3}"` — Answer option buttons
- `data-testid="quiz-explanation"` — Diagnostic explanation shown after selecting an option
- `data-testid="btn-quiz-next"` — Advances to next question or finishes quiz
- `data-testid="quiz-results-summary"` — Final score card on quiz completion

### Global Sandbox (`/sandbox`), Memory Vault (`/vault`), & Exam Blitz (`/blitz`)
- `data-testid="sandbox-scenario-{id}"` — Scenario selector buttons on `/sandbox`
- `data-testid="sandbox-step-forward"` / `data-testid="sandbox-play-pause"` — Playback controls on `/sandbox`
- `data-testid="vault-flashcard"` — Interactive flip card on `/vault`
- `data-testid="vault-rate-{again|hard|good|easy}"` — SM-2 grading buttons on `/vault`
- `data-testid="blitz-start-60s"` / `data-testid="blitz-start-exam"` — Mode launchers on `/blitz`

---

## 3. Required Unit & Integration Test Suites (`app/__tests__/`)

### Suite 1: `app/__tests__/lecture-parser.test.ts`
1. **Loads Canonical `Lectures.json`:** Verifies that `Lectures.json` parses cleanly and contains exactly 14 lectures with `index` values `1` through `14`.
2. **De-duplicates Slide Extraction Artifacts:**
   - Tests `deduplicateSlideText` against real strings from Lecture 4 (`"Local Area Networks. Local Area Networks Shantha Fernando Shantha Fernando"`), Lecture 11 (`"Computer, Network and Web Computer, Network and Web Security Security"`), and Lecture 14 (`"Design considerations Design considerations Business needs Business needs"`).
   - Asserts that immediate duplicate phrases are collapsed while preserving key technical facts (e.g., `1518 bytes`, `1522 bytes`, `0x8100`, `512 bit`, `4096 bits`).
3. **Slide Block Segmentation:** Verifies `parseLectureSlides` produces non-empty `NormalizedSlideBlock[]` for all 14 lectures.

### Suite 2: `app/__tests__/curriculum.test.ts`
1. **Complete 14-Lecture Registry:** Asserts `CURRICULUM_MODULES` has length `14` with IDs `1..14`.
2. **Rich Content Minimums per Lecture:** Loops over all 14 lectures and asserts:
   - `lecture.concepts.length >= 4`
   - `lecture.flashcards.length >= 6`
   - `lecture.quiz.length >= 5`
   - `lecture.labConfig` is defined and has a valid `engine` (`header-assembler`, `sequence-simulator`, `topology-lab`, or `matrix-arena`).
3. **Domain Accuracy Spot Checks:**
   - Lecture 2 includes `01111110` or sliding window size `7` (`3-bit` field).
   - Lecture 3 includes `53` bytes (`5` header + `48` data) for ATM cells.
   - Lecture 4 includes `1518` / `1522` bytes, `96` bit times IFG, `512` bit slot time (`4096` for Gigabit), and `0x8100` VLAN TPID.
   - Lecture 7 includes `128` bits, `FFFE` / `7th` bit for EUI-64, and ICMPv6 `133` / `134`.
   - Lecture 9 includes `65495` max TCP data bytes, 3-way handshake, and TCP FSM states.
   - Lecture 12 includes `N(N-1)/2` symmetric keys and RA vs. CA distinction.
   - Lecture 13 includes IPsec `51` (AH) and `50` (ESP).

### Suite 3: `app/__tests__/srs.test.ts`
1. **Initial Card State:** Verifies `easeFactor === 2.5`, `interval === 0`, `repetitions === 0`.
2. **Rating Transitions:**
   - Rating `good` on a new card sets `interval = 1`, `repetitions = 1`.
   - Rating `good` a second time sets `interval = 3`, `repetitions = 2`.
   - Rating `again` resets `repetitions = 0` and `interval = 0`, reducing `easeFactor` by `0.2` (never below `1.3`).
   - Rating `easy` increases `easeFactor` by `0.15` and applies the bonus interval multiplier.

### Suite 4: `app/__tests__/simulators.test.ts`
1. **Progress Store Mutations:**
   - Verifies `markBriefingRead(1)` adds `+50 XP` once and is idempotent on repeat calls.
   - Verifies `markLabCompleted(1)` adds `+150 XP` once and sets `labCompleted = true`.
   - Verifies `recordQuizScore(1, 5, 5)` awards quiz XP + Boss Defeat bonus (`+100 XP`) and updates `bestQuizScore = 100`.
   - Verifies `exportSaveJson()` and `importSaveJson()` round-trip user state accurately.

---

## 4. End-to-End Verification Protocol

After unit tests (`pnpm test --run`) and production build (`pnpm build`) succeed, verify the live application:

1. **Server Startup & Route Health Check:**
   Start the Next.js server and verify HTTP `200 OK` and rendered HTML across:
   - `GET http://localhost:3000/` (Campaign Command Center — verifies all 14 lecture titles appear)
   - `GET http://localhost:3000/lecture/1` (OSI Model Mission Hub)
   - `GET http://localhost:3000/lecture/4` (LAN & IEEE 802.3/802.1Q Mission Hub)
   - `GET http://localhost:3000/lecture/7` (IPv6 Mission Hub)
   - `GET http://localhost:3000/lecture/9` (TCP/UDP Mission Hub)
   - `GET http://localhost:3000/lecture/13` (Secure Protocols IPsec/TLS Mission Hub)
   - `GET http://localhost:3000/sandbox` (Global 7-Layer Packet Journey Sandbox)
   - `GET http://localhost:3000/vault` (SM-2 Spaced Repetition Memory Vault)
   - `GET http://localhost:3000/blitz` (Exam Blitz Mode)
2. **API Persistence Check:**
   - `POST http://localhost:3000/api/progress` with a test progress payload and verify `GET http://localhost:3000/api/progress` returns the persisted JSON and `app/.data/progress.json` exists on disk.
   - `GET http://localhost:3000/api/lectures` and verify it returns all 14 normalized lectures with `slideBlocks.length > 0`.

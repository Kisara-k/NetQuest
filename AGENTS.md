# AGENTS.md — Autonomous Agent Engineering Guide

This document defines the environment setup, architectural guardrails, coding conventions, and verification standards for AI coding agents working in `c:\Dev\Network Study`.

---

## 1. Scope & Architectural Guardrails

1. **Single-Application Topology (`app/` Only):**
   - Build the entire application inside `c:\Dev\Network Study\app` using **Next.js (App Router, TypeScript)** and **`pnpm`**.
   - **Do NOT create `service/` (FastAPI) or `aggregator/`.** As documented in [`docs/DECISIONS.md`](./docs/DECISIONS.md) (ADR-001), this is a single-user personal study game over a static 142 KB [`Lectures.json`](./Lectures.json) file. Everything required—including optional local disk persistence via a Next.js Route Handler (`/api/progress` writing to `app/.data/progress.json`)—lives cleanly inside `app/`.
2. **Preserve `Lectures.json` Integrity:**
   - Never delete or overwrite `c:\Dev\Network Study\Lectures.json`.
   - Ingest `Lectures.json` via a deterministic parser/normalizer (`app/src/lib/lecture-parser.ts`) that reads `../Lectures.json` (or a build-time synced copy in `app/src/data/Lectures.json`) and cleans PDF slide extraction artifacts (specifically the duplicated phrase patterns in Lectures 4, 11, and 14) while preserving all original text for the **Source Slide Inspector**.
3. **Complete 14-Lecture Coverage (No Stubs):**
   - Every single lecture (`index: 1` through `index: 14`) in `Lectures.json` must have complete, technically accurate structured study content:
     - Structured Concept Briefing cards & comparison tables
     - An interactive protocol simulation configuration wired to one of the 4 core lab engines (`HeaderAssembler`, `SequenceSimulator`, `TopologyLab`, `MatrixArena`)
     - At least 6–8 SM-2 Spaced Repetition flashcards
     - At least 5–6 Boss Quiz questions with detailed explanations and exact slide metrics

---

## 2. Windows Environment & Sandbox Execution Rules

Pay careful attention to how tools are installed on this Windows host (`c:\Dev\Network Study`):

1. **Node.js & `pnpm` Path Location:**
   - On this machine, `node` and `pnpm` are installed under `C:\Users\Kisara\AppData\Local\Author Software\nvm\.nodejs` and `C:\Users\Kisara\AppData\Local\Author Software\nvm`.
   - **Important Sandbox Behavior:** The default Windows command sandbox redirects `$env:LOCALAPPDATA` to an isolated temporary directory, which hides `C:\Users\Kisara\AppData\Local\Author Software\nvm\.nodejs` from commands running with `BypassSandbox: false`.
   - **Rule for Package Management & Node Execution:**
     - Always run `pnpm` package installation/scaffolding commands (`pnpm install`, `pnpm add`, `pnpm create`, etc.) with `BypassSandbox: true`.
     - If `pnpm run`, `pnpm test`, or `pnpm build` fails in the default sandbox with `CommandNotFoundException` for `node` or `pnpm` due to the sandbox blocking `C:\Users\Kisara\AppData\Local\Author Software\nvm`, run those commands with `BypassSandbox: true`.
2. **Transient Windows `EPERM` on `mkdir`:**
   - If a Node.js tool fails with a transient `EPERM: operation not permitted, mkdir ...`, retry the command before treating it as a permanent failure.
3. **Probing the Local Next.js Server:**
   - To verify the running server with `curl` / `Invoke-WebRequest` or Playwright in the sandbox, start the server and probe it within the **same command** (and stop it when done), or run the server outside the sandbox if interactive browser access is required.
4. **PowerShell Shell Syntax:**
   - The default shell is Windows PowerShell. Avoid bash-only constructs like `&&` in older PowerShell versions if chaining commands; prefer `;` with `$ErrorActionPreference = "Stop"` or separate tool invocations.
5. **Git Write Operations (`BypassSandbox: true`):**
   - The default Windows sandbox protects `.git/` against writes (`fatal: Unable to create 'C:/Dev/Network Study/.git/index.lock': Permission denied`). Always run `git add` and `git commit` with `BypassSandbox: true`.

---

## 3. UI/UX & Engineering Quality Standards

1. **Visual Theme ("Cyber-Ops Network Architect"):**
   - **Palette:** High-contrast dark mode optimized for long study sessions and clear protocol inspection:
     - Background Canvas: `#090D16` (`slate-950`)
     - Elevated Surface / Cards: `#111827` (`gray-900` with subtle `border-slate-800/80`)
     - Interactive Accent (Primary): Electric Cyan `#06B6D4` (`cyan-500`)
     - Success / ACK / Valid PDU: Emerald `#10B981` (`emerald-500`)
     - Warning / Collision / Retransmit: Amber `#F59E0B` (`amber-500`)
     - Error / NAK / Dropped Packet: Coral Red `#F43F5E` (`rose-500`)
   - **OSI Layer Color Coding (Consistent Across All Views):**
     - L7 Application: `#A855F7` (Purple)
     - L6 Presentation: `#8B5CF6` (Violet)
     - L5 Session: `#6366F1` (Indigo)
     - L4 Transport: `#3B82F6` (Blue)
     - L3 Network: `#10B981` (Emerald)
     - L2 Data Link: `#F59E0B` (Amber)
     - L1 Physical: `#F43F5E` (Rose)
2. **Typography & Data Hierarchy:**
   - Use sans-serif (`Inter` / system sans) for conceptual explanations and UI controls.
   - Use monospace (`JetBrains Mono` / `Fira Code` / monospace fallback) with `tabular-nums` for all packet headers, byte offsets, IPv4/IPv6 addresses, MAC addresses, sequence numbers, and timers.
3. **Fluid Motion & Tactile Feedback:**
   - Use `motion/react` (`framer-motion`) for smooth layout transitions, packet encapsulation/decapsulation animations, flashcard 3D flips, and XP popups.
   - Use the zero-dependency Web Audio API synthesizer (`app/src/lib/sound.ts`) for subtle, satisfying tactile sound effects (packet snap, ACK chime, collision buzz, level-up fanfare) with a persistent mute toggle in the top HUD.
4. **Testability (`data-testid` Contract):**
   - Attach deterministic `data-testid` attributes to all primary navigation links, lecture cards, tab switches, simulation controls, flashcard rating buttons, and quiz options as specified in [`docs/TESTING.md`](./docs/TESTING.md).

---

## 4. Git Workflow & Milestone Commits

Maintain a clean, incremental Git history throughout the build. Never dump the entire implementation into a single monolithic commit at the very end, and never commit build artifacts or dependencies.

1. **Repository Hygiene (`.gitignore`):**
   - Ensure `.gitignore` (at root and/or `app/.gitignore`) excludes `node_modules/`, `.next/`, `out/`, `coverage/`, `app/.data/`, and `*.tsbuildinfo`.
   - Never stage or modify `Lectures.json`.
2. **Commit at Meaningful Milestones (End of Each Phase in `docs/TASKS.md`):**
   - **Milestone 1 (End of Phase 1 — Tasks 1–3):** Scaffold Next.js `app/`, implement `lecture-parser.ts`, and author the complete 14-lecture structured curriculum dataset.
     - Example: `git commit -m "feat(data): scaffold Next.js app and add 14-lecture normalized curriculum"`
   - **Milestone 2 (End of Phase 2 — Tasks 4–5):** Implement SM-2 scheduler, Web Audio synthesizer, Zustand store, `/api/progress` persistence route, HUD navigation, and the 5-Sector Campaign Dashboard (`/`).
     - Example: `git commit -m "feat(core): implement SRS store, local disk sync, and campaign dashboard"`
   - **Milestone 3 (End of Phase 3 — Tasks 6–8):** Implement the 3-Stage Lecture Hub (`/lecture/[id]`), Concept Briefing, Source Slide Inspector, the 4 reusable interactive simulation engines (`HeaderAssembler`, `SequenceSimulator`, `TopologyLab`, `MatrixArena`), and Boss Battle Quiz.
     - Example: `git commit -m "feat(labs): build lecture hub, 4 protocol simulation engines, and boss quiz"`
   - **Milestone 4 (End of Phase 4 — Task 9):** Implement the Global 7-Layer Packet Journey Sandbox (`/sandbox`), SM-2 Memory Vault (`/vault`), and Exam Blitz Mode (`/blitz`).
     - Example: `git commit -m "feat(modes): add packet journey sandbox, SM-2 memory vault, and exam blitz"`
   - **Milestone 5 (End of Phase 5 — Task 10):** Add the full Vitest test suite (`__tests__/`), verify `pnpm test --run` and `pnpm build`, and commit any final test/verification fixes.
     - Example: `git commit -m "test(verify): add unit and integration test suites and verify production build"`

---

## 5. Definition of Done (DoD)

Before declaring the build complete, the agent must verify every item below:

- [ ] All 10 tasks in [`docs/TASKS.md`](./docs/TASKS.md) are implemented completely.
- [ ] All 14 lectures from [`Lectures.json`](./Lectures.json) load with cleaned slide text, structured concept briefings, interactive simulations, flashcards, and boss quizzes.
- [ ] Unit and integration tests pass via `pnpm test --run` (covering `lecture-parser`, `srs`, `useProgressStore`, and simulation validation logic).
- [ ] Production build succeeds cleanly via `pnpm build` with zero TypeScript or Next.js errors.
- [ ] End-to-end verification confirms that the dashboard, lecture views, interactive labs, boss quiz, memory vault, and packet sandbox render and function properly.
- [ ] Meaningful milestone commits are recorded in Git and `git status` is clean with zero untracked build artifacts.

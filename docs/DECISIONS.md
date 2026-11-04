# Architecture Decision Records (ADRs)

This document captures the foundational architectural decisions for **NetQuest: Protocol Architect**, ensuring the system is tailored to its single-user personal study scope without unnecessary over-engineering.

---

## ADR-001: Single-App Next.js (`app/`) Topology vs. Separate FastAPI (`service/`) & `aggregator/` Backend

- **Status:** Accepted
- **Date:** 2026-11-04
- **Context:**
  The project prompt specifies:
  > *"Task is to build an nice fluid interactive UI / game to go through and understanding and remembering the content and concepts in Lectures.json (for single user personal use)... To be used next js with pnpm for frontend app (`app/`), and if (and only if) a backend is needed uv with fastapi with the existing local python version (`service/`) and a connecting (`aggregator/`) if needed. The scope of your task is to... make expert architecture decisions that are not over engineered for the scope"*
- **Decision:**
  We **intentionally omit `service/` (FastAPI) and `aggregator/`** and build the entire application inside **`app/`** as a self-contained **Next.js App Router** application managed with `pnpm`.
- **Rationale:**
  1. **Static, Small-Footprint Source Corpus:** [`Lectures.json`](../Lectures.json) is a static, read-only 142 KB JSON file containing 14 university networking lectures. It requires zero dynamic database joins, zero multi-tenant authentication, and zero Python-specific machine learning or heavy compute at runtime.
  2. **Zero Latency for Fluid 60fps Game Loops:** Interactive protocol simulations (packet header assembly, sliding window state machines, CSMA/CD collision timers, SM-2 flashcard flips) demand instantaneous (<16ms) state transitions on the client. Routing simulation steps through an HTTP aggregator and a FastAPI backend would add unnecessary network latency and failure modes.
  3. **Simple Local Persistence Without External DBs:** For a single user on a personal machine, client-side state persisted via **Zustand (`localStorage`)** coupled with a lightweight **Next.js Route Handler (`/api/progress`)** that mirrors progress to a local JSON file (`app/.data/progress.json`) and supports 1-click JSON Export/Import provides rock-solid durability with only a single `pnpm dev` / `pnpm start` process.
- **Consequences:**
  - **Positive:** One command (`pnpm dev`) starts the entire application; zero CORS/port conflicts; zero multi-service orchestration overhead; instant UI responsiveness.
  - **Negative:** None for single-user personal use. If multi-user cloud sync were ever desired in the future, `/api/progress` provides a clean boundary to swap in a remote store.

---

## ADR-002: Hybrid `Lectures.json` Normalization + Structured Pedagogical Dataset

- **Status:** Accepted
- **Date:** 2026-11-04
- **Context:**
  Inspecting [`Lectures.json`](../Lectures.json) reveals two important characteristics:
  1. Each entry has `{ index: number, title: string, content: string }` where `content` is a flat string extracted from lecture slides (using bullets like ``, ``, ``, ``, ``, `•`).
  2. Lectures 4 (*Local Area Networks*), 11 (*Introduction to Network Security*), and 14 (*Network Design*) contain consecutive duplicated phrases on the same line (e.g., `"Local Area Networks. Local Area Networks Shantha Fernando Shantha Fernando..."` and `"Broad Band and Base Band Broad Band and Base Band LANs LANs"`) caused by dual-layer text boxes / drop-shadows in the original presentation slides.
- **Decision:**
  Use a **Hybrid Data Pipeline**:
  1. **Canonical Slide Parser & Normalizer (`app/src/lib/lecture-parser.ts`):** Reads `Lectures.json` directly, splits slide bullets (``, ``, ``, ``, ``, `•`) into clean readable blocks, and runs a deterministic phrase de-duplicator (`deduplicateSlideText`) that collapses immediate repeated substrings in Lectures 4, 11, and 14 while preserving 100% of unique sentences and technical terms. This powers the **Source Slide Inspector** and global search.
  2. **Curated Structured Curriculum Modules (`app/src/data/curriculum/`):** Pairs each of the 14 lectures with strongly-typed TypeScript curriculum objects containing structured **Concept Briefing Cards**, **Comparison Matrices**, **Interactive Protocol Lab Configs**, **SM-2 Flashcards**, and **Boss Quiz Questions** grounded in the exact facts, numbers, and diagrams of `Lectures.json`.
- **Rationale:**
  Raw slide strings alone cannot drive interactive packet simulations or multi-choice quizzes cleanly, while ignoring `Lectures.json` would lose the original slide wording. Combining automated normalization of `Lectures.json` with rich structured game data gives the learner both crystal-clear visual study modules and searchable access to the cleaned source slides.

---

## ADR-003: Four Reusable Data-Driven Simulation Engines + One Global Packet Sandbox

- **Status:** Accepted
- **Date:** 2026-11-04
- **Context:**
  With 14 diverse lectures (ranging from bit stuffing and Ethernet frames to IPv6 EUI-64, TCP 3-way handshakes, ZigBee topologies, and IPsec AH/ESP), writing 14 completely unrelated canvas components would risk inconsistent UX, brittle code, and high maintenance cost.
- **Decision:**
  Architect **4 Data-Driven Simulation Engines** (`HeaderAssembler`, `SequenceSimulator`, `TopologyLab`, `MatrixArena`) configured via strongly-typed schemas per lecture, plus **1 Flagship Global Packet Journey Sandbox** (`/sandbox`):
  1. **`HeaderAssembler` (Lectures 1, 4, 6, 7, 13):** Interactive bit/byte PDU constructor, address calculator (CIDR, NAT, IPv6 `::` compression, EUI-64 MAC inversion), and encapsulation wrapper.
  2. **`SequenceSimulator` (Lectures 2, 8, 9, 12):** Interactive time-sequence diagram & finite-state machine player where users step through and fix broken protocol exchanges (Stop-and-Wait, Go-Back-N `V(S)`/`V(R)`, ARP/DHCP DORA, TCP 3-way handshake + 11-state FSM, PKI/TLS handshake).
  3. **`TopologyLab` (Lectures 3, 5, 14):** Interactive node/link topology builder and switchboard for WAN VCs (Frame Relay CIR, ATM 53B VPI/VCI, MPLS labels), Datagram vs. Virtual Circuit routing tables, QoS traffic shaping, and Enterprise Network Design architectures.
  4. **`MatrixArena` (Lectures 10, 11):** Fast-paced trade-off classification and parameter-matching arena for Wireless IoT protocols (Bluetooth, NFC, ZigBee, Wi-Fi) and Security/Cryptography fundamentals ($N(N-1)/2$ symmetric keys, 3-factor auth, threat taxonomy).
  5. **`PacketJourneySandbox` (`/sandbox`):** End-to-end 7-layer visual packet simulator across Sender Host, L2 Switch, L3 Router (with ARP, TTL decrement, NAT, and Firewall rules), and Target Server.
- **Rationale:**
  Every lecture gets a deeply relevant, interactive hands-on lab tailored to its specific networking mechanics while sharing polished UI controls, consistent keyboard navigation, error boundaries, and deterministic unit/E2E test hooks.

---

## ADR-004: Dual Local-First Persistence (`localStorage` + `/api/progress` File Sync + JSON Import/Export)

- **Status:** Accepted
- **Date:** 2026-11-04
- **Context:**
  A personal study game requires reliable persistence of XP, unlocked sectors, lecture mastery scores, and SM-2 flashcard review intervals across sessions without requiring the user to configure PostgreSQL, SQLite native bindings, or cloud accounts.
- **Decision:**
  Implement a three-tier zero-config local persistence strategy:
  1. **Primary Instant Store:** Zustand store with `persist` middleware writing to `window.localStorage` (`netquest-progress-v1`).
  2. **Automatic Local Disk Mirror:** A Next.js Route Handler (`GET/POST /api/progress`) that reads/writes `app/.data/progress.json` using Node's native `fs/promises`. On app boot, if `localStorage` is empty (e.g., new browser profile or cleared cache), the store hydrates from `/api/progress`. Whenever progress updates, a debounced background `POST /api/progress` persists the snapshot to disk.
  3. **Manual Backup & Restore:** Built-in "Export Save (JSON)" and "Import Save (JSON)" controls in the top HUD.
- **Rationale:**
  Uses zero native C++ addons (avoiding Windows node-gyp compilation issues), requires zero database setup, and guarantees the user's study history is safe on disk.

---

## ADR-005: Zero-Asset Web Audio Synthesizer & Inline SVG/Motion Graphics

- **Status:** Accepted
- **Date:** 2026-11-04
- **Context:**
  Games feel dramatically more engaging with responsive audio-visual feedback (card flips, packet snaps, collision alerts, boss victory chords), but external audio files or hotlinked web images can fail offline or introduce licensing/broken-link issues.
- **Decision:**
  - Render all network nodes, packet headers, topologies, and badges using **custom inline SVG components**, **Lucide icons**, and **Framer Motion (`motion/react`)**.
  - Generate all game sound effects procedurally at runtime using the browser's native **Web Audio API (`AudioContext` oscillators and gain envelopes)** inside `app/src/lib/sound.ts`, controlled by a persistent mute toggle.
- **Rationale:**
  100% offline-capable, zero external asset loading failures, tiny bundle size, and crisp visual/audio fidelity at any resolution.

# NetQuest: Protocol Architect

**NetQuest: Protocol Architect** is a fluid, interactive single-user learning game and protocol simulation suite designed to help you deeply **understand** and permanently **remember** every concept across all 14 computer networking lectures in [`Lectures.json`](./Lectures.json).

Instead of passively reading raw slide dumps, you step into the role of a **Network Architect** progressing through **5 Network Operations Sectors (14 Lecture Missions)**. Each mission combines visual mental models, a cleaned slide explorer, hands-on protocol simulations, active-recall boss battles, and an **SM-2 Spaced Repetition Memory Vault**.

---

## Architecture at a Glance

Per the project scope (*"next js with pnpm for frontend app (`app/`), and if (and only if) a backend is needed uv with fastapi (`service/`) and a connecting (`aggregator/`) if needed"*), this project deliberately uses a **standalone Next.js App Router architecture inside `app/`** and **omits `service/` and `aggregator/`**:

- **Why no `service/` or `aggregator/`?** The application is for **single-user personal use** over a static 142 KB curriculum file ([`Lectures.json`](./Lectures.json)). Introducing a Python FastAPI service and an aggregator gateway would add multi-process orchestration, network serialization overhead, and CORS complexity with zero functional benefit (see [ADR-001 in `docs/DECISIONS.md`](./docs/DECISIONS.md)).
- **How is data ingested?** `app/` reads [`Lectures.json`](./Lectures.json) directly, runs a deterministic slide-text normalizer (cleaning PDF extraction duplicate lines in Lectures 4, 11, and 14), and pairs the canonical lecture text with structured concept cards, interactive simulation configs, flashcards, and boss quizzes.
- **How is user progress saved?** Client state is managed via **Zustand** persisted to `localStorage`, backed by a lightweight Next.js Route Handler (`/api/progress`) that mirrors progress to `app/.data/progress.json` on disk plus one-click JSON Export/Import.

---

## Core Learning & Game Modes

1. **Campaign Skill Tree (`/`) — 5 Sectors, 14 Lecture Missions**
   - **Sector 1: Foundations & Link Control** — *L1: Introduction & OSI Model*, *L2: Data Link Layer*
   - **Sector 2: Area Networks (WAN & LAN)** — *L3: Wide Area Networks*, *L4: Local Area Networks*
   - **Sector 3: The Internet Layer** — *L5: The Network Layer*, *L6: Internet Protocol (IPv4)*, *L7: IPv6*
   - **Sector 4: End-to-End Transport & Wireless IoT** — *L8: Transport Layer*, *L9: Internet Transport Protocols (TCP/UDP)*, *L10: Other Networking Protocols (Bluetooth, NFC, ZigBee)*
   - **Sector 5: Cyber Defense & Network Design** — *L11: Introduction to Network Security*, *L12: Public Key Infrastructure (PKI)*, *L13: Secure Protocols (IPsec & TLS)*, *L14: Network Design*

2. **3-Stage Lecture Mastery Loop (`/lecture/[id]`)**
   - **Stage 1 — Understand (Concept Briefing & Cleaned Slide Explorer):** Visual mental models, protocol comparison tables, key formulas, and a toggleable **Source Slide Inspector** with term highlighting and instant search over cleaned `Lectures.json` content.
   - **Stage 2 — Simulate (Interactive Protocol Lab):** Hands-on mini-games powered by 4 data-driven simulation engines:
     - `HeaderAssembler`: Build & inspect OSI/TCP-IP stacks, IEEE 802.3 + 802.1Q VLAN frames, IPv4 headers/CIDR/NAT, IPv6 compressed addresses & EUI-64 IDs, and IPsec AH/ESP packets.
     - `SequenceSimulator`: Step through & repair Stop-and-Wait / Go-Back-N sliding windows (`V(S)`/`V(R)`), bit/byte stuffing, ARP + DHCP DORA, IPv6 SLAAC, TCP 3-way handshake + 11-state FSM, and TLS/PKI handshakes.
     - `TopologyLab`: Simulate CSMA/CD binary exponential back-off vs. Token Ring, WAN switching (Leased Line, Frame Relay CIR, ATM 53-byte cells, MPLS), Datagram vs. Virtual Circuit routing & QoS shaping, and Enterprise Network Design blueprints.
     - `MatrixArena`: Rapid classification challenges for Bluetooth/NFC/ZigBee IoT trade-offs, security threat taxonomies, and symmetric ($N(N-1)/2$) vs. asymmetric cryptography.
   - **Stage 3 — Remember (Boss Battle Quiz):** Scenario-based active recall with combo multipliers, streak fire, header-debugging questions, and detailed explanations tied directly to lecture concepts.

3. **Global Packet Journey Sandbox (`/sandbox`)**
   - Full-screen interactive visualizer showing a payload traveling from **Layer 7 (Application)** down to **Layer 1 (Physical)** on a Sender Host, traversing a **Switch (L2)**, **NAT/Firewall Router (L3)**, and **WAN Link**, and decapsulating up to **Layer 7** on a Target Server. Includes step-by-step scrubbing and "Break & Fix the Packet" debugging challenges.

4. **Memory Vault (`/vault`) — SM-2 Spaced Repetition**
   - Flashcard deck covering all 14 lectures with SM-2 scheduling (`Again`, `Hard`, `Good`, `Easy`), ease-factor tracking, due-card queues, and custom filtering by sector or lecture.

5. **Exam Blitz Mode (`/blitz`)**
   - Timed 60-second or 20-question cross-lecture active-recall gauntlet for pre-exam mastery verification.

---

## Documentation Map

| Document | Purpose |
| :--- | :--- |
| [`AGENTS.md`](./AGENTS.md) | Operational rules, environment setup, Windows sandbox notes, and handoff instructions for coding agents. |
| [`docs/PRD.md`](./docs/PRD.md) | Product Requirements Document, user experience design, and full 14-lecture curriculum mapping. |
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | System architecture, component hierarchy, simulation engine schemas, state models, and data pipeline. |
| [`docs/TASKS.md`](./docs/TASKS.md) | Ordered, step-by-step implementation plan with acceptance criteria for building the app in one go. |
| [`docs/TESTING.md`](./docs/TESTING.md) | Unit, integration, and E2E testing strategy, test cases, and verification commands. |
| [`docs/DECISIONS.md`](./docs/DECISIONS.md) | Architecture Decision Records (ADRs) justifying key technical and scope choices. |

---

## Repository Structure

```text
c:\Dev\Network Study\
├── Lectures.json            # Canonical source data (14 computer networking lectures)
├── README.md                # Project overview, quick start, and handoff prompt
├── AGENTS.md                # Agent instructions, environment notes, and guardrails
├── docs/
│   ├── PRD.md               # Product requirements & 14-lecture curriculum blueprint
│   ├── ARCHITECTURE.md      # Next.js app architecture, state, & simulation engines
│   ├── TASKS.md             # Sequential implementation checklist
│   ├── TESTING.md           # Automated unit & E2E verification specification
│   └── DECISIONS.md         # Architecture Decision Records (ADR-001 through ADR-005)
└── app/                     # Next.js (App Router) frontend application (managed via pnpm)
```

---

## Quick Start (For Build & Verification)

```powershell
# 1. Navigate to the Next.js application directory
cd "c:\Dev\Network Study\app"

# 2. Install dependencies with pnpm
pnpm install

# 3. Run unit & integration tests (Vitest)
pnpm test --run

# 4. Build production bundle (verifies TypeScript & Next.js static/dynamic routes)
pnpm build

# 5. Start development server
pnpm dev
```

---

## Agent Handoff Prompt

Copy and paste the prompt below to the next agent to build and verify the entire application end-to-end in one run:

```markdown
You are tasked with building and testing **NetQuest: Protocol Architect** end-to-end in one go inside `c:\Dev\Network Study\app`.

Before writing any code, read the following specification documents in order:
1. `AGENTS.md` (critical environment & Windows sandbox rules, especially regarding `node`/`pnpm` paths and `BypassSandbox: true` for `pnpm` package installation)
2. `docs/DECISIONS.md` (why only `app/` is used and `service/` + `aggregator/` are omitted)
3. `docs/PRD.md` (full 14-lecture curriculum mapping, exact networking constants/formulas, and functional requirements)
4. `docs/ARCHITECTURE.md` (directory layout, TypeScript interfaces, `Lectures.json` normalizer, 4 reusable simulation engines + Packet Journey Sandbox, SM-2 algorithm, and dual `localStorage` + `/api/progress` persistence)
5. `docs/TASKS.md` (sequential implementation plan from Task 1 to Task 10)
6. `docs/TESTING.md` (unit, integration, build, and E2E verification criteria)

Execution Requirements:
- Execute `docs/TASKS.md` sequentially from Task 1 through Task 10 without stopping early.
- Keep `Lectures.json` at the repository root unmodified; load it into `app/` and ensure all 14 lectures have complete, accurate concept cards, interactive lab configurations, SM-2 flashcards, and boss quiz questions (zero placeholder or "Coming Soon" stubs).
- Commit your work to Git at each of the 5 Phase Milestone Checkpoints defined in `AGENTS.md` and `docs/TASKS.md` using clear Conventional Commit messages, ensuring `.gitignore` excludes `node_modules/`, `.next/`, and `app/.data/`.
- Run all unit/integration tests (`pnpm test --run`), verify a clean production build (`pnpm build`), perform E2E verification against the running server as specified in `docs/TESTING.md`, and leave `git status` clean.
```

# NetQuest: Protocol Architect

**NetQuest: Protocol Architect** is a fluid, interactive learning game and protocol simulation suite designed to help you deeply **understand** and permanently **remember** core networking concepts across all 14 computer networking lectures in [`Lectures.json`](./Lectures.json).

Instead of passively reading raw slide dumps, you step into the role of a **Network Architect** progressing through **5 Network Operations Sectors (14 Lecture Missions)**. Each mission combines visual mental models, an interactive slide explorer, hands-on protocol simulations, active-recall boss battles, and an **SM-2 Spaced Repetition Memory Vault**.

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
     - `HeaderAssembler`: Build and inspect OSI/TCP-IP stacks, IEEE 802.3 + 802.1Q VLAN frames, IPv4 headers/CIDR/NAT, IPv6 compressed addresses & EUI-64 IDs, and IPsec AH/ESP packets.
     - `SequenceSimulator`: Step through and repair Stop-and-Wait / Go-Back-N sliding windows (`V(S)`/`V(R)`), bit/byte stuffing, ARP + DHCP DORA, IPv6 SLAAC, TCP 3-way handshake + 11-state FSM, and TLS/PKI handshakes.
     - `TopologyLab`: Simulate CSMA/CD binary exponential back-off vs. Token Ring, WAN switching (Leased Line, Frame Relay CIR, ATM 53-byte cells, MPLS), Datagram vs. Virtual Circuit routing & QoS shaping, and Enterprise Network Design blueprints.
     - `MatrixArena`: Rapid classification challenges for Bluetooth/NFC/ZigBee IoT trade-offs, security threat taxonomies, and symmetric ($N(N-1)/2$) vs. asymmetric cryptography.
   - **Stage 3 — Remember (Boss Battle Quiz):** Scenario-based active recall with combo multipliers, streak tracking, header-debugging questions, and detailed explanations tied directly to lecture concepts.

3. **Global Packet Journey Sandbox (`/sandbox`)**
   - Full-screen interactive visualizer showing a payload traveling from **Layer 7 (Application)** down to **Layer 1 (Physical)** on a Sender Host, traversing a **Switch (L2)**, **NAT/Firewall Router (L3)**, and **WAN Link**, and decapsulating up to **Layer 7** on a Target Server. Includes step-by-step scrubbing and "Break & Fix the Packet" debugging challenges.

4. **Memory Vault (`/vault`) — SM-2 Spaced Repetition**
   - Flashcard deck covering all 14 lectures with SM-2 scheduling (`Again`, `Hard`, `Good`, `Easy`), ease-factor tracking, due-card queues, and custom filtering by sector or lecture.

5. **Exam Blitz Mode (`/blitz`)**
   - Timed 60-second or 20-question cross-lecture active-recall gauntlet for pre-exam mastery verification.

---

## Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | Next.js 15+ (App Router), React 19, TypeScript |
| **Styling & Icons** | Tailwind CSS, Lucide React |
| **Animation & Motion** | Motion (`framer-motion`) for 60fps packet animations and 3D card flips |
| **State & Persistence** | Zustand with `localStorage` persistence and `/api/progress` local disk mirror |
| **Audio Synthesizer** | Native Web Audio API procedural audio engine (zero sound file dependencies) |
| **Testing** | Vitest, React Testing Library, JSDOM |

---

## Getting Started

### Prerequisites

- **Node.js**: v18.18 or higher (v20+ recommended)
- **pnpm**: v9 or higher

### Installation & Run

```bash
# 1. Navigate to the application directory
cd app

# 2. Install dependencies
pnpm install

# 3. Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start NetQuest.

### Testing & Verification

```bash
# Run unit & integration tests (Vitest)
pnpm test --run

# Build production bundle (verifies TypeScript & routes)
pnpm build
```

---

## Project Structure

```text
├── Lectures.json            # Canonical curriculum source data (14 computer networking lectures)
├── README.md                # Project overview, features, and setup guide
├── docs/                    # Architecture, design specifications, and test plans
│   ├── PRD.md               # Product requirements & 14-lecture curriculum blueprint
│   ├── ARCHITECTURE.md      # System architecture, state models, and simulation engines
│   ├── TASKS.md             # Implementation milestone breakdown
│   ├── TESTING.md           # Automated test suite and verification protocol
│   └── DECISIONS.md         # Architecture Decision Records (ADRs)
└── app/                     # Next.js web application
    ├── src/
    │   ├── app/             # Next.js App Router pages (/, /lecture/[id], /sandbox, /vault, /blitz, /api)
    │   ├── components/      # UI components, simulation engines, HUD, and quizzes
    │   ├── data/            # Normalized curriculum modules, concept cards, and questions
    │   ├── lib/             # SM-2 scheduler, lecture parser, audio synth, and utilities
    │   └── types/           # TypeScript domain definitions
    └── __tests__/           # Vitest unit and integration test suites
```

---

## Documentation

Detailed design documents, specifications, and test plans are available in the [`docs/`](./docs/) directory:

- [`docs/PRD.md`](./docs/PRD.md) — Product Requirements Document and complete 14-lecture curriculum mapping.
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — Full technical architecture, component hierarchy, simulation engine schemas, and data flow.
- [`docs/DECISIONS.md`](./docs/DECISIONS.md) — Architecture Decision Records (ADR-001 through ADR-005) documenting key design choices.
- [`docs/TASKS.md`](./docs/TASKS.md) — Detailed feature checklist and milestone roadmap.
- [`docs/TESTING.md`](./docs/TESTING.md) — Test suites, assertions, and verification procedures.

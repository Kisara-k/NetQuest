## Agent Handoff Prompt

When resuming, extending, or handing off development tasks to another coding agent, provide the prompt below:

```markdown
You are tasked with maintaining, extending, and verifying **NetQuest: Protocol Architect** inside `c:\Dev\Network Study\app`.

Before writing any code, review the following specification documents:
1. `AGENTS.md` (critical environment & Windows sandbox rules, especially regarding `node`/`pnpm` paths and `BypassSandbox: true` for `pnpm` package installation)
2. `docs/DECISIONS.md` (why only `app/` is used and `service/` + `aggregator/` are omitted)
3. `docs/PRD.md` (full 14-lecture curriculum mapping, exact networking constants/formulas, and functional requirements)
4. `docs/ARCHITECTURE.md` (directory layout, TypeScript interfaces, `Lectures.json` normalizer, 4 reusable simulation engines + Packet Journey Sandbox, SM-2 algorithm, and dual `localStorage` + `/api/progress` persistence)
5. `docs/TASKS.md` (sequential implementation plan and acceptance criteria)
6. `docs/TESTING.md` (unit, integration, build, and E2E verification criteria)

Execution Requirements:
- Keep `Lectures.json` at the repository root unmodified; load it into `app/` and ensure all 14 lectures have complete, accurate concept cards, interactive lab configurations, SM-2 flashcards, and boss quiz questions (zero placeholder or "Coming Soon" stubs).
- Commit your work to Git at each milestone using clear Conventional Commit messages, ensuring `.gitignore` excludes `node_modules/`, `.next/`, and `app/.data/`.
- Run all unit/integration tests (`pnpm test --run`), verify a clean production build (`pnpm build`), perform E2E verification against the running server as specified in `docs/TESTING.md`, and leave `git status` clean.
```

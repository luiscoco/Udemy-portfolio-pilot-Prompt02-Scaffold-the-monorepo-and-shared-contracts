# PortfolioPilot — Project State

Single source of truth for progress. Update at the end of every milestone with **actual** results.

- **Last updated:** 2026-09-30
- **Last completed milestone:** 02 — Scaffold the monorepo and shared contracts
- **Next milestone:** 03 — Build the accessible frontend shell
- **Deployment status:** not deployed; no cloud resources exist.

## Milestone status

| # | Milestone | Status | Notes |
| --- | --- | --- | --- |
| 00 | Project contract and plan | Done | Documentation only |
| 01 | Verify versions and prerequisites | Done | Stable version matrix and local metadata in `docs/versions.md`; installation unverified because Node/npm are inactive and registry access fails locally |
| 02 | Scaffold the monorepo and shared contracts | Done | Install, build, typecheck, Vite proxy smoke check, and browser boundary check passed; generated Next.js instruction files remain pending approval to remove |
| 03 | Build the accessible frontend shell | Not started | |
| 04 | Add the first Claude SDK vertical slice | Not started | |
| 05 | Start PostgreSQL and Redis locally | Not started | |
| 06 | Create the Prisma schema and deterministic seed | Not started | |
| 07 | Implement authentication and authorization | Not started | |
| 08 | Build portfolio and transaction APIs | Not started | |
| 09 | Implement valuation and performance calculations | Not started | |
| 10 | Connect the portfolio UI and watchlist | Not started | |
| 11 | Build deterministic provider adapters | Not started | |
| 12 | Add live providers and resilient ingestion | Not started | |
| 13 | Implement caching and the transactional outbox | Not started | |
| 14 | Build replayable authenticated SSE on the API | Not started | |
| 15 | Add frontend streaming and snapshot recovery | Not started | |
| 16 | Build the complete live news experience | Not started | |
| 17 | Create authorized custom tools | Not started | |
| 18 | Build grounded portfolio chat | Not started | |
| 19 | Stream agent answers without duplicate text | Not started | |
| 20 | Implement resumable conversations and structured analysis | Not started | |
| 21 | Build portfolio impact and research recommendations | Not started | |
| 22 | Add recommendation cards and configurable alerts | Not started | |
| 23 | Add focused subagents and an MCP integration | Not started | |
| 24 | Add reusable skills and policy hooks | Not started | |
| 25 | Implement approvals and explicit cancellation | Not started | |
| 26 | Manage context and enforce usage budgets | Not started | |
| 27 | Move execution into a durable worker | Not started | |
| 28 | Persist SDK sessions across restarts | Not started | |
| 29 | Harden the application and execution boundary | Not started | |
| 30 | Add distributed recovery and operational controls | Not started | |
| 31 | Build a meaningful automated test suite | Not started | |
| 32 | Add AI evaluation and observability | Not started | |
| 33 | Build production containers and release CI | Not started | |
| 34 | Generate and validate Azure infrastructure | Not started | |
| 35 | Create Kubernetes deployment and release procedures | Not started | |
| 36 | Finish the capstone and teaching materials | Not started | |

## Environment observed (2026-09-30)

| Tool | Observed | Notes |
| --- | --- | --- |
| OS | Windows 11 Home (10.0.26200) | PowerShell and Git Bash available |
| Node.js | 24.21.0 installed under nvm, **not active** in this shell | `node --version` reports no active version; Node 24 is LTS |
| npm | **Not active** in this shell | Node 24.21.0 bundles npm 11.19.0 per official archive |
| git | 2.52.0.windows.1 | `git status --short` says this workspace is not a Git repository; the earlier observation no longer matches this directory |
| Docker | CLI 28.5.2; Compose 2.40.3 | `docker info` fails with access denied to config/engine pipe; daemon unverified |

## Latest milestone report — 02

**What works:** npm workspaces cover the three applications and seven shared packages with explicit exports and ordered shared builds. React/Vite serves on 5173; the Node.js Next Route Handler serves `GET /api/health/live` on 3001 through the Vite `/api` proxy. The route returns a UUID request ID in both the JSON body and `x-request-id` header; invalid server configuration uses the shared error envelope. Browser and server config have separate Zod entry points, with empty example placeholders and mock defaults. The worker reports its role and exits cleanly on its shutdown message. The browser package graph is limited to web, contracts, and config.

**Changed files:** Root `package.json`, `.gitignore`, `tsconfig.base.json`, `package-lock.json`, `scripts/`; new `apps/web`, `apps/api`, `apps/worker`, and `packages/contracts`, `packages/domain`, `packages/db`, `packages/providers`, `packages/agent`, `packages/config`, `packages/observability`; `docs/versions.md`, `docs/lessons/02-monorepo-contracts.md`, and this state file. Next.js generated `apps/api/AGENTS.md` and `apps/api/CLAUDE.md` during the dev smoke check; they remain in the workspace because automatic approval review rejected their removal. `agentRules: false` now prevents regeneration.

**Check results:** Direct Node invocation of the installed npm 11.19.0 CLI ran `npm install --no-audit --no-fund` successfully (295 packages; lockfile created), then `npm run build`, `npm run typecheck`, `npm run lint`, and `npm run test` successfully. The test run has six passing focused contract/config assertions; other workspaces currently have no test files. `npm run check:browser-boundary` passed, and source/built asset scans found no agent SDK, Prisma, Node-only import, or server secret marker in web code. `npm ls` confirmed the approved core versions. `npm run dev` started Vite and Next.js; HTTP checks returned 200 for `/` and `/api/health/live` through port 5173, with matching request IDs. The worker printed its role and a graceful IPC shutdown message, then exited 0. Normal `npm` invocation is blocked by the local NVM trust shim; direct Node + npm CLI invocation works. A separate single-workspace npm build attempt failed intermittently through that shim, while the final root build and typecheck passed.

**How to demonstrate:** In a shell with Node/npm active, run `npm install`, `npm run build`, `npm run typecheck`, `npm run test`, `npm run check:browser-boundary`, then `npm run dev`. Open `http://127.0.0.1:5173/` and `http://127.0.0.1:5173/api/health/live`. For the worker, run `npm run start --workspace=@portfolio-pilot/worker` after build and stop with Ctrl+C. On this host, substitute `& 'C:\Users\luisc\AppData\Local\Author Software\nvm\installs\v24.21.0\node.exe' 'C:\Users\luisc\AppData\Local\Author Software\nvm\installs\v24.21.0\node_modules\npm\bin\npm-cli.js'` for `npm`.

**Remaining limitations:** No browser automation or visual inspection was run; the HTTP and production build checks verify delivery but not browser rendering. The database and agent packages expose boundaries only; their persistence and SDK behavior belong to later milestones. Prisma install scripts were not allowlisted by npm, and no Prisma schema/generation is needed until milestone 06. This directory is still not a Git repository, so no commit was made. Automatic approval review rejected removing Next.js-generated `apps/api/AGENTS.md` and `apps/api/CLAUDE.md`, citing the contract's protection of instruction files; removal requires explicit user approval.

## Previous milestone report — 01

**What works:** A stable, exact dependency version set and Node 24.21.0 LTS/npm 11.19.0 baseline are documented in `docs/versions.md`, with official compatibility references. Root metadata pins the runtime and package manager. `.gitignore` excludes credentials, SDK transcripts, generated output, and local database files.

**Changed files:** `.nvmrc`, `.npmrc`, `package.json`, `.gitignore`, `docs/versions.md`, `docs/lessons/01-toolchain.md`, and this state file. No application code or packages were installed.

**Check results:** `git --version` passed (2.52.0.windows.1); `docker --version` passed (28.5.2); `docker compose version` passed (2.40.3); `nvm list` found 24.21.0 installed. `node --version` and `npm --version` failed because no active Node version is configured. `docker info --format '{{.ServerVersion}}'` failed with access denied to the Docker config/engine pipe. `git status --short` failed because this directory is not a Git repository. Direct PowerShell request to `https://registry.npmjs.org/react/latest` failed to connect; registry package pages and official docs were reviewed through web access. `Get-Content package.json -Raw | ConvertFrom-Json` passed, confirming valid JSON and the selected engine/package manager fields. Static checks found the intended `.gitignore` exclusions and both new docs; `package-lock.json` does not exist. A local install, lockfile resolution, build, and tests were not run.

**How to demonstrate:** Review `docs/versions.md`, `.nvmrc`, `.npmrc`, `package.json`, and `.gitignore`. In Windows PowerShell, run `nvm use 24.21.0; node --version; npm --version`. In Linux/WSL2 with `nvm-sh`, run `nvm install 24.21.0 && nvm use 24.21.0 && node --version && npm --version`. After milestone 02 creates workspace manifests and network access works, run `npm install --package-lock-only --ignore-scripts`, `npm install`, and the `npm ls ...` command in `docs/versions.md`.

**Remaining limitations:** This shell cannot currently activate Node/npm, access the npm registry directly, use the Docker engine, or inspect Git history. SDK installed types and full resolved peer graph must be checked when dependencies are installed. There is no lockfile because no dependency manifests or install exist yet. Docker and credentials are unnecessary for milestone 01.

## Previous milestone report — 00

**What works:** The project contract, assistant pointer file, 36-milestone plan, state tracker, and
ADR index exist. No application code has been generated.

**Changed files (all new):**
- `AGENTS.md`, `CLAUDE.md`
- `docs/project-plan.md`, `docs/project-state.md`
- `docs/decisions/README.md`, `docs/decisions/0001-architecture-baseline.md`
- `docs/lessons/00-project-contract.md`
- `README.md` (added after the milestone at the user's request; a student-facing explanation of
  Prompt 00. Milestone 36 replaces it with the full application README.)

**Check results:** Documentation-only milestone; no build, lint, or test tooling exists yet.
Verified that the workspace was empty beforehand, so no existing instruction files were overwritten.

**How to demonstrate:** Open `AGENTS.md`, then `docs/project-plan.md`. Start a fresh assistant
session and confirm it reads `CLAUDE.md` → `AGENTS.md` → `docs/project-state.md`.

**Remaining limitations:**
- ~~The folder is not a git repository.~~ Resolved: the user initialized the repository and added
  the GitHub remote; the Milestone 00 docs and README were committed and pushed to `main` on request.
- No versions are pinned yet; that is milestone 01.

## Open decisions and blockers

- Authentication library, live quote/news provider, and gateway controller are decided in their
  milestones (07, 12, 35) and recorded as ADRs.

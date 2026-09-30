# PortfolioPilot — Milestone 02: Scaffold the monorepo and shared contracts

PortfolioPilot is a teaching project for a stock portfolio manager. The planned application will eventually include portfolios, market news, and an AI assistant. This activity builds its **foundation**: the folder structure, development servers, shared HTTP contracts, configuration boundaries, and build commands. It does not yet implement portfolio management or AI features.

## Purpose and what you will learn

This prompt asks a coding agent to create three applications and seven shared packages in one npm **workspace**. A workspace lets related packages share one installation and lockfile while keeping their responsibilities separate. Students can see how a React frontend calls a Next.js API on the same local origin, how TypeScript packages are built in dependency order, and why browser code must not import server secrets or server-only libraries.

The main learning goals are:

- Organize a TypeScript monorepo with explicit package exports.
- Use a Vite **proxy** to forward browser requests beginning with `/api` to the API server. A proxy is a server that passes a request to another server.
- Validate public and server configuration with Zod, a library that checks data at runtime.
- Give API responses a **correlation ID**, a UUID that helps connect a response to the request that produced it.
- Check the browser dependency graph for server-only code.

The project rules are in [AGENTS.md](AGENTS.md), the full milestone sequence is in [docs/project-plan.md](docs/project-plan.md), and verified progress is in [docs/project-state.md](docs/project-state.md). The approved dependency versions and rationale are in [docs/versions.md](docs/versions.md).

## Steps performed

1. **Read the project contract and approved versions.** The implementation followed the milestone 02 scope and kept the approved React, Vite, Next.js, TypeScript, Prisma, Claude Agent SDK, Zod, and Vitest versions. The installed Node.js version was 24.21.0 with npm 11.19.0.
2. **Created the npm workspaces.** The root [package.json](package.json) includes `apps/*` and `packages/*`. It provides `dev`, `build`, `typecheck`, `lint`, `test`, and `check:browser-boundary` scripts. [scripts/run-workspaces.mjs](scripts/run-workspaces.mjs) builds shared packages before applications; [scripts/dev.mjs](scripts/dev.mjs) starts the web and API servers together. [tsconfig.base.json](tsconfig.base.json) supplies strict TypeScript settings.
3. **Created the three applications.** `apps/web` contains the React/Vite page and the `/api` proxy configured in [apps/web/vite.config.ts](apps/web/vite.config.ts). `apps/api` contains a Next.js Node.js Route Handler at [apps/api/app/api/health/live/route.ts](apps/api/app/api/health/live/route.ts). `apps/worker` contains a role-selectable background process in [apps/worker/src/index.ts](apps/worker/src/index.ts).
4. **Created the seven shared packages.** `packages/contracts` defines the health response, error envelope, and request ID header. `packages/config` has separate `browser` and `server` exports. `packages/domain`, `db`, `providers`, `agent`, and `observability` establish package boundaries for later milestones. Package `exports` maps state which paths other packages may import.
5. **Separated configuration.** The `.env.example` files in each app contain empty placeholders. Vite exposes only the public `VITE_APP_NAME` and `VITE_DATA_MODE` settings to the browser. Database, Redis, and Anthropic credential names appear only in the server-side examples. Empty settings default to mock mode. The [milestone lesson](docs/lessons/02-monorepo-contracts.md) explains where each application reads its configuration.
6. **Added verification.** [scripts/check-browser-boundary.mjs](scripts/check-browser-boundary.mjs) checks the web workspace's package dependencies. Six focused tests check the contract and configuration schemas. Installation created [package-lock.json](package-lock.json), which records the resolved dependency versions.

## Results achieved

The Vite development server ran on `127.0.0.1:5173`, and the Next.js API ran on port `3001`. The root page returned HTTP 200. A request to `http://127.0.0.1:5173/api/health/live` passed through the Vite proxy and returned HTTP 200. The observed response had this shape:

```json
{
  "status": "ok",
  "requestId": "cc39aa02-1456-4835-a1d2-f642be67c1a6"
}
```

The `x-request-id` response header matched the JSON `requestId`. The web page is designed to show the app name, a visible mock-mode label, and API health status. The worker was observed printing `PortfolioPilot worker role: ingestion`; a graceful shutdown message was also observed, followed by exit code 0.

Installation succeeded with 295 packages. The final root build and typecheck passed, as did the `lint` script and six contract/config tests. The browser dependency check passed with this workspace graph:

```text
@portfolio-pilot/web → @portfolio-pilot/contracts, @portfolio-pilot/config
```

Source and built-asset scans found no Prisma, Claude Agent SDK, Node-only import, or server secret marker in the web code. These checks cover the scaffold as built; they do not prove future code will preserve that boundary.

## How to run and verify

Use Node.js **24.21.0** and npm **11.19.0**. You need access to the npm registry for the initial install. PostgreSQL, Redis, Anthropic credentials, and Docker are not required for this milestone's default mock mode. Run the following commands from the repository root:

```bash
node --version
npm --version
npm install
npm run build
npm run typecheck
npm run lint
npm run test
npm run check:browser-boundary
npm run dev
```

In another terminal, request the page and health endpoint:

```bash
curl http://127.0.0.1:5173/
curl -i http://127.0.0.1:5173/api/health/live
```

Or open `http://127.0.0.1:5173/` in a browser. The expected page shows “PortfolioPilot”, “Deterministic demo”, and “API live”. The browser page itself was **not** visually inspected during milestone 02; the observed checks were HTTP responses, compilation, tests, and dependency scans. Stop the development servers with Ctrl+C.

After `npm run build`, you can start the worker separately:

```bash
npm run start --workspace=@portfolio-pilot/worker
```

Its default role is `ingestion`. Set `WORKER_ROLE` to `ingestion`, `outbox`, or `agent` through the process environment to select a role. On Windows PowerShell, for example:

```powershell
$env:WORKER_ROLE = 'outbox'
npm run start --workspace=@portfolio-pilot/worker
```

Each app locates configuration differently: Vite reads `apps/web/.env`; Next.js reads `apps/api/.env.local`; the worker reads process environment variables (or an environment file passed to Node). The example files are templates, not credentials. For the worker, a local file can be loaded after building with:

```bash
node --env-file=apps/worker/.env apps/worker/dist/index.js
```

This last command assumes you first create `apps/worker/.env` from its example. It was documented as a supported way to run the worker, but the milestone's observed worker check used the default process environment.

### Note for this Windows host

The local NVM npm shim reported a trust error. The successful install and root checks invoked npm's installed CLI directly through Node instead. On a normally configured Node installation, use the simpler `npm` commands above. The exact fallback used here was:

```powershell
& 'C:\Users\luisc\AppData\Local\Author Software\nvm\installs\v24.21.0\node.exe' 'C:\Users\luisc\AppData\Local\Author Software\nvm\installs\v24.21.0\node_modules\npm\bin\npm-cli.js' run build
```

Replace `run build` with `install --no-audit --no-fund`, `run typecheck`, `run test`, or another root script as needed.

## Limitations and next work

- This is a scaffold. The domain, database, provider, agent, and observability packages establish boundaries but do not yet implement portfolio calculations, persistence, live market data, Claude Agent SDK behavior, or tracing. Those belong to later milestones.
- The `lint` command currently runs TypeScript static checks; no separate style-rule linter was installed. Six focused tests passed; the other workspaces have no test files yet.
- No browser automation or visual inspection was run. The HTTP smoke check showed that the page and proxied health route were served, not that every browser interaction works.
- npm reported that Prisma install scripts were not allowlisted. No Prisma schema or client generation was attempted; that work is planned for milestone 06.
- Next.js generated `apps/api/AGENTS.md` and `apps/api/CLAUDE.md` during development. Automatic approval review rejected removal because they are instruction files. They remain in the workspace; [apps/api/next.config.mjs](apps/api/next.config.mjs) now disables future generation.
- This workspace was not a Git repository during verification, so no commit was made. No cloud resources were provisioned or deployed.

The next planned activity is milestone 03: build the accessible frontend shell. See [docs/project-state.md](docs/project-state.md) for the current status and complete verification record.

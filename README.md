# Offline PWA Boilerplate

A local-first boilerplate with role-based permissions that work both online and offline.

Built as a notes app to demonstrate the full stack: real-time sync, offline mutations, and a permission system where the server is the single source of truth — but enforcement happens client-side too, so unauthorized actions are blocked even without a network connection.

## How Permissions Work

Roles (admin, editor, viewer) are assigned at signup. The server computes the list of allowed mutation kinds and stores it in the session. The frontend reads this from the session payload and guards every mutation function before it touches the local collection.

| Role | Readable Tables | Mutations |
|------|----------------|-----------|
| **admin** | notes, writers | all |
| **editor** | notes, writers | notes only |
| **viewer** | notes | none |

**Online**: server rejects unauthorized sync requests with 403 and blocks Electric shape reads for forbidden tables.

**Offline**: `assertAllowed()` runs before `executeMutation()` — the local collection is never modified, and a toast notifies the user.

## Tech Stack

| Layer | Tech |
|-------|------|
| **Frontend** | React 19, Vite, TailwindCSS 4, TanStack Router/Query/Form/Table, Base UI, shadcn |
| **Backend** | Elysia (Bun), Drizzle ORM, PostgreSQL |
| **Auth** | BetterAuth (email + password, role on signup) |
| **Sync** | ElectricSQL, TanStack DB with offline transactions |
| **Permissions** | Server-authoritative roles, client-side enforcement via session payload |
| **Monorepo** | Bun workspaces, Turborepo |
| **Quality** | OxLint, OxFmt, Lefthook |

## Prerequisites

- [Bun](https://bun.sh) >= 1.2.23
- [Docker](https://docs.docker.com/get-docker/) (for PostgreSQL + ElectricSQL)

## Setup

```sh
# Install dependencies
bun install

# Configure environment
cp .env.example .env                   # docker-compose (postgres credentials)
cp backend/.env.example backend/.env   # backend (app config)

# Start PostgreSQL and ElectricSQL
docker compose up -d

# Run database migrations
bun run --cwd backend db:migrate
```

## Development

```sh
bun dev
```

This starts both the backend (http://localhost:3000) and frontend (https://localhost:5173) via Turborepo.

## Preview (production build)

```sh
bun run build
bun run preview
```

The frontend preview runs on https://localhost:4173.

## Useful Commands

| Command | Description |
|---------|-------------|
| `bun dev` | Start all packages in dev mode |
| `bun run build` | Build all packages |
| `bun run preview` | Preview production build |
| `bun run lint` | Lint with OxLint |
| `bun run fmt` | Format with OxFmt |
| `bun run --cwd backend db:generate` | Generate a new migration |
| `bun run --cwd backend db:migrate` | Apply migrations |
| `bun run --cwd backend db:studio` | Open Drizzle Studio |

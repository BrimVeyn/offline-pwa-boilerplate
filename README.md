# Notes PWA

A local-first collaborative notes app built as a progressive web app.

## Tech Stack

| Layer | Tech |
|-------|------|
| **Frontend** | React 19, Vite, TailwindCSS 4, TanStack Router/Query/Form/Table, Base UI, shadcn |
| **Backend** | Elysia (Bun), Drizzle ORM, PostgreSQL |
| **Auth** | BetterAuth (email + password) |
| **Sync** | ElectricSQL, TanStack DB with offline transactions |
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

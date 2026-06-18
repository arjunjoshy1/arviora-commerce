# Arviora Commerce

A category-agnostic ecommerce platform — list and sell products from any category
(clothing, jewellery, WFH essentials, decor, kitchen…) through one seamless storefront.

## Stack

| Layer    | Tech                                         |
| -------- | -------------------------------------------- |
| Frontend | React + Vite + TypeScript + Tailwind CSS     |
| Backend  | NestJS + Prisma                              |
| Database | PostgreSQL (via Docker locally)              |
| Shared   | `@arviora/shared` — types shared across apps |

Monorepo managed with **pnpm workspaces**.

```
arviora-commerce/
├─ apps/
│  ├─ api/        NestJS + Prisma API
│  └─ web/        React storefront
├─ packages/
│  └─ shared/     Shared TypeScript types
├─ docker-compose.yml
└─ pnpm-workspace.yaml
```

## Getting started

```bash
# 1. Install dependencies
pnpm install

# 2. Start Postgres
pnpm db:up

# 3. Create the database schema
pnpm db:migrate

# 4. Seed sample products
pnpm db:seed

# 5. Run both apps (API on :3000, web on :5173)
pnpm dev
```

Then open http://localhost:5173.

## Useful scripts

| Command           | What it does                          |
| ----------------- | ------------------------------------- |
| `pnpm dev`        | Run API + web together                |
| `pnpm db:up`      | Start Postgres in Docker              |
| `pnpm db:migrate` | Apply Prisma migrations               |
| `pnpm db:seed`    | Insert sample categories and products |
| `pnpm db:studio`  | Open Prisma Studio (DB GUI)           |

# Arviora Commerce

A full-stack, **category-agnostic ecommerce platform** — list and sell products from
any category (clothing, jewellery, home, kitchen…) through one seamless storefront,
with a complete customer experience and an admin back-office for running the shop.

Built as a production-shaped reference application: real authentication with
role-based access control, secure session handling, server-validated checkout, and a
type-safe contract shared end-to-end between the API and the web client.

> **Tech:** React · TypeScript · NestJS · Prisma · PostgreSQL · Redux Toolkit ·
> TanStack Query · Tailwind CSS · JWT/RBAC · pnpm monorepo

---

## Highlights

- **Secure auth from the ground up** — register / login / logout, forgot &
  reset password, with **argon2id** password hashing, short-lived **access JWTs**, and
  **httpOnly, rotating refresh-token cookies** (DB-backed and revocable).
- **Role-based access control (RBAC)** — `CUSTOMER` and `ADMIN` roles enforced by
  NestJS guards; an entire admin back-office is gated behind the `ADMIN` role on both
  the API and the client.
- **End-to-end type safety** — a shared `@arviora/shared` package means the frontend
  and backend can never drift on the shape of a `Product`, `Order`, or API request.
- **Money done right** — all amounts stored as integer **paise** to avoid
  floating-point currency bugs, formatted for the Indian locale (`₹`).
- **Server-authoritative checkout** — prices, stock checks, and totals are always
  recomputed on the server inside a transaction; the client is never trusted.
- **Thoughtful UX** — product image carousel, saved address book with a default
  address, persistent cart, wishlist, order history, and a customer support ticket
  system tied to orders.

---

## Features

### Storefront (customer)

- **Catalogue** — product grid with category filtering and search.
- **Product detail** — multi-image **carousel** with thumbnails, size & quantity
  selection, colour swatch, add-to-cart and wishlist.
- **Cart** — slide-out drawer, quantity editing, persisted and synced to the server
  for signed-in users.
- **Checkout** — pick from a **saved address book** (with a default pre-selected) or
  enter a new address; orders snapshot the shipping address so later edits never alter
  history.
- **Account** — profile, address book (CRUD + set default), password change, order
  history, wishlist, and support.
- **Support tickets** — raise a ticket against a specific order and track its status.
- **Content pages** — About, Contact, and a Help / FAQ accordion.

### Admin back-office (`/admin`, ADMIN-only)

- **Dashboard** — at-a-glance stats: product count, orders, total revenue, open
  tickets, and users.
- **Products** — list all products (active & inactive), create/edit via a modal,
  manage stock, create categories, and **soft-delete** (deactivate) products so they
  drop off the storefront while order history stays intact.
- **Orders** — view every customer's order and advance its status
  (`PENDING → PAID → SHIPPED → DELIVERED / CANCELLED`).
- **Support** — view all tickets across users and update their status.

---

## Architecture

A **pnpm-workspaces monorepo** with a clean separation between the API, the web
client, and the shared type contract.

```
arviora-commerce/
├─ apps/
│  ├─ api/        NestJS + Prisma REST API  (feature modules: auth, products,
│  │             cart, orders, wishlist, addresses, support, admin)
│  └─ web/        React storefront + admin  (Redux Toolkit for client/UI state,
│                 TanStack Query for server state)
├─ packages/
│  └─ shared/     @arviora/shared — TypeScript types shared by both apps
├─ docker-compose.yml      Postgres 16 for local dev
└─ pnpm-workspace.yaml
```

**Why these choices**

| Decision                                 | Rationale                                                                                                                                                         |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **NestJS feature modules**               | Each domain (auth, products, orders…) is a self-contained module with controller + service + DTOs, kept consistent and testable.                                  |
| **Prisma + PostgreSQL**                  | Type-safe data access and versioned migrations; the schema is the single source of truth.                                                                         |
| **Redux Toolkit + TanStack Query**       | Client/UI state (cart, auth, drawers) in Redux; server state (products, orders) cached and invalidated by TanStack Query — the right tool for each kind of state. |
| **Shared types package**                 | One definition of every API shape, imported by both sides, so a breaking change surfaces at compile time.                                                         |
| **Access JWT + rotating refresh cookie** | Standard secure SPA pattern: short-lived access token in memory, long-lived refresh token in an httpOnly cookie, rotated on every use and revocable on logout.    |

---

## Tech stack

| Layer        | Tech                                                                                  |
| ------------ | ------------------------------------------------------------------------------------- |
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, React Router, Redux Toolkit, TanStack Query |
| **Backend**  | NestJS 11, Prisma 6, Passport (JWT), argon2, class-validator                          |
| **Database** | PostgreSQL 16 (Docker locally)                                                        |
| **Shared**   | `@arviora/shared` — types shared across apps                                          |
| **Tooling**  | pnpm workspaces, ESLint, Prettier, Husky + lint-staged, Vitest                        |

---

## Getting started

**Prerequisites:** Node ≥ 20, pnpm 10, and Docker (for Postgres).

```bash
# 1. Install dependencies
pnpm install

# 2. Set up environment variables (the defaults work for local dev)
cp .env.example .env

# 3. Start Postgres
pnpm db:up

# 4. Apply the database schema
pnpm db:migrate

# 5. Seed sample categories, products, and an admin user
pnpm db:seed

# 6. Run both apps — API on :3000, web on :5173
pnpm dev
```

Then open **http://localhost:5173**.

### Seeded admin login

The seed creates an admin account so you can explore the back-office at `/admin`:

```
Email:    admin@arviora.test
Password: Admin@12345
```

Sign in with these, then open the menu → **Admin dashboard** (or visit `/admin`).
Regular shoppers can register their own account from the storefront.

### Environment variables

`.env.example` documents everything; the defaults are dev-ready. Key values:

| Variable                                   | Purpose                                                           |
| ------------------------------------------ | ----------------------------------------------------------------- |
| `DATABASE_URL`                             | Postgres connection string (matches `docker-compose.yml`)         |
| `API_PORT` / `CORS_ORIGIN`                 | API port and the web origin allowed to send credentialed requests |
| `JWT_ACCESS_SECRET` / `JWT_ACCESS_TTL`     | Access-token signing secret and lifetime (15m)                    |
| `REFRESH_TOKEN_TTL_DAYS` / `COOKIE_SECRET` | Refresh-token lifetime and cookie signing secret                  |
| `APP_WEB_URL`                              | Used to build links (e.g. password-reset)                         |

> Generate strong random values for `JWT_ACCESS_SECRET` and `COOKIE_SECRET` in any
> non-local environment.

---

## API overview

REST API under the `/api` prefix. Admin routes additionally require the `ADMIN` role.

| Area          | Endpoints                                                                                                                                                                   |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Auth**      | `POST /auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/forgot-password`, `/auth/reset-password` · `GET/PATCH /auth/me`, `POST /auth/change-password` |
| **Products**  | `GET /products`, `GET /products/:slug`, `GET /categories` · _admin:_ `POST /products`, `POST /categories`, `GET /products/admin`, `PATCH /products/admin/:id`               |
| **Cart**      | `GET /cart`, `POST /cart/sync`, `PUT /cart/items`, `DELETE /cart/items`, `DELETE /cart`                                                                                     |
| **Orders**    | `POST /orders`, `GET /orders`, `GET /orders/:id` · _admin:_ `GET /orders/admin`, `PATCH /orders/admin/:id/status`                                                           |
| **Wishlist**  | `GET /wishlist`, `POST /wishlist`, `DELETE /wishlist/:productId`                                                                                                            |
| **Addresses** | `GET /addresses`, `POST /addresses`, `PUT /addresses/:id`, `DELETE /addresses/:id`                                                                                          |
| **Support**   | `POST /support`, `GET /support`, `GET /support/:id` · _admin:_ `GET /support/admin`, `PATCH /support/admin/:id/status`                                                      |
| **Admin**     | `GET /admin/summary`                                                                                                                                                        |

### Data model

PostgreSQL via Prisma. Core entities: `User` (+ `RefreshToken`, `PasswordResetToken`),
`Category`, `Product`, `CartItem`, `WishlistItem`, `Address`, `Order` + `OrderItem`,
and `SupportTicket` — with `Role`, `UserStatus`, `OrderStatus`, and
`SupportTicketStatus` enums. See [`apps/api/prisma/schema.prisma`](apps/api/prisma/schema.prisma).

---

## Security notes

- Passwords hashed with **argon2id**; never stored or returned in plaintext.
- Refresh and password-reset tokens are stored only as **SHA-256 hashes**; the raw
  value lives solely in the cookie / reset link.
- Refresh tokens **rotate** on every use and are revoked on logout and password reset.
- Refresh cookie is `httpOnly`, `sameSite: lax`, scoped to the auth path, and
  `secure` in production.
- All inputs validated with **class-validator** DTOs behind a global validation pipe.
- Order pricing and stock are computed server-side in a transaction — never trusted
  from the client.

---

## Scripts

| Command                             | What it does                                         |
| ----------------------------------- | ---------------------------------------------------- |
| `pnpm dev`                          | Run API + web together                               |
| `pnpm dev:api` / `pnpm dev:web`     | Run a single app                                     |
| `pnpm build`                        | Build all packages                                   |
| `pnpm db:up` / `pnpm db:down`       | Start / stop Postgres in Docker                      |
| `pnpm db:migrate`                   | Apply Prisma migrations                              |
| `pnpm db:seed`                      | Seed sample categories, products, and the admin user |
| `pnpm db:studio`                    | Open Prisma Studio (DB GUI)                          |
| `pnpm lint` / `pnpm lint:fix`       | Lint (and auto-fix) the whole repo                   |
| `pnpm format` / `pnpm format:check` | Prettier write / check                               |
| `pnpm typecheck`                    | Type-check both apps                                 |
| `pnpm test`                         | Run the Vitest suite                                 |

---

## Roadmap

Areas intentionally left as next steps:

- Real transactional email for password resets (currently logged to the server console
  in dev).
- Payment-gateway integration (orders currently move through statuses manually).
- Broader automated test coverage and CI.
- Admin user management (enable/disable accounts).

---

<p align="center"><sub>Built with care as a full-stack portfolio project.</sub></p>

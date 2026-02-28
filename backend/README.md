# Snipr Backend

The REST API for [Snipr](../README.md) — a fast and minimal URL shortener.

## Tech Stack

| Technology | Purpose |
|---|---|
| NestJS 11 | TypeScript server framework |
| TypeORM | ORM for PostgreSQL |
| PostgreSQL 16 | Primary database |
| Redis 7 | Cache layer for fast redirects |
| Passport.js | Google OAuth + JWT authentication |
| nanoid | 6-character short code generation |
| class-validator | DTO validation |
| @nestjs/schedule | Cron jobs for analytics resets |

## Module Structure

```
src/
├── auth/
│   ├── auth.controller.ts       # OAuth login, callback, logout, /me
│   ├── auth.service.ts          # User lookup/creation, JWT issuance
│   ├── user.entity.ts           # User table (email, googleId, name, avatar)
│   ├── strategy/
│   │   ├── google.strategy.ts   # Passport Google OAuth strategy
│   │   └── jwt.strategy.ts      # Passport JWT strategy (reads from cookie)
│   └── guards/
│       ├── jwt-auth.guard.ts    # Requires authentication
│       └── optional-jwt.guard.ts # Attaches user if present
├── url/
│   ├── url.controller.ts        # CRUD endpoints for URLs
│   ├── url.service.ts           # Shortening, caching, analytics logic
│   ├── url.entity.ts            # Url + Click entities
│   ├── url.dto.ts               # Validation DTOs
│   └── url.scheduler.ts         # Daily/weekly click counter resets
├── redirect/
│   └── redirect.controller.ts   # GET /:shortCode → 302 redirect
├── migrations/                  # TypeORM database migrations
└── app.module.ts                # Root module
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | — | Health check (DB & Redis) |
| `GET` | `/auth/google` | — | Initiate Google OAuth |
| `GET` | `/auth/google/callback` | — | Google callback, sets JWT cookie |
| `POST` | `/auth/exchange` | — | Exchange temp code for JWT |
| `GET` | `/auth/me` | Required | Get current user |
| `POST` | `/auth/logout` | — | Clear auth cookie |
| `POST` | `/url` | Optional | Create a short URL |
| `GET` | `/url/my-urls` | Required | Get user's URLs (paginated) |
| `GET` | `/url/stats` | Required | Get user link statistics |
| `DELETE` | `/url/:id` | Required | Delete a URL (owner only) |
| `GET` | `/:shortCode` | — | Redirect to original URL |

## Getting Started

### Prerequisites

- [pnpm](https://pnpm.io/installation)
- PostgreSQL 16 running locally
- Redis 7 running locally

### Install & Run

```bash
pnpm install
pnpm run start:dev
```

The API runs at [http://localhost:3000](http://localhost:3000) by default.

### Environment Variables

These are configured in the root `.env` file (see [.env.example](../.env.example)):

| Variable | Description |
|---|---|
| `PORT` | API server port |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | PostgreSQL connection |
| `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` | Redis connection |
| `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET` | Google OAuth credentials |
| `GOOGLE_OAUTH_CALLBACK_URL` | OAuth callback URL |
| `JWT_SECRET` | Secret for signing JWTs |
| `FRONTEND_URL` | Frontend URL (for CORS and redirects) |

## Running Tests

```bash
pnpm run test         # Unit tests
pnpm run test:e2e     # End-to-end tests
pnpm run test:cov     # Coverage report
```

## Key Patterns

- **Redis cache-aside** — short code lookups hit Redis first, fall back to PostgreSQL on miss
- **Cookie-based JWT** — tokens stored in HTTP-only cookies (SameSite=Lax in production)
- **Optional auth** — URL creation works for both anonymous and authenticated users
- **Ownership enforcement** — users can only delete their own links
- **Auto-expiring links** — URLs get a 30-day TTL set at creation
- **Scheduled resets** — cron jobs reset daily/weekly click counters automatically

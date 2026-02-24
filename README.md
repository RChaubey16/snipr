# ✂️ Snipr

A fast and minimal URL shortener. Paste a long URL, get a short one — done.

Built with a NestJS backend, Next.js frontend, PostgreSQL for persistence, and Redis for blazing-fast redirect caching.

---

## 🏗️ Tech Stack

| Layer     | Technology                                 |
|-----------|--------------------------------------------|
| Frontend  | Next.js 16, React 19, Tailwind CSS, shadcn/ui |
| Backend   | NestJS 11, TypeORM, class-validator        |
| Database  | PostgreSQL 16                              |
| Cache     | Redis 7                                    |
| Container | Docker & Docker Compose                    |
| Package Manager | pnpm                                |

---

## 📁 Project Structure

```
snipr/
├── backend/             # NestJS REST API
│   └── src/
│       ├── auth/        # Google OAuth, JWT strategy, guards
│       ├── url/         # URL shortening logic (CRUD)
│       └── redirect/    # Redirect handler
├── frontend/            # Next.js app
│   ├── app/
│   │   ├── dashboard/   # Link dashboard (protected)
│   │   └── login/       # Login page (Google auth)
│   ├── components/      # UI components (shadcn/ui)
│   ├── hooks/           # useAuth and other hooks
│   ├── lib/             # Server actions & utilities
│   └── middleware.ts     # Auth route protection
├── docker-compose.yml
└── .env.example
```

---

## ✨ Features

- 🔗 **Shorten any URL** — generates a unique 6-character short code using `nanoid`
- ⚡ **Redis caching** — short-code lookups hit Redis before PostgreSQL for minimal latency
- 🗄️ **PostgreSQL persistence** — all URLs stored with click count tracking
- 📊 **Dashboard** — view and manage your shortened links
- 🔐 **Google OAuth** — sign in with Google for personal link management
- 🍪 **Secure cookie-based auth** — JWT stored in HTTP-only cookies with protected route middleware
- 👤 **Per-user links** — authenticated users get their own link library
- 🗑️ **Delete URLs** — remove links you no longer need (with ownership enforcement)
- 🌙 **Dark mode** — theme toggle included

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/)
- [pnpm](https://pnpm.io/installation) (for local development)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/snipr.git
cd snipr
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Then fill in the values in your `.env` file:

```env
PORT=3000

DB_HOST=postgres
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=snipr

PGADMIN_EMAIL=admin@example.com
PGADMIN_PASSWORD=admin

REDIS_HOST=redis
REDIS_PORT=6379

FRONTEND_URL=http://localhost:3001

# Google OAuth (https://console.cloud.google.com)
GOOGLE_OAUTH_CLIENT_ID=your_google_client_id
GOOGLE_OAUTH_CLIENT_SECRET=your_google_client_secret
GOOGLE_OAUTH_CALLBACK_URL=http://localhost:3000/auth/google/callback

# JWT
JWT_SECRET=your_jwt_secret

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3001
```

### 3. Run with Docker Compose

```bash
docker compose up --build
```

| Service    | URL                        |
|------------|----------------------------|
| Backend    | http://localhost:3000       |
| Frontend   | http://localhost:3001       |
| pgAdmin    | http://localhost:5050       |

---

## 🛠️ Local Development (without Docker)

### Backend

```bash
cd backend
pnpm install
pnpm run start:dev
```

### Frontend

```bash
cd frontend
pnpm install
pnpm run dev
```

> Make sure PostgreSQL and Redis are running locally and your `.env` variables point to them.

---

## 🔌 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/auth/google` | — | Redirect to Google OAuth |
| `GET` | `/auth/google/callback` | — | Google callback, sets auth cookie |
| `GET` | `/auth/me` | Required | Get current authenticated user |
| `POST` | `/auth/logout` | — | Clear auth cookie |
| `POST` | `/url` | Optional | Create a short URL |
| `GET` | `/url/my-urls` | Required | Get authenticated user's URLs |
| `DELETE` | `/url/:id` | Required | Delete a URL (owner only) |
| `GET` | `/:shortCode` | — | Redirect to the original URL |

### `POST /url` — Create a short URL

**Request body:**
```json
{ "url": "https://example.com/very/long/path" }
```

**Response:**
```json
{ "shortUrl": "abc123" }
```

> When authenticated, the URL is linked to your account. Anonymous creation is also supported.

---

## 📦 Running Tests

```bash
cd backend

# Unit tests
pnpm run test

# End-to-end tests
pnpm run test:e2e

# Coverage report
pnpm run test:cov
```

---

## 🗺️ Roadmap

- [x] URL shortening with DB deduplication
- [x] Redis caching for fast lookups
- [x] Click count tracking
- [x] Frontend MVP
- [x] Dashboard UI
- [x] Google OAuth login
- [x] Cookie-based JWT authentication
- [x] Auth-protected routes (frontend middleware)
- [x] Per-user link management
- [x] Delete URLs with ownership enforcement
- [ ] Link analytics & charts
- [ ] Custom short codes

---

## 📄 License

This project is for personal use. No license applied.

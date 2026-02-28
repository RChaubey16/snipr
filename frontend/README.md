# Snipr Frontend

The web interface for [Snipr](../README.md) — a fast and minimal URL shortener.

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 16 | React framework (SSR, server actions, routing) |
| React 19 | UI library |
| Tailwind CSS 4 | Utility-first styling |
| shadcn/ui + Radix UI | Accessible component library |
| Motion | Animations |
| next-themes | Dark mode support |
| jose | JWT handling |

## Project Structure

```
app/
├── page.tsx              # Landing page with URL input form
├── login/                # Google OAuth login page
├── auth/callback/        # OAuth callback handler
├── dashboard/
│   ├── page.tsx          # Stats overview + quick shorten
│   └── links/page.tsx    # Full link library with pagination
├── [shortCode]/          # Client-side redirect fallback
└── api/                  # API routes (auth proxy)
components/
├── UrlInputForm.tsx      # Main URL shortening form
├── Navbar.tsx            # Context-aware navigation
├── StatsCards.tsx        # User statistics display
├── RecentLinksTable.tsx  # Recent links on dashboard
├── AllLinksTable.tsx     # Paginated link management
├── QuickShorten.tsx      # Quick shorten widget
└── LoginCard.tsx         # Google OAuth login card
hooks/
└── useAuth.ts            # Client-side auth state
lib/
├── actions.ts            # Server actions (API calls)
└── utils.ts              # Shared utilities
```

## Getting Started

### Prerequisites

- [pnpm](https://pnpm.io/installation)
- The backend API running (see [backend README](../backend/README.md))

### Install & Run

```bash
pnpm install
pnpm run dev
```

The app runs at [http://localhost:3001](http://localhost:3001) by default.

### Environment Variables

These are configured in the root `.env` file (see [.env.example](../.env.example)):

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API URL (client-side) |
| `API_URL` | Backend API URL (server-side / Docker internal) |
| `NEXT_PUBLIC_FRONTEND_URL` | Frontend URL |
| `FRONTEND_PORT` | Port for the frontend dev server |

## Key Patterns

- **Server actions** (`"use server"`) in `lib/actions.ts` handle all API communication
- **Cookie-based auth** — JWT is stored in an HTTP-only cookie, forwarded automatically with requests
- **`useAuth` hook** — manages client-side authentication state by calling `/auth/me`
- **Dark mode** — toggle via `next-themes` with system preference detection

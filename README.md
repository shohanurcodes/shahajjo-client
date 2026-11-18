# Sahajjo — neighbours helping neighbours

Sahajjo is a community-driven platform for social service events in Dhaka. Neighbours can post a cleanup, a plantation drive, a donation collection or a winter relief programme, and everyone else can join in a couple of clicks.

- **Live site:** <https://shahajjo-client.vercel.app>
- **Client GitHub Repository:** <https://github.com/shohanurcodes/shahajjo-client>
- **Server GitHub Repository:** <https://github.com/shohanurcodes/shahajjo-server>

## What you can do

- **Explore upcoming events** on a searchable, type-filtered board with loading skeletons and friendly empty states.
- **Read the full event story** — cover image, date, location, host, attendee preview and a one-tap join button.
- **Create an event** with validated fields, a live cover-image preview and a date picker that only accepts tomorrow onwards.
- **Manage the events you host** from a dashboard with attendee counts, owner-only editing and a delete confirmation dialog.
- **Keep your own calendar** of joined events, split into upcoming plans and events that already happened.
- **Update your profile** — display name and photo — and see how many events you have created, joined and still have ahead.
- **Switch between light and dark themes** anywhere in the app, with a responsive layout from phone to desktop.
- **Sign in with email and password, GitHub, or Google** (social options activate automatically when their OAuth credentials are set), with toast feedback for every success and failure.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, React 19, TypeScript) |
| Styling | Tailwind CSS 4 + shadcn/ui (Radix) |
| Auth | BetterAuth with the MongoDB adapter and JWT plugin |
| API client | Typed `fetch` wrapper that attaches a short-lived Bearer JWT |
| Validation | Zod on both the form and the Express API |
| Icons / motion | Lucide, CSS transitions with reduced-motion support |

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in the values
npm run dev
```

Open <http://localhost:3000>. The Express API must be running separately on port 5000.

### Environment variables

| Name | Purpose |
| --- | --- |
| `BETTER_AUTH_SECRET` | Long random string used to sign sessions |
| `BETTER_AUTH_URL` | Public URL of this Next.js app (`http://localhost:3000` locally) |
| `NEXT_PUBLIC_APP_URL` | Same origin, used for metadata and auth client base URL |
| `MONGODB_URI` | MongoDB Atlas connection string, shared with the Express API |
| `DB_NAME` | Database name (`sahajjo`) |
| `NEXT_PUBLIC_API_URL` | Express API base URL (optional in production; defaults to `https://shahajjo-server.onrender.com`) |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub OAuth credentials (optional) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth credentials (optional) |

GitHub and Google sign-in are optional. A provider button is shown whenever both matching credentials are set; otherwise email/password is used. The legacy `NEXT_PUBLIC_GITHUB_AUTH_ENABLED` and `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED` flags are ignored so a copied `false` value cannot hide a configured provider.

Register these callback URLs on the OAuth apps (`BETTER_AUTH_URL` decides which origin is used):

- GitHub: `http://localhost:3000/api/auth/callback/github` locally, `https://shahajjo-client.vercel.app/api/auth/callback/github` in production
- Google: `http://localhost:3000/api/auth/callback/google` locally, `https://shahajjo-client.vercel.app/api/auth/callback/google` in production

### Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Production build (Turbopack) |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint with the Next.js core-web-vitals rules |

## How auth and the API fit together

BetterAuth owns the user accounts in MongoDB and exposes:

- `/api/auth/[...all]` — sign-up, sign-in, session and update-user endpoints.
- `/api/auth/jwks` — public keys used by the API to verify tokens.
- `/api/auth/token` — a short-lived JWT for the current browser session.

`lib/api.ts` fetches that JWT, caches it for five minutes, and sends it as `Authorization: Bearer <token>` to the Express API. A `401` clears the cache, refreshes the token once and retries. The Express service never trusts the client for identity: the creator's id and email come from the verified JWT claims.

Every signed-in route lives under `app/(private)/` and is guarded on the server in its layout with `auth.api.getSession()`, so a page reload cannot flash private content before the client session resolves.

## Deploying

1. Push this repository to GitHub.
2. Import it into Vercel and set the variables from the table above. Add the GitHub and Google credentials to enable social sign-in; `NEXT_PUBLIC_API_URL` is optional in production because the Render URL is the default.
3. After the first deploy, set `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` to the Vercel URL, then redeploy.
4. On the API, set `BETTER_AUTH_JWKS_URL=https://<your-app>.vercel.app/api/auth/jwks` and add the Vercel origin to `CLIENT_ORIGINS`.
5. In MongoDB Atlas, allow access from Vercel and Render.

## Project structure

```
app/
  (private)/        signed-in routes (guard in layout.tsx)
  api/auth/         BetterAuth handler
  events/           public board and event details
  login, register/  auth screens
components/
  auth/             shell, login, register, Google button
  events/           board, detail, form, host dashboard, joined list
  home/             hero, features, recent events, gallery, newsletter
  profile/          profile editor and stats
lib/                API client, auth config, validators, formatting, types
public/gallery/     curated local event photography
```

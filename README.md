# Green Dream Admin (DummyJSON)

Admin dashboard built with Next.js (App Router, JavaScript), Material-UI, Zustand state, and NextAuth credentials auth against DummyJSON APIs.

## Stack
- Next.js 16 (App Router, JS) + NextAuth (credentials)
- MUI + Emotion for UI/theming
- Zustand for auth/users/products state and client-side caching

## Setup
1) Install deps: `npm install`
2) Environment: create `.env.local`
```
NEXTAUTH_SECRET=replace-with-random-secret
NEXTAUTH_URL=http://localhost:3000
```
3) Run dev server: `npm run dev` (http://localhost:3000)
4) Production build: `npm run build && npm run start`

DummyJSON sample creds: `username: emilys`, `password: emilyspass`. 
(Note: You can use any user credentials from the DummyJSON users endpoint)

## Features
- Auth: Credential login to DummyJSON, session via NextAuth (JWT), token mirrored in Zustand.
- Protection: Middleware guards `/dashboard`, `/users`, `/products`.
- Users: Paginated list (limit/skip), search, detail view.
- Products: Paginated grid, search, category filter, detail view with image carousel.
- Responsive MUI layout with top nav, loading/error/empty states.

## State & Caching
- Zustand stores (`/src/stores`) manage auth token, users, and products.
- List/search responses are cached per query key (params + path) to avoid repeat API calls; persisted to localStorage for quick revisits.
- Comments in stores explain the caching approach; API-side pagination is used to avoid over-fetching.
- Zustand chosen for its tiny footprint, simple API, and built-in async-friendly actions—lighter than Redux for this scale.

## Structure
- `src/app/(auth)/login` – login page
- `src/app/(protected)/` – dashboard, users, products, detail pages
- `src/app/api/auth/[...nextauth]` – NextAuth credentials provider hitting DummyJSON
- `src/stores/` – Zustand stores for auth/users/products
- `src/lib/apiClient.js` – fetch helper + cache key builder
- `middleware.js` – protects authenticated routes

## Notes
- Uses MUI `AppRouterCacheProvider` for emotion caching in the App Router.
- Images use plain `img` components to avoid remote domain config.
- Replace `NEXTAUTH_SECRET` with a strong random string before production.

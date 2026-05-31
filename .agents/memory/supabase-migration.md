---
name: Supabase-only frontend
description: All data fetching in the React frontend uses Supabase directly — no Express API routes. Express only serves the Vite dev build.
---

## Rule
Every `useQuery` / `useMutation` in the frontend must use Supabase helpers from `@/lib/supabase.ts`, NOT Express `/api/...` routes.

## How to apply
- Query keys use the `"sb-*"` prefix (e.g. `"sb-projects"`, `"sb-notifications"`).
- Always provide an explicit `queryFn` that calls the appropriate helper.
- All helpers live in `client/src/lib/supabase.ts`.
- Admin auth uses `adminLogin` / `adminLogout` / `supabase.auth.onAuthStateChange`.
- Image uploads go to Supabase Storage bucket `project-images` via `uploadProjectImage(file)`.

**Why:** The app is deployed on Vercel as a static SPA — there is no Node.js server in production. Express runs only in Replit dev mode to serve Vite.

**How to detect stale code:** Any `queryKey: ["/api/..."]` without an explicit `queryFn` uses the default fetcher which hits Express. These must be replaced.

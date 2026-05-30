---
name: Admin auth wiring
description: How the admin dashboard authenticates — Express session only, Supabase removed from all query paths.
---

## Rule
The admin uses Express session auth exclusively. `queryClient.ts` is a plain fetch wrapper with NO Supabase intercepts.

**Why:** The codebase had a split brain: reads went to Supabase (not configured), writes went to local Express/PostgreSQL. Admin never worked because `useAdminAuth` called `getAdminUser()` via Supabase which always returned null.

## How it works now
- Login: `POST /api/admin/login` sets `req.session.adminAuthenticated = true`
- Auth check: `GET /api/auth/user` returns `{isAuthenticated:true}` when session is set
- `useAdminAuth` in AdminDashboard.tsx queries `/api/auth/user` via standard queryClient fetch
- All admin mutations use `apiRequest()` from `queryClient.ts` → Express endpoints

## How to apply
- Never import Supabase helpers in queryClient.ts or add URL intercepts
- Admin login calls `expressLogin()` (fetch to `/api/admin/login`), not `adminLogin()` from supabase.ts
- Admin logout calls `expressLogout()` (fetch to `/api/admin/logout`)
- Query keys for admin: `/api/projects/all`, `/api/blog/all`, `/api/notifications/all`, `/api/contact`

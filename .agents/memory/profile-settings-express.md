---
name: Profile settings via site_settings
description: Profile fields (displayName, role, email, etc.) are stored as key-value rows in site_settings, served by /api/profile-settings.
---

## Rule
Profile settings live in the `site_settings` table as key-value pairs, not in a dedicated profile table. The Express route `/api/profile-settings` maps camelCase fields to snake_case keys.

**Why:** Supabase `profile_settings` table was removed; site_settings already existed with `upsertSiteSetting(key, value)`.

## Key mapping
| API field | DB key |
|---|---|
| displayName | display_name |
| role | role |
| email | email |
| githubUrl | github_url |
| linkedinUrl | linkedin_url |
| whatsappUrl | whatsapp_url |
| contactQuote | contact_quote |
| isAvailable | available_for_projects (string "true"/"false") |
| avatarUrl | profile_image_url |
| logoText | logo_text |
| siteName | site_name |

## How to apply
- `GET /api/profile-settings` → reads all site_settings, maps to ProfileSettings object with defaults
- `POST /api/profile-settings` (requireAdminAuth) → calls `storage.upsertSiteSetting(k, v)` for each changed field

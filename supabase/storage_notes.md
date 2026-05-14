# Project Image Storage — Upload Instructions

These project images are currently bundled locally via Vite (in `client/src/assets/`).
To host them on Supabase Storage instead, follow the steps below.

---

## Step 1 — Create the Storage Bucket

1. Open your Supabase project → **Storage** tab
2. Click **New bucket**
3. Name it: `project-images`
4. Set it to **Public** (so images are accessible via URL)
5. Click **Create bucket**

---

## Step 2 — Upload Each Image

Go to **Storage → project-images → Upload files** and upload each file below.

| Local File | Upload As | Used For |
|---|---|---|
| `client/src/assets/image_1748447815242.png` | `bravezm.png` | BRAVEZM Gaming |
| `client/src/assets/image_1748447890581.png` | `bestyboy.png` | BestyBoy Gaming |
| `client/src/assets/image_1748448070181.png` | `ahmed-helly-academy.png` | Ahmed Helly Academy |
| `client/src/assets/eco-eats-preview.png` | `eco-eats.png` | Eco Eats |
| `client/src/assets/bmo-tools-preview.png` | `bmo-tools.png` | BMO Tools |
| `client/src/assets/bemora-new.png` | `bemora.png` | Bemora |
| `client/src/assets/mr-mohammed.png` | `mr-mohammed.png` | MR Mohammed |
| `client/src/assets/diaa-elden-shop.png` | `diaa-elden-shop.png` | Diaa Elden Shop |
| `client/src/assets/113-alx-ai-starter-kit-certificate-mustafa-muhammad.png` | `alx-certificate.png` | ALX Certificate |
| `client/src/assets/image_1756332525184.png` | `profile-contact.png` | Contact section avatar |

---

## Step 3 — Get the Public URLs

After uploading, the public URL format is:

```
https://fvuaiwxfdgerjbuszgpf.supabase.co/storage/v1/object/public/project-images/<filename>
```

Example for BRAVEZM:
```
https://fvuaiwxfdgerjbuszgpf.supabase.co/storage/v1/object/public/project-images/bravezm.png
```

---

## Step 4 — Update Project Records in Supabase

For each project row in the `projects` table, update `image_url` to the corresponding public URL above.

You can run this SQL in the **SQL Editor**:

```sql
UPDATE projects SET image_url = 'https://fvuaiwxfdgerjbuszgpf.supabase.co/storage/v1/object/public/project-images/bravezm.png'
WHERE title = 'BRAVEZM Gaming';

UPDATE projects SET image_url = 'https://fvuaiwxfdgerjbuszgpf.supabase.co/storage/v1/object/public/project-images/bestyboy.png'
WHERE title = 'BestyBoy Gaming';

UPDATE projects SET image_url = 'https://fvuaiwxfdgerjbuszgpf.supabase.co/storage/v1/object/public/project-images/ahmed-helly-academy.png'
WHERE title = 'Ahmed Helly Academy';

UPDATE projects SET image_url = 'https://fvuaiwxfdgerjbuszgpf.supabase.co/storage/v1/object/public/project-images/eco-eats.png'
WHERE title = 'Eco Eats';

UPDATE projects SET image_url = 'https://fvuaiwxfdgerjbuszgpf.supabase.co/storage/v1/object/public/project-images/bmo-tools.png'
WHERE title = 'BMO Tools';

UPDATE projects SET image_url = 'https://fvuaiwxfdgerjbuszgpf.supabase.co/storage/v1/object/public/project-images/bemora.png'
WHERE title = 'Bemora';

UPDATE projects SET image_url = 'https://fvuaiwxfdgerjbuszgpf.supabase.co/storage/v1/object/public/project-images/mr-mohammed.png'
WHERE title = 'MR Mohammed';

UPDATE projects SET image_url = 'https://fvuaiwxfdgerjbuszgpf.supabase.co/storage/v1/object/public/project-images/diaa-elden-shop.png'
WHERE title = 'Diaa Elden Shop';
```

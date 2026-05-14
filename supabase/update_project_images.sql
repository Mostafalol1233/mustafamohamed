-- Run this in Supabase SQL Editor to fix project image URLs
-- Images are served from /assets/ on your app server

UPDATE projects SET image_url = '/assets/image_1748447815242.png'
  WHERE title ILIKE '%BRAVEZM%' AND (image_url IS NULL OR image_url NOT LIKE '/assets/%');

UPDATE projects SET image_url = '/assets/image_1748447890581.png'
  WHERE title ILIKE '%BestyBoy%' AND (image_url IS NULL OR image_url NOT LIKE '/assets/%');

UPDATE projects SET image_url = '/assets/image_1748448070181.png'
  WHERE title ILIKE '%Ahmed Helly%' AND (image_url IS NULL OR image_url NOT LIKE '/assets/%');

UPDATE projects SET image_url = '/assets/eco-eats-preview.png'
  WHERE title ILIKE '%Eco Eats%' AND (image_url IS NULL OR image_url NOT LIKE '/assets/%');

UPDATE projects SET image_url = '/assets/bmo-tools-preview.png'
  WHERE title ILIKE '%BMO%' AND (image_url IS NULL OR image_url NOT LIKE '/assets/%');

UPDATE projects SET image_url = '/assets/bemora-new.png'
  WHERE title ILIKE '%Bemora%' AND (image_url IS NULL OR image_url NOT LIKE '/assets/%');

UPDATE projects SET image_url = '/assets/mr-mohammed.png'
  WHERE title ILIKE '%MR Mo%' OR title ILIKE '%MR Mohammed%'
  AND (image_url IS NULL OR image_url NOT LIKE '/assets/%');

UPDATE projects SET image_url = '/assets/diaa-elden-shop.png'
  WHERE title ILIKE '%Diaa%' AND (image_url IS NULL OR image_url NOT LIKE '/assets/%');

-- OneTeam has no local image; keep existing URL or set a placeholder
-- UPDATE projects SET image_url = 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&h=400'
--   WHERE title ILIKE '%OneTeam%' AND image_url IS NULL;

-- Verify
SELECT id, title, image_url FROM projects ORDER BY created_at DESC;

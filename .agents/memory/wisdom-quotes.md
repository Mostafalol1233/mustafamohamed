---
name: Wisdom quotes
description: The quote card on the hero section uses wisdomQuotes.ts, not animeQuotes.ts. Tab label is "wisdom.md", field is quote.author.
---

## Rule
The hero QuoteCard uses `getDailyWisdom()` from `client/src/data/wisdomQuotes.ts`. The quote object has fields `quote` (string) and `author` (string). The VS Code-style tab is labelled `wisdom.md`.

**Why:** User requested removal of all anime references. The old `animeQuotes.ts` used `quote.character` and the tab was `wisdom.anime`.

## How to apply
- Import `getDailyWisdom` from `@/data/wisdomQuotes`
- Render `{quote.author}` not `{quote.character}`
- Tab label: `wisdom.md`
- Do NOT re-add `animeQuotes.ts` or any anime references

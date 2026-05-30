---
name: Theme 3-state hook
description: useTheme cycles light→dark→system. Navigation uses mode (not isDark) to pick icon.
---

ThemeMode = "light" | "dark" | "system". toggle() cycles light→dark→system→light.

**How to apply:** When driving the toggle button icon, use `mode` from useTheme:
- mode === "light"  → show Moon icon (next action: go dark)
- mode === "dark"   → show Sun icon (next action: follow system)
- mode === "system" → show Monitor icon (next action: go light)

isDark is still exported for conditional styling throughout the app (true when mode==="dark" or when mode==="system" and prefers-color-scheme:dark).

---
name: next-app-router
description: Next.js App Router conventions for the MMK landing site. Use when adding routes, metadata, server or client components, images, sitemap, or robots.
---

# Next.js App Router (landing)

- Default to Server Components. Add `"use client"` only for menus, theme, and forms.
- Use the Metadata API (`generateMetadata`) with a unique canonical path. Never canonicalise every page to `/`.
- Generate static params from typed data in `src/data`.
- Prefer `next/font` and `next/image`. Do not add animation libraries.
- Keep `sitemap.ts` and `robots.ts` in sync with public routes.
- This app uses Next.js 16. Read `node_modules/next/dist/docs/` before using unfamiliar APIs.

@AGENTS.md

# Planinsko društvo Goričko – Tromeja — Project Guide (CLAUDE.md)

> This file is the single source of truth for building this website. Another Claude
> instance should be able to implement the entire project from this document alone.
> Read it top to bottom before writing code. Where it disagrees with your training
> data, **this file and the local `node_modules/next/dist/docs/` win** (see AGENTS.md).

---

## 0. CRITICAL VERSION NOTES — READ FIRST

 **Next.js 16.2.9** with **React 19.2.4** and **Tailwind CSS v4**. check documentation before making changes
Build against what is installed. The following are the breaking changes that will bite
you if you rely on memory:

| Concept (old / training data)        | This version (Next 16.2.9)                                                |
| ------------------------------------ | ------------------------------------------------------------------------- |
| `middleware.ts`                      | **`proxy.ts`** at project root. Export a `proxy` fn (named or default).   |
| `cookies()` returns store            | **`cookies()` is async** → `const c = await cookies()`.                    |
| `headers()` returns store            | **`headers()` is async** → `const h = await headers()`.                   |
| `params` / `searchParams` are sync   | **They are Promises** → `const { slug } = await params`.                  |
| `router.refresh()` only              | Server Actions can call **`refresh()` from `next/cache`**.                 |
| `tailwind.config.js` required        | **Tailwind v4 is CSS-first**: config lives in `globals.css` via `@theme`. |
| `next.config.js`                     | Use **`next.config.ts`** (TypeScript config supported).                   |
| Zod 3 (`z.string().uuid()`)          | **Zod 4 is installed (4.4.3)** → `z.uuid()`, `z.iso.datetime()`, `z.email()`, `{ error }`. |

Before using any Next API you are unsure about, open the matching doc under
`node_modules/next/dist/docs/01-app/`. Key files already verified:
`01-getting-started/16-proxy.md`, `07-mutating-data.md`, `14-metadata-and-og-images.md`,
`02-guides/authentication.md`.

Do **not** "downgrade" the project to Next 15 patterns to match the brief.

---

## 1. PROJECT IDENTITY

- **Client:** Planinsko društvo Goričko – Tromeja (a Slovenian hiking / mountaineering club).
- **Language of all UI copy:** Slovenian (`lang="sl"`). Code, comments, identifiers: English.
- **Purpose:** A fast, low-maintenance public website plus a tiny protected admin area where
  non-technical volunteers add / edit / remove hiking events ("pohodi") and gallery images.
- **Hard constraint:** **No database.** All content lives in JSON files committed to the
  git repository. The app behaves like a mini CMS but the "database" is the repo itself.
- **Hosting:** Vercel (Hobby tier target). Source on GitHub. Must be essentially free to run.
- **Quality bar:** Lighthouse 90+ on every public page; WCAG AA; fully responsive.

---

## 2. TECH STACK (pinned to what is installed)

| Layer            | Choice                                              |
| ---------------- | --------------------------------------------------- |
| Framework        | Next.js **16.2.9**, App Router, React **19.2.4**    |
| Language         | TypeScript 5 (strict)                               |
| Styling          | Tailwind CSS **v4** (`@tailwindcss/postcss`)        |
| Components       | shadcn/ui (Radix primitives)                        |
| Icons            | lucide-react                                        |
| Forms            | react-hook-form + `@hookform/resolvers`             |
| Validation       | zod                                                 |
| Dates            | date-fns (+ `date-fns/locale/sl`)                   |
| Auth hashing     | **bcryptjs** (pure JS — avoids native build issues) |
| Session token    | **jose** (signed JWT in an HttpOnly cookie)         |
| Repo writes      | **@octokit/rest** (GitHub Contents API)             |
| UUIDs            | `crypto.randomUUID()` (built in, no dep)            |

Dependencies to add (do not remove anything already present). **`zod` (4.4.3) and `jose`
(6.2.3) are ALREADY installed — do not reinstall or downgrade them:**

```bash
npm i bcryptjs @octokit/rest react-hook-form @hookform/resolvers date-fns lucide-react
npm i -D @types/bcryptjs tsx   # tsx runs scripts/create-user.ts
```

shadcn/ui (Tailwind v4 + React 19 aware):

```bash
npx shadcn@latest init        # choose: TypeScript, New York style, neutral base, CSS variables
npx shadcn@latest add button card input label textarea form dialog dropdown-menu \
  select badge sonner table tabs switch sheet alert-dialog skeleton avatar separator
```

> If npm blocks on React 19 peer ranges, install app deps with `--legacy-peer-deps`. Do not
> downgrade React.

---

## 3. ARCHITECTURE OVERVIEW

### 3.1 Content model: "Git as the database"

Content is stored as JSON in `content/`. There are **two read paths and two write paths**,
and they differ between environments. This is the single most important architectural idea
in the project — get it right.

**Reads (always):** Server Components and server code read content through a small storage
module. In production the JSON is bundled with the deployment, so reads are just
`fs.readFile` of files that shipped with the build (fast, zero network).

**Writes (the tricky part):** On Vercel the serverless filesystem is **read-only / ephemeral**
— you cannot persist a write by calling `fs.writeFile` in production. Therefore the admin
panel **writes by committing to GitHub** via the Contents API. A commit triggers Vercel to
rebuild and redeploy, after which the new content is live.

```
Admin saves a hike ──▶ Server Action ──▶ storage.write()
                                           │
                 ┌─────────────────────────┴─────────────────────────┐
        DEV (NODE_ENV !== 'production')             PROD (Vercel)
        write file on local disk with fs            PUT to GitHub Contents API
        (instant, you commit by hand)               (Octokit) → commit on `main`
                                                     → Vercel auto-redeploy (~30–60s)
```

Consequences to document in the UI and respect in code:

- After an admin save **in production**, changes go live only after the redeploy finishes.
  Show a toast: _"Spremembe so shranjene. Spletna stran se posodablja (lahko traja minuto)."_
- Treat every write as an optimistic-but-eventually-consistent operation. Never promise
  instant publication in prod copy.
- Image uploads follow the same rule: the file is committed into `public/uploads/` and is
  only servable after the redeploy.

### 3.2 Why this satisfies the constraints

- No Postgres/Mongo/Supabase/Firebase/Prisma/Drizzle/Sanity/Strapi/Payload/Decap. ✔
- Content is plain JSON in the repo, version-controlled and diff-able. ✔
- Free to run: static-leaning pages + a handful of server actions on Vercel Hobby. ✔
- "Feels like a CMS" for the volunteer, while being just files. ✔

### 3.3 Rendering strategy

- Public pages are **Server Components** by default. Use Client Components only for
  interactive islands (filters, gallery lightbox, admin forms, mobile nav).
- Public hike/list/detail pages should be statically rendered and revalidated. Use
  `export const revalidate = 60` (or revalidate on write via `revalidatePath`) so a
  redeploy is not strictly required for ISR — but because content ships in the bundle,
  the simplest correct mental model is "content updates land with the next deploy."
- Prefer server-side data access. No client-side fetching of content JSON.

---

## 4. FOLDER STRUCTURE

Create exactly this layout (App Router, `src/` directory). Slovenian route segments are
intentional — they become the public URLs.

```
.
├── proxy.ts                      # route protection (was "middleware.ts")
├── next.config.ts
├── postcss.config.mjs            # @tailwindcss/postcss (already present)
├── components.json               # shadcn config (generated by init)
├── content/
│   ├── hikes.json                # all hikes (see §5)
│   ├── users.json                # admin users, bcrypt hashes only (see §5)
│   └── society.json              # editable "about / contact" club info (see §5)
├── public/
│   └── uploads/                  # user-uploaded images, committed to the repo
│       └── .gitkeep
├── scripts/
│   └── create-user.ts            # CLI to generate a bcrypt user (run with tsx/node)
└── src/
    ├── app/
    │   ├── layout.tsx            # root layout, <html lang="sl">, fonts, header/footer
    │   ├── globals.css           # Tailwind v4 + @theme tokens
    │   ├── page.tsx              # / homepage
    │   ├── sitemap.ts            # dynamic sitemap.xml
    │   ├── robots.ts             # robots.txt
    │   ├── opengraph-image.tsx   # default OG image (optional)
    │   ├── not-found.tsx
    │   ├── o-drustvu/
    │   │   └── page.tsx          # About Society  (/o-drustvu)
    │   ├── pohodi/
    │   │   ├── page.tsx          # Hikes list + filters/sorting (/pohodi)
    │   │   └── [slug]/
    │   │       └── page.tsx      # Single hike (/pohodi/<slug>)
    │   ├── galerija/
    │   │   └── page.tsx          # Gallery (/galerija)
    │   ├── kontakt/
    │   │   └── page.tsx          # Contact (/kontakt)
    │   ├── admin/
    │   │   ├── page.tsx          # Login screen (public) at /admin
    │   │   ├── login-form.tsx    # 'use client' form
    │   │   └── (dashboard)/      # route group, protected by proxy + layout DAL check
    │   │       ├── layout.tsx    # admin shell (sidebar/topbar), verifySession()
    │   │       ├── dashboard/page.tsx        # hike list / overview
    │   │       ├── pohodi/
    │   │       │   ├── page.tsx              # manage hikes table
    │   │       │   ├── nov/page.tsx          # create hike
    │   │       │   └── [id]/page.tsx         # edit hike
    │   │       └── galerija/page.tsx         # manage gallery images
    │   └── api/
    │       └── admin/
    │           └── upload/route.ts           # image upload Route Handler (protected)
    ├── components/
    │   ├── ui/                   # shadcn primitives (generated)
    │   ├── layout/               # Header, Footer, MobileNav, Container
    │   ├── public/               # Hero, HikeCard, HikeFilters, GalleryGrid, Lightbox, …
    │   └── admin/                # HikeForm, HikeTable, ImageUploader, PublishToggle, …
    ├── lib/
    │   ├── content/
    │   │   ├── storage.ts        # low-level read/write (fs in dev, GitHub in prod)
    │   │   ├── github.ts         # Octokit helpers (getFile, putFile, deleteFile)
    │   │   ├── hikes.ts          # domain repo: getHikes, getHikeBySlug, upsert, remove
    │   │   └── society.ts        # read/update society.json
    │   ├── auth/
    │   │   ├── session.ts        # jose encrypt/decrypt + cookie create/destroy
    │   │   ├── dal.ts            # verifySession(), getCurrentUser() (cached)
    │   │   └── password.ts       # bcryptjs hash/verify wrappers
    │   ├── validation/
    │   │   └── schemas.ts        # all Zod schemas + inferred types
    │   ├── seo.ts                # buildMetadata() helper, JSON-LD builders
    │   └── utils.ts              # cn(), slugify(), formatDate(), constants
    └── types/
        └── index.ts             # shared TS types (re-export Zod-inferred types)
```

---

## 5. DATA MODEL & JSON FILES

All shapes are defined once as Zod schemas in `src/lib/validation/schemas.ts`; TypeScript
types are inferred from them (`z.infer`). Never hand-maintain a parallel `interface`.

> Note: the brief's example JSON contains typos (`"imagse"`, trailing comma). Use the
> corrected canonical shapes below.

### 5.1 `content/hikes.json`

```jsonc
{
  "hikes": [
    {
      "id": "f3c1c0a2-...-uuid",     // crypto.randomUUID()
      "slug": "pohod-na-boc",        // unique, kebab-case, derived from title
      "title": "Pohod na Boč",
      "date": "2026-09-15",          // ISO date (YYYY-MM-DD)
      "location": "Boč",
      "difficulty": "medium",        // "easy" | "medium" | "hard"
      "distance": "12 km",           // free-text label
      "elevation": "650 m",          // free-text label
      "description": "Opis pohoda…", // plain text / simple markdown
      "image": "/uploads/boc.jpg",   // featured image (path under /public)
      "images": ["/uploads/boc.jpg", "/uploads/boc2.jpg"], // gallery, includes featured
      "published": true,
      "createdAt": "2026-06-22T10:00:00.000Z", // ISO datetime
      "updatedAt": "2026-06-22T10:00:00.000Z"
    }
  ]
}
```

### 5.2 `content/users.json`

```jsonc
{
  "users": [
    {
      "id": "1",
      "username": "admin",
      "passwordHash": "$2a$10$....",  // bcryptjs hash — NEVER plaintext
      "role": "admin"                 // only "admin" for now, keep the field
    }
  ]
}
```

Seed this with `scripts/create-user.ts` (prompts for username/password, prints a JSON entry
with a fresh bcrypt hash). Never commit plaintext passwords or `.env` secrets.

### 5.3 `content/society.json`

Editable club info so the volunteer can change contact details without touching code.

```jsonc
{
  "name": "Planinsko društvo Goričko – Tromeja",
  "tagline": "Skupaj odkrivamo lepote Goričkega in Tromeje.",
  "about": "Daljši opis društva …",
  "email": "info@pd-goricko-tromeja.si",
  "phone": "+386 ...",
  "address": "Naslov, Slovenija",
  "social": { "facebook": "https://…" }
}
```

### 5.4 Zod schemas (authoritative — implement in `schemas.ts`)

Use **Zod 4** APIs (installed: 4.4.3): top-level format helpers (`z.uuid()`, `z.email()`,
`z.iso.date()`, `z.iso.datetime()`) and the `{ error }` message form. Do **not** use the
deprecated Zod 3 chained `.uuid()` / `.datetime()`.

```ts
import { z } from 'zod'

export const difficultyEnum = z.enum(['easy', 'medium', 'hard'])

export const hikeSchema = z.object({
  id: z.uuid(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { error: 'Neveljaven slug' }),
  title: z.string().min(3).max(120),
  date: z.iso.date(),                       // YYYY-MM-DD
  location: z.string().min(2).max(120),
  difficulty: difficultyEnum,
  distance: z.string().max(40),
  elevation: z.string().max(40),
  description: z.string().min(10).max(5000),
  image: z.union([z.string().startsWith('/uploads/'), z.literal('')]),
  images: z.array(z.string().startsWith('/uploads/')).default([]),
  published: z.boolean().default(false),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
})

// Form input = what the admin form submits (server fills id/slug/timestamps).
export const hikeFormSchema = hikeSchema.omit({
  id: true, slug: true, createdAt: true, updatedAt: true,
})

export const userSchema = z.object({
  id: z.string(),
  username: z.string().min(3),
  passwordHash: z.string(),
  role: z.literal('admin'),
})

export const loginSchema = z.object({
  username: z.string().min(1, { error: 'Vnesite uporabniško ime' }),
  password: z.string().min(1, { error: 'Vnesite geslo' }),
})

// Whole-file schemas — safeParse these when reading the JSON files.
export const hikesFileSchema = z.object({ hikes: z.array(hikeSchema) })
export const usersFileSchema = z.object({ users: z.array(userSchema) })

export type Hike = z.infer<typeof hikeSchema>
export type HikeFormValues = z.infer<typeof hikeFormSchema>
export type Difficulty = z.infer<typeof difficultyEnum>
export type User = z.infer<typeof userSchema>
```

Always `safeParse` JSON on read and validate form data on the server before writing.

---

## 6. STORAGE LAYER (`src/lib/content/`)

### 6.1 `storage.ts` — environment-aware read/write

```ts
import 'server-only'
import { cache } from 'react'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { putFile } from './github'

const isProd = process.env.NODE_ENV === 'production'
const root = process.cwd()

// Wrapped in React cache() so each JSON file is read+parsed once per render pass.
export const readJson = cache(async <T>(repoPath: string): Promise<T> => {
  // repoPath is relative to repo root, e.g. "content/hikes.json"
  const raw = await fs.readFile(path.join(root, repoPath), 'utf8')
  return JSON.parse(raw) as T
})

export async function writeJson(repoPath: string, data: unknown, message: string) {
  const content = JSON.stringify(data, null, 2) + '\n'
  if (isProd) {
    await putFile(repoPath, content, message)   // commit to GitHub
  } else {
    await fs.writeFile(path.join(root, repoPath), content, 'utf8') // local disk
  }
}
```

Notes:

- **Reads** always use the local bundled file (fast, works in prod). Do not read content
  over the network at request time.
- **Writes** branch on environment. In prod they commit; the new file becomes a bundled read
  on the next deploy.

### 6.2 `github.ts` — Octokit Contents API

Implements `getFile(path)`, `putFile(path, content, message)`, `deleteFile(path, message)`,
and `putBinary(path, base64, message)` for images. Use the repo coordinates and a fine-grained
PAT from env (see §16). `putFile` fetches the current file `sha` (Contents API requires it for
updates), base64-encodes the content, and **retries once on a 409 conflict** (a concurrent
write changed the sha) so two near-simultaneous admin saves can't silently clobber each other.

```ts
import 'server-only'
import { Octokit } from '@octokit/rest'

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
const owner = process.env.GITHUB_OWNER!
const repo = process.env.GITHUB_REPO!
const branch = process.env.GITHUB_BRANCH ?? 'main'

async function currentSha(filePath: string): Promise<string | undefined> {
  try {
    const { data } = await octokit.repos.getContent({ owner, repo, path: filePath, ref: branch })
    if (!Array.isArray(data) && 'sha' in data) return data.sha
  } catch { /* new file → undefined */ }
}

export async function putFile(filePath: string, content: string, message: string) {
  const base64 = Buffer.from(content, 'utf8').toString('base64')
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      await octokit.repos.createOrUpdateFileContents({
        owner, repo, path: filePath, message, branch,
        sha: await currentSha(filePath), content: base64,
      })
      return
    } catch (err: unknown) {
      if ((err as { status?: number })?.status === 409 && attempt === 0) continue // stale sha → retry
      throw err
    }
  }
}
// putBinary: same loop, but `content: base64` is already the image bytes.
```

### 6.3 `hikes.ts` — domain repository (the only API the app calls)

Expose a clean, typed API; everything else (Server Components, actions) goes through it:

```ts
getHikes(): Promise<Hike[]>                       // all, sorted by date desc
getPublishedHikes(): Promise<Hike[]>              // published only (public site)
getUpcomingHikes(): Promise<Hike[]>               // published & date >= today
getPastHikes(): Promise<Hike[]>                   // published & date < today
getHikeBySlug(slug): Promise<Hike | null>
getHikeById(id): Promise<Hike | null>
createHike(input: HikeFormValues): Promise<Hike>  // assigns id, unique slug, timestamps
updateHike(id, input: HikeFormValues): Promise<Hike>
deleteHike(id): Promise<void>
setPublished(id, published: boolean): Promise<void>
```

- `createHike` derives a **unique** slug via `slugify(title)` + numeric suffix on collision.
- Every mutation rewrites the whole `hikes.json` (small file — fine) and then the caller
  runs `revalidatePath` on affected routes.
- `slugify` must transliterate Slovenian diacritics: č→c, š→s, ž→z, đ→d, ć→c.

---

## 7. AUTHENTICATION & AUTHORIZATION

Custom auth only. **No NextAuth, no OAuth, no external providers.** Pattern follows the
verified local doc `node_modules/next/dist/docs/01-app/02-guides/authentication.md`.

### 7.1 Passwords — `lib/auth/password.ts`

```ts
import bcrypt from 'bcryptjs'
export const hashPassword = (pw: string) => bcrypt.hash(pw, 10)
export const verifyPassword = (pw: string, hash: string) => bcrypt.compare(pw, hash)
```

### 7.2 Session — `lib/auth/session.ts` (jose JWT in HttpOnly cookie)

- Sign a minimal payload `{ userId, username, role, expiresAt }` with `SESSION_SECRET`
  (HS256), 7-day expiry.
- Cookie name `session`, options: `httpOnly: true`, `secure: true`,
  `sameSite: 'lax'`, `path: '/'`, `expires`.
- `createSession(user)`, `getSession()`, `destroySession()`. **`cookies()` is async** —
  always `await cookies()`.

### 7.3 DAL — `lib/auth/dal.ts`

```ts
import 'server-only'
import { cache } from 'react'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { decrypt } from './session'

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)
  if (!session?.userId) redirect('/admin')
  return { userId: session.userId, role: session.role, username: session.username }
})
```

Call `verifySession()` at the top of the admin layout, every protected page, **every Server
Action, and the upload Route Handler**. UI hiding is not security — the data lives behind
Server Actions which are POST-reachable directly, so authorize inside each one.

### 7.4 Login flow

- `/admin/page.tsx` renders `login-form.tsx` (`'use client'`, react-hook-form + zod via
  `@hookform/resolvers/zod`), submitting to a `login` Server Action through `useActionState`.
- `login` action: validate with `loginSchema` → load `users.json` → find by username →
  `verifyPassword` → on success `createSession` + `redirect('/admin/dashboard')`; on failure
  return a generic error _"Napačno uporabniško ime ali geslo."_ (don't reveal which field).
- `logout` action: `destroySession()` + `redirect('/admin')`. Render it as a form button in
  the admin shell.

### 7.5 Route protection — `proxy.ts` (NOT `middleware.ts`)

```ts
import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/lib/auth/session'

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isProtected =
    (pathname.startsWith('/admin') && pathname !== '/admin') ||
    pathname.startsWith('/api/admin')

  if (!isProtected) return NextResponse.next()

  const token = req.cookies.get('session')?.value
  const session = await decrypt(token)
  if (!session?.userId) {
    return NextResponse.redirect(new URL('/admin', req.nextUrl))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
```

This is the **optimistic** check (cookie only). The DAL re-check in pages/actions is the real
gate. Protect `/admin/*` (except the `/admin` login page) and `/api/admin/*`. Unauthenticated
users hitting protected routes are redirected to `/admin`.

---

## 8. ADMIN PANEL (mini-CMS)

Lives under the `(dashboard)` route group. Must look modern and clean using shadcn/ui, and
feel like a small CMS for a non-technical Slovenian volunteer (all labels in Slovenian).

### 8.1 Shell — `admin/(dashboard)/layout.tsx`

- Server Component; calls `verifySession()` first (redirects if not logged in).
- Sidebar (collapsible to a `Sheet` on mobile): Nadzorna plošča, Pohodi, Galerija; footer with
  username + Odjava button.
- Topbar: page title, "Odpri spletno stran" link (target `_blank`), logout.

### 8.2 Capabilities (all required)

- **List hikes** — `Table` with title, date (formatted `dd. MM. yyyy`, `sl` locale),
  difficulty `Badge`, published `Switch`, row actions (Uredi / Izbriši).
- **Create hike** — `/admin/pohodi/nov`, `HikeForm`.
- **Edit hike** — `/admin/pohodi/[id]`, `HikeForm` prefilled.
- **Delete hike** — `AlertDialog` confirm → `deleteHike` action.
- **Publish / unpublish** — `Switch` → `setPublished` action (optimistic UI ok).
- **Upload images** — `ImageUploader` posts to `/api/admin/upload`; returned path is stored on
  the hike (`image` + appended to `images`). Also a standalone gallery manager page.

### 8.3 `HikeForm` (`components/admin/HikeForm.tsx`, `'use client'`)

- react-hook-form + `zodResolver(hikeFormSchema)`; shadcn `Form` components.
- Fields: title, date (date input), location, difficulty (`Select`), distance, elevation,
  description (`Textarea`), featured image + gallery (`ImageUploader`), published (`Switch`).
- Submits to `createHike` / `updateHike` Server Actions via `useActionState`; show pending
  state on the submit button; `sonner` toast on success/error; redirect to the list after save.
- After a successful prod save, toast must warn about the redeploy delay (see §3.1).

### 8.4 Image upload — `api/admin/upload/route.ts`

- `POST`, multipart form-data, **`verifySession()` first** (401 if not authed).
- Validate: mime in `{image/jpeg,image/png,image/webp}`, size ≤ ~4 MB, sanitize filename,
  prefix with a short uuid to avoid collisions.
- Dev: write into `public/uploads/`. Prod: `putBinary('public/uploads/<name>', base64, msg)`.
- Respond `{ path: '/uploads/<name>' }`. Tell the user the image appears after redeploy in prod.

> Keep uploads modest; the repo is the store. Recommend pre-resizing very large photos.

---

## 9. PUBLIC WEBSITE — PAGES & CONTENT

All public copy in Slovenian. Use realistic hiking-club placeholder text (examples below).
Every page sets unique metadata (§12), is responsive (§10) and accessible (§11).

### 9.1 Routes

| Page          | Route         | Notes                                              |
| ------------- | ------------- | -------------------------------------------------- |
| Domov         | `/`           | Homepage sections below                            |
| O društvu     | `/o-drustvu`  | About the society (from `society.json`)            |
| Pohodi        | `/pohodi`     | List + filter + sort                               |
| Posamezni pohod | `/pohodi/[slug]` | Dynamic, statically generated per published hike |
| Galerija      | `/galerija`   | Image grid + lightbox                              |
| Kontakt       | `/kontakt`    | Club contact info + form (mailto or static)        |
| Prijava       | `/admin`      | Admin login                                        |
| Nadzorna plošča | `/admin/dashboard` | Admin (protected)                            |

### 9.2 Homepage (`/`) sections — in order

1. **Hero** — club name, tagline, background mountain image, primary CTA "Pridruži se nam"
   → `/kontakt`, secondary "Naši pohodi" → `/pohodi`.
2. **Prihajajoči pohodi** — up to 3 upcoming `HikeCard`s; "Vsi pohodi" link.
3. **O društvu (predogled)** — short blurb from `society.json` + "Več o nas" → `/o-drustvu`.
4. **Poziv k dejanju (CTA)** — join / newsletter-style band.
5. **Galerija (predogled)** — 6–8 thumbnails → `/galerija`.
6. **Kontakt (predogled)** — email, phone, social, small address block → `/kontakt`.

Placeholder copy example (use/extend, keep it authentic):
> "Planinsko društvo Goričko – Tromeja združuje ljubitelje gora in narave iz Pomurja.
> Organiziramo vodene pohode, izlete in družabne dogodke za vse generacije — od lahkih
> sprehodov po Goričkem do zahtevnejših vzponov v Alpe."

### 9.3 Pohodi list (`/pohodi`)

- Two groups: **Prihajajoči pohodi** and **Pretekli pohodi** (published only).
- **Filters:** by date (e.g. month / upcoming-vs-past) and by difficulty (Lahko/Srednje/Zahtevno).
- **Sorting:** Najnovejši (date desc) / Najstarejši (date asc).
- Implement filtering/sorting via URL `searchParams` (remember: **`searchParams` is a Promise**,
  `await` it in the page) so results are shareable + SEO-friendly. A small Client island may read
  the params and update them.
- Each item is a `HikeCard` linking to `/pohodi/[slug]`.

### 9.4 Single hike (`/pohodi/[slug]`)

- `generateStaticParams()` from published hikes; `params` is a Promise → `const { slug } = await params`.
- If not found or unpublished → `notFound()`.
- Show: title, date (`sl` locale), location, difficulty badge, distance, elevation,
  description, featured image (Next `<Image>`), and a small gallery of `images`.
- Add `generateMetadata` (unique title/description/OG) and **JSON-LD `Event`** structured data.

### 9.5 Galerija (`/galerija`)

- Aggregate images from all published hikes (and any standalone gallery images).
- Responsive grid using Next `<Image>` (lazy, `sizes` set, blur placeholder if feasible).
- Accessible lightbox (`Dialog`): keyboard navigable (Esc to close, arrows to move), focus-trapped,
  `alt` text per image (derive from hike title).

### 9.6 Kontakt (`/kontakt`)

- Pull details from `society.json`. Provide a simple contact form that either uses a `mailto:`
  submit or a no-op success state (no email backend required for the brief). Label everything,
  validate with zod, keep it accessible.

---

## 10. RESPONSIVE DESIGN

- Mobile-first. Tailwind breakpoints: base (mobile) → `sm` → `md` (tablet) → `lg`/`xl` (desktop).
- Header collapses to a hamburger → shadcn `Sheet` on mobile.
- Grids: 1 col mobile, 2 col tablet, 3 col desktop for cards/gallery.
- Tap targets ≥ 44px; no horizontal scroll at 320px width.
- Use a `Container` component for consistent max-width (`max-w-6xl mx-auto px-4`).

---

## 11. ACCESSIBILITY (WCAG AA target)

- Semantic landmarks: one `<h1>` per page, ordered headings, `<header><nav><main><footer>`.
- Full keyboard navigation; **visible focus rings** (do not remove outlines — style them with
  `focus-visible`).
- All form fields have associated `<label>` (shadcn `Form`/`Label` handle this — keep ids).
- All images have meaningful `alt`; decorative images `alt=""`.
- Color contrast ≥ 4.5:1 for text; verify the chosen palette.
- Dialogs/sheets: focus trap + restore focus on close (Radix handles this — don't break it).
- Skip-to-content link at the top of `layout.tsx`.
- Respect `prefers-reduced-motion` for any animation.

---

## 12. SEO

- Use the **Metadata API**. Root `layout.tsx` sets `metadataBase`, default title template
  (`%s | Planinsko društvo Goričko – Tromeja`), description, OpenGraph + Twitter (`summary_large_image`).
- Every page exports unique `metadata` or `generateMetadata` (hike detail must be dynamic).
- `app/sitemap.ts` → enumerates static routes + every published hike slug.
- `app/robots.ts` → allow all, point to sitemap; **disallow `/admin` and `/api`**.
- Structured data (JSON-LD): `Organization` (or `SportsOrganization`) in root layout;
  `Event` on each hike detail page (name, startDate, location, description, image).
- Provide a default `opengraph-image` and per-hike OG (use featured image). See verified doc
  `01-getting-started/14-metadata-and-og-images.md` for the exact file conventions.

```ts
// example: app/robots.ts
import type { MetadataRoute } from 'next'
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  }
}
```

---

## 13. PERFORMANCE (Lighthouse 90+)

- Server Components by default; minimize `'use client'` to interactive islands.
- Images: always Next `<Image>` with explicit `sizes`, `priority` only on the hero,
  lazy-load the rest. Store reasonably sized uploads.
- Fonts: `next/font` (e.g. Geist or Inter) with `display: swap`, subset `latin-ext`
  (Slovenian needs č/š/ž). Self-hosted via `next/font` — no external font requests.
- Avoid large client bundles; import icons individually (`import { Mountain } from 'lucide-react'`).
- Set `revalidate` on public pages; avoid blocking data waterfalls.
- No client-side fetching of content JSON; everything server-rendered.

---

## 14. UI / DESIGN SYSTEM

- shadcn/ui (New York style) + Tailwind v4. Theme tokens (colors, radius) are defined CSS-first in
  `globals.css` via `@theme` — **there is no `tailwind.config.js`** in v4. Example:

```css
/* globals.css */
@import "tailwindcss";

@theme {
  --color-primary: oklch(0.45 0.09 150);       /* forest green — hiking identity */
  --color-primary-foreground: oklch(0.98 0 0);
  --radius: 0.625rem;
  /* …shadcn variable mapping… */
}
```

- **Visual direction:** clean, outdoorsy, trustworthy. Forest-green primary, warm neutral
  surfaces, generous whitespace, large readable typography, mountain/nature photography.
  Avoid a generic SaaS-template look — it should feel like a local Slovenian mountain club.
- Reusable building blocks: `Container`, `Section`, `PageHeader`, `HikeCard`, difficulty `Badge`
  (easy→green, medium→amber, hard→red; labels Lahko/Srednje/Zahtevno).
- Use `lucide-react` icons (Mountain, MapPin, CalendarDays, Ruler, TrendingUp, etc.).
- Toasts via `sonner`. Loading via `Skeleton`. Confirmations via `AlertDialog`.

---

## 15. CODING CONVENTIONS

- **Strict TypeScript** (`strict: true` already in tsconfig). No `any`; use `unknown` + narrow.
- Types come from Zod (`z.infer`) — single source of truth; no duplicated interfaces.
- Server Actions live in clearly named files; **always** `verifySession()` + `safeParse`
  before mutating; call `revalidatePath()` after writes; `redirect()` last.
- Naming: components `PascalCase`, functions/vars `camelCase`, route segments `kebab-case`
  (Slovenian), constants `UPPER_SNAKE`. Action names are verbs (`createHike`, `deleteHike`).
- Keep components small and composable; extract shared logic into `lib/`. DRY — no copy-paste
  of read/write or auth logic; it all goes through the repos/DAL.
- `import 'server-only'` in any module that must never reach the client (storage, github, auth,
  session). Secrets never imported into client components.
- Error handling: wrap storage/GitHub calls; surface friendly Slovenian messages to users,
  log technical detail server-side.
- Format: follow existing ESLint (`eslint-config-next`). Run `npm run lint` before finishing.

---

## 16. ENVIRONMENT VARIABLES

Create `.env.local` (gitignored) for dev and set the same in Vercel Project Settings.
Provide a committed `.env.example` documenting them (no secrets).

| Variable          | Purpose                                                          | Required where |
| ----------------- | --------------------------------------------------------------- | -------------- |
| `SESSION_SECRET`  | 32+ char secret to sign session JWT (`openssl rand -base64 32`) | dev + prod     |
| `GITHUB_TOKEN`    | Fine-grained PAT, **Contents: Read & Write** on this repo only  | prod (writes)  |
| `GITHUB_OWNER`    | GitHub org/user that owns the repo                              | prod           |
| `GITHUB_REPO`     | Repo name                                                       | prod           |
| `GITHUB_BRANCH`   | Branch to commit to (default `main`)                            | prod           |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for metadata/sitemap                    | dev + prod     |

In development, GitHub vars are optional (writes go to local disk). The PAT must be the
**minimum scope** (Contents R/W on this one repo). Never expose it client-side — only
`lib/content/github.ts` (server-only) reads it.

---

## 17. SETUP & COMMANDS

```bash
npm install                 # deps already partly present; add the ones in §2
npm run dev                 # http://localhost:3000  (Turbopack)
npm run build               # production build (run before deploy; must pass)
npm run start               # serve the production build locally
npm run lint                # ESLint (eslint-config-next)
npx tsx scripts/create-user.ts   # create/seed an admin user (bcrypt)
```

Local content workflow: editing in the admin panel writes JSON to disk; commit those changes
to git yourself in dev. In production the panel commits for you via the GitHub API.

---

## 18. GITHUB & DEPLOYMENT (Vercel)

1. Push the repo to GitHub. `main` is the production branch (the current local branch is
   `master` — align them or set `GITHUB_BRANCH` accordingly).
2. Import the project into Vercel; framework auto-detected (Next.js). Build: `next build`.
3. Set env vars (§16) in Vercel (Production + Preview). Generate the fine-grained PAT.
4. Vercel auto-deploys on every push to `main`. Because admin writes **commit to `main`**, an
   admin save triggers a redeploy and the content goes live a minute later. This is the intended
   loop — document it for the client.
5. Add the custom domain; set `NEXT_PUBLIC_SITE_URL` to it so metadata/sitemap are correct.

> Vercel's filesystem is read-only at runtime — never rely on `fs.writeFile` persisting in prod.
> All persistence is via GitHub commits. (This is the crux of the no-database design.)

---

## 19. IMPLEMENTATION ORDER (suggested for the next Claude)

1. Add deps (§2); init shadcn; set up `globals.css` theme + fonts + `Container`/layout shell.
2. `schemas.ts` (Zod) + `types`. Seed `content/{hikes,users,society}.json` with realistic data.
3. Storage layer: `storage.ts`, `github.ts`, `hikes.ts`, `society.ts` (+ `slugify`, `formatDate`).
4. Auth: `password.ts`, `session.ts`, `dal.ts`, `proxy.ts`, login/logout actions, `/admin` page.
5. Admin shell + hike CRUD (table, form, create/edit/delete/publish) + upload route + uploader.
6. Public pages: layout/header/footer → home → pohodi list → hike detail → galerija → kontakt →
   o-drustvu.
7. SEO (`metadata`, `sitemap.ts`, `robots.ts`, JSON-LD) + accessibility pass.
8. Performance pass; `npm run build` + `npm run lint` must be clean; manual Lighthouse check.

When in doubt about a Next.js API, **read the local doc under `node_modules/next/dist/docs/`
before writing code** (per AGENTS.md). Do not reintroduce `middleware.ts`, synchronous
`cookies()`/`params`, or a `tailwind.config.js`.

---

## 20. ACCEPTANCE CHECKLIST

- [ ] No database / no forbidden libs; all content in `content/*.json` committed to the repo.
- [ ] `proxy.ts` (not middleware) protects `/admin/*` and `/api/admin/*`; redirects to `/admin`.
- [ ] Login works with bcryptjs + jose HttpOnly session; logout clears it.
- [ ] Admin can create/edit/delete/publish hikes and upload images; prod writes commit to GitHub.
- [ ] All public pages present, responsive (320px→desktop), Slovenian copy, unique metadata.
- [ ] Hike detail has dynamic slug routes + `Event` JSON-LD; sitemap & robots correct.
- [ ] WCAG: keyboard nav, visible focus, labels, alt text, semantic HTML, skip link.
- [ ] `npm run build` and `npm run lint` pass; Lighthouse ≥ 90 on public pages.

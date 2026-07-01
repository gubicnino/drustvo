# PD Goričko – Tromeja — React SPA (frontend)

Statični **React + Vite (TypeScript)** SPA, ki se prek `fetch` povezuje na PHP JSON API
(mapa [`../php`](../php)). Brez Next.js. Po buildu so to samo statične datoteke, ki jih
naložiš na kateri koli spletni gostitelj (npr. cPanel `public_html`).

## Strani
- Javno: Domov, Pohodi (filter/razvrščanje prek URL-ja), Posamezen pohod, Galerija (lightbox),
  O društvu, Kontakt.
- Admin (`/admin`): prijava (JWT), nadzorna plošča, CRUD pohodov, objava/skritje,
  nalaganje slik, galerija, urejanje podatkov društva.

## Razvoj

```bash
npm install

# 1) zaženi API (v drugi konzoli, mapa ../php):
#    docker compose up -d && php -S localhost:8000 serve.php
# 2) zaženi frontend:
npm run dev            # http://localhost:5173
```

Vite v razvoju preusmeri `/api` in `/uploads` na `http://localhost:8000` (glej `vite.config.ts`),
zato CORS lokalno ni potreben.

## Build

```bash
npm run build          # ustvari mapo dist/ (statične datoteke)
npm run preview        # lokalni predogled builda
```

## Povezava na API

Privzeto SPA kliče **isti origin** na poti `/api` in slike na `/uploads`. To je idealno, če
sta SPA in API na **isti domeni** (SPA v `public_html/`, API v `public_html/api/`).

Če je API na **drugi** domeni, ustvari `.env` z:

```
VITE_API_URL=https://api.tvoja-domena.si/api
```

…in v PHP-ju nastavi `CORS_ORIGINS` na izvor SPA.

## Namestitev na cPanel

1. `npm run build` → nastane `dist/`.
2. Vsebino `dist/` (vključno z `.htaccess` in `assets/`) naloži v **`public_html/`**.
3. API naloži v `public_html/api/` (glej `../php/README.md`), slike v `public_html/uploads/`.
4. `.htaccess` v `dist/` poskrbi za client-side usmerjanje (React Router) in pusti `/api` PHP-ju.

Rezultat: `https://tvoja-domena/` (SPA) + `https://tvoja-domena/api/...` (API) na istem gostovanju.

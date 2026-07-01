# PD Goričko – Tromeja — PHP JSON API

Zaledni **REST/JSON API** v čistem PHP-ju (brez ogrodij) z **MySQL** bazo in **JWT**
avtentikacijo. Streže podatke za React SPA frontend (mapa [`../web`](../web)).

- Brez ogrodij, brez Composerja. Samo naložiš datoteke + uvoziš bazo.
- Varnost: PDO pripravljene poizvedbe (SQL injection), JWT žetoni (HS256, brez knjižnic),
  bcrypt gesla, validacija vnosa, preverjanje MIME pri nalaganju slik, CORS.

## Zahteve
PHP **8.1+** (`pdo_mysql`, `mbstring`; `fileinfo` priporočeno), MySQL/MariaDB, Apache `mod_rewrite`.

## Endpointi

| Metoda | Pot | Opis | Avtorizacija |
| --- | --- | --- | --- |
| GET | `/society` | Podatki društva | — |
| GET | `/hikes?status=published\|upcoming\|past&difficulty=&sort=` | Seznam pohodov | — |
| GET | `/hikes/{slug}` | Posamezen (objavljen) pohod | — |
| GET | `/gallery` | Slike iz objavljenih pohodov | — |
| POST | `/login` | `{username,password}` → `{token,user}` | — |
| GET | `/me` | Trenutni uporabnik | JWT |
| GET | `/admin/hikes` | Vsi pohodi (z osnutki) | JWT |
| GET | `/admin/hikes/{id}` | Pohod po ID | JWT |
| POST | `/admin/hikes` | Ustvari | JWT |
| PUT | `/admin/hikes/{id}` | Uredi | JWT |
| DELETE | `/admin/hikes/{id}` | Izbriši | JWT |
| POST | `/admin/hikes/{id}/publish` | `{published:bool}` | JWT |
| POST | `/admin/upload` | Večdatotečni `files[]` → `{paths}` | JWT |
| GET / DELETE | `/admin/gallery` | Seznam / izbris slike | JWT |
| PUT | `/admin/society` | Uredi podatke društva | JWT |

Žeton se pošlje v glavi: `Authorization: Bearer <token>`.

## Lokalni razvoj (Docker)

```bash
# v mapi php/
docker compose up -d                 # MySQL + phpMyAdmin (shema se uvozi samodejno)
php -S localhost:8000 serve.php       # API na http://localhost:8000
```

`app/config.local.php` je že nastavljen na Docker bazo. phpMyAdmin: http://localhost:8080 (root/root).
Privzeti skrbnik: **urejevalec / admin123** (po prijavi zamenjaj: `php scripts/create-user.php`).

## Namestitev na cPanel

1. **Baza:** ustvari MySQL bazo + uporabnika, v phpMyAdmin uvozi `sql/schema.sql`.
2. **Datoteke:** vsebino mape `php/` naloži v **`public_html/api/`** (torej
   `public_html/api/index.php`, `public_html/api/app/…`). Vključi `.htaccess`.
3. **Slike:** ustvari mapo `public_html/uploads` (zapisljiva, 755).
4. **Konfiguracija:** kopiraj `app/config.local.php.example` → `app/config.local.php` in nastavi:
   - `DB_*` (podatki baze),
   - `JWT_SECRET` (dolg naključni niz!),
   - `UPLOAD_DIR` = `/home/UPORABNIK/public_html/uploads`, `UPLOAD_URL` = `/uploads`,
   - `CORS_ORIGINS` — pusti prazno, če je SPA na **isti** domeni; sicer vpiši izvor SPA.
5. API je na `https://tvoja-domena/api/...`. Frontend (SPA) gre v `public_html/` (glej `../web`).

> Struktura: `app/` je blokirana za neposreden spletni dostop (`app/.htaccess`).
> Slike v `uploads/` se ne morejo izvajati kot skripte.

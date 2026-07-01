<?php
/**
 * Osrednja konfiguracija API-ja.
 *
 * Vrednosti se preberejo: okolje (getenv) > app/config.local.php > privzeto.
 * Na cPanelu uredi app/config.local.php (ni v gitu).
 */

declare(strict_types=1);

$localConfig = __DIR__ . '/config.local.php';
$local = is_file($localConfig) ? (require $localConfig) : [];

/** Preberi nastavitev: okolje > config.local.php > privzeto. */
function cfg(string $key, string $default, array $local): string
{
    $env = getenv($key);
    if ($env !== false && $env !== '') {
        return $env;
    }
    return isset($local[$key]) ? (string) $local[$key] : $default;
}

// --- Baza ------------------------------------------------------------------
define('DB_HOST', cfg('DB_HOST', 'localhost', $local));
define('DB_PORT', cfg('DB_PORT', '3306', $local));
define('DB_NAME', cfg('DB_NAME', 'drustvo', $local));
define('DB_USER', cfg('DB_USER', 'root', $local));
define('DB_PASS', cfg('DB_PASS', '', $local));
define('DB_CHARSET', 'utf8mb4');

// --- Avtentikacija ---------------------------------------------------------
// Tajni ključ za podpis JWT žetonov (HS256). OBVEZNO spremeni na produkciji!
define('JWT_SECRET', cfg('JWT_SECRET', 'spremeni-me-na-dolg-nakljucni-niz', $local));
define('JWT_TTL', (int) cfg('JWT_TTL', '604800', $local)); // 7 dni (sekunde)

// --- CORS ------------------------------------------------------------------
// Dovoljeni izvori (frontend). Več jih loči z vejico. '*' = vsi (samo za razvoj).
define('CORS_ORIGINS', cfg('CORS_ORIGINS', 'http://localhost:5173,http://localhost:4173', $local));

// --- Splošno ---------------------------------------------------------------
define('SITE_URL', rtrim(cfg('SITE_URL', '', $local), '/'));
define('APP_DEBUG', cfg('APP_DEBUG', '0', $local) === '1');

// Mapa za naložene slike (absolutna pot na disku) in javni URL predpona.
// Privzeto: <api>/uploads. Na produkciji kaže na public_html/uploads (deljeno s SPA),
// zato po potrebi nastavi UPLOAD_DIR v config.local.php.
define('UPLOAD_DIR', cfg('UPLOAD_DIR', dirname(__DIR__) . '/uploads', $local));
define('UPLOAD_URL', cfg('UPLOAD_URL', '/uploads', $local));

// --- Napake ----------------------------------------------------------------
error_reporting(E_ALL);
ini_set('display_errors', APP_DEBUG ? '1' : '0');

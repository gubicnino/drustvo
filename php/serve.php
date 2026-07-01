<?php
/**
 * Dev strežnik za API (samo lokalno):
 *   php -S localhost:8000 serve.php
 *
 * Postreže obstoječe datoteke (npr. /uploads/...), vse ostalo gre na API.
 * Na produkciji (Apache/cPanel) se uporablja .htaccess; ta datoteka se ne rabi.
 */

declare(strict_types=1);

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '/';
if ($uri !== '/' && is_file(__DIR__ . $uri)) {
    return false; // pusti vgrajenemu strežniku, da postreže datoteko
}
require __DIR__ . '/index.php';

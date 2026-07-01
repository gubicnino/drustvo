<?php
/** Minimalen JWT (HS256) brez zunanjih knjižnic. */

declare(strict_types=1);

function base64url_encode(string $data): string
{
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode(string $data): string
{
    return (string) base64_decode(strtr($data, '-_', '+/'), true);
}

/** Ustvari podpisan JWT iz polja podatkov (claims). */
function jwt_encode(array $payload): string
{
    $header = ['alg' => 'HS256', 'typ' => 'JWT'];
    $now = time();
    $payload += ['iat' => $now, 'exp' => $now + JWT_TTL];

    $segments = [
        base64url_encode(json_encode($header, JSON_UNESCAPED_SLASHES)),
        base64url_encode(json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)),
    ];
    $signing = implode('.', $segments);
    $sig = hash_hmac('sha256', $signing, JWT_SECRET, true);
    $segments[] = base64url_encode($sig);

    return implode('.', $segments);
}

/** Preveri in dekodiraj JWT. Vrne payload ali null (neveljaven/potekel). */
function jwt_decode(?string $token): ?array
{
    if (!$token) {
        return null;
    }
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return null;
    }
    [$h, $p, $s] = $parts;

    $expected = base64url_encode(hash_hmac('sha256', "$h.$p", JWT_SECRET, true));
    if (!hash_equals($expected, $s)) {
        return null;
    }
    $payload = json_decode(base64url_decode($p), true);
    if (!is_array($payload)) {
        return null;
    }
    if (isset($payload['exp']) && time() >= (int) $payload['exp']) {
        return null;
    }
    return $payload;
}

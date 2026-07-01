<?php
/** HTTP pomočniki za API: CORS, JSON odgovori, branje telesa, JWT avtentikacija. */

declare(strict_types=1);

/** Pošlji CORS glave glede na dovoljene izvore. */
function send_cors(): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $allowed = array_map('trim', explode(',', CORS_ORIGINS));

    if (in_array('*', $allowed, true)) {
        header('Access-Control-Allow-Origin: *');
    } elseif ($origin !== '' && in_array($origin, $allowed, true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
    }
    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Max-Age: 86400');
}

/** Pošlji JSON odgovor in končaj. */
function json_response(mixed $data, int $code = 200): never
{
    http_response_code($code);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/** Napaka kot JSON. */
function json_error(string $message, int $code = 400, array $extra = []): never
{
    json_response(['error' => $message] + $extra, $code);
}

/** Preberi in dekodiraj JSON telo zahteve. */
function read_json_body(): array
{
    $raw = file_get_contents('php://input') ?: '';
    if ($raw === '') {
        return [];
    }
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        json_error('Neveljavno JSON telo.', 400);
    }
    return $data;
}

/** Vrni Bearer žeton iz Authorization glave. */
function bearer_token(): ?string
{
    $header = $_SERVER['HTTP_AUTHORIZATION']
        ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
        ?? '';
    if ($header === '' && function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        $header = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    }
    if (preg_match('/Bearer\s+(.+)/i', $header, $m)) {
        return trim($m[1]);
    }
    return null;
}

/** Trenutni uporabnik iz JWT (ali null). */
function current_user(): ?array
{
    $payload = jwt_decode(bearer_token());
    if (!$payload || empty($payload['sub'])) {
        return null;
    }
    return [
        'id'       => $payload['sub'],
        'username' => $payload['username'] ?? '',
        'role'     => $payload['role'] ?? 'admin',
    ];
}

/** Zahtevaj prijavo; ob neuspehu vrne 401 JSON. */
function require_auth(): array
{
    $user = current_user();
    if (!$user) {
        json_error('Nepooblaščen dostop.', 401);
    }
    return $user;
}

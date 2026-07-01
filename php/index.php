<?php
/**
 * JSON API – sprednji krmilnik.
 * Vse poti pod /api/* .htaccess preusmeri sem.
 */

declare(strict_types=1);

$app = __DIR__ . '/app';
require $app . '/config.php';
require $app . '/helpers.php';
require $app . '/db.php';
require $app . '/jwt.php';
require $app . '/http.php';
require $app . '/auth.php';
require $app . '/repository.php';
require $app . '/upload.php';

send_cors();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Pot brez poizvedbe in brez morebitne predpone /api.
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '/';
$path = urldecode($path);
$path = preg_replace('#^.*?/api#', '', $path) ?? $path; // odstrani vse do in vključno /api
$path = '/' . trim($path, '/');

try {
    route($method, $path);
} catch (Throwable $e) {
    if (APP_DEBUG) {
        json_error('Strežniška napaka: ' . $e->getMessage(), 500);
    }
    error_log('API error: ' . $e->getMessage());
    json_error('Strežniška napaka.', 500);
}

json_error('Endpoint ne obstaja.', 404);

// ---------------------------------------------------------------------------

function route(string $method, string $path): void
{
    // --- Javno ---
    if ($method === 'GET' && $path === '/society') {
        json_response(get_society());
    }

    if ($method === 'GET' && $path === '/hikes') {
        $status = $_GET['status'] ?? 'published';
        $list = match ($status) {
            'all'      => get_published_hikes(),
            'upcoming' => get_upcoming_hikes(),
            'past'     => get_past_hikes(),
            default    => get_published_hikes(),
        };
        // Filter po težavnosti + razvrščanje (za javni seznam).
        $diff = $_GET['difficulty'] ?? 'all';
        if (in_array($diff, ['easy', 'medium', 'hard'], true)) {
            $list = array_values(array_filter($list, fn($h) => $h['difficulty'] === $diff));
        }
        if (($_GET['sort'] ?? '') === 'oldest') {
            usort($list, fn($a, $b) => strcmp($a['date'], $b['date']));
        }
        json_response($list);
    }

    if ($method === 'GET' && preg_match('#^/hikes/([a-z0-9-]+)$#', $path, $m)) {
        $hike = get_hike_by_slug($m[1]);
        if (!$hike || !$hike['published']) {
            json_error('Pohod ni najden.', 404);
        }
        json_response($hike);
    }

    if ($method === 'GET' && $path === '/gallery') {
        $items = [];
        foreach (get_published_hikes() as $h) {
            foreach ($h['images'] as $i => $src) {
                $items[] = ['src' => $src, 'title' => $h['title'], 'caption' => $h['location'], 'slug' => $h['slug'], 'i' => $i];
            }
        }
        json_response($items);
    }

    // --- Avtentikacija ---
    if ($method === 'POST' && $path === '/login') {
        $body = read_json_body();
        $username = trim((string) ($body['username'] ?? ''));
        $password = (string) ($body['password'] ?? '');
        if ($username === '' || $password === '') {
            json_error('Vnesite uporabniško ime in geslo.', 422);
        }
        $user = verify_credentials($username, $password);
        if (!$user) {
            json_error('Napačno uporabniško ime ali geslo.', 401);
        }
        $token = jwt_encode(['sub' => $user['id'], 'username' => $user['username'], 'role' => $user['role']]);
        json_response(['token' => $token, 'user' => $user]);
    }

    if ($method === 'GET' && $path === '/me') {
        json_response(['user' => require_auth()]);
    }

    // --- Admin (vse zahteva JWT) ---
    if (str_starts_with($path, '/admin/')) {
        require_auth();
    }

    if ($method === 'GET' && $path === '/admin/hikes') {
        json_response(get_hikes());
    }

    if ($method === 'GET' && preg_match('#^/admin/hikes/([0-9a-f-]{36})$#', $path, $m)) {
        $hike = get_hike_by_id($m[1]);
        $hike ? json_response($hike) : json_error('Pohod ni najden.', 404);
    }

    if ($method === 'POST' && $path === '/admin/hikes') {
        $data = validate_hike(read_json_body());
        json_response(create_hike($data), 201);
    }

    if (in_array($method, ['PUT', 'PATCH'], true) && preg_match('#^/admin/hikes/([0-9a-f-]{36})$#', $path, $m)) {
        if (!get_hike_by_id($m[1])) {
            json_error('Pohod ni najden.', 404);
        }
        $data = validate_hike(read_json_body());
        json_response(update_hike($m[1], $data));
    }

    if ($method === 'DELETE' && preg_match('#^/admin/hikes/([0-9a-f-]{36})$#', $path, $m)) {
        delete_hike($m[1]);
        json_response(['ok' => true]);
    }

    if ($method === 'POST' && preg_match('#^/admin/hikes/([0-9a-f-]{36})/publish$#', $path, $m)) {
        $body = read_json_body();
        set_published($m[1], !empty($body['published']));
        json_response(['ok' => true]);
    }

    if ($method === 'POST' && $path === '/admin/upload') {
        $files = $_FILES['files'] ?? null;
        if (!$files || !is_array($files['name'] ?? null)) {
            // Podpri tudi enojno polje 'file'.
            if (!empty($_FILES['file'])) {
                $res = store_uploaded_file($_FILES['file']);
                isset($res['path']) ? json_response(['paths' => [$res['path']]]) : json_error($res['error'], 422);
            }
            json_error('Ni naloženih datotek.', 422);
        }
        $res = store_uploaded_files($files);
        json_response(['paths' => $res['paths'], 'errors' => $res['errors']]);
    }

    if ($method === 'GET' && $path === '/admin/gallery') {
        json_response(gallery_files());
    }

    if ($method === 'DELETE' && $path === '/admin/gallery') {
        $body = read_json_body();
        $p = upload_safe_path((string) ($body['file'] ?? ''));
        if ($p) {
            @unlink($p);
            json_response(['ok' => true]);
        }
        json_error('Datoteka ne obstaja.', 404);
    }

    if (in_array($method, ['PUT', 'PATCH'], true) && $path === '/admin/society') {
        $b = read_json_body();
        if (trim((string) ($b['name'] ?? '')) === '') {
            json_error('Ime društva ne sme biti prazno.', 422);
        }
        update_society([
            'name' => (string) $b['name'],
            'shortName' => (string) ($b['shortName'] ?? ''),
            'tagline' => (string) ($b['tagline'] ?? ''),
            'about' => (string) ($b['about'] ?? ''),
            'mission' => (string) ($b['mission'] ?? ''),
            'founded' => (string) ($b['founded'] ?? ''),
            'memberCount' => (string) ($b['memberCount'] ?? ''),
            'hikesPerYear' => (string) ($b['hikesPerYear'] ?? ''),
            'email' => (string) ($b['email'] ?? ''),
            'phone' => (string) ($b['phone'] ?? ''),
            'address' => (string) ($b['address'] ?? ''),
            'facebook' => (string) ($b['facebook'] ?? ''),
        ]);
        json_response(get_society());
    }
}

/** Validacija in normalizacija vnosa pohoda iz JSON telesa. */
function validate_hike(array $b): array
{
    $errors = [];
    $title = trim((string) ($b['title'] ?? ''));
    if (mb_strlen($title) < 3 || mb_strlen($title) > 120) {
        $errors['title'] = 'Naslov mora imeti med 3 in 120 znaki.';
    }
    $date = trim((string) ($b['date'] ?? ''));
    $dt = DateTime::createFromFormat('Y-m-d', $date);
    if (!$dt || $dt->format('Y-m-d') !== $date) {
        $errors['date'] = 'Vnesite veljaven datum (YYYY-MM-DD).';
    }
    $location = trim((string) ($b['location'] ?? ''));
    if (mb_strlen($location) < 2 || mb_strlen($location) > 200) {
        $errors['location'] = 'Vnesite lokacijo (2–200 znakov).';
    }
    $difficulty = (string) ($b['difficulty'] ?? 'easy');
    if (!in_array($difficulty, ['easy', 'medium', 'hard'], true)) {
        $difficulty = 'easy';
    }
    $description = trim((string) ($b['description'] ?? ''));
    if (mb_strlen($description) < 10 || mb_strlen($description) > 5000) {
        $errors['description'] = 'Opis mora imeti med 10 in 5000 znaki.';
    }
    $images = $b['images'] ?? [];
    $images = is_array($images) ? array_values(array_filter($images, fn($p) => is_string($p) && str_starts_with($p, '/uploads/'))) : [];

    if ($errors) {
        json_error('Neveljaven vnos.', 422, ['fields' => $errors]);
    }

    return [
        'title' => $title,
        'date' => $date,
        'location' => $location,
        'difficulty' => $difficulty,
        'distance' => mb_substr(trim((string) ($b['distance'] ?? '')), 0, 40),
        'elevation' => mb_substr(trim((string) ($b['elevation'] ?? '')), 0, 40),
        'description' => $description,
        'images' => $images,
        'published' => !empty($b['published']),
    ];
}

/** Seznam datotek v /uploads (najnovejše najprej). */
function gallery_files(): array
{
    $files = glob(UPLOAD_DIR . '/*.{jpg,jpeg,png,webp,gif}', GLOB_BRACE) ?: [];
    usort($files, fn($a, $b) => filemtime($b) <=> filemtime($a));
    return array_map(fn($f) => ['src' => UPLOAD_URL . '/' . basename($f), 'name' => basename($f)], $files);
}

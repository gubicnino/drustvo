<?php
/** Domenski sloj: dostop do pohodov in podatkov društva. Edini API, ki ga kliče app. */

declare(strict_types=1);

// --- Pretvorba vrstice ------------------------------------------------------

/** Normalizira DB vrstico v obliko, ki jo uporabljajo predloge. */
function hike_from_row(array $r): array
{
    $images = [];
    if (!empty($r['images'])) {
        $decoded = json_decode((string) $r['images'], true);
        if (is_array($decoded)) {
            $images = array_values(array_filter($decoded, 'is_string'));
        }
    }
    return [
        'id'          => $r['id'],
        'slug'        => $r['slug'],
        'title'       => $r['title'],
        'date'        => $r['date'],
        'location'    => $r['location'],
        'difficulty'  => $r['difficulty'],
        'distance'    => $r['distance'],
        'elevation'   => $r['elevation'],
        'description' => $r['description'],
        'image'       => $r['image'],
        'images'      => $images,
        'published'   => (bool) $r['published'],
        'createdAt'   => $r['created_at'],
        'updatedAt'   => $r['updated_at'],
    ];
}

/** @return array<int,array> */
function map_hikes(array $rows): array
{
    return array_map('hike_from_row', $rows);
}

// --- Branje -----------------------------------------------------------------

function get_hikes(): array
{
    $rows = db()->query('SELECT * FROM hikes ORDER BY date DESC')->fetchAll();
    return map_hikes($rows);
}

function get_published_hikes(): array
{
    $rows = db()->query('SELECT * FROM hikes WHERE published = 1 ORDER BY date DESC')->fetchAll();
    return map_hikes($rows);
}

function get_upcoming_hikes(): array
{
    $stmt = db()->prepare('SELECT * FROM hikes WHERE published = 1 AND date >= ? ORDER BY date ASC');
    $stmt->execute([today_iso()]);
    return map_hikes($stmt->fetchAll());
}

function get_past_hikes(): array
{
    $stmt = db()->prepare('SELECT * FROM hikes WHERE published = 1 AND date < ? ORDER BY date DESC');
    $stmt->execute([today_iso()]);
    return map_hikes($stmt->fetchAll());
}

function get_hike_by_slug(string $slug): ?array
{
    $stmt = db()->prepare('SELECT * FROM hikes WHERE slug = ? LIMIT 1');
    $stmt->execute([$slug]);
    $row = $stmt->fetch();
    return $row ? hike_from_row($row) : null;
}

function get_hike_by_id(string $id): ?array
{
    $stmt = db()->prepare('SELECT * FROM hikes WHERE id = ? LIMIT 1');
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    return $row ? hike_from_row($row) : null;
}

// --- Pomožno ---------------------------------------------------------------

function uuid_v4(): string
{
    $data = random_bytes(16);
    $data[6] = chr((ord($data[6]) & 0x0f) | 0x40);
    $data[8] = chr((ord($data[8]) & 0x3f) | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

/** Ustvari edinstven slug iz naslova; ob trku doda -2, -3 … (izpusti $ignoreId). */
function unique_slug(string $title, ?string $ignoreId = null): string
{
    $base = slugify($title);
    if ($base === '') {
        $base = 'pohod';
    }
    $slug = $base;
    $n = 1;
    while (true) {
        $stmt = db()->prepare('SELECT id FROM hikes WHERE slug = ? AND id <> ? LIMIT 1');
        $stmt->execute([$slug, $ignoreId ?? '']);
        if (!$stmt->fetch()) {
            return $slug;
        }
        $n++;
        $slug = $base . '-' . $n;
    }
}

// --- Pisanje ----------------------------------------------------------------

/**
 * $data: title, date, location, difficulty, distance, elevation, description,
 *        images (array poti), published (bool).
 */
function create_hike(array $data): array
{
    $id = uuid_v4();
    $slug = unique_slug($data['title']);
    $now = gmdate('Y-m-d\TH:i:s.000\Z');
    $images = array_values($data['images'] ?? []);

    $stmt = db()->prepare(
        'INSERT INTO hikes
           (id, slug, title, date, location, difficulty, distance, elevation,
            description, image, images, published, created_at, updated_at)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
    );
    $stmt->execute([
        $id, $slug, $data['title'], $data['date'], $data['location'],
        $data['difficulty'], $data['distance'], $data['elevation'],
        $data['description'], $images[0] ?? '', json_encode($images, JSON_UNESCAPED_UNICODE),
        $data['published'] ? 1 : 0,
        date('Y-m-d H:i:s'), date('Y-m-d H:i:s'),
    ]);

    return get_hike_by_id($id);
}

function update_hike(string $id, array $data): ?array
{
    $existing = get_hike_by_id($id);
    if (!$existing) {
        return null;
    }
    // Slug znova izpelji iz (morda novega) naslova, a ohrani edinstvenost.
    $slug = unique_slug($data['title'], $id);
    $images = array_values($data['images'] ?? []);

    $stmt = db()->prepare(
        'UPDATE hikes SET
           slug = ?, title = ?, date = ?, location = ?, difficulty = ?,
           distance = ?, elevation = ?, description = ?, image = ?, images = ?,
           published = ?, updated_at = ?
         WHERE id = ?'
    );
    $stmt->execute([
        $slug, $data['title'], $data['date'], $data['location'], $data['difficulty'],
        $data['distance'], $data['elevation'], $data['description'],
        $images[0] ?? '', json_encode($images, JSON_UNESCAPED_UNICODE),
        $data['published'] ? 1 : 0, date('Y-m-d H:i:s'),
        $id,
    ]);

    return get_hike_by_id($id);
}

function delete_hike(string $id): void
{
    $stmt = db()->prepare('DELETE FROM hikes WHERE id = ?');
    $stmt->execute([$id]);
}

function set_published(string $id, bool $published): void
{
    $stmt = db()->prepare('UPDATE hikes SET published = ?, updated_at = ? WHERE id = ?');
    $stmt->execute([$published ? 1 : 0, date('Y-m-d H:i:s'), $id]);
}

// --- Društvo ---------------------------------------------------------------

function get_society(): array
{
    $row = db()->query('SELECT * FROM society WHERE id = 1 LIMIT 1')->fetch();
    if (!$row) {
        return [];
    }
    return [
        'name'         => $row['name'],
        'shortName'    => $row['short_name'],
        'tagline'      => $row['tagline'],
        'about'        => $row['about'],
        'mission'      => $row['mission'],
        'founded'      => $row['founded'],
        'memberCount'  => $row['member_count'],
        'hikesPerYear' => $row['hikes_per_year'],
        'email'        => $row['email'],
        'phone'        => $row['phone'],
        'address'      => $row['address'],
        'social'       => ['facebook' => $row['facebook']],
    ];
}

function update_society(array $d): void
{
    $stmt = db()->prepare(
        'UPDATE society SET
           name = ?, short_name = ?, tagline = ?, about = ?, mission = ?,
           founded = ?, member_count = ?, hikes_per_year = ?, email = ?,
           phone = ?, address = ?, facebook = ?
         WHERE id = 1'
    );
    $stmt->execute([
        $d['name'], $d['shortName'], $d['tagline'], $d['about'], $d['mission'],
        $d['founded'], $d['memberCount'], $d['hikesPerYear'], $d['email'],
        $d['phone'], $d['address'], $d['facebook'],
    ]);
}

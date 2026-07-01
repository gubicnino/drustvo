<?php
/** Varno nalaganje slik v /uploads (validacija tipa, velikosti, varno ime). */

declare(strict_types=1);

const UPLOAD_MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const UPLOAD_ALLOWED = [
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp',
    'image/gif'  => 'gif',
];

/**
 * Zaznaj MIME slike iz vsebine. Najprej finfo (če je na voljo), sicer getimagesize.
 * Oba bereta dejansko vsebino, ne zaupata imenu datoteke.
 */
function detect_image_mime(string $path): ?string
{
    if (class_exists('finfo')) {
        $mime = (new finfo(FILEINFO_MIME_TYPE))->file($path);
        if (is_string($mime) && $mime !== '') {
            return $mime;
        }
    }
    $info = @getimagesize($path);
    return ($info && !empty($info['mime'])) ? $info['mime'] : null;
}

/**
 * Sprejme en element iz $_FILES in shrani datoteko.
 * @return array{path?:string,error?:string}
 */
function store_uploaded_file(array $file): array
{
    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
        return ['error' => 'Datoteka manjka.'];
    }
    if ($file['error'] !== UPLOAD_ERR_OK) {
        return ['error' => 'Nalaganje ni uspelo (koda ' . $file['error'] . ').'];
    }
    if ($file['size'] > UPLOAD_MAX_BYTES) {
        return ['error' => 'Slika je prevelika (največ 5 MB).'];
    }
    if (!is_uploaded_file($file['tmp_name'])) {
        return ['error' => 'Neveljavna datoteka.'];
    }

    // Zaznaj resnični MIME iz vsebine, ne zaupaj imenu/brskalniku.
    $mime = detect_image_mime($file['tmp_name']);
    if ($mime === null || !isset(UPLOAD_ALLOWED[$mime])) {
        return ['error' => 'Dovoljene so slike JPG, PNG, WEBP ali GIF.'];
    }
    $ext = UPLOAD_ALLOWED[$mime];

    $base = slugify(pathinfo($file['name'], PATHINFO_FILENAME)) ?: 'slika';
    $name = $base . '-' . bin2hex(random_bytes(4)) . '.' . $ext;

    if (!is_dir(UPLOAD_DIR)) {
        @mkdir(UPLOAD_DIR, 0755, true);
    }
    $dest = UPLOAD_DIR . '/' . $name;
    if (!move_uploaded_file($file['tmp_name'], $dest)) {
        return ['error' => 'Datoteke ni bilo mogoče shraniti.'];
    }

    return ['path' => UPLOAD_URL . '/' . $name];
}

/**
 * Shrani več slik iz polja <input type="file" name="images[]" multiple>.
 * @return array{paths:string[],errors:string[]}
 */
function store_uploaded_files(array $files): array
{
    $paths = [];
    $errors = [];
    $names = $files['name'] ?? [];
    $count = is_array($names) ? count($names) : 0;

    for ($i = 0; $i < $count; $i++) {
        if (($files['error'][$i] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
            continue; // prazna reža v večkratnem inputu
        }
        $one = [
            'name'     => $files['name'][$i],
            'type'     => $files['type'][$i] ?? '',
            'tmp_name' => $files['tmp_name'][$i],
            'error'    => $files['error'][$i],
            'size'     => $files['size'][$i],
        ];
        $res = store_uploaded_file($one);
        if (isset($res['path'])) {
            $paths[] = $res['path'];
        } else {
            $errors[] = ($one['name'] ?: 'slika') . ': ' . $res['error'];
        }
    }

    return ['paths' => $paths, 'errors' => $errors];
}

/** Ime datoteke -> absolutna pot v uploads (varno, brez prečkanja map). */
function upload_safe_path(string $filename): ?string
{
    $name = basename($filename);
    if ($name === '' || str_contains($name, '..')) {
        return null;
    }
    $path = UPLOAD_DIR . '/' . $name;
    return is_file($path) ? $path : null;
}

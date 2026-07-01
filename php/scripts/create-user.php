<?php
/**
 * CLI: ustvari ali posodobi skrbnika (bcrypt geslo).
 *
 * Uporaba:
 *   php scripts/create-user.php
 *   php scripts/create-user.php uporabnik geslo
 *
 * Skripta poskuša zapisati v bazo (uporabi app/config). Če baza ni dosegljiva,
 * samo izpiše SQL stavek, ki ga prilepiš v phpMyAdmin.
 */

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    exit("Zaženi iz ukazne vrstice.\n");
}

$username = $argv[1] ?? null;
$password = $argv[2] ?? null;

function prompt(string $label, bool $hidden = false): string
{
    fwrite(STDOUT, $label);
    if ($hidden && stripos(PHP_OS, 'WIN') === false) {
        @system('stty -echo');
        $val = trim((string) fgets(STDIN));
        @system('stty echo');
        fwrite(STDOUT, "\n");
        return $val;
    }
    return trim((string) fgets(STDIN));
}

if (!$username) {
    $username = prompt('Uporabniško ime: ');
}
if (!$password) {
    $password = prompt('Geslo: ', true);
}

if (strlen($username) < 3 || strlen($password) < 6) {
    exit("Uporabniško ime ≥ 3 znaki, geslo ≥ 6 znakov.\n");
}

$hash = password_hash($password, PASSWORD_BCRYPT);

// UUID v4
$d = random_bytes(16);
$d[6] = chr((ord($d[6]) & 0x0f) | 0x40);
$d[8] = chr((ord($d[8]) & 0x3f) | 0x80);
$id = vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($d), 4));

echo "\nGenerirani bcrypt hash:\n$hash\n\n";

// Poskusi zapis v bazo.
$configPath = __DIR__ . '/../app/config.php';
$dbPath = __DIR__ . '/../app/db.php';
if (is_file($configPath) && is_file($dbPath)) {
    require $configPath;
    require $dbPath;
    try {
        $pdo = db();
        $stmt = $pdo->prepare(
            'INSERT INTO users (id, username, password_hash, role)
             VALUES (?, ?, ?, "admin")
             ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)'
        );
        $stmt->execute([$id, $username, $hash]);
        echo "✔ Uporabnik \"$username\" je shranjen v bazo.\n";
        exit(0);
    } catch (Throwable $e) {
        echo "Baza ni dosegljiva (" . $e->getMessage() . ").\n";
    }
}

echo "Prilepi v phpMyAdmin:\n\n";
echo "INSERT INTO users (id, username, password_hash, role) VALUES\n";
echo "  ('$id', " . var_export($username, true) . ", '$hash', 'admin')\n";
echo "  ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash);\n";

<?php
/** Avtentikacija za API: preveri poverilnice (bcrypt). Žeton izda endpoint (JWT). */

declare(strict_types=1);

/**
 * Preveri uporabniško ime + geslo.
 * @return array|null Javni podatki uporabnika ob uspehu, sicer null.
 */
function verify_credentials(string $username, string $password): ?array
{
    $stmt = db()->prepare('SELECT * FROM users WHERE username = ? LIMIT 1');
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        return null;
    }
    return [
        'id'       => $user['id'],
        'username' => $user['username'],
        'role'     => $user['role'],
    ];
}

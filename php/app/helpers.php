<?php
/** Pomožne funkcije, ki jih potrebuje API (slug, datum). */

declare(strict_types=1);

/** Današnji datum kot YYYY-MM-DD (lokalno). */
function today_iso(): string
{
    return date('Y-m-d');
}

/** Slovensko-zavedni slugify (transliterira č/š/ž/đ/ć). */
function slugify(string $input): string
{
    $map = [
        'č' => 'c', 'š' => 's', 'ž' => 'z', 'đ' => 'd', 'ć' => 'c',
        'Č' => 'c', 'Š' => 's', 'Ž' => 'z', 'Đ' => 'd', 'Ć' => 'c',
    ];
    $s = strtr($input, $map);
    $s = mb_strtolower($s, 'UTF-8');
    if (function_exists('iconv')) {
        $ascii = @iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $s);
        if ($ascii !== false) {
            $s = $ascii;
        }
    }
    $s = preg_replace('/[^a-z0-9]+/', '-', $s) ?? '';
    return trim($s, '-');
}

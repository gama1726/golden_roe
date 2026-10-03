<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Support\Facades\Storage;

final class Media
{
    /**
     * @param  array<string, mixed>|null  $image
     * @return array{alt: string, original: string|null, webp: array<string, string>}|null
     */
    public static function urls(?array $image): ?array
    {
        if ($image === null || ! isset($image['original'])) {
            return null;
        }

        // Associative widths (640/1280/1920). Do not use stdClass: Redis cache can
        // revive it as __PHP_Incomplete_Class and break the public site.
        $webp = [];
        foreach ($image['webp'] ?? [] as $width => $path) {
            if (! is_string($path)) {
                continue;
            }
            $key = self::variantWidth($width, $path);
            if ($key !== null) {
                $webp[$key] = Storage::disk('public')->url($path);
            }
        }
        ksort($webp, SORT_NUMERIC);

        return [
            'alt' => is_string($image['alt'] ?? null) ? $image['alt'] : '',
            'original' => is_string($image['original']) ? Storage::disk('public')->url($image['original']) : null,
            'webp' => $webp,
        ];
    }

    /**
     * @param  array<string, mixed>|null  $image
     * @return array{original: string, webp: array<string, string>, alt: string}|null
     */
    public static function payload(?array $image): ?array
    {
        if ($image === null) {
            return null;
        }

        $webp = [];
        foreach ($image['webp'] ?? [] as $width => $path) {
            if (is_string($path)) {
                $webp[(string) $width] = $path;
            }
        }

        return [
            'original' => (string) $image['original'],
            'webp' => $webp,
            'alt' => is_string($image['alt'] ?? null) ? $image['alt'] : '',
        ];
    }

    private static function variantWidth(mixed $width, string $path): ?string
    {
        if (preg_match('/-(\d+)\.webp$/', $path, $match) === 1 && (int) $match[1] > 0) {
            return $match[1];
        }

        if (is_numeric($width) && (int) $width > 0) {
            return (string) (int) $width;
        }

        return null;
    }
}

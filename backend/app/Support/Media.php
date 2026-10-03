<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Support\Facades\Storage;

final class Media
{
    /**
     * @param  array<string, mixed>|null  $image
     * @return array{alt: string, original: string|null, webp: object}|null
     */
    public static function urls(?array $image): ?array
    {
        if ($image === null || ! isset($image['original'])) {
            return null;
        }

        // Widths stay on an object. A PHP list is reindexed by the API resource,
        // and the site then tells the browser the files are 0, 1 and 2 pixels wide.
        $webp = new \stdClass();
        foreach ($image['webp'] ?? [] as $width => $path) {
            if (! is_string($path)) {
                continue;
            }
            $key = self::variantWidth($width, $path);
            if ($key !== null) {
                $webp->{$key} = Storage::disk('public')->url($path);
            }
        }

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

<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Support\Facades\Storage;

final class Media
{
    /**
     * @param  array<string, mixed>|null  $image
     * @return array{alt: string, original: string|null, webp: array<string, string|null>}|null
     */
    public static function urls(?array $image): ?array
    {
        if ($image === null || ! isset($image['original'])) {
            return null;
        }

        $webp = [];
        foreach ($image['webp'] ?? [] as $width => $path) {
            if (is_string($path)) {
                $webp[(string) $width] = Storage::disk('public')->url($path);
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
}

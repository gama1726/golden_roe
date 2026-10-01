<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Encoders\WebpEncoder;
use Intervention\Image\Laravel\Facades\Image;
use Throwable;

final class ImageProcessor
{
    /**
     * @return array{original: string, webp: array<string, string>, alt: string}
     */
    public function store(UploadedFile $file): array
    {
        $name = (string) Str::uuid();
        $extension = strtolower($file->getClientOriginalExtension() ?: 'jpg');
        if (! in_array($extension, ['jpg', 'jpeg', 'png', 'webp'], true)) {
            $extension = 'jpg';
        }

        $originalPath = "images/{$name}.{$extension}";
        Storage::disk('public')->put($originalPath, $file->getContent());

        $webp = [];
        foreach ([640, 1280, 1920] as $width) {
            $variant = "images/{$name}-{$width}.webp";
            try {
                $encoded = Image::read($file->getRealPath())
                    ->scaleDown(width: $width)
                    ->encode(new WebpEncoder(quality: 82));
                Storage::disk('public')->put($variant, (string) $encoded);
                $webp[(string) $width] = $variant;
            } catch (Throwable) {
                continue;
            }
        }

        return [
            'original' => $originalPath,
            'webp' => $webp,
            'alt' => '',
        ];
    }

    /**
     * @param  array<string, mixed>|null  $image
     */
    public function delete(?array $image): void
    {
        if ($image === null) {
            return;
        }

        $paths = [];
        if (is_string($image['original'] ?? null)) {
            $paths[] = $image['original'];
        }
        foreach ($image['webp'] ?? [] as $path) {
            if (is_string($path)) {
                $paths[] = $path;
            }
        }

        if ($paths !== []) {
            Storage::disk('public')->delete($paths);
        }
    }

    /**
     * @param  array<string, mixed>|null  $current
     * @param  array<string, mixed>|null  $incoming
     * @return array{original: string, webp: array<string, string>, alt: string}|null
     */
    public function sync(?array $current, ?array $incoming): ?array
    {
        $next = null;
        if ($incoming !== null) {
            $webp = [];
            foreach ($incoming['webp'] ?? [] as $width => $path) {
                if (is_string($path)) {
                    $webp[(string) $width] = $path;
                }
            }
            $next = [
                'original' => (string) $incoming['original'],
                'webp' => $webp,
                'alt' => is_string($incoming['alt'] ?? null) ? $incoming['alt'] : '',
            ];
        }

        $currentOriginal = is_array($current) ? ($current['original'] ?? null) : null;
        $nextOriginal = $next['original'] ?? null;
        if (is_array($current) && $currentOriginal !== $nextOriginal) {
            $this->delete($current);
        }

        return $next;
    }
}

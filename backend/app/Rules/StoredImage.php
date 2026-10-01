<?php

declare(strict_types=1);

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Storage;

final class StoredImage implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($value === null) {
            return;
        }

        if (! is_array($value) || ! is_string($value['original'] ?? null)) {
            $fail('Некорректный файл изображения.');

            return;
        }

        if (! $this->isSafePath($value['original']) || ! Storage::disk('public')->exists($value['original'])) {
            $fail('Файл изображения не найден.');

            return;
        }

        foreach ($value['webp'] ?? [] as $path) {
            if (! is_string($path) || ! $this->isSafePath($path) || ! Storage::disk('public')->exists($path)) {
                $fail('Файл изображения не найден.');

                return;
            }
        }
    }

    private function isSafePath(string $path): bool
    {
        return (bool) preg_match('#^images/[A-Za-z0-9\-]+\.[A-Za-z0-9]+$#', $path);
    }
}

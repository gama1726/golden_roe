<?php

declare(strict_types=1);

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Http\UploadedFile;

final class PdfDocument implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! $value instanceof UploadedFile) {
            $fail('Файл должен быть PDF.');

            return;
        }

        $head = file_get_contents($value->getRealPath(), false, null, 0, 5);

        if ($head !== '%PDF-') {
            $fail('Файл должен быть PDF.');
        }
    }
}

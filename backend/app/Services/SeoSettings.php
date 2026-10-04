<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Setting;
use App\Support\SeoDefaults;

final class SeoSettings
{
    /**
     * @return array{title: string|null, description: string|null}
     */
    public function forPage(string $page): array
    {
        $defaults = SeoDefaults::pages()[$page] ?? ['title' => null, 'description' => null];
        $all = Setting::getValue('seo', []);
        $entry = is_array($all) ? ($all[$page] ?? []) : [];

        $title = is_array($entry) && is_string($entry['title'] ?? null) ? trim($entry['title']) : '';
        $description = is_array($entry) && is_string($entry['description'] ?? null) ? trim($entry['description']) : '';

        return [
            'title' => $title !== '' ? $title : ($defaults['title'] ?? null),
            'description' => $description !== '' ? $description : ($defaults['description'] ?? null),
        ];
    }
}

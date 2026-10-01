<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Setting;

final class SeoSettings
{
    /**
     * @return array{title: string|null, description: string|null}
     */
    public function forPage(string $page): array
    {
        $all = Setting::getValue('seo', []);
        $entry = is_array($all) ? ($all[$page] ?? []) : [];

        return [
            'title' => is_array($entry) && is_string($entry['title'] ?? null) ? $entry['title'] : null,
            'description' => is_array($entry) && is_string($entry['description'] ?? null) ? $entry['description'] : null,
        ];
    }
}

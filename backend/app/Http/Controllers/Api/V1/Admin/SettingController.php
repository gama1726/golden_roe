<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SettingsRequest;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;

class SettingController extends Controller
{
    public function show(): JsonResponse
    {
        $this->authorize('viewAny', Setting::class);

        return response()->json(['data' => $this->payload()]);
    }

    public function update(SettingsRequest $request): JsonResponse
    {
        $this->authorize('update', Setting::query()->first() ?? new Setting);

        if ($request->exists('reviews_enabled')) {
            Setting::putValue('reviews_enabled', $request->boolean('reviews_enabled'));
        }

        if ($request->exists('seo')) {
            $current = Setting::getValue('seo', []);
            if (! is_array($current)) {
                $current = [];
            }

            $allowed = ['home', 'services', 'author', 'articles', 'reviews', 'contacts'];
            foreach ($request->input('seo', []) as $page => $values) {
                if (! in_array($page, $allowed, true) || ! is_array($values)) {
                    continue;
                }

                $existing = is_array($current[$page] ?? null) ? $current[$page] : [];
                $current[$page] = [
                    'title' => array_key_exists('title', $values) ? $values['title'] : ($existing['title'] ?? null),
                    'description' => array_key_exists('description', $values) ? $values['description'] : ($existing['description'] ?? null),
                ];
            }

            Setting::putValue('seo', $current);
        }

        if ($request->exists('footer')) {
            $current = Setting::footer();
            $incoming = $request->input('footer', []);
            if (! is_array($incoming)) {
                $incoming = [];
            }

            $legalName = array_key_exists('legal_name', $incoming)
                ? (is_string($incoming['legal_name']) ? trim($incoming['legal_name']) : null)
                : $current['legal_name'];
            $inn = array_key_exists('inn', $incoming)
                ? (is_string($incoming['inn']) ? trim($incoming['inn']) : null)
                : $current['inn'];

            Setting::putValue('footer', [
                'legal_name' => $legalName === '' ? null : $legalName,
                'inn' => $inn === '' ? null : $inn,
            ]);
        }

        return response()->json(['data' => $this->payload()]);
    }

    /**
     * @return array<string, mixed>
     */
    private function payload(): array
    {
        return [
            'reviews_enabled' => Setting::reviewsEnabled(),
            'seo' => Setting::getValue('seo', []),
            'footer' => Setting::footer(),
        ];
    }
}

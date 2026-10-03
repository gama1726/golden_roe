<?php

declare(strict_types=1);

namespace App\Support;

use App\Models\PageContent;

final class ServicesPoints
{
    /**
     * @return array<string, array{0: string, 1: int}>
     */
    public static function defaults(): array
    {
        return [
            'point.system' => ['Системный подход и глубокая экспертиза', 2],
            'point.individual' => ['Индивидуальные решения', 3],
            'point.trust' => ['Конфиденциальность и доверие', 4],
            'point.results' => ['Реальные изменения в жизни', 5],
        ];
    }

    public static function ensure(): void
    {
        foreach (self::defaults() as $key => [$title, $sort]) {
            $block = PageContent::query()->firstOrCreate(
                ['page' => 'services', 'key' => $key],
                [
                    'title' => $title,
                    'sort_order' => $sort,
                ],
            );

            if ($block->title === null || trim((string) $block->title) === '') {
                $block->title = $title;
                $block->sort_order = $sort;
                $block->save();
            }
        }
    }
}

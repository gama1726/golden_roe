<?php

namespace Database\Seeders;

use App\Enums\ReviewStatus;
use App\Models\Review;
use App\Models\Service;
use Illuminate\Database\Seeder;

/**
 * FAKE / TEST DATA.
 * Не входит в обычный сид и не должен использоваться как контент сайта.
 */
class DemoReviewSeeder extends Seeder
{
    public function run(): void
    {
        $service = Service::query()->first();

        Review::query()->create([
            'full_name' => '[TEST] Demo Person',
            'phone' => '80000000000',
            'email' => 'demo-review@example.test',
            'service_id' => $service?->id,
            'service_title_snapshot' => $service?->title ?? '[TEST] service',
            'rating' => 5,
            'title' => '[TEST] Не использовать в production',
            'text' => '[TEST] Это фиктивный отзыв для проверки модерации.',
            'status' => ReviewStatus::Pending,
            'consent' => true,
        ]);
    }
}

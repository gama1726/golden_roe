<?php

namespace Tests\Feature;

use App\Enums\ReviewStatus;
use App\Models\Review;
use App\Models\Service;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReviewTest extends TestCase
{
    use RefreshDatabase;

    public function test_review_stays_pending_and_hidden_until_it_is_approved_and_enabled(): void
    {
        $service = Service::query()->create([
            'title' => 'Системная сессия (онлайн-разбор)',
            'price' => 25000,
            'format' => 'Zoom',
            'audience' => 'A',
            'result' => 'B',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        Setting::putValue('reviews_enabled', false);

        $this->postJson('/api/v1/reviews', [
            'full_name' => 'Анна',
            'phone' => '89884560555',
            'email' => 'anna@example.test',
            'service_id' => $service->id,
            'rating' => 5,
            'title' => 'Заголовок',
            'text' => 'Текст отзыва',
            'consent' => true,
        ])->assertCreated()->assertJsonPath('data.status', 'pending');

        $this->assertSame(ReviewStatus::Pending, Review::query()->first()->status);

        $this->getJson('/api/v1/reviews')
            ->assertOk()
            ->assertJsonPath('meta.enabled', false)
            ->assertJsonCount(0, 'data');

        $this->actingAs(User::factory()->create());
        $reviewId = Review::query()->first()->id;

        $this->postJson('/api/v1/admin/reviews/'.$reviewId.'/approve')->assertOk();

        $this->getJson('/api/v1/reviews')->assertJsonCount(0, 'data');

        $this->patchJson('/api/v1/admin/settings', ['reviews_enabled' => true])->assertOk();

        $public = $this->getJson('/api/v1/reviews')->assertOk()->assertJsonCount(1, 'data');
        $public->assertJsonPath('data.0.full_name', 'Анна');
        $public->assertJsonPath('data.0.service', 'Системная сессия (онлайн-разбор)');
        $this->assertArrayNotHasKey('phone', $public->json('data.0'));
        $this->assertArrayNotHasKey('email', $public->json('data.0'));

        $this->postJson('/api/v1/admin/reviews/'.$reviewId.'/pending')->assertOk();
        $this->getJson('/api/v1/reviews')->assertJsonCount(0, 'data');
    }

    public function test_honeypot_does_not_store_a_review(): void
    {
        $service = Service::query()->create([
            'title' => 'Услуга',
            'price' => 1,
            'format' => 'Zoom',
            'audience' => 'A',
            'result' => 'B',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        $this->postJson('/api/v1/reviews', [
            'full_name' => 'Бот',
            'phone' => '89884560555',
            'email' => 'bot@example.test',
            'service_id' => $service->id,
            'rating' => 5,
            'title' => 'Спам',
            'text' => 'Спам',
            'consent' => true,
            'website' => 'https://spam.test',
        ])->assertCreated();

        $this->assertSame(0, Review::query()->count());
    }
}

<?php

namespace Tests\Feature;

use App\Models\Service;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_list_returns_only_active_services_in_order(): void
    {
        Service::query()->create([
            'title' => 'Вторая',
            'price' => 1000,
            'format' => 'Zoom',
            'audience' => 'A',
            'result' => 'B',
            'sort_order' => 2,
            'is_active' => true,
        ]);
        Service::query()->create([
            'title' => 'Скрытая',
            'price' => 1000,
            'format' => 'Zoom',
            'audience' => 'A',
            'result' => 'B',
            'sort_order' => 1,
            'is_active' => false,
        ]);
        Service::query()->create([
            'title' => 'Первая',
            'price' => 25000,
            'format' => 'Zoom',
            'audience' => 'A',
            'result' => 'B',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        $response = $this->getJson('/api/v1/services')->assertOk();
        $titles = array_column($response->json('data'), 'title');

        $this->assertSame(['Первая', 'Вторая'], $titles);
        $response->assertJsonPath('data.0.price_display', '25 000 ₽');
    }

    public function test_admin_can_create_and_reorder_services(): void
    {
        $this->actingAs(User::factory()->create());

        $first = $this->postJson('/api/v1/admin/services', [
            'title' => 'Одна',
            'price' => 100,
            'format' => 'Zoom',
            'audience' => 'A',
            'result' => 'B',
        ])->assertCreated()->json('data');

        $second = $this->postJson('/api/v1/admin/services', [
            'title' => 'Две',
            'price' => 200,
            'format' => 'Zoom',
            'audience' => 'A',
            'result' => 'B',
        ])->assertCreated()->json('data');

        $this->patchJson('/api/v1/admin/services/reorder', [
            'ids' => [$second['id'], $first['id']],
        ])->assertOk();

        $this->assertSame(1, Service::query()->find($second['id'])->sort_order);
        $this->assertSame(2, Service::query()->find($first['id'])->sort_order);
    }
}

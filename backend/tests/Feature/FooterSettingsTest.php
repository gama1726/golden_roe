<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\ContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FooterSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_footer_defaults_are_public_and_editable_in_admin(): void
    {
        $this->seed(ContentSeeder::class);

        $this->getJson('/api/v1/footer')
            ->assertOk()
            ->assertJsonPath('data.legal_name', 'Вартанова Эльвира Борисовна')
            ->assertJsonPath('data.inn', '050023384299');

        $this->actingAs(User::factory()->create());

        $this->patchJson('/api/v1/admin/settings', [
            'footer' => [
                'legal_name' => 'Тестовое Имя',
                'inn' => '123456789012',
            ],
        ])
            ->assertOk()
            ->assertJsonPath('data.footer.legal_name', 'Тестовое Имя')
            ->assertJsonPath('data.footer.inn', '123456789012');

        $this->getJson('/api/v1/footer')
            ->assertOk()
            ->assertJsonPath('data.legal_name', 'Тестовое Имя')
            ->assertJsonPath('data.inn', '123456789012');
    }
}

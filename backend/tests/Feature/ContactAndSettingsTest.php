<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\ContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactAndSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_contacts_are_normalized_and_settings_toggle_reviews(): void
    {
        $this->seed(ContentSeeder::class);

        $contacts = $this->getJson('/api/v1/contacts')->assertOk()->json('data');
        $byKey = collect($contacts)->keyBy('key');

        $this->assertSame('https://t.me/elvira7710', $byKey['telegram']['url']);
        $this->assertSame('@elvira7710', $byKey['telegram']['display']);
        $this->assertSame('https://wa.me/79884560555', $byKey['whatsapp']['url']);
        $this->assertSame('mailto:goldenroe@mail.ru', $byKey['email']['url']);
        $this->assertSame('tel:+79884560555', $byKey['phone']['url']);

        $this->actingAs(User::factory()->create());
        $this->patchJson('/api/v1/admin/settings', [
            'reviews_enabled' => true,
            'seo' => [
                'home' => ['title' => 'Golden Roe', 'description' => null],
            ],
        ])->assertOk()->assertJsonPath('data.reviews_enabled', true);

        $this->getJson('/api/v1/home')
            ->assertOk()
            ->assertJsonPath('data.banner.title', 'Эльвира Вартанова')
            ->assertJsonPath('data.blocks.approach.body', null);
    }
}

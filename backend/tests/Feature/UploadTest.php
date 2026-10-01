<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class UploadTest extends TestCase
{
    use RefreshDatabase;

    public function test_image_upload_stores_a_random_name_and_rejects_a_script(): void
    {
        Storage::fake('public');
        $this->actingAs(User::factory()->create());

        $response = $this->post('/api/v1/admin/uploads', [
            'image' => UploadedFile::fake()->image('portrait.jpg', 1200, 800),
        ])->assertCreated();

        $original = $response->json('data.original');
        $this->assertIsString($original);
        $this->assertStringStartsWith('images/', $original);
        $this->assertStringNotContainsString('portrait', $original);
        Storage::disk('public')->assertExists($original);

        $this->post('/api/v1/admin/uploads', [
            'image' => UploadedFile::fake()->create('shell.php', 10, 'application/x-php'),
        ])->assertUnprocessable();
    }
}

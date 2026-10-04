<?php

namespace Tests\Feature;

use App\Enums\DocumentType;
use App\Models\Document;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class DocumentTest extends TestCase
{
    use RefreshDatabase;

    public function test_document_body_is_shown_on_the_site_and_pdf_stays_on_file_url(): void
    {
        Storage::fake('documents');
        Document::query()->create(['type' => DocumentType::Disclaimer]);

        $this->getJson('/api/v1/documents/disclaimer')
            ->assertOk()
            ->assertJsonPath('data.available', false)
            ->assertJsonPath('data.has_file', false)
            ->assertJsonPath('data.body', null);

        $this->getJson('/api/v1/documents/disclaimer/file')
            ->assertNotFound()
            ->assertJsonPath('message', 'Документ будет предоставлен заказчиком');

        $this->actingAs(User::factory()->create());

        $this->patchJson('/api/v1/admin/documents/disclaimer', [
            'body' => '<p onclick="evil()">Текст политики</p><script>alert(1)</script>',
        ])->assertOk()
            ->assertJsonPath('data.available', true)
            ->assertJsonPath('data.has_file', false);

        $public = $this->getJson('/api/v1/documents/disclaimer')->assertOk();
        $public->assertJsonPath('data.available', true);
        $public->assertJsonPath('data.has_file', false);
        $this->assertStringContainsString('Текст политики', (string) $public->json('data.body'));
        $this->assertStringNotContainsString('script', (string) $public->json('data.body'));
        $this->assertStringNotContainsString('onclick', (string) $public->json('data.body'));

        $this->post('/api/v1/admin/documents/disclaimer', [
            'file' => UploadedFile::fake()->createWithContent('offer.pdf', "%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF"),
        ])->assertOk()
            ->assertJsonPath('data.has_file', true);

        $first = $this->get('/api/v1/documents/disclaimer/file')->assertOk();
        $this->assertStringContainsString('application/pdf', (string) $first->headers->get('content-type'));

        $this->post('/api/v1/admin/documents/disclaimer', [
            'file' => UploadedFile::fake()->createWithContent('replaced.pdf', "%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF"),
        ])->assertOk();

        $this->get('/api/v1/documents/disclaimer/file')->assertOk();
        $this->assertSame(1, Document::query()->where('type', DocumentType::Disclaimer)->count());
    }
}

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

    public function test_missing_document_is_not_invented_and_replacement_keeps_the_url(): void
    {
        Storage::fake('documents');
        Document::query()->create(['type' => DocumentType::Disclaimer]);

        $this->getJson('/api/v1/documents/disclaimer')
            ->assertNotFound()
            ->assertJsonPath('message', 'Документ будет предоставлен заказчиком');

        $this->actingAs(User::factory()->create());

        $this->post('/api/v1/admin/documents/disclaimer', [
            'file' => UploadedFile::fake()->createWithContent('offer.pdf', "%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF"),
        ])->assertOk();

        $first = $this->get('/api/v1/documents/disclaimer')->assertOk();
        $this->assertStringContainsString('application/pdf', (string) $first->headers->get('content-type'));

        $this->post('/api/v1/admin/documents/disclaimer', [
            'file' => UploadedFile::fake()->createWithContent('replaced.pdf', "%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF"),
        ])->assertOk();

        $this->get('/api/v1/documents/disclaimer')->assertOk();
        $this->assertSame(1, Document::query()->where('type', DocumentType::Disclaimer)->count());
    }
}

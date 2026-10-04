<?php

namespace Tests\Feature;

use App\Enums\DocumentType;
use App\Models\Document;
use App\Models\User;
use App\Services\PdfTextExtractor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Mockery;
use Tests\TestCase;

class DocumentPdfExtractTest extends TestCase
{
    use RefreshDatabase;

    public function test_upload_fills_empty_body_from_extracted_pdf_text(): void
    {
        Storage::fake('documents');
        Document::query()->create(['type' => DocumentType::Disclaimer]);

        $this->mock(PdfTextExtractor::class, function ($mock): void {
            $mock->shouldReceive('extractHtmlFromPath')
                ->once()
                ->andReturn('<p>Текст из PDF</p><h2>РАЗДЕЛ</h2><ul><li>Пункт</li></ul>');
        });

        $this->actingAs(User::factory()->create());

        $this->post('/api/v1/admin/documents/disclaimer', [
            'file' => UploadedFile::fake()->createWithContent('policy.pdf', "%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF"),
        ])->assertOk()
            ->assertJsonPath('meta.body_replaced', true)
            ->assertJsonPath('data.has_file', true);

        $document = Document::query()->where('type', DocumentType::Disclaimer)->firstOrFail();
        $this->assertTrue($document->hasBody());
        $this->assertStringContainsString('Текст из PDF', (string) $document->body);
    }

    public function test_upload_does_not_overwrite_existing_body_unless_replace_requested(): void
    {
        Storage::fake('documents');
        Document::query()->create([
            'type' => DocumentType::Disclaimer,
            'body' => '<p>Ручной текст</p>',
        ]);

        $extractor = Mockery::mock(PdfTextExtractor::class);
        $extractor->shouldReceive('extractHtmlFromPath')->never();
        $this->app->instance(PdfTextExtractor::class, $extractor);

        $this->actingAs(User::factory()->create());

        $this->post('/api/v1/admin/documents/disclaimer', [
            'file' => UploadedFile::fake()->createWithContent('policy.pdf', "%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF"),
        ])->assertOk()
            ->assertJsonPath('meta.body_replaced', false);

        $this->assertSame('<p>Ручной текст</p>', Document::query()->firstOrFail()->body);
    }

    public function test_extract_endpoint_replaces_body_from_current_pdf(): void
    {
        Storage::fake('documents');
        Storage::disk('documents')->put('disclaimer/doc.pdf', '%PDF-1.4');
        Document::query()->create([
            'type' => DocumentType::Disclaimer,
            'file' => 'disclaimer/doc.pdf',
            'original_name' => 'doc.pdf',
            'body' => '<p>Старый</p>',
        ]);

        $this->mock(PdfTextExtractor::class, function ($mock): void {
            $mock->shouldReceive('extractHtmlFromPath')
                ->once()
                ->andReturn('<p>Новый из PDF</p>');
        });

        $this->actingAs(User::factory()->create());

        $this->postJson('/api/v1/admin/documents/disclaimer/extract')
            ->assertOk()
            ->assertJsonPath('meta.body_replaced', true);

        $this->assertStringContainsString('Новый из PDF', (string) Document::query()->firstOrFail()->body);
    }

    public function test_text_to_html_marks_headings_and_lists(): void
    {
        $html = app(PdfTextExtractor::class)->textToHtml(
            "ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ\n\nПервый абзац.\n\n- Пункт один\n- Пункт два\n\n1. Нумерованный\n",
        );

        $this->assertStringContainsString('<h2>ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ</h2>', $html);
        $this->assertStringContainsString('<p>Первый абзац.</p>', $html);
        $this->assertStringContainsString('<ul><li>Пункт один</li><li>Пункт два</li></ul>', $html);
        $this->assertStringContainsString('<ol><li>Нумерованный</li></ol>', $html);
    }
}

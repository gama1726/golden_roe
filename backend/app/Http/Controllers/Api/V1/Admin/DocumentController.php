<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Enums\DocumentType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\DocumentBodyRequest;
use App\Http\Requests\Admin\DocumentUploadRequest;
use App\Http\Resources\DocumentResource;
use App\Models\Document;
use App\Services\HtmlSanitizer;
use App\Services\PdfTextExtractor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Throwable;

class DocumentController extends Controller
{
    public function index(): JsonResponse
    {
        $this->authorize('viewAny', Document::class);

        return response()->json([
            'data' => DocumentResource::collection(Document::query()->orderBy('id')->get())->resolve(),
        ]);
    }

    public function updateBody(DocumentBodyRequest $request, string $type, HtmlSanitizer $sanitizer): JsonResponse
    {
        $this->authorize('update', Document::query()->first() ?? new Document);

        $documentType = DocumentType::tryFrom($type);
        abort_unless($documentType instanceof DocumentType, 404);

        $document = Document::query()->firstOrCreate(['type' => $documentType]);
        $raw = $request->string('body')->toString();
        $document->update([
            'body' => $raw === '' ? null : $sanitizer->clean($raw),
        ]);

        return response()->json([
            'data' => (new DocumentResource($document->refresh()))->resolve(),
        ]);
    }

    public function update(
        DocumentUploadRequest $request,
        string $type,
        PdfTextExtractor $extractor,
        HtmlSanitizer $sanitizer,
    ): JsonResponse {
        $this->authorize('update', Document::query()->first() ?? new Document);

        $documentType = DocumentType::tryFrom($type);
        abort_unless($documentType instanceof DocumentType, 404);

        $document = Document::query()->firstOrCreate(['type' => $documentType]);
        $file = $request->file('file');
        assert($file instanceof UploadedFile);
        $path = $file->storeAs($documentType->value, (string) Str::uuid().'.pdf', 'documents');
        $previous = $document->file;
        $replaceBody = $request->boolean('replace_body') || ! $document->hasBody();

        try {
            DB::transaction(function () use ($document, $path, $file, $replaceBody, $extractor, $sanitizer): void {
                $document->file = $path;
                $document->original_name = $file->getClientOriginalName();

                if ($replaceBody) {
                    $html = $this->extractedBody($path, $extractor, $sanitizer);
                    if ($html !== null) {
                        $document->body = $html;
                    }
                }

                $document->save();
            });
        } catch (Throwable $exception) {
            Storage::disk('documents')->delete($path);
            throw $exception;
        }

        if (is_string($previous) && $previous !== $path) {
            Storage::disk('documents')->delete($previous);
        }

        return response()->json([
            'data' => (new DocumentResource($document->refresh()))->resolve(),
            'meta' => [
                'body_replaced' => $replaceBody && $document->hasBody(),
                'extracted' => $document->hasBody(),
            ],
        ]);
    }

    public function extract(string $type, PdfTextExtractor $extractor, HtmlSanitizer $sanitizer): JsonResponse
    {
        $this->authorize('update', Document::query()->first() ?? new Document);

        $documentType = DocumentType::tryFrom($type);
        abort_unless($documentType instanceof DocumentType, 404);

        $document = Document::query()->where('type', $documentType)->firstOrFail();
        abort_unless($document->hasFile(), 422, 'Сначала загрузите PDF.');

        $html = $this->extractedBody((string) $document->file, $extractor, $sanitizer);
        abort_if($html === null, 422, 'Не удалось извлечь текст из PDF. Вставьте текст вручную или проверьте, что PDF не скан.');

        $document->update(['body' => $html]);

        return response()->json([
            'data' => (new DocumentResource($document->refresh()))->resolve(),
            'meta' => ['body_replaced' => true, 'extracted' => true],
        ]);
    }

    private function extractedBody(string $diskPath, PdfTextExtractor $extractor, HtmlSanitizer $sanitizer): ?string
    {
        $absolute = Storage::disk('documents')->path($diskPath);
        $html = $extractor->extractHtmlFromPath($absolute);
        if ($html === null || trim($html) === '') {
            return null;
        }

        $clean = $sanitizer->clean($html);

        return trim($clean) === '' ? null : $clean;
    }
}

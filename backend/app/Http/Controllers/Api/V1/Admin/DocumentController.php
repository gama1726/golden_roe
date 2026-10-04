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
use Illuminate\Http\JsonResponse;
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

    public function update(DocumentUploadRequest $request, string $type): JsonResponse
    {
        $this->authorize('update', Document::query()->first() ?? new Document);

        $documentType = DocumentType::tryFrom($type);
        abort_unless($documentType instanceof DocumentType, 404);

        $document = Document::query()->firstOrCreate(['type' => $documentType]);
        $file = $request->file('file');
        $path = $file->storeAs($documentType->value, (string) Str::uuid().'.pdf', 'documents');
        $previous = $document->file;

        try {
            DB::transaction(function () use ($document, $path, $file): void {
                $document->update([
                    'file' => $path,
                    'original_name' => $file->getClientOriginalName(),
                ]);
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
        ]);
    }
}

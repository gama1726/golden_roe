<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Enums\DocumentType;
use App\Http\Controllers\Controller;
use App\Http\Resources\DocumentResource;
use App\Models\Document;
use App\Services\PublicContentCache;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DocumentController extends Controller
{
    public function index(PublicContentCache $cache): JsonResponse
    {
        $data = $cache->remember('documents', function (): array {
            $documents = Document::query()->orderBy('id')->get();

            return DocumentResource::collection($documents)->resolve();
        });

        return response()->json(['data' => $data]);
    }

    public function show(string $type): JsonResponse|StreamedResponse
    {
        $documentType = DocumentType::tryFrom($type);
        abort_unless($documentType instanceof DocumentType, 404);

        $document = Document::query()->where('type', $documentType)->firstOrFail();

        if ($document->file === null || ! Storage::disk('documents')->exists($document->file)) {
            return response()->json([
                'message' => 'Документ будет предоставлен заказчиком',
                'type' => $documentType->value,
            ], 404);
        }

        return Storage::disk('documents')->response(
            $document->file,
            $documentType->value.'.pdf',
            ['Content-Type' => 'application/pdf'],
        );
    }
}

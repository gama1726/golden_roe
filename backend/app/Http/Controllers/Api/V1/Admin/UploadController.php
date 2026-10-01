<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UploadImageRequest;
use App\Models\Article;
use App\Services\ImageProcessor;
use App\Support\Media;
use Illuminate\Http\JsonResponse;

class UploadController extends Controller
{
    public function store(UploadImageRequest $request, ImageProcessor $images): JsonResponse
    {
        $this->authorize('create', Article::class);

        $stored = $images->store($request->file('image'));

        return response()->json([
            'data' => [
                ...$stored,
                'urls' => Media::urls($stored),
            ],
        ], 201);
    }
}

<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Enums\ReviewStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Public\StoreReviewRequest;
use App\Http\Resources\ReviewPublicResource;
use App\Models\Review;
use App\Models\Service;
use App\Models\Setting;
use App\Services\PublicContentCache;
use App\Services\SeoSettings;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class ReviewController extends Controller
{
    public function index(PublicContentCache $cache, SeoSettings $seo): JsonResponse
    {
        $payload = $cache->remember('reviews', function () use ($seo): array {
            if (! Setting::reviewsEnabled()) {
                return [
                    'data' => [],
                    'meta' => ['enabled' => false],
                    'seo' => $seo->forPage('reviews'),
                ];
            }

            $reviews = Review::query()->approved()->latest()->get();

            return [
                'data' => ReviewPublicResource::collection($reviews)->resolve(),
                'meta' => ['enabled' => true],
                'seo' => $seo->forPage('reviews'),
            ];
        });

        return response()->json($payload);
    }

    public function store(StoreReviewRequest $request): JsonResponse
    {
        if (filled($request->input('website'))) {
            return response()->json(['data' => ['status' => ReviewStatus::Pending->value]], 201);
        }

        $service = Service::query()->active()->findOrFail($request->integer('service_id'));

        DB::transaction(function () use ($request, $service): void {
            Review::query()->create([
                'full_name' => $request->string('full_name')->toString(),
                'phone' => $request->string('phone')->toString(),
                'email' => $request->string('email')->toString(),
                'service_id' => $service->id,
                'service_title_snapshot' => $service->title,
                'rating' => $request->integer('rating'),
                'title' => $request->string('title')->toString(),
                'text' => $request->string('text')->toString(),
                'status' => ReviewStatus::Pending,
                'consent' => true,
            ]);
        });

        return response()->json(['data' => ['status' => ReviewStatus::Pending->value]], 201);
    }
}

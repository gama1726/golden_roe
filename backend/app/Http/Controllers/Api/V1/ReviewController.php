<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Enums\ReviewStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Public\StoreReviewRequest;
use App\Http\Resources\BannerResource;
use App\Http\Resources\PageContentResource;
use App\Http\Resources\ReviewPublicResource;
use App\Models\Banner;
use App\Models\PageContent;
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
            $enabled = Setting::reviewsEnabled();
            $banner = Banner::query()->where('page', 'reviews')->orderBy('sort_order')->first();
            $blocks = PageContent::query()->where('page', 'reviews')->orderBy('sort_order')->get()->keyBy('key');
            $reviews = $enabled ? Review::query()->approved()->latest()->get() : collect();

            return [
                'data' => ReviewPublicResource::collection($reviews)->resolve(),
                'meta' => ['enabled' => $enabled],
                'banner' => $banner ? (new BannerResource($banner))->resolve() : null,
                'quote' => $this->block($blocks->get('quote')),
                'intro' => $this->block($blocks->get('intro')),
                'cta' => $this->block($blocks->get('cta')),
                'note' => $this->block($blocks->get('cta.note')),
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

    private function block(?PageContent $item): ?array
    {
        return $item ? (new PageContentResource($item))->resolve() : null;
    }
}

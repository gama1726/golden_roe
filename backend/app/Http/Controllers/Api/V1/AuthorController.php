<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\AuthorStatResource;
use App\Http\Resources\BannerResource;
use App\Http\Resources\PageContentResource;
use App\Models\AuthorStat;
use App\Models\Banner;
use App\Models\PageContent;
use App\Services\PublicContentCache;
use App\Services\SeoSettings;
use Illuminate\Http\JsonResponse;

class AuthorController extends Controller
{
    public function show(PublicContentCache $cache, SeoSettings $seo): JsonResponse
    {
        $data = $cache->remember('author', function () use ($seo): array {
            $banner = Banner::query()->where('page', 'author')->orderBy('sort_order')->first();
            $blocks = PageContent::query()->where('page', 'author')->orderBy('sort_order')->get()->keyBy('key');
            $anchors = $blocks->filter(fn (PageContent $block): bool => str_starts_with($block->key, 'anchor.'))->values();

            return [
                'banner' => $banner ? (new BannerResource($banner))->resolve() : null,
                'stats' => AuthorStatResource::collection(
                    AuthorStat::query()->active()->orderBy('sort_order')->get()
                )->resolve(),
                'anchors' => PageContentResource::collection($anchors)->resolve(),
                'son' => $blocks->get('son') ? (new PageContentResource($blocks->get('son')))->resolve() : null,
                'guide' => $blocks->get('guide') ? (new PageContentResource($blocks->get('guide')))->resolve() : null,
                'seo' => $seo->forPage('author'),
            ];
        });

        return response()->json(['data' => $data]);
    }
}

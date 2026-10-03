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
            $blocks = PageContent::query()->where('page', 'author')->orderBy('sort_order')->orderBy('id')->get();
            $keyed = $blocks->keyBy('key');
            $anchors = $blocks->filter(fn (PageContent $block): bool => str_starts_with($block->key, 'anchor.'))->values();
            $pillars = $blocks->filter(fn (PageContent $block): bool => str_starts_with($block->key, 'pillar.') && $block->key !== 'pillar.quote')->values();
            $guideItems = $blocks->filter(fn (PageContent $block): bool => str_starts_with($block->key, 'guide.'))->values();

            return [
                'banner' => $banner ? (new BannerResource($banner))->resolve() : null,
                'quote' => $this->block($keyed->get('quote')),
                'stats' => AuthorStatResource::collection(
                    AuthorStat::query()->active()->orderBy('sort_order')->get()
                )->resolve(),
                'path' => $this->block($keyed->get('path')),
                'path_photo' => $this->block($keyed->get('path.photo')),
                'pillars' => [
                    'title' => $keyed->get('pillars')?->title,
                    'items' => PageContentResource::collection($pillars)->resolve(),
                    'quote' => $this->block($keyed->get('pillar.quote')),
                ],
                'anchors' => PageContentResource::collection($anchors)->resolve(),
                'son' => $this->block($keyed->get('son')),
                'son_photo' => $this->block($keyed->get('son.photo')),
                'son_quote' => $this->block($keyed->get('son.quote')),
                'guide' => $this->block($keyed->get('guide')),
                'guide_items' => PageContentResource::collection($guideItems)->resolve(),
                'manifesto' => $this->block($keyed->get('manifesto')),
                'manifesto_quote' => $this->block($keyed->get('manifesto.quote')),
                'seo' => $seo->forPage('author'),
            ];
        });

        return response()->json(['data' => $data]);
    }

    private function block(?PageContent $item): ?array
    {
        return $item ? (new PageContentResource($item))->resolve() : null;
    }
}

<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleCardResource;
use App\Http\Resources\BannerResource;
use App\Http\Resources\PageContentResource;
use App\Http\Resources\ServiceResource;
use App\Models\Article;
use App\Models\Banner;
use App\Models\PageContent;
use App\Models\Service;
use App\Services\PublicContentCache;
use App\Services\SeoSettings;
use Illuminate\Http\JsonResponse;

class HomeController extends Controller
{
    public function show(PublicContentCache $cache, SeoSettings $seo): JsonResponse
    {
        $data = $cache->remember('home', function () use ($seo): array {
            $banner = Banner::query()->where('page', 'home')->orderBy('sort_order')->first();
            $blocks = PageContent::query()->where('page', 'home')->orderBy('sort_order')->get()->keyBy('key');
            $results = $blocks->filter(fn (PageContent $block): bool => str_starts_with($block->key, 'result.'))->values();

            return [
                'banner' => $banner ? (new BannerResource($banner))->resolve() : null,
                'blocks' => [
                    'approach' => $this->block($blocks->get('approach')),
                    'choice' => $this->block($blocks->get('choice')),
                    'results' => [
                        'title' => $blocks->get('results')?->title,
                        'body' => $blocks->get('results')?->body,
                        'items' => PageContentResource::collection($results)->resolve(),
                    ],
                ],
                'services' => ServiceResource::collection(
                    Service::query()->active()->orderBy('sort_order')->limit(3)->get()
                )->resolve(),
                'articles' => ArticleCardResource::collection(
                    Article::query()->published()->latest('published_at')->limit(3)->get()
                )->resolve(),
                'seo' => $seo->forPage('home'),
            ];
        });

        return response()->json(['data' => $data]);
    }

    /**
     * @return array{title: string|null, body: string|null, image: mixed}|null
     */
    private function block(?PageContent $block): ?array
    {
        if ($block === null) {
            return null;
        }

        $resolved = (new PageContentResource($block))->resolve();

        return [
            'title' => $resolved['title'],
            'body' => $resolved['body'],
            'image' => $resolved['image'],
        ];
    }
}

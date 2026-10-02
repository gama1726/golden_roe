<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleCardResource;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\BannerResource;
use App\Http\Resources\PageContentResource;
use App\Models\Article;
use App\Models\Banner;
use App\Models\PageContent;
use App\Services\PublicContentCache;
use App\Services\SeoSettings;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function index(Request $request, PublicContentCache $cache, SeoSettings $seo): JsonResponse
    {
        $page = max(1, $request->integer('page', 1));

        $payload = $cache->remember('articles.page.'.$page, function () use ($page, $seo): array {
            $paginator = Article::query()
                ->published()
                ->latest('published_at')
                ->latest('id')
                ->paginate(perPage: 6, page: $page);

            $banner = Banner::query()->where('page', 'articles')->orderBy('sort_order')->first();
            $quote = PageContent::query()->where('page', 'articles')->where('key', 'quote')->first();

            return [
                'data' => ArticleCardResource::collection($paginator->getCollection())->resolve(),
                'meta' => [
                    'current_page' => $paginator->currentPage(),
                    'per_page' => $paginator->perPage(),
                    'total' => $paginator->total(),
                    'last_page' => $paginator->lastPage(),
                ],
                'banner' => $banner ? (new BannerResource($banner))->resolve() : null,
                'quote' => $quote ? (new PageContentResource($quote))->resolve() : null,
                'seo' => $seo->forPage('articles'),
            ];
        });

        return response()->json($payload);
    }

    public function show(string $slug, PublicContentCache $cache): JsonResponse
    {
        $data = $cache->remember('article.'.$slug, function () use ($slug): array {
            $article = Article::query()->published()->where('slug', $slug)->firstOrFail();

            return [
                'article' => (new ArticleResource($article))->resolve(),
                'seo' => [
                    'title' => $article->title,
                    'description' => $article->cardExcerpt(),
                ],
            ];
        });

        return response()->json(['data' => $data]);
    }
}

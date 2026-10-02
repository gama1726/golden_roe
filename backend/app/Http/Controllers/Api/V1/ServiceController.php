<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\BannerResource;
use App\Http\Resources\PageContentResource;
use App\Http\Resources\ServiceResource;
use App\Models\Banner;
use App\Models\PageContent;
use App\Models\Service;
use App\Services\PublicContentCache;
use App\Services\SeoSettings;
use Illuminate\Http\JsonResponse;

class ServiceController extends Controller
{
    public function index(PublicContentCache $cache, SeoSettings $seo): JsonResponse
    {
        $payload = $cache->remember('services', function () use ($seo): array {
            $banner = Banner::query()->where('page', 'services')->orderBy('sort_order')->first();
            $contents = PageContent::query()->where('page', 'services')->orderBy('sort_order')->orderBy('id')->get();

            return [
                'data' => ServiceResource::collection(
                    Service::query()->active()->orderBy('sort_order')->get()
                )->resolve(),
                'banner' => $banner ? (new BannerResource($banner))->resolve() : null,
                'blocks' => [
                    'quote' => $this->block($contents->firstWhere('key', 'quote')),
                    'points' => PageContentResource::collection(
                        $contents->filter(fn (PageContent $item): bool => str_starts_with($item->key, 'point.'))->values()
                    )->resolve(),
                    'cta' => $this->block($contents->firstWhere('key', 'cta')),
                ],
                'seo' => $seo->forPage('services'),
            ];
        });

        return response()->json($payload);
    }

    public function show(Service $service): JsonResponse
    {
        abort_unless($service->is_active, 404);

        return response()->json([
            'data' => (new ServiceResource($service))->resolve(),
        ]);
    }

    private function block(?PageContent $item): ?array
    {
        return $item ? (new PageContentResource($item))->resolve() : null;
    }
}

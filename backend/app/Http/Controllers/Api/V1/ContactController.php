<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\BannerResource;
use App\Http\Resources\PageContentResource;
use App\Models\Banner;
use App\Models\ContactChannel;
use App\Models\PageContent;
use App\Services\ContactLinker;
use App\Services\PublicContentCache;
use App\Services\SeoSettings;
use Illuminate\Http\JsonResponse;

class ContactController extends Controller
{
    public function index(PublicContentCache $cache, ContactLinker $linker, SeoSettings $seo): JsonResponse
    {
        $payload = $cache->remember('contacts', function () use ($linker, $seo): array {
            $channels = ContactChannel::query()->public()->orderBy('sort_order')->get();
            $banner = Banner::query()->where('page', 'contacts')->orderBy('sort_order')->first();
            $contents = PageContent::query()->where('page', 'contacts')->orderBy('sort_order')->orderBy('id')->get();

            return [
                'data' => $channels->map(fn (ContactChannel $channel): array => $linker->present($channel))->values()->all(),
                'banner' => $banner ? (new BannerResource($banner))->resolve() : null,
                'blocks' => [
                    'greeting' => $this->block($contents->firstWhere('key', 'greeting')),
                    'reach' => $this->block($contents->firstWhere('key', 'reach')),
                    'promise' => $this->block($contents->firstWhere('key', 'promise')),
                    'points' => PageContentResource::collection(
                        $contents->filter(fn (PageContent $item): bool => str_starts_with($item->key, 'point.'))->values()
                    )->resolve(),
                    'scene' => $this->block($contents->firstWhere('key', 'scene')),
                    'consult' => $this->block($contents->firstWhere('key', 'consult')),
                ],
                'seo' => $seo->forPage('contacts'),
            ];
        });

        return response()->json($payload);
    }

    private function block(?PageContent $item): ?array
    {
        return $item ? (new PageContentResource($item))->resolve() : null;
    }
}

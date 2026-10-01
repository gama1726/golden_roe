<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\BannerResource;
use App\Models\Banner;
use App\Models\ContactChannel;
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

            return [
                'data' => $channels->map(fn (ContactChannel $channel): array => $linker->present($channel))->values()->all(),
                'banner' => $banner ? (new BannerResource($banner))->resolve() : null,
                'seo' => $seo->forPage('contacts'),
            ];
        });

        return response()->json($payload);
    }
}

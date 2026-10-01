<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Services\PublicContentCache;
use Illuminate\Http\JsonResponse;

class SeoController extends Controller
{
    public function show(PublicContentCache $cache): JsonResponse
    {
        $data = $cache->remember('seo', function (): array {
            $seo = Setting::getValue('seo', []);

            return is_array($seo) ? $seo : [];
        });

        return response()->json(['data' => $data]);
    }
}

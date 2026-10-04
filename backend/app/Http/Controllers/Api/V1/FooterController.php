<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Services\PublicContentCache;
use Illuminate\Http\JsonResponse;

class FooterController extends Controller
{
    public function show(PublicContentCache $cache): JsonResponse
    {
        $data = $cache->remember('footer', fn (): array => Setting::footer());

        return response()->json(['data' => $data]);
    }
}

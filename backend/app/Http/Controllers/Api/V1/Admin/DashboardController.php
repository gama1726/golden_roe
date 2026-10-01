<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Review;
use App\Models\Service;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function show(): JsonResponse
    {
        return response()->json([
            'data' => [
                'pending_reviews' => Review::query()->pending()->count(),
                'services' => Service::query()->count(),
                'articles' => Article::query()->count(),
                'published_articles' => Article::query()->published()->count(),
            ],
        ]);
    }
}

<?php

use App\Http\Controllers\Api\V1\Admin\ArticleController as AdminArticleController;
use App\Http\Controllers\Api\V1\Admin\AuthController;
use App\Http\Controllers\Api\V1\Admin\AuthorStatController;
use App\Http\Controllers\Api\V1\Admin\BannerController;
use App\Http\Controllers\Api\V1\Admin\ContactChannelController;
use App\Http\Controllers\Api\V1\Admin\DashboardController;
use App\Http\Controllers\Api\V1\Admin\DocumentController as AdminDocumentController;
use App\Http\Controllers\Api\V1\Admin\PageContentController;
use App\Http\Controllers\Api\V1\Admin\ReviewController as AdminReviewController;
use App\Http\Controllers\Api\V1\Admin\ServiceController as AdminServiceController;
use App\Http\Controllers\Api\V1\Admin\SettingController;
use App\Http\Controllers\Api\V1\Admin\UploadController;
use App\Http\Controllers\Api\V1\ArticleController;
use App\Http\Controllers\Api\V1\AuthorController;
use App\Http\Controllers\Api\V1\ContactController;
use App\Http\Controllers\Api\V1\DocumentController;
use App\Http\Controllers\Api\V1\HomeController;
use App\Http\Controllers\Api\V1\ReviewController;
use App\Http\Controllers\Api\V1\SeoController;
use App\Http\Controllers\Api\V1\ServiceController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::get('home', [HomeController::class, 'show']);
    Route::get('services', [ServiceController::class, 'index']);
    Route::get('services/{service}', [ServiceController::class, 'show']);
    Route::get('author', [AuthorController::class, 'show']);
    Route::get('articles', [ArticleController::class, 'index']);
    Route::get('articles/{slug}', [ArticleController::class, 'show']);
    Route::get('reviews', [ReviewController::class, 'index']);
    Route::post('reviews', [ReviewController::class, 'store'])->middleware('throttle:reviews');
    Route::get('contacts', [ContactController::class, 'index']);
    Route::get('documents', [DocumentController::class, 'index']);
    Route::get('documents/{type}', [DocumentController::class, 'show']);
    Route::get('documents/{type}/file', [DocumentController::class, 'file']);
    Route::get('seo', [SeoController::class, 'show']);

    Route::prefix('admin')->group(function (): void {
        Route::post('login', [AuthController::class, 'login']);

        Route::middleware(['auth:sanctum', 'admin'])->group(function (): void {
            Route::post('logout', [AuthController::class, 'logout']);
            Route::get('me', [AuthController::class, 'me']);
            Route::get('dashboard', [DashboardController::class, 'show']);

            Route::patch('services/reorder', [AdminServiceController::class, 'reorder']);
            Route::apiResource('services', AdminServiceController::class);

            Route::apiResource('articles', AdminArticleController::class);

            Route::get('reviews', [AdminReviewController::class, 'index']);
            Route::post('reviews/{review}/approve', [AdminReviewController::class, 'approve']);
            Route::post('reviews/{review}/pending', [AdminReviewController::class, 'pending']);
            Route::post('reviews/{review}/image', [AdminReviewController::class, 'image']);
            Route::delete('reviews/{review}', [AdminReviewController::class, 'destroy']);

            Route::apiResource('banners', BannerController::class)->except(['show']);
            Route::apiResource('page-contents', PageContentController::class)
                ->except(['show'])
                ->parameters(['page-contents' => 'pageContent']);
            Route::apiResource('author-stats', AuthorStatController::class)
                ->except(['show'])
                ->parameters(['author-stats' => 'authorStat']);
            Route::apiResource('contacts', ContactChannelController::class)
                ->except(['show'])
                ->parameters(['contacts' => 'contactChannel']);

            Route::get('documents', [AdminDocumentController::class, 'index']);
            Route::patch('documents/{type}', [AdminDocumentController::class, 'updateBody']);
            Route::post('documents/{type}', [AdminDocumentController::class, 'update']);

            Route::get('settings', [SettingController::class, 'show']);
            Route::patch('settings', [SettingController::class, 'update']);

            Route::post('uploads', [UploadController::class, 'store']);
        });
    });
});

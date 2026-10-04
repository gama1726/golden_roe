<?php

namespace App\Providers;

use App\Models\Article;
use App\Models\AuthorStat;
use App\Models\Banner;
use App\Models\ContactChannel;
use App\Models\Document;
use App\Models\PageContent;
use App\Models\Review;
use App\Models\Service;
use App\Models\Setting;
use App\Observers\FlushPublicContentObserver;
use App\Policies\AdminContentPolicy;
use Dedoc\Scramble\Scramble;
use Dedoc\Scramble\Support\Generator\OpenApi;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        RateLimiter::for('reviews', function (Request $request) {
            return Limit::perMinute(5)->by((string) $request->ip());
        });

        Gate::define('admin', fn ($user): bool => $user->isAdmin());
        // Scramble docs stay closed unless explicitly granted (never open on public hosts).
        Gate::define('viewApiDocs', fn ($user = null): bool => app()->environment('local') && $user?->isAdmin());

        foreach ([
            Service::class,
            Article::class,
            Review::class,
            Banner::class,
            PageContent::class,
            AuthorStat::class,
            ContactChannel::class,
            Document::class,
            Setting::class,
        ] as $model) {
            Gate::policy($model, AdminContentPolicy::class);
        }

        $observer = FlushPublicContentObserver::class;
        Service::observe($observer);
        Article::observe($observer);
        Review::observe($observer);
        Banner::observe($observer);
        PageContent::observe($observer);
        AuthorStat::observe($observer);
        ContactChannel::observe($observer);
        Document::observe($observer);
        Setting::observe($observer);

        Scramble::configure()->afterOpenApiGenerated(function (OpenApi $openApi): void {
            $openApi->info->title = 'Golden Roe API';
            $openApi->info->version = '1.0.0';
            $openApi->info->description = 'REST API публичного сайта и административной панели Golden Roe.';
        });
    }
}

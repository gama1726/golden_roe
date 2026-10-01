<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Support\Facades\Cache;

final class PublicContentCache
{
    private const VERSION_KEY = 'public_content_version';

    public function remember(string $key, callable $callback): mixed
    {
        $version = (int) Cache::get(self::VERSION_KEY, 1);

        return Cache::remember(
            self::VERSION_KEY.'.'.$version.'.'.$key,
            now()->addSeconds(60),
            $callback,
        );
    }

    public function flush(): void
    {
        $next = ((int) Cache::get(self::VERSION_KEY, 1)) + 1;
        Cache::forever(self::VERSION_KEY, $next);
        app(FrontendRevalidator::class)->dispatch();
    }
}

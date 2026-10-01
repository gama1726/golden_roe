<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

final class FrontendRevalidator
{
    public function dispatch(): void
    {
        $url = config('services.frontend.revalidate_url');
        $secret = config('services.frontend.revalidate_secret');

        if (! is_string($url) || $url === '' || ! is_string($secret) || $secret === '') {
            return;
        }

        try {
            Http::timeout(3)
                ->withHeaders(['X-Revalidate-Token' => $secret])
                ->post($url);
        } catch (Throwable $exception) {
            Log::warning('Frontend revalidation failed.', [
                'message' => $exception->getMessage(),
            ]);
        }
    }
}

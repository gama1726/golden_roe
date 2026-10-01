<?php

declare(strict_types=1);

namespace App\Observers;

use App\Services\PublicContentCache;
use Illuminate\Database\Eloquent\Model;

final class FlushPublicContentObserver
{
    public function __construct(private readonly PublicContentCache $cache) {}

    public function saved(Model $model): void
    {
        $this->cache->flush();
    }

    public function deleted(Model $model): void
    {
        $this->cache->flush();
    }
}

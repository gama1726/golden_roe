<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Article;
use App\Support\Media;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Article */
class ArticleCardResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'excerpt' => $this->cardExcerpt(),
            'image' => Media::urls($this->image),
            'published_at' => $this->published_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}

<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\PageContent;
use App\Support\Media;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin PageContent */
class PageContentResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'page' => $this->page,
            'key' => $this->key,
            'eyebrow' => $this->eyebrow,
            'title' => $this->title,
            'body' => $this->body,
            'image' => Media::urls($this->image),
            'sort_order' => $this->sort_order,
        ];
    }
}

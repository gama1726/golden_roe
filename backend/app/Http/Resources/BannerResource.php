<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Banner;
use App\Support\Media;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Banner */
class BannerResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'page' => $this->page,
            'sort_order' => $this->sort_order,
            'title' => $this->title,
            'subtitle' => $this->subtitle,
            'text' => $this->text,
            'image' => Media::urls($this->image),
        ];
    }
}

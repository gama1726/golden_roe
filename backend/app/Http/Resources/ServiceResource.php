<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Service;
use App\Support\Media;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Service */
class ServiceResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'image' => Media::urls($this->image),
            'price' => $this->price,
            'price_display' => number_format($this->price, 0, ',', ' ').' ₽',
            'format' => $this->format,
            'audience' => $this->audience,
            'result' => $this->result,
            'sort_order' => $this->sort_order,
            'is_active' => $this->is_active,
        ];
    }
}

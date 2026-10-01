<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Review;
use App\Support\Media;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Review */
class ReviewPublicResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'full_name' => $this->full_name,
            'rating' => $this->rating,
            'service' => $this->service_title_snapshot,
            'title' => $this->title,
            'text' => $this->text,
            'image' => Media::urls($this->image),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}

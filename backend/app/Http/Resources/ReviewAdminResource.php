<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Review;
use App\Support\Media;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Review */
class ReviewAdminResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'full_name' => $this->full_name,
            'phone' => $this->phone,
            'email' => $this->email,
            'service_id' => $this->service_id,
            'service' => $this->service_title_snapshot,
            'rating' => $this->rating,
            'title' => $this->title,
            'text' => $this->text,
            'image' => Media::urls($this->image),
            'status' => $this->status->value,
            'consent' => $this->consent,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}

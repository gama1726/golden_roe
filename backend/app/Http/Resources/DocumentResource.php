<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Document */
class DocumentResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'type' => $this->type->value,
            'label' => $this->type->label(),
            'body' => $this->body,
            'available' => $this->isAvailable(),
            'has_file' => $this->hasFile(),
            'url' => url('/api/v1/documents/'.$this->type->value.'/file'),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}

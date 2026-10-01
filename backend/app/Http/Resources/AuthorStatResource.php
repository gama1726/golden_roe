<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\AuthorStat;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin AuthorStat */
class AuthorStatResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'value' => $this->value,
            'label' => $this->label,
            'sort_order' => $this->sort_order,
            'is_active' => $this->is_active,
        ];
    }
}

<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class ContactChannel extends Model
{
    protected $fillable = [
        'key',
        'label',
        'value',
        'url',
        'sort_order',
        'is_public',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'is_public' => 'boolean',
        ];
    }

    public function scopePublic(Builder $query): Builder
    {
        return $query->where('is_public', true);
    }
}

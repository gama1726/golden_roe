<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    protected $fillable = [
        'page',
        'sort_order',
        'image',
        'title',
        'subtitle',
        'text',
    ];

    protected function casts(): array
    {
        return [
            'image' => 'array',
            'sort_order' => 'integer',
        ];
    }
}

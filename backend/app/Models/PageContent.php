<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageContent extends Model
{
    protected $fillable = [
        'page',
        'key',
        'eyebrow',
        'title',
        'body',
        'image',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'image' => 'array',
            'sort_order' => 'integer',
        ];
    }
}

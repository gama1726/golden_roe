<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $fillable = [
        'slug',
        'image',
        'title',
        'excerpt',
        'content',
        'is_published',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'image' => 'array',
            'is_published' => 'boolean',
            'published_at' => 'datetime',
        ];
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    public function cardExcerpt(): string
    {
        if (is_string($this->excerpt) && trim($this->excerpt) !== '') {
            return trim($this->excerpt);
        }

        $text = trim(preg_replace('/\s+/u', ' ', strip_tags((string) $this->content)) ?? '');

        if (mb_strlen($text) <= 180) {
            return $text;
        }

        return rtrim(mb_substr($text, 0, 177)).'…';
    }
}

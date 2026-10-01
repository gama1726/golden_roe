<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\ReviewStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    protected $fillable = [
        'full_name',
        'phone',
        'email',
        'service_id',
        'service_title_snapshot',
        'rating',
        'title',
        'text',
        'image',
        'status',
        'consent',
    ];

    protected function casts(): array
    {
        return [
            'image' => 'array',
            'rating' => 'integer',
            'status' => ReviewStatus::class,
            'consent' => 'boolean',
        ];
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function scopeApproved(Builder $query): Builder
    {
        return $query->where('status', ReviewStatus::Approved);
    }

    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', ReviewStatus::Pending);
    }
}

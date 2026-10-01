<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\DocumentType;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    protected $fillable = [
        'type',
        'file',
        'original_name',
    ];

    protected function casts(): array
    {
        return [
            'type' => DocumentType::class,
        ];
    }
}

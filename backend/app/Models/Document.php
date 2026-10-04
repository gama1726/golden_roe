<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\DocumentType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Document extends Model
{
    protected $fillable = [
        'type',
        'file',
        'original_name',
        'body',
    ];

    protected function casts(): array
    {
        return [
            'type' => DocumentType::class,
        ];
    }

    public function hasFile(): bool
    {
        return is_string($this->file)
            && $this->file !== ''
            && Storage::disk('documents')->exists($this->file);
    }

    public function hasBody(): bool
    {
        return filled(trim(strip_tags((string) $this->body)));
    }

    public function isAvailable(): bool
    {
        return $this->hasBody() || $this->hasFile();
    }
}

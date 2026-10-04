<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'key',
        'value',
    ];

    protected function casts(): array
    {
        return [
            'value' => 'json',
        ];
    }

    public static function getValue(string $key, mixed $default = null): mixed
    {
        $setting = static::query()->where('key', $key)->first();

        if ($setting === null) {
            return $default;
        }

        return $setting->value;
    }

    public static function putValue(string $key, mixed $value): void
    {
        static::query()->updateOrCreate(
            ['key' => $key],
            ['value' => $value],
        );
    }

    public static function reviewsEnabled(): bool
    {
        return (bool) static::getValue('reviews_enabled', false);
    }

    /**
     * @return array{legal_name: string|null, inn: string|null}
     */
    public static function footer(): array
    {
        $defaults = [
            'legal_name' => 'Вартанова Эльвира Борисовна',
            'inn' => '050023384299',
        ];

        $value = static::getValue('footer', null);
        if (! is_array($value)) {
            return $defaults;
        }

        $legalName = array_key_exists('legal_name', $value) ? $value['legal_name'] : $defaults['legal_name'];
        $inn = array_key_exists('inn', $value) ? $value['inn'] : $defaults['inn'];

        return [
            'legal_name' => is_string($legalName) && trim($legalName) !== '' ? trim($legalName) : null,
            'inn' => is_string($inn) && trim($inn) !== '' ? trim($inn) : null,
        ];
    }
}

<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\ContactChannel;

final class ContactLinker
{
    /**
     * @return array{id: int, key: string, label: string, display: string, url: string|null, sort_order: int}
     */
    public function present(ContactChannel $channel): array
    {
        $link = $this->build($channel->key, $channel->value, $channel->url);

        return [
            'id' => $channel->id,
            'key' => $channel->key,
            'label' => $channel->label,
            'display' => $link['display'],
            'url' => $link['url'],
            'sort_order' => $channel->sort_order,
        ];
    }

    /**
     * @return array{display: string, url: string|null}
     */
    public function build(string $key, string $value, ?string $urlOverride = null): array
    {
        if (is_string($urlOverride) && trim($urlOverride) !== '') {
            return [
                'display' => $value,
                'url' => trim($urlOverride),
            ];
        }

        return match ($key) {
            'telegram' => $this->telegram($value),
            'whatsapp' => $this->whatsapp($value),
            'email' => [
                'display' => $value,
                'url' => 'mailto:'.$value,
            ],
            'phone' => $this->phone($value),
            default => [
                'display' => $value,
                'url' => $this->looksLikeUrl($value) ? $value : null,
            ],
        };
    }

    /**
     * @return array{display: string, url: string|null}
     */
    private function telegram(string $value): array
    {
        $username = ltrim(trim($value), '@');

        return [
            'display' => '@'.$username,
            'url' => $username !== '' ? 'https://t.me/'.$username : null,
        ];
    }

    /**
     * @return array{display: string, url: string|null}
     */
    private function whatsapp(string $value): array
    {
        $digits = $this->internationalDigits($value);

        return [
            'display' => $value,
            'url' => $digits !== '' ? 'https://wa.me/'.$digits : null,
        ];
    }

    /**
     * @return array{display: string, url: string|null}
     */
    private function phone(string $value): array
    {
        $digits = $this->internationalDigits($value);

        return [
            'display' => $value,
            'url' => $digits !== '' ? 'tel:+'.$digits : null,
        ];
    }

    private function internationalDigits(string $value): string
    {
        $digits = preg_replace('/\D+/', '', $value) ?? '';

        if (strlen($digits) === 11 && str_starts_with($digits, '8')) {
            $digits = '7'.substr($digits, 1);
        }

        if (strlen($digits) === 10) {
            $digits = '7'.$digits;
        }

        return $digits;
    }

    private function looksLikeUrl(string $value): bool
    {
        return str_starts_with($value, 'https://') || str_starts_with($value, 'http://');
    }
}

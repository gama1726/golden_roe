<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'reviews_enabled' => ['sometimes', 'boolean'],
            'seo' => ['sometimes', 'array'],
            'seo.*.title' => ['nullable', 'string', 'max:255'],
            'seo.*.description' => ['nullable', 'string', 'max:500'],
            'seo.*.page' => ['sometimes', 'string', Rule::in(['home', 'services', 'author', 'articles', 'reviews', 'contacts'])],
        ];
    }
}

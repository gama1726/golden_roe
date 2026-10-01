<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Rules\StoredImage;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PageContentRequest extends FormRequest
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
        $required = $this->isMethod('POST') ? 'required' : 'sometimes';

        return [
            'page' => [$required, 'string', Rule::in(['home', 'services', 'author', 'articles', 'reviews', 'contacts'])],
            'key' => [$required, 'string', 'max:100'],
            'eyebrow' => ['sometimes', 'nullable', 'string', 'max:255'],
            'title' => ['sometimes', 'nullable', 'string', 'max:255'],
            'body' => ['sometimes', 'nullable', 'string', 'max:20000'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
            'image' => ['sometimes', 'nullable', 'array', new StoredImage],
            'image.alt' => ['sometimes', 'nullable', 'string', 'max:255'],
        ];
    }
}

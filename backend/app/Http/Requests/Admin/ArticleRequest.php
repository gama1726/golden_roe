<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Rules\StoredImage;
use Illuminate\Foundation\Http\FormRequest;

class ArticleRequest extends FormRequest
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
            'title' => [$required, 'string', 'max:255'],
            'slug' => ['sometimes', 'nullable', 'string', 'max:255'],
            'excerpt' => ['sometimes', 'nullable', 'string', 'max:500'],
            'content' => [$required, 'string', 'max:100000'],
            'is_published' => ['sometimes', 'boolean'],
            'image' => ['sometimes', 'nullable', 'array', new StoredImage],
            'image.alt' => ['sometimes', 'nullable', 'string', 'max:255'],
        ];
    }
}

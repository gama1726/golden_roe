<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Rules\StoredImage;
use Illuminate\Foundation\Http\FormRequest;

class ServiceRequest extends FormRequest
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
            'price' => [$required, 'integer', 'min:0'],
            'format' => [$required, 'string', 'max:255'],
            'audience' => [$required, 'string', 'max:5000'],
            'result' => [$required, 'string', 'max:5000'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
            'image' => ['sometimes', 'nullable', new StoredImage],
        ];
    }
}

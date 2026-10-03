<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ContactChannelRequest extends FormRequest
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
        $channel = $this->route('contactChannel');

        return [
            'key' => [$required, 'string', 'max:50', 'regex:/^[a-z0-9_\-]+$/', Rule::unique('contact_channels', 'key')->ignore($channel)],
            'label' => [$required, 'string', 'max:100'],
            'value' => [$required, 'string', 'max:255'],
            'url' => ['sometimes', 'nullable', 'string', 'max:500'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
            'is_public' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'key.regex' => 'Ключ только латиницей в нижнем регистре: буквы, цифры, дефис или подчёркивание. Пример: instagram',
            'key.unique' => 'Канал с таким ключом уже есть.',
            'key.required' => 'Укажите ключ канала.',
            'label.required' => 'Укажите подпись канала.',
            'value.required' => 'Укажите значение или ссылку.',
        ];
    }
}

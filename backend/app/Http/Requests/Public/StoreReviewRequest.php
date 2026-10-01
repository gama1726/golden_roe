<?php

declare(strict_types=1);

namespace App\Http\Requests\Public;

use Illuminate\Foundation\Http\FormRequest;

class StoreReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'full_name' => ['required', 'string', 'max:120'],
            'phone' => ['required', 'string', 'max:32', 'regex:/^\+?[0-9\s\-()]{10,20}$/'],
            'email' => ['required', 'email', 'max:255'],
            'service_id' => ['required', 'integer', 'exists:services,id,is_active,1'],
            'rating' => ['required', 'integer', 'between:1,5'],
            'title' => ['required', 'string', 'max:180'],
            'text' => ['required', 'string', 'max:5000'],
            'consent' => ['accepted'],
            'website' => ['nullable', 'string', 'max:200'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'consent.accepted' => 'Нужно согласие на обработку персональных данных.',
            'service_id.exists' => 'Выберите услугу из списка.',
            'rating.between' => 'Оценка должна быть от 1 до 5.',
        ];
    }
}

<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Rules\PdfDocument;
use Illuminate\Foundation\Http\FormRequest;

class DocumentUploadRequest extends FormRequest
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
            'file' => ['required', 'file', 'extensions:pdf', 'max:10240', new PdfDocument],
            'replace_body' => ['sometimes', 'boolean'],
        ];
    }
}

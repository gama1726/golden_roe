<?php

declare(strict_types=1);

namespace App\Enums;

enum DocumentType: string
{
    case Disclaimer = 'disclaimer';
    case Privacy = 'privacy';
    case Consent = 'consent';
    case Offer = 'offer';

    public function label(): string
    {
        return match ($this) {
            self::Disclaimer => 'Дисклеймер',
            self::Privacy => 'Политика конфиденциальности',
            self::Consent => 'Согласие на обработку персональных данных',
            self::Offer => 'Оферта',
        };
    }
}

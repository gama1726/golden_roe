<?php

declare(strict_types=1);

namespace App\Support;

final class SeoDefaults
{
    /**
     * @return array<string, array{title: string, description: string}>
     */
    public static function pages(): array
    {
        return [
            'home' => [
                'title' => 'Golden Roe — Эльвира Вартанова | системные расстановки и консультации',
                'description' => 'Golden Roe — практика Эльвиры Вартановой: системные расстановки, индивидуальные консультации и сопровождение изменений в жизни, семье и бизнесе.',
            ],
            'services' => [
                'title' => 'Услуги — Golden Roe | Эльвира Вартанова',
                'description' => 'Форматы работы с Эльвирой Вартановой: системные сессии, разборы и сопровождение. Актуальные услуги и стоимость на сайте Golden Roe.',
            ],
            'author' => [
                'title' => 'Эльвира Вартанова — об авторе | Golden Roe',
                'description' => 'Эльвира Вартанова — основательница Golden Roe. Путь, точки опоры и подход к системным расстановкам и личным изменениям.',
            ],
            'articles' => [
                'title' => 'Статьи — Golden Roe | Эльвира Вартанова',
                'description' => 'Статьи Эльвиры Вартановой о системном видении, семье, бизнесе и внутренней опоре. Материалы практики Golden Roe.',
            ],
            'reviews' => [
                'title' => 'Отзывы клиентов — Golden Roe | Эльвира Вартанова',
                'description' => 'Отзывы о работе с Эльвирой Вартановой и практике Golden Roe. Реальные истории изменений после консультаций и расстановок.',
            ],
            'contacts' => [
                'title' => 'Контакты — Golden Roe | записаться к Эльвире Вартановой',
                'description' => 'Связаться с Эльвирой Вартановой: Telegram, WhatsApp, телефон и email. Запись на консультацию в Golden Roe.',
            ],
        ];
    }
}

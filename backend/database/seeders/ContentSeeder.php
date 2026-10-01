<?php

namespace Database\Seeders;

use App\Enums\DocumentType;
use App\Models\AuthorStat;
use App\Models\Banner;
use App\Models\ContactChannel;
use App\Models\Document;
use App\Models\PageContent;
use App\Models\Service;
use App\Models\Setting;
use Illuminate\Database\Seeder;

class ContentSeeder extends Seeder
{
    public function run(): void
    {
        Banner::query()->firstOrCreate(
            ['page' => 'home', 'sort_order' => 1],
            [
                'title' => 'Эльвира Вартанова',
                'subtitle' => 'Системный художник вашей реальности',
                'text' => 'Объединяя эстетику, духовное наставничество и масштабные стратегии',
            ],
        );

        Banner::query()->firstOrCreate(
            ['page' => 'author', 'sort_order' => 1],
            ['title' => 'Жизнь как главный учитель системного видения'],
        );

        foreach (['services' => 'Услуги', 'articles' => 'Статьи', 'reviews' => 'Отзывы', 'contacts' => 'Контакты'] as $page => $title) {
            Banner::query()->firstOrCreate(
                ['page' => $page, 'sort_order' => 1],
                ['title' => $title],
            );
        }

        $this->page('home', 'approach', 'Системный подход к масштабному росту', 1);
        $this->page('home', 'results', 'Результаты клиентов за 6 лет практики', 2);
        $this->page('home', 'choice', 'Вы всегда выбираете сами', 3);

        $results = [
            'result.housing' => 'жильё',
            'result.businesses' => 'новые бизнесы',
            'result.income' => 'рост доходов',
            'result.family' => 'семья',
            'result.health' => 'здоровье',
            'result.children' => 'рождение детей',
        ];

        $order = 1;
        foreach ($results as $key => $title) {
            $this->page('home', $key, $title, $order++);
        }

        $this->page('author', 'anchor.beauty', '34 года в индустрии красоты', 1);
        $this->page('author', 'anchor.business', 'предпринимательство с нуля', 2);
        $this->page('author', 'anchor.motherhood', 'материнство и дух', 3);
        $this->page('author', 'anchor.manifesto', 'творческий манифест', 4);
        $this->page('author', 'guide', 'Почему я имею право быть вашим проводником?', 5);

        PageContent::query()->firstOrCreate(
            ['page' => 'author', 'key' => 'son'],
            [
                'eyebrow' => 'МОЯ СЕМЬЯ — МОЯ ОПОРА',
                'title' => 'Сын — важная часть моего пути',
                'body' => 'Материнство — значимая часть моей жизни и личного опыта. Отношения с детьми учат меня внимательности, ответственности, терпению и умению замечать действительно важное.',
                'sort_order' => 6,
            ],
        );

        $stats = [
            ['34', 'года в индустрии красоты'],
            ['3', 'детей'],
            ['24', 'песни'],
            [null, 'созданный и проданный бизнес'],
        ];

        foreach ($stats as $index => [$value, $label]) {
            AuthorStat::query()->firstOrCreate(
                ['label' => $label],
                ['value' => $value, 'sort_order' => $index + 1, 'is_active' => true],
            );
        }

        Service::query()->firstOrCreate(
            ['title' => 'Системная сессия (онлайн-разбор)'],
            [
                'price' => 25000,
                'format' => 'Индивидуальная встреча в Zoom',
                'audience' => 'Для предпринимателей, лидеров и экспертов, упёршихся в потолок, операционку, кризис или выгорание.',
                'result' => 'За одну сессию выявляется корневой сбой в личной или финансовой системе и возвращается сила для быстрых изменений.',
                'sort_order' => 1,
                'is_active' => true,
            ],
        );

        Service::query()->firstOrCreate(
            ['title' => 'Системные расстановки (Бизнес & Масштаб)'],
            [
                'price' => 80000,
                'format' => 'Глубокая системная онлайн-работа в Zoom',
                'audience' => 'Для готовых к трансформации, расширению бизнеса и кратному росту дохода.',
                'result' => "Перестройка архитектуры взаимосвязей:\n- деньги;\n- масштаб;\n- род;\n- партнёры.\n\nУстранение деструктивных сценариев.",
                'sort_order' => 2,
                'is_active' => true,
            ],
        );

        $channels = [
            ['telegram', 'Telegram', '@elvira7710', 1],
            ['whatsapp', 'WhatsApp', '89884560555', 2],
            ['email', 'Email', 'goldenroe@mail.ru', 3],
            ['phone', 'Телефон', '89884560555', 4],
        ];

        foreach ($channels as [$key, $label, $value, $sort]) {
            ContactChannel::query()->firstOrCreate(
                ['key' => $key],
                ['label' => $label, 'value' => $value, 'sort_order' => $sort, 'is_public' => true],
            );
        }

        foreach (DocumentType::cases() as $type) {
            Document::query()->firstOrCreate(['type' => $type]);
        }

        Setting::query()->firstOrCreate(
            ['key' => 'reviews_enabled'],
            ['value' => false],
        );

        Setting::query()->firstOrCreate(
            ['key' => 'seo'],
            ['value' => [
                'home' => ['title' => 'Golden Roe', 'description' => null],
                'services' => ['title' => 'Услуги', 'description' => null],
                'author' => ['title' => 'Об авторе', 'description' => null],
                'articles' => ['title' => 'Статьи', 'description' => null],
                'reviews' => ['title' => 'Отзывы', 'description' => null],
                'contacts' => ['title' => 'Контакты', 'description' => null],
            ]],
        );
    }

    private function page(string $page, string $key, string $title, int $sort): void
    {
        PageContent::query()->firstOrCreate(
            ['page' => $page, 'key' => $key],
            ['title' => $title, 'sort_order' => $sort],
        );
    }
}

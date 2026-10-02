<?php

namespace Database\Seeders;

use App\Models\Banner;
use App\Models\PageContent;
use App\Models\Setting;
use App\Services\ImageProcessor;
use Illuminate\Database\Seeder;
use Illuminate\Http\UploadedFile;

class AuthorVisualSeeder extends Seeder
{
    public function run(): void
    {
        if (Setting::getValue('author_visual_v1') === true) {
            return;
        }

        $images = app(ImageProcessor::class);
        $banner = Banner::query()->where('page', 'author')->orderBy('sort_order')->first();

        if ($banner !== null && $banner->subtitle === null && $banner->text === null) {
            $heading = $banner->title;
            if ($heading === null || $heading === '' || $heading === 'Об авторе') {
                $heading = 'Жизнь как главный учитель системного видения';
            }
            $banner->title = 'Об авторе';
            $banner->subtitle = $heading;
            $banner->text = 'Я объединяю эстетику, духовное развитие, предпринимательство и реальный жизненный опыт, чтобы помогать людям создавать жизнь, в которой есть смысл, свобода и масштаб.';
        }

        if ($banner !== null && $banner->image === null) {
            $banner->image = $this->image($images, 'banner_about.png', 'Эльвира Вартанова');
        }

        $banner?->save();

        $this->fill('quote', [
            'eyebrow' => 'Эльвира Вартанова',
            'title' => '«Когда внутри порядок — реальность начинает работать на вас.»',
            'sort_order' => 10,
        ]);

        $this->fill('path', [
            'eyebrow' => 'Мой путь',
            'title' => 'Предприниматель. Мама. Творец. Человек, который верит в вас.',
            'body' => "Я прошла путь от мечты к реальным результатам — создала и развила бизнес в сфере красоты, собрала сильную команду, позже продала его и начала новый этап своей жизни.\n\nСегодня я помогаю предпринимателям, экспертам и лидерам увидеть свой потенциал, навести внутренний порядок и выстроить гармоничную систему во всех сферах жизни — в бизнесе, в семье, в самореализации и в душе.",
            'sort_order' => 11,
        ], 'image_portrait_black_white.png', 'Эльвира Вартанова');

        $this->fill('path.photo', [
            'sort_order' => 12,
        ], 'image_portrait_outdoor.png', 'Эльвира Вартанова');

        $this->fill('pillars', [
            'title' => 'Точки опоры',
            'sort_order' => 13,
        ]);

        $pillars = [
            'pillar.family' => ['Семья и близкие', 14],
            'pillar.spirit' => ['Духовное развитие', 15],
            'pillar.business' => ['Предпринимательство и стратегия', 16],
            'pillar.creativity' => ['Творчество и самовыражение', 17],
            'pillar.health' => ['Здоровье и энергия', 18],
            'pillar.beauty' => ['Эстетика во всём', 19],
        ];

        foreach ($pillars as $key => [$title, $sort]) {
            $this->fill($key, ['title' => $title, 'sort_order' => $sort]);
        }

        $this->fill('pillar.quote', [
            'body' => 'Для меня важно жить в согласии с собой, быть полезной, создавать красоту вокруг и вдохновлять других на большее.',
            'sort_order' => 20,
        ]);

        $this->fill('son', [], 'image_portrait_hands_over_eyes.png', 'Эльвира Вартанова');
        $this->fill('son.photo', [
            'sort_order' => 21,
        ], 'image_family_neutral.png', 'Эльвира Вартанова');

        $this->fill('guide', [
            'body' => "Я прошла через реальные вызовы, ошибки, трансформации и масштабные изменения. Мой опыт — это не только знания, но и прожитая жизнь. Я говорю с вами на языке реальности, понимаю ваши страхи и знаю, как превратить их в опору. Я не даю теорию — я даю то, что работает.",
        ]);

        $guide = [
            'guide.experience' => ['Реальный предпринимательский опыт', 22],
            'guide.person' => ['Глубокое понимание человека и его потенциала', 23],
            'guide.system' => ['Системный подход и индивидуальный взгляд', 24],
            'guide.care' => ['Честность, поддержка и бережность', 25],
            'guide.growth' => ['Постоянное развитие и живой пример', 26],
        ];

        foreach ($guide as $key => [$title, $sort]) {
            $this->fill($key, ['title' => $title, 'sort_order' => $sort]);
        }

        $this->fill('manifesto', [
            'eyebrow' => 'Мой манифест',
            'title' => 'Больше, чем успех — жизнь со смыслом',
            'body' => 'Я верю в гармоничное развитие человека — в единстве разума, души, тела и дела. Моя миссия — помогать вам находить свой путь, слышать себя и жить по-настоящему.',
            'sort_order' => 27,
        ], 'banner_manifest_sunset.png', 'Больше, чем успех — жизнь со смыслом');

        $this->fill('manifesto.quote', [
            'eyebrow' => 'Эльвира Вартанова',
            'title' => '«Красота начинается с внутренней гармонии, а вера в себя.»',
            'sort_order' => 28,
        ]);

        Setting::putValue('author_visual_v1', true);
    }

    /**
     * @param  array<string, mixed>  $copy
     */
    private function fill(string $key, array $copy, ?string $filename = null, ?string $alt = null): void
    {
        $block = PageContent::query()->where('page', 'author')->where('key', $key)->first();

        if ($block === null) {
            if ($filename !== null) {
                $copy['image'] = $this->image(app(ImageProcessor::class), $filename, $alt ?? '');
            }

            PageContent::query()->create(array_merge([
                'page' => 'author',
                'key' => $key,
                'sort_order' => 0,
            ], $copy));

            return;
        }

        foreach (['eyebrow', 'title', 'body'] as $field) {
            if (! array_key_exists($field, $copy)) {
                continue;
            }

            $current = $block->{$field};
            if ($current === null || trim((string) $current) === '') {
                $block->{$field} = $copy[$field];
            }
        }

        if ($filename !== null && $block->image === null) {
            $block->image = $this->image(app(ImageProcessor::class), $filename, $alt ?? ($block->title ?? ''));
        }

        $block->save();
    }

    /**
     * @return array{original: string, webp: array<string, string>, alt: string}
     */
    private function image(ImageProcessor $images, string $filename, string $alt): array
    {
        $path = __DIR__.'/assets/author/'.$filename;
        $file = new UploadedFile($path, $filename, 'image/png', null, true);
        $stored = $images->store($file);
        $stored['alt'] = $alt;

        return $stored;
    }
}

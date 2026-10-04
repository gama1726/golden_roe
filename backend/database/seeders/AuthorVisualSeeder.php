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
    private const VERSION_KEY = 'author_visual_v3';

    public function run(): void
    {
        if (Setting::getValue(self::VERSION_KEY) === true) {
            return;
        }

        $images = app(ImageProcessor::class);
        $banner = Banner::query()->where('page', 'author')->orderBy('sort_order')->first();

        if ($banner !== null) {
            $heading = $banner->subtitle;
            if ($heading === null || $heading === '' || $heading === 'Об авторе') {
                $heading = $banner->title;
            }
            if ($heading === null || $heading === '' || $heading === 'Об авторе') {
                $heading = 'Жизнь как главный учитель системного видения';
            }

            $banner->title = 'Об авторе';
            $banner->subtitle = $heading;
            $banner->text = 'Я объединяю эстетику, духовное развитие, предпринимательство и реальный жизненный опыт, чтобы помогать людям создавать жизнь, в которой есть смысл, свобода и масштаб.';

            if ($banner->image === null) {
                $banner->image = $this->image($images, 'banner_about.png', 'Эльвира Вартанова');
            }

            $banner->save();
        }

        $this->fill('quote', [
            'eyebrow' => 'Эльвира Вартанова',
            'title' => '«Когда внутри порядок — реальность начинает работать на вас.»',
            'sort_order' => 10,
        ], force: true);

        $this->fill('path', [
            'eyebrow' => 'Мой путь',
            'title' => 'Предприниматель. Мама. Творец. Человек, который верит в вас.',
            'body' => "Я прошла путь от мечты к реальным результатам — создала и развила бизнес в сфере красоты, собрала сильную команду, позже продала его и начала новый этап своей жизни.\n\nСегодня я помогаю предпринимателям, экспертам и лидерам увидеть свой потенциал, навести внутренний порядок и выстроить гармоничную систему во всех сферах жизни — в бизнесе, в семье, в самореализации и в душе.",
            'sort_order' => 11,
        ], 'image_portrait_black_white.png', 'Эльвира Вартанова', force: true);

        $this->fill('path.photo', [
            'eyebrow' => null,
            'title' => null,
            'body' => null,
            'sort_order' => 12,
        ], 'image_portrait_outdoor.png', 'Эльвира Вартанова', force: true);

        $this->fill('pillars', [
            'title' => 'Точки опоры',
            'sort_order' => 13,
        ], force: true);

        $pillars = [
            'pillar.family' => ['Семья и близкие', 14],
            'pillar.spirit' => ['Духовное развитие', 15],
            'pillar.business' => ['Предпринимательство и стратегия', 16],
            'pillar.creativity' => ['Творчество и самовыражение', 17],
            'pillar.health' => ['Здоровье и энергия', 18],
            'pillar.beauty' => ['Эстетика во всём', 19],
        ];

        foreach ($pillars as $key => [$title, $sort]) {
            $this->fill($key, ['title' => $title, 'sort_order' => $sort], force: true);
        }

        $this->fill('pillar.quote', [
            'body' => 'Для меня важно жить в согласии с собой, быть полезной, создавать красоту вокруг и вдохновлять других на большее.',
            'sort_order' => 20,
        ], force: true);

        $this->fill('son', [
            'eyebrow' => 'Мой сын — моя сила',
            'title' => 'Особенный сын — особая миссия',
            'body' => 'Материнство — значимая часть моей жизни и личного опыта. Отношения с детьми учат меня внимательности, ответственности, терпению и умению замечать действительно важное.',
            'sort_order' => 6,
        ], 'image_portrait_hands_over_eyes.png', 'Эльвира Вартанова', force: true);

        $this->fill('son.photo', [
            'sort_order' => 21,
        ], 'image_family_neutral.png', 'Эльвира Вартанова');

        $this->fill('son.quote', [
            'body' => 'Любить безоговорочно — значит видеть человека целиком.',
            'sort_order' => 22,
        ], force: true);

        $this->fill('guide', [
            'title' => 'Почему я имею право быть вашим проводником?',
            'body' => 'Я прошла через реальные вызовы, ошибки, трансформации и масштабные изменения. Мой опыт — это не только знания, но и прожитая жизнь. Я говорю с вами на языке реальности, понимаю ваши страхи и знаю, как превратить их в опору. Я не даю теорию — я делюсь тем, что работает.',
            'sort_order' => 5,
        ], force: true);

        $guide = [
            'guide.experience' => ['Реальный предпринимательский опыт', 23],
            'guide.person' => ['Глубокое понимание человека и его потенциала', 24],
            'guide.system' => ['Системный подход и индивидуальный взгляд', 25],
            'guide.care' => ['Честность, поддержка и бережность', 26],
            'guide.growth' => ['Постоянное развитие и живой пример', 27],
        ];

        foreach ($guide as $key => [$title, $sort]) {
            $this->fill($key, ['title' => $title, 'sort_order' => $sort], force: true);
        }

        $this->fill('manifesto', [
            'eyebrow' => 'Мой манифест',
            'title' => 'Больше, чем успех — жизнь со смыслом',
            'body' => 'Я верю в гармоничное развитие человека — в единстве разума, души, тела и дела. Моя миссия — помогать вам находить свой путь, слышать себя и жить по-настоящему.',
            'sort_order' => 28,
        ], 'banner_manifest_sunset.png', 'Больше, чем успех — жизнь со смыслом', force: true);

        $this->fill('manifesto.quote', [
            'eyebrow' => 'Эльвира Вартанова',
            'title' => '«Красота начинается с внутренней гармонии, а масштаб — с веры в себя.»',
            'sort_order' => 29,
        ], force: true);

        Setting::putValue(self::VERSION_KEY, true);
    }

    /**
     * @param  array<string, mixed>  $copy
     */
    private function fill(
        string $key,
        array $copy,
        ?string $filename = null,
        ?string $alt = null,
        bool $force = false,
    ): void {
        $block = PageContent::query()->where('page', 'author')->where('key', $key)->first();

        if ($block === null) {
            if ($filename !== null) {
                $image = $this->image(app(ImageProcessor::class), $filename, $alt ?? '');
                if ($image !== null) {
                    $copy['image'] = $image;
                }
            }

            PageContent::query()->create(array_merge([
                'page' => 'author',
                'key' => $key,
                'sort_order' => 0,
            ], $copy));

            return;
        }

        foreach (['eyebrow', 'title', 'body', 'sort_order'] as $field) {
            if (! array_key_exists($field, $copy)) {
                continue;
            }

            $current = $block->{$field};
            if ($force || $current === null || (is_string($current) && trim($current) === '')) {
                $block->{$field} = $copy[$field];
            }
        }

        if ($filename !== null && $block->image === null) {
            $image = $this->image(app(ImageProcessor::class), $filename, $alt ?? ($block->title ?? ''));
            if ($image !== null) {
                $block->image = $image;
            }
        }

        $block->save();
    }

    /**
     * @return array{original: string, webp: array<string, string>, alt: string}|null
     */
    private function image(ImageProcessor $images, string $filename, string $alt): ?array
    {
        $path = __DIR__.'/assets/author/'.$filename;

        if (! is_file($path)) {
            return null;
        }

        $file = new UploadedFile($path, $filename, 'image/png', null, true);
        $stored = $images->store($file);
        $stored['alt'] = $alt;

        return $stored;
    }
}

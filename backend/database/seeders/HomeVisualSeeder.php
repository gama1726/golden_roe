<?php

namespace Database\Seeders;

use App\Models\Banner;
use App\Models\PageContent;
use App\Models\Service;
use App\Models\Setting;
use App\Services\ImageProcessor;
use Illuminate\Database\Seeder;
use Illuminate\Http\UploadedFile;

class HomeVisualSeeder extends Seeder
{
    public function run(): void
    {
        if (Setting::getValue('home_visual_v1') === true) {
            return;
        }

        $images = app(ImageProcessor::class);

        $banner = Banner::query()->where('page', 'home')->orderBy('sort_order')->first();
        if ($banner !== null && $banner->image === null) {
            $banner->image = $this->image($images, 'benner_home.png', $banner->subtitle ?: 'Эльвира Вартанова');
            $banner->save();
        }

        $this->fillBlock('approach', [
            'eyebrow' => '«Когда внутри порядок — реальность начинает работать на вас.»',
            'body' => 'Я помогаю предпринимателям, экспертам и лидерам увидеть истинные причинно-следственные связи, выйти за пределы ограничений, выстроить гармоничную систему и создать жизнь, в которой есть место и бизнесу, и семье, и вдохновению.',
        ], 'image_about_portrait.png', 'Эльвира Вартанова');

        $results = PageContent::query()->where('page', 'home')->where('key', 'results')->first();
        if ($results !== null) {
            if ($results->title === 'Результаты клиентов за 6 лет практики' && ($results->eyebrow === null || $results->eyebrow === '')) {
                $results->eyebrow = 'Результаты клиентов за 6 лет практики';
                $results->title = 'Реальные изменения в жизни';
            }
            $results->save();
        }

        $this->fillBlock('choice', [
            'eyebrow' => 'Финальный акцент',
            'body' => 'Я не даю готовых решений. Я создаю пространство, в котором вы слышите себя и находите свой путь к масштабным изменениям.',
        ], 'banner_final_cta_sunset.png', 'Вы всегда выбираете сами');

        $labels = [
            'result.housing' => ['Новое жильё', 1],
            'result.income' => ['Рост доходов', 2],
            'result.businesses' => ['Новые бизнесы', 3],
            'result.family' => ['Гармоничная семья', 4],
            'result.health' => ['Здоровье и энергия', 5],
            'result.children' => ['Рождение детей', 6],
        ];
        $previous = [
            'result.housing' => 'жильё',
            'result.income' => 'рост доходов',
            'result.businesses' => 'новые бизнесы',
            'result.family' => 'семья',
            'result.health' => 'здоровье',
            'result.children' => 'рождение детей',
        ];
        foreach ($labels as $key => [$title, $sort]) {
            $item = PageContent::query()->where('page', 'home')->where('key', $key)->first();
            if ($item === null) {
                continue;
            }
            if ($item->title === $previous[$key]) {
                $item->title = $title;
            }
            $item->sort_order = $sort;
            $item->save();
        }

        $this->serviceImage($images, 'Системная сессия (онлайн-разбор)', 'image_service_01_armchair.png');
        $this->serviceImage($images, 'Системные расстановки (Бизнес & Масштаб)', 'image_service_02_mountain_terrace.png');

        Setting::putValue('home_visual_v1', true);
    }

    /**
     * @param  array{eyebrow?: string, body?: string}  $copy
     */
    private function fillBlock(string $key, array $copy, string $filename, string $alt): void
    {
        $block = PageContent::query()->where('page', 'home')->where('key', $key)->first();
        if ($block === null) {
            return;
        }

        if (($block->eyebrow === null || $block->eyebrow === '') && isset($copy['eyebrow'])) {
            $block->eyebrow = $copy['eyebrow'];
        }
        if (($block->body === null || trim($block->body) === '') && isset($copy['body'])) {
            $block->body = $copy['body'];
        }
        if ($block->image === null) {
            $block->image = $this->image(app(ImageProcessor::class), $filename, $alt);
        }
        $block->save();
    }

    private function serviceImage(ImageProcessor $images, string $title, string $filename): void
    {
        $service = Service::query()->where('title', $title)->first();
        if ($service === null || $service->image !== null) {
            return;
        }

        $service->image = $this->image($images, $filename, $title);
        $service->save();
    }

    /**
     * @return array{original: string, webp: array<string, string>, alt: string}
     */
    private function image(ImageProcessor $images, string $filename, string $alt): array
    {
        $path = __DIR__.'/assets/home/'.$filename;
        $file = new UploadedFile($path, $filename, 'image/png', null, true);
        $stored = $images->store($file);
        $stored['alt'] = $alt;

        return $stored;
    }
}

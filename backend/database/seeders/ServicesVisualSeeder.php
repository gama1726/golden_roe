<?php

namespace Database\Seeders;

use App\Models\Banner;
use App\Models\PageContent;
use App\Models\Service;
use App\Models\Setting;
use App\Services\ImageProcessor;
use Illuminate\Database\Seeder;
use Illuminate\Http\UploadedFile;

class ServicesVisualSeeder extends Seeder
{
    public function run(): void
    {
        if (Setting::getValue('services_visual_v1') === true) {
            return;
        }

        $images = app(ImageProcessor::class);
        $banner = Banner::query()->where('page', 'services')->orderBy('sort_order')->first();

        if ($banner !== null && $banner->subtitle === null && $banner->text === null) {
            if ($banner->title === null || $banner->title === '' || $banner->title === 'Услуги') {
                $banner->title = 'Эльвира Вартанова';
                $banner->subtitle = 'Услуги';
            }
            $banner->text = 'Глубокая трансформационная работа для вашей реальности, бизнеса и гармоничной жизни.';
        }

        if ($banner !== null && $banner->image === null) {
            $banner->image = $this->image($images, 'banner_service.png', 'Эльвира Вартанова');
        }

        $banner?->save();

        $this->ensure('quote', [
            'eyebrow' => 'Эльвира Вартанова',
            'title' => '«Когда внутри порядок — реальность начинает работать на вас.»',
            'sort_order' => 1,
        ]);

        $points = [
            'point.system' => ['Системный подход и глубокая экспертиза', 2],
            'point.individual' => ['Индивидуальные решения', 3],
            'point.trust' => ['Конфиденциальность и доверие', 4],
            'point.results' => ['Реальные изменения в жизни', 5],
        ];

        foreach ($points as $key => [$title, $sort]) {
            $this->ensure($key, [
                'title' => $title,
                'sort_order' => $sort,
            ]);
        }

        $this->ensure('cta', [
            'title' => 'Готовы к изменениям?',
            'body' => 'Запишитесь на консультацию, и мы вместе определим, какой формат работы будет максимально эффективен именно для вас.',
            'sort_order' => 6,
        ], 'banner_final_cta_sunset.png', 'Готовы к изменениям?');

        $this->serviceImage($images, 'Системная сессия (онлайн-разбор)', 'image_service_01_armchair.png');
        $this->serviceImage($images, 'Системные расстановки (Бизнес & Масштаб)', 'image_service_02_mountain_terrace.png');

        Setting::putValue('services_visual_v1', true);
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    private function ensure(string $key, array $attributes, ?string $filename = null, ?string $alt = null): void
    {
        $exists = PageContent::query()->where('page', 'services')->where('key', $key)->exists();
        if ($exists) {
            return;
        }

        if ($filename !== null) {
            $attributes['image'] = $this->image(app(ImageProcessor::class), $filename, $alt ?? '');
        }

        PageContent::query()->create(array_merge([
            'page' => 'services',
            'key' => $key,
        ], $attributes));
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
        $path = __DIR__.'/assets/services/'.$filename;
        $file = new UploadedFile($path, $filename, 'image/png', null, true);
        $stored = $images->store($file);
        $stored['alt'] = $alt;

        return $stored;
    }
}

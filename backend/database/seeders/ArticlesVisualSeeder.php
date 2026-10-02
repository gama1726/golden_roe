<?php

namespace Database\Seeders;

use App\Models\Banner;
use App\Models\PageContent;
use App\Models\Setting;
use App\Services\ImageProcessor;
use Illuminate\Database\Seeder;
use Illuminate\Http\UploadedFile;

class ArticlesVisualSeeder extends Seeder
{
    public function run(): void
    {
        if (Setting::getValue('articles_visual_v1') === true) {
            return;
        }

        $banner = Banner::query()->where('page', 'articles')->orderBy('sort_order')->first();

        if ($banner !== null && $banner->subtitle === null && $banner->text === null) {
            $heading = $banner->title;
            if ($heading === null || $heading === '' || $heading === 'Статьи') {
                $heading = 'Статьи';
            }
            $banner->title = 'Блог Golden Roe';
            $banner->subtitle = $heading;
            $banner->text = 'Глубокие мысли, практические инструменты и вдохновение для тех, кто выбирает осознанную, масштабную и наполненную жизнь.';
        }

        if ($banner !== null && $banner->image === null) {
            $banner->image = $this->image(app(ImageProcessor::class), 'Эльвира Вартанова');
        }

        $banner?->save();

        $quote = PageContent::query()->where('page', 'articles')->where('key', 'quote')->first();
        if ($quote === null) {
            PageContent::query()->create([
                'page' => 'articles',
                'key' => 'quote',
                'title' => 'Настоящие изменения начинаются с осознанности.',
                'sort_order' => 1,
            ]);
        }

        Setting::putValue('articles_visual_v1', true);
    }

    /**
     * @return array{original: string, webp: array<string, string>, alt: string}
     */
    private function image(ImageProcessor $images, string $alt): array
    {
        $path = __DIR__.'/assets/articles-page/banner_articles.png';
        $file = new UploadedFile($path, 'banner_articles.png', 'image/png', null, true);
        $stored = $images->store($file);
        $stored['alt'] = $alt;

        return $stored;
    }
}

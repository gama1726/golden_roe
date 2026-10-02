<?php

namespace Database\Seeders;

use App\Models\Banner;
use App\Models\PageContent;
use App\Models\Setting;
use App\Services\ImageProcessor;
use Illuminate\Database\Seeder;
use Illuminate\Http\UploadedFile;

class ReviewsVisualSeeder extends Seeder
{
    public function run(): void
    {
        if (Setting::getValue('reviews_visual_v1') === true) {
            return;
        }

        $banner = Banner::query()->where('page', 'reviews')->orderBy('sort_order')->first();

        if ($banner !== null && $banner->subtitle === null && $banner->text === null) {
            $heading = $banner->title;
            if ($heading === null || $heading === '' || $heading === 'Отзывы') {
                $heading = 'Отзывы';
            }
            $banner->title = 'Реальные люди. Реальные изменения';
            $banner->subtitle = $heading;
            $banner->text = 'Здесь — истории моих клиентов. Благодарю каждого за доверие, открытость и готовность делиться своими результатами.';
        }

        if ($banner !== null && $banner->image === null) {
            $banner->image = $this->image(app(ImageProcessor::class), 'banner_reviews.png', 'Эльвира Вартанова');
        }

        $banner?->save();

        $this->fill('quote', [
            'eyebrow' => 'Эльвира Вартанова',
            'title' => '«Ваши слова вдохновляют меня двигаться дальше»',
            'sort_order' => 1,
        ]);

        $this->fill('intro', [
            'eyebrow' => 'Истории, которые вдохновляют',
            'title' => 'Отзывы клиентов',
            'body' => 'Каждый отзыв — это не просто слова. Это путь, изменения и новые возможности. Спасибо, что делитесь своей историей.',
            'sort_order' => 2,
        ]);

        $this->fill('cta', [
            'eyebrow' => 'Ваша история тоже важна',
            'title' => 'Оставить отзыв',
            'body' => 'Если вы уже работали со мной — поделитесь своими впечатлениями. Ваш опыт может вдохновить других.',
            'sort_order' => 3,
        ], 'banner_cta_sunset.png', 'Оставить отзыв');

        $this->fill('cta.note', [
            'body' => 'Все отзывы проходят модерацию и публикуются после проверки, чтобы сохранить доверительную и уважительную атмосферу.',
            'sort_order' => 4,
        ]);

        Setting::putValue('reviews_visual_v1', true);
    }

    /**
     * @param  array<string, mixed>  $copy
     */
    private function fill(string $key, array $copy, ?string $filename = null, ?string $alt = null): void
    {
        $block = PageContent::query()->where('page', 'reviews')->where('key', $key)->first();

        if ($block === null) {
            if ($filename !== null) {
                $copy['image'] = $this->image(app(ImageProcessor::class), $filename, $alt ?? '');
            }

            PageContent::query()->create(array_merge([
                'page' => 'reviews',
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
        $path = __DIR__.'/assets/reviews/'.$filename;
        $file = new UploadedFile($path, $filename, 'image/png', null, true);
        $stored = $images->store($file);
        $stored['alt'] = $alt;

        return $stored;
    }
}

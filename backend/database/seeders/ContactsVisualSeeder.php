<?php

namespace Database\Seeders;

use App\Models\Banner;
use App\Models\PageContent;
use App\Models\Setting;
use App\Services\ImageProcessor;
use Illuminate\Database\Seeder;
use Illuminate\Http\UploadedFile;

class ContactsVisualSeeder extends Seeder
{
    public function run(): void
    {
        if (Setting::getValue('contacts_visual_v1') === true) {
            return;
        }

        $banner = Banner::query()->where('page', 'contacts')->orderBy('sort_order')->first();

        if ($banner !== null && $banner->subtitle === null && $banner->text === null) {
            $heading = $banner->title;
            if ($heading === null || $heading === '' || $heading === 'Контакты') {
                $heading = 'Контакты';
            }
            $banner->title = 'Контакты';
            $banner->subtitle = $heading;
            $banner->text = 'Если у вас есть вопросы, предложения или вы хотите записаться на консультацию — свяжитесь со мной удобным способом. Я всегда на связи.';
        }

        if ($banner !== null && $banner->image === null) {
            $banner->image = $this->image(app(ImageProcessor::class), 'banner_contacts.png', 'Эльвира Вартанова');
        }

        $banner?->save();

        $this->fill('greeting', [
            'title' => 'Буду рада вашему обращению',
            'sort_order' => 1,
        ]);

        $this->fill('reach', [
            'title' => 'Свяжитесь со мной',
            'body' => 'Вы можете написать мне в мессенджеры, позвонить или отправить письмо. Я лично отвечаю на все сообщения и помогаю подобрать удобный формат работы именно для вас.',
            'sort_order' => 2,
        ]);

        $this->fill('promise', [
            'title' => 'Удобный способ связи — первый шаг к вашим реальным изменениям.',
            'sort_order' => 3,
        ]);

        $this->fill('point.reply', [
            'title' => 'Быстро отвечаю',
            'body' => 'Обычно отвечаю в течение нескольких часов',
            'sort_order' => 4,
        ]);

        $this->fill('point.booking', [
            'title' => 'Удобная запись',
            'body' => 'Помогу подобрать удобное время для консультации',
            'sort_order' => 5,
        ]);

        $this->fill('point.personal', [
            'title' => 'Индивидуальный подход',
            'body' => 'Обсудим ваш запрос и подберем формат работы',
            'sort_order' => 6,
        ]);

        $this->fill('point.privacy', [
            'title' => 'Конфиденциальность',
            'body' => 'Все обращения остаются строго между нами',
            'sort_order' => 7,
        ]);

        $this->fill('scene', [
            'sort_order' => 8,
        ], 'contacts_deer_interior.png', 'Золотой олень');

        $this->fill('consult', [
            'title' => 'Записаться на консультацию',
            'body' => 'Выберите удобный для вас мессенджер и напишите мне — я с удовольствием отвечу на все ваши вопросы и предложу лучшее решение.',
            'sort_order' => 9,
        ]);

        Setting::putValue('contacts_visual_v1', true);
    }

    /**
     * @param  array<string, mixed>  $copy
     */
    private function fill(string $key, array $copy, ?string $filename = null, ?string $alt = null): void
    {
        $block = PageContent::query()->where('page', 'contacts')->where('key', $key)->first();

        if ($block === null) {
            if ($filename !== null) {
                $copy['image'] = $this->image(app(ImageProcessor::class), $filename, $alt ?? '');
            }

            PageContent::query()->create(array_merge([
                'page' => 'contacts',
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
        $path = __DIR__.'/assets/contacts/'.$filename;
        $file = new UploadedFile($path, $filename, 'image/png', null, true);
        $stored = $images->store($file);
        $stored['alt'] = $alt;

        return $stored;
    }
}

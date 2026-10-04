<?php

namespace Tests\Unit;

use App\Models\Setting;
use App\Services\SeoSettings;
use App\Support\SeoDefaults;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SeoSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_falls_back_to_branded_defaults_when_seo_is_empty(): void
    {
        $seo = app(SeoSettings::class)->forPage('home');
        $defaults = SeoDefaults::pages()['home'];

        $this->assertSame($defaults['title'], $seo['title']);
        $this->assertSame($defaults['description'], $seo['description']);
        $this->assertStringContainsString('Эльвира Вартанова', (string) $seo['title']);
        $this->assertStringContainsString('Golden Roe', (string) $seo['title']);
    }

    public function test_it_prefers_saved_seo_over_defaults(): void
    {
        Setting::putValue('seo', [
            'author' => [
                'title' => 'Кастомный заголовок',
                'description' => 'Кастомное описание',
            ],
        ]);

        $seo = app(SeoSettings::class)->forPage('author');

        $this->assertSame('Кастомный заголовок', $seo['title']);
        $this->assertSame('Кастомное описание', $seo['description']);
    }
}

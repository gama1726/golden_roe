<?php

namespace Tests\Unit;

use App\Services\ContactLinker;
use App\Services\HtmlSanitizer;
use App\Support\Slugger;
use Tests\TestCase;

class SupportTest extends TestCase
{
    public function test_slugger_transliterates_russian_titles(): void
    {
        $this->assertSame('zhizn-kak-uchitel', Slugger::fromTitle('Жизнь как учитель'));
    }

    public function test_sanitizer_removes_event_handlers_and_scripts(): void
    {
        $clean = app(HtmlSanitizer::class)->clean('<p onclick="evil()">Ок</p><script>alert(1)</script>');

        $this->assertStringNotContainsString('onclick', $clean);
        $this->assertStringNotContainsString('script', $clean);
        $this->assertStringContainsString('Ок', $clean);
    }

    public function test_contact_linker_builds_messenger_urls(): void
    {
        $linker = app(ContactLinker::class);

        $this->assertSame('https://wa.me/79884560555', $linker->build('whatsapp', '89884560555')['url']);
        $this->assertSame('https://t.me/elvira7710', $linker->build('telegram', '@elvira7710')['url']);
    }
}

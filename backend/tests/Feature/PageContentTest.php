<?php

namespace Tests\Feature;

use App\Models\Banner;
use App\Models\PageContent;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PageContentTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_update_banner_and_page_block_without_replacing_the_image(): void
    {
        $this->actingAs(User::factory()->create());

        $banner = Banner::query()->create([
            'page' => 'home',
            'sort_order' => 1,
            'title' => 'Старый заголовок',
            'subtitle' => null,
            'text' => null,
        ]);

        $this->patchJson("/api/v1/admin/banners/{$banner->id}", [
            'title' => 'Новый заголовок',
            'subtitle' => 'Подзаголовок',
            'text' => 'Текст баннера',
        ])->assertOk()
            ->assertJsonPath('data.title', 'Новый заголовок');

        $block = PageContent::query()->create([
            'page' => 'home',
            'key' => 'approach',
            'title' => 'Подход',
            'body' => null,
            'sort_order' => 1,
        ]);

        $this->patchJson("/api/v1/admin/page-contents/{$block->id}", [
            'eyebrow' => null,
            'title' => 'Подход',
            'body' => 'Текст блока',
        ])->assertOk()
            ->assertJsonPath('data.body', 'Текст блока');

        $this->assertSame('Текст блока', $block->refresh()->body);
        $this->assertNull($block->image);

        $this->getJson('/api/v1/home')
            ->assertOk()
            ->assertJsonPath('data.blocks.approach.body', 'Текст блока')
            ->assertJsonPath('data.banner.title', 'Новый заголовок');
    }
}

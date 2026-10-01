<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ArticleTest extends TestCase
{
    use RefreshDatabase;

    public function test_draft_is_hidden_and_html_is_sanitized(): void
    {
        $this->actingAs(User::factory()->create());

        $created = $this->postJson('/api/v1/admin/articles', [
            'title' => 'Системное мышление',
            'content' => '<p>Текст</p><script>alert(1)</script>',
            'is_published' => false,
        ])->assertCreated();

        $created->assertJsonPath('data.slug', 'sistemnoe-myshlenie');
        $this->assertStringNotContainsString('<script>', $created->json('data.content'));
        $this->assertStringContainsString('<p>Текст</p>', $created->json('data.content'));

        $this->getJson('/api/v1/articles/sistemnoe-myshlenie')->assertNotFound();

        $article = Article::query()->firstOrFail();
        $article->update(['is_published' => true, 'published_at' => now()]);

        $this->getJson('/api/v1/articles/sistemnoe-myshlenie')
            ->assertOk()
            ->assertJsonPath('data.article.title', 'Системное мышление');
    }

    public function test_public_list_loads_six_items_per_page(): void
    {
        foreach (range(1, 8) as $index) {
            Article::query()->create([
                'slug' => 'article-'.$index,
                'title' => 'Статья '.$index,
                'content' => '<p>'.$index.'</p>',
                'is_published' => true,
                'published_at' => now()->subMinutes($index),
            ]);
        }

        $this->getJson('/api/v1/articles')
            ->assertOk()
            ->assertJsonCount(6, 'data')
            ->assertJsonPath('meta.total', 8)
            ->assertJsonPath('meta.per_page', 6);

        $this->getJson('/api/v1/articles?page=2')
            ->assertOk()
            ->assertJsonCount(2, 'data');
    }
}

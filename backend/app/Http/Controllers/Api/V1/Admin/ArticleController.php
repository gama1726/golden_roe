<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ArticleRequest;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use App\Services\HtmlSanitizer;
use App\Services\ImageProcessor;
use App\Support\Slugger;
use Illuminate\Http\JsonResponse;

class ArticleController extends Controller
{
    public function index(): JsonResponse
    {
        $this->authorize('viewAny', Article::class);

        $articles = Article::query()->latest('id')->paginate(20);

        return ArticleResource::collection($articles)->response();
    }

    public function store(ArticleRequest $request, HtmlSanitizer $sanitizer, ImageProcessor $images): JsonResponse
    {
        $this->authorize('create', Article::class);

        $published = $request->boolean('is_published');
        $source = filled($request->input('slug')) ? (string) $request->input('slug') : $request->string('title')->toString();

        $article = Article::query()->create([
            'title' => $request->string('title')->toString(),
            'slug' => Slugger::unique($source),
            'excerpt' => $request->input('excerpt'),
            'content' => $sanitizer->clean($request->string('content')->toString()),
            'is_published' => $published,
            'published_at' => $published ? now() : null,
            'image' => $images->sync(null, $request->input('image')),
        ]);

        return response()->json([
            'data' => (new ArticleResource($article))->resolve(),
        ], 201);
    }

    public function show(Article $article): JsonResponse
    {
        $this->authorize('view', $article);

        return response()->json([
            'data' => (new ArticleResource($article))->resolve(),
        ]);
    }

    public function update(ArticleRequest $request, Article $article, HtmlSanitizer $sanitizer, ImageProcessor $images): JsonResponse
    {
        $this->authorize('update', $article);

        $data = [];

        if ($request->exists('title')) {
            $data['title'] = $request->string('title')->toString();
        }

        if ($request->exists('slug')) {
            $source = filled($request->input('slug')) ? (string) $request->input('slug') : ($data['title'] ?? $article->title);
            $data['slug'] = Slugger::unique($source, $article->id);
        }

        if ($request->exists('excerpt')) {
            $data['excerpt'] = $request->input('excerpt');
        }

        if ($request->exists('content')) {
            $data['content'] = $sanitizer->clean($request->string('content')->toString());
        }

        if ($request->exists('is_published')) {
            $published = $request->boolean('is_published');
            $data['is_published'] = $published;
            $data['published_at'] = $published ? ($article->published_at ?? now()) : null;
        }

        if ($request->exists('image')) {
            $data['image'] = $images->sync($article->image, $request->input('image'));
        }

        $article->update($data);

        return response()->json([
            'data' => (new ArticleResource($article->refresh()))->resolve(),
        ]);
    }

    public function destroy(Article $article, ImageProcessor $images): JsonResponse
    {
        $this->authorize('delete', $article);
        $images->delete($article->image);
        $article->delete();

        return response()->json(['message' => 'Deleted.']);
    }
}

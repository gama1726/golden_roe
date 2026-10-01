<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PageContentRequest;
use App\Http\Resources\PageContentResource;
use App\Models\PageContent;
use App\Services\ImageProcessor;
use App\Support\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PageContentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', PageContent::class);

        $contents = PageContent::query()
            ->when($request->filled('page'), fn ($query) => $query->where('page', $request->string('page')->toString()))
            ->orderBy('page')
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'data' => PageContentResource::collection($contents)->resolve(),
        ]);
    }

    public function store(PageContentRequest $request, ImageProcessor $images): JsonResponse
    {
        $this->authorize('create', PageContent::class);

        $content = PageContent::query()->create([
            ...$request->safe()->except(['image']),
            'image' => $request->exists('image') ? $images->sync(null, Media::payload($request->input('image'))) : null,
        ]);

        return response()->json(['data' => (new PageContentResource($content))->resolve()], 201);
    }

    public function update(PageContentRequest $request, PageContent $pageContent, ImageProcessor $images): JsonResponse
    {
        $this->authorize('update', $pageContent);

        $data = $request->safe()->except(['image']);
        if ($request->exists('image')) {
            $data['image'] = $images->sync($pageContent->image, Media::payload($request->input('image')));
        }

        $pageContent->update($data);

        return response()->json(['data' => (new PageContentResource($pageContent->refresh()))->resolve()]);
    }

    public function destroy(PageContent $pageContent, ImageProcessor $images): JsonResponse
    {
        $this->authorize('delete', $pageContent);
        $images->delete($pageContent->image);
        $pageContent->delete();

        return response()->json(['message' => 'Deleted.']);
    }
}

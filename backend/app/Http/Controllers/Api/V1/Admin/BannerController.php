<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\BannerRequest;
use App\Http\Resources\BannerResource;
use App\Models\Banner;
use App\Services\ImageProcessor;
use App\Support\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BannerController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Banner::class);

        $banners = Banner::query()
            ->when($request->filled('page'), fn ($query) => $query->where('page', $request->string('page')->toString()))
            ->orderBy('page')
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'data' => BannerResource::collection($banners)->resolve(),
        ]);
    }

    public function store(BannerRequest $request, ImageProcessor $images): JsonResponse
    {
        $this->authorize('create', Banner::class);

        $banner = Banner::query()->create([
            ...$request->safe()->except(['image']),
            'sort_order' => $request->integer('sort_order') ?: 1,
            'image' => $images->sync(null, $request->exists('image') ? Media::payload($request->input('image')) : null),
        ]);

        return response()->json(['data' => (new BannerResource($banner))->resolve()], 201);
    }

    public function update(BannerRequest $request, Banner $banner, ImageProcessor $images): JsonResponse
    {
        $this->authorize('update', $banner);

        $data = $request->safe()->except(['image'])->all();
        if ($request->exists('image')) {
            $data['image'] = $images->sync($banner->image, Media::payload($request->input('image')));
        }

        $banner->update($data);

        return response()->json(['data' => (new BannerResource($banner->refresh()))->resolve()]);
    }

    public function destroy(Banner $banner, ImageProcessor $images): JsonResponse
    {
        $this->authorize('delete', $banner);
        $images->delete($banner->image);
        $banner->delete();

        return response()->json(['message' => 'Deleted.']);
    }
}

<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReorderRequest;
use App\Http\Requests\Admin\ServiceRequest;
use App\Http\Resources\ServiceResource;
use App\Models\Service;
use App\Services\ImageProcessor;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class ServiceController extends Controller
{
    public function index(): JsonResponse
    {
        $this->authorize('viewAny', Service::class);

        $services = Service::query()->orderBy('sort_order')->orderBy('id')->get();

        return response()->json([
            'data' => ServiceResource::collection($services)->resolve(),
        ]);
    }

    public function store(ServiceRequest $request): JsonResponse
    {
        $this->authorize('create', Service::class);

        $data = $request->safe()->except(['image']);
        $data['sort_order'] ??= ((int) Service::query()->max('sort_order')) + 1;
        $data['is_active'] ??= true;
        if ($request->exists('image')) {
            $data['image'] = app(ImageProcessor::class)->sync(null, $request->input('image'));
        }

        $service = Service::query()->create($data);

        return response()->json([
            'data' => (new ServiceResource($service))->resolve(),
        ], 201);
    }

    public function show(Service $service): JsonResponse
    {
        $this->authorize('view', $service);

        return response()->json([
            'data' => (new ServiceResource($service))->resolve(),
        ]);
    }

    public function update(ServiceRequest $request, Service $service): JsonResponse
    {
        $this->authorize('update', $service);
        $data = $request->safe()->except(['image']);
        if ($request->exists('image')) {
            $data['image'] = app(ImageProcessor::class)->sync($service->image, $request->input('image'));
        }
        $service->update($data);

        return response()->json([
            'data' => (new ServiceResource($service->refresh()))->resolve(),
        ]);
    }

    public function destroy(Service $service): JsonResponse
    {
        $this->authorize('delete', $service);
        app(ImageProcessor::class)->delete($service->image);
        $service->delete();

        return response()->json(['message' => 'Deleted.']);
    }

    public function reorder(ReorderRequest $request): JsonResponse
    {
        $this->authorize('update', Service::query()->first() ?? new Service);

        $ids = $request->validated('ids');

        DB::transaction(function () use ($ids): void {
            foreach ($ids as $index => $id) {
                Service::query()->whereKey($id)->update(['sort_order' => $index + 1]);
            }
        });

        return response()->json(['message' => 'Reordered.']);
    }
}

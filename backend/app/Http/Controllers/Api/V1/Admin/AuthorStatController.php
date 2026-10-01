<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AuthorStatRequest;
use App\Http\Resources\AuthorStatResource;
use App\Models\AuthorStat;
use Illuminate\Http\JsonResponse;

class AuthorStatController extends Controller
{
    public function index(): JsonResponse
    {
        $this->authorize('viewAny', AuthorStat::class);

        return response()->json([
            'data' => AuthorStatResource::collection(
                AuthorStat::query()->orderBy('sort_order')->get()
            )->resolve(),
        ]);
    }

    public function store(AuthorStatRequest $request): JsonResponse
    {
        $this->authorize('create', AuthorStat::class);
        $stat = AuthorStat::query()->create($request->validated());

        return response()->json(['data' => (new AuthorStatResource($stat))->resolve()], 201);
    }

    public function update(AuthorStatRequest $request, AuthorStat $authorStat): JsonResponse
    {
        $this->authorize('update', $authorStat);
        $authorStat->update($request->validated());

        return response()->json(['data' => (new AuthorStatResource($authorStat->refresh()))->resolve()]);
    }

    public function destroy(AuthorStat $authorStat): JsonResponse
    {
        $this->authorize('delete', $authorStat);
        $authorStat->delete();

        return response()->json(['message' => 'Deleted.']);
    }
}

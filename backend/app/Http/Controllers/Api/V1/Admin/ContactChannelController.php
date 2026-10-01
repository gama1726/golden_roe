<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ContactChannelRequest;
use App\Models\ContactChannel;
use App\Services\ContactLinker;
use Illuminate\Http\JsonResponse;

class ContactChannelController extends Controller
{
    public function index(ContactLinker $linker): JsonResponse
    {
        $this->authorize('viewAny', ContactChannel::class);

        $channels = ContactChannel::query()->orderBy('sort_order')->get();

        return response()->json([
            'data' => $channels->map(fn (ContactChannel $channel): array => [
                ...$linker->present($channel),
                'value' => $channel->value,
                'url_override' => $channel->url,
                'is_public' => $channel->is_public,
            ])->values()->all(),
        ]);
    }

    public function store(ContactChannelRequest $request, ContactLinker $linker): JsonResponse
    {
        $this->authorize('create', ContactChannel::class);
        $channel = ContactChannel::query()->create($request->validated());

        return response()->json(['data' => $linker->present($channel)], 201);
    }

    public function update(ContactChannelRequest $request, ContactChannel $contactChannel, ContactLinker $linker): JsonResponse
    {
        $this->authorize('update', $contactChannel);
        $contactChannel->update($request->validated());

        return response()->json(['data' => $linker->present($contactChannel->refresh())]);
    }

    public function destroy(ContactChannel $contactChannel): JsonResponse
    {
        $this->authorize('delete', $contactChannel);
        $contactChannel->delete();

        return response()->json(['message' => 'Deleted.']);
    }
}

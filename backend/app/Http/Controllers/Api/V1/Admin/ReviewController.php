<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Enums\ReviewStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReviewImageRequest;
use App\Http\Resources\ReviewAdminResource;
use App\Models\Review;
use App\Services\ImageProcessor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Review::class);

        $reviews = Review::query()
            ->when($request->string('status')->toString() !== '', function ($query) use ($request) {
                $status = ReviewStatus::tryFrom($request->string('status')->toString());
                if ($status instanceof ReviewStatus) {
                    $query->where('status', $status);
                }
            })
            ->latest()
            ->paginate(20);

        return ReviewAdminResource::collection($reviews)
            ->additional([
                'pending_count' => Review::query()->pending()->count(),
            ])
            ->response();
    }

    public function approve(Review $review): JsonResponse
    {
        $this->authorize('update', $review);
        $review->update(['status' => ReviewStatus::Approved]);

        return response()->json([
            'data' => (new ReviewAdminResource($review->refresh()))->resolve(),
        ]);
    }

    public function pending(Review $review): JsonResponse
    {
        $this->authorize('update', $review);
        $review->update(['status' => ReviewStatus::Pending]);

        return response()->json([
            'data' => (new ReviewAdminResource($review->refresh()))->resolve(),
        ]);
    }

    public function destroy(Review $review, ImageProcessor $images): JsonResponse
    {
        $this->authorize('delete', $review);
        $images->delete($review->image);
        $review->delete();

        return response()->json(['message' => 'Deleted.']);
    }

    public function image(ReviewImageRequest $request, Review $review, ImageProcessor $images): JsonResponse
    {
        $this->authorize('update', $review);
        $stored = $images->store($request->file('image'));
        $review->update([
            'image' => $images->sync($review->image, $stored),
        ]);

        return response()->json([
            'data' => (new ReviewAdminResource($review->refresh()))->resolve(),
        ]);
    }
}

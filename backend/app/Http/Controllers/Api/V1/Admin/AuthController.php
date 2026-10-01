<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\LoginRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(LoginRequest $request): JsonResponse
    {
        $key = mb_strtolower($request->string('email')->toString()).'|'.$request->ip();

        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);

            throw ValidationException::withMessages([
                'email' => "Слишком много попыток. Повторите через {$seconds} секунд.",
            ])->status(429);
        }

        if (! Auth::attempt($request->only('email', 'password'), true)) {
            RateLimiter::hit($key, 60);

            throw ValidationException::withMessages([
                'email' => 'Неверный email или пароль.',
            ]);
        }

        $user = $request->user();
        if (! $user instanceof User || ! $user->isAdmin()) {
            Auth::logout();
            $this->invalidateSession($request);
            abort(403, 'Forbidden.');
        }

        RateLimiter::clear($key);

        if ($request->hasSession()) {
            $request->session()->regenerate();
        }

        return response()->json([
            'data' => (new UserResource($user))->resolve(),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();
        $this->invalidateSession($request);

        return response()->json(['message' => 'Logged out.']);
    }

    private function invalidateSession(Request $request): void
    {
        if (! $request->hasSession()) {
            return;
        }

        $request->session()->invalidate();
        $request->session()->regenerateToken();
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'data' => (new UserResource($request->user()))->resolve(),
        ]);
    }
}

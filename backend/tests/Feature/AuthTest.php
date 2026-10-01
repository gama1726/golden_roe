<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Testing\TestResponse;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    private function fromAdmin(): static
    {
        return $this->withCredentials()
            ->withHeader('Origin', 'http://localhost:5173')
            ->withHeader('Referer', 'http://localhost:5173/');
    }

    private function withAuthCookies(TestResponse $response): static
    {
        $sessionName = (string) config('session.cookie');
        $session = $response->getCookie($sessionName);
        $xsrf = $response->getCookie('XSRF-TOKEN', decrypt: false);

        return $this->fromAdmin()
            ->withCookie($sessionName, (string) $session?->getValue())
            ->withUnencryptedCookie('XSRF-TOKEN', (string) $xsrf?->getValue())
            ->withHeader('X-XSRF-TOKEN', urldecode((string) $xsrf?->getValue()));
    }

    public function test_guest_cannot_open_admin_dashboard(): void
    {
        $this->getJson('/api/v1/admin/me')->assertUnauthorized();
    }

    public function test_admin_can_log_in_and_log_out(): void
    {
        $admin = User::factory()->create([
            'email' => 'admin@goldenroe.local',
            'password' => 'secret-pass',
        ]);

        $login = $this->fromAdmin()->withSession(['_token' => 'csrf-token'])->postJson('/api/v1/admin/login', [
            'email' => $admin->email,
            'password' => 'secret-pass',
        ], ['X-CSRF-TOKEN' => 'csrf-token'])->assertOk();

        $login->assertJsonPath('data.email', $admin->email);

        $this->app['auth']->forgetGuards();
        $this->withAuthCookies($login)->getJson('/api/v1/admin/me')
            ->assertOk()
            ->assertJsonPath('data.email', $admin->email);

        $this->app['auth']->forgetGuards();
        $this->withAuthCookies($login)->postJson('/api/v1/admin/logout')
            ->assertOk()
            ->assertJsonPath('message', 'Logged out.');

        $this->assertGuest('web');
        $this->app['auth']->forgetGuards();
        $this->withAuthCookies($login)->getJson('/api/v1/admin/me')->assertUnauthorized();
    }

    public function test_login_rejects_a_wrong_password(): void
    {
        $admin = User::factory()->create(['email' => 'admin@goldenroe.local']);

        $this->postJson('/api/v1/admin/login', [
            'email' => $admin->email,
            'password' => 'wrong-password',
        ])->assertUnprocessable();
    }

    public function test_login_is_rate_limited(): void
    {
        $admin = User::factory()->create(['email' => 'admin@goldenroe.local']);
        RateLimiter::clear('admin@goldenroe.local|127.0.0.1');

        for ($attempt = 0; $attempt < 5; $attempt++) {
            $this->postJson('/api/v1/admin/login', [
                'email' => $admin->email,
                'password' => 'wrong-password',
            ])->assertUnprocessable();
        }

        $this->postJson('/api/v1/admin/login', [
            'email' => $admin->email,
            'password' => 'wrong-password',
        ])->assertStatus(429);
    }
}

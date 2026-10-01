<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('banners', function (Blueprint $table) {
            $table->id();
            $table->string('page');
            $table->unsignedInteger('sort_order')->default(1);
            $table->json('image')->nullable();
            $table->string('title')->nullable();
            $table->string('subtitle')->nullable();
            $table->text('text')->nullable();
            $table->timestamps();

            $table->index(['page', 'sort_order']);
        });

        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->unsignedInteger('price');
            $table->string('format');
            $table->text('audience');
            $table->text('result');
            $table->unsignedInteger('sort_order')->default(1);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['is_active', 'sort_order']);
        });

        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->json('image')->nullable();
            $table->string('title');
            $table->text('excerpt')->nullable();
            $table->longText('content');
            $table->boolean('is_published')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();

            $table->index(['is_published', 'published_at']);
        });

        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('phone');
            $table->string('email');
            $table->foreignId('service_id')->nullable()->constrained('services')->nullOnDelete();
            $table->string('service_title_snapshot')->nullable();
            $table->unsignedTinyInteger('rating');
            $table->string('title');
            $table->text('text');
            $table->json('image')->nullable();
            $table->string('status')->default('pending');
            $table->boolean('consent')->default(false);
            $table->timestamps();

            $table->index('status');
        });

        Schema::create('contact_channels', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->string('label');
            $table->string('value');
            $table->string('url')->nullable();
            $table->unsignedInteger('sort_order')->default(1);
            $table->boolean('is_public')->default(true);
            $table->timestamps();
        });

        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('type')->unique();
            $table->string('file')->nullable();
            $table->string('original_name')->nullable();
            $table->timestamps();
        });

        Schema::create('page_contents', function (Blueprint $table) {
            $table->id();
            $table->string('page');
            $table->string('key');
            $table->string('eyebrow')->nullable();
            $table->string('title')->nullable();
            $table->text('body')->nullable();
            $table->json('image')->nullable();
            $table->unsignedInteger('sort_order')->default(1);
            $table->timestamps();

            $table->unique(['page', 'key']);
        });

        Schema::create('author_stats', function (Blueprint $table) {
            $table->id();
            $table->string('value')->nullable();
            $table->string('label');
            $table->unsignedInteger('sort_order')->default(1);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->json('value')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
        Schema::dropIfExists('author_stats');
        Schema::dropIfExists('page_contents');
        Schema::dropIfExists('documents');
        Schema::dropIfExists('contact_channels');
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('articles');
        Schema::dropIfExists('services');
        Schema::dropIfExists('banners');
    }
};

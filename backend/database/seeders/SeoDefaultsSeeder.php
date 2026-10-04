<?php

namespace Database\Seeders;

use App\Models\Setting;
use App\Support\SeoDefaults;
use Illuminate\Database\Seeder;

class SeoDefaultsSeeder extends Seeder
{
    private const VERSION_KEY = 'seo_defaults_v1';

    public function run(): void
    {
        if (Setting::getValue(self::VERSION_KEY)) {
            return;
        }

        Setting::putValue('seo', SeoDefaults::pages());
        Setting::putValue(self::VERSION_KEY, true);
    }
}

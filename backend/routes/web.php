<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'name' => 'Golden Roe API',
        'version' => 'v1',
    ]);
});

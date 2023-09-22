<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class LodataServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        \Lodata::discover(\App\Models\Flights::class);
    }
}

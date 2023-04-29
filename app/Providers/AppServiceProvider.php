<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        $this->fioriSetup();
    }

    private function fioriSetup()
    {
        $fioriCfgPath = config_path('fiori.php');
        if (!is_file($fioriCfgPath)) return;

        $cfg = require($fioriCfgPath);
        if (!is_object($cfg) || !method_exists($cfg, 'setup')) return;

        $cfg->setup();
    }
}

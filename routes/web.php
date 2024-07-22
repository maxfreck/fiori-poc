<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return redirect()
        ->route('ui5', ['app' => 'launchpad', 'path' => 'index.html']);
});


Route::get('/ui5/{app}/{path?}', App\Fiori\Http\Controllers\ServeUI5::class)
    ->where('path', '.+')
    ->name('ui5');
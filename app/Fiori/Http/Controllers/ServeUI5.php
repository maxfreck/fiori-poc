<?php

namespace App\Fiori\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use GuzzleHttp\Psr7\MimeType;

class ServeUI5 extends \App\Http\Controllers\Controller
{
	/**
	 * Show the application dashboard.
	 *
	 * @return \Illuminate\Contracts\Support\Renderable
	 */
	public function __invoke($app, $path = '')
	{
		$clearPath = str_replace(['../'], '', $path);
		$clearApp = str_replace(['../'], '', $app);

		$resource = storage_path( "ui5/" . $clearApp . '/' . ($clearPath === '' ? 'index.html' : $clearPath ) );

		if (!File::exists($resource)) {
			return view('errors.404', ['error' => 'Not Found']);
		}

		$file = File::get($resource);
		$type = MimeType::fromFilename($resource);
		return response($file, 200)->header("Content-Type", $type);
	}
}

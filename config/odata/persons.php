<?php

return new class {
	public function register()
	{
		\Lodata::discover(\App\Models\persons::class);
	}
};
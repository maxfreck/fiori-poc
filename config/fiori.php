<?php

return new class {
	public function setup()
	{
		$this->oDataRegister();
	}

	private function oDataRegister()
	{
		$oDataCfgPath = config_path('odata') . DIRECTORY_SEPARATOR;
		if (!is_dir($oDataCfgPath)) return;

		$configs
			= array_filter(scandir($oDataCfgPath), function($item) use ($oDataCfgPath) {
				return !is_dir($oDataCfgPath . $item);
			});
		

		foreach($configs as &$config) {
			$item = require($oDataCfgPath . $config);
			if (!is_object($item) || !method_exists($item, 'register')) continue;
			$item->register();
		}
	}
};
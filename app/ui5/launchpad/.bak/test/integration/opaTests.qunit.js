/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require(["net/php/launchpad/launchpad/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});

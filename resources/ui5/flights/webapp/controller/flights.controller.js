sap.ui.define([
	"sap/ui/core/mvc/Controller"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller) {
		"use strict";

		return Controller.extend("net.php.flights.flights.controller.flights", {
			onInit: function () {

			},

			onUserPress : function () {
				// show a native JavaScript alert
				alert("Hello World");
			}
		});
	});

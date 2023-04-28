/*!
 * OpenUI5
 * (c) Copyright 2009-2023 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./GridTableType"],function(e){"use strict";var t;var r=e.extend("sap.ui.mdc.table.TreeTableType",{metadata:{library:"sap.ui.mdc"}});r.prototype.loadModules=function(){if(t){return Promise.resolve()}return Promise.all([e.prototype.loadModules.apply(this,arguments),this.loadUiTableLibrary().then(function(){return new Promise(function(e,r){sap.ui.require(["sap/ui/table/TreeTable"],function(r){t=r;e()},function(){r("Failed to load some modules")})})})])};r.prototype.createTable=function(e){var r=this.getTable();if(!r||!t){return null}var a=new t(e,this.getTableSettings());a._oProxy._bEnableV4=true;return a};r.prototype.getTableSettings=function(){var t=this.getTable();var r=t?t.bDelegateInitialized&&t.getControlDelegate().getSupportedFeatures(t)["selection"]:false;var a=e.prototype.getTableSettings.apply(this,arguments);if(!r){a.plugins[0].destroy();delete a.plugins;a.selectionMode="None"}return a};return r});
//# sourceMappingURL=TreeTableType.js.map
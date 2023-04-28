/*!
 * OpenUI5
 * (c) Copyright 2009-2023 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// TODO: this is just a draft version and is not yet finalized --> just for verifying flex/p13n concepts. We could move some code here to a base
// implementaton for re-use elsewhere
// ---------------------------------------------------------------------------------------
// Helper class used to help handle p13n related tasks and export service in the table and provide change
// ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------
sap.ui.define([
	"sap/m/OverflowToolbarButton", "sap/m/library", "sap/m/OverflowToolbarMenuButton", "sap/ui/core/library", 	"sap/ui/Device", "sap/ui/core/ShortcutHintsMixin", "sap/ui/core/theming/Parameters"

], function(OverflowToolbarButton, MLibrary, OverflowToolbarMenuButton, CoreLibrary, Device, ShortcutHintsMixin, ThemeParameters) {
	"use strict";

	var HasPopup = CoreLibrary.aria.HasPopup;

	// TODO: this is just a draft version and is not final --> just for verifying flex/p13n concepts
	var oRb;
	/**
	 * P13n/Settings helper class for sap.ui.mdc.Table.
	 * <h3><b>Note:</b></h3>
	 * The class is experimental and the API/behaviour is not finalised and hence this should not be used for productive usage.
	 *
	 * @author SAP SE
	 * @private
	 * @experimental
	 * @since 1.60
	 * @alias sap.ui.mdc.table.TableSettings
	 */
	var TableSettings = {
		createSettingsButton: function(sIdPrefix, aEventInfo) {
			if (!oRb) {
				this._loadResourceBundle();
			}
			var oBtn = this._createButton(sIdPrefix + "-settings", {
				icon: "sap-icon://action-settings",
				text: oRb.getText("table.SETTINGS"),
				press: aEventInfo,
				tooltip: oRb.getText("table.SETTINGS"),
				ariaHasPopup: HasPopup.Dialog
			});


			ShortcutHintsMixin.addConfig(oBtn, {
					addAccessibilityLabel: true,
					messageBundleKey: Device.os.macintosh ? "mdc.PERSONALIZATION_SHORTCUT_MAC" : "mdc.PERSONALIZATION_SHORTCUT" // Cmd+, or Ctrl+,
				},
				aEventInfo[1] // we need the table instance, otherwise the messageBundleKey does not find the resource bundle
			);

			return oBtn;
		},
		createPasteButton: function (sIdPrefix) {
			var oPasteButton = this._createButton(sIdPrefix + "-paste");

			sap.ui.require(["sap/m/plugins/PasteProvider"], function(PasteProvider) {
				oPasteButton.addDependent(new PasteProvider({
					pasteFor: sIdPrefix + "-innerTable"
				}));
			});

			return oPasteButton;
		},
		createExportButton: function(sIdPrefix, mEventInfo) {
			if (!oRb) {
				this._loadResourceBundle();
			}
			var sButtonType = ThemeParameters.get({name: "_sap_ui_mdc_Table_ExportButtonType"});
			var oMenuButton = new OverflowToolbarMenuButton(sIdPrefix + "-export", {
				icon: "sap-icon://excel-attachment",
				text: oRb.getText("table.QUICK_EXPORT"),
				tooltip: oRb.getText("table.EXPORT_BUTTON_TEXT"),
				type: MLibrary.ButtonType[sButtonType],
				buttonMode: MLibrary.MenuButtonMode.Split,
				useDefaultActionOnly: true,
				defaultAction: mEventInfo.default
			});

			// sap.m.Menu requires modules from the unified Lib - load it properly with preload
			sap.ui.getCore().loadLibrary("sap.ui.unified", {async: true}).then(function() {
				sap.ui.require(["sap/m/Menu", "sap/m/MenuItem"], function(Menu, MenuItem) {
					var oMenu = new Menu({
						items: [
							new MenuItem({
								text: oRb.getText("table.QUICK_EXPORT"),
								press: mEventInfo.default
							}),
							new MenuItem({
								text: oRb.getText("table.EXPORT_WITH_SETTINGS"),
								press: mEventInfo.exportAs
							})
						]
					});
					oMenuButton.setMenu(oMenu);
				});
			});

			ShortcutHintsMixin.addConfig(oMenuButton._getButtonControl(), {
					addAccessibilityLabel: true,
					messageBundleKey: Device.os.macintosh ? "table.SHORTCUT_EXPORT_TO_EXCEL_MAC" : "table.SHORTCUT_EXPORT_TO_EXCEL" // Cmd+Shift+E or Ctrl+Shift+E
				},
				mEventInfo.exportAs[1]  // we need the table instance, otherwise the messageBundleKey does not find the resource bundle
			);

			return oMenuButton;
		},
		createExpandCollapseAllButton: function (sIdPrefix, aEventInfo, bIsExpand) {
			if (!oRb) {
				this._loadResourceBundle();
			}

			var sId = bIsExpand ? sIdPrefix + "-expandAll" : sIdPrefix + "-collapseAll",
				sText = bIsExpand ? oRb.getText("table.EXPAND_ALL") : oRb.getText("table.COLLAPSE_ALL");

			var oButton = this._createButton(sId, {
				icon: bIsExpand ? "sap-icon://expand-all" : "sap-icon://collapse-all",
				text: sText,
				press: aEventInfo,
				tooltip: sText
			});

			return oButton;
		},
		_createButton: function(sId, mSettings) {
			return new OverflowToolbarButton(sId, mSettings);
		},
		_loadResourceBundle: function() {
			oRb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");
		}
	};

	return TableSettings;
});

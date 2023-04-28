/*!
 * OpenUI5
 * (c) Copyright 2009-2023 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"sap/ui/core/Fragment",
	"sap/ui/core/Popup",
	"sap/ui/fl/write/api/Version",
	"sap/ui/rta/toolbar/contextBased/SaveAsAdaptation",
	"sap/ui/rta/toolbar/contextBased/ManageAdaptations",
	"sap/ui/rta/toolbar/translation/Translation",
	"sap/ui/rta/toolbar/versioning/Versioning",
	"sap/ui/rta/appVariant/Feature",
	"sap/ui/rta/toolbar/Base",
	"sap/ui/rta/Utils",
	"./AdaptationRenderer"
], function(
	Fragment,
	Popup,
	Version,
	SaveAsAdaptation,
	ManageAdaptations,
	Translation,
	Versioning,
	AppVariantFeature,
	Base,
	Utils,
	AdaptationRenderer
) {
	"use strict";

	/**
	 * Constructor for a new sap.ui.rta.toolbar.Adaptation control
	 *
	 * @class
	 * Contains implementation of Adaptation toolbar
	 * @extends sap.ui.rta.toolbar.Base
	 *
	 * @author SAP SE
	 * @version 1.113.0
	 *
	 * @constructor
	 * @private
	 * @since 1.48
	 * @alias sap.ui.rta.toolbar.Adaptation
	 * @experimental Since 1.48. This class is experimental. API might be changed in future.
	 */
	var Adaptation = Base.extend("sap.ui.rta.toolbar.Adaptation", {
		renderer: AdaptationRenderer,
		animation: true,
		metadata: {
			library: "sap.ui.rta",
			events: {
				/**
				 * Events are fired when the Toolbar Buttons are pressed
				 */
				undo: {},
				redo: {},
				exit: {},
				save: {},
				restore: {},
				publishVersion: {},
				modeChange: {},
				activate: {},
				discardDraft: {},
				switchVersion: {},
				openChangeCategorySelectionPopover: {}
			}
		}
	});

	Adaptation.LEFT_SECTION = "toolbarIconAndDraftSection";
	Adaptation.MIDDLE_SECTION = "toolbarSwitcherSection";
	Adaptation.RIGHT_SECTION = "toolbarActionsSection";

	// Size of three icons + spacing in pixels
	var SWITCHER_ICON_WIDTH = 124;

	Adaptation.prototype.init = function() {
		this._mSizeLimits = {
			switchToIcons: undefined
		};
		this._pFragmentLoaded = Base.prototype.init.apply(this, arguments)
		.then(function() {
			this._onResize = this._onResize.bind(this);
			window.addEventListener("resize", this._onResize);
			this._aIntersectionObservers = [];
		}.bind(this));
	};

	Adaptation.prototype._calculateWindowWidth = function(aEntries) {
		var iSectionWidth = aEntries[0].intersectionRect.width;
		return (iSectionWidth * 2) + this._iSwitcherToolbarWidth + 80/*toolbar padding*/;
	};

	Adaptation.prototype.onFragmentLoaded = function() {
		return this._pFragmentLoaded;
	};

	Adaptation.prototype.exit = function() {
		window.removeEventListener("resize", this._onResize);
		this._aIntersectionObservers.forEach(function(oInstersectionObserver) {
			oInstersectionObserver.disconnect();
		});
		Base.prototype.exit.apply(this, arguments);
	};

	Adaptation.prototype._restoreHiddenElements = function() {
		delete this._iOnResizeAnimationFrame;
		// Restore texts when window gets wide enough again
		if (window.innerWidth > this._mSizeLimits.switchToIcons) {
			this._switchToTexts();
			delete this._mSizeLimits.switchToIcons;
		}
	};

	Adaptation.prototype._onResize = function () {
		if (this._iOnResizeAnimationFrame) {
			window.cancelAnimationFrame(this._iOnResizeAnimationFrame);
		}
		this._iOnResizeAnimationFrame = window.requestAnimationFrame(this._restoreHiddenElements.bind(this));
	};

	Adaptation.prototype.initialAdjustToolbarSectionWidths = function() {
		var nModeSwitcherWidth = this.getControl("modeSwitcher").getDomRef().getBoundingClientRect().width;
		// Size of switcher with texts depends on language; needs to be calculated on start
		this._iSwitcherToolbarWidthWithTexts = nModeSwitcherWidth + 16;
		this._iSwitcherToolbarWidth = this._iSwitcherToolbarWidthWithTexts;
		this.adjustToolbarSectionWidths();
	};

	Adaptation.prototype.adjustToolbarSectionWidths = function() {
		// The middle section (switcher) is used as base for the other calculations
		this.getControl(Adaptation.MIDDLE_SECTION).setWidth((this._iSwitcherToolbarWidth) + "px");
		[Adaptation.LEFT_SECTION, Adaptation.RIGHT_SECTION].forEach(function(sSectionName) {
			this.getControl(sSectionName).getDomRef().style.setProperty(
				"width",
				"calc(50% - " + Math.ceil(this._iSwitcherToolbarWidth / 2) + "px)",
				"important"
			);
		}.bind(this));
	};

	// The intersection observers check if the sections are being overlapped (visibility < 100%)
	// to adjust the toolbar appearance, like changing the mode switcher buttons to icons-only
	Adaptation.prototype._observeIntersections = function() {
		this._aIntersectionObservers.forEach(function(oInstersectionObserver) {
			oInstersectionObserver.disconnect();
		});
		[Adaptation.LEFT_SECTION, Adaptation.RIGHT_SECTION].forEach(function(sSectionName) {
			var oIntersectionObserver = this._createIntersectionObserver(sSectionName);
			this._observeToolbarIntersection(sSectionName, oIntersectionObserver);
			this._aIntersectionObservers.push(oIntersectionObserver);
		}.bind(this));
	};

	// Parameter sSectionName is used by the Fiori toolbar method
	Adaptation.prototype._hideElementsOnIntersection = function(sSectionName, aEntries) {
		if (aEntries[0].intersectionRatio === 0) {
			this.adjustToolbarSectionWidths();
			this._observeIntersections();
			return;
		}

		// Section is no longer fully visible
		if (aEntries[0].intersectionRatio < 1) {
			if (!this._mSizeLimits.switchToIcons) {
				this._mSizeLimits.switchToIcons = this._calculateWindowWidth(aEntries);
				this._switchToIcons();
			}
		}
	};

	Adaptation.prototype._createIntersectionObserver = function(sSectionName) {
		return new IntersectionObserver(
			this._hideElementsOnIntersection.bind(this, sSectionName),
			{
				threshold: 1,
				root: this.getControl(sSectionName).getDomRef()
			}
		);
	};

	Adaptation.prototype._observeToolbarIntersection = function(sSectionName, oInstersectionObserver) {
		var oHBox = this.getControl(sSectionName);
		oHBox.getItems().map(function(oItem) {
			var oItemDomRef = oItem.getDomRef();
			oInstersectionObserver.observe(oItemDomRef);
		});
	};

	Adaptation.prototype.show = function() {
		return Base.prototype.show.call(this, this.initialAdjustToolbarSectionWidths.bind(this))
			.then(function() {
				this._observeIntersections();
			}.bind(this));
	};

	function setButtonProperties(sButtonName, sIcon, sTextKey, sToolTipKey) {
		var oButton = this.getControl(sButtonName);
		var sText = sTextKey ? this.getTextResources().getText(sTextKey) : "";
		var sToolTip = sToolTipKey ? this.getTextResources().getText(sToolTipKey) : "";
		oButton.setText(sText || "");
		oButton.setTooltip(sToolTip || "");
		oButton.setIcon(sIcon || "");
	}

	Adaptation.prototype.formatPublishVersionVisibility = function (bPublishVisible, bVersioningEnabled, sDisplayedVersion, sModeSwitcher) {
		return this.getExtension("versioning", Versioning).formatPublishVersionVisibility(bPublishVisible, bVersioningEnabled, sDisplayedVersion, sModeSwitcher);
	};

	Adaptation.prototype.formatDiscardDraftVisible = function (sDisplayedVersion, bVersioningEnabled, sModeSwitcher) {
		return this.getExtension("versioning", Versioning).formatDiscardDraftVisible(sDisplayedVersion, bVersioningEnabled, sModeSwitcher);
	};

	Adaptation.prototype.formatVersionButtonText = function (aVersions, sDisplayedVersion) {
		return this.getExtension("versioning", Versioning).formatVersionButtonText(aVersions, sDisplayedVersion);
	};

	Adaptation.prototype.showVersionHistory = function(oEvent) {
		return this.getExtension("versioning", Versioning).showVersionHistory(oEvent);
	};

	Adaptation.prototype._openVersionTitleDialog = function (sDisplayedVersion) {
		return this.getExtension("versioning", Versioning).openActivateVersionDialog(sDisplayedVersion);
	};

	Adaptation.prototype.showActionsMenu = function(oEvent) {
		var oButton = oEvent.getSource();
		if (!this._oActionsMenuFragment) {
			return Fragment.load({
				id: this.getId() + "_actionsMenu_fragment",
				name: "sap.ui.rta.toolbar.ActionsMenu",
				controller: {
					openDownloadTranslationDialog: onOpenDownloadTranslationDialog.bind(this),
					openUploadTranslationDialog: onOpenUploadTranslationDialog.bind(this),
					manageApps: onManageAppsPressed.bind(this),
					overviewForKeyUser: onOverviewForKeyUserPressed.bind(this),
					overviewForDeveloper: onOverviewForDeveloperPressed.bind(this),
					restore: this.eventHandler.bind(this, "Restore"),
					formatSaveAsEnabled: formatSaveAsEnabled,
					saveAs: onSaveAsPressed.bind(this)
				}
			}).then(function(oMenu) {
				oMenu.addStyleClass(Utils.getRtaStyleClassName());
				this.addDependent(oMenu);
				oMenu.openBy(oButton, true, Popup.Dock.CenterTop, Popup.Dock.CenterBottom);
				this._oActionsMenuFragment = oMenu;
			}.bind(this));
		}
		this._oActionsMenuFragment.openBy(oButton, true, Popup.Dock.CenterTop, Popup.Dock.CenterBottom);
		return Promise.resolve();
	};

	Adaptation.prototype._showButtonIcon = function(sButtonName, sIcon, sToolTipKey) {
		setButtonProperties.call(this, sButtonName, sIcon, "", sToolTipKey);
	};

	Adaptation.prototype._showButtonText = function(sButtonName, sTextKey) {
		setButtonProperties.call(this, sButtonName, "", sTextKey, "");
	};

	Adaptation.prototype._switchToIcons = function() {
		this._showButtonIcon("adaptationSwitcherButton", "sap-icon://wrench", "BTN_ADAPTATION");
		this._showButtonIcon("navigationSwitcherButton", "sap-icon://explorer", "BTN_NAVIGATION");
		this._showButtonIcon("visualizationSwitcherButton", "sap-icon://show", "BTN_VISUALIZATION");

		this._iSwitcherToolbarWidth = SWITCHER_ICON_WIDTH;
		this.adjustToolbarSectionWidths();
	};

	Adaptation.prototype._switchToTexts = function () {
		this._showButtonText("adaptationSwitcherButton", "BTN_ADAPTATION");
		this._showButtonText("navigationSwitcherButton", "BTN_NAVIGATION");
		this._showButtonText("visualizationSwitcherButton", "BTN_VISUALIZATION");

		this._iSwitcherToolbarWidth = this._iSwitcherToolbarWidthWithTexts;
		this.adjustToolbarSectionWidths();
	};

	/**
	 * Loads and creates the Fragment of the Toolbar
	 *
	 * @returns {Promise<sap.ui.core.Control[]>} Returns the controls in a structure described above.
	 */
	Adaptation.prototype.buildControls = function () {
		return Fragment.load({
			name: "sap.ui.rta.toolbar.Adaptation",
			id: this.getId() + "_fragment",
			controller: {
				activate: this._openVersionTitleDialog.bind(this),
				discardDraft: this.eventHandler.bind(this, "DiscardDraft"),
				formatDiscardDraftVisible: this.formatDiscardDraftVisible.bind(this),
				formatPublishVersionVisibility: this.formatPublishVersionVisibility.bind(this),
				modeChange: this.eventHandler.bind(this, "ModeChange"),
				undo: this.eventHandler.bind(this, "Undo"),
				redo: this.eventHandler.bind(this, "Redo"),
				openChangeCategorySelectionPopover: this.eventHandler.bind(this, "OpenChangeCategorySelectionPopover"),
				saveAsAdaptation: onSaveAsAdaptation.bind(this),
				manageAdaptations: onManageAdaptations.bind(this),
				publishVersion: this.eventHandler.bind(this, "PublishVersion"),
				save: this.eventHandler.bind(this, "Save"),
				exit: this.eventHandler.bind(this, "Exit"),
				formatVersionButtonText: this.formatVersionButtonText.bind(this),
				showVersionHistory: this.showVersionHistory.bind(this),
				showActionsMenu: this.showActionsMenu.bind(this)
			}
		});
	};

	function onOpenDownloadTranslationDialog() {
		var mPropertyBag = {
			layer: this.getRtaInformation().flexSettings.layer,
			selector: this.getRtaInformation().rootControl
		};
		this.getExtension("translation", Translation).openDownloadTranslationDialog(mPropertyBag);
	}

	function onOpenUploadTranslationDialog() {
		this.getExtension("translation", Translation).openUploadTranslationDialog();
	}

	function formatSaveAsEnabled(bGeneralSaveAsEnabled, sDisplayedVersion) {
		return bGeneralSaveAsEnabled && sDisplayedVersion !== Version.Number.Draft;
	}

	function onSaveAsPressed() {
		AppVariantFeature.onSaveAs(true, true, this.getRtaInformation().flexSettings.layer, null);
	}

	function onSaveAsAdaptation() {
		this.getExtension("contextBasedSaveAs", SaveAsAdaptation).openAddAdaptationDialog(this.getRtaInformation().flexSettings.layer);
	}

	function onManageAdaptations() {
		this.getExtension("contextBasedManage", ManageAdaptations).openManageAdaptationDialog();
	}

	function onOverviewForKeyUserPressed() {
		return AppVariantFeature.onGetOverview(true, this.getRtaInformation().flexSettings.layer);
	}

	function onOverviewForDeveloperPressed() {
		return AppVariantFeature.onGetOverview(false, this.getRtaInformation().flexSettings.layer);
	}

	function onManageAppsPressed() {
		AppVariantFeature.onGetOverview(true, this.getRtaInformation().flexSettings.layer);
	}

	Adaptation.prototype.getControl = function(sName) {
		var oControl = sap.ui.getCore().byId(this.getId() + "_fragment--sapUiRta_" + sName);
		// Control is inside the ActionsMenu
		if (!oControl && this._oActionsMenuFragment) {
			oControl = sap.ui.getCore().byId(this._oActionsMenuFragment.getId().replace("sapUiRta_actions", "sapUiRta_") + sName);
		}
		return oControl;
	};

	/**
	 * @inheritDoc
	 */
	Adaptation.prototype.hide = function() {
		this._aIntersectionObservers.forEach(function(oInstersectionObserver) {
			oInstersectionObserver.disconnect();
		});
		return Base.prototype.hide.apply(this, arguments);
	};

	return Adaptation;
});

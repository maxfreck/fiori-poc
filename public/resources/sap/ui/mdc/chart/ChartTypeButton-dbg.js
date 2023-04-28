/*!
 * OpenUI5
 * (c) Copyright 2009-2023 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	"sap/m/OverflowToolbarButton",
	"sap/m/ButtonRenderer",
	"sap/ui/base/ManagedObjectObserver",
	"sap/ui/core/library",
	"sap/m/library",
	"sap/m/IllustratedMessage",
	"sap/m/library",
	"sap/base/util/merge",
	"sap/ui/model/Filter"
], function(OverflowToolbarButton, ButtonRenderer, ManagedObjectObserver, CoreLibrary, mobileLibrary, IllustratedMessage, MLib, merge, Filter) {
	"use strict";

	// shortcut for sap.m.PlacementType
	var PlacementType = mobileLibrary.PlacementType;

	var HasPopup = CoreLibrary.aria.HasPopup;
	var ResponsivePopover, List, SearchField, StandardListItem, InvisibleText, Device, oRb;

	var ChartTypeButton = OverflowToolbarButton.extend("sap.ui.mdc.chart.ChartTypeButton", {
		metadata: {
			library: "sap.ui.mdc"
		},
		constructor: function(oMDCChart, mSettings) {

			if (!oMDCChart) {
				OverflowToolbarButton.apply(this);
				return;
			}

			this.oMDCChartModel = oMDCChart.getManagedObjectModel();
			mSettings = merge(mSettings, {
				type: "Transparent",
				press: function(oEvent) {
					this.displayChartTypes(oEvent.getSource(), oMDCChart);
				}.bind(this),
				id: oMDCChart.getId() + "-btnChartType",
				icon: '{$chart>/getChartTypeInfo/icon}',
				tooltip: '{$chart>/getChartTypeInfo/text}',
				text: '{$chart>/getChartTypeInfo/text}',
				ariaHasPopup: HasPopup.ListBox
			});
			this.oMDCChart = oMDCChart;
			OverflowToolbarButton.apply(this, [
				mSettings
			]);
			this.setModel(this.oMDCChartModel, "$chart");

			this._oObserver = new ManagedObjectObserver(function() {
				this.oMDCChartModel.checkUpdate(true);
			}.bind(this));
			this._oObserver.observe(this.oMDCChart, {
				aggregations: [
					"items"
				],
				properties: [
					"chartType"
				]
			});

		},
		renderer: ButtonRenderer
	});

	ChartTypeButton.mMatchingIcon = {
		"bar": "sap-icon://horizontal-bar-chart",
		"bullet": "sap-icon://horizontal-bullet-chart",
		"bubble": "sap-icon://bubble-chart",
		"column": "sap-icon://vertical-bar-chart",
		"combination": "sap-icon://business-objects-experience",
		"dual_bar": "sap-icon://horizontal-bar-chart",
		"dual_column": "sap-icon://vertical-bar-chart",
		"dual_combination": "sap-icon://business-objects-experience",
		"dual_horizontal_combination": "sap-icon://business-objects-experience",
		"dual_horizontal_stacked_combination": "sap-icon://business-objects-experience",
		"dual_line": "sap-icon://line-chart",
		"dual_stacked_bar": "sap-icon://full-stacked-chart",
		"dual_stacked_column": "sap-icon://vertical-stacked-chart",
		"dual_stacked_combination": "sap-icon://business-objects-experience",
		"donut": "sap-icon://donut-chart",
		"heatmap": "sap-icon://heatmap-chart",
		"horizontal_stacked_combination": "sap-icon://business-objects-experience",
		"line": "sap-icon://line-chart",
		"pie": "sap-icon://pie-chart",
		"scatter": "sap-icon://scatter-chart",
		"stacked_bar": "sap-icon://full-stacked-chart",
		"stacked_column": "sap-icon://vertical-stacked-chart",
		"stacked_combination": "sap-icon://business-objects-experience",
		"treemap": "sap-icon://Chart-Tree-Map", // probably has to change
		"vertical_bullet": "sap-icon://vertical-bullet-chart",
		"100_dual_stacked_bar": "sap-icon://full-stacked-chart",
		"100_dual_stacked_column": "sap-icon://vertical-stacked-chart",
		"100_stacked_bar": "sap-icon://full-stacked-chart",
		"100_stacked_column": "sap-icon://full-stacked-column-chart",
		"waterfall": "sap-icon://vertical-waterfall-chart",
		"horizontal_waterfall": "sap-icon://horizontal-waterfall-chart"
	};

	/**
     * Shows popover to select chart type
     * @param oButton button opening the popover
     * @param oMDCChart the chart
     *
     * @experimental
     * @private
     * @ui5-restricted sap.fe, sap.ui.mdc
     */
	ChartTypeButton.prototype.displayChartTypes = function(oButton, oMDCChart) {
		if (!oMDCChart || !oButton) {
			return;
		}

		if (!this.oReadyPromise) {
			this.oReadyPromise = new Promise(function(resolve) {
				if (ResponsivePopover) {
					resolve(true);
				} else {
					sap.ui.require([
						"sap/m/ResponsivePopover", "sap/m/List", "sap/m/SearchField", "sap/m/StandardListItem", "sap/ui/core/InvisibleText", "sap/ui/Device"
					], function(ResponsivePopoverLoaded, ListLoaded, SearchFieldLoaded, StandardListItemLoaded, InvisibleTextLoaded, DeviceLoaded) {
						ResponsivePopover = ResponsivePopoverLoaded;
						List = ListLoaded;
						SearchField = SearchFieldLoaded;
						StandardListItem = StandardListItemLoaded;
						InvisibleText = InvisibleTextLoaded;
						Device = DeviceLoaded;
						if (!oRb) {
							sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc", true).then(function(oRbLoaded) {
								oRb = oRbLoaded;
								resolve(true);
							});
						} else {
							resolve(true);
						}

					});
				}
			});
		}

		this.oReadyPromise.then(function() {
			if (!this.oPopover){
				this.oPopover = this._createPopover(oMDCChart);

				this.oPopover.attachAfterClose(function(){
					this.oPopover.destroy();
					delete this.oPopover;
				}.bind(this));

				return this.oPopover.openBy(oButton);

			} else if (this.oPopover) {
				this.oPopover.close();
			}
		}.bind(this));
	};

	/**
	 * Creates the popover
	 * @param {sap.ui.mdc.Chart} oMDCChart chart
     * @returns {sap.m.ResponsivePopover} the instance of the created popover
	 *
	 * @experimental
	 * @private
	 * @ui5-restricted sap.ui.mdc
	 */
	ChartTypeButton.prototype._createPopover = function(oMDCChart) {
		var oItemTemplate = new StandardListItem({
			title: "{$chart>text}",
			icon: "{$chart>icon}",
			selected: "{$chart>selected}"
		});

		var oList = new List({
			mode: "SingleSelectMaster",
			noData: new IllustratedMessage({title: oRb.getText("chart.NO_CHART_TYPES_AVAILABLE"), description: oRb.getText("chart.NO_CHART_TYPES_AVAILABLE_ACTION"),  illustrationType: MLib.IllustratedMessageType.AddDimensions}),
			items: {
				path: "$chart>/getAvailableChartTypes",
				template: oItemTemplate
			},
			selectionChange: function(oEvent) {
				//TODO: Implement Chart Type switch
				if (oEvent && oEvent.mParameters && oEvent.mParameters.listItem) {
					var oBinding = oEvent.mParameters.listItem.getBinding("title");
					if (oBinding) {
						var oCtx = oBinding.getContext();
						if (oCtx) {
							var oObj = oCtx.getObject();
							if (oObj && oObj.key) {
								sap.ui.require([
									"sap/ui/mdc/flexibility/Chart.flexibility"
								], function(ChartFlex) {
									//var aChanges = [];

									oMDCChart.getEngine().createChanges({
										control: oMDCChart,
										key: "Type",
										state: {
											properties: {
												chartType: oObj.key
											}
										}
									});
									/*
									aChanges.push(ChartFlex["setChartType"].changeHandler.createChange({
										control: oMDCChart,
										chartType: oObj.key
									}));
									FlexUtil.handleChanges(aChanges);*/
								});
							}
						}
					}
				}

				oPopover.close();
			}
		});

		var oSearchField = new SearchField({
			placeholder: oRb.getText("chart.CHART_TYPE_SEARCH"),
			liveChange: function(oEvent) {
				if (oMDCChart){
					this._triggerSearchInPopover(oEvent, oList);
				}
			}.bind(this)
		});

		var oPopover = new ResponsivePopover({
			id: oMDCChart.getId() + "-btnChartTypePopover",
			placement: PlacementType.VerticalPreferredBottom,
			subHeader: oSearchField,
			contentWidth: "25rem"
		});

		oPopover.setModel(this.oMDCChartModel, "$chart");

		//Show header only in mobile scenarios
		//still support screen reader while on desktops.
		if (Device.system.desktop) {
			var oInvText = new InvisibleText({
				text: oRb.getText("chart.CHART_TYPELIST_TEXT")
			});
			oPopover.setShowHeader(false);
			oPopover.addContent(oInvText);
			oPopover.addAriaLabelledBy(oInvText);
		} else {
			oPopover.setTitle(oRb.getText("chart.CHART_TYPELIST_TEXT"));
		}

		oPopover.addContent(oList);

		if (oList.getItems().length < 7) {
			oSearchField.setVisible(false);
		}

		return oPopover;
	};

	/**
	 * Triggers a search in the drill-down popover
	 *
	 * @param {object} oEvent The event arguments
	 * @param {sap.m.List} oList The list to search in
	 * @private
	 */
	ChartTypeButton.prototype._triggerSearchInPopover = function(oEvent, oList) {

		if (!oEvent || !oList) {
			return;
		}

		var sSearchValue = oEvent.getParameter("newValue");
		var oSearchFilter = [];
		if (sSearchValue) {
			oSearchFilter = new Filter("text", "Contains", sSearchValue);
		}
		oList.getBinding("items").filter(oSearchFilter);
	};

    /**
     * Closes the popover to select chart type
     *
     * @experimental
     * @private
     * @ui5-restricted sap.fe, sap.ui.mdc
     */
	ChartTypeButton.prototype.exit = function() {
		OverflowToolbarButton.prototype.exit.apply(this, arguments);
		if (this.oPopover) {
			this.oPopover.destroy();
			this.oPopover = null;
		}
	};

	return ChartTypeButton;
});

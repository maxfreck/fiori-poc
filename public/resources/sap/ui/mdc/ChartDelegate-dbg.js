/*!
 * OpenUI5
 * (c) Copyright 2009-2023 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
    "sap/ui/mdc/AggregationBaseDelegate"
], function (AggregationBaseDelegate) {
    "use strict";

    /**
     * Base delegate class for {@link sap.ui.mdc.Chart}.<br>
     * This helper class is used to help create content in the MDC chart and fill relevant metadata.<br>
     * <b>Note:</b> The class is experimental and the API/behavior is not finalized and hence this should not be used for productive usage.
     *
	 * @author SAP SE
	 * @namespace
	 * @alias module:sap/ui/mdc/ChartDelegate
	 * @extends module:sap/ui/mdc/AggregationBaseDelegate
	 * @experimental
	 * @since 1.88
	 * @private
	 * @ui5-restricted sap.fe
	 * @MDC_PUBLIC_CANDIDATE
     *
     */
    var ChartDelegate = Object.assign({}, AggregationBaseDelegate);


    /**
     * Toolbar relevant API (WIP)
     */

    /**
     * Notifies the inner chart to zoom in.
     * @param {sap.ui.mdc.Chart} oMDCChart Reference to the MDC chart
     * @param {int} iValue Value to zoom in

     * @experimental
     * @private
     * @ui5-restricted sap.fe, sap.ui.mdc
     * @MDC_PUBLIC_CANDIDATE
     */
    ChartDelegate.zoomIn = function (oMDCChart, iValue) {
    };

    /**
     * Notifies the inner chart to zoom out.
     * @param {sap.ui.mdc.Chart} oMDCChart Reference to the MDC chart
     * @param {int} iValue value to zoom in

     * @experimental
     * @private
     * @ui5-restricted sap.fe, sap.ui.mdc
	 * @MDC_PUBLIC_CANDIDATE
     */
    ChartDelegate.zoomOut = function (oMDCChart, iValue) {
    };


    /**
     * @typedef {object} ZoomState
     * @property {boolean} enabled <code>true</code> if zooming is enabled
     * @property {number} currentZoomLevel Current zoom level of the chart in percent (between 0 and 1)
     * @private
     * @ui5-restricted Fiori Elements, sap.ui.mdc
     */

    /**
     * Gets the current zooming information for the inner chart.
     * @param {sap.ui.mdc.Chart} oMDCChart Reference to the MDC chart
     * @returns {ZoomState} Current <code>ZoomState</code> of the inner chart

     * @experimental
     * @private
     * @ui5-restricted sap.fe, sap.ui.mdc
	 * @MDC_PUBLIC_CANDIDATE
     */
    ChartDelegate.getZoomState = function (oMDCChart) {
        // return { enable: false, currentZoomLevel: 1 };
    };

	/**
	 * Returns the filter delegate of the chart that provides basic filter functionality, such as adding filter fields.
	 * <b>Note:</b> The functionality provided in this delegate acts as a subset of a <code>FilterBarDelegate</code> to enable the chart for inbuilt
	 * filtering.
	 *
	 * @example <caption>Example usage of <code>getFilterDelegate</code></caption>
	 * oFilterDelegate = {
	 * 		addItem: function() {
	 * 			var oFilterFieldPromise = new Promise(...);
	 * 			return oFilterFieldPromise;
	 * 		}
	 * }
	 * @returns {{addItem: (function(string, sap.ui.mdc.Table): Promise<sap.ui.mdc.FilterField>)}} Object for the chart filter personalization
	 * @protected
	 */
    ChartDelegate.getFilterDelegate = function() {
		return {

			/**
			 * Creates an instance of a <code>sap.ui.mdc.FilterField</code>.
			 *
			 * @param {string} sPropertyName The property name
			 * @param {sap.ui.mdc.Control} oControl - Instance of the mdc control
			 * @returns {Promise<sap.ui.mdc.FilterField>} <code>Promise</code> that resolves with an instance of a <code>sap.ui.mdc.FilterField</code>.
			 * @see sap.ui.mdc.AggregationBaseDelegate#addItem
			 */
		    addItem: function (sPropertyName, oControl) {
				return Promise.resolve();
		    },

			/**
			 * This method is called when an <code>AddCondition</code> change is applied by the personalization.
             * It can be used to perform tasks, such as caching information or modifying the control.
			 *
			 * @param {string} sPropertyName Name of a property
			 * @param {sap.ui.mdc.Control} oControl Instance of the MDC control
			 * @param {Object} mPropertyBag Instance of property bag from the SAPUI5 flexibility API
			 * @returns {Promise} <code>Promise</code> that resolves once the properyInfo property has been updated
			 */
			addCondition: function(sPropertyName, oControl, mPropertyBag) {
				return Promise.resolve();
		    },

			/**
			 * This method is called when a <code>RemoveCondition</code> change is applied by the personalization.
             * It can be used to perform tasks, such as caching information or modifying the control.
			 *
			 * @param {string} sPropertyName Name of a property
			 * @param {sap.ui.mdc.Control} oControl Instance of the mdc control
			 * @param {Object} mPropertyBag Instance of property bag from the SAPUI5 flexibility API
			 * @returns {Promise} <code>Promise</code> that resolves once the properyInfo property has been updated
			 */
		    removeCondition: function(sPropertyName, oControl, mPropertyBag) {
				return Promise.resolve();
		    }
		};
	};

    /**
     * Creates a new MDC chart item for a given property name and updates the inner chart.
     * <b>Note:</b> This does <b>not</b> add the MDC chart item to the <code>Items</code> aggregation of the MDC chart.
     * Called and used by <code>p13n</code>.
     * @param {string} sPropertyName the name of the property added
     * @param {sap.ui.mdc.Chart} oMDCChart Reference to the MDC chart to add the property to
     * @param {object} mPropertyBag the property bag containing useful information about the change
     * @param {string} sRole new role for given item (if available)
     * @returns {Promise} Promise that resolves with new MDC chart Item as parameter
     *
     * @experimental
     * @private
     * @ui5-restricted sap.fe, sap.ui.mdc
 	 * @MDC_PUBLIC_CANDIDATE
     */
    ChartDelegate.addItem = function (sPropertyName, oMDCChart, mPropertyBag, sRole) {
    };

    /**
     * Removes an existing MDC chart item for a given property name and updates the inner chart.
     * Called and used by p13n.
     * @param {string} oProperty Name of the property removed
     * @param {sap.ui.mdc.Chart} oMDCChart Reference to the MDC chart from which property is removed
     * @returns {Promise<boolean>} <code>Promise</code> containing information whether the item was deleted
     *
     * @experimental
     * @private
     * @ui5-restricted sap.ui.mdc
 	 * @MDC_PUBLIC_CANDIDATE
     */
    ChartDelegate.removeItem = function (oProperty, oMDCChart) {
        return Promise.resolve(true);
    };

    /**
     * @typedef {object} sap.ui.mdc.SelectionDetails
     * @property {string} eventId  ID of the selection event
     * @property {sap.ui.core.Control} listener Reference to inner chart
     */

    /**
     ** Returns the event handler for <code>SelectionDetails</code> as an object:
     *
     * @param {sap.ui.mdc.Chart} oMDCChart Reference to the MDC chart
     * @returns {sap.ui.mdc.SelectionDetails} Event handler for SelectionDetails
     *
     * @experimental
     * @private
     * @ui5-restricted sap.fe, sap.ui.mdc
 	 * @MDC_PUBLIC_CANDIDATE
     */
    ChartDelegate.getInnerChartSelectionHandler = function (oMDCChart) {
    };

    /**
     * Sets the visibility of the legend.
     *  <b>Note:</b> This function is called by the MDC chart only. You must not call it directly but use {@link sap.ui.mdc.Chart#setLegendVisible LegendVisible} instead.
     *
     * @param {sap.ui.mdc.Chart} oMDCChart Chart to the set the legend visibility on
     * @param {boolean} bVisible true to show legend, false to hide
     *
     * @experimental
     * @private
     * @ui5-restricted sap.fe, sap.ui.mdc
 	 * @MDC_PUBLIC_CANDIDATE
     */
    ChartDelegate.setLegendVisible = function (oMDCChart, bVisible) {
    };

    // /**
    //  * Creates a sorter for a given property.
    //  * @param {sap.ui.mdc.chart.Item} oMDCItem MDC item for which a sorter is created
    //  * @param {object} oSortProperty The sorting information
    //  * @returns {sap.ui.model.Sorter} Sorter for given item
    //  *
    //  * @experimental
    //  * @private
    //  * @ui5-restricted sap.ui.mdc
    //  * @MDC_PUBLIC_CANDIDATE
    //  */
    // ChartDelegate.getSorterForItem = function (oMDCItem, oSortProperty) {
    //     //TODO: Check wether we really need this method.
    //     //TODO: Right now it is needed since the name of a property does not include the aggregation method -> leads to an error when calling back-end
    //     //TODO: In old chart, aggregation method was included in name since every method had their own Item
    // };

    /**
     * Inserts an MDC chart Item (in case of sap.chart.Chart a Measure/Dimension) on the inner chart.
     * This function is called by MDC chart on a change of the <code>Items</code> aggregation.
     * <b>Note:</b> Do not call this yourself, as it would not be synced with the MDC chart, but instead insert the Item into the MDC chart.
     *
     * @param {sap.ui.mdc.Chart} oMDCChart MDC chart to insert the item into
     * @param {sap.ui.mdc.chart.Item} oMDCChartItem MDC chart Item to insert into the inner chart
     * @param {int} iIndex the index to insert into
     *
     * @experimental
     * @private
     * @ui5-restricted sap.fe, sap.ui.mdc
 	 * @MDC_PUBLIC_CANDIDATE
     */
    ChartDelegate.insertItemToInnerChart = function (oMDCChart, oMDCChartItem, iIndex) {
    };

    /**
     * Removes an Item (in case of sap.chart.Chart a Measure/Dimension) from the inner chart.
     * This function is called by MDC chart on a change of the <code>Items</code> aggregation.
     * <b>Note:</b> Do not call this yourself, as it would not be synced with the MDC chart, but instead remove the item from the MDC chart.
     *
     * @param {sap.ui.mdc.Chart} oMDCChart  MDC chart to remove the item from
     * @param {sap.ui.mdc.chart.Item} oMDCChartItem Item to remove from the inner chart
     *
     * @experimental
     * @private
     * @ui5-restricted sap.fe, sap.ui.mdc
   	 * @MDC_PUBLIC_CANDIDATE
    */
    ChartDelegate.removeItemFromInnerChart = function (oMDCChart, oMDCChartItem) {
    };

    /**
     * Loads the required libraries and creates the inner chart.
     * @param {sap.ui.mdc.Chart} oMDCChart Reference to the MDC chart
     * @returns {Promise} Resolved once the inner chart has been initialized
     *
     * @experimental
     * @private
     * @ui5-restricted sap.ui.mdc
 	 * @MDC_PUBLIC_CANDIDATE
     */
    ChartDelegate.initializeInnerChart = function (oMDCChart) {
    };

    /**
     * Creates the initial content for the chart before the metadata is retrieved.
     * This can be used by chart libraries that can already show some information without the actual data (for example, axis labels, legend, ...).
     *
     * @param {sap.ui.mdc.Chart} oMDCChart Reference to the MDC chart
     *
     * @experimental
     * @private
     * @ui5-restricted sap.ui.mdc
 	 * @MDC_PUBLIC_CANDIDATE
     */
    ChartDelegate.createInitialChartContent = function (oMDCChart) {
    };

    /**
     * Returns the instance of the inner chart.
     *
     * @returns {sap.core.Control} Instance of the inner chart
     *
     * @experimental
     * @private
     * @ui5-restricted sap.ui.mdc
 	 * @MDC_PUBLIC_CANDIDATE
     */
    ChartDelegate.getInnerChart = function () {
    };

    /**
     * @typedef {object} sap.ui.mdc.ChartTypeObject
     * @property {string} key Unique key of the chart type
     * @property {string} icon URI for the icon for the current chart type
     * @property {string} text Name of the current chart type
     * @property {boolean} selected Whether the chart type is the one currently used
     *
     * @private
     * @ui5-restricted sap.ui.mdc, Fiori Elements
 	 * @MDC_PUBLIC_CANDIDATE
     */

    /**
     * Returns the current chart type.
     *
     * @returns {sap.ui.mdc.ChartTypeObject[]} Information about the current chart type
     * @throws Exception if inner chart is not initialized yet
     *
     * @experimental
     * @private
     * @ui5-restricted sap.ui.mdc
 	 * @MDC_PUBLIC_CANDIDATE
     */
    ChartDelegate.getChartTypeInfo = function () {
    };

    /**
     * Gets the available chart types for the current state of the inner chart.
     *
     * @param {sap.ui.mdc.Chart} oMDCChart Reference to the MDC chart
     * @returns {sap.ui.mdc.ChartTypeObject[]} Array containing the currently available chart types
     *
     * @experimental
     * @private
     * @ui5-restricted sap.fe
 	 * @MDC_PUBLIC_CANDIDATE
     */
    ChartDelegate.getAvailableChartTypes = function (oMDCChart) {
    };


    /**
     * @typedef {object} sap.ui.mdc.ChartTypeLayoutConfig
     * @property {string} key identifier for the chart type
     * @property {string[]} allowedLayoutOptions array containing allowed layout options as string
     *
     * @private
     * @ui5-restricted sap.ui.mdc, Fiori Elements
 	 * @MDC_PUBLIC_CANDIDATE
     */

    /**
     * This function is used by P13n to determine which chart type supports which layout options.
     * There might be chart types that do not support certain layout options (for example, "Axis3").
     *
     * @returns {sap.ui.mdc.ChartTypeLayoutConfig[]} chart type layout config
     *
     * @experimental
     * @private
     * @ui5-restricted sap.ui.mdc
 	 * @MDC_PUBLIC_CANDIDATE
     */
    ChartDelegate.getChartTypeLayoutConfig = function() {
    };

    /**
     * Returns the current drilling stack of the inner chart.
     * The returned objects need at least a <code>label</code> and a <code>name</code> property.
     * Also, a <code>dimension</code> array containing the dimension drill stack at the current level is required.
     *
     * @param {sap.ui.mdc.Chart} oMDCChart Reference to the MDC chart
     * @returns {array} Array containing the drill stack
     *
     * @experimental
     * @private
     * @ui5-restricted sap.ui.mdc
 	 * @MDC_PUBLIC_CANDIDATE
     */
    ChartDelegate.getDrillStack = function (oMDCChart) {
    };

    /**
     * Returns all sorted dimensions of an inner chart as property.
     * This is used to determine possible drill-down dimensions in the drill-down popover of the MDC chart.
     *
     * @param {sap.ui.mdc.Chart} oMDCChart Reference to the MDC chart
     * @returns {Promise<sap.ui.mdc.chart.Item[]>} <code>Promise</code> containing an array of dimensions that is sorted
     *
     * @experimental
     * @private
     * @ui5-restricted sap.ui.mdc
 	 * @MDC_PUBLIC_CANDIDATE
     */
    ChartDelegate.getSortedDimensions = function (oMDCChart) {
    };

    /**
     * Determines which MDC items are drillable and returns them.
     * This function is used by the breadcrumb navigation.
     *
     * @param {sap.ui.mdc.Chart} oMDCChart Reference to the MDC chart
     * @returns {sap.ui.mdc.chart.Item[]} Array of MDC items that are drillable
     *
     * @experimental
     * @private
     * @ui5-restricted sap.ui.mdc
 	 * @MDC_PUBLIC_CANDIDATE
     */
    ChartDelegate.getDrillableItems = function (oMDCChart) {
    };

    /**
     * Sets the chart type of the inner chart.
     * This function is called by the MDC chart when the <code>chartType</code> property is updated.
     *  <b>Note:</b> This function is called by the MDC chart only. You must not call it directly but use {@link sap.ui.mdc.Chart#setChartType setChartType} instead.
     *
     * @param {string} sChartType New chart type
     *
     * @experimental
     * @private
     * @ui5-restricted sap.ui.mdc
 	 * @MDC_PUBLIC_CANDIDATE
     */
    ChartDelegate.setChartType = function (sChartType) {
    };

    /**
     * This method is called to update invalidate the inner chart control to update the no data structure.
     *
     * @param {sap.ui.mdc.Chart} oMDCChart reference to the MDC Chart
     *
     * @experimental
     * @private
 	 * @MDC_PUBLIC_CANDIDATE
     */
    ChartDelegate.changedNoDataStruct = function(oMDCChart) {
    };

    /**
     * Sets a "No Data" text for the inner chart.
     *
     * @param {sap.ui.mdc.Chart} oMDCChart Reference to mdc chart
     * @param {string} sText Text to show when there is no data displayed on the chart
     *
     * @experimental
     * @private
     * @ui5-restricted sap.ui.mdc
 	 * @MDC_PUBLIC_CANDIDATE
     */
    ChartDelegate.setNoDataText = function(oMDCChart, sText) {
    };

    /**
     * Binds the inner chart to the back-end data and creates the inner chart content.
     *
     * @param {sap.ui.mdc.Chart} oMDCChart Reference to the MDC chart
     * @param {function} fnCallbackDataLoaded Callback function when data is loaded
     *
     * @experimental
     * @private
     * @ui5-restricted sap.ui.mdc
 	 * @MDC_PUBLIC_CANDIDATE
     */
    ChartDelegate.createInnerChartContent = function (oMDCChart, fnCallbackDataLoaded) {
    };

    /**
     * Checks the binding of the chart and rebinds it if required.
     *
     * @param {sap.ui.mdc.Chart} oMDCChart Reference to the MDC chart
     * @param {object} oBindingInfo BindingInfo of the chart
     *
     * @deprecated as of 1.98;: use rebind instead
     *
     * @experimental
     * @private
     * @ui5-restricted sap.ui.mdc
     */
    ChartDelegate.rebindChart = function (oMDCChart, oBindingInfo) {
    };

    /**
     * Checks the binding of the chart and rebinds it if required.
     *
     * @param {sap.ui.mdc.Chart} oMDCChart Reference to the MDC chart
     * @param {object} oBindingInfo BindingInfo of the chart
     *
     * @experimental
     * @private
     * @ui5-restricted sap.ui.mdc
 	 * @MDC_PUBLIC_CANDIDATE
     */
    ChartDelegate.rebind = function (oMDCChart, oBindingInfo) {
    };

    /**
     * Returns the information whether the inner chart is currently bound.
     *
     * @param {sap.ui.mdc.Chart} oMDCChart to the MDC chart
     * @returns {boolean} <code>true</code> if inner chart is bound; <code>false</code> if not
     *
     * @experimental
     * @private
     * @ui5-restricted sap.ui.mdc
 	 * @MDC_PUBLIC_CANDIDATE
     */
    ChartDelegate.getInnerChartBound = function (oMDCChart) {
    };

    /**
     * Updates the binding info with the relevant filters.
     *
     * @param {sap.ui.mdc.Chart} oMDCChart to the MDC chart
     * @param {Object} oBindingInfo Binding info of the chart
     *
     * @experimental
     * @private
     * @ui5-restricted sap.ui.mdc
 	 * @MDC_PUBLIC_CANDIDATE
     */
    ChartDelegate.updateBindingInfo = function (oMDCChart, oBindingInfo) {
    };

    /**
     * Sets tooltips to visible/invisible for the inner chart.
     * <b>Note:</b> This function is called by the MDC chart only. You must not call it directly but use {@link sap.ui.mdc.Chart#setShowChartTooltip setShowChartTooltip} instead.
     *
     * @param {sap.ui.mdc.Chart} oMDCChart Reference to the MDC chart
     * @param {boolean} bVisible <code>true</code> for visible, <code>false</code> for invisible
     *
     * @experimental
     * @private
     * @ui5-restricted sap.ui.mdc
 	 * @MDC_PUBLIC_CANDIDATE
     */
    ChartDelegate.setChartTooltipVisibility = function (oMDCChart, bVisible) {
    };

    /**
     * This function returns an ID which should be used in the internal chart for the measure/dimension.
     * For standard cases, this is just the id of the property.
     * If it is necessary to use another id internally inside the chart (e.g. on duplicate property ids) this method can be overwritten.
     * In this case, <code>getPropertyFromNameAndKind</code> needs to be overwritten as well.
     *
     * @param {string} sName ID of the property
     * @param {string} sKind Type of the Property (Measure/Dimension)
     * @param {sap.ui.mdc.Chart} oMDCChart Reference to the MDC chart
     * @returns {string} Internal id for the sap.chart.Chart
     *
     * @private
     * TODO should be removed!!!!!
     */
    ChartDelegate.getInternalChartNameFromPropertyNameAndKind = function(sName, sKind, oMDCChart) {
    };

    /**
     * This maps an id of an internal chart dimension/measure & type of a property to its corresponding property entry.
     *
     * @param {string} sName ID of internal chart measure/dimension //???? Name Kind docu is not the same compared to getInternalChartNameFromPropertyNameAndKind
     * @param {string} sKind Kind of the property
     * @param {sap.ui.mdc.Chart} oMDCChart Reference to the MDC chart
     * @returns {sap.ui.mdc.chart.PropertyInfo} PropertyInfo object
     *
     * @private
     * TODO should be removed!!!!!
     */
    ChartDelegate.getPropertyFromNameAndKind = function(sName, sKind, oMDCChart) {
    };

    // /**
    //  * Initializes a new chart property helper for V4 analytics with the property extensions merged into the property infos.
    //  *
    //  * @param {sap.ui.mdc.Chart} oMDCChart Reference to the MDC chart
    //  * @returns {Promise<sap.ui.mdc.chart.PropertyHelper>} <code>Promise</code> that resolves with the property helper
    //  *
    //  * @private
    //  * @ui5-restricted sap.ui.mdc
    //  */
    // ChartDelegate.initPropertyHelper = function (oMDCChart) {
    //     return Promise.resolve(true);
    // };

    /**
     * Returns the relevant property infos based on the metadata used with the MDC chart instance.
     *
     * @param {sap.ui.mdc.Chart} oMDCChart Reference to the MDC chart
     * @returns {Promise<sap.ui.mdc.chart.PropertyInfo[]>} Array of the property infos to be used within the chart
     *
     * @experimental
     * @private
     * @ui5-restricted sap.ui.mdc
 	 * @MDC_PUBLIC_CANDIDATE
     */
    ChartDelegate.fetchProperties = function (oMDCChart) {
    };

    /**
     * Adds/Removes the overlay shown above the inner chart.
     *
     * @param {sap.ui.mdc.Chart} oMDCChart reference to the chart
     * @param {boolean} bShow <code>true</code> to show overlay, <code>false</code> to hide
     *
     * @experimental
     * @private
     * @ui5-restricted sap.fe, sap.ui.mdc
 	 * @MDC_PUBLIC_CANDIDATE
     */
    ChartDelegate.showOverlay = function(oMDCChart, bShow) {
    };

    return ChartDelegate;
});

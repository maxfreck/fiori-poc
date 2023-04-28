/*!
 * OpenUI5
 * (c) Copyright 2009-2023 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// ---------------------------------------------------------------------------------------
// Delegate class used to help create content in the filterbar and fill relevant metadata
// ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------
sap.ui.define(["sap/ui/mdc/AggregationBaseDelegate", "sap/ui/mdc/enum/FilterBarValidationStatus"], function(AggregationBaseDelegate, FilterBarValidationStatus) {
	"use strict";
	/**
	 * @class Base Delegate for {@link sap.ui.mdc.FilterBar FilterBar}. Extend this object in your project to use all functionalites of the {@link sap.ui.mdc.FilterBar FilterBar}.
	 * <b>Note:</b>
	 * The class is experimental and the API/behavior is not finalized and hence this should not be used for productive usage.
	 * @author SAP SE
	 * @private
	 * @ui5-restricted sap.fe
	 * @experimental As of version 1.61.0
	 * @MDC_PUBLIC_CANDIDATE
	 * @since 1.61.0
	 * @alias sap.ui.mdc.FilterBarDelegate
	 */
	var FilterBarDelegate = Object.assign({}, AggregationBaseDelegate);

	/**
	 * Creates an instance of a filter field control.
	 * <b>Note:</b> The <code>addItem</code> hook can be used during the processing of an SAPUI5 flexibility change.
	 * Consequently the parameter <code>mPropertyBag</code> is only passed during preprocessing. In runtime scenarios (such as opening a personalization dialog), this
	 * method might be called without the parameter <code>mPropertyBag</code>.
	 *
	 * @param {string} sPropertyName The name of the property info object/JSON
	 * @param {sap.ui.mdc.Control} oControl Instance of an <code>sap.ui.mdc.Control</code>
	 * @param {Object} [mPropertyBag] Instance of property bag from SAPUI5 flexibility change API
	 *
	 * @returns {Promise} Promise that resolves with an instance of the implementing {@link sap.ui.mdc.FilterField Control}.
	 * <b>Note:</b>
	 * This method always requires a return value once it has been called. If an item for a given property <code>sPropertyName</code>
	 * has already been created, it is required to either return the existing instance or create a new instance.
	 *
	 * @private
	 * @experimental
	 * @ui5-restricted sap.fe
	 * @MDC_PUBLIC_CANDIDATE
	 */
	FilterBarDelegate.addItem = function(sPropertyName, oControl, mPropertyBag) {
		return AggregationBaseDelegate.addItem(sPropertyName, oControl, mPropertyBag);
	};

	/**
	 * Triggers any necessary follow-up steps that need to be taken after the removal of created items via <code>removeItem</code>.
	 * The returned Boolean value inside the <code>Promise</code> can be used to prevent the default follow-up behavior of the SAPUI5 flexibility handling.
	 *
	 * <b>Note:</b>The <code>removeItem</code> hook can be used during the processing of an SAPUI5 flexibility change.
	 * Consequently the parameter <code>mPropertyBag</code> is only passed during preprocessing. In runtime scenarios (such as opening a personalization dialog), this
	 * method can be called without the parameter <code>mPropertyBag</code>.
	 *
	 * @param {sap.ui.core.Control} oItem The control instance that was removed
	 * @param {sap.ui.mdc.Control} oControl Instance of an <code>sap.ui.mdc.Control</code>
	 * @param {Object} [mPropertyBag] Instance of property bag from SAPUI5 flexibility
	 *
	 * @returns {Promise} Promise that resolved with <code>true</code>, <code>false</code> to allow/prevent default behavior of the change
	 * @private
	 * @experimental
	 * @ui5-restricted sap.fe
	 * @MDC_PUBLIC_CANDIDATE
	 */
	FilterBarDelegate.removeItem = function(oItem, oControl, mPropertyBag) {
		// return true within the Promise for default behavior
		return AggregationBaseDelegate.removeItem(oItem, oControl, mPropertyBag);
	};

	/**
	 * This method is called during the appliance of the add condition change.
	 * The intention is to update the propertyInfo property.
	 *
	 * @param {string} sPropertyName The name of a property
	 * @param {sap.ui.mdc.Control} oControl - The instance of a filter bar
	 * @param {Object} mPropertyBag Instance of a property bag from the SAPUI5 flexibility change API
	 * @returns {Promise} Promise that is resolved once the propertyInfo property has been updated
	 *
	 * @private
	 * @experimental
	 * @ui5-restricted sap.fe
	 * @MDC_PUBLIC_CANDIDATE
	 */
	FilterBarDelegate.addCondition = function(sPropertyName, oControl, mPropertyBag) {
		return Promise.resolve();
    };

	/**
	 * This method is called during the appliance of the remove condition change.
	 * The intention is to update the propertyInfo property.
	 *
	 * @param {string} sPropertyName The name of a property
	 * @param {sap.ui.mdc.Control} oControl - The instance of a filter bar
	 * @param {Object} mPropertyBag Instance of a property bag from the SAPUI5 flexibility change API
	 * @returns {Promise} Promise that is resolved once the propertyInfo property has been updated
	 *
	 * @private
	 * @experimental
	 * @ui5-restricted sap.fe
	 * @MDC_PUBLIC_CANDIDATE
	 */
	FilterBarDelegate.removeCondition = function(sPropertyName, oControl, mPropertyBag) {
		return Promise.resolve();
    };


	/**
	 * Retrieves the relevant metadata for a given payload and returns the property info array.
	 *
	 * @param {sap.ui.mdc.Control} oControl Instance of an <code>sap.ui.mdc.Control</code>
	 * @returns {Promise<sap.ui.mdc.filterbar.PropertyInfo[]>} Once resolved, an array of property info objects is returned
	 *
	 * @private
	 * @experimental
	 * @ui5-restricted sap.fe
	 * @MDC_PUBLIC_CANDIDATE
	 */
	FilterBarDelegate.fetchProperties = function(oControl) {
		return AggregationBaseDelegate.fetchProperties(oControl);
	};

	/**
	 * This method is called when the 'Clear' button was pressed.
	 *
	 * @param {sap.ui.mdc.Control} oControl - The instance of a filter bar
	 * @returns {Promise} Promise that is resolved once the action completes
	 *
	 * @private
	 * @experimental
	 * @ui5-restricted sap.fe
	 * @MDC_PUBLIC_CANDIDATE
	 */
	FilterBarDelegate.clearFilters = function(oControl) {
		return Promise.resolve();
    };

	/**
	 * A validator to evaluate the filter bar state.
	 *
	 * @param {sap.ui.mdc.FilterBar} oFilterBar Instance of a <code>sap.ui.mdc.FilterBar</code>
	 * @param {map} [mValidation] Object describing the validation result. This object is only provided when called from the {@link sap.ui.mdc.FilterBar FilterBar}
	 * @param {string} [mValidation.status] Status of the validation {@link sap.ui.mdc.enum.FilterBarValidationStatus}
	 * @returns {sap.ui.mdc.enum.FilterBarValidationStatus} The inner filter bar state
	 *
	 * @private
	 * @experimental
	 * @ui5-restricted sap.fe
	 * @MDC_PUBLIC_CANDIDATE
	 */
    FilterBarDelegate.determineValidationState = function(oFilterBar) {
		 return oFilterBar.checkFilters();
	};

	/**
	 * Visualizes the filter bar validation state.
	 *
	 * @param {sap.ui.mdc.FilterBar} oFilterBar Instance of a <code>sap.ui.mdc.FilterBar</code>
	 * @param {map} mValidation Describes the validation result. This object is only provided when called from the {@link sap.ui.mdc.FilterBar FilterBar}
	 * @param {sap.ui.mdc.enum.FilterBarValidationStatus} mValidation.status of the validation as returned via {@link sap.ui.mdc.filterbar.FilterBarBase#checkValidationState checkValidationState}
	 *
	 * @private
	 * @experimental
	 * @ui5-restricted sap.fe
	 * @MDC_PUBLIC_CANDIDATE
	 */
    FilterBarDelegate.visualizeValidationState = function(oFilterBar, mValidation) {
		 var sErrorMessage;

		 if (mValidation.status === FilterBarValidationStatus.NoError) {
			 return;
		 }

		 if (mValidation.status === FilterBarValidationStatus.RequiredHasNoValue) {
			 sErrorMessage = oFilterBar.getText("filterbar.REQUIRED_CONDITION_MISSING");
		 } else if (mValidation.status === FilterBarValidationStatus.FieldInErrorState ) {
			 sErrorMessage = oFilterBar.getText("filterbar.VALIDATION_ERROR");
		 }

		 if (oFilterBar.getShowMessages() && !oFilterBar._isLiveMode()) {

			 sap.ui.require(["sap/m/MessageBox", "sap/base/Log"], function (MessageBox, Log) {
				 try {

					 if (oFilterBar._bIsBeingDestroyed) {
						 return;
					 }
					 MessageBox.error(sErrorMessage, {
						 styleClass: (this.$() && this.$().closest(".sapUiSizeCompact").length) ? "sapUiSizeCompact" : "",
						 onClose: oFilterBar.setFocusOnFirstErroneousField.bind(oFilterBar)
					 });
				 } catch (x) {
					 Log.error(x.message);
				 }
			 });
		 }
	};


	return FilterBarDelegate;
});

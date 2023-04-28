/*!
 * OpenUI5
 * (c) Copyright 2009-2023 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	"sap/ui/base/ManagedObject"
], function(
	ManagedObject
) {
	"use strict";
	/**
	 * Base class for data selectors
	 *
	 * @class Base class for data selectors
	 * @extends sap.ui.base.ManagedObject
	 * @alias sap.ui.fl.apply._internal.flexState.DataSelector
	 * @since 1.110
	 * @private
	 * @ui5-restricted
	 */
	var DataSelector = ManagedObject.extend("sap.ui.fl.apply._internal.flexState.DataSelector", /* @lends sap.ui.fl.apply._internal.flexState.DataSelector.prototype */ {
		metadata: {
			properties: {
				/**
				 * Parent selector for chaining execute functions
				 * If a parent selector is provided, its <code>execute</code> function is
				 * called first with the parameters that were specified by the consumer
				 * The result is then passed to the <code>execute</code> function of the next
				 * selector as base data for further calculations
				 * See {@link sap.ui.fl.apply._internal.flexState.DataSelector}.
				 */
				parentDataSelector: {
					type: "object"
				},
				/**
				 * Temporary cache to store calculated values or key value pairs
				 * in case of parameterized selectors
				 */
				cachedResult: {
					type: "any"
				},
				/**
				 * If no parameter key is set, the data selector cache is not parameterized
				 */
				parameterKey: {
					type: "string"
				},
				/**
				 * Callback function which is executed once after the selector is created
				 */
				initFunction: {
					type: "function"
				},
				/**
				 * Callback function to build the derived state
				 * Must not return <code>null</code> or <code>undefined</code> to allow proper cache invalidation
				 */
				executeFunction: {
					type: "function"
				},
				/**
				 * List of callback functions which are notified in case of state changes
				 */
				updateListeners: {
					type: "function[]",
					defaultValue: []
				},
				/**
				 * Callback function to compare the current base data with the base data that was
				 * used to calculate the derived state
				 * Must return <code>true</code> if a recalculation is required
				 */
				checkInvalidation: {
					type: "function",
					defaultValue: function() {
						return true;
					}
				}
			}
		},
		constructor: function() {
			ManagedObject.apply(this, arguments);
			if (this.getParameterKey()) {
				// If value is parameterized, create a map for easier access
				this.setCachedResult({});
			}
			// Attach to parent data selector updates
			var oParentDataSelector = this.getParentDataSelector();
			if (oParentDataSelector) {
				this.onParentSelectorUpdate = this.checkUpdate.bind(this);
				oParentDataSelector.addUpdateListener(this.onParentSelectorUpdate);
			}
		}
	});

	DataSelector.prototype.setParentDataSelector = function(oParentDataSelector) {
		if (
			oParentDataSelector
			&& this.getParameterKey()
			&& this.getParameterKey() === oParentDataSelector.getParameterKey()
		) {
			throw new Error('Parameter key names must be unique');
		}
		return this.setProperty("parentDataSelector", oParentDataSelector);
	};

	/**
	 * Registers a callback listener to get notified about changes to the state
	 * @param {function} fnListener - Callback function that is called in case of state updates
	 */
	DataSelector.prototype.addUpdateListener = function(fnListener) {
		var aCurrentListeners = this.getUpdateListeners();
		if (!aCurrentListeners.includes(fnListener)) {
			this.setUpdateListeners([].concat(aCurrentListeners, fnListener));
		}
	};

	/**
	 * Deregisters a state update callback listener
	 * @param {function} fnListener - Callback listener that should be removed
	 */
	DataSelector.prototype.removeUpdateListener = function(fnListener) {
		var aCurrentListeners = this.getUpdateListeners();
		this.setUpdateListeners(aCurrentListeners.filter(function(fnListenerToCheck) {
			return fnListenerToCheck !== fnListener;
		}));
	};

	DataSelector.prototype.exit = function() {
		var oParentDataSelector = this.getParentDataSelector();
		if (oParentDataSelector) {
			oParentDataSelector.removeUpdateListener(this.onParentSelectorUpdate);
		}
	};

	DataSelector.prototype._getParameterizedCachedResult = function(mParameters) {
		var sParameterKey = this.getParameterKey();
		if (sParameterKey) {
			var sParameter = mParameters[sParameterKey];
			return this.getCachedResult()[sParameter];
		}
		// If the data selector is not parameterized, return the whole cache
		return this.getCachedResult();
	};

	DataSelector.prototype._clearCache = function(mParameters) {
		if (mParameters) {
			this._setParameterizedCachedResult(mParameters, null);
		} else {
			// Clear full cache
			var bIsParameterized = !!this.getParameterKey();
			this.setCachedResult(bIsParameterized ? {} : null);
		}
	};

	/**
	 * Clears the cached results and notifies update listeners.
	 *
	 * @param {object} [mParameters] - Parameter for which the cache should be cleared, if
	 * no parameter is provided, the whole cache is cleared
	 */
	DataSelector.prototype.clearCachedResult = function(mParameters) {
		this._clearCache(mParameters);
		// TODO: For now recalculate the dependent selectors,
		// it might be required to fully clear all dependent selectors
		// as well in the future
		this.getUpdateListeners().forEach(function(fnUpdateFunction) {
			fnUpdateFunction();
		});
	};

	DataSelector.prototype._setParameterizedCachedResult = function(mParameters, vValue) {
		var sParameterKey = this.getParameterKey();
		if (sParameterKey && mParameters) {
			var mNewData = {};
			var sParameter = mParameters[sParameterKey];
			mNewData[sParameter] = vValue;
			return this.setCachedResult(Object.assign(
				{},
				this.getCachedResult(),
				mNewData
			));
		}
		return this.setCachedResult(vValue);
	};

	/**
	 * Getter that triggers the execution of the derived state calculation or returns
	 * the value from the cache.
	 * @param {object} mParameters - Map containing the parameters for all instances in the selector chain
	 * @returns {any} Derived state object
	 */
	DataSelector.prototype.get = function(mParameters) {
		if (!this._bInitialized && this.getInitFunction()) {
			this.getInitFunction()(mParameters);
			this._bInitialized = true;
		}
		var sParameterKey = this.getParameterKey();
		if (sParameterKey && !(mParameters || {})[sParameterKey]) {
			throw new Error("Parameter '" + sParameterKey + "' is missing");
		}
		var vResult = this._getParameterizedCachedResult(mParameters);
		// eslint-disable-next-line eqeqeq
		if (vResult != null) {
			return vResult;
		}
		var oParentDataSelector = this.getParentDataSelector();
		var oData = oParentDataSelector && oParentDataSelector.get(mParameters);
		var vNewResult = this.getExecuteFunction()(
			oData,
			(mParameters || {})[sParameterKey]
		);
		this._setParameterizedCachedResult(mParameters, vNewResult);
		this.getUpdateListeners().forEach(function(fnUpdateFunction) {
			fnUpdateFunction();
		});
		return vNewResult;
	};

	/**
	 * Invokes the cache invalidation check and resets the cache if necessary
	 * @param {object} mParameters - Map of selector specific parameters
	 */
	DataSelector.prototype.checkUpdate = function(mParameters) {
		if (this.getCheckInvalidation()(mParameters)) {
			this._clearCache(mParameters);
			this.getUpdateListeners().forEach(function(fnUpdateFunction) {
				fnUpdateFunction();
			});
		}
	};

	return DataSelector;
});

/*!
 * OpenUI5
 * (c) Copyright 2009-2023 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides the base implementation for all model implementations
sap.ui.define([
	'sap/ui/mdc/field/ConditionType',
	'sap/ui/mdc/condition/ConditionValidateException',
	'sap/ui/mdc/condition/FilterOperatorUtil',
	'sap/ui/model/SimpleType',
	'sap/ui/model/FormatException',
	'sap/ui/model/ParseException',
	'sap/ui/model/ValidateException',
	'sap/base/util/merge',
	'sap/ui/base/SyncPromise'
],
	function(
		ConditionType,
		ConditionValidateException,
		FilterOperatorUtil,
		SimpleType,
		FormatException,
		ParseException,
		ValidateException,
		merge,
		SyncPromise
		) {
	"use strict";


	/**
	 * Constructor for a Conditions type.
	 *
	 * @class
	 * This class represents a type that is used to map an array of conditions to a single-value control
	 * (such as {@link sap.m.Input Input} or {@link sap.m.Text Text} control).
	 *
	 * @extends sap.ui.model.SimpleType
	 *
	 * @author SAP SE
	 * @version 1.113.0
	 *
	 * @since 1.62.0
	 * @private
	 * @ui5-restricted sap.ui.mdc.field.FieldBase, sap.fe
	 * @MDC_PUBLIC_CANDIDATE
	 *
	 * @param {object} [oFormatOptions] Formatting options
	 * @param {sap.ui.model.Type} [oFormatOptions.valueType] Type of the value of the condition (used for formatting, parsing and validating)
	 * @param {string[]} [oFormatOptions.operators] Possible operators to be used in the condition
	 * @param {sap.ui.mdc.enum.FieldDisplay} [oFormatOptions.display] DisplayFormat used to visualize a value
	 * @param {string} [oFormatOptions.fieldHelpID] ID of the field help to determine the key and description
	 * @param {boolean} [oFormatOptions.hideOperator] If set, only the value of the condition is shown, but no operator. (Use it only if just one operator is supported.)
	 * @param {int} [oFormatOptions.maxConditions] Maximum number of allowed conditions
	 * @param {sap.ui.model.Context} [oFormatOptions.bindingContext] <code>BindingContext</code> of field. Used to get a key or description from the value help using in/out parameters. (In a table, the value help might be connected to a different row)
	 * @param {sap.ui.model.Type} [oFormatOptions.originalDateType] Type used on field, for example, for date types; a different type is used internally to have different <code>formatOptions</code>
	 * @param {sap.ui.model.Type} [oFormatOptions.additionalType] additional Type used on other part of a field. (This is the case for unit fields.)
	 * @param {sap.ui.model.Type[]} [oFormatOptions.compositeTypes] additional Types used for parts of a <code>CompositeType</code>
	 * @param {function} [oFormatOptions.getConditions] Function to get the existing conditions of the field. Only used if <code>isUnit</code> is set. TODO: better solution
	 * @param {function} [oFormatOptions.asyncParsing] Callback function to tell the <code>Field</code> the parsing is asynchronous.
	 * @param {sap.ui.mdc.condition.ConditionObject} [oFormatOptions.navigateCondition] Condition of keyboard navigation. If this is filled, no real parsing is needed as the condition has already been determined and is just returned
	 * @param {object} [oFormatOptions.delegate] Field delegate to handle model-specific logic
	 * @param {object} [oFormatOptions.payload] Payload of the delegate
	 * @param {boolean} [oFormatOptions.preventGetDescription] If set, description is not read by <code>formatValue</code> as it is known that no description exists or might be set later
	 * @param {string} [oFormatOptions.defaultOperatorName] Name of the default <code>Operator</code>
	 * @param {boolean} [oFormatOptions.convertWhitespaces] If set, whitespaces will be replaced by special characters to display whitespaces in HTML
	 * @param {sap.ui.core.Control} [oFormatOptions.control] Instance if the calling control
	 * @param {boolean} [oFormatOptions.noFormatting] If set, the conditions will not be formatted (MultiInput value-property case)
	 * @param {string} [oFormatOptions.keepValue] If noFormatting is set, this value is used as output (To keep typed value during value help selection)
	 * @param {object} [oConstraints] Value constraints
	 * @alias sap.ui.mdc.field.ConditionsType
	 */
	var ConditionsType = SimpleType.extend("sap.ui.mdc.field.ConditionsType", /** @lends sap.ui.mdc.field.ConditionsType.prototype */ {

		constructor : function (oFormatOptions, oConstraints) {
			SimpleType.apply(this, arguments);
			this.sName = "Conditions";
			oFormatOptions = _createFormatOptionsForConditionType(oFormatOptions);
//			var oConstraints = merge({}, this.oConstraints);
			this._oConditionType = new ConditionType(oFormatOptions, this.oConstraints);
			this._oResourceBundle = sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");
		}

	});

	ConditionsType.prototype.destroy = function() {

		SimpleType.prototype.destroy.apply(this, arguments);

		if (this._oConditionType) { // to avoid issues in double destroy
			this._oConditionType.destroy();
			this._oConditionType = undefined;
		}

		this._bDestroyed = true;

	};

	ConditionsType.prototype.setFormatOptions = function(oFormatOptions) {

		SimpleType.prototype.setFormatOptions.apply(this, arguments);

		oFormatOptions = _createFormatOptionsForConditionType(oFormatOptions);
		if (this._oConditionType) {
			this._oConditionType.setFormatOptions(oFormatOptions);
		}

	};

	function _createFormatOptionsForConditionType(oFormatOptions) {

		oFormatOptions = merge({}, oFormatOptions);
		// remove asyncParsing as this is handled once for all conditions
		if (oFormatOptions.asyncParsing) {
			delete oFormatOptions.asyncParsing;
		}

		return oFormatOptions;

	}

	ConditionsType.prototype.setConstraints = function(oConstraints) {

		SimpleType.prototype.setConstraints.apply(this, arguments);

//		var oConstraints = merge({}, this.oConstraints);
		if (this._oConditionType) {
			this._oConditionType.setConstraints(this.oConstraints);
		}

	};

	/**
	 * Formats the given conditions to an output value of the given target type.
	 * This values are formatted using the given data type. Depending of the operator
	 * and the configuration (set in <code>FormatOptions</code>) a description will be determined via given value help or delegate.
	 *
	 * @param {sap.ui.mdc.condition.ConditionObject[]} aConditions
	 *	The conditions to be formatted
	 * @param {string} sTargetType
	 *	The target type; see {@link topic:ac56d92162ed47ff858fdf1ce26c18c4 Allowed Property Types}
	 *	In addition to the standard target types <code>sap.ui.mdc.raw</code> can be used. In this case the value is not formatted and just
	 *	forwarded to the target. If the value is an array representing data for a <code>CompositeType</code> the index of the needed raw value can be added to the
	 *	name (For example if a unit should be forwarded as raw value <code>sap.ui.mdc.raw:1</code> can be used).
	 * @return {any|Promise}
	 *	The formatted output value or a <code>Promise</code> resolving with the formatted value
	 * @throws {sap.ui.model.FormatException}
	 *	If formatting to the target type is not possible
	 *
	 * @private
	 * @ui5-restricted sap.ui.mdc.field.FieldBase, sap.fe
	 * @MDC_PUBLIC_CANDIDATE
	 */
	ConditionsType.prototype.formatValue = function(aConditions, sTargetType) {

		if (aConditions == undefined || aConditions == null || this._bDestroyed) { // if destroyed do nothing
			return null;
		}

		if (!Array.isArray(aConditions)) {
			throw new FormatException("No valid conditions provided");
		}

		var vValue;

		if (!sTargetType || sTargetType === "string" || sTargetType === "any") {
			vValue = ""; // if string requested use string
		} else if (sTargetType === "float" || sTargetType === "int") {
			vValue = 0; // if number requested use number
		}

		if (_getNoFormatting.call(this)) { // For MultiInput the value should only be parsed, the output of the conditions will be shown in Tokens
			return _getKeepValue.call(this) || vValue;
		}

		var iMaxConditions = _getMaxConditions.call(this);

		var aSyncPromises = [];
		var fnCreateSyncPromise = function (oCondition, sTargetType) { // as function should not be declared inside a loop
			return SyncPromise.resolve().then(function() {
				return this._oConditionType.formatValue(oCondition, sTargetType);
			}.bind(this));
		};

		for (var i = 0; i < aConditions.length; i++) {
			aSyncPromises.push(fnCreateSyncPromise.call(this, aConditions[i], sTargetType));

			if (iMaxConditions > 0 && i >= iMaxConditions - 1) {
				break;
			}
		}

		return SyncPromise.all(aSyncPromises).then(function(aFormattedValues) {
			return _concatenateFormattedValues.call(this, aFormattedValues, vValue);
		}.bind(this)).unwrap();

	};

	function _concatenateFormattedValues(aFormattedValues, vValue) {

		for (var i = 0; i < aFormattedValues.length; i++) {
			if (vValue) {
				vValue = vValue + this._oResourceBundle.getText("field.SEPARATOR") +  aFormattedValues[i];
			} else {
				vValue =  aFormattedValues[i];
			}
		}

		return vValue;

	}

	/**
	 * Parses an external value of the given source type to an array of conditions that holds the value in model
	 * representation.
	 * These values are parsed using the given data type. Depending of the operator
	 * and the configuration (set in <code>FormatOptions</code>) a value will be determined via given value help or delegate.
	 *
	 * @param {any} vValue
	 *	The value to be parsed
	 * @param {string} sSourceType
	 *	The type of the given value; see
	 *	{@link topic:ac56d92162ed47ff858fdf1ce26c18c4 Allowed Property Types}
	 *	In addition to the standard source types <code>sap.ui.mdc.raw</code> can be used. In this case the value is not parsed and just
	 *	used in the condition. If the value of the condition is an array representing data for a <code>CompositeType</code> the index of the needed raw value can be added to the
	 *	name (For example if a unit should be forwarded as raw value <code>sap.ui.mdc.raw:1</code> can be used).
	 * @return {null|sap.ui.mdc.condition.ConditionObject[]|Promise<null|sap.ui.mdc.condition.ConditionObject[]>}
	 *	The array of conditions or a <code>Promise</code> resolving with the array of conditions.
	 *  If there is no value <code>null</code> is returned.
	 * @throws {sap.ui.model.ParseException}
	 *	If parsing to the model type is not possible; the message of the exception is language
	 *	dependent as it may be displayed on the UI
	 *
	 * @private
	 * @ui5-restricted sap.ui.mdc.field.FieldBase, sap.fe
	 * @MDC_PUBLIC_CANDIDATE
	 */
	ConditionsType.prototype.parseValue = function(vValue, sSourceType) {

		if (this._bDestroyed) { // if destroyed do nothing
			return null;
		}

		// TODO: support multiple conditions (list separated by delimiter) ?

		if (_getNoFormatting.call(this) && vValue === "") { // For MultiInput clearing value doesn't need to be validated
			return this.oFormatOptions.getConditions ? this.oFormatOptions.getConditions() : [];
		}

		var aConditions = SyncPromise.resolve().then(function() {
			return this._oConditionType.parseValue(vValue, sSourceType);
		}.bind(this)).then(function(oCondition) {
			return _parseConditionToConditions.call(this, oCondition);
		}.bind(this)).unwrap();

		if (aConditions instanceof Promise && this.oFormatOptions.asyncParsing) {
			this.oFormatOptions.asyncParsing(aConditions);
		}

		return aConditions;

	};

	function _parseConditionToConditions(oCondition) {

		var bIsUnit = _isUnit(this.oFormatOptions.valueType);
		var aConditions = this.oFormatOptions.getConditions && this.oFormatOptions.getConditions();
		var iMaxConditions = _getMaxConditions.call(this);

		if (iMaxConditions !== 1 && this.oFormatOptions.getConditions) {
			// if more than one condition is allowed add the new condition to the existing ones. (Only if not already exist)
			if (oCondition) {
				// add new condition
				if (_isCompositeType(this.oFormatOptions.valueType) && !bIsUnit && aConditions.length === 1 &&
					(aConditions[0].values[0][0] === null || aConditions[0].values[0][0] === undefined || aConditions[0].values[0][1] === null || aConditions[0].values[0][1] === undefined) &&
					(oCondition.values[0][0] !== null && oCondition.values[0][0] !== undefined && oCondition.values[0][1] !== null && oCondition.values[0][1] !== undefined)) {
					// if there is already a condition containing only a unit and no numeric value, remove it and use the new condition
					aConditions.splice(0, 1);
				}
				if (FilterOperatorUtil.indexOfCondition(oCondition, aConditions) === -1) { // check if already exist
					aConditions.push(oCondition);
				} else {
					throw new ParseException(this._oResourceBundle.getText("field.CONDITION_ALREADY_EXIST", [oCondition.values[0]]));
				}

				if (iMaxConditions > 0 && iMaxConditions < aConditions.length) {
					// remove first conditions to meet maxConditions
					aConditions.splice(0, aConditions.length - iMaxConditions);
				}
			}

			return aConditions;
		} else if (bIsUnit && this.oFormatOptions.getConditions && aConditions.length > 1) { // if olny one condition exist, just take it
			// For Currency/Unit Fields with multiple values we currently only support one unit which is valid for all numeric values.
			// So update all conditions with unit. (only if not only a unit is shown)
			// TODO better solution
			var sUnit = oCondition && oCondition.values[0][1];
			var oInParameters = oCondition && oCondition.inParameters;
			var oOutParameters = oCondition && oCondition.outParameters;
			var oPayload = oCondition && oCondition.payload;
			for (var i = 0; i < aConditions.length; i++) {
				aConditions[i].values[0][1] = sUnit;
				if (sUnit === undefined) {
					// for empty unit use updated number (0)
					aConditions[i].values[0][0] = oCondition.values[0][0];
				}
				aConditions[i].values[0].splice(2); // do not have the unit table after parsing
				if (aConditions[i].operator === "BT") {
					aConditions[i].values[1][1] = sUnit;
					if (sUnit === undefined) {
						// for empty unit use updated number (0)
						aConditions[i].values[1][0] = oCondition.values[0][0];
					}
					aConditions[i].values[1].splice(2); // do not have the unit table after parsing
				}
				if (oInParameters || aConditions[i].inParameters) {
					aConditions[i].inParameters = oInParameters;
				}
				if (oOutParameters || aConditions[i].outParameters) {
					aConditions[i].outParameters = oOutParameters;
				}
				if (oPayload || aConditions[i].payload) {
					aConditions[i].payload = oPayload;
				}
			}
			if (aConditions.length === 0) {
				aConditions.push(oCondition);
			}
			return aConditions;
		} else if (oCondition) {
			return [oCondition];
		} else {
			return [];
		}

	}

	/**
	 * Validates a given array of conditions. The values of the conditions are validated using the given data type.
	 *
	 * @param {sap.ui.mdc.condition.ConditionObject[]} aConditions
	 *	The conditions to be validated
	 * @returns {void|Promise}
	 *	<code>undefined</code> or a <code>Promise</code> resolving with an undefined value
	 * @throws {sap.ui.mdc.condition.ConditionValidateException}
	 *	If at least one of the values of the conditions is not valid for the given data type; the message of the exception is
	 *	language dependent as it may be displayed on the UI
	 *
	 * @private
	 * @ui5-restricted sap.ui.mdc.field.FieldBase, sap.fe
	 * @MDC_PUBLIC_CANDIDATE
	 */
	ConditionsType.prototype.validateValue = function(aConditions) {

		if (aConditions === undefined || aConditions === null || this._bDestroyed) { // if destroyed do nothing
			return;
		}

		if (!Array.isArray(aConditions)) {
			throw new ConditionValidateException("No valid conditions provided", undefined, undefined, aConditions);
		}

		try {
			for (var i = 0; i < aConditions.length; i++) {
				var oCondition = aConditions[i];
				this._oConditionType.validateValue(oCondition);
			}

			var iMaxConditions = _getMaxConditions.call(this);

			if (aConditions.length === 0 && iMaxConditions === 1) {
				// test if type is nullable. Only for single-value Fields. For MultiValue only real conditions should be checked for type
				this._oConditionType.validateValue(null);
			}
		} catch (oException) {
			// add conditions to exception to improve mapping in FieldBase handleValidationError
			if (oException instanceof ConditionValidateException) {
				oException.setConditions(aConditions);
			} else if (oException instanceof ValidateException) {
				throw new ConditionValidateException(oException.message, oException.violatedConstraints, merge({}, oCondition));
			}
			throw oException;
		}

	};

	function _getMaxConditions() {

		var iMaxConditions = 1;

		if (this.oFormatOptions.hasOwnProperty("maxConditions")) {
			iMaxConditions = this.oFormatOptions.maxConditions;
		}

		return iMaxConditions;

	}

	function _isUnit(oType) {

		if (_isCompositeType(oType)) {
			var oFormatOptions = oType.getFormatOptions();
			var bShowMeasure = !oFormatOptions || !oFormatOptions.hasOwnProperty("showMeasure") || oFormatOptions.showMeasure;
			var bShowNumber = !oFormatOptions || !oFormatOptions.hasOwnProperty("showNumber") || oFormatOptions.showNumber;
			var bShowTimezone = !oFormatOptions || !oFormatOptions.hasOwnProperty("showTimezone") || oFormatOptions.showTimezone; // handle timezone as unit
			var bShowDate = !oFormatOptions || !oFormatOptions.hasOwnProperty("showDate") || oFormatOptions.showDate;
			var bShowTime = !oFormatOptions || !oFormatOptions.hasOwnProperty("showTime") || oFormatOptions.showTime;
			if ((bShowMeasure && !bShowNumber) || (bShowTimezone && !bShowDate && !bShowTime)) {
				return true;
			}
		}

		return false;

	}

	function _isCompositeType(oType) {

		return oType && oType.isA("sap.ui.model.CompositeType");

	}

	function _getNoFormatting() {

		var bNoFormatting = false;

		if (this.oFormatOptions.hasOwnProperty("noFormatting")) {
			bNoFormatting = this.oFormatOptions.noFormatting;
		}

		return bNoFormatting;

	}

	function _getKeepValue() {


		if (this.oFormatOptions.hasOwnProperty("keepValue")) {
			return this.oFormatOptions.keepValue;
		}

		return null;

	}

	return ConditionsType;

});

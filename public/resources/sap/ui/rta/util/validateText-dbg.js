/*!
 * OpenUI5
 * (c) Copyright 2009-2023 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	"sap/ui/base/BindingParser",
	"sap/ui/core/Core"
], function(
	BindingParser,
	Core
) {
	"use strict";

	var sEmptyTextKey = "\xa0";
	var oValidators = {
		noEmptyText: {
			validatorFunction: function(sNewText) {
				return sNewText !== sEmptyTextKey;
			},
			errorMessage: Core.getLibraryResourceBundle("sap.ui.rta").getText("RENAME_EMPTY_ERROR_TEXT")
		}
	};

	function checkPreconditionsAndThrowError(sNewText, sOldText) {
		if (sOldText === sNewText) {
			throw Error("sameTextError");
		}
		var oBindingParserResult;
		var bError;

		try {
			oBindingParserResult = BindingParser.complexParser(sNewText, undefined, true);
		} catch (error) {
			bError = true;
		}

		if (oBindingParserResult && typeof oBindingParserResult === "object" || bError) {
			throw Error(sap.ui.getCore().getLibraryResourceBundle("sap.ui.rta").getText("RENAME_BINDING_ERROR_TEXT"));
		}
	}

	return function(sNewText, sOldText, oAction) {
		checkPreconditionsAndThrowError(sNewText, sOldText);
		var sErrorText;
		var aValidators = oAction && oAction.validators || [];

		aValidators.some(function(vValidator) {
			var oValidator;

			if (
				typeof vValidator === "string" && oValidators[vValidator]
			) {
				oValidator = oValidators[vValidator];
			} else {
				oValidator = vValidator;
			}

			if (!oValidator.validatorFunction(sNewText)) {
				sErrorText = oValidator.errorMessage;
				return true;
			}

			return false;
		});

		if (sErrorText) {
			throw Error(sErrorText);
		}
	};
}, true);
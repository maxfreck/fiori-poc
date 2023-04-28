/*
 * ! OpenUI5
 * (c) Copyright 2009-2023 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	"sap/base/util/includes",
	"sap/ui/core/Core",
	"sap/ui/fl/apply/_internal/controlVariants/Utils",
	"sap/ui/fl/apply/_internal/flexObjects/FlexObjectFactory"
], function(
	includes,
	Core,
	ControlVariantUtils,
	FlexObjectFactory
) {
	"use strict";

	/**
	 * Collection of functions to initialize the FlexState maps
	 *
	 * @namespace sap.ui.fl.apply._internal.flexState.InitialPrepareFunctions
	 * @since 1.110
	 * @private
	 * @ui5-restricted
	 */
	var InitialPrepareFunctions = {};

	InitialPrepareFunctions.variants = function(mPropertyBag) {
		var aVariantIds = (mPropertyBag.storageResponse.changes.variants || [])
			.map(function(oVariantDef) {
				return oVariantDef.fileName;
			});

		// Look through the variant references of known variants to find the standard
		// variant id on any variant that directly inherited from it
		// If it is not part of the runtime persistence, create it
		// If there are no custom variants at all, the VariantModel will create the
		// standard variant
		var oUpdate = {};
		(mPropertyBag.storageResponse.changes.variants || []).some(function(oVariant) {
			var sVariantReference = oVariant.variantReference;
			if (sVariantReference && !includes(aVariantIds, sVariantReference)) {
				var oResourceBundle = Core.getLibraryResourceBundle("sap.ui.fl");
				var oNewVariant = FlexObjectFactory.createFlVariant({
					id: sVariantReference,
					variantManagementReference: oVariant.variantManagementReference,
					variantName: oResourceBundle.getText("STANDARD_VARIANT_TITLE"),
					user: ControlVariantUtils.DEFAULT_AUTHOR,
					reference: oVariant.reference
				});
				oUpdate.runtimePersistence = {
					runtimeOnlyData: {
						flexObjects: [oNewVariant]
					}
				};
				return true;
			}
			return false;
		});

		return oUpdate;
	};

	InitialPrepareFunctions.uiChanges = function() {
		// For now this is handled by the ChangePersistence
		// to improve performance until we can distinguish changes during
		// the data selector invalidation
	};

	return InitialPrepareFunctions;
});

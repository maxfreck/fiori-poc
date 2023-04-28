/*!
 * OpenUI5
 * (c) Copyright 2009-2023 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	"sap/m/p13n/Engine",
	"sap/ui/mdc/flexibility/Util",
	"sap/ui/fl/changeHandler/Base",
	"sap/ui/fl/changeHandler/condenser/Classification"
], function(Engine, Util, FLChangeHandlerBase, CondenserClassification) {
	"use strict";

	var fFinalizeGroupChange = function (oChange, oControl, oGroupContent, bIsRevert) {
		if (bIsRevert) {
			// Clear the revert data on the change
			oChange.resetRevertData();
		} else {
			// Set revert data on the change
			oChange.setRevertData(oGroupContent);
		}
	};

	var fAddGroup = function (oChange, oControl, mPropertyBag, sChangeReason) {
		return new Promise(function (resolve, reject) {
			var bIsRevert = (sChangeReason === Util.REVERT);
			var oModifier = mPropertyBag.modifier;
			var oChangeContent = bIsRevert ? oChange.getRevertData() : oChange.getContent();
			Promise.resolve()
				.then(oModifier.getProperty.bind(oModifier, oControl, "groupConditions"))
				.then(function(oGroupConditions) {
					var aValue = oGroupConditions ? oGroupConditions.groupLevels : [];

					var oGroupContent = {
						name: oChangeContent.name
					};

					aValue.splice(oChangeContent.index, 0, oGroupContent);

					oGroupConditions = {
						groupLevels: aValue
					};
					oModifier.setProperty(oControl, "groupConditions", oGroupConditions);

					fFinalizeGroupChange(oChange, oControl, oGroupContent, bIsRevert);
					resolve();
				})
				.catch(function(oError) {
					reject(oError);
				});
		});
	};

	var fRemoveGroup = function (oChange, oControl, mPropertyBag, sChangeReason) {
		return new Promise(function (resolve, reject) {
			var bIsRevert = (sChangeReason === Util.REVERT);
			var oModifier = mPropertyBag.modifier;
			var oChangeContent = bIsRevert ? oChange.getRevertData() : oChange.getContent();
			Promise.resolve()
				.then(oModifier.getProperty.bind(oModifier, oControl, "groupConditions"))
				.then(function(oGroupConditions) {
					var aValue = oGroupConditions ? oGroupConditions.groupLevels : [];

					if (!aValue) {
						// Nothing to remove
						reject();
					}

					var aFoundValue = aValue.filter(function (o) {
						return o.name === oChangeContent.name;
					});
					var iIndex = aValue.indexOf(aFoundValue[0]);

					if (iIndex > -1) {
						aValue.splice(iIndex, 1);
					} else {
						// In case the specified change is already existing (e.g. nothing to be removed) we need to ignore the change gracefully and mark it as not applicable
						return FLChangeHandlerBase.markAsNotApplicable("The specified change is already existing - change appliance ignored", true);
					}

					oGroupConditions = {
						groupLevels: aValue
					};
					oModifier.setProperty(oControl, "groupConditions", oGroupConditions);

					fFinalizeGroupChange(oChange, oControl, oChangeContent, bIsRevert);
					resolve();
				})
				.catch(function(oError) {
					reject(oError);
				});
		});
	};

	var fMoveGroup = function (oChange, oControl, mPropertyBag, sChangeReason) {
		return new Promise(function (resolve, reject) {
			var bIsRevert = (sChangeReason === Util.REVERT);
			var oModifier = mPropertyBag.modifier;
			var oChangeContent = bIsRevert ? oChange.getRevertData() : oChange.getContent();
			Promise.resolve()
				.then(oModifier.getProperty.bind(oModifier, oControl, "groupConditions"))
				.then(function(oGroupConditions) {
					var aValue = oGroupConditions ? oGroupConditions.groupLevels : [];

					var aFoundValue = aValue.filter(function (o) {
						return o.name === oChangeContent.name;
					});

					//remove the item from the 'GroupConditions' array, insert it at the new position
					var iOldIndex = aValue.indexOf(aFoundValue[0]);
					aValue.splice(oChangeContent.index, 0, aValue.splice(iOldIndex, 1)[0]);

					oGroupConditions = {
						groupLevels: aValue
					};
					oModifier.setProperty(oControl, "groupConditions", oGroupConditions);

					//finalize the 'moveGroup' change (only persist name + index)
					fFinalizeGroupChange(oChange, oControl, oChangeContent, bIsRevert);
					resolve();
				})
			.catch(function(oError) {
				reject(oError);
			});
		});
	};

	var Group = {};
	Group.addGroup = Util.createChangeHandler({
		apply: fAddGroup,
		revert: fRemoveGroup,
		getCondenserInfo: function(oChange, mPropertyBag) {
			return {
				affectedControl: {id: oChange.getContent().name},
				affectedControlIdProperty: "name",
				targetContainer: oChange.getSelector(),
				targetAggregation: "groupLevels",
				customAggregation: mPropertyBag.modifier.bySelector(oChange.getSelector(), mPropertyBag.appComponent).getGroupConditions().groupLevels,
				classification: CondenserClassification.Create,
				setTargetIndex: function(oChange, iNewTargetIndex) {
					oChange.getContent().index = iNewTargetIndex;
				},
				getTargetIndex: function(oChange) {
					return oChange.getContent().index;
				}
			};
		}
	});

	Group.removeGroup = Util.createChangeHandler({
		apply: fRemoveGroup,
		revert: fAddGroup,
		getCondenserInfo: function(oChange, mPropertyBag) {
			return {
				affectedControl: {id: oChange.getContent().name},
				affectedControlIdProperty: "name",
				targetContainer: oChange.getSelector(),
				targetAggregation: "groupLevels",
				customAggregation: mPropertyBag.modifier.bySelector(oChange.getSelector(), mPropertyBag.appComponent).getGroupConditions().groupLevels,
				classification: CondenserClassification.Destroy,
				sourceIndex: oChange.getRevertData().index
			};
		}
	});

	Group.moveGroup = Util.createChangeHandler({
		apply: fMoveGroup,
		revert: fMoveGroup,
		getCondenserInfo: function(oChange, mPropertyBag) {
			return {
				affectedControl: {id: oChange.getContent().name},
				affectedControlIdProperty: "name",
				targetContainer: oChange.getSelector(),
				targetAggregation: "groupLevels",
				classification: CondenserClassification.Move,
				//sourceIndex: oChange.getContent().index,
				sourceIndex: oChange.getRevertData().index,
				customAggregation: mPropertyBag.modifier.bySelector(oChange.getSelector(), mPropertyBag.appComponent).getGroupConditions().groupLevels,
				sourceContainer: oChange.getSelector(),
				sourceAggregation: "groupLevels",
				setTargetIndex: function(oChange, iNewTargetIndex) {
					oChange.getContent().index = iNewTargetIndex;
				},
				getTargetIndex: function(oChange) {
					return oChange.getContent().index;
				}
			};
		}
	});

	return Group;
});
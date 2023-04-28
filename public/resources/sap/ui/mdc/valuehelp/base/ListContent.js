/*!
 * OpenUI5
 * (c) Copyright 2009-2023 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/mdc/valuehelp/base/Content","sap/ui/mdc/enum/ConditionValidated"],function(e,t){"use strict";var i=e.extend("sap.ui.mdc.valuehelp.base.ListContent",{metadata:{library:"sap.ui.mdc",properties:{caseSensitive:{type:"boolean",defaultValue:false},useFirstMatch:{type:"boolean",group:"Behavior",defaultValue:true},useAsValueHelp:{type:"boolean",group:"Behavior",defaultValue:true}},aggregations:{},events:{}}});i.prototype.init=function(){e.prototype.init.apply(this,arguments);this._oObserver.observe(this,{properties:["caseSensitive"]})};i.prototype._observeChanges=function(t){if(t.name==="caseSensitive"){this._handleFilterValueUpdate(t)}e.prototype._observeChanges.apply(this,arguments)};i.prototype.getCount=function(e){var i=0;for(var a=0;a<e.length;a++){var n=e[a];if(n.isEmpty!==true&&n.validated===t.Validated){i++}}return i};i.prototype.getListBinding=function(){throw new Error("ListContent: Every listcontent must implement this method.")};return i});
//# sourceMappingURL=ListContent.js.map
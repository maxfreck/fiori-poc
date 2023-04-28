/*!
 * OpenUI5
 * (c) Copyright 2009-2023 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";var e="sap.ui.fl";return{forEachObjectInStorage:function(r,t){var n=r.storage.getItems&&r.storage.getItems()||r.storage;return Promise.resolve(n).then(function(n){var i=Object.keys(n).map(function(i){var a=i.includes(e);if(!a){return}var c=n[i];var o=r.storage._itemsStoredAsObjects?c:JSON.parse(c);var s=true;if(r.reference){s=this.isSameReference(o,r.reference)}var u=true;if(r.layer){u=o.layer===r.layer}if(!s||!u){return}return t({changeDefinition:o,key:i})}.bind(this));return Promise.all(i)}.bind(this))},getAllFlexObjects:function(e){var r=[];return this.forEachObjectInStorage(e,function(e){r.push(e)}).then(function(){return r})},createFlexKey:function(r){if(r){return e+"."+r}},createFlexObjectKey:function(e){return this.createFlexKey(e.fileName)},isSameReference:function(e,r){var t=r.endsWith(".Component")?r.replace(/\.Component$/,""):r+".Component";return e.reference===r||e.reference===t}}});
//# sourceMappingURL=ObjectStorageUtils.js.map
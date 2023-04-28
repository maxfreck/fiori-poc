/*!
 * OpenUI5
 * (c) Copyright 2009-2023 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/Log","sap/ui/mdc/enum/ConditionValidated"],function(n,i){"use strict";var e=function(n){return JSON.stringify(Object.assign({},n,{isEmpty:undefined}),function(n,i){return i===undefined?"[undefined]":i})};var t={createItemCondition:function(n,e,t,r,a){var o=i.NotValidated;var u=[n,e];if(e===null||e===undefined){u.pop()}else{o=i.Validated}return this.createCondition("EQ",u,t,r,o,a)},createCondition:function(n,i,e,t,r,a){var o={operator:n,values:i,isEmpty:null,validated:r};if(e){o.inParameters=e}if(t){o.outParameters=t}if(a){o.payload=a}return o},compareConditions:function(n,i){var t=e(n);var r=e(i);return t===r},_removeEmptyConditions:function(n){for(var i=n.length-1;i>-1;i--){if(n[i].isEmpty){n.splice(parseInt(i),1)}}return n},_removeInitialFlags:function(n){for(var i=n.length-1;i>-1;i--){if(n[i].isInitial){delete n[i].isInitial}}return n}};return t},true);
//# sourceMappingURL=Condition.js.map
/*!
 * OpenUI5
 * (c) Copyright 2009-2023 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	"sap/m/library",
	"sap/ui/core/library",
	"sap/ui/core/Configuration",
	"sap/base/Log",
	"sap/ui/Device",
	"sap/ui/base/ManagedObject",
	"sap/ui/integration/util/Utils",
	"sap/m/IllustratedMessage",
	"sap/m/IllustratedMessageType",
	"sap/m/IllustratedMessageSize",
	"sap/m/Button",
	"sap/m/Dialog",
	"sap/m/Text",
	"sap/m/Bar",
	"sap/m/Title",
	"sap/ui/base/BindingParser",
	"sap/m/HBox"
], function (
	library,
	coreLibrary,
	Configuration,
	Log,
	Device,
	ManagedObject,
	Utils,
	IllustratedMessage,
	IllustratedMessageType,
	IllustratedMessageSize,
	Button,
	Dialog,
	Text,
	Bar,
	Title,
	BindingParser,
	HBox) {
	"use strict";

	var TitleLevel = coreLibrary.TitleLevel;
	var FlexRendertype = library.FlexRendertype;
	var FlexJustifyContent = library.FlexJustifyContent;
	var FlexAlignItems = library.FlexAlignItems;

	function formatJson(oJson) {
		return BindingParser.complexParser.escape(JSON.stringify(oJson, null, 4));
	}

	function formatRequest(oRequest) {
		if (oRequest.options) {
			oRequest.options.body = oRequest.body && oRequest.body.toString();
			oRequest.options.headers = Object.fromEntries(oRequest.options.headers);
		}

		return formatJson(oRequest);
	}

	/**
	 * Utility class for handling errors in the cards.
	 *
	 * @author SAP SE
	 * @version 1.113.0
	 *
	 * @private
	 * @ui5-restricted
	 * @alias sap.ui.integration.util.ErrorHandler
	 */
	var ErrorHandler = ManagedObject.extend("sap.ui.integration.util.ErrorHandler", {
		metadata: {
			library: "sap.ui.integration",
			properties: {
				card: {type: "object"}
			}
		}
	});

	/**
	 * @private
	 * @ui5-restricted sap.ui.integration.widgets.Card
	 * @param {object} mErrorInfo Settings for illustration and information for the occurred error, if it is error
	 * @param {boolean} [bIsNoData] Whether the illustration is for no data case
	 * @returns {sap.ui.core.Control} Illustration
	 */
	ErrorHandler.prototype.getIllustratedMessage = function (mErrorInfo, bIsNoData) {
		if (mErrorInfo.requestErrorParams) {
			mErrorInfo = this._configureDataRequestErrorInfo(mErrorInfo);
		} else if (!bIsNoData) {
			mErrorInfo = this._configureErrorInfo(mErrorInfo);
		}

		return this._createIllustratedMessage(mErrorInfo, bIsNoData);
	};

	/*
	 * @private
	 */
	ErrorHandler.prototype._createIllustratedMessage = function (mErrorInfo, bIsNoData) {
		var sIllustratedMessageType = mErrorInfo.type || IllustratedMessageType.ErrorScreen,
			sIllustratedMessageSize = mErrorInfo.size || IllustratedMessageSize.Auto,
			sBoxHeight = "",
			sTitle = mErrorInfo.title,
			sDescription =  mErrorInfo.description,
			sDetails = mErrorInfo.details,
			oCard = this.getCard();

		oCard._oContentMessage = {
			type: bIsNoData ? "noData" : "error",
			illustrationType: sIllustratedMessageType,
			illustrationSize: sIllustratedMessageSize,
			title: sTitle,
			description: sDescription,
			details: sDetails
		};

		var oIllustratedMessage = new IllustratedMessage({
			illustrationType: sIllustratedMessageType,
			illustrationSize: sIllustratedMessageSize,
			title: sTitle,
			enableDefaultTitleAndDescription: false,
			enableVerticalResponsiveness: true,
			description: sDescription
		});

		if (sDetails) {
			if (Configuration.getDebug()) {
				oIllustratedMessage.addAdditionalContent(new Button({
					text: oCard.getTranslatedText("CARD_BUTTON_SHOW_MORE"),
					press: function () {
						var oText = new Text({
							renderWhitespace: true,
							text: sDetails
						}).addStyleClass("sapUiSmallMargin");

						var oDialog = new Dialog({
							stretch: Device.system.phone,
							customHeader: new Bar({
								contentMiddle: new Title({
									text: oCard.getTranslatedText("CARD_ERROR_DIALOG_TITLE"),
									level: TitleLevel.H1
								}),
								contentRight: new Button({
									icon: "sap-icon://copy",
									tooltip: oCard.getTranslatedText("CARD_TEXT_COPY"),
									press: function () {
										var oRange = document.createRange(),
											oTextDomRef = oText.getDomRef();

										oRange.selectNode(oTextDomRef);
										window.getSelection().removeAllRanges(); // clear current selection
										window.getSelection().addRange(oRange); // to select text
										window.navigator.clipboard.writeText(oTextDomRef.textContent);
									}
								})
							}),
							content: oText,
							buttons: [
								new Button({
									text: oCard.getTranslatedText("CARD_DIALOG_CLOSE_BUTTON"),
									press: function () {
										oDialog.close();
									}
								})
							],
							afterClose: function () {
								oDialog.destroy();
							}
						});

						oDialog.open();
					}
				}));
			} else {
				Log.error(sDetails);
			}
		}

		if (oCard.getCardContent() && oCard.getCardContent().getDomRef()) {
			sBoxHeight = oCard.getCardContent().getDomRef().offsetHeight + "px";
		}

		var oFlexBox = new HBox({
			renderType: FlexRendertype.Bare,
			justifyContent: FlexJustifyContent.Center,
			alignItems: FlexAlignItems.Center,
			width: "100%",
			height: sBoxHeight,
			items: [oIllustratedMessage]
		}).addStyleClass("sapFCardErrorContent");

		return oFlexBox;
	};

	ErrorHandler.prototype._configureDataRequestErrorInfo = function (mErrorInfo) {
		var oCard = this.getCard(),
			oResponse = mErrorInfo.requestErrorParams.response,
			sResponseText = mErrorInfo.requestErrorParams.responseText,
			sType = IllustratedMessageType.ErrorScreen,
			sTitle = oResponse ? oResponse.status + " " + oResponse.statusText : oCard.getTranslatedText("CARD_ERROR_OCCURED"),
			sDescription = oResponse ? oCard.getTranslatedText("CARD_ERROR_REQUEST_DESCRIPTION") : mErrorInfo.requestErrorParams.message,
			requestSettings = mErrorInfo.requestSettings,
			sUrl = requestSettings.request ? requestSettings.request.url : "",
			sDetails = oCard.getTranslatedText("CARD_ERROR_REQUEST_DETAILS", [sUrl]);

		if (oResponse) {
			switch (oResponse.status) {
				case 0:
					switch (oResponse.statusText) {
						case "timeout":
							sType = IllustratedMessageType.ReloadScreen;
							sTitle = "408 " + oCard.getTranslatedText("CARD_ERROR_REQUEST_TIMEOUT_TITLE");
							sDetails = oCard.getTranslatedText("CARD_ERROR_REQUEST_TIMEOUT_DETAILS", [sUrl]);
							break;
						default:
							sType = IllustratedMessageType.PageNotFound;
							sTitle = "404 " + oCard.getTranslatedText("CARD_ERROR_REQUEST_NOTFOUND_TITLE");
							break;
					}
					break;
				case 404:
					sType = IllustratedMessageType.PageNotFound;
					if (!oResponse.statusText) {
						sTitle = "404 " + oCard.getTranslatedText("CARD_ERROR_REQUEST_NOTFOUND_TITLE");
					}
					break;
				case 408:
					sType = IllustratedMessageType.ReloadScreen;
					sDetails = oCard.getTranslatedText("CARD_ERROR_REQUEST_TIMEOUT_DETAILS", [sUrl]);
					break;
				case 401: // Unauthorized
				case 403: // Forbidden
				case 511: // Network Authentication Required
					sDescription = oCard.getTranslatedText("CARD_ERROR_REQUEST_ACCESS_DENIED_DESCRIPTION");
					break;
			}
		}

		sDetails = sTitle + "\n" +
			sDescription + "\n\n";

		if (oResponse) {
			sDetails += oCard.getTranslatedText("CARD_LOG_MSG") + "\n" +
				oResponse.statusText + "\n\n";
		}

		sDetails += oCard.getTranslatedText("CARD_REQUEST_SETTINGS") + "\n" +
			formatJson(requestSettings) + "\n\n";

		if (oResponse) {
			sDetails += oCard.getTranslatedText("CARD_REQUEST") + "\n" +
				formatRequest(mErrorInfo.requestErrorParams.settings) + "\n\n" +
				oCard.getTranslatedText("CARD_RESPONSE_HEADERS") + "\n" +
				formatJson(Object.fromEntries(oResponse.headers)) + "\n\n";
		}

		if (oResponse && sResponseText) {
			sDetails += oCard.getTranslatedText("CARD_RESPONSE") + "\n";

			if (Utils.isJson(sResponseText)) {
				sDetails += formatJson(JSON.parse(sResponseText));
			} else {
				sDetails += BindingParser.complexParser.escape(sResponseText);
			}

			sDetails += "\n\n";
		}

		sDetails += oCard.getTranslatedText("CARD_MANIFEST") + "\n" + formatJson(oCard._oCardManifest.getJson()) + "\n\n";

		sDetails += oCard.getTranslatedText("CARD_STACK_TRACE") + "\n" + new Error().stack;

		return {
			type: sType,
			title: sTitle,
			description: sDescription,
			details: sDetails
		};
	};

	ErrorHandler.prototype._configureErrorInfo = function (mErrorInfo) {
		var oCard = this.getCard(),
			sDetails = oCard.getTranslatedText("CARD_MANIFEST") + "\n" + formatJson(oCard._oCardManifest.getJson()) + "\n\n" +
				oCard.getTranslatedText("CARD_STACK_TRACE") + "\n" + new Error().stack;

		return {
			type: mErrorInfo.type,
			title: mErrorInfo.title,
			description: mErrorInfo.description,
			details: sDetails
		};
	};

	return ErrorHandler;
});

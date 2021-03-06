sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"com/erpx/site/prulia/PRULIA/utils/SmartPartner"
], function (Controller, SmartPartner) {
	"use strict";

	return Controller.extend("com.erpx.site.prulia.PRULIA.controller.SmartPartnerDetail", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.erpx.site.prulia.PRULIA.view.NewsDetail
		 */
			
		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("SmartPartnerDetail").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function (oEvent) {
			this.getOwnerComponent().getModel("appParam").setProperty("/showBack", true);
			this.getOwnerComponent().getModel("appParam").setProperty("/busy", true);
			var smartPartnerID = oEvent.getParameter("arguments").smartpartnerid;
			SmartPartner.getInstance().getModel().then(
				function(oModel){
					this.getView().setModel(oModel,"SmartPartner");
					for(var i = 0; i < oModel.getProperty("/").length; i++){
						if(oModel.getProperty("/")[i].name === smartPartnerID){
							break;
						}
					}
					this.getView().bindElement({
						path: "/" + i,
						model: "SmartPartner",
						events : {
							change: this._onBindingChange.bind(this),
						}
					});
				}.bind(this),
				function(error){
					console.log(error);
				}.bind(this)
			).always(function(){
				this.getOwnerComponent().getModel("appParam").setProperty("/busy", false);
			}.bind(this))
		},
		_onBindingChange : function (oEvent) {
			// No data for the binding
			if (!this.getView().getElementBinding("SmartPartner")) {
				sap.ui.core.UIComponent.getRouterFor(this).getTargets().display("notFound");
			}
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.erpx.site.prulia.PRULIA.view.NewsDetail
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.erpx.site.prulia.PRULIA.view.NewsDetail
		 */
		// onAfterRendering: function() {
			
		// },

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.erpx.site.prulia.PRULIA.view.NewsDetail
		 */
		//	onExit: function() {
		//
		//	}
	});
});
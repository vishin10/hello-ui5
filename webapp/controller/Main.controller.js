sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, MessageBox, JSONModel) {
    "use strict";

    return Controller.extend("hello.ui5.controller.Main", {
        onInit: function () {
            var oModel = new JSONModel({
                name: ""
            });
            this.getView().setModel(oModel);
        },
        onPress: function () {
            MessageToast.show("Button clicked!");
            MessageBox.alert("Hey! You clicked the button.");
        },
        onViewFolder: function () {
            MessageToast.show("View folder clicked!");
        }
    });
});

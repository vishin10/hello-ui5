sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"
], function (Controller, MessageToast, MessageBox, JSONModel, Fragment) {
    "use strict";

    return Controller.extend("hello.ui5.controller.Main", {
        onInit: function () {
            var oModel = new JSONModel({
                name: "",
                form: {
                    fullName: "",
                    email: "",
                    phone: ""
                }
            });
            this.getView().setModel(oModel);
        },
        onPress: function () {
            MessageToast.show("Button clicked!");
            MessageBox.alert("Hey! You clicked the button.", {
                icon: MessageBox.Icon.INFORMATION,
                title: "Alert"
            });
        },
        onViewFolder: function () {
            MessageToast.show("View folder clicked!");
            MessageBox.alert("Hey! You clicked View Folder.", {
                icon: MessageBox.Icon.INFORMATION,
                title: "Alert"
            });
        },
        onOpenDialog: function () {
            var oView = this.getView();

            if (!this._pDialog) {
                this._pDialog = Fragment.load({
                    id: oView.getId(),
                    name: "hello.ui5.view.fragments.InfoDialog",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            this._pDialog.then(function (oDialog) {
                oDialog.open();
            });
        },
        onDialogClose: function (oEvent) {
            oEvent.getSource().getParent().close();
        }
    });
});

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/model/type/Currency",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, MessageToast, MessageBox, JSONModel, Fragment, Currency, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("hello.ui5.controller.Main", {
        formatCurrency: function (fAmount, sCurrency) {
            if (fAmount === null || fAmount === undefined || fAmount === "") {
                return "";
            }
            if (!this._oCurrencyType) {
                this._oCurrencyType = new Currency({ showMeasure: true });
            }
            return this._oCurrencyType.formatValue([fAmount, sCurrency || "USD"], "string");
        },
        formatTotal: function (aOrders, sCurrency) {
            if (!Array.isArray(aOrders) || aOrders.length === 0) {
                return "Total: " + this.formatCurrency(0, sCurrency);
            }
            var fTotal = aOrders.reduce(function (fSum, oOrder) {
                var fPrice = Number(oOrder && oOrder.price) || 0;
                return fSum + fPrice;
            }, 0);
            return "Total: " + this.formatCurrency(fTotal, sCurrency);
        },
        formatTotalState: function (aOrders) {
            if (!Array.isArray(aOrders) || aOrders.length === 0) {
                return "Success";
            }
            var fTotal = aOrders.reduce(function (fSum, oOrder) {
                var fPrice = Number(oOrder && oOrder.price) || 0;
                return fSum + fPrice;
            }, 0);
            return fTotal > 20 ? "Error" : "Success";
        },
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

            var oPeopleModel = new JSONModel();
            oPeopleModel.loadData("model/people.json");
            oPeopleModel.attachRequestCompleted(function () {
                var oData = oPeopleModel.getData();
                if (oData && Array.isArray(oData.people)) {
                    oData.people.forEach(function (oPerson) {
                        var aOrders = Array.isArray(oPerson.orders) ? oPerson.orders : [];
                        oPerson.orderText = aOrders.map(function (oOrder) {
                            return oOrder && oOrder.item ? oOrder.item : "";
                        }).join(" ");
                    });
                    oPeopleModel.refresh(true);
                }
            });
            this.getView().setModel(oPeopleModel, "people");
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
        },
        onSearchPeople: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue") || oEvent.getParameter("query") || "";
            var oList = this.byId("peopleList");
            if (!oList) {
                return;
            }
            var oBinding = oList.getBinding("items");
            if (!oBinding) {
                return;
            }
            if (!sQuery) {
                oBinding.filter([]);
                return;
            }
            var oFilter = new Filter({
                filters: [
                    new Filter("name", FilterOperator.Contains, sQuery),
                    new Filter("orderText", FilterOperator.Contains, sQuery)
                ],
                and: false
            });
            oBinding.filter([oFilter]);
        }
    });
});

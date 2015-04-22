/*
 * Copyright (c) 2015. Zuercher Hochschule fuer Angewandte Wissenschaften
 *  All Rights Reserved.
 *
 *     Licensed under the Apache License, Version 2.0 (the "License"); you may
 *     not use this file except in compliance with the License. You may obtain
 *     a copy of the License at
 *
 *          http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 *     WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *     License for the specific language governing permissions and limitations
 *     under the License.
 */

(function(){
    /*
        Module Setup
    */
    angular.module('dashboard.admin.billing')
        .controller('AdminBillingController', AdminBillingController);

    /*
        Controllers, Factories, Services, Directives
    */
    AdminBillingController.$inject = [
        'sessionService', 'restService', 'billDataService', 'alertService',
        'responseParser', 'dateUtil'
    ];
    function AdminBillingController(
            sessionService, restService, billDataService, alertService,
            responseParser, dateUtil) {
        var me = this;
        this.users = [];
        this.dateFormat = "yyyy-MM-dd";
        this.defaultDate = dateUtil.getFormattedDateToday();
        this.fromDate = undefined;
        this.toDate = undefined;

        var onUsersLoadSuccess = function(response) {
            me.users = responseParser.getUserListFromResponse(response.data);
        };

        var onUsersLoadError = function(response) {
            alertService.showError("Could not fetch list of users");
        };

        var onUserInfoLoadSuccess = function(response) {
            var responseData = response.data;
            var keystoneIdField = responseData.keystoneid || [];
            var userId = keystoneIdField[0] || 0;
            return restService.getChargeForUser(userId, me.fromDate, me.toDate);
        };

        var onUserBillDetailsLoadSuccess = function(response) {
            billDataService.setRawData(response.data);
            var billData = billDataService.getFormattedData();
            return restService.createBillPDF(billData);
        };

        var onBillGenerateSuccess = function(response) {
            alertService.showSuccess("Bill successfully created");
        };

        var onBillGenerateError = function(response) {
            alertService.showError("Could not generate bill");
        };

        //https://docs.angularjs.org/guide/directive#creating-a-directive-that-wraps-other-elements
        this.onDateChanged = function(from, to) {
            me.fromDate = dateUtil.formatDateFromTimestamp(from) + " 00:00";
            me.toDate = dateUtil.formatDateFromTimestamp(to) + " 23:59";
        };

        this.getAllUsers = function() {
            restService.getAllUsers(sessionService.getSessionId())
                .then(onUsersLoadSuccess, onUsersLoadError);
        };

        this.generateBill = function(user) {
            if(!me.fromDate || !me.toDate) {
                alertService.showError("No date span selected");
            }
            else {
                var sessionId = sessionService.getSessionId();
                restService.getUserInfo(user, sessionId)
                    .then(onUserInfoLoadSuccess)
                    .then(onUserBillDetailsLoadSuccess)
                    .then(onBillGenerateSuccess, onBillGenerateError);
            }
        };

        this.getAllUsers();
    }

})();

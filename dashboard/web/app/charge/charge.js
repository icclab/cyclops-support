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
    angular.module('dashboard.charge')
        .controller('ChargeController', ChargeController);

    /*
        Controllers, Factories, Services, Directives
    */
    ChargeController.$inject = [
        '$scope', 'restService', 'sessionService', 'chargeDataService',
        'externalChargeDataService', 'alertService', 'dateUtil'
    ];
    function ChargeController(
            $scope, restService, sessionService, chargeDataService,
            externalChargeDataService, alertService, dateUtil) {
        var me = this;
        this.dateFormat = "yyyy-MM-dd";
        this.defaultDate = dateUtil.getFormattedDateToday();
        me.externalUserIds = [];

        var loadChargeDataSuccess = function(response) {
            chargeDataService.setRawData(response.data);
            chargeDataService.notifyChartDataReady($scope);
        };

        var loadChargeDataFailed = function(reponse) {
            alertService.showError("Requesting charge data failed");
        };

        var loadExternalDataSuccess = function(response) {
            externalChargeDataService.setRawData(response.data);
            externalChargeDataService.notifyChartDataReady($scope);
        };

        var loadExternalDataError = function(response) {
            alertService.showError("Requesting external meter data failed");
        };

        var onLoadIdsSuccess = function (response) {
            var dateToday = dateUtil.getFormattedDateToday();
            me.externalUserIds = response.data;
            me.onDateChanged(dateToday, dateToday);
        };

        var onLoadIdsError = function() {
            var dateToday = dateUtil.getFormattedDateToday();
            me.externalUserIds = [];
            me.onDateChanged(dateToday, dateToday);
        };

        this.requestCharge = function(userId, from, to) {
            restService.getChargeForUser(userId, from, to)
                .then(loadChargeDataSuccess, loadChargeDataFailed);
        };

        this.requestExternalCharge = function(externalUserId, from, to) {
            restService.getChargeForUser(externalUserId, from, to)
                .then(loadExternalDataSuccess, loadExternalDataError);
        };

        this.clearChartDataForUpdate = function() {
            $scope.$broadcast("CLEAR_CHARTS");
            chargeDataService.clearData();
            externalChargeDataService.clearData();
        };

        //https://docs.angularjs.org/guide/directive#creating-a-directive-that-wraps-other-elements
        this.onDateChanged = function(from, to) {
            var fromDate = dateUtil.formatDateFromTimestamp(from) + " 00:00";
            var toDate = dateUtil.formatDateFromTimestamp(to) + " 23:59";
            me.updateCharts(sessionService.getKeystoneId(), fromDate, toDate);
        };

        this.updateCharts = function(userId, from, to) {
            var exIds = me.externalUserIds;

            me.clearChartDataForUpdate();

            for(var i = 0; i < exIds.length; i++) {
                var exId = exIds[i];

                if(exId.userId && exId.userId != "") {
                    me.requestExternalCharge(exId.userId, from, to);
                }
            }

            me.requestCharge(userId, from, to);
        };

        this.loadExternalUserIds = function() {
            var userId = sessionService.getKeystoneId();
            restService.getExternalUserIds(userId)
                .then(onLoadIdsSuccess, onLoadIdsError);
        };

        this.loadExternalUserIds();
    };

})();

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
    angular.module('dashboard.overview')
        .controller('OverviewController', OverviewController);

    /*
        Controllers, Factories, Services, Directives
    */
    OverviewController.$inject = [
        '$scope', '$location',
        'restService', 'sessionService', 'usageDataService', 'externalUsageDataService',
        'alertService', 'dateUtil'
    ];
    function OverviewController(
            $scope, $location,
            restService, sessionService, usageDataService, externalUsageDataService,
            alertService, dateUtil) {

        var me = this;
        this.dateFormat = "yyyy-MM-dd";
        this.defaultDate = dateUtil.getFormattedDateToday();
        this.externalUserIds = [];

        var loadUdrDataSuccess = function(response) {
            usageDataService.setRawData(response.data);
            usageDataService.notifyChartDataReady($scope);
        };

        var loadUdrDataFailed = function(response) {
            alertService.showError("Requesting meter data failed");
        };

        var loadExternalDataSuccess = function(response) {
            externalUsageDataService.setRawData(response.data);
            externalUsageDataService.notifyChartDataReady($scope);
        };

        var loadExternalDataError = function(response) {
            alertService.showError("Requesting external meter data failed");
        };

        var onLoadIdsSuccess = function (response) {
            me.externalUserIds = response.data;

            me.onDateChanged(
                dateUtil.getFormattedDateToday(),
                dateUtil.getFormattedDateToday()
            );
        };

        var onLoadIdsError = function() {
            me.externalUserIds = [];

            me.onDateChanged(
                dateUtil.getFormattedDateToday(),
                dateUtil.getFormattedDateToday()
            );
        };

        this.requestUsage = function(keystoneId, from, to) {
            restService.getUdrData(keystoneId, from, to)
                .then(loadUdrDataSuccess, loadUdrDataFailed);
        };

        this.requestExternalUsage = function(externalUserId, from, to) {
            restService.getUdrData(externalUserId, from, to)
                .then(loadExternalDataSuccess, loadExternalDataError);
        };

        this.hasKeystoneId = function() {
            var id = sessionService.getKeystoneId();
            return id && id.length > 0 && id != "0";
        };

        this.showCloudServices = function() {
            $location.path("/cloudservices");
        };

        //https://docs.angularjs.org/guide/directive#creating-a-directive-that-wraps-other-elements
        this.onDateChanged = function(from, to) {
            var fromDate = dateUtil.formatDateFromTimestamp(from) + " 00:00";
            var toDate = dateUtil.formatDateFromTimestamp(to) + " 23:59";
            me.updateCharts(fromDate, toDate);
        };

        this.updateCharts = function(from, to) {
            if(me.hasKeystoneId()) {
                var keystoneId = sessionService.getKeystoneId();
                var exIds = me.externalUserIds;

                me.requestUsage(keystoneId, from, to);

                for(var i = 0; i < exIds.length; i++) {
                    var exId = exIds[i];

                    if(exId.userId && exId.userId != "") {
                        me.requestExternalUsage(exId.userId, from, to);
                    }
                }
            }
        };

        this.loadExternalUserIds = function() {
            var userId = sessionService.getKeystoneId();
            restService.getExternalUserIds(userId)
                .then(onLoadIdsSuccess, onLoadIdsError);
        };

        this.loadExternalUserIds();
    };

})();

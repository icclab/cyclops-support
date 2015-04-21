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
        'restService', 'sessionService', 'usageDataService', 'alertService',
        'dateUtil'
    ];
    function OverviewController(
            $scope, $location,
            restService, sessionService, usageDataService, alertService,
            dateUtil) {

        var me = this;
        this.dateFormat = "yyyy/MM/dd";

        var loadUdrDataSuccess = function(response) {
            usageDataService.setRawData(response.data);
            usageDataService.notifyChartDataReady($scope);
        };

        var loadUdrDataFailed = function(response) {
            alertService.showError("Requesting meter data failed");
        };

        this.requestUsage = function(keystoneId, from, to) {
            restService.getUdrData(keystoneId, from, to)
                .then(loadUdrDataSuccess, loadUdrDataFailed);
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
            var from = dateUtil.formatDateFromTimestamp(from) + " 00:00";
            var to = dateUtil.formatDateFromTimestamp(to) + " 23:59";
            me.updateCharts(from, to);
        };

        this.updateCharts = function(from, to) {
            if(me.hasKeystoneId()) {
                var keystoneId = sessionService.getKeystoneId();
                me.requestUsage(keystoneId, from, to);
            }
        };

        this.onDateChanged(
            dateUtil.getFormattedDateYesterday(),
            dateUtil.getFormattedDateToday()
        );
    };

})();

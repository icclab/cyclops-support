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
    angular.module('dashboard.admin.meters')
        .controller('AdminMeterController', AdminMeterController);

    /*
        Controllers, Factories, Services, Directives
    */
    AdminMeterController.$inject = [
        'restService', 'meterselectionDataService', 'alertService', 'dateUtil'
    ];
    function AdminMeterController(
            restService, meterselectionDataService, alertService, dateUtil) {
        var me = this;
        this.meterMap = {};

        var loadKeystoneMeterSuccess = function(response) {
            meterselectionDataService.setRawOpenstackData(response.data);
            return restService.getUdrMeters();
        };

        var loadUdrMeterSuccess = function(response) {
            meterselectionDataService.setRawUdrData(response.data);
            me.preselectMeters(response.data);
        };

        var loadMeterError = function(response) {
            alertService.showError("Error loading list of meters");
        };

        var updateMeterSuccess = function(response) {
            alertService.showSuccess("Meters successfully updated");
        };

        var updateMeterError = function(response) {
            alertService.showError("Updating meters failed");
        };

        this.preselectMeters = function(udrMeterResponse) {
            var udrMeters = meterselectionDataService.getFormattedUdrData();
            var meters = meterselectionDataService.getFormattedOpenstackData();

            for(var meterName in udrMeters) {
                var meter = udrMeters[meterName];

                if(meterName in meters) {
                    meters[meterName].enabled = meter.enabled;
                }
            }

            me.meterMap = meters;
        };

        /**
         * Toggles a meter based on the checkbox. The method will set the
         * 'enabled' property of a meter to true or false.
         *
         * @param  {String} meterName Name of the meter to toggle
         */
        this.toggleMeter = function(meterName) {
            var meterMap = this.meterMap;
            meterMap[meterName].enabled = !meterMap[meterName].enabled;
        };

        /**
         * Builds the message body for the UDR "update meter selection" POST
         * request.
         *
         * @return {Object} POST request body as JSON
         */
        this.buildUdrRequest = function() {
            var timestamp = dateUtil.getTimestamp();
            var name = "meterselection";
            var appSource = "cyclops-ui";
            var columns = [
                "time", "source", "metersource", "metertype",
                "metername", "status"
            ];
            points = [];

            for(var meterName in me.meterMap) {
                var meter = me.meterMap[meterName];

                points.push([
                    timestamp,
                    appSource,
                    meter.source,
                    meter.type,
                    meter.name,
                    meter.enabled ? 1 : 0
                ]);
            }

            return {
                "name": name,
                "columns": columns,
                "points": points
            };
        };

        this.updateUdrMeters = function() {
            restService.updateUdrMeters(me.buildUdrRequest())
                .then(updateMeterSuccess, updateMeterError);
        };

        this.loadMeterData = function() {
            restService.getKeystoneMeters()
                .then(loadKeystoneMeterSuccess)
                .then(loadUdrMeterSuccess, loadMeterError);
        };

        this.loadMeterData();
    }

})();

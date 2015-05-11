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

(function() {
    /*
        Module Setup
    */
    angular.module('dashboard.services')
        .service('chartDataService', ChartDataService);

    /*
        Controllers, Factories, Services, Directives
    */
    ChartDataService.$inject = [
        'dateUtil', 'usageDataService', 'rateDataService', 'chargeDataService'
    ];
    function ChartDataService(
            dateUtil, usageDataService, rateDataService, chargeDataService) {
        var me = this;
        var NUM_LABELS = 10;

        //Default indices in case there is no column description
        var DEFAULT_INDEX_TIME = 0;
        var DEFAULT_INDEX_USAGE = 2;

        this.getServiceDelegate = function(type) {
            if(type == "usage") {
                return usageDataService;
            }
            else if(type == "rate") {
                return rateDataService;
            }
            else if(type == "charge") {
                return chargeDataService;
            }
        };

        this.doSampling = function(points, maxNum) {
            var sampledPoints = [];
            var numPoints = points.length;
            var modulus = Math.round(numPoints / maxNum) || 1;

            if(numPoints < maxNum) {
                return points;
            }

            for(var i = 0; i < numPoints; i++) {
                if(i % modulus == 0) {
                    sampledPoints.push(points[i]);
                }
            }

            return sampledPoints;
        };

        this.getCumulativeMeterData = function(type, meterName) {
            try {
                /*
                    Cumulative meters can be treated as gauge meters, because
                    the raw data is represented in the same way (many individual
                    data points). We need to sum up the individual points to
                    get the cumulative result.
                 */
                var gaugeData = me.getGaugeMeterData(type, meterName).data[0];
                var cumulativeValue = 0;

                for(var i = 0; i < gaugeData.length; i++) {
                    cumulativeValue += gaugeData[i];
                }

                return { "data": cumulativeValue };
            }
            catch(err) {
                return { "data": 0 };
            }
        };

        this.getGaugeMeterData = function(type, meterName) {
            try {
                var service = me.getServiceDelegate(type);
                var serviceData = service.getFormattedData();
                var dataPoints = serviceData[meterName].points || [];
                dataPoints.reverse();
                var numPoints = dataPoints.length;
                var dataX = [];
                var dataY = [];

                for(var i = 0; i < numPoints; i++) {
                    dataX.push(dateUtil.formatDateTimeFromTimestamp(dataPoints[i][0]));
                    dataY.push(dataPoints[i][1]);
                }

                return { "labels": dataX, "data": [dataY] };
            }
            catch(err) {
                return { "labels": [], "data": [[]] };
            }
        };

        this.getSampledGaugeMeterData = function(type, meterName) {
            try {
                var unsampledData = me.getGaugeMeterData(type, meterName);
                var unsampledPoints = unsampledData.data[0];
                var unsampledLabels = unsampledData.labels;
                var sampledData = me.doSampling(unsampledPoints, 100);
                var sampledLabels = me.doSampling(unsampledLabels, 10);

                return { "labels": sampledLabels, "data": [sampledData] };
            }
            catch(err) {
                return { "labels": [], "data": [[]] };
            }
        };
    }

})();

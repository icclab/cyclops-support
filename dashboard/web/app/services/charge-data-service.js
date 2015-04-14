(function() {
    /*
        Module Setup
    */
    angular.module('dashboard.services')
        .service('chargeDataService', ChargeDataService);

    /*
        Controllers, Factories, Services, Directives
    */
    function ChargeDataService() {
        var me = this;
        var formattedData = {};

        /**
         * Fires an event for the chart container to create a chart. Sends the
         * following information with the event:
         *
         * {
         *     name: <chart_name>
         *     unit: <data_unit>
         *     chartType: <chart_type>
         *     serviceType: "charge"
         * }
         *
         * @param  {Scope} $scope Scope on which the event is fired
         */
        this.notifyChartDataReady = function($scope) {
            var chartNames = [];

            for(var chartName in formattedData) {
                var chart = formattedData[chartName];

                chartNames.push({
                    name: chart.name,
                    unit: chart.unit,
                    chartType: chart.type,
                    serviceType: "charge"
                });
            }

            $scope.$broadcast('CHART_DATA_READY', chartNames);
        };

        /**
         * Transforms the raw response data to the following format:
         *
         * {
         *     "meter_name": {
         *         name: "meter_name",
         *         points: [...],
         *         columns: [...],
         *         enabled: true/false,
         *         type: "gauge"/"cumulative"
         *     }
         * }
         *
         * @param {Object} data Raw response data
         */
        this.setRawData = function(data) {
            formattedData = {};

            if(data && data.charge) {
                var chargeData = data.charge;
                var points = chargeData.points || [];
                var columns = chargeData.columns || [];
                var indexResource = columns.indexOf("resource");
                var indexTime = columns.indexOf("time");
                var indexPrice = columns.indexOf("price");

                for (var i = 0; i < points.length; i++) {
                    var meter = points[i];
                    var meterName = meter[indexResource];
                    var meterTime = meter[indexTime];
                    var meterPrice = meter[indexPrice];

                    if(meterName in formattedData) {
                        formattedData[meterName].points.push([meterTime, meterPrice]);
                    }
                    else {
                        formattedData[meterName] = {
                            name: meterName,
                            points: [[meterTime, meterPrice]],
                            columns: me.getFormattedColumns(),
                            enabled: true,
                            type: "gauge",
                            unit: ""
                        }
                    }
                }
            }
        };

        /**
         * Returns the columns for the new data representation
         *
         * @return {Array}
         */
        this.getFormattedColumns = function(rawColumns) {
            var formattedColumns = ["time", "value"];
            return formattedColumns;
        };

        this.getFormattedData = function() {
            return formattedData;
        };
    }

})();

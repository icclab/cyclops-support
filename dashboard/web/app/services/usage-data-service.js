(function() {
    /*
        Module Setup
    */
    angular.module('dashboard.services')
        .service('usageDataService', UsageDataService);

    /*
        Controllers, Factories, Services, Directives
    */
    function UsageDataService() {
        var me = this;
        var rawData = {};

        this.notifyChartDataReady = function($scope) {
            var chartNames = [];

            for(var chart in rawData) {
                chartNames.push(chart);
            }

            $scope.$broadcast('USAGE_DATA_READY', chartNames);
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
            rawData = {};

            if(data && data.usage && data.usage.openstack) {
                dataArray = data.usage.openstack;

                for(var i = 0; i < dataArray.length; i++) {
                    currentData = dataArray[i];

                    //Skip if data is null (no usage data available)
                    if(!currentData) {
                        continue;
                    }

                    //Get the first point to find out the meter type and unit
                    var firstPoint = currentData.points[0] || [];
                    var indexType = currentData.columns.indexOf("type");
                    var indexUnit = currentData.columns.indexOf("unit");
                    var type = firstPoint[indexType];
                    var unit = firstPoint[indexUnit];

                    var formattedColumns = me.formatColumns(currentData.columns);
                    var formattedPoints = me.formatPoints(
                        currentData.points,
                        currentData.columns
                    );

                    rawData[currentData.name] = {
                        name: currentData.name,
                        columns: formattedColumns,
                        points: formattedPoints,
                        enabled: true,
                        type: type,
                        unit: unit
                    };
                }
            }
        };

        /**
         * Transforms the raw points to the following format:
         *
         * [
         *     <timestamp>
         *     <point_value>
         * ]
         *
         * @param {Object} rawPoints Raw point data
         * @param {Object} rawColumns Raw column data
         * @return {Array}
         */
        this.formatPoints = function(rawPoints, rawColumns) {
            var formattedPoints = [];
            var indexTime = rawColumns.indexOf("time");
            var indexAvg = rawColumns.indexOf("avg");
            var indexUsage = rawColumns.indexOf("usage");

            for (var i = 0; i < rawPoints.length; i++) {
                var rawPoint = rawPoints[i];
                var time = rawPoint[indexTime];
                var value = 0;

                if(indexAvg > -1) {
                    value = rawPoint[indexAvg];
                }
                else if(indexUsage > -1) {
                    value = rawPoint[indexUsage];
                }

                formattedPoints.push([time, value]);
            };

            return formattedPoints;
        };

        /**
         * Transforms the raw points to the following format:
         *
         * [
         *     "time",
         *     "value"
         * ]
         *
         * @param {Object} data Raw point data
         * @return {Array}
         */
        this.formatColumns = function(rawColumns) {
            var formattedColumns = ["time", "value"];
            return formattedColumns;
        };

        this.getFormattedData = function() {
            return rawData;
        };
    }

})();

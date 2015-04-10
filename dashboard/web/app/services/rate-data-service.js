(function() {
    /*
        Module Setup
    */
    angular.module('dashboard.services')
        .service('rateDataService', RateDataService);

    /*
        Controllers, Factories, Services, Directives
    */
    function RateDataService() {
        var me = this;
        var rawData = {};

        this.notifyChartDataReady = function($scope) {
            var chartNames = [];

            for(var chart in rawData) {
                chartNames.push(chart);
            }

            $scope.$broadcast('RATE_DATA_READY', chartNames);
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
         * The 'columns' array will be formatted as follows:
         *
         * [
         *     "time",
         *     "sequence_number",
         *     "value"
         * ]
         *
         * The 'points' array will follow the order of the 'columns'
         *
         * @param {Object} data Raw response data
         */
        this.setRawData = function(data) {
            if(data && data.rate) {
                var rateData = data.rate;

                for (var meterName in rateData) {
                    dataArray = data.rate[meterName];
                    rawData[meterName] = {};
                    rawData[meterName]["name"] = meterName;
                    rawData[meterName]["columns"] = me.formatColumns([]);
                    rawData[meterName]["points"] = me.formatPoints(dataArray);
                    rawData[meterName]["enabled"] = true;
                    rawData[meterName]["type"] = "gauge";
                    rawData[meterName]["unit"] = "";
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

            for(var i = 0; i < rawPoints.length; i++) {
                var rawPoint = rawPoints[i];
                formattedPoints.push([rawPoint[0], rawPoint[2]]);
            }

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

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

        this.setRawData = function(data) {
            if(data && data.rate) {
                var rateData = data.rate;

                for (var meterName in rateData) {
                    dataArray = data.rate[meterName];
                    rawData[meterName] = {};
                    rawData[meterName]["points"] = dataArray;
                }
            }
        };

        this.getRawData = function() {
            return rawData;
        };
    }

})();

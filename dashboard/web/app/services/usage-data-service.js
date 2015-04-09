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

        this.setRawData = function(data) {
            rawData = {};

            if(data && data.usage && data.usage.openstack) {
                dataArray = data.usage.openstack;

                for(var i = 0; i < dataArray.length; i++) {
                    currentData = dataArray[i];

                    if(currentData) {
                        rawData[currentData.name] = currentData;
                    }
                }
            }
        };

        this.getRawData = function() {
            return rawData;
        };
    }

})();

(function(){
    /*
        Module Setup
    */
    angular.module('dashboard.rate')
        .controller('RateController', RateController);

    /*
        Controllers, Factories, Services, Directives
    */
    RateController.$inject = [
        '$log', '$scope', '$location',
        'restService', 'sessionService', 'rateDataService', 'dateUtil'
    ];
    function RateController(
            $log, $scope, $location,
            restService, sessionService, rateDataService, dateUtil) {
        var me = this;

        var loadRateDataSuccess = function(response) {
            rateDataService.setRawData(response.data);
            $scope.$broadcast('CHART_DATA_READY');
        };

        var loadRateDataFailed = function(reponse) {
            $log.debug("Requesting rate data failed");
        };

        this.requestRate = function(meter, from, to) {
            restService.getRateForMeter("network.incoming.bytes", from, to)
                .then(loadRateDataSuccess, loadRateDataFailed);
        };

        this.requestRate(
            "network.incoming.bytes",
            dateUtil.getFormattedDateToday() + " 00:00",
            dateUtil.getFormattedDateToday() + " 23:59"
        );
    };

})();

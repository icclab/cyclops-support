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
        '$scope', 'restService', 'sessionService', 'rateDataService',
        'alertService', 'dateUtil'
    ];
    function RateController(
            $scope, restService, sessionService, rateDataService,
            alertService, dateUtil) {
        var me = this;

        var loadRateDataSuccess = function(response) {
            rateDataService.setRawData(response.data);
            $scope.$broadcast('CHART_DATA_READY');
        };

        var loadRateDataFailed = function(reponse) {
            alertService.showError("Requesting rate data failed");
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

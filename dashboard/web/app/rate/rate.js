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
        '$scope', '$q', 'restService', 'sessionService', 'rateDataService',
        'alertService', 'dateUtil'
    ];
    function RateController(
            $scope, $q, restService, sessionService, rateDataService,
            alertService, dateUtil) {
        var me = this;

        var loadRateDataSuccess = function(responses) {
            for (var i = 0; i < responses.length; i++) {
                var response = responses[i];
                rateDataService.setRawData(response.data);
            };

            rateDataService.notifyChartDataReady($scope);
        };

        var loadRateDataFailed = function(reponse) {
            alertService.showError("Requesting rate data failed");
        };

        this.requestRates = function(meterNames, from, to) {
            var promises = [];

            for (var i = 0; i < meterNames.length; i++) {
                var promise = restService.getRateForMeter(meterNames[i], from, to);
                promises.push(promise);
            }

            $q.all(promises).then(loadRateDataSuccess, loadRateDataFailed);
        };

        this.requestRates(
            [
                "network.incoming.bytes",
                "network.outgoing.bytes",
                "cpu_util"
            ],
            dateUtil.getFormattedDateToday() + " " + dateUtil.getFormattedTimeLastSixHours(),
            dateUtil.getFormattedDateToday() + " " + dateUtil.getFormattedTimeNow()
        );
    };

})();

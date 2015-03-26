(function(){
    /*
        Module Setup
    */
    angular.module('dashboard.charge')
        .controller('ChargeController', ChargeController);

    /*
        Controllers, Factories, Services, Directives
    */
    ChargeController.$inject = [
        '$log', '$scope', '$location',
        'restService', 'sessionService', 'chargeDataService', 'dateUtil'
    ];
    function ChargeController(
            $log, $scope, $location,
            restService, sessionService, chargeDataService, dateUtil) {
        var me = this;

        var loadChargeDataSuccess = function(response) {
            chargeDataService.setRawData(response.data);
            $scope.$broadcast('CHART_DATA_READY');
        };

        var loadChargeDataFailed = function(reponse) {
            $log.debug("Requesting charge data failed");
        };

        this.requestCharge = function(userId, from, to) {
            restService.getChargeForUser(userId, from, to)
                .then(loadChargeDataSuccess, loadChargeDataFailed);
        };

        this.requestCharge(
            sessionService.getKeystoneId(),
            dateUtil.getFormattedDateToday() + " 00:00",
            dateUtil.getFormattedDateToday() + " 23:59"
        );
    };

})();

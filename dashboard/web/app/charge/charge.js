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
        '$scope', 'restService', 'sessionService', 'chargeDataService',
        'alertService', 'dateUtil'
    ];
    function ChargeController(
            $scope, restService, sessionService, chargeDataService,
            alertService, dateUtil) {
        var me = this;

        var loadChargeDataSuccess = function(response) {
            chargeDataService.setRawData(response.data);
            chargeDataService.notifyChartDataReady($scope);
        };

        var loadChargeDataFailed = function(reponse) {
            alertService.showError("Requesting charge data failed");
        };

        this.requestCharge = function(userId, from, to) {
            restService.getChargeForUser(userId, from, to)
                .then(loadChargeDataSuccess, loadChargeDataFailed);
        };

        this.requestCharge(
            sessionService.getKeystoneId(),
            dateUtil.getFormattedDateToday() + " 00:00:00",
            dateUtil.getFormattedDateToday() + " 23:59:59"
        );
    };

})();

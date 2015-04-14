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
        'meterselectionDataService', 'alertService', 'dateUtil'
    ];
    function RateController(
            $scope, $q, restService, sessionService, rateDataService,
            meterselectionDataService, alertService, dateUtil) {
        var me = this;

        var onLoadRateDataSuccess = function(responses) {
            for (var i = 0; i < responses.length; i++) {
                var response = responses[i];
                rateDataService.setRawData(response.data);
            };

            rateDataService.notifyChartDataReady($scope);
        };

        var onLoadRateDataFailed = function(reponse) {
            alertService.showError("Requesting rate data failed");
        };

        var onLoadMeterSelectionSuccess = function(response) {
            meterselectionDataService.setRawUdrData(response.data);
            var meters = meterselectionDataService.getFormattedUdrData();
            var selectedMeterNames = [];

            for(var meterName in meters) {
                if(meters[meterName].enabled) {
                    selectedMeterNames.push(meterName);
                }
            }

            me.requestRatesForMeters(
                selectedMeterNames,
                dateUtil.getFormattedDateToday() + " " + dateUtil.getFormattedTime6HoursAgo(),
                dateUtil.getFormattedDateToday() + " " + dateUtil.getFormattedTimeNow()
            );
        };

        var onLoadMeterSelectionError = function(response) {
            alertService.showError("Could not load selected meters");
        };

        this.requestRatesForMeters = function(meterNames, from, to) {
            var promises = [];

            for (var i = 0; i < meterNames.length; i++) {
                var promise = restService.getRateForMeter(meterNames[i], from, to);
                promises.push(promise);
            }

            $q.all(promises).then(onLoadRateDataSuccess, onLoadRateDataFailed);
        };

        this.loadMeterSelection = function() {
            restService.getUdrMeters()
                .then(onLoadMeterSelectionSuccess, onLoadMeterSelectionError);
        }

        this.loadMeterSelection();
    };

})();

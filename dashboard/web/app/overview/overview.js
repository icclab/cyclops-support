(function(){
    /*
        Module Setup
    */
    angular.module('dashboard.overview')
        .controller('OverviewController', OverviewController);

    /*
        Controllers, Factories, Services, Directives
    */
    OverviewController.$inject = [
        '$scope', '$location',
        'restService', 'sessionService', 'usageDataService', 'alertService',
        'dateUtil'
    ];
    function OverviewController(
            $scope, $location,
            restService, sessionService, usageDataService, alertService,
            dateUtil) {

        var me = this;
        this.selectedDate;
        this.dates = {
            "today": dateUtil.getFormattedDateToday(),
            "yesterday": dateUtil.getFormattedDateYesterday(),
            "last3days": dateUtil.getFormattedDateLast3Days(),
            "lastWeek": dateUtil.getFormattedDateLastWeek(),
            "lastMonth": dateUtil.getFormattedDateLastMonth(),
            "lastYear": dateUtil.getFormattedDateLastYear()
        };

        var loadUdrDataSuccess = function(response) {
            usageDataService.setRawData(response.data);
            $scope.$broadcast('CHART_DATA_READY');
        };

        var loadUdrDataFailed = function(response) {
            alertService.showError("Requesting meter data failed");
        };

        this.requestUsage = function(keystoneId, from, to) {
            restService.getUdrData(keystoneId, from, to)
                .then(loadUdrDataSuccess, loadUdrDataFailed);
        };

        this.hasKeystoneId = function() {
            var id = sessionService.getKeystoneId();
            return id && id.length > 0 && id != "0";
        };

        this.showCloudServices = function() {
            $location.path("/cloudservices");
        };

        this.onDateChanged = function() {
            var sel = me.selectedDate || 'today';
            fromDate = me.dates[sel];
            toDate = me.dates['today'];
            me.updateCharts(fromDate, toDate);
        };

        this.updateCharts = function(fromDate, toDate) {
            if(me.hasKeystoneId()) {
                var keystoneId = sessionService.getKeystoneId();
                var from = fromDate + " 00:00:00";
                var to = toDate + " 23:59:59";
                me.requestUsage(keystoneId, from, to);
            }
        };

        this.onDateChanged();
    };

})();

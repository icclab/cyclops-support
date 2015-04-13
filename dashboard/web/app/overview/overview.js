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
            "last6Hours": {
                "from": dateUtil.getFormattedDateToday() + " " + dateUtil.getFormattedTime6HoursAgo(),
                "to": dateUtil.getFormattedDateToday() + " " + dateUtil.getFormattedTimeNow()
            },
            "today": {
                "from": dateUtil.getFormattedDateToday() + " 00:00",
                "to": dateUtil.getFormattedDateToday() + " 23:59"
            },
            "yesterday": {
                "from": dateUtil.getFormattedDateYesterday() + " 00:00",
                "to": dateUtil.getFormattedDateToday() + " 23:59"
            },
            "last3days": {
                "from": dateUtil.getFormattedDate3DaysAgo() + " 00:00",
                "to": dateUtil.getFormattedDateToday() + " 23:59"
            },
            "lastWeek": {
                "from": dateUtil.getFormattedDate1WeekAgo() + " 00:00",
                "to": dateUtil.getFormattedDateToday() + " 23:59"
            },
            "lastMonth": {
                "from": dateUtil.getFormattedDate1MonthAgo() + " 00:00",
                "to": dateUtil.getFormattedDateToday() + " 23:59"
            },
            "lastYear": {
                "from": dateUtil.getFormattedDate1YearAgo() + " 00:00",
                "to": dateUtil.getFormattedDateToday() + " 23:59"
            }
        };

        var loadUdrDataSuccess = function(response) {
            usageDataService.setRawData(response.data);
            usageDataService.notifyChartDataReady($scope);
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
            var sel = me.selectedDate || 'last6Hours';
            var from = me.dates[sel].from;
            var to = me.dates[sel].to;
            me.updateCharts(from, to);
        };

        this.updateCharts = function(from, to) {
            if(me.hasKeystoneId()) {
                var keystoneId = sessionService.getKeystoneId();
                me.requestUsage(keystoneId, from, to);
            }
        };

        this.onDateChanged();
    };

})();

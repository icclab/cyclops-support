(function() {
    /*
        Module Setup
    */
    angular.module('dashboard.utils')
        .service('dateUtil', DateUtil);

    /*
        Controllers, Factories, Services, Directives
    */
    function DateUtil() {

        var formatDate = function(dateObject) {
            return dateObject.toString("yyyy-MM-dd");
        };

        var formatTime = function(dateObject) {
            return dateObject.toString("HH:mm");
        };

        var formatDateTime = function(dateObject) {
            return dateObject.toString("yyyy-MM-dd HH:mm:ss")
        };

        this.getTimestamp = function() {
            return new Date().getTime();
        };

        this.fromTimestamp = function(timestamp) {
            return new Date(timestamp).toString("d/MM/yy HH:mm");
        };

        this.getFormattedTimeNow = function() {
            return formatTime(Date.now());
        };

        this.getFormattedTime6HoursAgo = function() {
            return formatTime(Date.now().addHours(-6));
        };

        this.getFormattedDateTimeNow = function() {
            return formatDateTime(Date.now());
        };

        this.getFormattedDateToday = function() {
            return formatDate(Date.today());
        };

        this.getFormattedDateYesterday = function() {
            return formatDate(Date.today().addDays(-1));
        };

        this.getFormattedDate3DaysAgo = function() {
            return formatDate(Date.today().addDays(-2));
        };

        this.getFormattedDate1WeekAgo = function() {
            return formatDate(Date.today().addWeeks(-1).addDays(1));
        };

        this.getFormattedDate1MonthAgo = function() {
            return formatDate(Date.today().addMonths(-1).addDays(1));
        };

        this.getFormattedDate1YearAgo = function() {
            return formatDate(Date.today().addYears(-1).addDays(1));
        };
    }

})();

/*
 * Copyright (c) 2015. Zuercher Hochschule fuer Angewandte Wissenschaften
 *  All Rights Reserved.
 *
 *     Licensed under the Apache License, Version 2.0 (the "License"); you may
 *     not use this file except in compliance with the License. You may obtain
 *     a copy of the License at
 *
 *          http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 *     WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *     License for the specific language governing permissions and limitations
 *     under the License.
 */

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

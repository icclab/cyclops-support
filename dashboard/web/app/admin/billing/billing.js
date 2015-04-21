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

(function(){
    /*
        Module Setup
    */
    angular.module('dashboard.admin.billing')
        .controller('AdminBillingController', AdminBillingController);

    /*
        Controllers, Factories, Services, Directives
    */
    AdminBillingController.$inject = [
        '$scope', 'sessionService', 'restService', 'billDataService', 'alertService',
        'responseParser', 'dateUtil'
    ];
    function AdminBillingController(
            $scope, sessionService, restService, billDataService, alertService,
            responseParser, dateUtil) {
        var me = this;
        this.users = [];
        this.fromDate;
        this.toDate;
        this.dateFormat = "dd.MM.yy";

        var onUsersLoadSuccess = function(response) {
            me.users = responseParser.getUserListFromResponse(response.data);
        };

        var onUsersLoadError = function(response) {
            alertService.showError("Could not fetch list of users");
        };

        //https://docs.angularjs.org/guide/directive#creating-a-directive-that-wraps-other-elements
        this.onDateChanged = function(from, to) {
            console.log(arguments);
        };

        this.getAllUsers = function() {
            restService.getAllUsers(sessionService.getSessionId())
                .then(onUsersLoadSuccess, onUsersLoadError);
        };

        this.getAllUsers();
    }

})();

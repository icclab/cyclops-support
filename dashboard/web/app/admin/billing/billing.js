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
        '$q', '$sce', '$modal', 'sessionService', 'restService', 'billDataService',
        'alertService', 'responseParser', 'dateUtil'
    ];
    function AdminBillingController(
            $q, $sce, $modal, sessionService, restService, billDataService,
            alertService, responseParser, dateUtil) {
        var me = this;
        this.users = [];
        this.dateFormat = "yyyy-MM-dd";
        this.defaultDate = dateUtil.getFormattedDateToday();
        this.fromDate = me.defaultDate;
        this.toDate = me.defaultDate;

        this.showPdfModal = function () {
            var modalInstance = $modal.open({
                templateUrl: 'modals/pdf/pdf-modal.html',
                controller: 'PdfModalController',
                controllerAs: 'pdfModalCtrl',
                size: 'lg',
                resolve: {
                    pdf: function () {
                        return me.pdf;
                    }
                }
            });
        };

        this.showUserBillsModal = function (bills) {
            var modalInstance = $modal.open({
                templateUrl: 'modals/user-bills/user-bills-modal.html',
                controller: 'UserBillsModalController',
                controllerAs: 'userBillsModalCtrl',
                size: 'lg',
                resolve: {
                    bills: function () {
                        return bills;
                    }
                }
            });
        };

        this.getKeystoneIdForUser = function(username, sessionId) {
            var deferred = $q.defer();

            restService.getUserInfo(username, sessionId).then(
                function(response) {
                    var responseData = response.data;
                    var keystoneIdField = responseData.keystoneid || [];
                    var firstNameField = responseData.givenName || [];
                    var lastNameField = responseData.sn || [];
                    var userId = keystoneIdField[0];

                    if(userId) {
                        deferred.resolve({
                            userId: userId,
                            firstName: firstNameField[0] || "",
                            lastName: lastNameField[0] || "",
                            from: me.fromDate,
                            to: me.toDate
                        });
                    }
                    else {
                        deferred.reject("User does not have a cloud account assigned");
                    }
                },
                function() {
                    deferred.reject("Could not load user information");
                }
            );

            return deferred.promise;
        };

        this.getBillItems = function(params) {
            var deferred = $q.defer();
            var from = params.from + " 00:00";
            var to = params.to + " 23:59";

            restService.getBillingInformation(params.userId, from, to).then(
                function(response) {
                    billDataService.setRawData(response.data);
                    params.billItems = billDataService.getFormattedData();
                    deferred.resolve(params);
                },
                function() {
                    deferred.reject("Could not load charge data for user");
                }
            );

            return deferred.promise;
        };

        this.generateBillPDF = function(params) {
            var deferred = $q.defer();
            params.due = dateUtil.addDaysToDateString(params.to, 10);

            restService.createBillPDF(params).then(
                function(response) {
                    //https://stackoverflow.com/questions/21628378/angularjs-display-blob-pdf-in-an-angular-app
                    var file = new Blob([response.data], {type: 'application/pdf'});
                    var fileURL = URL.createObjectURL(file);
                    me.pdf = $sce.trustAsResourceUrl(fileURL);
                    deferred.resolve("Bill successfully created");
                },
                function() {
                    deferred.reject("Could not generate bill");
                }
            );

            return deferred.promise;
        };

        this.getExistingBills = function(userId) {
            var deferred = $q.defer();

            restService.getBills(userId).then(
                function(response) {
                    deferred.resolve(response.data);
                },
                function() {
                    deferred.reject("Could not load bills for this user");
                }
            );

            return deferred.promise;
        };

        //https://docs.angularjs.org/guide/directive#creating-a-directive-that-wraps-other-elements
        this.onDateChanged = function(from, to) {
            me.fromDate = dateUtil.formatDateFromTimestamp(from);
            me.toDate = dateUtil.formatDateFromTimestamp(to);
        };

        this.getAllUsers = function() {
            restService.getAllUsers(sessionService.getSessionId()).then(
                function(response) {
                    me.users = responseParser.getUserListFromResponse(response.data);
                },
                function() {
                    alertService.showError("Could not fetch list of users");
                }
            );
        };

        this.generateBill = function(user) {
            if(!me.fromDate || !me.toDate) {
                alertService.showError("No date span selected");
            }
            else {
                var sessionId = sessionService.getSessionId();

                me.getKeystoneIdForUser(user, sessionId)
                    .then(me.getBillItems)
                    .then(me.generateBillPDF).then(
                        function(msg) {
                            me.showPdfModal();
                            alertService.showSuccess(msg);
                        },
                        function(msg) {
                            alertService.showError(msg);
                        }
                    );
            }
        };

        this.showExistingBills = function(user) {
            var sessionId = sessionService.getSessionId();
            me.getKeystoneIdForUser(user, sessionId)
                .then(
                    function(response) {
                        return me.getExistingBills(response.userId);
                    }
                )
                .then(
                    function(response) {
                        me.showUserBillsModal(response);
                    },
                    function(msg) {
                        alertService.showError(msg);
                    }
                );
        };

        this.getAllUsers();
    }

})();

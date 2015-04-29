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
    angular.module('dashboard.bills')
        .controller('BillController', BillController);

    /*
        Controllers, Factories, Services, Directives
    */
    BillController.$inject = [
        '$sce', '$modal', 'sessionService', 'restService', 'billDataService',
        'alertService', 'dateUtil'
    ];
    function BillController($sce, $modal, sessionService, restService, billDataService,
            alertService, dateUtil) {
        var me = this;
        this.bills = [];
        this.pdf;

        var loadBillsSuccess = function(response) {
            me.bills = response.data;
        };

        var loadBillsError = function() {
            alertService.showError("Could not load bills");
        };

        var loadPdfSuccess = function(response) {
            //https://stackoverflow.com/questions/21628378/angularjs-display-blob-pdf-in-an-angular-app
            var file = new Blob([response.data], {type: 'application/pdf'});
            var fileURL = URL.createObjectURL(file);
            pdf = $sce.trustAsResourceUrl(fileURL);
            me.openModal(pdf);
        };

        var loadPdfError = function() {
            alertService.showError("Could not load PDF file");
        };

        this.openModal = function (pdf) {
            var modalInstance = $modal.open({
                templateUrl: 'modals/pdf-modal.html',
                controller: 'PdfModalController',
                controllerAs: 'pdfModalCtrl',
                size: 'lg',
                resolve: {
                    pdf: function () {
                        return pdf;
                    }
                }
            });
        };

        this.getClassForBill = function(bill) {
            if(bill.status == "paid") {
                return "success";
            }
            else if(bill.status == "due") {
                return "danger";
            }

            return "info";
        };

        this.showDetails = function(bill) {
            var userId = sessionService.getKeystoneId();
            restService.getBillPDF(userId, bill.from, bill.to)
                .then(loadPdfSuccess, loadPdfError);
        };

        this.getBills = function() {
            restService.getBills(sessionService.getKeystoneId())
                .then(loadBillsSuccess, loadBillsError);
        };

        this.getBills();
    }

})();

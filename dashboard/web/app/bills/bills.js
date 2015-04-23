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
        'sessionService', 'restService', 'billDataService', 'alertService', 'dateUtil'
    ];
    function BillController(sessionService, restService, billDataService,
            alertService, dateUtil) {
        var me = this;

        /**
         * Objects in the following form:
         *
         * {
         *     title: "bill_title",
         *     status: "running"/"due"/"paid"
         *     from: "from_date",
         *     to: "to_date",
         *     items: [
         *         {
         *             resource: "resource_name",
         *             unit: "unit_name",
         *             usage: "usage_value",
         *             rate: "rate_Value",
         *             charge: "charge_value"
         *         }
         *     ]
         * }
         *
         * @type {Array}
         */
        this.bills = [
            {
                title: "2014/12",
                status: "running",
                from: "2014-12-01",
                to: "2014-12-31",
                items: [
                    {
                        resource: "cpu",
                        unit: "ns",
                        usage: "14261423871",
                        rate: "1.28E-8",
                        charge: 182.55
                    },
                    {
                        resource: "network.bytes.out",
                        unit: "B",
                        usage: "2261523811",
                        rate: "1.2E-6",
                        charge: 2713.85
                    }
                ]
            },
            {
                title: "2014/11",
                status: "due",
                from: "2014-11-01",
                to: "2014-11-30",
                items: [
                    {
                        resource: "cpu",
                        unit: "ns",
                        usage: "14261423871",
                        rate: "1.28E-8",
                        charge: 182.55
                    },
                    {
                        resource: "network.bytes.out",
                        unit: "B",
                        usage: "2261523811",
                        rate: "1.2E-6",
                        charge: 444
                    }
                ]
            },
            {
                title: "2014/10",
                status: "paid",
                from: "2014-10-01",
                to: "2014-10-31",
                items: [
                    {
                        resource: "cpu",
                        unit: "ns",
                        usage: "14261423871",
                        rate: "1.28E-8",
                        charge: 182.55
                    },
                    {
                        resource: "network.bytes.out",
                        unit: "B",
                        usage: "2261523811",
                        rate: "1.2E-6",
                        charge: 1243.85
                    }
                ]
            }
        ];

        this.getClassForBill = function(bill) {
            if(bill.status == "paid") {
                return "success";
            }
            else if(bill.status == "due") {
                return "danger";
            }

            return "info";
        };

        this.getTotalCostForBill = function(bill) {
            var billItems = bill.items || [];
            var sum = 0;

            for (var i = 0; i < billItems.length; i++) {
                var charge = billItems[i].charge || 0;
                sum += charge;
            };

            return sum;
        };

        var loadChargeDataSuccess = function(response) {
            billDataService.setRawData(response.data);
            var billData = billDataService.getFormattedData();
            restService.createBillPDF(billData);
        };

        var loadChargeDataFailed = function(reponse) {
            alertService.showError("Requesting charge data failed");
        };
    }

})();

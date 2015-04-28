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

describe('BillController', function() {
    var $scope;
    var controller;
    var deferred;
    var promise;

    /*
        Fake Data
     */
    var fakeKeystoneId = "asdl";
    var fakePaidBill = { status: "paid" };
    var fakeDueBill = { status: "due" };
    var fakeRunningBill = { status: "running" };
    var fakeBills = [
        {
            from: "2015-04-28",
            to: "2015-04-29"
        },
        {
            from: "2015-04-25",
            to: "2015-04-27"
        }
    ];
    var fakeBillResponse = {
        data: fakeBills
    };

    /*
        Test setup
     */
    beforeEach(function() {
        resetAllMocks();

        /*
            Load module
         */
        module('dashboard.bills');

        /*
            Inject dependencies and configure mocks
         */
        inject(function($controller, $q, $rootScope) {
            $scope = $rootScope.$new();
            deferred = $q.defer();
            promise = deferred.promise;

            sessionServiceMock.getKeystoneId.and.returnValue(fakeKeystoneId);
            restServiceMock.getBills.and.returnValue(promise);

            controller = $controller('BillController', {
                '$scope': $scope,
                'sessionService': sessionServiceMock,
                'restService': restServiceMock,
                'billDataService': billDataServiceMock,
                'alertService': alertServiceMock,
                'dateUtil': dateUtilMock
            });
        });
    });

    /*
        Tests
     */
    describe('getClassForBill', function() {
        it('should return "success" if bill is "paid"', function() {
            expect(controller.getClassForBill(fakePaidBill)).toBe("success");
        });

        it('should return "info" if bill is "running"', function() {
            expect(controller.getClassForBill(fakeRunningBill)).toBe("info");
        });

        it('should return "danger" if bill is "paid"', function() {
            expect(controller.getClassForBill(fakeDueBill)).toBe("danger");
        });
    });

    describe('getBills', function() {
        it('should correctly call restService.getBills', function() {
            controller.getBills(fakeKeystoneId);
            expect(restServiceMock.getBills).toHaveBeenCalledWith(fakeKeystoneId);
        });

        it('should execute success callback on deferred.resolve', function() {
            controller.getBills(fakeKeystoneId);

            deferred.resolve(fakeBillResponse);
            $scope.$digest();

            expect(controller.bills).toEqual(fakeBills);
        });

        it('should execute error callback on deferred.reject', function() {
            controller.getBills(fakeKeystoneId);

            deferred.reject();
            $scope.$digest();

            expect(alertServiceMock.showError).toHaveBeenCalled();
        });
    });
});

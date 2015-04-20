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
    var fakeDateToday = "2015-03-04";
    var fakeUser = "192asdk";
    var fakeFrom = "2015-03-03 00:00:00";
    var fakeTo = "2015-03-04 23:59:59";
    var fakePaidBill = { status: "paid" };
    var fakeDueBill = { status: "due" };
    var fakeRunningBill = { status: "running" };
    var fakeResponse = {
        data: {
            'test': 'abc'
        }
    };

    /*
        Test setup
     */
    beforeEach(function() {

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

            restServiceMock.getChargeForUser.and.returnValue(promise);
            dateUtilMock.getFormattedDateToday.and.returnValue(fakeDateToday);

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

    describe('requestCharge', function() {
        it('should correctly call restService.getChargeForUser', function() {
            controller.requestCharge(fakeUser, fakeFrom, fakeTo);
            deferred.resolve(fakeResponse);
            $scope.$digest();

            expect(restServiceMock.getChargeForUser)
                .toHaveBeenCalledWith(fakeUser, fakeFrom, fakeTo);
        });

        it('should execute loadUdrDataSuccess on deferred.resolve', function() {
            controller.requestCharge(fakeUser, fakeFrom, fakeTo);
            deferred.resolve(fakeResponse);
            $scope.$digest();

            expect(billDataServiceMock.setRawData)
                .toHaveBeenCalledWith(fakeResponse.data);
            expect(billDataServiceMock.getFormattedData).toHaveBeenCalled();
        });

        it('should excute loadUdrDataFailed on deferred.reject', function() {
            controller.requestCharge(fakeUser, fakeFrom, fakeTo);
            deferred.reject();
            $scope.$digest();

            expect(alertServiceMock.showError).toHaveBeenCalled();
        });
    });
});

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

describe('ChargeController', function() {
    var $scope;
    var controller;
    var chargeDeferred;
    var chargePromise;

    /*
        Fake Data
     */
    var errorMsg = "Requesting charge data failed";
    var fakeDateToday = "2015-03-04";
    var fakeFrom = "2015-03-03 00:00:00";
    var fakeTo = "2015-03-04 23:59:59";
    var fakeUser = "192asdk";
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
        module('dashboard.charge');

        /*
            Inject dependencies and configure mocks
         */
        inject(function($controller, $q, $rootScope) {
            $scope = $rootScope.$new();
            chargeDeferred = $q.defer();
            chargePromise = chargeDeferred.promise;

            restServiceMock.getChargeForUser.and.returnValue(chargePromise);
            dateUtilMock.getFormattedDateToday.and.returnValue(fakeDateToday);
            spyOn($scope, '$broadcast');

            controller = $controller('ChargeController', {
                '$scope': $scope,
                'restService': restServiceMock,
                'sessionService': sessionServiceMock,
                'chargeDataService': chargeDataServiceMock,
                'alertService': alertServiceMock,
                'dateUtil': dateUtilMock
            });
        });
    });

    /*
        Tests
     */
    describe('requestCharge', function() {
        it('should correctly call restService.getChargeForUser', function() {
            controller.requestCharge(fakeUser, fakeFrom, fakeTo);
            chargeDeferred.resolve(fakeResponse);
            $scope.$digest();

            expect(restServiceMock.getChargeForUser)
                .toHaveBeenCalledWith(fakeUser, fakeFrom, fakeTo);
        });

        it('should execute loadUdrDataSuccess on chargeDeferred.resolve', function() {
            controller.requestCharge(fakeUser, fakeFrom, fakeTo);
            chargeDeferred.resolve(fakeResponse);
            $scope.$digest();

            expect(chargeDataServiceMock.setRawData)
                .toHaveBeenCalledWith(fakeResponse.data);

            expect(chargeDataServiceMock.notifyChartDataReady).toHaveBeenCalled();
        });

        it('should excute loadUdrDataFailed on chargeDeferred.reject', function() {
            controller.requestCharge(fakeUser, fakeFrom, fakeTo);
            chargeDeferred.reject();
            $scope.$digest();

            expect(alertServiceMock.showError).toHaveBeenCalledWith(errorMsg);
        });
    });
});

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

describe('AdminBillingController', function() {
    var $scope;
    var controller;
    var userInfoDeferred;
    var userInfoPromise;
    var billDetailsDeferred;
    var billDetailsPromise;
    var billDeferred;
    var billPromise;

    /*
        Fake Data
     */
    var fakeUser = "testUser";
    var fakeKeystoneId = "asdk123kas";
    var fakeDate = "2015-02-03";
    var fakeFromDateTime = fakeDate + " 00:00";
    var fakeToDateTime = fakeDate + " 23:59";
    var fakeSessionId = "1234";
    var fakeUsers = ['user1', 'user2'];
    var fakeUserInfo = {
        keystoneid: [ fakeKeystoneId ]
    };
    var fakeUserInfoResponse = {
        data: fakeUserInfo
    };
    var fakeUserInfoResponseNoId = {
        data: {}
    };
    var fakeUserResponse = {
        data: {
            result: fakeUsers
        }
    };
    var fakeBillDetailsResponse = {
        data: {}
    };
    var fakeBillResponse = {
        data: {}
    };
    var fakeBillData = {
        'network.incoming.bytes': {
            resource: 'network.incoming.bytes',
            price: 3
        }
    };
    var fakePromiseResult = {
        userId: fakeKeystoneId,
        from: fakeDate,
        to: fakeDate,
        billItems: fakeBillData
    };

    /*
        Test setup
     */
    beforeEach(function(){
        resetAllMocks();

        /*
            Load module
         */
        module('dashboard.admin.billing');

        /*
            Inject dependencies and configure mocks
         */
        inject(function($controller, $q, $rootScope) {
            $scope = $rootScope.$new();
            userInfoDeferred = $q.defer();
            userInfoPromise = userInfoDeferred.promise;
            billDetailsDeferred = $q.defer();
            billDetailsPromise = billDetailsDeferred.promise;
            billDeferred = $q.defer();
            billPromise = billDeferred.promise;

            restServiceMock.getAllUsers.and.returnValue(userInfoPromise);
            restServiceMock.getUserInfo.and.returnValue(userInfoPromise);
            restServiceMock.getChargeForUser.and.returnValue(billDetailsPromise);
            restServiceMock.createBillPDF.and.returnValue(billPromise);
            sessionServiceMock.getSessionId.and.returnValue(fakeSessionId);
            responseParserMock.getUserListFromResponse.and.returnValue(fakeUsers);
            dateUtilMock.formatDateFromTimestamp.and.returnValue(fakeDate);
            billDataServiceMock.getFormattedData.and.returnValue(fakeBillData);

            controller = $controller('AdminBillingController', {
                '$scope': $scope,
                '$q': $q,
                '$modal': modalMock,
                'sessionService': sessionServiceMock,
                'restService': restServiceMock,
                'billDataService': billDataServiceMock,
                'alertService': alertServiceMock,
                'responseParser': responseParserMock,
                'dateUtil': dateUtilMock
            });

        });
    });

    /*
        Tests
     */
    describe('getAllUsers', function() {
        it('should correctly call restService.getAllUsers', function() {
            controller.getAllUsers();
            expect(restServiceMock.getAllUsers).toHaveBeenCalledWith(fakeSessionId);
        });

        it('should execute success callback on deferred.resolve', function() {
            controller.users = [];

            controller.getAllUsers();
            userInfoDeferred.resolve(fakeUserResponse);
            $scope.$digest();

            expect(responseParserMock.getUserListFromResponse)
                .toHaveBeenCalledWith(fakeUserResponse.data);
            expect(controller.users).toEqual(fakeUsers);
        });

        it('should execute error callback on deferred.reject', function() {
            controller.getAllUsers();
            userInfoDeferred.reject();
            $scope.$digest();

            expect(alertServiceMock.showError).toHaveBeenCalled();
        });
    });

    describe('onDateChanged', function() {
        it('should delegate dates to dateUtil for transformation', function() {
            controller.onDateChanged(fakeDate, fakeDate);
            expect(dateUtilMock.formatDateFromTimestamp).toHaveBeenCalledWith(fakeDate);
            expect(dateUtilMock.formatDateFromTimestamp.calls.count()).toBe(2);
        });

        it('should store from and to dates with start and end time', function() {
            controller.fromDate = undefined;
            controller.toDate = undefined;

            controller.onDateChanged(fakeDate, fakeDate);

            expect(controller.fromDate).toBe(fakeDate);
            expect(controller.toDate).toBe(fakeDate);
        });
    });

    describe('generateBill', function() {
        beforeEach(function() {
            controller.fromDate = fakeDate;
            controller.toDate = fakeDate;
            spyOn(controller, 'getKeystoneIdForUser').and.returnValue(userInfoPromise);
            spyOn(controller, 'getBillItems').and.returnValue(billDetailsPromise);
            spyOn(controller, 'generateBillPDF').and.returnValue(billPromise);
        });

        it('should show error if no dates are selected', function() {
            controller.fromDate = undefined;
            controller.toDate = undefined;

            controller.generateBill(fakeUser);

            expect(alertServiceMock.showError).toHaveBeenCalled();
        });

        it('should correctly call getKeystoneIdForUser if dates are selected', function() {
            controller.generateBill(fakeUser);

            expect(controller.getKeystoneIdForUser)
                .toHaveBeenCalledWith(fakeUser, fakeSessionId);
        });

        it('should call getBillItems on first deferred.resolve', function() {
            controller.generateBill(fakeUser);

            userInfoDeferred.resolve(fakePromiseResult);
            $scope.$apply();

            expect(controller.getBillItems).toHaveBeenCalledWith(fakePromiseResult);
        });

        it('should call generateBillPDF on second deferred.resolve', function() {
            controller.generateBill(fakeUser);

            userInfoDeferred.resolve(fakePromiseResult);
            billDetailsDeferred.resolve(fakePromiseResult);
            $scope.$apply();

            expect(controller.generateBillPDF).toHaveBeenCalledWith(fakePromiseResult);
        });

        it('should show modal on third deferred.resolve', function() {
            controller.generateBill(fakeUser);

            userInfoDeferred.resolve(fakePromiseResult);
            billDetailsDeferred.resolve(fakePromiseResult);
            billDeferred.resolve(fakePromiseResult);
            $scope.$apply();

            expect(modalMock.open).toHaveBeenCalled();
        });

        it('should display success message on third deferred.resolve', function() {
            controller.generateBill(fakeUser);

            userInfoDeferred.resolve(fakePromiseResult);
            billDetailsDeferred.resolve(fakePromiseResult);
            billDeferred.resolve(fakePromiseResult);
            $scope.$apply();

            expect(alertServiceMock.showSuccess).toHaveBeenCalled();
        });

        it('should execute error callback on deferred.reject', function() {
            controller.generateBill(fakeUser);

            userInfoDeferred.reject();
            $scope.$digest();

            expect(alertServiceMock.showError).toHaveBeenCalled();
        });
    });

    describe('getKeystoneIdForUser', function() {
        it('should correclty call restService.getUserInfo', function() {
            controller.getKeystoneIdForUser(fakeUser, fakeSessionId);
            expect(restServiceMock.getUserInfo).toHaveBeenCalledWith(fakeUser, fakeSessionId);
        });

        it('should resolve the deferred if userId available', function() {
            var promise = controller.getKeystoneIdForUser(fakeUser, fakeSessionId);

            userInfoDeferred.resolve(fakeUserInfoResponse);
            $scope.$apply();

            expect(promise.$$state.status).toBe(1);
        });

        it('should reject the deferred if no userId available', function() {
            var promise = controller.getKeystoneIdForUser(fakeUser, fakeSessionId);

            userInfoDeferred.resolve(fakeUserInfoResponseNoId);
            $scope.$apply();

            expect(promise.$$state.status).toBe(2);
        });

        it('should reject the deferred if rest call fails', function() {
            var promise = controller.getKeystoneIdForUser(fakeUser, fakeSessionId);

            userInfoDeferred.reject();
            $scope.$apply();

            expect(promise.$$state.status).toBe(2);
        });
    });

    describe('getBillItems', function() {
        it('should correclty call restService.getChargeForUser', function() {
            controller.getBillItems(fakePromiseResult);
            expect(restServiceMock.getChargeForUser)
                .toHaveBeenCalledWith(fakeKeystoneId, fakeFromDateTime, fakeToDateTime);
        });

        it('should resolve the deferred if rest call is successful', function() {
            var promise = controller.getBillItems(fakePromiseResult);

            billDetailsDeferred.resolve(fakeUserInfoResponse);
            $scope.$apply();

            expect(promise.$$state.status).toBe(1);
        });

        it('should reject the deferred if rest call fails', function() {
            var promise = controller.getBillItems(fakePromiseResult);

            billDetailsDeferred.reject();
            $scope.$apply();

            expect(promise.$$state.status).toBe(2);
        });
    });

    describe('generateBillPDF', function() {
        it('should correclty call restService.createBillPDF', function() {
            controller.generateBillPDF(fakePromiseResult);
            expect(restServiceMock.createBillPDF)
                .toHaveBeenCalledWith(fakePromiseResult);
        });

        it('should resolve the deferred if rest call is successful', function() {
            spyOn(window, 'Blob');
            var promise = controller.generateBillPDF(fakePromiseResult);

            billDeferred.resolve(fakeUserInfoResponse);
            $scope.$apply();

            expect(promise.$$state.status).toBe(1);
        });

        it('should reject the deferred if rest call fails', function() {
            var promise = controller.generateBillPDF(fakePromiseResult);

            billDeferred.reject();
            $scope.$apply();

            expect(promise.$$state.status).toBe(2);
        });
    });
});

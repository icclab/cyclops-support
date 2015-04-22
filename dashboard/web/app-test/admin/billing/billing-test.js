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
    var fakeDate = "2015-02-03";
    var fakeFromDateTime = fakeDate + " 00:00";
    var fakeToDateTime = fakeDate + " 23:59";
    var fakeSessionId = "1234";
    var fakeUsers = ['user1', 'user2'];
    var fakeUserInfo = {
        keystoneid: ["asdk123kas"]
    };
    var fakeUserInfoResponse = {
        data: fakeUserInfo
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

            expect(controller.fromDate).toBe(fakeFromDateTime);
            expect(controller.toDate).toBe(fakeToDateTime);
        });
    });

    describe('generateBill', function() {
        it('should correctly call restService.getUserInfo() if dates selected', function() {
            controller.fromDate = fakeFromDateTime;
            controller.toDate = fakeToDateTime;

            controller.generateBill(fakeUser);

            expect(restServiceMock.getUserInfo)
                .toHaveBeenCalledWith(fakeUser, fakeSessionId);
        });

        it('should not call restService.getUserInfo() if no dates selected', function() {
            controller.generateBill(fakeUser);
            expect(restServiceMock.getUserInfo)
                .not.toHaveBeenCalledWith(fakeUser, fakeSessionId);
        });

        it('should execute first success callback on first deferred.resolve', function() {
            controller.fromDate = fakeFromDateTime;
            controller.toDate = fakeToDateTime;

            controller.generateBill(fakeUser);

            userInfoDeferred.resolve(fakeUserInfoResponse);
            $scope.$digest();

            expect(restServiceMock.getChargeForUser).toHaveBeenCalledWith(
                fakeUserInfo.keystoneid[0],
                fakeFromDateTime,
                fakeToDateTime
            );
        });

        it('should execute second success callback on second deferred.resolve', function() {
            controller.fromDate = fakeFromDateTime;
            controller.toDate = fakeToDateTime;

            controller.generateBill(fakeUser);

            userInfoDeferred.resolve(fakeUserInfoResponse);
            billDetailsDeferred.resolve(fakeBillDetailsResponse);
            $scope.$digest();

            expect(billDataServiceMock.setRawData)
                .toHaveBeenCalledWith(fakeBillDetailsResponse.data);
            expect(billDataServiceMock.getFormattedData).toHaveBeenCalled();
            expect(restServiceMock.createBillPDF).toHaveBeenCalledWith(fakeBillData);
        });

        it('should execute third success callback on third deferred.resolve', function() {
            controller.fromDate = fakeFromDateTime;
            controller.toDate = fakeToDateTime;

            controller.generateBill(fakeUser);

            userInfoDeferred.resolve(fakeUserInfoResponse);
            billDetailsDeferred.resolve(fakeBillDetailsResponse);
            billDeferred.resolve(fakeBillResponse);
            $scope.$digest();

            expect(alertServiceMock.showSuccess).toHaveBeenCalled();
        });

        it('should execute error callback on deferred.reject', function() {
            controller.generateBill(fakeUser);

            userInfoDeferred.reject();
            $scope.$digest();

            expect(alertServiceMock.showError).toHaveBeenCalled();
        });
    });
});

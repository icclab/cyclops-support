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

describe('OverviewController', function() {
    var $scope;
    var $location;
    var controller;
    var udrDeferred;
    var udrPromise;

    /*
        Fake Data
     */
    var fakeTimeFrom = "00:00";
    var fakeTimeTo = "23:59";
    var fakeDateToday = "2015-03-04";
    var fakeKeystoneId = '123';
    var fakeFrom = "2015-03-04 00:00";
    var fakeTo = "2015-03-04 23:59";
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
        module('dashboard.overview');

        /*
            Inject dependencies and configure mocks
         */
        inject(function($controller, $q, $rootScope, _$location_) {
            $location = _$location_;
            $scope = $rootScope.$new();
            udrDeferred = $q.defer();
            udrPromise = udrDeferred.promise;

            sessionServiceMock.getKeystoneId.and.returnValue(fakeKeystoneId);
            restServiceMock.getUdrData.and.returnValue(udrPromise);
            dateUtilMock.getFormattedDateToday.and.returnValue(fakeDateToday);
            dateUtilMock.formatDateFromTimestamp.and.returnValue(fakeDateToday);
            spyOn($scope, '$broadcast');

            controller = $controller('OverviewController', {
                '$scope': $scope,
                'restService': restServiceMock,
                'sessionService': sessionServiceMock,
                'usageDataService': usageDataServiceMock,
                'alertService': alertServiceMock,
                'dateUtil': dateUtilMock
            });
        });
    });

    /*
        Tests
     */
    describe('updateCharts', function() {
        it('should call requestUsage if Keystone ID available', function() {
            spyOn(controller, 'hasKeystoneId').and.returnValue(true);
            spyOn(controller, 'requestUsage');

            controller.updateCharts(fakeFrom, fakeTo);

            expect(controller.hasKeystoneId).toHaveBeenCalled();
            expect(controller.requestUsage)
                .toHaveBeenCalledWith(fakeKeystoneId, fakeFrom, fakeTo);
        });

        it('should do nothing if no Keystone ID available', function() {
            spyOn(controller, 'hasKeystoneId').and.returnValue(false);
            spyOn(controller, 'requestUsage');

            controller.updateCharts(fakeDateToday, fakeDateToday);

            expect(controller.hasKeystoneId).toHaveBeenCalled();
            expect(controller.requestUsage).not.toHaveBeenCalled();
        });
    });

    describe('requestUsage', function() {
        it('should correctly call restService.getUdrData', function() {
            controller.requestUsage(fakeKeystoneId, fakeFrom, fakeTo);
            udrDeferred.resolve(fakeResponse);
            $scope.$digest();

            expect(restServiceMock.getUdrData)
                .toHaveBeenCalledWith(fakeKeystoneId, fakeFrom, fakeTo);
        });

        it('should execute loadUdrDataSuccess on udrDeferred.resolve', function() {
            controller.requestUsage(fakeKeystoneId, fakeFrom, fakeTo);
            udrDeferred.resolve(fakeResponse);
            $scope.$digest();

            expect(usageDataServiceMock.setRawData)
                .toHaveBeenCalledWith(fakeResponse.data);
        });

        it('should excute loadUdrDataFailed on udrDeferred.reject', function() {
            controller.requestUsage(fakeKeystoneId, fakeFrom, fakeTo);
            udrDeferred.reject();
            $scope.$digest();

            expect(alertServiceMock.showError).toHaveBeenCalled();
        });
    });

    describe('hasKeystoneId', function() {
        it('should return true if Keystone ID available', function() {
            expect(controller.hasKeystoneId()).toBeTruthy();
        });

        it('should return false if no Keystone ID available', function() {
            sessionServiceMock.getKeystoneId.and.returnValue('');
            expect(controller.hasKeystoneId()).toBeFalsy();
        });
    });

    describe('showCloudServices', function() {
        it('should redirect to /cloud-services', function() {
            controller.showCloudServices();
            expect($location.url()).toBe('/cloudservices');
        });
    });

    describe('onDateChanged', function() {
        it('should correctly call updateCharts', function() {
            spyOn(controller, 'updateCharts');

            controller.onDateChanged(fakeDateToday, fakeDateToday);

            expect(controller.updateCharts).toHaveBeenCalledWith(fakeFrom, fakeTo);
        });
    });
});

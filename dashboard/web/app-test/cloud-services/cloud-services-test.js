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

describe('CloudServiceController', function() {
    var $scope;
    var $location;
    var controller;
    var deferred;
    var promise;

    /*
        Fake Data
     */
    var fakeKeystoneId = "123abc";

    /*
        Test setup
     */
    beforeEach(function() {
        resetAllMocks();

        /*
            Load module
         */
        module('dashboard.cloudservices');

        /*
            Inject dependencies and configure mocks
         */
        inject(function($controller, $q, $rootScope, _$location_) {
            $location = _$location_;
            $scope = $rootScope.$new();
            deferred = $q.defer();
            promise = deferred.promise;

            sessionServiceMock.getKeystoneId.and.returnValue(fakeKeystoneId);
            restServiceMock.updateExternalUserIds.and.returnValue(promise);
            restServiceMock.getExternalUserIds.and.returnValue(promise);

            controller = $controller('CloudServiceController', {
                '$scope': $scope,
                '$state': stateMock,
                'restService': restServiceMock,
                'sessionService': sessionServiceMock,
                'alertService': alertServiceMock
            });
        });
    });

    /*
        Tests
     */
    describe('updateExternalUserIds', function() {
        it('should ', function() {
            expect(1).toBe(2);
        });
    });

    describe('loadExternalUserIds', function() {
        it('should ', function() {
            expect(1).toBe(2);
        });
    });

    describe('hasExternalUserIds', function() {
        it('should ', function() {
            expect(1).toBe(2);
        });
    });

    describe('showKeystone', function() {
        it('should ', function() {
            expect(1).toBe(2);
        });
    });
});

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

describe('NavigationController', function() {
    var $scope;
    var $location;
    var controller;

    /*
        Fake Data
     */

    /*
        Test setup
     */
    beforeEach(function() {
        resetAllMocks();

        /*
            Load module
         */
        module('dashboard.navigation');

        /*
            Inject dependencies and configure mocks
         */
        inject(function($controller, $q, $rootScope, _$location_) {
            $scope = $rootScope.$new();
            $location = _$location_;

            controller = $controller('NavigationController', {
                'sessionService': sessionServiceMock
            });
        });
    });

    /*
        Tests
     */
    describe('showAdminNavigation', function() {
        it('should read user status from session', function() {
            controller.showAdminNavigation();
            expect(sessionServiceMock.isAdmin).toHaveBeenCalledWith();
         });

        it('should return true if user is admin', function() {
            sessionServiceMock.isAdmin.and.returnValue(true);
            expect(controller.showAdminNavigation()).toBeTruthy();
        });

        it('should return false if user is not admin', function() {
            sessionServiceMock.isAdmin.and.returnValue(false);
            expect(controller.showAdminNavigation()).toBeFalsy();
        });
    });

    describe('logout', function() {
        it('should clear session', function() {
            controller.logout();
            expect(sessionServiceMock.clearSession).toHaveBeenCalled();
            expect($location.url()).toBe('/login');
        });
    });
});

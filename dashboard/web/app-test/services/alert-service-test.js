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

describe('AlertService', function() {
    var toastyMock;
    var $log;

    /*
        Test setup
     */
    beforeEach(function() {
        resetAllMocks();

        /*
            Load module
         */
        module('dashboard.services');

        toastyMock = {
            pop: {
                error: function() {},
                success: function() {}
            }
        };

        spyOn(toastyMock.pop, "error");
        spyOn(toastyMock.pop, "success");

        module(function($provide) {
            $provide.value('toasty', toastyMock);
        });

        /*
            Inject dependencies and configure mocks
         */
        inject(function(_alertService_, _$log_) {
            service = _alertService_;
            $log = _$log_;
        });
    });

    /*
        Tests
     */
    describe('showError', function() {
        it('should call toasty.pop.error', function() {
            service.showError();
            expect(toastyMock.pop.error).toHaveBeenCalled();
        });

        it('should write to $log', function() {
            service.showError("test");
            expect($log.debug.logs).toContain(["Error: test"]);
        });
    });

    describe('showSuccess', function() {
        it('should call toasty.pop.success', function() {
            service.showSuccess();
            expect(toastyMock.pop.success).toHaveBeenCalled();
        });

        it('should write to $log', function() {
            service.showSuccess("test");
            expect($log.debug.logs).toContain(["Success: test"]);
        });
    });
});

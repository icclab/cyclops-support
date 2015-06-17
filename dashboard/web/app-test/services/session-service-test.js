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

describe('SessionService', function() {
    /*
        Test setup
     */
    beforeEach(function() {
        resetAllMocks();

        /*
            Load module
         */
        module('dashboard.services');

        /*
            Inject dependencies and configure mocks
         */
        inject(function(_sessionService_) {
            service = _sessionService_;
        });

        spyOn(sessionStorage, "setItem");
        spyOn(sessionStorage, "getItem");
        spyOn(sessionStorage, "clear");
    });

    /*
        Tests
     */
    describe('clearSession', function() {
        it('should clear the sessionStorage', function() {
            service.clearSession();
            expect(sessionStorage.clear).toHaveBeenCalled();
        });
    });

    describe('getSessionId', function() {
        it('should return correct value', function() {
             service.getSessionId();
             expect(sessionStorage.getItem).toHaveBeenCalledWith('sessionId');
         });
    });

    describe('getAccessToken', function() {
        it('should return correct value', function() {
             service.getAccessToken();
             expect(sessionStorage.getItem).toHaveBeenCalledWith('accessToken');
         });
    });

    describe('getIdToken', function() {
        it('should return correct value', function() {
             service.getIdToken();
             expect(sessionStorage.getItem).toHaveBeenCalledWith('idToken');
         });
    });

    describe('getUsername', function() {
        it('should return correct value', function() {
             service.getUsername();
             expect(sessionStorage.getItem).toHaveBeenCalledWith('username');
         });
    });

    describe('getTokenType', function() {
        it('should return correct value', function() {
             service.getTokenType();
             expect(sessionStorage.getItem).toHaveBeenCalledWith('tokenType');
         });
    });

    describe('getExpiration', function() {
        it('should return correct value', function() {
             service.getExpiration();
             expect(sessionStorage.getItem).toHaveBeenCalledWith('expires');
         });
    });

    describe('getKeystoneId', function() {
        it('should return correct value', function() {
             service.getKeystoneId();
             expect(sessionStorage.getItem).toHaveBeenCalledWith('keystoneId');
         });
    });

    describe('setSessionId', function() {
        it('should set correct value', function() {
            service.setSessionId('xyz');
            expect(sessionStorage.setItem).toHaveBeenCalledWith('sessionId', 'xyz');
        });
    });

    describe('setAccessToken', function() {
        it('should set correct value', function() {
            service.setAccessToken('xyz');
            expect(sessionStorage.setItem).toHaveBeenCalledWith('accessToken', 'xyz');
        });
    });

    describe('setIdToken', function() {
        it('should set correct value', function() {
            service.setIdToken('xyz');
            expect(sessionStorage.setItem).toHaveBeenCalledWith('idToken', 'xyz');
        });
    });

    describe('setUsername', function() {
        it('should set correct value', function() {
            service.setUsername('xyz');
            expect(sessionStorage.setItem).toHaveBeenCalledWith('username', 'xyz');
        });
    });

    describe('setTokenType', function() {
        it('should set correct value', function() {
            service.setTokenType('xyz');
            expect(sessionStorage.setItem).toHaveBeenCalledWith('tokenType', 'xyz');
        });
    });

    describe('setExpiration', function() {
        it('should set correct value', function() {
            service.setExpiration('xyz');
            expect(sessionStorage.setItem).toHaveBeenCalledWith('expires', 'xyz');
        });
    });

    describe('setKeystoneId', function() {
        it('should set correct value', function() {
            service.setKeystoneId('xyz');
            expect(sessionStorage.setItem).toHaveBeenCalledWith('keystoneId', 'xyz');
        });
    });

    describe('setAdmin', function() {
        it('should set correct value', function() {
            service.setAdmin('true');
            expect(sessionStorage.setItem).toHaveBeenCalledWith('admin', 'true');
        });
    });

    describe('isAdmin', function() {
        it('should return true if user is admin', function() {
            sessionStorage.getItem.and.returnValue("true");
            expect(service.isAdmin()).toBeTruthy();
        });

        it('should return false if user is not admin', function() {
            sessionStorage.getItem.and.returnValue("false");
            expect(service.isAdmin()).toBeFalsy();
        });
    });

    describe('isAuthenticated', function() {
        it('should return true if user is authenticated', function() {
            sessionStorage.getItem.and.returnValue("abcd");
            expect(service.isAuthenticated()).toBeTruthy();
        });

        it('should return false if user is not authenticated', function() {
            sessionStorage.getItem.and.returnValue("");
            expect(service.isAuthenticated()).toBeFalsy();
        });
    });
});

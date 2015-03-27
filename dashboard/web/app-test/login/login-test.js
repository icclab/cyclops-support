describe('LoginController', function() {
    var $log;
    var $scope;
    var $location;
    var loginController;
    var restServiceMock;
    var sessionServiceMock;
    var alertServiceMock;
    var responseParserMock;
    var loginDeferred;
    var tokenDeferred;
    var sessionDeferred;
    var loginPromise;
    var tokenPromise;
    var sessionPromise;

    /*
        Fake Data
     */
    var errorMsg = "Username or password is invalid. Please try again";
    var fakeUser = "testuser";
    var fakePass = "testpass";
    var fakeLoginResponse = {
        data: {
            'access_token': 'abc',
            'id_token': '123'
        }
    };
    var fakeTokenResponse = {
        data: {
            'keystoneid': '1a2b3c'
        }
    };
    var fakeSessionResponse = {
        data: {
            'tokenId': "5s5s5s"
        }
    };

    /*
        Test setup
     */
    beforeEach(function() {

        /*
            Load module
         */
        module('dashboard.login');

        /*
            Mocks
         */
        restServiceMock = jasmine.createSpyObj(
            'restService',
            ['sendLoginRequest', 'getTokenInfo', 'requestSessionToken']
        );

        sessionServiceMock = jasmine.createSpyObj(
            'sessionService',
            [
                'setUsername', 'setAccessToken', 'setAdmin',
                'setIdToken', 'setKeystoneId', 'setSessionId'
            ]
        );

        alertServiceMock = jasmine.createSpyObj(
            'alertService',
            ['showError']
        );

        responseParserMock = jasmine.createSpyObj(
            'responseParser',
            ['getAdminStatusFromResponse']
        );

        /*
            Inject dependencies and configure mocks
         */
        inject(function($controller, $q, $rootScope, _$location_) {
            $location = _$location_;
            $scope = $rootScope.$new();
            loginDeferred = $q.defer();
            tokenDeferred = $q.defer();
            sessionDeferred = $q.defer();
            loginPromise = loginDeferred.promise;
            tokenPromise = tokenDeferred.promise;
            sessionPromise = sessionDeferred.promise;

            restServiceMock.sendLoginRequest.and.returnValue(loginPromise);
            restServiceMock.getTokenInfo.and.returnValue(tokenPromise);
            restServiceMock.requestSessionToken.and.returnValue(sessionPromise);
            responseParserMock.getAdminStatusFromResponse.and.returnValue(true);

            loginController = $controller('LoginController', {
                '$scope': $scope,
                'restService': restServiceMock,
                'sessionService': sessionServiceMock,
                'alertService': alertServiceMock,
                'responseParser': responseParserMock
            });

            loginController.user = fakeUser;
            loginController.pwd = fakePass;
        });
    });

    /*
        Tests
     */
    describe('login', function() {
        it('should correctly call restService.sendLoginRequest', function() {
            loginController.login();

            expect(restServiceMock.sendLoginRequest)
                .toHaveBeenCalled();
        });

        it('should correctly call restService.getTokenInfo', function() {
            loginController.login();
            loginDeferred.resolve(fakeLoginResponse);
            $scope.$digest();

            expect(restServiceMock.getTokenInfo)
                .toHaveBeenCalledWith(fakeLoginResponse.data.access_token);
        });

        it('should execute loginSuccess on loginDeferred.resolve', function() {
            loginController.login();
            loginDeferred.resolve(fakeLoginResponse);
            $scope.$digest();

            expect(sessionServiceMock.setUsername)
                .toHaveBeenCalledWith(fakeUser);
            expect(sessionServiceMock.setAccessToken)
                .toHaveBeenCalledWith(fakeLoginResponse.data.access_token);
            expect(sessionServiceMock.setIdToken)
                .toHaveBeenCalledWith(fakeLoginResponse.data.id_token);
            expect(restServiceMock.getTokenInfo)
                .toHaveBeenCalledWith(fakeLoginResponse.data.access_token);
        });

        it('should execute tokenInfoSuccess on tokenInfoDeferred.resolve', function() {
            loginController.login();
            loginDeferred.resolve(fakeLoginResponse);
            tokenDeferred.resolve(fakeTokenResponse);
            $scope.$digest();

            expect(sessionServiceMock.setKeystoneId)
                .toHaveBeenCalledWith(fakeTokenResponse.data.keystoneid);
            expect(restServiceMock.requestSessionToken)
                .toHaveBeenCalledWith(fakeUser, fakePass);
            expect(responseParserMock.getAdminStatusFromResponse)
                .toHaveBeenCalledWith(fakeTokenResponse.data);
            expect(sessionServiceMock.setAdmin).toHaveBeenCalledWith(true);
        });

        it('should execute sessionInfoSuccess on sessionInfoDeferred.resolve', function() {
            spyOn(loginController, 'showOverview');
            loginController.login();
            loginDeferred.resolve(fakeLoginResponse);
            tokenDeferred.resolve(fakeTokenResponse);
            sessionDeferred.resolve(fakeSessionResponse);
            $scope.$digest();

            expect(sessionServiceMock.setKeystoneId)
                .toHaveBeenCalledWith(fakeTokenResponse.data.keystoneid);
            expect(loginController.showOverview).toHaveBeenCalled();
        });

        it('should execute loginFailed on loginDeferred.reject', function() {
            loginController.login();
            loginDeferred.reject();
            $scope.$digest();

            expect(alertServiceMock.showError).toHaveBeenCalledWith(errorMsg);
        });

        it('should execute loginFailed on tokenDeferred.reject', function() {
            loginController.login();
            loginDeferred.resolve(fakeLoginResponse);
            tokenDeferred.reject();
            $scope.$digest();

            expect(alertServiceMock.showError).toHaveBeenCalledWith(errorMsg);
        });

        it('should execute loginFailed on sessionDeferred.reject', function() {
            loginController.login();
            loginDeferred.resolve(fakeLoginResponse);
            tokenDeferred.resolve(fakeTokenResponse);
            sessionDeferred.reject();
            $scope.$digest();

            expect(alertServiceMock.showError).toHaveBeenCalledWith(errorMsg);
        });
    });

    describe('showOverview', function() {
        it('should redirect to /overview', function() {
            loginController.showOverview();
            expect($location.url()).toBe('/overview');
        });
    });

});

describe('KeystoneController', function() {
    var $log;
    var $scope;
    var $location;
    var keystoneController;
    var restServiceMock;
    var sessionServiceMock;
    var authDeferred;
    var sessionDeferred;
    var authPromise;
    var sessionPromise;

    /*
        Fake Data
     */
    var fakeUser = "testuser";
    var fakePass = "fakepass";
    var fakeSessionId = "amo666";
    var fakeKeystoneId = "a1b2c3";
    var fakeResponse = {
        data: {
            keystoneId: fakeKeystoneId
        }
     };

    /*
        Test setup
     */
    beforeEach(function() {

        /*
            Load module
         */
        module('dashboard.keystone');

        /*
            Mocks
         */
        restServiceMock = jasmine.createSpyObj(
            'restService',
            ['storeKeystoneId', 'sendKeystoneAuthRequest']
        );

        sessionServiceMock = jasmine.createSpyObj(
            'sessionService',
            ['getUsername', 'getKeystoneId', 'getSessionId', 'setKeystoneId']
        );

        /*
            Inject dependencies and configure mocks
         */
        inject(function($controller, $q, $rootScope, _$log_, _$location_) {
            $log = _$log_;
            $location = _$location_;
            $scope = $rootScope.$new();
            authDeferred = $q.defer();
            sessionDeferred = $q.defer();
            authPromise = authDeferred.promise;
            sessionPromise = sessionDeferred.promise;

            restServiceMock.sendKeystoneAuthRequest.and.returnValue(authPromise);
            restServiceMock.storeKeystoneId.and.returnValue(sessionPromise);
            sessionServiceMock.getUsername.and.returnValue(fakeUser);
            sessionServiceMock.getKeystoneId.and.returnValue(fakeKeystoneId);
            sessionServiceMock.getSessionId.and.returnValue(fakeSessionId);

            keystoneController = $controller('KeystoneController', {
                '$scope': $scope,
                'restService': restServiceMock,
                'sessionService': sessionServiceMock
            });

            keystoneController.user = fakeUser;
            keystoneController.pwd = fakePass;
        });
    });

    /*
        Tests
     */
    describe('loadKeystoneId', function() {
        it('should correctly call restService.sendKeystoneAuthRequest', function() {
            keystoneController.loadKeystoneId();

            expect(restServiceMock.sendKeystoneAuthRequest)
                .toHaveBeenCalledWith(fakeUser, fakePass);
        });

        it('should execute keystoneAuthSuccess on authDeferred.resolve', function() {
            keystoneController.loadKeystoneId();
            authDeferred.resolve(fakeResponse);
            $scope.$digest();

            expect(sessionServiceMock.setKeystoneId)
                .toHaveBeenCalledWith(fakeResponse.data.keystoneId);
            expect(restServiceMock.storeKeystoneId)
                .toHaveBeenCalledWith(fakeUser, fakeKeystoneId, fakeSessionId);
        });

        it('should execute keystoneIdStored on sessionDeferred.resolve', function() {
            keystoneController.loadKeystoneId();
            authDeferred.resolve(fakeResponse);
            sessionDeferred.resolve();
            $scope.$digest();

            expect($location.url()).toBe("/overview");
        });

        it('should execute keystoneAuthFailed on authDeferred.reject', function() {
            keystoneController.loadKeystoneId();
            authDeferred.reject();
            $scope.$digest();

            expect($log.debug.logs).toContain(['Reading Keystone ID failed']);
        });

        it('should execute keystoneAuthFailed on sessionDeferred.reject', function() {
            keystoneController.loadKeystoneId();
            authDeferred.resolve(fakeResponse);
            sessionDeferred.reject();
            $scope.$digest();

            expect($log.debug.logs).toContain(['Reading Keystone ID failed']);
        });
    });
});

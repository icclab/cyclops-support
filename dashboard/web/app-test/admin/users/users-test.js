describe('AdminUserController', function() {
    var controller;
    var sessionServiceMock;
    var restServiceMock;
    var responseParserMock;
    var userDeferred;
    var adminDeferred;
    var userPromise;
    var adminPromise;

    /*
        Fake Data
     */
    var fakeSessionId = "123abc";
    var fakeUserResponseData = {
        result: "bla"
    };
    var fakeAdminResponseData = {
        uniqueMember: "bla"
    };
    var fakeUserResponse = {
        data: fakeUserResponseData
    };
    var fakeAdminResponse = {
        data: fakeAdminResponseData
    };
    var fakeUserList = ["UserA", "AdminA"];
    var fakeNormalUsers = ["UserA"];
    var fakeAdmins = ["AdminA"];

    /*
        Test setup
     */
    beforeEach(function(){

        /*
            Load module
         */
        module('dashboard.admin.users');

        /*
            Mocks
         */
        restServiceMock = jasmine.createSpyObj(
            'restService',
            ['getAllUsers', 'getAdminGroupInfo']
        );

        sessionServiceMock = jasmine.createSpyObj(
            'sessionService',
            ['getSessionId']
        );

        responseParserMock = jasmine.createSpyObj(
            'responseParser',
            ['getUserListFromResponse', 'getAdminListFromResponse']
        );

        /*
            Inject dependencies and configure mocks
         */
        inject(function($controller, $q, $rootScope, _$log_) {
            $scope = $rootScope.$new();
            $log = _$log_;
            userDeferred = $q.defer();
            adminDeferred = $q.defer();
            userPromise = userDeferred.promise;
            adminPromise = adminDeferred.promise;

            sessionServiceMock.getSessionId.and.returnValue(fakeSessionId);
            restServiceMock.getAllUsers.and.returnValue(userPromise);
            restServiceMock.getAdminGroupInfo.and.returnValue(adminPromise);
            responseParserMock.getUserListFromResponse.and.returnValue(fakeUserList);
            responseParserMock.getAdminListFromResponse.and.returnValue(fakeAdmins);

            controller = $controller('AdminUserController', {
                '$scope': $scope,
                'sessionService': sessionServiceMock,
                'restService': restServiceMock,
                'responseParser': responseParserMock
            });
        });
    });

    /*
        Tests
     */
    describe('getAllUsers', function() {
        it('should correctly call restService.getAllUsers', function() {
            controller.getAllUsers();

            expect(sessionServiceMock.getSessionId).toHaveBeenCalled();
            expect(restServiceMock.getAllUsers)
                .toHaveBeenCalledWith(fakeSessionId);
        });

        it('should execute onUsersLoadSuccess on userDeferred.resolve', function() {
            controller.getAllUsers();
            userDeferred.resolve(fakeUserResponse);
            $scope.$digest();

            expect(responseParserMock.getUserListFromResponse)
                .toHaveBeenCalledWith(fakeUserResponseData);
        });

        it('should execute onAdminsLoadSuccess on adminDeferred.resolve', function() {
            controller.getAllUsers();
            userDeferred.resolve(fakeUserResponse);
            adminDeferred.resolve(fakeAdminResponse);
            $scope.$digest();

            expect(responseParserMock.getUserListFromResponse)
                .toHaveBeenCalledWith(fakeUserResponseData);
            expect(responseParserMock.getAdminListFromResponse)
                .toHaveBeenCalledWith(fakeAdminResponseData);
        });

        it('should execute onLoadError on userDeferred.reject', function() {
            controller.getAllUsers();
            userDeferred.reject();
            $scope.$digest();

            expect($log.debug.logs).toContain(['onLoadError']);
        });

        it('should execute onLoadError on adminDeferred.reject', function() {
            controller.getAllUsers();
            userDeferred.resolve(fakeUserResponse);
            adminDeferred.reject();
            $scope.$digest();

            expect($log.debug.logs).toContain(['onLoadError']);
        });
    });
});

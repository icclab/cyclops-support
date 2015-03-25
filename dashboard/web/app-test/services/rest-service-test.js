describe('RestService', function() {
    var restService;
    var $httpBackend;

    /*
        Fake Data
     */
    var fakeUser = "testuser";
    var fakePass = "testpass";
    var fakeKeystoneId = "123";
    var fakeSessionId = "abc123";
    var fakeAccessToken = "5s5s5s";
    var fakeUdrMeters = { meter: "bla" };
    var fakeMeterName = "net";
    var fakeFrom = "2015-01-01 12:00:00";
    var fakeTo = "2015-01-02 12:00:00";
    var fakeRateQuery = "?resourcename="+fakeMeterName+"&from="+fakeFrom+"&to="+fakeTo;
    var fakeAccessQuery = "?access_token=" + fakeAccessToken;
    var fakeSessionQuery = "?session_id=" + fakeSessionId;

    /*
        Test setup
     */
    beforeEach(function(){

        /*
            Load module
         */
        module('dashboard.services');

        /*
            Inject dependencies and configure mocks
         */
        inject(function(_restService_, _$httpBackend_) {
            restService = _restService_;
            $httpBackend = _$httpBackend_;
        });

        $httpBackend.whenPOST("/dashboard/rest/usage").respond(200);
        $httpBackend.whenGET("/dashboard/rest/rate" + fakeRateQuery).respond(200);
        $httpBackend.whenPOST("/dashboard/rest/keystone").respond(200);
        $httpBackend.whenPOST("/dashboard/rest/login").respond(200);
        $httpBackend.whenPOST("/dashboard/rest/session").respond(200);
        $httpBackend.whenPUT("/dashboard/rest/keystone").respond(200);
        $httpBackend.whenGET("/dashboard/rest/tokeninfo" + fakeAccessQuery).respond(200);
        $httpBackend.whenGET("/dashboard/rest/keystonemeters").respond(200);
        $httpBackend.whenGET("/dashboard/rest/udrmeters").respond(200);
        $httpBackend.whenPOST("/dashboard/rest/udrmeters").respond(200);
        $httpBackend.whenGET("/dashboard/rest/users" + fakeSessionQuery).respond(200);
        $httpBackend.whenGET("/dashboard/rest/admins" + fakeSessionQuery).respond(200);
    });

    /*
        Test teardown
     */
    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    /*
        Tests
     */
    describe('getUdrData', function() {
        it('should send complete POST request', function() {
            $httpBackend.expectPOST("/dashboard/rest/usage", {
                'keystoneId': fakeKeystoneId,
                'from': fakeFrom,
                'to': fakeTo
            });
            restService.getUdrData(fakeKeystoneId, fakeFrom, fakeTo);
            $httpBackend.flush();
        });
    });

    describe('sendKeystoneAuthRequest', function() {
        it('should send complete POST request', function() {
            $httpBackend.expectPOST("/dashboard/rest/keystone", {
                'username': fakeUser,
                'password': fakePass
            });
            restService.sendKeystoneAuthRequest(fakeUser, fakePass);
            $httpBackend.flush();
        });
    });

    describe('sendLoginRequest', function() {
        it('should send complete POST request', function() {
            $httpBackend.expectPOST("/dashboard/rest/login", {
                'username': fakeUser,
                'password': fakePass
            });
            restService.sendLoginRequest(fakeUser, fakePass);
            $httpBackend.flush();
        });
    });

    describe('requestSessionToken', function() {
        it('should send complete POST request', function() {
            $httpBackend.expectPOST("/dashboard/rest/session", {
                'username': fakeUser,
                'password': fakePass
            });
            restService.requestSessionToken(fakeUser, fakePass);
            $httpBackend.flush();
        });
    });

    describe('storeKeystoneId', function() {
        it('should send complete PUT request', function() {
            $httpBackend.expectPUT("/dashboard/rest/keystone", {
                'username': fakeUser,
                'sessionId': fakeSessionId,
                'keystoneId': fakeKeystoneId
            });
            restService.storeKeystoneId(fakeUser, fakeKeystoneId, fakeSessionId);
            $httpBackend.flush();
        });
    });

    describe('getTokenInfo', function() {
        it('should send complete GET request', function() {
            $httpBackend.expectGET("/dashboard/rest/tokeninfo" + fakeAccessQuery);
            restService.getTokenInfo(fakeAccessToken);
            $httpBackend.flush();
        });
    });

    describe('getKeystoneMeters', function() {
        it('should send complete GET request', function() {
            $httpBackend.expectGET("/dashboard/rest/keystonemeters");
            restService.getKeystoneMeters();
            $httpBackend.flush();
        });
    });

    describe('getAdminGroupInfo', function() {
        it('should send complete GET request', function() {
            $httpBackend.expectGET("/dashboard/rest/admins" + fakeSessionQuery);
            restService.getAdminGroupInfo(fakeSessionId);
            $httpBackend.flush();
        });
    });

    describe('getAllUsers', function() {
        it('should send complete GET request', function() {
            $httpBackend.expectGET("/dashboard/rest/users" + fakeSessionQuery);
            restService.getAllUsers(fakeSessionId);
            $httpBackend.flush();
        });
    });

    describe('getUdrMeters', function() {
        it('should send complete GET request', function() {
            $httpBackend.expectGET("/dashboard/rest/udrmeters");
            restService.getUdrMeters();
            $httpBackend.flush();
        });
    });

    describe('updateUdrMeters', function() {
        it('should send complete POST request', function() {
            $httpBackend.expectPOST("/dashboard/rest/udrmeters", fakeUdrMeters);
            restService.updateUdrMeters(fakeUdrMeters);
            $httpBackend.flush();
        });
    });

    describe('getRateForMeter', function() {
        it('should send complete GET request', function() {
            $httpBackend.expectGET("/dashboard/rest/rate" + fakeRateQuery);
            restService.getRateForMeter(fakeMeterName, fakeFrom, fakeTo);
            $httpBackend.flush();
        });
    });
});

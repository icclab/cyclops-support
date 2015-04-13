describe('ResponseParser', function() {
    var responseParser;

    /*
        Fake Data
     */
    var fakeStaticMeterResponse = {
        rate: {
            "meter.name1": "5",
            "meter.other.test": "0.5"
        }
    };

    var fakeEmptyStaticMeterResponse = {
        rate: null
    };

    var fakeStaticMeterList = [
        {
            name: "meter.name1",
            rate: "5",
        },
        {
            name: "meter.other.test",
            rate: "0.5"
        }
    ];

    var fakeGroupResponse = {
        username: "CyclopsAdmin",
        uniqueMember: [
            "uid=userX,ou=people,dc=openam,dc=forgerock,dc=org",
            "uid=userY,ou=people,dc=openam,dc=forgerock,dc=org"
        ]
    };

    var fakeEmptyGroupResponse = {
        username: "CyclopsAdmin",
        uniqueMember: []
    };

    var fakeUserList = ['userX', 'userY'];

    var fakeUserResponse = {
        result: fakeUserList
    };

    var fakeEmptyUserResponse = {
        result: undefined
    };

    var fakeAdminStatusSingleResponse = {
        isMemberOf: "cn=CyclopsAdmin,ou=groups,dc=openam,dc=forgerock,dc=org"
    };

    var fakeAdminStatusArrayResponse = {
        isMemberOf: [
            "cn=TestGroup,ou=groups,dc=openam,dc=forgerock,dc=org",
            "cn=CyclopsAdmin,ou=groups,dc=openam,dc=forgerock,dc=org"
        ]
    };

    var fakeAdminStatusOtherGroupResponse = {
        isMemberOf: "cn=TestGroup,ou=groups,dc=openam,dc=forgerock,dc=org"
    };

    var fakeAdminStatusEmptyResponse = {};

    /*
        Test setup
     */
    beforeEach(function(){

        /*
            Load module
         */
        module('dashboard.utils');

        /*
            Inject dependencies and configure mocks
         */
        inject(function(_responseParser_) {
            responseParser = _responseParser_;
        });
    });

    /*
        Tests
     */
    describe('getStaticRatingListFromResponse', function() {
        it('should return a list of static meters', function() {
            var res = responseParser.getStaticRatingListFromResponse(fakeStaticMeterResponse);
            expect(res).toEqual(fakeStaticMeterList);
        });

        it('should correctly handle empty response', function() {
            var res = responseParser.getStaticRatingListFromResponse(fakeEmptyStaticMeterResponse);
            expect(res).toEqual([]);
        });
    });

    describe('getAdminListFromResponse', function() {
        it('should return a list of usernames', function() {
            var res = responseParser.getAdminListFromResponse(fakeGroupResponse);
            expect(res).toEqual(fakeUserList);
        });

        it('should correctly handle empty user list', function() {
            var res = responseParser.getAdminListFromResponse(fakeEmptyGroupResponse);
            expect(res).toEqual([]);
        });
    });

    describe('getUserListFromResponse', function() {
        it('should return a list of usernames', function() {
            var res = responseParser.getUserListFromResponse(fakeUserResponse);
            expect(res).toEqual(fakeUserList);
        });

        it('should correctly handle empty user list', function() {
            var res = responseParser.getUserListFromResponse(fakeEmptyUserResponse);
            expect(res).toEqual([]);
        });
    });

    describe('getAdminStatusFromResponse', function() {
        it('should return true if user is only in admin group', function() {
            var res = responseParser.getAdminStatusFromResponse(fakeAdminStatusSingleResponse);
            expect(res).toEqual(true);
        });

        it('should return true if user is in admin group among others', function() {
            var res = responseParser.getAdminStatusFromResponse(fakeAdminStatusArrayResponse);
            expect(res).toEqual(true);
        });

        it('should return false if user is not in admin group', function() {
            var res = responseParser.getAdminStatusFromResponse(fakeAdminStatusOtherGroupResponse);
            expect(res).toEqual(false);
        });

        it('should return false if user is in no group', function() {
            var res = responseParser.getAdminStatusFromResponse(fakeAdminStatusEmptyResponse);
            expect(res).toEqual(false);
        });
    });
});

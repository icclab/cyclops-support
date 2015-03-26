describe('RateController', function() {
    var $log;
    var $scope;
    var $location;
    var controller;
    var restServiceMock;
    var sessionServiceMock;
    var chargeDataServiceMock;
    var dateUtilMock;
    var chargeDeferred;
    var chargePromise;

    /*
        Fake Data
     */
    var fakeDateToday = "2015-03-04";
    var fakeDateYesterday = "2015-03-03";
    var fakeDateLast3days = "2015-03-02";
    var fakeDateLastWeek = "2015-02-27";
    var fakeDateLastMonth = "2015-02-05";
    var fakeDateLastYear = "2014-03-05";
    var fakeFrom = "2015-03-03 00:00:00";
    var fakeTo = "2015-03-04 23:59:59";
    var fakeUser = "192asdk";
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
        module('dashboard.charge');

        /*
            Mocks
         */
        restServiceMock = jasmine.createSpyObj(
            'restService',
            ['getChargeForUser']
        );

        sessionServiceMock = jasmine.createSpyObj(
            'sessionService',
            ['getKeystoneId', 'setUserData']
        );

        chargeDataServiceMock = jasmine.createSpyObj(
            'chargeDataService',
            ['setRawData']
        );

        dateUtilMock = jasmine.createSpyObj(
            'dateUtil',
            [
                'getFormattedDateToday', 'getFormattedDateYesterday',
                'getFormattedDateLast3Days', 'getFormattedDateLastWeek',
                'getFormattedDateLastMonth', 'getFormattedDateLastYear'
            ]
        );

        /*
            Inject dependencies and configure mocks
         */
        inject(function($controller, $q, $rootScope, _$log_, _$location_) {
            $log = _$log_;
            $location = _$location_;
            $scope = $rootScope.$new();
            chargeDeferred = $q.defer();
            chargePromise = chargeDeferred.promise;

            restServiceMock.getChargeForUser.and.returnValue(chargePromise);
            dateUtilMock.getFormattedDateToday.and.returnValue(fakeDateToday);
            dateUtilMock.getFormattedDateYesterday.and.returnValue(fakeDateYesterday);
            dateUtilMock.getFormattedDateLast3Days.and.returnValue(fakeDateLast3days);
            dateUtilMock.getFormattedDateLastWeek.and.returnValue(fakeDateLastWeek);
            dateUtilMock.getFormattedDateLastMonth.and.returnValue(fakeDateLastMonth);
            dateUtilMock.getFormattedDateLastYear.and.returnValue(fakeDateLastYear);
            spyOn($scope, '$broadcast');

            controller = $controller('ChargeController', {
                '$scope': $scope,
                'restService': restServiceMock,
                'sessionService': sessionServiceMock,
                'chargeDataService': chargeDataServiceMock,
                'dateUtil': dateUtilMock
            });
        });
    });

    /*
        Tests
     */
    describe('requestCharge', function() {
        it('should correctly call restService.getChargeForUser', function() {
            controller.requestCharge(fakeUser, fakeFrom, fakeTo);
            chargeDeferred.resolve(fakeResponse);
            $scope.$digest();

            expect(restServiceMock.getChargeForUser)
                .toHaveBeenCalledWith(fakeUser, fakeFrom, fakeTo);
        });

        it('should execute loadUdrDataSuccess on chargeDeferred.resolve', function() {
            controller.requestCharge(fakeUser, fakeFrom, fakeTo);
            chargeDeferred.resolve(fakeResponse);
            $scope.$digest();

            expect(chargeDataServiceMock.setRawData)
                .toHaveBeenCalledWith(fakeResponse.data);
        });

        it('should broadcast CHART_DATA_READY on chargeDeferred.resolve', function() {
            controller.requestCharge(fakeUser, fakeFrom, fakeTo);
            chargeDeferred.resolve(fakeResponse);
            $scope.$digest();

            expect($scope.$broadcast).toHaveBeenCalledWith('CHART_DATA_READY');
        });

        it('should excute loadUdrDataFailed on chargeDeferred.reject', function() {
            controller.requestCharge(fakeUser, fakeFrom, fakeTo);
            chargeDeferred.reject();
            $scope.$digest();

            expect($log.debug.logs)
                .toContain(['Requesting charge data failed']);
        });
    });
});

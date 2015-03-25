describe('RateController', function() {
    var $log;
    var $scope;
    var $location;
    var controller;
    var restServiceMock;
    var sessionServiceMock;
    var usageDataServiceMock;
    var rateDataServiceMock;
    var dateUtilMock;
    var rateDeferred;
    var ratePromise;

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
    var fakeMeter = "network.incoming.bytes";
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
        module('dashboard.rate');

        /*
            Mocks
         */
        restServiceMock = jasmine.createSpyObj(
            'restService',
            ['getRateForMeter']
        );

        sessionServiceMock = jasmine.createSpyObj(
            'sessionService',
            ['getKeystoneId', 'setUserData']
        );

        rateDataServiceMock = jasmine.createSpyObj(
            'rateDataService',
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
            udrDeferred = $q.defer();
            rateDeferred = $q.defer();
            udrPromise = udrDeferred.promise;
            ratePromise = rateDeferred.promise;

            restServiceMock.getRateForMeter.and.returnValue(ratePromise);
            dateUtilMock.getFormattedDateToday.and.returnValue(fakeDateToday);
            dateUtilMock.getFormattedDateYesterday.and.returnValue(fakeDateYesterday);
            dateUtilMock.getFormattedDateLast3Days.and.returnValue(fakeDateLast3days);
            dateUtilMock.getFormattedDateLastWeek.and.returnValue(fakeDateLastWeek);
            dateUtilMock.getFormattedDateLastMonth.and.returnValue(fakeDateLastMonth);
            dateUtilMock.getFormattedDateLastYear.and.returnValue(fakeDateLastYear);
            spyOn($scope, '$broadcast');

            controller = $controller('RateController', {
                '$scope': $scope,
                'restService': restServiceMock,
                'sessionService': sessionServiceMock,
                'rateDataService': rateDataServiceMock,
                'dateUtil': dateUtilMock
            });
        });
    });

    /*
        Tests
     */
    describe('requestRate', function() {
        it('should correctly call restService.getRateForMeter', function() {
            controller.requestRate(fakeMeter, fakeFrom, fakeTo);
            rateDeferred.resolve(fakeResponse);
            $scope.$digest();

            expect(restServiceMock.getRateForMeter)
                .toHaveBeenCalledWith(fakeMeter, fakeFrom, fakeTo);
        });

        it('should execute loadUdrDataSuccess on rateDeferred.resolve', function() {
            controller.requestRate(fakeMeter, fakeFrom, fakeTo);
            rateDeferred.resolve(fakeResponse);
            $scope.$digest();

            expect(rateDataServiceMock.setRawData)
                .toHaveBeenCalledWith(fakeResponse.data);
        });

        it('should broadcast CHART_DATA_READY on rateDeferred.resolve', function() {
            controller.requestRate(fakeMeter, fakeFrom, fakeTo);
            rateDeferred.resolve(fakeResponse);
            $scope.$digest();

            expect($scope.$broadcast).toHaveBeenCalledWith('CHART_DATA_READY');
        });

        it('should excute loadUdrDataFailed on rateDeferred.reject', function() {
            controller.requestRate(fakeMeter, fakeFrom, fakeTo);
            rateDeferred.reject();
            $scope.$digest();

            expect($log.debug.logs)
                .toContain(['Requesting rate data failed']);
        });
    });
});

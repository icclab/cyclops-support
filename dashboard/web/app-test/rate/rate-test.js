describe('RateController', function() {
    var $scope;
    var controller;
    var restServiceMock;
    var sessionServiceMock;
    var rateDataServiceMock;
    var alertServiceMock;
    var dateUtilMock;
    var rateDeferred;
    var ratePromise;

    /*
        Fake Data
     */
    var fakeTimeNow = "12:00";
    var fakeTimeLast6Hours = "06:00";
    var fakeDateToday = "2015-03-04";
    var fakeFrom = "2015-03-03 00:00:00";
    var fakeTo = "2015-03-04 23:59:59";
    var fakeMeters = ["network.incoming.bytes", "cpu_util"];
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
            ['setRawData', 'notifyChartDataReady']
        );

        alertServiceMock = jasmine.createSpyObj(
            'alertService',
            ['showError']
        );

        dateUtilMock = jasmine.createSpyObj(
            'dateUtil',
            [
                'getFormattedDateToday', 'getFormattedTimeLastSixHours',
                'getFormattedTimeNow', 'getFormattedDateYesterday'
            ]
        );

        /*
            Inject dependencies and configure mocks
         */
        inject(function($controller, $q, $rootScope) {
            $scope = $rootScope.$new();
            rateDeferred = $q.defer();
            ratePromise = rateDeferred.promise;

            restServiceMock.getRateForMeter.and.returnValue(ratePromise);
            dateUtilMock.getFormattedDateToday.and.returnValue(fakeDateToday);
            dateUtilMock.getFormattedTimeNow.and.returnValue(fakeTimeNow);
            dateUtilMock.getFormattedTimeLastSixHours.and.returnValue(fakeTimeLast6Hours);
            spyOn($scope, '$broadcast');

            controller = $controller('RateController', {
                '$scope': $scope,
                'restService': restServiceMock,
                'sessionService': sessionServiceMock,
                'rateDataService': rateDataServiceMock,
                'alertService': alertServiceMock,
                'dateUtil': dateUtilMock
            });
        });
    });

    /*
        Tests
     */
    describe('requestRates', function() {
        it('should correctly call restService.getRateForMeter', function() {
            controller.requestRates(fakeMeters, fakeFrom, fakeTo);
            rateDeferred.resolve(fakeResponse);
            $scope.$digest();

            expect(restServiceMock.getRateForMeter)
                .toHaveBeenCalledWith(fakeMeters[0], fakeFrom, fakeTo);

            expect(restServiceMock.getRateForMeter)
                .toHaveBeenCalledWith(fakeMeters[1], fakeFrom, fakeTo);
        });

        it('should execute loadUdrDataSuccess on rateDeferred.resolve', function() {
            controller.requestRates(fakeMeters, fakeFrom, fakeTo);
            rateDeferred.resolve(fakeResponse);
            $scope.$digest();

            expect(rateDataServiceMock.setRawData)
                .toHaveBeenCalledWith(fakeResponse.data);

            expect(rateDataServiceMock.notifyChartDataReady).toHaveBeenCalled();
        });

        it('should excute loadUdrDataFailed on rateDeferred.reject', function() {
            controller.requestRates(fakeMeters, fakeFrom, fakeTo);
            rateDeferred.reject();
            $scope.$digest();

            expect(alertServiceMock.showError).toHaveBeenCalled();
        });
    });
});

describe('RateController', function() {
    var $scope;
    var controller;
    var deferred;
    var promise;

    /*
        Fake Data
     */
    var fakeTimeNow = "12:00";
    var fakeTime6HoursAgo = "06:00";
    var fakeDateToday = "2015-03-04";
    var fakeFrom = fakeDateToday + " " + fakeTime6HoursAgo;
    var fakeTo = fakeDateToday + " " + fakeTimeNow;
    var fakeMeters = ["network.incoming.bytes", "cpu_util"];
    var fakeResponse = {
        data: {
            'test': 'abc'
        }
    };
    var fakeFormattedMeters = {
        'cpu_util': { enabled: true },
        'network.incoming.bytes': { enabled: false },
        'network.outgoing.bytes': { enabled: true },
    };
    var fakeSelectedMeterNames = ['cpu_util', 'network.outgoing.bytes'];

    /*
        Test setup
     */
    beforeEach(function() {
        /*
            Load module
         */
        module('dashboard.rate');

        /*
            Inject dependencies and configure mocks
         */
        inject(function($controller, $q, $rootScope) {
            $scope = $rootScope.$new();
            deferred = $q.defer();
            promise = deferred.promise;

            meterselectionDataServiceMock.getFormattedUdrData.and.returnValue(fakeFormattedMeters);
            restServiceMock.getRateForMeter.and.returnValue(promise);
            restServiceMock.getUdrMeters.and.returnValue(promise);
            dateUtilMock.getFormattedDateToday.and.returnValue(fakeDateToday);
            dateUtilMock.getFormattedTimeNow.and.returnValue(fakeTimeNow);
            dateUtilMock.getFormattedTime6HoursAgo.and.returnValue(fakeTime6HoursAgo);
            spyOn($scope, '$broadcast');

            controller = $controller('RateController', {
                '$scope': $scope,
                'restService': restServiceMock,
                'sessionService': sessionServiceMock,
                'rateDataService': rateDataServiceMock,
                'meterselectionDataService': meterselectionDataServiceMock,
                'alertService': alertServiceMock,
                'dateUtil': dateUtilMock
            });
        });
    });

    /*
        Tests
     */
    describe('requestRatesForMeters', function() {
        it('should correctly call restService.getRateForMeter', function() {
            controller.requestRatesForMeters(fakeMeters, fakeFrom, fakeTo);
            deferred.resolve(fakeResponse);
            $scope.$digest();

            expect(restServiceMock.getRateForMeter)
                .toHaveBeenCalledWith(fakeMeters[0], fakeFrom, fakeTo);

            expect(restServiceMock.getRateForMeter)
                .toHaveBeenCalledWith(fakeMeters[1], fakeFrom, fakeTo);
        });

        it('should execute success callback on deferred.resolve', function() {
            controller.requestRatesForMeters(fakeMeters, fakeFrom, fakeTo);
            deferred.resolve(fakeResponse);
            $scope.$digest();

            expect(rateDataServiceMock.setRawData)
                .toHaveBeenCalledWith(fakeResponse.data);

            expect(rateDataServiceMock.notifyChartDataReady).toHaveBeenCalled();
        });

        it('should excute error callback on deferred.reject', function() {
            controller.requestRatesForMeters(fakeMeters, fakeFrom, fakeTo);
            deferred.reject();
            $scope.$digest();

            expect(alertServiceMock.showError).toHaveBeenCalled();
        });
    });

    describe('loadMeterSelection', function() {
        it('should correctly call restService.getUdrMeters', function() {
            controller.loadMeterSelection();
            expect(restServiceMock.getUdrMeters).toHaveBeenCalled();
        });

        it('should execute success callback on deferred.resolve', function() {
            spyOn(controller, 'requestRatesForMeters');

            controller.loadMeterSelection();
            deferred.resolve(fakeResponse);
            $scope.$digest();

            expect(meterselectionDataServiceMock.setRawUdrData)
                .toHaveBeenCalledWith(fakeResponse.data);
            expect(meterselectionDataServiceMock.getFormattedUdrData)
                .toHaveBeenCalled();
            expect(controller.requestRatesForMeters)
                .toHaveBeenCalledWith(fakeSelectedMeterNames, fakeFrom, fakeTo);
        });

        it('should excute error callback on deferred.reject', function() {
            controller.loadMeterSelection();
            deferred.reject();
            $scope.$digest();

            expect(alertServiceMock.showError).toHaveBeenCalled();
        });
    });
});

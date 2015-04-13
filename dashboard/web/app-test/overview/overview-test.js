describe('OverviewController', function() {
    var $scope;
    var $location;
    var controller;
    var udrDeferred;
    var udrPromise;

    /*
        Fake Data
     */
    var errorMsg = 'Requesting meter data failed';
    var fakeTimeNow = "15:00";
    var fakeTimeLastSixHours = "09:00";
    var fakeTimeFrom = "00:00";
    var fakeTimeTo = "23:59";
    var fakeDateToday = "2015-03-04";
    var fakeDateYesterday = "2015-03-03";
    var fakeDateLast3days = "2015-03-02";
    var fakeDateLastWeek = "2015-03-27";
    var fakeDateLastMonth = "2015-02-05";
    var fakeDateLastYear = "2014-03-05";

    var fakeDateObjectLast6Hours = {
        from: fakeDateToday + " " + fakeTimeLastSixHours,
        to: fakeDateToday + " " + fakeTimeNow
    };
    var fakeDateObjectToday = {
        from: fakeDateToday + " " + fakeTimeFrom,
        to: fakeDateToday + " " + fakeTimeTo
    };
    var fakeDateObjectYesterday = {
        from: fakeDateYesterday + " " + fakeTimeFrom,
        to: fakeDateToday + " " + fakeTimeTo
    };
    var fakeDateObjectLast3days = {
        from: fakeDateLast3days + " " + fakeTimeFrom,
        to: fakeDateToday + " " + fakeTimeTo
    };
    var fakeDateObjectLastWeek = {
        from: fakeDateLastWeek + " " + fakeTimeFrom,
        to: fakeDateToday + " " + fakeTimeTo
    };
    var fakeDateObjectLastMonth = {
        from: fakeDateLastMonth + " " + fakeTimeFrom,
        to: fakeDateToday + " " + fakeTimeTo
    };
    var fakeDateObjectLastYear = {
        from: fakeDateLastYear + " " + fakeTimeFrom,
        to: fakeDateToday + " " + fakeTimeTo
    };
    var fakeKeystoneId = '123';
    var fakeFrom = "2015-03-03 00:00";
    var fakeTo = "2015-03-04 23:59";
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
        module('dashboard.overview');

        /*
            Inject dependencies and configure mocks
         */
        inject(function($controller, $q, $rootScope, _$location_) {
            $location = _$location_;
            $scope = $rootScope.$new();
            udrDeferred = $q.defer();
            udrPromise = udrDeferred.promise;

            sessionServiceMock.getKeystoneId.and.returnValue(fakeKeystoneId);
            restServiceMock.getUdrData.and.returnValue(udrPromise);
            dateUtilMock.getFormattedDateToday.and.returnValue(fakeDateToday);
            dateUtilMock.getFormattedDateYesterday.and.returnValue(fakeDateYesterday);
            dateUtilMock.getFormattedDate3DaysAgo.and.returnValue(fakeDateLast3days);
            dateUtilMock.getFormattedDate1WeekAgo.and.returnValue(fakeDateLastWeek);
            dateUtilMock.getFormattedDate1MonthAgo.and.returnValue(fakeDateLastMonth);
            dateUtilMock.getFormattedDate1YearAgo.and.returnValue(fakeDateLastYear);
            dateUtilMock.getFormattedTimeNow.and.returnValue(fakeTimeNow);
            dateUtilMock.getFormattedTime6HoursAgo.and.returnValue(fakeTimeLastSixHours);
            spyOn($scope, '$broadcast');

            controller = $controller('OverviewController', {
                '$scope': $scope,
                'restService': restServiceMock,
                'sessionService': sessionServiceMock,
                'usageDataService': usageDataServiceMock,
                'alertService': alertServiceMock,
                'dateUtil': dateUtilMock
            });
        });
    });

    /*
        Tests
     */
    describe('updateCharts', function() {
        it('should call requestUsage if Keystone ID available', function() {
            spyOn(controller, 'hasKeystoneId').and.returnValue(true);
            spyOn(controller, 'requestUsage');

            controller.updateCharts(
                fakeDateObjectYesterday.from,
                fakeDateObjectYesterday.to
            );

            expect(controller.hasKeystoneId).toHaveBeenCalled();
            expect(controller.requestUsage)
                .toHaveBeenCalledWith(fakeKeystoneId, fakeFrom, fakeTo);
        });

        it('should do nothing if no Keystone ID available', function() {
            spyOn(controller, 'hasKeystoneId').and.returnValue(false);
            spyOn(controller, 'requestUsage');

            controller.updateCharts(
                fakeDateObjectYesterday.from,
                fakeDateObjectYesterday.to
            );

            expect(controller.hasKeystoneId).toHaveBeenCalled();
            expect(controller.requestUsage).not.toHaveBeenCalled();
        });
    });

    describe('requestUsage', function() {
        it('should correctly call restService.getUdrData', function() {
            controller.requestUsage(fakeKeystoneId, fakeFrom, fakeTo);
            udrDeferred.resolve(fakeResponse);
            $scope.$digest();

            expect(restServiceMock.getUdrData)
                .toHaveBeenCalledWith(fakeKeystoneId, fakeFrom, fakeTo);
        });

        it('should execute loadUdrDataSuccess on udrDeferred.resolve', function() {
            controller.requestUsage(fakeKeystoneId, fakeFrom, fakeTo);
            udrDeferred.resolve(fakeResponse);
            $scope.$digest();

            expect(usageDataServiceMock.setRawData)
                .toHaveBeenCalledWith(fakeResponse.data);
        });

        it('should excute loadUdrDataFailed on udrDeferred.reject', function() {
            controller.requestUsage(fakeKeystoneId, fakeFrom, fakeTo);
            udrDeferred.reject();
            $scope.$digest();

            expect(alertServiceMock.showError).toHaveBeenCalledWith(errorMsg);
        });
    });

    describe('hasKeystoneId', function() {
        it('should return true if Keystone ID available', function() {
            expect(controller.hasKeystoneId()).toBeTruthy();
        });

        it('should return false if no Keystone ID available', function() {
            sessionServiceMock.getKeystoneId.and.returnValue('');
            expect(controller.hasKeystoneId()).toBeFalsy();
        });
    });

    describe('showCloudServices', function() {
        it('should redirect to /cloud-services', function() {
            controller.showCloudServices();
            expect($location.url()).toBe('/cloudservices');
        });
    });

    describe('dates-Array', function() {
        it('should be initialised correctly', function() {
            expect(controller.dates.last6Hours).toEqual(fakeDateObjectLast6Hours);
            expect(controller.dates.today).toEqual(fakeDateObjectToday);
            expect(controller.dates.yesterday).toEqual(fakeDateObjectYesterday);
            expect(controller.dates.last3days).toEqual(fakeDateObjectLast3days);
            expect(controller.dates.lastWeek).toEqual(fakeDateObjectLastWeek);
            expect(controller.dates.lastMonth).toEqual(fakeDateObjectLastMonth);
            expect(controller.dates.lastYear).toEqual(fakeDateObjectLastYear);
        });
    });

    describe('onDateChanged', function() {
        it('should correctly call updateCharts when no date selected', function() {
            spyOn(controller, 'updateCharts');

            controller.onDateChanged();

            expect(controller.updateCharts).toHaveBeenCalledWith(
                fakeDateToday + " " + fakeTimeLastSixHours,
                fakeDateToday + " " + fakeTimeNow
            );
        });

        it('should correctly call updateCharts when a date was selected', function() {
            spyOn(controller, 'updateCharts');
            controller.selectedDate = "yesterday";

            controller.onDateChanged();

            expect(controller.updateCharts).toHaveBeenCalledWith(
                fakeDateYesterday + " " + fakeTimeFrom,
                fakeDateToday + " " + fakeTimeTo
            );
        });
    });
});

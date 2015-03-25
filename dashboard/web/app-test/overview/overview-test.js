describe('OverviewController', function() {
    var $log;
    var $scope;
    var $location;
    var controller;
    var restServiceMock;
    var sessionServiceMock;
    var usageDataServiceMock;
    var dateUtilMock;
    var udrDeferred;
    var udrPromise;

    /*
        Fake Data
     */
    var fakeDateToday = "2015-03-04";
    var fakeDateYesterday = "2015-03-03";
    var fakeDateLast3days = "2015-03-02";
    var fakeDateLastWeek = "2015-02-27";
    var fakeDateLastMonth = "2015-02-05";
    var fakeDateLastYear = "2014-03-05";
    var fakeKeystoneId = '123';
    var fakeFrom = "2015-03-03 00:00:00";
    var fakeTo = "2015-03-04 23:59:59";
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
            Mocks
         */
        restServiceMock = jasmine.createSpyObj(
            'restService',
            ['getUdrData']
        );

        sessionServiceMock = jasmine.createSpyObj(
            'sessionService',
            ['getKeystoneId', 'setUserData']
        );

        usageDataServiceMock = jasmine.createSpyObj(
            'usageDataService',
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
            udrPromise = udrDeferred.promise;

            sessionServiceMock.getKeystoneId.and.returnValue(fakeKeystoneId);
            restServiceMock.getUdrData.and.returnValue(udrPromise);
            dateUtilMock.getFormattedDateToday.and.returnValue(fakeDateToday);
            dateUtilMock.getFormattedDateYesterday.and.returnValue(fakeDateYesterday);
            dateUtilMock.getFormattedDateLast3Days.and.returnValue(fakeDateLast3days);
            dateUtilMock.getFormattedDateLastWeek.and.returnValue(fakeDateLastWeek);
            dateUtilMock.getFormattedDateLastMonth.and.returnValue(fakeDateLastMonth);
            dateUtilMock.getFormattedDateLastYear.and.returnValue(fakeDateLastYear);
            spyOn($scope, '$broadcast');

            controller = $controller('OverviewController', {
                '$scope': $scope,
                'restService': restServiceMock,
                'sessionService': sessionServiceMock,
                'usageDataService': usageDataServiceMock,
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

            controller.updateCharts(fakeDateYesterday, fakeDateToday);

            expect(controller.hasKeystoneId).toHaveBeenCalled();
            expect(controller.requestUsage)
                .toHaveBeenCalledWith(fakeKeystoneId, fakeFrom, fakeTo);
        });

        it('should do nothing if no Keystone ID available', function() {
            spyOn(controller, 'hasKeystoneId').and.returnValue(false);
            spyOn(controller, 'requestUsage');

            controller.updateCharts(fakeDateYesterday, fakeDateToday);

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

        it('should broadcast CHART_DATA_READY on udrDeferred.resolve', function() {
            controller.requestUsage(fakeKeystoneId, fakeFrom, fakeTo);
            udrDeferred.resolve(fakeResponse);
            $scope.$digest();

            expect($scope.$broadcast).toHaveBeenCalledWith('CHART_DATA_READY');
        });

        it('should excute loadUdrDataFailed on udrDeferred.reject', function() {
            controller.requestUsage(fakeKeystoneId, fakeFrom, fakeTo);
            udrDeferred.reject();
            $scope.$digest();

            expect($log.debug.logs)
                .toContain(['Requesting meter data failed']);
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
            expect(controller.dates.today).toEqual(fakeDateToday);
            expect(controller.dates.yesterday).toEqual(fakeDateYesterday);
            expect(controller.dates.last3days).toEqual(fakeDateLast3days);
            expect(controller.dates.lastWeek).toEqual(fakeDateLastWeek);
            expect(controller.dates.lastMonth).toEqual(fakeDateLastMonth);
            expect(controller.dates.lastYear).toEqual(fakeDateLastYear);
        });
    });

    describe('onDateChanged', function() {
        it('should correctly call updateCharts when no date selected', function() {
            spyOn(controller, 'updateCharts');

            controller.onDateChanged();

            expect(controller.updateCharts)
                .toHaveBeenCalledWith(fakeDateToday, fakeDateToday);
        });

        it('should correctly call updateCharts when a date was selected', function() {
            spyOn(controller, 'updateCharts');
            controller.selectedDate = "yesterday";

            controller.onDateChanged();

            expect(controller.updateCharts)
                .toHaveBeenCalledWith(fakeDateYesterday, fakeDateToday);
        });
    });
});

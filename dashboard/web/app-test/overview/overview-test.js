describe('OverviewController', function() {
    var $log;
    var $scope;
    var $location;
    var overviewController;
    var restServiceMock;
    var sessionServiceMock;
    var chartDataServiceMock;
    var dateUtilMock;
    var deferred;
    var promise;

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

        chartDataServiceMock = jasmine.createSpyObj(
            'chartDataService',
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
            deferred = $q.defer();
            promise = deferred.promise;

            sessionServiceMock.getKeystoneId.and.returnValue(fakeKeystoneId);
            restServiceMock.getUdrData.and.returnValue(promise);
            dateUtilMock.getFormattedDateToday.and.returnValue(fakeDateToday);
            dateUtilMock.getFormattedDateYesterday.and.returnValue(fakeDateYesterday);
            dateUtilMock.getFormattedDateLast3Days.and.returnValue(fakeDateLast3days);
            dateUtilMock.getFormattedDateLastWeek.and.returnValue(fakeDateLastWeek);
            dateUtilMock.getFormattedDateLastMonth.and.returnValue(fakeDateLastMonth);
            dateUtilMock.getFormattedDateLastYear.and.returnValue(fakeDateLastYear);
            spyOn($scope, '$broadcast');

            overviewController = $controller('OverviewController', {
                '$scope': $scope,
                'restService': restServiceMock,
                'sessionService': sessionServiceMock,
                'chartDataService': chartDataServiceMock,
                'dateUtil': dateUtilMock
            });
        });
    });

    /*
        Tests
     */
    describe('updateCharts', function() {
        it('should call requestMeter if Keystone ID available', function() {
            spyOn(overviewController, 'hasKeystoneId').and.returnValue(true);
            spyOn(overviewController, 'requestMeter');

            overviewController.updateCharts(fakeDateYesterday, fakeDateToday);

            expect(overviewController.hasKeystoneId).toHaveBeenCalled();
            expect(overviewController.requestMeter)
                .toHaveBeenCalledWith(fakeKeystoneId, fakeFrom, fakeTo);
        });

        it('should do nothing if no Keystone ID available', function() {
            spyOn(overviewController, 'hasKeystoneId').and.returnValue(false);
            spyOn(overviewController, 'requestMeter');

            overviewController.updateCharts(fakeDateYesterday, fakeDateToday);

            expect(overviewController.hasKeystoneId).toHaveBeenCalled();
            expect(overviewController.requestMeter).not.toHaveBeenCalled();
        });
    });

    describe('requestMeter', function() {
        it('should correctly call restService.getUdrData', function() {
            overviewController.requestMeter(fakeKeystoneId, fakeFrom, fakeTo);
            deferred.resolve(fakeResponse);
            $scope.$digest();

            expect(restServiceMock.getUdrData)
                .toHaveBeenCalledWith(fakeKeystoneId, fakeFrom, fakeTo);
        });

        it('should execute loadUdrDataSuccess on deferred.resolve', function() {
            overviewController.requestMeter(fakeKeystoneId, fakeFrom, fakeTo);
            deferred.resolve(fakeResponse);
            $scope.$digest();

            expect(chartDataServiceMock.setRawData)
                .toHaveBeenCalledWith(fakeResponse.data);
        });

        it('should broadcast UDR_DATA_READY on deferred.resolve', function() {
            overviewController.requestMeter(fakeKeystoneId, fakeFrom, fakeTo);
            deferred.resolve(fakeResponse);
            $scope.$digest();

            expect($scope.$broadcast).toHaveBeenCalledWith('UDR_DATA_READY');
        });

        it('should excute loadUdrDataFailed on deferred.reject', function() {
            overviewController.requestMeter(fakeKeystoneId, fakeFrom, fakeTo);
            deferred.reject();
            $scope.$digest();

            expect($log.debug.logs)
                .toContain(['Requesting meter data failed']);
        });
    });

    describe('hasKeystoneId', function() {
        it('should return true if Keystone ID available', function() {
            expect(overviewController.hasKeystoneId()).toBeTruthy();
        });

        it('should return false if no Keystone ID available', function() {
            sessionServiceMock.getKeystoneId.and.returnValue('');
            expect(overviewController.hasKeystoneId()).toBeFalsy();
        });
    });

    describe('showCloudServices', function() {
        it('should redirect to /cloud-services', function() {
            overviewController.showCloudServices();
            expect($location.url()).toBe('/cloudservices');
        });
    });

    describe('dates-Array', function() {
        it('should be initialised correctly', function() {
            expect(overviewController.dates.today).toEqual(fakeDateToday);
            expect(overviewController.dates.yesterday).toEqual(fakeDateYesterday);
            expect(overviewController.dates.last3days).toEqual(fakeDateLast3days);
            expect(overviewController.dates.lastWeek).toEqual(fakeDateLastWeek);
            expect(overviewController.dates.lastMonth).toEqual(fakeDateLastMonth);
            expect(overviewController.dates.lastYear).toEqual(fakeDateLastYear);
        });
    });

    describe('onDateChanged', function() {
        it('should correctly call updateCharts when no date selected', function() {
            spyOn(overviewController, 'updateCharts');

            overviewController.onDateChanged();

            expect(overviewController.updateCharts)
                .toHaveBeenCalledWith(fakeDateToday, fakeDateToday);
        });

        it('should correctly call updateCharts when a date was selected', function() {
            spyOn(overviewController, 'updateCharts');
            overviewController.selectedDate = "yesterday";

            overviewController.onDateChanged();

            expect(overviewController.updateCharts)
                .toHaveBeenCalledWith(fakeDateYesterday, fakeDateToday);
        });
    });
});

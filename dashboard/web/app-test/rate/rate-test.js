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
    var errorMsg = 'Requesting rate data failed';
    var fakeDateToday = "2015-03-04";
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

        alertServiceMock = jasmine.createSpyObj(
            'alertService',
            ['showError']
        );

        dateUtilMock = jasmine.createSpyObj(
            'dateUtil',
            ['getFormattedDateToday']
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

            expect(alertServiceMock.showError).toHaveBeenCalledWith(errorMsg);
        });
    });
});

describe('ChargeController', function() {
    var $scope;
    var controller;
    var chargeDeferred;
    var chargePromise;

    /*
        Fake Data
     */
    var errorMsg = "Requesting charge data failed";
    var fakeDateToday = "2015-03-04";
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
            Inject dependencies and configure mocks
         */
        inject(function($controller, $q, $rootScope) {
            $scope = $rootScope.$new();
            chargeDeferred = $q.defer();
            chargePromise = chargeDeferred.promise;

            restServiceMock.getChargeForUser.and.returnValue(chargePromise);
            dateUtilMock.getFormattedDateToday.and.returnValue(fakeDateToday);
            spyOn($scope, '$broadcast');

            controller = $controller('ChargeController', {
                '$scope': $scope,
                'restService': restServiceMock,
                'sessionService': sessionServiceMock,
                'chargeDataService': chargeDataServiceMock,
                'alertService': alertServiceMock,
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

            expect(chargeDataServiceMock.notifyChartDataReady).toHaveBeenCalled();
        });

        it('should excute loadUdrDataFailed on chargeDeferred.reject', function() {
            controller.requestCharge(fakeUser, fakeFrom, fakeTo);
            chargeDeferred.reject();
            $scope.$digest();

            expect(alertServiceMock.showError).toHaveBeenCalledWith(errorMsg);
        });
    });
});

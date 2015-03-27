describe('ChargeController', function() {
    var $scope;
    var controller;
    var restServiceMock;
    var sessionServiceMock;
    var chargeDataServiceMock;
    var alertServiceMock;
    var dateUtilMock;
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

            expect(alertServiceMock.showError).toHaveBeenCalledWith(errorMsg);
        });
    });
});

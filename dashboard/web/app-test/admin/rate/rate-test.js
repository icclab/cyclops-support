describe('controller', function() {
    var $scope;
    var controller;
    var restServiceMock;
    var alertServiceMock;
    var dateUtilMock;
    var deferred;
    var promise;

    /*
        Fake Data
     */
    var disabledClass = "disabled";
    var enabledClass = "";
    var statusStringDynamic = "Dynamic Rating";
    var statusStringStatic = "Static Rating";
    var fakeDateTime = "2015-03-21 15:14:13";
    var fakeMeters = [
        { name: "meter.name1", rate: 3 },
        { name: "meter.name2", rate: 4 }
    ];
    var fakeStaticRateConfig = {
        "source" : "dashboard",
        "time" : fakeDateTime,
        "rate_policy" : "static",
        "rate" : {
            "meter.name1": 3,
            "meter.name2": 4
        }
    };
    var fakeDynamicRateConfig = {
        "source" : "dashboard",
        "time" : fakeDateTime,
        "rate_policy" : "dynamic",
        "rate" : null
    };
    var fakeResponseDynamic = {
        data: fakeDynamicRateConfig
    };
    var fakeResponseStatic = {
        data: fakeStaticRateConfig
    };

    /*
        Test setup
     */
    beforeEach(function() {

        /*
            Load module
         */
        module('dashboard.admin.rate');

        /*
            Mocks
         */
        restServiceMock = jasmine.createSpyObj(
            'restService',
            ['getActiveRatePolicy', 'setActiveRatePolicy']
        );

        alertServiceMock = jasmine.createSpyObj(
            'alertService',
            ['showError', 'showSuccess']
        );

        dateUtilMock = jasmine.createSpyObj(
            'dateUtil',
            ['getFormattedDateTimeNow']
        );

        /*
            Inject dependencies and configure mocks
         */
        inject(function($controller, $q, $rootScope) {
            $scope = $rootScope.$new();
            deferred = $q.defer();
            promise = deferred.promise;

            restServiceMock.setActiveRatePolicy.and.returnValue(promise);
            restServiceMock.getActiveRatePolicy.and.returnValue(promise);
            dateUtilMock.getFormattedDateTimeNow.and.returnValue(fakeDateTime);

            controller = $controller('AdminRateController', {
                '$scope': $scope,
                'restService': restServiceMock,
                'alertService': alertServiceMock,
                'dateUtil': dateUtilMock
            });
        });
    });

    /*
        Tests
     */
    describe('setGuiStaticRateEnabled', function() {
        it('should correctly set GUI variables', function() {
            controller.isStaticRateEnabled = false;
            controller.staticRatingButtonClass = enabledClass;
            controller.dynamicRatingButtonClass = disabledClass;

            controller.setGuiStaticRateEnabled();

            expect(controller.isStaticRateEnabled).toBeTruthy();
            expect(controller.staticRatingButtonClass).toEqual(disabledClass);
            expect(controller.dynamicRatingButtonClass).toEqual(enabledClass);
        });
    });

    describe('setGuiDynamicRateEnabled', function() {
        it('should correctly set GUI variables', function() {
            controller.isStaticRateEnabled = true;
            controller.staticRatingButtonClass = disabledClass;
            controller.dynamicRatingButtonClass = enabledClass;

            controller.setGuiDynamicRateEnabled();

            expect(controller.isStaticRateEnabled).toBeFalsy();
            expect(controller.staticRatingButtonClass).toEqual(enabledClass);
            expect(controller.dynamicRatingButtonClass).toEqual(disabledClass);
        });
    });

    describe('setGuiActivePolicyStatic', function() {
        it('should correctly set status string', function() {
            controller.activePolicyStatusString = statusStringDynamic;
            controller.setGuiActivePolicyStatic();
            expect(controller.activePolicyStatusString).toEqual(statusStringStatic)
        });
    });

    describe('setGuiActivePolicyDynamic', function() {
        it('should correctly set status string', function() {
            controller.activePolicyStatusString = statusStringStatic;
            controller.setGuiActivePolicyDynamic();
            expect(controller.activePolicyStatusString).toEqual(statusStringDynamic)
        });
    });

    describe('buildStaticRateConfig', function() {
        it('should build a correct config object', function() {
            controller.meters = fakeMeters;
            var res = controller.buildStaticRateConfig();
            expect(res).toEqual(fakeStaticRateConfig);
        });
    });

    describe('buildDynamicRateConfig', function() {
        it('should build a correct config object', function() {
            var res = controller.buildDynamicRateConfig();
            expect(res).toEqual(fakeDynamicRateConfig);
        });
    });

    describe('activatePolicyStatic', function() {
        beforeEach(function() {
            spyOn(controller, 'buildStaticRateConfig').and.returnValue(fakeStaticRateConfig);
            spyOn(controller, 'setGuiActivePolicyStatic');
        });

        it('should call buildStaticRateConfig', function() {
            controller.activatePolicyStatic();
            expect(controller.buildStaticRateConfig).toHaveBeenCalled();
        });

        it('should correctly call restService.setActiveRatePolicy', function() {
            var res = controller.activatePolicyStatic();
            expect(restServiceMock.setActiveRatePolicy)
                .toHaveBeenCalledWith(fakeStaticRateConfig);
        });

        it('should execute success callback on deferred.resolve', function() {
            controller.activatePolicyStatic();
            deferred.resolve(fakeResponseDynamic);
            $scope.$digest();

            expect(alertServiceMock.showSuccess).toHaveBeenCalled();
            expect(controller.setGuiActivePolicyStatic).toHaveBeenCalled();
        });

        it('should execute error callback on deferred.reject', function() {
            controller.activatePolicyStatic();
            deferred.reject();
            $scope.$digest();

            expect(alertServiceMock.showError).toHaveBeenCalled();
            expect(controller.setGuiActivePolicyStatic).not.toHaveBeenCalled();
        });
    });

    describe('getActiveRatePolicy', function() {
        it('should call restService.getActiveRatePolicy', function() {
            controller.getActiveRatePolicy();
            expect(restServiceMock.getActiveRatePolicy).toHaveBeenCalled();
        });

        it('should execute success callback (static path) on deferred.resolve', function() {
            spyOn(controller, 'setGuiStaticRateEnabled');
            spyOn(controller, 'setGuiDynamicRateEnabled');
            spyOn(controller, 'setGuiActivePolicyStatic');
            spyOn(controller, 'setGuiActivePolicyDynamic');

            controller.getActiveRatePolicy();
            deferred.resolve(fakeResponseStatic);
            $scope.$digest();

            expect(controller.setGuiStaticRateEnabled).toHaveBeenCalled();
            expect(controller.setGuiActivePolicyStatic).toHaveBeenCalled();
            expect(controller.setGuiDynamicRateEnabled).not.toHaveBeenCalled();
            expect(controller.setGuiActivePolicyDynamic).not.toHaveBeenCalled();
        });

        it('should execute success callback (dynamic path) on deferred.resolve', function() {
            spyOn(controller, 'setGuiStaticRateEnabled');
            spyOn(controller, 'setGuiDynamicRateEnabled');
            spyOn(controller, 'setGuiActivePolicyStatic');
            spyOn(controller, 'setGuiActivePolicyDynamic');

            controller.getActiveRatePolicy();
            deferred.resolve(fakeResponseDynamic);
            $scope.$digest();

            expect(controller.setGuiStaticRateEnabled).not.toHaveBeenCalled();
            expect(controller.setGuiActivePolicyStatic).not.toHaveBeenCalled();
            expect(controller.setGuiDynamicRateEnabled).toHaveBeenCalled();
            expect(controller.setGuiActivePolicyDynamic).toHaveBeenCalled();
        });

        it('should execute error callback on deferred.reject', function() {
            controller.getActiveRatePolicy();
            deferred.reject();
            $scope.$digest();

            expect(alertServiceMock.showError).toHaveBeenCalled();
        });
    });

});

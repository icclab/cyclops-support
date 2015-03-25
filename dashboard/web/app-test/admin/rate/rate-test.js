describe('controller', function() {
    var controller;
    var $scope;
    var $log;
    var restServiceMock;

    /*
        Fake Data
     */
    var disabledClass = "disabled";
    var enabledClass = "";
    var statusStringOn = "on";
    var statusStringOff = "off";
    var fakeDateTime = "2015-03-21 15:14:13";
    var fakeMeters = [
        { name: "meter.name1", rate: 3 },
        { name: "meter.name2", rate: 4 }
    ];
    var fakeStaticRateConfig = {
        "source" : "dashboard",
        "time" : fakeDateTime,
        "rating" : "static",
        "rate" : {
            "meter.name1": 3,
            "meter.name2": 4
        }
    };
    var fakeDynamicRateConfig = {
        "source" : "dashboard",
        "time" : fakeDateTime,
        "rating" : "dynamic",
        "rate" : null
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
            ['']
        );

        dateUtilMock = jasmine.createSpyObj(
            'dateUtil',
            ['getFormattedDateTimeNow']
        );

        /*
            Inject dependencies and configure mocks
         */
        inject(function($controller, $q, $rootScope, _$log_) {
            $scope = $rootScope.$new();
            $log = _$log_;

            dateUtilMock.getFormattedDateTimeNow.and.returnValue(fakeDateTime);

            controller = $controller('AdminRateController', {
                '$scope': $scope,
                'restService': restServiceMock,
                'dateUtil': dateUtilMock
            });
        });
    });

    /*
        Tests
     */
    describe('setStaticRateEnabled', function() {
        it('should set staticRateStatusString to "on" if enabled', function() {
            controller.staticRateStatusString = statusStringOff;
            controller.setStaticRateEnabled(true);
            expect(controller.staticRateStatusString).toEqual(statusStringOn);
        });

        it('should set staticRateStatusString to "off" if disabled', function() {
            controller.staticRateStatusString = statusStringOn;
            controller.setStaticRateEnabled(false);
            expect(controller.staticRateStatusString).toEqual(statusStringOff);
        });

        it('should set button classes correctly if enabled', function() {
            controller.enabledButtonClass = enabledClass;
            controller.disabledButtonClass = disabledClass;
            controller.setStaticRateEnabled(true);
            expect(controller.enabledButtonClass).toEqual(disabledClass);
            expect(controller.disabledButtonClass).toEqual(enabledClass);
        });

        it('should set button classes correctly if disabled', function() {
            controller.enabledButtonClass = disabledClass;
            controller.disabledButtonClass = enabledClass;
            controller.setStaticRateEnabled(false);
            expect(controller.enabledButtonClass).toEqual(enabledClass);
            expect(controller.disabledButtonClass).toEqual(disabledClass);
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
});

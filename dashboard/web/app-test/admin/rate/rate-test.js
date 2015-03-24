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

        /*
            Inject dependencies and configure mocks
         */
        inject(function($controller, $q, $rootScope, _$log_) {
            $scope = $rootScope.$new();
            $log = _$log_;

            controller = $controller('AdminRateController', {
                '$scope': $scope,
                'restService': restServiceMock
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
});

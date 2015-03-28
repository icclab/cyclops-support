describe('AdminMeterController', function() {
    var controller;
    var $scope;
    var restServiceMock;
    var alertServiceMock;
    var dateUtilMock;
    var keystoneDeferred;
    var udrDeferred;
    var keystonePromise;
    var udrPromise;

    /*
        Fake Data
     */
    var fakeMeters = [
        { name:'a.test1', type:'gauge', source:'openstack' },
        { name:'b.test2', type:'cumulative', source:'openstack' },
        { name:'a.test1', type:'delta', source:'openstack' }
    ];
    var fakeMetersWithSelection = [
        { name:'a.test1', type:'gauge', source:'openstack', selected: false },
        { name:'b.test2', type:'cumulative', source:'openstack', selected: true }
    ];
    var fakeUniqueMeters = {
        'a.test1': fakeMeters[0],
        'b.test2': fakeMeters[1]
    };
    var fakeUniqueMetersAfterPreselection = {
        'a.test1': fakeMetersWithSelection[0],
        'b.test2': fakeMetersWithSelection[1]
    };
    var fakeResponse = {
        data: fakeMeters
    };
    var fakeToggleMeterName = "toggle.test";
    var fakeMeterSelected = { 'toggle.test': { selected: true } };
    var fakeMeterUnselected = { 'toggle.test': { selected: false } };
    var fakeMeterEmpty = { 'toggle.test' : {} };
    var fakeTimestamp = 1425399530223;
    var fakeColumns = [
        "time", "source", "metersource", "metertype", "metername", "status"
    ];
    var fakePointUnselected1 = [
        fakeTimestamp, "cyclops-ui", "openstack", "gauge", "a.test1", 0
    ];
    var fakePointUnselected2 = [
        fakeTimestamp, "cyclops-ui", "openstack", "cumulative", "b.test2", 0
    ];
    var fakePointSelected = [
        fakeTimestamp, "cyclops-ui", "openstack", "cumulative", "b.test2", 1
    ];
    var fakeUdrRequestBody = {
        name: "meterselection",
        columns: fakeColumns,
        points: [
            fakePointUnselected1,
            fakePointUnselected2
        ]
    };
    var fakeUdrMeterResponse = {
        data: fakeUdrRequestBody
    };
    var fakeUdrMeterResponsePreselection = {
        data: {
            columns: fakeColumns,
            points: [
                fakePointUnselected1,
                fakePointSelected
            ]
        }
    };

    /*
        Test setup
     */
    beforeEach(function() {

        /*
            Load module
         */
        module('dashboard.admin.meters');

        /*
            Mocks
         */
        restServiceMock = jasmine.createSpyObj(
            'restService',
            ['getKeystoneMeters', 'getUdrMeters', 'updateUdrMeters']
        );

        alertServiceMock = jasmine.createSpyObj(
            'alertService',
            ['showError', 'showSuccess']
        );

        dateUtilMock = jasmine.createSpyObj(
            'dateUtil',
            ['getTimestamp']
        );

        /*
            Inject dependencies and configure mocks
         */
        inject(function($controller, $q, $rootScope, _$log_) {
            $scope = $rootScope.$new();
            keystoneDeferred = $q.defer();
            keystonePromise = keystoneDeferred.promise;
            udrDeferred = $q.defer();
            udrPromise = udrDeferred.promise;

            restServiceMock.getKeystoneMeters.and.returnValue(keystonePromise);
            restServiceMock.getUdrMeters.and.returnValue(udrPromise);
            restServiceMock.updateUdrMeters.and.returnValue(udrPromise)
            dateUtilMock.getTimestamp.and.returnValue(fakeTimestamp);

            controller = $controller('AdminMeterController', {
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
    describe('loadMeterData', function() {
        it('should correctly call restService.getKeystoneMeters', function() {
            controller.loadMeterData();
            expect(restServiceMock.getKeystoneMeters).toHaveBeenCalled();
        });

        it('should execute loadKeystoneMeterSuccess on keystoneDeferred.resolve', function() {
            spyOn(controller, 'buildUniqueMeterMap');

            controller.loadMeterData();
            keystoneDeferred.resolve(fakeResponse);
            $scope.$digest();

            expect(controller.buildUniqueMeterMap).toHaveBeenCalled();
        });

        it('should execute loadUdrMeterSuccess on udrDeferred.resolve', function() {
            spyOn(controller, 'buildUniqueMeterMap');
            spyOn(controller, 'preselectMeters');

            controller.loadMeterData();
            keystoneDeferred.resolve(fakeResponse);
            udrDeferred.resolve(fakeUdrMeterResponse);
            $scope.$digest();

            expect(controller.buildUniqueMeterMap).toHaveBeenCalled();
            expect(controller.preselectMeters)
                .toHaveBeenCalledWith(fakeUdrRequestBody);
        });

        it('should execute loadMeterError on keystoneDeferred.reject', function() {
            controller.loadMeterData();
            keystoneDeferred.reject();
            $scope.$digest();

            expect(alertServiceMock.showError).toHaveBeenCalled();
        });

        it('should execute loadMeterError on udrDeferred.reject', function() {
            spyOn(controller, 'buildUniqueMeterMap');

            controller.loadMeterData();
            keystoneDeferred.resolve(fakeResponse);
            udrDeferred.reject();
            $scope.$digest();

            expect(alertServiceMock.showError).toHaveBeenCalled();
        });
    });

    describe('updateUdrMeters', function() {
        it('should correctly call restService.updateUdrMeters', function() {
            controller.uniqueMeterMap = fakeUniqueMeters;
            controller.updateUdrMeters();
            expect(restServiceMock.updateUdrMeters)
                .toHaveBeenCalledWith(fakeUdrRequestBody);
        });

        it('should execute updateMeterSuccess on udrDeferred.reject', function() {
            spyOn(controller, 'buildUdrRequest');

            controller.updateUdrMeters();
            udrDeferred.resolve(fakeResponse);
            $scope.$digest();

            expect(alertServiceMock.showSuccess).toHaveBeenCalled();
        });

        it('should execute updateMeterError on udrDeferred.reject', function() {
            spyOn(controller, 'buildUdrRequest');

            controller.updateUdrMeters();
            udrDeferred.reject();
            $scope.$digest();

            expect(alertServiceMock.showError).toHaveBeenCalled();
        });
    });

    describe('buildUniqueMeterMap', function() {
        it('should correctly build a map with unique meters', function() {
            var res = controller.buildUniqueMeterMap(fakeMeters);
            expect(res).toEqual(fakeUniqueMeters);
        });
    });

    describe('toggleMeter', function() {
        beforeEach(function() {
            fakeMeterSelected['toggle.test'].selected = true;
            fakeMeterUnselected['toggle.test'].selected = false;
        });

        it('should set the meter to selected = false if unselected', function() {
            controller.uniqueMeterMap = fakeMeterSelected;
            controller.toggleMeter(fakeToggleMeterName);
            expect(controller.uniqueMeterMap).toEqual(fakeMeterUnselected);
        });

        it('should set the meter to selected = true if selected', function() {
            controller.uniqueMeterMap = fakeMeterUnselected;
            controller.toggleMeter(fakeToggleMeterName);
            expect(controller.uniqueMeterMap).toEqual(fakeMeterSelected);
        });

        it('should set the meter to selected = true if selected on empty meter', function() {
            controller.uniqueMeterMap = fakeMeterEmpty;
            controller.toggleMeter(fakeToggleMeterName);
            expect(controller.uniqueMeterMap).toEqual(fakeMeterSelected);
        });
    });

    describe('buildUdrRequest', function() {
        it('should build a full request body JSON object', function() {
            controller.uniqueMeterMap = fakeUniqueMeters;
            var res = controller.buildUdrRequest();
            expect(res).toEqual(fakeUdrRequestBody);
        });
    });

    describe('preselectMeters', function() {
        it('should select correct meters', function() {
            controller.uniqueMeterMap = fakeUniqueMeters;
            controller.preselectMeters(fakeUdrMeterResponsePreselection.data);
            expect(controller.uniqueMeterMap).toEqual(fakeUniqueMetersAfterPreselection);
        });

        it('should not touch the uniqueMeterMap if an error occurs', function() {
            controller.uniqueMeterMap = fakeUniqueMeters;
            controller.preselectMeters({});
            expect(controller.uniqueMeterMap).toEqual(fakeUniqueMeters);
        });
    });
});

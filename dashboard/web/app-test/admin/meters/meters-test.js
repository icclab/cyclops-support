describe('AdminMeterController', function() {
    var adminMeterController;
    var $scope;
    var $log;
    var restServiceMock;
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
            ['getKeystoneMeters', 'getUdrMeters']
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
            $log = _$log_;
            keystoneDeferred = $q.defer();
            keystonePromise = keystoneDeferred.promise;
            udrDeferred = $q.defer();
            udrPromise = udrDeferred.promise;

            restServiceMock.getKeystoneMeters.and.returnValue(keystonePromise);
            restServiceMock.getUdrMeters.and.returnValue(udrPromise);
            dateUtilMock.getTimestamp.and.returnValue(fakeTimestamp);

            adminMeterController = $controller('AdminMeterController', {
                '$scope': $scope,
                'restService': restServiceMock,
                'dateUtil': dateUtilMock
            });
        });
    });

    /*
        Tests
     */
    describe('loadMeters', function() {
        it('should correctly call restService.getKeystoneMeters', function() {
            adminMeterController.loadMeterData();
            expect(restServiceMock.getKeystoneMeters).toHaveBeenCalled();
        });

        it('should execute loadKeystoneMeterSuccess on keystoneDeferred.resolve', function() {
            spyOn(adminMeterController, 'buildUniqueMeterMap');

            adminMeterController.loadMeterData();
            keystoneDeferred.resolve(fakeResponse);
            $scope.$digest();

            expect(adminMeterController.buildUniqueMeterMap).toHaveBeenCalled();
        });

        it('should execute loadUdrMeterSuccess on udrDeferred.resolve', function() {
            spyOn(adminMeterController, 'buildUniqueMeterMap');
            spyOn(adminMeterController, 'preselectMeters');

            adminMeterController.loadMeterData();
            keystoneDeferred.resolve(fakeResponse);
            udrDeferred.resolve(fakeUdrMeterResponse);
            $scope.$digest();

            expect(adminMeterController.buildUniqueMeterMap).toHaveBeenCalled();
            expect(adminMeterController.preselectMeters)
                .toHaveBeenCalledWith(fakeUdrRequestBody);
        });

        it('should execute loadMeterError on keystoneDeferred.reject', function() {
            adminMeterController.loadMeterData();
            keystoneDeferred.reject();
            $scope.$digest();

            expect($log.debug.logs).toContain(['Error loading list of meters']);
        });

        it('should execute loadMeterError on keystoneDeferred.reject', function() {
            spyOn(adminMeterController, 'buildUniqueMeterMap');

            adminMeterController.loadMeterData();
            keystoneDeferred.resolve(fakeResponse);
            udrDeferred.reject();
            $scope.$digest();

            expect($log.debug.logs).toContain(['Error loading list of meters']);
        });
    });

    describe('buildUniqueMeterMap', function() {
        it('should correctly build a map with unique meters', function() {
            var res = adminMeterController.buildUniqueMeterMap(fakeMeters);
            expect(res).toEqual(fakeUniqueMeters);
        });
    });

    describe('toggleMeter', function() {
        beforeEach(function() {
            fakeMeterSelected['toggle.test'].selected = true;
            fakeMeterUnselected['toggle.test'].selected = false;
        });

        it('should set the meter to selected = false if unselected', function() {
            adminMeterController.uniqueMeterMap = fakeMeterSelected;
            adminMeterController.toggleMeter(fakeToggleMeterName);

            expect(adminMeterController.uniqueMeterMap)
                .toEqual(fakeMeterUnselected);
        });

        it('should set the meter to selected = true if selected', function() {
            adminMeterController.uniqueMeterMap = fakeMeterUnselected;
            adminMeterController.toggleMeter(fakeToggleMeterName);

            expect(adminMeterController.uniqueMeterMap)
                .toEqual(fakeMeterSelected);
        });

        it('should set the meter to selected = true if selected on empty meter', function() {
            adminMeterController.uniqueMeterMap = fakeMeterEmpty;
            adminMeterController.toggleMeter(fakeToggleMeterName);

            expect(adminMeterController.uniqueMeterMap)
                .toEqual(fakeMeterSelected);
        });
    });

    describe('buildUdrRequest', function() {
        it('should build a full request body JSON object', function() {
            adminMeterController.uniqueMeterMap = fakeUniqueMeters;
            var res = adminMeterController.buildUdrRequest();

            expect(res).toEqual(fakeUdrRequestBody);
        });
    });

    describe('preselectMeters', function() {
        it('should select correct meters', function() {
            adminMeterController.uniqueMeterMap = fakeUniqueMeters;
            adminMeterController.preselectMeters(fakeUdrMeterResponsePreselection.data);

            expect(adminMeterController.uniqueMeterMap)
                .toEqual(fakeUniqueMetersAfterPreselection);
        });

        it('should not touch the uniqueMeterMap if an error occurs', function() {
            adminMeterController.uniqueMeterMap = fakeUniqueMeters;
            adminMeterController.preselectMeters({});

            expect(adminMeterController.uniqueMeterMap)
                .toEqual(fakeUniqueMeters);
        });
    });
});

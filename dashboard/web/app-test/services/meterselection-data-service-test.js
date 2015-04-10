describe('MeterselectionDataService', function() {
    var service;
    var scopeMock;

    /*
        Fake Data
     */
     var fakeMeterselectionData = {
        columns: ["time", "sequence_number", "metertype", "metername", "status", "source", "metersource"],
        name: "meterselection",
        points: [
            [1428668604339, 7914370001, "gauge", "cpu_util", 1, "cyclops-ui", "openstack"],
            [1428668604339, 7914310001, "cumulative", "disk.write.bytes", 0, "cyclops-ui", "openstack"]
        ]
     };
    var fakeOpenstackData = [
        { name:'disk.write.bytes', type:'cumulative', source:'openstack' }
    ];
    var fakeFormattedUdrData = {
        "cpu_util": {
            name: "cpu_util",
            enabled: true,
            type: "gauge",
            source: "openstack"
        },
        "disk.write.bytes": {
            name: "disk.write.bytes",
            enabled: false,
            type: "cumulative",
            source: "openstack"
        }
     };
     var fakeFormattedOpenstackData = {
        "disk.write.bytes": fakeFormattedUdrData["disk.write.bytes"]
     }

    /*
        Test setup
     */
    beforeEach(function() {

        /*
            Load module
         */
        module('dashboard.services');

        scopeMock = jasmine.createSpyObj(
            'scope',
            ['$broadcast']
        );

        /*
            Inject dependencies and configure mocks
         */
        inject(function(_meterselectionDataService_) {
            service = _meterselectionDataService_;
        });
    });

    /*
        Tests
     */
    describe('setRawUdrData', function() {
        it('stores correctly formatted data', function() {
            service.setRawUdrData(fakeMeterselectionData);
            expect(service.getFormattedUdrData()).toEqual(fakeFormattedUdrData);
        });

        it('ignores incorrectly formatted data', function() {
            service.setRawUdrData({});
            expect(service.getFormattedUdrData()).toEqual({});
        });
    });

    describe('setRawOpenstackData', function() {
        it('stores correctly formatted data', function() {
            service.setRawOpenstackData(fakeOpenstackData);
            expect(service.getFormattedOpenstackData()).toEqual(fakeFormattedOpenstackData);
        });

        it('ignores incorrectly formatted data', function() {
            service.setRawOpenstackData({});
            expect(service.getFormattedOpenstackData()).toEqual({});
        });
    });
});


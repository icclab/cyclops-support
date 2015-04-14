describe('ChargeDataService', function() {
    var service;
    var scopeMock;

    /*
        Fake Data
     */
    var fakeMeterName = "network.incoming.bytes";
    var fakeChartData = {
        charge: {
            columns: [
                "time","sequence_number","resource","userid","usage","rate","price"
            ],
            points: [
                [1427284499563,2,"network.incoming.bytes","a",2.0395754E7,3,611.87262],
                [1427283899512,1,"network.incoming.bytes","a",1.653124E7,1,165.3124],
            ]
        }
    };
    var fakeFormattedChartData = {
        "network.incoming.bytes": {
            name: fakeMeterName,
            columns: ["time", "value"],
            points: [
                [1427284499563, 611.87262],
                [1427283899512, 165.3124]
            ],
            enabled: true,
            type: "gauge",
            unit: ""
        }
    };
    var fakeEventData = [{
        name: fakeMeterName,
        unit: "",
        chartType: "gauge",
        serviceType: "charge"
    }];

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
        inject(function(_chargeDataService_) {
            service = _chargeDataService_;
        });
    });

    /*
        Tests
     */
    describe('setRawData', function() {
        it('stores correctly formatted data', function() {
            service.setRawData(fakeChartData);
            expect(service.getFormattedData()).toEqual(fakeFormattedChartData);
        });

        it('ignores incorrectly formatted data', function() {
            service.setRawData(fakeChartData.usage);
            expect(service.getFormattedData()).toEqual({});
        });
    });

    describe('notifyChartDataReady', function() {
        it('should broadcast CHART_DATA_READY', function() {
            service.notifyChartDataReady(scopeMock);
            expect(scopeMock.$broadcast).toHaveBeenCalledWith('CHART_DATA_READY', []);
        });

        it('should send chart information with event', function() {
            service.setRawData(fakeChartData);
            service.notifyChartDataReady(scopeMock);
            expect(scopeMock.$broadcast)
                .toHaveBeenCalledWith('CHART_DATA_READY', fakeEventData);
        });
    });

    describe('getFormattedColumns', function() {
        it('should correctly format columns', function() {
            var res = service.getFormattedColumns();
            expect(res).toEqual(["time", "value"]);
        });
    });
});

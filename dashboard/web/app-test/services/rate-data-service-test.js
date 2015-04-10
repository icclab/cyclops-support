describe('RateDataService', function() {
    var service;
    var scopeMock;

    /*
        Fake Data
     */
    var fakeMeterName = "network.incoming.bytes";
    var fakeChartData = {
        'rate': {
            "network.incoming.bytes": [
                [1428655317042, 7678720001, 3],
                [1428655257045, 7678710001, 3]
            ]
        }
    };
    var fakeFormattedChartData = {
        "network.incoming.bytes": {
            name: fakeMeterName,
            columns: ["time", "value"],
            points: [
                [1428655317042, 3],
                [1428655257045, 3]
            ],
            enabled: true,
            type: "gauge",
            unit: ""
        }
    };

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
        inject(function(_rateDataService_) {
            service = _rateDataService_;
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
        it('should broadcast RATE_DATA_READY on rateDeferred.resolve', function() {
            service.notifyChartDataReady(scopeMock);
            expect(scopeMock.$broadcast).toHaveBeenCalledWith('RATE_DATA_READY', []);
        });
    });

    describe('formatPoints', function() {
        it('should correctly format points', function() {
            var res = service.formatPoints(fakeChartData.rate[fakeMeterName], []);
            expect(res).toEqual(fakeFormattedChartData[fakeMeterName].points);
        });
    });

    describe('formatPoints', function() {
        it('should correctly format columns', function() {
            var res = service.formatColumns(undefined);
            expect(res).toEqual(["time", "value"]);
        });
    });
});

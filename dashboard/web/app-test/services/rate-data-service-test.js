describe('RateDataService', function() {
    var service;

    /*
        Fake Data
     */
    var fakeChartData = {
        'rate': {
            "network.incoming.bytes": [
                [ 123123123,null, 0.4 ],
                [ 123123123, null, 0.5 ]
            ]
        }
    };
    var fakeFormattedChartData = {
        "network.incoming.bytes": {
            points: fakeChartData.rate["network.incoming.bytes"]
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
            expect(service.getRawData())
                .toEqual(fakeFormattedChartData);
        });

        it('ignores incorrectly formatted data', function() {
            service.setRawData(fakeChartData.usage);
            expect(service.getRawData()).toEqual({});
        });
    });
});
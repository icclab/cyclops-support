describe('ChargeDataService', function() {
    var service;

    /*
        Fake Data
     */
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
            points: [
                [1427284499563, null, 611.87262],
                [1427283899512, null, 165.3124],
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
        module('dashboard.services');

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
            expect(service.getRawData())
                .toEqual(fakeFormattedChartData);
        });

        it('ignores incorrectly formatted data', function() {
            service.setRawData(fakeChartData.usage);
            expect(service.getRawData()).toEqual({});
        });
    });
});

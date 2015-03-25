describe('UsageDataService', function() {
    var service;

    /*
        Fake Data
     */
    var fakeCumulativeName = "network.incoming.bytes";
    var fakeGaugeName = "cpu_util";
    var fakeChartData = {
        'usage': {
            'openstack': [
                {
                    'name': fakeCumulativeName,
                    'points': [ [null, 2000] ]
                },
                {
                    'name': fakeGaugeName,
                    'points': [
                        [ 123123123,null, 0.4 ],
                        [ 123123123, null, 0.5 ]
                    ]
                }
            ]
        }
    };
    var fakeFormattedChartData = {
        "network.incoming.bytes": fakeChartData.usage.openstack[0],
        "cpu_util": fakeChartData.usage.openstack[1],
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
        inject(function(_usageDataService_) {
            service = _usageDataService_;
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


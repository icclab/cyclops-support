describe('ChartDataService', function() {
    var chartDataService;
    var dateUtilMock;

    /*
        Fake Data
     */
    var fakeLabel = "testLabel";
    var fakeNumPoints = 800;
    var fakePointIndex = 80;
    var fakeNumLabels = 10;
    var fakeError = { 'error': true };
    var fakeNetInBytesResult = { 'data':'2 MB' };
    var fakeNetOutBytesResult = { 'data':'3 MB' };
    var fakeCpuUtilRateResult = {
        'labels': ['12-Jan-15 13:33', '12-Jan-15 13:33'],
        'data': [ [0.4, 0.5] ]
    };
    var fakeDiskReadRateResult = {
        'labels': ['12-Jan-15 13:33', '12-Jan-15 13:33'],
        'data': [ [6, 7] ]
    };
    var fakeChartData = {
        'usage': {
            'openstack': [
                { //0: NET IN BYTES
                    'points': [
                        [ //points[0]
                            null, //points[0][0]
                            2 * 1000 * 1000 //points[0][1]
                        ]
                    ]
                },
                { //1: NET OUT BYTES
                    'points': [
                        [ //points[0]
                            null, //points[0][0]
                            3 * 1000 * 1000 //points[0][1]
                        ]
                    ]
                },
                { //2: CPU UTIL RATE
                    'points': [
                        [ //points[0]
                            123123123, //points[0][0]
                            null, //points[0][1]
                            0.4 //points[0][2]
                        ],
                        [ //points[1]
                            123123123, //points[1][0]
                            null, //points[1][1]
                            0.5 //points[1][2]
                        ]
                    ]
                },
                { //3: DISK READ RATE
                    'points': [
                        [ //points[0]
                            123123123, //points[0][0]
                            null, //points[0][1]
                            6 * 1000 //points[0][2]
                        ],
                        [ //points[1]
                            123123123, //points[1][0]
                            null, //points[1][1]
                            7 * 1000 //points[1][2]
                        ]
                    ]
                }
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
            Mocks
         */
        dateUtilMock = jasmine.createSpyObj(
            'dateUtil',
            ['fromTimestamp']
        );

        dateUtilMock.fromTimestamp.and.returnValue("12-Jan-15 13:33");

        module(function($provide) {
            $provide.value('dateUtil', dateUtilMock);
        });

        /*
            Inject dependencies and configure mocks
         */
        inject(function(_chartDataService_) {
            chartDataService = _chartDataService_;
        });
    });

    /*
        Tests
     */
    describe('setRawData', function() {
        it('stores correctly formatted data', function() {
            chartDataService.setRawData(fakeChartData);
            expect(chartDataService.getRawData())
                .toEqual(fakeChartData.usage.openstack);
        });

        it('ignores incorrectly formatted data', function() {
            chartDataService.setRawData(fakeChartData.usage);
            expect(chartDataService.getRawData()).toBe(undefined);
        });
    });

    describe('getIncomingNetworkBytes', function() {
        it('returns the correct data if available', function() {
            chartDataService.setRawData(fakeChartData);
            expect(chartDataService.getIncomingNetworkBytes())
                .toEqual(fakeNetInBytesResult);
        });

        it('returns an error if no data available', function() {
            chartDataService.setRawData(undefined);
            expect(chartDataService.getIncomingNetworkBytes())
                .toEqual(fakeError);
        });
    });

    describe('getOutgoingNetworkBytes', function() {
        it('returns the correct data if available', function() {
            chartDataService.setRawData(fakeChartData);
            expect(chartDataService.getOutgoingNetworkBytes())
                .toEqual(fakeNetOutBytesResult);
        });

        it('returns an error if no data available', function() {
            chartDataService.setRawData(undefined);
            expect(chartDataService.getOutgoingNetworkBytes())
                .toEqual(fakeError);
        });
    });

    describe('getCpuUtilRate', function() {
        it('returns the correct data if available', function() {
            chartDataService.setRawData(fakeChartData);
            expect(chartDataService.getCpuUtilRate())
                .toEqual(fakeCpuUtilRateResult);
        });

        it('returns an error if no data available', function() {
            chartDataService.setRawData(undefined);
            expect(chartDataService.getCpuUtilRate())
                .toEqual(fakeError);
        });
    });

    describe('getDiskReadRate', function() {
        it('returns the correct data if available', function() {
            chartDataService.setRawData(fakeChartData);
            expect(chartDataService.getDiskReadRate())
                .toEqual(fakeDiskReadRateResult);
        });

        it('returns an error if no data available', function() {
            chartDataService.setRawData(undefined);
            expect(chartDataService.getDiskReadRate())
                .toEqual(fakeError);
        });
    });

    describe('setLabelIfSpaceAvailable', function() {
        it('should set a label if space permits it', function() {
            var res = chartDataService.setLabelIfSpaceAvailable(
                fakeNumPoints, fakePointIndex, fakeNumLabels, fakeLabel
            );
            expect(res).toEqual(fakeLabel);
        });

        it('should not add a label if no space is available', function() {
            var res = chartDataService.setLabelIfSpaceAvailable(
                fakeNumPoints, fakePointIndex + 1, fakeNumLabels, fakeLabel
            );
            expect(res).toEqual('');
        });
    });
});


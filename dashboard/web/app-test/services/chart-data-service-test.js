describe('ChartDataService', function() {
    var chartDataService;
    var dateUtilMock;

    /*
        Fake Data
     */
    var fakeLabel = "testLabel";
    var fakeCumulativeName = "cumulativeChart";
    var fakeGaugeName = "gaugeChart";
    var fakeNumPoints = 800;
    var fakePointIndex = 80;
    var fakeNumLabels = 10;
    var fakeError = { 'error': true };
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
        cumulativeChart: fakeChartData.usage.openstack[0],
        gaugeChart: fakeChartData.usage.openstack[1],
    };
    var fakeCumulativeMeterResult = { data: 2000 };
    var fakeGaugeMeterResult = {
        labels: [ '12-Jan-15 13:33', '12-Jan-15 13:33' ],
        data: [ [ 0.4, 0.5 ] ]
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
                .toEqual(fakeFormattedChartData);
        });

        it('ignores incorrectly formatted data', function() {
            chartDataService.setRawData(fakeChartData.usage);
            expect(chartDataService.getRawData()).toEqual({});
        });
    });

    describe('getCumulativeMeterData', function() {
        it('returns the correct data if available', function() {
            chartDataService.setRawData(fakeChartData);
            expect(chartDataService.getCumulativeMeterData(fakeCumulativeName))
                .toEqual(fakeCumulativeMeterResult);
        });

        it('returns an error if no data available', function() {
            chartDataService.setRawData(undefined);
            expect(chartDataService.getCumulativeMeterData())
                .toEqual(fakeError);
        });
    });

    describe('getGaugeMeterData', function() {
        it('returns the correct data if available', function() {
            chartDataService.setRawData(fakeChartData);
            expect(chartDataService.getGaugeMeterData(fakeGaugeName))
                .toEqual(fakeGaugeMeterResult);
        });

        it('returns an error if no data available', function() {
            chartDataService.setRawData(undefined);
            expect(chartDataService.getGaugeMeterData())
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


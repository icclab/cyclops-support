describe('ChartDataService', function() {
    var service;
    var dateUtilMock;
    var usageDataServiceMock;
    var rateDataServiceMock;
    var chargeDataServiceMock;

    /*
        Fake Data
     */
    var usage = "usage";
    var charge = "charge";
    var rate = "rate";
    var fakeLabel = "testLabel";
    var fakeNumPoints = 800;
    var fakePointIndex = 80;
    var fakeNumLabels = 10;
    var fakeError = { 'error': true };

    var fakeCumulativeName = "cumulativeChart";
    var fakeGaugeName = "gaugeChart";

    var fakeData = {
        cumulativeChart: {
            'name': fakeCumulativeName,
            'points': [ [null, 2000] ]
        },
        gaugeChart: {
            'name': fakeGaugeName,
            'points': [
                [ 123123123,null, 0.4 ],
                [ 123123123, null, 0.5 ]
            ]
        }
    };
    var fakeCumulativeData = { data: 2000 };
    var fakeGaugeData = {
        labels: ['', ''],
        data: [ [0.4, 0.5] ]
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

        usageDataServiceMock = jasmine.createSpyObj(
            'usageDataService',
            ['getRawData']
        );

        rateDataServiceMock = jasmine.createSpyObj(
            'rateDataService',
            ['getRawData']
        );

        chargeDataServiceMock = jasmine.createSpyObj(
            'chargeDataService',
            ['getRawData']
        );

        dateUtilMock.fromTimestamp.and.returnValue("12-Jan-15 13:33");

        module(function($provide) {
            $provide.value('dateUtil', dateUtilMock);
            $provide.value('usageDataService', usageDataServiceMock);
            $provide.value('rateDataService', rateDataServiceMock);
            $provide.value('chargeDataService', chargeDataServiceMock);
        });

        /*
            Inject dependencies and configure mocks
         */
        inject(function(_chartDataService_) {
            service = _chartDataService_;
        });
    });

    /*
        Tests
     */
    describe('getCumulativeMeterData', function() {
        beforeEach(function() {
            spyOn(service, 'setLabelIfSpaceAvailable').and.returnValue('');
            spyOn(service, 'getServiceDelegate').and.returnValue(usageDataServiceMock);
        });

        it('returns the correct data if available', function() {
            usageDataServiceMock.getRawData.and.returnValue(fakeData);
            var res = service.getCumulativeMeterData(usage, fakeCumulativeName);
            expect(res).toEqual(fakeCumulativeData);
        });

        it('returns an error if no data available', function() {
            usageDataServiceMock.getRawData.and.returnValue(undefined);
            var res = service.getCumulativeMeterData(usage, fakeCumulativeName);
            expect(res).toEqual(fakeError);
        });
    });

    describe('getGaugeMeterData', function() {
        beforeEach(function() {
            spyOn(service, 'setLabelIfSpaceAvailable').and.returnValue('');
            spyOn(service, 'getServiceDelegate').and.returnValue(usageDataServiceMock);
        });

        it('returns the correct usage data if available', function() {
            usageDataServiceMock.getRawData.and.returnValue(fakeData);
            var res = service.getGaugeMeterData(usage, fakeGaugeName);
            expect(res).toEqual(fakeGaugeData);
        });

        it('returns an error if no usage data available', function() {
            usageDataServiceMock.getRawData.and.returnValue(undefined);
            var res = service.getCumulativeMeterData(usage, fakeGaugeName);
            expect(res).toEqual(fakeError);
        });
    });

    describe('getServiceDelegate', function() {
        it('returns usageDataService if selected', function() {
            var res = service.getServiceDelegate(usage);
            expect(res).toEqual(usageDataServiceMock);
        });

        it('returns chargeDataService if selected', function() {
            var res = service.getServiceDelegate(charge);
            expect(res).toEqual(chargeDataServiceMock);
        });

        it('returns rateDataService if selected', function() {
            var res = service.getServiceDelegate(rate);
            expect(res).toEqual(rateDataServiceMock);
        });
    });


    describe('setLabelIfSpaceAvailable', function() {
        it('should set a label if space permits it', function() {
            var res = service.setLabelIfSpaceAvailable(
                fakeNumPoints, fakePointIndex, fakeNumLabels, fakeLabel
            );
            expect(res).toEqual(fakeLabel);
        });

        it('should not add a label if no space is available', function() {
            var res = service.setLabelIfSpaceAvailable(
                fakeNumPoints, fakePointIndex + 1, fakeNumLabels, fakeLabel
            );
            expect(res).toEqual('');
        });
    });
});


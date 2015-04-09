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
    var emptyCumulativeObject = { "data": 0 };
    var emptyGaugeObject = { "labels": [], "data": [[]] };
    var fakeCumulativeName = "cumulativeChart";
    var fakeGaugeName = "gaugeChart";
    var fakeUnitBytes = 'B';
    var fakeRate = {
        'points': [
            [1428497295803, 7308830001, 2],
            [1428497055806, 7308810001, 3]
        ]
    };
    var fakeUsageGauge = {
        'columns': ["time", "sequence_number", "avg", "unit"],
        'name': fakeGaugeName,
        'points': [
            [1428478328000, 7163780001, 0.30349895, "%"],
            [1428478327000, 7163810001, 0.33750436, "%"]
        ]
    };
    var fakeUsageCumulative = {
        'columns': ["time", "sequence_number", "unit", "usage"],
        'name': fakeCumulativeName,
        'points': [
            [1428478324000, 7155910001, fakeUnitBytes, 443309],
            [1428478324000, 7155890001, fakeUnitBytes, 142012]
        ]
    };
    var fakeUsageData = {
        cumulativeChart: fakeUsageCumulative,
        gaugeChart: fakeUsageGauge
    };
    var fakeRateData = {
        gaugeChart: fakeRate
    };
    var fakeCumulativeResult = { data: 2000 };
    var fakeGaugeResult = {
        labels: ['', ''],
        data: [ [0.33750436, 0.30349895] ]
    };
    var fakeGaugeResultNoColumns = {
        labels: ['', ''],
        data: [ [3, 2] ]
    };
    var fakeCumulativeResult = {
        data: 0.30349895 + 0.33750436
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

        it('returns the correct data if available (with columns)', function() {
            usageDataServiceMock.getRawData.and.returnValue(fakeUsageData);
            spyOn(service, 'getGaugeMeterData').and.returnValue(fakeGaugeResult);

            var res = service.getCumulativeMeterData(usage, fakeCumulativeName);
            expect(res).toEqual(fakeCumulativeResult);
        });

        it('returns an error if no data available', function() {
            usageDataServiceMock.getRawData.and.returnValue(undefined);
            var res = service.getCumulativeMeterData(usage, fakeCumulativeName);
            expect(res).toEqual(emptyCumulativeObject);
        });
    });

    describe('getGaugeMeterData', function() {
        beforeEach(function() {
            spyOn(service, 'setLabelIfSpaceAvailable').and.returnValue('');
            spyOn(service, 'getServiceDelegate').and.returnValue(usageDataServiceMock);
        });

        it('returns the correct usage data if available (with columns)', function() {
            usageDataServiceMock.getRawData.and.returnValue(fakeUsageData);
            var res = service.getGaugeMeterData(usage, fakeGaugeName);
            expect(res).toEqual(fakeGaugeResult);
        });

        it('returns the correct usage data if available (without columns)', function() {
            usageDataServiceMock.getRawData.and.returnValue(fakeRateData);
            var res = service.getGaugeMeterData(usage, fakeGaugeName);
            expect(res).toEqual(fakeGaugeResultNoColumns);
        });

        it('returns empty data if no usage data is available', function() {
            usageDataServiceMock.getRawData.and.returnValue(undefined);
            var res = service.getGaugeMeterData(usage, fakeGaugeName);
            expect(res).toEqual(emptyGaugeObject);
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

    describe('getDataUnit', function() {
        beforeEach(function() {
            spyOn(service, 'getServiceDelegate').and.returnValue(usageDataServiceMock);
        });

        it('should return a unit if available', function() {
            usageDataServiceMock.getRawData.and.returnValue(fakeUsageData);
            var res = service.getDataUnit(usage, fakeCumulativeName);
            expect(res).toEqual(fakeUnitBytes);
        });

        it('should return undefined if no unit available', function() {
            usageDataServiceMock.getRawData.and.returnValue(fakeRateData);
            var res = service.getDataUnit(usage, fakeCumulativeName);
            expect(res).toEqual(undefined);
        });
    });
});


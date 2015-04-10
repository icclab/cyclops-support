(function() {
    /*
        Module Setup
    */
    angular.module('dashboard.services')
        .service('chartDataService', ChartDataService);

    /*
        Controllers, Factories, Services, Directives
    */
    ChartDataService.$inject = [
        'dateUtil', 'usageDataService', 'rateDataService', 'chargeDataService'
    ];
    function ChartDataService(
            dateUtil, usageDataService, rateDataService, chargeDataService) {
        var me = this;
        var NUM_LABELS = 10;

        //Default indices in case there is no column description
        var DEFAULT_INDEX_TIME = 0;
        var DEFAULT_INDEX_USAGE = 2;

        this.getServiceDelegate = function(type) {
            if(type == "usage") {
                return usageDataService;
            }
            else if(type == "rate") {
                return rateDataService;
            }
            else if(type == "charge") {
                return chargeDataService;
            }
        };

        this.setLabelIfSpaceAvailable = function(
                numPoints, pointIndex, numLabels, label) {

            var modulus = Math.round(numPoints / numLabels);
            modulus = (numPoints < numLabels) ? 1 : modulus;
            return pointIndex % modulus == 0 ? label : "";
        };

        this.getDataUnit = function(type, meterName) {
            try {
                var service = me.getServiceDelegate(type);
                var serviceData = service.getFormattedData();
                return serviceData[meterName].unit;
            }
            catch(err) {
                return undefined;
            }
        };

        this.getCumulativeMeterData = function(type, meterName) {
            try {
                /*
                    Cumulative meters can be treated as gauge meters, because
                    the raw data is represented in the same way (many individual
                    data points). We need to sum up the individual points to
                    get the cumulative result.
                 */
                var gaugeData = me.getGaugeMeterData(type, meterName).data[0];
                var cumulativeValue = 0;

                for(var i = 0; i < gaugeData.length; i++) {
                    cumulativeValue += gaugeData[i];
                }

                return { "data": cumulativeValue };
            }
            catch(err) {
                return { "data": 0 };
            }
        };

        this.getGaugeMeterData = function(type, meterName) {
            try {
                var service = me.getServiceDelegate(type);
                var serviceData = service.getFormattedData();
                var dataPoints = serviceData[meterName].points || [];
                dataPoints.reverse();
                var numPoints = dataPoints.length;
                var dataX = [];
                var dataY = [];

                for(var i = 0; i < numPoints; i++) {
                    dataX.push(me.setLabelIfSpaceAvailable(
                        numPoints,
                        i,
                        NUM_LABELS,
                        dateUtil.fromTimestamp(dataPoints[i][0])
                    ));
                    dataY.push(dataPoints[i][1]);
                }

                return { "labels": dataX, "data": [dataY] }
            }
            catch(err) {
                return { "labels": [], "data": [[]] };
            }
        };
    }

})();

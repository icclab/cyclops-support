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
        var ERROR = { 'error': true };


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

        this.getCumulativeMeterData = function(type, meterName) {
            try {
                var service = me.getServiceDelegate(type);
                var serviceData = service.getRawData();
                var value = serviceData[meterName].points[0][1];
                return { "data": value };
            }
            catch(err) {
                return ERROR;
            }
        };

        this.getGaugeMeterData = function(type, meterName) {
            try {
                var service = me.getServiceDelegate(type);
                var serviceData = service.getRawData();
                var dataPoints = serviceData[meterName].points;
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
                    dataY.push(dataPoints[i][2]);
                }

                return { "labels": dataX, "data": [dataY] }
            }
            catch(err) {
                return ERROR;
            }
        };
    }

})();

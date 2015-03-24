(function() {
    /*
        Module Setup
    */
    angular.module('dashboard.services')
        .service('chartDataService', ChartDataService);

    /*
        Controllers, Factories, Services, Directives
    */
   ChartDataService.$inject = ['dateUtil'];
    function ChartDataService(dateUtil) {
        var NUM_LABELS = 10;
        var ERROR = { 'error': true };

        var me = this;
        var rawData = {};

        this.setLabelIfSpaceAvailable = function(
                numPoints, pointIndex, numLabels, label) {

            var modulus = Math.round(numPoints / numLabels);
            modulus = (numPoints < numLabels) ? 1 : modulus;
            return pointIndex % modulus == 0 ? label : "";
        };

        this.setRawData = function(data) {
            if(data && data.usage && data.usage.openstack) {
                dataArray = data.usage.openstack;

                for(var i = 0; i < dataArray.length; i++) {
                    currentData = dataArray[i];
                    rawData[currentData.name] = currentData;
                }
            }
        };

        this.getRawData = function() {
            return rawData;
        };

        this.getCumulativeMeterData = function(meterName) {
            try {
                var value = rawData[meterName].points[0][1];
                return { "data": value };
            }
            catch(err) {
                return ERROR;
            }
        };

        this.getGaugeMeterData = function(meterName) {
            try {
                var dataPoints = rawData[meterName].points;
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

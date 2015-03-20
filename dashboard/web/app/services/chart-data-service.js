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
        var NET_BYTES_IN = 0;
        var NET_BYTES_OUT = 1;
        var CPU_UTIL_RATE = 2;
        var DISK_READ_RATE = 3;
        var ERROR = { 'error': true };

        var me = this;
        var rawData = undefined;

        this.setLabelIfSpaceAvailable = function(
                numPoints, pointIndex, numLabels, label) {

            var modulus = Math.round(numPoints / numLabels);
            modulus = (numPoints < numLabels) ? 1 : modulus;
            return pointIndex % modulus == 0 ? label : "";
        };

        this.setRawData = function(data) {
            if(data && data.usage && data.usage.openstack) {
                rawData = data.usage.openstack;
            }
        };

        this.getRawData = function() {
            return rawData;
        };

        this.getIncomingNetworkBytes = function() {
            try {
                var netInBytes = rawData[NET_BYTES_IN].points[0][1];
                var dataString = (netInBytes / 1000 / 1000) + " MB";
                return { "data": dataString };
            }
            catch(err) {
                return ERROR;
            }
        };

        this.getOutgoingNetworkBytes = function() {
            try {
                var netOutBytes = rawData[NET_BYTES_OUT].points[0][1];
                var dataString = (netOutBytes / 1000 / 1000) + " MB";
                return { "data": dataString };
            }
            catch(err) {
                return ERROR;
            }
        };

        this.getCpuUtilRate = function() {
            try {
                var dataPoints = rawData[CPU_UTIL_RATE].points;
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

                return { "labels": dataX, "data": [dataY] };
            }
            catch(err) {
                return ERROR;
            }
        };

        this.getDiskReadRate = function() {
            try {
                var dataPoints = rawData[DISK_READ_RATE].points;
                var numPoints = dataPoints.length;
                var modulus = Math.round(numPoints / 10);
                modulus = (modulus < 10) ? 1 : modulus;
                var dataX = [];
                var dataY = [];

                for(var i = 0; i < numPoints; i++) {
                    dataX.push(me.setLabelIfSpaceAvailable(
                        numPoints,
                        i,
                        NUM_LABELS,
                        dateUtil.fromTimestamp(dataPoints[i][0])
                    ));
                    dataY.push(dataPoints[i][2] / 1000);
                }

                return { "labels": dataX, "data": [dataY] }
            }
            catch(err) {
                return ERROR;
            }
        };
    }

})();

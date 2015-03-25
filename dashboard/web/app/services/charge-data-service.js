(function() {
    /*
        Module Setup
    */
    angular.module('dashboard.services')
        .service('chargeDataService', ChargeDataService);

    /*
        Controllers, Factories, Services, Directives
    */
    function ChargeDataService() {
        var me = this;
        var rawData = {};

        this.setRawData = function(data) {

            if(data && data.charge) {
                var chargeData = data.charge;
                var points = chargeData.points || [];
                var columns = chargeData.columns || [];
                var indexResource = columns.indexOf("resource");
                var indexTime = columns.indexOf("time");
                var indexPrice = columns.indexOf("price");

                if(indexTime == -1 || indexPrice == -1 || indexResource == -1) {
                    return;
                }

                for (var i = 0; i < points.length; i++) {
                    currentPoint = points[i];
                    var currentName = currentPoint[indexResource];
                    var currentTime = currentPoint[indexTime];
                    var currentPrice = currentPoint[indexPrice];

                    if(!rawData[currentName]) {
                        rawData[currentName] = {
                            points: []
                        };
                    }

                    rawData[currentName].points.push([
                        currentTime,
                        null,
                        currentPrice
                    ]);
                }
            }
        };

        this.getRawData = function() {
            return rawData;
        };
    }

})();

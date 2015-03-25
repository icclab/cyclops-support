(function() {
    /*
        Module Setup
    */
    angular.module('dashboard.services')
        .service('usageDataService', UsageDataService);

    /*
        Controllers, Factories, Services, Directives
    */
    function UsageDataService() {
        var me = this;
        var rawData = {};

        this.setRawData = function(data) {
            if(data && data.usage && data.usage.openstack) {
                dataArray = data.usage.openstack;

                for(var i = 0; i < dataArray.length; i++) {
                    currentData = dataArray[i];

                    if(currentData) {
                        rawData[currentData.name] = currentData;
                    }
                }
            }
        };

        this.getRawData = function() {
            return rawData;
        };
    }

})();

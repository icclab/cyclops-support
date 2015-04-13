(function() {
    /*
        Module Setup
    */
    angular.module('dashboard.services')
        .service('meterselectionDataService', MeterselectionDataService);

    /*
        Controllers, Factories, Services, Directives
    */
    function MeterselectionDataService() {
        var me = this;
        var formattedUdrData = {};
        var formattedOpenstackData = {};

        /**
         * Transforms the raw UDR response data to the following format:
         *
         * {
         *     "meter_name": {
         *         name: "meter_name",
         *         enabled: true/false,
         *         type: "gauge"/"cumulative",
         *         source: "meter_source"
         *     }
         * }
         *
         * @param {Object} data Raw response data
         */
        this.setRawUdrData = function(data) {
            formattedUdrData = {};
            var meters = data.points || [];
            var columns = data.columns || [];
            var indexName = columns.indexOf("metername");
            var indexType = columns.indexOf("metertype");
            var indexSource = columns.indexOf("metersource");
            var indexStatus = columns.indexOf("status");

            for (var i = 0; i < meters.length; i++) {
                var meter = meters[i];
                var meterName = meter[indexName];

                formattedUdrData[meterName] = {
                    name: meterName,
                    enabled: meter[indexStatus] == 1,
                    type: meter[indexType],
                    source: meter[indexSource]
                };
            };
        };

        /**
         * Transforms the raw OpenStack response data to the following format:
         *
         * {
         *     "meter_name": {
         *         name: "meter_name",
         *         enabled: false,
         *         type: "gauge"/"cumulative",
         *         source: "meter_source"
         *     }
         * }
         *
         * @param {Object} data Raw response data
         */
        this.setRawOpenstackData = function(data) {
            formattedOpenstackData = {};

            for(var i = 0; i < data.length; i++) {
                var meter = data[i];
                var meterName = meter.name;

                formattedOpenstackData[meterName] = {
                    name: meterName,
                    enabled: false,
                    type: meter.type,
                    source: meter.source
                };
            }
        };

        this.getFormattedUdrData = function() {
            return formattedUdrData;
        };

        this.getFormattedOpenstackData = function() {
            return formattedOpenstackData;
        };
    }

})();

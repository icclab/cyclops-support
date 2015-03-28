(function(){
    /*
        Module Setup
    */
    angular.module('dashboard.admin.meters')
        .controller('AdminMeterController', AdminMeterController);

    /*
        Controllers, Factories, Services, Directives
    */
    AdminMeterController.$inject = ['restService', 'alertService', 'dateUtil'];
    function AdminMeterController(restService, alertService, dateUtil) {
        var me = this;
        this.uniqueMeterMap = {};

        var loadKeystoneMeterSuccess = function(response) {
            me.uniqueMeterMap = me.buildUniqueMeterMap(response.data);
            return restService.getUdrMeters();
        };

        var loadUdrMeterSuccess = function(response) {
            me.preselectMeters(response.data);
        };

        var loadMeterError = function(response) {
            alertService.showError("Error loading list of meters");
        };

        var updateMeterSuccess = function(response) {
            alertService.showSuccess("Meters successfully updated");
        };

        var updateMeterError = function(response) {
            alertService.showError("Updating meters failed");
        };

        this.preselectMeters = function(udrMeterResponse) {
            var udrMeters = udrMeterResponse.points || [];
            var columns = udrMeterResponse.columns || [];
            var meterMap = me.uniqueMeterMap;
            var indexName = columns.indexOf("metername");
            var indexStatus = columns.indexOf("status");

            if(indexName == -1 || indexStatus == -1) {
                return;
            }

            for(var i = 0; i < udrMeters.length; i++) {
                var meter = udrMeters[i];
                var meterName = meter[indexName];
                var meterStatus = meter[indexStatus];

                if(meterName in meterMap) {
                    meterMap[meterName].selected = meterStatus == 1;
                }
            }
        };

        /**
         * Builds a map of unique OpenStack Ceilometer meters.
         *
         * @param  {Array} allMeters Array of meter objects
         * @return {Object}          Set of unique meters
         */
        this.buildUniqueMeterMap = function(allMeters) {
            var meterMap = {};

            for(var i = 0; i < allMeters.length; i++) {
                var currentMeter = allMeters[i];
                var currentMeterName = currentMeter.name;

                if(!(currentMeterName in meterMap)) {
                    meterMap[currentMeterName] = currentMeter;
                }
            }

            return meterMap;
        };

        /**
         * Toggles a meter based on the checkbox. The method will set the
         * 'selected' property of a meter to true or false.
         *
         * @param  {String} meterName Name of the meter to toggle
         */
        this.toggleMeter = function(meterName) {
            var meterMap = this.uniqueMeterMap;
            meterMap[meterName].selected = !meterMap[meterName].selected;
        };

        /**
         * Builds the message body for the UDR "update meter selection" POST
         * request.
         *
         * @return {Object} POST request body as JSON
         */
        this.buildUdrRequest = function() {
            var timestamp = dateUtil.getTimestamp();
            var name = "meterselection";
            var appSource = "cyclops-ui";
            var columns = [
                "time", "source", "metersource", "metertype",
                "metername", "status"
            ];
            points = [];

            for(var meterName in this.uniqueMeterMap) {
                var meter = this.uniqueMeterMap[meterName];

                points.push([
                    timestamp,
                    appSource,
                    meter.source,
                    meter.type,
                    meter.name,
                    meter.selected ? 1 : 0
                ]);
            }

            return {
                "name": name,
                "columns": columns,
                "points": points
            };
        };

        this.updateUdrMeters = function() {
            restService.updateUdrMeters(this.buildUdrRequest())
                .then(updateMeterSuccess, updateMeterError);
        };

        this.loadMeterData = function() {
            restService.getKeystoneMeters()
                .then(loadKeystoneMeterSuccess)
                .then(loadUdrMeterSuccess, loadMeterError);
        };

        this.loadMeterData();
    }

})();

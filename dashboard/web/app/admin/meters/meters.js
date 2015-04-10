(function(){
    /*
        Module Setup
    */
    angular.module('dashboard.admin.meters')
        .controller('AdminMeterController', AdminMeterController);

    /*
        Controllers, Factories, Services, Directives
    */
    AdminMeterController.$inject = [
        'restService', 'meterselectionDataService', 'alertService', 'dateUtil'
    ];
    function AdminMeterController(
            restService, meterselectionDataService, alertService, dateUtil) {
        var me = this;
        this.meterMap = {};

        var loadKeystoneMeterSuccess = function(response) {
            meterselectionDataService.setRawOpenstackData(response.data);
            return restService.getUdrMeters();
        };

        var loadUdrMeterSuccess = function(response) {
            meterselectionDataService.setRawUdrData(response.data);
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
            var udrMeters = meterselectionDataService.getFormattedUdrData();
            var meters = meterselectionDataService.getFormattedOpenstackData();

            for(var meterName in udrMeters) {
                var meter = udrMeters[meterName];

                if(meterName in meters) {
                    meters[meterName].enabled = meter.enabled;
                }
            }

            me.meterMap = meters;
        };

        /**
         * Toggles a meter based on the checkbox. The method will set the
         * 'enabled' property of a meter to true or false.
         *
         * @param  {String} meterName Name of the meter to toggle
         */
        this.toggleMeter = function(meterName) {
            var meterMap = this.meterMap;
            meterMap[meterName].enabled = !meterMap[meterName].enabled;
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

            for(var meterName in me.meterMap) {
                var meter = me.meterMap[meterName];

                points.push([
                    timestamp,
                    appSource,
                    meter.source,
                    meter.type,
                    meter.name,
                    meter.enabled ? 1 : 0
                ]);
            }

            return {
                "name": name,
                "columns": columns,
                "points": points
            };
        };

        this.updateUdrMeters = function() {
            restService.updateUdrMeters(me.buildUdrRequest())
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

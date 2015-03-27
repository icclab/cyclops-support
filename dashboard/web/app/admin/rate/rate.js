(function(){
    /*
        Module Setup
    */
    angular.module('dashboard.admin.rate')
        .controller('AdminRateController', AdminRateController);

    /*
        Controllers, Factories, Services, Directives
    */
    AdminRateController.$inject = ['$log', 'restService', 'dateUtil'];
    function AdminRateController($log, restService, dateUtil) {
        var me = this;
        this.isStaticRateEnabled = true;
        this.staticRateStatusString = "on";
        this.enabledButtonClass = "disabled";
        this.disabledButtonClass = "";
        this.meters = [
            {
                name: "cpu_util",
                rate: "0.5"
            },
            {
                name: "energy",
                rate: "1"
            },
            {
                name: "network.incoming.bytes",
                rate: "1.25"
            }
        ];

        this.setStaticRateEnabled = function(isEnabled) {
            me.isStaticRateEnabled = isEnabled;
            me.staticRateStatusString = isEnabled ? "on" : "off";
            me.enabledButtonClass = isEnabled ? "disabled" : "";
            me.disabledButtonClass = isEnabled ? "" : "disabled";
        };

        this.buildDynamicRateConfig = function() {
            return {
                source : "dashboard",
                time: dateUtil.getFormattedDateTimeNow(),
                rate_policy : "dynamic",
                rate : null
            };
        };

        this.buildStaticRateConfig = function() {
            var rates = {};
            var meters = me.meters;

            for(var i = 0; i < meters.length; i++) {
                var currentMeter = meters[i];
                rates[currentMeter.name] = currentMeter.rate;
            }

            return {
                source: "dashboard",
                rate_policy: "static",
                time: dateUtil.getFormattedDateTimeNow(),
                rate: rates
            };
        };
    }

})();

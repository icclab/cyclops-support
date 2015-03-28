(function(){
    /*
        Module Setup
    */
    angular.module('dashboard.admin.rate')
        .controller('AdminRateController', AdminRateController);

    /*
        Controllers, Factories, Services, Directives
    */
    AdminRateController.$inject = ['restService', 'alertService', 'dateUtil'];
    function AdminRateController(restService, alertService, dateUtil) {
        var me = this;
        this.isStaticRateEnabled = false;
        this.activePolicyStatusString = "Dynamic Rating";
        this.staticRatingButtonClass = "";
        this.dynamicRatingButtonClass = "disabled";
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

        var onGetActivePolicySuccess = function(response) {
            var policy = response.data.rate_policy;
            var staticEnabled = (policy && policy == "static");

            if(staticEnabled) {
                me.setGuiStaticRateEnabled();
                me.setGuiActivePolicyStatic();
            }
            else {
                me.setGuiDynamicRateEnabled();
                me.setGuiActivePolicyDynamic();
            }
        };

        var onGetActivePolicyError = function(response) {
            alertService.showError("Could not determine rate status");
        };

        var onActivatePolicyStaticSuccess = function(response) {
            alertService.showSuccess("Successfully switched to Static Rating");
            me.setGuiActivePolicyStatic();
        };

        var onActivatePolicyStaticError = function(response) {
            alertService.showError("Could not switch to StaticRating");
        };

        var onActivatePolicyDynamicSuccess = function(response) {
            alertService.showSuccess("Successfully switched to Dynamic Rating");
            me.setGuiActivePolicyDynamic();
        };

        var onActivatePolicyDynamicError = function(response) {
            alertService.showError("Could switch to Dynamic Rating");
        };

        this.setGuiStaticRateEnabled = function() {
            me.isStaticRateEnabled = true;
            me.staticRatingButtonClass = "disabled";
            me.dynamicRatingButtonClass = "";
        };

        this.setGuiDynamicRateEnabled = function() {
            me.isStaticRateEnabled = false;
            me.staticRatingButtonClass = "";
            me.dynamicRatingButtonClass = "disabled";
        };

        this.setGuiActivePolicyStatic = function() {
            me.activePolicyStatusString = "Static Rating";
        };

        this.setGuiActivePolicyDynamic = function() {
            me.activePolicyStatusString = "Dynamic Rating";
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

        this.activatePolicyStatic = function() {
            var config = me.buildStaticRateConfig();

            restService.setActiveRatePolicy(config)
                .then(onActivatePolicyStaticSuccess, onActivatePolicyStaticError);
        };

        this.activatePolicyDynamic = function() {
            var config = me.buildDynamicRateConfig();

            restService.setActiveRatePolicy(config)
                .then(onActivatePolicyDynamicSuccess, onActivatePolicyDynamicError);
        };

        this.getActiveRatePolicy = function() {
            restService.getActiveRatePolicy()
                .then(onGetActivePolicySuccess, onGetActivePolicyError);
        };

        this.getActiveRatePolicy();
    }

})();

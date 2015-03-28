(function(){
    /*
        Module Setup
    */
    angular.module('dashboard.admin.rate')
        .controller('AdminRateController', AdminRateController);

    /*
        Controllers, Factories, Services, Directives
    */
    AdminRateController.$inject = [
        'restService', 'alertService', 'responseParser', 'dateUtil'
    ];
    function AdminRateController(
            restService, alertService, responseParser, dateUtil) {
        var me = this;
        this.isStaticRateEnabled = false;
        this.activePolicyStatusString = "Dynamic Rating";
        this.staticRatingButtonClass = "";
        this.dynamicRatingButtonClass = "disabled";
        this.meters = [];

        var onGetActivePolicyError = function(response) {
            alertService.showError("Could not determine rate policy");
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
                var rate = currentMeter.rate;

                //replace illegal numbers / strings with 1
                if(isNaN(rate) || rate < 0) {
                    rate = 1;
                }

                rates[currentMeter.name] = rate;
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

        this.filterEnabledMeters = function(udrMeterResponse) {
            var meterData = udrMeterResponse.data;
            var udrMeters = meterData.points || [];
            var columns = meterData.columns || [];
            var indexName = columns.indexOf("metername");
            var indexStatus = columns.indexOf("status");

            if(indexName == -1 || indexStatus == -1) {
                return;
            }

            /*
            Outer Loop: Goes through all meters that the UDR microservice
            knows.

            Inner Loop: For each meter that is enabled, it looks up if a
            static meter already exists (meaning that a static rate has been set)

            If the meter doesn't exist yet, it means that it was selected, but
            not configured for static rating yet. Therefore, we have to add it
            to the static meter array with a default rate (here: 1)
             */
            for(var i = 0; i < udrMeters.length; i++) {
                var enabledMeter = udrMeters[i];

                if(enabledMeter[indexStatus] == 1) {
                    var meterExists = false;

                    for(var j = 0; j < me.meters.length; j++) {
                        var staticMeter = me.meters[j];

                        if(staticMeter.name == enabledMeter[indexName]) {
                            meterExists = true;
                        }
                    }

                    if(!meterExists) {
                        me.meters.push({
                            'name': enabledMeter[indexName],
                            'rate': 1
                        });
                    }
                }
            }
        };

        this.prepareGuiByActivePolicy = function(policyData) {
            var policy = policyData.rate_policy || "";

            if(policy == "static") {
                me.meters = responseParser.getStaticRatingListFromResponse(policyData);
                me.setGuiStaticRateEnabled();
                me.setGuiActivePolicyStatic();
            }
            else {
                me.setGuiDynamicRateEnabled();
                me.setGuiActivePolicyDynamic();
            }
        };

        this.onLoad = function() {
            restService.getActiveRatePolicy()
                .then(function(response) {
                    me.prepareGuiByActivePolicy(response.data);
                    return restService.getUdrMeters();
                })
                .then(me.filterEnabledMeters, onGetActivePolicyError);
        };

        this.onLoad();
    }

})();

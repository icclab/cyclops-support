(function(){
    /*
        Module Setup
    */
    angular.module('dashboard.admin.rate')
        .controller('AdminRateController', AdminRateController);

    /*
        Controllers, Factories, Services, Directives
    */
    AdminRateController.$inject = ['$log', 'restService'];
    function AdminRateController($log, restService) {
        var me = this;
        this.isStaticRateEnabled = true;
        this.staticRateStatusString = "on";
        this.enabledButtonClass = "disabled";
        this.disabledButtonClass = "";
        this.meters = [];

        this.setStaticRateEnabled = function(isEnabled) {
            me.isStaticRateEnabled = isEnabled;
            me.staticRateStatusString = isEnabled ? "on" : "off";
            me.enabledButtonClass = isEnabled ? "disabled" : "";
            me.disabledButtonClass = isEnabled ? "" : "disabled";
        };
    }

})();

(function(){
    /*
        Module Setup
    */
    angular.module('dashboard.keystone')
        .controller('KeystoneController', KeystoneController);

    /*
        Controllers, Factories, Services, Directives
    */
    KeystoneController.$inject =
        ['$log', '$location', 'restService', 'sessionService', 'alertService'];
    function KeystoneController($log, $location, restService, sessionService, alertService) {
        var me = this;
        this.user = '';
        this.pwd = '';

        var keystoneIdStored = function() {
            $location.path("/overview");
        };

        var keystoneAuthSuccess = function(response) {
            sessionService.setKeystoneId(response.data.keystoneId);
            return restService.storeKeystoneId(
                sessionService.getUsername(),
                sessionService.getKeystoneId(),
                sessionService.getSessionId()
            );
        };

        var keystoneAuthFailed = function(response) {
            alertService.showError("Login failed. Please verify your credentials");
        };

        this.loadKeystoneId = function() {
            restService.sendKeystoneAuthRequest(me.user, me.pwd)
                .then(keystoneAuthSuccess)
                .then(keystoneIdStored, keystoneAuthFailed);
        };
    };

})();

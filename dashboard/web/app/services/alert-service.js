(function() {
    /*
        Module Setup
    */
    angular.module('dashboard.services')
        .service('alertService', AlertService);

    /*
        Controllers, Factories, Services, Directives
    */
    AlertService.$inject = ['$log', 'toasty'];
    function AlertService($log, toasty) {
        this.showError = function(message) {
            toasty.pop.error({
                title: "Error",
                msg: message,
                sound: false,
                timeout: 3000
            });

            $log.debug("Error: " + message);
        };

        this.showSuccess = function(message) {
            toasty.pop.success({
                title: "Success",
                msg: message,
                sound: false,
                timeout: 3000
            });

            $log.debug("Success: " + message);
        };
    }

})();

(function(){
    /*
        Module Setup
    */
    angular.module('dashboard.cloudservices')
        .controller('CloudServiceController', CloudServiceController);

    /*
        Controllers, Factories, Services, Directives
    */
    CloudServiceController.$inject =
        ['$state', 'restService', 'sessionService'];
    function CloudServiceController($state, restService, sessionService) {
        var me = this;

        this.showKeystone = function() {
            $state.go("keystone");
        };
    };

})();

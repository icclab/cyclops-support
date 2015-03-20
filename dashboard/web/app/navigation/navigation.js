(function(){
    /*
        Module Setup
    */
    angular.module('dashboard.navigation')
        .controller('NavigationController', NavigationController);

    /*
        Controllers, Factories, Services, Directives
    */
    NavigationController.$inject = ['$location', 'sessionService'];
    function NavigationController($location, sessionService) {
        this.showAdminNavigation = function() {
            return sessionService.isAdmin();
        };

        this.logout = function() {
            //TODO: logout request to OpenAM
            sessionService.clearSession();
            $location.path("/login");
        };
    };

})();

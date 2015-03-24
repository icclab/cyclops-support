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
    }

})();

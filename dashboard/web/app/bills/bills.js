(function(){
    /*
        Module Setup
    */
    angular.module('dashboard.bills')
        .controller('BillController', BillController);

    /*
        Controllers, Factories, Services, Directives
    */
    BillController.$inject = [
        'sessionService', 'restService'
    ];
    function BillController(sessionService, restService) {
        var me = this;
    }

})();

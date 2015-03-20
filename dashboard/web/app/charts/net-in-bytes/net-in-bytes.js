(function() {

    angular.module('dashboard.charts')
        .directive('netInBytesChart', NetInBytesChartDeclaration);

    function NetInBytesChartDeclaration() {
        return {
            restrict: 'E',
            templateUrl: 'charts/net-in-bytes/net-in-bytes.html',
            controller: NetInBytesChartController,
            controllerAs: 'netInBytesCtrl'
        };
    };

    NetInBytesChartController.$inject = ['$scope', 'chartDataService'];
    function NetInBytesChartController($scope, chartDataService) {
        var me = this;
        var dataError = false;

        $scope.$on('UDR_DATA_READY', function() {
            console.log("UDR DATA READY");
            me.updateGraph();
        });

        this.updateGraph = function() {
            var result = chartDataService.getIncomingNetworkBytes();

            if(result.error) {
                me.dataError = true;
            }
            else {
                me.data = result.data;
            }
        };
    };

})();

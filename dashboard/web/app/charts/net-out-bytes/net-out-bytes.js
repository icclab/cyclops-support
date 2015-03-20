(function() {

    angular.module('dashboard.charts')
        .directive('netOutBytesChart', NetOutBytesChartDeclaration);

    function NetOutBytesChartDeclaration() {
        return {
            restrict: 'E',
            templateUrl: 'charts/net-out-bytes/net-out-bytes.html',
            controller: NetOutBytesChartController,
            controllerAs: 'netOutBytesCtrl'
        };
    };

    NetOutBytesChartController.$inject = ['$scope', 'chartDataService'];
    function NetOutBytesChartController($scope, chartDataService) {
        var me = this;

        $scope.$on('UDR_DATA_READY', function() {
            console.log("UDR DATA READY");
            me.updateGraph();
        });

        this.updateGraph = function() {
            var result = chartDataService.getOutgoingNetworkBytes();

            if(result.error) {
                me.dataError = true;
            }
            else {
                me.data = result.data;
            }
        };
    };

})();

(function() {

    angular.module('dashboard.charts')
        .directive('cpuUtilChart', CpuUtilChartDeclaration);

    function CpuUtilChartDeclaration() {
        return {
            restrict: 'E',
            templateUrl: 'charts/cpu-util/cpu-util.html',
            controller: CpuUtilChartController,
            controllerAs: 'cpuUtilCtrl'
        };
    };

    CpuUtilChartController.$inject = ['$scope', 'chartDataService'];
    function CpuUtilChartController($scope, chartDataService) {
        var me = this;
        var dataError = false;

        $scope.$on('UDR_DATA_READY', function() {
            console.log("UDR DATA READY");
            me.updateGraph();
        });

        this.updateGraph = function() {
            var result = chartDataService.getCpuUtilRate();

            if(result.error) {
                me.dataError = true;
            }
            else {
                me.data = result.data;
                me.labels = result.labels;
            }
        };
    };

})();

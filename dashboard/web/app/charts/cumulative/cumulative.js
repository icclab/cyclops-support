(function() {

    angular.module('dashboard.charts')
        .directive('cumulativeChart', CumulativeChartDeclaration);

    function CumulativeChartDeclaration() {
        return {
            scope: {},
            restrict: 'E',
            templateUrl: 'charts/cumulative/cumulative.html',
            controller: CumulativeChartController,
            controllerAs: 'cumulativeChartCtrl',
            link: onLink
        };
    }

    function onLink(scope, el, attr, controller) {
        controller.chartName = attr.name;
    }

    CumulativeChartController.$inject = ['$scope', 'chartDataService'];
    function CumulativeChartController($scope, chartDataService) {
        var me = this;
        this.dataError = false;
        this.chartName = undefined;
        this.chartData = undefined;

        this.updateGraph = function() {
            var result = chartDataService.getCumulativeMeterData(me.chartName);

            if(result.error) {
                me.dataError = true;
            }
            else {
                me.chartData = result.data;
            }
        };

        $scope.$on('UDR_DATA_READY', function() {
            console.log("UDR DATA READY");
            me.updateGraph();
        });
    }

})();

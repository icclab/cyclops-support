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
        controller.chartDataType = attr.type;
    }

    CumulativeChartController.$inject = ['$scope', 'chartDataService'];
    function CumulativeChartController($scope, chartDataService) {
        var me = this;
        this.chartName = undefined;
        this.chartDataType = undefined;
        this.chartData = undefined;

        this.updateGraph = function() {
            var result = chartDataService.getCumulativeMeterData(
                me.chartDataType,
                me.chartName
            );

            me.chartData = result.error ? 0 : result.data;
        };

        $scope.$on('CHART_DATA_READY', function() {
            console.log("CHART_DATA_READY");
            me.updateGraph();
        });
    }

})();

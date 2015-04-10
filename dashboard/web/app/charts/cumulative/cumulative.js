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
        controller.chartDataUnit = attr.unit;
        controller.updateGraph();
    }

    CumulativeChartController.$inject = ['$scope', 'chartDataService'];
    function CumulativeChartController($scope, chartDataService) {
        var me = this;
        this.chartName = '';
        this.chartDataUnit = undefined;
        this.chartDataType = undefined;
        this.chartData = undefined;

        this.updateGraph = function() {
            me.chartData = chartDataService.getCumulativeMeterData(
                me.chartDataType,
                me.chartName
            ).data;
        };
    }

})();

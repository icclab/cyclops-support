(function() {

    angular.module('dashboard.charts')
        .directive('gaugeChart', GaugeChartDeclaration);

    function GaugeChartDeclaration() {
        return {
            scope: {},
            restrict: 'E',
            templateUrl: 'charts/gauge/gauge.html',
            controller: GaugeChartController,
            controllerAs: 'gaugeChartCtrl',
            link: onLink
        };
    }

    function onLink(scope, el, attr, controller) {
        controller.chartName = attr.name;
    }

    GaugeChartController.$inject = ['$scope', 'chartDataService'];
    function GaugeChartController($scope, chartDataService) {
        var me = this;
        this.chartName = undefined;
        this.chartData = undefined;
        this.chartLabels = undefined;
        this.chartSeries = undefined;
        this.chartOptions = { pointDot: false };
        this.dataError = false;

        this.updateGraph = function() {
            var result = chartDataService.getGaugeMeterData(me.chartName);

            if(result.error) {
                me.dataError = true;
            }
            else {
                me.chartData = result.data;
                me.chartLabels = result.labels;
            }
        };

        $scope.$on('UDR_DATA_READY', function() {
            console.log("UDR DATA READY");
            me.updateGraph();
        });
    }

})();

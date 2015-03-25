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
        controller.chartDataType = attr.type;
    }

    GaugeChartController.$inject = ['$scope', 'chartDataService'];
    function GaugeChartController($scope, chartDataService) {
        var me = this;
        this.dataError = false;
        this.chartName = undefined;
        this.chartData = undefined;
        this.chartDataType = undefined;
        this.chartLabels = undefined;
        this.chartSeries = undefined;
        this.chartOptions = {
            pointDot: false,
            bezierCurve : true,
            bezierCurveTension : 0.4,
            pointHitDetectionRadius: 0
        };

        this.updateGraph = function() {
            var result = chartDataService.getGaugeMeterData(
                me.chartDataType,
                me.chartName
            );

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

(function() {

    angular.module('dashboard.charts')
        .directive('chartContainer', ChartContainerDeclaration);

    ChartContainerDeclaration.$inject = ['$compile'];
    function ChartContainerDeclaration($compile) {
        return {
            restrict: 'E',
            template: '',
            link: function($scope, el, attr, controller) {
                var gaugeTemplate = "<gauge-chart name='{{NAME}}' type='{{TYPE}}' unit='{{UNIT}}' class='col-lg-6'></gauge-chart>";
                var cumulativeTemplate = "<cumulative-chart name='{{NAME}}' type='{{TYPE}}' unit='{{UNIT}}' class='col-lg-6'></cumulative-chart>";

                $scope.$on('CHART_DATA_READY', function(e, charts) {
                    el.empty();

                    for(var i = 0; i < charts.length; i++) {
                        var chart = charts[i];
                        var template = "";

                        if(chart.chartType == "cumulative") {
                            template = cumulativeTemplate;
                        }
                        else if(chart.chartType == "gauge") {
                            template = gaugeTemplate;
                        }

                        var finalTmpl = template.replace("{{NAME}}", chart.name)
                            .replace("{{TYPE}}", chart.serviceType)
                            .replace("{{UNIT}}", chart.unit);

                        var chartElement = $compile(finalTmpl)($scope);
                        el.append(chartElement);
                    }
                });
            }
        };
    }

})();

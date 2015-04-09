(function() {

    angular.module('dashboard.charts')
        .directive('chartContainer', ChartContainerDeclaration);

    ChartContainerDeclaration.$inject = ['$compile'];
    function ChartContainerDeclaration($compile) {
        return {
            restrict: 'E',
            template: '',
            link: function($scope, el, attr, controller) {
                $scope.$on('USAGE_DATA_READY', function(e, charts) {
                    el.empty();

                    for(var i = 0; i < charts.length; i++) {
                        var chart = $compile("<gauge-chart name='" + charts[i] + "' type='usage' class='col-lg-6'></gauge-chart>")($scope);
                        el.append(chart);
                    }
                });

                $scope.$on('RATE_DATA_READY', function(e, charts) {
                    el.empty();

                    for(var i = 0; i < charts.length; i++) {
                        var chart = $compile("<gauge-chart name='" + charts[i] + "' type='rate' class='col-lg-6'></gauge-chart>")($scope);
                        el.append(chart);
                    }
                });
            }
        };
    }

})();

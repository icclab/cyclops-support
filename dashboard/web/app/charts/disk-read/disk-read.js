(function() {

    angular.module('dashboard.charts')
        .directive('diskReadChart', DiskReadChartDeclaration);

    function DiskReadChartDeclaration() {
        return {
            restrict: 'E',
            templateUrl: 'charts/disk-read/disk-read.html',
            controller: DiskReadChartController,
            controllerAs: 'diskReadCtrl'
        };
    };

    DiskReadChartController.$inject = ['$scope', 'chartDataService'];
    function DiskReadChartController($scope, chartDataService) {
        var me = this;
        var dataError = false;

        $scope.$on('UDR_DATA_READY', function() {
            console.log("UDR DATA READY");
            me.updateGraph();
        });

        this.updateGraph = function() {
            var result = chartDataService.getDiskReadRate();

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

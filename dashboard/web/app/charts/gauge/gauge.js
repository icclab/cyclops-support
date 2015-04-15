/*
 * Copyright (c) 2015. Zuercher Hochschule fuer Angewandte Wissenschaften
 *  All Rights Reserved.
 *
 *     Licensed under the Apache License, Version 2.0 (the "License"); you may
 *     not use this file except in compliance with the License. You may obtain
 *     a copy of the License at
 *
 *          http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 *     WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *     License for the specific language governing permissions and limitations
 *     under the License.
 */

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
        controller.chartDataUnit = attr.unit;
        controller.updateGraph();
    }

    GaugeChartController.$inject = ['$scope', 'chartDataService'];
    function GaugeChartController($scope, chartDataService) {
        var me = this;
        this.chartName = '';
        this.chartData = undefined;
        this.chartDataType = undefined;
        this.chartDataUnit = undefined;
        this.chartLabels = undefined;
        this.chartSeries = undefined;
        this.chartOptions = {
            pointDot: false,
            animation: false,
            bezierCurve : true,
            showTooltips: false,
            bezierCurveTension : 0.4,
            pointHitDetectionRadius: 0
        };

        this.updateGraph = function() {
            var result = chartDataService.getGaugeMeterData(
                me.chartDataType,
                me.chartName
            );

            me.chartData = result.data;
            me.chartLabels = result.labels;
        };
    }

})();

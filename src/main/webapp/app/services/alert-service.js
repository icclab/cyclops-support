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
    /*
        Module Setup
    */
    angular.module('dashboard.services')
        .service('alertService', AlertService);

    /*
        Controllers, Factories, Services, Directives
    */
    AlertService.$inject = ['$log', 'toasty'];
    function AlertService($log, toasty) {
        this.showError = function(message) {
            toasty.pop.error({
                title: "Error",
                msg: message,
                sound: false,
                timeout: 3000
            });

            $log.debug("Error: " + message);
        };

        this.showSuccess = function(message) {
            toasty.pop.success({
                title: "Success",
                msg: message,
                sound: false,
                timeout: 3000
            });

            $log.debug("Success: " + message);
        };
    }

})();

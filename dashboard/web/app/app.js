(function(){
    /*
        Main Module Setup
    */
    angular.module('dashboard', [
      'ui.router',
      'dashboard.services',
      'dashboard.utils',
      'dashboard.navigation',
      'dashboard.login',
      'dashboard.overview',
      'dashboard.keystone',
      'dashboard.bills',
      'dashboard.cloudservices',
      'dashboard.admin.meters',
      'dashboard.admin.users',
      'dashboard.charts'
    ]).config([
        '$urlRouterProvider',
        '$logProvider',
        function($urlRouterProvider, $logProvider) {
            $urlRouterProvider.otherwise("/login");
            $logProvider.debugEnabled(true);
        }
    ]).run([
        '$rootScope',
        '$state',
        '$log',
        'sessionService',
        function($rootScope, $state, $log, sessionService) {
            /**
             * This function validates each redirect. It checks if a redirect
             * needs authentication or is specified as adminOnly and compares
             * the requirements to the current user session. If a redirect
             * is not permitted, the user will be redirected to the login
             * page instead.
             */
            var validateRedirect = function(event, to, toArgs, from, fromArgs){
                if(to.authenticate && !sessionService.isAuthenticated()){
                    $log.debug("Access Violation: not authenticated");
                    $state.go("login");
                    event.preventDefault();
                }

                if(to.adminOnly && !sessionService.isAdmin()){
                    $log.debug("Access Violation: no administrator");
                    $state.go("login");
                    event.preventDefault();
                }
            };

            $rootScope.$on("$stateChangeStart", validateRedirect);
        }
    ]);

    /*
        Login Module Setup
    */
    angular.module('dashboard.login', [
        'ui.router'
    ]).config([
        '$stateProvider',
        function($stateProvider) {
            $stateProvider.state('login', {
                url: "/login",
                authenticate: false,
                adminOnly: false,
                views: {
                    "navigation": {
                        template: ''
                    },
                    "content": {
                        templateUrl: 'login/login.html',
                        controller: 'LoginController',
                        controllerAs: 'loginCtrl'
                    }
                }
            });
        }
    ]);

    /*
        Overview Module Setup
    */
    angular.module('dashboard.overview', [
        'ui.router'
    ]).config([
        '$stateProvider',
        function($stateProvider) {
            $stateProvider.state('overview', {
                url: "/overview",
                authenticate: true,
                adminOnly: false,
                views: {
                    "navigation": {
                        templateUrl: 'navigation/navigation.html',
                        controller: 'NavigationController',
                        controllerAs: 'navigationCtrl'
                    },
                    "content": {
                        templateUrl: 'overview/overview.html',
                        controller: 'OverviewController',
                        controllerAs: 'overviewCtrl'
                    }
                }
            });
        }
    ]);

    /*
        Keystone Module Setup
    */
    angular.module('dashboard.keystone', [
        'ui.router'
    ]).config([
        '$stateProvider',
        function($stateProvider) {
            $stateProvider.state('keystone', {
                url: "/keystone",
                authenticate: true,
                adminOnly: false,
                views: {
                    "navigation": {
                        templateUrl: 'navigation/navigation.html',
                        controller: 'NavigationController',
                        controllerAs: 'navigationCtrl'
                    },
                    "content": {
                        templateUrl: 'keystone/keystone.html',
                        controller: 'KeystoneController',
                        controllerAs: 'keystoneCtrl'
                    }
                }
            });
        }
    ]);

    /*
        Bills Module Setup
    */
    angular.module('dashboard.bills', [
        'ui.router'
    ]).config([
        '$stateProvider',
        function($stateProvider) {
            $stateProvider.state('bills', {
                url: "/bills",
                authenticate: true,
                adminOnly: false,
                views: {
                    "navigation": {
                        templateUrl: 'navigation/navigation.html',
                        controller: 'NavigationController',
                        controllerAs: 'navigationCtrl'
                    },
                    "content": {
                        templateUrl: 'bills/bills.html',
                        controller: 'BillController',
                        controllerAs: 'billCtrl'
                    }
                }
            });
        }
    ]);


    /*
        Admin Meter Configuration Module Setup
    */
    angular.module('dashboard.admin.meters', [
        'ui.router'
    ]).config([
        '$stateProvider',
        function($stateProvider) {
            $stateProvider.state('admin-meters', {
                url: "/admin/meters",
                authenticate: true,
                adminOnly: true,
                views: {
                    "navigation": {
                        templateUrl: 'navigation/navigation.html',
                        controller: 'NavigationController',
                        controllerAs: 'navigationCtrl'
                    },
                    "content": {
                        templateUrl: 'admin/meters/meters.html',
                        controller: 'AdminMeterController',
                        controllerAs: 'adminMeterCtrl'
                    }
                }
            });
        }
    ]);


    /*
        Admin User Management Module Setup
    */
    angular.module('dashboard.admin.users', [
        'ui.router'
    ]).config([
        '$stateProvider',
        function($stateProvider) {
            $stateProvider.state('admin-users', {
                url: "/admin/users",
                authenticate: true,
                adminOnly: true,
                views: {
                    "navigation": {
                        templateUrl: 'navigation/navigation.html',
                        controller: 'NavigationController',
                        controllerAs: 'navigationCtrl'
                    },
                    "content": {
                        templateUrl: 'admin/users/users.html',
                        controller: 'AdminUserController',
                        controllerAs: 'adminUserCtrl'
                    }
                }
            });
        }
    ]);


    /*
        Admin User Management Module Setup
    */
    angular.module('dashboard.cloudservices', [
        'ui.router'
    ]).config([
        '$stateProvider',
        function($stateProvider) {
            $stateProvider.state('cloudservices', {
                url: "/cloudservices",
                authenticate: true,
                adminOnly: false,
                views: {
                    "navigation": {
                        templateUrl: 'navigation/navigation.html',
                        controller: 'NavigationController',
                        controllerAs: 'navigationCtrl'
                    },
                    "content": {
                        templateUrl: 'cloud-services/cloud-services.html',
                        controller: 'CloudServiceController',
                        controllerAs: 'cloudServiceCtrl'
                    }
                }
            });
        }
    ]);

    /*
        Navigation Module Setup
    */
    angular.module('dashboard.navigation', []);

    /*
        Service Module Setup
    */
    angular.module('dashboard.services', []);

    /*
        Util Module Setup
    */
    angular.module('dashboard.utils', []);

    /*
        Charts Module Setup
    */
    angular.module('dashboard.charts', ['chart.js']);
})();
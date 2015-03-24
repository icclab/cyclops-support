describe('controller', function() {
    var controller;
    var $scope;
    var $log;
    var restServiceMock;

    /*
        Fake Data
     */


    /*
        Test setup
     */
    beforeEach(function() {

        /*
            Load module
         */
        module('dashboard.admin.rate');

        /*
            Mocks
         */
        restServiceMock = jasmine.createSpyObj(
            'restService',
            ['']
        );

        /*
            Inject dependencies and configure mocks
         */
        inject(function($controller, $q, $rootScope, _$log_) {
            $scope = $rootScope.$new();
            $log = _$log_;

            controller = $controller('AdminRateController', {
                '$scope': $scope,
                'restService': restServiceMock
            });
        });
    });

    /*
        Tests
     */
    describe('method', function() {
        it('should do', function() {

        });
    });
});

(function(){
    /*
        Module Setup
    */
    angular.module('dashboard.login')
        .controller('LoginController', LoginController);

    /*
        Controllers, Factories, Services, Directives
    */
    LoginController.$inject = [
        '$location', 'sessionService', 'restService', 'alertService', 'responseParser'
    ];
    function LoginController(
            $location, sessionService, restService, alertService, responseParser) {
        var me = this;
        this.user = '';
        this.pwd = '';

        /**
         * This method redirects to the overview page.
         */
        this.showOverview = function(response) {
            $location.path("/overview");
        };

        /**
         * Private callback function. Will be called after the tokenInfo
         * request succeeds. The method will store the Keystone ID and the
         * admin status in the user session
         */
        var tokenInfoSuccess = function(response) {
            var responseData = response.data;
            var isAdmin = responseParser.getAdminStatusFromResponse(responseData);
            sessionService.setKeystoneId(responseData.keystoneid);
            sessionService.setAdmin(isAdmin);
            return restService.requestSessionToken(me.user, me.pwd);
        };

        /**
         * Private callback function. Will be called after the sessionInfo
         * request succeeds. The method will store the Session ID in the
         * user session
         */
        var sessionInfoSuccess = function(response) {
            sessionService.setSessionId(response.data.tokenId);
            me.showOverview();
        };

        /**
         * Private callback function. Will be called after the login request
         * succeeds. The method will store username and tokens in the session
         * and issue another request via the restService.
         */
        var loginSuccess = function(response) {
            var responseData = response.data;
            var accessToken = responseData.access_token;
            sessionService.setUsername(me.user);
            sessionService.setAccessToken(accessToken);
            sessionService.setIdToken(responseData.id_token);
            return restService.getTokenInfo(accessToken);
        };

        /**
         * Private callback function. Will be called if the login fails.
         */
        var loginFailed = function(response) {
            alertService.showError(
                "Username or password is invalid. Please try again"
            );
        };

        /**
         * This method delegates the login to the rest service. If the provided
         * credentials are valid, additional token info will be requested from
         * the REST service.
         *
         * @param  {String} username The dashboard username
         * @param  {String} password The dashboard password
         */

        this.login = function() {
            restService.sendLoginRequest(me.user, me.pwd)
                .then(loginSuccess)
                .then(tokenInfoSuccess)
                .then(sessionInfoSuccess, loginFailed);
        };
    };

})();

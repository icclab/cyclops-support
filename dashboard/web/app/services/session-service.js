(function() {
    /*
        Module Setup
    */
    angular.module('dashboard.services')
        .service('sessionService', SessionService);

    /*
        Controllers, Factories, Services, Directives
    */
    function SessionService() {
        var set = function(key, value) {
            sessionStorage[key] = value;
        };

        var get = function(key) {
            return sessionStorage[key];
        }

        this.clearSession = function() {
            sessionStorage.clear();
        };

        this.getSessionId = function() {
            return get('sessionId');
        };

        this.getAccessToken = function() {
            return get('accessToken');
        };

        this.getIdToken = function() {
            return get('idToken');
        };

        this.getUsername = function() {
            return get('username');
        };

        this.getTokenType = function() {
            return get('tokenType');
        };

        this.getExpiration = function() {
            return get('expires');
        };

        this.getKeystoneId = function() {
            return get('keystoneId');
        };

        this.setSessionId = function(id) {
            set('sessionId', id);
        };

        this.setAccessToken = function(token) {
            set('accessToken', token);
        };

        this.setIdToken = function(token) {
            set('idToken', token);
        };

        this.setUsername = function(name) {
            set('username', name);
        };

        this.setTokenType = function(type) {
            set('tokenType', type);
        };

        this.setExpiration = function(exp) {
            set('expires', exp);
        };

        this.setKeystoneId = function(id) {
            set('keystoneId', id);
        };

        this.setAdmin = function(isAdmin) {
            set('admin', isAdmin);
        };

        this.isAdmin = function() {
            return get('admin') == "true";
        };

        this.isAuthenticated = function() {
            var token = get('accessToken');
            return token && token.length > 0;
        };
    }

})();

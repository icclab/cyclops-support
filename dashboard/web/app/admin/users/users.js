(function(){
    /*
        Module Setup
    */
    angular.module('dashboard.admin.users')
        .controller('AdminUserController', AdminUserController);

    /*
        Controllers, Factories, Services, Directives
    */
    AdminUserController.$inject = [
        '$log', 'sessionService', 'restService', 'responseParser'
    ];
    function AdminUserController(
            $log, sessionService, restService, responseParser) {
        var me = this;
        this.users = [];
        this.admins = [];

        var onUsersLoadSuccess = function(response) {
            me.users = responseParser.getUserListFromResponse(response.data);
            var sessionId = sessionService.getSessionId();
            return restService.getAdminGroupInfo(sessionId);
        };

        var onAdminsLoadSuccess = function(response) {
            me.admins = responseParser.getAdminListFromResponse(response.data);
            filterUsersAndAdmins();
        };

        var onLoadError = function() {
            $log.debug('onLoadError');
        };

        var filterUsersAndAdmins = function() {
            var normalUsers = [];
            var userList = me.users;

            for(var i = 0; i < userList.length; i++) {
                var currentUser = userList[i];

                if(me.admins.indexOf(currentUser) == -1) {
                    normalUsers.push(currentUser);
                }
            }

            me.users = normalUsers;
        };

        this.getAllUsers = function() {
            restService.getAllUsers(sessionService.getSessionId())
                .then(onUsersLoadSuccess)
                .then(onAdminsLoadSuccess, onLoadError);
        };

        this.getAllUsers();
    }

})();

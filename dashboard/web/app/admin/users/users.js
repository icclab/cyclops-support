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
        '$log', 'sessionService', 'restService', 'alertService', 'responseParser'
    ];
    function AdminUserController(
            $log, sessionService, restService, alertService, responseParser) {
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

        var onUpdateAdminsSuccess = function(response) {
            me.admins = responseParser.getAdminListFromResponse(response.data);
            filterUsersAndAdmins();
            alertService.showSuccess('User group successfully updated');
        };

        var onUpdateAdminsError = function() {
            alertService.showError('Could not update admin status');
        };

        var onLoadError = function() {
            alertService.showError('Error loading user information');
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

        this.promoteUser = function(user) {
            var newAdmins = me.admins.slice(0);
            newAdmins.push(user);
            me.updateAdmins(newAdmins);
        };

        this.demoteUser = function(user) {
            var newAdmins = me.admins.slice(0);
            var adminIndex = newAdmins.indexOf(user);

            if(adminIndex > -1) {
                newAdmins.splice(adminIndex, 1);
            }

            me.updateAdmins(newAdmins);
        };

        this.getAllUsers = function() {
            restService.getAllUsers(sessionService.getSessionId())
                .then(onUsersLoadSuccess)
                .then(onAdminsLoadSuccess, onLoadError);
        };

        this.updateAdmins = function(admins) {
            var sessionId = sessionService.getSessionId();
            restService.updateAdmins(admins, sessionId)
                .then(onUpdateAdminsSuccess, onUpdateAdminsError);
        };

        this.getAllUsers();
    }

})();

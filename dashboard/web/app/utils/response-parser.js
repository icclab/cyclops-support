(function() {
    /*
        Module Setup
    */
    angular.module('dashboard.utils')
        .service('responseParser', ResponseParser);

    /*
        Controllers, Factories, Services, Directives
    */
    function ResponseParser() {
        this.getAdminListFromResponse = function(responseData) {
            var userStrings = responseData.uniqueMember || [];
            var userList = [];

            for(var i = 0; i < userStrings.length; i++) {
                var re = /uid=(.*?),/g;
                var matched = re.exec(userStrings[i]);

                if(matched && matched[1]) {
                    userList.push(matched[1]);
                }
            }

            return userList;
        };

        this.getUserListFromResponse = function(responseData) {
            return responseData.result || [];
        };

        this.getAdminStatusFromResponse = function(responseData) {
            var groups = responseData.isMemberOf || "";

            if(groups instanceof Array) {
                groups = groups.join();
            }

            return /cn=CyclopsAdmin/g.test(groups);
        };
    }

})();

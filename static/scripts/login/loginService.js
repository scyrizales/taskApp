angular.module("login").
    factory("LoginService", ["RestConnect", "$rootScope", "$location", "Notifications", function (RestConnect, $rootScope, $location, Notifications) {
        function _login (credential) {
            RestConnect.save({
                url: "/login",
                data: credential
            }).then(function (response) {
                if (response.status == "OK") {
                    $rootScope.credential = response.data;
                    Notifications.add("Login successful", "success");
                    $location.url("/tasks");
                }
            });
        };

        function _logout () {
            RestConnect.save({
                url: "/logout"
            }).then(function (response) {

            });
        };

        function _register (user) {
            RestConnect.save({
                url: "/users",
                data: user
            }).then(function (response) {
                if (response.status == "OK") {
                    Notifications.add("User created", "success");
                    $location.url("/login");
                }
            });
        };

        return {
            login: _login,
            logout: _logout,
            register: _register
        };
    }]);
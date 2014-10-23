angular.module("login").
    controller("LoginController", ["$scope", "LoginService", function ($scope, LoginService) {
        $scope.login = function (credential) {
            //if (credential.user && credential.pass)
            LoginService.login(credential);
        };
        LoginService.logout();
    }]).
    controller("RegisterController", ["$scope", "LoginService", function ($scope, LoginService) {
        $scope.register = function (user) {
            LoginService.register(user);
        };
    }]);
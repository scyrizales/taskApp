angular.module("login", ["ngRoute", "Utils"]).
    config(["$routeProvider", function ($routeProvider) {
        $routeProvider.
            when("/login", {
                templateUrl: "views/login/login.html",
                controller: "LoginController"
            }).
            when("/register", {
                templateUrl: "views/login/register.html",
                controller: "RegisterController"
            });
        }]);
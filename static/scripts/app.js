angular.module("tasksApp", ["login", "tasks", "ngRoute"]).
    config(["$routeProvider", function ($routeProvider) {
        $routeProvider.otherwise({
            redirectTo: "/register"
        });
    }]).
    controller('AppCtrl', ['$scope', '$location', function ($scope, $location) {
        $scope.menus = [
            {href:'register', text:'Register'},
            {href:'login', text:'Login'},
            {href:'tasks', text:'Tasks'}
        ];

        $scope.isActive = function(href){
            return $location.path() == ("/" + href);
        };

    }]);
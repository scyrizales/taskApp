angular.module("tasks", ["ngRoute", "Utils"]).
    config(["$routeProvider", function ($routeProvider) {
        $routeProvider.
            when("/tasks", {
                templateUrl: "views/task/tasks.html",
                controller: "TasksController"
            });
        }]);
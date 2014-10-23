angular.module("tasks").
    controller("TasksController", ["$scope", "TaskService", function ($scope, TaskService) {
        TaskService.get().then(function (response) {
            $scope.tasks = response;
        });

        $scope.priorities = TaskService.getPriorities();
        $scope.predicate = "priority";
        $scope.reverse = false;

        $scope.add = function () {
             TaskService.add($scope.newTask).then(function () {
                 $scope.newTask = {};
             });
        };

        $scope.remove = TaskService.remove;
        $scope.newTask = {};

        $scope.$watch("tasks", function (newValue, oldValue) {
            if (oldValue){
                if (newValue.length == oldValue.length) {
                    TaskService.update();
                }
            }
        }, true);
    }]);
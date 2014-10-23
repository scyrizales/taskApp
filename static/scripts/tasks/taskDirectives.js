angular.module("tasks").
    directive("priority", [function () {
        var _classes = ["btn-danger", "btn-warning", "btn-info", "btn-success"];
        return {
            link: function ($scope, $element) {
                var object = $scope.t || $scope.newTask;
                $element.on("change", function (event) {
                    $element.removeClass(_classes.join(" "));
                    $element.addClass(_classes[$element.val()]);
                });
                setTimeout(function() {
                    if (object.priority) {
                        $element.val(object.priority);
                        $element.trigger("change");
                    } else {
                        $element.removeClass(_classes.join(" "));
                    }
                }, 10);
                $scope.$watch("newTask.priority", function (newValue) {
                    if (!newValue) {
                        $element.removeClass(_classes.join(" "));
                        $element.addClass(_classes[$element.val()]);
                    }
                });
            }
        };
    }]);
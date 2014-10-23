angular.module("tasks").
    factory("TaskService", ["RestConnect", function (RestConnect) {
        var _tasks;
        var _priorities = ["Critical", "High", "Medium", "Low"];
        function _getPriorities () {
            return _priorities;
        };

        function _getTasks () {
            return RestConnect.get({
                url: "/tasks"
            }).then(function (result) {
                _tasks = result.data;
                return _tasks;
            });
        };

        function _addTask (newTask) {
            if (newTask.description && newTask.priority && newTask.dueDate) {
                var task = angular.copy(newTask);
                task.done = false;
                return RestConnect.save({
                    url: "/tasks",
                    data: task
                }).then(function (result) {
                    _tasks.push(result.data);
                });
            } else {
                return { then: angular.noop };
            }
        };

        function _updateTasks () {
            RestConnect.update({
                url: "/tasks",
                data: _tasks
            });
        };

        function _removeTask (index) {
            var task = _tasks[index];
            RestConnect.delete({
                url: "/tasks/" + task.id
            }).then(function (data) {
                if (data.status === "OK")
                    _tasks.splice(index, 1);
            });
        };

        return {
            get: _getTasks,
            add: _addTask,
            update: _updateTasks,
            remove: _removeTask,
            getPriorities: _getPriorities
        };
    }]);
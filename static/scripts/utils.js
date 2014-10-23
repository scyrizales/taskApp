angular.module("Utils", function () {}).
    constant("WAIT_TIMES", {
        notification: 2000,
        processUpdate: 2500
    }).
    factory("Notifications", ["$rootScope", "WAIT_TIMES", function ($rootScope, WAIT_TIMES) {
            var instance = {},
                timeoutId;
            var _notifications = [];
            var _notificationsMessages = [];
            instance.add = function (message, status) {
                var notif = {
                    message: message,
                    status: status || "warning"
                };
                if (_notificationsMessages.indexOf(message)<0) {
                    _notifications.push(notif);
                    _notificationsMessages.push(message);
                }
                if (timeoutId)
                    clearTimeout(timeoutId);
                timeoutId = setTimeout(function() {
                    _notifications = [];
                    _notificationsMessages = [];
                    $rootScope.$broadcast("CLEAR_NOTIFICATIONS");
                }, WAIT_TIMES.notification);
            }
            instance.list = function () {
                return _notifications;
            }

            return instance;
        }]).
    directive("notifications", ["Notifications", function (Notifications) {
        return {
            link: function ($scope, $element) {
                $scope.notifications = Notifications.list();
                $scope.$on("CLEAR_NOTIFICATIONS", function (argument) {
                    $scope.$apply(function () {
                        $scope.notifications = Notifications.list();
                    });
                });
            },
            templateUrl: '/views/templates/notifications.html',
            replace: true
        };
    }]).
    factory("RestConnect", ["$http", "$location", "Notifications", "$rootScope", "WAIT_TIMES", function ($http, $location, Notifications, $rootScope, WAIT_TIMES) {
        var instance = {},
            delayedConfig,
            timeoutId,
            responseFn = function (response) {
                if (response.data.status == "FAIL") {
                    Notifications.add(response.data.message);
                } else if (response.config.url != "/login"
                        && response.config.url != "/users"
                        && response.config.method != "GET") {
                    Notifications.add("Data saved", "info");
                }
                return response.data;
            },
            failFn = function (response) {
                switch (response.status) {
                    case 401:
                        Notifications.add("Unauthorized");
                        $location.url("/login");
                        break;
                    default:
                        Notifications.add("Error on " + response.config.method + " over " + response.config.url);
                        break;
                }

                return {data:{ status: "FAIL" }}
            },
            random4 = function () {
                return Math.floor((1 + Math.random()) * 0x10000)
                       .toString(16)
                       .substring(1);
            },
            buildUrl = function (url) {
                var response = url;
                if ($rootScope.credential) {
                    response = response + "?cache=" + random4();
                }
                return response;
            };

        instance.get = function (config) {
            return $http.get(buildUrl(config.url), config).then(responseFn, failFn);
        };

        instance.save = function (config) {
            return $http.post(buildUrl(config.url), config).then(responseFn, failFn);
        };

        instance.update = function (config) {
            delayedConfig = config;
            if (timeoutId)
                clearTimeout(timeoutId);
            timeoutId = setTimeout(function() {
                $http.put(buildUrl(config.url), config).then(responseFn, failFn);
            }, WAIT_TIMES.processUpdate);
        };

        instance.delete = function (config) {
            return $http.delete(buildUrl(config.url), config).then(responseFn, failFn);
        };

        return instance;
    }]).
    controller("editableController", function ($scope, $element, $attrs) {
        var label = $element.find("span"),
            input = $element.find("input"),
            edit = function (editMode) {
                if (editMode) {
                    label.css("display", "none");
                    input.css("display", "block");
                } else {
                    label.css("display", "block");
                    input.css("display", "none");
                }
            };
        /*$scope.editableModel = $scope.$eval($attrs.model);
        $scope.editableType = $scope.$eval($attrs.type);*/
        $scope.editMode = false;
        $element.on("click", function (event) {
            edit(true);
            input[0].focus();
        });
        input.on("keypress", function(e) {
            if (e.charCode === 13) {
                edit(false);
            }
        });
        input.on("blur", function (event) {
            edit(false);
        });
        edit(false);
    }).
    directive("editableText", function () {
        return {
            restrict: "E",
            controller: "editableController",
            templateUrl: '/views/templates/editableText.html',
            replace: true,
            scope: {
                editableModel: "=model"
            }
        };
    }).
    directive("editableDate", function () {
        return {
            restrict: "E",
            controller: "editableController",
            templateUrl: '/views/templates/editableDate.html',
            replace: true,
            scope: {
                editableModel: "=model"
            }
        };
    });
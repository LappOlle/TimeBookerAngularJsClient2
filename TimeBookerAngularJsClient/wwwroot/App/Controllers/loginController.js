'use strict';
app.controller('loginController', ['$scope','$rootScope', '$location', 'authService', function ($scope,$rootScope, $location, authService) {

    $scope.loginData = {
        userName: "",
        password: ""
    };

    $scope.message = "";

    $scope.login = function () {

        authService.login($scope.loginData).then(function (response) {
            $rootScope.loggedIn = true;
            $rootScope.userName = authService.authentication.userName;
            $location.path('/booking');

        },
            function (err) {
                $scope.message = err.error_description;
            });
    };

}]);
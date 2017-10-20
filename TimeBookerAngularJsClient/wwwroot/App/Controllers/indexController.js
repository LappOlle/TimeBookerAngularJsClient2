'use strict';
app.controller('indexController', ['$scope', '$location', 'authService','$rootScope', function ($scope, $location, authService,$rootScope) {

    $rootScope.loggedIn = authService.authentication.isAuth;
    $rootScope.userName = authService.authentication.userName;

    $scope.logOut = function () {
        authService.logOut();
        $rootScope.loggedIn = false;
    }

}]);
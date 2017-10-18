'use strict';
app.controller('homeController', ['$scope', 'authService', function ($scope, authService) {
    $scope.isLoggedIn = authService.authentication.isAuth;
}]);
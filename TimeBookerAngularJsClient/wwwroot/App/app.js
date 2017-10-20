var app = angular.module('AngularAuthApp', ['ngRoute', 'LocalStorageModule', 'angular-loading-bar','daypilot']);

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});

app.config(function ($routeProvider) {

    $routeProvider.when("/home", {
        controller: "homeController",
        templateUrl: "/App/Views/home.html"
    });

    $routeProvider.when("/login", {
        controller: "loginController",
        templateUrl: "/App/Views/login.html"
    });

    $routeProvider.when("/signup", {
        controller: "signupController",
        templateUrl: "/App/Views/signup.html"
    });

    $routeProvider.when("/booking", {
        controller: "bookingController",
        templateUrl: "/App/Views/booking.html"
    });

    $routeProvider.otherwise({ redirectTo: "/home" });
});

app.run(['authService', function (authService) {
    authService.fillAuthData();
}]);
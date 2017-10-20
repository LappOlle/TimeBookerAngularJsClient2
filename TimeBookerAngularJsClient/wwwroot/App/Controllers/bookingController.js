'use strict';
app.controller('bookingController', ['$scope', '$compile', 'bookingService', 'authService', function ($scope, $compile, bookingService, authService) {

    $scope.bookingData = {
        title: "",
        details: "",
        location: "",
        from: "",
        to: ""
    };

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    var currentView = "month";

    $scope.send = function () {

        authService.addBooking($scope.bookingData).then(function (response) {

            $location.path('/booking');

        },
            function (err) {
                $scope.message = err.error_description;
            });
    };

    //This will call onLoad and you can assign the values the way you want to the calendar
    //here DataRetriever.jsp will give me array of JSON data generated from the database data
    $scope.eventSource = [];
    bookingService.getBookings().then(function (results) {

        var dataArray = results.data;
        for (var i = 0; i < dataArray.length; i++) {
            $scope.events[i] = { id: dataArray[i].title, title: dataArray[i].userName, start: new Date(dataArray[i].from), end: new Date(dataArray[i].to), allDay: false };
        }
    });

}]);
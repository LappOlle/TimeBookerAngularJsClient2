'use strict';
app.factory('bookingService', ['$http', function ($http) {

    var serviceBase = 'http://localhost:57904/';
    var bookingServiceFactory = {};
    var _getBookings = function () {
        return $http.get(serviceBase + 'api/Booking').then(function (results) {
            return results;
        });
    };

    bookingServiceFactory.getBookings = _getBookings;

    return bookingServiceFactory;

}]);
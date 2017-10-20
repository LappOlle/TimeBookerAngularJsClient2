'use strict';
app.factory('bookingService', ['$http', function ($http) {

    var serviceBase = 'http://tangjaiapi.azurewebsites.net/';
    var bookingServiceFactory = {};
    var _getBookings = function () {
        return $http.get(serviceBase + 'api/Booking').then(function (results) {
            return results;
        });
    };

    bookingServiceFactory.getBookings = _getBookings;

    return bookingServiceFactory;

}]);
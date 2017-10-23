'use strict';
app.factory('bookingService', ['$http', '$q', function ($http, $q) {

    var serviceBase = 'http://tangjaiapi.azurewebsites.net/';
    var bookingServiceFactory = {};

    var _getBookings = function () {
        return $http.get(serviceBase + 'api/Booking').success(function (results) {
            return results;
        });
    };

    var _addBooking = function (bookingData) {
        var deferred = $q.defer();
        $http.post(serviceBase + 'api/Booking', JSON.stringify(bookingData), {headers: {'Content-Type': 'application/json' } }).success(function (response) {
            deferred.resolve(response);
        }).error(function (err) {
            deferred.reject(err);

        });
        return deferred.promise;
    };

    bookingServiceFactory.getBookings = _getBookings;
    bookingServiceFactory.addBooking = _addBooking;
    return bookingServiceFactory;

}]);
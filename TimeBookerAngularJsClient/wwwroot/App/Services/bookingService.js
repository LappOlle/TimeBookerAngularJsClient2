'use strict';
app.factory('bookingService', ['$http', '$q', function ($http, $q) {

    var serviceBase = 'http://tangjaiapi.azurewebsites.net/';
    var bookingServiceFactory = {};

    var _deleteBooking = function (bookingID) {
        var deferred = $q.defer();
        $http.delete(serviceBase + 'api/Booking?bookingID=' + bookingID, null, { headers: { 'Content-Type': 'application/json' } }).then(function (response) {
            deferred.resolve(response);
        }),(function (err) {
            deferred.reject(err);
        });
        return deferred.promise;
    };

    var _changeBooking = function (bookingData) {
        var deferred = $q.defer();
        $http.post(serviceBase + 'api/Booking', JSON.stringify(bookingData), { headers: { 'Content-Type': 'application/json' } }).then(function (response) {
            deferred.resolve(response);
        }),(function (err) {
            deferred.reject(err);

        });
        return deferred.promise;
    };

    var _getBookings = function () {
        var deferred = $q.defer();
        $http.get(serviceBase + 'api/Booking').then(function (results) {
            deferred.resolve(results);
        }),(function(results){
            deferred.reject(results);
        });
        return deferred.promise;
    };

    var _addBooking = function (bookingData) {
        var deferred = $q.defer();
        $http.post(serviceBase + 'api/Booking', JSON.stringify(bookingData), { headers: { 'Content-Type': 'application/json' } }).then(function (success) {
            deferred.resolve(success);
        }),(function (errorMess) {
            deferred.reject(errorMess);
        });
        return deferred.promise;
    };

    bookingServiceFactory.deleteBooking = _deleteBooking;
    bookingServiceFactory.changeBooking = _changeBooking;
    bookingServiceFactory.getBookings = _getBookings;
    bookingServiceFactory.addBooking = _addBooking;
    return bookingServiceFactory;

}]);
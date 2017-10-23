'use strict';
app.controller('bookingController', ['$scope', '$timeout', 'bookingService', 'authService', function ($scope, $timeout, bookingService, authService) {

    $scope.events = [
        {
            start: new DayPilot.Date("2017-10-23T10:00:00"),
            end: new DayPilot.Date("2017-10-23T10:30:00"),
            id: DayPilot.guid(),
            text: "First Event"
        }
    ];

    $scope.weekConfig = {
        viewType: "Week",
        weekStarts: 1,
        dayBeginsHour: 8,
        dayEndsHour: 17,
        timeFormat: 'Clock24Hours',
        timeHeaderCellDuration: 30,
        hourWidth: 60,
        headerDateFormat: "dd-MM-yyyy",
        roundedCorners: true,
        cellHeight: 40,
        theme: "calendar_green"
    };

    loadEvents();

    function loadEvents() {
        // using $timeout to make sure all changes are applied before reading visibleStart() and visibleEnd()
        $timeout(function () {
            var params = {
                start: $scope.dp.visibleStart().toString(),
                end: $scope.dp.visibleEnd().toString()
            };
            bookingService.getBookings().then(function (results) {
                var tempColor = "";
                var tempText = "";
                var dataArray = results.data;
                for(var i = 0; i < dataArray.length; i++) {
                    if (dataArray[i].id === null) {
                        tempColor = "#E53935";
                        tempText = "Reserved";
                    }
                    else {
                        tempColor = "#009688";
                        tempText = dataArray[i].userName;
                    }
                    $scope.events[i] = {
                        id: dataArray[i].id, text: tempText,
                        start: dataArray[i].from, end: dataArray[i].to,
                        resource: dataArray[i].details, backColor: tempColor
                    };
                }
            });
        });
    }

    $scope.send = function () {

        authService.addBooking($scope.bookingData).then(function (response) {

           //reload booking events.

        },
            function (err) {
                $scope.message = err.error_description;
            });
    };

    $scope.weekConfig.onTimeRangeSelected = function (args) {
        var modal = new DayPilot.Modal({
            top: 150,
            width: 300,
            opacity: 70,
            border: "10px solid #d0d0d0",
            onClosed: function (args) {
                if (args.result) {  // args.result is empty when modal is closed without submitting
                loadEvents();
                $scope.dp.clearSelection();
                 }
            }
        });

        modal.showUrl("App/Views/newBooking.html");
    };

    $scope.weekConfig.onEventClicked = function (args) {
        var modal = new DayPilot.Modal({
            top: 150,
            width: 300,
            opacity: 70,
            border: "10px solid #d0d0d0",
            onClosed: function (args) {
                if (args.result) {  // args.result is empty when modal is closed without submitting
                    loadEvents();
                }
            }
        });

        modal.showHtml("");
    };


}]);
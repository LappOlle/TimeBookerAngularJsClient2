'use strict';
app.controller('bookingController', ['$scope', '$timeout', 'bookingService', function ($scope, $timeout, bookingService) {
    //2 variables to toggle what button that should show up in the modal when want to change or add booking
    $scope.add = true;
    $scope.change = true;
    $scope.modalHeader = "";

    $scope.bookingData = {
        id: "",
        title: "",
        details: "",
        location: "",
        from: "",
        to: "",
        userName: ""
    };

    $scope.navigatorConfig = {
        selectMode: 'week',
        weekStarts: 1,
        showMonths: 1,
        showWeekNumbers: true,
        width: 1000,
        theme: "green_navigator_theme",
        onTimeRangeSelected: function (args) {
            $scope.weekConfig.startDate = args.day;
            $scope.events = [];
            loadEvents();
        }
    }

    $scope.events = [];
    loadEvents();

    $scope.weekConfig = {
        viewType: "Week",
        weekStarts: 1,
        dayBeginsHour: 8,
        dayEndsHour: 17,
        timeFormat: 'Clock24Hours',
        timeHeaderCellDuration: 30,
        hourWidth: 60,
        headerDateFormat: "dd-MM",
        roundedCorners: true,
        cellHeight: 40,
        theme: "calendar_green",
        eventResizeHandling: "disabled"
    };

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
                for (var i = 0; i < dataArray.length; i++) {
                    if (dataArray[i].id === null) {
                        tempColor = "#c22700";
                        tempText = "Reserved";
                    }
                    else {
                        tempColor = "#a2c200";
                        tempText = dataArray[i].userName;
                    }
                    $scope.events[i] = {
                        id: dataArray[i].id, text: tempText,
                        start: dataArray[i].from, end: dataArray[i].to,
                        resource: dataArray[i].title, tag: dataArray[i].details, dataItem: dataArray[i].location,
                        backColor: tempColor
                    };
                }
            }, function (error) {
                $scope.message = error.error_description;
            });
        });
    }

    $scope.addBooking = function () {
        loadEvents();
        $timeout(function () {
            if (CanAddBooking($scope.bookingData.from, $scope.bookingData.to)) {
                bookingService.addBooking($scope.bookingData).then(function (response) {
                    $('#bookingModal').modal('hide');
                }), (function (err) {
                    $scope.message = err.error_description;
                });
            }
            else {
                $scope.message = "That intervall is already taken!";
            }
        },1000);
    };

    $scope.changeBooking = function () {
        loadEvents();
        $timeout(function () {
            if (CanAddBooking($scope.bookingData.from, $scope.bookingData.to)) {
                bookingService.changeBooking($scope.bookingData).then(function (response) {
                    $('#bookingModal').modal('hide');
                }), (function (err) {
                    $scope.message = err.error_description;
                });
            }
            else {
                $scope.message = "That intervall is already taken!";
            }
        },1000);
    };

    $scope.deleteBooking = function () {
        var confirmMessage = confirm("Press Ok if you really want to delete it.");
        if (confirmMessage === true) {
            bookingService.deleteBooking($scope.bookingData.id).then(function (response) {
                $('#bookingModal').modal('hide');
            }), (function (err) {
                $scope.message = err.error_description;
            });
        }
    };

    $scope.weekConfig.onTimeRangeSelected = function (args) {
        $scope.modalHeader = "Add Booking";
        $scope.add = true;
        $scope.change = false;
        $scope.bookingData.from = args.start;
        $scope.bookingData.to = args.end;

        //I had to put this delay for give the script time to load the start and end datetime.
        $timeout(function () {
            $('#bookingModal').modal('toggle');
        });
    };

    $scope.weekConfig.onEventMove = function (args) {
        if (args.e.id() === "" || args.e.id() === null) {
            alert("You are not allowed to change others booking.");
            args.preventDefault();
        }
        else if (CanAddBooking(args.newStart, args.newEnd)) {
            args.preventDefault();
            var events = $scope.events.filter(function (x) { return x.id === args.e.id(); });
            $scope.bookingData.id = events[0].id;
            $scope.bookingData.title = events[0].resource;
            $scope.bookingData.details = events[0].tag;
            $scope.bookingData.location = events[0].dataItem;
            $scope.bookingData.from = args.newStart;
            $scope.bookingData.to = args.newEnd;
            $scope.bookingData.userName = events[0].text;
            $timeout(function () {
                $scope.modalHeader = "Change Booking";
                $scope.add = false;
                $scope.change = true;
                $('#bookingModal').modal('toggle');
            });
        }
        else {
            alert("There is already an booking in that intervall. Pick an other intervall.");
            args.preventDefault();
        }
    };

    $scope.weekConfig.onEventClicked = function (args) {
        var events = $scope.events.filter(function (x) { return x.id === args.e.id(); });
        $timeout(function () {
            $scope.bookingData.id = events[0].id;
            $scope.bookingData.title = events[0].resource;
            $scope.bookingData.details = events[0].tag;
            $scope.bookingData.location = events[0].dataItem;
            $scope.bookingData.from = events[0].start;
            $scope.bookingData.to = events[0].end;
            $scope.bookingData.userName = events[0].text;

            if ($scope.bookingData.id === "" || $scope.bookingData.id === null) {
                alert("You are not allowed to change others booking.");
                ClearBookingData();
            }
            else {
                $scope.modalHeader = "Change Booking";
                $scope.add = false;
                $scope.change = true;
                $('#bookingModal').modal('toggle');
            }
        });
    };

    function CanAddBooking(newStartDate, newEndDate) {
        for (var i = 0; i < $scope.events.length; i++) {
            if ($scope.events[i].start <= newStartDate && $scope.events[i].end >= newEndDate) {
                return false;
            }
            else if (newStartDate <= $scope.events[i].start && newEndDate >= $scope.events[i].end) {
                return false;
            }
        }
        return true;
    }

    $('#bookingModal').on('hidden.bs.modal', function (e) {
        $scope.message = "";
        $scope.dp.clearSelection();
        ClearBookingData();
        $scope.events = [];
        loadEvents();
    });

    function ClearBookingData() {
        $scope.bookingData.id = "";
        $scope.bookingData.title = "";
        $scope.bookingData.details = "";
        $scope.bookingData.location = "";
        $scope.bookingData.from = "";
        $scope.bookingData.to = "";
        $scope.bookingData.userName = "";
    }
}]);
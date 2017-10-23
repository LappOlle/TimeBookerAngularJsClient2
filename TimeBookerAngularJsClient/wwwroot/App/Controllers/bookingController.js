'use strict';
app.controller('bookingController', ['$scope', '$timeout', 'bookingService', function ($scope, $timeout, bookingService) {

    $scope.bookingData = {
        id:"",
        title:"",
        details:"",
        location:"",
        from:"",
        to:""
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
        headerDateFormat: "dd-MM-yyyy",
        roundedCorners: true,
        cellHeight: 40,
        theme: "calendar_green"
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
                for(var i = 0; i < dataArray.length; i++) {
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
                        resource: dataArray[i].details, backColor: tempColor
                    };
                }
            });
        });
    }

    $scope.send = function () {

        bookingService.addBooking($scope.bookingData).then(function (response) {
            $('#bookingModal').modal('hide');
        },
            function (err) {
                $scope.message = err.error_description;
            });
    };

    $scope.weekConfig.onTimeRangeSelected = function (args) {
        $scope.bookingData.from = args.start;
        $scope.bookingData.to = args.end;

        //I had to put this delay for give the script time to load the start and end datetime.
        $timeout(function (){
        $('#bookingModal').modal('toggle');
        });
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

    $('#bookingModal').on('hidden.bs.modal', function(){
        loadEvents();
        ClearBookingData();
        $scope.dp.clearSelection();
    });

    function ClearBookingData(){
        $scope.bookingData.id = "";
        $scope.bookingData.title= "";
        $scope.bookingData.details = "";
        $scope.bookingData.location = "";
        $scope.bookingData.from = "";
        $scope.bookingData.to = "";
    }

}]);
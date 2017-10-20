﻿'use strict';
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

    /* event source that contains custom events on the scope */
    $scope.events = [];
    /* event source that calls a function on every view switch */
    $scope.eventsF = function (start, end, timezone, callback) {
        var s = new Date(start).getTime() / 1000;
        var e = new Date(end).getTime() / 1000;
        var m = new Date(start).getMonth();
        var events = [{ title: 'Feed Me ' + m, start: s + (50000), end: s + (100000), allDay: false, className: ['customFeed'] }];
        callback(events);
    };

    //$scope.calEventsExt = {
    //    color: '#f00',
    //    textColor: 'yellow',
    //    events: [
    //        { type: 'party', title: 'Lunch', start: new Date(y, m, d, 12, 0), end: new Date(y, m, d, 14, 0), allDay: false },
    //        { type: 'party', title: 'Lunch 2', start: new Date(y, m, d, 12, 0), end: new Date(y, m, d, 14, 0), allDay: false },
    //        { type: 'party', title: 'Click for Google', start: new Date(y, m, 28), end: new Date(y, m, 29), url: 'http://google.com/' }
    //    ]
    //};
    /* alert on eventClick */
    $scope.alertOnEventClick = function (date, jsEvent, view) {
        $scope.alertMessage = (date.title + ' was clicked ');
    };
    /* alert on Drop */
    $scope.alertOnDrop = function (event, delta, revertFunc, jsEvent, ui, view) {
        $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
    };
    /* alert on Resize */
    $scope.alertOnResize = function (event, delta, revertFunc, jsEvent, ui, view) {
        $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };
    /* add and removes an event source of choice */
    $scope.addRemoveEventSource = function (sources, source) {
        var canAdd = 0;
        angular.forEach(sources, function (value, key) {
            if (sources[key] === source) {
                sources.splice(key, 1);
                canAdd = 1;
            }
        });
        if (canAdd === 0) {
            sources.push(source);
        }
    };

    /* remove event */
    $scope.remove = function (index) {
        $scope.events.splice(index, 1);
    };
    /* Change View */
    $scope.changeView = function (view, calendar) {
        uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);
    };
    /* Change View */
    $scope.renderCalender = function (calendar) {
        if (uiCalendarConfig.calendars[calendar]) {
            uiCalendarConfig.calendars[calendar].fullCalendar('render');
        }
    };
    /* Render Tooltip */
    $scope.eventRender = function (event, element, view) {
        element.attr({
            'tooltip': event.title,
            'tooltip-append-to-body': true
        });
        $compile(element)($scope);
    };


    $scope.uiConfig = {
        calendar: {
            prev: 'glyphicon-chevron-left',
            next: 'glyphicon-chevron-right',
            snapMinutes: 30,
            weekNumbers: true,
            firstDay: 1,
            height: 800,
            editable: true,
            defaultView: 'agendaWeek',
            allDaySlot: false,
            minTime: "08:00:00",
            maxTime: "17:00:00",
            slotDuration: "00:30:00",
            header: {
                left: 'month,basicWeek,basicDay',
                center: 'title',
                right: 'today prev,next'
            },
            eventClick: $scope.alertOnEventClick,
            eventDrop: $scope.alertOnDrop,
            eventResize: $scope.alertOnResize,
            eventRender: $scope.eventRender
        }
    };

    $scope.changeLang = function () {
        if ($scope.changeTo === 'Hungarian') {
            $scope.uiConfig.calendar.dayNames = ["Vasárnap", "Hétfő", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"];
            $scope.uiConfig.calendar.dayNamesShort = ["Vas", "Hét", "Kedd", "Sze", "Csüt", "Pén", "Szo"];
            $scope.changeTo = 'English';
        } else {
            $scope.uiConfig.calendar.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            $scope.uiConfig.calendar.dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            $scope.changeTo = 'Hungarian';
        }
    };
    /* event sources array*/
    $scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
    $scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];

}]);
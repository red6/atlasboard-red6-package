var ical = require('ical'),
    _ = require('underscore'),
    moment = require('moment');

var colors = ['#22313F', '#1E824C', '#6C7A89', '#D35400', '#26A65B', '#1F3A93', '#34495E', '#4B77BE', '#67809F', '#674172', '#96281B'];

var hashCode = function (str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
};

var stringToColour = function(str) {
    var hash = hashCode(str);
    var index = Math.abs(hash) % colors.length;
    return colors[index];
};

var isAllDay = function (calendarEvent) {
    return calendarEvent.startTime === calendarEvent.endTime
        && calendarEvent.startTime === '00:00'
};

module.exports = function (config, dependencies, job_callback) {
    var logger = dependencies.logger;

    var days = [];
    var today = moment();
    for (var i = 1; i < 6; i++) {
        var weekDay = moment().day(i).hours(0).minutes(0).seconds(0).milliseconds(0);

        var day = {
            name: weekDay.lang(config.lang).format('dddd'),
            date: weekDay.lang(config.lang).format('L'),
            dateMoment: weekDay,
            events: [],
            allDayEvents: [],
            recurringEvents: [],
            isToday: today.isSame(weekDay, 'day')
        };
        days.push(day);
    }

    ical.fromURL(config.calendarUrl, {}, function(err, data) {
        if (err){
            logger.error(err);
            job_callback("Error loading team calendar from url " + config.calendarUrl + ".");
            return;
        }

        var firstDayOfTheWeekMoment = days[0].dateMoment;
        var firstDayOfTheWeek = firstDayOfTheWeekMoment.toDate();

        var lastDayOfTheWeekMoment = days[days.length - 1].dateMoment;
        var lastDayOfTheWeek = lastDayOfTheWeekMoment.toDate();

        var firstDayNextWeekMoment = lastDayOfTheWeekMoment.clone().add(1, 'day');

        var eventsOfTheWeek = _.filter(data, function(event) {
            return event.end >= firstDayOfTheWeek && event.start <= lastDayOfTheWeek;
        });

        _.each(eventsOfTheWeek, function(event) {
            _.each(days, function (day) {
                var dayOfWeek = day.dateMoment.toDate().getDay();
                if (event.start.getDay() <= dayOfWeek
                    && dayOfWeek <= event.end.getDay()) {

                    var calendarEvent = {
                        startTime: moment(event.start).format('HH:mm'),
                        endTime: moment(event.end).format('HH:mm'),
                        summary: event.summary,
                        color: stringToColour(event.summary)
                    };

                    if (isAllDay(calendarEvent)) {
                        if (!moment(event.end).isSame(day.dateMoment, 'day')) {
                            day.allDayEvents.push(calendarEvent);
                        }
                    } else {
                        day.events.push(calendarEvent);
                    }
                }
            });
        });

        _.each(_.filter(data, function (event) { return event.rrule; }), function(event) {
            var rrule = event.rrule;

            // INFO: There's a bug in ical.js that the start date is not honored.
            //       Until that's fixed we have to set the start manually.
            //       See https://github.com/peterbraden/ical.js/issues/45
            rrule.options.dtstart = event.start;

            var rruleEventsThisWeek = rrule.between(firstDayOfTheWeekMoment.toDate(), firstDayNextWeekMoment.toDate());

            _.each(rruleEventsThisWeek, function (rruleEventThisWeek) {
                _.each(days, function (day){
                        var rruleEventDate = moment(rruleEventThisWeek);
                        if (rruleEventDate.isSame(day.dateMoment, 'day')) {
                            var calendarEvent = {
                                startTime: moment(event.start).format('HH:mm'),
                                endTime: moment(event.end).format('HH:mm'),
                                summary: event.summary,
                                color: stringToColour(event.summary)
                            };

                            if (isAllDay(calendarEvent)) {
                                if (!moment(event.end).isSame(day.dateMoment, 'day')) {
                                    day.allDayEvents.push(calendarEvent);
                                }
                            } else {
                                day.events.push(calendarEvent);
                            }
                        }
                    }
                )
            });
        });

        // Sort events by start time
        _.each(days, function (day) {
           day.events = _.sortBy(day.events, function (event) {
              var startMoment = moment(event.startTime, 'HH:mm');
              return startMoment.hours() * 1000 + startMoment.minutes();
           });
        });

        var data = {
            title: config.widgetTitle,
            lang: config.lang,
            differenceUTC: config.differenceUTC,
            days: days
        };
        job_callback(null, data);
    });

};

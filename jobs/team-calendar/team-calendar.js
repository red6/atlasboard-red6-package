var ical = require('ical'),
    _ = require('underscore'),
    RRule = require('rrule').RRule,
    moment = require('moment');

module.exports = function (config, dependencies, job_callback) {
    var logger = dependencies.logger;

    var days = [];
    for (i = 1; i < 6; i++) {
        var weekDay = moment().day(i).hours(0).minutes(0).seconds(0).milliseconds(0);

        var day = {
            name: weekDay.lang(config.lang).format('dddd'),
            date: weekDay.lang(config.lang).format('L'),
            dateMoment: weekDay,
            events: [],
            allDayEvents: [],
            recurringEvents: []
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

        var firstDayNextWeekMoment = moment(lastDayOfTheWeekMoment).add(1, 'day');
        var firstDayNextWeek = firstDayNextWeekMoment.toDate();

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
                        summary: event.summary
                    };


                    if (calendarEvent.startTime === calendarEvent.endTime
                        && calendarEvent.startTime === '00:00') {
                        if (moment(event.end).format('L') !== day.date) {
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

            var firstDayNextWeekMoment = moment(lastDayOfTheWeekMoment).add(1, 'day');

            var rruleEventsThisWeek = rrule.between(firstDayOfTheWeekMoment.toDate(), firstDayNextWeekMoment.toDate());

            _.each(rruleEventsThisWeek, function (rruleEventThisWeek) {
                _.each(days, function (day){
                        var rruleEventDate = moment(rruleEventThisWeek).lang(config.lang).format('L');
                        if (rruleEventDate == day.date) {
                            day.events.push({
                                startTime: moment(event.start).format('HH:mm'),
                                endTime: moment(event.end).format('HH:mm'),
                                summary: event.summary
                            });
                        }
                    }
                )
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

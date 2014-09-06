var ical = require('ical'),
    _ = require('underscore'),
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
            events: []
        };
        days.push(day);
    }

    ical.fromURL(config.calendarUrl, {}, function(err, data) {
        if (err){
            logger.error(err);
            job_callback("Error loading team calendar from url " + config.calendarUrl + ".");
            return;
        }

        var firstDayOfTheWeek = days[0].dateMoment.toDate();
        var lastDayOfTheWeek = days[4].dateMoment.toDate();

        var eventsOfTheWeek = _.filter(data, function(event) {
            return event.end >= firstDayOfTheWeek && event.start <= lastDayOfTheWeek;
        });

        _.each(eventsOfTheWeek, function(event) {
            _.each(days, function (day) {
                var dayOfWeek = day.dateMoment.toDate().getDay();
                if (event.start.getDay() <= dayOfWeek && dayOfWeek <= event.end.getDay()) {
                    day.events.push({
                        startTime: moment(event.start).format('HH:mm'),
                        endTime: moment(event.end).format('HH:mm'),
                        summary: event.summary
                    });
                }
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

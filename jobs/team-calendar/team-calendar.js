var ical = require('ical'),
    _ = require('underscore'),
    moment = require('moment');

module.exports = function (config, dependencies, job_callback) {
    var logger = dependencies.logger;

    ical.fromURL(config.calendarUrl, {}, function(err, data) {
        if (err){
            logger.error(err);
            job_callback("Error loading team calendar from url " + config.calendarUrl + ".");
            return;
        }

        _.each(data, function(event) {
            logger.error(JSON.stringify(event));
            logger.error("START: " + moment(event.start).format());
            logger.error("END: " + moment(event.end).format());
        });

//        var events = _.sortBy(data, function(event) { return event.start; });
//        events = _.filter(events, function(event) { return event.end >= new Date(); });


        logger.error("&&&&&&&&&&&&%%%%%%%%%%");
    });

    var days = [];
    for (i = 1; i < 6; i++) {
        var weekDay = moment().day(i);

        var day = {
            name: weekDay.lang(config.lang).format('dddd'),
            date: weekDay.lang(config.lang).format('L')
        };
        days.push(day);
    }

    var data = {
        title: config.widgetTitle,
        lang: config.lang,
        differenceUTC: config.differenceUTC,
        days: days
    };
    job_callback(null, data);
};

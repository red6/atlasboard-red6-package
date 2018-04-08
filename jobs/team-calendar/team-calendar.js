/*
 * Copyright 2002-2017 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const ical = require('ical'),
  _ = require('underscore'),
  moment = require('moment');

const colors = ['#22313F', '#1E824C', '#6C7A89', '#D35400', '#26A65B', '#1F3A93', '#34495E', '#4B77BE', '#67809F', '#674172', '#96281B'];

const hashCode = function (str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
};

const stringToColour = function (str) {
  let hash = hashCode(str);
  let index = Math.abs(hash) % colors.length;
  return colors[index];
};

const isAllDay = function (calendarEvent) {
  return calendarEvent.startTime === calendarEvent.endTime
    && calendarEvent.startTime === '00:00'
};

module.exports = function (config, dependencies, job_callback) {
  let logger = dependencies.logger;

  let days = [];
  let today = moment();
  for (let i = 1; i < 6; i++) {
    let weekDay = moment().day(i).hours(0).minutes(0).seconds(0).milliseconds(0);

    let day = {
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

  ical.fromURL(config.calendarUrl, {}, function (err, data) {
    if (err) {
      logger.error(err);
      job_callback("Error loading team calendar from url " + config.calendarUrl + ".");
      return;
    }

    let firstDayOfTheWeekMoment = days[0].dateMoment;
    let firstDayOfTheWeek = firstDayOfTheWeekMoment.toDate();

    let lastDayOfTheWeekMoment = days[days.length - 1].dateMoment;
    let lastDayOfTheWeek = lastDayOfTheWeekMoment.toDate();

    let firstDayNextWeekMoment = lastDayOfTheWeekMoment.clone().add(1, 'day');

    let eventsOfTheWeek = _.filter(data, function (event) {
      return event.end >= firstDayOfTheWeek && event.start <= lastDayOfTheWeek;
    });

    _.each(eventsOfTheWeek, function (event) {
      _.each(days, function (day) {
        let dayOfWeek = day.dateMoment.toDate().getDay();
        if (event.start.getDay() <= dayOfWeek
          && dayOfWeek <= event.end.getDay()) {

          let calendarEvent = {
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

    _.each(_.filter(data, function (event) {
      return event.rrule;
    }), function (event) {
      let rrule = event.rrule;

      // INFO: There's a bug in ical.js that the start date is not honored.
      //       Until that's fixed we have to set the start manually.
      //       See https://github.com/peterbraden/ical.js/issues/45
      rrule.options.dtstart = event.start;

      var rruleEventsThisWeek = rrule.between(firstDayOfTheWeekMoment.toDate(), firstDayNextWeekMoment.toDate());

      _.each(rruleEventsThisWeek, function (rruleEventThisWeek) {
        _.each(days, function (day) {
            let rruleEventDate = moment(rruleEventThisWeek);
            if (rruleEventDate.isSame(day.dateMoment, 'day')) {
              let calendarEvent = {
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
        let startMoment = moment(event.startTime, 'HH:mm');
        return startMoment.hours() * 1000 + startMoment.minutes();
      });
    });

    let data = {
      title: config.widgetTitle,
      lang: config.lang,
      differenceUTC: config.differenceUTC,
      days: days
    };
    job_callback(null, data);
  });

};

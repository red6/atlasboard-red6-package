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

widget = {
  //runs when we receive data from the job
  onData: function (el, data) {
    if (!$.data(el, "datetime-initialized")) {

      var updateTime;
      try {
        // Check if moment is defined
        moment();

        updateTime = function () {
          var template = _.template($('.template', el).html());

          // UTC Time
          var time = moment().add(new Date().getTimezoneOffset(), 'minutes');

          // Add difference to UTC if set correctly
          if (data.differenceUTC && _.isNumber(data.differenceUTC)) {
            time = time.add(data.differenceUTC, 'hours');
          }

          var datetimeData = {
            time: time.lang(data.lang).format('HH:mm'),
            date: moment().lang(data.lang).format('L')
          };

          $('.content', el).html(template(datetimeData));
        };
      } catch (e) {
        console && console.log('ERROR: Moment.js not defined. Please add "moment-with-locales.min.js" as "customJS" to your board.');
        updateTime = function () {
          var template = _.template($('.template', el).html());

          var now = new Date();
          var datetimeData = {
            time: now.getHours() + ":" + now.getMinutes(),
            date: new Date().toLocaleDateString()
          };

          $('.content', el).html(template(datetimeData));
        };
      }

      setInterval(updateTime, (10 * 1000));
      updateTime();
      $.data(el, "datetime-initialized", true);
    }

  },
  onError: function (el, data) {
    var $error = $('<div class="container"><img src="images/warning.png"></div>');
    $error.append($('<div class="error_message content"></span>').text(data.error));
    $('.error', el).empty().append($error);
  }
};

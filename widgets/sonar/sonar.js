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
  onData: function (el, data) {

    function directionHtml(obj) {
      if (!obj.direction) {
        return '';
      }

      if (obj.direction === 'up') {
        return '<span class="direction-up">&#8593;</span>';
      } else {
        return '<span class="direction-down">&#8595;</span>';
      }
    };

    $('.projectName', el).html('<a href="' + data.dashboardUrl + '" target="_blank">' + data.projectName + '</a>');

    if (data.coverage) {
      $('#coverage-container').show();
      $('.coverage', el).html(data.coverage.value + '%' + directionHtml(data.coverage));
    } else {
      $('#coverage-container').hide();
    }

    if (data.coverage) {
      $('#linesOfCode-container').show();
      $('.linesOfCode', el).html(data.linesOfCode.value + directionHtml(data.linesOfCode));
    } else {
      $('#linesOfCode-container').hide();
    }

    if (data.technicalDebt) {
      $('#technicalDebt-container').show();
      $('.technicalDebt', el).html(data.technicalDebt.value + directionHtml(data.technicalDebt));
    } else {
      $('#technicalDebt-container').hide();
    }

    if (data.blockerCount && data.blockerCount.value > 0) {
      $('.blockerCount', el).html(data.blockerCount.value + directionHtml(data.blockerCount));
      $('.blocker-alert', el).show();
    } else {
      $('.blocker-alert', el).hide();
    }
  },
  onError: function (el, data) {
    var $error = $('<div class="container"><img src="images/warning.png"></div>');
    $error.append($('<div class="error_message content"></span>').text(data.error));
    $('.error', el).empty().append($error);
  }
};

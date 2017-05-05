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
    var html = '<h2>BUILDS</h2>';

    $.each(data.builds, function (index, build) {
      html += '<div class="build build-' + build.result + '">' + build.fullName + ' <span class="build-time">' + build.timeAgo + '</span>' + '</div>';
    });

    $('.content', el).html(html);
  },
  onError: function (el, data) {
    var $error = $('<div class="container"><img src="images/warning.png"></div>');
    $error.append($('<div class="error_message content"></span>').text(data.error));
    $('.error', el).empty().append($error);
  }
};

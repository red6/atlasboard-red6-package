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
    if (!$('#frame0').length > 0) {
      var html = '';
      $.each(data.boardUrls, function (index, boardUrl) {
        html += '<iframe src="' + boardUrl + '" name="frame" id="frame' + index + '" frameborder="0" style="display: none; overflow:hidden;overflow-x:hidden;overflow-y:hidden;height:100%;width:100%;position:absolute;top:0px;left:0px;right:0px;bottom:0px" height="100%" width="100%"></iframe>';
      });

      $('body').html(html);

      // Activate first board
      $.data(document.body, "cycle-board-active", 0);
      $('#frame0').fadeToggle();
    } else {
      var currentActiveBoardIndex = $.data(document.body, "cycle-board-active");
      $('#frame' + currentActiveBoardIndex).fadeToggle();

      var newActiveBoardIndex = currentActiveBoardIndex + 1;
      if (newActiveBoardIndex >= $('iframe').length) {
        newActiveBoardIndex = 0;
      }

      $.data(document.body, "cycle-board-active", newActiveBoardIndex);
      $('#frame' + newActiveBoardIndex).fadeToggle();
    }
  },
  onError: function (el, data) {
    var $error = $('<div class="container"><img src="images/warning.png"></div>');
    $error.append($('<div class="error_message content"></span>').text(data.error));
    $('.error', el).empty().append($error);
  }
};

widget = {
  onData: function (el, data) {
    $('.name', el).text(data.name);
    $('.dueDate', el).text(data.dueDate);
  },
  onError: function (el, data) {
    var $error = $('<div class="container"><img src="images/warning.png"></div>');
    $error.append($('<div class="error_message content"></span>').text(data.error));
    $('.error', el).empty().append($error);
  }
};

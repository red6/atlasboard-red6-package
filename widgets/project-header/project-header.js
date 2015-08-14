widget = {
  //runs when we receive data from the job
  onData: function (el, data) {
    var html = '';

    if (data.logo) {
      html += '<div class="logo"><img src="' + data.logo + '"/></div>';
    }
    html += '<div class="title">' + data.title + '</div>';

    $('.content', el).html(html);
  },
  onError: function (el, data) {
    var $error = $('<div class="container"><img src="images/warning.png"></div>');
    $error.append($('<div class="error_message content"></span>').text(data.error));
    $('.error', el).empty().append($error);
  }
};

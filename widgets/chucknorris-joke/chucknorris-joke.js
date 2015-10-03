widget = {
 	onData: function (el, data) {
    var template = _.template($('.template-chucknorris-joke', el).html());
    $('.chucknorris-joke', el).html(template(data));
  },
	onError: function (el, data) {
		var $error = $('<div class="container"><img src="images/warning.png"></div>');
		$error.append($('<div class="error_message content"></span>').text(data.error));
		$('.error', el).empty().append($error);
	}
};

widget = {
	//runs when we receive data from the job
	onData: function (el, data) {

		function refreshDate() {
			if (data.hour !== undefined && data !== undefined) {
				var d = new Date();
				var colonClass = 'time-colon time-colon-' + (d.getSeconds() % 2);
				var colon = '<span class="' + colonClass + '">:</span>';
				$('.content', el).html(
						'<div class="clock-time">' + data.hour + colon + data.minutes + '</div>'
								+ '<div class="clock-date"><br>'
								+ data.dateStr
								+ '</div>'
				);	
			}
		}

		refreshDate();
	},
	onError: function (el, data) {
		var $error = $('<div class="container"><img src="images/warning.png"></div>');
		$error.append($('<div class="error_message content"></span>').text(data.error));
		$('.error', el).empty().append($error);
	}
};
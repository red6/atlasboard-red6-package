widget = {
	//runs when we receive data from the job
	onData: function (el, data) {
		var html = '<h2>BUILDS</h2>';

			/**
	<div class="build build-successfull">
		HUM-23 <span class="build-time">2 minutes ago</span>
	</div>
	<div class="build build-successfull">
		HUM-23 <span class="build-time">2 minutes ago</span>
	</div>
	<div class="build build-failed">
		HUM-23 <span class="build-time">2 minutes ago</span>
	</div>
	*/
		
		$.each(data.builds, function (index, build) {
<<<<<<< HEAD
			html += '<div class="build build-' + build.result + '">' + build.fullName + ' <span class="build-time">' + build.timeAgo + '</span>' + '</div>';
=======
			html += '<div class="build build-successfull">' + data.name + '-' + build.number + ' <span class="build-time">2 minutes ago</span>' + '</div>';
>>>>>>> 2cbd108a6e7ea728699a46d30d74815b3a8a4221
		});

		$('.content', el).html(html);
	},
	onError: function (el, data) {
		var $error = $('<div class="container"><img src="images/warning.png"></div>');
		$error.append($('<div class="error_message content"></span>').text(data.error));
		$('.error', el).empty().append($error);
	}
};
widget = {
	onData: function (el, data) {

		function directionHmtl (obj){
	        return '<span class="direction-'+ obj.direction + '">&#187;</span>';
	    };

        $('.projectName', el).text(data.projectName);
        $('.coverage', el).html(data.coverage.value + '%' + directionHmtl(data.coverage));
        $('.linesOfCode', el).html(data.linesOfCode.value + directionHmtl(data.linesOfCode));
        $('.technicalDebt', el).html(data.technicalDebt.value + directionHmtl(data.technicalDebt));
    },
    onError: function (el, data) {
        var $error = $('<div class="container"><img src="images/warning.png"></div>');
        $error.append($('<div class="error_message content"></span>').text(data.error));
        $('.error', el).empty().append($error);
    }
};

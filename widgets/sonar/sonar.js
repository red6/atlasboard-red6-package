widget = {
	onData: function (el, data) {

		function directionHmtl (obj){
            if (obj.direction === 'up') {
                return '<span class="direction-up">&#8593;</span>';
            } else {                
                return '<span class="direction-down">&#8595;</span>';
            }
	    };

        $('.projectName', el).text(data.projectName);
        

        if (data.coverage) {
            $('#coverage-container').show();
            $('.coverage', el).html(data.coverage.value + '%' + directionHmtl(data.coverage));
        } else {
            $('#coverage-container').hide();
        }

        if (data.coverage) {
            $('#linesOfCode-container').show();
            $('.linesOfCode', el).html(data.linesOfCode.value + directionHmtl(data.linesOfCode));
        } else {
            $('#linesOfCode-container').hide();
        }

        if (data.technicalDebt) {
            $('#technicalDebt-container').show();
            $('.technicalDebt', el).html(data.technicalDebt.value + directionHmtl(data.technicalDebt));
        } else {
            $('#technicalDebt-container').hide();
        }

        if (data.blockerCount && data.blockerCount.value > 0) {
            $('.blockerCount', el).html(data.blockerCount.value + directionHmtl(data.blockerCount));
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

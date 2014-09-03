widget = {
    //runs when we receive data from the job
    onData: function (el, data) {
        $(".widget-container").css("height", "100%");
    },
    onError: function (el, data) {
        var $error = $('<div class="container"><img src="images/warning.png"></div>');
        $error.append($('<div class="error_message content"></span>').text(data.error));
        $('.error', el).empty().append($error);
    }
};

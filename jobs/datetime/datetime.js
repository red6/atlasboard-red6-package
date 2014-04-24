module.exports = function (config, dependencies, job_callback) {
	 var moment = dependencies.moment;

	var prefixZero = function (val) {
		return (val < 10 ? '0' : '') + val;
	};

	var actDate = new Date();

	var dateStr = prefixZero(actDate.getDate())
		+ '.' + prefixZero(actDate.getMonth())
		+ '.' + actDate.getFullYear();

	var dateStr = moment().format('L');
	if (config.lang) {
		dateStr = moment().lang(config.lang).format('L')
	}

	var dataObj = {
		hour: prefixZero(actDate.getHours()),
		minutes: prefixZero(actDate.getMinutes()),
		dateStr: dateStr
	};	

	job_callback(null, dataObj);
};

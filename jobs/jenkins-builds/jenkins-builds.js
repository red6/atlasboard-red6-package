module.exports = function (config, dependencies, job_callback) {
	var async = require('async');
    var logger = dependencies.logger;

	function getBuildInfos (build, callback) {
        callback(null, build);
    };

    var jenkinsJobUrl = config.serverUrl + '/job/' + config.job + '/api/json'

    var options = {
        url: jenkinsJobUrl,
        rejectUnauthorized: false,
        headers: {
        	"Content-Type": "application/json"
        }
    };

    dependencies.easyRequest.JSON(options, function (error, jobData) {
            if (error) {
            	var err_msg = error || "ERROR: Couldn't access the job at " + options.url;
            	logger.error(err_msg);
            	return job_callback(err_msg);
            }

            var lastBuilds = jobData.builds.slice(0, Math.min(3, jobData.builds.length));

            async.map(lastBuilds, getBuildInfos, function (err, lastBuildsInfos) {
	            var data = {
	            	name: jobData.displayName,
	            	builds: lastBuildsInfos
	            };

	            return job_callback(null, data);
			});

    });
};

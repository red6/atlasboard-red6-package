module.exports = function (config, dependencies, job_callback) {
	var async = require('async');
    var logger = dependencies.logger;
<<<<<<< HEAD
    var moment = dependencies.moment;

	function getBuildInfos (build, callback) {
        var options = {
            url: build.url + '/api/json',
            rejectUnauthorized: false,
            headers: {
                "Content-Type": "application/json"
            }
        };
        
        dependencies.easyRequest.JSON(options, function (error, rawBuildData) {
            var buildTime = moment(rawBuildData.timestamp);
            if (config.lang) {
                buildTime = buildTime.lang(config.lang)
            }

            var buildData = {
                fullName: rawBuildData.fullDisplayName,
                number: build.number,
                timeAgo: buildTime.fromNow(),
                result: rawBuildData.result.toLowerCase()
            };

            callback(null, buildData);
        });
=======

	function getBuildInfos (build, callback) {
        callback(null, build);
>>>>>>> 2cbd108a6e7ea728699a46d30d74815b3a8a4221
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
<<<<<<< HEAD
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
=======
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

>>>>>>> 2cbd108a6e7ea728699a46d30d74815b3a8a4221
    });
};

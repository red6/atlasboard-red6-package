
module.exports = function (config, dependencies, job_callback) {
        var metricsUrl = config.serverUrl + '/api/resources/?metrics=ncloc,coverage,sqale_index,tests,blocker_violations&resource=' + config.resource;
    var logger = dependencies.logger;
    var underscore = dependencies.underscore;
    var moment = dependencies.moment;

    var options = {
        url: metricsUrl,
        rejectUnauthorized: false,
            headers: {
              "Content-Type": "application/json"
            }
    };

    function formatWithThousandSeparator (obj){
        var separator = '.'; // ','
        return obj.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    };

    function getMetric (metricsData, key) {
        return underscore.first(underscore.where(metricsData.msr, {key: key}))
    };

    function directionToString(direction) {
        return direction && 'up' || 'down';
    };

    function getCoverage (metricsData) {
        var metric = getMetric(metricsData, "coverage");

        return {
                value: metric.val.toFixed(),
                direction: directionToString(metric.direction)
        };
    };

    function getTechnicalDebt (metricsData) {
        var metric = getMetric(metricsData, "sqale_index");

        return {
                value: moment.duration(metric.val, "days").humanize(),
                direction: directionToString(metric.direction)
        };
    };

    function getNumberFormattedMetric (metricsData, metricId) {
        var metric = getMetric(metricsData, metricId);

        return {
                value: formatWithThousandSeparator(metric.val),
                direction: directionToString(metric.direction)
        };
    };

    dependencies.easyRequest.JSON(options, function (error, metricsDataSets) {
            if (error) {
            var err_msg = error || "ERROR: Couldn't access the metrics at " + options.url;
            logger.error(err_msg);
            return job_callback(err_msg);
            }

            var metricsData = underscore.first(metricsDataSets);

            var data = { 
                projectName: metricsData.name,
                coverage: getCoverage(metricsData),
                blockerCount: getNumberFormattedMetric(metricsData, "blocker_violations"),
                linesOfCode: getNumberFormattedMetric(metricsData, "ncloc"),
                technicalDebt: getTechnicalDebt(metricsData)
            };

            job_callback(null, data);
    });

};

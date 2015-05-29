var _ = require('underscore'),
  moment = require('moment');

module.exports = function (config, dependencies, job_callback) {
  var logger = dependencies.logger;
  var credentials = config.credentials;

  var url = "http://localhost:18080/engine-rest/engine/default/incident?sortBy=incidentTimestamp&sortOrder=desc";

  var options = {
    url: url,
    rejectUnauthorized: false,
    headers: {
      "Content-Type": "application/json"
    }
  };

  if (config.globalAuth && config.globalAuth[credentials] && config.globalAuth[credentials].username && config.globalAuth[credentials].password) {
    var authorizationHash = new Buffer(config.globalAuth[credentials].username + ':' + config.globalAuth[credentials].password).toString('base64');
    options.headers.Authorization = 'Basic ' + authorizationHash;
  }

  dependencies.easyRequest.JSON(options, function (error, incidentsData) {
    if (error) {
      var err_msg = error || "ERROR: Couldn't access incidents at " + options.url;
      logger.error(err_msg);
      return job_callback(err_msg);
    }

    // Restrict to root causes where id = rootCauseIncidentId

    var data = {
      count: incidentsData.length
    };

    job_callback(null, data);
  });

  var data = {
  };

  job_callback(null, data);
};


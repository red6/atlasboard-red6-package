/*
 * Copyright 2002-2017 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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


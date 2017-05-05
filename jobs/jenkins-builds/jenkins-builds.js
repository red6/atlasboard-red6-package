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

module.exports = function (config, dependencies, job_callback) {
  var async = require('async');
  var logger = dependencies.logger;
  var moment = dependencies.moment;
  var _ = dependencies.underscore;

  function getBuildInfos(build, callback) {
    var options = {
      url: config.serverUrl + '/job/' + config.job + '/' + build.number + '/api/json',
      rejectUnauthorized: false,
      headers: {
        "Content-Type": "application/json"
      }
    };

    // Optional proxy configuration
    if (config.proxy) {
      options.proxy = config.proxy;
    }

    dependencies.easyRequest.JSON(options, function (error, rawBuildData) {
      var buildTime = moment(rawBuildData.timestamp);
      if (config.lang) {
        buildTime = buildTime.lang(config.lang)
      }

      var fullName = rawBuildData.fullDisplayName;
      if (config.removeRegex) {
        if (_.isArray(config.removeRegex)) {
          _.each(config.removeRegex, function (singleRemoveRegex) {
            fullName = fullName.replace(new RegExp(singleRemoveRegex), "");
          });

        } else {
          fullName = rawBuildData.fullDisplayName.replace(new RegExp(config.removeRegex), "");
        }
      }

      var buildData = {
        fullName: fullName,
        number: build.number,
        timeAgo: buildTime.fromNow()
      };

      if (rawBuildData.result) {
        buildData.result = rawBuildData.result.toLowerCase()
      }

      callback(null, buildData);
    });
  };

  var jenkinsJobUrl = config.serverUrl + '/job/' + config.job + '/api/json'

  var numberOfJobs = config.numberOfJobs || 3;

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

    var lastBuilds = jobData.builds.slice(0, Math.min(numberOfJobs, jobData.builds.length));

    async.map(lastBuilds, getBuildInfos, function (err, lastBuildsInfos) {
      var data = {
        name: jobData.displayName,
        builds: lastBuildsInfos
      };

      return job_callback(null, data);
    });
  });
};

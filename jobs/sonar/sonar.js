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
  let metricsUrl = `${config.serverUrl}/api/measures/component?metricKeys=ncloc,coverage,sqale_index,tests,blocker_violations,critical_violations&componentKey=${config.resource}`;
  let dashboardUrl = `${config.serverUrl}/dashboard?id=${config.resource}`
  let credentials = config.credentials;
  let logger = dependencies.logger;
  let _ = dependencies.underscore;
  let moment = dependencies.moment;

  function formatWithThousandSeparator(obj) {
    var separator = '.'; // ','
    return obj.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  };

  function getMetric(measures, key) {
    return _.first(_.where(measures, {metric: key}))
  };

  function directionToString(direction) {
    if (_.isNaN(direction)) {
      return direction && 'up' || 'down';
    } else {
      return undefined;
    }
  };

  function getCoverage(metricsData) {
    let metric = getMetric(metricsData, 'coverage');
    if (!metric) {
      return null;
    }

    return {
      value: metric.value,
      direction: directionToString(metric.direction)
    };
  };

  function getTechnicalDebt(metricsData) {
    let metric = getMetric(metricsData, 'sqale_index');
    if (!metric) {
      return null;
    }

    return {
      value: moment.duration(metric.value, 'minutes').humanize(),
      direction: directionToString(metric.direction)
    };
  };

  function getNumberFormattedMetric(metricsData, metricId) {
    let metric = getMetric(metricsData, metricId);

    return {
      value: formatWithThousandSeparator(metric.value),
      direction: directionToString(metric.direction)
    };
  };

  var options = {
    url: metricsUrl,
    rejectUnauthorized: false,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (config.globalAuth && config.globalAuth[credentials] && config.globalAuth[credentials].username && config.globalAuth[credentials].password) {
    let authorizationHash = new Buffer(config.globalAuth[credentials].username + ':' + config.globalAuth[credentials].password).toString('base64');
    options.headers.Authorization = `Basic ${authorizationHash}`;
  }

  dependencies.easyRequest.JSON(options, function (error, metricsData) {
    if (error) {
      let err_msg = error || `ERROR: Couldn't access the metrics at ${options.url}`;
      logger.error(err_msg);
      return job_callback(err_msg);
    }

    let measures = metricsData.component.measures;

    let data = {
      projectName: metricsData.component.name,
      dashboardUrl: dashboardUrl,
      coverage: getCoverage(measures),
      blockerCount: getNumberFormattedMetric(measures, 'blocker_violations'),
      linesOfCode: getNumberFormattedMetric(measures, 'ncloc'),
      technicalDebt: getTechnicalDebt(measures)
    };

    job_callback(null, data);
  });

};

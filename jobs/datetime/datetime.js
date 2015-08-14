module.exports = function (config, dependencies, job_callback) {

  var data = {
    lang: config.lang,
    differenceUTC: config.differenceUTC
  };

  job_callback(null, data);
};

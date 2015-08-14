module.exports = function (config, dependencies, job_callback) {
  job_callback(null, {'boardUrls': config.boardUrls});
};

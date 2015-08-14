module.exports = function (config, dependencies, job_callback) {
  var moment = dependencies.moment;

  var end = moment(config.dueDate);
  if (config.lang) {
    end = end.lang(config.lang)
  }
  var dueDateStr = end.from(moment());

  job_callback(null, {name: config.name, dueDate: dueDateStr});
};

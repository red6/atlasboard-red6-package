module.exports = function (config, dependencies, job_callback) {
    var data = {
        title: config.widgetTitle,
        logo: config.logo,
        lang: config.lang
    };
    job_callback(null, data);
};

'use strict'

module.exports = function (config, dependencies, job_callback) {
    
    var options = {
        url: 'http://api.icndb.com/jokes/random',
        rejectUnauthorized: false,
        headers: {
            "Content-Type": "application/json"
        }
    };
    
    if (config.globalAuth && config.globalAuth[config.credentials]) {
        var authorizationHash = new Buffer(config.globalAuth[config.credentials].username + 
            ':' + config.globalAuth[config.credentials].password).toString('base64');
        options.headers.Authorization = 'Basic ' + authorizationHash;
    }

    if (config.proxy) {
        options.proxy = config.proxy;
    }

    dependencies.easyRequest.JSON(options, function (err, data) {
        if (err) {
            return job_callback(err, null);
        }

        job_callback(null, { joke: data.value.joke });
    });

};


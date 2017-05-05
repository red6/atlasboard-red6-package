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


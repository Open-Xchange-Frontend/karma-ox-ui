var noop = function () {
};

var createCustomFileHandler = function(handlers, prefixes) {
    var options = {
        verbose: {local: false, remote: false, proxy: false},
        prefixes: prefixes
    };
    var appsLoad = function (request, response) {
        var f = require('appserver').middleware.appsload(options);
        return f(request, response, noop);
    };
    var localFiles = function (request, response) {
        var f = require('appserver').middleware.localfiles(options);
        return f(request, response, noop);
    };

    handlers.push({
        urlRegex: /^\/api\/apps\/load\/.*,/,
        handler: appsLoad
    });

    handlers.push({
        urlRegex: /(\/apps\/)/,
        handler: localFiles
    });

    handlers.push({
        urlRegex: /(\/static\/)/,
        handler: localFiles
    });
}

module.exports = createCustomFileHandler;

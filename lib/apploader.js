var noop = function () {
};

var createCustomFileHandler = function(handlers, prefixes) {
    var options = {
        verbose: {local: false, remote: false, proxy: false},
        prefixes: prefixes,
        urlPath: '/'
    };
    var uiMiddleware = function (request, response) {
        var f = require('appserver').middleware.ui(options);
        return f(request, response, noop);
    };

    handlers.push({
        urlRegex: /^\/api\/apps\/load\/.*,/,
        handler: uiMiddleware
    });

    handlers.push({
        urlRegex: /(\/apps\/)/,
        handler: uiMiddleware
    });

    handlers.push({
        urlRegex: /(\/static\/)/,
        handler: uiMiddleware
    });
}

module.exports = createCustomFileHandler;

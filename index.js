var createPattern = function(path) {
  return {pattern: path, included: true, served: true, watched: false};
};

var loadBase = function(files, coreDir, appserverConfig, handlers) {
    if (!coreDir) {
        console.warn('No coreDir provided. This will lead to problems when testing modules dependent on a core UI installation.');
    }
    var path = require('path'),
        builddir = path.resolve(coreDir),
        bootjs = createPattern(builddir + '/boot.js'),
        ts = new Date().getTime();
    bootjs.watched = true;
    files.unshift(createPattern(__dirname + '/lib/adapter.js'));
    files.unshift({pattern: builddir + '/apps/**/*.js', included: false, served: true, watched: true});
    files.unshift(createPattern(builddir + '/precore.js'));
    files.unshift(bootjs);
    files.unshift(createPattern(__dirname + '/lib/pre_boot.js'));

    if (!appserverConfig || !appserverConfig.prefixes) {
        throw 'Cannot read appserver config. Make sure to use the latest shared-grunt-config or configure karma task to provide an "appserver" option with "prefixes" array.';
    }

    appserverConfig.prefixes.push(coreDir);
    require('./lib/apploader')(handlers, appserverConfig.prefixes);
};

loadBase.$inject = ['config.files', 'config.coreDir', 'config.appserver', 'customFileHandlers'];

module.exports = {
  'framework:ox-ui': ['factory', loadBase]
};

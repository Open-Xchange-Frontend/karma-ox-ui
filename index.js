var createPattern = function(path) {
  return {pattern: path, included: true, served: true, watched: false};
};

var loadBase = function(files, coreDir, appserverConfig, handlers) {
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

    appserverConfig.prefixes.push(coreDir);
    require('./lib/apploader')(handlers, appserverConfig.prefixes);
};

loadBase.$inject = ['config.files', 'config.coreDir', 'config.appserver', 'customFileHandlers'];

module.exports = {
  'framework:ox-ui': ['factory', loadBase]
};

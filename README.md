# karma-ox-ui

Karma adaptor for OX App Suite UI plugin tests.

## Setup

Make sure, karma executable is installed:

```
npm install -g karma-cli
```

Install a few more testing libraries locally:

```
npm install --save-dev karma-mocha karma-chai karma-sinon karma-ox-ui karma-phantomjs-launcher
```

After that, in your plugin directory generate a new karma.conf.js:

```
jb@wiggum ~/code/appsuite/ox_pgp_mail (git)-[karma] % karma init

Which testing framework do you want to use ?
Press tab to list possible options. Enter to move to the next question.
> mocha                                                                                                                                                                                                                                     

Do you want to use Require.js ?
This will add Require.js plugin.
Press tab to list possible options. Enter to move to the next question.
> no                                                                                                                                                                                                                                        

Do you want to capture any browsers automatically ?
Press tab to list possible options. Enter empty string to move to the next question.
>                                                                                                                                                                                                                                           

What is the location of your source and test files ?
You can use glob patterns, eg. "js/*.js" or "test/**/*Spec.js".
Enter empty string to move to the next question.
>                                                                                                                                                                                                                                           

jb@wiggum ~/code/appsuite/ox_pgp_mail (git)-[ding] % karma init

Which testing framework do you want to use ?
Press tab to list possible options. Enter to move to the next question.
> mocha                                                                                                                                                                                                                                     

Do you want to use Require.js ?
This will add Require.js plugin.
Press tab to list possible options. Enter to move to the next question.
> no                                                                                                                                                                                                                                        

Do you want to capture any browsers automatically ?
Press tab to list possible options. Enter empty string to move to the next question.
> PhantomJS                                                                                                                                                                                                                                 
>                                                                                                                                                                                                                                           

What is the location of your source and test files ?
You can use glob patterns, eg. "js/*.js" or "test/**/*Spec.js".
Enter empty string to move to the next question.
>                                                                                                                                                                                                                                           

Should any of the files included by the previous patterns be excluded ?
You can use glob patterns, eg. "**/*.swp".
Enter empty string to move to the next question.
>                                                                                                                                                                                                                                           

Do you want Karma to watch all the files and run the tests on change ?
Press tab to list possible options.
> no                                                                                                                                                                                                                                        


Config file generated at "/home/jb/code/appsuite/ox_pgp_mail/karma.conf.js".
```

Edit the generated file and adjust the following configuration variables:

```
basePath: 'build/',
frameworks: ['ox-ui', 'sinon', 'mocha', 'chai'],
files: [
    'spec/test-main.js',
    {pattern: 'apps/**/*.js', included: false},
    {pattern: 'spec/**/*_spec.js', included: false}
]
```

Generate a main loader script to start the test after App Suite Core UI
has been booted. The file should be put in `spec/test-main.js`:

```
var allTestFiles = [];
var TEST_REGEXP = /_spec\.js$/i;

var pathToModule = function(path) {
  return path;
//   return path.replace(/^\/base\//, '').replace(/\.js$/, '');
};

Object.keys(window.__karma__.files).forEach(function(file) {
  if (TEST_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    allTestFiles.push(pathToModule(file));
  }
});

require(['io.ox/core/extPatterns/stage'], function (Stage) {

    'use strict';

        ox.testUtils.stubAppsuiteBody();

        new Stage('io.ox/core/stages', {
            id: 'run_tests',
            index: 99999,
            run: function (baton) {
                requirejs.config({
                    // Karma serves files from '/base/apps'
                    baseUrl: '/base/apps',

                    // ask Require.js to load these files (all our tests)
                    deps: allTestFiles,

                    // start test run, once Require.js is done
                    callback: window.__karma__.start
                });
            }
        });
});
```

## Running the tests

There are multiple targets provided in
[shared-grunt-config](https://github.com/Open-Xchange-Frontend/shared-grunt-config).
The recommended way is to run `grunt dev`. This will start a connect server, the karma
test server and a watcher for changes. You can trigger a testrun manually by running
`grunt testrun` in another terminal. This will be done automatically by the grunt watch
task, after any source file of your project has been changed.


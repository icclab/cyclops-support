// karma.conf.js
module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    files: [
      '../app/libs/jquery.min.js',
      '../app/libs/bootstrap.min.js',
      '../app/libs/metisMenu.min.js',
      '../app/libs/sb-admin-2.js',
      '../app/libs/angular.min.js',
      'libs/angular-mocks.js',
      '../app/*.js',
      '../app/**/*.js',
      '**/*-test.js',
      'mocks/mocks.js'
    ],

    // coverage reporter generates the coverage
    reporters: ['progress', 'coverage'],

    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      '../app/**/!(libs)/*.js': ['coverage']
    },

    // optionally, configure the reporter
    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    },


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });
};

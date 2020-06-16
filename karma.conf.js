/* eslint-env node */

// Dependencies
// =============================================================================
const pkg       = require('./package');
const saucelabs = require('./saucelabs.config');


// Variables
// =============================================================================
const files = {
    test: './tests/**/*.test.js'
};


// Settings
// =============================================================================
const settings = {
    files: [
        files.test
    ],
    preprocessors: {
        [files.test]: ['eslint', 'webpack', 'sourcemap']
    },
    frameworks: ['mocha', 'chai'],
    reporters : ['mocha', 'coverage-istanbul'],
    webpack: {
        mode  : 'development',
        module: {
            rules: [
                {
                    test   : /\.js$/,
                    exclude: [/node_modules/],
                    use    : [
                        {
                            loader : 'babel-loader',
                            options: {
                                // See .babelrc
                                plugins: [
                                    ['istanbul', { include: 'src/*' }]
                                ]
                            },
                        }
                    ]
                }
            ]
        }
    },
    webpackMiddleware: {
        // https://webpack.js.org/configuration/stats/
        stats: 'minimal'
    },
    // Code coverage
    // https://github.com/mattlewis92/karma-coverage-istanbul-reporter
    coverageIstanbulReporter: {
        reports                : ['lcovonly', 'text-summary'],
        combineBrowserReports  : true,
        fixWebpackSourcePaths  : true,
        skipFilesWithNoCoverage: true
    },
    mochaReporter: {
        // https://www.npmjs.com/package/karma-mocha-reporter
        output: 'autowatch'
    },
    autoWatch  : false,
    colors     : true,
    concurrency: Infinity,
    port       : 9876,
    singleRun  : true,

    // Prevent disconnect in Firefox/Safari
    // https://support.saucelabs.com/hc/en-us/articles/225104707-Karma-Tests-Disconnect-Particularly-When-Running-Tests-on-Safari
    browserDisconnectTimeout  : 1000*10, // default 2000
    browserDisconnectTolerance: 1,       // default 0
    browserNoActivityTimeout  : 1000*30, // default 10000
    captureTimeout            : 1000*60, // default 60000
    client: {
        mocha: {
            timeout: 1000*10 // default 2000
        }
    }
};


// Export
// =============================================================================
module.exports = function(config) {
    const isRemote = Boolean(process.argv.indexOf('--remote') > -1);

    // Remote test
    if (isRemote) {
        // Browsers
        // https://wiki.saucelabs.com/display/DOCS/Platform+Configurator#/
        settings.customLaunchers = {
            sl_chrome: {
                base       : 'SauceLabs',
                browserName: 'Chrome',
                platform   : 'Windows 10',
                version    : '26.0'
            },
            sl_edge: {
                base       : 'SauceLabs',
                browserName: 'MicrosoftEdge',
                platform   : 'Windows 10',
                version    : '13.10586'
            },
            sl_firefox: {
                base       : 'SauceLabs',
                browserName: 'Firefox',
                platform   : 'Windows 10',
                version    : '30'
            },
            // sl_ie_11: {
            //     base       : 'SauceLabs',
            //     browserName: 'internet explorer',
            //     platform   : 'Windows 7',
            //     version    : '11.0'
            // },
            sl_ie_10: {
                base       : 'SauceLabs',
                browserName: 'internet explorer',
                platform   : 'Windows 7',
                version    : '10.0'
            },
            sl_ie_9: {
                base       : 'SauceLabs',
                browserName: 'Internet Explorer',
                platform   : 'Windows 7',
                version    : '9.0'
            },
            sl_safari: {
                base       : 'SauceLabs',
                browserName: 'Safari',
                platform   : 'OS X 10.10',
                version    : '8.0'
            }
        };
        settings.browsers = Object.keys(settings.customLaunchers);

        // SauceLabs
        settings.reporters.push('saucelabs');
        settings.sauceLabs = {
            username         : saucelabs.username || process.env.SAUCE_USERNAME,
            accessKey        : saucelabs.accessKey || process.env.SAUCE_ACCESS_KEY,
            testName         : `${pkg.name} (karma)`,
            recordScreenshots: false,
            recordVideo      : false
        };

        // Travis CI
        if ('TRAVIS' in process.env) {
            // Use custom hostname to prevent Safari disconnects
            // https://support.saucelabs.com/hc/en-us/articles/115010079868-Issues-with-Safari-and-Karma-Test-Runner
            settings.hostname = 'travis.dev';
        }
    }
    // Local
    else {
        settings.browsers = ['ChromeHeadless'];
        settings.webpack.devtool = 'inline-source-map';
        settings.coverageIstanbulReporter.reports.push('html');

        // eslint-disable-next-line
        console.log([
            '============================================================\n',
            `KARMA: localhost:${settings.port}/debug.html\n`,
            '============================================================\n'
        ].join(''));
    }

    // Logging: LOG_DISABLE, LOG_ERROR, LOG_WARN, LOG_INFO, LOG_DEBUG
    settings.logLevel = config.LOG_INFO;
    config.set(settings);
};

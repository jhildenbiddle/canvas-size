import { create } from 'browser-sync';

const bsServer = create();
const docsConfig = {
  files: ['./dist/**/*.*', './docs/**/*.*'],
  port: 3000,
  ghostMode: {
    clicks: false,
    forms: false,
    scroll: false,
  },
  open: false,
  notify: false,
  cors: true,
  reloadDebounce: 1000,
  reloadOnRestart: true,
  server: {
    baseDir: ['./docs/'],
    routes: {
      '/CHANGELOG.md': './CHANGELOG.md',
      '/dist': './dist',
    },
  },
};
const playwrightConfig = {
  ...docsConfig,
  port: 4000,
  server: {
    ...docsConfig.server,
    middleware: [
      // Blank page required for test environment
      {
        route: '/_blank.html',
        handle(req, res, next) {
          res.setHeader('Content-Type', 'text/html');
          res.end('');
          next();
        },
      },
    ],
  },
  snippet: false,
  watch: false,
};
const args = process.argv.slice(2);
const config = args.includes('--playwright') ? playwrightConfig : docsConfig;
const configName = config === playwrightConfig ? 'playwright' : 'demo';

// eslint-disable-next-line no-console
console.log(`\nStarting ${configName} server on port ${config.port}\n`);

bsServer.init(config);

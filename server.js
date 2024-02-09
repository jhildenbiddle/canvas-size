import { create } from 'browser-sync';

const bsServer = create();
const demoConfig = {
  files: ['./demo/**/*.*', './dist/**/*.*'],
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
    baseDir: ['./demo/'],
    routes: {
      '/dist': './dist',
    },
  },
};
const playwrightConfig = {
  ...demoConfig,
  port: 4000,
  server: {
    ...demoConfig.server,
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
const config = args.includes('--playwright') ? playwrightConfig : demoConfig;
const configName = config === playwrightConfig ? 'playwright' : 'demo';

// eslint-disable-next-line no-console
console.log(`\nStarting ${configName} server on port ${config.port}\n`);

bsServer.init(config);

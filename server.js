import { create } from 'browser-sync';

const bsServer = create();

bsServer.init({
    files: [
        './demo/**/*.*',
        './dist/**/*.*'
    ],
    ghostMode: {
        clicks: false,
        forms: false,
        scroll: false
    },
    open: false,
    notify: false,
    cors: true,
    reloadDebounce: 1000,
    reloadOnRestart: true,
    server: {
        baseDir: ['./demo/'],
        routes: {
            '/dist': './dist'
        }
    },
    // serveStatic: ['./dist/'],
    // rewriteRules: [
    //     // Replace CDN URLs with local paths
    //     {
    //         match: /https?.*\/CHANGELOG.md/g,
    //         replace: '/CHANGELOG.md'
    //     }
    // ]
});

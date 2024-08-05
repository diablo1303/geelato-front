import {mergeConfig} from 'vite';
import topLevelAwait from 'vite-plugin-top-level-await';
import baseConfig from './vite.config.base';
import configCompressPlugin from './plugin/compress';
import configVisualizerPlugin from './plugin/visualizer';
// import configArcoResolverPlugin from './plugin/arcoResolver';
import configStyleImportPlugin from './plugin/styleImport';
import configImageminPlugin from './plugin/imagemin';

export default mergeConfig(
    {
        mode: 'production',
        plugins: [
            configCompressPlugin('gzip'),
            configVisualizerPlugin(),
            // configArcoResolverPlugin(),
            configStyleImportPlugin(),
            configImageminPlugin(),
            topLevelAwait({
                promiseExportName: '__tla',
                promiseImportName: i => `__tla_${i}`
            })
        ],
        build: {
            rollupOptions: {
                output: {
                    manualChunks: {
                        vue: ['vue', 'vue-router', 'pinia', '@vueuse/core', 'vue-i18n'],
                        arco: ['@arco-design/web-vue'],
                        chart: ['echarts', 'vue-echarts'],
                    },
                },
            },
            chunkSizeWarningLimit: 2000,
        },
    },
    baseConfig
);

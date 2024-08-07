import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import {resolve} from "path";
import viteCompression from "vite-plugin-compression";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), vueJsx(), viteCompression()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    build: {
        lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'gl-ui-arco-admin',
            // the proper extensions will be added
            fileName: 'gl-ui-arco-admin',
        },
        rollupOptions: {
            // 确保外部化处理那些你不想打包进库的依赖
            external: ['vue', 'pinia', '@arco-design/web-vue', 'lodash', 'b-validate','big.js','dayjs',
                'sortablejs', 'vue-i18n', 'vue-router','@ctrl/tinycolor',
                '@geelato/gl-ui','@geelato/gl-ui-arco','@geelato/gl-ui-schema','@geelato/gl-ui-schema-arco'],
            output: {
                // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
                globals: {
                    vue: 'Vue',
                },
            },
        },
    }
})

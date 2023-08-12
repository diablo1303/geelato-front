import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import viteCompression from 'vite-plugin-compression'
import {resolve} from "path";

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
            name: 'gl-ide-arco',
            // the proper extensions will be added
            fileName: 'gl-ide-arco',
        },
        rollupOptions: {
            // 确保外部化处理那些你不想打包进库的依赖
            external: ['@arco-design/web-vue', '@ckpack/vue-color', '@geelato/gl-ui', '@geelato/gl-ui-schema', '@geelato/gl-ui-schema-arco',
              '@geelato/gl-ide', '@vueuse/core', 'clipboard', 'dnd-core', 'pinia', 'react-dnd-html5-backend', 'screenfull', 'splitpanes', 'prettier','monaco-editor','vue', 'vue3-dnd'],
            output: {
                // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
                globals: {
                    // vue: 'Vue',
                },
            },
        },
    }
})

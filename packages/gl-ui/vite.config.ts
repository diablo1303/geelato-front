import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import viteCompression from 'vite-plugin-compression'
import {resolve} from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), vueJsx(), viteCompression()],
    resolve: {
        alias: {}
    },
    build: {
        lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'gl-ui',
            // the proper extensions will be added
            fileName: 'gl-ui',
        },
        rollupOptions: {
            // 确保外部化处理那些你不想打包进库的依赖
            external: ['vue', 'axios', '@geelato/gl-ui-schema', 'mitt', 'b-validate', 'dayjs', 'pinia','echarts'],
            output: {
                // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
                globals: {
                    vue: 'Vue',
                },
            },
        },
    },
})

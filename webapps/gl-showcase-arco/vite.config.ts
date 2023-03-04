import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
// import vuePlugin from 'rollup-plugin-vue'
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        dedupe: ['vue'],
        alias: [
            {
                find: '@antv/x6',
                replacement: '@antv/x6/lib',
            },
            {
                find: '@antv/x6-vue-shape',
                replacement: '@antv/x6-vue-shape/lib',
            },
        ]
    },
    // server: {host: 'localhost', port: 5172}
    server: {open: true, host: '0.0.0.0', port: 6789}

})

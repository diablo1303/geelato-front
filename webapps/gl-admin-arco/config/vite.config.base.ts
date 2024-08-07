import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import svgLoader from 'vite-svg-loader';
export default defineConfig({
  plugins: [vue({isProduction:false}), vueJsx(), svgLoader({ svgoConfig: {} }) as Plugin],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, '../src'),
      },
      {
        find: 'assets',
        replacement: resolve(__dirname, '../src/assets'),
      },
      {
        find: 'vue-i18n',
        replacement: 'vue-i18n/dist/vue-i18n.cjs.js', // Resolve the i18n warning issue
      },
      {
        find: 'vue',
        replacement: 'vue/dist/vue.esm-bundler.js', // compile template
      },
    ],
    extensions: ['.ts', '.js'],
  },
  define: {
    'process.env': {},
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          hack: `true; @import (reference) "${resolve(
            'src/assets/style/breakpoint.less'
          )}";`,
        },
        javascriptEnabled: true,
      },
    },
  },
  build: {
    rollupOptions: {
      // 配置多入口
      input: {
        index: resolve(__dirname, '../index.html'),
        ide: resolve(__dirname, '../ide.html'),
        idePagePreview: resolve(__dirname, '../idePagePreview.html'),
        appSettings: resolve(__dirname, '../appSettings.html'),
        appVersion: resolve(__dirname, '../appVersion.html')
      },
      // 确保外部化处理那些你不想打包进库的依赖
      external: [],
    },
  }
});

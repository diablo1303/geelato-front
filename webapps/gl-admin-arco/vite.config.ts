import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import viteCompression from 'vite-plugin-compression'
import  {resolve} from "path";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(),viteCompression()],
  resolve: {
    alias: {
      // @ts-ignore
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      // 配置多入口
      input: {
        index: path.resolve(__dirname, 'index.html'),
        ide: path.resolve(__dirname, 'ide.html'),
        idePagePreview: path.resolve(__dirname, 'idePagePreview.html'),
      },
      // 确保外部化处理那些你不想打包进库的依赖
      external: [],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          // vue: 'Vue',
        },
      },
    },
  }
})

// rollup默认入口
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import image from '@rollup/plugin-image'
import vue from 'rollup-plugin-vue'
// import esbuild from 'rollup-plugin-esbuild'
import {terser} from "rollup-plugin-terser" // 变丑别人看不懂（压缩后的）
import css from 'rollup-plugin-css-only' // 提取css
import CleanCSS from 'clean-css'   // 压缩css
import {writeFileSync} from 'fs' // 写文件

const production = process.env.NODE_ENV === 'production';

export default {
  input: 'src/main.ts',
  output: {
    sourcemap: true,
    file: 'dist/geelato-ide-next.js',
    // format: 'iife',
    // dir: 'dist',
    format: 'amd',
    // 插件，（js的丑化，即打包后，不容易阅读的压缩后的文件）； 如果去掉terser()，得到的js代码即为容易阅读的
    // plugins: [terser()]
  },
  plugins: [
    commonjs(),
    json(),
    image(),
    typescript(),
    css({
      output(style) {
        // 压缩 css 写入 dist/base-ui.css
        writeFileSync('dist/geelato-ide-next.css', new CleanCSS().minify(style).styles)
      }
    }),
    vue({
      // css: false 将<style>块转换为导入语句，rollup-plugin-css-only可以提取.vue文件中的样式
      css: false,
      normalizer: '~rollup-plugin-vue/runtime/normalize',
      // styleInjector : '~rollup-plugin-vue/runtime/browser',
    }),
    monaco({
      languages: ['json'],
    }),
    resolve(),
    production && terser()
  ],
  external: ['vue']
}

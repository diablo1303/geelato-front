/**
 *  每个组件单独打包
 */
// const {fileURLToPath}  = require('node:url')
const vue = require('@vitejs/plugin-vue')
const vueJsx = require('@vitejs/plugin-vue-jsx')
const viteCompression = require('vite-plugin-compression')
const { resolve } = require('path')
const fs = require('fs')
const path = require('path')
const { build, mergeConfig } = require('vite')
const { defineConfig } = require('vitest/config')
const standaloneDir = 'src/components-standalone'
// console.log('__dirname',__dirname)
const componentsDir = path.resolve(__dirname, standaloneDir)

const viteConfig = defineConfig({
  plugins: [vue(), vueJsx(), viteCompression()],
  // resolve: {
  //   alias: {
  //     // '@': fileURLToPath(new URL('./src', import.meta.url))
  //     '@': fileURLToPath('./src')
  //   }
  // },
  build: {
    // lib用下述动态构建的
    // lib: {
    //   // Could also be a dictionary or array of multiple entry points
    //   entry: resolve(__dirname, 'src/index.ts'),
    //   name: 'gl-ui-arco-admin',
    //   // the proper extensions will be added
    //   fileName: 'gl-ui-arco-admin',
    // },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: [
        'vue',
        'pinia',
        '@arco-design/web-vue',
        'lodash',
        'b-validate',
        'sortablejs',
        'vue-i18n',
        'vue-router',
        '@ctrl/tinycolor',
        '@geelato/gl-ui',
        '@geelato/gl-ui-schema',
        '@geelato/gl-ui-schema-arco'
      ],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})

fs.readdir(componentsDir, async (err, components) => {
  if (err) throw err
  for (const component of components) {
    const componentDir = path.resolve(__dirname, `${standaloneDir}/${component}`)
    // console.log('component',componentDir)
    const componentPath = path.join(componentsDir, component)
    if (fs.statSync(componentPath).isDirectory()) {
      console.log(`Building ${component}...`)

      try {
        const viteCfg = {
          configFile: false,
          root: componentPath,
          build: {
            lib: {
              name: `my-component-${component}`,
              entry: 'index.ts',
              fileName: (format) => `${component}.${format}.js`
            },
            outDir: `../../../dist/${component}`
          }
        }
        const mergedConfig = mergeConfig(viteConfig, defineConfig(viteCfg))
        await build(mergedConfig)
        console.log(`${component} built successfully.`)
      } catch (error) {
        console.error(`Failed to build ${component}:`, error)
      }
    }
  }
})

import type { App, Plugin } from 'vue'
import { blocksHandler } from './components/setters/action-setters/blocks/BlockHandler'
// 这里需引入importBlocks
import * as blocks from './components/setters/action-setters/blocks/importBlocks'

const component: Plugin = {
  install: function (app: App) {
    // 注册组件
    Object.keys(blocksHandler.blockComponents).forEach((componentName) => {
      // console.log('注册block', componentName, blocksHandler.blockComponents[componentName])
      app.component(componentName, blocksHandler.blockComponents[componentName])
    })
  }
}

export { blocks }

// 默认导出组件
export default component

import type { App, Plugin } from 'vue'
import GlPage from './components/gl-page/GlPage.vue'
import GlEntityTablePlus from './components/gl-entity-table-plus/index.vue'
import GlEntityTree from './components/gl-entity-tree/GlEntityTree.vue'
import GlEntityForm from './components/gl-entity-form/GlEntityForm.vue'
import GlRowColLayout from './components/gl-row-col-layout/GlRowColLayout.vue'
import GlCard from './components/gl-card/index.vue'
import GlHiddenArea from './components/gl-hidden-area/GlHiddenArea.vue'
import GlTabs from './components/gl-tabs/GlTabs.vue'
import GlDynamicSelect from './components/gl-dynamic-select/GlDynamicSelect.vue'
import GlUserSelect from './components/gl-user-select/GlUserSelect.vue'
import GlDict from './components/gl-dict/GlDict.vue'
import en from './locale/en-US'
import cn from './locale/zh-CN'
import { PluginUtil } from '@geelato/gl-ui'
import './assets/style.css'
import GlColor from './components/gl-color/GlColor.vue'
import GlEncode from './components/gl-encode/GlEncode.vue'
import GlInstRuntime from './components/gl-inst-runtime/GlInstRuntime.vue'
import GlInstsRuntime from './components/gl-inst-runtime/GlInstsRuntime.vue'
import GlRefPage from './components/gl-ref-page/GlRefPage.vue'
import GlIconfontSelect from './components/gl-iconfont-select/GlIconfontSelect.vue'
import GlText from './components/gl-text/GlText.vue'
import GlAlert from './components/gl-alert/GlAlert.vue'
import GlMultiComponents from './components/gl-multi-components/GlMultiComponents.vue'
import GlUpload from './components/gl-upload/GlUpload.vue'
import GlImage from './components/gl-image/GlImage.vue'
import GlButton from './components/gl-button/GlButton.vue'
import GlEntityCascader from './components/gl-entity-cascader/GlEntityCascader.vue'
import GlTimeline from './components/gl-timeline/GlTimeline.vue'
import GlOpRecord from './components/gl-op-record/GlOpRecord.vue'
import { getFormParams } from './components/gl-entity-form/GlEntityForm'
import { getLabel } from './components/MetaHelper'
import GlEmpty from './components/gl-empty/GlEmpty.vue'
import GlSelect from './components/gl-select/GlSelect.vue'
import GlImport from './components/gl-import/GlImport.vue'
import GlLayoutPage from "./components/gl-layout-page/GlLayoutPage.vue";
import GlLayoutSite from './components/gl-layout-site/GlLayoutSite.vue'
import { Drawer, Modal,RangePicker } from '@arco-design/web-vue'
import GlBlocks from "./components/gl-blocks/GlBlocks.vue";

const i18nMessage = { en, cn }

const component: Plugin = {
  install: function (app: App) {
    // @ts-ignore
    if (PluginUtil.markInstalledPlugin(app, 'gl-ui-arco')) {
      return
    }
    app.component(GlSelect.name, GlSelect)
    app.component(GlEmpty.name, GlEmpty)
    app.component(GlOpRecord.name, GlOpRecord)
    app.component(GlTimeline.name, GlTimeline)
    app.component(GlButton.name, GlButton)
    app.component(GlAlert.name, GlAlert)
    app.component(GlText.name, GlText)
    app.component(GlIconfontSelect.name, GlIconfontSelect)
    app.component(GlDict.name, GlDict)
    app.component(GlPage.name, GlPage)
    app.component(GlLayoutSite.name,GlLayoutSite)
    app.component(GlLayoutPage.name,GlLayoutPage)
    app.component('GlEntityTablePlus', GlEntityTablePlus)
    app.component(GlBlocks.name,GlBlocks)
    // 表格注册多一个，作为子表单，在配置时减少一些不必要的配置项
    app.component('GlEntityTableSub', GlEntityTablePlus)
    app.component(GlRefPage.name, GlRefPage)
    app.component(GlEntityTree.name, GlEntityTree)
    app.component(GlEntityForm.name, GlEntityForm)
    app.component(GlEntityCascader.name, GlEntityCascader)
    app.component(GlCard.name, GlCard)
    app.component(GlHiddenArea.name, GlHiddenArea)
    app.component(GlRowColLayout.name, GlRowColLayout)
    app.component(GlTabs.name, GlTabs)
    app.component(GlUserSelect.name, GlUserSelect)
    app.component(GlDynamicSelect.name, GlDynamicSelect)
    app.component(GlColor.name, GlColor)
    app.component(GlEncode.name, GlEncode)
    app.component(GlInstRuntime.name, GlInstRuntime)
    app.component(GlInstsRuntime.name, GlInstsRuntime)
    app.component(GlMultiComponents.name, GlMultiComponents)
    app.component(GlUpload.name, GlUpload)
    app.component(GlImage.name, GlImage)
    app.component(GlImport.name, GlImport)

    app.component('GlRangePicker', RangePicker)
    app.component('GlModal', Modal)
    app.component('GlDrawer', Drawer)
    // const i18n = createI18n({
    //   locale: localStorage.getItem("arco-locale") || "zh-CN",
    //   fallbackLocale: "en-US",
    //   allowComposition: true,
    //   messages: {
    //     "en-US": en,
    //     "zh-CN": cn,
    //   },
    // });
    // app.use(i18n);
  }
}

export { i18nMessage, getFormParams, getLabel }
// 默认导出组件
export default component

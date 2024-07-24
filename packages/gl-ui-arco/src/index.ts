import type {App} from 'vue'
import GlInputPassword from './components/gl-input/GlInputPassword.vue'
import GlInputSearch from './components/gl-input/GlInputSearch.vue'
import GlPage from './components/gl-page/GlPage.vue'
import GlPageTemplateFlow from './components/gl-page-template/GlPageTemplateFlow.vue'
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
import {getFormParams} from './components/gl-entity-form/GlEntityForm'
import {getLabel} from './components/MetaHelper'
import GlEmpty from './components/gl-empty/GlEmpty.vue'
import GlSelect from './components/gl-select/GlSelect.vue'
import GlImport from './components/gl-import/GlImport.vue'
import GlLayoutPage from './components/gl-layout-page/GlLayoutPage.vue'
import GlLayoutSite from './components/gl-layout-site/GlLayoutSite.vue'
import GlBlocks from './components/gl-blocks/GlBlocks.vue'
import GlList from './components/gl-list/GlList.vue'
import GlTinymce from './components/gl-tinymce/GlTinymce.vue'
import GlPageHelp from './components/gl-page-help/GlPageHelp.vue'
import GlPagination from './components/gl-pagination/GlPagination.vue'
import GlSpace from './components/gl-space/GlSpace.vue'
import GlSlot from './components/gl-slot/GlSlot.vue'
import GlOrgSelect from './components/gl-org-select/index.vue'
import GlOrgSelectTree from './components/gl-org-select/tree.vue'
import GlOrgUserSelect from './components/gl-org-user-select/index.vue'
import GlPageTemplateStateWF from './components/gl-page-template/state-wf/GlPageTemplateStateWF.vue'
import GlDescriptions from "./components/gl-descriptions/GlDescriptions.vue";
import type {ExcelCellMeta,} from './components/gl-entity-table-plus/constants'
import {
  ExcelCellValueComputeMode,
  ExcelCellValueComputeModeOptions,
  ExcelCellValueType,
  ExcelCellValueTypeOptions
} from './components/gl-entity-table-plus/constants'
import en from './locale/en-US'
import cn from './locale/zh-CN'
import {Drawer, Modal, RangePicker} from '@arco-design/web-vue'
import {type GeelatoPlugin, type GeelatoPluginOptions, PluginUtil} from '@geelato/gl-ui'
import {NO_BIND_FLAG} from './types/global'
import './assets/style.css'
import * as selectOptions from './api/SelectOptions'

const i18nMessage = {en, cn}

const component: GeelatoPlugin = {
  install: function (Vue: App) {
    // @ts-ignore
    if (PluginUtil.markInstalledPlugin(Vue, 'gl-ui-arco')) {
      return
    }
    Vue.component(GlInputPassword.name, GlInputPassword)
    Vue.component(GlInputSearch.name, GlInputSearch)
    Vue.component(GlSelect.name, GlSelect)
    Vue.component(GlEmpty.name, GlEmpty)
    Vue.component(GlOpRecord.name, GlOpRecord)
    Vue.component(GlTimeline.name, GlTimeline)
    Vue.component(GlButton.name, GlButton)
    Vue.component(GlAlert.name, GlAlert)
    Vue.component(GlText.name, GlText)
    Vue.component(GlIconfontSelect.name, GlIconfontSelect)
    Vue.component(GlDict.name, GlDict)
    Vue.component(GlPage.name, GlPage)
    Vue.component(GlPageTemplateFlow.name, GlPageTemplateFlow)
    Vue.component(GlLayoutSite.name, GlLayoutSite)
    Vue.component(GlLayoutPage.name, GlLayoutPage)
    Vue.component('GlEntityTablePlus', GlEntityTablePlus)
    Vue.component(GlBlocks.name, GlBlocks)
    Vue.component(GlList.name, GlList)
    Vue.component(GlTinymce.name, GlTinymce)
    // 表格注册多一个，作为子表单，在配置时减少一些不必要的配置项
    Vue.component('GlEntityTableSub', GlEntityTablePlus)
    Vue.component(GlRefPage.name, GlRefPage)
    Vue.component(GlEntityTree.name, GlEntityTree)
    Vue.component(GlEntityForm.name, GlEntityForm)
    Vue.component(GlEntityCascader.name, GlEntityCascader)
    Vue.component(GlCard.name, GlCard)
    Vue.component(GlHiddenArea.name, GlHiddenArea)
    Vue.component(GlRowColLayout.name, GlRowColLayout)
    Vue.component(GlTabs.name, GlTabs)
    Vue.component(GlUserSelect.name, GlUserSelect)
    Vue.component(GlDynamicSelect.name, GlDynamicSelect)
    Vue.component(GlColor.name, GlColor)
    Vue.component(GlEncode.name, GlEncode)
    Vue.component(GlInstRuntime.name, GlInstRuntime)
    Vue.component(GlInstsRuntime.name, GlInstsRuntime)
    Vue.component(GlMultiComponents.name, GlMultiComponents)
    Vue.component(GlUpload.name, GlUpload)
    Vue.component(GlImage.name, GlImage)
    Vue.component(GlImport.name, GlImport)
    Vue.component(GlPageHelp.name, GlPageHelp)
    Vue.component(GlPagination.name, GlPagination)
    Vue.component(GlSpace.name, GlSpace)
    Vue.component(GlSlot.name, GlSlot)
    Vue.component(GlOrgSelect.name, GlOrgSelect)
    Vue.component(GlOrgSelectTree.name, GlOrgSelectTree)
    Vue.component(GlOrgUserSelect.name, GlOrgUserSelect)
    Vue.component(GlPageTemplateStateWF.name, GlPageTemplateStateWF)
    Vue.component(GlDescriptions.name, GlDescriptions)
    Vue.component('GlRangePicker', RangePicker)
    Vue.component('GlModal', Modal)
    Vue.component('GlDrawer', Drawer)
    // const i18n = createI18n({
    //   locale: localStorage.getItem("arco-locale") || "zh-CN",
    //   fallbackLocale: "en-US",
    //   allowComposition: true,
    //   messages: {
    //     "en-US": en,
    //     "zh-CN": cn,
    //   },
    // });
    // Vue.use(i18n);
  },
  setupGeelato: function (options?: GeelatoPluginOptions) {
  }
}

export {
  i18nMessage,
  getFormParams,
  getLabel,
  ExcelCellMeta,
  ExcelCellValueType,
  ExcelCellValueComputeMode,
  ExcelCellValueTypeOptions,
  ExcelCellValueComputeModeOptions,
  NO_BIND_FLAG,
  selectOptions
}
// 默认导出组件
export default component

<template>
  <div class="gl-component-setter" v-if="componentModel">
    <!-- 这里需加上 :destroy-on-hide="true"，默认值为false，否则在页面切换时，各个页面重复更新渲染，性能很差-->
    <a-tabs size="small" :active-key="mv" @tabClick="onTabClick" :destroy-on-hide="true">
      <a-tab-pane key="props" tab="属性" title="属性">
        <div v-if="!hideToolbar&&(showMove||showMove||showSelectParent||showDelete)" style="padding: 0 0.5em 0.5em;">
          <a-button-group type="primary" size="mini" shape="round">
<!--            <a-button status="normal" v-if="showSelectParent" @click="componentStore.selectParentComponent">选父组件-->
<!--            </a-button>-->
            <a-button status="normal" v-if="showSelectParent" @click="componentStore.copyCurrentSelectedComponent">复制
            </a-button>
            <a-button status="warning" :disabled="!showMove" @click="componentStore.moveFrontCurrentComponent"
                      title="移前呀移上">移前
            </a-button>
            <a-button status="warning" :disabled="!showMove" @click="componentStore.moveBackCurrentComponent"
                      title="移后或移下">移后
            </a-button>
            <a-button status="warning" :disabled="!showMoveToParent" @click="componentStore.moveToParent"
                      title="移后或移下">
              移上一层
            </a-button>
          </a-button-group>
          <a-button style="float: right" type="primary" size="mini" shape="round" status="danger" v-if="showDelete"
                    @click="deleteCurrentSelectedComponentInst">删除
          </a-button>
        </div>
        <div class="gl-table">
          <div class="gl-table-row">
            <div class="gl-table-cell gl-label" style="width: 7em;">当前组件</div>
            <div class="gl-table-cell">
              <span
                  style="font-size: 12px;line-height: 3em"
                  :title="componentStore.currentSelectedComponentMeta?.componentName">{{
                  componentStore.currentSelectedComponentMeta?.title + ' ' + componentStore.currentSelectedComponentMeta?.componentName
                }}</span>
              <a-button size="mini" style="float: right;padding: 0 4px;margin: 1px" type="text"
                        @click="()=>{ClipboardJS.copy(componentStore.currentSelectedComponentMeta?.componentName)}">复制
              </a-button>
            </div>
          </div>
        </div>
        <div class="gl-table" style="margin: 0 0 2px 0;border-bottom: 2px solid #04559f">
          <div class="gl-table-row">
            <div class="gl-table-cell gl-label" style="width: 7em;">唯一标识</div>
            <div class="gl-table-cell">
              <span style="font-size: 12px;line-height: 3em">{{ componentModel.id }}</span>
              <a-button size="mini" style="float: right;padding: 0 4px;margin: 1px" type="text"
                        @click="()=>{ClipboardJS.copy(componentModel.id)}">复制
              </a-button>
            </div>
          </div>
        </div>
        <GlComponentPropertiesSetter :componentMeta="componentMeta" :componentInstance="componentModel"
                                     @change:propertyValue="onChangePropertyValue"/>
      </a-tab-pane>

      <a-tab-pane key="actions" tab="动作" title="动作">
        <GlComponentActionsSetter :componentMeta="componentMeta" :componentInstance="componentInstance"
                                  @update="(val:any)=>{setInstance(val,'actions')}"/>
      </a-tab-pane>
      <!--      <a-tab-pane key="3" tab="样式" title="样式" force-render>-->
      <!--        <GlComponentStyleSetter :componentMeta="componentMeta" :componentInstance="componentInstance"-->
      <!--                                @update="(val:any)=>{setInstance(val,'style')}"/>-->
      <!--      </a-tab-pane>-->
      <a-tab-pane key="permission" tab="权限" title="权限">
        <GlPermissionsSetter></GlPermissionsSetter>
      </a-tab-pane>
      <a-tab-pane key="lang" tab="多语言" title="多语言">
        <div style="margin: 0 0 0.5em 0.5em">
          <GlIconfont type="gl-earth"></GlIconfont>
          <span style="margin-left: 0.5em">
            设置该组件的中文-英文对照
          </span>
        </div>
        <GlComponentI18nSetter :componentMeta="componentMeta"
                               :componentInstance="componentModel"></GlComponentI18nSetter>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script lang="ts" setup>
import {computed, type PropType, provide, ref} from "vue";
import {ComponentInstance, type ComponentMeta} from "@geelato/gl-ui-schema";
import ClipboardJS from "clipboard";
import {ComponentSetterProvideKey, ComponentSetterProvideProxy} from "@geelato/gl-ide";
import {componentStoreFactory, usePageStore} from "@geelato/gl-ide";
import {jsScriptExecutor, PageProvideKey, utils} from "@geelato/gl-ui";
import GlPermissionsSetter from "./GlPermissionsSetter.vue";
const emits = defineEmits(['update']);
const props = defineProps({
  componentMeta: {
    type: Object as PropType<ComponentMeta>,
    required: true
  },
  componentInstance: {
    type: Object as PropType<ComponentInstance>,
    // TODO 解决componentModel.id error TS2532: Object is possibly 'undefined'.
    // 引入默认值，后续需再确认是否保留
    default() {
      return new ComponentInstance()
    }
  },
  /**
   *  默认Tabs选中项，从1开始
   */
  defaultActiveKey: {
    type: String,
    default() {
      return "props"
    }
  },
  /**
   *  是否显示组件属性设置面板的工作条
   */
  hideToolbar: Boolean
})

const mv = ref(props.defaultActiveKey)

const pageStore = usePageStore()
const componentStore = componentStoreFactory.useComponentStore('useComponentStore')
const pageProvideProxy = jsScriptExecutor.getPageProxy(pageStore.getCurrentPageInstId() || '')
// console.log('GlComponentSetter props:', props)
provide(PageProvideKey, pageProvideProxy)

// console.log('GlComponentSetter > init > componentName:', props.componentInstance?.componentName, ',componentId:', props.componentInstance?.id)
const componentSetterProvideProxy = new ComponentSetterProvideProxy()
provide(ComponentSetterProvideKey, componentSetterProvideProxy)

// 组件实例值
if (props.componentMeta.vModelName) {
  props.componentInstance.vModelName = props.componentMeta.vModelName
}
const componentModel = ref(props.componentInstance)
// 确保都有id
componentModel.value.id = componentModel.value.id ? componentModel.value.id : utils.gid('', 20)

const setInstance = (instance: ComponentInstance, form: String) => {
  // console.log('GlComponentSetter > set instance:', instance, 'form', form)
}

const showMoveToParent = computed(() => {
  return componentStore.currentSelectedComponentMeta?.componentName !== 'GlVirtual'
})

const showMove = computed(() => {
  return componentStore.currentSelectedComponentMeta?.componentName !== 'GlPage'
})

const showSelectParent = computed(() => {
  return componentStore.currentSelectedComponentMeta?.componentName !== 'GlPage'
})

const showDelete = computed(() => {
  return componentStore.currentSelectedComponentMeta?.componentName !== 'GlPage'
})

const onTabClick = (key: any) => {
  mv.value = key
}

const deleteCurrentSelectedComponentInst = () => {
  const inst = componentStore.deleteCurrentSelectedComponentInst()
  if (inst) {
    pageStore.operationLog('删组件', pageStore.currentPage.sourceContent, inst)
  }
}
/**
 * 修改属性时触发
 * @param param
 */
const onChangePropertyValue = (param: { type: string, name: string, value: any }) => {
  pageStore.operationLog('改属性', pageStore.currentPage.sourceContent, componentStore.currentSelectedComponentInstance)
}


</script>

<style scoped>
</style>

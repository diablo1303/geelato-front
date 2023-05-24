<template>
  <div class="gl-component-setter" v-if="componentModel">
    <a-tabs size="small" v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="属性" title="属性">
        <div style="border-bottom: 1px solid #F2F2F2;padding: 0 0.5em 0.5em;">
          <span style="font-weight: 600">[{{ componentStore.currentSelectedComponentMeta?.title }}]</span>
          <a-button-group style="float: right" type="primary" size="mini" shape="round">
            <a-button status="primary" @click="componentStore.selectParentComponent">上一层</a-button>
            <a-button status="danger" @click="componentStore.deleteCurrentSelectedComponentInst">删除</a-button>
          </a-button-group>
        </div>
        <div class="gl-table" style="margin: 0 0 2px 0;border-bottom: 2px solid #04559f">
          <div class="gl-table-row">
            <div class="gl-table-cell gl-label" style="width: 7em;">唯一标识</div>
            <div class="gl-table-cell">
              <span style="font-size: 12px">{{ componentModel.id }}</span>
              <a-button size="mini" style="float: right;padding: 0 4px;margin: 1px" type="text"
                        @click="()=>{ClipboardJS.copy(componentModel.id)}">复制
              </a-button>
            </div>
          </div>
        </div>
        <GlComponentPropertiesSetter :componentMeta="componentMeta" :componentInstance="componentModel"/>
      </a-tab-pane>
      <!--      <a-tab-pane key="2" tab="样式" title="样式" force-render>-->
      <!--        <GlComponentStyleSetter :componentMeta="componentMeta" :componentInstance="componentInstance"-->
      <!--                                @update="(val:any)=>{setInstance(val,'style')}"/>-->
      <!--      </a-tab-pane>-->
      <a-tab-pane key="3" tab="动作" title="动作">
        <GlComponentActionsSetter :componentMeta="componentMeta" :componentInstance="componentInstance"
                                  @update="(val:any)=>{setInstance(val,'actions')}"/>
      </a-tab-pane>
      <a-tab-pane key="4" tab="权限" title="权限">
        <a-alert>Coming Soon...</a-alert>
      </a-tab-pane>
      <a-tab-pane key="5" tab="多语言" title="多语言">
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
import {onUnmounted, PropType, provide, ref} from "vue";
import {EntityMeta, utils} from "@geelato/gl-ui";
import {ComponentInstance, ComponentMeta} from "@geelato/gl-ui-schema";
import ClipboardJS from "clipboard";
import ComponentSetterProvideProxy, {ComponentSetterProvideKey} from "./ComponentSetterProvideProxy";
import GlPropertySetterToolbar from './GlPropertySetterToolbar.vue'
import {componentStoreFactory} from "@geelato/gl-ide";

const emits = defineEmits(['update']);
const props = defineProps({
  componentMeta: {
    type: Object as PropType<ComponentMeta>,
    required: true
  },
  componentInstance: {
    type: Object as PropType<ComponentInstance>
  }
})
const componentStore = componentStoreFactory.useComponentStore('useComponentStore')

console.log('GlComponentSetter > init ...', props.componentInstance?.componentName, props.componentInstance?.id)
const componentSetterProvideProxy = new ComponentSetterProvideProxy()
const entityMeta = new EntityMeta()
const ds = ref({entityMeta})
componentSetterProvideProxy.setEntityDsRef(ds)
provide(ComponentSetterProvideKey, componentSetterProvideProxy)
provide('$entityDS', ds)


// 组件实例值
const componentModel = ref(props.componentInstance)
const activeKey = ref("1")
const setInstance = (instance: ComponentInstance, form: String) => {
  console.log('GlComponentSetter > set instance:', instance, 'form', form)
}
onUnmounted(() => {
  console.log('GlComponentSetter > onUnmounted ...', props.componentInstance?.componentName, props.componentInstance?.id)
})
</script>

<style scoped>
</style>

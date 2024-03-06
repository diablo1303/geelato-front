<template>
  <div class="gl-designer-setter">
    <GlComponentSetter
      v-if="componentStore.currentSelectedComponentMeta"
      :componentMeta="componentStore.currentSelectedComponentMeta"
      :componentInstance="componentStore.currentSelectedComponentInstance"
      @update="(instance:any)=>{updateInstance(instance)}"
      :key="componentStore.currentSelectedComponentId"
      :defaultActiveKey="defaultActiveKey"
      :panelNames="panelNames"
    ></GlComponentSetter>
    <template v-else>
      <div
        style="
          text-align: center;
          line-height: 3;
          height: 3em;
          background-color: #e7e7e7;
          margin: 12px 12px 0px;
        "
      >
        请先选择组件
      </div>
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: 'GlIdeSetter'
}
</script>
<script setup lang="ts">
import { type Ref, onUnmounted, ref, watch } from 'vue'
import { useThemeStore } from '../stores/UseThemeStore'
import { useComponentStore } from '../stores/UseComponentStore'
import { useIdeStore } from '../stores/UseIdeStore'
import { usePageStore } from '../stores/UsePageStore'
import { emitter } from '@geelato/gl-ui'
import EventNames from '../entity/EventNames'

const emits = defineEmits(['update'])
const ideStore = useIdeStore()
const pageStore = usePageStore()
const componentStore = useComponentStore()
const themeStore = useThemeStore()
const btnStyle = { background: themeStore.theme.background }
const componentMeta = {}
const componentInstance = {}
const panelNames: Ref<string[]> = ref([])
const updateInstance = (instance: any) => {
  // console.log('updateInstance:', instance)
  emitter.emit(EventNames.GlIdeSetterUpdateComponentInstance, instance)
  // ideStore.updateInstanceKey = false
  emits('update', instance)
}

const defaultActiveKey = ref(undefined)
const switchPanel = (args: any) => {
  defaultActiveKey.value = args.key
  // console.log('switchPanel:', args)
}
emitter.on(EventNames.GlIdeSetterPanelSwitch, switchPanel)
onUnmounted(() => {
  // console.log('GlComponentSetter > onUnmounted ...', props.componentInstance?.componentName, props.componentInstance?.id)
  emitter.off(EventNames.GlIdeSetterPanelSwitch, switchPanel)
})

watch(
  () => {
    return componentStore.currentSelectedComponentId
  },
  () => {
    defaultActiveKey.value = undefined
    panelNames.value = ideStore.findSetterPanelNamesByPageType(
      pageStore.currentPage?.sourceContent?.props?.pageType
    )!
    if (!panelNames.value) {
      console.error(
        '通过props?.pageType获取不到需要展示的面板，请检查gl-ide-arco/src/plugin',
        pageStore.currentPage?.sourceContent
      )
    }
  }
)
</script>

<style>
/*.gl-designer-properties .ant-tabs-nav .ant-tabs-tab {*/
/*  margin: 0;*/
/*}*/
</style>

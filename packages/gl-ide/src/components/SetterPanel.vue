<template>
  <div class="gl-designer-setter">
    <GlComponentSetter v-if="componentStore.currentSelectedComponentMeta"
                       :componentMeta="componentStore.currentSelectedComponentMeta"
                       :componentInstance="componentStore.currentSelectedComponentInstance"
                       @update="(instance:any)=>{updateInstance(instance)}"></GlComponentSetter>
    <template v-else>
      <div style="text-align: center;line-height: 3;height: 3em;background-color: #e7e7e7;margin: 12px 12px 0px">
        请先选择组件
      </div>
    </template>
  </div>
</template>

<script lang="ts">
export default {
  name: "GlIdeSetter"
}
</script>
<script setup lang="ts">
import {useThemeStore} from "../stores/UseThemeStore";
import {useComponentStore} from "../stores/UseComponentStore";
import {useIdeStore} from "../stores/UseIdeStore";

const emits = defineEmits(['update'])
const ideStore = useIdeStore()
const componentStore = useComponentStore()
const themeStore = useThemeStore()
const btnStyle = {background: themeStore.theme.background}
const componentMeta = {}
const componentInstance = {}


const updateInstance = (instance: any) => {
  console.log('updateInstance:', instance)
  ideStore.stageRefreshFlag = false
  emits('update', instance)
}

</script>

<style>
/*.gl-designer-properties .ant-tabs-nav .ant-tabs-tab {*/
/*  margin: 0;*/
/*}*/
</style>

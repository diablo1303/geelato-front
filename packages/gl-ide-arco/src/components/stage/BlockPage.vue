<template>
  <div class="gl-ide-arco-stage-main" v-if="componentStore.currentComponentTree.length>0"
       :id="componentStore.currentComponentTree[0].id"
       style="padding-top: 2em">
    <gl-x :glComponentInst="componentStore.currentComponentTree[0]" :componentStoreId="componentStoreId"></gl-x>
    <gl-modal :visible="codeViewerVisible"
              title="生成的配置代码预览"
              :fullscreen="true"
              @ok="codeViewerVisible=false"
              @cancel="codeViewerVisible=false">
      <VueJsonPretty :data="componentStore.currentComponentTree[0]"></VueJsonPretty>
    </gl-modal>
  </div>
</template>
<script lang="ts">
export default {
  name: "GlIdeBlockPage"
}
</script>
<script setup lang="ts">
import {PropType, ref, watch} from 'vue'
import {componentStoreFactory} from "@geelato/gl-ide";
import type {ComponentInstance} from "@geelato/gl-ui-schema";
import {utils, useGlobal} from "@geelato/gl-ui";
import VueJsonPretty from "vue-json-pretty";

const emits = defineEmits(['update'])
const props = defineProps({
  glComponentInst: {
    type: Object as PropType<ComponentInstance>
  }
})

const global = useGlobal()
const componentStoreId = 'useComponentBlockStore'
const componentStore = componentStoreFactory.useComponentStore(componentStoreId)
const codeViewerVisible = ref(false)

/**
 *  初始的组件树
 */
let rootItem = props.glComponentInst
if (!rootItem || !rootItem.id) {
  rootItem = {
    componentName: 'GlBlockRoot',
    id: utils.gid('BR'),
    props: {},
    slots: {},
    children: [{
      componentName: 'GlDndPlaceholder',
      id: utils.gid('pHolder'),
      props: {},
      slots: {},
      children: [],
      actions: []
    }],
    actions: []
  }
}
componentStore.$reset()
componentStore.currentComponentTree.length = 0
componentStore.currentComponentTree.push(rootItem)
componentStore.setCurrentSelectedComponentById(rootItem.id)

watch(() => {
  return componentStore.currentComponentTree
}, () => {
  console.log('update mv:', componentStore.currentComponentTree[0])
  emits("update", componentStore.currentComponentTree[0])
}, {deep: true})
</script>

<style>
/*.gl-ide-arco-stage-main {*/
/*  padding: 10px 10px 2em 10px;*/
/*  overflow: hidden;*/
/*}*/
</style>

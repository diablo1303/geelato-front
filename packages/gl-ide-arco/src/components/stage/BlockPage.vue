<script lang="ts">
export default {
  name: "GlIdeBlockPage"
}
</script>
<script lang="ts" setup>
import GlIdeStageBasePage from "./BasePage.vue";
import {useGlobal, utils} from "@geelato/gl-ui";
import {PropType, watch} from "vue";
import {ComponentInstance} from "@geelato/gl-ui-schema";
import {componentStoreFactory} from "@geelato/gl-ide";


const emits = defineEmits(['update'])
const props = defineProps({
  glComponentInst: {
    type: Object as PropType<ComponentInstance>
  }
})

const global = useGlobal()
const componentStoreId = 'useComponentBlockStore'
const componentStore = componentStoreFactory.useComponentStore(componentStoreId)

/**
 *  初始的组件树
 */
let rootItem = props.glComponentInst
if (!rootItem || !rootItem.id) {
  rootItem = {
    componentName: 'GlPage',
    id: utils.gid('br'),
    props: {
      pageTitle: "指令",
      pageMargin: "0",
      pagePadding: "0"
    },
    slots: {},
    children: [{
      componentName: 'GlDndPlaceholder',
      id: utils.gid('pHolder'),
      props: {},
      slots: {},
      children: [],
      actions: [],
      style: {}
    }],
    actions: [],
    style: {}
  }
}
componentStore.$reset()
componentStore.currentComponentTree.length = 0
componentStore.currentComponentTree.push(rootItem)
componentStore.setCurrentSelectedComponentById(rootItem.id)

watch(() => {
  // 只需监控当前实体是否变化，来触发整个页面的更新事件
  return componentStore.currentSelectedComponentInstance
}, () => {
  console.log('update mv:', componentStore.currentComponentTree[0])
  emits("update", componentStore.currentComponentTree[0])
}, {deep: true})

</script>

<template>
  <GlIdeStageBasePage :key="utils.gid('p')" :componentStoreId="componentStoreId"
                      :enableToolbar="false"></GlIdeStageBasePage>
</template>
<style>
</style>
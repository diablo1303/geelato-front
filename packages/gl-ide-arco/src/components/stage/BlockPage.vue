<script lang="ts">
export default {
  name: "GlBlockPage"
}
</script>
<script lang="ts" setup>
import {type PropType, watch} from "vue";
import {utils} from "@geelato/gl-ui";
import type {ComponentInstance} from "@geelato/gl-ui-schema";
import {componentStoreFactory} from "@geelato/gl-ide";
import GlBasePage from "./BasePage.vue";


const emits = defineEmits(['update'])
const props = defineProps({
  glComponentInst: {
    type: Object as PropType<ComponentInstance>
  },
  componentStoreId: {
    type: String,
    default: 'useComponentBrowserBlockStore'
  }
})

const componentStore = componentStoreFactory.useComponentStore(props.componentStoreId)

/**
 *  初始的组件树
 */
let rootItem = props.glComponentInst
if (!rootItem || !rootItem.id) {
  rootItem = {
    componentName: 'GlPage',
    id: utils.gid('blockPage',),
    props: {
      pageType: 'blockPage',
      label: "指令",
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
  // console.log('update mv:', componentStore.currentComponentTree[0])
  emits("update", componentStore.currentComponentTree[0])
}, {deep: true})
const key = utils.gid('p')
</script>

<template>
  <GlBasePage :key="key" :componentStoreId="componentStoreId"
                      :enableToolbar="false"></GlBasePage>
</template>
<style>
</style>